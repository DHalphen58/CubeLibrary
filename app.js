const events = [
  '2x2x2 Cube', '3x3x3 Cube', '4x4x4 Cube', '5x5x5–7x7x7 Cubes',
  '3x3x3 Blindfolded', '4x4x4 & 5x5x5 Blindfolded',
  '3x3x3 Fewest Moves', '3x3x3 One-Handed', 'Clock', 'Megaminx',
  'Pyraminx', 'Skewb', 'Square-1', 'Multi-Blind'
];

const grid = document.querySelector('#event-grid');
grid.innerHTML = events.map(name => `<a class="event-box" href="event.html?name=${encodeURIComponent(name)}">${name}</a>`).join('');
