window.onload = () => {
  const music = document.getElementById('music');
  const music2 = document.getElementById('music2');
  const ambience = document.getElementById('ambience');
  const startBtn = document.getElementById('startBtn');
  let currentMusic = 'music'; // start with music1

  const tryPlay = (audio) => {
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        const resume = () => {
          audio.play();
          document.removeEventListener('click', resume);
        };
        document.addEventListener('click', resume);
      });
    }
  };

  // Fade utility that works gradually
  const fade = (audio, toVolume, duration) => {
    const steps = 50;
    const interval = duration / steps;
    const delta = (toVolume - audio.volume) / steps;

    return new Promise((resolve) => {
      let i = 0;
      const fader = setInterval(() => {
        if (i++ >= steps) {
          clearInterval(fader);
          audio.volume = toVolume;
          if (toVolume === 0) audio.pause();
          resolve();
        } else {
          audio.volume = Math.max(0, Math.min(1, audio.volume + delta));
        }
      }, interval);
    });
  };

  const transitionMusic = async (from, to) => {
    if (currentMusic === to.id) return;
    currentMusic = to.id;

    tryPlay(to); // ensure it's ready
    to.volume = 0;

    // Start fading out current music
    tryPlay(from);
    fade(from, 0, 5000); // fade out over 5s

    // Start fading in new music after 3s
    setTimeout
