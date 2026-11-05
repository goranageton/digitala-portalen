// Main Game Controller for Kemi-Labbet: Det Magiska Vätskelabbet (Liquid Sort)
(function () {
  const STORAGE_KEY = 'kem_puzzle_save_v1';

  const I18N = {
    sv: {
      gameName: 'Kemi-Labbet!',
      subtitle: 'Det Magiska Vätskelabbet • Blanda, Tänk & Sortera! 🧪✨',
      moves: 'DRAG',
      level: 'BANA',
      par: 'Mål',
      howToPlayTitle: 'HUR FUNGERAR SPELET',
      goalTitle: 'MÅLET',
      goalDesc: 'Sortera alla färgade vätskor så att varje provrör endast innehåller en enda ren färg.',
      howToPourTitle: 'HUR MAN HÄLLER',
      howToPourDesc: 'Tryck på ett provrör för att välja det, tryck sedan på ett annat rör för att hälla.',
      rulesTitle: 'LABB-REGLERNA',
      rulesDesc: 'Häll endast på samma färg eller i ett tomt provrör. Målröret måste ha tillräckligt med ledig plats.',
      specialTitle: 'LABBETS SPECIALARE',
      specialDesc: 'Längre in i labbet möter du korta provrör, hemliga lager (?) och upp till 12 kemiska färger! Använd [+]-knappen när som helst för att hämta ett extra hjälprör från förrådet.',
      settingsTitle: 'INSTÄLLNINGAR',
      soundLabel: 'Ljud',
      soundEffectLabel: 'LJUDEFFEKT',
      defaultSound: 'Standard',
      liquidSound: 'Vätska (Liquid)',
      colorblindLabel: 'Färgblindläge (Mönster & Symboler)',
      languageLabel: 'SPRÅK / LANGUAGE',
      unlockAllLabel: 'Lås upp alla 120 banor direkt',
      resetProgressBtn: 'Återställ sparade framsteg',
      levelMapTitle: 'VÄLJ BANA',
      levelMapSubtitle: 'Hoppa fritt tillbaka till tidigare banor eller fortsätt din resa genom labbet!',
      winTitle: 'AHA! EXPERIMENTET LYCKADES!',
      winMoves: 'Dina drag',
      winPar: '3-stjärnigt mål',
      winBest: 'Bästa resultat',
      nextLevelBtn: 'Nästa Bana ▶',
      replayBtn: 'Spela igen ↻',
      allLevelsBtn: 'Alla Banor 🗺️',
      hintBtn: 'Ledtråd',
      prevLevelBtn: 'Föregående bana',
      nextLevelQuickBtn: 'Nästa bana',
      mapBtn: 'Level',
      extraTubeBtn: 'Extra provrör (+2 kapacitet)',
      mysteryNote: '🔒 Innehåller hemliga vätskelager (?)',
      shortTubeNote: '🧪 Varierande rörstorlekar',
      playOn: 'Starta',
      clearedLevels: 'Lösta Pussel',
      stars: 'Stjärnor',
      mastery: 'Kemist',
      worldsHeader: '6 SPÄNNANDE KEMI-VÄRLDAR',
      songBtnText: 'DHR-MELODIN',
      headerPrefix: '',
      baltazarQuotes: [
        '”Inga problem är för svåra – med rätt kemi faller alla bitar på plats.” 💡',
        '”Varje stor upptäckt börjar med ett litet, nyfiket försök.” 🧪',
        '”Ha tålamod i labbet – de vackraste lösningarna kräver eftertanke.” ✨',
        '”Misstag i labbet är inte misslyckanden, det är nya lärdomar på vägen mot mästerskap.” ⚙️',
        '”När alla färger är sorterade råder fullkomlig kemisk harmoni!” 🌈',
        '”Nyfikenhet och logik är de skarpaste verktygen en tänkare kan ha.” 🗝️',
        '”Lugn i sinnet och ett öppet hjärta löser de allra klurigaste gåtorna.” 💖',
        '”Det är inte bara målet som räknas, utan glädjen i själva klurandet.” 🔬',
        '”Varje färg i livet har sitt eget värde – konsten är att ge dem rätt utrymme.” 🎨',
        '”En mästerkemist ser möjligheter där andra ser trassel.” 🌟',
        '”Ett smart och genomtänkt drag i taget leder till ett fulländat experiment!” 💧',
        '”Den som vågar tänka i nya banor finner alltid en väg framåt.” 🧭',
        '”Kunskap är som en kemisk reaktion – den växer när den delas med andra.” 🤝',
        '”När tankarna grumlas, ta ett djupt andetag och låt lösningen sedimentera i lugn och ro.” 🧘‍♂️',
        '”Det finns inga återvändsgränder i ett laboratorium, bara nya spännande hypoteser.” 🔍',
        '”En enda droppe vänlighet har större kraft än en hel ocean av tvivel.” 🌊',
        '”De mest glänsande kristallerna formas under stillhet och tid.” 💎',
        '”Att våga ställa frågan ’Varför?’ är det allra första steget mot ett nobelpris.” 🎓',
        '”Även den mest invecklade gåta består bara av enkla, små steg.” 🧩',
        '”När du sorterar dina tankar blir hela världen runt omkring lite klarare.” ☀️',
        '”Ett öppet sinne är som ett tomt provrör – redo att fyllas med fantastiska idéer!” 🧪',
        '”Livet är som kemi: blanda med omsorg, värm med kärlek och beundra resultatet.” ❤️',
        '”Den vise kemisten vet när man ska hälla och när man ska vänta.” ⏳',
        '”Fantasi är vetenskapens och uppfinningsrikedomens allra vackraste katalysator.” 🦋',
        '”I varje provrör finns potential för perfekt ordning – det krävs bara tålamod.” 👁️',
        '”Den som aldrig gjort ett felsteg har aldrig uppfunnit något nytt.” 🚀',
        '”Små, konsekventa framsteg varje dag skapar till slut mirakulösa resultat.” 📈',
        '”Var inte rädd för att ångra ett drag; ibland måste man backa för att hitta rätt väg framåt.” ↩️',
        '”Stora tänkare tänker inte nödvändigtvis snabbare än andra – de ger bara aldrig upp!” 🧠',
        '”Sanningen och harmonin gömmer sig ofta precis under ytan.” 🫧',
        '”Ett gott leende i labbet ökar reaktionshastigheten med hundra procent!” 😊',
        '”När alla bitar stämmer klickar det till i själen – AHA!” 💡',
        '”Det krävs mod och klokhet att lämna ett provrör tomt tills rätt färg dyker upp.” 🕊️',
        '”All kemisk magi börjar med ren observation och stilla förundran.” 🌌',
        '”Tänk som en proton – var alltid positiv i motgångar!” ⚛️',
        '”Genom att sortera det lilla förstår vi plötsligt det stora i tillvaron.” 🌍',
        '”Varje liten droppe räknas när man bygger framtidens mästerverk.” 💧',
        '”Det enkla är ofta det geniala som tagit längst tid att upptäcka.” 🌿',
        '”Döm inte ett experiment efter det första draget, se vart hela processen leder.” 🎯',
        '”Harmoni uppstår när varje element får blomstra på sin alldeles egna plats.” 🌺',
        '”Visdom är den sällsynta gåvan att se vackra mönster där andra bara ser kaos.” 🔮',
        '”Ha tillit till processen – den eleganta lösningen väntar redan på dig.” 🪄',
        '”Det är i tystnaden mellan tankarna som de allra klaraste idéerna föds.” ☕',
        '”Ett varmt hjärta och ett svalt huvud är den bästa kemiska formeln.” 🧊',
        '”Lyssna noga på droppens viskning: med lite tålamod ordnar sig allting till slut.” 🎵',
        '”Den som söker med glädje och entusiasm finner alltid mer än vad som efterfrågades.” 🎁',
        '”Färgerna i dina provrör speglar den fantastiska mångfalden i hela vårt universum.” 🪐',
        '”Ingen gåta i världen är för evigt låst för den som har nyfikenhet som gyllene nyckel.” 🗝️',
        '”Tålamod är inte att vänta passivt – det är att planera framåt med tillförsikt och ro.” ⚓',
        '”AHA! När tanken klarnar skimrar hela laboratoriet av ren skaparglädje!” 🌟'
      ],
      ranks: [
        { max: 8, title: 'Nyfiken Praktikant 🧪' },
        { max: 24, title: 'Dropp-Assistent 💧' },
        { max: 50, title: 'Kemi-Tekniker ⚙️' },
        { max: 80, title: 'Molekyl-Mästare 💡' },
        { max: 105, title: 'Laboratorie-Chef 🔮' },
        { max: 999, title: 'Nobelpristagare i Kemi 👑' }
      ]
    },
    en: {
      gameName: 'Chem Lab!',
      subtitle: 'The Magic Liquid Puzzle • Mix, Think & Sort! 🧪✨',
      moves: 'MOVES',
      level: 'LEVEL',
      par: 'Par',
      howToPlayTitle: 'HOW THE GAME WORKS',
      goalTitle: 'THE GOAL',
      goalDesc: 'Sort all colors so each tube contains only one solid color.',
      howToPourTitle: 'HOW TO POUR',
      howToPourDesc: 'Tap a tube to select it, then tap another tube to pour.',
      rulesTitle: 'THE RULES',
      rulesDesc: 'Pour onto the same color only. Target must have enough space.',
      specialTitle: 'LAB SPECIALS',
      specialDesc: 'As you progress, you face short tubes, mystery layers (?), and up to 12 colors! Tap [+] anytime to add a helper tube.',
      settingsTitle: 'SETTINGS',
      soundLabel: 'Sound',
      soundEffectLabel: 'SOUND EFFECT',
      defaultSound: 'Default',
      liquidSound: 'Liquid',
      colorblindLabel: 'Colorblind Mode',
      languageLabel: 'LANGUAGE / SPRÅK',
      unlockAllLabel: 'Unlock all 120 levels immediately',
      resetProgressBtn: 'Reset Saved Progress',
      levelMapTitle: 'SELECT LEVEL',
      levelMapSubtitle: 'Replay any previous level to beat your record or continue forward through the Chem Lab!',
      winTitle: 'AHA! EXPERIMENT SOLVED!',
      winMoves: 'Moves Used',
      winPar: '3-Star Par',
      winBest: 'Best Moves',
      nextLevelBtn: 'Next Level ▶',
      replayBtn: 'Replay ↻',
      allLevelsBtn: 'Level Map 🗺️',
      hintBtn: 'Hint',
      prevLevelBtn: 'Previous Level',
      nextLevelQuickBtn: 'Next Level',
      mapBtn: 'Level',
      extraTubeBtn: 'Add Helper Tube',
      mysteryNote: '🔒 Contains Mystery Layers (?)',
      shortTubeNote: '🧪 Variable Tube Sizes',
      playOn: 'Start',
      clearedLevels: 'Puzzles Solved',
      stars: 'Stars',
      mastery: 'Chemist',
      worldsHeader: '6 EXCITING CHEM WORLDS',
      songBtnText: 'DHR-MELODIN',
      headerPrefix: '',
      baltazarQuotes: [
        '“No problem is too difficult if you think one step further.” 💡',
        '“A single drop of patience and curiosity can illuminate the entire universe.” ✨',
        '“Imagination is the courage to test what no one has dared to think yet.” 🧪',
        '“Every great discovery is unraveled one small, thoughtful step at a time.” 🔬',
        '“Mistakes are never failures; they are experiments teaching us something new.” ⚙️',
        '“When all colors find their rightful place, harmony appears.” 🌈',
        '“Curiosity is the golden key to unlocking the deepest secrets of science.” 🗝️',
        '“A calm mind and an open heart solve the trickiest of riddles.” 💖',
        '“The true joy lies not just in the answer, but in the thinking itself.” 💡',
        '“The more we wonder together, the brighter our collective ideas become!” 🌟',
        '“Every color in life has its own worth – the art is giving each its space.” 🎨',
        '“Those who dare to think in new ways will always find a path forward.” 🧭',
        '“Knowledge is like a chemical reaction – it multiplies when shared.” 🤝',
        '“When thoughts feel clouded, take a breath and let the solution settle peacefully.” 🧘‍♂️',
        '“There are no dead ends in a laboratory, only new hypotheses to explore.” 🔍',
        '“A single drop of kindness carries more power than an ocean of doubt.” 🌊',
        '“The most brilliant crystals are formed under quiet patience and time.” 💎',
        '“Daring to ask ’Why?’ is the very first step toward a Nobel Prize.” 🎓',
        '“Even the most complex riddle is built of simple, mindful steps.” 🧩',
        '“When you organize your thoughts, the world around you becomes clearer.” ☀️',
        '“An open mind is like an empty test tube – ready to be filled with genius ideas!” 🧪',
        '“Life is like chemistry: mix with care, warm with love, and admire the results.” ❤️',
        '“The wise chemist knows when to pour and when to pause.” ⏳',
        '“Imagination is the most beautiful catalyst of scientific breakthrough.” 🦋',
        '“Within every test tube lies potential for pure harmony – look with patience.” 👁️',
        '“Whoever never made a blunder never concocted anything revolutionary.” 🚀',
        '“Small, consistent daily progress leads to miraculous discoveries.” 📈',
        '“Never hesitate to undo a move; sometimes you must step back to find the true path.” ↩️',
        '“Great minds do not think faster than others – they simply never surrender!” 🧠',
        '“Truth and harmony often hide just beneath the surface.” 🫧',
        '“A joyful smile in the lab speeds up reactions by one hundred percent!” 😊',
        '“When every element clicks into place, your soul whispers – AHA!” 💡',
        '“It takes wisdom and courage to keep a tube empty until the right hue arrives.” 🕊️',
        '“All scientific wonder begins with pure observation and quiet awe.” 🌌',
        '“Think like a proton – always remain positive through adversity!” ⚛️',
        '“By sorting the small details, we suddenly comprehend the grand universe.” 🌍',
        '“Every drop counts when engineering the masterpieces of tomorrow.” 💧',
        '“The simplest design is often the most profound discovery.” 🌿',
        '“Do not judge an experiment by the first pour; watch where the process leads.” 🎯',
        '“Harmony arises when each element is allowed to flourish in its rightful place.” 🌺',
        '“Wisdom is the rare gift of seeing elegant patterns where others only see chaos.” 🔮',
        '“Trust the process – the elegant solution is already waiting for you.” 🪄',
        '“In the quiet space between thoughts, the brightest epiphanies are born.” ☕',
        '“A warm heart and a cool head are the chemist’s greatest formula.” 🧊',
        '“Listen to the whisper of the drop: with a little patience, all will align.” 🎵',
        '“Those who explore with joy invariably discover far more than they sought.” 🎁',
        '“The colors in your tubes reflect the mesmerizing diversity of all creation.” 🪐',
        '“No riddle is forever sealed to one who holds curiosity as a golden key.” 🗝️',
        '“Patience is not passive waiting; it is moving forward with peaceful confidence.” ⚓',
        '“AHA! When clarity strikes, the whole laboratory shimmers with golden triumph!” 🌟'
      ],
      ranks: [
        { max: 8, title: 'Curious Intern 🧪' },
        { max: 24, title: 'Drop Assistant 💧' },
        { max: 50, title: 'Lab Technician ⚙️' },
        { max: 80, title: 'Molecule Master 💡' },
        { max: 105, title: 'Lab Director 🔮' },
        { max: 999, title: 'Nobel Laureate in Chemistry 👑' }
      ]
    }
  };

  const state = {
    currentLevel: 1,
    highestUnlocked: 1,
    unlockAll: false,
    levelStats: {},
    settings: {
      sound: true,
      soundMode: 'liquid',
      colorblind: false,
      lang: 'sv'
    },
    tubes: [],
    parMoves: 8,
    moves: 0,
    history: [],
    selectedTube: null,
    extraTubesUsed: 0,
    maxExtraTubes: 2,
    isAnimating: false,
    hintPair: null,
    activeChapterTab: 1,
    baltazarQuoteIdx: 0,
    isStartScreenOpen: true
  };

  function loadSave() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.currentLevel) state.currentLevel = Math.min(TOTAL_CAMPAIGN_LEVELS, Math.max(1, parsed.currentLevel));
      if (parsed.highestUnlocked) state.highestUnlocked = Math.min(TOTAL_CAMPAIGN_LEVELS, Math.max(1, parsed.highestUnlocked));
      if (typeof parsed.unlockAll === 'boolean') state.unlockAll = parsed.unlockAll;
      if (parsed.levelStats && typeof parsed.levelStats === 'object') state.levelStats = parsed.levelStats;
      if (parsed.settings && typeof parsed.settings === 'object') {
        state.settings = { ...state.settings, ...parsed.settings };
      }
    } catch (e) {
      console.warn('Could not load save:', e);
    }
  }

  function saveProgress() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          currentLevel: state.currentLevel,
          highestUnlocked: state.highestUnlocked,
          unlockAll: state.unlockAll,
          levelStats: state.levelStats,
          settings: state.settings
        })
      );
    } catch (e) {
      console.warn('Could not save progress:', e);
    }
  }

  function getColorMeta(colorId) {
    return LIQUID_COLORS.find((c) => c.id === colorId) || LIQUID_COLORS[0];
  }

  function t(key) {
    const dict = I18N[state.settings.lang] || I18N.sv;
    return dict[key] || key;
  }

  function cloneTubes(tubes) {
    return tubes.map((tube) => ({
      capacity: tube.capacity,
      layers: [...tube.layers],
      hiddenIndices: [...(tube.hiddenIndices || [])],
      isHelper: Boolean(tube.isHelper)
    }));
  }

  function getPlayerStats() {
    let totalStars = 0;
    let clearedCount = 0;
    for (let i = 1; i <= TOTAL_CAMPAIGN_LEVELS; i++) {
      const s = state.levelStats[i];
      if (s) {
        clearedCount++;
        totalStars += s.stars || 0;
      }
    }
    const percent = Math.round((clearedCount / TOTAL_CAMPAIGN_LEVELS) * 100);

    const ranks = (I18N[state.settings.lang] || I18N.sv).ranks;
    let currentRank = ranks[0].title;
    for (const r of ranks) {
      if (clearedCount <= r.max) {
        currentRank = r.title;
        break;
      }
    }

    return { totalStars, clearedCount, percent, currentRank };
  }

  function startLevel(levelNum) {
    const clamped = Math.min(TOTAL_CAMPAIGN_LEVELS, Math.max(1, levelNum));
    const levelData = buildLevel(clamped);

    state.currentLevel = clamped;
    state.activeChapterTab = levelData.chapter.id;
    state.tubes = cloneTubes(levelData.tubes);
    state.parMoves = levelData.parMoves;
    state.moves = 0;
    state.history = [];
    state.selectedTube = null;
    state.extraTubesUsed = 0;
    state.isAnimating = false;
    state.hintPair = null;

    saveProgress();
    updateUI();
    renderStage(levelData);
  }

  function isTubeCompleted(tube, colorTotals) {
    if (tube.layers.length === 0) return false;
    if (tube.hiddenIndices && tube.hiddenIndices.length > 0) return false;
    const first = tube.layers[0];
    for (let i = 1; i < tube.layers.length; i++) {
      if (tube.layers[i] !== first) return false;
    }
    const totalForColor = colorTotals[first] || 4;
    return tube.layers.length === totalForColor;
  }

  function getColorTotals() {
    const totals = {};
    for (const tube of state.tubes) {
      for (const c of tube.layers) {
        totals[c] = (totals[c] || 0) + 1;
      }
    }
    return totals;
  }

  function isPuzzleSolved() {
    const totals = getColorTotals();
    for (const tube of state.tubes) {
      if (tube.layers.length === 0) continue;
      if (!isTubeCompleted(tube, totals)) return false;
    }
    return true;
  }

  function getTopPourableBlock(tube) {
    if (tube.layers.length === 0) return null;
    const topIdx = tube.layers.length - 1;
    const color = tube.layers[topIdx];
    let count = 1;
    for (let i = topIdx - 1; i >= 0; i--) {
      if (tube.hiddenIndices && tube.hiddenIndices.includes(i)) break;
      if (tube.layers[i] === color) count++;
      else break;
    }
    return { color, count };
  }

  function canPour(fromIdx, toIdx) {
    if (fromIdx === toIdx) return { valid: false };
    const src = state.tubes[fromIdx];
    const dst = state.tubes[toIdx];
    if (!src || !dst) return { valid: false };
    if (src.layers.length === 0) return { valid: false };

    const freeSpace = dst.capacity - dst.layers.length;
    if (freeSpace <= 0) return { valid: false };

    const srcBlock = getTopPourableBlock(src);
    if (dst.layers.length > 0) {
      const dstTopColor = dst.layers[dst.layers.length - 1];
      if (dstTopColor !== srcBlock.color) return { valid: false };
    }

    const amount = Math.min(srcBlock.count, freeSpace);
    return { valid: amount > 0, amount, color: srcBlock.color };
  }

  function revealExposedMysteryLayers(tube) {
    if (!tube.hiddenIndices || tube.hiddenIndices.length === 0) return false;
    const topIndex = tube.layers.length - 1;
    const before = tube.hiddenIndices.length;
    tube.hiddenIndices = tube.hiddenIndices.filter((idx) => idx < topIndex);
    return tube.hiddenIndices.length < before;
  }

  function onTubeClick(idx) {
    if (state.isAnimating) return;
    state.hintPair = null;

    if (state.selectedTube === null) {
      if (state.tubes[idx].layers.length === 0) {
        triggerInvalidShake(idx);
        window.soundEngine.playInvalid();
        return;
      }
      state.selectedTube = idx;
      window.soundEngine.playSelect();
      renderStage();
      return;
    }

    if (state.selectedTube === idx) {
      state.selectedTube = null;
      window.soundEngine.playDeselect();
      renderStage();
      return;
    }

    const pourCheck = canPour(state.selectedTube, idx);
    if (!pourCheck.valid) {
      if (state.tubes[idx].layers.length > 0) {
        state.selectedTube = idx;
        window.soundEngine.playSelect();
        renderStage();
      } else {
        triggerInvalidShake(idx);
        window.soundEngine.playInvalid();
      }
      return;
    }

    executePour(state.selectedTube, idx, pourCheck.amount, pourCheck.color);
  }

  function triggerInvalidShake(idx) {
    const el = document.querySelector(`.tube-wrapper[data-index="${idx}"]`);
    if (!el) return;
    el.classList.remove('invalid-shake');
    void el.offsetWidth;
    el.classList.add('invalid-shake');
  }

  function spawnSplashParticles(x, y, color) {
    for (let i = 0; i < 5; i++) {
      const p = document.createElement('div');
      p.className = 'splash-particle';
      const size = 5 + Math.random() * 5;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.background = color;
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      const angle = (Math.PI * 0.25) + Math.random() * (Math.PI * 0.5);
      const dist = 24 + Math.random() * 32;
      const tx = (Math.random() - 0.5) * 44;
      const ty = -Math.sin(angle) * dist;
      p.style.setProperty('--tx', `${tx}px`);
      p.style.setProperty('--ty', `${ty}px`);
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 420);
    }
  }

  function executePour(fromIdx, toIdx, amount, colorId) {
    state.isAnimating = true;
    const prevSnapshot = {
      tubes: cloneTubes(state.tubes),
      moves: state.moves
    };
    state.history.push(prevSnapshot);

    const srcEl = document.querySelector(`.tube-wrapper[data-index="${fromIdx}"]`);
    const dstEl = document.querySelector(`.tube-wrapper[data-index="${toIdx}"]`);
    const streamEl = document.getElementById('pour-stream');

    const colorMeta = getColorMeta(colorId);
    const dstTube = state.tubes[toIdx];
    const fillRatio = (dstTube.layers.length + amount) / dstTube.capacity;

    window.soundEngine.playPour(amount, fillRatio);

    if (srcEl && dstEl && streamEl) {
      const srcRect = srcEl.getBoundingClientRect();
      const dstRect = dstEl.getBoundingClientRect();
      const dir = dstRect.left >= srcRect.left ? 1 : -1;
      const dx = (dstRect.left - srcRect.left) - dir * 36;
      const dy = (dstRect.top - srcRect.top) - 52;
      const angle = dir * 64;

      srcEl.style.zIndex = '40';
      srcEl.style.transition = 'transform 0.26s cubic-bezier(0.34, 1.56, 0.64, 1)';
      srcEl.style.transform = `translate(${dx}px, ${dy}px) rotate(${angle}deg)`;

      setTimeout(() => {
        const streamTop = dstRect.top - 24;
        const streamHeight = Math.max(48, dstRect.height - (dstTube.layers.length * 44));
        streamEl.style.background = colorMeta.streamColor;
        streamEl.style.left = `${dstRect.left + dstRect.width / 2 - 5}px`;
        streamEl.style.top = `${streamTop}px`;
        streamEl.style.height = `${streamHeight}px`;
        streamEl.style.opacity = '1';

        spawnSplashParticles(
          dstRect.left + dstRect.width / 2,
          dstRect.top + 6,
          colorMeta.streamColor
        );

        dstEl.classList.remove('tube-jiggle');
        void dstEl.offsetWidth;
        dstEl.classList.add('tube-jiggle');
      }, 140);

      setTimeout(() => {
        streamEl.style.opacity = '0';
        srcEl.style.transform = '';
        srcEl.style.zIndex = '';

        const srcTube = state.tubes[fromIdx];
        srcTube.layers.splice(srcTube.layers.length - amount, amount);
        revealExposedMysteryLayers(srcTube);

        for (let i = 0; i < amount; i++) {
          dstTube.layers.push(colorId);
        }

        state.moves += 1;
        state.selectedTube = null;
        state.isAnimating = false;

        const totals = getColorTotals();
        const justCompleted = isTubeCompleted(dstTube, totals);
        if (justCompleted) {
          window.soundEngine.playTubeComplete();
        }

        updateUI();
        renderStage(null, { newlyAddedAt: toIdx, addedCount: amount, completedTubeIdx: justCompleted ? toIdx : null });

        if (isPuzzleSolved()) {
          setTimeout(() => onLevelWon(), 340);
        }
      }, 350);
    } else {
      const srcTube = state.tubes[fromIdx];
      srcTube.layers.splice(srcTube.layers.length - amount, amount);
      revealExposedMysteryLayers(srcTube);
      for (let i = 0; i < amount; i++) {
        dstTube.layers.push(colorId);
      }
      state.moves += 1;
      state.selectedTube = null;
      state.isAnimating = false;
      updateUI();
      renderStage();
      if (isPuzzleSolved()) {
        setTimeout(() => onLevelWon(), 250);
      }
    }
  }

  function undoMove() {
    if (state.isAnimating || state.history.length === 0) return;
    const last = state.history.pop();
    state.tubes = last.tubes;
    state.moves = last.moves;
    state.selectedTube = null;
    state.hintPair = null;
    window.soundEngine.playDeselect();
    updateUI();
    renderStage();
  }

  function restartLevel() {
    if (state.isAnimating) return;
    window.soundEngine.playDeselect();
    startLevel(state.currentLevel);
  }

  function addExtraTube() {
    if (state.isAnimating || state.extraTubesUsed >= state.maxExtraTubes) return;
    state.history.push({
      tubes: cloneTubes(state.tubes),
      moves: state.moves
    });

    if (state.extraTubesUsed === 0) {
      state.tubes.push({ capacity: 2, layers: [], hiddenIndices: [], isHelper: true });
    } else {
      const helper = state.tubes.find((t) => t.isHelper) || state.tubes[state.tubes.length - 1];
      if (helper && helper.capacity < 4) {
        helper.capacity = 4;
      } else {
        state.tubes.push({ capacity: 2, layers: [], hiddenIndices: [], isHelper: true });
      }
    }

    state.extraTubesUsed += 1;
    state.selectedTube = null;
    state.hintPair = null;
    window.soundEngine.playTubeComplete();
    updateUI();
    renderStage();
  }

  function requestHint() {
    if (state.isAnimating) return;
    const res = solvePuzzle(state.tubes, 9000);
    if (res.solved && res.moves.length > 0) {
      state.hintPair = res.moves[0];
      state.selectedTube = res.moves[0].from;
      window.soundEngine.playSelect();
      renderStage();
    } else {
      for (let i = 0; i < state.tubes.length; i++) {
        for (let j = 0; j < state.tubes.length; j++) {
          const check = canPour(i, j);
          if (check.valid && state.tubes[j].layers.length > 0) {
            state.hintPair = { from: i, to: j };
            state.selectedTube = i;
            window.soundEngine.playSelect();
            renderStage();
            return;
          }
        }
      }
      window.soundEngine.playInvalid();
    }
  }

  function computeStars(moves, par) {
    if (moves <= par + 2) return 3;
    if (moves <= Math.ceil(par * 1.45) + 3) return 2;
    return 1;
  }

  function onLevelWon() {
    window.soundEngine.playLevelWin();
    launchConfetti();

    const stars = computeStars(state.moves, state.parMoves);
    const prevStat = state.levelStats[state.currentLevel];
    const bestMoves = prevStat ? Math.min(prevStat.bestMoves, state.moves) : state.moves;
    const bestStars = prevStat ? Math.max(prevStat.stars, stars) : stars;

    state.levelStats[state.currentLevel] = {
      stars: bestStars,
      bestMoves
    };

    if (state.currentLevel >= state.highestUnlocked && state.currentLevel < TOTAL_CAMPAIGN_LEVELS) {
      state.highestUnlocked = state.currentLevel + 1;
    }

    saveProgress();
    updateUI();

    document.getElementById('win-stars-display').textContent =
      '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    document.getElementById('win-moves-val').textContent = state.moves;
    document.getElementById('win-par-val').textContent = state.parMoves;
    document.getElementById('win-best-val').textContent = bestMoves;

    openModal('win-modal');
  }

  function renderStage(levelMeta = null, animInfo = null) {
    const stage = document.getElementById('game-stage');
    stage.innerHTML = '';

    const n = state.tubes.length;
    const colorTotals = getColorTotals();

    const rows = [];
    if (n <= 7) {
      rows.push(state.tubes.map((t, idx) => ({ tube: t, idx })));
    } else {
      const topCount = Math.ceil(n / 2);
      rows.push(state.tubes.slice(0, topCount).map((t, idx) => ({ tube: t, idx })));
      rows.push(
        state.tubes.slice(topCount).map((t, i) => ({ tube: t, idx: topCount + i }))
      );
    }

    if (rows.length === 2) {
      document.documentElement.style.setProperty('--unit-height', window.innerWidth < 760 ? '28px' : '35px');
      document.documentElement.style.setProperty('--tube-width', window.innerWidth < 760 ? '42px' : '50px');
    } else {
      document.documentElement.style.setProperty('--unit-height', window.innerWidth < 760 ? '36px' : '42px');
      document.documentElement.style.setProperty('--tube-width', window.innerWidth < 760 ? '48px' : '58px');
    }

    rows.forEach((rowItems) => {
      const rowEl = document.createElement('div');
      rowEl.className = 'tubes-row';

      rowItems.forEach(({ tube, idx }) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'tube-wrapper';
        wrapper.setAttribute('data-index', idx);

        if (state.selectedTube === idx) wrapper.classList.add('selected');
        const completed = isTubeCompleted(tube, colorTotals);
        if (completed) wrapper.classList.add('completed');
        if (animInfo && animInfo.completedTubeIdx === idx) {
          wrapper.classList.add('tube-win-hop');
        }

        if (state.hintPair) {
          if (state.hintPair.from === idx) wrapper.classList.add('hint-source');
          if (state.hintPair.to === idx) wrapper.classList.add('hint-target');
        }

        const doneBadge = document.createElement('div');
        doneBadge.className = 'tube-done-badge';
        doneBadge.textContent = '✨🧪✨';
        wrapper.appendChild(doneBadge);

        const rim = document.createElement('div');
        rim.className = 'tube-rim';
        wrapper.appendChild(rim);

        const glass = document.createElement('div');
        glass.className = 'tube-glass';
        glass.style.height = `calc(var(--unit-height) * ${tube.capacity} + 14px)`;

        const stack = document.createElement('div');
        stack.className = 'liquid-stack';

        tube.layers.forEach((colorId, layerIdx) => {
          const isMystery = tube.hiddenIndices && tube.hiddenIndices.includes(layerIdx);
          const colorMeta = getColorMeta(colorId);

          const layerEl = document.createElement('div');
          layerEl.className = 'liquid-layer';
          if (layerIdx === tube.layers.length - 1) {
            layerEl.classList.add('top-surface');
          }

          if (
            animInfo &&
            animInfo.newlyAddedAt === idx &&
            layerIdx >= tube.layers.length - animInfo.addedCount
          ) {
            layerEl.classList.add('entering');
          }

          if (isMystery) {
            layerEl.classList.add('mystery-layer');
            const qMark = document.createElement('span');
            qMark.className = 'mystery-mark';
            qMark.textContent = '?';
            layerEl.appendChild(qMark);
          } else {
            layerEl.style.background = colorMeta.gradient;

            const pat = document.createElement('div');
            pat.className = `liquid-pattern ${colorMeta.pattern}`;
            layerEl.appendChild(pat);

            const sym = document.createElement('span');
            sym.className = 'cb-symbol';
            sym.textContent = colorMeta.symbol;
            layerEl.appendChild(sym);
          }

          stack.appendChild(layerEl);
        });

        glass.appendChild(stack);
        wrapper.appendChild(glass);

        wrapper.addEventListener('click', () => onTubeClick(idx));
        rowEl.appendChild(wrapper);
      });

      stage.appendChild(rowEl);
    });
  }

  function updateUI() {
    document.body.classList.toggle('colorblind-on', Boolean(state.settings.colorblind));
    window.soundEngine.setEnabled(state.settings.sound);
    window.soundEngine.setMode(state.settings.soundMode);

    document.getElementById('moves-label').textContent = t('moves');
    document.getElementById('moves-value').textContent = state.moves;
    document.getElementById('level-label').textContent = t('level');
    document.getElementById('level-value').textContent = `${state.currentLevel}`;

    const chapter = getChapterForLevel(state.currentLevel);
    const chName = state.settings.lang === 'en' ? chapter.nameEn : chapter.nameSv;
    const diffPill = document.getElementById('difficulty-pill');
    diffPill.textContent = chName;
    diffPill.style.borderColor = chapter.badgeColor;

    const prevBtn = document.getElementById('prev-level-btn');
    const nextBtn = document.getElementById('next-level-btn');
    prevBtn.disabled = state.currentLevel <= 1;
    const maxReachable = state.unlockAll ? TOTAL_CAMPAIGN_LEVELS : state.highestUnlocked;
    nextBtn.disabled = state.currentLevel >= maxReachable;

    document.getElementById('undo-btn').disabled = state.history.length === 0;
    const addTubeBtn = document.getElementById('add-tube-btn');
    const remainingExtra = state.maxExtraTubes - state.extraTubesUsed;
    addTubeBtn.disabled = remainingExtra <= 0;
    document.getElementById('extra-tube-badge').textContent = `+${remainingExtra}`;

    const savedStat = state.levelStats[state.currentLevel];
    const starsStr = savedStat ? '⭐'.repeat(savedStat.stars) : '';
    document.getElementById('chapter-info-text').textContent =
      `${chName} • ${t('level')} ${state.currentLevel}/${TOTAL_CAMPAIGN_LEVELS} ${starsStr}`;
    document.getElementById('par-info-text').textContent =
      `${t('par')}: ${state.parMoves} ${t('moves').toLowerCase()}`;

    updateStartScreenData();

    document.getElementById('how-to-play-title').textContent = t('howToPlayTitle');
    document.getElementById('goal-title').textContent = t('goalTitle');
    document.getElementById('goal-desc').textContent = t('goalDesc');
    document.getElementById('pour-title').textContent = t('howToPourTitle');
    document.getElementById('pour-desc').textContent = t('howToPourDesc');
    document.getElementById('rules-title').textContent = t('rulesTitle');
    document.getElementById('rules-desc').textContent = t('rulesDesc');
    document.getElementById('special-title').textContent = t('specialTitle');
    document.getElementById('special-desc').textContent = t('specialDesc');

    document.getElementById('settings-title').textContent = t('settingsTitle');
    document.getElementById('sound-setting-label').textContent = t('soundLabel');
    document.getElementById('sound-effect-caption').textContent = t('soundEffectLabel');
    document.getElementById('sound-default-btn').textContent = t('defaultSound');
    document.getElementById('sound-liquid-btn').textContent = t('liquidSound');
    document.getElementById('colorblind-setting-label').textContent = t('colorblindLabel');
    document.getElementById('unlock-all-label').textContent = t('unlockAllLabel');
    document.getElementById('reset-progress-btn').textContent = t('resetProgressBtn');

    document.getElementById('level-map-title').textContent = t('levelMapTitle');
    document.getElementById('level-map-subtitle').textContent = t('levelMapSubtitle');

    document.getElementById('win-modal-title').textContent = t('winTitle');
    document.getElementById('win-moves-label').textContent = t('winMoves');
    document.getElementById('win-par-label').textContent = t('winPar');
    document.getElementById('win-best-label').textContent = t('winBest');
    document.getElementById('win-next-btn').textContent = t('nextLevelBtn');
    document.getElementById('win-replay-btn').textContent = t('replayBtn');
    document.getElementById('win-map-btn').textContent = t('allLevelsBtn');

    document.getElementById('footer-prev-text').textContent = t('prevLevelBtn');
    document.getElementById('footer-map-text').textContent = t('mapBtn');
    document.getElementById('footer-hint-text').textContent = t('hintBtn');
    document.getElementById('footer-next-text').textContent = t('nextLevelQuickBtn');

    document.getElementById('sound-toggle').classList.toggle('active', state.settings.sound);
    document.getElementById('colorblind-toggle').classList.toggle('active', state.settings.colorblind);
    document.getElementById('unlock-all-toggle').classList.toggle('active', state.unlockAll);

    document.getElementById('sound-default-btn').classList.toggle('active', state.settings.soundMode === 'default');
    document.getElementById('sound-liquid-btn').classList.toggle('active', state.settings.soundMode === 'liquid');

    document.getElementById('lang-sv-btn').classList.toggle('active', state.settings.lang === 'sv');
    document.getElementById('lang-en-btn').classList.toggle('active', state.settings.lang === 'en');
  }

  function updateStartScreenData() {
    const stats = getPlayerStats();
    const prefixEl = document.getElementById('baltazar-header-prefix');
    if (prefixEl) prefixEl.textContent = t('headerPrefix');
    const wisdomTitleEl = document.getElementById('wisdom-title-lbl');
    if (wisdomTitleEl) {
      wisdomTitleEl.textContent = state.settings.lang === 'en'
        ? "PROFESSOR CHEM'S THOUGHTS AT THE LEVER:"
        : "PROFESSOR KEMIS KLOKA TANKAR VID SPAKEN:";
    }
    const subtitleEl = document.getElementById('start-subtitle');
    if (subtitleEl) subtitleEl.textContent = t('subtitle');
    document.getElementById('start-rank-title').textContent = stats.currentRank;
    document.getElementById('start-level-badge').textContent = `${t('level')} ${state.currentLevel} / ${TOTAL_CAMPAIGN_LEVELS}`;
    document.getElementById('start-stars-val').textContent = `⭐ ${stats.totalStars}`;
    document.getElementById('start-stars-lbl').textContent = t('stars');
    document.getElementById('start-cleared-val').textContent = `🏆 ${stats.clearedCount}`;
    document.getElementById('start-cleared-lbl').textContent = t('clearedLevels');
    document.getElementById('start-percent-val').textContent = `${stats.percent}%`;
    document.getElementById('start-percent-lbl').textContent = t('mastery');
    document.getElementById('start-progress-bar').style.width = `${Math.max(2, stats.percent)}%`;

    const startPlayLbl = document.getElementById('start-play-label');
    if (startPlayLbl) {
      startPlayLbl.textContent = t('playOn');
    }
    const startLevelsTxt = document.getElementById('start-levels-text');
    if (startLevelsTxt) startLevelsTxt.textContent = t('mapBtn');
    const startHelpTxt = document.getElementById('start-help-text');
    if (startHelpTxt) startHelpTxt.textContent = t('howToPlayTitle');
    const startSettingsTxt = document.getElementById('start-settings-text');
    if (startSettingsTxt) startSettingsTxt.textContent = t('settingsTitle');
    const worldsTitleLbl = document.getElementById('worlds-title-lbl');
    if (worldsTitleLbl) worldsTitleLbl.textContent = t('worldsHeader');
    const baltazarMusicTxt = document.getElementById('baltazar-music-text');
    if (baltazarMusicTxt) baltazarMusicTxt.textContent = t('songBtnText');
  }

  function renderLevelMap() {
    const tabsContainer = document.getElementById('chapters-tabs');
    const gridContainer = document.getElementById('levels-grid');
    tabsContainer.innerHTML = '';
    gridContainer.innerHTML = '';

    CHAPTERS.forEach((ch) => {
      const btn = document.createElement('button');
      btn.className = 'chapter-tab' + (state.activeChapterTab === ch.id ? ' active' : '');
      const name = state.settings.lang === 'en' ? ch.nameEn : ch.nameSv;
      btn.textContent = `${ch.id}. ${name} (${ch.range[0]}–${ch.range[1]})`;
      btn.addEventListener('click', () => {
        state.activeChapterTab = ch.id;
        window.soundEngine.playSelect();
        renderLevelMap();
      });
      tabsContainer.appendChild(btn);
    });

    const activeCh = CHAPTERS.find((c) => c.id === state.activeChapterTab) || CHAPTERS[0];
    const maxUnlocked = state.unlockAll ? TOTAL_CAMPAIGN_LEVELS : state.highestUnlocked;

    for (let lvl = activeCh.range[0]; lvl <= activeCh.range[1]; lvl++) {
      const cell = document.createElement('button');
      cell.className = 'level-cell';
      const isLocked = lvl > maxUnlocked;
      const stat = state.levelStats[lvl];

      if (lvl === state.currentLevel) cell.classList.add('current');
      else if (stat) cell.classList.add('completed');
      if (isLocked) cell.classList.add('locked');

      const numEl = document.createElement('div');
      numEl.className = 'level-num';
      numEl.textContent = isLocked ? `🔒 ${lvl}` : `${lvl}`;
      cell.appendChild(numEl);

      const starsEl = document.createElement('div');
      starsEl.className = 'level-stars';
      if (stat) {
        starsEl.textContent = '⭐'.repeat(stat.stars) + '☆'.repeat(3 - stat.stars);
      } else {
        starsEl.textContent = isLocked ? '' : '☆☆☆';
      }
      cell.appendChild(starsEl);

      if (stat && stat.bestMoves) {
        const bestEl = document.createElement('div');
        bestEl.className = 'level-moves-best';
        bestEl.textContent = `${stat.bestMoves} ${t('moves').toLowerCase()}`;
        cell.appendChild(bestEl);
      }

      cell.addEventListener('click', () => {
        if (isLocked) {
          window.soundEngine.playInvalid();
          return;
        }
        window.soundEngine.playSelect();
        closeAllModals();
        hideStartScreen();
        startLevel(lvl);
      });

      gridContainer.appendChild(cell);
    }
  }

  function showStartScreen() {
    state.isStartScreenOpen = true;
    closeAllModals();
    updateStartScreenData();
    const el = document.getElementById('start-screen');
    if (el) el.classList.remove('hidden');
    window.soundEngine.playSelect();
  }

  function hideStartScreen() {
    state.isStartScreenOpen = false;
    const el = document.getElementById('start-screen');
    if (el) el.classList.add('hidden');
    window.soundEngine.playPop();
  }

  function openModal(id) {
    closeAllModals();
    if (id === 'levels-modal') {
      renderLevelMap();
    }
    const el = document.getElementById(id);
    if (el) el.classList.add('open');
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach((m) => m.classList.remove('open'));
  }

  // Get next wise thought from Professor Kemi without repeating the same quote consecutively
  function getNextWiseQuote() {
    const quotes = (I18N[state.settings.lang] || I18N.sv).baltazarQuotes;
    if (!quotes || quotes.length === 0) return '💡';
    let nextIdx = Math.floor(Math.random() * quotes.length);
    if (nextIdx === state.baltazarQuoteIdx && quotes.length > 1) {
      nextIdx = (nextIdx + 1 + Math.floor(Math.random() * (quotes.length - 1))) % quotes.length;
    }
    state.baltazarQuoteIdx = nextIdx;
    return quotes[nextIdx];
  }

  // Interactive Professor Reaction
  function interactWithBaltazar() {
    window.soundEngine.playAha();
    const bubble = document.getElementById('baltazar-speech');
    const charWrap = document.getElementById('baltazar-character-wrap');

    if (bubble) {
      bubble.textContent = getNextWiseQuote();
      bubble.style.animation = 'none';
      void bubble.offsetWidth;
      bubble.style.animation = 'quotePop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }

    if (charWrap) {
      charWrap.style.animation = 'none';
      void charWrap.offsetWidth;
      charWrap.style.animation = 'tubeWinHop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)';

      const star = document.createElement('div');
      star.textContent = ['💡', '✨', '💧', '🧪', '⭐'][Math.floor(Math.random() * 5)];
      star.style.position = 'absolute';
      star.style.left = '50%';
      star.style.top = '-10px';
      star.style.fontSize = '24px';
      star.style.pointerEvents = 'none';
      star.style.animation = 'splashFly 0.6s ease-out forwards';
      charWrap.appendChild(star);
      setTimeout(() => star.remove(), 600);
    }
  }

  // Pulling the Lever on Professor Kemi's Machine
  function pullMachineLever() {
    window.soundEngine.playLeverPull();
    const leverEl = document.getElementById('baltazar-lever-btn');
    if (leverEl) {
      leverEl.classList.remove('lever-pulled');
      void leverEl.offsetWidth;
      leverEl.classList.add('lever-pulled');
    }

    const drop = document.getElementById('baltazar-magic-drop');
    if (drop) {
      drop.style.animation = 'none';
      void drop.offsetWidth;
      drop.style.animation = 'magicDropDrip 0.7s cubic-bezier(0.2, 0.8, 0.2, 1)';
    }

    // Display thoughtful wise quotes in Professor Kemi's speech bubble
    const bubble = document.getElementById('baltazar-speech');
    if (bubble) {
      bubble.textContent = getNextWiseQuote();
      bubble.style.animation = 'none';
      void bubble.offsetWidth;
      bubble.style.animation = 'quotePop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }

    // Professor hop & AHA reaction
    const charWrap = document.getElementById('baltazar-character-wrap');
    if (charWrap) {
      charWrap.style.animation = 'none';
      void charWrap.offsetWidth;
      charWrap.style.animation = 'tubeWinHop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }

    const ahaBulb = document.getElementById('baltazar-aha-bulb');
    if (ahaBulb) {
      ahaBulb.classList.add('aha-glow');
      setTimeout(() => ahaBulb.classList.remove('aha-glow'), 1200);
    }
  }

  function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = Array.from({ length: 110 }, () => ({
      x: canvas.width * 0.5 + (Math.random() - 0.5) * 280,
      y: canvas.height * 0.42,
      vx: (Math.random() - 0.5) * 16,
      vy: -Math.random() * 15 - 5,
      size: 7 + Math.random() * 8,
      color: LIQUID_COLORS[Math.floor(Math.random() * LIQUID_COLORS.length)].streamColor,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 0.28
    }));

    let frame = 0;
    function tick() {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.38;
        p.rot += p.vrot;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
        ctx.restore();
      });
      if (frame < 120) {
        requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    requestAnimationFrame(tick);
  }

  function bindEvents() {
    // Start Screen Buttons
    document.getElementById('start-play-btn').addEventListener('click', () => {
      hideStartScreen();
      startLevel(state.currentLevel);
    });

    document.getElementById('start-levels-btn').addEventListener('click', () => {
      openModal('levels-modal');
    });

    document.getElementById('start-help-btn').addEventListener('click', () => {
      openModal('help-modal');
    });

    document.getElementById('start-settings-btn').addEventListener('click', () => {
      openModal('settings-modal');
    });

    // Baltazar Character & Machine interactions
    document.getElementById('baltazar-character-wrap').addEventListener('click', interactWithBaltazar);
    const wisdomBox = document.getElementById('baltazar-wisdom-box');
    if (wisdomBox) wisdomBox.addEventListener('click', interactWithBaltazar);
    document.getElementById('baltazar-lever-btn').addEventListener('click', pullMachineLever);
    document.getElementById('pull-lever-btn').addEventListener('click', pullMachineLever);

    // Baltazar Theme Song button
    document.getElementById('baltazar-song-btn').addEventListener('click', () => {
      window.soundEngine.playBaltazarTheme();
      interactWithBaltazar();
    });

    document.querySelectorAll('.world-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        const ch = parseInt(pill.dataset.chapter, 10);
        state.activeChapterTab = ch;
        openModal('levels-modal');
      });
    });

    // Top Bar Buttons
    document.getElementById('home-btn').addEventListener('click', showStartScreen);

    document.getElementById('settings-btn').addEventListener('click', () => {
      window.soundEngine.playSelect();
      openModal('settings-modal');
    });

    document.getElementById('help-btn').addEventListener('click', () => {
      window.soundEngine.playSelect();
      openModal('help-modal');
    });

    document.getElementById('add-tube-btn').addEventListener('click', addExtraTube);
    document.getElementById('restart-btn').addEventListener('click', restartLevel);
    document.getElementById('undo-btn').addEventListener('click', undoMove);

    document.getElementById('levels-btn').addEventListener('click', () => {
      window.soundEngine.playSelect();
      openModal('levels-modal');
    });

    document.getElementById('banner-open-map').addEventListener('click', () => {
      window.soundEngine.playSelect();
      openModal('levels-modal');
    });

    // Navigation buttons
    const goPrevLevel = () => {
      if (state.currentLevel > 1) {
        window.soundEngine.playSelect();
        startLevel(state.currentLevel - 1);
      }
    };
    const goNextLevel = () => {
      const maxReachable = state.unlockAll ? TOTAL_CAMPAIGN_LEVELS : state.highestUnlocked;
      if (state.currentLevel < maxReachable) {
        window.soundEngine.playSelect();
        startLevel(state.currentLevel + 1);
      } else {
        openModal('levels-modal');
      }
    };

    document.getElementById('prev-level-btn').addEventListener('click', goPrevLevel);
    document.getElementById('next-level-btn').addEventListener('click', goNextLevel);
    document.getElementById('footer-prev-btn').addEventListener('click', goPrevLevel);
    document.getElementById('footer-next-btn').addEventListener('click', goNextLevel);
    document.getElementById('footer-map-btn').addEventListener('click', () => {
      window.soundEngine.playSelect();
      openModal('levels-modal');
    });
    document.getElementById('footer-hint-btn').addEventListener('click', requestHint);

    // Close modals
    document.querySelectorAll('[data-close-modal]').forEach((btn) => {
      btn.addEventListener('click', () => {
        window.soundEngine.playDeselect();
        closeAllModals();
      });
    });

    document.querySelectorAll('.modal-overlay').forEach((overlay) => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          window.soundEngine.playDeselect();
          closeAllModals();
        }
      });
    });

    // Settings controls
    document.getElementById('sound-toggle').addEventListener('click', () => {
      state.settings.sound = !state.settings.sound;
      saveProgress();
      updateUI();
      if (state.settings.sound) window.soundEngine.playSelect();
    });

    document.getElementById('sound-default-btn').addEventListener('click', () => {
      state.settings.soundMode = 'default';
      saveProgress();
      updateUI();
      window.soundEngine.playPour(2, 0.5);
    });

    document.getElementById('sound-liquid-btn').addEventListener('click', () => {
      state.settings.soundMode = 'liquid';
      saveProgress();
      updateUI();
      window.soundEngine.playPour(2, 0.5);
    });

    document.getElementById('colorblind-toggle').addEventListener('click', () => {
      state.settings.colorblind = !state.settings.colorblind;
      saveProgress();
      updateUI();
      window.soundEngine.playSelect();
    });

    document.getElementById('unlock-all-toggle').addEventListener('click', () => {
      state.unlockAll = !state.unlockAll;
      saveProgress();
      updateUI();
      window.soundEngine.playSelect();
    });

    document.getElementById('lang-sv-btn').addEventListener('click', () => {
      state.settings.lang = 'sv';
      saveProgress();
      updateUI();
      window.soundEngine.playSelect();
    });

    document.getElementById('lang-en-btn').addEventListener('click', () => {
      state.settings.lang = 'en';
      saveProgress();
      updateUI();
      window.soundEngine.playSelect();
    });

    document.getElementById('reset-progress-btn').addEventListener('click', () => {
      state.levelStats = {};
      state.highestUnlocked = 1;
      state.currentLevel = 1;
      state.unlockAll = false;
      saveProgress();
      closeAllModals();
      startLevel(1);
    });

    // Win modal buttons
    document.getElementById('win-next-btn').addEventListener('click', () => {
      closeAllModals();
      const next = Math.min(TOTAL_CAMPAIGN_LEVELS, state.currentLevel + 1);
      startLevel(next);
    });

    document.getElementById('win-replay-btn').addEventListener('click', () => {
      closeAllModals();
      startLevel(state.currentLevel);
    });

    document.getElementById('win-map-btn').addEventListener('click', () => {
      openModal('levels-modal');
    });

    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      const gameView = document.getElementById('view-game');
      if (!gameView || gameView.classList.contains('hidden')) return;
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (document.querySelector('.modal-overlay.open')) {
        if (e.key === 'Escape') closeAllModals();
        return;
      }
      if (state.isStartScreenOpen) {
        if (e.key === 'Enter' || e.key === ' ') {
          hideStartScreen();
          startLevel(state.currentLevel);
        }
        return;
      }
      if (e.key === 'z' || e.key === 'Z') undoMove();
      else if (e.key === 'r' || e.key === 'R') restartLevel();
      else if (e.key === 'h' || e.key === 'H') requestHint();
      else if (e.key === 'ArrowLeft') goPrevLevel();
      else if (e.key === 'ArrowRight') goNextLevel();
    });
  }

  window.kemGame = {
    startLevel,
    renderStage,
    updateUI,
    showStartScreen,
    hideStartScreen,
    closeAllModals
  };

  // Initialize game on DOM ready
  function initKemGame() {
    loadSave();
    bindEvents();
    startLevel(state.currentLevel);
    updateStartScreenData();
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initKemGame);
  } else {
    initKemGame();
  }
})();
