/**
 * ============================================================================
 *  ARQUIVO DE CONTEÚDO DO SITE DA MANUZINHA
 * ============================================================================
 *
 *  Como colocar ou trocar fotos, vídeos e o link do TikTok:
 *  - Fotos: coloque em assets/imagens/ e informe o caminho (ex: "assets/imagens/foto-1.jpg")
 *  - Vídeos: coloque em assets/videos/ e informe o caminho (ex: "assets/videos/video-1.mp4")
 *  - TikTok: preencha `geral.tiktokUrl` com o link completo (ex: "https://www.tiktok.com/@usuario")
 */

window.SITE_CONTEUDO = {
  // --------------------------------------------------------------------------
  // CONFIGURAÇÕES GERAIS E CORREDOR DAS PORTAS (LOBBY)
  // --------------------------------------------------------------------------
  geral: {
    tituloAba: "Manuzinha • Tecido Acrobático & Lira",
    nomeMarca: "Circo da Manuzinha",
    etiquetaTopo: "ASA SUL, BRASÍLIA – DF • ARTE NAS ALTURAS",
    tituloLobby: "Bem-vindo ao Universo da Manuzinha!",
    subtituloLobby:
      "Alegria, arte de expressão!! Escolha uma porta para explorar a história e a vitrine no tecido acrobático e na lira.",
    rodapeTexto:
      "Manuela da Mata Teixeira Corrêa • Asa Sul, Brasília – DF • Tecido Acrobático & Lira",
    // Link do TikTok da Manuzinha
    tiktokUrl: "https://www.tiktok.com/@corvermelha_?_r=1",
    tiktokTexto: "TikTok (@corvermelha_)",
  },

  // Configuração visual e texto das 3 portas do corredor inicial
  portas: [
    {
      id: "boas-vindas",
      numero: "01",
      titulo: "A Grande Tenda",
      subtitulo: "Conheça a Manuzinha",
      descricaoCurta:
        "Entre no picadeiro principal para conhecer Manuela e sua paixão pela arte no tecido acrobático e na lira.",
      corTema: "vermelho", // vermelho | azul | roxo
      icone: "estrela",
    },
    {
      id: "experiencia",
      numero: "02",
      titulo: "Nas Alturas",
      subtitulo: "A Experiência",
      descricaoCurta:
        "Do começo ainda criança até a emoção inesquecível da primeira apresentação, com registros especiais.",
      corTema: "azul",
      icone: "nuvem",
    },
    {
      id: "vitrine",
      numero: "03",
      titulo: "A Vitrine",
      subtitulo: "Fotos & Vídeos",
      descricaoCurta:
        "Galeria com acrobacias, figuras artísticas, fotos e vídeos no tecido acrobático e na lira.",
      corTema: "roxo",
      icone: "camera",
    },
  ],

  // --------------------------------------------------------------------------
  // SALA 1 — BOAS-VINDAS E APRESENTAÇÃO DA MANUZINHA
  // --------------------------------------------------------------------------
  boasVindas: {
    selo: "SALA 01 • A GRANDE TENDA",
    saudacao: "Olá! Que alegria receber você aqui!",
    nomePessoa: "Manuzinha",
    subtituloPessoa: "Manuela da Mata Teixeira Corrêa • Asa Sul, Brasília – DF",
    // Foto principal de perfil na Sala 01
    fotoPerfil: "assets/imagens/perfil-manuzinha.jpg",
    legendaFoto: "Artista do Tecido & Lira ★",
    paragrafos: [
      "Este é um cantinho pessoal criado para compartilhar um hobby que transforma qualquer dia em espetáculo: o tecido acrobático e a lira!",
      "Praticando desde criança, Manuzinha sempre teve um carinho especial pelo lado artístico de cada figura. Com facilidade natural para flexibilidade e gosto por adrenalina, ela transforma altura e movimento em pura expressão.",
      "Os treinos acontecem em grupo no Setor Leste (611), em Brasília, onde cada encontro mistura desafio, criatividade e muita diversão no ar.",
    ],
    fraseDestaque: "“Alegria, arte de expressão!!”",
    fichaRapida: [
      { rotulo: "Modalidades", valor: "Tecido Acrobático & Lira", cor: "vermelho" },
      { rotulo: "Especialidade", valor: "Lado Artístico & Flexibilidade", cor: "amarelo" },
      { rotulo: "Treino em Grupo", valor: "Setor Leste (611) • DF", cor: "azul" },
      { rotulo: "Combustível", valor: "Alegria & Adrenalina", cor: "verde" },
    ],
    botaoProximaSala: "Seguir para a Sala 02: A Experiência →",
  },

  // --------------------------------------------------------------------------
  // SALA 2 — COMO FOI A EXPERIÊNCIA (+ IMAGENS EM ORDEM CRONOLÓGICA)
  // --------------------------------------------------------------------------
  experiencia: {
    selo: "SALA 02 • NAS ALTURAS & LAGO DIGITAL",
    titulo: "A Jornada no Tecido e na Lira",
    introducao:
      "De um incentivo especial na infância até o frio na barriga que virou pura alegria no palco: conheça como essa paixão aérea ganhou asas.",

    capitulos: [
      {
        numero: "Capítulo 01",
        titulo: "O Olhar Que Acendeu a Faísca",
        etiqueta: "Como Começou",
        texto:
          "Tudo começou ainda criança, por indicação de uma professora que enxergou a arte dentro da Manuzinha. Aquele empurrãozinho abriu as cortinas para um mundo onde expressão corporal, coragem e imaginação caminham juntos.",
        imagem: "assets/imagens/aula-01-lira.jpg",
        temaArte: "tenda",
        legendaImagem: "Registro 01 — Primeiras evoluções e flexibilidade na lira.",
      },
      {
        numero: "Capítulo 02",
        titulo: "Flexibilidade, Adrenalina e Treino em Grupo",
        etiqueta: "A Prática",
        texto:
          "No tecido acrobático e na lira, o foco é o lado artístico: criar figuras bonitas, explorar a flexibilidade e sentir a adrenalina lá no alto. Treinar em grupo no Setor Leste (611) deixa cada conquista ainda mais leve e motivadora.",
        imagem: "assets/imagens/aula-02-tecido-noite.jpg",
        temaArte: "lago",
        legendaImagem: "Registro 02 — Tecido acrobático ao ar livre sob o céu de Brasília.",
      },
      {
        numero: "Capítulo 03",
        titulo: "A Primeira Apresentação Inesquecível",
        etiqueta: "Momento Marcante",
        texto:
          "Na primeira apresentação, o nervosismo falou alto — parecia que tudo ia dar errado! Mas bastou começar para a mágica acontecer: o espetáculo foi incrível, leve e cheio de alegria, virando uma lembrança marcante para sempre.",
        imagem: "assets/imagens/aula-04-lira-dourada.jpg",
        temaArte: "blocos",
        legendaImagem: "Registro 03 — Expressão artística e luz dourada na lira!",
      },
    ],

    resumoFinal: {
      titulo: "A Essência dessa Arte",
      itens: [
        "Alegria, arte de expressão!!",
        "Superar o nervosismo e brilhar no palco",
        "Flexibilidade, adrenalina e treinos no Setor Leste (611)",
      ],
    },
    botaoProximaSala: "Abrir a Sala 03: A Vitrine →",
  },

  // --------------------------------------------------------------------------
  // SALA 3 — VITRINE DE IMAGENS E VÍDEOS (EM ORDEM CRONOLÓGICA)
  // --------------------------------------------------------------------------
  vitrine: {
    selo: "SALA 03 • PAVILHÃO DAS ESTRELAS",
    titulo: "Vitrine da Manuzinha",
    introducao:
      "Momentos no tecido acrobático, na lira e registros cheios de expressão artística em ordem cronológica! Clique em qualquer quadro para ampliar no visor retrô.",

    itens: [
      {
        id: "item-1",
        tipo: "imagem",
        titulo: "Equilíbrio & Flexibilidade na Lira",
        descricao: "Um registro cheio de extensão e leveza na lira durante as aulas.",
        arquivo: "assets/imagens/aula-01-lira.jpg",
        temaArte: "palco",
        data: "Lira • #01",
      },
      {
        id: "item-2",
        tipo: "video",
        titulo: "Em Movimento nas Aulas",
        descricao: "Vídeo especial das aulas mostrando a fluidez e a alegria no ar!",
        arquivo: "assets/videos/video-01-aulas.mp4",
        capa: "",
        duracao: "",
        temaArte: "carrossel",
        data: "Vídeo • #01",
      },
      {
        id: "item-3",
        tipo: "imagem",
        titulo: "Tecido Azul ao Ar Livre",
        descricao: "Acrobacia no tecido azul sob as árvores e o céu noturno de Brasília.",
        arquivo: "assets/imagens/aula-02-tecido-noite.jpg",
        temaArte: "lago",
        data: "Tecido • #02",
      },
      {
        id: "item-4",
        tipo: "imagem",
        titulo: "Leveza no Tecido Verde",
        descricao: "Luz dourada de fim de tarde e expressão artística no tecido acrobático.",
        arquivo: "assets/imagens/aula-03-tecido-verde.jpg",
        temaArte: "cubos",
        data: "Tecido • #03",
      },
      {
        id: "item-5",
        tipo: "video",
        titulo: "Acrobacia & Expressão no Ar",
        descricao: "Mais um registro em movimento cheio de leveza, energia e alegria!",
        arquivo: "assets/videos/video-02-aulas.mp4",
        capa: "",
        duracao: "",
        temaArte: "estrelas",
        data: "Vídeo • #02",
      },
      {
        id: "item-6",
        tipo: "imagem",
        titulo: "Expressão Dourada na Lira",
        descricao: "Figura invertida na lira com iluminação quente e muita presença artística.",
        arquivo: "assets/imagens/aula-04-lira-dourada.jpg",
        temaArte: "arcoiris",
        data: "Lira • #04",
      },
    ],
  },
};
