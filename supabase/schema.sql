create extension if not exists pgcrypto;

create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null, sport text not null check (sport in ('mma','boxing')), country text
);
create table fighters (
  id uuid primary key default gen_random_uuid(),
  name text not null, nickname text, country text, weight_class text,
  sport text not null default 'mma', org_id uuid references organizations(id),
  wins int default 0, losses int default 0, draws int default 0,
  ko_wins int default 0, sub_wins int default 0, dec_wins int default 0
);
create table fighter_aliases (
  fighter_id uuid references fighters(id) on delete cascade, alias text not null,
  primary key (fighter_id, alias)
);
create table events (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(id), name text not null,
  starts_at timestamptz not null, city text, country text,
  status text not null default 'upcoming' check (status in ('upcoming','live','finished'))
);
create table fights (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  fighter_a uuid references fighters(id), fighter_b uuid references fighters(id),
  weight_class text, rounds int default 3, bout_order int default 1,
  status text not null default 'upcoming' check (status in ('upcoming','live','finished')),
  current_round int, winner_id uuid references fighters(id), method text, end_round int
);
create table follows (
  user_id uuid references auth.users(id) on delete cascade,
  fighter_id uuid references fighters(id) on delete cascade,
  primary key (user_id, fighter_id)
);
create index on events (starts_at);
create index on fights (event_id);

alter table organizations enable row level security;
alter table fighters enable row level security;
alter table fighter_aliases enable row level security;
alter table events enable row level security;
alter table fights enable row level security;
alter table follows enable row level security;
create policy "read" on organizations for select using (true);
create policy "read" on fighters for select using (true);
create policy "read" on fighter_aliases for select using (true);
create policy "read" on events for select using (true);
create policy "read" on fights for select using (true);
create policy "own follows" on follows for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
