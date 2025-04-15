window.onload = () => {
  const music = document.getElementById('music');
  const music2 = document.getElementById('music2');
  const ambience = document.getElementById('ambience');
  const startBtn = document.getElementById('startBtn');
  let currentMusic = 'music'; // Tracks what's playing

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

  const fadeOut = (audio) => {
    return new Promise((resolve) => {
      const fade = setInterval(() => {
        if (audio.volume > 0.01) {
          audio.volume -= 0.01;
        } else {
          clearInterval(fade);
          audio.pause();
          audio.volume = 0;
          resolve();
        }
      }, 40);
    });
  };

  const fadeIn = (audio, targetVolume = 0.5) => {
    audio.volume = 0;
    tryPlay(audio);
    return new Promise((resolve) => {
      const fade = setInterval(() => {
        if (audio.volume < targetVolume) {
          audio.volume += 0.01;
        } else {
          clearInterval(fade);
          resolve();
        }
      }, 40);
    });
  };

  const switchTo = async (target) => {
    if (currentMusic === target) return;

    if (target === 'music2') {
      await fadeOut(music);
      await fadeIn(music2);
    } else {
      await fadeOut(music2);
      await fadeIn(music);
    }

    currentMusic = target;
  };

  const setupObserver = () => {
    const trigger = document.getElementById('trigger');
    if (!trigger) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          switchTo('music2'); // scroll into trigger
        } else {
          switchTo('music'); // scroll back up
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

    fadeIn(music, 0.5);
    setupObserver();
  });
};
