/* GemCheck – static data tables.
 * Declared as var globals so content.js (IIFE) can access them without imports. */

// ─── Gem color lookup (base gem name → 'r' | 'g' | 'b') ──────────────────
// Source: poewiki.net/wiki/List_of_skill_gems (via gem_colors.json)
var GEM_COLORS = {
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
var TRANSFIG_GEMS = {
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
var HARVEST_TABS = {
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
  astrolabes:{ label: 'Astrolabes', type: 'Astrolabe', lifeforce: 'Primal Crystallised Lifeforce', cost: 400, useExchange: true },
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

// ─── Boss drop data ───────────────────────────────────────────────────────
// Drop rates sourced from poewiki screenshots.
// drops[] = guaranteed unique pool (rates sum to ~100%); rate null = unknown.
// extraDrops[] = independent additional drops (reliquary keys etc.) whose
//   chance does NOT consume the main unique slot — additive EV contribution.
var BOSS_DATA = [
  {
    id: 'shaper', label: 'The Shaper',
    additionalDrops: [
      { name: "Shaper's Exalted Orb", rate: 0.12 },
      { name: 'Orb of Dominance',     rate: 0.03 },
    ],
    normal: {
      entry: [
        { name: 'Fragment of the Hydra',    qty: 1 }, { name: 'Fragment of the Chimera', qty: 1 },
        { name: 'Fragment of the Phoenix',  qty: 1 }, { name: 'Fragment of the Minotaur', qty: 1 },
      ],
      drops: [
        { name: "Shaper's Touch", rate: 0.56 },
        { name: 'Voidwalker',     rate: 0.26 },
        { name: 'Solstice Vigil', rate: 0.15 },
        { name: 'Dying Sun',      rate: 0.03 },
      ],
    },
    uber: {
      entry: [{ name: 'Cosmic Fragment', qty: 4 }],
      drops: [
        { name: 'Echoes of Creation',   rate: 0.40 },
        { name: 'Entropic Devastation', rate: 0.36 },
        { name: 'The Tides of Time',    rate: 0.22 },
        { name: 'Starforge',            rate: 0.02 },
        { name: 'Sublime Vision',       rate: 0.02 },
      ],
      extraDrops: [
        { name: 'Cosmic Reliquary Key', rate: 0.01 },
      ],
    },
  },
  {
    id: 'elder', label: 'Uber Elder',
    normalLabel: 'Uber Elder', uberLabel: 'Uber Uber Elder',
    additionalDrops: [
      { name: "Watcher's Eye",        rate: 0.30 },
      { name: "Shaper's Exalted Orb", rate: 0.15 },
      { name: "Elder's Exalted Orb",  rate: 0.10 },
      { name: 'Orb of Dominance',     rate: 0.05 },
    ],
    normal: {
      entry: [
        { name: 'Fragment of Knowledge', qty: 1 }, { name: 'Fragment of Shape',    qty: 1 },
        { name: 'Fragment of Terror',    qty: 1 }, { name: 'Fragment of Emptiness', qty: 1 },
      ],
      drops: [
        { name: 'Mark of the Shaper', rate: 0.35 },
        { name: 'Mark of the Elder',  rate: 0.35 },
        { name: 'Voidfletcher',       rate: 0.15 },
        { name: 'Indigon',            rate: 0.12 },
        { name: 'Disintegrator',      rate: 0.03 },
      ],
    },
    uber: {
      entry: [{ name: 'Decaying Fragment', qty: 4 }],
      drops: [
        { name: 'Call of the Void',      rate: 0.40 },
        { name: 'The Devourer of Minds', rate: 0.30 },
        { name: 'Soul Ascension',        rate: 0.10 },
        { name: 'Impresence',            rate: 0.10 },
        { name: 'The Eternity Shroud',   rate: 0.06 },
        { name: 'Voidforge',             rate: 0.04 },
      ],
      extraDrops: [
        { name: 'Sublime Vision',         rate: 0.01  },
        { name: 'Decaying Reliquary Key', rate: 0.015 },
      ],
    },
  },
  {
    id: 'maven', label: 'The Maven',
    additionalDrops: [
      { name: 'Orb of Conflict', rate: 0.30 },
    ],
    normal: {
      entry: [{ name: "The Maven's Writ", qty: 1 }],
      drops: [
        { name: 'Legacy of Fury',     rate: 0.44 },
        { name: "Graven's Secret",    rate: 0.16 },
        { name: "Arn's Anguish",      rate: 0.16 },
        { name: "Olesya's Delight",   rate: 0.16 },
        { name: 'Doppelg\u00e4nger Guise', rate: 0.07 },
        { name: 'Echoforge',          rate: 0.01 },
      ],
    },
    uber: {
      entry: [{ name: 'Reality Fragment', qty: 4 }],
      drops: [
        { name: "Viridi's Veil",        rate: 0.50 },
        { name: 'Impossible Escape',    rate: 0.30 },
        { name: 'Grace of the Goddess', rate: 0.18 },
        { name: 'Progenesis',           rate: 0.02 },
      ],
      extraDrops: [
        { name: 'Shiny Reliquary Key', rate: 0.015 },
      ],
    },
  },
  {
    id: 'sirus', label: 'Sirus',
    additionalDrops: [
      { name: "Awakener's Orb", rate: 0.15 },
      { name: 'Orb of Dominance', rate: 0.10 },
    ],
    normal: {
      entry: [
        { name: "Al-Hezmin's Crest", qty: 1 }, { name: "Veritania's Crest", qty: 1 },
        { name: "Drox's Crest",      qty: 1 }, { name: "Baran's Crest",     qty: 1 },
      ],
      drops: [
        { name: 'Hands of the High Templar', rate: 0.40 },
        { name: 'Crown of the Inward Eye',   rate: 0.35 },
        { name: 'The Burden of Truth',       rate: 0.20 },
        { name: 'Thread of Hope',            rate: 0.05 },
      ],
    },
    uber: {
      entry: [{ name: 'Awakening Fragment', qty: 4 }],
      drops: [
        { name: 'Thread of Hope',     rate: 0.55  },
        { name: 'The Tempest Rising', rate: 0.37  },
        { name: "Oriath's End",       rate: 0.075 },
        { name: 'The Saviour',        rate: 0.005 },
      ],
      extraDrops: [
        { name: 'Oubliette Reliquary Key', rate: 0.015 },
      ],
    },
  },
  {
    id: 'exarch', label: 'Searing Exarch',
    additionalDrops: [
      { name: 'Exceptional Eldritch Ember',  rate: 0.15 },
      { name: 'Forbidden Flame',             rate: 0.05 },
      { name: 'Eldritch Exalted Orb',        rate: 0.05 },
      { name: 'Eldritch Orb of Annulment',   rate: 0.05 },
      { name: 'Eldritch Chaos Orb',          rate: 0.05 },
    ],
    normal: {
      entry: [{ name: 'Incandescent Invitation', qty: 1 }],
      drops: [
        { name: 'Dawnbreaker',              rate: 0.63 },
        { name: 'Dawnstrider',              rate: 0.35 },
        { name: 'Dissolution of the Flesh', rate: 0.02 },
      ],
    },
    uber: {
      entry: [{ name: 'Blazing Fragment', qty: 4 }],
      drops: [
        { name: 'The Annihilating Light',   rate: 0.455 },
        { name: "Annihilation's Approach",  rate: 0.29  },
        { name: 'Crystallised Omniscience', rate: 0.24  },
        { name: 'The Celestial Brace',      rate: 0.015 },
      ],
      extraDrops: [
        { name: 'Archive Reliquary Key', rate: 0.015 },
      ],
    },
  },
  {
    id: 'eater', label: 'Eater of Worlds',
    additionalDrops: [
      { name: 'Exceptional Eldritch Ichor', rate: 0.15 },
      { name: 'Forbidden Flesh',            rate: 0.05 },
      { name: 'Eldritch Exalted Orb',       rate: 0.05 },
      { name: 'Eldritch Orb of Annulment',  rate: 0.05 },
      { name: 'Eldritch Chaos Orb',         rate: 0.05 },
    ],
    normal: {
      entry: [{ name: 'Screaming Invitation', qty: 1 }],
      drops: [
        { name: 'Inextricable Fate',    rate: 0.55 },
        { name: 'The Gluttonous Tide',  rate: 0.43 },
        { name: 'Melding of the Flesh', rate: 0.02 },
      ],
    },
    uber: {
      entry: [{ name: 'Devouring Fragment', qty: 4 }],
      drops: [
        { name: 'Ravenous Passion',   rate: 0.68 },
        { name: 'Ashes of the Stars', rate: 0.30 },
        { name: 'Nimis',              rate: 0.02 },
      ],
      extraDrops: [
        { name: 'Visceral Reliquary Key', rate: 0.01 },
      ],
    },
  },
  {
    id: 'fear', label: 'Fear',
    additionalDrops: [
      { name: 'Orb of Intention', rate: 0.50 },
    ],
    normal: {
      entry: [{ name: 'Echo of Trauma', qty: 1 }],
      drops: [
        { name: 'The Unseen Hue',   rate: null },
        { name: 'Servant of Decay', rate: null },
        { name: "Enmity's Embrace", rate: null },
        { name: 'Starcaller',       rate: 0.02 },
      ],
    },
    uber: {
      entry: [{ name: 'Traumatic Fragment', qty: 4 }],
      drops: [
        { name: 'Coiling Whisper',    rate: null },
        { name: 'The Caged Mammoth',  rate: null },
        { name: 'Wing of the Wyvern', rate: null },
        { name: 'Woespike',           rate: 0.02 },
      ],
      extraDrops: [
        { name: 'Traumatic Reliquary Key', rate: 0.01 },
      ],
    },
  },
  {
    id: 'neglect', label: 'Neglect',
    additionalDrops: [
      { name: 'Orb of Remembrance', rate: 0.33 },
      { name: 'Bound By Destiny',   rate: 0.10 },
    ],
    normal: {
      entry: [{ name: 'Echo of Loneliness', qty: 1 }],
      drops: [
        { name: "Betrayal's Sting",    rate: 0.50 },
        { name: "The Arkhon's Tools",  rate: 0.38 },
        { name: "Venarius' Astrolabe", rate: 0.10 },
        { name: 'Legacy of the Rose',  rate: 0.02 },
      ],
    },
    uber: {
      entry: [{ name: 'Lonely Fragment', qty: 4 }],
      drops: [
        { name: 'Refuge in Isolation',  rate: 0.55 },
        { name: 'Bitter Instinct',      rate: 0.30 },
        { name: 'Haunting Memories',    rate: 0.13 },
        { name: 'Festering Resentment', rate: 0.02 },
      ],
      extraDrops: [
        { name: 'Lonely Reliquary Key', rate: 0.01 },
      ],
    },
  },
  {
    id: 'dread', label: 'Dread',
    additionalDrops: [
      { name: 'Orb of Unravelling', rate: 0.33 },
      { name: 'Bound By Destiny',   rate: 0.10 },
    ],
    normal: {
      entry: [{ name: 'Echo of Reverence', qty: 1 }],
      drops: [
        { name: 'Bonemeld',            rate: 0.55 },
        { name: 'The Dark Monarch',    rate: 0.35 },
        { name: 'Seven Teachings',     rate: 0.08 },
        { name: 'Wine of the Prophet', rate: 0.02 },
      ],
    },
    uber: {
      entry: [{ name: 'Reverent Fragment', qty: 4 }],
      drops: [
        { name: 'The Hallowed Monarch',  rate: 0.54 },
        { name: 'Whispers of Infinity',  rate: 0.30 },
        { name: 'Wellwater Phylactery',  rate: 0.14 },
        { name: 'The Golden Charlatan',  rate: 0.02 },
      ],
      extraDrops: [
        { name: 'Reverent Reliquary Key', rate: 0.01 },
      ],
    },
  },
];

// ─── Misc lookup tables ───────────────────────────────────────────────────
var HIGH_ESSENCE_TIERS = new Set(['Deafening']);

var COLOR_META = {
  r: { label: 'Red',   accent: '#e05050', bg: 'rgba(224,80,80,.08)',   border: 'rgba(224,80,80,.3)'   },
  g: { label: 'Green', accent: '#4caf50', bg: 'rgba(76,175,80,.08)',   border: 'rgba(76,175,80,.3)'   },
  b: { label: 'Blue',  accent: '#5b9bd5', bg: 'rgba(91,155,213,.08)', border: 'rgba(91,155,213,.3)'  },
  u: { label: '?',     accent: '#888',    bg: 'rgba(136,136,136,.08)', border: 'rgba(136,136,136,.3)' },
};

var HIDDEN_ASCENDANCIES = new Set([
  'Fury of Nature', 'Harness the Void', 'Nine Lives', 'Searing Purity',
  'Fatal Flourish', 'Indomitable Resolve', 'Unleashed Potential',
]);

var TAB_API_HINT = {
  gems:       'itemoverview/SkillGem \u00b7 currencyoverview',
  catalysts:  'exchange/Currency \u00b7 currencyoverview',
  essences:   'exchange/Essence \u00b7 currencyoverview',
  delirium:   'exchange/DeliriumOrb \u00b7 currencyoverview',
  astrolabes: 'exchange/Astrolabe \u00b7 currencyoverview',
  fjewels:    'stash/ForbiddenJewel',
  bosses:     'itemoverview/Unique\u00d76+Invitation \u00b7 exchange/Fragment \u00b7 currencyoverview/Currency',
};
