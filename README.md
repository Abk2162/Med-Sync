# Med-Sync

Med-Sync is an AI-powered medical prescription parser built specifically for our hackathon submission. 
It takes an image of a handwritten or printed medical prescription, securely parses it using Google's `gemini-1.5-flash` model, and returns a structured, highly-accessible medication schedule.

## Features & Judging Criteria
- **Efficiency**: A Next.js statically-exported frontend served blazing fast by a lightweight Flask backend, fully single-containerized.
- **Security**: Strict input validation for images (`jpeg`, `png`, `webp`). The `GEMINI_API_KEY` is fully server-side and entirely hidden from the Next.js client.
- **Google Services integration**: Directly wired into `@google/genai` utilizing the latest and fastest multi-modal model, `gemini-1.5-flash`.
- **Accessibility**: Built with semantic HTML5 (`<main>`, `<article>`), logical `aria-labels`, and high-contrast Tailwind UI specifically built for screen-reader and keyboard navigation compliance (`focus:ring`).
- **Production Ready**: Fully dockerized out-of-the-box (`Dockerfile`) and continuously deployed to Google Cloud Run.

## Local Development (Testing)
1. Run `npm install` and `npm run dev` in the `/frontend` directory (`http://localhost:3000`).
2. Run `python -m venv .venv`, `pip install -r requirements.txt`, and `flask run` in the `/backend` directory.

## Deployment
This project is built to deploy securely to **Google Cloud Run** in a single container.
```bash
gcloud run deploy med-sync --source . --region us-central1 --allow-unauthenticated --set-env-vars="GEMINI_API_KEY=YOUR_KEY"
```
