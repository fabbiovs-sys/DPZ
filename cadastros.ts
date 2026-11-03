export type Campo = {
  n: string; l: string;
  t?: "text" | "texto" | "number" | "select" | "image" | "bool" | "date" | "datefim";
  r?: boolean; nulo?: boolean; ref?: string; opcoes?: [string, string][];
};
export type Cadastro = { titulo: string; ordem: string; desc?: boolean; slugCom?: string[]; campos: Campo[] };

export const CADASTROS: Record<string, Cadastro> = {
  regioes: {
    titulo: "Regiões", ordem: "ordem", slugCom: ["nome"],
    campos: [{ n: "nome", l: "Nome", r: true }, { n: "slug", l: "Slug (opcional)" }, { n: "ordem", l: "Ordem", t: "number" }],
  },
  cidades: {
    titulo: "Cidades", ordem: "nome", slugCom: ["nome", "uf"],
    campos: [
      { n: "nome", l: "Cidade", r: true }, { n: "uf", l: "UF", r: true },
      { n: "regiao_id", l: "Região", t: "select", ref: "regioes" }, { n: "slug", l: "Slug (opcional)" },
    ],
  },
  organizadores: {
    titulo: "Organizadores", ordem: "nome",
    campos: [
      { n: "nome", l: "Nome", r: true }, { n: "site", l: "Site" }, { n: "email", l: "E-mail" },
      { n: "telefone", l: "Telefone" }, { n: "whatsapp", l: "WhatsApp" }, { n: "instagram", l: "Instagram (URL)" },
    ],
  },
  empresas: {
    titulo: "Fotografia e cronometragem", ordem: "nome",
    campos: [
      { n: "nome", l: "Empresa", r: true },
      { n: "tipo", l: "Tipo", t: "select", r: true, opcoes: [["fotografia", "Fotografia"], ["cronometragem", "Cronometragem"], ["outro", "Outro"]] },
      { n: "site", l: "Site" }, { n: "logo_url", l: "Logo", t: "image" },
    ],
  },
  parceiros: {
    titulo: "Parceiros", ordem: "nome", slugCom: ["nome"],
    campos: [
      { n: "nome", l: "Marca / parceiro", r: true }, { n: "site", l: "Site" }, { n: "slug", l: "Slug (opcional)" },
      { n: "contato_nome", l: "Contato comercial" }, { n: "contato_email", l: "E-mail comercial" }, { n: "contato_telefone", l: "Telefone" },
      { n: "tipo_parceria", l: "Parceria", t: "select", r: true, opcoes: [["nenhuma", "Nenhuma (sem acordo)"], ["afiliado", "Afiliado"], ["exclusiva", "Exclusiva"]] },
      { n: "comissao_acordada", l: "Comissão acordada" }, { n: "observacoes", l: "Observações" },
    ],
  },
  campanhas: {
    titulo: "Campanhas", ordem: "nome",
    campos: [
      { n: "nome", l: "Campanha", r: true }, { n: "parceiro_id", l: "Parceiro", t: "select", ref: "parceiros" },
      { n: "codigo_campanha", l: "Código da campanha (relatórios)" }, { n: "inicio", l: "Início", t: "date" }, { n: "fim", l: "Fim", t: "datefim" },
      { n: "condicoes", l: "Condições" }, { n: "comissao_acordada", l: "Comissão acordada" },
    ],
  },
  cupons: {
    titulo: "Cupons e ofertas", ordem: "titulo",
    campos: [
      { n: "marca", l: "Marca (nome público)", r: true }, { n: "titulo", l: "Título", r: true }, { n: "descricao", l: "Descrição" },
      { n: "codigo", l: "Código promocional" },
      { n: "tipo_desconto", l: "Tipo de desconto", t: "select", r: true, opcoes: [["percentual", "Percentual"], ["valor", "Valor (R$)"], ["frete", "Frete"], ["brinde", "Brinde"], ["outro", "Outro"]] },
      { n: "valor", l: "Valor do desconto", t: "number", nulo: true },
      { n: "categoria", l: "Categoria", t: "select", r: true, opcoes: [["inscricoes", "Inscrições"], ["tenis", "Tênis e calçados"], ["roupas", "Roupas esportivas"], ["relogios", "Relógios GPS e tecnologia"], ["acessorios", "Acessórios"], ["nutricao", "Nutrição e hidratação"], ["assessorias", "Academias e assessorias"], ["turismo", "Turismo esportivo"], ["outros", "Outros"]] },
      { n: "tipo_parceria", l: "Tipo de oferta", t: "select", r: true, opcoes: [["publico", "Cupom público"], ["afiliado", "Link de afiliado"], ["exclusivo", "Exclusivo Drop Zero"]] },
      { n: "url_destino", l: "Link de destino (https)", r: true }, { n: "condicoes", l: "Condições e restrições" },
      { n: "inicio", l: "Início", t: "date" }, { n: "validade", l: "Validade", t: "datefim" },
      { n: "verificacao", l: "Verificação", t: "select", r: true, opcoes: [["nao_verificado", "Não verificado"], ["validade_informada", "Validade informada"], ["revisado", "Revisado"], ["confirmado", "Desconto confirmado"]] },
      { n: "status", l: "Status", t: "select", r: true, opcoes: [["rascunho", "Rascunho"], ["publicado", "Publicado"], ["arquivado", "Arquivado"]] },
      { n: "evento_id", l: "Prova relacionada", t: "select", ref: "eventos" }, { n: "parceiro_id", l: "Parceiro", t: "select", ref: "parceiros" },
      { n: "campanha_id", l: "Campanha", t: "select", ref: "campanhas" }, { n: "origem", l: "Origem da oferta (interno)" },
    ],
  },
  canais_video: {
    titulo: "Canais de vídeo", ordem: "prioridade",
    campos: [
      { n: "nome", l: "Canal", r: true }, { n: "url", l: "Link do canal (https://www.youtube.com/...)" },
      { n: "youtube_channel_id", l: "ID do canal (UC..., opcional)" },
      { n: "categoria", l: "Categoria", t: "select", r: true, opcoes: [["geral", "Geral"], ["treinamento", "Treinamento e performance"], ["tenis", "Reviews de tênis"], ["provas", "Maratonas e provas"], ["historias", "Histórias de corredores"], ["iniciantes", "Corrida para iniciantes"], ["trail", "Trail run e montanha"]] },
      { n: "prioridade", l: "Prioridade (menor aparece antes)", t: "number" },
      { n: "ativo", l: "Ativo", t: "bool" }, { n: "observacoes", l: "Observações (interno)" },
    ],
  },
  fontes_eventos: {
    titulo: "Fontes de eventos", ordem: "nome",
    campos: [
      { n: "nome", l: "Fonte", r: true },
      { n: "tipo", l: "Tipo", t: "select", r: true, opcoes: [["api", "API autorizada"], ["feed", "Feed estruturado"], ["pagina_publica", "Página pública do organizador"], ["site_inscricao", "Site de inscrições"], ["formulario", "Formulário do organizador"], ["csv", "Importação CSV"], ["manual", "Cadastro manual"]] },
      { n: "url", l: "Endereço (https)" }, { n: "regiao_id", l: "Região", t: "select", ref: "regioes" },
      { n: "frequencia_horas", l: "Consultar a cada (horas)", t: "number", nulo: true }, { n: "ativo", l: "Ativa", t: "bool" },
      { n: "licenca_observacoes", l: "Termos de uso, custo, licença e cobertura avaliados", t: "texto" },
      { n: "ultimo_status", l: "Última execução (automático)" }, { n: "ultimo_erro", l: "Último erro (automático)" },
    ],
  },
  fontes_editoriais: {
    titulo: "Fontes editoriais", ordem: "nome",
    campos: [
      { n: "nome", l: "Fonte", r: true },
      { n: "tipo", l: "Tipo", t: "select", r: true, opcoes: [["rss", "Feed RSS/Atom"], ["federacao", "Federação"], ["marca", "Marca"], ["site_oficial", "Site oficial"], ["manual", "Manual"]] },
      { n: "url_feed", l: "Endereço do feed (https)" }, { n: "site", l: "Site" },
      { n: "categoria_padrao", l: "Categoria padrão", t: "select", r: true, opcoes: [["noticias", "Notícias"], ["treino", "Treino"], ["iniciantes", "Iniciantes"], ["nutricao", "Nutrição"], ["saude", "Saúde"], ["equipamentos", "Equipamentos"], ["provas", "Cobertura de provas"], ["historias", "Histórias"]] },
      { n: "frequencia_horas", l: "Consultar a cada (horas)", t: "number" }, { n: "ativo", l: "Ativa", t: "bool" },
      { n: "ultimo_status", l: "Última execução (automático)" }, { n: "ultimo_erro", l: "Último erro (automático)" }, { n: "observacoes", l: "Observações" },
    ],
  },
  artigos: {
    titulo: "Artigos e notícias", ordem: "criado_em", desc: true, slugCom: ["titulo"],
    campos: [
      { n: "titulo", l: "Título", r: true }, { n: "slug", l: "Endereço (opcional)" },
      { n: "tipo", l: "Tipo", t: "select", r: true, opcoes: [["editorial", "Editorial (texto da equipe)"], ["curadoria", "Curadoria (indicação com crédito)"]] },
      { n: "categoria", l: "Categoria", t: "select", r: true, opcoes: [["noticias", "Notícias"], ["treino", "Treino"], ["iniciantes", "Iniciantes"], ["nutricao", "Nutrição"], ["saude", "Saúde"], ["equipamentos", "Equipamentos"], ["provas", "Cobertura de provas"], ["historias", "Histórias"]] },
      { n: "status", l: "Etapa", t: "select", r: true, opcoes: [["descoberto", "Descoberto"], ["aguardando_revisao", "Aguardando revisão"], ["aprovado", "Aprovado"], ["em_edicao", "Em edição"], ["agendado", "Agendado"], ["publicado", "Publicado"], ["arquivado", "Arquivado"], ["rascunho", "Rascunho"]] },
      { n: "resumo", l: "Resumo (texto próprio)", t: "texto" }, { n: "corpo", l: "Texto (parágrafos separados por linha em branco; ## para subtítulo)", t: "texto" },
      { n: "autor", l: "Autor / especialista" }, { n: "imagem_url", l: "Imagem (use apenas com autorização)", t: "image" },
      { n: "url_original", l: "Link original (curadoria)" }, { n: "credito", l: "Crédito da fonte" },
      { n: "destaque", l: "Destaque", t: "bool" }, { n: "publicar_em", l: "Publicar a partir de", t: "date" },
    ],
  },
  publicidade: {
    titulo: "Publicidade", ordem: "anunciante",
    campos: [
      { n: "anunciante", l: "Anunciante", r: true }, { n: "imagem_url", l: "Imagem do anúncio", t: "image", r: true },
      { n: "link", l: "Link de destino", r: true },
      { n: "posicao", l: "Posição", t: "select", opcoes: [["evento", "Página da prova"], ["home", "Página inicial"]] },
      { n: "inicio", l: "Início", t: "date" }, { n: "fim", l: "Fim", t: "datefim" },
      { n: "ativo", l: "Ativo", t: "bool" },
    ],
  },
};
