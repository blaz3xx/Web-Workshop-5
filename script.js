let rectWidth = 13;
let rectHeight = 8;

function calculateRectangleArea() {
  const w = Number(rectWidth);
  const h = Number(rectHeight);
  if (!Number.isFinite(w) || !Number.isFinite(h) || w < 0 || h < 0) return null;
  return w * h;
}

function renderRectangleArea() {
  const container = document.querySelector('.block5 .content');
  if (!container) return;
  const area = calculateRectangleArea();
  let el = document.getElementById('rect-area-result');
  if (!el) {
    el = document.createElement('p');
    el.id = 'rect-area-result';
    container.appendChild(el);
  }
  el.textContent = area === null ? 'Rectangle area: n/a' : `Rectangle area: ${area}`;
}


function setCookie(name, value, days = 7) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)};${expires};path=/`;
}

function getCookie(name) {
  const target = encodeURIComponent(name) + '=';
  const parts = document.cookie.split('; ');
  for (const part of parts) {
    if (part.startsWith(target)) {
      return decodeURIComponent(part.substring(target.length));
    }
  }
  return null;
}

function deleteCookie(name) {
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}


function computeMinCount(values) {
  const nums = values.map(Number);
  if (nums.length !== 10 || nums.some(n => !Number.isFinite(n))) return null;
  let min = nums[0];
  for (let i = 1; i < nums.length; i++) if (nums[i] < min) min = nums[i];
  const count = nums.filter(n => n === min).length;
  return { min, count, nums };
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('swapBtn');
  const getX = () => document.querySelector('.blockX');
  const getY = () => document.querySelector('.blockY');
  const widthInput = document.getElementById('rectWidthInput');
  const heightInput = document.getElementById('rectHeightInput');
  const italicCheckbox = document.getElementById('italicBlock3Checkbox');
  const block3 = document.querySelector('.block3');
  const blockY = document.querySelector('.blockY');
  const cssForm = document.getElementById('cssRulesFormContainer');
  const cssBlockSelect = document.getElementById('cssBlockSelect');
  const cssTagInput = document.getElementById('cssTagInput');
  const cssPropsContainer = document.getElementById('cssPropsContainer');
  const addPropRowBtn = document.getElementById('addPropRowBtn');
  const saveCssRuleBtn = document.getElementById('saveCssRuleBtn');
  const cssRulesList = document.getElementById('cssRulesList');
  const minFormContainer = document.getElementById('minFormContainer');
  const minForm = document.getElementById('minNumbersForm');

  function swapNodes(a, b) {
    if (!a || !b) return;
    const aParent = a.parentNode;
    const bParent = b.parentNode;
    if (!aParent || !bParent) return;

    const aNext = a.nextSibling;
    const bNext = b.nextSibling;

    bParent.insertBefore(a, bNext);
    aParent.insertBefore(b, aNext);
  }

  btn?.addEventListener('click', () => {
    const x = getX();
    const y = getY();
    if (!x || !y) return;
    swapNodes(x, y);
    x.classList.remove('blockX');
    x.classList.add('blockY');
    y.classList.remove('blockY');
    y.classList.add('blockX');
  });

  renderRectangleArea();

  if (widthInput && heightInput) {
    if (typeof rectWidth !== 'undefined') widthInput.value = String(rectWidth);
    if (typeof rectHeight !== 'undefined') heightInput.value = String(rectHeight);

    const update = () => {
      const w = parseFloat(widthInput.value);
      const h = parseFloat(heightInput.value);
      rectWidth = w;
      rectHeight = h;
      renderRectangleArea();
    };

    widthInput.addEventListener('input', update);
    heightInput.addEventListener('input', update);
  }

  if (minForm) {
    minForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(minForm);
      const vals = [];
      for (let i = 1; i <= 10; i++) vals.push(data.get(`n${i}`));
      if (vals.some(v => v === null || v === '')) {
        alert('Please fill all 10 numbers.');
        return;
      }
      const res = computeMinCount(vals);
      if (!res) {
        alert('Invalid input. Ensure all values are valid numbers.');
        return;
      }
      alert(`Minimum value: ${res.min}\nCount of minimums: ${res.count}`);
      const payload = { values: res.nums, min: res.min, count: res.count, ts: Date.now() };
      try { setCookie('minNumsData', JSON.stringify(payload), 7); } catch {}
    });
  }

  try {
    const cookieRaw = getCookie('minNumsData');
    if (cookieRaw) {
      if (minFormContainer) minFormContainer.style.display = 'none';
      let msg = 'Saved data found in cookies.';
      try {
        const parsed = JSON.parse(cookieRaw);
        if (parsed && Array.isArray(parsed.values)) {
          msg = `Saved data found in cookies.\nValues: ${parsed.values.join(', ')}\nMinimum: ${parsed.min}\nCount: ${parsed.count}`;
        }
      } catch {}
      const keep = confirm(`${msg}\n\nKeep this data from cookies?`);
      if (keep) {
        alert('Cookies are present. If needed, reload the page.');
      } else {
        deleteCookie('minNumsData');
        alert('Saved data removed. The form will be shown again.');
        if (minFormContainer) minFormContainer.style.display = '';
      }
    }
  } catch {}

  try {
    const savedItalic = localStorage.getItem('block3Italic');
    const isItalic = savedItalic === 'true';
    if (block3) block3.classList.toggle('italic-on', isItalic);
    if (italicCheckbox) italicCheckbox.checked = isItalic;
  } catch {}

  const applyItalicFromCheckbox = () => {
    if (!block3) return;
    const enable = !!(italicCheckbox && italicCheckbox.checked);
    block3.classList.toggle('italic-on', enable);
    try { localStorage.setItem('block3Italic', String(enable)); } catch {}
  };

  document.addEventListener('keypress', applyItalicFromCheckbox);
  document.addEventListener('keydown', applyItalicFromCheckbox);

  if (italicCheckbox) {
    italicCheckbox.addEventListener('change', applyItalicFromCheckbox);
    italicCheckbox.addEventListener('click', applyItalicFromCheckbox);
    italicCheckbox.addEventListener('input', applyItalicFromCheckbox);
  }

  
  let dynamicStyleEl = document.getElementById('dynamicUserStyles');
  if (!dynamicStyleEl) {
    dynamicStyleEl = document.createElement('style');
    dynamicStyleEl.id = 'dynamicUserStyles';
    document.head.appendChild(dynamicStyleEl);
  }

  function loadCssRules() {
    try {
      const raw = localStorage.getItem('customCssRules');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveCssRules(rules) {
    try { localStorage.setItem('customCssRules', JSON.stringify(rules)); } catch {}
  }

  function buildSelector(blockNum, tag) {
    const bn = String(blockNum).trim();
    const t = String(tag || '').trim().toLowerCase();
    const blockSel = `.block${bn}`;
    return t ? `${blockSel} ${t}` : blockSel;
  }

  function renderDynamicStyles(rules) {
    const css = rules.map(r => `${r.selector} { ${Object.entries(r.props).map(([k,v]) => `${k}: ${v};`).join(' ')} }`).join('\n');
    dynamicStyleEl.textContent = css;
  }

  function renderRulesList(rules) {
    if (!cssRulesList) return;
    cssRulesList.innerHTML = '';
    if (!rules.length) return;
    for (const r of rules) {
      const item = document.createElement('div');
      item.className = 'rule-item';
      const code = document.createElement('code');
      code.textContent = `${r.selector} { ${Object.entries(r.props).map(([k,v]) => `${k}: ${v};`).join(' ')} }`;
      const btn = document.createElement('button');
      btn.textContent = 'Delete';
      btn.addEventListener('click', () => {
        const next = loadCssRules().filter(x => x.id !== r.id);
        saveCssRules(next);
        renderDynamicStyles(next);
        renderRulesList(next);
      });
      item.appendChild(code);
      item.appendChild(btn);
      cssRulesList.appendChild(item);
    }
  }

  if (blockY && cssForm) {
    blockY.addEventListener('dblclick', () => {
      const isHidden = cssForm.hasAttribute('hidden');
      if (isHidden) cssForm.removeAttribute('hidden'); else cssForm.setAttribute('hidden', '');
      cssForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  if (addPropRowBtn && cssPropsContainer) {
    addPropRowBtn.addEventListener('click', () => {
      const row = document.createElement('div');
      row.className = 'prop-row';
      const name = document.createElement('input');
      name.className = 'prop-name';
      name.type = 'text';
      name.placeholder = 'property (e.g. color)';
      const value = document.createElement('input');
      value.className = 'prop-value';
      value.type = 'text';
      value.placeholder = 'value (e.g. red)';
      row.appendChild(name);
      row.appendChild(value);
      cssPropsContainer.appendChild(row);
    });
  }

  if (saveCssRuleBtn) {
    saveCssRuleBtn.addEventListener('click', () => {
      const blockNum = cssBlockSelect ? cssBlockSelect.value : '5';
      const tagName = cssTagInput ? cssTagInput.value.trim() : '';
      const props = {};
      if (cssPropsContainer) {
        const rows = cssPropsContainer.querySelectorAll('.prop-row');
        rows.forEach(row => {
          const k = row.querySelector('.prop-name')?.value.trim();
          const v = row.querySelector('.prop-value')?.value.trim();
          if (k && v) props[k] = v;
        });
      }
      if (!Object.keys(props).length) {
        alert('Please add at least one CSS property and value.');
        return;
      }
      const selector = buildSelector(blockNum, tagName);
      const rules = loadCssRules();
      const id = Date.now() + '_' + Math.random().toString(36).slice(2);
      const rule = { id, selector, props };
      const next = [...rules, rule];
      saveCssRules(next);
      renderDynamicStyles(next);
      renderRulesList(next);
      alert('CSS instruction saved and applied.');
    });
  }

  const initialRules = loadCssRules();
  renderDynamicStyles(initialRules);
  renderRulesList(initialRules);
});
