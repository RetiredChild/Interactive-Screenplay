window.onload = () => {
  const music = document.getElementById('music');
  const music2 = document.getElementById('music2');
  const ambience = document.getElementById('ambience');
  const startBtn = document.getElementById('startBtn');

  let currentTrack = 'music'; // "music" or "music2"

  const tryPlay = (audio) => {
    const promise = audio.play();
    if (promise !== undefined) {
      promise.catch(() => {
        const resume = () => {
          audio.play();
          document.removeEventListener('click', resume);
        };
        document.addEventListener('click', resume);
      });
    }
  };

  const fade = (audio, toVolume, duration) => {
    const steps = 50;
    const interval = duration / steps;
    const delta = (toVolume - audio.volume) / steps;

    return new Promise((resolve) => {
      let count = 0;
      const fader = setInterval(() => {
        if (count++ >= steps) {
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

  const crossfade = async (from, to) => {
    if (currentTrack === to.id) return;
    currentTrack = to.id;

    // Ensure both are playing
    tryPlay(from);
    to.volume = 0;
    to.currentTime = 0;
    to.play(); // 👈 This guarantees it starts before fading in

    fade(from, 0, 5000); // fade out over 5s
    setTimeout(() => {
      fade(to, 0.5, 2000); // fade in over 2s, starting at 3s
    }, 3000);
  };

  const setupObserver = () => {
    const trigger = document.getElementById('trigger');
    if (!trigger) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          crossfade(music, music2); // scroll down
        } else {
          crossfade(music2, music); // scroll up
        }
      });
    }, {
      threshold: 0.6
    });

    observer.observe(trigger);
  };

  startBtn.addEventListener('click', () => {
    startBtn.style.display = 'none';

    ambience.volume = 0.2;
    music.volume = 0;
    music2.volume = 0;

    tryPlay(ambience);
    tryPlay(music);
    tryPlay(music2);

    fade(music, 0.5, 2000); // fade in music1
    setupObserver();
  });
};
