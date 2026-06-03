# Shankaran Srinivasan Iyer — Astrologer Website

One-page Vedic astrology website. **Stack:** HTML + CSS + JavaScript — no framework, no build step.

---

## Files at a glance

| File / Folder | What it does |
|---|---|
| `index.html` | The entire website — all sections in one file |
| `style.css` | All visual styling and layout |
| `script.js` | Nav toggle, scroll effects, form validation, card animations |
| `robots.txt` | Tells search crawlers what to index (SEO, matters after deployment) |
| `sitemap.xml` | Page list submitted to Google Search Console (SEO, matters after deployment) |
| `images/` | All local images — deity gallery, astrologer portrait |

---

## Run locally

```bash
cd astrologer-website
npx serve .
```

Then open `http://localhost:3000` in your browser.

> Opening `index.html` directly as a file works for visual checks, but the contact form requires a server URL to submit. Use `npx serve .` to test the form.

---

## Deploy (free)

### 1 — Push to GitHub

1. Go to [github.com](https://github.com) → **New repository** → name it `astrologer-website` → Public → Create
2. Upload all files using the **"uploading an existing file"** link on the repo page

### 2 — Deploy on Cloudflare Pages

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com) → create a free account
2. **Create a project** → **Connect to Git** → select `astrologer-website`
3. Build settings: Framework preset **None**, build command *(empty)*, output directory `/`
4. Click **Save and Deploy**

Site goes live in ~30 seconds at `https://astrologer-website.pages.dev`

---

## Activate the contact form

1. Open the live site → scroll to Contact → submit the form once
2. Check `viceroy.srikanth@gmail.com` for a FormSubmit activation email → click the link
3. Done — all future submissions are delivered to Gmail automatically
