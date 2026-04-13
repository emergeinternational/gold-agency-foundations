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

const formatActionMessage = (action: string, submission: SubmissionRecord) => {
  const lines = [
    `📌 Submission next_action: ${action}`,
    `id: ${submission.id ?? "n/a"}`,
    `full_name: ${submission.full_name ?? "n/a"}`,
    `category: ${submission.category ?? "n/a"}`,
    `source: ${submission.source ?? "n/a"}`,
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
  },
});

const sendTelegramMessage = async (message: string) => {
  const telegramBotToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const telegramChatId = Deno.env.get("TELEGRAM_CHAT_ID");

  if (!telegramBotToken || !telegramChatId) {
    return { sent: false, reason: "missing_telegram_secrets" };
  }

  const response = await fetch(
    `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
      }),
    },
  );

  const responseBody = await response.text();
  console.info("Telegram API response", {
    status: response.status,
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

  const message = formatActionMessage(action, submission);
  await sendTelegramMessage(message);

  return {
    mode: "telegram_sent",
    action,
    payload: structuredPayload,
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

  const telegramEnabled = Boolean(Deno.env.get("TELEGRAM_BOT_TOKEN") && Deno.env.get("TELEGRAM_CHAT_ID"));
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
