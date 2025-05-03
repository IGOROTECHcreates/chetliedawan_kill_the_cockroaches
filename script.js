const gameContainer = document.getElementById('game-container');
const timerEl = document.getElementById('timer');
const killsEl = document.getElementById('kills');
const levelEl = document.getElementById('level'); // NEW
const muteBtn = document.getElementById('mute-btn');
const offlineBanner = document.getElementById('offline');
const startBtn = document.getElementById('start-btn');
const bgMusic = document.getElementById('bg-music');
const smashSound = document.getElementById('smash-sound');

let time = 0;
let kills = 0;
let level = 1; // NEW
let spawnInterval = 2000;
let gameInterval;

// Function to spawn cockroach
function spawnCockroach() {
  const cockroach = document.createElement('img');
  cockroach.src = 'Images/cockroach.jpg';
  cockroach.className = 'cockroach';
  cockroach.style.top = Math.random() * (window.innerHeight - 60) + 'px';
  cockroach.style.left = Math.random() * (window.innerWidth - 60) + 'px';

  cockroach.onclick = (e) => {
    if (!cockroach.classList.contains('dead')) {
      cockroach.classList.add('dead');
      cockroach.src = 'Images/cockroach-dead.jpg';
      kills++;
      killsEl.textContent = kills;
      smashSound.currentTime = 0;
      smashSound.play();

      // Create slipper image at click position
      const slipper = document.createElement('img');
      slipper.src = 'Images/Slipper.png';
      slipper.style.position = 'absolute';
      slipper.style.width = '60px';
      slipper.style.pointerEvents = 'none';
      slipper.style.top = `${e.pageY - 30}px`;
      slipper.style.left = `${e.pageX - 30}px`;
      slipper.style.zIndex = 4;
      slipper.style.transform = 'rotate(-45deg) scale(1.2)';
      slipper.style.transition = 'opacity 0.3s ease, transform 0.1s ease';

      gameContainer.appendChild(slipper);

      setTimeout(() => {
        slipper.style.opacity = '0';
        slipper.style.transform = 'rotate(-45deg) scale(0.8)';
        setTimeout(() => slipper.remove(), 300);
      }, 150);

      setTimeout(() => cockroach.remove(), 1000);
    }
  };

  gameContainer.appendChild(cockroach);
}

// Start the game
function startGame() {
  setInterval(() => {
    time++;
    timerEl.textContent = time;

    // Every 10 seconds, increase difficulty
    if (time % 10 === 0 && spawnInterval > 300) {
      level++;
      levelEl.textContent = level;
      spawnInterval -= 150; // Speed up the game
      clearInterval(gameInterval);
      gameInterval = setInterval(spawnCockroach, spawnInterval);
    }
  }, 1000);

  gameInterval = setInterval(spawnCockroach, spawnInterval);
}

// Mute button functionality
muteBtn.onclick = () => {
  bgMusic.muted = !bgMusic.muted;
  smashSound.muted = !smashSound.muted;
  muteBtn.textContent = bgMusic.muted ? 'Unmute' : 'Mute';
};

// Check internet connection
function checkConnection() {
  offlineBanner.style.display = navigator.onLine ? 'none' : 'block';
}

window.addEventListener('online', checkConnection);
window.addEventListener('offline', checkConnection);
checkConnection();

// Handle Start button click
startBtn.addEventListener('click', () => {
  document.getElementById('landing-page').style.display = 'none';
  document.getElementById('ui').style.display = 'block';
  document.getElementById('game-container').style.display = 'block';

  bgMusic.play().catch((error) => {
    console.log('Autoplay blocked, trying manual play');
  });

  startGame();
});
