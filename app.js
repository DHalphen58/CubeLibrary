const wcaEvents=[
 ['2x2x2 Cube','Speed','2x2 tutorial'],['3x3x3 Cube','Speed','3x3 tutorial'],['4x4x4 Cube','Speed','4x4 tutorial'],['5x5x5–7x7x7 Cubes','Speed','5x5 6x6 7x7 tutorial'],['3x3x3 Blindfolded','Blindfolded','3x3 blindfolded tutorial'],['4x4x4 & 5x5x5 Blindfolded','Blindfolded','4x4 5x5 blindfolded tutorial'],['3x3x3 Fewest Moves','Other','fewest moves cube tutorial'],['3x3x3 One-Handed','Speed','one handed 3x3 tutorial'],['Clock','Other','rubiks clock tutorial'],['Megaminx','Other','megaminx tutorial'],['Pyraminx','Other','pyraminx tutorial'],['Skewb','Other','skewb tutorial'],['Square-1','Other','square-1 tutorial'],['4x4x4 Blindfolded','Blindfolded','4x4 blindfolded tutorial'],['5x5x5 Blindfolded','Blindfolded','5x5 blindfolded tutorial'],['Multi-Blind','Blindfolded','multi blind cube tutorial']
];
const unofficial=[
 ['Mirror Blocks','Shape mod','mirror cube tutorial'],['Fisher Cube','Shape mod','fisher cube tutorial'],['Mastermorphix','Shape mod','mastermorphix tutorial'],['Kilominx','Dodecahedron','kilominx tutorial'],['Gigaminx','Dodecahedron','gigaminx tutorial'],['Redi Cube','Corner turning','redi cube tutorial'],['Ivy Cube','Corner turning','ivy cube tutorial'],['FTO','Face turning','face turning octahedron tutorial'],['Rex Cube','Edge turning','rex cube tutorial']
];
const wca='https://www.worldcubeassociation.org/regulations/';
const search=q=>'https://www.youtube.com/results?search_query='+encodeURIComponent(q);
function card([name,category,query],official=true){return `<article class="resource-card"><span class="tag">${category}</span><h3>${name}</h3><p>${official?'Official WCA event':'Community event'} · free learning links and video searches.</p><div class="links">${official?`<a href="${wca}" target="_blank" rel="noreferrer">Regulations ↗</a>`:''}<a href="${search(query)}" target="_blank" rel="noreferrer">Videos ↗</a><a href="${search(name+' algorithms')}" target="_blank" rel="noreferrer">Algorithms ↗</a></div></article>`}
const grid=document.querySelector('#official-grid'), filters=document.querySelector('#event-filters'), input=document.querySelector('#event-search');
let category='All';
function render(){const query=input.value.toLowerCase();grid.innerHTML=wcaEvents.filter(e=>(category==='All'||e[1]===category)&&e.join(' ').toLowerCase().includes(query)).map(e=>card(e)).join('')||'<p>No events matched that search.</p>'}
['All','Speed','Blindfolded','Other'].forEach(c=>{const b=document.createElement('button');b.className='filter'+(c==='All'?' active':'');b.textContent=c;b.onclick=()=>{category=c;filters.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));render()};filters.append(b)});
input.addEventListener('input',render);render();
document.querySelector('#unofficial-grid').innerHTML=unofficial.map(e=>card(e,false)).join('');

const metrics={
 rankings:{title:'Regular rankings',body:'The familiar WCA ranking: a competitor’s best single or average is ordered within an event and scope (world, continent, or country).',formula:'ORDER BY best_result ASC, then assign rank'},
 sum:{title:'Sum of ranks',body:'A multi-event score made by adding a competitor’s ranking position across a selected event set. Lower is better; missing events should be treated explicitly.',formula:'SUM(event_rank) across selected events → lowest total wins'},
 kinch:{title:'Kinch ranks',body:'A breadth metric: each result is compared with the current world record for its event, then those percentages are summed. Higher is better.',formula:'SUM(world_record ÷ competitor_best) × 100'},
 elo:{title:'Elo ranks',body:'A head-to-head rating concept. Each round updates ratings based on placements and expected outcomes; implementation details must be published with the leaderboard.',formula:'new_rating = old_rating + K × (actual − expected)'}
};
const sql={rankings:`-- Current official single rankings by event
SELECT person_id, world_rank, best
FROM ranks_single
WHERE event_id = '333'
ORDER BY world_rank
LIMIT 100;`,sum:`-- Sum world ranks across selected events
SELECT person_id, SUM(world_rank) AS sum_of_ranks
FROM ranks_single
WHERE event_id IN ('222','333','444','555','666','777')
GROUP BY person_id
HAVING COUNT(*) = 6
ORDER BY sum_of_ranks;`,kinch:`-- Kinch needs a materialized table of event world records
SELECT person_id, SUM(100.0 * record_best / best) AS kinch
FROM best_results_with_records
GROUP BY person_id
ORDER BY kinch DESC;`,elo:`-- Elo is sequential: calculate in an ETL job, then serve it
SELECT person_id, rating, updated_at
FROM elo_ratings
WHERE event_id = '333'
ORDER BY rating DESC
LIMIT 100;`};
const metricCard=document.querySelector('#metric-card'), sqlEl=document.querySelector('#sql-example');
function showMetric(key){const m=metrics[key];metricCard.innerHTML=`<h3>${m.title}</h3><p>${m.body}</p><p class="formula">${m.formula}</p>`;sqlEl.textContent=sql[key];document.querySelectorAll('.metric-tab').forEach(b=>{const active=b.dataset.metric===key;b.classList.toggle('active',active);b.setAttribute('aria-selected',active)})}
document.querySelectorAll('.metric-tab').forEach(b=>b.onclick=()=>showMetric(b.dataset.metric));showMetric('rankings');
fetch('https://www.worldcubeassociation.org/api/v0/export/public').then(r=>r.ok?r.json():Promise.reject()).then(d=>{document.querySelector('#export-status').textContent='Latest public WCA export: '+(d.export_date?new Date(d.export_date).toLocaleDateString():'available')}).catch(()=>{document.querySelector('#export-status').textContent='Latest WCA export status unavailable in this browser — use the link below.'});