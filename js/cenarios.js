/**
 * ============================================================================
 *  MOTOR DE CENÁRIOS CGI ANOS 90, CONFETES E ARTES PROCEDURAIS (CANVAS 2D)
 * ============================================================================
 *  Responsável por:
 *  1. Fundo animado e único para cada sala (Lobby, Tenda, Terrenos, Vitrine)
 *  2. Explosão de confetes geométricos ao acionar o brinquedo surpresa
 *  3. Ilustrações e pré-visualizações animadas estilo CGI anos 90 para
 *     placeholders enquanto o usuário não adiciona suas próprias fotos/vídeos
 */

window.ParqueCenarios = (function () {
  const movimentoReduzido =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --------------------------------------------------------------------------
  // UTILITÁRIOS DE DESENHO ESTILO CGI ANOS 90 (BRILHO PLÁSTICO & FORMAS)
  // --------------------------------------------------------------------------
  function desenharEsfera3D(ctx, x, y, r, corClara, corBase, corSombra) {
    ctx.save();
    const grad = ctx.createRadialGradient(
      x - r * 0.35,
      y - r * 0.35,
      r * 0.08,
      x,
      y,
      r
    );
    grad.addColorStop(0, corClara);
    grad.addColorStop(0.55, corBase);
    grad.addColorStop(1, corSombra);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    // Brilho especular clássico de brinquedo de plástico CGI anos 90
    ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
    ctx.beginPath();
    ctx.ellipse(
      x - r * 0.32,
      y - r * 0.34,
      r * 0.24,
      r * 0.14,
      -Math.PI / 5,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.restore();
  }

  function desenharEstrela(ctx, x, y, pontas, rExt, rInt, rotacao, cor, borda) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotacao);
    ctx.beginPath();
    for (let i = 0; i < pontas * 2; i++) {
      const r = i % 2 === 0 ? rExt : rInt;
      const ang = (i * Math.PI) / pontas - Math.PI / 2;
      const px = Math.cos(ang) * r;
      const py = Math.sin(ang) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = cor;
    ctx.fill();
    if (borda) {
      ctx.lineWidth = Math.max(1.5, rExt * 0.08);
      ctx.strokeStyle = borda;
      ctx.stroke();
    }
    ctx.restore();
  }

  function desenharCubo3D(ctx, x, y, tam, rot, corTopo, corEsq, corDir) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    const h = tam * 0.52;
    const w = tam * 0.9;

    // Face superior
    ctx.beginPath();
    ctx.moveTo(0, -h * 1.45);
    ctx.lineTo(w, -h * 0.7);
    ctx.lineTo(0, 0);
    ctx.lineTo(-w, -h * 0.7);
    ctx.closePath();
    ctx.fillStyle = corTopo;
    ctx.fill();

    // Face esquerda
    ctx.beginPath();
    ctx.moveTo(-w, -h * 0.7);
    ctx.lineTo(0, 0);
    ctx.lineTo(0, h * 1.25);
    ctx.lineTo(-w, h * 0.55);
    ctx.closePath();
    ctx.fillStyle = corEsq;
    ctx.fill();

    // Face direita
    ctx.beginPath();
    ctx.moveTo(w, -h * 0.7);
    ctx.lineTo(0, 0);
    ctx.lineTo(0, h * 1.25);
    ctx.lineTo(w, h * 0.55);
    ctx.closePath();
    ctx.fillStyle = corDir;
    ctx.fill();

    // Contorno brilhante sutil
    ctx.strokeStyle = "rgba(255,255,255,0.45)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-w, -h * 0.7);
    ctx.lineTo(0, 0);
    ctx.lineTo(w, -h * 0.7);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, h * 1.25);
    ctx.stroke();
    ctx.restore();
  }

  function desenharAnel3D(ctx, x, y, r, rot, cor1, cor2) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(1, 0.48);
    const grad = ctx.createLinearGradient(-r, -r, r, r);
    grad.addColorStop(0, cor1);
    grad.addColorStop(0.5, "#ffffff");
    grad.addColorStop(1, cor2);
    ctx.strokeStyle = grad;
    ctx.lineWidth = Math.max(6, r * 0.28);
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function desenharPisoQuadriculado(
    ctx,
    W,
    H,
    horizonteY,
    t,
    corA,
    corB,
    velocidade,
    corNevoa = "rgba(255, 250, 232, 0.85)"
  ) {
    ctx.save();
    const alturaPiso = H - horizonteY;
    if (alturaPiso <= 10) {
      ctx.restore();
      return;
    }

    // Clip abaixo do horizonte
    ctx.beginPath();
    ctx.rect(0, horizonteY, W, alturaPiso);
    ctx.clip();

    // Base
    ctx.fillStyle = corA;
    ctx.fillRect(0, horizonteY, W, alturaPiso);

    const linhas = 11;
    const colunas = 16;
    const deslocZ = (t * velocidade) % 1;
    const cx = W * 0.5;

    for (let i = 0; i < linhas; i++) {
      const z0 = (i + deslocZ) / linhas;
      const z1 = (i + 1 + deslocZ) / linhas;
      // Curva quadrática dá profundidade real de perspectiva
      const y0 = horizonteY + Math.pow(z0, 1.95) * alturaPiso;
      const y1 = horizonteY + Math.pow(z1, 1.95) * alturaPiso;
      const largura0 = W * (0.45 + Math.pow(z0, 1.45) * 2.4);
      const largura1 = W * (0.45 + Math.pow(z1, 1.45) * 2.4);

      for (let j = -colunas / 2; j < colunas / 2; j++) {
        const par = (i + j + 100) % 2 === 0;
        if (!par) continue;

        const t0 = j / (colunas / 2);
        const t1 = (j + 1) / (colunas / 2);

        const x00 = cx + t0 * largura0;
        const x01 = cx + t1 * largura0;
        const x10 = cx + t0 * largura1;
        const x11 = cx + t1 * largura1;

        ctx.fillStyle = corB;
        ctx.beginPath();
        ctx.moveTo(x00, y0);
        ctx.lineTo(x01, y0);
        ctx.lineTo(x11, y1);
        ctx.lineTo(x10, y1);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Névoa luminosa suave no horizonte para mesclar com o céu
    const nevoa = ctx.createLinearGradient(0, horizonteY, 0, horizonteY + alturaPiso * 0.42);
    nevoa.addColorStop(0, corNevoa);
    nevoa.addColorStop(1, "rgba(255, 250, 232, 0)");
    ctx.fillStyle = nevoa;
    ctx.fillRect(0, horizonteY, W, alturaPiso * 0.45);
    ctx.restore();
  }

  function desenharNuvemCGI(ctx, x, y, escala) {
    ctx.save();
    ctx.translate(x, y);
    const bolas = [
      { dx: -36, dy: 8, r: 24 },
      { dx: -14, dy: -6, r: 30 },
      { dx: 16, dy: -4, r: 28 },
      { dx: 38, dy: 10, r: 22 },
      { dx: 2, dy: 12, r: 25 },
    ];
    bolas.forEach((b) => {
      desenharEsfera3D(
        ctx,
        b.dx * escala,
        b.dy * escala,
        b.r * escala,
        "#ffffff",
        "#eef8ff",
        "#c6e4ff"
      );
    });
    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // 1. MOTOR DE CENÁRIO DE FUNDO (4 SALAS)
  // --------------------------------------------------------------------------
  let canvasFundo = null;
  let ctxFundo = null;
  let salaAtual = "lobby";
  let rafFundo = null;
  let inicioTempo = performance.now();
  let mouseX = 0;
  let mouseY = 0;
  let alvoMouseX = 0;
  let alvoMouseY = 0;

  // Brinquedos flutuantes fixos por semente para evitar saltos
  const objetosFlutuantes = [
    { tipo: "esfera", rx: 0.11, ry: 0.24, r: 26, vel: 0.9, fase: 0.3, cores: ["#fff2a6", "#ffd038", "#d98200"] },
    { tipo: "cubo",   rx: 0.87, ry: 0.22, r: 24, vel: 0.7, fase: 1.7, cores: ["#88ecff", "#2cb5ff", "#1067cc"] },
    { tipo: "estrela",rx: 0.16, ry: 0.55, r: 22, vel: 1.1, fase: 2.5, cor: "#ff5c7a", borda: "#fff6d6" },
    { tipo: "anel",   rx: 0.84, ry: 0.56, r: 28, vel: 0.8, fase: 4.1, cor1: "#ffe047", cor2: "#ff6b35" },
    { tipo: "esfera", rx: 0.28, ry: 0.17, r: 16, vel: 1.3, fase: 3.2, cores: ["#ffc2e2", "#ff529b", "#b81d62"] },
    { tipo: "cubo",   rx: 0.74, ry: 0.16, r: 17, vel: 1.0, fase: 5.0, cores: ["#a9ffb8", "#35d477", "#118a49"] },
  ];

  function redimensionarFundo() {
    if (!canvasFundo) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvasFundo.width = Math.floor(w * dpr);
    canvasFundo.height = Math.floor(h * dpr);
    ctxFundo.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function desenharCenarioLobby(ctx, W, H, t, px, py) {
    // Céu solar de parque digital
    const ceu = ctx.createLinearGradient(0, 0, 0, H * 0.72);
    ceu.addColorStop(0, "#42b8ff");
    ceu.addColorStop(0.55, "#8fe0ff");
    ceu.addColorStop(1, "#fff5cc");
    ctx.fillStyle = ceu;
    ctx.fillRect(0, 0, W, H);

    // Raios suaves de circo vindos do horizonte
    const horizY = H * 0.67 + py * 12;
    ctx.save();
    ctx.translate(W * 0.5 + px * 25, horizY);
    const raios = 16;
    for (let i = 0; i < raios; i++) {
      const a0 = (i / raios) * Math.PI * 2 + t * 0.04;
      const a1 = a0 + Math.PI / raios;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, Math.max(W, H) * 1.2, a0, a1);
      ctx.closePath();
      ctx.fillStyle = "rgba(255, 255, 255, 0.14)";
      ctx.fill();
    }
    ctx.restore();

    // Nuvens fofas CGI
    desenharNuvemCGI(ctx, W * 0.18 + Math.sin(t * 0.25) * 20 + px * 15, H * 0.18 + py * 8, W < 600 ? 0.65 : 1);
    desenharNuvemCGI(ctx, W * 0.82 + Math.cos(t * 0.22) * 22 + px * 18, H * 0.2 + py * 8, W < 600 ? 0.6 : 0.92);

    // Piso quadriculado clássico em perspectiva
    desenharPisoQuadriculado(ctx, W, H, horizY, t, "#fff6de", "#ffd166", 0.18);

    // Brinquedos geométricos flutuando nas laterais
    const escalaTela = W < 640 ? 0.65 : 1;
    objetosFlutuantes.forEach((obj) => {
      const ox = W * obj.rx + px * 28;
      const oy = H * obj.ry + Math.sin(t * obj.vel + obj.fase) * 14 + py * 18;
      const r = obj.r * escalaTela;
      if (obj.tipo === "esfera") {
        desenharEsfera3D(ctx, ox, oy, r, obj.cores[0], obj.cores[1], obj.cores[2]);
      } else if (obj.tipo === "cubo") {
        desenharCubo3D(ctx, ox, oy, r, Math.sin(t * 0.5 + obj.fase) * 0.22, obj.cores[0], obj.cores[1], obj.cores[2]);
      } else if (obj.tipo === "estrela") {
        desenharEstrela(ctx, ox, oy, 5, r, r * 0.46, t * 0.45 + obj.fase, obj.cor, obj.borda);
      } else if (obj.tipo === "anel") {
        desenharAnel3D(ctx, ox, oy, r, Math.sin(t * 0.6 + obj.fase) * 0.45, obj.cor1, obj.cor2);
      }
    });
  }

  function desenharCenarioTenda(ctx, W, H, t, px, py) {
    // Fundo da Grande Tenda com listras radiais festivas
    ctx.fillStyle = "#fff4d9";
    ctx.fillRect(0, 0, W, H);

    const topoX = W * 0.5 + px * 18;
    const topoY = -H * 0.18;
    const faixas = 18;
    for (let i = 0; i < faixas; i++) {
      const a0 = (i / faixas) * Math.PI * 2;
      const a1 = ((i + 1) / faixas) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(topoX, topoY);
      ctx.arc(topoX, topoY, Math.max(W, H) * 1.7, a0, a1);
      ctx.closePath();
      ctx.fillStyle = i % 2 === 0 ? "#ff5266" : "#fff2cc";
      ctx.fill();
    }

    // Véu quente suave para dar excelente leitura ao conteúdo
    const veu = ctx.createRadialGradient(W * 0.5, H * 0.42, 40, W * 0.5, H * 0.48, Math.max(W, H) * 0.85);
    veu.addColorStop(0, "rgba(255, 250, 235, 0.72)");
    veu.addColorStop(1, "rgba(186, 30, 56, 0.32)");
    ctx.fillStyle = veu;
    ctx.fillRect(0, 0, W, H);

    // Piso do picadeiro
    desenharPisoQuadriculado(ctx, W, H, H * 0.76 + py * 8, t, "#fff3d6", "#ff9b54", 0.1);

    // Estrelas douradas e bolas festivas flutuando
    const esc = W < 640 ? 0.68 : 1;
    for (let i = 0; i < 8; i++) {
      const fx = ((i * 0.145 + 0.05) % 0.92) * W + px * (12 + (i % 3) * 8);
      const fy = ((i * 0.21 + 0.12) % 0.64) * H + Math.sin(t * 1.1 + i * 1.4) * 12;
      if (i % 2 === 0) {
        desenharEstrela(ctx, fx, fy, 5, 16 * esc, 7 * esc, t * 0.5 + i, "#ffd43b", "#fff9db");
      } else {
        desenharEsfera3D(ctx, fx, fy, 15 * esc, "#fff4b8", "#ffbe3b", "#d46a00");
      }
    }
  }

  function desenharCenarioTerrenos(ctx, W, H, t, px, py) {
    // Céu estilo Bryce 3D / Lago Digital anos 90
    const horizY = H * 0.68 + py * 10;
    const ceu = ctx.createLinearGradient(0, 0, 0, horizY);
    ceu.addColorStop(0, "#1c8cff");
    ceu.addColorStop(0.55, "#59ccff");
    ceu.addColorStop(1, "#ccf6ff");
    ctx.fillStyle = ceu;
    ctx.fillRect(0, 0, W, horizY);

    // Sol brilhante estilizado
    desenharEsfera3D(ctx, W * 0.82 + px * 16, H * 0.19 + py * 8, W < 640 ? 34 : 52, "#ffffff", "#ffe259", "#ff9f1c");

    // Nuvens em camadas
    const nuvens = [
      { rx: 0.16, ry: 0.18, s: 1.05, v: 0.015 },
      { rx: 0.52, ry: 0.13, s: 0.82, v: 0.01 },
      { rx: 0.84, ry: 0.34, s: 0.9, v: 0.018 },
      { rx: 0.28, ry: 0.36, s: 0.72, v: 0.012 },
    ];
    nuvens.forEach((n, i) => {
      const nx = (((n.rx + t * n.v) % 1.2) - 0.1) * W + px * 18;
      const ny = n.ry * H + Math.sin(t * 0.6 + i) * 6;
      desenharNuvemCGI(ctx, nx, ny, n.s * (W < 640 ? 0.62 : 1));
    });

    // Lago Digital ondulante na base
    const agua = ctx.createLinearGradient(0, horizY, 0, H);
    agua.addColorStop(0, "#38d9e8");
    agua.addColorStop(0.45, "#1996e8");
    agua.addColorStop(1, "#1257b8");
    ctx.fillStyle = agua;
    ctx.fillRect(0, horizY, W, H - horizY);

    // Faixas brilhantes de água retrô
    for (let i = 0; i < 9; i++) {
      const p = i / 9;
      const wy = horizY + Math.pow(p, 1.55) * (H - horizY) + 8;
      ctx.beginPath();
      for (let x = 0; x <= W; x += 28) {
        const dy = Math.sin(x * 0.015 + t * (1.8 + p) + i) * (3 + p * 5);
        if (x === 0) ctx.moveTo(x, wy + dy);
        else ctx.lineTo(x, wy + dy);
      }
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.42 - p * 0.22})`;
      ctx.lineWidth = 2 + p * 3;
      ctx.stroke();
    }

    // Cubos e anéis coloridos flutuando sobre o lago
    const esc = W < 640 ? 0.65 : 1;
    desenharCubo3D(ctx, W * 0.1 + px * 24, H * 0.52 + Math.sin(t) * 10, 22 * esc, 0.2, "#ffe875", "#ff9e2c", "#e05a00");
    desenharAnel3D(ctx, W * 0.9 + px * 24, H * 0.5 + Math.cos(t * 0.8) * 12, 26 * esc, -0.35, "#ff75b5", "#69dbff");
  }

  function desenharCenarioVitrine(ctx, W, H, t, px, py) {
    // Céu de Pavilhão das Estrelas (alegre, mágico e sonhador — roxo + azul royal + rosa)
    const ceu = ctx.createLinearGradient(0, 0, W * 0.4, H);
    ceu.addColorStop(0, "#36278a");
    ceu.addColorStop(0.5, "#6b38b5");
    ceu.addColorStop(1, "#c74bb0");
    ctx.fillStyle = ceu;
    ctx.fillRect(0, 0, W, H);

    // Holofotes suaves de palco de vitrine
    const holofote1 = ctx.createRadialGradient(W * 0.22 + px * 30, H * 0.15, 20, W * 0.22, H * 0.35, W * 0.55);
    holofote1.addColorStop(0, "rgba(122, 231, 255, 0.28)");
    holofote1.addColorStop(1, "rgba(122, 231, 255, 0)");
    ctx.fillStyle = holofote1;
    ctx.fillRect(0, 0, W, H);

    const holofote2 = ctx.createRadialGradient(W * 0.8 + px * 30, H * 0.2, 20, W * 0.8, H * 0.38, W * 0.55);
    holofote2.addColorStop(0, "rgba(255, 221, 92, 0.26)");
    holofote2.addColorStop(1, "rgba(255, 221, 92, 0)");
    ctx.fillStyle = holofote2;
    ctx.fillRect(0, 0, W, H);

    // Piso quadriculado mágico lilás & dourado
    desenharPisoQuadriculado(ctx, W, H, H * 0.78 + py * 8, t, "#4a278f", "#7f48d6", 0.12, "rgba(199, 75, 176, 0.72)");

    // Estrelas cintilantes de 4 e 5 pontas
    const esc = W < 640 ? 0.72 : 1;
    for (let i = 0; i < 22; i++) {
      const sx = ((i * 197) % 100) / 100 * W + px * (8 + (i % 4) * 5);
      const sy = ((i * 83) % 72) / 100 * H + py * 8;
      const pulso = 0.65 + 0.35 * Math.sin(t * 2.2 + i * 1.1);
      const r = (i % 3 === 0 ? 11 : 6) * pulso * esc;
      const cores = ["#ffe66d", "#80edff", "#ff99e5", "#ffffff"];
      desenharEstrela(ctx, sx, sy, 4, r, r * 0.32, t * 0.3 + i, cores[i % cores.length]);
    }

    // Esferas brilhantes orbitando nos cantos
    desenharEsfera3D(ctx, W * 0.08 + px * 25, H * 0.35 + Math.sin(t * 0.9) * 14, 24 * esc, "#fff4b5", "#ffcb3d", "#c76c00");
    desenharEsfera3D(ctx, W * 0.92 + px * 25, H * 0.42 + Math.cos(t * 0.8) * 14, 22 * esc, "#ccf8ff", "#4fd8ff", "#0f75bc");
  }

  function loopFundo(agora) {
    if (!ctxFundo || !canvasFundo) return;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const t = movimentoReduzido ? 0.5 : (agora - inicioTempo) / 1000;

    // Interpolação suave do paralaxe
    mouseX += (alvoMouseX - mouseX) * 0.06;
    mouseY += (alvoMouseY - mouseY) * 0.06;

    if (salaAtual === "boas-vindas") {
      desenharCenarioTenda(ctxFundo, W, H, t, mouseX, mouseY);
    } else if (salaAtual === "experiencia") {
      desenharCenarioTerrenos(ctxFundo, W, H, t, mouseX, mouseY);
    } else if (salaAtual === "vitrine") {
      desenharCenarioVitrine(ctxFundo, W, H, t, mouseX, mouseY);
    } else {
      desenharCenarioLobby(ctxFundo, W, H, t, mouseX, mouseY);
    }

    if (!movimentoReduzido) {
      rafFundo = requestAnimationFrame(loopFundo);
    }
  }

  function iniciarFundo(canvas) {
    canvasFundo = canvas;
    ctxFundo = canvas.getContext("2d");
    redimensionarFundo();

    window.addEventListener("resize", () => {
      redimensionarFundo();
      if (movimentoReduzido) loopFundo(performance.now());
    });

    window.addEventListener("pointermove", (e) => {
      alvoMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      alvoMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    rafFundo = requestAnimationFrame(loopFundo);
  }

  function definirSala(novaSala) {
    salaAtual = novaSala || "lobby";
    if (movimentoReduzido) {
      loopFundo(performance.now());
    }
  }

  // --------------------------------------------------------------------------
  // 2. EXPLOSÃO DE CONFETES GEOMÉTRICOS (BRINQUEDO SURPRESA)
  // --------------------------------------------------------------------------
  let canvasConfete = null;
  let ctxConfete = null;
  let particulas = [];
  let rafConfete = null;

  function iniciarConfete(canvas) {
    canvasConfete = canvas;
    ctxConfete = canvas.getContext("2d");
    const ajustar = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvasConfete.width = window.innerWidth * dpr;
      canvasConfete.height = window.innerHeight * dpr;
      ctxConfete.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    ajustar();
    window.addEventListener("resize", ajustar);
  }

  function dispararConfete(origemX, origemY) {
    if (!ctxConfete) return;
    const x = origemX ?? window.innerWidth * 0.5;
    const y = origemY ?? window.innerHeight * 0.35;
    const cores = ["#ff4d6d", "#ffd43b", "#2ec4ff", "#4be384", "#b565ff", "#ff8c38"];
    const formas = ["estrela", "quadrado", "circulo", "losango"];

    for (let i = 0; i < 65; i++) {
      const ang = Math.random() * Math.PI * 2;
      const vel = 3 + Math.random() * 9;
      particulas.push({
        x,
        y,
        vx: Math.cos(ang) * vel,
        vy: Math.sin(ang) * vel - 4.5,
        tam: 6 + Math.random() * 8,
        cor: cores[i % cores.length],
        forma: formas[i % formas.length],
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.25,
        vida: 1,
      });
    }

    if (!rafConfete) {
      rafConfete = requestAnimationFrame(loopConfete);
    }
  }

  function loopConfete() {
    if (!ctxConfete) return;
    const W = window.innerWidth;
    const H = window.innerHeight;
    ctxConfete.clearRect(0, 0, W, H);

    particulas.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22; // gravidade leve de brinquedo
      p.vx *= 0.99;
      p.rot += p.vrot;
      p.vida -= 0.012;

      ctxConfete.save();
      ctxConfete.globalAlpha = Math.max(0, p.vida);
      ctxConfete.translate(p.x, p.y);
      ctxConfete.rotate(p.rot);
      ctxConfete.fillStyle = p.cor;

      if (p.forma === "estrela") {
        desenharEstrela(ctxConfete, 0, 0, 5, p.tam, p.tam * 0.45, 0, p.cor, "#ffffff");
      } else if (p.forma === "circulo") {
        ctxConfete.beginPath();
        ctxConfete.arc(0, 0, p.tam * 0.55, 0, Math.PI * 2);
        ctxConfete.fill();
      } else if (p.forma === "losango") {
        ctxConfete.beginPath();
        ctxConfete.moveTo(0, -p.tam * 0.7);
        ctxConfete.lineTo(p.tam * 0.55, 0);
        ctxConfete.lineTo(0, p.tam * 0.7);
        ctxConfete.lineTo(-p.tam * 0.55, 0);
        ctxConfete.closePath();
        ctxConfete.fill();
      } else {
        ctxConfete.fillRect(-p.tam * 0.5, -p.tam * 0.35, p.tam, p.tam * 0.7);
      }
      ctxConfete.restore();
    });

    particulas = particulas.filter((p) => p.vida > 0 && p.y < H + 40);

    if (particulas.length > 0) {
      rafConfete = requestAnimationFrame(loopConfete);
    } else {
      ctxConfete.clearRect(0, 0, W, H);
      rafConfete = null;
    }
  }

  // --------------------------------------------------------------------------
  // 3. GERADOR DE ILUSTRAÇÕES & MINI-VÍDEOS DEMO (PLACEHOLDERS ESTILOSOS)
  // --------------------------------------------------------------------------
  function desenharArtePlaceholder(canvas, tema, tempo = 0) {
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    if (tema === "perfil") {
      // Retrato simbólico alegre: palco com estrela dourada 3D + blocos
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, "#ff5e78");
      g.addColorStop(0.5, "#ffbe3b");
      g.addColorStop(1, "#4ecbff");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      // Raios de fundo
      ctx.save();
      ctx.translate(W * 0.5, H * 0.5);
      for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, W, (i / 12) * Math.PI * 2 + tempo * 0.2, ((i + 0.5) / 12) * Math.PI * 2 + tempo * 0.2);
        ctx.closePath();
        ctx.fillStyle = "rgba(255,255,255,0.16)";
        ctx.fill();
      }
      ctx.restore();

      desenharPisoQuadriculado(ctx, W, H, H * 0.72, tempo, "#fff7df", "#ff8fa3", 0.15);
      desenharAnel3D(ctx, W * 0.5, H * 0.52, W * 0.29, -0.25 + Math.sin(tempo) * 0.12, "#80edff", "#ffe66d");
      desenharEstrela(ctx, W * 0.5, H * 0.48 + Math.sin(tempo * 2) * 6, 5, W * 0.23, W * 0.105, Math.sin(tempo) * 0.1, "#ffe047", "#ffffff");
      desenharEsfera3D(ctx, W * 0.22, H * 0.25, W * 0.08, "#fff", "#5ce1ff", "#1178c2");
      desenharEsfera3D(ctx, W * 0.8, H * 0.28, W * 0.07, "#fff", "#ff6ea6", "#b81d62");
      return;
    }

    if (tema === "tenda" || tema === "palco") {
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#ff4d6d");
      g.addColorStop(1, "#ffbe55");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      // Listras de tenda
      for (let i = 0; i < 10; i++) {
        if (i % 2 === 0) continue;
        ctx.fillStyle = "rgba(255, 245, 214, 0.35)";
        ctx.fillRect((i * W) / 10, 0, W / 10, H * 0.65);
      }

      desenharPisoQuadriculado(ctx, W, H, H * 0.64, tempo, "#fff6de", "#ff758f", 0.22);
      // Palco central
      desenharEsfera3D(ctx, W * 0.5, H * 0.44 + Math.sin(tempo * 2) * 8, W * 0.16, "#fff8c9", "#ffd43b", "#d97706");
      desenharCubo3D(ctx, W * 0.24, H * 0.55 + Math.cos(tempo * 1.7) * 6, W * 0.1, 0.15, "#a0f0ff", "#2eb8ff", "#0e64bd");
      desenharCubo3D(ctx, W * 0.77, H * 0.53 + Math.sin(tempo * 1.9) * 6, W * 0.1, -0.15, "#b7ffbe", "#3bd474", "#128546");
      desenharEstrela(ctx, W * 0.5, H * 0.2, 5, W * 0.07, W * 0.032, tempo, "#ffffff", "#ffd43b");
      return;
    }

    if (tema === "lago") {
      const g = ctx.createLinearGradient(0, 0, 0, H * 0.62);
      g.addColorStop(0, "#1c8cff");
      g.addColorStop(1, "#bbf3ff");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H * 0.62);

      const agua = ctx.createLinearGradient(0, H * 0.62, 0, H);
      agua.addColorStop(0, "#3be0eb");
      agua.addColorStop(1, "#1262c4");
      ctx.fillStyle = agua;
      ctx.fillRect(0, H * 0.62, W, H * 0.38);

      desenharEsfera3D(ctx, W * 0.78, H * 0.24, W * 0.11, "#ffffff", "#ffe259", "#ff9f1c");
      desenharNuvemCGI(ctx, W * 0.28 + Math.sin(tempo * 0.7) * 14, H * 0.26, W / 560);
      desenharNuvemCGI(ctx, W * 0.64 + Math.cos(tempo * 0.6) * 12, H * 0.38, W / 680);

      // Ilha/barquinho geométrico sobre o lago
      desenharAnel3D(ctx, W * 0.48, H * 0.74 + Math.sin(tempo * 2) * 4, W * 0.16, 0, "#ff5c7a", "#ffd43b");
      desenharEsfera3D(ctx, W * 0.48, H * 0.64 + Math.sin(tempo * 2) * 4, W * 0.09, "#fff", "#ffd43b", "#e08400");
      return;
    }

    if (tema === "blocos" || tema === "cubos") {
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, "#fff2bd");
      g.addColorStop(0.5, "#ffd0e8");
      g.addColorStop(1, "#b8eeff");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      desenharPisoQuadriculado(ctx, W, H, H * 0.7, tempo, "#ffffff", "#a3d8ff", 0.16);
      desenharCubo3D(ctx, W * 0.5, H * 0.56, W * 0.14, 0, "#ffe875", "#ffbe3b", "#d97706");
      desenharCubo3D(ctx, W * 0.34, H * 0.62, W * 0.12, -0.05, "#ffa8c5", "#ff4d7e", "#b81d4c");
      desenharCubo3D(ctx, W * 0.66, H * 0.62, W * 0.12, 0.05, "#9cf5b8", "#35d477", "#118546");
      desenharCubo3D(ctx, W * 0.5, H * 0.35 + Math.sin(tempo * 2.2) * 8, W * 0.11, Math.sin(tempo) * 0.15, "#a3ecff", "#2bb4ff", "#0e61ba");
      return;
    }

    if (tema === "carrossel") {
      const g = ctx.createRadialGradient(W * 0.5, H * 0.45, 20, W * 0.5, H * 0.5, W * 0.75);
      g.addColorStop(0, "#ffe896");
      g.addColorStop(0.5, "#ff789e");
      g.addColorStop(1, "#5c33b8");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      desenharPisoQuadriculado(ctx, W, H, H * 0.74, tempo, "#fff4d9", "#ffd166", 0.35);

      // Carrossel girando de 6 esferas coloridas em órbita 3D!
      const coresEsferas = [
        ["#fff5b8", "#ffd43b", "#cc7a00"],
        ["#b3f4ff", "#2bc4ff", "#0d65bf"],
        ["#ffc2dc", "#ff4d8d", "#ad154d"],
        ["#b8ffcb", "#38d97c", "#108241"],
        ["#e0c2ff", "#9b5cff", "#551eb8"],
        ["#ffd4b3", "#ff8738", "#c24400"],
      ];
      const itens = [];
      for (let i = 0; i < 6; i++) {
        const ang = tempo * 1.4 + (i / 6) * Math.PI * 2;
        const z = Math.sin(ang);
        itens.push({
          x: W * 0.5 + Math.cos(ang) * W * 0.28,
          y: H * 0.47 + z * H * 0.12 + Math.sin(tempo * 3 + i) * 7,
          r: (W * 0.065) * (0.78 + (z + 1) * 0.22),
          z,
          c: coresEsferas[i],
        });
      }
      // Ordena pela profundidade z (efeito 3D real!)
      itens.sort((a, b) => a.z - b.z);
      desenharAnel3D(ctx, W * 0.5, H * 0.48, W * 0.3, 0, "#fff29c", "#ff9e2c");
      itens.forEach((it) => {
        desenharEsfera3D(ctx, it.x, it.y, it.r, it.c[0], it.c[1], it.c[2]);
      });
      return;
    }

    if (tema === "estrelas") {
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#231a6b");
      g.addColorStop(0.6, "#6633b8");
      g.addColorStop(1, "#e058b0");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      for (let i = 0; i < 16; i++) {
        const sx = ((i * 73 + tempo * 24 * ((i % 3) + 1)) % (W + 40)) - 20;
        const sy = ((i * 47 + tempo * 14) % (H * 0.85)) + H * 0.06;
        const r = 8 + (i % 4) * 5;
        const cores = ["#ffe66d", "#72efdd", "#ff99e5", "#ffffff"];
        desenharEstrela(ctx, sx, sy, i % 2 === 0 ? 5 : 4, r, r * 0.42, tempo * (1 + (i % 3) * 0.4) + i, cores[i % 4]);
      }
      desenharEstrela(ctx, W * 0.5, H * 0.5 + Math.sin(tempo * 2.2) * 10, 5, W * 0.16, W * 0.075, tempo * 0.6, "#ffe047", "#ffffff");
      return;
    }

    // Padrão: "arcoiris"
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#4ecbff");
    g.addColorStop(1, "#fff6d6");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    const faixasArco = ["#ff4d6d", "#ff922b", "#ffd43b", "#4be384", "#339af0", "#9775fa"];
    faixasArco.forEach((cor, idx) => {
      ctx.beginPath();
      ctx.arc(W * 0.5, H * 0.78, W * (0.42 - idx * 0.038), Math.PI, 0);
      ctx.strokeStyle = cor;
      ctx.lineWidth = W * 0.04;
      ctx.stroke();
    });
    desenharNuvemCGI(ctx, W * 0.2, H * 0.74, W / 560);
    desenharNuvemCGI(ctx, W * 0.8, H * 0.74, W / 560);
    desenharEstrela(ctx, W * 0.5, H * 0.22 + Math.sin(tempo * 2) * 6, 5, W * 0.075, W * 0.035, tempo * 0.5, "#ffe047", "#ffffff");
  }

  return {
    iniciarFundo,
    definirSala,
    iniciarConfete,
    dispararConfete,
    desenharArtePlaceholder,
  };
})();
