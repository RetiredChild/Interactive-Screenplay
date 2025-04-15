window.onload = () => {
  const music = document.getElementById('music');
  const music2 = document.getElementById('music2');
  const ambience = document.getElementById('ambience');
  const startBtn = document.getElementById('startBtn');

  // Handle music fade transition
  const fadeMusic = () => {
    let fadeOut = setInterval(() => {
      if (music.volume > 0.01) {
        music.volume -= 0.01;
      } else {
        clearInterval(fadeOut);
        music.pause();
      }
    }, 50);

    music2.play().catch(err => console.warn("Music2 play failed:", err));

    let fadeIn = setInterval(() => {
      if (music2.volume < 0.5) {
        music2.volume += 0.01;
      } else {
        clearInterval(fadeIn);
      }
    }, 50);
  };

  // Observe scroll trigger
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
    }, { threshold: 0.5 });

    if (triggerParagraph) observer.observe(triggerParagraph);
  };

  // Start button click handler
  startBtn.addEventListener('click', () => {
    console.log("Button clicked"); // Optional debug
    music.load();
    music2.load();
    ambience.load();

    music.volume = 0.5;
    music2.volume = 0;
    ambience.volume = 0.2;

    Promise.all([music.play(), music2.play()])
      .then(() => {
        ambience.play().catch(err => console.warn("Ambience play failed:", err));
        setupScrollTrigger();
        startBtn.style.display = 'none';
      })
  });
};
