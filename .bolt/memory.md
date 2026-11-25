# Project memory

## Product intent & audience

- Landing page for **Nova Space**, an architectural home/studio.
- Single static HTML page built to showcase the studio's work, client testimonials, and a project gallery.
- Audience: potential clients seeking architectural design services.

## Brand personality & voice

- Architectural, modern, professional tone.
- On-page copy and code comments written in **Ukrainian**.
- Slogans are concise and brand-forward (hero uses rotating typewriter slogans).

## Visual design & UX direction

- **Stack:** Vite/HTML static page — no React, no jQuery. Tailwind CSS via CDN.
- **Library delivery:** all third-party libraries via jsDelivr CDN; CSS in `<head>`, JS before `</body>`, initialization wrapped in `DOMContentLoaded`.
- **Hero:** Typed.js 2.0.12 rotating 3 slogans (typeSpeed 50, backSpeed 30, loop). Hidden fallback text provided for screen readers (`.sr-only` utility).
- **Reviews carousel:** Swiper v11, 6 slides (text, name, Unsplash avatar, 5-star rating). Loop + autoplay 3500 ms with `pauseOnMouseEnter`, clickable pagination, navigation arrows. Responsive breakpoints: 320→1 slide, 768→2, 1024→3.
- **Gallery:** Fancybox v5 (`@fancyapps/ui@5.0`), 6 images in CSS Grid, single album via `data-fancybox`, `data-caption`, fade transition, zoom to 3×.
- **Layout:** existing sections include hero, reviews, gallery, blog, contact form, and a nav menu with a "Галерея" link added.
- **Responsive & accessible:** mobile-first, no console errors, sr-only fallbacks for JS-dependent content.
- **Images:** Unsplash source URLs used directly for avatars and gallery photos.

## Decisions, constraints & rationale

- No React or jQuery — plain HTML + CDN libraries only.
- jsDelivr chosen as the sole CDN provider for consistency.
- `DOMContentLoaded` wrapper ensures libraries init after parse without module bundling.
- Screen-reader hidden text added so hero slogans remain accessible without JS.
- Gallery nav link added so new section is reachable from the menu.
- Pexels was unavailable; Unsplash URLs used instead as specified by the task.

## Open questions & assumptions

- Whether the project will later migrate from Tailwind CDN to a built Tailwind config (CDN is fine for static demo but not production-performant).
- No explicit brand color palette or typography was specified; current styling inherited from the pre-existing page.
- No analytics, SEO metadata, or form-backend integration was requested or added.