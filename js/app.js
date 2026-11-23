/**
 * ============================================================================
 *  CONTROLADOR PRINCIPAL — O MARAVILHOSO PARQUE DIGITAL
 * ============================================================================
 *  Gerencia navegação entre salas (via portas 3D e hash na URL),
 *  renderização dinâmica a partir de conteudo.js, filtros da vitrine
 *  e visor retrô para fotos e vídeos.
 */

(function () {
  const dados = window.SITE_CONTEUDO;
  if (!dados) return;

  const SALAS_VALIDAS = ["lobby", "boas-vindas", "experiencia", "vitrine"];
  const ICONES_PORTA = {
    estrela: "★",
    nuvem: "☁",
    camera: "🎬",
  };

  let salaAtual = "lobby";
  let emTransicao = false;
  let filtroVitrineAtual = "todos";

  // Estado do Visor Retrô (Lightbox)
  let listaVisor = [];
  let indiceVisor = 0;
  let rafDemoVideo = null;

  // Referências de DOM
  const elTransicao = document.getElementById("transicao-porta");
  const elTransicaoRotulo = document.getElementById("transicao-rotulo");
  const elVisor = document.getElementById("visor-midia");
  const elVisorConteudo = document.getElementById("visor-conteudo");
  const elVisorTitulo = document.getElementById("visor-titulo");
  const elVisorDescricao = document.getElementById("visor-descricao");
  const elVisorContador = document.getElementById("visor-contador");
  const elVisorEtiqueta = document.getElementById("visor-etiqueta");
  const btnVisorAnt = document.getElementById("visor-anterior");
  const btnVisorProx = document.getElementById("visor-proximo");

  // --------------------------------------------------------------------------
  // UTILITÁRIOS DE PLACEHOLDER EM CANVAS
  // --------------------------------------------------------------------------
  function criarCanvasArte(tema, largura = 640, altura = 400) {
    const canvas = document.createElement("canvas");
    canvas.width = largura;
    canvas.height = altura;
    ParqueCenarios.desenharArtePlaceholder(canvas, tema, 0.8);
    return canvas;
  }

  // --------------------------------------------------------------------------
  // RENDERIZAÇÃO DO CONTEÚDO (A PARTIR DE conteudo.js)
  // --------------------------------------------------------------------------
  function renderizarGeralELobby() {
    document.title = dados.geral.tituloAba;
    document.getElementById("marca-nome").textContent = dados.geral.nomeMarca;
    document.getElementById("lobby-etiqueta").textContent = dados.geral.etiquetaTopo;
    document.getElementById("lobby-titulo").textContent = dados.geral.tituloLobby;
    document.getElementById("lobby-subtitulo").textContent = dados.geral.subtituloLobby;
    document.getElementById("rodape-texto").textContent = dados.geral.rodapeTexto;

    const corredor = document.getElementById("corredor-portas");
    corredor.innerHTML = "";

    dados.portas.forEach((porta) => {
      const card = document.createElement("article");
      card.className = `porta-cartao porta-${porta.corTema}`;
      card.setAttribute("role", "listitem");

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "porta-gatilho";
      btn.setAttribute("aria-label", `Abrir porta ${porta.numero}: ${porta.titulo} — ${porta.subtitulo}`);

      const icone = ICONES_PORTA[porta.icone] || "★";

      btn.innerHTML = `
        <div class="porta-arco">
          <div class="porta-interior">
            <span class="porta-brilho-interno">Entrar! ✨</span>
            <div class="porta-folha">
              <span class="porta-numero">PORTA ${porta.numero}</span>
              <span class="porta-emblema" aria-hidden="true">${icone}</span>
              <span class="porta-painel-base" aria-hidden="true"></span>
              <span class="porta-macaneta" aria-hidden="true"></span>
            </div>
          </div>
        </div>
        <h2 class="porta-titulo"></h2>
        <p class="porta-subtitulo"></p>
        <p class="porta-descricao"></p>
        <span class="porta-cta">Abrir Porta →</span>
      `;

      btn.querySelector(".porta-titulo").textContent = porta.titulo;
      btn.querySelector(".porta-subtitulo").textContent = porta.subtitulo;
      btn.querySelector(".porta-descricao").textContent = porta.descricaoCurta;

      btn.addEventListener("mouseenter", () => ParqueAudio.tocarHoverSuave());
      btn.addEventListener("click", () => {
        if (emTransicao) return;
        card.classList.add("abrindo");
        navegarPara(porta.id, { viaPorta: true, rotulo: `Entrando em ${porta.titulo}...` });
        window.setTimeout(() => card.classList.remove("abrindo"), 700);
      });

      card.appendChild(btn);
      corredor.appendChild(card);
    });
  }

  function renderizarSalaBoasVindas() {
    const bv = dados.boasVindas;
    document.getElementById("bv-selo").textContent = bv.selo;
    document.getElementById("bv-saudacao").textContent = bv.saudacao;
    document.getElementById("bv-nome").textContent = bv.nomePessoa;
    document.getElementById("bv-subtitulo").textContent = bv.subtituloPessoa;
    document.getElementById("bv-legenda-foto").textContent = bv.legendaFoto;
    document.getElementById("bv-frase").textContent = bv.fraseDestaque;
    document.getElementById("bv-btn-proxima").textContent = bv.botaoProximaSala;

    // Retrato ou arte CGI placeholder
    const fotoWrap = document.getElementById("bv-foto-wrap");
    fotoWrap.innerHTML = "";
    if (bv.fotoPerfil) {
      const img = document.createElement("img");
      img.src = bv.fotoPerfil;
      img.alt = `Foto de ${bv.nomePessoa}`;
      fotoWrap.appendChild(img);
    } else {
      const canvas = criarCanvasArte("perfil", 480, 480);
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", `Ilustração retrô de apresentação para ${bv.nomePessoa}`);
      fotoWrap.appendChild(canvas);
    }

    // Parágrafos
    const parWrap = document.getElementById("bv-paragrafos");
    parWrap.innerHTML = "";
    bv.paragrafos.forEach((texto) => {
      const p = document.createElement("p");
      p.textContent = texto;
      parWrap.appendChild(p);
    });

    // Link do TikTok (ativo quando preenchido, ou selo "Em breve" se vazio)
    const redesWrap = document.getElementById("bv-redes");
    if (redesWrap) {
      redesWrap.innerHTML = "";
      const url = (dados.geral.tiktokUrl || "").trim();
      const rotulo = dados.geral.tiktokTexto || "TikTok";
      if (url) {
        const a = document.createElement("a");
        a.className = "btn-tiktok";
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = `♪ ${rotulo} ↗`;
        redesWrap.appendChild(a);
      } else {
        const span = document.createElement("span");
        span.className = "btn-tiktok btn-tiktok-breve";
        span.textContent = `♪ ${rotulo} • Link em breve!`;
        redesWrap.appendChild(span);
      }
    }

    // Ficha rápida
    const fichaWrap = document.getElementById("bv-ficha");
    fichaWrap.innerHTML = "";
    bv.fichaRapida.forEach((item) => {
      const div = document.createElement("div");
      div.className = `ficha-item ficha-cor-${item.cor || "amarelo"}`;

      const rot = document.createElement("span");
      rot.className = "ficha-rotulo";
      rot.textContent = item.rotulo;

      const val = document.createElement("span");
      val.className = "ficha-valor";
      val.textContent = item.valor;

      div.appendChild(rot);
      div.appendChild(val);
      fichaWrap.appendChild(div);
    });
  }

  function renderizarSalaExperiencia() {
    const exp = dados.experiencia;
    document.getElementById("exp-selo").textContent = exp.selo;
    document.getElementById("exp-titulo").textContent = exp.titulo;
    document.getElementById("exp-intro").textContent = exp.introducao;
    document.getElementById("exp-resumo-titulo").textContent = exp.resumoFinal.titulo;
    document.getElementById("exp-btn-proxima").textContent = exp.botaoProximaSala;

    const resumoUl = document.getElementById("exp-resumo-itens");
    resumoUl.innerHTML = "";
    exp.resumoFinal.itens.forEach((txt) => {
      const li = document.createElement("li");
      li.textContent = txt;
      resumoUl.appendChild(li);
    });

    // Prepara lista de mídias dos capítulos para abrir no visor
    const midiasCapitulos = exp.capitulos.map((cap) => ({
      tipo: "imagem",
      titulo: cap.titulo,
      descricao: cap.legendaImagem,
      arquivo: cap.imagem,
      temaArte: cap.temaArte || "tenda",
    }));

    const listaCap = document.getElementById("exp-capitulos");
    listaCap.innerHTML = "";

    exp.capitulos.forEach((cap, idx) => {
      const card = document.createElement("article");
      card.className = `capitulo-cartao${idx % 2 === 1 ? " invertido" : ""}`;

      // Coluna de texto
      const colTexto = document.createElement("div");
      colTexto.className = "capitulo-conteudo";
      colTexto.innerHTML = `
        <div class="capitulo-cabecalho">
          <span class="capitulo-num"></span>
          <span class="capitulo-tag"></span>
        </div>
        <h2 class="capitulo-titulo"></h2>
        <p class="capitulo-texto"></p>
      `;
      colTexto.querySelector(".capitulo-num").textContent = cap.numero;
      colTexto.querySelector(".capitulo-tag").textContent = cap.etiqueta;
      colTexto.querySelector(".capitulo-titulo").textContent = cap.titulo;
      colTexto.querySelector(".capitulo-texto").textContent = cap.texto;

      // Coluna da imagem (polaroid clicável)
      const colMidia = document.createElement("div");
      colMidia.className = "capitulo-midia";

      const btnPostal = document.createElement("button");
      btnPostal.type = "button";
      btnPostal.className = "postal-btn";
      btnPostal.setAttribute("aria-label", `Ampliar imagem: ${cap.titulo}`);

      const imgWrap = document.createElement("div");
      imgWrap.className = "postal-imagem-wrap";

      if (cap.imagem) {
        const img = document.createElement("img");
        img.src = cap.imagem;
        img.alt = cap.legendaImagem || cap.titulo;
        img.loading = "lazy";
        imgWrap.appendChild(img);
      } else {
        imgWrap.appendChild(criarCanvasArte(cap.temaArte || "tenda", 640, 400));
      }

      const lupa = document.createElement("span");
      lupa.className = "postal-lupa";
      lupa.textContent = "🔍 Ampliar";
      imgWrap.appendChild(lupa);

      const legenda = document.createElement("p");
      legenda.className = "postal-legenda";
      legenda.textContent = cap.legendaImagem;

      btnPostal.appendChild(imgWrap);
      btnPostal.appendChild(legenda);
      btnPostal.addEventListener("click", () => {
        ParqueAudio.tocarClique();
        abrirVisor(midiasCapitulos, idx, "DIARIO_DE_EXPEDICAO.EXE");
      });

      colMidia.appendChild(btnPostal);
      card.appendChild(colTexto);
      card.appendChild(colMidia);
      listaCap.appendChild(card);
    });
  }

  function renderizarSalaVitrine() {
    const vit = dados.vitrine;
    document.getElementById("vit-selo").textContent = vit.selo;
    document.getElementById("vit-titulo").textContent = vit.titulo;
    document.getElementById("vit-intro").textContent = vit.introducao;

    const totalTodos = vit.itens.length;
    const totalImg = vit.itens.filter((i) => i.tipo === "imagem").length;
    const totalVid = vit.itens.filter((i) => i.tipo === "video").length;

    document.getElementById("cont-todos").textContent = totalTodos;
    document.getElementById("cont-imagem").textContent = totalImg;
    document.getElementById("cont-video").textContent = totalVid;

    renderizarItensVitrine();
  }

  function renderizarItensVitrine() {
    const grade = document.getElementById("vitrine-grade");
    grade.innerHTML = "";

    const itensFiltrados = dados.vitrine.itens.filter((item) => {
      if (filtroVitrineAtual === "todos") return true;
      return item.tipo === filtroVitrineAtual;
    });

    itensFiltrados.forEach((item, idx) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "vitrine-card";
      card.setAttribute("aria-label", `Abrir ${item.tipo === "video" ? "vídeo" : "imagem"}: ${item.titulo}`);

      const capa = document.createElement("div");
      capa.className = "vitrine-capa";

      if (item.tipo === "imagem") {
        if (item.arquivo) {
          const img = document.createElement("img");
          img.src = item.arquivo;
          img.alt = item.titulo;
          img.loading = "lazy";
          capa.appendChild(img);
        } else {
          capa.appendChild(criarCanvasArte(item.temaArte || "palco", 640, 400));
        }
      } else {
        // Vídeo: usa capa personalizada, preview do vídeo real, ou arte CGI
        let vidPreview = null;
        if (item.capa) {
          const img = document.createElement("img");
          img.src = item.capa;
          img.alt = `Capa do vídeo ${item.titulo}`;
          img.loading = "lazy";
          capa.appendChild(img);
        } else if (item.arquivo) {
          vidPreview = document.createElement("video");
          vidPreview.src = `${item.arquivo}#t=0.5`;
          vidPreview.muted = true;
          vidPreview.preload = "metadata";
          vidPreview.playsInline = true;
          capa.appendChild(vidPreview);
        } else {
          capa.appendChild(criarCanvasArte(item.temaArte || "carrossel", 640, 800));
        }

        const playBolha = document.createElement("span");
        playBolha.className = "vitrine-play-bolha";
        playBolha.setAttribute("aria-hidden", "true");
        playBolha.textContent = "▶";
        capa.appendChild(playBolha);

        const dur = document.createElement("span");
        dur.className = "vitrine-duracao";
        if (item.duracao) {
          dur.textContent = item.duracao;
          capa.appendChild(dur);
        } else if (vidPreview) {
          dur.textContent = "▶ Vídeo";
          capa.appendChild(dur);
          vidPreview.addEventListener("loadedmetadata", () => {
            if (!isNaN(vidPreview.duration) && isFinite(vidPreview.duration)) {
              const totalSeg = Math.round(vidPreview.duration);
              const min = Math.floor(totalSeg / 60);
              const seg = String(totalSeg % 60).padStart(2, "0");
              dur.textContent = `${min}:${seg}`;
            }
          });
        }
      }

      const badge = document.createElement("span");
      badge.className = `vitrine-badge-tipo ${item.tipo === "video" ? "badge-video" : "badge-imagem"}`;
      badge.textContent = item.tipo === "video" ? "🎬 VÍDEO" : "🖼 FOTO";
      capa.appendChild(badge);

      const meta = document.createElement("div");
      meta.className = "vitrine-meta";
      const dataSpan = document.createElement("span");
      dataSpan.className = "vitrine-data";
      dataSpan.textContent = item.data || "";
      meta.appendChild(dataSpan);

      const titulo = document.createElement("h2");
      titulo.className = "vitrine-card-titulo";
      titulo.textContent = item.titulo;

      const desc = document.createElement("p");
      desc.className = "vitrine-card-desc";
      desc.textContent = item.descricao;

      card.appendChild(capa);
      card.appendChild(meta);
      card.appendChild(titulo);
      card.appendChild(desc);

      card.addEventListener("click", () => {
        ParqueAudio.tocarClique();
        abrirVisor(itensFiltrados, idx, "VITRINE_DO_PARQUE.EXE");
      });

      grade.appendChild(card);
    });
  }

  // --------------------------------------------------------------------------
  // NAVEGAÇÃO ENTRE SALAS (COM TRANSIÇÃO DE PORTA + HASH NA URL)
  // --------------------------------------------------------------------------
  function atualizarSalaVisivel(destino) {
    salaAtual = SALAS_VALIDAS.includes(destino) ? destino : "lobby";
    document.body.dataset.sala = salaAtual;

    SALAS_VALIDAS.forEach((id) => {
      const sec = document.getElementById(`sala-${id}`);
      if (!sec) return;
      const ativa = id === salaAtual;
      sec.hidden = !ativa;
      sec.classList.toggle("ativa", ativa);
    });

    // Atualiza pílulas da barra superior
    document.querySelectorAll(".nav-pilula").forEach((btn) => {
      const ativo = btn.dataset.irSala === salaAtual;
      btn.classList.toggle("ativo", ativo);
      btn.setAttribute("aria-current", ativo ? "page" : "false");
    });

    ParqueCenarios.definirSala(salaAtual);
    window.scrollTo(0, 0);
  }

  function navegarPara(destino, opcoes = {}) {
    const salaDestino = SALAS_VALIDAS.includes(destino) ? destino : "lobby";
    if (salaDestino === salaAtual && !opcoes.forcar) return;

    if (opcoes.semAnimacao) {
      atualizarSalaVisivel(salaDestino);
      return;
    }

    if (emTransicao) return;
    emTransicao = true;

    if (salaDestino === "lobby") {
      ParqueAudio.tocarVoltarLobby();
    } else {
      ParqueAudio.tocarAbrirPorta();
    }

    elTransicaoRotulo.textContent =
      opcoes.rotulo ||
      (salaDestino === "lobby" ? "Voltando ao Corredor das Portas..." : "Abrindo sala...");

    const atrasoAntesCortina = opcoes.viaPorta ? 260 : 0;

    window.setTimeout(() => {
      elTransicao.classList.add("ativa");

      window.setTimeout(() => {
        atualizarSalaVisivel(salaDestino);
        if (window.location.hash !== `#${salaDestino}`) {
          window.location.hash = salaDestino;
        }

        window.setTimeout(() => {
          elTransicao.classList.remove("ativa");
          emTransicao = false;
        }, 120);
      }, 380);
    }, atrasoAntesCortina);
  }

  // --------------------------------------------------------------------------
  // VISOR RETRÔ (LIGHTBOX DE FOTOS E VÍDEOS + DEMO ANIMADA EM CANVAS)
  // --------------------------------------------------------------------------
  function pararAnimacaoDemo() {
    if (rafDemoVideo) {
      cancelAnimationFrame(rafDemoVideo);
      rafDemoVideo = null;
    }
    const vid = elVisorConteudo.querySelector("video");
    if (vid) {
      vid.pause();
    }
  }

  function renderizarItemNoVisor() {
    pararAnimacaoDemo();
    const item = listaVisor[indiceVisor];
    if (!item) return;

    elVisorConteudo.innerHTML = "";
    elVisorTitulo.textContent = item.titulo || "";
    elVisorDescricao.textContent = item.descricao || "";
    elVisorContador.textContent = `${indiceVisor + 1} / ${listaVisor.length}`;

    const mostrarSetas = listaVisor.length > 1;
    btnVisorAnt.hidden = !mostrarSetas;
    btnVisorProx.hidden = !mostrarSetas;

    if (item.tipo === "video") {
      if (item.arquivo) {
        const video = document.createElement("video");
        video.src = item.arquivo;
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        if (item.capa) video.poster = item.capa;
        elVisorConteudo.appendChild(video);
      } else {
        // Animação CGI interativa em 60fps para demonstrar o player de vídeo!
        const canvas = document.createElement("canvas");
        canvas.width = 720;
        canvas.height = 420;
        elVisorConteudo.appendChild(canvas);

        const aviso = document.createElement("p");
        aviso.className = "visor-aviso-demo";
        aviso.textContent =
          "✦ Prévia animada de exemplo — adicione seu .mp4 em conteudo.js para reproduzir o vídeo real!";
        elVisorConteudo.appendChild(aviso);

        const inicio = performance.now();
        const animar = (agora) => {
          const t = (agora - inicio) / 1000;
          ParqueCenarios.desenharArtePlaceholder(canvas, item.temaArte || "carrossel", t);
          rafDemoVideo = requestAnimationFrame(animar);
        };
        rafDemoVideo = requestAnimationFrame(animar);
      }
    } else {
      if (item.arquivo) {
        const img = document.createElement("img");
        img.src = item.arquivo;
        img.alt = item.titulo || "Imagem ampliada";
        elVisorConteudo.appendChild(img);
      } else {
        const canvas = criarCanvasArte(item.temaArte || "palco", 720, 450);
        elVisorConteudo.appendChild(canvas);

        const aviso = document.createElement("p");
        aviso.className = "visor-aviso-demo";
        aviso.textContent =
          "✦ Ilustração de exemplo — substitua pelo caminho da sua foto em conteudo.js!";
        elVisorConteudo.appendChild(aviso);
      }
    }
  }

  function abrirVisor(lista, indiceInicial, etiqueta) {
    listaVisor = lista;
    indiceVisor = indiceInicial;
    elVisorEtiqueta.textContent = etiqueta || "VISOR_DO_PARQUE.EXE";
    elVisor.hidden = false;
    document.body.style.overflow = "hidden";
    renderizarItemNoVisor();
  }

  function fecharVisor() {
    if (elVisor.hidden) return;
    pararAnimacaoDemo();
    elVisor.hidden = true;
    document.body.style.overflow = "";
    ParqueAudio.tocarClique();
  }

  function trocarMidiaVisor(delta) {
    if (listaVisor.length <= 1) return;
    indiceVisor = (indiceVisor + delta + listaVisor.length) % listaVisor.length;
    ParqueAudio.tocarClique();
    renderizarItemNoVisor();
  }

  // --------------------------------------------------------------------------
  // EVENTOS GLOBAIS E INICIALIZAÇÃO
  // --------------------------------------------------------------------------
  function vincularEventos() {
    // Botões de navegação para salas (barra topo + botões internos)
    document.querySelectorAll("[data-ir-sala]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const destino = btn.dataset.irSala;
        navegarPara(destino);
      });
    });

    // Filtros da Vitrine
    document.querySelectorAll(".filtro-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        ParqueAudio.tocarClique();
        filtroVitrineAtual = btn.dataset.filtro;
        document.querySelectorAll(".filtro-btn").forEach((b) => {
          const ativo = b === btn;
          b.classList.toggle("ativo", ativo);
          b.setAttribute("aria-selected", ativo ? "true" : "false");
        });
        renderizarItensVitrine();
      });
    });

    // Botão Surpresa (Confetes!)
    const btnConfete = document.getElementById("btn-confete");
    btnConfete.addEventListener("click", () => {
      const rect = btnConfete.getBoundingClientRect();
      ParqueCenarios.dispararConfete(rect.left + rect.width / 2, rect.bottom + 10);
      ParqueCenarios.dispararConfete(window.innerWidth * 0.5, window.innerHeight * 0.35);
      ParqueAudio.tocarConfete();
    });

    // Botão de Áudio Retrô
    const btnSom = document.getElementById("btn-som");
    const iconeSom = document.getElementById("icone-som");
    const textoSom = document.getElementById("texto-som");

    btnSom.addEventListener("click", () => {
      const ligado = ParqueAudio.alternar();
      btnSom.setAttribute("aria-pressed", ligado ? "true" : "false");
      iconeSom.textContent = ligado ? "🔊" : "🔇";
      textoSom.textContent = ligado ? "Som: ON" : "Som: OFF";
    });

    // Controles do Visor Retrô
    document.getElementById("visor-fechar").addEventListener("click", fecharVisor);
    btnVisorAnt.addEventListener("click", () => trocarMidiaVisor(-1));
    btnVisorProx.addEventListener("click", () => trocarMidiaVisor(1));

    elVisor.addEventListener("click", (e) => {
      if (e.target === elVisor) fecharVisor();
    });

    window.addEventListener("keydown", (e) => {
      if (elVisor.hidden) return;
      if (e.key === "Escape") fecharVisor();
      if (e.key === "ArrowLeft") trocarMidiaVisor(-1);
      if (e.key === "ArrowRight") trocarMidiaVisor(1);
    });

    // Suporte ao botão Voltar/Avançar do navegador e celular
    window.addEventListener("hashchange", () => {
      const hash = window.location.hash.replace("#", "") || "lobby";
      if (hash !== salaAtual) {
        atualizarSalaVisivel(hash);
      }
    });
  }

  function iniciar() {
    ParqueCenarios.iniciarFundo(document.getElementById("canvas-cenario"));
    ParqueCenarios.iniciarConfete(document.getElementById("canvas-confete"));

    renderizarGeralELobby();
    renderizarSalaBoasVindas();
    renderizarSalaExperiencia();
    renderizarSalaVitrine();
    vincularEventos();

    // Carrega diretamente a sala indicada na URL (se houver)
    const hashInicial = window.location.hash.replace("#", "");
    atualizarSalaVisivel(SALAS_VALIDAS.includes(hashInicial) ? hashInicial : "lobby");
  }

  iniciar();
})();
