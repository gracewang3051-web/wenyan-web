// 闪卡页交互

const data = window.FLASHCARDS;
let cards = data.cards.slice();
let idx = 0;
let passageFilter = 'all';
let typeFilter = 'all';
let isFlipped = false;

const card = document.getElementById('card');
const frontEl = document.getElementById('front');
const backEl = document.getElementById('back');
const backHint = document.getElementById('back-hint');
const progress = document.getElementById('progress');
const typeHint = document.getElementById('type-hint');

function applyFilter() {
  cards = data.cards.filter(c => {
    if (passageFilter !== 'all' && c.passage !== passageFilter) return false;
    if (typeFilter !== 'all' && c.type !== typeFilter) return false;
    return true;
  });
  idx = 0;
  isFlipped = false;
  render();
}

function render() {
  if (cards.length === 0) {
    frontEl.textContent = '无符合条件的卡';
    backEl.textContent = '请调整筛选条件';
    progress.textContent = '0 / 0';
    return;
  }
  const c = cards[idx];
  isFlipped = false;
  card.classList.remove('flipped');
  frontEl.textContent = c.front;
  backEl.innerHTML = c.back.replace(/\n/g, '<br>');
  backHint.textContent = `${c.type} · ${c.source}`;
  progress.textContent = `${idx + 1} / ${cards.length}`;

  // 高亮当前卡的类型
  typeHint.innerHTML = `<strong>${c.type}</strong> · 来源：${c.source} · 标签：${(c.tags || []).join(' / ')}`;
}

function flip() {
  isFlipped = !isFlipped;
  card.classList.toggle('flipped', isFlipped);
}

function next() {
  if (cards.length === 0) return;
  idx = (idx + 1) % cards.length;
  render();
}

function prev() {
  if (cards.length === 0) return;
  idx = (idx - 1 + cards.length) % cards.length;
  render();
}

// 键盘控制
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  else if (e.key === 'Enter' || e.key === 'f') { e.preventDefault(); flip(); }
});

// 滑动手势
let touchStartX = 0;
card.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
card.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) {
    if (dx < 0) next();
    else prev();
  }
}, { passive: true });

// 筛选器
document.querySelectorAll('#filters .filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('#filters .filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    passageFilter = chip.dataset.filter;
    applyFilter();
  });
});

document.querySelectorAll('#type-filters .filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('#type-filters .filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    typeFilter = chip.dataset.type;
    applyFilter();
  });
});

// 初始
render();