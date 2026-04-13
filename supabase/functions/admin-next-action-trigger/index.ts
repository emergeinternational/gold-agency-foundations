import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type SubmissionRecord = {
  id?: string;
  full_name?: string | null;
  category?: string | null;
  source?: string | null;
  status?: string | null;
  level?: string | null;
  emerge_ready?: boolean | null;
  next_action?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  telegram_chat_id?: string | null;
};

type WebhookPayload = {
  type?: string;
  table?: string;
  schema?: string;
  record?: SubmissionRecord | null;
  old_record?: SubmissionRecord | null;
};

const ACTIONABLE_ACTIONS = new Set([
  "schedule_audition",
  "enroll_training",
  "request_more_content",
  "refer_to_emerge",
]);

const ALLOWED_ACTIONS = new Set([...ACTIONABLE_ACTIONS, "hold", "reject"]);

const ACTION_HEADERS: Record<string, string> = {
  schedule_audition: "🎤 Audition Scheduling Required",
  enroll_training: "📚 Training Enrollment Required",
  request_more_content: "📎 More Content Needed",
  refer_to_emerge: "🚀 Referred for Emerge Review",
};

const CANDIDATE_MESSAGES: Record<string, string> = {
  schedule_audition: "Great news! You have been selected for an audition. Our team will contact you with scheduling details shortly.",
  enroll_training: "Great news! You have been selected for training. Our team will contact you with the next steps shortly.",
  request_more_content: "Thanks for your submission. Please send additional content so we can continue your review.",
  refer_to_emerge: "Congratulations! You have been selected for our premium Emerge consideration. Our team will contact you with next steps.",
};

const formatActionMessage = (action: string, submission: SubmissionRecord) => {
  const priority = submission.emerge_ready === true ? "HIGH" : "STANDARD";
  const header = ACTION_HEADERS[action] ?? "📌 Submission Action Required";

  const lines = [
    header,
    "",
    `Priority: ${priority}`,
    "",
    `full_name: ${submission.full_name ?? "n/a"}`,
    `category: ${submission.category ?? "n/a"}`,
    `status: ${submission.status ?? "n/a"}`,
    `level: ${submission.level ?? "n/a"}`,
    `emerge_ready: ${String(submission.emerge_ready ?? "n/a")}`,
    `next_action: ${submission.next_action ?? "n/a"}`,
    `email: ${submission.email ?? "n/a"}`,
    `phone: ${submission.phone ?? "n/a"}`,
    `city: ${submission.city ?? "n/a"}`,
  ];

  return lines.join("\n");
};

const formatCandidateMessage = (action: string, submission: SubmissionRecord) => {
  const summary = CANDIDATE_MESSAGES[action] ?? "Your submission has been updated. Our team will contact you with details.";
  const firstName = submission.full_name?.split(" ")[0] ?? null;

  return [
    firstName ? `Hi ${firstName},` : "Hi,",
    "",
    summary,
    "",
    "— Gold Agency Team",
  ].join("\n");
};

const buildStructuredPayload = (action: string, submission: SubmissionRecord) => ({
  action,
  submission: {
    id: submission.id ?? null,
    full_name: submission.full_name ?? null,
    category: submission.category ?? null,
    source: submission.source ?? null,
    status: submission.status ?? null,
    level: submission.level ?? null,
    emerge_ready: submission.emerge_ready ?? null,
    next_action: submission.next_action ?? null,
    email: submission.email ?? null,
    phone: submission.phone ?? null,
    city: submission.city ?? null,
    telegram_chat_id: submission.telegram_chat_id ?? null,
  },
});

const sendTelegramMessage = async (chatId: string, message: string) => {
  const telegramBotToken = Deno.env.get("TELEGRAM_BOT_TOKEN");

  if (!telegramBotToken) {
    return { sent: false, reason: "missing_telegram_bot_token" };
  }

  const response = await fetch(
    `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    },
  );

  const responseBody = await response.text();
  console.info("Telegram API response", {
    status: response.status,
    chat_id: chatId,
    body: responseBody,
  });

  if (!response.ok) {
    throw new Error(`Telegram send failed (${response.status}): ${responseBody}`);
  }

  return { sent: true };
};

const processAction = async (action: string, submission: SubmissionRecord, telegramEnabled: boolean) => {
  if (!ACTIONABLE_ACTIONS.has(action)) {
    console.info("No external action configured for next_action", {
      action,
      submission_id: submission.id ?? null,
    });
    return { mode: "no_external_action", action };
  }

  const structuredPayload = buildStructuredPayload(action, submission);

  if (!telegramEnabled) {
    console.info("Telegram credentials unavailable. Action payload logged.", {
      delivery: "log_only",
      ...structuredPayload,
    });

    return {
      mode: "log_only",
      action,
      payload: structuredPayload,
    };
  }

  const internalChatId = Deno.env.get("TELEGRAM_CHAT_ID");

  if (!internalChatId) {
    console.info("TELEGRAM_CHAT_ID is missing. Action payload logged.", {
      delivery: "log_only",
      ...structuredPayload,
    });

    return {
      mode: "log_only",
      action,
      payload: structuredPayload,
      reason: "missing_internal_chat_id",
    };
  }

  const internalMessage = formatActionMessage(action, submission);
  await sendTelegramMessage(internalChatId, internalMessage);

  const candidateMessage = formatCandidateMessage(action, submission);
  const candidateChatId = submission.telegram_chat_id?.trim() || null;
  const candidateTargetChatId = candidateChatId ?? internalChatId;
  const fallbackUsed = candidateChatId === null;

  if (fallbackUsed) {
    console.info("Candidate Telegram chat not linked. Using fallback TELEGRAM_CHAT_ID.", {
      submission_id: submission.id ?? null,
      fallback_chat_id: internalChatId,
    });
  }

  await sendTelegramMessage(candidateTargetChatId, candidateMessage);

  console.info("Candidate message sent", {
    submission_id: submission.id ?? null,
    action,
    target_chat_id: candidateTargetChatId,
    fallback_used: fallbackUsed,
  });

  return {
    mode: "telegram_sent",
    action,
    payload: structuredPayload,
    candidate_delivery: {
      target_chat_id: candidateTargetChatId,
      fallback_used: fallbackUsed,
    },
  };
};

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let payload: WebhookPayload;

  try {
    payload = await req.json();
  } catch (parseError) {
    console.error("Invalid JSON payload", {
      error: parseError instanceof Error ? parseError.message : String(parseError),
    });
    return Response.json({ ok: false, error: "invalid_json_payload" }, { status: 400 });
  }

  const eventType = payload.type?.toUpperCase();
  const record = payload.record;
  const oldRecord = payload.old_record;

  console.info("Incoming next_action webhook payload summary", {
    eventType,
    schema: payload.schema,
    table: payload.table,
    record_id: record?.id ?? null,
    new_next_action: record?.next_action ?? null,
    old_next_action: oldRecord?.next_action ?? null,
  });

  if (eventType !== "INSERT" && eventType !== "UPDATE") {
    return Response.json({ ok: true, skipped: "unsupported_event_type", eventType });
  }

  if (payload.schema !== "public" || payload.table !== "submissions") {
    return Response.json({ ok: true, skipped: "unsupported_target", target: { schema: payload.schema, table: payload.table } });
  }

  if (!record) {
    return Response.json({ ok: true, skipped: "missing_record" });
  }

  if (!record.next_action) {
    return Response.json({ ok: true, skipped: "missing_next_action" });
  }

  const nextActionChanged = !oldRecord || record.next_action !== oldRecord.next_action;

  if (!nextActionChanged) {
    return Response.json({ ok: true, skipped: "next_action_unchanged" });
  }

  if (!ALLOWED_ACTIONS.has(record.next_action)) {
    return Response.json({
      ok: false,
      error: "unsupported_next_action",
      next_action: record.next_action,
    }, { status: 400 });
  }

  const telegramEnabled = Boolean(Deno.env.get("TELEGRAM_BOT_TOKEN"));
  const isActionable = ACTIONABLE_ACTIONS.has(record.next_action);

  console.info("next_action processing decision", {
    record_id: record.id ?? null,
    new_next_action: record.next_action,
    old_next_action: oldRecord?.next_action ?? null,
    actionable: isActionable,
    telegram_secrets_present: telegramEnabled,
  });

  try {
    const result = await processAction(record.next_action, record, telegramEnabled);

    return Response.json({
      ok: true,
      event: eventType,
      result,
    });
  } catch (error) {
    console.error("Failed to process next_action", {
      error: error instanceof Error ? error.message : String(error),
      submission_id: record.id ?? null,
      next_action: record.next_action,
    });

    return Response.json({ ok: false, error: "action_processing_failed" }, { status: 500 });
  }
});
