const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");

// ═══════════════════════════════════════════
// BRAND TOKENS
// ═══════════════════════════════════════════
const C = {
  dark: "0A0A0A",
  darkCard: "171717",
  darkMid: "1E1E1E",
  darkBorder: "2A2A2A",
  red: "EF4444",
  redDark: "DC2626",
  redLight: "FEE2E2",
  white: "FFFFFF",
  offWhite: "FAFAFA",
  gray100: "F5F5F5",
  gray200: "E5E5E5",
  gray300: "D4D4D4",
  gray400: "A3A3A3",
  gray500: "737373",
  gray600: "525252",
  gray700: "404040",
  gray800: "262626",
  green: "22C55E",
  blue: "3B82F6",
  purple: "8B5CF6",
};

const FONT = "Arial";
const FONT_BOLD = "Arial";

// ═══════════════════════════════════════════
// ICON HELPERS
// ═══════════════════════════════════════════
function renderIconSvg(IconComponent, color = "#FFFFFF", size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
}

async function iconToBase64Png(IconComponent, color, size = 256) {
  const svg = renderIconSvg(IconComponent, color, size);
  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + pngBuffer.toString("base64");
}

// Helper: fresh shadow each time (PptxGenJS mutates objects)
const makeShadow = (opts = {}) => ({
  type: "outer", blur: 8, offset: 3, angle: 135, color: "000000", opacity: 0.25, ...opts
});

const makeCardShadow = () => ({
  type: "outer", blur: 6, offset: 2, angle: 135, color: "000000", opacity: 0.12
});

// ═══════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════
async function createPresentation() {
  // Load icons
  const {
    FaPhone, FaChartLine, FaUsers, FaShieldAlt, FaRocket, FaCheckCircle,
    FaBrain, FaFileAlt, FaTrophy, FaCrown, FaBuilding, FaStar,
    FaLock, FaGlobe, FaQuoteLeft, FaArrowRight, FaHeadset, FaUserTie,
    FaClipboardList, FaComments
  } = require("react-icons/fa");

  const icons = {};
  const iconList = [
    ["phone", FaPhone, "#FFFFFF"],
    ["chart", FaChartLine, "#FFFFFF"],
    ["users", FaUsers, "#FFFFFF"],
    ["shield", FaShieldAlt, "#FFFFFF"],
    ["rocket", FaRocket, "#FFFFFF"],
    ["check", FaCheckCircle, "#22C55E"],
    ["checkWhite", FaCheckCircle, "#FFFFFF"],
    ["brain", FaBrain, "#FFFFFF"],
    ["file", FaFileAlt, "#FFFFFF"],
    ["trophy", FaTrophy, "#FFFFFF"],
    ["crown", FaCrown, "#FFFFFF"],
    ["building", FaBuilding, "#FFFFFF"],
    ["star", FaStar, "#EF4444"],
    ["lock", FaLock, "#FFFFFF"],
    ["globe", FaGlobe, "#FFFFFF"],
    ["quote", FaQuoteLeft, "#EF4444"],
    ["arrow", FaArrowRight, "#EF4444"],
    ["headset", FaHeadset, "#FFFFFF"],
    ["userTie", FaUserTie, "#FFFFFF"],
    ["clipboard", FaClipboardList, "#FFFFFF"],
    ["comments", FaComments, "#FFFFFF"],
    ["checkRed", FaCheckCircle, "#EF4444"],
    ["starGold", FaStar, "#F59E0B"],
  ];

  for (const [name, Component, color] of iconList) {
    icons[name] = await iconToBase64Png(Component, color);
  }

  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "SimCall";
  pres.title = "SimCall — AI Trénink pro Realitní Makléře";

  // ═══════════════════════════════════════════
  // SLIDE 1: TITLE
  // ═══════════════════════════════════════════
  let s1 = pres.addSlide();
  s1.background = { color: C.dark };

  // Subtle top accent line
  s1.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.04, fill: { color: C.red }
  });

  // SimCall logo text
  s1.addText([
    { text: "Sim", options: { color: C.white, bold: true } },
    { text: "Call", options: { color: C.red, bold: true } }
  ], { x: 0.8, y: 0.6, w: 3, h: 0.6, fontSize: 28, fontFace: FONT, margin: 0 });

  // Main title
  s1.addText("AI trénink telefonních\ndovedností pro\nrealitní makléře", {
    x: 0.8, y: 1.6, w: 6.5, h: 2.4,
    fontSize: 40, fontFace: FONT_BOLD, color: C.white, bold: true,
    lineSpacingMultiple: 1.1, margin: 0
  });

  // Subtitle
  s1.addText("Jediný simulátor v Česku, kde makléři trénují na AI klientech\na manažeři vidí výsledky v reálném čase.", {
    x: 0.8, y: 4.0, w: 6.5, h: 0.8,
    fontSize: 15, fontFace: FONT, color: C.gray400,
    lineSpacingMultiple: 1.4, margin: 0
  });

  // Bottom badge
  s1.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 4.9, w: 1.6, h: 0.35,
    fill: { color: C.darkCard }, line: { color: C.darkBorder, width: 0.5 }
  });
  s1.addText("simcall.cz", {
    x: 0.8, y: 4.9, w: 1.6, h: 0.35,
    fontSize: 11, fontFace: FONT, color: C.gray400, align: "center", valign: "middle", margin: 0
  });

  // ═══════════════════════════════════════════
  // SLIDE 2: PROBLEM
  // ═══════════════════════════════════════════
  let s2 = pres.addSlide();
  s2.background = { color: C.dark };
  s2.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.04, fill: { color: C.red } });

  s2.addText("PROBLÉM", {
    x: 0.8, y: 0.5, w: 3, h: 0.35,
    fontSize: 11, fontFace: FONT, color: C.red, bold: true, charSpacing: 4, margin: 0
  });

  s2.addText("Každý spálený lead\nvás stojí tisíce korun", {
    x: 0.8, y: 0.9, w: 8, h: 1.2,
    fontSize: 34, fontFace: FONT_BOLD, color: C.white, bold: true,
    lineSpacingMultiple: 1.15, margin: 0
  });

  // Problem cards
  const problems = [
    { title: "Nováčci paralyzovaní strachem", desc: "Sedí před telefonem, potí se a nevolají. Každý den bez akce je ztráta." },
    { title: "Manažeři ztrácí čas", desc: "Hodiny strávené poslechem katastrofálních hovorů a roleplay, které nikdo nebere vážně." },
    { title: "Drahé leady v koši", desc: "Platíte desítky tisíc za reklamu a nováček lead spálí za 30 sekund." },
  ];

  problems.forEach((p, i) => {
    const y = 2.4 + i * 1.05;
    s2.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y, w: 8.4, h: 0.85,
      fill: { color: C.darkCard }, line: { color: C.darkBorder, width: 0.5 }
    });
    s2.addShape(pres.shapes.RECTANGLE, {
      x: 0.8, y, w: 0.06, h: 0.85, fill: { color: C.red }
    });
    s2.addText(p.title, {
      x: 1.15, y: y + 0.1, w: 7.8, h: 0.3,
      fontSize: 15, fontFace: FONT_BOLD, color: C.white, bold: true, margin: 0
    });
    s2.addText(p.desc, {
      x: 1.15, y: y + 0.42, w: 7.8, h: 0.3,
      fontSize: 12, fontFace: FONT, color: C.gray400, margin: 0
    });
  });

  // ═══════════════════════════════════════════
  // SLIDE 3: SOLUTION
  // ═══════════════════════════════════════════
  let s3 = pres.addSlide();
  s3.background = { color: C.dark };
  s3.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.04, fill: { color: C.red } });

  s3.addText("ŘEŠENÍ", {
    x: 0.8, y: 0.5, w: 3, h: 0.35,
    fontSize: 11, fontFace: FONT, color: C.red, bold: true, charSpacing: 4, margin: 0
  });

  s3.addText("SimCall: Trénink na AI klientech,\nne na reálných leadech", {
    x: 0.8, y: 0.9, w: 8.4, h: 1.2,
    fontSize: 32, fontFace: FONT_BOLD, color: C.white, bold: true,
    lineSpacingMultiple: 1.15, margin: 0
  });

  s3.addText("Makléři volají AI agentům, kteří simulují reálné české klienty.\nKaždý agent má vlastní osobnost, námitky a scénář.\nPo hovoru přijde okamžitá AI analýza s konkrétními tipy.", {
    x: 0.8, y: 2.15, w: 8.4, h: 1.0,
    fontSize: 14, fontFace: FONT, color: C.gray300,
    lineSpacingMultiple: 1.6, margin: 0
  });

  // Key stats
  const stats = [
    { num: "500+", label: "Scénářů z praxe" },
    { num: "34%", label: "Nárůst úspěšnosti" },
    { num: "0", label: "Spálených leadů" },
    { num: "100%", label: "Jistota manažera" },
  ];

  stats.forEach((st, i) => {
    const x = 0.8 + i * 2.2;
    s3.addShape(pres.shapes.RECTANGLE, {
      x, y: 3.5, w: 2.0, h: 1.4,
      fill: { color: C.darkCard }, line: { color: C.darkBorder, width: 0.5 }
    });
    s3.addText(st.num, {
      x, y: 3.65, w: 2.0, h: 0.6,
      fontSize: 32, fontFace: FONT_BOLD, color: C.red, bold: true, align: "center", margin: 0
    });
    s3.addText(st.label, {
      x, y: 4.3, w: 2.0, h: 0.4,
      fontSize: 11, fontFace: FONT, color: C.gray400, align: "center", margin: 0
    });
  });

  // ═══════════════════════════════════════════
  // SLIDE 4: HOW IT WORKS
  // ═══════════════════════════════════════════
  let s4 = pres.addSlide();
  s4.background = { color: C.offWhite };

  s4.addText("JAK TO FUNGUJE", {
    x: 0.8, y: 0.5, w: 3, h: 0.35,
    fontSize: 11, fontFace: FONT, color: C.red, bold: true, charSpacing: 4, margin: 0
  });

  s4.addText("Od nováčka k profesionálovi\nve 3 krocích", {
    x: 0.8, y: 0.9, w: 8, h: 1.0,
    fontSize: 30, fontFace: FONT_BOLD, color: C.dark, bold: true,
    lineSpacingMultiple: 1.15, margin: 0
  });

  const steps = [
    { num: "01", icon: icons.clipboard, title: "Vyberte scénář", desc: "Zvolte AI agenta a typ hovoru — od studeného kontaktu po náročné námitky a vyjednávání." },
    { num: "02", icon: icons.headset, title: "Zavolejte AI agentovi", desc: "Hovor probíhá v reálném čase přímo v prohlížeči. Bez instalace, stačí mikrofon." },
    { num: "03", icon: icons.brain, title: "Získejte zpětnou vazbu", desc: "Okamžitá AI analýza se skóre, přepisem, výplňovými slovy a doporučeními." },
  ];

  steps.forEach((st, i) => {
    const x = 0.8 + i * 3.05;
    // Card
    s4.addShape(pres.shapes.RECTANGLE, {
      x, y: 2.2, w: 2.8, h: 2.8,
      fill: { color: C.white }, shadow: makeCardShadow()
    });
    // Number
    s4.addText(st.num, {
      x: x + 0.25, y: 2.4, w: 0.8, h: 0.5,
      fontSize: 28, fontFace: FONT_BOLD, color: C.red, bold: true, margin: 0
    });
    // Icon circle
    s4.addShape(pres.shapes.OVAL, {
      x: x + 0.25, y: 3.0, w: 0.5, h: 0.5, fill: { color: C.dark }
    });
    s4.addImage({ data: st.icon, x: x + 0.37, y: 3.12, w: 0.26, h: 0.26 });
    // Title
    s4.addText(st.title, {
      x: x + 0.25, y: 3.6, w: 2.3, h: 0.35,
      fontSize: 15, fontFace: FONT_BOLD, color: C.dark, bold: true, margin: 0
    });
    // Desc
    s4.addText(st.desc, {
      x: x + 0.25, y: 3.95, w: 2.3, h: 0.85,
      fontSize: 11, fontFace: FONT, color: C.gray500,
      lineSpacingMultiple: 1.4, margin: 0
    });
  });

  // ═══════════════════════════════════════════
  // SLIDE 5: FEATURES - SOLO
  // ═══════════════════════════════════════════
  let s5 = pres.addSlide();
  s5.background = { color: C.offWhite };

  s5.addText("FUNKCE PRO MAKLÉŘE", {
    x: 0.8, y: 0.5, w: 4, h: 0.35,
    fontSize: 11, fontFace: FONT, color: C.red, bold: true, charSpacing: 4, margin: 0
  });

  s5.addText("Vše pro individuální růst", {
    x: 0.8, y: 0.9, w: 8, h: 0.6,
    fontSize: 28, fontFace: FONT_BOLD, color: C.dark, bold: true, margin: 0
  });

  const soloFeatures = [
    { icon: icons.brain, title: "AI analýza hovoru", desc: "Automatické vyhodnocení se skóre, silnými stránkami a konkrétními tipy ke zlepšení." },
    { icon: icons.file, title: "Přepis a nahrávka", desc: "Kompletní přepis a detekce výplňových slov, které zabíjejí obchody." },
    { icon: icons.chart, title: "Sledování pokroku", desc: "Detailní statistiky zlepšení v čase. Vidíte přesně, kde rostete." },
    { icon: icons.comments, title: "Reálné české scénáře", desc: "AI agenti znají českou legislativu, katastrální postupy a rezervační proces." },
    { icon: icons.rocket, title: "Personalizovaná doporučení", desc: "AI vám řekne přesně, co říct jinak, abyste příště uzavřeli obchod." },
    { icon: icons.shield, title: "Export přepisů", desc: "Stáhněte si přepisy hovorů v PDF nebo CSV pro vlastní analýzu." },
  ];

  soloFeatures.forEach((f, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.8 + col * 4.4;
    const y = 1.7 + row * 1.2;
    // Card
    s5.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.1, h: 1.0,
      fill: { color: C.white }, shadow: makeCardShadow()
    });
    // Icon circle
    s5.addShape(pres.shapes.OVAL, {
      x: x + 0.2, y: y + 0.22, w: 0.5, h: 0.5, fill: { color: C.dark }
    });
    s5.addImage({ data: f.icon, x: x + 0.32, y: y + 0.34, w: 0.26, h: 0.26 });
    // Title
    s5.addText(f.title, {
      x: x + 0.9, y: y + 0.1, w: 3.0, h: 0.3,
      fontSize: 13, fontFace: FONT_BOLD, color: C.dark, bold: true, margin: 0
    });
    // Desc
    s5.addText(f.desc, {
      x: x + 0.9, y: y + 0.42, w: 3.0, h: 0.45,
      fontSize: 10, fontFace: FONT, color: C.gray500,
      lineSpacingMultiple: 1.3, margin: 0
    });
  });

  // ═══════════════════════════════════════════
  // SLIDE 6: FEATURES - TEAM
  // ═══════════════════════════════════════════
  let s6 = pres.addSlide();
  s6.background = { color: C.dark };
  s6.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.04, fill: { color: C.red } });

  s6.addText("FUNKCE PRO MANAŽERY", {
    x: 0.8, y: 0.5, w: 5, h: 0.35,
    fontSize: 11, fontFace: FONT, color: C.red, bold: true, charSpacing: 4, margin: 0
  });

  s6.addText("Kontrola nad celým týmem\nz jednoho místa", {
    x: 0.8, y: 0.9, w: 8, h: 1.0,
    fontSize: 28, fontFace: FONT_BOLD, color: C.white, bold: true,
    lineSpacingMultiple: 1.15, margin: 0
  });

  const teamFeatures = [
    { icon: icons.users, title: "Manager dashboard", desc: "Přehled výkonu celého týmu na jednom místě. Analytika každého makléře." },
    { icon: icons.trophy, title: "Žebříčky a gamifikace", desc: "Kompetitivní žebříčky, které probudí prodejní instinkt celého oddělení." },
    { icon: icons.userTie, title: "Správa týmu", desc: "Vytvářejte a spravujte účty členů přímo z dashboardu. Neomezený počet profilů." },
    { icon: icons.chart, title: "Analytika zaměstnanců", desc: "Sledujte pokrok, úspěšnost a aktivitu každého člena v reálném čase." },
  ];

  teamFeatures.forEach((f, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.8 + col * 4.4;
    const y = 2.2 + row * 1.5;
    // Card
    s6.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.1, h: 1.2,
      fill: { color: C.darkCard }, line: { color: C.darkBorder, width: 0.5 }
    });
    // Icon circle
    s6.addShape(pres.shapes.OVAL, {
      x: x + 0.25, y: y + 0.3, w: 0.55, h: 0.55, fill: { color: C.red }
    });
    s6.addImage({ data: f.icon, x: x + 0.39, y: y + 0.44, w: 0.28, h: 0.28 });
    // Title
    s6.addText(f.title, {
      x: x + 1.0, y: y + 0.2, w: 2.9, h: 0.3,
      fontSize: 14, fontFace: FONT_BOLD, color: C.white, bold: true, margin: 0
    });
    // Desc
    s6.addText(f.desc, {
      x: x + 1.0, y: y + 0.55, w: 2.9, h: 0.5,
      fontSize: 11, fontFace: FONT, color: C.gray400,
      lineSpacingMultiple: 1.4, margin: 0
    });
  });

  // ═══════════════════════════════════════════
  // SLIDE 7: SCENARIOS
  // ═══════════════════════════════════════════
  let s7 = pres.addSlide();
  s7.background = { color: C.offWhite };

  s7.addText("SCÉNÁŘE Z PRAXE", {
    x: 0.8, y: 0.5, w: 4, h: 0.35,
    fontSize: 11, fontFace: FONT, color: C.red, bold: true, charSpacing: 4, margin: 0
  });

  s7.addText("Arogantní investoři, skeptičtí\nslevovači i zmatení dědicové", {
    x: 0.8, y: 0.9, w: 8, h: 1.0,
    fontSize: 28, fontFace: FONT_BOLD, color: C.dark, bold: true,
    lineSpacingMultiple: 1.15, margin: 0
  });

  const scenarios = [
    { title: "Cold call z katastru", diff: "Těžká", desc: "Majitel je agresivní a podezřívavý. Makléř musí prorazit bariéru k hodnotě." },
    { title: "Bleskový web lead", diff: "Střední", desc: "Tlak na rychlé uzavření u teplého leadu. Nesmíte usnout na vavřínech." },
    { title: "Urgentní prodej a rozvod", diff: "Střední", desc: "Extrémní trénink empatie. Klienti na sebe křičí a vy musíte ustát mediaci." },
    { title: "Obhajoba exkluzivity", diff: "Pokročilá", desc: "Klíčový moment byznysu. Obhájit provizi a exkluzivitu bez ustupování." },
    { title: "Věcné břemeno dožití", diff: "Pokročilá", desc: "Vysvětlit vliv na cenu a navrhnout řešení. Znalost legislativy." },
    { title: "Samoprodejce FSBO", diff: "Těžká", desc: "Majitel prodává sám. Překonat odmítání a prokázat hodnotu makléře." },
  ];

  scenarios.forEach((sc, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.8 + col * 4.4;
    const y = 2.15 + row * 1.1;

    s7.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.1, h: 0.9,
      fill: { color: C.white }, shadow: makeCardShadow()
    });

    // Difficulty badge
    const diffColor = sc.diff === "Těžká" ? C.red : sc.diff === "Střední" ? "F59E0B" : C.blue;
    s7.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.15, y: y + 0.12, w: 0.8, h: 0.22,
      fill: { color: diffColor }
    });
    s7.addText(sc.diff, {
      x: x + 0.15, y: y + 0.12, w: 0.8, h: 0.22,
      fontSize: 8, fontFace: FONT, color: C.white, bold: true, align: "center", valign: "middle", margin: 0
    });

    s7.addText(sc.title, {
      x: x + 1.1, y: y + 0.08, w: 2.8, h: 0.3,
      fontSize: 13, fontFace: FONT_BOLD, color: C.dark, bold: true, margin: 0
    });
    s7.addText(sc.desc, {
      x: x + 0.15, y: y + 0.42, w: 3.8, h: 0.4,
      fontSize: 10, fontFace: FONT, color: C.gray500,
      lineSpacingMultiple: 1.3, margin: 0
    });
  });

  // ═══════════════════════════════════════════
  // SLIDE 8: FOR ADVANCED
  // ═══════════════════════════════════════════
  let s8 = pres.addSlide();
  s8.background = { color: C.dark };
  s8.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.04, fill: { color: C.red } });

  s8.addText("I PRO POKROČILÉ", {
    x: 0.8, y: 0.5, w: 4, h: 0.35,
    fontSize: 11, fontFace: FONT, color: C.red, bold: true, charSpacing: 4, margin: 0
  });

  s8.addText("Není to jen pro nováčky.\nZdokonalte se i vy.", {
    x: 0.8, y: 0.9, w: 8, h: 1.0,
    fontSize: 30, fontFace: FONT_BOLD, color: C.white, bold: true,
    lineSpacingMultiple: 1.15, margin: 0
  });

  s8.addText("Naši pokročilí AI agenti mají hlubokou znalost českého práva,\nsmluvních procesů a neobvyklých situací.", {
    x: 0.8, y: 2.0, w: 8.4, h: 0.6,
    fontSize: 14, fontFace: FONT, color: C.gray300,
    lineSpacingMultiple: 1.5, margin: 0
  });

  const advTopics = [
    "Developerské projekty a prodej celých bytových domů",
    "Vyplacení exekuce klienta a komplikované zástavy",
    "Stavba bez stavebního povolení a jak to řešit s kupcem",
    "Nájemník odmítá odejít a prodej obsazené nemovitosti",
    "Dědické spory a prodej s více vlastníky",
    "Věcná břemena, předkupní práva, zápisy v katastru",
  ];

  advTopics.forEach((topic, i) => {
    const y = 2.8 + i * 0.42;
    s8.addImage({ data: icons.checkRed, x: 0.8, y: y + 0.04, w: 0.22, h: 0.22 });
    s8.addText(topic, {
      x: 1.15, y, w: 8, h: 0.35,
      fontSize: 13, fontFace: FONT, color: C.gray300, margin: 0
    });
  });

  // ═══════════════════════════════════════════
  // SLIDE 9: TESTIMONIAL
  // ═══════════════════════════════════════════
  let s9 = pres.addSlide();
  s9.background = { color: C.dark };
  s9.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.04, fill: { color: C.red } });

  // Quote icon
  s9.addImage({ data: icons.quote, x: 0.8, y: 1.0, w: 0.6, h: 0.6 });

  s9.addText("I když prodávám 10 let, našel jsem\nv SimCallu případy, které jsem nikdy\nneřešil. Teď vím přesně, co říct klientovi.", {
    x: 0.8, y: 1.8, w: 8.4, h: 1.8,
    fontSize: 24, fontFace: FONT, color: C.white, italic: true,
    lineSpacingMultiple: 1.35, margin: 0
  });

  s9.addText("Pokročilý makléř  |  10+ let v oboru", {
    x: 0.8, y: 3.8, w: 8, h: 0.4,
    fontSize: 13, fontFace: FONT, color: C.gray400, margin: 0
  });

  // Stat callout
  s9.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 4.4, w: 3.5, h: 0.8,
    fill: { color: C.darkCard }, line: { color: C.darkBorder, width: 0.5 }
  });
  s9.addText([
    { text: "+34% ", options: { fontSize: 28, bold: true, color: C.red } },
    { text: "nárůst úspěšnosti hovorů za 3 měsíce", options: { fontSize: 12, color: C.gray400 } }
  ], {
    x: 1.0, y: 4.4, w: 3.3, h: 0.8,
    fontFace: FONT, valign: "middle", margin: 0
  });

  // ═══════════════════════════════════════════
  // SLIDE 10: SECURITY
  // ═══════════════════════════════════════════
  let s10 = pres.addSlide();
  s10.background = { color: C.offWhite };

  s10.addText("BEZPEČNOST A SOUKROMÍ", {
    x: 0.8, y: 0.5, w: 5, h: 0.35,
    fontSize: 11, fontFace: FONT, color: C.red, bold: true, charSpacing: 4, margin: 0
  });

  s10.addText("Vaše data pod kontrolou", {
    x: 0.8, y: 0.9, w: 8, h: 0.6,
    fontSize: 28, fontFace: FONT_BOLD, color: C.dark, bold: true, margin: 0
  });

  const secItems = [
    { icon: icons.lock, title: "Šifrování dat", desc: "Veškerá data šifrována při přenosu i v úložišti. Servery v EU." },
    { icon: icons.shield, title: "GDPR compliance", desc: "Plně v souladu s GDPR. Právo na export a smazání dat kdykoliv." },
    { icon: icons.globe, title: "Soukromí nahrávek", desc: "K nahrávkám má přístup pouze uživatel. Manažer vidí jen souhrnné statistiky." },
    { icon: icons.brain, title: "Bez trénování AI", desc: "Vaše nahrávky nikdy nepoužíváme k trénování AI modelů bez souhlasu." },
  ];

  secItems.forEach((item, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.8 + col * 4.4;
    const y = 1.7 + row * 1.7;

    s10.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.1, h: 1.4,
      fill: { color: C.white }, shadow: makeCardShadow()
    });
    s10.addShape(pres.shapes.OVAL, {
      x: x + 0.25, y: y + 0.25, w: 0.55, h: 0.55, fill: { color: C.dark }
    });
    s10.addImage({ data: item.icon, x: x + 0.38, y: y + 0.38, w: 0.28, h: 0.28 });
    s10.addText(item.title, {
      x: x + 1.0, y: y + 0.2, w: 2.9, h: 0.3,
      fontSize: 14, fontFace: FONT_BOLD, color: C.dark, bold: true, margin: 0
    });
    s10.addText(item.desc, {
      x: x + 1.0, y: y + 0.55, w: 2.9, h: 0.65,
      fontSize: 11, fontFace: FONT, color: C.gray500,
      lineSpacingMultiple: 1.4, margin: 0
    });
  });

  // ═══════════════════════════════════════════
  // SLIDE 11: PRICING - SOLO
  // ═══════════════════════════════════════════
  let s11 = pres.addSlide();
  s11.background = { color: C.offWhite };

  s11.addText("CENÍK", {
    x: 0.8, y: 0.4, w: 3, h: 0.35,
    fontSize: 11, fontFace: FONT, color: C.red, bold: true, charSpacing: 4, margin: 0
  });

  s11.addText("Solo — Pro jednotlivé makléře", {
    x: 0.8, y: 0.8, w: 8, h: 0.55,
    fontSize: 24, fontFace: FONT_BOLD, color: C.dark, bold: true, margin: 0
  });

  s11.addText("Pro makléře, kteří chtějí zlepšit své telefonní dovednosti a zvýšit úspěšnost hovorů.", {
    x: 0.8, y: 1.35, w: 8.4, h: 0.35,
    fontSize: 12, fontFace: FONT, color: C.gray500, margin: 0
  });

  // Pricing table header
  const tableY = 1.9;
  s11.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: tableY, w: 8.4, h: 0.45, fill: { color: C.dark }
  });
  s11.addText("Balíček", {
    x: 0.8, y: tableY, w: 2.8, h: 0.45,
    fontSize: 11, fontFace: FONT_BOLD, color: C.white, bold: true, align: "center", valign: "middle", margin: 0
  });
  s11.addText("Hovory / měsíc", {
    x: 3.6, y: tableY, w: 2.0, h: 0.45,
    fontSize: 11, fontFace: FONT_BOLD, color: C.white, bold: true, align: "center", valign: "middle", margin: 0
  });
  s11.addText("AI agenti", {
    x: 5.6, y: tableY, w: 1.5, h: 0.45,
    fontSize: 11, fontFace: FONT_BOLD, color: C.white, bold: true, align: "center", valign: "middle", margin: 0
  });
  s11.addText("Cena / měsíc", {
    x: 7.1, y: tableY, w: 2.1, h: 0.45,
    fontSize: 11, fontFace: FONT_BOLD, color: C.white, bold: true, align: "center", valign: "middle", margin: 0
  });

  const soloTiers = [
    { name: "Start", calls: "50", agents: "5", price: "490 Kč" },
    { name: "Basic", calls: "100", agents: "10", price: "990 Kč" },
    { name: "Standard", calls: "250", agents: "25", price: "1 990 Kč" },
    { name: "Pro", calls: "500", agents: "50", price: "3 490 Kč" },
    { name: "Premium", calls: "1 000", agents: "100", price: "4 990 Kč" },
  ];

  soloTiers.forEach((tier, i) => {
    const y = tableY + 0.45 + i * 0.5;
    const bg = i % 2 === 0 ? C.white : C.gray100;
    s11.addShape(pres.shapes.RECTANGLE, { x: 0.8, y, w: 8.4, h: 0.5, fill: { color: bg } });
    s11.addText(tier.name, { x: 0.8, y, w: 2.8, h: 0.5, fontSize: 12, fontFace: FONT_BOLD, color: C.dark, bold: true, align: "center", valign: "middle", margin: 0 });
    s11.addText(tier.calls, { x: 3.6, y, w: 2.0, h: 0.5, fontSize: 12, fontFace: FONT, color: C.gray600, align: "center", valign: "middle", margin: 0 });
    s11.addText(tier.agents, { x: 5.6, y, w: 1.5, h: 0.5, fontSize: 12, fontFace: FONT, color: C.gray600, align: "center", valign: "middle", margin: 0 });
    s11.addText(tier.price, { x: 7.1, y, w: 2.1, h: 0.5, fontSize: 13, fontFace: FONT_BOLD, color: C.red, bold: true, align: "center", valign: "middle", margin: 0 });
  });

  // Features list
  const soloFeatList = [
    "AI analýza hovoru", "Přepis hovoru", "Historie hovorů a nahrávky",
    "Sledování pokroku", "Personalizovaná doporučení", "Export přepisů (PDF/CSV)"
  ];
  const featY = tableY + 0.45 + soloTiers.length * 0.5 + 0.2;
  s11.addText("Zahrnuje:", {
    x: 0.8, y: featY, w: 2, h: 0.3,
    fontSize: 11, fontFace: FONT_BOLD, color: C.dark, bold: true, margin: 0
  });
  soloFeatList.forEach((f, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    s11.addImage({ data: icons.check, x: 0.8 + col * 3.0, y: featY + 0.35 + row * 0.3, w: 0.18, h: 0.18 });
    s11.addText(f, {
      x: 1.05 + col * 3.0, y: featY + 0.32 + row * 0.3, w: 2.6, h: 0.25,
      fontSize: 10, fontFace: FONT, color: C.gray600, margin: 0
    });
  });

  // ═══════════════════════════════════════════
  // SLIDE 12: PRICING - TEAM
  // ═══════════════════════════════════════════
  let s12 = pres.addSlide();
  s12.background = { color: C.dark };
  s12.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.04, fill: { color: C.red } });

  s12.addText("CENÍK", {
    x: 0.8, y: 0.4, w: 3, h: 0.35,
    fontSize: 11, fontFace: FONT, color: C.red, bold: true, charSpacing: 4, margin: 0
  });

  s12.addText("Team — Pro firmy a týmy", {
    x: 0.8, y: 0.8, w: 8, h: 0.55,
    fontSize: 24, fontFace: FONT_BOLD, color: C.white, bold: true, margin: 0
  });

  s12.addText("Správa celého týmu z jednoho místa s neomezeným počtem členů. Hovory ze společného poolu.", {
    x: 0.8, y: 1.35, w: 8.4, h: 0.35,
    fontSize: 12, fontFace: FONT, color: C.gray400, margin: 0
  });

  // Table header
  const t2Y = 1.9;
  s12.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: t2Y, w: 8.4, h: 0.45, fill: { color: C.red }
  });
  s12.addText("Balíček", { x: 0.8, y: t2Y, w: 2.8, h: 0.45, fontSize: 11, fontFace: FONT_BOLD, color: C.white, bold: true, align: "center", valign: "middle", margin: 0 });
  s12.addText("Hovory / měsíc", { x: 3.6, y: t2Y, w: 2.0, h: 0.45, fontSize: 11, fontFace: FONT_BOLD, color: C.white, bold: true, align: "center", valign: "middle", margin: 0 });
  s12.addText("AI agenti", { x: 5.6, y: t2Y, w: 1.5, h: 0.45, fontSize: 11, fontFace: FONT_BOLD, color: C.white, bold: true, align: "center", valign: "middle", margin: 0 });
  s12.addText("Cena / měsíc", { x: 7.1, y: t2Y, w: 2.1, h: 0.45, fontSize: 11, fontFace: FONT_BOLD, color: C.white, bold: true, align: "center", valign: "middle", margin: 0 });

  const teamTiers = [
    { name: "Team Start", calls: "250", agents: "25", price: "2 490 Kč" },
    { name: "Team Standard", calls: "500", agents: "50", price: "4 490 Kč" },
    { name: "Team Pro", calls: "1 000", agents: "100", price: "7 990 Kč" },
    { name: "Team Business", calls: "2 500", agents: "250", price: "14 990 Kč" },
    { name: "Team Enterprise", calls: "5 000", agents: "500", price: "24 990 Kč" },
  ];

  teamTiers.forEach((tier, i) => {
    const y = t2Y + 0.45 + i * 0.5;
    const bg = i % 2 === 0 ? C.darkCard : C.darkMid;
    s12.addShape(pres.shapes.RECTANGLE, { x: 0.8, y, w: 8.4, h: 0.5, fill: { color: bg } });
    s12.addText(tier.name, { x: 0.8, y, w: 2.8, h: 0.5, fontSize: 12, fontFace: FONT_BOLD, color: C.white, bold: true, align: "center", valign: "middle", margin: 0 });
    s12.addText(tier.calls, { x: 3.6, y, w: 2.0, h: 0.5, fontSize: 12, fontFace: FONT, color: C.gray300, align: "center", valign: "middle", margin: 0 });
    s12.addText(tier.agents, { x: 5.6, y, w: 1.5, h: 0.5, fontSize: 12, fontFace: FONT, color: C.gray300, align: "center", valign: "middle", margin: 0 });
    s12.addText(tier.price, { x: 7.1, y, w: 2.1, h: 0.5, fontSize: 13, fontFace: FONT_BOLD, color: C.red, bold: true, align: "center", valign: "middle", margin: 0 });
  });

  // Extra features
  const teamFeatList = [
    "Vše ze Solo plánu", "Manager dashboard", "Neomezený počet profilů",
    "Správa týmu", "Analytika zaměstnanců", "Žebříčky a gamifikace"
  ];
  const t2FeatY = t2Y + 0.45 + teamTiers.length * 0.5 + 0.25;
  s12.addText("Zahrnuje navíc:", {
    x: 0.8, y: t2FeatY, w: 2, h: 0.3,
    fontSize: 11, fontFace: FONT_BOLD, color: C.gray300, bold: true, margin: 0
  });
  teamFeatList.forEach((f, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    s12.addImage({ data: icons.checkWhite, x: 0.8 + col * 3.0, y: t2FeatY + 0.35 + row * 0.3, w: 0.18, h: 0.18 });
    s12.addText(f, {
      x: 1.05 + col * 3.0, y: t2FeatY + 0.32 + row * 0.3, w: 2.6, h: 0.25,
      fontSize: 10, fontFace: FONT, color: C.gray400, margin: 0
    });
  });

  // ═══════════════════════════════════════════
  // SLIDE 13: ENTERPRISE
  // ═══════════════════════════════════════════
  let s13 = pres.addSlide();
  s13.background = { color: C.dark };
  s13.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.04, fill: { color: C.red } });

  s13.addText("ENTERPRISE", {
    x: 0.8, y: 0.5, w: 4, h: 0.35,
    fontSize: 11, fontFace: FONT, color: C.red, bold: true, charSpacing: 4, margin: 0
  });

  s13.addText("Kompletní řešení na míru\npod vaší značkou", {
    x: 0.8, y: 0.9, w: 8, h: 1.0,
    fontSize: 30, fontFace: FONT_BOLD, color: C.white, bold: true,
    lineSpacingMultiple: 1.15, margin: 0
  });

  s13.addText("Pro velké realitní kanceláře a developerské společnosti.\nVlastní branding, AI agenti na míru a dedikovaná podpora.", {
    x: 0.8, y: 2.0, w: 8.4, h: 0.7,
    fontSize: 14, fontFace: FONT, color: C.gray300,
    lineSpacingMultiple: 1.5, margin: 0
  });

  const entFeatures = [
    { icon: icons.crown, title: "Whitelabel", desc: "SimCall vystupuje pod vaší značkou. Vlastní logo a branding." },
    { icon: icons.comments, title: "Vlastní AI agenti", desc: "Scénáře z reálných situací vaší firmy. Vaše procesy, vaše chyby, vaše skripty." },
    { icon: icons.userTie, title: "Dedikovaný account manažer", desc: "Přímý kontakt na osobního vývojáře ze SimCall." },
    { icon: icons.rocket, title: "Objem dohodou", desc: "Počet hovorů, agentů a uživatelů bez omezení. Cena na míru." },
  ];

  entFeatures.forEach((f, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.8 + col * 4.4;
    const y = 2.9 + row * 1.2;

    s13.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.1, h: 1.0,
      fill: { color: C.darkCard }, line: { color: C.darkBorder, width: 0.5 }
    });
    s13.addShape(pres.shapes.OVAL, {
      x: x + 0.2, y: y + 0.22, w: 0.5, h: 0.5, fill: { color: C.red }
    });
    s13.addImage({ data: f.icon, x: x + 0.33, y: y + 0.35, w: 0.25, h: 0.25 });
    s13.addText(f.title, {
      x: x + 0.9, y: y + 0.12, w: 3.0, h: 0.3,
      fontSize: 13, fontFace: FONT_BOLD, color: C.white, bold: true, margin: 0
    });
    s13.addText(f.desc, {
      x: x + 0.9, y: y + 0.45, w: 3.0, h: 0.45,
      fontSize: 10, fontFace: FONT, color: C.gray400,
      lineSpacingMultiple: 1.4, margin: 0
    });
  });

  // ═══════════════════════════════════════════
  // SLIDE 14: CLOSING / CTA
  // ═══════════════════════════════════════════
  let s14 = pres.addSlide();
  s14.background = { color: C.dark };
  s14.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.04, fill: { color: C.red } });

  // Logo
  s14.addText([
    { text: "Sim", options: { color: C.white, bold: true } },
    { text: "Call", options: { color: C.red, bold: true } }
  ], { x: 0.8, y: 0.6, w: 3, h: 0.6, fontSize: 28, fontFace: FONT, margin: 0 });

  s14.addText("Přestaňte pálit leady.\nZačněte trénovat.", {
    x: 0.8, y: 1.6, w: 8, h: 1.6,
    fontSize: 38, fontFace: FONT_BOLD, color: C.white, bold: true,
    lineSpacingMultiple: 1.15, margin: 0
  });

  // CTA button
  s14.addShape(pres.shapes.RECTANGLE, {
    x: 0.8, y: 3.5, w: 3.0, h: 0.65, fill: { color: C.red }
  });
  s14.addText("Domluvit prezentaci", {
    x: 0.8, y: 3.5, w: 3.0, h: 0.65,
    fontSize: 16, fontFace: FONT_BOLD, color: C.white, bold: true,
    align: "center", valign: "middle", margin: 0
  });

  // Contact info
  s14.addText("simcallcz@gmail.com  |  simcall.cz", {
    x: 0.8, y: 4.4, w: 8, h: 0.4,
    fontSize: 14, fontFace: FONT, color: C.gray400, margin: 0
  });

  s14.addText("Filip Mojik — Spoluzakladatel & CEO\nTrung Le — Spoluzakladatel & CTO", {
    x: 0.8, y: 4.8, w: 8, h: 0.6,
    fontSize: 12, fontFace: FONT, color: C.gray500,
    lineSpacingMultiple: 1.5, margin: 0
  });

  // ═══════════════════════════════════════════
  // WRITE FILE
  // ═══════════════════════════════════════════
  const outputPath = "/Users/filipmojik/roman_filip/SimCall_Prezentace.pptx";
  await pres.writeFile({ fileName: outputPath });
  console.log(`Presentation saved to: ${outputPath}`);
}

createPresentation().catch(console.error);
