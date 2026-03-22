// 8bit 치프튠 스타일 사운드 매니저
// Web Audio API로 프메 느낌의 귀여운 BGM + 효과음 생성

let audioCtx = null;
let muted = false;
let bgmNodes = [];
let bgmTimer = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

// ── 8bit 톤 재생 ──

function play8bit(freq, duration = 0.15, volume = 0.08, type = "square") {
  if (muted) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(volume * 0.8, ctx.currentTime + duration * 0.7);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

// ── 효과음 ──

export function sfxClick() {
  play8bit(880, 0.05, 0.06);
}

export function sfxSelect() {
  play8bit(523, 0.08, 0.07);
  setTimeout(() => play8bit(784, 0.1, 0.07), 60);
}

export function sfxStatUp() {
  [523, 659, 784, 1047].forEach((f, i) => {
    setTimeout(() => play8bit(f, 0.1, 0.06), i * 70);
  });
}

export function sfxStatDown() {
  play8bit(392, 0.12, 0.05);
  setTimeout(() => play8bit(330, 0.15, 0.05), 100);
  setTimeout(() => play8bit(262, 0.2, 0.04), 200);
}

export function sfxEvent() {
  [659, 784, 880, 1047, 880].forEach((f, i) => {
    setTimeout(() => play8bit(f, 0.08, 0.06), i * 60);
  });
}

export function sfxEraTransition() {
  const melody = [523, 659, 784, 1047, 784, 1047, 1319];
  melody.forEach((f, i) => {
    setTimeout(() => play8bit(f, 0.18, 0.07), i * 120);
  });
}

export function sfxCorrect() {
  play8bit(784, 0.08, 0.07);
  setTimeout(() => play8bit(1047, 0.12, 0.08), 80);
}

export function sfxWrong() {
  play8bit(330, 0.15, 0.06, "sawtooth");
  setTimeout(() => play8bit(262, 0.2, 0.05, "sawtooth"), 120);
}

export function sfxNpcEvent() {
  const melody = [523, 659, 784, 659, 784, 1047];
  melody.forEach((f, i) => {
    setTimeout(() => play8bit(f, 0.12, 0.06, "triangle"), i * 100);
  });
}

// ── BGM: 8bit 치프튠 멜로디 루프 ──
// 프메 스타일 귀여운 멜로디를 시대/계절별로 변주

const NOTE = {
  C4: 262, D4: 294, E4: 330, F4: 349, G4: 392, A4: 440, B4: 494,
  C5: 523, D5: 587, E5: 659, F5: 698, G5: 784, A5: 880, B5: 988,
  C6: 1047, R: 0 // rest
};

// 8마디 멜로디 패턴 (120bpm = 1beat = 500ms, 16th = 125ms)
const MELODIES = {
  spring: {
    melody: [
      NOTE.E5, NOTE.G5, NOTE.A5, NOTE.G5, NOTE.E5, NOTE.D5, NOTE.C5, NOTE.D5,
      NOTE.E5, NOTE.G5, NOTE.A5, NOTE.B5, NOTE.A5, NOTE.G5, NOTE.E5, NOTE.R,
      NOTE.C5, NOTE.D5, NOTE.E5, NOTE.G5, NOTE.E5, NOTE.D5, NOTE.C5, NOTE.R,
      NOTE.D5, NOTE.E5, NOTE.G5, NOTE.A5, NOTE.G5, NOTE.E5, NOTE.D5, NOTE.E5
    ],
    bass: [NOTE.C4, NOTE.G4, NOTE.A4, NOTE.G4, NOTE.C4, NOTE.G4, NOTE.F4, NOTE.G4],
    tempo: 200 // ms per note (faster = more upbeat)
  },
  summer: {
    melody: [
      NOTE.G5, NOTE.A5, NOTE.B5, NOTE.A5, NOTE.G5, NOTE.E5, NOTE.D5, NOTE.E5,
      NOTE.G5, NOTE.A5, NOTE.C6, NOTE.B5, NOTE.A5, NOTE.G5, NOTE.E5, NOTE.R,
      NOTE.E5, NOTE.G5, NOTE.A5, NOTE.B5, NOTE.A5, NOTE.G5, NOTE.E5, NOTE.R,
      NOTE.G5, NOTE.A5, NOTE.B5, NOTE.C6, NOTE.B5, NOTE.A5, NOTE.G5, NOTE.A5
    ],
    bass: [NOTE.E4, NOTE.G4, NOTE.A4, NOTE.G4, NOTE.E4, NOTE.G4, NOTE.D4, NOTE.E4],
    tempo: 180
  },
  autumn: {
    melody: [
      NOTE.A4, NOTE.C5, NOTE.E5, NOTE.D5, NOTE.C5, NOTE.A4, NOTE.G4, NOTE.A4,
      NOTE.C5, NOTE.E5, NOTE.G5, NOTE.E5, NOTE.D5, NOTE.C5, NOTE.A4, NOTE.R,
      NOTE.E5, NOTE.D5, NOTE.C5, NOTE.A4, NOTE.C5, NOTE.D5, NOTE.E5, NOTE.R,
      NOTE.A4, NOTE.C5, NOTE.D5, NOTE.E5, NOTE.D5, NOTE.C5, NOTE.A4, NOTE.C5
    ],
    bass: [NOTE.A4, NOTE.E4, NOTE.F4, NOTE.E4, NOTE.A4, NOTE.E4, NOTE.D4, NOTE.E4],
    tempo: 220
  },
  winter: {
    melody: [
      NOTE.C5, NOTE.E5, NOTE.G5, NOTE.E5, NOTE.C5, NOTE.D5, NOTE.E5, NOTE.R,
      NOTE.D5, NOTE.F5, NOTE.A5, NOTE.F5, NOTE.D5, NOTE.E5, NOTE.F5, NOTE.R,
      NOTE.E5, NOTE.G5, NOTE.C6, NOTE.G5, NOTE.E5, NOTE.D5, NOTE.C5, NOTE.R,
      NOTE.C5, NOTE.D5, NOTE.E5, NOTE.G5, NOTE.E5, NOTE.D5, NOTE.C5, NOTE.E5
    ],
    bass: [NOTE.C4, NOTE.F4, NOTE.G4, NOTE.F4, NOTE.C4, NOTE.G4, NOTE.E4, NOTE.C4],
    tempo: 240
  }
};

export function startBgm(seasonId = "spring") {
  stopBgm();
  if (muted) return;

  const ctx = getCtx();
  const pattern = MELODIES[seasonId] || MELODIES.spring;
  let melodyIdx = 0;
  let bassIdx = 0;
  let beatCount = 0;

  function playNextNote() {
    if (muted) return;

    // Melody (square wave, 8bit feel)
    const melNote = pattern.melody[melodyIdx % pattern.melody.length];
    if (melNote > 0) {
      play8bit(melNote, pattern.tempo * 0.8 / 1000, 0.04, "square");
    }
    melodyIdx++;

    // Bass (every 4 melody notes)
    if (beatCount % 4 === 0) {
      const bassNote = pattern.bass[bassIdx % pattern.bass.length];
      if (bassNote > 0) {
        play8bit(bassNote, pattern.tempo * 3.5 / 1000, 0.03, "triangle");
      }
      bassIdx++;
    }
    beatCount++;
  }

  playNextNote();
  bgmTimer = setInterval(playNextNote, pattern.tempo);
}

export function stopBgm() {
  if (bgmTimer) {
    clearInterval(bgmTimer);
    bgmTimer = null;
  }
  bgmNodes.forEach((n) => { try { n.stop(); } catch {} });
  bgmNodes = [];
}

// ── 음소거 ──

export function toggleMute() {
  muted = !muted;
  if (muted) stopBgm();
  return muted;
}

export function isMuted() {
  return muted;
}

export function resumeAudio() {
  const ctx = getCtx();
  if (ctx.state === "suspended") ctx.resume();
}
