-- Drop Zero — esquema inicial (Supabase / PostgreSQL). Sem dados de exemplo.
create extension if not exists pgcrypto;

create table regioes (
  id uuid primary key default gen_random_uuid(),
  nome text not null, slug text unique not null, ordem int not null default 0
);
create table cidades (
  id uuid primary key default gen_random_uuid(),
  nome text not null, uf char(2) not null, slug text unique not null,
  regiao_id uuid references regioes(id) on delete set null
);
create table organizadores (
  id uuid primary key default gen_random_uuid(),
  nome text not null, site text, email text, telefone text, whatsapp text, instagram text,
  outros_canais jsonb not null default '[]'  -- [{"rotulo":"Facebook","url":"..."}]
);
create table empresas (  -- fotografia, cronometragem etc.
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  tipo text not null check (tipo in ('fotografia','cronometragem','outro')),
  site text, logo_url text
);
create table eventos (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, nome text not null, descricao text,
  data_inicio timestamptz not null, data_fim timestamptz,
  cidade_id uuid references cidades(id), local_nome text, endereco text,
  organizador_id uuid references organizadores(id),
  url_inscricao text, preco_a_partir numeric(10,2), banner_url text,
  status text not null default 'rascunho'
    check (status in ('rascunho','em_revisao','publicado','adiado','cancelado')),
  verificado_em timestamptz,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
create index on eventos (data_inicio);

create table distancias (
  id uuid primary key default gen_random_uuid(),
  evento_id uuid not null references eventos(id) on delete cascade,
  rotulo text not null, km numeric(6,2), preco numeric(10,2)
);
create table evento_empresas (  -- vincula foto/cronometragem a cada prova
  evento_id uuid not null references eventos(id) on delete cascade,
  empresa_id uuid not null references empresas(id) on delete cascade,
  papel text not null check (papel in ('fotografia','cronometragem','outro')),
  url text,  -- galeria de fotos ou página de resultados da prova
  primary key (evento_id, empresa_id, papel)
);
create table documentos (
  id uuid primary key default gen_random_uuid(),
  evento_id uuid not null references eventos(id) on delete cascade,
  tipo text not null check (tipo in ('regulamento','cancelamento','privacidade','responsabilidade','outro')),
  titulo text not null, url text not null, publicado_em date
);
create table fontes (
  id uuid primary key default gen_random_uuid(),
  evento_id uuid not null references eventos(id) on delete cascade,
  tipo text not null check (tipo in ('organizador','site_oficial','cronometragem','inscricao','manual','outro')),
  descricao text, url text, publica boolean not null default false,  -- publica=false: origem só no painel
  coletada_em timestamptz not null default now()
);
create table historico_verificacao (
  id uuid primary key default gen_random_uuid(),
  evento_id uuid not null references eventos(id) on delete cascade,
  verificado_em timestamptz not null default now(),
  verificado_por text, campo text, valor_anterior text, valor_novo text, observacao text
);
create table publicidade (
  id uuid primary key default gen_random_uuid(),
  anunciante text not null, imagem_url text not null, link text not null,
  posicao text not null default 'evento',
  evento_id uuid references eventos(id) on delete cascade,  -- nulo = vale para todas as provas
  inicio timestamptz, fim timestamptz, ativo boolean not null default true
);
create table admins (user_id uuid primary key references auth.users(id) on delete cascade);

create function set_atualizado_em() returns trigger language plpgsql as
$$ begin new.atualizado_em = now(); return new; end $$;
create trigger eventos_atualizado before update on eventos
  for each row execute function set_atualizado_em();

create function is_admin() returns boolean language sql security definer stable
set search_path = public as
$$ select exists (select 1 from admins where user_id = auth.uid()) $$;

-- Segurança (RLS): visitantes só leem; só admins escrevem.
do $$ declare t text; begin
  foreach t in array array['regioes','cidades','organizadores','empresas','eventos','distancias','evento_empresas',
    'documentos','fontes','historico_verificacao','publicidade','admins'] loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy "admin total" on %I for all using (is_admin()) with check (is_admin())', t);
  end loop;
  foreach t in array array['regioes','cidades','organizadores','empresas'] loop
    execute format('create policy "leitura publica" on %I for select using (true)', t);
  end loop;
  foreach t in array array['distancias','evento_empresas','documentos','historico_verificacao'] loop
    execute format('create policy "leitura publica" on %I for select using (exists (select 1 from eventos e where e.id = evento_id and e.status in (''publicado'',''adiado'',''cancelado'')))', t);
  end loop;
end $$;
create policy "leitura publica" on eventos for select using (status in ('publicado','adiado','cancelado'));
create policy "leitura publica" on publicidade for select using
  (ativo and (inicio is null or inicio <= now()) and (fim is null or fim >= now()));

create policy "leitura publica" on fontes for select using
  (publica and exists (select 1 from eventos e where e.id = evento_id and e.status in ('publicado','adiado','cancelado')));

-- Imagens (banners das provas, logos, publicidade): bucket público, só admins gravam.
insert into storage.buckets (id, name, public) values ('banners', 'banners', true) on conflict (id) do nothing;
create policy "banners leitura" on storage.objects for select using (bucket_id = 'banners');
create policy "banners admin envia" on storage.objects for insert with check (bucket_id = 'banners' and public.is_admin());
create policy "banners admin atualiza" on storage.objects for update using (bucket_id = 'banners' and public.is_admin());
create policy "banners admin apaga" on storage.objects for delete using (bucket_id = 'banners' and public.is_admin());

-- Para se tornar admin (depois de criar seu usuário em Authentication > Users):
-- insert into admins (user_id) values ('UUID-DO-SEU-USUARIO');
