const params = new URLSearchParams(location.search);
const name = params.get('name') || 'Event';
const section = params.get('section');
const method = params.get('method');
const step = params.get('step');
const kind = params.get('kind');
const specialEvents = new Set(['2x2x2 Cube', 'Pyraminx', 'Skewb']);
const largeCubeEvents = new Set(['4x4x4 Cube', '5x5x5–7x7x7 Cubes']);
const largeCubeSections = ['Methods', 'Example Solves', 'Algorithms', 'Centers', 'Edges', 'Tools'];
const threeByThreeMethods = {
  '3x3x3 Cube': {
    CFOP: ['Cross', 'F2L', 'OLL', 'PLL'],
    ROUX: ['First Block', 'Second Block', 'CMLL', 'LSE'],
    ZZ: ['EOLine', 'F2L', 'LL'],
    ZB: ['Cross', 'F2L', 'ZBF2L', 'ZBLL']
  },
  '3x3x3 One-Handed': {
    CFOP: ['Cross', 'F2L', 'OLL', 'PLL'],
    ROUX: ['First Block', 'Second Block', 'CMLL', 'LSE'],
    CEOR: ['CPFB', 'EOStripe', 'RB', '2GLL']
  }
};
const sectionTitles = { 'one-looking': '1 Looking', 'example-solves': 'Example Solves', algorithms: 'Algorithms', methods: 'Methods', centers: 'Centers', edges: 'Edges', tools: 'Tools', fingertricks: 'Fingertricks', videos: 'Videos', trainers: 'Trainers' };
const titlePart = kind ? sectionTitles[kind] : step || method || (section ? sectionTitles[section] || section : '');
document.title = (titlePart ? titlePart + ' | ' : '') + name + ' | CubeLibrary';
document.querySelector('#event-name').textContent = titlePart ? name + ' — ' + titlePart : name;
const content = document.querySelector('#fmc-content');
const eventUrl = (updates = {}) => {
  const query = new URLSearchParams({ name });
  const values = { section, method, step, kind, ...updates };
  Object.entries(values).forEach(([key, value]) => { if (value) query.set(key, value); });
  return 'event.html?' + query;
};
const box = (label, updates) => `<a class="event-box" href="${eventUrl(updates)}">${label}</a>`;
const resourceTemplate = (label = 'Resource title') => ({ title: label, url: '#', creator: 'Creator', language: 'en' });
function showLanguageEntries(entries) {
  content.hidden = false;
  content.innerHTML = `<label class="language-filter">Language <select id="entry-language"><option value="all">All languages</option></select></label>
  <div class="solve-list">${entries.map(entry => `<div class="resource-template" data-language="${entry.language}"><a href="${entry.url}">${entry.title}</a><span>by ${entry.creator}</span></div>`).join('')}</div>`;
  const select = document.querySelector('#entry-language');
  [...new Set(entries.map(entry => entry.language))].sort().forEach(language => select.insertAdjacentHTML('beforeend', `<option value="${language}">${language.toUpperCase()}</option>`));
  select.addEventListener('change', () => document.querySelectorAll('.solve-list .resource-template').forEach(entry => { entry.hidden = select.value !== 'all' && entry.dataset.language !== select.value; }));
}
function showBoxes(items) {
  content.hidden = false;
  content.innerHTML = '<div class="event-links">' + items.join('') + '</div>';
}

if (threeByThreeMethods[name]) {
  const methods = threeByThreeMethods[name];
  if (!section) {
    const items = name === '3x3x3 One-Handed'
      ? [box('Methods', { section: 'methods' }), box('Fingertricks', { section: 'fingertricks' })]
      : Object.keys(methods).map(item => box(item, { section: 'methods', method: item }));
    showBoxes(items);
  } else if (section === 'fingertricks') {
    showLanguageEntries([resourceTemplate('Fingertrick resource')]);
  } else if (section === 'methods' && !method) {
    showBoxes(Object.keys(methods).map(item => box(item, { section: 'methods', method: item })));
  } else if (section === 'methods' && method && !step && !kind) {
    showBoxes([box('Example Solves', { section: 'methods', method, kind: 'example-solves' }), ...methods[method].map(item => box(item, { section: 'methods', method, step: item }))]);
  } else if (section === 'methods' && method && step && !kind) {
    showBoxes(['Videos', 'Algorithms', 'Trainers'].map(item => box(item, { section: 'methods', method, step, kind: item.toLowerCase() })));
  } else {
    showLanguageEntries([resourceTemplate(kind === 'example-solves' ? 'Example solve' : 'Resource title')]);
  }
} else if (largeCubeEvents.has(name)) {
  if (!section) {
    showBoxes(largeCubeSections.map(item => box(item, { section: item.toLowerCase().replace(' ', '-') })));
  } else if (section === 'methods' && !method) {
    const methods = ['Redux', 'Yau', 'Hoya'];
    if (name === '4x4x4 Cube') methods.push('OPA');
    showBoxes(methods.map(item => box(item, { section: 'methods', method: item })));
  } else {
    showLanguageEntries([resourceTemplate(method ? method + ' resource' : 'Resource title')]);
  }
} else if (specialEvents.has(name)) {
  if (!section) {
    showBoxes([box('Algorithms', { section: 'algorithms' }), box('1 Looking', { section: 'one-looking' }), box('Example Solves', { section: 'example-solves' })]);
  } else if (section === 'algorithms') {
    content.hidden = false;
    content.innerHTML = '<div class="algorithm-columns"><a class="event-box" href="#">Trainer</a><a class="event-box" href="#">Algsheet</a></div>';
  } else if (section === 'example-solves') {
    showLanguageEntries([resourceTemplate('Example solve')]);
  } else {
    content.hidden = false;
    content.innerHTML = '<p>This section is ready for resources.</p>';
  }
} else if (name === '3x3x3 Fewest Moves') {
  const levels = ['Beginner (>30)', 'Intermediate (sub-30)', 'Advanced (sub-25)'];
  const phases = ['EO', 'DR', 'HTR', 'Post HTR'];
  const resources = levels.flatMap(level => phases.map(phase => ({ level, phase, ...resourceTemplate() })));
  content.hidden = false;
  content.innerHTML = `<label class="language-filter">Language <select id="language"><option value="all">All languages</option></select></label>
  <div class="table-wrap"><table><thead><tr><th></th>${phases.map(phase => `<th scope="col">${phase}</th>`).join('')}</tr></thead><tbody>${levels.map(level => `<tr><th scope="row">${level}</th>${phases.map(phase => {
    const item = resources.find(entry => entry.level === level && entry.phase === phase);
    return `<td><div class="resource-template" data-language="${item.language}"><a href="${item.url}">${item.title}</a><span>by ${item.creator}</span></div></td>`;
  }).join('')}</tr>`).join('')}</tbody></table></div>`;
  const select = document.querySelector('#language');
  select.insertAdjacentHTML('beforeend', '<option value="en">EN</option>');
  select.addEventListener('change', () => document.querySelectorAll('table .resource-template').forEach(entry => { entry.hidden = select.value !== 'all' && entry.dataset.language !== select.value; }));
}
