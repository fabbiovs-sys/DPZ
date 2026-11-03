-- Fase 1: modalidade e inscrições, parceiros, campanhas, cupons e cliques rastreáveis.
-- Rode DEPOIS de schema.sql.

alter table eventos
  add column if not exists modalidade text not null default 'rua'
    check (modalidade in ('rua','trail','montanha','obstaculos','hibrido','outra')),
  add column if not exists inscricoes text not null default 'desconhecido'
    check (inscricoes in ('desconhecido','em_breve','abertas','encerradas')),
  add column if not exists retirada_kit text,
  add column if not exists percurso_url text;
alter table eventos add constraint eventos_urls_http
  check ((url_inscricao is null or url_inscricao ~* '^https?://') and (percurso_url is null or percurso_url ~* '^https?://')) not valid;
create index if not exists eventos_status_data on eventos (status, data_inicio);

create table parceiros (            -- marcas, lojas e organizadores parceiros (dados comerciais: PRIVADOS)
  id uuid primary key default gen_random_uuid(),
  nome text not null, slug text unique, site text,
  contato_nome text, contato_email text, contato_telefone text,
  tipo_parceria text not null default 'nenhuma' check (tipo_parceria in ('nenhuma','afiliado','exclusiva')),
  comissao_acordada text, observacoes text,
  criado_em timestamptz not null default now()
);
create table campanhas (
  id uuid primary key default gen_random_uuid(),
  parceiro_id uuid references parceiros(id) on delete cascade,
  nome text not null, codigo_campanha text unique,   -- identificador usado nos relatórios
  inicio timestamptz, fim timestamptz, condicoes text, comissao_acordada text,
  criado_em timestamptz not null default now()
);
create table cupons (
  id uuid primary key default gen_random_uuid(),
  marca text not null,              -- nome público da marca (o cadastro do parceiro é privado)
  parceiro_id uuid references parceiros(id) on delete set null,
  campanha_id uuid references campanhas(id) on delete set null,
  evento_id uuid references eventos(id) on delete set null,   -- oferta ligada a uma prova específica
  titulo text not null, descricao text, codigo text,
  tipo_desconto text not null default 'outro' check (tipo_desconto in ('percentual','valor','frete','brinde','outro')),
  valor numeric(10,2), condicoes text,
  categoria text not null default 'outros' check (categoria in ('inscricoes','tenis','roupas','relogios','acessorios','nutricao','assessorias','turismo','outros')),
  tipo_parceria text not null default 'publico' check (tipo_parceria in ('publico','afiliado','exclusivo')),
  url_destino text not null check (url_destino ~* '^https?://'),
  inicio timestamptz, validade timestamptz,
  verificacao text not null default 'nao_verificado' check (verificacao in ('nao_verificado','validade_informada','revisado','confirmado')),
  verificado_em timestamptz,
  status text not null default 'rascunho' check (status in ('rascunho','publicado','arquivado')),
  origem text,
  criado_em timestamptz not null default now(), atualizado_em timestamptz not null default now()
);
create index cupons_status_validade on cupons (status, validade);
create index cupons_evento on cupons (evento_id);
create trigger cupons_atualizado before update on cupons for each row execute function set_atualizado_em();

create table cliques (               -- sem dados pessoais: só tipo, alvo, campanha e o domínio de origem
  id bigint generated always as identity primary key,
  tipo text not null check (tipo in ('cupom_acesso','cupom_copia','inscricao_acesso')),
  cupom_id uuid references cupons(id) on delete set null,
  evento_id uuid references eventos(id) on delete set null,
  campanha_id uuid references campanhas(id) on delete set null,
  origem text,
  criado_em timestamptz not null default now()
);
create index cliques_data on cliques (criado_em);
create index cliques_tipo_data on cliques (tipo, criado_em);

-- Segurança (RLS)
do $$ declare t text; begin
  foreach t in array array['parceiros','campanhas','cupons','cliques'] loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy "admin total" on %I for all using (is_admin()) with check (is_admin())', t);
  end loop;
end $$;
create policy "leitura publica" on cupons for select using (status = 'publicado');

-- O redirecionamento nunca usa URL vinda do navegador: o destino é lido do banco, só de registros publicados.
create function resolver_clique(p_tipo text, p_id uuid, p_origem text default null)
returns text language plpgsql security definer set search_path = public as $$
declare v_url text; v_evento uuid; v_campanha uuid;
begin
  if p_tipo = 'cupom' then
    select url_destino, evento_id, campanha_id into v_url, v_evento, v_campanha from cupons
      where id = p_id and status = 'publicado' and (validade is null or validade >= now());
    if v_url is null then return null; end if;
    insert into cliques (tipo, cupom_id, evento_id, campanha_id, origem) values ('cupom_acesso', p_id, v_evento, v_campanha, left(p_origem, 120));
  elsif p_tipo = 'inscricao' then
    select url_inscricao into v_url from eventos where id = p_id and status in ('publicado','adiado');
    if v_url is null then return null; end if;
    insert into cliques (tipo, evento_id, origem) values ('inscricao_acesso', p_id, left(p_origem, 120));
  end if;
  return v_url;
end $$;
create function registrar_copia(p_id uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  insert into cliques (tipo, cupom_id, evento_id, campanha_id)
    select 'cupom_copia', id, evento_id, campanha_id from cupons where id = p_id and status = 'publicado';
end $$;
revoke all on function resolver_clique(text, uuid, text) from public;
revoke all on function registrar_copia(uuid) from public;
grant execute on function resolver_clique(text, uuid, text) to anon, authenticated;
grant execute on function registrar_copia(uuid) to anon, authenticated;
