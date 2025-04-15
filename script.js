window.onload = () => {
  const music = document.getElementById('music');
  const music2 = document.getElementById('music2');
  const ambience = document.getElementById('ambience');
  const startBtn = document.getElementById('startBtn');
  let currentMusic = 'music'; // track what's currently playing

  const tryPlay = (audio) => {
    if (!audio) return;
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

  const fadeOut = (audio) => {
    return new Promise(resolve => {
      const interval = setInterval(() => {
        if (audio.volume > 0.01) {
          audio.volume -= 0.01;
        } else {
          clearInterval(interval);
          audio.pause();
          resolve();
        }
      }, 50);
    });
  };

  const fadeIn = (audio, targetVolume = 0.5) => {
    audio.volume = 0;
    tryPlay(audio);
    return new Promise(resolve => {
      const interval = setInterval(() => {
        if (audio.volume < targetVolume) {
          audio.volume += 0.01;
        } else {
          clearInterval(interval);
          resolve();
        }
      }, 50);
    });
  };

  const switchToMusic = async (to) => {
    if (currentMusic === to) return;

    if (to === 'music2') {
      await fadeOut(music);
      await fadeIn(music2);
    } else {
      await fadeOut(music2);
      await fadeIn(music);
    }

    currentMusic = to;
  };

  const setupScrollTrigger = () => {
    const triggerElement = document.getElementById("trigger");
    if (!triggerElement) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          switchToMusic('music2');
        } else {
          switchToMusic('music');
        }
      });
    }, { threshold: 0.5 });

    observer.observe(triggerElement);
  };

  startBtn.addEventListener('click', () => {
    startBtn.style.display = 'none';

    music.volume = 0;
    music2.volume = 0;
    ambience.volume = 0.2;

    tryPlay(ambience);
    tryPlay(music);
    tryPlay(music2);

    // Fade in music at start
    fadeIn(music, 0.5);

    setupScrollTrigger();
  });
};
