# Justin Umali — Financial Advisor (demo)

A design preview of a personal site for Justin Umali. It's a hand-built static site: plain HTML, CSS and JS, with no build step.

- **Look:** quiet luxury. Warm ivory, ink and brushed brass. Set in Cormorant Garamond with Hanken Grotesk.
- **Motion:** GSAP + ScrollTrigger with Lenis smooth scrolling, all vendored in `vendor/` so nothing depends on a CDN.
- **Signature moments:** a cinematic intro and arch-portrait reveal, words that ink in as you read, pinned three-principle chapters, a live compounding planner, a scroll-drawn process timeline, a signed letter, and a three-step booking flow.
- **Respects** `prefers-reduced-motion` and works without JavaScript.

See [`PLAN.md`](PLAN.md) for the design brief and scoring rubric.

## Run locally
```sh
python3 -m http.server 8000   # then open http://localhost:8000
```

## Publish on GitHub Pages
1. Make the repository public (Settings → General → Danger Zone → Change visibility).
2. Go to Settings → Pages → Build and deployment, choose **Deploy from a branch**, then pick the branch and `/ (root)`.
3. The site appears at `https://<user>.github.io/financialadvisordemosite/`.

The email (`hello@justinumali.example`) and all compliance text are placeholders.
