/**
 * ============================================================================
 *  MOTOR DE ÁUDIO RETRÔ (100% WEB AUDIO API — SEM ARQUIVOS EXTERNOS)
 * ============================================================================
 *  Gera efeitos sonoros de brinquedo/CD-ROM anos 90 e uma melodia suave de
 *  caixinha de música / parque digital quando o visitante ativa o som.
 */

window.ParqueAudio = (function () {
  let ctx = null;
  let ativo = false;
  let loopTimer = null;
  let passo = 0;

  // Melodia alegre e nostálgica em Dó Maior (estilo caixinha de música / CD-ROM)
  const melodia = [
    523.25, 659.25, 783.99, 1046.5, // C5 E5 G5 C6
    880.0,  783.99, 659.25, 587.33, // A5 G5 E5 D5
    659.25, 783.99, 880.0,  987.77, // E5 G5 A5 B5
    1046.5, 0,      783.99, 659.25, // C6 - G5 E5
    587.33, 659.25, 783.99, 880.0,  // D5 E5 G5 A5
    783.99, 659.25, 587.33, 523.25, // G5 E5 D5 C5
    659.25, 587.33, 523.25, 392.0,  // E5 D5 C5 G4
    523.25, 0,      0,      0,      // C5 - - -
  ];

  const baixo = [
    261.63, 0, 196.0, 0,
    220.0,  0, 196.0, 0,
    174.61, 0, 196.0, 0,
    261.63, 0, 196.0, 0,
    293.66, 0, 196.0, 0,
    261.63, 0, 220.0, 0,
    174.61, 0, 196.0, 0,
    261.63, 0, 0,     0,
  ];

  function garantirContexto() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      ctx = new AudioCtx();
    }
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    return ctx;
  }

  function tocarNota(freq, duracao, volume, tipo, atraso = 0) {
    if (!ativo || !freq) return;
    const c = garantirContexto();
    if (!c) return;

    const agora = c.currentTime + atraso;
    const osc = c.createOscillator();
    const ganho = c.createGain();

    osc.type = tipo || "triangle";
    osc.frequency.setValueAtTime(freq, agora);

    ganho.gain.setValueAtTime(0.0001, agora);
    ganho.gain.exponentialRampToValueAtTime(volume, agora + 0.015);
    ganho.gain.exponentialRampToValueAtTime(0.0001, agora + duracao);

    osc.connect(ganho);
    ganho.connect(c.destination);

    osc.start(agora);
    osc.stop(agora + duracao + 0.02);
  }

  function iniciarLoopMusica() {
    pararLoopMusica();
    passo = 0;
    loopTimer = window.setInterval(() => {
      if (!ativo) return;
      const notaM = melodia[passo % melodia.length];
      const notaB = baixo[passo % baixo.length];
      if (notaM) tocarNota(notaM, 0.24, 0.032, "triangle");
      if (notaB) tocarNota(notaB, 0.32, 0.024, "sine");
      passo++;
    }, 290);
  }

  function pararLoopMusica() {
    if (loopTimer) {
      clearInterval(loopTimer);
      loopTimer = null;
    }
  }

  return {
    estaAtivo() {
      return ativo;
    },

    alternar() {
      ativo = !ativo;
      if (ativo) {
        garantirContexto();
        this.tocarFanfarraCurta();
        iniciarLoopMusica();
      } else {
        pararLoopMusica();
      }
      return ativo;
    },

    tocarClique() {
      if (!ativo) return;
      tocarNota(680, 0.06, 0.06, "sine", 0);
      tocarNota(920, 0.08, 0.045, "triangle", 0.025);
    },

    tocarHoverSuave() {
      if (!ativo) return;
      tocarNota(560, 0.045, 0.022, "sine", 0);
    },

    tocarAbrirPorta() {
      if (!ativo) return;
      const notas = [523.25, 659.25, 783.99, 1046.5, 1318.5];
      notas.forEach((n, i) => {
        tocarNota(n, 0.22, 0.055, "triangle", i * 0.055);
      });
    },

    tocarVoltarLobby() {
      if (!ativo) return;
      const notas = [783.99, 659.25, 523.25];
      notas.forEach((n, i) => {
        tocarNota(n, 0.16, 0.045, "triangle", i * 0.05);
      });
    },

    tocarFanfarraCurta() {
      if (!ativo) return;
      const notas = [523.25, 659.25, 783.99, 1046.5];
      notas.forEach((n, i) => {
        tocarNota(n, 0.2, 0.05, "triangle", i * 0.07);
      });
    },

    tocarConfete() {
      if (!ativo) return;
      const notas = [587.33, 739.99, 880, 1174.66, 1396.91, 1567.98];
      notas.forEach((n, i) => {
        tocarNota(n, 0.18, 0.06, "sine", i * 0.04);
      });
    },
  };
})();
