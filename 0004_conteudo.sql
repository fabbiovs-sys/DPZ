-- Fase 3: central editorial (artigos, notícias, curadoria) e registro de tarefas automáticas. Rode DEPOIS de 0003_videos.sql.
create table fontes_editoriais (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  tipo text not null default 'rss' check (tipo in ('rss','federacao','marca','site_oficial','manual')),
  url_feed text check (url_feed is null or url_feed ~* '^https://'),
  site text check (site is null or site ~* '^https?://'),
  categoria_padrao text not null default 'noticias',
  frequencia_horas int not null default 24 check (frequencia_horas >= 1),
  ativo boolean not null default true,
  ultima_execucao timestamptz, ultimo_status text, ultimos_encontrados int, ultimo_erro text,
  observacoes text, criado_em timestamptz not null default now()
);
create table artigos (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  titulo text not null,
  tipo text not null default 'editorial' check (tipo in ('editorial','curadoria')),   -- curadoria = indicação com crédito e link da fonte
  categoria text not null default 'noticias' check (categoria in ('noticias','treino','iniciantes','nutricao','saude','equipamentos','provas','historias')),
  resumo text, corpo text, autor text, imagem_url text check (imagem_url is null or imagem_url ~* '^https?://'),
  fonte_id uuid references fontes_editoriais(id) on delete set null,
  url_original text check (url_original is null or url_original ~* '^https?://'),
  credito text,
  status text not null default 'rascunho' check (status in ('descoberto','aguardando_revisao','aprovado','em_edicao','agendado','publicado','arquivado','rascunho')),
  destaque boolean not null default false,
  publicar_em timestamptz, publicado_em timestamptz,
  criado_em timestamptz not null default now(), atualizado_em timestamptz not null default now()
);
create unique index artigos_url_original on artigos (url_original) where url_original is not null;   -- evita duplicatas
create index artigos_status_data on artigos (status, publicado_em desc);
create trigger artigos_atualizado before update on artigos for each row execute function set_atualizado_em();

create table execucoes_tarefas (       -- log de tarefas automáticas (sem dados pessoais)
  id bigint generated always as identity primary key,
  tarefa text not null, inicio timestamptz not null default now(), fim timestamptz,
  status text not null default 'ok' check (status in ('ok','parcial','erro')),
  detalhes jsonb
);

do $$ declare t text; begin
  foreach t in array array['fontes_editoriais','artigos','execucoes_tarefas'] loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy "admin total" on %I for all using (is_admin()) with check (is_admin())', t);
  end loop;
end $$;
-- Público só lê o que está publicado (e, se agendado, já na hora de sair).
create policy "leitura publica" on artigos for select
  using (status = 'publicado' and (publicar_em is null or publicar_em <= now()));
