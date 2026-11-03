# Drop Zero — portal inteligente do corredor

Projeto Next.js (App Router) + TypeScript + Supabase (PostgreSQL, login e imagens). Publicação sugerida: GitHub + Vercel.

> **Estado real (leia primeiro):** a **Fase 1** está escrita. Foram executados: 5 testes automatizados da lógica (pace, parciais, KML→GPX, completude, URL segura) e uma verificação de sintaxe de todos os arquivos TypeScript. **Não foram executados** `npm install`, `npm run build`, o SQL em um Postgres real nem testes no celular, porque o ambiente onde o código foi escrito não tem internet. O primeiro passo no seu computador é `npm install && npm run build` (veja "Como rodar"). As Fases 2, 3 e 4 **não foram iniciadas**.

## A. Diagnóstico
- Havia dois artefatos: (1) o protótipo estático em HTML/CSS/JS e (2) este projeto Next.js, criado depois, com layout escuro.
- O **design aprovado** é o da página publicada (cabeçalho claro, hero escuro, verde-água do manual, Montserrat). Esta versão leva esse tema para o Next.js (`app/globals.css`, `app/layout.tsx`, hero com palavras do manual e logotipo vetorial em movimento).
- Não há arquivos duplicados no projeto. O protótipo HTML não faz parte deste pacote.

## B. Tecnologias
Next.js 15, React 19, TypeScript, Supabase (`@supabase/supabase-js`, `@supabase/ssr`), CSS puro. Sem bibliotecas de interface.

## C. O que existe (Fase 1)
- **Calendário:** busca (nome, cidade, UF, organizador), filtros (região, distância, modalidade, situação das inscrições, mês), vista em lista e em calendário mensal, provas agrupadas por região.
- **Página da prova:** dados, banner, distâncias, modalidade, inscrições, retirada de kit, percurso, fotos/cronometragem, documentos, organizador, fontes e atualização (data, completude, verificação, histórico), ofertas ligadas à prova, provas relacionadas, favoritos, Google Agenda, .ics, compartilhar. SEO: título/descrição, canonical, Open Graph, dados estruturados `SportsEvent`, `noindex` para provas passadas/canceladas.
- **Imagem da prova:** toda prova tem a arte Drop Zero (gerada com o nome); quando um banner oficial é enviado no painel, as duas imagens se alternam sozinhas (com pausa ao passar o mouse e respeito a "reduzir movimento"). Use apenas imagens que o organizador autorizou.
- **Benefícios (`/beneficios`):** cupons cadastrados manualmente, filtros e ordenação, validade, estado de verificação (não verificado / validade informada / revisado / desconto confirmado), aviso de afiliado, ofertas encerradas em área separada.
- **Links rastreáveis (`/go/...`):** cliques em ofertas e em inscrições e cópias de código viram registros sem dados pessoais. O destino vem do banco, nunca da URL (evita redirecionamento malicioso).
- **Ferramentas (`/ferramentas`):** pace, parciais, conversor KML→GPX (no navegador), checklist do dia da prova. Estimativas, não garantias.
- **Painel (`/admin`):** login; provas (banner, distâncias, empresas, documentos, origem interna, verificação, completude); cadastros de organizadores, empresas, regiões, cidades, parceiros, campanhas, cupons e publicidade; importação CSV (como rascunho); painel com números reais.
- **Segurança:** políticas RLS no banco; só administradores escrevem; chave secreta nunca vai ao navegador (só a chave pública *anon*); URLs validadas (http/https).

## D. Riscos e limites conhecidos
- Código **não compilado** ainda: podem aparecer erros de tipo/dependência no primeiro `build`. Se aparecerem, envie a mensagem para correção.
- O SQL não foi executado em um Postgres real.
- Perfis separados (editor, corredor, parceiro) **não existem**: hoje só há administrador.
- Favoritos ficam no aparelho (sem conta). Não há impressões de ofertas nem relatórios por campanha ainda.
- O agrupamento das cidades por região é uma sugestão: ajuste em Regiões e Cidades.
- `app/privacidade` é um modelo: revise com um profissional jurídico.

## E. Plano por fases
| Fase | Conteúdo | Situação |
|---|---|---|
| 1 | Fundação: calendário, páginas de prova, banco, painel, cupons manuais, links rastreáveis, deploy | Escrita; falta rodar o build |
| 2 | Importação automática, deduplicação, fila de revisão, histórico de alterações, importação de cupons, alertas de validade | **Parcial:** importação CSV com detecção de duplicatas e de possíveis mudanças de data, **fila de revisão** (aprovar, rejeitar, mesclar, aceitar nova data), cadastro de fontes de eventos, relatório de cliques. Falta: coleta automática por API/feed/página (cada fonte precisa de avaliação de licença), importação de cupons, alertas de validade por e-mail |
| 3 | RSS e notícias com fila editorial, YouTube, radar de tendências | **Parcial:** central editorial (`/conteudo`, artigos editoriais e curadoria, fila de revisão, fontes RSS, rotina diária e log de tarefas). Vídeos:** canais de vídeo cadastráveis e página `/videos` (vídeos recentes pelo feed público do YouTube, por canal). Falta: API oficial do YouTube, radar de tendências, textos e feeds de verdade (nenhum conteúdo foi publicado), newsletter. Detalhes em `docs/conteudo.md` |
| 4 | Cupons exclusivos, relatórios comerciais, perfis de usuário, conta do corredor, expansão (DF e MT) | Não iniciada |

## F. Serviços, contas e custos
- **Supabase** (obrigatório): plano gratuito para testar; para produção, confira o preço atual (o gratuito pausa por inatividade).
- **Vercel**: o plano gratuito é para uso não comercial; uso comercial exige plano pago. Confira os preços atuais.
- **GitHub** (gratuito) para versionar.
- **Domínio** .com.br (Registro.br).
- **YouTube Data API** (Fase 3): chave gratuita com cota diária.
- **Redes de afiliados** (Fase 4): cadastro em cada programa; só afirme parceria quando existir acordo.

## Variáveis de ambiente (além das de sempre)
- `CRON_SECRET`: senha longa e aleatória que protege `/api/cron/rss` (a Vercel a envia sozinha ao agendar).
- `SUPABASE_SERVICE_ROLE_KEY`: chave de serviço, **só no servidor** (Vercel > Environment Variables). Nunca coloque no navegador nem em arquivos do repositório.

## Como rodar
1. `npm install`
2. Crie um projeto no Supabase. No **SQL Editor**, execute **nesta ordem**: `supabase/schema.sql`, `supabase/0002_fase1.sql`, `supabase/0003_videos.sql`, `supabase/0004_conteudo.sql`, `supabase/0005_fase2.sql`, `supabase/seed_regioes_goias.sql` e `supabase/seed_canais_video.sql`.
3. Em Authentication > Users, crie seu usuário; depois execute `insert into admins (user_id) values ('UUID-DO-USUARIO');`.
4. Copie `.env.example` para `.env.local` e preencha `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (chave **anon**; nunca a service_role) e `NEXT_PUBLIC_SITE_URL`.
5. `npm test` (lógica), `npm run build` (confere se compila) e `npm run dev` → http://localhost:3000
6. Acesse `/admin`, importe `supabase/seed_goias.csv` (entram como rascunho), revise, verifique e publique.

## Publicar
1. Suba o código no GitHub (o `.gitignore` já exclui `.env.local`).
2. Na Vercel, importe o repositório e cadastre as variáveis do `.env.example`.
3. Conecte o domínio. Depois, envie `https://seudominio.com.br/sitemap.xml` ao Google Search Console.
4. **Rollback:** a Vercel mantém cada deploy anterior; para voltar, promova o deploy anterior no painel. Mudanças no banco devem ser feitas por novos arquivos SQL numerados (`0003_...`), nunca editando os antigos.

## Estrutura
`app/` páginas e rotas · `app/admin/` painel · `app/go/` redirecionamento rastreável · `components/` interface · `lib/` lógica pura (testada em `tests/`) · `supabase/` banco e dados iniciais.
