-- Bill Ledger cloud backup schema.
-- Run once in your Supabase project: SQL Editor → New query → paste → Run.

create table if not exists public.bills (
  user_id    uuid        not null default auth.uid() references auth.users (id) on delete cascade,
  id         text        not null,
  data       jsonb,                       -- the whole bill (store, date, category, items...)
  deleted    boolean     not null default false,  -- soft delete so other devices learn about it
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

create index if not exists bills_user_updated_idx on public.bills (user_id, updated_at);

-- Row Level Security: every user can only see and change their own bills.
alter table public.bills enable row level security;

drop policy if exists "Users read own bills"   on public.bills;
drop policy if exists "Users insert own bills" on public.bills;
drop policy if exists "Users update own bills" on public.bills;
drop policy if exists "Users delete own bills" on public.bills;

create policy "Users read own bills"   on public.bills for select using (auth.uid() = user_id);
create policy "Users insert own bills" on public.bills for insert with check (auth.uid() = user_id);
create policy "Users update own bills" on public.bills for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users delete own bills" on public.bills for delete using (auth.uid() = user_id);
