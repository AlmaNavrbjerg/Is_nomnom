const map = new maplibregl.Map({
    style: 'https://tiles.openfreemap.org/styles/liberty',
    center: [12.563517, 55.680466],
    zoom: 11.3,
    container: 'map',
});

let marker = new maplibregl.Marker()
  .setLngLat([12.5670, 55.6732])
  .setPopup(new maplibregl.Popup({ offset: 25 }) // create a popup with an offset
    .setText('This is TIVOLI!')) // set the text for the popup
  .addTo(map); // add the marker to the map
