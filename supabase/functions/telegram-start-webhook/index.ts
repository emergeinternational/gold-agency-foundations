import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type TelegramEntity = {
  url?: string;
  type?: string;
  offset?: number;
  length?: number;
};

type TelegramUpdate = {
  update_id?: number;
  message?: {
    text?: string;
    caption?: string;
    entities?: TelegramEntity[];
    caption_entities?: TelegramEntity[];
    date?: number;
    message_id?: number;
    photo?: Array<{ file_id?: string }>;
    video?: { file_id?: string };
    document?: { file_id?: string };
    chat?: {
      id?: number;
    };
  };
};

type SubmissionLookup = {
  id: string;
  telegram_chat_id: string | null;
  full_name: string | null;
  application_mode: string | null;
};

const SUBMISSION_ID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const APPLICATION_LABELS: Record<string, string> = {
  casting: "casting application",
  representation: "talent representation application",
  training_development: "training/development interest",
  brand_campaign: "brand/campaign opportunity application",
  media_opportunity: "media opportunity application",
  general_database: "talent application",
};

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
      disable_web_page_preview: true,
    }),
  });
};

const getSupabaseConfig = () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase credentials in environment");
  }

  return { supabaseUrl, serviceRoleKey };
};

const fetchSubmissionById = async (submissionId: string): Promise<SubmissionLookup | null> => {
  const { supabaseUrl, serviceRoleKey } = getSupabaseConfig();

  const response = await fetch(
    `${supabaseUrl}/rest/v1/submissions?id=eq.${encodeURIComponent(submissionId)}&select=id,telegram_chat_id,full_name,application_mode&limit=1`,
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

  const rows = JSON.parse(body) as SubmissionLookup[];
  return rows[0] ?? null;
};

const fetchSubmissionByChatId = async (chatId: string): Promise<SubmissionLookup | null> => {
  const { supabaseUrl, serviceRoleKey } = getSupabaseConfig();

  const response = await fetch(
    `${supabaseUrl}/rest/v1/submissions?telegram_chat_id=eq.${encodeURIComponent(chatId)}&select=id,telegram_chat_id,full_name,application_mode&limit=1`,
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
    throw new Error(`Failed to fetch submission by chat (${response.status}): ${body}`);
  }

  const rows = JSON.parse(body) as SubmissionLookup[];
  return rows[0] ?? null;
};

const updateSubmissionConnection = async (submissionId: string, chatId: string) => {
  const { supabaseUrl, serviceRoleKey } = getSupabaseConfig();

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
      body: JSON.stringify({ telegram_chat_id: chatId, candidate_outcome: "connected" }),
    },
  );

  const body = await response.text();

  if (!response.ok) {
    throw new Error(`Failed to update submission (${response.status}): ${body}`);
  }

  const rows = JSON.parse(body) as SubmissionLookup[];
  return rows[0] ?? null;
};

const extractFirstName = (fullName: string | null) => {
  const value = (fullName ?? "").trim();
  if (!value) return "there";
  return value.split(/\s+/)[0] ?? "there";
};

const extractLinks = (text: string, entities: TelegramEntity[] | undefined) => {
  if (!text.trim()) return null;
  const links = (entities ?? [])
    .filter((entity) => entity.type === "url" && typeof entity.offset === "number" && typeof entity.length === "number")
    .map((entity) => text.slice(entity.offset!, entity.offset! + entity.length!))
    .filter(Boolean);
  return links.length ? links.join("\n") : null;
};

const saveInboundMessage = async (params: {
  submissionId: string;
  body: string | null;
  linkUrl: string | null;
  mediaType: string | null;
  telegramFileId: string | null;
  telegramMessageId: string | null;
  createdAt: string;
}) => {
  const { supabaseUrl, serviceRoleKey } = getSupabaseConfig();

  await fetch(`${supabaseUrl}/rest/v1/submission_messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      submission_id: params.submissionId,
      direction: "candidate_to_admin",
      message_type: params.mediaType ? "media" : "text",
      body: params.body,
      link_url: params.linkUrl,
      media_type: params.mediaType,
      telegram_file_id: params.telegramFileId,
      telegram_message_id: params.telegramMessageId,
      delivery_status: "received",
      review_status: "new",
      created_at: params.createdAt,
    }),
  });
};

const buildWelcomeMessage = (submission: SubmissionLookup) => {
  const firstName = extractFirstName(submission.full_name);
  const mode = submission.application_mode ?? "general_database";
  const label = APPLICATION_LABELS[mode] ?? APPLICATION_LABELS.general_database;

  return [
    `✅ You’re connected, ${firstName}.`,
    "",
    `Thank you for submitting your Ascend Elite ${label}.`,
    "",
    "Your updates will be sent here on Telegram. If our team needs more information, audition details, scheduling information, training updates, or next steps, we will contact you here.",
    "",
    "Please keep Telegram notifications on so you do not miss important updates.",
    "",
    "Ascend Elite",
    "Powered by Emerge Globally, New York City",
    "Instagram: @AscendEliteHQ",
    "Website: www.ascendeliteagency.com",
  ].join("\n");
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
  const messageCaption = payload.message?.caption ?? "";
  const chatId = payload.message?.chat?.id;

  if (!chatId) {
    return Response.json({ ok: true, skipped: "missing_chat_id" });
  }

  if (messageText.toLowerCase().startsWith("/start")) {
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
      const submission = await fetchSubmissionById(submissionId);

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

      const updated = await updateSubmissionConnection(submissionId, String(chatId));

      console.info("telegram chat linked to submission", {
        submission_id: submissionId,
        chat_id: String(chatId),
        updated: Boolean(updated),
      });

      await sendTelegramMessage(String(chatId), buildWelcomeMessage(updated ?? submission));

      return Response.json({ ok: true, linked: true, submission_id: submissionId });
    } catch (error) {
      console.error("telegram start processing failed", {
        error: error instanceof Error ? error.message : String(error),
        submission_id: submissionId,
        chat_id: String(chatId),
      });

      return Response.json({ ok: false, error: "processing_failed" }, { status: 500 });
    }
  }

  try {
    const submission = await fetchSubmissionByChatId(String(chatId));

    if (!submission) {
      return Response.json({ ok: true, skipped: "chat_not_linked" });
    }

    const firstPhotoFileId = payload.message?.photo?.at(-1)?.file_id;
    const videoFileId = payload.message?.video?.file_id;
    const documentFileId = payload.message?.document?.file_id;
    const mediaType = firstPhotoFileId ? "photo" : videoFileId ? "video" : documentFileId ? "document" : null;
    const fileId = firstPhotoFileId ?? videoFileId ?? documentFileId ?? null;
    const textBody = (messageText || messageCaption || "").trim() || null;
    const links = extractLinks(messageText || messageCaption || "", payload.message?.entities ?? payload.message?.caption_entities);

    await saveInboundMessage({
      submissionId: submission.id,
      body: textBody,
      linkUrl: links,
      mediaType,
      telegramFileId: fileId,
      telegramMessageId: payload.message?.message_id ? String(payload.message.message_id) : null,
      createdAt: payload.message?.date ? new Date(payload.message.date * 1000).toISOString() : new Date().toISOString(),
    });

    await sendTelegramMessage(
      String(chatId),
      "✅ Received. Thank you. Our team will review your update and contact you here if more information is needed.",
    );

    return Response.json({ ok: true, linked_submission: submission.id, stored: true });
  } catch (error) {
    console.error("telegram reply capture failed", {
      error: error instanceof Error ? error.message : String(error),
      chat_id: String(chatId),
    });

    return Response.json({ ok: false, error: "processing_failed" }, { status: 500 });
  }
});
