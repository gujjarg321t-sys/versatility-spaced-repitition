/**
 * Offline-compatible Notifications and Web Audio chime synthesizer
 */

// Synthesize a regal golden bell chime using Web Audio API (100% offline, 0 external assets)
export function playRevisionChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    // Golden harmonic frequencies (A5 & E6)
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1318.51, ctx.currentTime); // E6

    // Bell envelope
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 1.8);
    osc2.stop(ctx.currentTime + 1.8);
  } catch (e) {
    console.error('Audio chime error:', e);
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
}

export function sendRevisionNotification(title: string, body: string) {
  playRevisionChime();

  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(`VERSATILITY • ${title}`, {
        body,
        icon: '/assets/aistudio/app-icon_c51e9ee0.jpg',
        badge: '/assets/aistudio/app-icon_c51e9ee0.jpg',
        tag: 'revision-reminder',
      });
    } catch (e) {
      console.log('Native notification fallback', e);
    }
  }
}
