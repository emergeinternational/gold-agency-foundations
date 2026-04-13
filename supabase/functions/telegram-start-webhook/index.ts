import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type TelegramUpdate = {
  update_id?: number;
  message?: {
    text?: string;
    chat?: {
      id?: number;
    };
  };
};

const SUBMISSION_ID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const parseStartSubmissionId = (text: string): string | null => {
  const trimmed = text.trim();
  const prefixed = trimmed.match(/^\/start(?:\s+|_)?([^\s]+)?$/i);
  const payload = prefixed?.[1]?.trim() ?? null;

  if (!payload) {
    return null;
  }

  const decodedPayload = (() => {
    try {
      return decodeURIComponent(payload);
    } catch {
      return payload;
    }
  })();

  const cleanedPayload = decodedPayload.replace(/^submission[:=]/i, "").trim();

  if (!SUBMISSION_ID_REGEX.test(cleanedPayload)) {
    return null;
  }

  return cleanedPayload;
};

const sendTelegramMessage = async (chatId: string, message: string) => {
  const telegramBotToken = Deno.env.get("TELEGRAM_BOT_TOKEN");

  if (!telegramBotToken) {
    return;
  }

  await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
    }),
  });
};

const fetchSubmission = async (submissionId: string) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase credentials in environment");
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/submissions?id=eq.${encodeURIComponent(submissionId)}&select=id,telegram_chat_id&limit=1`,
    {
      method: "GET",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    },
  );

  const body = await response.text();

  if (!response.ok) {
    throw new Error(`Failed to fetch submission (${response.status}): ${body}`);
  }

  const rows = JSON.parse(body) as Array<{ id: string; telegram_chat_id: string | null }>;
  return rows[0] ?? null;
};

const linkChatIdToSubmission = async (submissionId: string, chatId: string) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase credentials in environment");
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/submissions?id=eq.${encodeURIComponent(submissionId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({ telegram_chat_id: chatId }),
    },
  );

  const body = await response.text();

  if (!response.ok) {
    throw new Error(`Failed to update submission (${response.status}): ${body}`);
  }

  const rows = JSON.parse(body) as Array<{ id: string; telegram_chat_id: string | null }>;
  return rows[0] ?? null;
};

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let payload: TelegramUpdate;

  try {
    payload = await req.json();
  } catch (error) {
    console.error("telegram webhook invalid json", {
      error: error instanceof Error ? error.message : String(error),
    });
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const messageText = payload.message?.text ?? "";
  const chatId = payload.message?.chat?.id;

  if (!messageText.toLowerCase().startsWith("/start")) {
    return Response.json({ ok: true, skipped: "not_start_command" });
  }

  if (!chatId) {
    return Response.json({ ok: true, skipped: "missing_chat_id" });
  }

  const submissionId = parseStartSubmissionId(messageText);

  if (!submissionId) {
    console.info("telegram start missing/invalid submission_id payload", {
      update_id: payload.update_id ?? null,
      chat_id: String(chatId),
      text: messageText,
    });

    await sendTelegramMessage(String(chatId), "Thanks for connecting. We could not verify your submission link.");

    return Response.json({ ok: true, skipped: "invalid_submission_id_payload" });
  }

  try {
    const submission = await fetchSubmission(submissionId);

    if (!submission) {
      console.info("telegram link rejected: submission not found", {
        submission_id: submissionId,
        chat_id: String(chatId),
      });
      return Response.json({ ok: true, skipped: "submission_not_found" });
    }

    if (submission.telegram_chat_id && submission.telegram_chat_id !== String(chatId)) {
      console.info("telegram link rejected: submission already linked to another chat", {
        submission_id: submissionId,
        existing_chat_id: submission.telegram_chat_id,
        attempted_chat_id: String(chatId),
      });
      return Response.json({ ok: true, skipped: "already_linked_to_other_chat" });
    }

    const updated = await linkChatIdToSubmission(submissionId, String(chatId));

    console.info("telegram chat linked to submission", {
      submission_id: submissionId,
      chat_id: String(chatId),
      updated: Boolean(updated),
    });

    await sendTelegramMessage(String(chatId), "You're all set! You will now receive application updates here.");

    return Response.json({ ok: true, linked: true, submission_id: submissionId });
  } catch (error) {
    console.error("telegram start processing failed", {
      error: error instanceof Error ? error.message : String(error),
      submission_id: submissionId,
      chat_id: String(chatId),
    });

    return Response.json({ ok: false, error: "processing_failed" }, { status: 500 });
  }
});
