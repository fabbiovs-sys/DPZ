-- Fase 2: fila de revisão de provas, detecção de duplicatas e cadastro de fontes de eventos. Rode DEPOIS de 0004_conteudo.sql.
alter table eventos drop constraint if exists eventos_status_check;
alter table eventos add constraint eventos_status_check
  check (status in ('rascunho','em_revisao','publicado','adiado','cancelado','rejeitado'));
alter table eventos
  add column if not exists duplicata_de uuid references eventos(id) on delete set null,
  add column if not exists motivo_revisao text;
create index if not exists eventos_revisao on eventos (status, data_inicio);

create table fontes_eventos (   -- de onde vêm as provas: API autorizada, feed, página pública, formulário, CSV, manual
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  tipo text not null default 'csv' check (tipo in ('api','feed','pagina_publica','site_inscricao','formulario','csv','manual')),
  url text check (url is null or url ~* '^https?://'),
  regiao_id uuid references regioes(id) on delete set null,
  frequencia_horas int check (frequencia_horas is null or frequencia_horas >= 1),
  ativo boolean not null default true,
  ultima_execucao timestamptz, ultimo_status text, ultimos_encontrados int, ultimo_erro text,
  licenca_observacoes text,      -- termos de uso, custo, licença e cobertura avaliados ANTES de integrar
  criado_em timestamptz not null default now()
);
alter table fontes_eventos enable row level security;
create policy "admin total" on fontes_eventos for all using (is_admin()) with check (is_admin());
