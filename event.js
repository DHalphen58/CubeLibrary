const name = new URLSearchParams(location.search).get('name') || 'Event';
document.title = name + ' | CubeLibrary';
document.querySelector('#event-name').textContent = name;

if (name === '3x3x3 Fewest Moves') {
  const levels = ['Beginner (>30)', 'Intermediate (sub-30)', 'Advanced (sub-25)'];
  const phases = ['EO', 'DR', 'HTR', 'Post HTR'];
  const content = document.querySelector('#fmc-content');

  // Replace each placeholder below with your resource title, URL, creator credit,
  // and language code. The data-language value stays invisible but powers the filter.
  const resource = (level, phase) => ({
    level, phase, title: 'Resource title', url: '#', creator: 'Creator', language: 'en'
  });
  const resources = levels.flatMap(level => phases.map(phase => resource(level, phase)));

  content.hidden = false;
  content.innerHTML = `<label class="language-filter">Language
    <select id="language"><option value="all">All languages</option></select>
  </label>
  <div class="table-wrap"><table>
    <thead><tr><th></th>${phases.map(phase => `<th scope="col">${phase}</th>`).join('')}</tr></thead>
    <tbody>${levels.map(level => `<tr><th scope="row">${level}</th>${phases.map(phase => {
      const item = resources.find(r => r.level === level && r.phase === phase);
      return `<td><div class="resource-template" data-language="${item.language}">
        <a href="${item.url}">${item.title}</a><span>by ${item.creator}</span>
      </div></td>`;
    }).join('')}</tr>`).join('')}</tbody>
  </table></div>`;

  const select = document.querySelector('#language');
  [...new Set(resources.map(item => item.language))].sort().forEach(language => {
    select.insertAdjacentHTML('beforeend', `<option value="${language}">${language.toUpperCase()}</option>`);
  });
  select.addEventListener('change', () => {
    document.querySelectorAll('.resource-template').forEach(item => {
      item.hidden = select.value !== 'all' && item.dataset.language !== select.value;
    });
  });
}
