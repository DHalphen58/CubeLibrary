const params = new URLSearchParams(location.search);
const name = params.get('name') || 'Event';
const section = params.get('section');
const specialEvents = new Set(['2x2x2 Cube', 'Pyraminx', 'Skewb']);
document.title = (section ? section.replace('-', ' ') + ' | ' : '') + name + ' | CubeLibrary';
document.querySelector('#event-name').textContent = section
  ? name + ' — ' + (section === 'one-looking' ? '1 Looking' : section === 'example-solves' ? 'Example Solves' : 'Algorithms')
  : name;

const content = document.querySelector('#fmc-content');
const eventUrl = (nextSection = '') => 'event.html?name=' + encodeURIComponent(name) + (nextSection ? '&section=' + nextSection : '');

if (specialEvents.has(name)) {
  content.hidden = false;
  if (!section) {
    content.innerHTML = `<div class="event-links">
      <a class="event-box" href="${eventUrl('algorithms')}">Algorithms</a>
      <a class="event-box" href="${eventUrl('one-looking')}">1 Looking</a>
      <a class="event-box" href="${eventUrl('example-solves')}">Example Solves</a>
    </div>`;
  } else if (section === 'algorithms') {
    content.innerHTML = `<div class="algorithm-columns">
      <a class="event-box" href="#">Trainer</a>
      <a class="event-box" href="#">Algsheet</a>
    </div>`;
  } else {
    content.innerHTML = '<p>This section is ready for resources.</p>';
  }
} else if (name === '3x3x3 Fewest Moves') {
  const levels = ['Beginner (>30)', 'Intermediate (sub-30)', 'Advanced (sub-25)'];
  const phases = ['EO', 'DR', 'HTR', 'Post HTR'];
  const resource = (level, phase) => ({ level, phase, title: 'Resource title', url: '#', creator: 'Creator', language: 'en' });
  const resources = levels.flatMap(level => phases.map(phase => resource(level, phase)));
  content.hidden = false;
  content.innerHTML = `<label class="language-filter">Language
    <select id="language"><option value="all">All languages</option></select>
  </label>
  <div class="table-wrap"><table><thead><tr><th></th>${phases.map(phase => `<th scope="col">${phase}</th>`).join('')}</tr></thead>
  <tbody>${levels.map(level => `<tr><th scope="row">${level}</th>${phases.map(phase => {
    const item = resources.find(r => r.level === level && r.phase === phase);
    return `<td><div class="resource-template" data-language="${item.language}"><a href="${item.url}">${item.title}</a><span>by ${item.creator}</span></div></td>`;
  }).join('')}</tr>`).join('')}</tbody></table></div>`;
  const select = document.querySelector('#language');
  [...new Set(resources.map(item => item.language))].sort().forEach(language => select.insertAdjacentHTML('beforeend', `<option value="${language}">${language.toUpperCase()}</option>`));
  select.addEventListener('change', () => document.querySelectorAll('.resource-template').forEach(item => { item.hidden = select.value !== 'all' && item.dataset.language !== select.value; }));
}
