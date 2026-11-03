-- Fase 3 (parte inicial): canais de vídeo. Rode DEPOIS de 0002_fase1.sql.
create table canais_video (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  url text check (url is null or url ~* '^https://(www\.|m\.)?youtube\.com/'),   -- link público do canal
  youtube_channel_id text check (youtube_channel_id is null or youtube_channel_id ~ '^UC[0-9A-Za-z_-]{22}$'),
  categoria text not null default 'geral' check (categoria in ('geral','treinamento','tenis','provas','historias','iniciantes','trail')),
  prioridade int not null default 100,
  ativo boolean not null default true,
  observacoes text,
  criado_em timestamptz not null default now()
);
alter table canais_video enable row level security;
create policy "admin total" on canais_video for all using (is_admin()) with check (is_admin());
create policy "leitura publica" on canais_video for select using (ativo);
