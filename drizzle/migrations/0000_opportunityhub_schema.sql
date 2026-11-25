
create type public.app_role as enum ('seeker','organization','admin');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  account_type text not null default 'student' check (account_type in ('student','professional','organization')),
  headline text, bio text, location text, phone text, education text,
  skills text[] not null default '{}', avatar_url text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile read" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "own profile insert" on public.profiles for insert to authenticated with check (auth.uid() = id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null, unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles read" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid unique,
  name text not null, description text, website text, location text, logo_url text,
  verification_status text not null default 'pending' check (verification_status in ('pending','verified','rejected','demo')),
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);
grant select on public.organizations to anon;
grant select, insert, update, delete on public.organizations to authenticated;
grant all on public.organizations to service_role;
alter table public.organizations enable row level security;
create policy "orgs public read" on public.organizations for select to anon, authenticated using (true);
create policy "org owner insert" on public.organizations for insert to authenticated
  with check (owner_id = auth.uid() and public.has_role(auth.uid(),'organization'));
create policy "org owner update" on public.organizations for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "org owner delete" on public.organizations for delete to authenticated using (owner_id = auth.uid());

create or replace function public.protect_org_verification() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if public.has_role(auth.uid(),'admin') then return new; end if;
  if tg_op = 'INSERT' then new.verification_status := 'pending'; new.is_demo := false;
  else new.verification_status := old.verification_status; new.is_demo := old.is_demo; end if;
  return new;
end $$;
create trigger org_verification_guard before insert or update on public.organizations
  for each row when (auth.uid() is not null) execute function public.protect_org_verification();

create or replace function public.owns_org(_org uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.organizations where id = _org and owner_id = auth.uid()) $$;

create table public.opportunities (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  category text not null check (category in ('internship','volunteer','scholarship','training')),
  location text not null default 'Nairobi', county text,
  work_mode text not null default 'onsite' check (work_mode in ('remote','hybrid','onsite')),
  participation_type text not null default 'Full-time',
  deadline date not null,
  short_description text not null default '', description text not null default '',
  eligibility text[] not null default '{}', skills text[] not null default '{}', benefits text[] not null default '{}',
  application_instructions text, external_url text,
  status text not null default 'published' check (status in ('published','draft','closed')),
  is_demo boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index on public.opportunities(organization_id);
grant select on public.opportunities to anon;
grant select, insert, update, delete on public.opportunities to authenticated;
grant all on public.opportunities to service_role;
alter table public.opportunities enable row level security;
create policy "published read" on public.opportunities for select to anon, authenticated using (status = 'published');
create policy "owner read all" on public.opportunities for select to authenticated using (public.owns_org(organization_id));
create policy "owner insert" on public.opportunities for insert to authenticated with check (public.owns_org(organization_id) and is_demo = false);
create policy "owner update" on public.opportunities for update to authenticated using (public.owns_org(organization_id)) with check (public.owns_org(organization_id) and is_demo = false);
create policy "owner delete" on public.opportunities for delete to authenticated using (public.owns_org(organization_id));

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  user_id uuid not null,
  status text not null default 'interested' check (status in ('interested','applied','shortlisted','interview','accepted','rejected','withdrawn')),
  note text, applicant_name text, applicant_email text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (opportunity_id, user_id)
);
grant select, insert, update, delete on public.applications to authenticated;
grant all on public.applications to service_role;
alter table public.applications enable row level security;
create policy "own apps" on public.applications for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "org sees apps" on public.applications for select to authenticated
  using (exists (select 1 from public.opportunities o where o.id = opportunity_id and public.owns_org(o.organization_id)));
create policy "org updates apps" on public.applications for update to authenticated
  using (exists (select 1 from public.opportunities o where o.id = opportunity_id and public.owns_org(o.organization_id)));

create table public.saved_opportunities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, opportunity_id)
);
grant select, insert, delete on public.saved_opportunities to authenticated;
grant all on public.saved_opportunities to service_role;
alter table public.saved_opportunities enable row level security;
create policy "own saves" on public.saved_opportunities for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null, title text not null, body text, link text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
grant select, update, delete on public.notifications to authenticated;
grant all on public.notifications to service_role;
alter table public.notifications enable row level security;
create policy "own notifications read" on public.notifications for select to authenticated using (user_id = auth.uid());
create policy "own notifications update" on public.notifications for update to authenticated using (user_id = auth.uid());
create policy "own notifications delete" on public.notifications for delete to authenticated using (user_id = auth.uid());

-- signup trigger
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare t text := coalesce(new.raw_user_meta_data->>'account_type','student');
begin
  if t not in ('student','professional','organization') then t := 'student'; end if;
  insert into public.profiles (id, full_name, account_type)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''), t);
  insert into public.user_roles (user_id, role) values (new.id, case when t = 'organization' then 'organization'::app_role else 'seeker'::app_role end);
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- notifications on applications
create or replace function public.notify_application() returns trigger
language plpgsql security definer set search_path = public as $$
declare o record;
begin
  select op.title, op.id, org.owner_id into o from public.opportunities op join public.organizations org on org.id = op.organization_id where op.id = new.opportunity_id;
  if tg_op = 'INSERT' and o.owner_id is not null and new.status = 'applied' then
    insert into public.notifications (user_id, title, body, link) values (o.owner_id, 'New application', 'Someone applied to "' || o.title || '"', '/org');
  elsif tg_op = 'UPDATE' and new.status <> old.status then
    if auth.uid() is distinct from new.user_id then
      insert into public.notifications (user_id, title, body, link) values (new.user_id, 'Application update', 'Your application to "' || o.title || '" is now ' || new.status, '/opportunities/' || o.id);
    elsif new.status = 'applied' and o.owner_id is not null then
      insert into public.notifications (user_id, title, body, link) values (o.owner_id, 'New application', 'Someone applied to "' || o.title || '"', '/org');
    end if;
  end if;
  return new;
end $$;
create trigger applications_notify after insert or update on public.applications for each row execute function public.notify_application();

-- storage policies (bucket media): users write in their own folder
create policy "media public read" on storage.objects for select using (bucket_id = 'media');
create policy "media own upload" on storage.objects for insert to authenticated with check (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "media own update" on storage.objects for update to authenticated using (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "media own delete" on storage.objects for delete to authenticated using (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);

-- demo data
insert into public.organizations (id, name, description, location, website, verification_status, is_demo) values
('00000000-0000-4000-a000-000000000001','Savanna Tech Labs (Demo)','Fictional software company used for demonstration. Builds fintech and agritech products for East Africa.','Nairobi',null,'demo',true),
('00000000-0000-4000-a000-000000000002','Pamoja Community Trust (Demo)','Fictional NGO used for demonstration. Runs youth-led community development programs.','Kisumu',null,'demo',true),
('00000000-0000-4000-a000-000000000003','Elimu Bora Foundation (Demo)','Fictional education foundation used for demonstration. Funds university scholarships.','Mombasa',null,'demo',true),
('00000000-0000-4000-a000-000000000004','Digital Bridge Academy (Demo)','Fictional training institute used for demonstration. Teaches digital and data skills.','Nakuru',null,'demo',true),
('00000000-0000-4000-a000-000000000005','Hustle Hub Incubator (Demo)','Fictional incubator used for demonstration. Supports young entrepreneurs.','Eldoret',null,'demo',true);

insert into public.opportunities (organization_id, title, category, location, county, work_mode, participation_type, deadline, short_description, description, eligibility, skills, benefits, application_instructions, is_demo, created_at) values
('00000000-0000-4000-a000-000000000001','Software Engineering Internship','internship','Nairobi','Nairobi','hybrid','Internship · 6 months', current_date + 21,
 'Join a product team building mobile money tools used across Kenya.',
 'Work alongside senior engineers on a React and Node.js codebase. You will ship features, write tests and take part in code reviews. This is a demonstration listing.',
 array['Final-year student or recent graduate in Computer Science or related field','Based in or able to commute to Nairobi'], array['JavaScript or TypeScript','Git','Problem solving'], array['Monthly stipend','Mentorship from senior engineers','Certificate of completion'],
 'Submit your application on OpportunityHub with a short note about a project you built.', true, now() - interval '1 day'),
('00000000-0000-4000-a000-000000000001','Data Engineering Internship','internship','Remote (Kenya)','Nairobi','remote','Internship · 3 months', current_date + 5,
 'Help build data pipelines for agritech insights.',
 'Clean and model data from farmer co-operatives, build dashboards and automate reports. This is a demonstration listing.',
 array['Student or graduate in Statistics, CS or Engineering'], array['SQL','Python','Spreadsheets'], array['Stipend','Remote work allowance'],
 'Apply through OpportunityHub.', true, now() - interval '3 days'),
('00000000-0000-4000-a000-000000000002','Community Development Volunteer','volunteer','Kisumu','Kisumu','onsite','Volunteer · Part-time', current_date + 30,
 'Support youth-led clean water and sanitation projects in Kisumu.',
 'Volunteers coordinate community meetings, collect survey data and help run awareness events. This is a demonstration listing.',
 array['Aged 18–30','Available 2 days per week'], array['Communication','Teamwork','Swahili or Dholuo'], array['Transport allowance','Volunteer certificate','Leadership training'],
 'Apply through OpportunityHub and mention your availability.', true, now() - interval '2 days'),
('00000000-0000-4000-a000-000000000002','Youth Mentorship Volunteer','volunteer','Kisumu','Kisumu','hybrid','Volunteer · Flexible', current_date + 12,
 'Mentor secondary school students on career choices.',
 'Hold monthly sessions with students, share your career journey and help with goal setting. This is a demonstration listing.',
 array['University student or graduate'], array['Mentoring','Empathy'], array['Mentor training','Networking events'],
 'Apply through OpportunityHub.', true, now() - interval '6 days'),
('00000000-0000-4000-a000-000000000003','University Undergraduate Scholarship','scholarship','Mombasa','Mombasa','onsite','Scholarship · 4 years', current_date + 45,
 'Full tuition support for students from low-income households.',
 'Covers tuition, accommodation and a learning stipend for students joining a Kenyan public university. This is a demonstration listing.',
 array['KCSE mean grade of B+ or above','Household income below the program threshold','Kenyan citizen'], array['Academic excellence','Community involvement'], array['Full tuition','Accommodation','Laptop'],
 'Apply through OpportunityHub with a short personal statement.', true, now() - interval '4 days'),
('00000000-0000-4000-a000-000000000003','Women in STEM Scholarship','scholarship','Nationwide','Nairobi','remote','Scholarship · 1 year', current_date + 3,
 'Partial scholarship for young women studying science and technology.',
 'Supports tuition for one academic year plus access to a mentorship network. This is a demonstration listing.',
 array['Female student enrolled in a STEM degree','Aged 17–25'], array['STEM'], array['50% tuition','Mentorship'],
 'Apply through OpportunityHub.', true, now() - interval '8 days'),
('00000000-0000-4000-a000-000000000004','Digital Skills Bootcamp','training','Nakuru','Nakuru','onsite','Training · 8 weeks', current_date + 18,
 'Learn web basics, digital marketing and online freelancing.',
 'An intensive program covering digital literacy, social media marketing, and getting started as a freelancer. This is a demonstration listing.',
 array['Aged 18–35','Basic computer literacy'], array['Curiosity','Commitment'], array['Free training','Certificate','Job-readiness coaching'],
 'Apply through OpportunityHub.', true, now()),
('00000000-0000-4000-a000-000000000004','Data Analytics Training Program','training','Remote (East Africa)','Nakuru','remote','Training · 12 weeks', current_date + 9,
 'Hands-on training in Excel, SQL and Power BI.',
 'Weekly live classes and projects using real-world style datasets. This is a demonstration listing.',
 array['Graduate or final-year student'], array['Numeracy','Laptop access'], array['Certificate','Portfolio projects'],
 'Apply through OpportunityHub.', true, now() - interval '5 days'),
('00000000-0000-4000-a000-000000000005','Young Entrepreneurs Accelerator','training','Eldoret','Uasin Gishu','hybrid','Program · 6 months', current_date + 25,
 'Turn your business idea into a sustainable venture.',
 'Business model coaching, pitch training and access to seed funding opportunities. This is a demonstration listing.',
 array['Aged 18–35','Have a business idea or early-stage venture'], array['Initiative','Business thinking'], array['Seed grant eligibility','Mentors','Co-working space'],
 'Apply through OpportunityHub with a one-paragraph summary of your idea.', true, now() - interval '2 days'),
('00000000-0000-4000-a000-000000000005','Startup Operations Internship','internship','Eldoret','Uasin Gishu','onsite','Internship · 3 months', current_date + 14,
 'Support incubated startups with operations and research.',
 'Help early-stage founders with market research, bookkeeping and event coordination. This is a demonstration listing.',
 array['Business or related student'], array['Organisation','Excel'], array['Stipend','Startup exposure'],
 'Apply through OpportunityHub.', true, now() - interval '7 days');
