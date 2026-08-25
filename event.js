const name = new URLSearchParams(location.search).get('name') || 'Event';
document.title = name + ' | CubeLibrary';
document.querySelector('#event-name').textContent = name;
const youtube = query => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(query);
document.querySelector('#videos').href = youtube(name + ' tutorial');
document.querySelector('#algorithms').href = youtube(name + ' algorithms');
