ANSWERS.md — Tip Calculator / Bill Splitter

Q1. How to Run the Project
Local (Zero Setup)

Download or clone the repository.
Open the folder — you will see three files:

index.html
style.css
script.js


Double-click index.html — it opens directly in any modern browser (Chrome, Firefox, Edge, Safari).
No terminal, no npm install, no build step required.

Deploy on GitHub Pages (Free)

Push the three files to a GitHub repository (make sure index.html is at the root).
Go to Settings → Pages.
Under Source, select the main branch and / (root).
Click Save — GitHub will give you a live URL in about 60 seconds.

Live on GitHub Pages: https://rameen-f.github.io/tip-calculator/
Deploy on Netlify

Go to netlify.com and sign in with GitHub.
Import the repository and click Deploy — no build settings needed.
Your site is live instantly with a shareable URL.

Live on Netlify: https://genuine-faloodeh-rameen.netlify.app

Q2. Stack & Design Choices
Why Vanilla HTML / CSS / JS
The assessment spec explicitly asked for "no frameworks unless absolutely necessary." Beyond compliance, vanilla JS is the right tool here: the app has no routing, no shared state between components, and no async data fetching. Adding React would introduce JSX compilation, a build pipeline, and unnecessary abstraction for what is essentially a handful of DOM reads and arithmetic operations. The result is a file you can open by double-clicking — zero friction.
UI/UX Decision 1 — Live calculation, no submit button
The entire output panel recalculates on every input event. This mirrors how a mental calculation works: you adjust one number and immediately see the impact on the split. A "Calculate" button would force the user to click after every change — unnecessary cognitive overhead. The tradeoff is that partial/invalid inputs must show friendly inline errors rather than waiting for submit, which was handled carefully to avoid premature error flashing.
UI/UX Decision 2 — Preset tip buttons that toggle
The three preset buttons (10 % / 15 % / 20 %) use a toggle pattern: clicking an active button deactivates it (clears the tip). This prevents the user from getting stuck at a tip percentage they no longer want. Clicking any preset also clears the custom tip field to avoid ambiguity about which value is in use. The currently active preset is visually distinct (filled with accent green, dark text) so the state is always obvious at a glance.

Q3. Responsive & Accessibility Considerations
Mobile Responsiveness (360 px → 1440 px)

The layout uses CSS Grid with grid-template-columns: 1fr 1fr on wide screens, collapsing to a single column at ≤ 720 px. The inputs appear first, results below — the natural reading order on a phone.
All font-size values use clamp() or fixed rem values that scale with system font preferences.
The input fields use type="number" which triggers a numeric keyboard on iOS/Android — no letters to mistype.
Spinner arrows on number inputs are hidden (-webkit-appearance: none) to give more room and cleaner appearance on small screens.
No horizontal overflow: all containers use max-width with width: 100% and padding instead of fixed pixel widths.

Accessibility Features

Labels: every <input> has a matching <label for="..."> — screen readers announce the field name correctly.
ARIA live regions: all three error <span> elements carry role="alert" and aria-live="polite" so screen readers announce errors without interrupting the user mid-sentence.
aria-pressed on preset buttons communicates toggle state to assistive technology.
aria-describedby links each input to its error message element.
Focus states: :focus-visible outlines are never suppressed — keyboard-only users can always see which element is focused.
Semantic HTML: <main>, <header>, <section>, <label>, <output>, and <button> are used in place of generic <div> wherever meaningful.
Tab order follows the natural DOM order (bill → tip presets → custom tip → people → reset).
Color contrast: text on backgrounds meets WCAG AA (verified manually; the accent green #c8f04d on dark #0d0f14 is above 4.5 : 1).

One Thing Knowingly Skipped
I did not add a live ARIA announcement of the calculated result (e.g., announcing "Per person: Rs 312.50" after each keystroke via an aria-live region on the result panel). Adding it would cause screen readers to fire on every single keystroke, which is disruptive. The preferred pattern for live calculators is to announce only on a deliberate action (e.g., a submit button), but since this app is intentionally button-free, the tradeoff is accepted. A future improvement would be to debounce the announcement by ~800 ms so it fires only when the user pauses.

Q4. AI Usage Disclosure
Tool used: Claude (Anthropic) — used as a research and reference assistant, similar to how a developer would use documentation or Stack Overflow.
Specifically what I used it for:

Looking up the correct syntax for Number.EPSILON in floating-point rounding (a known JS quirk I wanted to handle accurately).
Confirming best practices for aria-live and role="alert" on inline error messages.
Getting a starting point for the file structure so I could focus time on the interaction logic and UX decisions.

What I changed from any AI suggestions and why:

Grid layout: An auto-fit minmax(320px, 1fr) grid was suggested for the card layout. I replaced it with an explicit 1fr 1fr grid with a hard breakpoint at 720px because auto-fit minmax caused the results card to collapse to an unusably narrow strip at mid-tablet widths (~600–680px) — a real UX bug on actual devices.
Tip validation behaviour: The initial suggestion flagged an empty tip field as a validation error ("Tip is required"). I changed validateTip() to treat an empty tip as 0% and pass validation, because tip is optional — making it required would force every user to interact with the tip section even when splitting with no tip, which is a common real-world case.
Visual design: The suggested colour scheme was a generic purple gradient on white. I replaced it entirely with a dark theme using a yellow-green accent (#c8f04d) and DM Mono / Syne typography — a deliberate choice to make the numbers feel precise and technical, which suits a calculator.

The core logic — validation functions, calculation formula, event listener structure, reset flow — was written and reasoned through by me. AI helped me move faster on syntax and accessibility lookups, not on the thinking.

Q5. Honest Gap
The one thing that isn't polished enough: the per-person rounding policy.
Currently, perPerson = grandTotal / people is rounded to 2 decimal places using Math.round. In edge cases (e.g., Rs 100 split 3 ways = Rs 33.33 each = Rs 99.99 collected, not Rs 100), the group underpays by Rs 0.01. A more robust solution would distribute the remainder: round down for most people and add the leftover cent to the last person's share (or to the first — the "host pays the odd cent" convention). With another day I would implement this distributor and show a note like "Person 1 pays Rs 33.34; others pay Rs 33.33" in the results panel.
