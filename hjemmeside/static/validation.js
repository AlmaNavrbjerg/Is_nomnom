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
