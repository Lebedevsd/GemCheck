/* GemCheck – API fetch layer and data processing. */

function leagueFromUrl() {
  const m = location.pathname.match(/\/economy\/([^/]+)\//);
  return m ? decodeURIComponent(m[1]) : 'Settlers';
}

function getColor(baseName) {
  return GEM_COLORS[baseName] || 'u';
}

// ─── API ──────────────────────────────────────────────────────────────────
var ITEM_API     = 'https://poe.ninja/api/data/itemoverview';
var CURR_API     = 'https://poe.ninja/api/data/currencyoverview';
var EXCHANGE_API = 'https://poe.ninja/poe1/api/economy/exchange/current/overview';
var STASH_API    = 'https://poe.ninja/poe1/api/economy/stash/current/item/overview';
var _caches = {}, _cacheTimes = {}, _cacheLeagues = {};
var CACHE_TTL = 10 * 60 * 1000;

// Relay messages from src/interceptor.js (MAIN world) into the cache.
// interceptor.js hooks window.fetch and posts matching responses here.
let _interceptResolve = null;
var _interceptPromise = new Promise(res => { _interceptResolve = res; });
var _exchangeResolvers = {}; // type → resolve fn

window.addEventListener('message', function (e) {
  if (!e.data || !e.data.__gc) return;
  const data = e.data.data;
  const url  = e.data.url || '';
  console.log('[GemCheck] intercepted:', url, '→ lines:', data && data.lines ? data.lines.length : 'no lines');
  if (!data || !data.lines || !data.lines.length) return;
  const league = leagueFromUrl();
  const now    = Date.now();
  if (url.indexOf('exchange/current/overview') !== -1) {
    const m = url.match(/[?&]type=([^&]+)/);
    const t = m ? m[1] : 'unknown';
    const key = 'exchange-' + t + '-' + league;
    _caches[key] = data; _cacheTimes[key] = now; _cacheLeagues[key] = league;
    if (_exchangeResolvers[t]) { _exchangeResolvers[t](data); delete _exchangeResolvers[t]; }
  } else {
    const key = 'SkillGem-' + league;
    _caches[key] = data; _cacheTimes[key] = now; _cacheLeagues[key] = league;
    if (_interceptResolve) { _interceptResolve(data); _interceptResolve = null; }
  }
});

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

// poe.ninja URL slugs use suffixes for league variants; the API expects
// the full human-readable name, e.g. "keepershc" → "Hardcore Keepers"
function normalizeLeague(slug) {
  let name = slug.toLowerCase();
  let prefix = '';
  if (name.endsWith('hcssf') || name.endsWith('ssfhc')) {
    prefix = 'Hardcore SSF '; name = name.slice(0, -5);
  } else if (name.endsWith('ssf')) {
    prefix = 'SSF ';          name = name.slice(0, -3);
  } else if (name.endsWith('hc')) {
    prefix = 'Hardcore ';     name = name.slice(0, -2);
  }
  return prefix + cap(name);
}

async function fetchItems(league, type) {
  const key = `${type}-${league}`;
  const now = Date.now();
  if (_caches[key] && _cacheLeagues[key] === league && now - (_cacheTimes[key] || 0) < CACHE_TTL) {
    return _caches[key];
  }

  const normalized = normalizeLeague(league);
  const variants = [...new Set([
    `${STASH_API}?league=${encodeURIComponent(normalized)}&type=${type}`,
    `${STASH_API}?league=${encodeURIComponent(cap(league))}&type=${type}`,
  ])];

  for (const url of variants) {
    console.log('[GemCheck] trying:', url);
    try {
      const r = await fetch(url, { credentials: 'include' });
      if (!r.ok) { console.warn('[GemCheck]', url, '→ HTTP', r.status); continue; }
      const data = await r.json();
      const lines = data.lines || [];
      console.log('[GemCheck]', url, '→ lines:', lines.length);
      if (lines.length > 0) {
        _caches[key] = data; _cacheTimes[key] = now; _cacheLeagues[key] = league;
        return data;
      }
    } catch (err) {
      console.warn('[GemCheck] fetch error:', url, err.message);
    }
  }

  // For SkillGem: last resort — wait for page intercept
  if (type === 'SkillGem') {
    console.log('[GemCheck] all direct attempts empty – waiting for page intercept…');
    const raceResult = await Promise.race([
      _interceptPromise,
      new Promise((_, rej) => setTimeout(() => rej(new Error(
        'No data from stash API. Make sure you are logged in to poe.ninja.'
      )), 8000)),
    ]);
    _caches[key] = raceResult; _cacheLeagues[key] = league;
    return raceResult;
  }

  throw new Error(`No data returned for ${type} / ${league}`);
}

async function fetchLifeforce(league) {
  const data = await fetchExchange(league, 'Currency');
  const lines = normalizeExchangeData(data).lines;
  const prices = {}, icons = {};
  for (const line of lines) {
    if (line.name.includes('Crystallised Lifeforce')) {
      prices[line.name] = line.primaryValue || 0;
      if (line.icon) icons[line.name] = line.icon;
    }
  }
  return { prices, icons };
}

async function fetchExchange(league, type) {
  const key = `exchange-${type}-${league}`;
  const now = Date.now();
  if (_caches[key] && _cacheLeagues[key] === league && now - (_cacheTimes[key] || 0) < CACHE_TTL) {
    return _caches[key];
  }
  const normalized = normalizeLeague(league);
  const urls = [...new Set([
    `${EXCHANGE_API}?league=${encodeURIComponent(normalized)}&type=${type}`,
    `${EXCHANGE_API}?league=${encodeURIComponent(cap(league))}&type=${type}`,
  ])];
  for (const url of urls) {
    console.log('[GemCheck] exchange trying:', url);
    try {
      const r = await fetch(url, { credentials: 'include' });
      if (!r.ok) { console.warn('[GemCheck] exchange', url, '→ HTTP', r.status); continue; }
      const data = await r.json();
      if ((data.lines || []).length > 0) {
        _caches[key] = data; _cacheTimes[key] = now; _cacheLeagues[key] = league;
        return data;
      }
    } catch (err) { console.warn('[GemCheck] exchange fetch error:', err.message); }
  }

  // Exchange API unavailable — fall back to itemoverview
  console.warn('[GemCheck] exchange API unavailable, falling back to itemoverview for', type);
  return fetchItems(league, type);
}

async function fetchStash(league, type) {
  const key = `stash-${type}-${league}`;
  const now = Date.now();
  if (_caches[key] && _cacheLeagues[key] === league && now - (_cacheTimes[key] || 0) < CACHE_TTL) {
    return _caches[key];
  }
  const normalized = normalizeLeague(league);
  const urls = [...new Set([
    `${STASH_API}?league=${encodeURIComponent(normalized)}&type=${type}`,
    `${STASH_API}?league=${encodeURIComponent(cap(league))}&type=${type}`,
  ])];
  for (const url of urls) {
    console.log('[GemCheck] stash trying:', url);
    try {
      const r = await fetch(url, { credentials: 'include' });
      console.log('[GemCheck] stash response:', r.status, r.ok);
      if (!r.ok) continue;
      const data = await r.json();
      console.log('[GemCheck] stash lines:', (data.lines || []).length);
      if ((data.lines || []).length > 0) {
        _caches[key] = data; _cacheTimes[key] = now; _cacheLeagues[key] = league;
        return data;
      }
    } catch (err) { console.warn('[GemCheck] stash fetch error:', err.message); }
  }
  throw new Error(`No stash data for ${type} / ${league}`);
}

async function fetchBossPrices(league) {
  const itemTypes = ['UniqueWeapon', 'UniqueArmour', 'UniqueJewel', 'UniqueAccessory',
                     'UniqueFlask', 'UniqueMap'];
  const [itemResults, fragRaw, currRaw, invRaw] = await Promise.all([
    Promise.allSettled(itemTypes.map(t => fetchItems(league, t))),
    fetchExchange(league, 'Fragment').catch(() => ({ lines: [] })),
    fetchExchange(league, 'Currency').catch(() => ({ lines: [] })),
    fetchItems(league, 'Invitation').catch(() => ({ lines: [] })),
  ]);
  const prices = {};
  const unidPrices = {}; // entries with no variant = unidentified on market
  for (const r of itemResults) {
    if (r.status !== 'fulfilled') continue;
    for (const l of (r.value.lines || [])) {
      const key = l.name || '';
      if (!key) continue;
      if (!l.variant && !(key in unidPrices))
        unidPrices[key] = l.chaosValue || 0;
      if (!(key in prices)) prices[key] = l.chaosValue || 0;
    }
  }
  // Fragment prices via exchange API
  for (const l of normalizeExchangeData(fragRaw).lines) {
    if (l.name && !(l.name in prices)) prices[l.name] = l.primaryValue || 0;
  }
  // Currency prices (exalted orbs, eldritch orbs, etc.) via exchange API
  for (const l of normalizeExchangeData(currRaw).lines) {
    if (l.name && !(l.name in prices)) prices[l.name] = l.primaryValue || 0;
  }
  // Invitation prices (Incandescent Invitation, Screaming Invitation, etc.)
  for (const l of (invRaw.lines || [])) {
    const name = l.name || '';
    if (name && !(name in prices)) prices[name] = l.chaosValue || 0;
  }
  // Log items not found to help validate drop data names
  const allNames = new Set(BOSS_DATA.flatMap(b => [
    ...(b.additionalDrops || []).map(d => d.name),
    ...['normal', 'uber'].flatMap(v => {
      const cfg = b[v]; if (!cfg) return [];
      return [
        ...cfg.entry.map(e => e.name),
        ...cfg.drops.map(d => d.name),
        ...(cfg.extraDrops || []).map(d => d.name),
      ];
    }),
  ]));
  for (const name of allNames) {
    if (!(name in prices)) console.log('[GemCheck] Boss item not found on poe.ninja:', name);
  }
  return { prices, unidPrices };
}

function bustCache(league, type) {
  const key = `${type}-${league}`;
  delete _caches[key]; delete _cacheTimes[key]; delete _cacheLeagues[key];
}

// ─── Data Processing ──────────────────────────────────────────────────────
function processGems(apiData, topN = 5, gemLQ = { level: 1, quality: 0 }) {
  const allLines = (apiData.lines || []).filter(g => !g.corrupted);
  const lines = allLines.filter(g => g.gemLevel === gemLQ.level && (g.gemQuality ?? 0) === gemLQ.quality);

  // Build cheapest price lookup from API: transfig name → entry
  const priceMap = {};
  lines.forEach(gem => {
    if (!priceMap[gem.name] || gem.chaosValue < priceMap[gem.name].sellPrice) {
      priceMap[gem.name] = {
        sellPrice: gem.chaosValue,
        count: gem.count || 0,
        icon: gem.icon || '',
      };
    }
  });
  console.log('[GemCheck] API lines:', lines.length, '| priceMap entries:', Object.keys(priceMap).length);

  // ── Build per-base-gem entries from the authoritative static list ──────
  // Pool sizes and variant counts come from TRANSFIG_GEMS, not the API.
  // Gems with no API listing still occupy a pool slot (sellPrice = 0).
  const gemEntries = [];
  for (const [c, names] of Object.entries(TRANSFIG_GEMS)) {
    // Group by base name
    const byBase = {};
    names.forEach(name => {
      if (name.endsWith('of Trarthus')) return; // Trathan gems — different mechanic
      const i = name.lastIndexOf(' of ');
      const baseName = name.slice(0, i);
      if (!byBase[baseName]) byBase[baseName] = [];
      const p = priceMap[name];
      byBase[baseName].push({
        name,
        baseName,
        sellPrice: p ? p.sellPrice : 0,
        count: p ? p.count : 0,
        icon: p ? p.icon : '',
        listed: !!p,
      });
    });

    for (const [baseName, variants] of Object.entries(byBase)) {
      const n = variants.length;
      const ev = Math.max(...variants.map(v => v.sellPrice));
      gemEntries.push({
        baseName,
        color: c,
        variants: variants.map(v => ({ ...v, prob: 1 / n }))
                          .sort((a, b) => b.sellPrice - a.sellPrice),
        ev,
        variantCount: n,
      });
    }
  }

  // Divine Font shows 3 random gems from the color pool — you pick the best.
  // Pool size = full static count (including unlisted gems).
  // P(seeing a specific gem in 3 draws) = 1 - ((n-1)/n)^3
  // EV of best-of-3 = order-statistic expected value across all pool gems.
  const FONT_DRAWS = 3;
  const colorStats = {};

  for (const c of ['r', 'g', 'b']) {
    const poolGems = TRANSFIG_GEMS[c].filter(name => !name.endsWith('of Trarthus')).map(name => ({
      name,
      sellPrice: priceMap[name]?.sellPrice || 0,
      count:     priceMap[name]?.count     || 0,
      icon:      priceMap[name]?.icon      || '',
    }));
    const n = poolGems.length;
    const sorted = [...poolGems].sort((a, b) => b.sellPrice - a.sellPrice);

    // sorted is descending (i=0 = most expensive = rank n).
    // P(gem at index i is the max of FONT_DRAWS draws) = ((n-i)/n)^k - ((n-i-1)/n)^k
    let poolEv = 0;
    sorted.forEach((g, i) => {
      const pBest = Math.pow((n - i) / n, FONT_DRAWS) - Math.pow((n - i - 1) / n, FONT_DRAWS);
      poolEv += g.sellPrice * pBest;
    });

    colorStats[c] = {
      color: c,
      poolSize: n,
      poolEv,
      // Only show bingo gems that have a price listing
      bingo: sorted.filter(g => g.sellPrice > 0).slice(0, topN).map(g => ({
        ...g,
        prob: 1 - Math.pow((n - 1) / n, FONT_DRAWS),
      })),
    };
  }

  // Combined specific gem picks across all colors, sorted by EV descending
  const gemPicks = gemEntries.sort((a, b) => b.ev - a.ev);
  const totalTransfig = Object.values(TRANSFIG_GEMS).reduce((s, a) => s + a.length, 0);

  return { colorStats, gemPicks, totalLines: lines.length, totalTransfig };
}

// ─── Harvest Processing ───────────────────────────────────────────────────

// The exchange API returns {items: [{id,name,image,...}], lines: [{id,primaryValue,...}]}
// Merge them into {lines: [{name,icon,primaryValue}]} for uniform processing.
function normalizeExchangeData(data) {
  if (!data) return { lines: [] };
  const meta = {};
  for (const item of (data.items || [])) {
    if (item.id)   meta[item.id]   = item;
    if (item.name) meta[item.name] = item;
  }
  const mkIcon = m => m.icon || (m.image ? 'https://web.poecdn.com' + m.image : '');
  // If lines already have name, enrich with icons from items but keep other fields
  if (data.lines && data.lines.length && data.lines[0].name) {
    return {
      lines: data.lines.map(line => {
        const m = meta[line.id] || meta[line.name] || {};
        return { ...line, icon: line.icon || mkIcon(m) };
      }),
    };
  }
  const lines = (data.lines || []).map(line => {
    const m = meta[line.id] || {};
    return {
      name:         m.name  || '',
      icon:         mkIcon(m),
      primaryValue: line.primaryValue,
      volume:       line.volumePrimaryValue || 0,
    };
  }).filter(l => l.name);
  return { lines };
}

function processHarvest(rawData, lfData, cfg) {
  const data = cfg.useExchange ? normalizeExchangeData(rawData) : rawData;
  const lines = (data.lines || []).filter(l => !l.corrupted);
  const lfPrice = (lfData.prices || lfData)[cfg.lifeforce] || 0;
  const craftCost = cfg.cost * lfPrice;
  const isExchange = lines.length > 0 && lines[0].primaryValue != null;

  const raw = lines
    .map(l => ({
      name:   l.name || '',
      price:  l.primaryValue ?? l.chaosValue ?? 0,
      icon:   l.icon || '',
      volume: l.volume || 0,
    }))
    .filter(l => l.name && !(cfg.exclude && cfg.exclude.has(l.name)) && (!cfg.nameFilter || cfg.nameFilter(l.name)))
    .map(l => ({ ...l, icon: (lfData.icons && lfData.icons[l.name]) || l.icon }));

  if (!raw.length) return null;

  // Use baked-in observed weights if provided; otherwise derive from volume/price ratio.
  let probs;
  if (cfg.weights) {
    const wTotal = raw.reduce((s, l) => s + (cfg.weights[l.name] || 0), 0);
    probs = raw.map(l => wTotal > 0 ? (cfg.weights[l.name] || 0) / wTotal : 1 / raw.length);
  } else {
    const vw = raw.map(l => l.price > 0 && l.volume > 0 ? l.volume / l.price : 0);
    const vTotal = vw.reduce((s, w) => s + w, 0);
    probs = vTotal > 0 ? vw.map(w => w / vTotal) : raw.map(() => 1 / raw.length);
  }
  const items = raw
    .map((l, i) => ({ ...l, prob: probs[i] }))
    .sort((a, b) => b.price - a.price);

  const poolEv      = items.reduce((s, i) => s + i.prob * i.price, 0);
  const craftThresh = poolEv - craftCost;
  const cheapest    = [...items].sort((a, b) => a.price - b.price)[0].price;
  const netEv       = poolEv - craftCost - cheapest;

  return { items, poolEv, craftCost, craftThresh, netEv, lfPrice, lfName: cfg.lifeforce, poolSize: items.length, isExchange, showProb: !!cfg.showProb, lfCount: cfg.cost };
}

function processEssences(rawData, lfData) {
  const data = normalizeExchangeData(rawData);
  const lines = (data.lines || []).filter(l => !l.corrupted);
  const lfPrice = (lfData.prices || lfData)['Primal Crystallised Lifeforce'] || 0;
  const craftCost = 30 * lfPrice;

  const byTier = {};
  for (const line of lines) {
    const name = line.name || '';
    const m = name.match(/^(\w+)\s+Essence/);
    if (!m) continue;
    const tier = m[1];
    if (!HIGH_ESSENCE_TIERS.has(tier)) continue;
    if (!byTier[tier]) byTier[tier] = [];
    byTier[tier].push({ name, price: line.primaryValue ?? line.chaosValue ?? 0, icon: (lfData.icons && lfData.icons[name]) || line.icon || '' });
  }

  return Object.entries(byTier).map(([tier, items]) => {
    items.sort((a, b) => b.price - a.price);
    const poolEv      = items.reduce((s, i) => s + i.price, 0) / items.length;
    const craftThresh = poolEv - craftCost;
    const netEv       = poolEv - craftCost - items[items.length - 1].price;
    return { tier, items, poolEv, craftCost, craftThresh, netEv, lfPrice, poolSize: items.length };
  }).sort((a, b) => b.poolEv - a.poolEv);
}

function processBoss(boss, version, priceData) {
  const { prices, unidPrices } = priceData;
  const cfg = boss[version];
  if (!cfg) return null;
  // All boss unique drops are unidentified — use unid price, fall back to identified
  function itemPrice(d) {
    return unidPrices[d.name] ?? prices[d.name] ?? 0;
  }
  const entryItems     = cfg.entry.map(e => ({ ...e, price: (prices[e.name] || 0) * e.qty }));
  const entryCost      = entryItems.reduce((s, e) => s + e.price, 0);
  const drops          = cfg.drops.map(d => ({ ...d, price: itemPrice(d) }));
  const extraDrops     = (cfg.extraDrops || []).map(d => ({ ...d, price: itemPrice(d) }));
  const additionalDrops = (boss.additionalDrops || []).map(d => ({ ...d, price: itemPrice(d) }));
  const mainEv       = drops.reduce((s, d) => s + (d.rate != null ? d.rate * d.price : 0), 0);
  const extraEv      = extraDrops.reduce((s, d) => s + (d.rate != null ? d.rate * d.price : 0), 0);
  const additionalEv = additionalDrops.reduce((s, d) => s + (d.rate != null ? d.rate * d.price : 0), 0);
  const dropEv       = mainEv + extraEv + additionalEv;
  const netEv        = dropEv - entryCost;
  return { drops, extraDrops, additionalDrops, entryItems, entryCost, dropEv, netEv };
}

function processFJewels(apiData) {
  const raw = (apiData.lines || []);
  console.log('[GemCheck] processFJewels raw lines:', raw.length);
  if (raw.length) {
    console.log('[GemCheck] sample line:', JSON.stringify(raw[0]));
  }

  // Detect field orientation: name=jewel/variant=passive  OR  name=passive/variant=jewel
  const nameIsJewel = raw.some(l => l.name === 'Forbidden Flame' || l.name === 'Forbidden Flesh');
  const variantIsJewel = !nameIsJewel && raw.some(l => l.variant === 'Forbidden Flame' || l.variant === 'Forbidden Flesh');
  console.log('[GemCheck] nameIsJewel:', nameIsJewel, 'variantIsJewel:', variantIsJewel);

  const lines = raw.filter(l => !l.corrupted);
  function getJewel(l) { return nameIsJewel ? l.name : (variantIsJewel ? l.variant : l.name); }
  function getPassive(l) { return nameIsJewel ? l.variant : (variantIsJewel ? l.name : l.variant); }

  function stats(items) {
    if (!items.length) return null;
    const prices = items.map(l => l.divineValue || 0).filter(p => p > 0);
    if (!prices.length) return null;
    const avg = prices.reduce((s, p) => s + p, 0) / prices.length;
    const sigma = Math.sqrt(prices.reduce((s, p) => s + (p - avg) ** 2, 0) / prices.length);
    return { count: items.length, avg, sigma, min: Math.min(...prices), max: Math.max(...prices) };
  }
  function both(jewel) {
    const all = lines.filter(l => getJewel(l) === jewel);
    const visible = all.filter(l => !HIDDEN_ASCENDANCIES.has(getPassive(l)));
    const sorted = [...all].sort((a, b) => (b.divineValue || 0) - (a.divineValue || 0));
    if (sorted.length) {
      console.log(`[GemCheck] ${jewel} most expensive:`, getPassive(sorted[0]), sorted[0].divineValue + ' div');
      console.log(`[GemCheck] ${jewel} cheapest:`, getPassive(sorted[sorted.length - 1]), sorted[sorted.length - 1].divineValue + ' div');
    }
    return { all: stats(all), visible: stats(visible) };
  }
  return { flame: both('Forbidden Flame'), flesh: both('Forbidden Flesh') };
}
