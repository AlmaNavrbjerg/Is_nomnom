# Is_nomnom

**Is_nomnom** is a web app for discovering local ice cream shops.

## Description
The purpose of our project is to build a web application featuring an interactive map of ice cream shops in Denmark. The website will display information about different ice cream stores, including their location, city, store name, website, phone number, and rating on a scale from 1 to 5 stars.

Users of the website will be able to interact with the map by clicking on different markers representing the ice cream shops. When selecting a marker, detailed information about the specific store will be displayed. As well as search for specific key words.

The project focuses on database interaction, interactive map visualization, and user-friendly navigation 





---
## Features

- Browse ice cream shops near you on an interactive map
- Check contact options
- See rewiev score for your favourite shops
- Search and filter by name, location, or rating

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Python |
| Database | PostgreSQL via [Supabase](https://supabase.com) |

---

## Database Schema

The app uses eight tables in Supabase (PostgreSQL):

- **`title`** — ice cream shop name 
- **`totalScore`** — A score from 1-5 of how good the shop is
- **`longitude/latitude`** — the precise location of the shop
- **`city`** — the city where the shop is located
- **`website`** — the shops website URL
- **`phone`** — the shops telefone number
- **`categoryName`** — the category in which the shop belongs

See [`/supabase`](./supabase) for the SQL migration files.

---

## E/R model

<img width="197" height="324" alt="image" src="https://github.com/user-attachments/assets/e1c65374-0086-4a19-bd17-7d263140570b" />

Our E/R model has three main entities: Shop, User, and Review. A shop can receive many reviews, and each review belongs to exactly one shop. A user can write many reviews, and each review is written by exactly one user. The Review entity stores information such as the rating score and review ID.

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

## Regex and search function

The application uses regular expressions to process search input. Regular expressions are used to safely handle special characters entered by the user and to identify numeric input, such as ratings, so that rating-based searches can be performed correctly.

---

## Folder Structure

```
Is_nomnom/
├── hjemmeside/          # Frontend (HTML, CSS, JS)
│   ├── static/
│   │   ├── home.js
│   │   ├── map.js       # Marker, location and search funktion 
│   │   └── style.css  
│   ├── templates/
│   │   ├── base.html
│   │   └── home.html  
│   └── app.py
├── supabase/            # Database migrations and schema
├── requirements.txt     # Python dependencies
└── README.md
```

---

## Contributing

This is a school project by:

- [Alma Navrbjerg](https://github.com/AlmaNavrbjerg)
- Emma-MariaMarup 
- Maia Rambo Kristensen
- Cecilie Løvhøj

Pull requests are welcome for bug fixes and improvements.

---
## AI declaration
In this project there ave been some use of AI, it has mostly been used when an error occured, like a function working but the result not showing on the map.

---
## License

[MIT](./LICENSE)
