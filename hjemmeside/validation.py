import re

# SweetSpot — Input Validation
# Regex patterns for validating user input before sending to Supabase

PATTERNS = {
    # Standard email: something@something.tld
    "email": r"^[^\s@]+@[^\s@]+\.[^\s@]+$",

    # Danish phone number: optional +45 prefix, then 8 digits starting with 2-9
    # Allows spaces or hyphens as separators
    # Examples: +45 23456789, 23 45 67 89, 23-45-67-89
    "phone_dk": r"^(\+45)?[\s-]?[2-9]\d{3}[\s-]?\d{4}$",

    # 24-hour time: HH:MM (00:00 to 23:59)
    "time": r"^([01]\d|2[0-3]):[0-5]\d$",

    # Rating: a single digit 1–5
    "rating": r"^[1-5]$",

    # Website URL: must start with http:// or https://
    "url": r"^https?://([\w-]+\.)+[\w-]+(/[\w\-./?%&=]*)?$",

    # Shop/flavour name: 2–100 characters, letters (including Danish æøå), spaces, hyphens, apostrophes
    "name": r"^[\w\s'\-æøåÆØÅ]{2,100}$",

    # Review comment: 10–500 characters
    "comment": r"^.{10,500}$",
}

ERROR_MESSAGES = {
    "email":    "Please enter a valid email address (e.g. navn@eksempel.dk)",
    "phone_dk": "Please enter a valid Danish phone number (e.g. +45 23 45 67 89)",
    "time":     "Please enter a valid time in HH:MM format (e.g. 09:30)",
    "rating":   "Rating must be a number between 1 and 5",
    "url":      "Please enter a valid URL starting with http:// or https://",
    "name":     "Name must be between 2 and 100 characters",
    "comment":  "Review must be between 10 and 500 characters",
}


def validate(field: str, value: str) -> tuple[bool, str]:
    """
    Validate a single field value against a named pattern.

    Args:
        field: key from PATTERNS (e.g. "email", "phone_dk")
        value: the string to validate

    Returns:
        (True, "") if valid
        (False, error message) if invalid
    """
    pattern = PATTERNS.get(field)
    if not pattern:
        return False, f"Unknown field: {field}"

    is_valid = bool(re.fullmatch(pattern, value.strip(), re.DOTALL))
    return is_valid, "" if is_valid else ERROR_MESSAGES[field]


def validate_review(rating: str, comment: str) -> tuple[bool, dict]:
    """
    Validate a review submission.

    Args:
        rating: string digit 1–5
        comment: review text

    Returns:
        (True, {}) if all fields valid
        (False, {"field": "error message", ...}) if any field invalid
    """
    errors = {}
    for field, value in [("rating", rating), ("comment", comment)]:
        is_valid, message = validate(field, value)
        if not is_valid:
            errors[field] = message
    return len(errors) == 0, errors


def validate_shop(name: str, phone: str = "", website: str = "") -> tuple[bool, dict]:
    """
    Validate a shop registration form.

    Args:
        name: shop name (required)
        phone: Danish phone number (optional)
        website: shop website URL (optional)

    Returns:
        (True, {}) if all provided fields valid
        (False, {"field": "error message", ...}) if any field invalid
    """
    errors = {}

    is_valid, message = validate("name", name)
    if not is_valid:
        errors["name"] = message

    if phone:
        is_valid, message = validate("phone_dk", phone)
        if not is_valid:
            errors["phone"] = message

    if website:
        is_valid, message = validate("url", website)
        if not is_valid:
            errors["website"] = message

    return len(errors) == 0, errors


def validate_opening_hours(opens_at: str, closes_at: str) -> tuple[bool, dict]:
    """
    Validate opening and closing times for a shop.

    Args:
        opens_at: opening time string e.g. "09:00"
        closes_at: closing time string e.g. "18:00"

    Returns:
        (True, {}) if valid
        (False, {"field": "error message", ...}) if invalid
    """
    errors = {}

    for field, value in [("opens_at", opens_at), ("closes_at", closes_at)]:
        is_valid, message = validate("time", value)
        if not is_valid:
            errors[field] = message

    return len(errors) == 0, errors
