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


fetch('/api/locations') 
  .then(res => res.json())
  .then(shops => {

    shops.forEach(shops => {

      new maplibregl.Marker()
        .setLngLat([shops.longitude, shops.latitude])
        .setPopup(
          new maplibregl.Popup({ offset: 25 })
            .setHTML(`
              <h3>${shops.title}</h3>
              <p>Rating: ${shops.totalScore}</p>
              <p> ${shops.website}</p>
            `)
        )
        .addTo(map);

    });

  });

// HVOR ER DU FUNKTION
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {

  const lng = position.coords.longitude;
  const lat = position.coords.latitude;

  // Flyt kortet til brugerens position
  map.flyTo({
    center: [lng, lat],
    zoom: 14
  });

  // Lav en markør på brugerens position
  new maplibregl.Marker({color: 'red'})
    .setLngLat([lng, lat])
    .setPopup(
      new maplibregl.Popup({ offset: 25 })
        .setText("Du er her :)")
    )
    .addTo(map);
}

getLocation();

//Søge funktion m regex