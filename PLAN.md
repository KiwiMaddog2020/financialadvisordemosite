# Justin Umali — Demo Site Plan

## Decisions from the interview
| Area | Choice |
|---|---|
| Direction | Quiet luxury: warm ivory `#F5F1EA`, ink `#12161C`, brushed brass accent `#A8864F` |
| Type | **Cormorant Garamond** (variable weight) for display · **Hanken Grotesk** for text. Fraunces was tried first and judged too quirky |
| Practice | Comprehensive planning: retirement, investments, tax-aware planning, insurance, estate coordination |
| Identity | "Justin Umali, Financial Advisor" with no city or firm. Placeholder email `hello@justinumali.example` |
| Build | Hand-written static HTML/CSS/JS. GSAP + ScrollTrigger + Lenis, vendored in `vendor/`. GitHub Pages, no build step |
| Compliance | Refined placeholder disclosures plus a clear "demonstration site" note |

## Signature moments
1. **Cinematic portrait intro.** A brass hairline draws across an ivory screen, the name sets letter by letter, each glyph rising and coming into focus, and the portrait opens through a rising arch-shaped clip-path. The photo's white backdrop is blended into the ivory with `mix-blend-mode: multiply`, so it looks shot for the page.
2. **Scroll-told philosophy.** A pinned chapter with three principles (Clarity, Discipline, Stewardship). Each one crossfades in turn, with a large roman numeral and a progress rail.
3. **Live compounding chart.** Sliders for starting amount, monthly contribution, years and assumed return. An SVG path redraws itself with a gradient area underneath, the totals count up, and a "contributions vs growth" split shows. It's hand-built, with no chart library.
4. **"Your first meeting" timeline.** Conversation, then Blueprint, then Stewardship, joined by a brass line that draws as you scroll.
5. **Letter from Justin.** A short personal note in large serif, with an SVG signature that writes itself.
6. **Booking flow.** A three-step modal (topic, then timing, then contact), with shared-element transitions and a thank-you state that draws a check mark. Demo only; nothing is sent.
7. **Tactile layer.** Lenis inertial scroll, magnetic buttons, a cursor that becomes "View" or "Drag" in context, faint film grain, and a page-wide hairline scroll-progress bar.

## Anti-generic rules (what AI sites do, and what we do instead)
- No Inter/Poppins/Playfair, no purple gradients, no emoji icons, no glassmorphism cards, no "Unlock your financial future 🚀".
- No three identical icon cards in a row. Services are an **index list** (numbered rows that expand on hover, like a private bank's annual report).
- No stock photos. The only image is Justin; everything else is type, rules, numbers and drawn SVG.
- Copy is specific and calm, written in the first person ("I"), not "we empower clients to…".
- An asymmetric 12-column grid, with deliberately large white space and hanging punctuation.
- One accent colour, used sparingly: hairlines, numerals and the signature.
- Motion is slow and weighted (custom `cubic-bezier(.7,0,.2,1)`), and never bouncy.
- Everything respects `prefers-reduced-motion` and works without JS (content visible by default, enhanced with JS).

## Self-score rubric (target ≥ 90)
| Criterion | Pts |
|---|---|
| First 5 seconds: intro feels bespoke, not templated | 15 |
| Typography quality (scale, rhythm, variable-axis use) | 15 |
| Motion craft: smooth, purposeful, no jank | 15 |
| Interactive centrepiece (calculator) works and is beautiful | 10 |
| Copy reads human and credible for a financial advisor | 10 |
| Trust: portrait treatment, credentials, disclosures | 10 |
| Responsive (360px to 1920px), no horizontal scroll | 10 |
| Accessibility: contrast, focus, reduced motion, semantics | 5 |
| Performance: fast first paint, small assets | 5 |
| Polish: favicon, OG image, 404, no console errors | 5 |

Verified with Playwright screenshots at desktop and mobile widths before shipping.
