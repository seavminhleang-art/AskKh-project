let notificationAudioContext;

export function armNotificationSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    notificationAudioContext ??= new AudioContextClass();
    if (notificationAudioContext.state === "suspended") {
      notificationAudioContext.resume().catch(() => {});
    }
  } catch {
    // Audio is optional; keep notifications working when the browser blocks it.
  }
}

export function playNotificationSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    notificationAudioContext ??= new AudioContextClass();
    if (notificationAudioContext.state === "suspended") {
      notificationAudioContext.resume().catch(() => {});
    }
    const context = notificationAudioContext;
    const now = context.currentTime;
    [880, 1175].forEach((frequency, index) => {
      const start = now + index * 0.13;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.12, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.19);
    });
  } catch {
    // Graceful fallback
  }
}
