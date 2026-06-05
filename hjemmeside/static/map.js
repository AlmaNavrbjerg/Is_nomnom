// Opretter kortet og sætter startposition
const map = new maplibregl.Map({
    style: 'https://tiles.openfreemap.org/styles/liberty',
    center: [12.563517, 55.680466],
    zoom: 11.3,
    container: 'map',
});

//---------------------------------------------------
//Her gemmer vi alle shops og map markers
let allShops = [];
let markers = [];

//---------------------------------------------------
// Tilføjer en marker for TIVOLI (brugt til test, nu honorary mention)
let marker = new maplibregl.Marker()
  .setLngLat([12.5670, 55.6732])
  .setPopup(new maplibregl.Popup({ offset: 25 }) // create a popup with an offset
    .setText('This is TIVOLI!')) // set the text for the popup
  .addTo(map); // add the marker to the map

//---------------------------------------------------
// Henter alle shops og placerer markers på kortet
fetch('/api/locations')
  .then(res => res.json())
  .then(shops => {

    allShops = shops;

    shops.forEach(shop => {

      const marker = new maplibregl.Marker()
        .setLngLat([shop.longitude, shop.latitude])
        .setPopup(
          new maplibregl.Popup({ offset: 25 })
            .setHTML(`
              <h3>${shop.title}</h3>
              <p>Rating: ${shop.totalScore}</p>
              <p>${shop.website}</p>
            `)
        )
        .addTo(map);

      markers.push({ shop, marker });

    });

  });

//---------------------------------------------------
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
//Start geolocation ved load
getLocation();

//---------------------------------------------------
//Søge funktion m regex + zoom til første resultat
function searchForIs() {

    const query = document.getElementById("searchInput").value;

    const results = searchPlaces(allShops, query);

    console.log("Results:", results);

    // Vis alle markers først (reset)
    markers.forEach(m => {
        m.marker.getElement().style.display = "block";
    });

    if (results.length === 0) return;

    // Skjul markers som ikke matcher
    markers.forEach(m => {

        const match = results.some(r => r.id === m.shop.id);

        if (!match) {
            m.marker.getElement().style.display = "none";
        }
    });

    // Zoom til første resultat
    const first = results[0];

    map.flyTo({
        center: [first.longitude, first.latitude],
        zoom: 14
    });
}

//---------------------------------------------------
//Sikker regex funktion for at undgå fejl ved specielle tegn
function safeRegex(str) {
    return new RegExp(String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "i");
}

// Matcher en værdi mod query (regex-baseret)
function match(value, query) {
    if (value == null) return false;

    const regex = safeRegex(query);
    return regex.test(String(value));
}

// Finder rating hvis brugeren skriver et tal
function extractRating(query) {
    const match = query.match(/^(\d+(\.\d+)?)/);
    return match ? parseFloat(match[1]) : null;
}

// Håndterer rating + tekstsøgning
function searchPlaces(data, query) {
    if (!query) return data;

    const rating = extractRating(query);

    // Rating search mode
    if (rating !== null) {
        return data.filter(place =>
            place.totalScore >= rating &&
            place.totalScore < rating + 1
        );
    }

    // fallback text search
    const q = query.toLowerCase();

    return data.filter(place =>
        place.title?.toLowerCase().includes(q) ||
        place.categoryName?.toLowerCase().includes(q) ||
        place.city?.toLowerCase().includes(q)
    );
}
