const CORRECT_PASSWORD = "05282026";

const gate = document.getElementById('gate');
const scene = document.getElementById('scene');
const letter = document.getElementById('letter');
const gateCard = document.querySelector('.gate-card');
const passwordInput = document.getElementById('passwordInput');
const unlockBtn = document.getElementById('unlockBtn');
const gateError = document.getElementById('gateError');
const envelopeWrap = document.getElementById('envelopeWrap');
const envelope = document.getElementById('envelope');
const touchLabel = document.getElementById('touchLabel');
const petalCanvas = document.getElementById('petals');

function showScreen(el){
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
}

function tryUnlock(){
  const value = passwordInput.value.trim();
  if(value === CORRECT_PASSWORD){
    showScreen(scene);
    petalCanvas.classList.add('show');
    startPetals();
  } else {
    gateError.classList.add('show');
    gateCard.classList.remove('shake');
    void gateCard.offsetWidth; // restart animation
    gateCard.classList.add('shake');
  }
}

unlockBtn.addEventListener('click', tryUnlock);
passwordInput.addEventListener('keydown', e => {
  if(e.key === 'Enter') tryUnlock();
});

envelopeWrap.addEventListener('click', () => {
  if(envelopeWrap.classList.contains('opening')) return;
  envelopeWrap.classList.add('opening');
  envelope.classList.add('opened');
  touchLabel.style.transition = 'opacity .4s ease';
  touchLabel.style.opacity = '0';
  setTimeout(() => {
    showScreen(letter);
  }, 900);
});

/* ---------------- Falling flowers ---------------- */
const ctx = petalCanvas.getContext('2d');
const EMOJIS = ['🌸','🌺','💮','🌷','💗'];
let petalArr = [];
let animId = null;
let reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resizeCanvas(){
  petalCanvas.width = window.innerWidth;
  petalCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function makePetal(){
  return {
    x: Math.random() * petalCanvas.width,
    y: -30 - Math.random() * 200,
    size: 16 + Math.random() * 16,
    speedY: 0.6 + Math.random() * 1.2,
    speedX: (Math.random() - 0.5) * 0.6,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 2,
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    sway: Math.random() * Math.PI * 2
  };
}

function startPetals(){
  if(animId) return;
  const count = reduceMotion ? 8 : 26;
  petalArr = Array.from({length: count}, makePetal);
  loop();
}

function loop(){
  ctx.clearRect(0, 0, petalCanvas.width, petalCanvas.height);
  petalArr.forEach(p => {
    p.y += p.speedY;
    p.sway += 0.02;
    p.x += p.speedX + Math.sin(p.sway) * 0.4;
    p.rotation += p.rotationSpeed;

    if(p.y > petalCanvas.height + 30){
      Object.assign(p, makePetal(), { y: -30 });
    }

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.font = `${p.size}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.emoji, 0, 0);
    ctx.restore();
  });
  animId = requestAnimationFrame(loop);
}
