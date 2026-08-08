"use client";

import { FormEvent, useEffect, useState } from "react";
import { calculateVedicChart, type VedicChart } from "../lib/vedic-engine";
import AstroChat from "./astro-chat";
import HolisticGuide from "./holistic-guide";
import ProfileLibrary, { type SavedAstroProfile } from "./profile-library";

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
    eyebrow: "ඔබේ ජන්ම පත්‍රය — සරලව සහ නිවැරදිව",
    titleA: "ඔබේ ජන්ම පත්‍රය,",
    titleB: "ඔබට තේරෙන ලෙස.",
    intro: "ලාහිරි ක්‍රමයට ගණනය කළ ජන්ම පත්‍රය සහ එයින් ලැබෙන පැහැදිලි ජීවන විග්‍රහය.",
    cardTitle: "ජන්ම පත්‍රය සකසන්න",
    cardSub: "උපන් දිනය, වේලාව සහ ස්ථානය නිවැරදිව ඇතුළත් කරන්න.",
    name: "සම්පූර්ණ නම",
    nameHint: "උදා: නිමල් පෙරේරා",
    date: "උපන් දිනය",
    time: "උපන් වේලාව",
    place: "උපන් ස්ථානය",
    placeHint: "නගරය, රට",
    button: "ජන්ම පත්‍රය බලන්න",
    privacy: "ඔබේ උපන් තොරතුරු භාවිත කරන්නේ මෙම පැතිකඩ සැකසීමට පමණි.",
    trustOne: "ලාහිරි අයනාංශය",
    trustTwo: "වෛදික ගණනය කිරීම්",
    trustThree: "English + සිංහල",
    step: "ඔබේ මඟපෙන්වීමට ඇතුළත් දේ",
    items: ["ජන්ම පත්‍ර සාරාංශය", "ජීවන දිශාව", "රැකියාව සහ ධනය", "සබඳතා", "වර්තමාන කාලය", "ප්‍රායෝගික ඉදිරි පියවර"],
    error: "කරුණාකර සියලු උපන් තොරතුරු සම්පූර්ණ කරන්න.",
    ready: "ජන්ම පත්‍රය සූදානම්.",
    readySub: "",
    calculating: "ජන්ම පත්‍රය ගණනය වෙමින්…",
    chartTitle: "වෛදික ජන්ම පත්‍රය",
    ascendant: "ලග්නය",
    moonStar: "ජන්ම නැකත",
    ayanamsa: "ලාහිරි අයනාංශය",
    planet: "ග්‍රහයා",
    position: "නිරයන පිහිටීම",
    house: "භාවය",
    nakshatra: "නැකත",
    locationLabel: "ගණනය කළ ස්ථානය",
    profileTitle: "ජන්ම පත්‍රයේ සියලු ගණනයන්",
    lifeAreas: "ජීවන අංශවල බලය",
    housesTitle: "භාව දොළහේ බල තත්ත්වය",
    aspectsTitle: "ග්‍රහ දෘෂ්ටි හා සංයෝග",
    yogasTitle: "ජන්ම පත්‍රයේ යෝග",
    dashaTitle: "විම්ශෝත්තරී දශා කාලය",
    currentPeriod: "දැනට පවතින දශාව",
    maha: "මහා දශාව",
    antar: "අතුරු දශාව",
    dignity: "ග්‍රහ බල තත්ත්වය",
    strength: "ශක්තිය",
    panchangaTitle: "ජන්ම පංචාංගය",
    grahaExplanations: "ග්‍රහ පිහිටීම් පැහැදිලි කිරීම",
    conditionsTitle: "විශේෂ ග්‍රහ තත්ත්ව",
    pratyantar: "විදශාව",
    houseLord: "භාව අධිපති",
    occupants: "පිහිටි ග්‍රහයන්",
    none: "විශේෂ රටාවක් හමු නොවීය",
    active: "දැනට ක්‍රියාත්මක",
    methodology: "මෙම ගණනයන් ගැන",
    lagnaMap: "රාශි සහ ලග්න සටහන",
    lagnaMapSub: "ශ්‍රී ලංකාවේ භාවිත වන ස්ථිර භාව සටහන — ලග්නය ඉහළ මැද කොටුවේ",
    rasi: "රාශි සටහන",
    navamsa: "නවාංශ සටහන",
    gochara: "ගෝචර සටහන",
    downloadPdf: "PDF පිටපත",
    preparingPdf: "PDF සකසමින්…",
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
  const [activeSection, setActiveSection] = useState<"profile" | "guide" | "chat" | "saved">("profile");
  type PlaceResult = { name: string; latitude: number; longitude: number; timezone: string };
  const [placeQuery, setPlaceQuery] = useState("");
  const [placeSuggestions, setPlaceSuggestions] = useState<PlaceResult[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [placeSearching, setPlaceSearching] = useState(false);
  const t = copy[language];

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
      setActiveSection("profile");
      setTimeout(() => document.getElementById("chart")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    } catch (error) {
      setStatus("error"); setMessage(error instanceof Error ? error.message : t.error);
    }
  }

  function loadSavedProfile(profile: SavedAstroProfile) {
    setChart(profile.chart);
    setReportName(profile.name);
    setReportBirth({ date: profile.birthDate, time: profile.birthTime });
    setResolvedPlace(profile.place);
    setStatus("ready");
    setMessage(language === "si" ? "සුරැකි පැතිකඩ විවෘත කරන ලදී." : "Saved profile opened.");
    setActiveSection("profile");
    setTimeout(() => document.getElementById("chart")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
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
    <main className={`${language === "si" ? "sinhala" : ""} ${chart ? "hasChart" : ""}`}>
      <header className="nav shell">
        <a className="brand" href="#top" aria-label="My Astro Guide home">
          <span className="brandMark">✦</span>
          <span><b>MY ASTRO</b><small>GUIDE</small></span>
        </a>
        <div className="navActions">
          <div className="language" aria-label="Language selection">
            <button className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>EN</button>
            <button className={language === "si" ? "active" : ""} onClick={() => setLanguage("si")}>සිං</button>
          </div>
        </div>
      </header>

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
        <div className="reportToolbar" data-html2canvas-ignore="true"><div><b>{reportName || (language === "si" ? "ඔබේ ජ්‍යෝතිෂ පැතිකඩ" : "Your astro profile")}</b><span>{reportBirth.date} · {reportBirth.time} · {resolvedPlace}</span></div><div className="toolbarButtons"><button className="newProfileButton" type="button" onClick={() => { setChart(null); setStatus("idle"); setActiveSection("profile"); setTimeout(() => document.getElementById("birth-form")?.scrollIntoView({ behavior: "smooth" }), 50); }}>＋ {language === "si" ? "නව පැතිකඩ" : "New profile"}</button><button type="button" onClick={downloadPdf} disabled={pdfStatus === "working"}><span>⇩</span>{pdfStatus === "working" ? t.preparingPdf : pdfStatus === "error" ? (language === "si" ? "නැවත උත්සාහ කරන්න" : "Please try again") : t.downloadPdf}</button></div></div>
        <div className="reportHeader">
          <div><p className="eyebrow"><span>✦</span>MY ASTRO GUIDE</p><h2>{reportName || t.chartTitle}</h2><p>{t.chartTitle} · {reportBirth.date} · {reportBirth.time}</p><p>{t.locationLabel}: {resolvedPlace}</p></div>
          <div className="reportFacts">
            <span><small>{t.ascendant}</small><b>{language === "si" ? chart.ascendant.signSi : chart.ascendant.signEn}</b></span>
            <span><small>{t.moonStar}</small><b>{language === "si" ? chart.moonNakshatra.si : chart.moonNakshatra.en} · {chart.moonNakshatra.pada}</b></span>
            <span><small>{t.ayanamsa}</small><b>{chart.ayanamsa.toFixed(2)}°</b></span>
          </div>
        </div>
        <nav className="workspaceTabs" data-html2canvas-ignore="true" aria-label="Profile sections">
          <button className={activeSection === "profile" ? "active" : ""} type="button" onClick={() => setActiveSection("profile")}><span>▦</span><b>{language === "si" ? "ජන්ම පත්‍රය" : "Astro Data"}</b><small>{language === "si" ? "පිහිටීම් සහ ග්‍රහ බල" : "Charts & power"}</small></button>
          <button className={activeSection === "guide" ? "active" : ""} type="button" onClick={() => setActiveSection("guide")}><span>✦</span><b>{language === "si" ? "ජීවන විග්‍රහය" : "Life Guide"}</b><small>{language === "si" ? "සමස්ත ජීවන වාර්තාව" : "Complete AI report"}</small></button>
          <button className={activeSection === "chat" ? "active" : ""} type="button" onClick={() => setActiveSection("chat")}><span>◌</span><b>{language === "si" ? "විමසන්න" : "Ask Guide"}</b><small>{language === "si" ? "ඔබේ ජන්ම පත්‍රය අනුව" : "Personal AI chat"}</small></button>
          <button className={activeSection === "saved" ? "active" : ""} type="button" onClick={() => setActiveSection("saved")}><span>◎</span><b>{language === "si" ? "සුරැකි පැතිකඩ" : "My Profiles"}</b><small>{language === "si" ? "පැතිකඩ සහ PDF" : "Save & reports"}</small></button>
        </nav>
        <div className={`appPane guidePane ${activeSection === "guide" ? "active" : ""}`}><HolisticGuide chart={chart} language={language} /></div>
        <div className={`appPane chatPane ${activeSection === "chat" ? "active" : ""}`}><AstroChat chart={chart} language={language} /></div>
        <div className={`appPane savedPane ${activeSection === "saved" ? "active" : ""}`}><ProfileLibrary language={language} current={{ name: reportName || "Astro Profile", birthDate: reportBirth.date, birthTime: reportBirth.time, place: resolvedPlace, chart }} onLoad={loadSavedProfile} onDownload={downloadPdf} /></div>
        <div className={`appPane astroDataPane ${activeSection === "profile" ? "active" : ""}`}>
        <div className="technicalBridge"><span>✦</span><div><p>{language === "si" ? "ජන්ම පත්‍ර ගණනය" : "EVIDENCE & CALCULATIONS"}</p><h2>{language === "si" ? "ග්‍රහ පිහිටීම් සහ බල මිනුම්" : "Detailed astrology profile"}</h2></div></div>
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
            <div><h4>{language === "si" ? area.titleSi : area.titleEn}</h4><p className="dataOnlyLabel">{language === "si" ? "ජන්ම පත්‍රයට සාපේක්ෂ බලය" : "Relative power measurement"}</p><ul>{(language === "si" ? area.factorsSi : area.factorsEn).map((factor) => <li key={factor}>{factor}</li>)}</ul></div>
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
            <div className="yogaList yogaDataList">{chart.yogas.length ? chart.yogas.map((yoga) => <article key={yoga.key}><span>✦</span><div><h4>{language === "si" ? yoga.nameSi : yoga.nameEn} <em>{yoga.power}/100</em></h4><p>{language === "si" ? yoga.descriptionSi : yoga.descriptionEn}</p><small>{yoga.planets.join(" · ")} · {yoga.grade}</small></div></article>) : <p>{t.none}</p>}</div>
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

        <section className="methodology"><span>ⓘ</span><div><h3>{t.methodology}</h3><p>All scores are relative power measurements within this birth chart, calculated from houses, lords, occupants, dignity, aspects and detected yogas. This Astro Data section does not interpret life results. Open Life Guide for the complete AI-polished report.</p></div></section>
        <p className="calculationNote">Astronomical positions use Astronomy Engine (MIT), Lahiri sidereal conversion, whole-sign houses, Sri Lankan fixed-house display, Parashari aspects and 365.2425-day Vimshottari timing. This section presents calculated data and relative power measurements—not life predictions. Professional use requires independent ephemeris validation.</p>
        </div>
      </section>}

      <nav className="mobileAppNav" aria-label="Mobile app navigation">
        <button type="button" className={activeSection === "profile" ? "active" : ""} disabled={!chart} onClick={() => { setActiveSection("profile"); document.getElementById("chart")?.scrollIntoView({ behavior: "smooth" }); }}><span>▦</span>{language === "si" ? "පත්‍රය" : "Data"}</button>
        <button type="button" className={activeSection === "guide" ? "active" : ""} disabled={!chart} onClick={() => { setActiveSection("guide"); document.getElementById("chart")?.scrollIntoView({ behavior: "smooth" }); }}><span>✦</span>{language === "si" ? "විග්‍රහය" : "Guide"}</button>
        <button type="button" className={activeSection === "chat" ? "active" : ""} disabled={!chart} onClick={() => { setActiveSection("chat"); document.getElementById("chart")?.scrollIntoView({ behavior: "smooth" }); }}><span>◌</span>{language === "si" ? "අසන්න" : "Ask"}</button>
        <button type="button" className={activeSection === "saved" ? "active" : ""} disabled={!chart} onClick={() => { setActiveSection("saved"); document.getElementById("chart")?.scrollIntoView({ behavior: "smooth" }); }}><span>◎</span>{language === "si" ? "සුරැකි" : "Profiles"}</button>
      </nav>

      <footer className="shell"><span>MY ASTRO GUIDE</span><p>Vedic wisdom · Modern clarity · Personal guidance</p><small>For reflective guidance, not medical, legal or financial advice.</small></footer>
    </main>
  );
}
