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

//Søge funktion m regex

// SweetSpot — Input Validation
// Regex patterns for validating user input before sending to Supabase

const PATTERNS = {
  // Standard email: something@something.tld
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // Danish phone number: optional +45 prefix, then 8 digits starting with 2-9
  // Allows spaces or hyphens as separators
  // Examples: +45 23456789, 23 45 67 89, 23-45-67-89
  phoneDK: /^(\+45)?[\s-]?[2-9]\d{3}[\s-]?\d{4}$/,

  // 24-hour time: HH:MM (00:00 to 23:59)
  time: /^([01]\d|2[0-3]):[0-5]\d$/,

  // Rating: a single digit 1–5
  rating: /^[1-5]$/,

  // Website URL: must start with http:// or https://
  url: /^https?:\/\/([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$/,

  // Shop/flavour name: 2–100 characters, letters (including Danish æøå), spaces, hyphens, apostrophes
  name: /^[\p{L}\s'\-]{2,100}$/u,

  // Review comment: 10–500 characters, most printable characters allowed
  comment: /^.{10,500}$/s,
};

/**
 * Validate a single field value against a named pattern.
 * @param {string} field - key from PATTERNS
 * @param {string} value - the value to test
 * @returns {{ valid: boolean, message: string }}
 */
function validate(field, value) {
  const pattern = PATTERNS[field];
  if (!pattern) {
    return { valid: false, message: `Unknown field: ${field}` };
  }
  const valid = pattern.test(value.trim());
  const messages = {
    email:    "Please enter a valid email address (e.g. navn@eksempel.dk)",
    phoneDK:  "Please enter a valid Danish phone number (e.g. +45 23 45 67 89)",
    time:     "Please enter a valid time in HH:MM format (e.g. 09:30)",
    rating:   "Rating must be a number between 1 and 5",
    url:      "Please enter a valid URL starting with http:// or https://",
    name:     "Name must be between 2 and 100 characters",
    comment:  "Review must be between 10 and 500 characters",
  };
  return {
    valid,
    message: valid ? "" : messages[field],
  };
}

/**
 * Validate a full review form object.
 * @param {{ rating: string, comment: string }} form
 * @returns {{ valid: boolean, errors: Object }}
 */
function validateReview(form) {
  const errors = {};
  for (const [field, value] of Object.entries(form)) {
    const result = validate(field, String(value));
    if (!result.valid) errors[field] = result.message;
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Validate a shop registration form.
 * @param {{ name: string, phone: string, website: string }} form
 * @returns {{ valid: boolean, errors: Object }}
 */
function validateShop(form) {
  const fieldMap = {
    name:    "name",
    phone:   "phoneDK",
    website: "url",
  };
  const errors = {};
  for (const [formField, patternKey] of Object.entries(fieldMap)) {
    if (form[formField]) {
      const result = validate(patternKey, String(form[formField]));
      if (!result.valid) errors[formField] = result.message;
    }
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

// --- Live form validation helper ---
// Attach to an input field to show inline error messages as the user types.
// Usage: attachLiveValidation(document.getElementById("email-input"), "email");
function attachLiveValidation(inputEl, field) {
  const errorEl = document.getElementById(`${inputEl.id}-error`);
  inputEl.addEventListener("blur", () => {
    const { valid, message } = validate(field, inputEl.value);
    inputEl.classList.toggle("input-error", !valid);
    if (errorEl) errorEl.textContent = valid ? "" : message;
  });
  inputEl.addEventListener("input", () => {
    if (inputEl.classList.contains("input-error")) {
      const { valid } = validate(field, inputEl.value);
      if (valid) {
        inputEl.classList.remove("input-error");
        if (errorEl) errorEl.textContent = "";
      }
    }
  });
}

export { PATTERNS, validate, validateReview, validateShop, attachLiveValidation };
=======
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
