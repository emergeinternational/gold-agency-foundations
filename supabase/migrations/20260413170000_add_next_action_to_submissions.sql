alter table public.submissions
add column next_action text;

alter table public.submissions
add constraint submissions_next_action_check
check (
  next_action is null
  or next_action in (
    'schedule_audition',
    'enroll_training',
    'request_more_content',
    'refer_to_emerge',
    'hold',
    'reject'
  )
);
