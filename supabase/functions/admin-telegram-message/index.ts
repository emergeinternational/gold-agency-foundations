import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

type Payload = {
  submission_id?: string;
  message_template_key?: string | null;
  message_body?: string | null;
  date?: string | null;
  time?: string | null;
  location?: string | null;
  contact_phone?: string | null;
  link_url?: string | null;
  media_url?: string | null;
};

type SubmissionRow = {
  id: string;
  telegram_chat_id: string | null;
  full_name: string | null;
  application_mode: string | null;
};

const normalize = (value: string | null | undefined) => value?.trim() || null;

const firstName = (fullName: string | null) => {
  const parts = (fullName ?? "").trim().split(/\s+/).filter(Boolean);
  return parts[0] ?? "there";
};

const getSupabaseConfig = () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase credentials in environment");
  }

  return { supabaseUrl, serviceRoleKey };
};

const getCallerAuthHeader = (req: Request) => {
  const authorization = req.headers.get("Authorization")?.trim() ?? "";
  if (!authorization.toLowerCase().startsWith("bearer ")) {
    throw new Error("missing_bearer_token");
  }
  return authorization;
};

const getAnonKey = () => {
  const anonKey = normalize(Deno.env.get("SUPABASE_ANON_KEY"));
  if (!anonKey) {
    throw new Error("admin_verification_unavailable_missing_supabase_anon_key");
  }
  return anonKey;
};

const assertAuthorizedAdmin = async (req: Request) => {
  const { supabaseUrl } = getSupabaseConfig();
  const anonKey = getAnonKey();
  const authorization = getCallerAuthHeader(req);

  const privilegedResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/is_privileged_user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
      Authorization: authorization,
    },
    body: "{}",
  });

  if (!privilegedResponse.ok) {
    const body = await privilegedResponse.text();
    throw new Error(`admin_verification_failed_${privilegedResponse.status}:${body}`);
  }

  const isPrivileged = (await privilegedResponse.json()) === true;
  if (!isPrivileged) {
    throw new Error("forbidden_admin_required");
  }

  const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
    method: "GET",
    headers: {
      apikey: anonKey,
      Authorization: authorization,
    },
  });

  if (!userResponse.ok) {
    const body = await userResponse.text();
    throw new Error(`admin_identity_lookup_failed_${userResponse.status}:${body}`);
  }

  const user = await userResponse.json();
  const userId = normalize(user?.id);
  if (!userId) {
    throw new Error("admin_identity_missing");
  }

  return { userId };
};

const fetchSubmission = async (submissionId: string): Promise<SubmissionRow | null> => {
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

  const rows = JSON.parse(body) as SubmissionRow[];
  return rows[0] ?? null;
};

const sendTelegramMessage = async (chatId: string, text: string) => {
  const telegramBotToken = normalize(Deno.env.get("TELEGRAM_BOT_TOKEN"));

  if (!telegramBotToken) {
    return { sent: false, status: "telegram_token_missing" };
  }

  const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    return { sent: false, status: `telegram_error_${response.status}`, body };
  }

  const result = await response.json();
  return {
    sent: true,
    status: "sent",
    telegram_message_id: result?.result?.message_id ? String(result.result.message_id) : null,
  };
};

const saveMessageLog = async (params: {
  submissionId: string;
  templateKey: string | null;
  body: string;
  date: string | null;
  time: string | null;
  location: string | null;
  contactPhone: string | null;
  linkUrl: string | null;
  mediaUrl: string | null;
  deliveryStatus: string;
  telegramMessageId: string | null;
  adminId: string | null;
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
      direction: "admin_to_candidate",
      message_type: params.mediaUrl ? "media" : "text",
      template_key: params.templateKey,
      body: params.body,
      event_date: params.date,
      event_time: params.time,
      location: params.location,
      contact_phone: params.contactPhone,
      link_url: params.linkUrl,
      media_url: params.mediaUrl,
      sent_by_admin_id: params.adminId,
      telegram_message_id: params.telegramMessageId,
      delivery_status: params.deliveryStatus,
      review_status: "reviewed",
    }),
  });
};

const TEMPLATE_MAP: Record<string, string> = {
  request_photos:
    "Before you respond, please prepare:\n✔ Clear face photo\n✔ Full body photo\n✔ Good lighting\n✔ Simple background\n✔ Recent images\n\nSend all photos together in one message.",
  request_video:
    "Before you respond, please prepare:\n✔ 1 short video under 60 seconds\n✔ Clear sound if speaking or singing\n✔ Good lighting\n✔ No heavy filters\n✔ Link or upload if possible\n\nSend your video or video link here.",
  request_links:
    "Before you respond, please prepare:\n✔ Instagram or TikTok link\n✔ YouTube link if available\n✔ Portfolio or website if available\n\nSend the links together in one message.",
  appointment_invite: "You are invited to the next step. Please review details below and confirm your availability.",
  not_selected_current_opportunity:
    "Thank you for your submission. While you were not selected for this specific opportunity, your profile will remain in our talent database. Ascend Elite reviews talent for future castings, media opportunities, brand opportunities, training, and development programs. If a future opportunity matches your profile, we may contact you here.",
  development_recommended:
    "Based on your submission, you may benefit from additional development, training, or portfolio improvement. We may share upcoming training and development opportunities here.",
  fast_track_talent:
    "Hi {{first_name}}, thank you for your submission. Our team reviewed your profile and would like to move forward with you for upcoming media, content, or entertainment opportunities. Please confirm your availability for a brief next step. Reply with: Confirm availability / Request more details / Not available.",
};

const buildMessage = (submission: SubmissionRow, payload: Payload) => {
  const templateKey = normalize(payload.message_template_key);
  const customBody = normalize(payload.message_body);
  const fallbackTemplate = templateKey ? TEMPLATE_MAP[templateKey] : null;
  const base = customBody ?? fallbackTemplate ?? "";
  const body = base.replaceAll("{{first_name}}", firstName(submission.full_name));

  const lines = [body];

  if (payload.date) lines.push(`Date: ${payload.date}`);
  if (payload.time) lines.push(`Time: ${payload.time}`);
  if (payload.location) lines.push(`Location: ${payload.location}`);
  if (payload.contact_phone) lines.push(`Contact: ${payload.contact_phone}`);
  if (payload.link_url) lines.push(`Link: ${payload.link_url}`);

  return {
    text: lines.filter(Boolean).join("\n"),
    templateKey,
  };
};

serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  let payload: Payload;

  try {
    payload = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const submissionId = normalize(payload.submission_id);

  if (!submissionId) {
    return Response.json({ ok: false, error: "submission_id_required" }, { status: 400 });
  }

  try {
    const { userId } = await assertAuthorizedAdmin(req);
    const submission = await fetchSubmission(submissionId);

    if (!submission) {
      return Response.json({ ok: false, error: "submission_not_found" }, { status: 404 });
    }

    if (!submission.telegram_chat_id) {
      return Response.json(
        { ok: false, error: "telegram_not_connected", message: "Telegram not connected. Candidate must press Start before direct updates can be sent." },
        { status: 400 },
      );
    }

    const message = buildMessage(submission, payload);

    if (!normalize(message.text)) {
      return Response.json({ ok: false, error: "message_body_required" }, { status: 400 });
    }

    const telegramResult = await sendTelegramMessage(submission.telegram_chat_id, message.text);

    await saveMessageLog({
      submissionId: submission.id,
      templateKey: message.templateKey,
      body: message.text,
      date: normalize(payload.date),
      time: normalize(payload.time),
      location: normalize(payload.location),
      contactPhone: normalize(payload.contact_phone),
      linkUrl: normalize(payload.link_url),
      mediaUrl: normalize(payload.media_url),
      deliveryStatus: telegramResult.status,
      telegramMessageId: telegramResult.sent ? telegramResult.telegram_message_id ?? null : null,
      adminId: userId,
    });

    return Response.json({ ok: true, ...telegramResult });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const status =
      message === "forbidden_admin_required" || message === "missing_bearer_token"
        ? 403
        : message.startsWith("admin_verification_unavailable_")
          ? 503
          : 500;

    return Response.json(
      {
        ok: false,
        error: "message_send_failed",
        details: message,
      },
      { status },
    );
  }
});
