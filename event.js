const params = new URLSearchParams(location.search);
const name = params.get('name') || 'Event';
const section = params.get('section');
const method = params.get('method');
const specialEvents = new Set(['2x2x2 Cube', 'Pyraminx', 'Skewb']);
const largeCubeEvents = new Set(['4x4x4 Cube', '5x5x5–7x7x7 Cubes']);
const largeCubeSections = ['Methods', 'Example Solves', 'Algorithms', 'Centers', 'Edges', 'Tools'];
const titlePart = method || (section === 'one-looking' ? '1 Looking' : section === 'example-solves' ? 'Example Solves' : section ? 'Algorithms' : '');
document.title = (titlePart ? titlePart + ' | ' : '') + name + ' | CubeLibrary';
document.querySelector('#event-name').textContent = titlePart ? name + ' — ' + titlePart : name;

const content = document.querySelector('#fmc-content');
const eventUrl = (nextSection = '', nextMethod = '') => {
  const query = new URLSearchParams({ name });
  if (nextSection) query.set('section', nextSection);
  if (nextMethod) query.set('method', nextMethod);
  return 'event.html?' + query;
};
const resourceTemplate = (label = 'Resource title') => ({
  title: label, url: '#', creator: 'Creator', language: 'en'
});
function showLanguageEntries(entries) {
  content.hidden = false;
  content.innerHTML = `<label class="language-filter">Language
    <select id="entry-language"><option value="all">All languages</option></select>
  </label>
  <div class="solve-list">${entries.map(entry => `<div class="resource-template" data-language="${entry.language}">
    <a href="${entry.url}">${entry.title}</a><span>by ${entry.creator}</span>
  </div>`).join('')}</div>`;
  const select = document.querySelector('#entry-language');
  [...new Set(entries.map(entry => entry.language))].sort().forEach(language => {
    select.insertAdjacentHTML('beforeend', `<option value="${language}">${language.toUpperCase()}</option>`);
  });
  select.addEventListener('change', () => document.querySelectorAll('.solve-list .resource-template').forEach(entry => {
    entry.hidden = select.value !== 'all' && entry.dataset.language !== select.value;
  }));
}

if (largeCubeEvents.has(name)) {
  if (!section) {
    content.hidden = false;
    content.innerHTML = `<div class="event-links">${largeCubeSections.map(item =>
      `<a class="event-box" href="${eventUrl(item.toLowerCase().replace(' ', '-'))}">${item}</a>`
    ).join('')}</div>`;
  } else if (section === 'methods' && !method) {
    const methods = ['Redux', 'Yau', 'Hoya'];
    if (name === '4x4x4 Cube') methods.push('OPA');
    content.hidden = false;
    content.innerHTML = `<div class="event-links">${methods.map(item =>
      `<a class="event-box" href="${eventUrl('methods', item)}">${item}</a>`
    ).join('')}</div>`;
  } else {
    showLanguageEntries([resourceTemplate(method ? method + ' resource' : 'Resource title')]);
  }
} else if (specialEvents.has(name)) {
  if (!section) {
    content.hidden = false;
    content.innerHTML = `<div class="event-links">
      <a class="event-box" href="${eventUrl('algorithms')}">Algorithms</a>
      <a class="event-box" href="${eventUrl('one-looking')}">1 Looking</a>
      <a class="event-box" href="${eventUrl('example-solves')}">Example Solves</a>
    </div>`;
  } else if (section === 'algorithms') {
    content.hidden = false;
    content.innerHTML = `<div class="algorithm-columns"><a class="event-box" href="#">Trainer</a><a class="event-box" href="#">Algsheet</a></div>`;
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
  content.innerHTML = `<label class="language-filter">Language
    <select id="language"><option value="all">All languages</option></select>
  </label><div class="table-wrap"><table><thead><tr><th></th>${phases.map(phase => `<th scope="col">${phase}</th>`).join('')}</tr></thead>
  <tbody>${levels.map(level => `<tr><th scope="row">${level}</th>${phases.map(phase => {
    const item = resources.find(entry => entry.level === level && entry.phase === phase);
    return `<td><div class="resource-template" data-language="${item.language}"><a href="${item.url}">${item.title}</a><span>by ${item.creator}</span></div></td>`;
  }).join('')}</tr>`).join('')}</tbody></table></div>`;
  const select = document.querySelector('#language');
  [...new Set(resources.map(item => item.language))].forEach(language => select.insertAdjacentHTML('beforeend', `<option value="${language}">${language.toUpperCase()}</option>`));
  select.addEventListener('change', () => document.querySelectorAll('table .resource-template').forEach(entry => {
    entry.hidden = select.value !== 'all' && entry.dataset.language !== select.value;
  }));
}
