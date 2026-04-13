create extension if not exists pg_net;

create or replace function public.enqueue_submission_next_action_trigger()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  request_id bigint;
  supabase_url text;
  anon_key text;
  function_url text;
begin
  supabase_url := current_setting('app.settings.supabase_url', true);
  anon_key := current_setting('app.settings.supabase_anon_key', true);

  function_url := supabase_url || '/functions/v1/admin-next-action-trigger';

  if supabase_url is null or supabase_url = '' then
    raise warning 'Skipping next_action webhook: app.settings.supabase_url is not configured';
    return new;
  end if;

  if anon_key is null or anon_key = '' then
    raise warning 'Skipping next_action webhook: app.settings.supabase_anon_key is not configured';
    return new;
  end if;

  select
    net.http_post(
      url := function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || anon_key
      ),
      body := jsonb_build_object(
        'type', tg_op,
        'table', tg_table_name,
        'schema', tg_table_schema,
        'record', to_jsonb(new),
        'old_record', case when tg_op = 'UPDATE' then to_jsonb(old) else null end
      )
    )
  into request_id;

  return new;
end;
$$;

drop trigger if exists submissions_next_action_webhook_trigger on public.submissions;

create trigger submissions_next_action_webhook_trigger
after insert or update on public.submissions
for each row
execute function public.enqueue_submission_next_action_trigger();
