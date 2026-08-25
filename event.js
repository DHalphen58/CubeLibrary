const name = new URLSearchParams(location.search).get('name') || 'Event';
document.title = name + ' | CubeLibrary';
document.querySelector('#event-name').textContent = name;
