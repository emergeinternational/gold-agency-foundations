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

// Internal action definitions for admin workflow consistency:
// schedule_audition -> candidate ready for immediate audition scheduling
// enroll_training -> candidate not ready but suitable for development
// request_more_content -> insufficient data, requires additional submission
// refer_to_emerge -> high-value candidate for escalation

const ACTIONABLE_ACTIONS = new Set<string>([
  "schedule_audition",
  "enroll_training",
  "request_more_content",
  "refer_to_emerge",
]);

const ALLOWED_ACTIONS = new Set<string>([...ACTIONABLE_ACTIONS, "hold", "reject"]);

const ACTION_HEADERS: Record<string, string> = {
  schedule_audition: "🎤 Audition Scheduling Required",
  enroll_training: "📚 Training Enrollment Required",
  request_more_content: "📎 More Content Needed",
  refer_to_emerge: "🚀 Referred for Emerge Review",
};

const CANDIDATE_MESSAGES: Record<string, string> = {
  schedule_audition:
    "Great news! You have been selected for an audition. Our team will contact you with scheduling details shortly.",
  enroll_training:
    "Great news! You have been selected for training. Our team will contact you with the next steps shortly.",
  request_more_content:
    "Thanks for your submission. Please send additional content so we can continue your review.",
  refer_to_emerge:
    "Congratulations! You have been selected for our premium Emerge consideration. Our team will contact you with next steps.",
};

const cleanString = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
};

const logDecision = (params: {
  decision_path: "actionable" | "skipped";
  record_id: string | null;
  next_action: string | null;
  emerge_ready: boolean | null;
  reason: string;
  extra?: Record<string, unknown>;
}) => {
  const { decision_path, record_id, next_action, emerge_ready, reason, extra } = params;

  console.info("submission next_action decision", {
    record_id,
    next_action,
    emerge_ready,
    decision_path,
    reason,
    ...(extra ?? {}),
  });
};

const withDefaultAction = (record: SubmissionRecord): SubmissionRecord => {
  const normalizedAction = cleanString(record.next_action);
  if (normalizedAction) {
    return {
      ...record,
      next_action: normalizedAction,
    };
  }

  const status = cleanString(record.status)?.toLowerCase() ?? "";
  const fallbackAction = status === "rejected" ? "reject" : "request_more_content";

  return {
    ...record,
    next_action: fallbackAction,
  };
};

const formatActionMessage = (action: string, submission: SubmissionRecord) => {
  const priority = submission.emerge_ready === true ? "HIGH" : "STANDARD";
  const header = ACTION_HEADERS[action] ?? "📌 Submission Action Required";

  return [
    header,
    "",
    `Priority: ${priority}`,
    "",
    `Name: ${submission.full_name ?? "n/a"}`,
    `Category: ${submission.category ?? "n/a"}`,
    `Source: ${submission.source ?? "n/a"}`,
    `Status: ${submission.status ?? "n/a"}`,
    `Level: ${submission.level ?? "n/a"}`,
    `Emerge Ready: ${submission.emerge_ready === true ? "YES" : "NO"}`,
    `Next Action: ${submission.next_action ?? "n/a"}`,
    `Email: ${submission.email ?? "n/a"}`,
    `Phone: ${submission.phone ?? "n/a"}`,
    `City: ${submission.city ?? "n/a"}`,
  ].join("\n");
};

const formatCandidateMessage = (action: string, submission: SubmissionRecord) => {
  const summary =
    CANDIDATE_MESSAGES[action] ??
    "Your submission has been updated. Our team will contact you with details.";
  const firstName = cleanString(submission.full_name)?.split(" ")[0] ?? null;

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
  const telegramBotToken = cleanString(Deno.env.get("TELEGRAM_BOT_TOKEN"));

  if (!telegramBotToken) {
    return { sent: false, reason: "missing_telegram_bot_token" as const };
  }

  const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
    }),
    signal: AbortSignal.timeout(3500),
  });

  const responseBody = await response.text();

  console.info("Telegram API response", {
    status: response.status,
    chat_id: chatId,
    body: responseBody,
  });

  if (!response.ok) {
    throw new Error(`Telegram send failed (${response.status}): ${responseBody}`);
  }

  return { sent: true as const };
};

const processAction = async (action: string, submission: SubmissionRecord, telegramEnabled: boolean) => {
  if (!ACTIONABLE_ACTIONS.has(action)) {
    console.info("No external action configured for next_action", {
      action,
      submission_id: submission.id ?? null,
    });

    return {
      mode: "no_external_action" as const,
      action,
    };
  }

  const structuredPayload = buildStructuredPayload(action, submission);

  if (!telegramEnabled) {
    console.info("Telegram credentials unavailable. Action payload logged.", {
      delivery: "log_only",
      ...structuredPayload,
    });

    return {
      mode: "log_only" as const,
      action,
      payload: structuredPayload,
      reason: "missing_telegram_bot_token",
    };
  }

  const internalChatId = cleanString(Deno.env.get("TELEGRAM_CHAT_ID"));

  if (!internalChatId) {
    console.info("TELEGRAM_CHAT_ID is missing. Action payload logged.", {
      delivery: "log_only",
      ...structuredPayload,
    });

    return {
      mode: "log_only" as const,
      action,
      payload: structuredPayload,
      reason: "missing_internal_chat_id",
    };
  }

  const internalMessage = formatActionMessage(action, submission);
  await sendTelegramMessage(internalChatId, internalMessage);

  const candidateMessage = formatCandidateMessage(action, submission);
  const candidateChatId = cleanString(submission.telegram_chat_id);
  const targetChatId = candidateChatId ?? internalChatId;
  const fallbackUsed = candidateChatId === null;

  if (fallbackUsed) {
    console.info("Candidate Telegram chat not linked. Using fallback TELEGRAM_CHAT_ID.", {
      submission_id: submission.id ?? null,
      fallback_chat_id: internalChatId,
    });
  }

  await sendTelegramMessage(targetChatId, candidateMessage);

  console.info("Candidate message sent", {
    submission_id: submission.id ?? null,
    action,
    target_chat_id: targetChatId,
    fallback_used: fallbackUsed,
  });

  return {
    mode: "telegram_sent" as const,
    action,
    payload: structuredPayload,
    candidate_delivery: {
      target_chat_id: targetChatId,
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
  const record = payload.record ? withDefaultAction(payload.record) : null;
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
    logDecision({
      decision_path: "skipped",
      record_id: record?.id ?? null,
      next_action: record?.next_action ?? null,
      emerge_ready: record?.emerge_ready ?? null,
      reason: "unsupported_event_type",
      extra: { eventType },
    });

    return Response.json({ ok: true, skipped: "unsupported_event_type", eventType });
  }

  if (payload.schema !== "public" || payload.table !== "submissions") {
    logDecision({
      decision_path: "skipped",
      record_id: record?.id ?? null,
      next_action: record?.next_action ?? null,
      emerge_ready: record?.emerge_ready ?? null,
      reason: "unsupported_target",
      extra: { schema: payload.schema, table: payload.table },
    });

    return Response.json({
      ok: true,
      skipped: "unsupported_target",
      target: { schema: payload.schema, table: payload.table },
    });
  }

  if (!record) {
    logDecision({
      decision_path: "skipped",
      record_id: null,
      next_action: null,
      emerge_ready: null,
      reason: "missing_record",
    });

    return Response.json({ ok: true, skipped: "missing_record" });
  }

  const nextAction = cleanString(record.next_action);
  const previousAction = cleanString(oldRecord?.next_action);
  const nextActionChanged = !oldRecord || nextAction !== previousAction;

  if (!nextActionChanged) {
    logDecision({
      decision_path: "skipped",
      record_id: record.id ?? null,
      next_action: nextAction,
      emerge_ready: record.emerge_ready ?? null,
      reason: "next_action_unchanged",
    });

    return Response.json({ ok: true, skipped: "next_action_unchanged" });
  }

  if (!nextAction || !ALLOWED_ACTIONS.has(nextAction)) {
    console.warn("Unsupported next_action received", {
      record_id: record.id ?? null,
      next_action: nextAction,
    });

    return Response.json(
      {
        ok: false,
        error: "unsupported_next_action",
        next_action: nextAction,
      },
      { status: 400 },
    );
  }

  const normalizedRecord: SubmissionRecord = {
    ...record,
    next_action: nextAction,
  };

  const telegramEnabled = Boolean(cleanString(Deno.env.get("TELEGRAM_BOT_TOKEN")));
  const isActionable = ACTIONABLE_ACTIONS.has(nextAction);

  logDecision({
    decision_path: isActionable ? "actionable" : "skipped",
    record_id: normalizedRecord.id ?? null,
    next_action: normalizedRecord.next_action ?? null,
    emerge_ready: normalizedRecord.emerge_ready ?? null,
    reason: isActionable ? "next_action_actionable" : "next_action_not_actionable",
    extra: {
      old_next_action: previousAction,
      telegram_secrets_present: telegramEnabled,
    },
  });

  try {
    const result = await processAction(nextAction, normalizedRecord, telegramEnabled);

    return Response.json({
      ok: true,
      event: eventType,
      result,
    });
  } catch (error) {
    console.error("Failed to process next_action", {
      error: error instanceof Error ? error.message : String(error),
      submission_id: normalizedRecord.id ?? null,
      next_action: normalizedRecord.next_action ?? null,
      emerge_ready: normalizedRecord.emerge_ready ?? null,
      decision_path: isActionable ? "actionable" : "skipped",
    });

    return Response.json({
      ok: true,
      warning: "action_processing_failed",
      record_id: normalizedRecord.id ?? null,
      next_action: normalizedRecord.next_action ?? null,
      emerge_ready: normalizedRecord.emerge_ready ?? null,
    });
  }
});
