# Flexx Walking Challenge Leaderboard

A simple React + Firebase leaderboard for the Flexx gym walking challenge.

## What it includes

- Overall location leaderboard ranked by average steps per person
- Per-location tabs for all 8 gyms
- Top 5 average steppers per location
- Top 5 highest stepped days per location
- Flexx-inspired dark blue / cyan styling
- Firebase Firestore support with sample fallback data

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and add your Firebase config values.

3. Start the app:

```bash
npm run dev
```

## Firestore shape

Create a collection called `locations`. Each document can look like this:

```json
{
  "name": "Highland Park",
  "accent": "north",
  "participants": 18,
  "averageStepsPerPerson": 13418,
  "topAverageSteppers": [
    {
      "id": "hp-1",
      "name": "Ethan P.",
      "averageSteps": 19880,
      "totalSteps": 198800
    }
  ],
  "topDays": [
    {
      "id": "hp-d1",
      "participant": "Ethan P.",
      "date": "2026-04-13",
      "steps": 32420
    }
  ]
}
```

If Firebase is not configured yet, the site will render using included sample data so you can style and test the UI immediately.
