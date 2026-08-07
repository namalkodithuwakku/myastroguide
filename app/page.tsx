"use client";

import { FormEvent, useEffect, useState } from "react";
import { calculateVedicChart, type VedicChart } from "../lib/vedic-engine";
import { buildLifeGuide } from "../lib/guidance-engine";
import { explainPlanet, explainYoga } from "../lib/technical-explanations";
import AstroChat from "./astro-chat";

const copy = {
  en: {
    navHow: "How it works",
    eyebrow: "Vedic insight, made personal",
    titleA: "Your life,",
    titleB: "written in the stars.",
    intro: "A thoughtful Vedic astrology guide built from your precise birth chart — clear, personal and practical.",
    cardTitle: "Create your life guide",
    cardSub: "Enter your birth details exactly as recorded.",
    name: "Full name",
    nameHint: "e.g. Nimal Perera",
    date: "Date of birth",
    time: "Time of birth",
    place: "Place of birth",
    placeHint: "City, Country",
    button: "Generate my free guide",
    privacy: "Private by design. Your birth details are used only to create your guide.",
    trustOne: "Lahiri ayanamsa",
    trustTwo: "Vedic calculations",
    trustThree: "English + සිංහල",
    step: "Your guide includes",
    items: ["Chart overview", "Life direction", "Career & wealth", "Relationships", "Current timing", "Practical next steps"],
    error: "Please complete all birth details.",
    ready: "Your complete astrology profile is ready.",
    readySub: "The verified calculation engine is the next build milestone.",
    calculating: "Calculating your Vedic birth chart…",
    chartTitle: "Your Vedic birth chart",
    ascendant: "Ascendant",
    moonStar: "Birth star",
    ayanamsa: "Lahiri ayanamsa",
    planet: "Planet",
    position: "Sidereal position",
    house: "House",
    nakshatra: "Nakshatra",
    locationLabel: "Calculated for",
    profileTitle: "Complete astrology profile",
    lifeAreas: "Life-area overview",
    housesTitle: "Twelve houses & their lords",
    aspectsTitle: "Vedic aspects & conjunctions",
    yogasTitle: "Important yoga patterns",
    dashaTitle: "Vimshottari dasha timeline",
    currentPeriod: "Current period",
    maha: "Mahadasha",
    antar: "Antardasha",
    dignity: "Dignity",
    strength: "Strength",
    panchangaTitle: "Birth Panchanga",
    grahaExplanations: "Planetary placement explanations",
    conditionsTitle: "Traditional condition checks",
    pratyantar: "Pratyantardasha",
    houseLord: "House lord",
    occupants: "Occupants",
    none: "None detected",
    active: "Active",
    methodology: "How to read this profile",
    lagnaMap: "Lagna chart · Rasi map",
    lagnaMapSub: "Sri Lankan fixed-house chart · Lagna is always House 1 at top centre",
    rasi: "Birth · Rasi",
    navamsa: "Navamsa · D9",
    gochara: "Current · Transit",
    downloadPdf: "Download PDF report",
    preparingPdf: "Preparing PDF…",
  },
  si: {
    navHow: "ක්‍රියා කරන ආකාරය",
    eyebrow: "ඔබ වෙනුවෙන් සකස් කළ වෛදික මඟපෙන්වීම",
    titleA: "ඔබේ ජීවිතය,",
    titleB: "තරු අතර ලියැවී ඇත.",
    intro: "ඔබේ නිවැරදි ජන්ම පත්‍රය මත පදනම් වූ පැහැදිලි, පුද්ගලික සහ ප්‍රායෝගික වෛදික ජ්‍යෝතිෂ මඟපෙන්වීමක්.",
    cardTitle: "ඔබේ ජීවන මඟපෙන්වීම සාදන්න",
    cardSub: "උපන් තොරතුරු නිවැරදිව ඇතුළත් කරන්න.",
    name: "සම්පූර්ණ නම",
    nameHint: "උදා: නිමල් පෙරේරා",
    date: "උපන් දිනය",
    time: "උපන් වේලාව",
    place: "උපන් ස්ථානය",
    placeHint: "නගරය, රට",
    button: "නොමිලේ මඟපෙන්වීම ලබාගන්න",
    privacy: "ඔබගේ උපන් තොරතුරු භාවිත කරන්නේ මඟපෙන්වීම සැකසීමට පමණි.",
    trustOne: "ලාහිරි අයනාංශය",
    trustTwo: "වෛදික ගණනය කිරීම්",
    trustThree: "English + සිංහල",
    step: "ඔබේ මඟපෙන්වීමට ඇතුළත් දේ",
    items: ["ජන්ම පත්‍ර සාරාංශය", "ජීවන දිශාව", "රැකියාව සහ ධනය", "සබඳතා", "වර්තමාන කාලය", "ප්‍රායෝගික ඉදිරි පියවර"],
    error: "කරුණාකර සියලු උපන් තොරතුරු සම්පූර්ණ කරන්න.",
    ready: "ඔබේ සම්පූර්ණ ජ්‍යෝතිෂ පැතිකඩ සූදානම්.",
    readySub: "තහවුරු කළ ගණන එන්ජිම මීළඟ නිර්මාණ අදියරයි.",
    calculating: "ඔබේ වෛදික ජන්ම පත්‍රය ගණනය කරමින්…",
    chartTitle: "ඔබේ වෛදික ජන්ම පත්‍රය",
    ascendant: "ලග්නය",
    moonStar: "ජන්ම නැකත",
    ayanamsa: "ලාහිරි අයනාංශය",
    planet: "ග්‍රහයා",
    position: "නිරයන පිහිටීම",
    house: "භාවය",
    nakshatra: "නැකත",
    locationLabel: "ගණනය කළ ස්ථානය",
    profileTitle: "සම්පූර්ණ ජ්‍යෝතිෂ පැතිකඩ",
    lifeAreas: "ජීවන අංශ සාරාංශය",
    housesTitle: "භාව දොළහ සහ ඒවායේ අධිපතීන්",
    aspectsTitle: "ග්‍රහ දෘෂ්ටි සහ සංයෝග",
    yogasTitle: "වැදගත් යෝග රටා",
    dashaTitle: "විම්ශෝත්තරී දශා කාලසටහන",
    currentPeriod: "වත්මන් කාලය",
    maha: "මහා දශාව",
    antar: "අතුරු දශාව",
    dignity: "ග්‍රහ බල තත්ත්වය",
    strength: "ශක්තිය",
    panchangaTitle: "ජන්ම පංචාංගය",
    grahaExplanations: "ග්‍රහ පිහිටීම් පැහැදිලි කිරීම",
    conditionsTitle: "සාම්ප්‍රදායික තත්ත්ව පරීක්ෂා",
    pratyantar: "විදශාව",
    houseLord: "භාව අධිපති",
    occupants: "පිහිටි ග්‍රහයන්",
    none: "විශේෂ රටාවක් හමු නොවීය",
    active: "දැනට ක්‍රියාත්මක",
    methodology: "මෙම පැතිකඩ කියවන ආකාරය",
    lagnaMap: "ලග්න සටහන · රාශි සිතියම",
    lagnaMapSub: "ශ්‍රී ලාංකික ස්ථිර භාව සටහන · ලග්නය ඉහළ මැද පළමු භාවයයි",
    rasi: "ජන්ම · රාශි",
    navamsa: "නවාංශක · D9",
    gochara: "වත්මන් · ගෝචර",
    downloadPdf: "PDF වාර්තාව බාගන්න",
    preparingPdf: "PDF වාර්තාව සකසමින්…",
  },
};

const KENDRA_CELLS = [
  { house: 1, row: 1, col: 2 }, { house: 4, row: 2, col: 1 },
  { house: 7, row: 3, col: 2 }, { house: 10, row: 2, col: 3 },
];
const CORNER_CELLS = [
  { row: 1, col: 1, first: 2, second: 3, diagonal: "down" },
  { row: 1, col: 3, first: 12, second: 11, diagonal: "up" },
  { row: 3, col: 1, first: 5, second: 6, diagonal: "up" },
  { row: 3, col: 3, first: 9, second: 8, diagonal: "down" },
];
const SIGNS_EN=["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const SIGNS_SI=["මේෂ","වෘෂභ","මිථුන","කටක","සිංහ","කන්‍යා","තුලා","වෘශ්චික","ධනු","මකර","කුම්භ","මීන"];
const PLANET_LIFE: Record<string, { en:string; si:string; giftEn:string; giftSi:string; challengeEn:string; challengeSi:string }> = {
  sun:{en:"identity, confidence, authority and recognition",si:"අනන්‍යතාව, ආත්මවිශ්වාසය, අධිකාරිය සහ පිළිගැනීම",giftEn:"clear purpose, leadership and courage",giftSi:"පැහැදිලි අරමුණ, නායකත්වය සහ ධෛර්යය",challengeEn:"pride, pressure to prove yourself or authority conflicts",challengeSi:"අහංකාරය, තමන් ඔප්පු කිරීමේ පීඩනය හෝ අධිකාරිය සමඟ ගැටුම්"},
  moon:{en:"emotional security, habits, memory and responses to change",si:"මානසික ආරක්ෂාව, පුරුදු, මතකය සහ වෙනස්කම්වලට ප්‍රතිචාර",giftEn:"empathy, adaptability and emotional intelligence",giftSi:"සංවේදීභාවය, අනුවර්තනය සහ මානසික බුද්ධිය",challengeEn:"mood fluctuations, over-sensitivity or restlessness",challengeSi:"මනෝභාව වෙනස්වීම්, අධික සංවේදීතාව හෝ නොසන්සුන්තාව"},
  mercury:{en:"thinking, learning, speech, trade and decisions",si:"සිතීම, ඉගෙනීම, කථනය, වෙළඳාම සහ තීරණ",giftEn:"quick learning, communication and problem-solving",giftSi:"වේගවත් ඉගෙනීම, සන්නිවේදනය සහ ගැටලු විසඳීම",challengeEn:"overthinking, nervousness or inconsistent decisions",challengeSi:"අධිකව සිතීම, නොසන්සුන්තාව හෝ අස්ථාවර තීරණ"},
  venus:{en:"love, marriage, comfort, creativity and values",si:"ආදරය, විවාහය, සුවපහසුව, නිර්මාණශීලීත්වය සහ වටිනාකම්",giftEn:"diplomacy, creativity and harmony",giftSi:"රාජ්‍යතාන්ත්‍රික බව, නිර්මාණශීලීත්වය සහ සමගිය",challengeEn:"over-attachment, indulgence or avoiding conflict",challengeSi:"අධික බැඳීම, සීමාව ඉක්මවා වින්දනය හෝ ගැටුම් මගහැරීම"},
  mars:{en:"drive, courage, competition, boundaries and initiative",si:"ක්‍රියාශීලීත්වය, ධෛර්යය, තරඟකාරිත්වය, සීමා සහ ආරම්භය",giftEn:"decisive action, endurance and protection",giftSi:"තීරණාත්මක ක්‍රියා, දරාගැනීම සහ ආරක්ෂාව",challengeEn:"impatience, anger, haste or unnecessary conflict",challengeSi:"ඉක්මන්කම, කෝපය, හදිසිය හෝ අනවශ්‍ය ගැටුම්"},
  jupiter:{en:"wisdom, education, children, opportunity and growth",si:"ප්‍රඥාව, අධ්‍යාපනය, දරුවන්, අවස්ථා සහ වර්ධනය",giftEn:"good judgment, generosity and meaningful expansion",giftSi:"හොඳ විනිශ්චය, දානය සහ අර්ථවත් වර්ධනය",challengeEn:"overconfidence, excess or relying on luck",challengeSi:"අධික විශ්වාසය, අතිරික්තය හෝ වාසනාව මත පමණක් රඳා සිටීම"},
  saturn:{en:"duty, delay, discipline, work and maturity",si:"වගකීම, ප්‍රමාදය, විනය, වැඩ සහ පරිණතභාවය",giftEn:"patience, mastery and lasting results",giftSi:"ඉවසීම, ප්‍රවීණත්වය සහ දිගුකාලීන ප්‍රතිඵල",challengeEn:"restriction, loneliness, self-doubt or slow progress",challengeSi:"සීමා, තනිකම, ස්වයං සැකය හෝ මන්දගාමී ප්‍රගතිය"},
  rahu:{en:"ambition, foreign influences, technology and unusual desires",si:"අභිලාෂය, විදේශ බලපෑම්, තාක්ෂණය සහ අසාමාන්‍ය ආශා",giftEn:"innovation, bold ambition and growth beyond familiar boundaries",giftSi:"නවෝත්පාදනය, දැඩි අභිලාෂය සහ හුරුපුරුදු සීමාවෙන් එහා වර්ධනය",challengeEn:"obsession, confusion, shortcuts or dissatisfaction",challengeSi:"අධික ඇලීම, ව්‍යාකූලතාව, කෙටි මාර්ග හෝ අතෘප්තිය"},
  ketu:{en:"detachment, intuition, past mastery and spirituality",si:"විරාගය, අනුභූතිය, පෙර පුරුද්ද සහ ආධ්‍යාත්මිකත්වය",giftEn:"insight, independence and spiritual depth",giftSi:"ගැඹුරු අවබෝධය, ස්වාධීනත්වය සහ ආධ්‍යාත්මික ගැඹුර",challengeEn:"withdrawal, sudden breaks or difficulty staying engaged",challengeSi:"ඉවත් වීම, හදිසි බිඳීම් හෝ දිගටම සම්බන්ධව සිටීමේ අපහසුතාව"},
};
const HOUSE_LIFE = [
 ["personality, body, confidence and life direction","පෞරුෂය, ශරීරය, ආත්මවිශ්වාසය සහ ජීවන දිශාව"],["income, savings, family, speech and resources","ආදායම, ඉතිරිකිරීම්, පවුල, කථනය සහ සම්පත්"],["courage, skills, enterprise, siblings and short travel","ධෛර්යය, කුසලතා, ව්‍යවසාය, සහෝදරයන් සහ කෙටි ගමන්"],["home, mother, property and inner peace","නිවස, මව, දේපළ සහ අභ්‍යන්තර සැනසීම"],["education, creativity, children, romance and judgment","අධ්‍යාපනය, නිර්මාණශීලීත්වය, දරුවන්, ප්‍රේමය සහ විනිශ්චය"],["work, service, health habits, debts and obstacles","වැඩ, සේවය, සෞඛ්‍ය පුරුදු, ණය සහ බාධක"],["marriage, partnerships, clients and contracts","විවාහය, හවුල්කාරිත්වය, ගනුදෙනුකරුවන් සහ ගිවිසුම්"],["shared finances, inheritance, sudden change and transformation","හවුල් මූල්‍ය, උරුමය, හදිසි වෙනස්කම් සහ පරිවර්තනය"],["higher learning, mentors, ethics, long travel and fortune","උසස් අධ්‍යාපනය, ගුරුවරු, ධර්මය, දුර ගමන් සහ භාග්‍යය"],["career, reputation, leadership and public contribution","වෘත්තිය, කීර්තිය, නායකත්වය සහ පොදු දායකත්වය"],["profits, networks, recognition, goals and fulfilment","ලාභ, ජාල, පිළිගැනීම, ඉලක්ක සහ සපුරාලීම"],["foreign lands, expenses, sleep, solitude and spiritual life","විදේශ රටවල්, වියදම්, නින්ද, හුදකලාව සහ ආධ්‍යාත්මික ජීවිතය"]
] as const;

function LagnaChart({ chart, language, title, subtitle, labels }: { chart: VedicChart; language: "en" | "si"; title: string; subtitle: string; labels: { rasi: string; navamsa: string; gochara: string } }) {
  const [view, setView] = useState<"rasi" | "navamsa" | "transit">("rasi");
  const activeAscendant = view === "navamsa" ? chart.navamsa.ascendant : chart.ascendant;
  const activePlanets = view === "navamsa" ? chart.navamsa.planets : view === "transit" ? chart.transits.planets : chart.planets;
  const lagnaSign = activeAscendant.signIndex;
  const abbreviate = (name: string) => language === "si" ? name : name.slice(0, 2).toUpperCase();
  const houseContent = (house: number) => {
    const sign=(lagnaSign+house-1)%12;
    const planets=activePlanets.filter((planet)=>planet.house===house);
    return <><div><small>{language === "si" ? SIGNS_SI[sign] : SIGNS_EN[sign]}</small><b>H{house}</b></div><p>{house===1&&<strong>ASC</strong>}{planets.map((planet)=><span title={language === "si" ? planet.nameSi : planet.nameEn} key={planet.key}>{abbreviate(language === "si" ? planet.nameSi : planet.nameEn)}{planet.retrograde ? "℞" : ""}</span>)}</p></>;
  };
  return <section className="lagnaPanel">
    <div className="lagnaIntro"><p>VEDIC BIRTH MAP</p><h3>{title}</h3><span>{subtitle}</span>
      <div className="chartTabs" aria-label="Astrology chart view">
        <button className={view === "rasi" ? "active" : ""} type="button" onClick={() => setView("rasi")}>{labels.rasi}</button>
        <button className={view === "navamsa" ? "active" : ""} type="button" onClick={() => setView("navamsa")}>{labels.navamsa}</button>
        <button className={view === "transit" ? "active" : ""} type="button" onClick={() => setView("transit")}>{labels.gochara}</button>
      </div>
      <div className="lagnaKey"><i className="ascKey">ASC</i><small>{language === "si" ? "ලග්නය" : "Ascendant"}</small><i>℞</i><small>{language === "si" ? "වක්‍ර" : "Retrograde"}</small></div>
    </div>
    <div className="southChart sriLankanChart" role="img" aria-label={title}>
      {KENDRA_CELLS.map(({house,row,col})=><article className={`rasiCell ${house===1?"lagnaCell":""}`} style={{gridRow:row,gridColumn:col}} key={house}>{houseContent(house)}</article>)}
      {CORNER_CELLS.map(({row,col,first,second,diagonal})=><div className={`cornerCell ${diagonal}`} style={{gridRow:row,gridColumn:col}} key={`${first}-${second}`}>
        <article className="cornerHouse first">{houseContent(first)}</article>
        <article className="cornerHouse second">{houseContent(second)}</article>
      </div>)}
      <div className="chartCentre"><span className="lagnaSymbol" aria-hidden="true"><i>↑</i></span><b>{view === "navamsa" ? "NAVAMSA D9" : view === "transit" ? "GOCHARA" : language === "si" ? "ජන්ම පත්‍රය" : "RASI CHART"}</b><small>{language === "si" ? `${activeAscendant.signSi} ලග්නය` : `${activeAscendant.signEn} LAGNA`}</small></div>
    </div>
  </section>;
}

export default function Home() {
  const [language, setLanguage] = useState<"en" | "si">("en");
  const [status, setStatus] = useState<"idle" | "error" | "loading" | "ready">("idle");
  const [message, setMessage] = useState("");
  const [chart, setChart] = useState<VedicChart | null>(null);
  const [resolvedPlace, setResolvedPlace] = useState("");
  const [reportName, setReportName] = useState("");
  const [reportBirth, setReportBirth] = useState({ date: "", time: "" });
  const [pdfStatus, setPdfStatus] = useState<"idle" | "working" | "error">("idle");
  type PlaceResult = { name: string; latitude: number; longitude: number; timezone: string };
  const [placeQuery, setPlaceQuery] = useState("");
  const [placeSuggestions, setPlaceSuggestions] = useState<PlaceResult[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [placeSearching, setPlaceSearching] = useState(false);
  const t = copy[language];
  const lifeGuide = chart ? buildLifeGuide(chart, language) : null;

  useEffect(() => {
    if (placeQuery.trim().length < 2 || selectedPlace?.name === placeQuery) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setPlaceSearching(true);
      try {
        const response = await fetch(`/api/geocode?q=${encodeURIComponent(placeQuery)}&suggest=1`, { signal: controller.signal });
        const payload = await response.json() as { results?: PlaceResult[] };
        setPlaceSuggestions(payload.results || []);
      } catch (error) { if (!(error instanceof DOMException && error.name === "AbortError")) setPlaceSuggestions([]); }
      finally { if (!controller.signal.aborted) setPlaceSearching(false); }
    }, 280);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [placeQuery, selectedPlace]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!["name", "date", "time", "place"].every((key) => String(data.get(key) || "").trim())) {
      setStatus("error"); setMessage(t.error); return;
    }
    setStatus("loading"); setMessage(t.calculating); setChart(null);
    try {
      let location: PlaceResult;
      if (selectedPlace && selectedPlace.name === placeQuery) location = selectedPlace;
      else {
        const response = await fetch(`/api/geocode?q=${encodeURIComponent(String(data.get("place")))}`);
        const result = await response.json() as PlaceResult & { error?: string };
        if (!response.ok) throw new Error(result.error || "Location lookup failed.");
        location = result;
      }
      const result = calculateVedicChart({
        date: String(data.get("date")), time: String(data.get("time")), timezone: location.timezone,
        latitude: location.latitude, longitude: location.longitude,
      });
      setReportName(String(data.get("name")));
      setReportBirth({ date: String(data.get("date")), time: String(data.get("time")) });
      setChart(result); setResolvedPlace(location.name); setStatus("ready"); setMessage(t.ready);
      setTimeout(() => document.getElementById("chart")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    } catch (error) {
      setStatus("error"); setMessage(error instanceof Error ? error.message : t.error);
    }
  }

  async function downloadPdf() {
    const report = document.getElementById("chart");
    if (!report || pdfStatus === "working") return;
    setPdfStatus("working");
    report.classList.add("pdfExporting");
    try {
      const pdfModule = await import("html2pdf.js");
      const html2pdf = pdfModule.default;
      const safeName = (reportName || "astro-profile").trim().replace(/[^a-zA-Z0-9\u0D80-\u0DFF]+/g, "-").replace(/^-|-$/g, "");
      const worker = html2pdf().set({
        margin: [10, 8, 12, 8],
        filename: `${safeName || "astro-profile"}-vedic-life-guide.pdf`,
        image: { type: "jpeg", quality: .9 },
        html2canvas: { scale: 1.35, useCORS: true, backgroundColor: "#ffffff", logging: false, scrollX: 0, scrollY: 0 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"], before: [".profileDivider"], avoid: [".sectionHeading", ".reportFacts", ".lagnaPanel", ".planetRow", ".lifeGrid article", ".houseGrid article", ".planetExplanationGrid article", ".yogaList article", ".conditionGrid article", ".methodology"] },
      }).from(report).toPdf();
      const blob = await worker.outputPdf("blob");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${safeName || "astro-profile"}-vedic-life-guide.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      setPdfStatus("idle");
    } catch (error) {
      console.error("PDF export failed", error);
      setPdfStatus("error");
      setTimeout(() => setPdfStatus("idle"), 3500);
    } finally {
      report.classList.remove("pdfExporting");
    }
  }

  return (
    <main className={language === "si" ? "sinhala" : ""}>
      <header className="nav shell">
        <a className="brand" href="#top" aria-label="My Astro Guide home">
          <span className="brandMark">✦</span>
          <span><b>MY ASTRO</b><small>GUIDE</small></span>
        </a>
        <div className="navActions">
          <a href="#guide">{t.navHow}</a>
          <div className="language" aria-label="Language selection">
            <button className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>EN</button>
            <button className={language === "si" ? "active" : ""} onClick={() => setLanguage("si")}>සිං</button>
          </div>
        </div>
      </header>

      <section className="hero shell" id="top">
        <div className="heroCopy">
          <p className="eyebrow"><span>✦</span>{t.eyebrow}</p>
          <h1>{t.titleA}<em>{t.titleB}</em></h1>
          <p className="intro">{t.intro}</p>
          <div className="trustRow">
            {[t.trustOne, t.trustTwo, t.trustThree].map((item) => <span key={item}>✓ {item}</span>)}
          </div>
        </div>

        <div className="chartVisual" aria-hidden="true">
          <div className="orbit orbitOne"><i>☉</i><i>☾</i><i>♃</i><i>♄</i></div>
          <div className="orbit orbitTwo"><i>♈</i><i>♋</i><i>♎</i><i>♑</i></div>
          <div className="chartCore"><span>ॐ</span><small>YOUR COSMIC<br />BLUEPRINT</small></div>
        </div>

      </section>

      <form className="birthCard formPanel shell" id="birth-form" onSubmit={submit} noValidate>
          <div className="cardHeading"><span>✦</span><div><h2>{t.cardTitle}</h2><p>{t.cardSub}</p></div></div>
          <div className="formStep"><span>1</span><h3>{language === "si" ? "පුද්ගලික විස්තර" : "Personal details"}</h3></div>
          <label>{t.name}<input name="name" placeholder={t.nameHint} /></label>
          <div className="formStep"><span>2</span><h3>{language === "si" ? "උපන් දිනය සහ වේලාව" : "Birth date and time"}</h3></div>
          <div className="fieldPair">
            <label>{t.date}<input name="date" type="date" /></label>
            <label>{t.time}<input name="time" type="time" /></label>
          </div>
          <div className="formStep"><span>3</span><h3>{language === "si" ? "උපන් ස්ථානය" : "Birth location"}</h3></div>
          <label className="placeLabel">{t.place}<span className="placeField"><b>⌖</b><input name="place" autoComplete="off" value={placeQuery} onChange={(event)=>{const value=event.target.value;setPlaceQuery(value);setSelectedPlace(null);if(value.trim().length<2)setPlaceSuggestions([])}} onFocus={()=>{if(placeQuery.length>=2&&selectedPlace?.name!==placeQuery)setPlaceQuery(value=>value)}} placeholder={t.placeHint} aria-controls="place-suggestions" aria-autocomplete="list" />{placeSearching&&<i className="searchSpinner" aria-label={language==="si"?"නගර සොයමින්":"Searching cities"}>◌</i>}</span>
          {placeSuggestions.length>0&&<ul className="placeSuggestions" id="place-suggestions" role="listbox">{placeSuggestions.map((place)=><li role="option" aria-selected="false" key={`${place.name}-${place.latitude}-${place.longitude}`}><button type="button" onMouseDown={(event)=>event.preventDefault()} onClick={()=>{setPlaceQuery(place.name);setSelectedPlace(place);setPlaceSuggestions([])}}><span>⌖</span><b>{place.name}</b><small>{place.timezone}</small></button></li>)}</ul>}</label>
          <button className="generate" type="submit"><span>✦</span>{t.button}<b>→</b></button>
          {status !== "idle" && <div className={`status ${status}`} role="status"><b>{message}</b></div>}
          <p className="privacy">⌾ {t.privacy}</p>
      </form>

      {chart && <section className="chartReport shell" id="chart">
        <div className="reportToolbar" data-html2canvas-ignore="true"><div><b>{language === "si" ? "ඔබේ සම්පූර්ණ වාර්තාව" : "Your complete report"}</b><span>{language === "si" ? "ජන්ම පත්‍රය සහ ජීවන මඟපෙන්වීම PDF ලෙස සුරකින්න." : "Save the chart and life guidance as a PDF."}</span></div><button type="button" onClick={downloadPdf} disabled={pdfStatus === "working"}><span>⇩</span>{pdfStatus === "working" ? t.preparingPdf : pdfStatus === "error" ? (language === "si" ? "නැවත උත්සාහ කරන්න" : "Please try again") : t.downloadPdf}</button></div>
        <div className="reportHeader">
          <div><p className="eyebrow"><span>✦</span>MY ASTRO GUIDE</p><h2>{reportName || t.chartTitle}</h2><p>{t.chartTitle} · {reportBirth.date} · {reportBirth.time}</p><p>{t.locationLabel}: {resolvedPlace}</p></div>
          <div className="reportFacts">
            <span><small>{t.ascendant}</small><b>{language === "si" ? chart.ascendant.signSi : chart.ascendant.signEn}</b></span>
            <span><small>{t.moonStar}</small><b>{language === "si" ? chart.moonNakshatra.si : chart.moonNakshatra.en} · {chart.moonNakshatra.pada}</b></span>
            <span><small>{t.ayanamsa}</small><b>{chart.ayanamsa.toFixed(2)}°</b></span>
          </div>
        </div>
        {lifeGuide && <section className="simpleGuideSection">
          <div className="guideHero"><p>{language === "si" ? "AI නොමැති · ගණනය මත පදනම් වූ" : "NO AI · CALCULATION-BASED"}</p><h2>{language === "si" ? "ඔබේ සරල ජීවන මඟපෙන්වීම" : "Your practical life guide"}</h2><span>{lifeGuide.overall}</span></div>
          <div className="guideSummaryGrid">
            <article className="strengthSummary"><span>✦</span><h3>{language === "si" ? "ප්‍රධාන ශක්තීන්" : "Natural strengths"}</h3><ul>{lifeGuide.strengths.map(item=><li key={item}>{item}</li>)}</ul></article>
            <article className="growthSummary"><span>↗</span><h3>{language === "si" ? "වර්ධනය කළ යුතු අංශ" : "Areas to develop"}</h3><ul>{lifeGuide.growth.map(item=><li key={item}>{item}</li>)}</ul></article>
            <article className="timingSummary"><span>◷</span><h3>{language === "si" ? "දැනට අවධානය යොමු කළ යුතු දේ" : "Current-period focus"}</h3><p>{lifeGuide.timing}</p></article>
          </div>
          <div className="guidanceCards">{lifeGuide.cards.map(card=><article key={card.key}>
            <div className="guidanceCardHead"><h3>{card.title}</h3><span>{card.level}</span></div>
            <p className="guidanceParagraph">{card.paragraph}</p>
            <div className="guidanceActions"><p><b>✓ {language === "si" ? "ඔබට හොඳම ක්‍රියාව" : "Best action"}</b>{card.action}.</p><p><b>! {language === "si" ? "වළකින්න" : "Be careful"}</b>{card.caution}.</p></div>
            <details><summary>{language === "si" ? "මෙම මඟපෙන්වීම ලැබුණේ ඇයි?" : "Why this guidance?"}</summary><ul>{card.evidence.map(item=><li key={item}>{item}</li>)}</ul></details>
          </article>)}</div>
        </section>}
        <AstroChat chart={chart} language={language} />
        <div className="technicalBridge"><span>✦</span><div><p>{language === "si" ? "සාක්ෂි සහ ගණනය" : "EVIDENCE & CALCULATIONS"}</p><h2>{language === "si" ? "සම්පූර්ණ ජ්‍යෝතිෂ පැතිකඩ" : "Detailed astrology profile"}</h2></div></div>
        <LagnaChart chart={chart} language={language} title={t.lagnaMap} subtitle={t.lagnaMapSub} labels={{ rasi: t.rasi, navamsa: t.navamsa, gochara: t.gochara }} />
        <div className="planetTable" role="table" aria-label={t.chartTitle}>
          <div className="planetRow tableHead" role="row"><span>{t.planet}</span><span>{t.position}</span><span>{t.house}</span><span>{t.nakshatra}</span><span>{t.dignity}</span><span>{t.strength}</span></div>
          {chart.planets.map((planet) => <div className="planetRow" role="row" key={planet.key}>
            <b title={planet.powerFactors.join(" · ")}>{language === "si" ? planet.nameSi : planet.nameEn}{planet.retrograde ? " ℞" : ""}{planet.combust ? " ☉" : ""}</b>
            <span>{planet.degree.toFixed(2)}° {language === "si" ? planet.signSi : planet.signEn}</span>
            <span>{planet.house}</span>
            <span>{language === "si" ? planet.nakshatraSi : planet.nakshatraEn} · {planet.pada}</span>
            <span className={`dignity ${planet.dignity}`}>{planet.dignity}</span>
            <span className="miniScore" title={`${planet.powerGrade}: ${planet.powerFactors.join(" · ")}`}><i style={{ width: `${planet.strength}%` }} />{planet.strength}</span>
          </div>)}
        </div>

        <section className="profileSection grahaExplanationSection">
          <div className="sectionHeading"><span>✦</span><div><p>RULE-BASED · NO AI</p><h3>{t.grahaExplanations}</h3></div></div>
          <div className="planetExplanationGrid">{chart.planets.map((planet)=>{const explanation=explainPlanet(chart,planet,language);return <article key={planet.key}>
            <div className="planetCardHead"><span>{planet.nameEn.slice(0,2).toUpperCase()}</span><div><h4>{language==="si"?planet.nameSi:planet.nameEn}</h4><p>{language==="si"?`${planet.house} වන භාවය · ${planet.signSi}`:`House ${planet.house} · ${planet.signEn}`}</p></div><b>{explanation.level}</b></div>
            <div className="lifeImpact">
              <h5>{language==="si"?"මෙය ඔබේ ජීවිතය හැඩගස්වන ආකාරය":"How this shapes your life"}</h5>
              <p className="simpleEffect">{explanation.meaning}</p>
              <div className="simplePoints"><p><b>✓ {language==="si"?"ඉහළ නංවන බලය":"Uplifting power"}</b>{explanation.gift}.</p><p><b>! {language==="si"?"කපා හැරිය හැකි බලය":"Possible cutting power"}</b>{explanation.risk}.</p></div>
              <p className="balanceNote"><b>{language==="si"?"සමබර/නිෂ්ක්‍රීය කරන බලය":"Balancing influence"}</b>{explanation.balance}</p>
              <p className="actionNote"><b>{language==="si"?"ප්‍රායෝගික මඟපෙන්වීම":"Practical guidance"}</b>{explanation.action}.</p>
              <p className="timingNote"><b>{language==="si"?"කාල සක්‍රියතාව":"Timing activation"}</b>{explanation.timing}</p>
              <details className="calculationDetails"><summary>{language==="si"?"ජ්‍යෝතිෂ ගණන විස්තර බලන්න":"View calculation details"}</summary><div><p><b>{language==="si"?"බලය":"Strength"}:</b> {planet.strength}/100</p><p><b>{language==="si"?"සක්‍රිය කාලය":"Active periods"}:</b> {language==="si"?`${planet.nameSi} මහා දශා, අතුරු දශා සහ බලවත් ගෝචර.`:`${planet.nameEn} mahadasha, antardasha and strong transits.`}</p><ul>{planet.powerFactors.map((factor)=><li key={factor}>{factor}</li>)}</ul></div></details>
            </div>
          </article>})}</div>
        </section>

        <section className="profileSection">
          <div className="sectionHeading"><span>00</span><div><p>PANCHANGA</p><h3>{t.panchangaTitle}</h3></div></div>
          <div className="panchangaGrid">
            <article><small>Vara · Day</small><b>{language === "si" ? chart.panchanga.weekdaySi : chart.panchanga.weekdayEn}</b></article>
            <article><small>Tithi</small><b>{language === "si" ? chart.panchanga.tithiSi : chart.panchanga.tithiEn}</b></article>
            <article><small>Paksha</small><b>{language === "si" ? chart.panchanga.pakshaSi : chart.panchanga.pakshaEn}</b></article>
            <article><small>Karana</small><b>{chart.panchanga.karana}</b></article>
            <article><small>Nitya Yoga</small><b>{language === "si" ? chart.panchanga.yogaSi : chart.panchanga.yogaEn}</b></article>
          </div>
        </section>

        <div className="profileDivider"><span>✦</span><h2>{t.profileTitle}</h2></div>

        <section className="profileSection">
          <div className="sectionHeading"><span>01</span><div><p>ASTROLOGICAL SYNTHESIS</p><h3>{t.lifeAreas}</h3></div></div>
          <div className="lifeGrid">{chart.lifeAreas.map((area) => <article key={area.key}>
            <div className="scoreRing" style={{ "--score": `${area.score * 3.6}deg` } as React.CSSProperties}><b>{area.score}</b><small>/100</small></div>
            <div><h4>{language === "si" ? area.titleSi : area.titleEn}</h4><p>{language === "si" ? area.summarySi : area.summaryEn}</p><ul>{(language === "si" ? area.factorsSi : area.factorsEn).map((factor) => <li key={factor}>{factor}</li>)}</ul></div>
          </article>)}</div>
        </section>

        <section className="profileSection">
          <div className="sectionHeading"><span>02</span><div><p>BHAVA ANALYSIS</p><h3>{t.housesTitle}</h3></div></div>
          <div className="houseGrid">{chart.houses.map((house) => <article key={house.house}>
            <div className="houseNumber">{house.house}</div><div><h4>{language === "si" ? house.signSi : house.signEn}</h4><p><b>{t.houseLord}:</b> {language === "si" ? house.lordSi : house.lordEn} → {house.lordHouse}</p><p><b>{t.occupants}:</b> {(language === "si" ? house.occupantsSi : house.occupantsEn).join(", ") || "—"}</p></div><span>{house.score}</span>
          </article>)}</div>
        </section>

        <section className="profileSection splitSection">
          <div>
            <div className="sectionHeading"><span>03</span><div><p>GRAHA DRISHTI</p><h3>{t.aspectsTitle}</h3></div></div>
            <div className="insightList">
              {chart.conjunctions.map((item) => <article key={item.signEn}><span>☌</span><p><b>{(language === "si" ? item.planetsSi : item.planetsEn).join(" + ")}</b><small>{language === "si" ? item.signSi : item.signEn}</small></p></article>)}
              {chart.aspects.map((aspect, index) => <article key={`${aspect.from}-${aspect.to}-${index}`}><span>⌁</span><p><b>{language === "si" ? `${aspect.fromSi} → ${aspect.toSi}` : `${aspect.from} → ${aspect.to}`}</b><small>{language === "si" ? aspect.kindSi : aspect.kindEn} · {aspect.grade} {aspect.power}/100</small></p></article>)}
              {!chart.aspects.length && !chart.conjunctions.length && <p>{t.none}</p>}
            </div>
          </div>
          <div>
            <div className="sectionHeading"><span>04</span><div><p>YOGA ANALYSIS</p><h3>{t.yogasTitle}</h3></div></div>
            <div className="yogaList yogaExplanationList">{chart.yogas.length ? chart.yogas.map((yoga) => {const explanation=explainYoga(chart,yoga,language);return <article key={yoga.key}><span>✦</span><div><h4>{language === "si" ? yoga.nameSi : yoga.nameEn} <em>{yoga.power}/100</em></h4><p className="yogaRule">{language === "si" ? yoga.descriptionSi : yoga.descriptionEn}</p><p className="yogaMeaning">{explanation.meaning}</p><div className="yogaPoints"><p><b>✓ {language==="si"?"හොඳ හැකියාව":"Positive potential"}</b>{explanation.gift}.</p><p><b>! {language==="si"?"සීමාව":"Possible limitation"}</b>{explanation.risk}.</p></div><p className="yogaAction"><b>{language==="si"?"භාවිත කරන ආකාරය":"How to use it"}</b>{explanation.action}.</p><p className="yogaTiming"><b>{language==="si"?"ක්‍රියාත්මක වන කාලය":"When it activates"}</b>{explanation.timing}</p><details><summary>{language==="si"?"ගණනයේ සාක්ෂි":"Calculation evidence"}</summary><small>{yoga.planets.join(" · ")} · {explanation.level} · {yoga.power}/100</small></details></div></article>}) : <p>{t.none}</p>}</div>
          </div>
        </section>

        <section className="profileSection">
          <div className="sectionHeading"><span>05</span><div><p>PLANETARY TIMING</p><h3>{t.dashaTitle}</h3></div></div>
          <div className="currentDasha"><p>{t.currentPeriod}</p><div><span><small>{t.maha}</small><b>{language === "si" ? chart.dasha.currentMaha?.lordSi : chart.dasha.currentMaha?.lordEn}</b></span><span><small>{t.antar}</small><b>{language === "si" ? chart.dasha.currentAntar?.lordSi : chart.dasha.currentAntar?.lordEn}</b></span><span><small>{t.pratyantar}</small><b>{language === "si" ? chart.dasha.currentPratyantar?.lordSi : chart.dasha.currentPratyantar?.lordEn}</b></span></div></div>
          <div className="dashaTimeline">{chart.dasha.timeline.filter((period) => new Date(period.end) > new Date()).slice(0, 7).map((period) => <article className={period.active ? "active" : ""} key={period.start}><span>{period.active ? t.active : new Date(period.start).getFullYear()}</span><b>{language === "si" ? period.lordSi : period.lordEn}</b><small>{new Date(period.start).getFullYear()} — {new Date(period.end).getFullYear()}</small></article>)}</div>
        </section>

        <section className="profileSection">
          <div className="sectionHeading"><span>06</span><div><p>DOSHA & TRANSIT FLAGS</p><h3>{t.conditionsTitle}</h3></div></div>
          <div className="conditionGrid">{chart.conditions.map(item=><article className={item.detected?"detected":"clear"} key={item.key}><span>{item.detected?"!":"✓"}</span><div><h4>{language==="si"?item.nameSi:item.nameEn}</h4><p>{language==="si"?item.detailSi:item.detailEn}</p></div><b>{item.detected?item.power:"Clear"}</b></article>)}</div>
        </section>

        <section className="methodology"><span>ⓘ</span><div><h3>{t.methodology}</h3><p>Life-area scores are relative tendencies within this birth chart, calculated from weighted houses, house lords, occupants, dignity, aspects and detected yogas. They are not percentages of guaranteed success. The explanations use calculated rules rather than AI; AI may later improve the writing but will not alter the chart.</p></div></section>
        <p className="calculationNote">Astronomical positions use Astronomy Engine (MIT), Lahiri sidereal conversion, whole-sign houses, Sri Lankan fixed-house display, Parashari aspects and 365.2425-day Vimshottari timing. Professional use requires independent ephemeris validation.</p>
      </section>}

      <section className="guide shell" id="guide">
        <p className="sectionLabel">{t.step}</p>
        <div className="guideGrid">
          {t.items.map((item, index) => <article key={item}><span>0{index + 1}</span><h3>{item}</h3></article>)}
        </div>
      </section>

      <nav className="mobileAppNav" aria-label="Mobile app navigation">
        <a href="#top"><span>⌂</span>{language === "si" ? "මුල් පිටුව" : "Home"}</a>
        <a href="#birth-form"><span>✦</span>{language === "si" ? "සාදන්න" : "Create"}</a>
        <a href="#chart" className={!chart ? "disabled" : ""}><span>▦</span>{language === "si" ? "වාර්තාව" : "Report"}</a>
      </nav>

      <footer className="shell"><span>MY ASTRO GUIDE</span><p>Vedic wisdom · Modern clarity · Personal guidance</p><small>For reflective guidance, not medical, legal or financial advice.</small></footer>
    </main>
  );
}
