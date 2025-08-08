# Marine Services Website

A simple, static site for a marine services business with organized assets and service pages.

## Project Structure

```
/workspace
├── index.html                 # Home page
├── pages/                     # Service pages
│   ├── salvage-recovery.html
│   ├── hull-cleaning.html
│   ├── fiberglass-hull-repair.html
│   ├── custom-fabrication-welding.html
│   └── boat-detailing-cleaning.html
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
│   └── img/
│       └── logo.png
├── robots.txt
├── sitemap.xml
└── README.md
```

## Local Development

- Open `index.html` in a browser.
- All pages share the same CSS and JS under `assets/`.
- Navigation links and asset paths are relative and already updated.

## SEO

- `robots.txt` allows all crawling and points to `sitemap.xml`.
- `sitemap.xml` lists all public pages.

## Deployment

- Host the contents of `/workspace` on any static host (e.g., Netlify, GitHub Pages, Vercel, S3+CloudFront).
- Ensure the site is served from the root so links like `/pages/...` resolve correctly.

## Maintenance

- Add new service pages under `pages/` and include them in `sitemap.xml`.
- Keep shared styles in `assets/css/style.css` and scripts in `assets/js/script.js`.