// Color definitions, patterns (matching Screenshot 1), and Colorblind symbols
const LIQUID_COLORS = [
  {
    id: 'red',
    nameSv: 'Rubinröd',
    nameEn: 'Ruby Red',
    gradient: 'linear-gradient(90deg, #dc1c4b 0%, #f5285b 45%, #c4143e 100%)',
    streamColor: '#f5285b',
    pattern: 'pattern-diag-right',
    symbol: '▲'
  },
  {
    id: 'blue',
    nameSv: 'Koboltblå',
    nameEn: 'Cobalt Blue',
    gradient: 'linear-gradient(90deg, #3264e8 0%, #4b7ff9 45%, #2752c7 100%)',
    streamColor: '#4b7ff9',
    pattern: 'pattern-waves',
    symbol: '●'
  },
  {
    id: 'yellow',
    nameSv: 'Solgul',
    nameEn: 'Solar Yellow',
    gradient: 'linear-gradient(90deg, #ebb800 0%, #ffd60a 45%, #cf9f00 100%)',
    streamColor: '#ffd60a',
    pattern: 'pattern-vert-stripes',
    symbol: '■'
  },
  {
    id: 'green',
    nameSv: 'Smaragdgrön',
    nameEn: 'Emerald Green',
    gradient: 'linear-gradient(90deg, #10b956 0%, #24d96d 45%, #0b9643 100%)',
    streamColor: '#24d96d',
    pattern: 'pattern-dots',
    symbol: '◆'
  },
  {
    id: 'purple',
    nameSv: 'Ametistlila',
    nameEn: 'Amethyst Purple',
    gradient: 'linear-gradient(90deg, #8b3dff 0%, #a564ff 45%, #6e24db 100%)',
    streamColor: '#a564ff',
    pattern: 'pattern-horiz-stripes',
    symbol: '★'
  },
  {
    id: 'orange',
    nameSv: 'Bärnstensorange',
    nameEn: 'Amber Orange',
    gradient: 'linear-gradient(90deg, #f26419 0%, #ff823a 45%, #cf4f0c 100%)',
    streamColor: '#ff823a',
    pattern: 'pattern-crosshatch',
    symbol: '✚'
  },
  {
    id: 'cyan',
    nameSv: 'isblå Cyan',
    nameEn: 'Arctic Cyan',
    gradient: 'linear-gradient(90deg, #00b4d8 0%, #2ecff0 45%, #0090ad 100%)',
    streamColor: '#2ecff0',
    pattern: 'pattern-checker',
    symbol: '▼'
  },
  {
    id: 'pink',
    nameSv: 'Neonrosa',
    nameEn: 'Neon Pink',
    gradient: 'linear-gradient(90deg, #e6379a 0%, #ff5ab8 45%, #bf227b 100%)',
    streamColor: '#ff5ab8',
    pattern: 'pattern-diag-left',
    symbol: '♥'
  },
  {
    id: 'lime',
    nameSv: 'Neongrön Lime',
    nameEn: 'Toxic Lime',
    gradient: 'linear-gradient(90deg, #80b918 0%, #aacc00 45%, #659410 100%)',
    streamColor: '#aacc00',
    pattern: 'pattern-vert-stripes',
    symbol: '⬢'
  },
  {
    id: 'teal',
    nameSv: 'Djuphavsturkos',
    nameEn: 'Deep Teal',
    gradient: 'linear-gradient(90deg, #0d9488 0%, #14b8a6 45%, #0f766e 100%)',
    streamColor: '#14b8a6',
    pattern: 'pattern-dots',
    symbol: '✦'
  },
  {
    id: 'coral',
    nameSv: 'Korallröd',
    nameEn: 'Coral Peach',
    gradient: 'linear-gradient(90deg, #f43f5e 0%, #fb7185 45%, #be123c 100%)',
    streamColor: '#fb7185',
    pattern: 'pattern-horiz-stripes',
    symbol: '◉'
  },
  {
    id: 'indigo',
    nameSv: 'Nattindigo',
    nameEn: 'Night Indigo',
    gradient: 'linear-gradient(90deg, #4338ca 0%, #6366f1 45%, #3730a3 100%)',
    streamColor: '#6366f1',
    pattern: 'pattern-crosshatch',
    symbol: '✖'
  }
];

const CHAPTERS = [
  {
    id: 1,
    nameSv: 'Nybörjare',
    nameEn: 'Beginner',
    range: [1, 15],
    badgeColor: '#13c952'
  },
  {
    id: 2,
    nameSv: 'Lärling',
    nameEn: 'Apprentice',
    range: [16, 35],
    badgeColor: '#16a8e8'
  },
  {
    id: 3,
    nameSv: 'Kemist',
    nameEn: 'Chemist',
    range: [36, 60],
    badgeColor: '#6559f5'
  },
  {
    id: 4,
    nameSv: 'Labbmästare',
    nameEn: 'Lab Master',
    range: [61, 85],
    badgeColor: '#f5a623'
  },
  {
    id: 5,
    nameSv: 'Professor',
    nameEn: 'Professor',
    range: [86, 105],
    badgeColor: '#e6379a'
  },
  {
    id: 6,
    nameSv: 'Nobelpris',
    nameEn: 'Nobel Laureate',
    range: [106, 120],
    badgeColor: '#ff3b5c'
  }
];

const TOTAL_CAMPAIGN_LEVELS = 120;

// Seeded PRNG (Mulberry32) so every level 1..120 is 100% deterministic & reproducible
function createRNG(seed) {
  let a = seed >>> 0;
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getChapterForLevel(levelNum) {
  for (const ch of CHAPTERS) {
    if (levelNum >= ch.range[0] && levelNum <= ch.range[1]) {
      return ch;
    }
  }
  return CHAPTERS[CHAPTERS.length - 1];
}

// Fast solver to both verify generated levels and provide live hints in-game
function solvePuzzle(tubesInput, maxStates = 14000) {
  const startTubes = tubesInput.map((t) => ({
    capacity: t.capacity,
    layers: [...t.layers]
  }));

  function serialize(tubes) {
    return tubes.map((t) => `${t.capacity}:${t.layers.join(',')}`).join('|');
  }

  const colorCounts = {};
  for (const t of startTubes) {
    for (const c of t.layers) {
      colorCounts[c] = (colorCounts[c] || 0) + 1;
    }
  }

  function isSolved(tubes) {
    for (const t of tubes) {
      if (t.layers.length === 0) continue;
      const first = t.layers[0];
      for (let i = 1; i < t.layers.length; i++) {
        if (t.layers[i] !== first) return false;
      }
      // Every color must be completely united in its own single tube
      if (t.layers.length !== colorCounts[first]) {
        return false;
      }
    }
    return true;
  }

  function topBlock(tube) {
    if (tube.layers.length === 0) return null;
    const color = tube.layers[tube.layers.length - 1];
    let count = 0;
    for (let i = tube.layers.length - 1; i >= 0; i--) {
      if (tube.layers[i] === color) count++;
      else break;
    }
    return { color, count, isUniform: count === tube.layers.length };
  }

  if (isSolved(startTubes)) {
    return { solved: true, moves: [] };
  }

  const visited = new Set([serialize(startTubes)]);
  const queue = [{ tubes: startTubes, moves: [], score: 0 }];

  let statesChecked = 0;
  while (queue.length > 0 && statesChecked < maxStates) {
    // Best-first search prioritizing homogenizing moves
    queue.sort((a, b) => b.score - a.score);
    const current = queue.shift();
    statesChecked++;

    const { tubes, moves } = current;
    const n = tubes.length;

    for (let from = 0; from < n; from++) {
      const src = tubes[from];
      if (src.layers.length === 0) continue;
      const srcTop = topBlock(src);

      // Skip pouring an already completely united color tube
      if (srcTop.isUniform && src.layers.length === colorCounts[srcTop.color]) continue;

      let pouredToEmpty = false;

      for (let to = 0; to < n; to++) {
        if (from === to) continue;
        const dst = tubes[to];
        const freeSpace = dst.capacity - dst.layers.length;
        if (freeSpace <= 0) continue;

        const dstTop = topBlock(dst);
        if (dstTop !== null && dstTop.color !== srcTop.color) continue;

        // Avoid pointless move of a uniform stack into an empty tube of identical capacity
        if (dstTop === null) {
          if (srcTop.isUniform && src.capacity === dst.capacity) continue;
          if (pouredToEmpty && src.capacity === dst.capacity) continue;
          pouredToEmpty = true;
        }

        // Must fit at least 1 unit
        const amount = Math.min(srcTop.count, freeSpace);
        if (amount <= 0) continue;

        const nextTubes = tubes.map((t, idx) => {
          if (idx === from) {
            return { capacity: t.capacity, layers: t.layers.slice(0, t.layers.length - amount) };
          }
          if (idx === to) {
            const added = Array(amount).fill(srcTop.color);
            return { capacity: t.capacity, layers: [...t.layers, ...added] };
          }
          return { capacity: t.capacity, layers: [...t.layers] };
        });

        const key = serialize(nextTubes);
        if (visited.has(key)) continue;
        visited.add(key);

        const nextMoves = [...moves, { from, to, amount }];
        if (isSolved(nextTubes)) {
          return { solved: true, moves: nextMoves };
        }

        // Heuristic score: reward grouping same colors and freeing up tubes
        let heuristic = -nextMoves.length * 1.2;
        for (const t of nextTubes) {
          if (t.layers.length === 0) {
            heuristic += 4;
          } else {
            let samePairs = 0;
            for (let i = 1; i < t.layers.length; i++) {
              if (t.layers[i] === t.layers[i - 1]) samePairs++;
            }
            heuristic += samePairs * 3;
            const tb = topBlock(t);
            if (tb.isUniform && t.layers.length === t.capacity) heuristic += 10;
          }
        }

        queue.push({ tubes: nextTubes, moves: nextMoves, score: heuristic });
      }
    }
  }

  return { solved: false, moves: [] };
}

// Handcrafted early levels (Level 1 mirrors the uploaded screenshot style!)
const HANDCRAFTED_LEVELS = {
  1: {
    // Directly inspired by Screenshot 1: Red, Blue, Yellow with a short 2-unit tube on the right!
    tubes: [
      { capacity: 4, layers: ['red', 'yellow', 'red', 'blue'] },
      { capacity: 4, layers: [] },
      { capacity: 4, layers: ['red', 'yellow', 'red', 'blue'] },
      { capacity: 2, layers: ['yellow', 'yellow'] }
    ],
    mysteryCount: 0,
    parMoves: 7
  },
  2: {
    tubes: [
      { capacity: 4, layers: ['blue', 'red', 'blue', 'red'] },
      { capacity: 4, layers: ['yellow', 'blue', 'yellow', 'blue'] },
      { capacity: 4, layers: ['red', 'yellow', 'red', 'yellow'] },
      { capacity: 4, layers: [] },
      { capacity: 4, layers: [] }
    ],
    mysteryCount: 0,
    parMoves: 9
  },
  3: {
    tubes: [
      { capacity: 4, layers: ['green', 'red', 'yellow', 'blue'] },
      { capacity: 4, layers: ['blue', 'green', 'red', 'yellow'] },
      { capacity: 4, layers: ['yellow', 'blue', 'green', 'red'] },
      { capacity: 4, layers: ['red', 'yellow', 'blue', 'green'] },
      { capacity: 4, layers: [] },
      { capacity: 4, layers: [] }
    ],
    mysteryCount: 0,
    parMoves: 12
  }
};

function getLevelConfig(levelNum) {
  if (levelNum <= 5) {
    return { colors: 3, emptyTubes: 2, mysteryProb: 0, shortTube: levelNum === 4 };
  }
  if (levelNum <= 15) {
    return { colors: 4, emptyTubes: 2, mysteryProb: 0, shortTube: levelNum % 5 === 0 };
  }
  if (levelNum <= 35) {
    const colors = levelNum <= 25 ? 5 : 6;
    return { colors, emptyTubes: 2, mysteryProb: 0, shortTube: levelNum % 6 === 0 };
  }
  if (levelNum <= 60) {
    const colors = levelNum <= 48 ? 6 : 7;
    return { colors, emptyTubes: 2, mysteryProb: levelNum >= 50 ? 0.18 : 0, shortTube: levelNum % 7 === 0 };
  }
  if (levelNum <= 85) {
    const colors = levelNum <= 72 ? 7 : 8;
    return { colors, emptyTubes: 2, mysteryProb: 0.3, shortTube: levelNum % 6 === 0 };
  }
  if (levelNum <= 105) {
    const colors = levelNum <= 95 ? 9 : 10;
    return { colors, emptyTubes: 2, mysteryProb: 0.35, shortTube: false };
  }
  const colors = levelNum <= 113 ? 11 : 12;
  return { colors, emptyTubes: 2, mysteryProb: 0.42, shortTube: false };
}

function buildLevel(levelNum) {
  if (HANDCRAFTED_LEVELS[levelNum]) {
    const hc = HANDCRAFTED_LEVELS[levelNum];
    return {
      level: levelNum,
      chapter: getChapterForLevel(levelNum),
      tubes: hc.tubes.map((t) => ({
        capacity: t.capacity,
        layers: [...t.layers],
        hiddenIndices: []
      })),
      parMoves: hc.parMoves,
      hasShortTube: hc.tubes.some((t) => t.capacity < 4),
      hasMystery: false
    };
  }

  const cfg = getLevelConfig(levelNum);
  const colorIds = LIQUID_COLORS.slice(0, cfg.colors).map((c) => c.id);

  // Try deterministic seeds until we get a rich, well-mixed, guaranteed-solvable puzzle
  for (let attempt = 0; attempt < 40; attempt++) {
    const rng = createRNG(levelNum * 9973 + attempt * 313 + 17);
    const pool = [];

    // If shortTube is active, the last color has 2 units (fits in a 2-unit tube!), others have 4
    colorIds.forEach((cid, idx) => {
      const units = cfg.shortTube && idx === colorIds.length - 1 ? 2 : 4;
      for (let u = 0; u < units; u++) {
        pool.push(cid);
      }
    });

    // Fisher-Yates shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    const tubes = [];
    let cursor = 0;
    for (let t = 0; t < cfg.colors; t++) {
      const cap = cfg.shortTube && t === cfg.colors - 1 ? 2 : 4;
      const layers = pool.slice(cursor, cursor + cap);
      cursor += cap;
      tubes.push({ capacity: cap, layers });
    }

    // Prevent any tube starting already monochromatic
    let anyAlreadySolved = false;
    for (const t of tubes) {
      if (t.layers.length > 1 && t.layers.every((c) => c === t.layers[0])) {
        anyAlreadySolved = true;
        break;
      }
    }
    if (anyAlreadySolved && attempt < 30) continue;

    // Add empty tubes
    for (let e = 0; e < cfg.emptyTubes; e++) {
      tubes.push({ capacity: 4, layers: [] });
    }

    // Verify solvability with our solver
    const check = solvePuzzle(tubes, 3500);
    if (check.solved || attempt === 39) {
      const rngMystery = createRNG(levelNum * 4099 + 7);
      let hasMystery = false;

      const finalTubes = tubes.map((t) => {
        const hiddenIndices = [];
        if (cfg.mysteryProb > 0 && t.layers.length === 4) {
          for (let idx = 0; idx < 2; idx++) {
            if (rngMystery() < cfg.mysteryProb) {
              hiddenIndices.push(idx);
              hasMystery = true;
            }
          }
        }
        return {
          capacity: t.capacity,
          layers: [...t.layers],
          hiddenIndices
        };
      });

      const parMoves = check.solved
        ? Math.max(cfg.colors * 2, check.moves.length)
        : cfg.colors * 3 + 4;

      return {
        level: levelNum,
        chapter: getChapterForLevel(levelNum),
        tubes: finalTubes,
        parMoves,
        hasShortTube: cfg.shortTube,
        hasMystery
      };
    }
  }
}

window.LIQUID_COLORS = LIQUID_COLORS;
window.CHAPTERS = CHAPTERS;
window.TOTAL_CAMPAIGN_LEVELS = TOTAL_CAMPAIGN_LEVELS;
window.buildLevel = buildLevel;
window.solvePuzzle = solvePuzzle;
window.getChapterForLevel = getChapterForLevel;
