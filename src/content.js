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
    return null;
  }

  if (!tabFromUrl()) return;

  // ─── Gem color lookup (base gem name → 'r' | 'g' | 'b') ──────────────────
  // Source: poewiki.net/wiki/List_of_skill_gems (via gem_colors.json)
  const GEM_COLORS = {
    // ── RED (Strength) ─────────────────────────────────────────
    'Absolution': 'r',     'Ancestral Cry': 'r',     'Anger': 'r',     'Animate Guardian': 'r',
    'Autoexertion': 'r',     'Berserk': 'r',     'Bladestorm': 'r',     'Blood and Sand': 'r',
    'Boneshatter': 'r',     'Chain Hook': 'r',     'Cleave': 'r',     'Consecrated Path': 'r',
    'Corrupting Fever': 'r',     'Crushing Fist': 'r',     'Decoy Totem': 'r',     'Defiance Banner': 'r',
    'Determination': 'r',     'Devouring Totem': 'r',     'Divine Blast': 'r',     'Dominating Blow': 'r',
    'Dread Banner': 'r',     'Earthquake': 'r',     'Earthshatter': 'r',     'Enduring Cry': 'r',
    'Eviscerate': 'r',     'Exsanguinate': 'r',     'Flame Link': 'r',     'Flesh and Stone': 'r',
    'Frozen Legion': 'r',     'Glacial Hammer': 'r',     'Ground Slam': 'r',     'Heavy Strike': 'r',
    'Herald of Ash': 'r',     'Herald of Purity': 'r',     'Holy Flame Totem': 'r',     'Holy Hammers': 'r',
    'Holy Strike': 'r',     'Holy Sweep': 'r',     'Ice Crash': 'r',     'Immortal Call': 'r',
    'Infernal Blow': 'r',     'Infernal Cry': 'r',     'Intimidating Cry': 'r',     'Leap Slam': 'r',
    'Molten Shell': 'r',     'Molten Strike': 'r',     'Perforate': 'r',     'Petrified Blood': 'r',
    'Pride': 'r',     'Protective Link': 'r',     'Punishment': 'r',     'Purity of Fire': 'r',
    'Rage Vortex': 'r',     'Rallying Cry': 'r',     'Reap': 'r',     'Rejuvenation Totem': 'r',
    'Searing Bond': 'r',     'Seismic Cry': 'r',     'Shield Charge': 'r',     'Shield Crush': 'r',
    'Shield of Light': 'r',     'Shockwave Totem': 'r',     'Smite': 'r',     'Static Strike': 'r',
    'Steelskin': 'r',     'Summon Flame Golem': 'r',     'Summon Stone Golem': 'r',     'Sunder': 'r',
    'Swordstorm': 'r',     'Tectonic Slam': 'r',     'Vengeful Cry': 'r',     'Vigilant Strike': 'r',
    'Vitality': 'r',     'Volcanic Fissure': 'r',     'Vulnerability': 'r',     'War Banner': 'r',

    // ── GREEN (Dexterity) ──────────────────────────────────────
    'Ambush': 'g',     'Animate Weapon': 'g',     'Arctic Armour': 'g',     'Artillery Ballista': 'g',
    'Barrage': 'g',     'Bear Trap': 'g',     'Blade Blast': 'g',     'Blade Flurry': 'g',
    'Blade Trap': 'g',     'Blade Vortex': 'g',     'Bladefall': 'g',     'Blast Rain': 'g',
    'Blink Arrow': 'g',     'Blood Rage': 'g',     'Burning Arrow': 'g',     'Caustic Arrow': 'g',
    'Charged Dash': 'g',     'Cobra Lash': 'g',     'Conflagration': 'g',     'Cremation': 'g',
    'Cyclone': 'g',     'Dash': 'g',     'Desecrate': 'g',     'Detonate Dead': 'g',
    'Double Strike': 'g',     'Dual Strike': 'g',     'Elemental Hit': 'g',     'Ensnaring Arrow': 'g',
    'Ethereal Knives': 'g',     'Explosive Arrow': 'g',     'Explosive Concoction': 'g',     'Explosive Trap': 'g',
    'Fire Trap': 'g',     'Flamethrower Trap': 'g',     'Flicker Strike': 'g',     'Frenzy': 'g',
    'Frost Blades': 'g',     'Galvanic Arrow': 'g',     'Glacial Shield Swipe': 'g',     'Grace': 'g',
    'Haste': 'g',     'Hatred': 'g',     'Herald of Agony': 'g',     'Herald of Ice': 'g',
    'Ice Shot': 'g',     'Ice Trap': 'g',     'Intuitive Link': 'g',     'Lacerate': 'g',
    'Lancing Steel': 'g',     'Lightning Arrow': 'g',     'Lightning Strike': 'g',     'Mirror Arrow': 'g',
    'Pestilent Strike': 'g',     'Phase Run': 'g',     'Plague Bearer': 'g',     'Poisonous Concoction': 'g',
    'Precision': 'g',     'Puncture': 'g',     'Purity of Ice': 'g',     'Rain of Arrows': 'g',
    'Reave': 'g',     'Scourge Arrow': 'g',     'Seismic Trap': 'g',     'Shattering Steel': 'g',
    'Shrapnel Ballista': 'g',     'Siege Ballista': 'g',     'Smoke Mine': 'g',     'Snipe': 'g',
    'Spectral Helix': 'g',     'Spectral Shield Throw': 'g',     'Spectral Throw': 'g',     'Split Arrow': 'g',
    'Splitting Steel': 'g',     'Storm Rain': 'g',     'Summon Ice Golem': 'g',     'Temporal Chains': 'g',
    'Temporal Rift': 'g',     'Thunderstorm': 'g',     'Tornado': 'g',     'Tornado Shot': 'g',
    'Toxic Rain': 'g',     'Unearth': 'g',     'Vampiric Link': 'g',     'Venom Gyre': 'g',
    'Viper Strike': 'g',     'Volatile Dead': 'g',     'Whirling Blades': 'g',     'Wild Strike': 'g',
    'Withering Step': 'g',

    // ── BLUE (Intelligence) ────────────────────────────────────
    'Arc': 'b',     'Arcane Cloak': 'b',     'Arcanist Brand': 'b',     'Armageddon Brand': 'b',
    'Automation': 'b',     'Ball Lightning': 'b',     'Bane': 'b',     'Blazing Salvo': 'b',
    'Blight': 'b',     'Bodyswap': 'b',     'Bone Offering': 'b',     'Brand Recall': 'b',
    'Clarity': 'b',     'Cold Snap': 'b',     'Conductivity': 'b',     'Contagion': 'b',
    'Conversion Trap': 'b',     'Crackling Lance': 'b',     'Creeping Frost': 'b',     'Dark Pact': 'b',
    'Despair': 'b',     'Destructive Link': 'b',     'Discharge': 'b',     'Discipline': 'b',
    'Divine Ire': 'b',     'Divine Retribution': 'b',     'Elemental Weakness': 'b',     'Energy Blade': 'b',
    'Enfeeble': 'b',     'Essence Drain': 'b',     'Eye of Winter': 'b',     'Fireball': 'b',
    'Firestorm': 'b',     'Flame Dash': 'b',     'Flame Surge': 'b',     'Flame Wall': 'b',
    'Flameblast': 'b',     'Flammability': 'b',     'Flesh Offering': 'b',     'Forbidden Rite': 'b',
    'Freezing Pulse': 'b',     'Frost Bomb': 'b',     'Frost Shield': 'b',     'Frost Wall': 'b',
    'Frostbite': 'b',     'Frostblink': 'b',     'Frostbolt': 'b',     'Galvanic Field': 'b',
    'Glacial Cascade': 'b',     'Herald of Thunder': 'b',     'Hexblast': 'b',     'Hydrosphere': 'b',
    'Ice Nova': 'b',     'Ice Spear': 'b',     'Icicle Mine': 'b',     'Incinerate': 'b',
    'Kinetic Blast': 'b',     'Kinetic Bolt': 'b',     'Kinetic Fusillade': 'b',     'Kinetic Rain': 'b',
    'Lightning Conduit': 'b',     'Lightning Spire Trap': 'b',     'Lightning Tendrils': 'b',     'Lightning Trap': 'b',
    'Lightning Warp': 'b',     'Malevolence': 'b',     'Manabond': 'b',     'Orb of Storms': 'b',
    'Penance Brand': 'b',     'Power Siphon': 'b',     'Purifying Flame': 'b',     'Purity of Elements': 'b',
    'Purity of Lightning': 'b',     'Pyroclast Mine': 'b',     'Raise Spectre': 'b',     'Raise Zombie': 'b',
    'Righteous Fire': 'b',     'Rolling Magma': 'b',     'Scorching Ray': 'b',     'Shock Nova': 'b',
    'Sigil of Power': 'b',     'Siphoning Trap': 'b',     'Somatic Shell': 'b',     'Soul Link': 'b',
    'Soulrend': 'b',     'Spark': 'b',     'Spellslinger': 'b',     'Spirit Offering': 'b',
    'Storm Brand': 'b',     'Storm Burst': 'b',     'Storm Call': 'b',     'Stormbind': 'b',
    'Stormblast Mine': 'b',     'Summon Carrion Golem': 'b',     'Summon Chaos Golem': 'b',     'Summon Holy Relic': 'b',
    'Summon Lightning Golem': 'b',     'Summon Raging Spirit': 'b',     'Summon Reaper': 'b',     'Summon Skeletons': 'b',
    'Summon Skitterbots': 'b',     'Tempest Shield': 'b',     'Void Sphere': 'b',     'Voltaxic Burst': 'b',
    'Vortex': 'b',     'Wall of Force': 'b',     'Wave of Conviction': 'b',     'Winter Orb': 'b',
    'Wintertide Brand': 'b',     'Wither': 'b',     'Wrath': 'b',     'Zealotry': 'b',
  };

  // ─── Transfigured gem list (authoritative, from poewiki) ─────────────────
  // Source: poewiki.net/wiki/Transfigured_skill_gem (via gem_colors_transfigured.json)
  const TRANSFIG_GEMS = {
    r: [
      'Absolution of Inspiring','Animate Guardian of Smiting','Bladestorm of Uncertainty',
      'Boneshatter of Carnage','Boneshatter of Complex Trauma','Cleave of Rage',
      'Consecrated Path of Endurance','Dominating Blow of Inspiring','Earthquake of Amplification',
      'Earthshatter of Fragility','Earthshatter of Prominence','Exsanguinate of Transmission',
      'Frozen Legion of Rallying','Glacial Hammer of Shattering','Ground Slam of Earthshaking',
      'Holy Flame Totem of Ire','Ice Crash of Cadence','Infernal Blow of Immolation',
      'Leap Slam of Groundbreaking','Molten Strike of the Zenith','Perforate of Bloodshed',
      'Perforate of Duality','Rage Vortex of Berserking','Searing Bond of Detonation',
      'Shield Crush of the Chieftain','Shockwave Totem of Authority','Smite of Divine Judgement',
      'Static Strike of Gathering Lightning','Summon Flame Golem of Hordes','Summon Flame Golem of the Meteor',
      'Summon Stone Golem of Hordes','Summon Stone Golem of Safeguarding','Sunder of Earthbreaking',
      'Tectonic Slam of Cataclysm','Volcanic Fissure of Snaking',
    ],
    g: [
      'Animate Weapon of Ranged Arms','Animate Weapon of Self Reflection','Artillery Ballista of Cross Strafe',
      'Artillery Ballista of Focus Fire','Barrage of Volley Fire','Bear Trap of Skewers',
      'Blade Blast of Dagger Detonation','Blade Blast of Unloading','Blade Flurry of Incision',
      'Blade Trap of Greatswords','Blade Trap of Laceration','Blade Vortex of the Scythe',
      'Bladefall of Impaling','Bladefall of Volleys','Blink Arrow of Bombarding Clones',
      'Blink Arrow of Prismatic Clones','Burning Arrow of Vigour','Caustic Arrow of Poison',
      'Charged Dash of Projection','Cremation of Exhuming','Cremation of the Volcano',
      'Cyclone of Tumult','Detonate Dead of Chain Reaction','Detonate Dead of Scavenging',
      'Double Strike of Impaling','Double Strike of Momentum','Dual Strike of Ambidexterity',
      'Elemental Hit of the Spectrum','Ethereal Knives of Lingering Blades','Ethereal Knives of the Massacre',
      'Explosive Concoction of Destruction','Explosive Trap of Magnitude','Explosive Trap of Shrapnel',
      'Fire Trap of Blasting','Flamethrower Trap of Stability','Flicker Strike of Power',
      'Frenzy of Onslaught','Frost Blades of Katabasis','Galvanic Arrow of Energy',
      'Galvanic Arrow of Surging','Ice Shot of Penetration','Ice Trap of Hollowness',
      'Lacerate of Butchering','Lacerate of Haemorrhage','Lancing Steel of Spraying',
      'Lightning Arrow of Electrocution','Lightning Strike of Arcing','Mirror Arrow of Bombarding Clones',
      'Mirror Arrow of Prismatic Clones','Poisonous Concoction of Bouncing','Puncture of Shanking',
      'Rain of Arrows of Artillery','Rain of Arrows of Saturation','Reave of Refraction',
      'Scourge Arrow of Menace','Seismic Trap of Swells','Shattering Steel of Ammunition',
      'Shrapnel Ballista of Steel','Siege Ballista of Splintering','Spectral Shield Throw of Shattering',
      'Spectral Throw of Materialising','Split Arrow of Splitting','Splitting Steel of Ammunition',
      'Storm Rain of the Conduit','Storm Rain of the Fence','Summon Ice Golem of Hordes',
      'Summon Ice Golem of Shattering','Tornado Shot of Cloudburst','Tornado of Elemental Turbulence',
      'Toxic Rain of Sporeburst','Toxic Rain of Withering','Viper Strike of the Mamba',
      'Volatile Dead of Confinement','Volatile Dead of Seething','Wild Strike of Extremes',
    ],
    b: [
      'Arc of Oscillating','Arc of Surging','Armageddon Brand of Recall',
      'Armageddon Brand of Volatility','Ball Lightning of Orbiting','Ball Lightning of Static',
      'Bane of Condemnation','Blight of Atrophy','Blight of Contagion',
      'Bodyswap of Sacrifice','Cold Snap of Power','Contagion of Subsiding',
      'Contagion of Transference','Crackling Lance of Branching','Crackling Lance of Disintegration',
      'Creeping Frost of Floes','Discharge of Misery','Divine Ire of Disintegration',
      'Divine Ire of Holy Lightning','Essence Drain of Desperation','Essence Drain of Wickedness',
      'Eye of Winter of Finality','Eye of Winter of Transience','Firestorm of Meteors',
      'Firestorm of Pelting','Flame Dash of Return','Flame Surge of Combusting',
      'Flameblast of Celerity','Flameblast of Contraction','Forbidden Rite of Soul Sacrifice',
      'Frost Bomb of Forthcoming','Frost Bomb of Instability','Frostblink of Wintry Blast',
      'Galvanic Field of Intensity','Glacial Cascade of the Fissure','Hexblast of Contradiction',
      'Hexblast of Havoc','Ice Nova of Deep Freeze','Ice Nova of Frostbolts',
      'Ice Spear of Splitting','Icicle Mine of Fanning','Icicle Mine of Sabotage',
      'Incinerate of Expanse','Incinerate of Venting','Kinetic Blast of Clustering',
      'Kinetic Bolt of Fragmentation','Kinetic Fusillade of Detonation','Kinetic Rain of Impact',
      'Lightning Conduit of the Heavens','Lightning Spire Trap of Overloading','Lightning Spire Trap of Zapping',
      'Lightning Tendrils of Eccentricity','Lightning Tendrils of Escalation','Lightning Trap of Sparking',
      'Orb of Storms of Squalls','Penance Brand of Conduction','Penance Brand of Dissipation',
      'Power Siphon of the Archmage','Purifying Flame of Revelations','Pyroclast Mine of Sabotage',
      'Raise Spectre of Transience','Raise Zombie of Falling','Raise Zombie of Slamming',
      'Righteous Fire of Arcane Devotion','Scorching Ray of Immolation','Shock Nova of Procession',
      'Siphoning Trap of Pain','Soulrend of Reaping','Soulrend of the Spiral',
      'Spark of Unpredictability','Spark of the Nova','Storm Brand of Indecision',
      'Storm Burst of Repulsion','Stormbind of Teleportation','Summon Carrion Golem of Hordes',
      'Summon Carrion Golem of Scavenging','Summon Chaos Golem of Hordes','Summon Chaos Golem of the Maelström',
      'Summon Holy Relic of Conviction','Summon Lightning Golem of Hordes','Summon Raging Spirit of Enormity',
      'Summon Reaper of Eviscerating','Summon Reaper of Revenants','Summon Skeletons of Archers',
      'Summon Skeletons of Mages','Void Sphere of Rending','Vortex of Projection',
    ],
  };

  // ─── Harvest crafting config ──────────────────────────────────────────────
  const HARVEST_TABS = {
    fossils:   { label: 'Fossils',   type: 'Fossil',      lifeforce: 'Wild Crystallised Lifeforce',   cost: 30 },
    // oils: hidden for now
    catalysts: { label: 'Catalysts', type: 'Currency',    lifeforce: 'Vivid Crystallised Lifeforce',  cost: 30, useExchange: true,
                 nameFilter: n => n.includes('Catalyst'),
                 exclude: new Set(['Dextral Catalyst', 'Sinistral Catalyst', 'Tainted Catalyst']),
                 showProb: true,
                 // Observed drop rates from 2000-swap experiment
                 weights: {
                   'Intrinsic Catalyst':    0.2425,
                   'Imbued Catalyst':       0.1505,
                   'Noxious Catalyst':      0.1485,
                   'Turbulent Catalyst':    0.1480,
                   'Abrasive Catalyst':     0.1460,
                   'Prismatic Catalyst':    0.0455,
                   'Fertile Catalyst':      0.0440,
                   'Tempering Catalyst':    0.0415,
                   'Accelerating Catalyst': 0.0175,
                   'Unstable Catalyst':     0.0160,
                 } },
    essences:  { label: 'Essences',  type: 'Essence',     lifeforce: 'Primal Crystallised Lifeforce', cost: 30, useExchange: true },
    delirium:  { label: 'Deli Orbs', type: 'DeliriumOrb', lifeforce: 'Primal Crystallised Lifeforce', cost: 30, useExchange: true, showProb: true,
                 // Observed drop rates from ~1955-swap experiment, normalised to orbs present on poe.ninja
                 // (Foreboding, Imperial, Fossilised, Amorphous, Obscured excluded — not on exchange)
                 weights: {
                   "Jeweller's Delirium Orb":     0.1497,
                   "Armoursmith's Delirium Orb":  0.1386,
                   'Fine Delirium Orb':           0.1367,
                   "Blacksmith's Delirium Orb":   0.1224,
                   'Whispering Delirium Orb':     0.0680,
                   "Diviner's Delirium Orb":      0.0588,
                   'Fragmented Delirium Orb':     0.0482,
                   "Cartographer's Delirium Orb": 0.0452,
                   "Thaumaturge's Delirium Orb":  0.0452,
                   'Timeless Delirium Orb':       0.0427,
                   'Skittering Delirium Orb':     0.0402,
                   'Blighted Delirium Orb':       0.0396,
                   'Abyssal Delirium Orb':        0.0365,
                   'Singular Delirium Orb':       0.0285,
                 } },
  };
  const HIGH_ESSENCE_TIERS = new Set(['Deafening']);

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const COLOR_META = {
    r: { label: 'Red',   accent: '#e05050', bg: 'rgba(224,80,80,.08)',   border: 'rgba(224,80,80,.3)'   },
    g: { label: 'Green', accent: '#4caf50', bg: 'rgba(76,175,80,.08)',   border: 'rgba(76,175,80,.3)'   },
    b: { label: 'Blue',  accent: '#5b9bd5', bg: 'rgba(91,155,213,.08)', border: 'rgba(91,155,213,.3)'  },
    u: { label: '?',     accent: '#888',    bg: 'rgba(136,136,136,.08)', border: 'rgba(136,136,136,.3)' },
  };

  function fmtC(v) {
    if (v == null) return '—';
    if (v >= 1000) return (v / 1000).toFixed(1) + 'k c';
    if (v >= 100)  return Math.round(v) + 'c';
    if (v > 0 && v < 0.1) return v.toFixed(2) + 'c';
    return v.toFixed(1) + 'c';
  }

  function pct(p) { return (p * 100).toFixed(1) + '%'; }

  function getColor(baseName) {
    return GEM_COLORS[baseName] || 'u';
  }

  function leagueFromUrl() {
    const m = location.pathname.match(/\/economy\/([^/]+)\//);
    return m ? decodeURIComponent(m[1]) : 'Settlers';
  }

  // ─── API ──────────────────────────────────────────────────────────────────
  const ITEM_API     = 'https://poe.ninja/api/data/itemoverview';
  const CURR_API     = 'https://poe.ninja/api/data/currencyoverview';
  const EXCHANGE_API = 'https://poe.ninja/poe1/api/economy/exchange/current/overview';
  const _caches = {}, _cacheTimes = {}, _cacheLeagues = {};
  const CACHE_TTL = 5 * 60 * 1000;

  // Intercept poe.ninja's own fetch calls from the page context so we discover
  // the exact URL + parameters they use (content script world is isolated from
  // page world, so we inject a <script> tag to bridge that gap).
  let _interceptResolve = null;
  const _interceptPromise = new Promise(res => { _interceptResolve = res; });
  const _exchangeResolvers = {}; // type → resolve fn

  function injectInterceptor() {
    const s = document.createElement('script');
    s.textContent = `(function(){
      if (window.__gc_hooked) return;
      window.__gc_hooked = true;
      var _orig = window.fetch.bind(window);
      window.fetch = function(resource, opts) {
        var url = typeof resource === 'string' ? resource
                : (resource instanceof URL ? resource.href : (resource && resource.url) || '');
        var result = _orig(resource, opts);
        var isGem      = url.indexOf('itemoverview') !== -1 && url.indexOf('SkillGem') !== -1;
        var isExchange = url.indexOf('exchange/current/overview') !== -1;
        if (isGem || isExchange) {
          result.then(function(r){ return r.clone().json(); })
                .then(function(d){ window.postMessage({__gc: 1, url: url, data: d}, '*'); })
                .catch(function(){});
        }
        return result;
      };
    })()`;
    (document.head || document.documentElement).appendChild(s);
    s.remove();

    window.addEventListener('message', function(e) {
      if (!e.data || !e.data.__gc) return;
      const data = e.data.data;
      const url  = e.data.url || '';
      console.log('[GemCheck] intercepted:', url, '→ lines:', data && data.lines ? data.lines.length : 'no lines');
      if (!data || !data.lines || !data.lines.length) return;
      const league = leagueFromUrl();
      const now    = Date.now();
      if (url.indexOf('exchange/current/overview') !== -1) {
        // extract type from URL query string
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
  }

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
    const isCurrency = (type === 'Currency');
    const endpoint = isCurrency ? CURR_API : ITEM_API;
    const rawVariants = [
      `${endpoint}?league=${encodeURIComponent(normalized)}&type=${type}&game=poe1`,
      `${endpoint}?league=${encodeURIComponent(cap(league))}&type=${type}&game=poe1`,
      `${endpoint}?league=${encodeURIComponent(normalized)}&type=${type}`,
      `${endpoint}?league=${encodeURIComponent(cap(league))}&type=${type}`,
    ];
    // deduplicate
    const variants = [...new Set(rawVariants)];

    for (const url of variants) {
      console.log('[GemCheck] trying:', url);
      try {
        const r = await fetch(url);
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
          'No data from any endpoint. Open DevTools → Network, filter "itemoverview", reload page and check the exact URL poe.ninja uses.'
        )), 8000)),
      ]);
      _caches[key] = raceResult; _cacheLeagues[key] = league;
      return raceResult;
    }

    throw new Error(`No data returned for ${type} / ${league}`);
  }

  async function fetchLifeforce(league) {
    const data = await fetchItems(league, 'Currency');
    const prices = {}, icons = {};
    for (const line of (data.lines || [])) {
      const name = line.currencyTypeName || line.name || '';
      if (name.includes('Crystallised Lifeforce')) {
        prices[name] = line.chaosEquivalent || line.chaosValue || 0;
      }
    }
    for (const detail of (data.currencyDetails || [])) {
      if (detail.name && detail.icon) icons[detail.name] = detail.icon;
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
    // If lines already have a name field, no merging needed
    if (data.lines && data.lines.length && data.lines[0].name) return data;
    const meta = {};
    for (const item of (data.items || [])) {
      if (item.id) meta[item.id] = item;
    }
    const lines = (data.lines || []).map(line => {
      const m = meta[line.id] || {};
      return {
        name:         m.name  || '',
        icon:         m.image ? 'https://poe.ninja' + m.image : (m.icon || ''),
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

    return { items, poolEv, craftCost, craftThresh, netEv, lfPrice, lfName: cfg.lifeforce, poolSize: items.length, isExchange, showProb: !!cfg.showProb };
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

  // ─── CSS (Shadow DOM) ─────────────────────────────────────────────────────
  const CSS = `
    :host { all: initial; font-family: 'Segoe UI', system-ui, sans-serif; font-size: 13px; color: #c9d1d9; }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    #panel {
      background: #0d1117;
      border: 1px solid #30363d;
      border-radius: 10px;
      width: 520px;
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
    for (const item of items) {
      if (!shownBreak && item.price <= craftThresh) {
        shownBreak = true;
        html += `<div class="break-even-line"><span style="color:#3fb950">▲ keep above</span> · <span style="color:#f85149">▼ craft below</span> (${fmtC(craftThresh)})</div>`;
      }
      const keep = item.price > craftThresh;
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

  function harvestLegend(craftCost, craftThresh, lfPrice) {
    const lfStr = lfPrice > 0 ? `30 LF (${fmtC(craftCost)})` : `30 LF`;
    return `<div class="harvest-legend">`
      + `<strong>How it works:</strong> spend ${escHtml(lfStr)} to swap an item for a random one from the pool (pool EV: shown in header).`
      + ` <span style="color:#3fb950">&#x25B2; keep</span> if price &gt; ${fmtC(craftThresh)} &nbsp;`
      + `<span style="color:#f85149">&#x25BC; craft</span> if price &lt; ${fmtC(craftThresh)}`
      + `</div>`;
  }

  function renderHarvestSection(results, label) {
    if (!results) return `<div class="empty">No ${label} data found for this league.</div>`;
    const { items, poolEv, craftCost, craftThresh, netEv, lfPrice, lfName, poolSize } = results;
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
          ${harvestLegend(craftCost, craftThresh, lfPrice)}
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
            ${harvestLegend(craftCost, craftThresh, lfPrice)}
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
        panel.style.width     = Math.max(360, startW + ev.clientX - startX) + 'px';
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
        const newW = Math.max(360, startW - dx);
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
      status.textContent = `Fetching ${league} data…`;
      if (bust) bustCache(league, tab === 'gems' ? 'SkillGem' : (HARVEST_TABS[tab]?.type || tab));

      try {
        if (tab === 'gems') {
          const [data, currData] = await Promise.all([
            fetchItems(league, 'SkillGem'),
            fetchItems(league, 'Currency').catch(() => ({ lines: [], currencyDetails: [] })),
          ]);
          const gcpLine   = (currData.lines || []).find(l => (l.currencyTypeName || l.name) === "Gemcutter's Prism");
          const gcpDetail = (currData.currencyDetails || []).find(d => d.name === "Gemcutter's Prism");
          const gcpPrice  = gcpLine ? (gcpLine.chaosEquivalent || gcpLine.chaosValue || 0) : 0;
          const gcpIcon   = gcpDetail ? gcpDetail.icon : '';
          render(shadow, processGems(data, topN, gemLQ), topN, { price: gcpPrice, icon: gcpIcon });
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

  // Inject interceptor immediately at script load (document_start) so we hook
  // window.fetch before poe.ninja's own scripts make their API calls.
  injectInterceptor();

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
