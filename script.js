window.onload = () => {
  const music = document.getElementById('music');
  const music2 = document.getElementById('music2');
  const ambience = document.getElementById('ambience');
  const startBtn = document.getElementById('startBtn');

  const fadeMusic = () => {
    let fadeOut = setInterval(() => {
      if (music.volume > 0.01) {
        music.volume -= 0.01;
      } else {
        clearInterval(fadeOut);
        music.pause();
      }
    }, 50);

    music2.play();
    let fadeIn = setInterval(() => {
      if (music2.volume < 0.4) {
        music2.volume += 0.01;
      } else {
        clearInterval(fadeIn);
      }
    }, 50);
  };

  const setupScrollTrigger = () => {
    const triggerParagraph = Array.from(document.querySelectorAll("#screenplay p"))
      .find(p => p.textContent.includes("She opens her bag and checks"));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          fadeMusic();
          observer.disconnect();
        }
      });
    }, { threshold: 0.4 });

    if (triggerParagraph) observer.observe(triggerParagraph);
  };

  startBtn.addEventListener('click', () => {
    // Set volumes
    music.volume = 0.4;
    music2.volume = 0;
    ambience.volume = 0.2;

    // Try to play all tracks (this is inside user gesture so should work on iOS)
    music.play();
    music2.play();
    ambience.play();

    // Hide button immediately
    startBtn.style.display = 'none';

    // Setup scroll-based transition
    setupScrollTrigger();
  });
};


ChatGPT
