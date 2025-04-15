window.onload = () => {
  const music = document.getElementById('music');
  const music2 = document.getElementById('music2');
  const ambience = document.getElementById('ambience');
  const startBtn = document.getElementById('startBtn');

  // Fade out music1 and fade in music2
  const fadeMusic = () => {
    clearInterval(music.fadeOutInterval);
    clearInterval(music2.fadeInInterval);

    music.fadeOutInterval = setInterval(() => {
      if (music.volume > 0.01) {
        music.volume -= 0.01;
      } else {
        clearInterval(music.fadeOutInterval);
        music.pause();
      }
    }, 50);

    music2.currentTime = 0;
    tryPlay(music2);
    music2.fadeInInterval = setInterval(() => {
      if (music2.volume < 0.5) {
        music2.volume += 0.01;
      } else {
        clearInterval(music2.fadeInInterval);
      }
    }, 50);
  };

  // Use tryPlay for autoplay-safe behavior
  const tryPlay = (audio) => {
    if (!audio) return;
    audio.volume = audio.volume || 0.5;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        const resumeAudio = () => {
          audio.play();
          document.removeEventListener("click", resumeAudio);
        };
        document.addEventListener("click", resumeAudio);
      });
    }
  };

  const setupScrollTrigger = () => {
    const triggerElement = document.getElementById("trigger"); // use ID in HTML
    if (!triggerElement) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          fadeMusic();
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });

    observer.observe(triggerElement);
  };

  startBtn.addEventListener('click', () => {
    startBtn.style.display = 'none';

    // Set initial volumes
    music.volume = 0;
    music2.volume = 0;
    ambience.volume = 0.2;

    // Try to play all
    tryPlay(ambience);
    tryPlay(music);
    tryPlay(music2); // will fade in later

    // Fade in initial music
    let fadeIn = setInterval(() => {
      if (music.volume < 0.5) {
        music.volume += 0.01;
      } else {
        clearInterval(fadeIn);
      }
    }, 50);

    // Set up scroll trigger
    setupScrollTrigger();
  });
};
