# Tip Calculator & Bill Splitter

A clean, fast, fully validated tip calculator and bill splitter built with pure Vanilla HTML, CSS, and JavaScript — no frameworks, no build tools, no dependencies.

---

## Live Demo

| Platform | URL |
|---|---|
| Netlify | [https://genuine-faloodeh-rameen.netlify.app](https://genuine-faloodeh-rameen.netlify.app) |
| GitHub Pages | [https://rameen-f.github.io/tip-calculator/](https://rameen-f.github.io/tip-calculator/) |

---

## How to Run Locally

No installation needed. Seriously.

1. Clone or download this repository
2. Open the folder — you'll see `index.html`, `style.css`, `script.js`
3. Double-click `index.html`
4. It opens in your browser and works immediately

```bash
# Or via terminal
git clone https://github.com/rameen-f/tip-calculator.git
cd tip-calculator
open index.html        # Mac
start index.html       # Windows
```

That's it. No `npm install`. No build step. No terminal required for normal use.

---

## What It Does

Enter a bill amount, pick a tip percentage, enter how many people — the app instantly shows you:

| Output | Description |
|---|---|
| Tip Amount | Total tip calculated on the bill |
| Grand Total | Bill + tip combined |
| Per Person | Exact share each person owes |

Everything updates **live as you type** — no Calculate button needed.

---

## Features

- **Live calculation** — results update instantly on every keystroke
- **Preset tip buttons** — 10%, 15%, 20% with toggle behavior
- **Custom tip input** — overrides presets automatically
- **Full inline validation** — no popups, no browser tooltips, errors appear near the field
- **Reset button** — returns everything to a clean initial state
- **Responsive** — works on 360px mobile, tablet, and 1440px desktop
- **Accessible** — proper labels, ARIA attributes, keyboard navigation, visible focus states

---

## Validation Handled

- Bill is required and must be greater than 0
- Negative bill amounts are rejected
- Tip must be between 0% and 100%
- Number of people must be a whole number ≥ 1
- Pasted garbage text, decimals in people field, and empty fields all handled gracefully
- Errors disappear automatically when corrected

---

## Project Structure

```
tip-calculator/
├── index.html      # Semantic HTML structure
├── style.css       # Responsive styles, dark theme, animations
├── script.js       # Validation, calculation, rendering logic
└── ANSWERS.md      # Assessment questions answered
```

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Structure | HTML5 | Semantic, accessible markup |
| Styling | CSS3 | Flexbox + Grid, CSS variables, mobile-first |
| Logic | Vanilla JS | No overhead, runs anywhere, easy to read |
| Fonts | Google Fonts (Syne + DM Mono) | Loaded via CDN, no install |

---

## Rounding Policy

Per-person amounts are rounded to 2 decimal places using `Math.round` with `Number.EPSILON` correction for floating-point accuracy. In rare edge cases (e.g. Rs 100 ÷ 3 people), the group may collect Rs 0.01 less than the exact total — this is documented in `ANSWERS.md`.

---

## Commit History

This project was built incrementally:
- Initial HTML structure and layout
- Styling and responsive design
- Validation logic
- Calculation engine and live updates
- Edge case handling and accessibility pass

---

## Assessment Submission

Built for the **Dev Weekends Fellowship 2026** frontend assessment.

Assessed on: validation quality, smooth interaction, responsiveness, and handling broken inputs gracefully.
