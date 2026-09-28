# SmartCare Assist – Interactive Technical Documentation

A static site explaining the rule-based **SmartCare Assist** module of [Carecrypt](https://github.com/SAHIL-coder-79/Carecrypt). Content was checked against the source (`smartcare/`, `backend/src/smartcare/adapter.js`); the original repository is unchanged.

**Stack:** HTML, CSS, vanilla JS, Vite, Three.js (hero), Two.js (pipeline diagram), GitHub Actions. No backend or API keys.

## Run locally
```
npm install
npm run dev       # development server
npm run build     # production build in dist/
npm run preview   # preview the build
```
Requires Node.js 18+ (CI uses 20).

## Structure
`index.html` (content) · `src/main.js` · `src/hero.js` (Three.js) · `src/workflow.js` (Two.js) · `src/style.css` · `public/favicon.svg` · `.github/workflows/deploy.yml`

## Publish (GitHub Pages)
```
git init
git add .
git commit -m "SmartCare Assist documentation"
git branch -M main
git remote add origin https://github.com/neha19star/smartcare-documentation.git
git push -u origin main
```
Then on GitHub: **Settings → Pages → Source: GitHub Actions**. The workflow deploys to https://neha19star.github.io/smartcare-documentation/ (Vite `base` is `/smartcare-documentation/`).

## Safety
SmartCare Assist is a rule-based decision-support tool, not a diagnostic system, and is not clinically validated. Attribution: Carecrypt by SAHIL-coder-79.
