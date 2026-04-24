import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Admin → Candidate Telegram messaging.
// Security:
//  - Requires Bearer JWT (verify_jwt = true at gateway level).
//  - Re-validates the user via SUPABASE_ANON_KEY + caller JWT, then calls public.is_privileged_user().
//  - Service-role client is used ONLY for DB writes (insert into submission_messages).
//  - The caller's verified auth.uid() — never a client-supplied admin id — is stored as sent_by_admin_id.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type SendBody = {
  submission_id?: string;
  template_key?: string | null;
  body?: string;
  structured?: {
    date?: string | null;
    time?: string | null;
    location?: string | null;
    contact?: string | null;
    link?: string | null;
  } | null;
};

const json = (status: number, payload: unknown) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const renderTemplate = (key: string, firstName: string, structured: SendBody["structured"]): string => {
  const fn = firstName?.trim() || "there";
  const date = structured?.date?.trim() || "TBD";
  const time = structured?.time?.trim() || "TBD";
  const location = structured?.location?.trim() || "TBD";
  const contact = structured?.contact?.trim() || "Our team";
  const link = structured?.link?.trim();

  switch (key) {
    case "request_photos":
      return `Hi ${fn}, our team needs updated photos to continue reviewing your profile.\n\nBefore you respond, please prepare:\n✔ Clear face photo\n✔ Full body photo\n✔ Good lighting\n✔ Simple background\n✔ Recent images\n\nSend all photos together in one message.`;
    case "request_video":
      return `Hi ${fn}, our team needs a short video to continue reviewing your profile.\n\nBefore you respond, please prepare:\n✔ 1 short video under 60 seconds\n✔ Clear sound if speaking, singing, or presenting\n✔ Good lighting\n✔ No heavy filters\n✔ Upload or send a link if easier\n\nSend your video or video link here.`;
    case "request_links":
      return `Hi ${fn}, our team needs your latest links.\n\nBefore you respond, please prepare:\n✔ Instagram or TikTok link\n✔ YouTube link if available\n✔ Portfolio or website if available\n\nSend the links together in one message.`;
    case "casting_invite":
      return `Hi ${fn}, you have been selected for the next step for this casting opportunity.\n\nDate: ${date}\nTime: ${time}\nLocation: ${location}\nContact: ${contact}${link ? `\nLink: ${link}` : ""}\n\nPlease reply to confirm your attendance.`;
    case "not_selected":
      return `Hi ${fn}, thank you for your submission.\n\nWhile you were not selected for this specific opportunity, your profile will remain in the Ascend Elite talent database.\n\nAscend Elite reviews talent for future castings, media opportunities, brand opportunities, training, and development programs. If a future opportunity matches your profile, we may contact you here.`;
    case "recommend_training":
      return `Hi ${fn}, thank you for your submission.\n\nBased on your current materials, you may benefit from additional development, training, or portfolio improvement.\n\nAscend Elite may share upcoming training and development opportunities here.`;
    case "fast_track":
      return `Hi ${fn}, thank you for your submission.\n\nOur team reviewed your profile and would like to move forward with you for upcoming media, content, or entertainment opportunities.\n\nPlease confirm your availability for a brief next step.`;
    default:
      return "";
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "method_not_allowed" });

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
  const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");

  if (!SUPABASE_URL || !SERVICE_KEY || !ANON_KEY) {
    return json(500, { error: "server_misconfigured" });
  }

  // 1. Auth: require Bearer JWT and resolve user.
  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader.toLowerCase().startsWith("bearer ")) {
    return json(401, { error: "missing_authorization" });
  }

  const userClient = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData?.user) {
    return json(401, { error: "invalid_token" });
  }
  const adminUserId = userData.user.id;

  // 2. Authorization: must be a privileged user.
  const { data: privileged, error: privErr } = await userClient.rpc("is_privileged_user");
  if (privErr) {
    console.error("is_privileged_user check failed", privErr);
    return json(500, { error: "authorization_check_failed" });
  }
  if (!privileged) {
    return json(403, { error: "forbidden" });
  }

  // 3. Parse + validate body.
  let body: SendBody;
  try {
    body = (await req.json()) as SendBody;
  } catch {
    return json(400, { error: "invalid_json" });
  }

  const submissionId = body.submission_id?.trim();
  if (!submissionId) return json(400, { error: "submission_id_required" });

  const templateKey = body.template_key?.trim() || null;
  const customBody = (body.body ?? "").trim();
  const structured = body.structured ?? null;

  if (!templateKey && !customBody) {
    return json(400, { error: "template_or_body_required" });
  }

  // 4. Look up submission via service-role client (bypass RLS).
  const adminClient = createClient(SUPABASE_URL, SERVICE_KEY);

  const { data: submission, error: subErr } = await adminClient
    .from("submissions")
    .select("id, full_name, telegram_chat_id, application_mode")
    .eq("id", submissionId)
    .maybeSingle();

  if (subErr) {
    console.error("submission lookup failed", subErr);
    return json(500, { error: "submission_lookup_failed" });
  }
  if (!submission) return json(404, { error: "submission_not_found" });

  if (!submission.telegram_chat_id) {
    return json(409, { error: "telegram_not_connected" });
  }

  // 5. Build the message body (template + optional custom body appended).
  const firstName = submission.full_name?.split(/\s+/)[0]?.trim() ?? "";
  const rendered = templateKey ? renderTemplate(templateKey, firstName, structured) : "";
  const finalText = [rendered, customBody].filter((s) => s && s.length > 0).join("\n\n").trim();

  if (!finalText) {
    return json(400, { error: "empty_message" });
  }

  // 6. Send via Telegram (failures must NOT break the DB log).
  let deliveryStatus = "sent";
  let telegramMessageId: string | null = null;

  if (!TELEGRAM_BOT_TOKEN) {
    deliveryStatus = "failed_no_token";
    console.error("TELEGRAM_BOT_TOKEN missing");
  } else {
    try {
      const tgRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: submission.telegram_chat_id,
          text: finalText,
          disable_web_page_preview: false,
        }),
      });
      const tgJson = await tgRes.json().catch(() => ({}));
      if (!tgRes.ok || !tgJson?.ok) {
        deliveryStatus = "failed_telegram";
        console.error("telegram sendMessage failed", { status: tgRes.status, response: tgJson });
      } else {
        telegramMessageId = tgJson?.result?.message_id ? String(tgJson.result.message_id) : null;
      }
    } catch (e) {
      deliveryStatus = "failed_network";
      console.error("telegram sendMessage network error", { error: e instanceof Error ? e.message : String(e) });
    }
  }

  // 7. Always log the outbound message.
  const { error: insertErr } = await adminClient.from("submission_messages").insert({
    submission_id: submissionId,
    telegram_chat_id: submission.telegram_chat_id,
    direction: "outbound",
    message_type: templateKey ? "template" : "custom",
    template_key: templateKey,
    content: finalText,
    telegram_message_id: telegramMessageId,
    sent_by_admin_id: adminUserId,
    delivery_status: deliveryStatus,
    reviewed: true,
  });

  if (insertErr) {
    console.error("submission_messages insert failed", insertErr);
    // Surface the DB error but don't unsend Telegram message.
    return json(500, {
      ok: false,
      delivery_status: deliveryStatus,
      error: "log_insert_failed",
      message: insertErr.message,
    });
  }

  return json(200, {
    ok: deliveryStatus === "sent",
    delivery_status: deliveryStatus,
    telegram_message_id: telegramMessageId,
  });
});
