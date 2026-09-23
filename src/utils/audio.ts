// Kid-friendly Web Audio Synthesizer & Instant Audio Player for Sclipici Stories
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playCuteSound(sound: string, isMuted = false) {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  switch (sound) {
    case 'butterfly': {
      // Gentle harp flutter / wind chime
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
      break;
    }
    case 'crunch': {
      // Playful pop / crunch
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
      break;
    }
    case 'balloon': {
      // Float ascending slide
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.4);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.55);
      break;
    }
    case 'peekaboo': {
      // Two-tone high playful chime
      [587.33, 880].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.16);
        gain.gain.setValueAtTime(0.18, now + i * 0.16);
        gain.gain.exponentialRampToValueAtTime(0.005, now + i * 0.16 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.16);
        osc.stop(now + i * 0.16 + 0.3);
      });
      break;
    }
    case 'turtle': {
      // Slow gentle low marimba notes
      [220, 261.63, 293.66].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.2);
        gain.gain.setValueAtTime(0.15, now + idx * 0.2);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.2 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.2);
        osc.stop(now + idx * 0.2 + 0.3);
      });
      break;
    }
    case 'splash': {
      // Water droplet splash
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.1);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.22);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
      break;
    }
    case 'chirp': {
      // Sweet bird chirp
      [1200, 1600, 2000].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        osc.frequency.exponentialRampToValueAtTime(freq + 400, now + idx * 0.07 + 0.05);
        gain.gain.setValueAtTime(0.1, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.12);
      });
      break;
    }
    case 'bubbles': {
      // Bubbles popping in rapid sequence
      [600, 850, 1100, 1400].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.09);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + i * 0.09 + 0.04);
        gain.gain.setValueAtTime(0.12, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.1);
      });
      break;
    }
    case 'tower': {
      // Wobbling xylophone notes
      [440, 554.37, 659.25, 880, 587.33].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        gain.gain.setValueAtTime(0.14, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.22);
      });
      break;
    }
    case 'lullaby': {
      // Music box melody: C - E - G - E - C
      const melody = [523.25, 659.25, 783.99, 659.25, 523.25];
      melody.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.25);
        gain.gain.setValueAtTime(0.12, now + i * 0.25);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.25 + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.25);
        osc.stop(now + i * 0.25 + 0.5);
      });
      break;
    }
    case 'click': {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
      break;
    }
    case 'fanfare': {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);
        gain.gain.setValueAtTime(0.15, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.45);
      });
      break;
    }
  }
}

// -------------------------------------------------------------
// INSTANT AUDIO PLAYER FOR SCLIPICI'S 10 STORIES
// Pre-recorded with a warm, gentle, friendly Romanian female voice (Alina Neural)
// Zero latency, cross-device & cross-browser identical playback
// -------------------------------------------------------------

const audioCache = new Map<string, HTMLAudioElement>();
let currentAudio: HTMLAudioElement | null = null;
let currentOnEndCallback: (() => void) | null = null;
let activeAudioSrc: string | null = null;

function notifyAudioChange(src: string | null, isPlaying: boolean) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('story-audio-state', {
        detail: { activeSrc: src, isPlaying },
      })
    );
  }
}

/**
 * Preload all 10 audio story files so they load instantly with zero delay
 */
export function preloadAllStoryAudios(sources: string[]) {
  if (typeof window === 'undefined') return;
  sources.forEach((src) => {
    if (!audioCache.has(src)) {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.src = src;
      // Pre-warm audio element metadata
      audio.load();
      audioCache.set(src, audio);
    }
  });
}

/**
 * Play a story audio file instantly
 */
export function playStoryAudio(
  audioSrc: string,
  onEnd?: () => void,
  fallbackText?: string
): void {
  if (typeof window === 'undefined') return;

  // Stop currently playing audio or speech synthesis
  stopStoryAudio();

  let audio = audioCache.get(audioSrc);
  if (!audio) {
    audio = new Audio(audioSrc);
    audio.preload = 'auto';
    audioCache.set(audioSrc, audio);
  }

  currentAudio = audio;
  activeAudioSrc = audioSrc;
  currentOnEndCallback = onEnd || null;

  const handleEnd = () => {
    if (currentAudio === audio) {
      currentAudio = null;
      activeAudioSrc = null;
      notifyAudioChange(null, false);
    }
    if (onEnd) onEnd();
  };

  audio.onended = handleEnd;
  audio.onerror = () => {
    console.warn(`Could not play ${audioSrc}, falling back to speech synthesis`);
    if (fallbackText) {
      speakStory(fallbackText, onEnd);
    } else if (onEnd) {
      onEnd();
    }
  };

  // Reset to beginning and play immediately
  audio.currentTime = 0;
  const playPromise = audio.play();
  notifyAudioChange(audioSrc, true);

  if (playPromise !== undefined) {
    playPromise.catch((err) => {
      console.warn('Audio play failed or was interrupted:', err);
      notifyAudioChange(null, false);
      if (fallbackText) {
        speakStory(fallbackText, onEnd);
      } else if (onEnd) {
        onEnd();
      }
    });
  }
}

export function pauseStoryAudio(): void {
  if (currentAudio && !currentAudio.paused) {
    currentAudio.pause();
    notifyAudioChange(activeAudioSrc, false);
  }
}

export function resumeStoryAudio(): void {
  if (currentAudio && currentAudio.paused) {
    currentAudio.play().then(() => {
      notifyAudioChange(activeAudioSrc, true);
    }).catch(console.warn);
  }
}

export function stopStoryAudio(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio.onended = null;
    currentAudio.onerror = null;
    currentAudio = null;
  }
  activeAudioSrc = null;
  currentOnEndCallback = null;
  notifyAudioChange(null, false);
}

export function isStoryAudioPlaying(audioSrc?: string): boolean {
  if (!currentAudio) return false;
  if (audioSrc && activeAudioSrc !== audioSrc) return false;
  return !currentAudio.paused && !currentAudio.ended;
}

export function getActiveAudioSrc(): string | null {
  return activeAudioSrc;
}

// Fallback Speech API Narrator (used only if static audio fails)
export function speakStory(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.88; // Calm, gentle pace for 4-7 year olds
  utterance.pitch = 1.15; // Friendly, warm maternal tone
  utterance.lang = 'ro-RO';

  // Try finding a Romanian voice if available
  const voices = window.speechSynthesis.getVoices();
  const roVoice = voices.find(v => v.lang.startsWith('ro') && (v.name.includes('Alina') || v.name.includes('Elena') || v.name.includes('Female') || v.name.includes('Natural'))) ||
                  voices.find(v => v.lang.startsWith('ro')) || 
                  voices.find(v => v.name.includes('Romanian'));
  if (roVoice) {
    utterance.voice = roVoice;
  }

  utterance.onend = () => {
    if (onEnd) onEnd();
  };
  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  stopStoryAudio();
}
