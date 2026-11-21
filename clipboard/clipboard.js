// ==================== URKLIPP & EMOJI OCH MER (100 % LOKALT I WEBBLÄSAREN) ====================
(() => {
  const STORAGE_KEY = 'dh_clipboard_items';
  const MAX_UNPINNED = 25;

  const EMOJI_ITEMS = [
    // Smileys
    { char: '😀', label: 'Glad leende', cat: 'Smileys' },
    { char: '😃', label: 'Stort leende', cat: 'Smileys' },
    { char: '😄', label: 'Skrattande leende', cat: 'Smileys' },
    { char: '😁', label: 'Bred grin', cat: 'Smileys' },
    { char: '😅', label: 'Svettigt leende', cat: 'Smileys' },
    { char: '😂', label: 'Skrattar tårar', cat: 'Smileys' },
    { char: '🤣', label: 'Rullar av skratt', cat: 'Smileys' },
    { char: '😊', label: 'Varmt leende', cat: 'Smileys' },
    { char: '😇', label: 'Ängel glorie', cat: 'Smileys' },
    { char: '🙂', label: 'Lätt leende', cat: 'Smileys' },
    { char: '😉', label: 'Blinkar', cat: 'Smileys' },
    { char: '😍', label: 'Hjärtögon', cat: 'Smileys' },
    { char: '🥰', label: 'Kärleksfull', cat: 'Smileys' },
    { char: '😎', label: 'Solglasögon cool', cat: 'Smileys' },
    { char: '🤔', label: 'Tänker funderar', cat: 'Smileys' },
    { char: '🤨', label: 'Höjt ögonbryn', cat: 'Smileys' },
    { char: '😐', label: 'Neutral', cat: 'Smileys' },
    { char: '🙄', label: 'Himlade ögon', cat: 'Smileys' },
    { char: '😮', label: 'Förvånad', cat: 'Smileys' },
    { char: '😴', label: 'Trött sover', cat: 'Smileys' },
    { char: '😅', label: 'Lättad', cat: 'Smileys' },
    { char: '🥳', label: 'Firar party', cat: 'Smileys' },
    { char: '🤯', label: 'Mind blown', cat: 'Smileys' },
    { char: '😬', label: 'Grimaserar', cat: 'Smileys' },

    // Gester & Människor
    { char: '👍', label: 'Tumme upp bra', cat: 'Gester' },
    { char: '👎', label: 'Tumme ner', cat: 'Gester' },
    { char: '👌', label: 'OK perfekt', cat: 'Gester' },
    { char: '✌️', label: 'Fred seger', cat: 'Gester' },
    { char: '🤞', label: 'Håller tummarna', cat: 'Gester' },
    { char: '👏', label: 'Applåder bra jobbat', cat: 'Gester' },
    { char: '🙌', label: 'Hurra händer upp', cat: 'Gester' },
    { char: '🤝', label: 'Handslag överens', cat: 'Gester' },
    { char: '🙏', label: 'Tack ber', cat: 'Gester' },
    { char: '👋', label: 'Vinkar hej', cat: 'Gester' },
    { char: '💪', label: 'Stark styrka', cat: 'Gester' },
    { char: '👉', label: 'Pekar höger', cat: 'Gester' },
    { char: '👈', label: 'Pekar vänster', cat: 'Gester' },
    { char: '👆', label: 'Pekar upp', cat: 'Gester' },
    { char: '👇', label: 'Pekar ner', cat: 'Gester' },
    { char: '✍️', label: 'Skriver antecknar', cat: 'Gester' },

    // Arbete & Verktyg
    { char: '📋', label: 'Urklipp checklista', cat: 'Arbete' },
    { char: '📌', label: 'Nål fäst', cat: 'Arbete' },
    { char: '📎', label: 'Gem bifoga', cat: 'Arbete' },
    { char: '📦', label: 'Paket leverans lager', cat: 'Arbete' },
    { char: '🔧', label: 'Skiftnyckel verktyg', cat: 'Arbete' },
    { char: '🔨', label: 'Hammare fixa', cat: 'Arbete' },
    { char: '⚙️', label: 'Inställningar kugghjul', cat: 'Arbete' },
    { char: '🔋', label: 'Batteri laddning', cat: 'Arbete' },
    { char: '🔌', label: 'Kontakt el adapter', cat: 'Arbete' },
    { char: '💻', label: 'Dator laptop', cat: 'Arbete' },
    { char: '📱', label: 'Mobil telefon', cat: 'Arbete' },
    { char: '📅', label: 'Kalender datum', cat: 'Arbete' },
    { char: '🕒', label: 'Klocka tid', cat: 'Arbete' },
    { char: '📁', label: 'Mapp fil', cat: 'Arbete' },
    { char: '📊', label: 'Diagram statistik', cat: 'Arbete' },
    { char: '📧', label: 'E-post mejl', cat: 'Arbete' },
    { char: '📞', label: 'Telefon ring', cat: 'Arbete' },
    { char: '🚚', label: 'Lastbil transport', cat: 'Arbete' },
    { char: '🏥', label: 'Sjukhus vård', cat: 'Arbete' },
    { char: '💊', label: 'Medicin läkemedel', cat: 'Arbete' },

    // Symboler & Status
    { char: '✅', label: 'Klar godkänd bock', cat: 'Status' },
    { char: '☑️', label: 'Kryssruta klar', cat: 'Status' },
    { char: '❌', label: 'Fel avbryt kryss', cat: 'Status' },
    { char: '⚠️', label: 'Varning obs', cat: 'Status' },
    { char: '❗', label: 'Viktigt utropstecken', cat: 'Status' },
    { char: '❓', label: 'Fråga frågetecken', cat: 'Status' },
    { char: 'ℹ️', label: 'Information info', cat: 'Status' },
    { char: '🔒', label: 'Låst säker', cat: 'Status' },
    { char: '🔓', label: 'Upplåst', cat: 'Status' },
    { char: '🔔', label: 'Larm påminnelse', cat: 'Status' },
    { char: '🔍', label: 'Sök förstora', cat: 'Status' },
    { char: '💡', label: 'Idé tips lampa', cat: 'Status' },
    { char: '🚀', label: 'Raket snabb start', cat: 'Status' },
    { char: '⭐', label: 'Stjärna favorit', cat: 'Status' },
    { char: '🟢', label: 'Grön aktiv ok', cat: 'Status' },
    { char: '🟡', label: 'Gul väntar', cat: 'Status' },
    { char: '🔴', label: 'Röd stopp fel', cat: 'Status' },
    { char: '🔵', label: 'Blå info', cat: 'Status' },

    // Hjärtan & Firande
    { char: '❤️', label: 'Rött hjärta', cat: 'Firande' },
    { char: '💙', label: 'Blått hjärta', cat: 'Firande' },
    { char: '💚', label: 'Grönt hjärta', cat: 'Firande' },
    { char: '💛', label: 'Gult hjärta', cat: 'Firande' },
    { char: '🎉', label: 'Konfetti fest', cat: 'Firande' },
    { char: '🎊', label: 'Partykula', cat: 'Firande' },
    { char: '🏆', label: 'Pokal vinst', cat: 'Firande' },
    { char: '🔥', label: 'Eld grymt', cat: 'Firande' },
    { char: '✨', label: 'Gnistor magi', cat: 'Firande' },
    { char: '☕', label: 'Kaffe paus', cat: 'Firande' },
    { char: '☀️', label: 'Sol dag', cat: 'Firande' },
    { char: '🌈', label: 'Regnbåge', cat: 'Firande' }
  ];

  const GIF_ITEMS = [
    { id: 'gif_thumbsup', title: 'Tumme upp!', tag: '[GIF: Tumme upp 👍]', copyValue: '👍 Toppen, fixat!', badge: 'REAKTION', anim: 'animate-bounce', icon: '👍', bg: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/35 text-emerald-300' },
    { id: 'gif_party', title: 'Fira / Klart!', tag: '[GIF: Fest 🎉]', copyValue: '🎉 Hurra! Allt är klart!', badge: 'FIRANDE', anim: 'animate-pulse', icon: '🎉', bg: 'from-amber-500/20 to-rose-500/20 border-amber-500/35 text-amber-300' },
    { id: 'gif_clap', title: 'Snyggt jobbat', tag: '[GIF: Applåder 👏]', copyValue: '👏 Snyggt jobbat!', badge: 'BERÖM', anim: 'animate-bounce', icon: '👏', bg: 'from-sky-500/20 to-indigo-500/20 border-sky-500/35 text-sky-300' },
    { id: 'gif_rocket', title: 'Skickat / På väg', tag: '[GIF: Raket 🚀]', copyValue: '🚀 Skickat och på väg!', badge: 'LEVERANS', anim: 'animate-pulse', icon: '🚀', bg: 'from-indigo-500/20 to-purple-500/20 border-indigo-500/35 text-indigo-300' },
    { id: 'gif_check', title: 'Godkänd & Klar', tag: '[GIF: Klar ✅]', copyValue: '✅ Kontrollerad och klar!', badge: 'STATUS', anim: 'animate-pulse', icon: '✅', bg: 'from-emerald-500/20 to-green-500/20 border-emerald-500/35 text-emerald-300' },
    { id: 'gif_think', title: 'Undersöker saken', tag: '[GIF: Tänker 🤔]', copyValue: '🤔 Jag kikar på det direkt!', badge: 'SUPPORT', anim: 'animate-pulse', icon: '🤔', bg: 'from-violet-500/20 to-fuchsia-500/20 border-violet-500/35 text-violet-300' },
    { id: 'gif_coffee', title: 'Kaffepaus', tag: '[GIF: Kaffe ☕]', copyValue: '☕ Dags för en snabb kaffepaus!', badge: 'PAUS', anim: 'animate-bounce', icon: '☕', bg: 'from-amber-600/20 to-orange-500/20 border-amber-500/35 text-amber-200' },
    { id: 'gif_thanks', title: 'Stort tack!', tag: '[GIF: Tack 🙏]', copyValue: '🙏 Stort tack för hjälpen!', badge: 'TACK', anim: 'animate-pulse', icon: '🙏', bg: 'from-pink-500/20 to-rose-500/20 border-pink-500/35 text-pink-300' },
    { id: 'gif_wrench', title: 'Rekond pågår', tag: '[GIF: Verkstad 🔧]', copyValue: '🔧 Enheten är under rekond/service.', badge: 'REKOND', anim: 'animate-spin', icon: '⚙️', bg: 'from-cyan-500/20 to-sky-500/20 border-cyan-500/35 text-cyan-300' },
    { id: 'gif_fire', title: 'Grymt bra!', tag: '[GIF: Eld 🔥]', copyValue: '🔥 Grymt bra jobbat!', badge: 'BOOST', anim: 'animate-pulse', icon: '🔥', bg: 'from-orange-500/20 to-red-500/20 border-orange-500/35 text-orange-300' },
    { id: 'gif_laugh', title: 'Haha!', tag: '[GIF: Skratt 😂]', copyValue: '😂 Hahaha!', badge: 'HUMOR', anim: 'animate-bounce', icon: '😂', bg: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/35 text-yellow-300' },
    { id: 'gif_star', title: 'Toppenbetyg', tag: '[GIF: Stjärna ⭐]', copyValue: '⭐ 10/10 – perfekt!', badge: 'FAVORIT', anim: 'animate-pulse', icon: '⭐', bg: 'from-amber-400/20 to-yellow-500/20 border-amber-400/35 text-amber-300' }
  ];

  const KAOMOJI_ITEMS = [
    // Glada
    { text: '(•‿•)', label: 'Klassisk glad', cat: 'Glada' },
    { text: '(^‿^)', label: 'Leende', cat: 'Glada' },
    { text: '(◕‿◕)', label: 'Söt glad', cat: 'Glada' },
    { text: '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧', label: 'Gnistrande glad', cat: 'Glada' },
    { text: 'ヾ(＾-＾)ノ', label: 'Vinkar glatt', cat: 'Glada' },
    { text: '(★‿★)', label: 'Stjärnögon', cat: 'Glada' },
    { text: '(☞ﾟヮﾟ)☞', label: 'Pekar glatt', cat: 'Glada' },
    { text: 'ヽ(´▽`)/', label: 'Hurra', cat: 'Glada' },
    { text: '(b^_^)b', label: 'Tummen upp', cat: 'Glada' },

    // Rycka på axlarna
    { text: '¯\\_(ツ)_/¯', label: 'Vet ej / axelryckning', cat: 'Axelryck' },
    { text: '¯\\_(⊙_ʖ⊙)_/¯', label: 'Förvirrad axelryckning', cat: 'Axelryck' },
    { text: '┐(´ー｀)┌', label: 'Jaha axelryck', cat: 'Axelryck' },
    { text: '¯\\(°_o)/¯', label: 'Knäpp axelryckning', cat: 'Axelryck' },
    { text: '╮(╯▽╰)╭', label: 'Vad kan man göra', cat: 'Axelryck' },

    // Kärlek & Kram
    { text: '(づ｡◕‿‿◕｡)づ', label: 'Kram', cat: 'Kram' },
    { text: '(づ￣ ³￣)づ', label: 'Puss & kram', cat: 'Kram' },
    { text: '(♥‿♥)', label: 'Kär', cat: 'Kram' },
    { text: '(●´ω｀●)', label: 'Rodnar söt', cat: 'Kram' },
    { text: '(* ^ ω ^)', label: 'Lycklig', cat: 'Kram' },
    { text: '(っ´ω`)ﾉ(╥ω╥)', label: 'Tröstande klapp', cat: 'Kram' },
    { text: '<3', label: 'Hjärta', cat: 'Kram' },

    // Förvånad
    { text: '(⊙_⊙)', label: 'Storögd', cat: 'Förvånad' },
    { text: '(°o°)', label: 'Oj!', cat: 'Förvånad' },
    { text: 'Σ(°△°|||)', label: 'Chockad', cat: 'Förvånad' },
    { text: '(O_O;)', label: 'Nervös förvånad', cat: 'Förvånad' },
    { text: '(・_・;)', label: 'Osäker', cat: 'Förvånad' },
    { text: '(◎_◎;)', label: 'Förbryllad', cat: 'Förvånad' },

    // Arga / Trötta
    { text: '(¬_¬)', label: 'Skeptisk sidoblick', cat: 'Uttryck' },
    { text: 'ಠ_ಠ', label: 'Sträng blick', cat: 'Uttryck' },
    { text: '(╯°□°)╯︵ ┻━┻', label: 'Välter bordet', cat: 'Uttryck' },
    { text: '┬─┬ノ( º _ ºノ)', label: 'Ställer tillbaka bordet', cat: 'Uttryck' },
    { text: '(－‸ლ)', label: 'Facepalm', cat: 'Uttryck' },
    { text: '(×_×)', label: 'Slutkörd', cat: 'Uttryck' },
    { text: '(-_-;)・・・', label: 'Svettig / Suck', cat: 'Uttryck' },
    { text: '(；一_一)', label: 'Misstänksam', cat: 'Uttryck' },

    // Djur & Kul
    { text: 'ʕ•ᴥ•ʔ', label: 'Björn', cat: 'Djur' },
    { text: '(=^･ω･^=)', label: 'Katt', cat: 'Djur' },
    { text: '(^・x・^)', label: 'Liten katt', cat: 'Djur' },
    { text: 'U・ᴥ・U', label: 'Hund', cat: 'Djur' },
    { text: '( •_•)>⌐■-■', label: 'Tar på solglasögon', cat: 'Djur' },
    { text: '(⌐■_■)', label: 'Cool solglasögon', cat: 'Djur' },
    { text: '♪┏(・o･)┛♪', label: 'Dansar musik', cat: 'Djur' },
    { text: '(つ▀¯▀)つ', label: 'Cool kram', cat: 'Djur' }
  ];

  const SYMBOL_ITEMS = [
    // Valuta
    { char: '€', label: 'Euro', cat: 'Valuta' },
    { char: '£', label: 'Pund', cat: 'Valuta' },
    { char: '$', label: 'Dollar', cat: 'Valuta' },
    { char: '¥', label: 'Yen', cat: 'Valuta' },
    { char: '¢', label: 'Cent', cat: 'Valuta' },
    { char: '¤', label: 'Valutatecken', cat: 'Valuta' },
    { char: '₿', label: 'Bitcoin', cat: 'Valuta' },
    { char: '₹', label: 'Rupie', cat: 'Valuta' },

    // Matematik & Enheter
    { char: '±', label: 'Plus minus', cat: 'Matematik' },
    { char: '×', label: 'Multiplikation gånger', cat: 'Matematik' },
    { char: '÷', label: 'Division delat', cat: 'Matematik' },
    { char: '≈', label: 'Ungefär lika med', cat: 'Matematik' },
    { char: '≠', label: 'Inte lika med', cat: 'Matematik' },
    { char: '≤', label: 'Mindre eller lika', cat: 'Matematik' },
    { char: '≥', label: 'Större eller lika', cat: 'Matematik' },
    { char: '∞', label: 'Oändlighet', cat: 'Matematik' },
    { char: '√', label: 'Kvadratrot', cat: 'Matematik' },
    { char: '∑', label: 'Summa sigma', cat: 'Matematik' },
    { char: '∆', label: 'Delta ändring', cat: 'Matematik' },
    { char: 'π', label: 'Pi', cat: 'Matematik' },
    { char: 'Ω', label: 'Ohm omega', cat: 'Matematik' },
    { char: 'µ', label: 'Mikro mu', cat: 'Matematik' },
    { char: '°', label: 'Grader', cat: 'Matematik' },
    { char: '℃', label: 'Grader Celsius', cat: 'Matematik' },
    { char: '‰', label: 'Promille', cat: 'Matematik' },
    { char: '½', label: 'En halv', cat: 'Matematik' },
    { char: '¼', label: 'En fjärdedel', cat: 'Matematik' },
    { char: '¾', label: 'Tre fjärdedelar', cat: 'Matematik' },
    { char: '²', label: 'Upphöjt till 2', cat: 'Matematik' },
    { char: '³', label: 'Upphöjt till 3', cat: 'Matematik' },

    // Pilar
    { char: '→', label: 'Pil höger', cat: 'Pilar' },
    { char: '←', label: 'Pil vänster', cat: 'Pilar' },
    { char: '↑', label: 'Pil upp', cat: 'Pilar' },
    { char: '↓', label: 'Pil ner', cat: 'Pilar' },
    { char: '↔', label: 'Pil vänster-höger', cat: 'Pilar' },
    { char: '↕', label: 'Pil upp-ner', cat: 'Pilar' },
    { char: '⇒', label: 'Dubbelpil höger', cat: 'Pilar' },
    { char: '⇐', label: 'Dubbelpil vänster', cat: 'Pilar' },
    { char: '⇔', label: 'Dubbelpil båda håll', cat: 'Pilar' },
    { char: '↗', label: 'Pil snett upp höger', cat: 'Pilar' },
    { char: '↘', label: 'Pil snett ner höger', cat: 'Pilar' },
    { char: '↺', label: 'Återställ rotera', cat: 'Pilar' },
    { char: '↻', label: 'Uppdatera rotera', cat: 'Pilar' },

    // Text & Juridik
    { char: '§', label: 'Paragraf', cat: 'Text' },
    { char: '©', label: 'Copyright', cat: 'Text' },
    { char: '®', label: 'Registrerat varumärke', cat: 'Text' },
    { char: '™', label: 'Trademark', cat: 'Text' },
    { char: '•', label: 'Punktlista bullet', cat: 'Text' },
    { char: '·', label: 'Mittpunkt', cat: 'Text' },
    { char: '…', label: 'Uteslutningstecken', cat: 'Text' },
    { char: '–', label: 'Tankstreck kort', cat: 'Text' },
    { char: '—', label: 'Tankstreck långt', cat: 'Text' },
    { char: '«', label: 'Citattecken vänster', cat: 'Text' },
    { char: '»', label: 'Citattecken höger', cat: 'Text' },
    { char: '„', label: 'Citattecken nere', cat: 'Text' },
    { char: '†', label: 'Kors fotnot', cat: 'Text' },
    { char: '‡', label: 'Dubbelkors fotnot', cat: 'Text' },
    { char: '¶', label: 'Stycketecken', cat: 'Text' },
    { char: '№', label: 'Nummertecken', cat: 'Text' },

    // Markeringar & Former
    { char: '✓', label: 'Bock klar', cat: 'Markeringar' },
    { char: '✔', label: 'Fet bock', cat: 'Markeringar' },
    { char: '✕', label: 'Kryss', cat: 'Markeringar' },
    { char: '✖', label: 'Fet kryss', cat: 'Markeringar' },
    { char: '★', label: 'Fylld stjärna', cat: 'Markeringar' },
    { char: '☆', label: 'Tom stjärna', cat: 'Markeringar' },
    { char: '♦', label: 'Ruter', cat: 'Markeringar' },
    { char: '♠', label: 'Spader', cat: 'Markeringar' },
    { char: '♣', label: 'Klöver', cat: 'Markeringar' },
    { char: '♥', label: 'Hjärter', cat: 'Markeringar' },
    { char: '♪', label: 'Not musik', cat: 'Markeringar' },
    { char: '♫', label: 'Dubbelnot musik', cat: 'Markeringar' },
    { char: '■', label: 'Fylld kvadrat', cat: 'Markeringar' },
    { char: '□', label: 'Tom kvadrat', cat: 'Markeringar' },
    { char: '▲', label: 'Triangel upp', cat: 'Markeringar' },
    { char: '▼', label: 'Triangel ner', cat: 'Markeringar' },
    { char: '◆', label: 'Fylld romb', cat: 'Markeringar' },
    { char: '◇', label: 'Tom romb', cat: 'Markeringar' }
  ];

  const clipState = {
    initialized: false,
    activeSubTab: 'clipboard', // 'clipboard' | 'emoji' | 'gif' | 'kaomoji' | 'symbols'
    searchQuery: '',
    subCategory: 'Alla',
    items: [],
    openMenuId: null,
    copyStatusText: '',
    copyStatusTimer: null,
    docListenerBound: false
  };

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatTimestamp(ts) {
    if (!ts) return '';
    try {
      const d = new Date(ts);
      if (isNaN(d.getTime())) return '';
      const pad = n => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch (e) {
      return '';
    }
  }

  function normalizeItems(rawList) {
    if (!Array.isArray(rawList)) return [];
    const seenIds = new Set();
    const cleaned = [];
    for (const raw of rawList) {
      if (!raw || typeof raw !== 'object') continue;
      const text = String(raw.text ?? '');
      if (!text.trim()) continue;
      let id = String(raw.id || `clip_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`)
        .replace(/[^a-zA-Z0-9_-]/g, '_');
      if (!id) id = `clip_${Date.now()}`;
      while (seenIds.has(id)) {
        id = `${id}_${Math.random().toString(36).slice(2, 4)}`;
      }
      seenIds.add(id);
      cleaned.push({
        id,
        text,
        pinned: Boolean(raw.pinned),
        createdAt: Number(raw.createdAt) || Date.now()
      });
    }
    return enforceMaxUnpinned(cleaned);
  }

  function enforceMaxUnpinned(items) {
    const pinned = items.filter(it => it.pinned);
    const unpinned = items
      .filter(it => !it.pinned)
      .slice(0, MAX_UNPINNED);
    return [...pinned, ...unpinned];
  }

  function loadStoredItems() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return normalizeItems(parsed);
    } catch (e) {
      return [];
    }
  }

  function persistItems(items, syncMainState = true) {
    const normalized = normalizeItems(items);
    clipState.initialized = true;
    clipState.items = normalized;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    } catch (e) {}
    if (syncMainState && typeof window.syncClipboardToMainState === 'function') {
      try {
        window.syncClipboardToMainState(normalized);
      } catch (e) {}
    }
    return normalized;
  }

  function showCopiedFeedback(label, triggerEl = null) {
    const text = label || 'Kopierat!';
    clipState.copyStatusText = text;
    if (clipState.copyStatusTimer) clearTimeout(clipState.copyStatusTimer);

    const pill = document.getElementById('clipboard-copied-pill');
    if (pill) {
      pill.textContent = text;
      pill.classList.remove('hidden');
    }

    if (triggerEl && triggerEl.classList) {
      triggerEl.classList.add('ring-2', 'ring-emerald-500', 'bg-emerald-500/15');
      setTimeout(() => {
        triggerEl.classList.remove('ring-2', 'ring-emerald-500', 'bg-emerald-500/15');
      }, 650);
    }

    if (typeof window.showToast === 'function') {
      window.showToast(text);
    }

    clipState.copyStatusTimer = setTimeout(() => {
      clipState.copyStatusText = '';
      const p = document.getElementById('clipboard-copied-pill');
      if (p) p.classList.add('hidden');
    }, 1800);
  }

  async function copyText(text, triggerEl = null, customMessage = 'Kopierat!') {
    const val = String(text ?? '');
    if (!val) return false;
    let copied = false;

    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      try {
        await navigator.clipboard.writeText(val);
        copied = true;
      } catch (e) {
        copied = false;
      }
    }

    if (!copied && typeof document !== 'undefined' && document.createElement) {
      try {
        const ta = document.createElement('textarea');
        ta.value = val;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.top = '-9999px';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        copied = document.execCommand('copy');
        document.body.removeChild(ta);
      } catch (e) {
        copied = false;
      }
    }

    showCopiedFeedback(copied ? customMessage : 'Kopierat!', triggerEl);
    return copied;
  }

  function addItem(rawText) {
    const text = String(rawText ?? '');
    if (!text.trim()) {
      if (typeof window.showToast === 'function') {
        window.showToast('Skriv eller klistra in en text först.');
      }
      return null;
    }

    const current = [...clipState.items];
    const existingIdx = current.findIndex(it => it.text === text);

    let item;
    if (existingIdx !== -1) {
      const existing = current.splice(existingIdx, 1)[0];
      item = { ...existing, createdAt: Date.now() };
    } else {
      item = {
        id: `clip_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        text,
        pinned: false,
        createdAt: Date.now()
      };
    }

    const pinned = current.filter(it => it.pinned);
    const unpinned = current.filter(it => !it.pinned);

    const next = item.pinned
      ? [item, ...pinned, ...unpinned]
      : [...pinned, item, ...unpinned];

    persistItems(next, true);
    render();
    showCopiedFeedback('Sparat i urklipp!');
    return item;
  }

  function addFromInput() {
    const input = document.getElementById('clipboard-quick-input');
    if (!input) return;
    const val = input.value;
    if (!val.trim()) {
      if (typeof window.showToast === 'function') {
        window.showToast('Skriv eller klistra in text i fältet först.');
      }
      input.focus();
      return;
    }
    addItem(val);
    input.value = '';
    input.focus();
  }

  async function pasteFromSystemClipboard() {
    if (navigator.clipboard && typeof navigator.clipboard.readText === 'function') {
      try {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          addItem(text);
          return;
        }
        if (typeof window.showToast === 'function') {
          window.showToast('Ditt urklipp innehåller ingen text.');
        }
        return;
      } catch (e) {}
    }

    const input = document.getElementById('clipboard-quick-input');
    if (input) input.focus();
    if (typeof window.showToast === 'function') {
      window.showToast('Webbläsaren blockerade direktläsning – tryck Ctrl+V i fältet nedan.');
    }
  }

  function togglePin(id) {
    const next = clipState.items.map(it =>
      it.id === id ? { ...it, pinned: !it.pinned } : it
    );
    clipState.openMenuId = null;
    persistItems(next, true);
    render();
  }

  function deleteItem(id) {
    const next = clipState.items.filter(it => it.id !== id);
    clipState.openMenuId = null;
    persistItems(next, true);
    render();
    if (typeof window.showToast === 'function') {
      window.showToast('Objekt borttaget.');
    }
  }

  function clearUnpinned() {
    const unpinnedCount = clipState.items.filter(it => !it.pinned).length;
    if (!unpinnedCount) return;
    const next = clipState.items.filter(it => it.pinned);
    clipState.openMenuId = null;
    persistItems(next, true);
    render();
    if (typeof window.showToast === 'function') {
      window.showToast('Alla ofästa urklipp har rensats.');
    }
  }

  function toggleMenu(id, event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    clipState.openMenuId = clipState.openMenuId === id ? null : id;
    render();
  }

  function copyItemById(id, triggerEl) {
    const found = clipState.items.find(it => it.id === id);
    if (!found) return;
    copyText(found.text, triggerEl, 'Kopierat!');
  }

  function copyStatic(kind, index, triggerEl) {
    const idx = Number(index);
    let val = '';
    if (kind === 'emoji' && EMOJI_ITEMS[idx]) val = EMOJI_ITEMS[idx].char;
    else if (kind === 'gif' && GIF_ITEMS[idx]) val = GIF_ITEMS[idx].copyValue;
    else if (kind === 'kaomoji' && KAOMOJI_ITEMS[idx]) val = KAOMOJI_ITEMS[idx].text;
    else if (kind === 'symbols' && SYMBOL_ITEMS[idx]) val = SYMBOL_ITEMS[idx].char;
    if (val) {
      copyText(val, triggerEl, `Kopierat: ${val}`);
    }
  }

  function saveStaticToClipboard(kind, index, event) {
    if (event) event.stopPropagation();
    const idx = Number(index);
    let val = '';
    if (kind === 'gif' && GIF_ITEMS[idx]) val = GIF_ITEMS[idx].copyValue;
    else if (kind === 'kaomoji' && KAOMOJI_ITEMS[idx]) val = KAOMOJI_ITEMS[idx].text;
    if (val) {
      addItem(val);
    }
  }

  function setSubTab(tab) {
    clipState.activeSubTab = tab;
    clipState.searchQuery = '';
    clipState.subCategory = 'Alla';
    clipState.openMenuId = null;
    render();
  }

  function setSearch(val) {
    clipState.searchQuery = String(val ?? '');
    renderContentOnly();
  }

  function setSubCategory(cat) {
    clipState.subCategory = cat || 'Alla';
    render();
  }

  function getItems() {
    if (!clipState.initialized) {
      clipState.items = loadStoredItems();
      clipState.initialized = true;
    }
    return clipState.items.map(it => ({ ...it }));
  }

  function setItems(items, syncMainState = true) {
    persistItems(items, syncMainState);
    render();
  }

  // ==================== RENDERING ====================
  function renderTopBar() {
    const tabs = [
      { id: 'emoji', title: 'Emojis', iconHtml: '<i class="fa-regular fa-face-smile text-base"></i>' },
      { id: 'gif', title: 'GIF', iconHtml: '<span class="px-1.5 py-0.5 rounded border border-current text-[10px] font-black tracking-tight leading-none">GIF</span>' },
      { id: 'kaomoji', title: 'Kaomoji', iconHtml: '<span class="text-xs font-extrabold tracking-tight leading-none"> ;-) </span>' },
      { id: 'symbols', title: 'Specialtecken', iconHtml: '<span class="text-sm font-extrabold leading-none">Ω</span>' },
      { id: 'clipboard', title: 'Urklipp', iconHtml: '<i class="fa-solid fa-clipboard-list text-base"></i>' }
    ];

    return `
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700/90 pb-3.5">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-2xl bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center justify-center shrink-0">
            <i class="fa-solid fa-clipboard-list"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">Emoji och mer</h2>
              <span id="clipboard-copied-pill" class="${clipState.copyStatusText ? '' : 'hidden'} px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/35 transition">
                ${escapeHtml(clipState.copyStatusText)}
              </span>
            </div>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">Urklippshistorik, emojis, GIF-reaktioner, kaomoji &amp; specialtecken – sparas lokalt i webbläsaren.</p>
          </div>
        </div>

        <div class="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900/90 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700/80" role="tablist" aria-label="Urklippskategorier">
          ${tabs.map(t => {
            const active = clipState.activeSubTab === t.id;
            const btnCls = active
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-500 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800/60';
            return `
              <button
                type="button"
                role="tab"
                aria-selected="${active ? 'true' : 'false'}"
                title="${escapeHtml(t.title)}"
                onclick="window.portalClipboard.setSubTab('${t.id}')"
                class="relative w-12 h-10 rounded-xl border flex flex-col items-center justify-center transition ${btnCls}"
              >
                ${t.iconHtml}
                ${active ? '<span class="absolute bottom-1 w-5 h-0.5 rounded-full bg-sky-400"></span>' : ''}
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  function renderClipboardCard(item) {
    const isOpenMenu = clipState.openMenuId === item.id;
    const cardCls = item.pinned
      ? 'bg-amber-500/5 dark:bg-slate-900/90 border-amber-500/35 hover:border-amber-400'
      : 'bg-slate-50 dark:bg-slate-900/70 border-slate-200 dark:border-slate-700/80 hover:border-sky-500/50';
    const pinBtnCls = item.pinned
      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500 hover:text-white'
      : 'bg-slate-200/70 dark:bg-slate-800 text-slate-400 border-slate-300 dark:border-slate-700 hover:text-amber-400 hover:border-amber-500/40';
    const timeStr = formatTimestamp(item.createdAt);

    return `
      <div
        onclick="window.portalClipboard.copyItemById('${item.id}', this)"
        class="group relative p-3.5 rounded-2xl border cursor-pointer transition flex items-start justify-between gap-3 ${cardCls}"
        title="Klicka för att kopiera till urklipp"
      >
        <div class="min-w-0 flex-1 space-y-1">
          <div class="text-xs sm:text-sm text-slate-800 dark:text-slate-100 whitespace-pre-wrap break-words leading-relaxed line-clamp-4">${escapeHtml(item.text)}</div>
          <div class="flex items-center gap-2 text-[10px] font-semibold text-slate-400">
            ${item.pinned ? '<span class="text-amber-400 font-bold"><i class="fa-solid fa-thumbtack mr-1"></i>Fäst</span>' : ''}
            ${timeStr ? `<span>${escapeHtml(timeStr)}</span>` : ''}
            <span class="opacity-0 group-hover:opacity-100 text-sky-400 transition">• Klicka för att kopiera</span>
          </div>
        </div>

        <div class="flex items-center gap-1.5 shrink-0" onclick="event.stopPropagation()">
          <button
            type="button"
            onclick="window.portalClipboard.togglePin('${item.id}')"
            class="w-8 h-8 rounded-xl border flex items-center justify-center text-xs transition ${pinBtnCls}"
            title="${item.pinned ? 'Lossa objekt' : 'Fäst överst'}"
          >
            <i class="fa-solid fa-thumbtack"></i>
          </button>

          <div class="relative">
            <button
              type="button"
              onclick="window.portalClipboard.toggleMenu('${item.id}', event)"
              class="w-8 h-8 rounded-xl bg-slate-200/70 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center justify-center text-xs transition"
              title="Fler alternativ"
            >
              <i class="fa-solid fa-ellipsis"></i>
            </button>

            ${isOpenMenu ? `
              <div class="absolute right-0 mt-1.5 w-40 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 shadow-xl z-20 py-1 text-xs font-bold">
                <button
                  type="button"
                  onclick="window.portalClipboard.copyItemById('${item.id}', null); window.portalClipboard.toggleMenu('${item.id}', event);"
                  class="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  <i class="fa-regular fa-copy text-sky-400"></i>
                  <span>Kopiera</span>
                </button>
                <button
                  type="button"
                  onclick="window.portalClipboard.togglePin('${item.id}')"
                  class="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  <i class="fa-solid fa-thumbtack text-amber-400"></i>
                  <span>${item.pinned ? 'Lossa' : 'Fäst överst'}</span>
                </button>
                <button
                  type="button"
                  onclick="window.portalClipboard.deleteItem('${item.id}')"
                  class="w-full px-3 py-2 text-left text-rose-500 hover:bg-rose-500/10 flex items-center gap-2"
                >
                  <i class="fa-solid fa-trash-can"></i>
                  <span>Ta bort</span>
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  function renderClipboardSubTab() {
    const allItems = clipState.items;
    const pinnedAll = allItems.filter(it => it.pinned);
    const unpinnedAll = allItems.filter(it => !it.pinned);

    const q = clipState.searchQuery.trim().toLowerCase();
    const pinned = q ? pinnedAll.filter(it => it.text.toLowerCase().includes(q)) : pinnedAll;
    const unpinned = q ? unpinnedAll.filter(it => it.text.toLowerCase().includes(q)) : unpinnedAll;

    return `
      <div class="space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2.5">
            <h3 class="text-base font-extrabold text-slate-900 dark:text-white">Urklipp</h3>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              ${pinnedAll.length} fästa • ${unpinnedAll.length}/${MAX_UNPINNED} ofästa
            </span>
          </div>
          <button
            type="button"
            onclick="window.portalClipboard.clearUnpinned()"
            ${unpinnedAll.length === 0 ? 'disabled' : ''}
            class="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/25 hover:bg-rose-600 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed text-xs font-extrabold flex items-center gap-1.5 transition"
            title="Rensa alla ofästa urklipp (fästa objekt behålls)"
          >
            <i class="fa-solid fa-trash-can"></i>
            <span>Rensa alla</span>
          </button>
        </div>

        <!-- Snabb inmatning -->
        <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/75 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
          <div class="flex flex-col sm:flex-row gap-2.5">
            <textarea
              id="clipboard-quick-input"
              rows="2"
              placeholder="Skriv eller klistra in text / fras / mall (tryck Enter för att spara, Shift+Enter för ny rad)..."
              onkeydown="if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); window.portalClipboard.addFromInput(); }"
              class="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 resize-y"
            ></textarea>
            <div class="flex sm:flex-col gap-2 shrink-0">
              <button
                type="button"
                onclick="window.portalClipboard.addFromInput()"
                class="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow transition"
              >
                <i class="fa-solid fa-plus"></i>
                <span>Spara</span>
              </button>
              <button
                type="button"
                onclick="window.portalClipboard.pasteFromSystemClipboard()"
                class="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/30 hover:bg-sky-500 hover:text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition"
                title="Hämta text direkt från datorns urklipp"
              >
                <i class="fa-solid fa-paste"></i>
                <span>Klistra in</span>
              </button>
            </div>
          </div>

          ${allItems.length > 0 ? `
            <div class="relative">
              <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              <input
                type="text"
                value="${escapeHtml(clipState.searchQuery)}"
                oninput="window.portalClipboard.setSearch(this.value)"
                placeholder="Sök bland sparade urklipp..."
                class="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          ` : ''}
        </div>

        <div id="clipboard-dynamic-content" class="space-y-4">
          ${renderClipboardLists(pinned, unpinned, allItems.length)}
        </div>
      </div>
    `;
  }

  function renderClipboardLists(pinned, unpinned, totalCount) {
    if (totalCount === 0) {
      return `
        <div class="py-14 px-4 text-center rounded-2xl bg-slate-50/70 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-700 space-y-1.5">
          <div class="text-sm font-extrabold text-slate-800 dark:text-white">Ingenting här</div>
          <p class="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Din urklippshistorik visas här när du har sparat eller klistrat in något.
          </p>
        </div>
      `;
    }

    if (!pinned.length && !unpinned.length) {
      return `
        <div class="py-10 text-center text-xs font-semibold text-slate-400">
          Inga urklipp matchade din sökning.
        </div>
      `;
    }

    let html = '';
    if (pinned.length) {
      html += `
        <div class="space-y-2">
          <div class="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <i class="fa-solid fa-thumbtack"></i>
            <span>Fästa objekt (${pinned.length})</span>
          </div>
          <div class="space-y-2">
            ${pinned.map(renderClipboardCard).join('')}
          </div>
        </div>
      `;
    }

    if (unpinned.length) {
      html += `
        <div class="space-y-2">
          <div class="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            Senaste (max ${MAX_UNPINNED} ofästa)
          </div>
          <div class="space-y-2">
            ${unpinned.map(renderClipboardCard).join('')}
          </div>
        </div>
      `;
    }

    return html;
  }

  function renderCategoryPills(categories) {
    return `
      <div class="flex flex-wrap gap-1.5">
        ${categories.map(cat => {
          const active = clipState.subCategory === cat;
          const cls = active
            ? 'bg-brand-600 text-white border-brand-500 shadow-sm'
            : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400';
          return `
            <button
              type="button"
              onclick="window.portalClipboard.setSubCategory('${escapeHtml(cat)}')"
              class="px-3 py-1 rounded-full border text-[11px] font-bold transition ${cls}"
            >
              ${escapeHtml(cat)}
            </button>
          `;
        }).join('')}
      </div>
    `;
  }

  function renderSearchBar(placeholder) {
    return `
      <div class="relative">
        <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
        <input
          type="text"
          value="${escapeHtml(clipState.searchQuery)}"
          oninput="window.portalClipboard.setSearch(this.value)"
          placeholder="${escapeHtml(placeholder)}"
          class="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>
    `;
  }

  function renderEmojiSubTab() {
    const categories = ['Alla', 'Smileys', 'Gester', 'Arbete', 'Status', 'Firande'];
    return `
      <div class="space-y-3.5">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h3 class="text-base font-extrabold text-slate-900 dark:text-white">Emojis</h3>
          <span class="text-[11px] text-slate-400 font-semibold">Klicka på en emoji för att kopiera direkt</span>
        </div>
        ${renderSearchBar('Sök emoji (t.ex. glad, tumme, klar, kaffe, paket)...')}
        ${renderCategoryPills(categories)}
        <div id="clipboard-dynamic-content">
          ${renderEmojiGrid()}
        </div>
      </div>
    `;
  }

  function renderEmojiGrid() {
    const q = clipState.searchQuery.trim().toLowerCase();
    const cat = clipState.subCategory;
    const filtered = EMOJI_ITEMS
      .map((item, idx) => ({ ...item, idx }))
      .filter(it => (cat === 'Alla' || it.cat === cat) && (!q || it.label.toLowerCase().includes(q) || it.char.includes(q)));

    if (!filtered.length) {
      return '<div class="py-10 text-center text-xs text-slate-400">Inga emojis matchade sökningen.</div>';
    }

    return `
      <div class="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-12 gap-2">
        ${filtered.map(it => `
          <button
            type="button"
            onclick="window.portalClipboard.copyStatic('emoji', ${it.idx}, this)"
            title="${escapeHtml(it.label)}"
            class="h-12 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 hover:border-sky-500 hover:scale-105 flex items-center justify-center text-2xl transition cursor-pointer"
          >
            ${it.char}
          </button>
        `).join('')}
      </div>
    `;
  }

  function renderGifSubTab() {
    return `
      <div class="space-y-3.5">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h3 class="text-base font-extrabold text-slate-900 dark:text-white">GIF-reaktioner</h3>
          <span class="text-[11px] text-slate-400 font-semibold">Lokala animerade reaktionskort – klicka för att kopiera</span>
        </div>
        ${renderSearchBar('Sök GIF-reaktion (t.ex. tack, klar, kaffe, fest)...')}
        <div id="clipboard-dynamic-content">
          ${renderGifGrid()}
        </div>
      </div>
    `;
  }

  function renderGifGrid() {
    const q = clipState.searchQuery.trim().toLowerCase();
    const filtered = GIF_ITEMS
      .map((item, idx) => ({ ...item, idx }))
      .filter(it => !q || it.title.toLowerCase().includes(q) || it.badge.toLowerCase().includes(q) || it.copyValue.toLowerCase().includes(q));

    if (!filtered.length) {
      return '<div class="py-10 text-center text-xs text-slate-400">Inga GIF-reaktioner matchade sökningen.</div>';
    }

    return `
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        ${filtered.map(it => `
          <div
            onclick="window.portalClipboard.copyStatic('gif', ${it.idx}, this)"
            class="cursor-pointer rounded-2xl border bg-gradient-to-br p-3.5 transition hover:scale-[1.02] flex flex-col justify-between gap-3 ${it.bg}"
            title="Klicka för att kopiera"
          >
            <div class="flex items-center justify-between">
              <span class="px-2 py-0.5 rounded-md bg-slate-950/50 text-[10px] font-black tracking-wider">${escapeHtml(it.badge)}</span>
              <button
                type="button"
                onclick="window.portalClipboard.saveStaticToClipboard('gif', ${it.idx}, event)"
                class="w-7 h-7 rounded-lg bg-slate-950/40 hover:bg-slate-950/80 text-white/80 hover:text-white flex items-center justify-center text-[11px] transition"
                title="Spara i Urklipp"
              >
                <i class="fa-solid fa-thumbtack"></i>
              </button>
            </div>
            <div class="py-3 flex items-center justify-center text-4xl">
              <span class="${it.anim}">${it.icon}</span>
            </div>
            <div>
              <div class="text-xs font-extrabold text-white">${escapeHtml(it.title)}</div>
              <div class="text-[11px] text-slate-300/90 truncate mt-0.5">${escapeHtml(it.copyValue)}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderKaomojiSubTab() {
    const categories = ['Alla', 'Glada', 'Axelryck', 'Kram', 'Förvånad', 'Uttryck', 'Djur'];
    return `
      <div class="space-y-3.5">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h3 class="text-base font-extrabold text-slate-900 dark:text-white">Kaomoji <span class="text-sky-400 font-mono text-sm ml-1">;-)</span></h3>
          <span class="text-[11px] text-slate-400 font-semibold">Klicka på en kaomoji för att kopiera direkt</span>
        </div>
        ${renderSearchBar('Sök kaomoji (t.ex. glad, kram, bord, katt, axelryck)...')}
        ${renderCategoryPills(categories)}
        <div id="clipboard-dynamic-content">
          ${renderKaomojiGrid()}
        </div>
      </div>
    `;
  }

  function renderKaomojiGrid() {
    const q = clipState.searchQuery.trim().toLowerCase();
    const cat = clipState.subCategory;
    const filtered = KAOMOJI_ITEMS
      .map((item, idx) => ({ ...item, idx }))
      .filter(it => (cat === 'Alla' || it.cat === cat) && (!q || it.label.toLowerCase().includes(q) || it.text.toLowerCase().includes(q)));

    if (!filtered.length) {
      return '<div class="py-10 text-center text-xs text-slate-400">Inga kaomojis matchade sökningen.</div>';
    }

    return `
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
        ${filtered.map(it => `
          <button
            type="button"
            onclick="window.portalClipboard.copyStatic('kaomoji', ${it.idx}, this)"
            title="${escapeHtml(it.label)}"
            class="px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 hover:border-sky-500 text-center transition cursor-pointer space-y-1"
          >
            <div class="text-sm font-bold text-slate-900 dark:text-white font-mono truncate">${escapeHtml(it.text)}</div>
            <div class="text-[10px] text-slate-400 truncate">${escapeHtml(it.label)}</div>
          </button>
        `).join('')}
      </div>
    `;
  }

  function renderSymbolsSubTab() {
    const categories = ['Alla', 'Valuta', 'Matematik', 'Pilar', 'Text', 'Markeringar'];
    return `
      <div class="space-y-3.5">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h3 class="text-base font-extrabold text-slate-900 dark:text-white">Specialtecken &amp; Symboler</h3>
          <span class="text-[11px] text-slate-400 font-semibold">Klicka på ett tecken för att kopiera direkt</span>
        </div>
        ${renderSearchBar('Sök symbol (t.ex. euro, pil, bock, grader, paragraf)...')}
        ${renderCategoryPills(categories)}
        <div id="clipboard-dynamic-content">
          ${renderSymbolsGrid()}
        </div>
      </div>
    `;
  }

  function renderSymbolsGrid() {
    const q = clipState.searchQuery.trim().toLowerCase();
    const cat = clipState.subCategory;
    const filtered = SYMBOL_ITEMS
      .map((item, idx) => ({ ...item, idx }))
      .filter(it => (cat === 'Alla' || it.cat === cat) && (!q || it.label.toLowerCase().includes(q) || it.char.includes(q)));

    if (!filtered.length) {
      return '<div class="py-10 text-center text-xs text-slate-400">Inga specialtecken matchade sökningen.</div>';
    }

    return `
      <div class="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
        ${filtered.map(it => `
          <button
            type="button"
            onclick="window.portalClipboard.copyStatic('symbols', ${it.idx}, this)"
            title="${escapeHtml(it.label)}"
            class="h-14 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 hover:border-sky-500 flex flex-col items-center justify-center transition cursor-pointer px-1"
          >
            <span class="text-lg font-bold text-slate-900 dark:text-white leading-tight">${escapeHtml(it.char)}</span>
            <span class="text-[9px] text-slate-400 truncate max-w-full">${escapeHtml(it.label)}</span>
          </button>
        `).join('')}
      </div>
    `;
  }

  function renderContentOnly() {
    const container = document.getElementById('clipboard-dynamic-content');
    if (!container) {
      render();
      return;
    }

    if (clipState.activeSubTab === 'clipboard') {
      const q = clipState.searchQuery.trim().toLowerCase();
      const pinnedAll = clipState.items.filter(it => it.pinned);
      const unpinnedAll = clipState.items.filter(it => !it.pinned);
      const pinned = q ? pinnedAll.filter(it => it.text.toLowerCase().includes(q)) : pinnedAll;
      const unpinned = q ? unpinnedAll.filter(it => it.text.toLowerCase().includes(q)) : unpinnedAll;
      container.innerHTML = renderClipboardLists(pinned, unpinned, clipState.items.length);
    } else if (clipState.activeSubTab === 'emoji') {
      container.innerHTML = renderEmojiGrid();
    } else if (clipState.activeSubTab === 'gif') {
      container.innerHTML = renderGifGrid();
    } else if (clipState.activeSubTab === 'kaomoji') {
      container.innerHTML = renderKaomojiGrid();
    } else if (clipState.activeSubTab === 'symbols') {
      container.innerHTML = renderSymbolsGrid();
    }
  }

  function render() {
    const root = document.getElementById('clipboard-app-root');
    if (!root) return;

    let bodyHtml = '';
    if (clipState.activeSubTab === 'clipboard') bodyHtml = renderClipboardSubTab();
    else if (clipState.activeSubTab === 'emoji') bodyHtml = renderEmojiSubTab();
    else if (clipState.activeSubTab === 'gif') bodyHtml = renderGifSubTab();
    else if (clipState.activeSubTab === 'kaomoji') bodyHtml = renderKaomojiSubTab();
    else if (clipState.activeSubTab === 'symbols') bodyHtml = renderSymbolsSubTab();

    root.innerHTML = `
      <div class="bg-white dark:bg-slate-800/95 p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-5">
        ${renderTopBar()}
        ${bodyHtml}
      </div>
    `;
  }

  function init() {
    if (!clipState.initialized) {
      clipState.items = loadStoredItems();
      clipState.initialized = true;
    }

    if (!clipState.docListenerBound && typeof document !== 'undefined' && document.addEventListener) {
      clipState.docListenerBound = true;
      document.addEventListener('click', () => {
        if (clipState.openMenuId !== null) {
          clipState.openMenuId = null;
          render();
        }
      });
    }

    render();
  }

  window.portalClipboard = {
    init,
    render,
    getItems,
    setItems,
    loadStoredItems,
    addItem,
    addFromInput,
    pasteFromSystemClipboard,
    togglePin,
    toggleMenu,
    deleteItem,
    clearUnpinned,
    copyText,
    copyItemById,
    copyStatic,
    saveStaticToClipboard,
    setSubTab,
    setSearch,
    setSubCategory
  };

  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('DOMContentLoaded', init);
  }
})();
