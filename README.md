# My Astro Guide

A bilingual English/Sinhala Vedic astrology web application using Lahiri ayanamsa, Sri Lankan fixed-house charts, rule-based calculations, a whole-chart AI life-guide report, profile-grounded AI chat, city suggestions, PWA installation, and downloadable PDF reports.

The compact application workspace is organised into four sections: Astro Data (calculations and relative power only), Life Guide (AI-polished complete report), Ask Guide (profile-grounded chat), and My Profiles & Reports (private on-device profile storage and PDF export).

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

City suggestions use the public Open-Meteo geocoding API with built-in fallbacks for major Sri Lankan cities. The calculation and rule-based report work without a database.

### Enable the complete AI life report and profile questions

Add these variables in Vercel under **Project Settings → Environment Variables**, then redeploy:

```text
OPENAI_API_KEY=your OpenAI API key
OPENAI_MODEL=gpt-5-mini
```

The key is used only by server-side API routes and is never exposed to the browser. The complete life report considers the calculated Lagna, planets, houses, strengths, aspects, conjunctions, yogas, conditions, Navamsa, Panchanga, life-area scores and Dasha timeline together. The same structured request also produces simple AI-polished explanations for all planets, detected yogas, life areas and active conditions without changing any calculated data.

## PWA installation

The project contains a web app manifest, install prompt, service worker, offline shell and app icons. PWA installation requires HTTPS, which Vercel provides automatically.

## Important calculation note

The application uses Astronomy Engine, Lahiri sidereal conversion, whole-sign houses and rule-based Vedic interpretation. Astrology output is for reflective guidance. Validate ephemeris precision independently before professional or commercial use.

## License

The application code is provided under AGPL-3.0. Astronomy Engine is used under its MIT license.
