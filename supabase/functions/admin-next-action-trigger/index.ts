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

const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID");

const TELEGRAM_ENABLED = Boolean(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID);

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
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    return { sent: false, reason: "missing_telegram_secrets" };
  }

  const response = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      }),
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Telegram send failed (${response.status}): ${errorBody}`);
  }

  return { sent: true };
};

const processAction = async (action: string, submission: SubmissionRecord) => {
  if (action === "hold" || action === "reject") {
    console.info("No external action configured for next_action", {
      action,
      submission_id: submission.id ?? null,
    });
    return { mode: "no_external_action", action };
  }

  const structuredPayload = buildStructuredPayload(action, submission);

  if (!TELEGRAM_ENABLED) {
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
  } catch {
    return Response.json({ ok: false, error: "invalid_json_payload" }, { status: 400 });
  }

  const eventType = payload.type?.toUpperCase();

  if (eventType !== "INSERT" && eventType !== "UPDATE") {
    return Response.json({ ok: true, skipped: "unsupported_event_type", eventType });
  }

  if (payload.schema !== "public" || payload.table !== "submissions") {
    return Response.json({ ok: true, skipped: "unsupported_target", target: { schema: payload.schema, table: payload.table } });
  }

  const record = payload.record;
  const oldRecord = payload.old_record;

  if (!record?.next_action) {
    return Response.json({ ok: true, skipped: "missing_next_action" });
  }

  const nextActionChanged = !oldRecord || record.next_action !== oldRecord.next_action;

  if (!nextActionChanged) {
    return Response.json({ ok: true, skipped: "next_action_unchanged" });
  }

  const allowedActions = new Set([
    "schedule_audition",
    "enroll_training",
    "request_more_content",
    "refer_to_emerge",
    "hold",
    "reject",
  ]);

  if (!allowedActions.has(record.next_action)) {
    return Response.json({
      ok: false,
      error: "unsupported_next_action",
      next_action: record.next_action,
    }, { status: 400 });
  }

  try {
    const result = await processAction(record.next_action, record);

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
