alter table public.submissions
add column if not exists telegram_chat_id text;
