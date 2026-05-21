/**
 * Tip Calculator & Bill Splitter
 * ─────────────────────────────
 * Pure Vanilla JS — no frameworks, no build tools.
 * Structure:
 *   1. DOM references
 *   2. State
 *   3. Validation helpers
 *   4. Calculation engine
 *   5. Render / display
 *   6. Event listeners
 *   7. Reset
 */

/* ============================================================
   1. DOM REFERENCES
   ============================================================ */
const billInput      = document.getElementById('billAmount');
const customTipInput = document.getElementById('customTip');
const peopleInput    = document.getElementById('numPeople');

const billWrap    = document.getElementById('billWrap');
const tipWrap     = document.getElementById('tipWrap');
const peopleWrap  = document.getElementById('peopleWrap');

const billError   = document.getElementById('billError');
const tipError    = document.getElementById('tipError');
const peopleError = document.getElementById('peopleError');

const tipAmountEl  = document.getElementById('tipAmount');
const grandTotalEl = document.getElementById('grandTotal');
const perPersonEl  = document.getElementById('perPerson');
const emptyState   = document.getElementById('emptyState');

const tipBtns  = document.querySelectorAll('.tip-btn');
const resetBtn = document.getElementById('resetBtn');

/* ============================================================
   2. STATE
   ============================================================ */
let state = {
  bill:          '',   // raw string from input
  tipPercent:    '',   // active tip % (preset or custom)
  people:        '',   // raw string from input
  activePreset:  null, // currently highlighted preset (10/15/20 or null)
};

/* ============================================================
   3. VALIDATION HELPERS
   ============================================================ */

/** Show an inline error message and mark the input wrap */
function showError(msgEl, wrapEl, message) {
  msgEl.textContent = message;
  msgEl.classList.add('visible');
  wrapEl.classList.add('has-error');
}

/** Clear an inline error message */
function clearError(msgEl, wrapEl) {
  msgEl.textContent = '';
  msgEl.classList.remove('visible');
  wrapEl.classList.remove('has-error');
}

/**
 * Validate bill amount.
 * Returns { valid: Boolean, value: Number|null }
 */
function validateBill() {
  const raw = billInput.value.trim();

  if (raw === '') {
    showError(billError, billWrap, 'Bill amount is required.');
    return { valid: false, value: null };
  }

  const num = parseFloat(raw);

  if (isNaN(num)) {
    showError(billError, billWrap, 'Please enter a valid number.');
    return { valid: false, value: null };
  }

  if (num < 0) {
    showError(billError, billWrap, 'Bill amount cannot be negative.');
    return { valid: false, value: null };
  }

  if (num === 0) {
    showError(billError, billWrap, 'Bill must be greater than 0.');
    return { valid: false, value: null };
  }

  if (num > 10_000_000) {
    showError(billError, billWrap, 'That\'s a very large bill! Max 10,000,000.');
    return { valid: false, value: null };
  }

  clearError(billError, billWrap);
  return { valid: true, value: num };
}

/**
 * Validate tip percentage.
 * Returns { valid: Boolean, value: Number|null }
 */
function validateTip() {
  const raw = state.tipPercent;

  // Tip is optional — default to 0 if empty
  if (raw === '' || raw === null || raw === undefined) {
    clearError(tipError, tipWrap);
    return { valid: true, value: 0 };
  }

  const num = parseFloat(raw);

  if (isNaN(num)) {
    showError(tipError, tipWrap, 'Please enter a valid tip percentage.');
    return { valid: false, value: null };
  }

  if (num < 0) {
    showError(tipError, tipWrap, 'Tip cannot be negative.');
    return { valid: false, value: null };
  }

  if (num > 100) {
    showError(tipError, tipWrap, 'Tip above 100%? Max allowed is 100%.');
    return { valid: false, value: null };
  }

  clearError(tipError, tipWrap);
  return { valid: true, value: num };
}

/**
 * Validate number of people.
 * Returns { valid: Boolean, value: Number|null }
 */
function validatePeople() {
  const raw = peopleInput.value.trim();

  if (raw === '') {
    showError(peopleError, peopleWrap, 'Number of people is required.');
    return { valid: false, value: null };
  }

  // Reject if it has a decimal point — people must be whole
  if (raw.includes('.')) {
    showError(peopleError, peopleWrap, 'Number of people must be a whole number.');
    return { valid: false, value: null };
  }

  const num = parseInt(raw, 10);

  if (isNaN(num)) {
    showError(peopleError, peopleWrap, 'Please enter a valid number.');
    return { valid: false, value: null };
  }

  if (num <= 0) {
    showError(peopleError, peopleWrap, 'At least 1 person is required.');
    return { valid: false, value: null };
  }

  if (num > 1000) {
    showError(peopleError, peopleWrap, 'Maximum 1000 people supported.');
    return { valid: false, value: null };
  }

  clearError(peopleError, peopleWrap);
  return { valid: true, value: num };
}

/* ============================================================
   4. CALCULATION ENGINE
   ============================================================ */

/**
 * Core formula:
 *   tipAmount  = bill × tipPercent / 100
 *   grandTotal = bill + tipAmount
 *   perPerson  = grandTotal / people
 *
 * Rounding policy: standard Math.round to 2 decimal places.
 * This means the group may underpay by at most Rs 0.01 per person
 * in edge cases — documented in ANSWERS.md.
 */
function calculate(bill, tipPercent, people) {
  const tipAmount  = bill * tipPercent / 100;
  const grandTotal = bill + tipAmount;
  const perPerson  = grandTotal / people;

  return {
    tipAmount:  round2(tipAmount),
    grandTotal: round2(grandTotal),
    perPerson:  round2(perPerson),
  };
}

/** Round to 2 decimal places using Math.round for currency accuracy */
function round2(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

/** Format number to Rs 1,234.56 style */
function formatCurrency(num) {
  return 'Rs\u00a0' + num.toLocaleString('en-PK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}


/**
 * Main update function — runs every time any input changes.
 * Validates all fields, then either shows results or clears them.
 */
function update() {
  const billResult   = validateBill();
  const tipResult    = validateTip();
  const peopleResult = validatePeople();

  // If any field is invalid or empty, clear outputs
  if (!billResult.valid || !tipResult.valid || !peopleResult.valid) {
    clearResults();
    return;
  }

  // Run calculation
  const results = calculate(billResult.value, tipResult.value, peopleResult.value);
  renderResults(results);
}

/** Display calculated values in the output card */
function renderResults({ tipAmount, grandTotal, perPerson }) {
  emptyState.classList.add('hidden');

  setOutputValue(tipAmountEl,  formatCurrency(tipAmount));
  setOutputValue(grandTotalEl, formatCurrency(grandTotal));
  setOutputValue(perPersonEl,  formatCurrency(perPerson));
}

/** Animate a result value change */
function setOutputValue(el, newText) {
  const span = el.querySelector('.value-num');
  if (span.textContent === newText) return; // no change, skip animation

  el.classList.remove('updating');
  // Force reflow so animation restarts
  void el.offsetWidth;
  el.classList.add('updating');
  span.textContent = newText;

  el.addEventListener('animationend', () => el.classList.remove('updating'), { once: true });
}

/** Reset all output fields to placeholder state */
function clearResults() {
  emptyState.classList.remove('hidden');

  const dash = '—';
  tipAmountEl.querySelector('.value-num').textContent  = dash;
  grandTotalEl.querySelector('.value-num').textContent = dash;
  perPersonEl.querySelector('.value-num').textContent  = dash;
}



// ── Bill Amount ──
billInput.addEventListener('input', () => {
  state.bill = billInput.value;
  update();
});

// ── Preset Tip Buttons ──
tipBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tipVal = btn.dataset.tip;

    // Toggle: clicking active button deactivates it
    if (state.activePreset === tipVal) {
      deactivatePresets();
      state.tipPercent = '';
      customTipInput.value = '';
    } else {
      // Activate clicked preset
      activatePreset(btn, tipVal);
      // Clear custom tip field
      customTipInput.value = '';
      clearError(tipError, tipWrap);
    }
    update();
  });
});

// ── Custom Tip Input ──
customTipInput.addEventListener('input', () => {
  const raw = customTipInput.value.trim();

  if (raw !== '') {
    // Custom tip overrides presets
    deactivatePresets();
    state.tipPercent = raw;
  } else {
    // Custom cleared — check if a preset was previously active
    state.tipPercent = state.activePreset || '';
  }
  update();
});

// ── Number of People ──
peopleInput.addEventListener('input', () => {
  state.people = peopleInput.value;
  update();
});

// ── Keyboard accessibility: Enter on tip buttons ──
tipBtns.forEach(btn => {
  btn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });
});


resetBtn.addEventListener('click', resetApp);

function resetApp() {
  // Clear inputs
  billInput.value      = '';
  customTipInput.value = '';
  peopleInput.value    = '';

  // Reset state
  state = { bill: '', tipPercent: '', people: '', activePreset: null };

  // Clear preset buttons
  deactivatePresets();

  // Clear all errors
  clearError(billError,   billWrap);
  clearError(tipError,    tipWrap);
  clearError(peopleError, peopleWrap);

  // Clear outputs
  clearResults();

  // Focus back to bill input for great UX
  billInput.focus();
}


function activatePreset(btn, tipVal) {
  deactivatePresets();
  btn.classList.add('active');
  btn.setAttribute('aria-pressed', 'true');
  state.activePreset = tipVal;
  state.tipPercent   = tipVal;
}

function deactivatePresets() {
  tipBtns.forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-pressed', 'false');
  });
  state.activePreset = null;
}


clearResults();
