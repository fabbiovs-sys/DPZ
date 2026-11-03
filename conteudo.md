# Central de conteúdo do Drop Zero

## O que um portal como a Ativo oferece hoje (observado na página inicial)
Calendário e resultados · Corrida de rua (notícias, treinamento, iniciantes) · outras modalidades · nutrição · saúde · últimas notícias · especialistas (colunas assinadas) · guia de tênis · "Por que dói" (lesões) · vídeos · playlists · planilhas de treino · calculadoras · newsletter · anúncios · aplicativo.

## O que o Drop Zero tem e o que falta
| Área | Situação |
|---|---|
| Calendário, página de cada prova, favoritos, agenda | Feito (Fase 1) |
| Ferramentas: pace, parciais, previsão de tempo, GPX, checklist | Feito |
| Vídeos de canais indicados | Feito (3 canais) |
| Notícias, treino, nutrição, saúde: central editorial (`/conteudo`) | **Estrutura pronta**, sem texto publicado: precisa de equipe/fontes |
| Descoberta automática de novos conteúdos (RSS) | Pronta; precisa de feeds autorizados e `CRON_SECRET` |
| Especialistas (nutricionista, fisioterapeuta, treinador) | Precisa de parceria com profissionais |
| Guia de tênis | Futuro (conteúdo próprio + links de afiliados) |
| Planilhas de treino | Futuro (precisa de revisão de um treinador) |
| Newsletter | Futuro (serviço de e-mail + consentimento LGPD) |
| Playlists | Opcional (conta própria no Spotify) |

## Como o fluxo editorial funciona
1. **Descoberto:** a rotina `/api/cron/rss` lê os feeds cadastrados e guarda só título, link, data e fonte.
2. **Revisão:** a equipe abre o item em *Artigos e notícias*, escreve um **resumo próprio** e escolhe a categoria.
3. **Publicação:** curadoria exige link original, crédito e resumo próprio; editorial exige o texto. Nada é publicado automaticamente.
4. **Editorial:** textos escritos pela equipe ou por especialistas, com autor.

## Regras
- Não copiar textos, fotos ou vídeos de terceiros. Curadoria = título, crédito, link e resumo escrito por nós.
- Saúde e nutrição: revisão por profissional habilitado antes de publicar; a página mostra o aviso de que o conteúdo não substitui orientação profissional.
- Só cadastrar feeds de fontes que permitam o uso; confira os termos de cada site.

## Pautas para começar (ideias, sem fatos a verificar)
Treino: como montar a semana de treino para 5K · treino intervalado para quem está começando · como usar o pace nas provas · treino de força para corredores · como se preparar na semana da prova.
Iniciantes: primeira corrida de 5K, passo a passo · como escolher uma prova · o que levar no dia · erros comuns de quem começa.
Nutrição: hidratação no treino e na prova · o que comer antes de correr cedo · alimentação no dia seguinte à prova.
Saúde: sono e desempenho · o que fazer ao sentir dor no joelho ou na canela (quando procurar um profissional) · recuperação depois de uma meia maratona.
Equipamentos: como escolher o tênis para o seu tipo de treino · quando trocar o tênis · acessórios para corrida noturna.
Provas e histórias: perfis de grupos de corrida de Goiás · bastidores de uma prova · resumo do mês das corridas na região.
