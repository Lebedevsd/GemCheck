/* global MutationObserver */
(function () {
  'use strict';

  function tabFromUrl() {
    const p = location.pathname;
    if (p.includes('skill-gems'))    return 'gems';
    if (p.includes('delirium-orbs')) return 'delirium';
    if (p.includes('fossils'))       return 'fossils';
    if (p.includes('currency')) return 'catalysts';
    if (p.includes('essences'))      return 'essences';
    if (p.includes('astrolabes'))      return 'astrolabes';
    if (p.includes('forbidden-jewels')) return 'fjewels';
    if (p.includes('fragments'))        return 'bosses';
    if (p.includes('invitations'))      return 'bosses';
    return null;
  }

  if (!tabFromUrl()) return;

  // ─── Data tables live in src/data.js ─────────────────────────────────────
  // GEM_COLORS · TRANSFIG_GEMS · HARVEST_TABS · BOSS_DATA · HIGH_ESSENCE_TIERS
  // COLOR_META · HIDDEN_ASCENDANCIES · TAB_API_HINT


  function fmtC(v) {
    if (v == null) return '—';
    if (v >= 1000) return (v / 1000).toFixed(1) + 'k c';
    if (v >= 100)  return Math.round(v) + 'c';
    if (v > 0 && v < 0.1) return v.toFixed(2) + 'c';
    return v.toFixed(1) + 'c';
  }

  function pct(p) { return (p * 100).toFixed(1) + '%'; }

  // ─── API + processing live in src/loader.js ────────────────────────────────

  // ─── CSS (Shadow DOM) ─────────────────────────────────────────────────────
  const CSS = `
    :host { all: initial; font-family: 'Segoe UI', system-ui, sans-serif; font-size: 13px; color: #c9d1d9; }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    #panel {
      background: #0d1117;
      border: 1px solid #30363d;
      border-radius: 10px;
      width: 620px;
      max-height: 88vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 12px 40px rgba(0,0,0,.7);
      overflow: hidden;
      position: relative;
    }

    /* ── Header ── */
    #hdr {
      background: #161b22;
      padding: 10px 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: grab;
      user-select: none;
      border-bottom: 1px solid #30363d;
      flex-shrink: 0;
    }
    #hdr:active { cursor: grabbing; }
    #title { font-weight: 700; font-size: 14px; color: #e6b450; }
    #league-badge {
      font-size: 13px; padding: 4px 9px;
      background: #1f2937; color: #9ca3af;
      border: 1px solid #374151; border-radius: 10px;
      flex: 1; text-align: center;
      white-space: normal; word-break: break-word; line-height: 1.3;
    }
    .hbtn {
      background: #21262d; border: 1px solid #30363d;
      color: #c9d1d9; border-radius: 5px;
      padding: 0 9px; cursor: pointer; font-size: 12px;
      height: 24px; line-height: 24px;
      transition: background .15s;
    }
    .hbtn:hover { background: #30363d; }
    .hbtn.red:hover { background: #3d1f1f; border-color: #6e3030; color: #f85149; }

    /* ── Controls ── */
    #ctrl {
      padding: 7px 14px;
      display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
      border-bottom: 1px solid #21262d;
      background: #0d1117;
      flex-shrink: 0;
    }
    .cl { font-size: 11px; color: #8b949e; display: flex; align-items: center; gap: 5px; }
    #font-badge {
      margin-left: auto; font-size: 11px; color: #e6b450;
      background: rgba(230,180,80,.08); border: 1px solid rgba(230,180,80,.3);
      border-radius: 8px; padding: 2px 8px; cursor: help; font-weight: 600;
    }
    select, input[type=number] {
      background: #161b22; border: 1px solid #30363d;
      color: #c9d1d9; border-radius: 4px; padding: 2px 7px; font-size: 12px;
    }
    input[type=number] { width: 52px; }
    select { cursor: pointer; }
    select:focus, input:focus { outline: 1px solid #388bfd; border-color: #388bfd; }

    /* ── Status ── */
    #status {
      padding: 5px 14px; font-size: 11px; color: #8b949e;
      flex-shrink: 0; min-height: 24px; line-height: 1.6;
    }
    #status.err { color: #f85149; }
    #status.load { color: #388bfd; }

    /* ── Scroll body ── */
    #body { overflow-y: auto; flex: 1; min-height: 0; padding: 10px 12px; display: flex; flex-direction: column; gap: 12px; }
    #body.grid-layout { display: grid; grid-template-columns: 1fr 1fr; grid-auto-rows: auto; align-content: start; }
    #body.grid-layout .ccard-full { grid-column: 1 / -1; }

    /* ── Resize handle ── */
    #resize-handle {
      position: absolute; bottom: 3px; right: 3px;
      width: 12px; height: 12px;
      cursor: nwse-resize;
      opacity: .3;
      background: linear-gradient(135deg, transparent 40%, #8b949e 40%, #8b949e 55%, transparent 55%, transparent 70%, #8b949e 70%, #8b949e 85%, transparent 85%);
    }
    #resize-handle:hover { opacity: .7; }
    #resize-handle-left {
      position: absolute; bottom: 3px; left: 3px;
      width: 12px; height: 12px;
      cursor: nesw-resize;
      opacity: .3;
      background: linear-gradient(225deg, transparent 40%, #8b949e 40%, #8b949e 55%, transparent 55%, transparent 70%, #8b949e 70%, #8b949e 85%, transparent 85%);
    }
    #resize-handle-left:hover { opacity: .7; }

    /* ── Color card ── */
    .ccard {
      border-radius: 8px; border: 1px solid var(--border);
      background: var(--bg); overflow: hidden;
      flex-shrink: 0;
    }
    .ccard-hdr {
      padding: 7px 12px;
      display: flex; align-items: center; gap: 8px;
      border-bottom: 1px solid var(--border);
      cursor: pointer; user-select: none;
    }
    .ccard-hdr:hover { background: rgba(255,255,255,.03); }
    .ccard.collapsed .ccard-hdr { border-bottom: none; }
    .ccard.collapsed .col { display: none; }
    .chevron { font-size: 10px; color: #8b949e; flex-shrink: 0; transition: transform .15s; }
    .ccard.collapsed .chevron { transform: rotate(-90deg); }
    .cbadge {
      font-weight: 700; font-size: 12px;
      padding: 2px 10px; border-radius: 8px;
      background: var(--accent); color: #0d1117;
    }
    .ccard-title { font-weight: 600; font-size: 12px; color: var(--accent); flex: 1; }
    .pool-ev { font-size: 11px; color: #8b949e; }
    .pool-ev strong { color: #e6b450; }

    /* ── Card body ── */
    .col { padding: 8px 10px; }
    .col-title {
      font-size: 10px; text-transform: uppercase; letter-spacing: .6px;
      color: #8b949e; font-weight: 600; margin-bottom: 6px;
    }

    /* ── Gem rows – single flat line ── */
    .gem-row {
      display: flex; align-items: center; gap: 5px;
      margin-bottom: 3px; cursor: default;
    }
    .gem-row:last-child { margin-bottom: 0; }
    .gem-icon { width: 18px; height: 18px; object-fit: contain; flex-shrink: 0; }
    .gem-name {
      font-size: 12px; font-weight: 500; flex: 1; min-width: 0;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .gem-price { font-size: 12px; color: #e6b450; font-weight: 600; white-space: nowrap; }
    .gem-prob  { font-size: 10px; color: #3fb950; white-space: nowrap; flex-shrink: 0; }
    .gem-tag   { font-size: 10px; color: #8b949e; white-space: nowrap; flex-shrink: 0; }
    .gem-dot   { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; display: inline-block; }

    /* Variant indent rows */
    .variants { padding-left: 23px; margin-top: 1px; margin-bottom: 3px; }
    .v-row {
      display: flex; gap: 4px; align-items: baseline;
      margin-bottom: 1px; font-size: 11px;
    }
    .v-name  { flex: 1; color: #c9d1d9; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .v-price { color: #e6b450; white-space: nowrap; }
    .v-prob  { color: #3fb950; white-space: nowrap; font-size: 10px; }

    /* ── Empty / skeleton ── */
    .empty { text-align: center; padding: 20px; color: #8b949e; font-size: 12px; }

    /* ── Footer ── */
    #footer {
      flex-shrink: 0;
      border-top: 1px solid #21262d;
      padding: 8px 14px;
      text-align: center;
    }
    #footer a {
      display: inline-block;
      font-size: 13px; font-weight: 600;
      text-decoration: none;
      padding: 5px 18px;
      border-radius: 20px;
      background: #21262d;
      color: #8b949e;
      border: 1px solid #30363d;
      transition: background .2s, color .2s, box-shadow .2s, border-color .2s, transform .15s;
    }
    #footer a:hover {
      background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
      color: #fff;
      border-color: transparent;
      box-shadow: 0 0 14px rgba(220,39,67,.7), 0 0 32px rgba(188,24,136,.5);
      transform: scale(1.04);
    }

    /* ── Tab bar ── */
    #tabs {
      display: flex; border-bottom: 1px solid #21262d;
      background: #0d1117; flex-shrink: 0; overflow-x: auto;
    }
    .tab {
      padding: 6px 12px; font-size: 12px; font-weight: 500;
      color: #8b949e; cursor: pointer; white-space: nowrap;
      border-bottom: 2px solid transparent;
      transition: color .15s, border-color .15s; user-select: none;
    }
    .tab:hover { color: #c9d1d9; }
    .tab.active { color: #e6b450; border-bottom-color: #e6b450; }

    /* ── Harvest layout ── */
    .harvest-summary {
      padding: 6px 10px; background: rgba(255,255,255,.03); border-radius: 4px;
      margin-bottom: 8px; font-size: 11px; color: #8b949e;
      display: flex; flex-direction: column; gap: 2px;
    }
    .harvest-summary strong { color: #c9d1d9; }
    .h-row {
      display: flex; align-items: center; gap: 5px; font-size: 12px; margin-bottom: 2px;
    }
    .h-row:last-child { margin-bottom: 0; }
    .h-indicator { font-size: 10px; flex-shrink: 0; width: 10px; text-align: center; }
    .break-even-line {
      text-align: center; font-size: 10px; color: #8b949e;
      padding: 3px 0; letter-spacing: 1px; margin: 2px 0;
    }
    .harvest-legend {
      font-size: 11px; color: #8b949e; margin-bottom: 7px;
      padding: 5px 8px; border-left: 2px solid #30363d;
      line-height: 1.5;
    }
    .harvest-legend strong { color: #c9d1d9; }
    .harvest-legend p + p { margin-top: 4px; }

    /* ── Boss layout ── */
    .boss-cols-wrap { display: flex; gap: 12px; }
    .boss-col { flex: 1; min-width: 0; }
    .boss-col-title {
      font-size: 10px; text-transform: uppercase; letter-spacing: .6px;
      color: #8b949e; font-weight: 600; margin-bottom: 5px;
      padding-bottom: 4px; border-bottom: 1px solid #21262d;
    }
    .boss-section-title {
      font-size: 10px; text-transform: uppercase; letter-spacing: .5px;
      color: #8b949e; font-weight: 600; margin: 6px 0 3px;
    }
    .boss-col > .boss-section-title:first-of-type { margin-top: 0; }
    .boss-entry-line  { display: flex; align-items: baseline; gap: 6px; font-size: 12px; }
    .boss-divider { border-top: 1px solid #21262d; margin: 6px 0; }
    .boss-entry { font-size: 11px; color: #8b949e; margin-bottom: 3px; }
    .boss-ev    { font-size: 11px; color: #8b949e; margin-bottom: 5px; }
    .boss-drop  { display: flex; align-items: baseline; gap: 4px; font-size: 12px; margin-bottom: 2px; }
    .boss-drop:last-child { margin-bottom: 0; }
    .boss-rate  { font-size: 10px; color: #3fb950; min-width: 36px; text-align: right; flex-shrink: 0; }
    .boss-rate.unknown { color: #8b949e; }
    .boss-rate.extra   { color: #58a6ff; }
    .boss-item-name  { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .boss-item-extra { color: #8b949e; }
    .boss-item-price { font-size: 12px; color: #e6b450; font-weight: 600; white-space: nowrap; }

    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #30363d; border-radius: 3px; }
  `;

  // ─── UI Builder ───────────────────────────────────────────────────────────

  // Safe innerHTML replacement via DOMParser — avoids direct assignment of
  // dynamic strings to innerHTML (satisfies addons-linter no-unsanitized rule).
  function setHTML(el, html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    el.replaceChildren(...Array.from(doc.body.childNodes).map(n => document.adoptNode(n)));
  }

  function renderFJewels(shadow, data) {
    if (!data.flame.all && !data.flesh.all) {
      renderIntoBody(shadow, `<div class="empty">No Forbidden Jewel data found.<br><small style="opacity:.6">flame.all=${data.flame.all} flesh.all=${data.flesh.all}</small></div>`, '');
      return;
    }
    function fmtD(d) { return d.toFixed(2) + '\u00a0D'; }
    const legend = `<div class="harvest-legend">
      <p>Prices per passive variant from poe.ninja, expressed in divines (D).</p>
      <p><strong>All</strong> — every variant including hidden ascendancies (${HIDDEN_ASCENDANCIES.size} passives unavailable in-game).</p>
      <p><strong>No hidden</strong> — excludes them for a realistic market average.</p>
      <p><strong>avg</strong> = arithmetic mean &nbsp;&middot;&nbsp; <strong>&sigma;</strong> = standard deviation (spread) &nbsp;&middot;&nbsp; <strong>min / max</strong> = cheapest / most expensive variant.</p>
    </div>`;
    const tcss = 'style="border-collapse:collapse;width:100%;font-size:12px"';
    const thcss = 'style="text-align:right;color:#8b949e;font-weight:normal;padding:2px 8px 4px 0"';
    const tdcss = 'style="text-align:right;color:#c9d1d9;padding:2px 8px 2px 0"';
    const td1css = 'style="color:#8b949e;padding:2px 8px 2px 0;white-space:nowrap"';
    function row(label, s) {
      return `<tr><td ${td1css}>${escHtml(label)}</td>`
        + `<td ${tdcss}>${fmtD(s.avg)}</td>`
        + `<td ${tdcss}>${fmtD(s.sigma)}</td>`
        + `<td ${tdcss}>${fmtD(s.min)}</td>`
        + `<td ${tdcss}>${fmtD(s.max)}</td></tr>`;
    }
    function card(label, both, accent) {
      const s = both.all;
      const sv = both.visible;
      if (!s) return '';
      return `<div class="ccard ccard-full" style="--accent:${accent};--bg:rgba(88,166,255,.05);--border:${accent}55">
        <div class="ccard-hdr">
          <span class="cbadge" style="background:${accent};color:#0d1117">${escHtml(label)}</span>
          <span class="pool-ev">avg: <strong>${fmtD(s.avg)}</strong></span>
        </div>
        <div class="col" style="padding:8px 10px">
          <table ${tcss}>
            <thead><tr>
              <th ${thcss}></th>
              <th ${thcss}>avg</th>
              <th ${thcss}>&sigma;</th>
              <th ${thcss}>min</th>
              <th ${thcss}>max</th>
            </tr></thead>
            <tbody>
              ${row('All (' + s.count + ')', s)}
              ${sv ? row('No hidden (' + sv.count + ')', sv) : ''}
            </tbody>
          </table>
        </div>
      </div>`;
    }
    const html = legend + card('Forbidden Flame', data.flame, '#e05050') + card('Forbidden Flesh', data.flesh, '#4caf50');
    renderIntoBody(shadow, html, 'Forbidden Jewels — avg price in divines');
  }

  function renderBosses(shadow, bossResults) {
    const legend = '<div class="harvest-legend">'
      + '<p>Expected value per boss fight using baked-in drop rates from poewiki and live poe.ninja prices.</p>'
      + '<p><strong>Drop EV</strong> = \u03a3(rate \u00d7 price) for the guaranteed unique pool.'
      + ' <strong>Net EV</strong> = Drop EV \u2212 entry fragment cost.</p>'
      + '<p>Items marked <strong style="color:#58a6ff">\u2020</strong> are independent additional drops'
      + ' (reliquary keys etc.) \u2014 their rate does not reduce the main unique drop chance.</p>'
      + '<p>Items with <span style="color:#8b949e">? rate</span> are shown but excluded from EV (rate unknown).</p>'
      + '</div>';

    function entryColHtml(result) {
      if (!result) return '<div class="boss-col"></div>';
      const { entryItems, entryCost } = result;
      if (!entryItems.length) return '<div class="boss-col"><span style="color:#8b949e;font-size:11px">\u2014 free</span></div>';
      // Single line: "×4 Cosmic Fragment — 600c"
      // Multi-item: "×1 each · 4 frags — 200c" with tooltip listing names
      let label, title = '';
      if (entryItems.length === 1) {
        const e = entryItems[0];
        label = `\u00d7${e.qty}\u00a0${escHtml(e.name)}`;
      } else {
        const totalQty = entryItems.reduce((s, e) => s + e.qty, 0);
        label = `\u00d7${totalQty}\u00a0frags`;
        title = entryItems.map(e => `\u00d7${e.qty} ${e.name}`).join(', ');
      }
      const costStr = entryCost > 0 ? fmtC(entryCost) : '\u2014';
      return `<div class="boss-col"><div class="boss-entry-line"${title ? ` title="${title}"` : ''}>`
        + `<span class="boss-item-name">${label}</span>`
        + `<span class="boss-item-price">${costStr}</span>`
        + '</div></div>';
    }

    function dropsColHtml(result) {
      if (!result) return '<div class="boss-col"><span style="color:#8b949e;font-size:11px">No data</span></div>';
      const { drops, extraDrops, dropEv, netEv } = result;
      const evColor = netEv > 0 ? '#3fb950' : '#f85149';
      const evLine = `<div class="boss-ev">EV: <strong style="color:#e6b450">${fmtC(dropEv)}</strong>`
        + ` \u00b7 Net: <strong style="color:${evColor}">${fmtC(netEv)}</strong></div>`;
      const mainRows = drops.map(d =>
        '<div class="boss-drop">'
        + `<span class="boss-rate${d.rate == null ? ' unknown' : ''}">${d.rate != null ? pct(d.rate) : '?'}</span>`
        + `<span class="boss-item-name">${escHtml(d.name)}</span>`
        + `<span class="boss-item-price">${d.price > 0 ? fmtC(d.price) : '\u2014'}</span>`
        + '</div>'
      ).join('');
      const extraRows = extraDrops.map(d =>
        '<div class="boss-drop">'
        + `<span class="boss-rate extra">${d.rate != null ? pct(d.rate) : '?'}</span>`
        + `<span class="boss-item-name boss-item-extra">${escHtml(d.name)} <span style="color:#58a6ff">\u2020</span></span>`
        + `<span class="boss-item-price">${d.price > 0 ? fmtC(d.price) : '\u2014'}</span>`
        + '</div>'
      ).join('');
      return '<div class="boss-col">' + evLine + mainRows + extraRows + '</div>';
    }

    const cards = bossResults.map(({ boss, normal, uber }) => {
      const normalLabel = boss.normalLabel || 'Normal';
      const uberLabel   = boss.uberLabel   || 'Uber';

      const hasEntry = (normal && normal.entryItems.length) || (uber && uber.entryItems.length);

      const colHeaders = '<div class="boss-cols-wrap" style="margin-bottom:5px">'
        + `<div class="boss-col"><div class="boss-col-title">${escHtml(normalLabel)}</div></div>`
        + `<div class="boss-col"><div class="boss-col-title">${escHtml(uberLabel)}</div></div>`
        + '</div>';

      const entrySection = hasEntry
        ? '<div class="boss-section-title">Entry</div>'
          + '<div class="boss-cols-wrap">' + entryColHtml(normal) + entryColHtml(uber) + '</div>'
          + '<div class="boss-divider"></div>'
        : '';

      const dropsSection = '<div class="boss-section-title">Drops</div>'
        + '<div class="boss-cols-wrap">' + dropsColHtml(normal) + dropsColHtml(uber) + '</div>';

      // Additional drops are shared between Normal and Uber
      const addDrops = (normal || uber)?.additionalDrops || [];
      const additionalSection = addDrops.length
        ? '<div class="boss-divider"></div>'
          + '<div class="boss-section-title">Additional drops <span style="font-weight:normal;text-transform:none;letter-spacing:0;color:#8b949e;font-size:10px">both versions</span></div>'
          + addDrops.map(d =>
              '<div class="boss-drop">'
              + `<span class="boss-rate extra">${d.rate != null ? pct(d.rate) : '?'}</span>`
              + `<span class="boss-item-name">${escHtml(d.name)}</span>`
              + `<span class="boss-item-price">${d.price > 0 ? fmtC(d.price) : '\u2014'}</span>`
              + '</div>'
            ).join('')
        : '';

      return '<div class="ccard ccard-full" style="--accent:#e6b450;--bg:rgba(230,180,80,.06);--border:rgba(230,180,80,.25)">'
        + '<div class="ccard-hdr">'
        + '<span class="chevron">&#x25BE;</span>'
        + `<span class="cbadge" style="background:#e6b450;color:#0d1117">${escHtml(boss.label)}</span>`
        + '</div>'
        + '<div class="col">' + colHeaders + entrySection + dropsSection + additionalSection + '</div>'
        + '</div>';
    }).join('');

    renderIntoBody(shadow, legend + cards, 'Boss EV \u2014 drop rates from poewiki \u00b7 live poe.ninja prices');
  }

  function buildPanel(league) {
    const host = document.createElement('div');
    host.id = 'gemcheck-host';
    host.style.cssText = 'position:fixed;top:80px;right:20px;z-index:2147483647;';
    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: 'open' });

    // Inject CSS safely — textContent never parses as HTML
    const style = document.createElement('style');
    style.textContent = CSS;
    shadow.appendChild(style);

    // Static panel structure — no dynamic expressions in this string
    const tpl = document.createElement('template');
    tpl.innerHTML = '<div id="panel">'
      + '<div id="hdr">'
      +   '<span id="title">&#x2697; GemCheck</span>'
      +   '<span id="league-badge"></span>'
      +   '<button class="hbtn" id="btn-refresh">&#x21BB; Refresh</button>'
      +   '<button class="hbtn" id="btn-min">&#x2014;</button>'
      +   '<button class="hbtn red" id="btn-close">&#x2715;</button>'
      + '</div>'
      + '<div id="tabs">'
      +   '<div class="tab" data-tab="gems">&#x2697; Gems</div>'
      +   '<div class="tab" data-tab="catalysts">Catalysts</div>'
      +   '<div class="tab" data-tab="essences">Essences</div>'
      +   '<div class="tab" data-tab="delirium">Deli Orbs</div>'
      +   '<div class="tab" data-tab="astrolabes">Astrolabes</div>'
      +   '<div class="tab" data-tab="fjewels">F. Jewels</div>'
      +   '<div class="tab" data-tab="bosses">Bosses</div>'
      + '</div>'
      + '<div id="ctrl"><div class="cl">'
      +   '<label for="top-n">Top</label>'
      +   '<select id="top-n">'
      +     '<option value="3">3</option>'
      +     '<option value="5">5</option>'
      +     '<option value="8" selected>8</option>'
      +   '</select>'
      +   '<span>gems per colour</span>'
      + '</div>'
      + '<div class="cl">'
      +   '<select id="gem-lq">'
      +     '<option value="1-0">lvl\u00a01 \u00b7 q\u00a00%</option>'
      +     '<option value="1-20">lvl\u00a01 \u00b7 q\u00a020%</option>'
      +     '<option value="20-0">lvl\u00a020 \u00b7 q\u00a00%</option>'
      +     '<option value="20-20">lvl\u00a020 \u00b7 q\u00a020%</option>'
      +   '</select>'
      + '</div>'
      + '<span id="font-badge" title="Prices for non-corrupted gems at the selected level and quality">&#x2697;</span>'
      + '</div>'
      + '<div id="status" class="load">Loading\u2026</div>'
      + '<div id="body"></div>'
      + '<div id="footer">'
      +   '<a href="https://buymeacoffee.com/lebedevsd" target="_blank" rel="noopener">&#x2615; Buy me a coffee</a>'
      + '</div>'
      + '<div id="resize-handle"></div>'
      + '<div id="resize-handle-left"></div>'
      + '</div>';
    shadow.appendChild(tpl.content);

    // Set dynamic value safely via textContent — never treated as markup
    shadow.getElementById('league-badge').textContent = league;

    return { host, shadow };
  }

  function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function icon(url) {
    return url ? `<img class="gem-icon" src="${escHtml(url)}" alt="">` : '<span style="width:18px;flex-shrink:0"></span>';
  }

  function renderColorCard(stats, colorKey) {
    const m = COLOR_META[colorKey];
    if (!stats) return '';

    const poolSize = stats.poolSize;
    const poolEv   = stats.poolEv;

    const hitChance = poolSize ? pct(1 - Math.pow((poolSize - 1) / poolSize, 3)) : '—';
    const hitTitle  = poolSize
      ? `Hit chance per gem: 1 - ((${poolSize}-1)/${poolSize})³ = ${hitChance}\n`
      + `Pool: ${poolSize} gems total (all transfigured gems of this colour)\n`
      + `3 draws: Divine Font shows 3 random gems from the pool — you pick the best one`
      : '';
    let bingoHtml = `<div class="col-title">🎯 Color Roll Bingo (pick best of 3)</div>`;
    if (stats.bingo.length) {
      bingoHtml += stats.bingo.map(g => `
        <div class="gem-row" title="${g.count} listed">
          ${icon(g.icon)}
          <span class="gem-name">${escHtml(g.name)}</span>
          <span class="gem-price">${fmtC(g.sellPrice)}</span>
        </div>`).join('');
    } else {
      bingoHtml += `<div class="empty">No data</div>`;
    }

    return `
      <div class="ccard" style="--accent:${m.accent};--bg:${m.bg};--border:${m.border}">
        <div class="ccard-hdr">
          <span class="chevron">&#x25BE;</span>
          <span class="cbadge">${m.label}</span>
          <span class="ccard-title" title="${escHtml(hitTitle)}">Transfigured Gems</span>
          <span class="pool-ev">EV: <strong>${fmtC(poolEv)}</strong> · ${poolSize} gems · <strong>${hitChance}</strong> each</span>
        </div>
        <div class="col">${bingoHtml}</div>
      </div>`;
  }

  function renderSpecificSection(gemPicks, topN) {
    if (!gemPicks.length) return '';

    const rows = gemPicks.slice(0, topN).map(entry => {
      const cm = COLOR_META[entry.color];
      const firstIcon = icon(entry.variants[0].icon);
      const dot = `<span class="gem-dot" style="background:${cm.accent}" title="${cm.label}"></span>`;
      const variantRows = entry.variants.map(v => `
        <div class="v-row" title="${escHtml(v.name)} · ${v.count} listed">
          <span class="v-name">${escHtml(v.name.replace(entry.baseName + ' of ', 'of '))}</span>
          <span class="v-prob">${pct(v.prob)}</span>
          <span class="v-price">${fmtC(v.sellPrice)}</span>
        </div>`).join('');
      return `
        <div class="gem-row" title="EV: ${fmtC(entry.ev)} · ${entry.variantCount} variant(s)">
          ${dot}${firstIcon}
          <span class="gem-name">${escHtml(entry.baseName)}</span>
          <span class="gem-tag">×${entry.variantCount}</span>
          <span class="gem-price">${fmtC(entry.ev)}</span>
        </div>
        <div class="variants">${variantRows}</div>`;
    }).join('');

    return `
      <div class="ccard ccard-full" style="--accent:#e6b450;--bg:rgba(230,180,80,.06);--border:rgba(230,180,80,.25)">
        <div class="ccard-hdr">
          <span class="chevron">&#x25BE;</span>
          <span class="cbadge" style="background:#e6b450;color:#0d1117">Best</span>
          <span class="ccard-title" style="color:#e6b450">Best Specific Gems (all colours · by best variant)</span>
        </div>
        <div class="col">${rows}</div>
      </div>`;
  }

  function renderHarvestList(items, craftThresh, showProb = false) {
    let html = '';
    let shownBreak = false;
    if (craftThresh < 0) {
      html += `<div class="break-even-line" style="color:#e6b450">⚠ Swap is EV-negative — keep all (threshold: ${fmtC(craftThresh)})</div>`;
      shownBreak = true;
    }
    for (const item of items) {
      if (!shownBreak && item.price <= craftThresh) {
        shownBreak = true;
        html += `<div class="break-even-line"><span style="color:#3fb950">▲ keep above</span> · <span style="color:#f85149">▼ craft below</span> (${fmtC(craftThresh)})</div>`;
      }
      const keep = craftThresh >= 0 && item.price > craftThresh;
      html += `<div class="h-row">
        <span class="h-indicator" style="color:${keep ? '#3fb950' : '#f85149'}">${keep ? '▲' : '▼'}</span>
        ${item.icon ? `<img class="gem-icon" src="${escHtml(item.icon)}" alt="">` : '<span style="width:18px;flex-shrink:0"></span>'}
        <span class="gem-name">${escHtml(item.name)}</span>
        ${showProb ? `<span class="gem-prob">${pct(item.prob)}</span>` : ''}
        <span class="gem-price">${fmtC(item.price)}</span>
      </div>`;
    }
    return html;
  }

  function harvestLegend(craftCost, craftThresh, lfPrice, lfCount = 30) {
    const lfStr = lfPrice > 0 ? `${lfCount} LF (${fmtC(craftCost)})` : `${lfCount} LF`;
    return `<div class="harvest-legend">`
      + `<strong>How it works:</strong> spend ${escHtml(lfStr)} to swap an item for a random one from the pool (pool EV: shown in header).`
      + ` <span style="color:#3fb950">&#x25B2; keep</span> if price &gt; ${fmtC(craftThresh)} &nbsp;`
      + `<span style="color:#f85149">&#x25BC; craft</span> if price &lt; ${fmtC(craftThresh)}`
      + `</div>`;
  }

  function renderHarvestSection(results, label) {
    if (!results) return `<div class="empty">No ${label} data found for this league.</div>`;
    const { items, poolEv, craftCost, craftThresh, netEv, lfPrice, lfName, poolSize, lfCount } = results;
    const profitable = netEv > 0;
    const evColor = profitable ? '#3fb950' : '#f85149';
    return `
      <div class="ccard ccard-full" style="--accent:#58a6ff;--bg:rgba(88,166,255,.08);--border:rgba(88,166,255,.3)">
        <div class="ccard-hdr">
          <span class="chevron">&#x25BE;</span>
          <span class="cbadge" style="background:#58a6ff;color:#0d1117">${escHtml(label)}</span>
          <span class="ccard-title" style="color:#58a6ff">Harvest Swap</span>
          <span class="pool-ev">EV: <strong>${fmtC(poolEv)}</strong> · Net: <strong style="color:${evColor}">${fmtC(netEv)}</strong></span>
        </div>
        <div class="col">
          ${harvestLegend(craftCost, craftThresh, lfPrice, lfCount)}
          <div class="harvest-summary">
            <div><strong>${poolSize} items</strong> in pool · ${escHtml(lfName)}: <strong>${fmtC(lfPrice)}</strong>/unit</div>
            ${results.isExchange === false ? '<div style="color:#e6b450">⚠ Showing stash prices (exchange API unavailable)</div>' : ''}
          </div>
          ${renderHarvestList(items, craftThresh, results.showProb)}
        </div>
      </div>`;
  }

  function renderEssencesSection(tierResults) {
    if (!tierResults || !tierResults.length) return '<div class="empty">No essence data found for this league.</div>';
    return tierResults.map(({ tier, items, poolEv, craftCost, craftThresh, netEv, lfPrice, poolSize }) => {
      const profitable = netEv > 0;
      const evColor = profitable ? '#3fb950' : '#f85149';
      return `
        <div class="ccard ccard-full" style="--accent:#a855f7;--bg:rgba(168,85,247,.08);--border:rgba(168,85,247,.3)">
          <div class="ccard-hdr">
            <span class="chevron">&#x25BE;</span>
            <span class="cbadge" style="background:#a855f7;color:#fff">${escHtml(tier)}</span>
            <span class="ccard-title" style="color:#a855f7">Essences</span>
            <span class="pool-ev">EV: <strong>${fmtC(poolEv)}</strong> · Net: <strong style="color:${evColor}">${fmtC(netEv)}</strong></span>
          </div>
          <div class="col">
            ${harvestLegend(craftCost, craftThresh, lfPrice, 30)}
            <div class="harvest-summary">
              <div><strong>${poolSize} essences</strong> in pool · Primal LF: <strong>${fmtC(lfPrice)}</strong>/unit</div>
            </div>
            ${renderHarvestList(items, craftThresh)}
          </div>
        </div>`;
    }).join('');
  }

  function renderIntoBody(shadow, html, statusText) {
    const body = shadow.getElementById('body');
    const status = shadow.getElementById('status');
    if (!html) html = '<div class="empty">No data found for this league.</div>';
    setHTML(body, html);
    body.querySelectorAll('.ccard-hdr').forEach(hdr => {
      hdr.addEventListener('click', () => hdr.closest('.ccard').classList.toggle('collapsed'));
    });
    status.className = '';
    setHTML(status, statusText);
  }

  function render(shadow, results, topN, gcp = {}) {
    let html = '';
    for (const c of ['r', 'g', 'b']) html += renderColorCard(results.colorStats[c], c);
    html += renderSpecificSection(results.gemPicks, topN);
    const gcpImg  = gcp.icon ? `<img src="${escHtml(gcp.icon)}" style="width:14px;height:14px;object-fit:contain;vertical-align:middle;margin-right:3px">` : '';
    const gcpLine = gcp.price > 0
      ? `<br>${gcpImg}Gemcutter\u2019s Prism: <strong>${fmtC(gcp.price)}</strong> \u00b7 \u00d720 = <strong>${fmtC(gcp.price * 20)}</strong>`
      : '';
    renderIntoBody(shadow, html, `${results.totalTransfig} transfigured gems (static) \u00b7 ${results.totalLines} API entries${gcpLine}`);
  }

  function renderHarvest(shadow, results, label) {
    let statusText;
    if (results && results.showProb) {
      const poolLine = `${results.poolSize}\u00a0items in pool \u00b7 ${escHtml(results.lfName)}: ${fmtC(results.lfPrice)}/unit`;
      statusText = `EV\u00a0=\u00a0\u03a3(drop\u00a0rate\u00a0\u00d7\u00a0price) \u00b7 probabilities from ~2000 swaps by lifewithoutpants_ (YT)<br><span style="opacity:.7">${poolLine}</span>`;
    } else {
      statusText = escHtml(label) + ' \u2014 Harvest swap EV';
    }
    renderIntoBody(shadow, renderHarvestSection(results, label), statusText);
  }

  function renderEssences(shadow, tierResults) {
    renderIntoBody(shadow, renderEssencesSection(tierResults), 'Essences — Harvest swap EV');
  }

  // ─── Drag ─────────────────────────────────────────────────────────────────
  function makeDraggable(host, hdr) {
    let ox = 0, oy = 0;
    hdr.addEventListener('mousedown', e => {
      if (e.target.closest('button')) return;
      ox = e.clientX - host.offsetLeft;
      oy = e.clientY - host.offsetTop;
      const onMove = ev => {
        host.style.right = 'auto';
        host.style.left = (ev.clientX - ox) + 'px';
        host.style.top  = (ev.clientY - oy) + 'px';
      };
      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }

  // ─── Resize ───────────────────────────────────────────────────────────────
  function makeResizable(shadow) {
    const host   = shadow.host;
    const panel  = shadow.getElementById('panel');

    shadow.getElementById('resize-handle').addEventListener('mousedown', e => {
      e.preventDefault(); e.stopPropagation();
      const startX = e.clientX, startY = e.clientY;
      const startW = panel.offsetWidth, startH = panel.offsetHeight;
      const onMove = ev => {
        panel.style.width     = Math.max(420, startW + ev.clientX - startX) + 'px';
        panel.style.maxHeight = Math.max(200, startH + ev.clientY - startY) + 'px';
      };
      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup',  onUp);
      };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup',  onUp);
    });

    shadow.getElementById('resize-handle-left').addEventListener('mousedown', e => {
      e.preventDefault(); e.stopPropagation();
      const startX = e.clientX, startY = e.clientY;
      const startW = panel.offsetWidth, startH = panel.offsetHeight;
      const startLeft = host.getBoundingClientRect().left;
      const onMove = ev => {
        const dx   = ev.clientX - startX;
        const newW = Math.max(420, startW - dx);
        panel.style.width     = newW + 'px';
        panel.style.maxHeight = Math.max(200, startH + ev.clientY - startY) + 'px';
        host.style.right = 'auto';
        host.style.left  = (startLeft + startW - newW) + 'px';
      };
      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup',  onUp);
      };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup',  onUp);
    });
  }

  function appendApiHint(shadow, hint) {
    if (!hint) return;
    const st = shadow.getElementById('status');
    if (!st || st.classList.contains('err')) return;
    const note = document.createElement('span');
    note.style.cssText = 'font-size:10px;color:#8b949e;opacity:.55;margin-left:6px';
    note.textContent = '\u00b7 ' + hint;
    st.appendChild(note);
  }

  // ─── Main ─────────────────────────────────────────────────────────────────
  async function init() {
    document.getElementById('gemcheck-host')?.remove();

    const league = leagueFromUrl();
    const { host, shadow } = buildPanel(league);
    makeDraggable(host, shadow.getElementById('hdr'));
    makeResizable(shadow);

    const body = shadow.getElementById('body');
    new ResizeObserver(entries => {
      body.classList.toggle('grid-layout', entries[0].contentRect.width >= 680);
    }).observe(body);

    const status = shadow.getElementById('status');
    const ctrl   = shadow.getElementById('ctrl');
    let topN = 8;
    let gemLQ = { level: 1, quality: 0 };
    let activeTab = tabFromUrl() || 'gems';

    function updateFontBadge() {
      const b = shadow.getElementById('font-badge');
      b.textContent = `\u2697 lvl\u00a0${gemLQ.level} \u00b7 q\u00a0${gemLQ.quality}%`;
    }
    updateFontBadge();

    function setActiveTab(tab) {
      activeTab = tab;
      shadow.querySelectorAll('.tab').forEach(el => {
        el.classList.toggle('active', el.dataset.tab === tab);
      });
      const isGems = tab === 'gems';
      ctrl.style.display = isGems ? '' : 'none';
    }

    async function loadTab(tab, bust = false) {
      setActiveTab(tab);
      status.className = 'load';
      const _hint = TAB_API_HINT[tab] || '';
      status.textContent = _hint ? `Loading\u2026 \u00b7 ${_hint}` : `Fetching ${league} data\u2026`;
      if (bust) {
        if (tab === 'gems') bustCache(league, 'SkillGem');
        else if (tab === 'fjewels') { bustCache(league, 'stash-ForbiddenJewel'); bustCache(league, 'UniqueJewel'); }
        else if (tab === 'bosses') {
          ['UniqueWeapon', 'UniqueArmour', 'UniqueJewel', 'UniqueAccessory', 'UniqueFlask', 'UniqueMap', 'Fragment']
            .forEach(t => bustCache(league, t));
        }
        else bustCache(league, HARVEST_TABS[tab]?.type || tab);
      }

      try {
        if (tab === 'gems') {
          const [data, currData] = await Promise.all([
            fetchItems(league, 'SkillGem'),
            fetchExchange(league, 'Currency').catch(() => ({ lines: [], items: [] })),
          ]);
          const currLines = normalizeExchangeData(currData).lines;
          const gcpLine   = currLines.find(l => l.name === "Gemcutter's Prism");
          const gcpPrice  = gcpLine ? (gcpLine.primaryValue || 0) : 0;
          const gcpIcon   = gcpLine ? (gcpLine.icon || '') : '';
          render(shadow, processGems(data, topN, gemLQ), topN, { price: gcpPrice, icon: gcpIcon });
        } else if (tab === 'fjewels') {
          const [stashData, itemData] = await Promise.allSettled([
            fetchStash(league, 'ForbiddenJewel'),
            fetchItems(league, 'UniqueJewel'),
          ]);
          const stash = stashData.status === 'fulfilled' ? stashData.value : null;
          const item  = itemData.status  === 'fulfilled' ? itemData.value  : null;
          // Log raw data to debug field names
          if (stash) {
            const sl = stash.lines || [];
            console.log('[GemCheck] stash lines total:', sl.length, '| sample fields:', sl[0] ? Object.keys(sl[0]) : []);
            const sorted = [...sl].sort((a, b) => (b.divineValue || 0) - (a.divineValue || 0));
            if (sorted.length) console.log('[GemCheck] stash most expensive:', sorted[0]);
            if (sorted.length) console.log('[GemCheck] stash cheapest:', sorted[sorted.length - 1]);
          }
          if (item) {
            const il = (item.lines || []).filter(l => l.name && l.name.includes('Forbidden'));
            console.log('[GemCheck] UniqueJewel Forbidden entries:', il.length, il.slice(0, 3));
          }
          const data = stash || item || { lines: [] };
          renderFJewels(shadow, processFJewels(data));
        } else if (tab === 'bosses') {
          const priceData = await fetchBossPrices(league);
          const results = BOSS_DATA.map(boss => ({
            boss,
            normal: processBoss(boss, 'normal', priceData),
            uber:   processBoss(boss, 'uber',   priceData),
          }));
          renderBosses(shadow, results);
        } else if (tab === 'essences') {
          const cfg = HARVEST_TABS.essences;
          const [data, lfData, itemData] = await Promise.all([
            (cfg.useExchange ? fetchExchange(league, cfg.type) : fetchItems(league, cfg.type)),
            fetchLifeforce(league),
            cfg.useExchange ? fetchItems(league, cfg.type).catch(() => ({ lines: [] })) : Promise.resolve({ lines: [] }),
          ]);
          const itemIcons = {};
          for (const l of (itemData.lines || [])) { if (l.name && l.icon) itemIcons[l.name] = l.icon; }
          const enrichedLf = { ...lfData, icons: { ...itemIcons, ...(lfData.icons || {}) } };
          renderEssences(shadow, processEssences(data, enrichedLf));
        } else {
          const cfg = HARVEST_TABS[tab];
          const [dataResult, lfData, itemData] = await Promise.all([
            (cfg.useExchange ? fetchExchange(league, cfg.type) : fetchItems(league, cfg.type))
              .catch(() => ({ lines: [], _unavailable: true })),
            fetchLifeforce(league),
            cfg.useExchange ? fetchItems(league, cfg.type).catch(() => ({ lines: [] })) : Promise.resolve({ lines: [] }),
          ]);
          const itemIcons = {};
          for (const l of (itemData.lines || [])) { if (l.name && l.icon) itemIcons[l.name] = l.icon; }
          const enrichedLf = { ...lfData, icons: { ...itemIcons, ...(lfData.icons || {}) } };
          if (dataResult._unavailable) {
            renderIntoBody(shadow, `<div class="empty">${escHtml(cfg.label)} data is not available for this league.</div>`, '');
          } else {
            renderHarvest(shadow, processHarvest(dataResult, enrichedLf, cfg), cfg.label);
          }
        }
        appendApiHint(shadow, TAB_API_HINT[tab]);
      } catch (err) {
        status.className = 'err';
        status.textContent = `Error: ${err.message}`;
      }
    }

    // Wire tab clicks
    shadow.querySelectorAll('.tab').forEach(el => {
      el.addEventListener('click', () => loadTab(el.dataset.tab));
    });

    shadow.getElementById('btn-refresh').onclick = () => loadTab(activeTab, true);
    shadow.getElementById('btn-close').onclick   = () => host.remove();
    shadow.getElementById('btn-min').onclick = () => {
      const body   = shadow.getElementById('body');
      const tabs   = shadow.getElementById('tabs');
      const st     = shadow.getElementById('status');
      const hidden = body.style.display === 'none';
      [body, tabs, st].forEach(el => (el.style.display = hidden ? '' : 'none'));
      if (hidden) setActiveTab(activeTab); else ctrl.style.display = 'none';
      shadow.getElementById('btn-min').textContent = hidden ? '—' : '□';
    };
    shadow.getElementById('top-n').onchange = e => {
      topN = parseInt(e.target.value, 10);
      loadTab('gems');
    };
    shadow.getElementById('gem-lq').onchange = e => {
      const [l, q] = e.target.value.split('-').map(Number);
      gemLQ = { level: l, quality: q };
      updateFontBadge();
      loadTab('gems');
    };

    loadTab(activeTab);
  }

  // ─── SPA navigation detection ─────────────────────────────────────────────
  const _origPush    = history.pushState.bind(history);
  const _origReplace = history.replaceState.bind(history);
  history.pushState    = (...a) => { _origPush(...a);    maybeInit(); };
  history.replaceState = (...a) => { _origReplace(...a); maybeInit(); };
  window.addEventListener('popstate', maybeInit);

  function maybeInit() {
    if (tabFromUrl() && !document.getElementById('gemcheck-host')) {
      setTimeout(init, 600);
    }
  }

  // Initial load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
