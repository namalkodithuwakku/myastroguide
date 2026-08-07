# My Astro Guide

A bilingual English/Sinhala Vedic astrology web application using Lahiri ayanamsa, Sri Lankan fixed-house charts, rule-based life guidance, yoga and planetary explanations, city suggestions, and downloadable PDF reports.

## Run locally

Requirements: Node.js 22 or later.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy to Vercel

1. Create a GitHub repository and upload this project.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Keep the detected framework as **Next.js**.
4. Use `npm run build` as the build command and deploy.

No environment variables or database are required for this version. City suggestions use the public Open-Meteo geocoding API with built-in fallbacks for major Sri Lankan cities.

## PWA installation

The project contains a web app manifest, install prompt, service worker, offline shell and app icons. PWA installation requires HTTPS, which Vercel provides automatically.

## Important calculation note

The application uses Astronomy Engine, Lahiri sidereal conversion, whole-sign houses and rule-based Vedic interpretation. Astrology output is for reflective guidance. Validate ephemeris precision independently before professional or commercial use.

## License

The application code is provided under AGPL-3.0. Astronomy Engine is used under its MIT license.
