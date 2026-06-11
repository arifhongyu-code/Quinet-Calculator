/* =============================================
   CalcWise — nav.js  v2
   • Auto-injects header + footer on every page
   • Country dropdown in nav
   • Global search across all calculators
   • Recently Added array — just add a line here
     when you publish a new calculator
   ============================================= */

const CalcWise = (() => {

  // ─────────────────────────────────────────────
  // RECENTLY ADDED
  // Add new calculators here when you publish.
  // Keep newest first. Max 6 shown on homepage.
  // ─────────────────────────────────────────────
  const RECENT = [
    { name: 'US Federal Tax Calculator',   icon: '🇺🇸', url: '/usa/federal-tax.html',    date: '2025-06-08' },
    { name: 'UK Income Tax Calculator',    icon: '🇬🇧', url: '/uk/income-tax.html',       date: '2025-06-07' },
    { name: 'BMI Calculator',              icon: '⚖️',  url: '/health/bmi.html',           date: '2025-06-06' },
    { name: 'Loan EMI Calculator',         icon: '🏦',  url: '/finance/loan-emi.html',     date: '2025-06-05' },
    { name: 'Age Calculator',              icon: '🎂',  url: '/tools/age.html',             date: '2025-06-04' },
    { name: 'Pregnancy Due Date',          icon: '🤰',  url: '/beauty/pregnancy.html',      date: '2025-06-03' },
	{ name: 'Calorie Calculator',          icon: '🔥', url: '/health/calorie.html', date: '2025-06-09' },
  ];

  // ─────────────────────────────────────────────
  // ALL CALCULATORS (for search)
  // ─────────────────────────────────────────────
  const ALL_CALCS = [
    // Health
    { name: 'BMI Calculator',                icon: '⚖️',  cat: 'Health',    url: '/health/bmi.html' },
    { name: 'Daily Calorie Calculator',      icon: '🔥',  cat: 'Health',    url: '/health/calorie.html' },
    { name: 'Healthy Weight Calculator',     icon: '💪',  cat: 'Health',    url: '/health/healthy-weight.html' },
    // Finance
    { name: 'Loan EMI Calculator',           icon: '🏦',  cat: 'Finance',   url: '/finance/loan-emi.html' },
    { name: 'Compound Interest Calculator',  icon: '📈',  cat: 'Finance',   url: '/finance/compound-interest.html' },
    { name: 'Tip Calculator',                icon: '🍽️', cat: 'Finance',   url: '/finance/tip.html' },
    { name: 'Mortgage Calculator',           icon: '🏠',  cat: 'Finance',   url: '/finance/mortgage.html' },
    // Beauty & Wellness
    { name: 'Pregnancy Due Date Calculator', icon: '🤰',  cat: 'Beauty',    url: '/beauty/pregnancy.html' },
    { name: 'Ovulation Calculator',          icon: '📅',  cat: 'Beauty',    url: '/beauty/ovulation.html' },
    { name: 'Daily Calorie for Women',       icon: '🥗',  cat: 'Beauty',    url: '/beauty/calorie-women.html' },
    { name: 'Skin Type Quiz',                icon: '✨',  cat: 'Beauty',    url: '/beauty/skin-type.html' },
    // Converters
    { name: 'KG to LBS Converter',           icon: '⚖️',  cat: 'Converter', url: '/converters/kg-lbs.html' },
    { name: 'CM to Inch Converter',          icon: '📏',  cat: 'Converter', url: '/converters/cm-inch.html' },
    { name: 'Celsius to Fahrenheit',         icon: '🌡️', cat: 'Converter', url: '/converters/temp.html' },
    { name: 'KM to Mile Converter',          icon: '🛣️', cat: 'Converter', url: '/converters/km-mile.html' },
    // Tools
    { name: 'Weather',                       icon: '🌤️', cat: 'Tools',     url: '/tools/weather.html' },
    { name: 'Age Calculator',                icon: '🎂',  cat: 'Tools',     url: '/tools/age.html' },
    { name: 'Percentage Calculator',         icon: '📊',  cat: 'Tools',     url: '/tools/percentage.html' },
    // UK
    { name: 'UK Income Tax Calculator',      icon: '🇬🇧', cat: 'UK',        url: '/uk/income-tax.html' },
    { name: 'UK Stamp Duty Calculator',      icon: '🇬🇧', cat: 'UK',        url: '/uk/stamp-duty.html' },
    { name: 'UK National Insurance',         icon: '🇬🇧', cat: 'UK',        url: '/uk/national-insurance.html' },
    // USA
    { name: 'US Federal Tax Calculator',     icon: '🇺🇸', cat: 'USA',       url: '/usa/federal-tax.html' },
    { name: 'US Hourly to Salary',           icon: '🇺🇸', cat: 'USA',       url: '/usa/hourly-to-salary.html' },
    // Canada
    { name: 'Canada GST/HST Calculator',     icon: '🇨🇦', cat: 'Canada',    url: '/canada/gst-hst.html' },
    { name: 'Canada Mortgage Calculator',    icon: '🇨🇦', cat: 'Canada',    url: '/canada/mortgage.html' },
    // Australia
    { name: 'Australia Income Tax',          icon: '🇦🇺', cat: 'Australia', url: '/australia/income-tax.html' },
    { name: 'Superannuation Calculator',     icon: '🇦🇺', cat: 'Australia', url: '/australia/superannuation.html' },
  ];

  // ─────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────
  function root() {
    const p = window.location.pathname;
    const depth = (p.match(/\//g) || []).length;
    if (depth >= 2 && p !== '/') return '../';
    return '/';
  }

  function injectFont() {
    if (document.querySelector('[data-cw-font]')) return;
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.setAttribute('data-cw-font', '1');
    l.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap';
    document.head.appendChild(l);
  }

  function injectCSS() {
    if (document.querySelector('[data-cw-css]')) return;
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.setAttribute('data-cw-css', '1');
    l.href = root() + 'css/style.css';
    document.head.appendChild(l);
  }

  // ─────────────────────────────────────────────
  // NAV HTML
  // ─────────────────────────────────────────────
  function buildNav(active) {
    const r = root();
    const links = [
      { key: 'health',     label: '🏥 Health',     href: r + 'health/index.html' },
      { key: 'finance',    label: '💰 Finance',    href: r + 'finance/index.html' },
      { key: 'beauty',     label: '💄 Beauty',     href: r + 'beauty/index.html' },
      { key: 'converters', label: '📐 Converters', href: r + 'converters/index.html' },
      { key: 'tools',      label: '🛠️ Tools',      href: r + 'tools/index.html' },
    ];

    const navLinks = links.map(l =>
      `<a href="${l.href}" class="${active === l.key ? 'active' : ''}">${l.label}</a>`
    ).join('');

    const countryItems = [
      { flag: '🇬🇧', name: 'United Kingdom', href: r + 'uk/index.html' },
      { flag: '🇺🇸', name: 'United States',  href: r + 'usa/index.html' },
      { flag: '🇨🇦', name: 'Canada',          href: r + 'canada/index.html' },
      { flag: '🇦🇺', name: 'Australia',       href: r + 'australia/index.html' },
    ].map(c =>
      `<a class="dropdown-item" href="${c.href}"><span>${c.flag}</span>${c.name}</a>`
    ).join('');

    return `
<nav class="site-nav" role="navigation" aria-label="Main navigation">
  <div class="nav-inner">
    <a href="${r}index.html" class="nav-logo">Calc<span>Wise</span></a>
    <div class="nav-links" id="nav-links">
      ${navLinks}
      <div class="nav-dropdown" id="country-dropdown">
        <button class="nav-dropdown-btn ${['uk','usa','canada','australia'].includes(active) ? 'active' : ''}" onclick="CalcWise._toggleDropdown()" aria-haspopup="true" aria-expanded="false">
          🌍 Country <span class="nav-arrow">▾</span>
        </button>
        <div class="dropdown-menu" id="dropdown-menu" role="menu">
          ${countryItems}
        </div>
      </div>
    </div>
    <div class="nav-right">
      <div class="nav-search-wrap" id="nav-search-wrap">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color:var(--muted);flex-shrink:0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input type="text" id="nav-search-input" placeholder="Search calculators..." autocomplete="off" aria-label="Search">
        <div id="search-results" role="listbox" aria-label="Search results"></div>
      </div>
      <button class="nav-menu-btn" id="nav-menu-btn" onclick="CalcWise._toggleMobileMenu()" aria-label="Menu">☰</button>
    </div>
  </div>
  <!-- Mobile menu -->
  <div class="mobile-menu" id="mobile-menu">
    ${links.map(l => `<a href="${l.href}">${l.label}</a>`).join('')}
    <div class="mobile-divider"></div>
    ${[
      { flag: '🇬🇧', name: 'UK', href: r + 'uk/index.html' },
      { flag: '🇺🇸', name: 'USA', href: r + 'usa/index.html' },
      { flag: '🇨🇦', name: 'Canada', href: r + 'canada/index.html' },
      { flag: '🇦🇺', name: 'Australia', href: r + 'australia/index.html' },
    ].map(c => `<a href="${c.href}">${c.flag} ${c.name}</a>`).join('')}
  </div>
</nav>`;
  }

  // ─────────────────────────────────────────────
  // FOOTER HTML
  // ─────────────────────────────────────────────
  function buildFooter() {
    const r = root();
    return `
<footer class="site-footer" role="contentinfo">
  <div class="footer-grid">
    <div class="footer-col">
      <div class="footer-logo">Quinet<span>Calculator</span></div>
      <p class="footer-desc">Free, accurate calculators for health, finance, beauty, and everyday life — for everyone, everywhere.</p>
    </div>
    <div class="footer-col">
      <div class="footer-heading">Categories</div>
      <a href="${r}health/index.html">🏥 Health</a>
      <a href="${r}finance/index.html">💰 Finance</a>
      <a href="${r}beauty/index.html">💄 Beauty & Wellness</a>
      <a href="${r}converters/index.html">📐 Converters</a>
      <a href="${r}tools/index.html">🛠️ Tools</a>
    </div>
    <div class="footer-col">
      <div class="footer-heading">Countries</div>
      <a href="${r}uk/index.html">🇬🇧 United Kingdom</a>
      <a href="${r}usa/index.html">🇺🇸 United States</a>
      <a href="${r}canada/index.html">🇨🇦 Canada</a>
      <a href="${r}australia/index.html">🇦🇺 Australia</a>
    </div>
    <div class="footer-col">
      <div class="footer-heading">Company</div>
      <a href="${r}about.html">About</a>
      <a href="${r}contact.html">Contact</a>
      <a href="${r}privacy.html">Privacy Policy</a>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© ${new Date().getFullYear()} <strong>QuinetCalculator</strong> — Free Online Calculators</p>
    <p class="footer-note">Results are for informational purposes only. Always consult a qualified professional for financial, medical, or legal decisions.</p>
  </div>
</footer>`;
  }

  // ─────────────────────────────────────────────
  // SEARCH
  // ─────────────────────────────────────────────
  function initSearch() {
    const input = document.getElementById('nav-search-input');
    const box   = document.getElementById('search-results');
    if (!input || !box) return;

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (q.length < 2) { box.classList.remove('show'); return; }
      const hits = ALL_CALCS.filter(c =>
        c.name.toLowerCase().includes(q) || c.cat.toLowerCase().includes(q)
      ).slice(0, 7);
      if (!hits.length) { box.classList.remove('show'); return; }
      box.innerHTML = hits.map(c =>
        `<div class="search-result-item" onclick="location.href='${c.url}'" role="option">
          <span class="s-icon">${c.icon}</span>
          <span class="s-name">${c.name}</span>
          <span class="s-cat">${c.cat}</span>
        </div>`
      ).join('');
      box.classList.add('show');
    });

    document.addEventListener('click', e => {
      if (!input.contains(e.target) && !box.contains(e.target))
        box.classList.remove('show');
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'Escape') box.classList.remove('show');
      if (e.key === 'Enter') {
        const first = box.querySelector('.search-result-item');
        if (first) first.click();
      }
    });
  }

  // ─────────────────────────────────────────────
  // FAQ
  // ─────────────────────────────────────────────
  function initFAQ() {
    document.querySelectorAll('.faq-q').forEach(btn => {
      btn.addEventListener('click', () => {
        const isOpen = btn.classList.contains('open');
        btn.closest('.faq-section').querySelectorAll('.faq-q').forEach(b => {
          b.classList.remove('open');
          b.setAttribute('aria-expanded', 'false');
          b.nextElementSibling.classList.remove('open');
        });
        if (!isOpen) {
          btn.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
          btn.nextElementSibling.classList.add('open');
        }
      });
    });
  }

  // ─────────────────────────────────────────────
  // DROPDOWN
  // ─────────────────────────────────────────────
  function _toggleDropdown() {
    const menu = document.getElementById('dropdown-menu');
    const btn  = document.querySelector('.nav-dropdown-btn');
    const open = menu.classList.toggle('show');
    btn.setAttribute('aria-expanded', open);
  }

  // ─────────────────────────────────────────────
  // MOBILE MENU
  // ─────────────────────────────────────────────
  function _toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('show');
  }

  // ─────────────────────────────────────────────
  // PUBLIC: getRecent (used by index.html)
  // ─────────────────────────────────────────────
  function getRecent(max = 6) {
    return RECENT.slice(0, max);
  }

  // ─────────────────────────────────────────────
  // INIT
  // ─────────────────────────────────────────────
  function init({ active = 'home', title, desc, canonical } = {}) {
    injectFont();
    injectCSS();

    if (title) document.title = title;
    if (desc) {
      let m = document.querySelector('meta[name="description"]');
      if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m); }
      m.content = desc;
    }
    if (canonical) {
      let c = document.querySelector('link[rel="canonical"]');
      if (!c) { c = document.createElement('link'); c.rel = 'canonical'; document.head.appendChild(c); }
      c.href = canonical;
    }

    // Inject nav
    const navWrap = document.createElement('div');
    navWrap.innerHTML = buildNav(active);
    document.body.insertBefore(navWrap.firstElementChild, document.body.firstChild);

    // Inject footer
    const footerWrap = document.createElement('div');
    footerWrap.innerHTML = buildFooter();
    document.body.appendChild(footerWrap.firstElementChild);

    // Close dropdown on outside click
    document.addEventListener('click', e => {
      const dd = document.getElementById('country-dropdown');
      if (dd && !dd.contains(e.target)) {
        document.getElementById('dropdown-menu')?.classList.remove('show');
        document.querySelector('.nav-dropdown-btn')?.setAttribute('aria-expanded', 'false');
      }
    });

    initSearch();
    initFAQ();
  }

  return { init, getRecent, ALL_CALCS, _toggleDropdown, _toggleMobileMenu };
})();
