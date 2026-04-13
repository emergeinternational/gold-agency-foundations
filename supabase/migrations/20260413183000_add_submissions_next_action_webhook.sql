create extension if not exists pg_net;

create or replace function public.enqueue_submission_next_action_trigger()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  request_id bigint;
  function_url text;
begin
  function_url := current_setting('app.settings.supabase_url', true) || '/functions/v1/admin-next-action-trigger';

  if function_url is null then
    raise warning 'Skipping next_action webhook: app.settings.supabase_url is not configured';
    return new;
  end if;

  select
    net.http_post(
      url := function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json'
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
