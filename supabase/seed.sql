-- SAMPLE DATA (fictional). Replace with real, licensed data.
with o as (insert into organizations (name, sport, country) values ('Sample MMA League','mma','CH') returning id),
f as (insert into fighters (name, country, weight_class, sport, org_id, wins, losses, ko_wins, sub_wins, dec_wins)
  select n, c, w, 'mma', o.id, wi, l, k, s, d from o, (values
   ('Marco Ferrante','CH','Lightweight',12,2,6,3,3),
   ('Jonas Brandt','DE','Lightweight',10,3,4,2,4)) as t(n,c,w,wi,l,k,s,d) returning id, name),
e as (insert into events (org_id, name, starts_at, city, country)
  select id, 'Sample Fight Night 1', now() + interval '7 days', 'Zurich', 'CH' from o returning id)
insert into fights (event_id, fighter_a, fighter_b, weight_class, rounds, bout_order)
select e.id, (select id from f where name='Marco Ferrante'), (select id from f where name='Jonas Brandt'), 'Lightweight', 5, 1 from e;
