window.onload = () => {
  const music = document.getElementById('music');
  const music2 = document.getElementById('music2');
  const ambience = document.getElementById('ambience');
  const startBtn = document.getElementById('startBtn');
  let currentMusic = 'music'; // Tracks which music is currently playing

  // Safely play audio
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

  // Fades
  const fadeOut = (audio) => {
    return new Promise(resolve => {
      const fade = setInterval(() => {
        if (audio.volume > 0.01) {
          audio.volume -= 0.01;
        } else {
          clearInterval(fade);
          audio.pause();
          resolve();
        }
      }, 40);
    });
  };

  const fadeIn = (audio, volume = 0.5) => {
    audio.volume = 0;
    tryPlay(audio);
    return new Promise(resolve => {
      const fade = setInterval(() => {
        if (audio.volume < volume) {
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

  // Scroll trigger logic
  const setupObserver = () => {
    const trigger = document.getElementById('trigger');
    if (!trigger) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          switchTo('music2'); // Scrolled down into trigger
        } else {
          switchTo('music');  // Scrolled back up out of trigger
        }
      });
    }, {
      threshold: 0.6
    });

    observer.observe(trigger);
  };

  // Button logic
  startBtn.addEventListener('click', () => {
    startBtn.style.display = 'none';

    // Prepare audio
    ambience.volume = 0.2;
    music.volume = 0;
    music2.volume = 0;

    tryPlay(ambience);
    tryPlay(music);
    tryPlay(music2);

    // Fade in music 1
    fadeIn(music, 0.5);

    // Activate scroll trigger
    setupObserver();
  });
};
