# Is_nomnom

**Is_nomnom** is a web app for discovering local ice cream shops — browse their flavours, check opening hours, and leave reviews, all in one place.

---

## Features

- Browse ice cream shops near you on an interactive map
- See each shop's current flavours and availability
- Check opening hours for any day of the week
- Read and write reviews for your favourite shops
- Search and filter by flavour, location, or rating

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Python |
| Database | PostgreSQL via [Supabase](https://supabase.com) |

---

## Database Schema

The app uses five tables in Supabase (PostgreSQL):

- **`shops`** — ice cream shop details (name, address, location, contact)
- **`flavours`** — flavours linked to each shop, with availability status
- **`opening_hours`** — per-day opening times for each shop
- **`users`** — registered users (handled via Supabase Auth)
- **`reviews`** — user ratings and comments for shops

See [`/supabase`](./supabase) for the SQL migration files.

---

## Getting Started

### Prerequisites

- Python 3.10+
- A [Supabase](https://supabase.com) project (free tier works)
- Node.js (optional, for local dev tooling)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/AlmaNavrbjerg/Is_nomnom.git
cd Is_nomnom

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Set up environment variables
cp .env.example .env
# Fill in your Supabase URL and anon key in .env

# 4. Run the app
python app.py
```

### Environment Variables

Create a `.env` file in the root with the following:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
```

---

## Input Validation (Regex)

The app uses regular expressions to validate user input before it reaches the database. See [`/hjemmeside/validation.js`](./hjemmeside/validation.js) for the full implementation.

| Field | Pattern | Example |
|---|---|---|
| Email | `^[^\s@]+@[^\s@]+\.[^\s@]+$` | `alma@example.com` |
| Phone (DK) | `^(\+45)?[\s-]?[2-9]\d{7}$` | `+45 23 45 67 89` |
| Opening time | `^([01]\d\|2[0-3]):[0-5]\d$` | `09:30` |
| Rating | `^[1-5]$` | `4` |
| Website URL | `^https?:\/\/([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$` | `https://sweetshop.dk` |

---

## Folder Structure

```
Is_nomnom/
├── hjemmeside/          # Frontend (HTML, CSS, JS)
│   ├── index.html
│   ├── app.js
│   ├── validation.js    # Regex input validation
│   └── style.css
├── supabase/            # Database migrations and schema
├── requirements.txt     # Python dependencies
└── README.md
```

---

## Contributing

This is a school project by:

- [AlmaNavrbjerg](https://github.com/AlmaNavrbjerg) and team

Pull requests are welcome for bug fixes and improvements.

---

## License

[MIT](./LICENSE)
