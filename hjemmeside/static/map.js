const map = new maplibregl.Map({
    style: 'https://tiles.openfreemap.org/styles/liberty',
    center: [12.563517, 55.680466],
    zoom: 11.3,
    container: 'map',
});

let marker = new maplibregl.Marker()
  .setLngLat([12.5670, 55.6732])
  .addTo(map); // add the marker to the map

let popup = new maplibregl.Popup({ offset: 25 }) // offset er afstanden mellem popup og markøren
  .setLngLat(marker.getLngLat()) // sæt popup'ens position til samme som markøren
  .setText('This is a popup!') // set the text for the popup
  .addTo(map); // add the popup to the map
