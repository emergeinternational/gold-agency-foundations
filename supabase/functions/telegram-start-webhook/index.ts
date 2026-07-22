import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// Telegram webhook handler for @AscendAgencybot.
// Responsibilities:
//  1. /start <submission_id>  -> link telegram_chat_id to a submission and send a personalized welcome.
//  2. Any other inbound message (text / photo / video / document / link) from a known chat_id
//     -> store it in submission_messages (direction='inbound') and reply with a confirmation.
//
// Telegram failures must NEVER throw past the webhook; always return 200 with a JSON status
// so Telegram doesn't retry-flood the function and so DB integrity is preserved.

type TelegramPhotoSize = { file_id?: string; file_unique_id?: string; width?: number; height?: number };

type TelegramMessage = {
  message_id?: number;
  text?: string;
  caption?: string;
  chat?: { id?: number };
  from?: { first_name?: string; username?: string };
  photo?: TelegramPhotoSize[];
  video?: { file_id?: string };
  document?: { file_id?: string; file_name?: string };
  voice?: { file_id?: string };
  audio?: { file_id?: string };
  entities?: Array<{ type?: string; offset?: number; length?: number; url?: string }>;
};

type TelegramUpdate = {
  update_id?: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
};

const SUBMISSION_ID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const APPLICATION_LABELS: Record<string, string> = {
  casting: "casting application",
  representation: "talent representation application",
  training_development: "training & development interest",
  brand_campaign: "brand / campaign opportunity application",
  media_opportunity: "media opportunity application",
  general_database: "talent application",
  general: "talent application",
};

const parseStartSubmissionId = (text: string): string | null => {
  const trimmed = text.trim();
  const prefixed = trimmed.match(/^\/start(?:\s+|_)?([^\s]+)?$/i);
  const payload = prefixed?.[1]?.trim() ?? null;
  if (!payload) return null;

  let decoded: string;
  try {
    decoded = decodeURIComponent(payload);
  } catch {
    decoded = payload;
  }

  const cleaned = decoded.replace(/^submission[:=]/i, "").trim();
  return SUBMISSION_ID_REGEX.test(cleaned) ? cleaned : null;
};

const sendTelegramMessage = async (chatId: string | number, message: string) => {
  const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
  if (!token) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message, disable_web_page_preview: true }),
    });
  } catch (e) {
    console.error("telegram sendMessage failed", { error: e instanceof Error ? e.message : String(e) });
  }
};

const supabaseRest = async (path: string, init: RequestInit = {}) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase credentials in environment");
  }
  const headers = new Headers(init.headers ?? {});
  headers.set("apikey", serviceRoleKey);
  headers.set("Authorization", `Bearer ${serviceRoleKey}`);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const res = await fetch(`${supabaseUrl}/rest/v1/${path}`, { ...init, headers });
  const body = await res.text();
  if (!res.ok) throw new Error(`Supabase REST ${res.status}: ${body}`);
  return body ? JSON.parse(body) : null;
};

const fetchSubmissionById = async (submissionId: string) => {
  const rows = (await supabaseRest(
    `submissions?id=eq.${encodeURIComponent(submissionId)}&select=id,full_name,application_mode,opportunity_title,telegram_chat_id&limit=1`,
  )) as Array<{ id: string; full_name: string | null; application_mode: string | null; opportunity_title: string | null; telegram_chat_id: string | null }>;
  return rows?.[0] ?? null;
};

const fetchSubmissionByChatId = async (chatId: string) => {
  const rows = (await supabaseRest(
    `submissions?telegram_chat_id=eq.${encodeURIComponent(chatId)}&select=id,full_name,application_mode&order=created_at.desc&limit=1`,
  )) as Array<{ id: string; full_name: string | null; application_mode: string | null }>;
  return rows?.[0] ?? null;
};

const linkChatIdToSubmission = async (submissionId: string, chatId: string) => {
  return await supabaseRest(`submissions?id=eq.${encodeURIComponent(submissionId)}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ telegram_chat_id: chatId, candidate_outcome: "connected" }),
  });
};

const insertInboundMessage = async (params: {
  submissionId: string | null;
  chatId: string;
  messageType: string;
  content: string | null;
  fileUrl: string | null;
  telegramMessageId: string | null;
}) => {
  try {
    await supabaseRest("submission_messages", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        submission_id: params.submissionId,
        telegram_chat_id: params.chatId,
        direction: "inbound",
        message_type: params.messageType,
        content: params.content,
        file_url: params.fileUrl,
        telegram_message_id: params.telegramMessageId,
        delivery_status: "received",
        reviewed: false,
      }),
    });
  } catch (e) {
    console.error("insertInboundMessage failed", { error: e instanceof Error ? e.message : String(e) });
  }
};

const buildWelcomeMessage = (firstName: string, applicationMode: string | null, opportunityTitle: string | null) => {
  const mode = (applicationMode ?? "general").toLowerCase();
  const label = APPLICATION_LABELS[mode] ?? APPLICATION_LABELS.general;

  let intro: string;
  if (opportunityTitle && opportunityTitle.trim().length > 0) {
    intro = `Thank you for submitting for ${opportunityTitle.trim()}.\nOur team will review your application and follow up here with next steps. Stay connected.`;
  } else if (mode === "casting") {
    intro =
      "Thank you for your casting application.\nOur team is reviewing your submission. If selected, you will receive casting details here. Stay ready.";
  } else if (mode === "representation") {
    intro =
      "Thank you for applying for representation.\nOur team will review your profile and follow up with next steps. Stay connected here.";
  } else {
    intro = `Thank you for submitting your Ascend Elite ${label}.\nOur team will review your submission and follow up here with next steps.`;
  }

  return [
    `✅ You're connected${firstName ? `, ${firstName}` : ""}.`,
    "",
    intro,
    "",
    "Please keep Telegram notifications on so you do not miss important updates.",
    "",
    "Ascend Elite",
    "Powered by Emerge Globally, New York City",
    "Instagram: @AscendEliteHQ",
    "Website: https://www.ascendeliteagency.com",
  ].join("\n");
};

const handleStartCommand = async (message: TelegramMessage, chatId: number) => {
  const text = message.text ?? "";
  const submissionId = parseStartSubmissionId(text);

  if (!submissionId) {
    console.info("telegram /start missing/invalid submission_id payload", {
      chat_id: String(chatId),
      text,
    });
    await sendTelegramMessage(chatId, "Thanks for connecting. We could not verify your submission link. Please complete your application at https://www.ascendeliteagency.com first.");
    return { ok: true, skipped: "invalid_submission_id_payload" };
  }

  const submission = await fetchSubmissionById(submissionId);

  if (!submission) {
    console.info("telegram link rejected: submission not found", { submission_id: submissionId, chat_id: String(chatId) });
    await sendTelegramMessage(chatId, "Thanks for connecting. We could not find your submission. Please re-submit at https://www.ascendeliteagency.com.");
    return { ok: true, skipped: "submission_not_found" };
  }

  if (submission.telegram_chat_id && submission.telegram_chat_id !== String(chatId)) {
    console.info("telegram link rejected: submission already linked to another chat", {
      submission_id: submissionId,
      existing_chat_id: submission.telegram_chat_id,
      attempted_chat_id: String(chatId),
    });
    await sendTelegramMessage(chatId, "This application is already linked to another Telegram account.");
    return { ok: true, skipped: "already_linked_to_other_chat" };
  }

  await linkChatIdToSubmission(submissionId, String(chatId));

  const firstName =
    (message.from?.first_name?.trim()) ||
    (submission.full_name?.split(/\s+/)[0]?.trim() ?? "");

  const welcome = buildWelcomeMessage(firstName, submission.application_mode, submission.opportunity_title);
  await sendTelegramMessage(chatId, welcome);

  // Also log the welcome as outbound for the admin message history.
  try {
    await supabaseRest("submission_messages", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        submission_id: submissionId,
        telegram_chat_id: String(chatId),
        direction: "outbound",
        message_type: "system_welcome",
        template_key: "welcome",
        content: welcome,
        delivery_status: "sent",
        reviewed: true,
      }),
    });
  } catch (e) {
    console.warn("welcome message log failed", { error: e instanceof Error ? e.message : String(e) });
  }

  console.info("telegram chat linked to submission", { submission_id: submissionId, chat_id: String(chatId) });
  return { ok: true, linked: true, submission_id: submissionId };
};

const handleInboundMessage = async (message: TelegramMessage, chatId: number) => {
  // Ignore commands other than text we already handled.
  const text = (message.text ?? message.caption ?? "").trim();
  if (text.startsWith("/")) {
    return { ok: true, skipped: "command_ignored" };
  }

  const submission = await fetchSubmissionByChatId(String(chatId));
  if (!submission) {
    // Not linked — friendly nudge.
    await sendTelegramMessage(
      chatId,
      "Thanks for the message. We could not find an application linked to this Telegram account. Please complete your application at https://www.ascendeliteagency.com.",
    );
    return { ok: true, skipped: "chat_not_linked" };
  }

  // Determine message type + content + file_id (we don't download — admin can fetch later).
  let messageType = "text";
  let fileUrl: string | null = null;
  const content: string | null = text || null;

  if (message.photo && message.photo.length > 0) {
    messageType = "photo";
    const largest = message.photo[message.photo.length - 1];
    fileUrl = largest?.file_id ?? null;
  } else if (message.video?.file_id) {
    messageType = "video";
    fileUrl = message.video.file_id;
  } else if (message.document?.file_id) {
    messageType = "document";
    fileUrl = message.document.file_id;
  } else if (message.voice?.file_id) {
    messageType = "voice";
    fileUrl = message.voice.file_id;
  } else if (message.audio?.file_id) {
    messageType = "audio";
    fileUrl = message.audio.file_id;
  } else if (message.entities?.some((e) => e?.type === "url" || e?.type === "text_link")) {
    messageType = "link";
  }

  await insertInboundMessage({
    submissionId: submission.id,
    chatId: String(chatId),
    messageType,
    content,
    fileUrl,
    telegramMessageId: message.message_id ? String(message.message_id) : null,
  });

  await sendTelegramMessage(chatId, "✅ Received. Our team will review and follow up shortly.");

  return { ok: true, captured: true, submission_id: submission.id };
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let payload: TelegramUpdate;
  try {
    payload = await req.json();
  } catch (error) {
    console.error("telegram webhook invalid json", { error: error instanceof Error ? error.message : String(error) });
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const message = payload.message ?? payload.edited_message;
  const chatId = message?.chat?.id;

  if (!message || !chatId) {
    return Response.json({ ok: true, skipped: "no_message_or_chat" });
  }

  try {
    const text = (message.text ?? "").trim();
    if (text.toLowerCase().startsWith("/start")) {
      const result = await handleStartCommand(message, chatId);
      return Response.json(result);
    }

    const result = await handleInboundMessage(message, chatId);
    return Response.json(result);
  } catch (error) {
    console.error("telegram webhook processing failed", {
      error: error instanceof Error ? error.message : String(error),
      chat_id: String(chatId),
    });
    // Always respond 200 so Telegram does not retry-flood; we've logged the failure.
    return Response.json({ ok: false, error: "processing_failed" });
  }
});
