import * as Astronomy from "astronomy-engine";

const SIGNS_EN = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const SIGNS_SI = ["මේෂ", "වෘෂභ", "මිථුන", "කටක", "සිංහ", "කන්‍යා", "තුලා", "වෘශ්චික", "ධනු", "මකර", "කුම්භ", "මීන"];
const NAKSHATRAS_EN = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"];
const NAKSHATRAS_SI = ["අස්විද", "බෙරණ", "කැති", "රෙහෙණ", "මුවසිරස", "අද", "පුනාවස", "පුෂ", "අස්ලිස", "මා", "පුවපල්", "උත්‍රපල්", "හත", "සිත", "සා", "විසා", "අනුර", "දෙට", "මුල", "පුවසල", "උත්‍රසල", "සුවණ", "දෙනට", "සියාවස", "පුවපුටුප", "උත්‍රපුටුප", "රේවතී"];

export type ChartPlanet = {
  key: string;
  nameEn: string;
  nameSi: string;
  longitude: number;
  degree: number;
  signIndex: number;
  signEn: string;
  signSi: string;
  house: number;
  nakshatraEn: string;
  nakshatraSi: string;
  pada: number;
  retrograde: boolean;
  dignity: "exalted" | "own" | "debilitated" | "neutral";
  strength: number;
  combust: boolean;
  powerGrade: "Very strong" | "Strong" | "Balanced" | "Challenged";
  powerFactors: string[];
};

export type ChartAspect = { from: string; fromSi: string; to: string; toSi: string; aspectHouse: number; kindEn: string; kindSi: string; power: number; grade: string };
export type ChartYoga = { key: string; nameEn: string; nameSi: string; descriptionEn: string; descriptionSi: string; planets: string[]; power: number; grade: string };
export type Panchanga = { weekdayEn: string; weekdaySi: string; tithiEn: string; tithiSi: string; pakshaEn: string; pakshaSi: string; karana: string; yogaEn: string; yogaSi: string };
export type ConditionFlag = { key: string; nameEn: string; nameSi: string; detected: boolean; detailEn: string; detailSi: string; power: number };
export type HouseProfile = { house: number; signEn: string; signSi: string; lordEn: string; lordSi: string; lordHouse: number; occupantsEn: string[]; occupantsSi: string[]; score: number };
export type DashaPeriod = { lordEn: string; lordSi: string; start: string; end: string; active: boolean };
export type LifeArea = { key: string; titleEn: string; titleSi: string; score: number; summaryEn: string; summarySi: string; factorsEn: string[]; factorsSi: string[] };

export type VedicChart = {
  utcIso: string;
  timezone: string;
  ayanamsa: number;
  ascendant: ChartPlanet;
  planets: ChartPlanet[];
  moonNakshatra: { en: string; si: string; pada: number };
  houses: HouseProfile[];
  aspects: ChartAspect[];
  conjunctions: Array<{ planetsEn: string[]; planetsSi: string[]; signEn: string; signSi: string }>;
  yogas: ChartYoga[];
  dasha: { currentMaha: DashaPeriod | null; currentAntar: DashaPeriod | null; currentPratyantar: DashaPeriod | null; timeline: DashaPeriod[]; antardashas: DashaPeriod[] };
  panchanga: Panchanga;
  conditions: ConditionFlag[];
  lifeAreas: LifeArea[];
  navamsa: { ascendant: ChartPlanet; planets: ChartPlanet[] };
  transits: { calculatedAt: string; planets: ChartPlanet[] };
};

const normalize = (value: number) => ((value % 360) + 360) % 360;
const radians = (value: number) => value * Math.PI / 180;
const degrees = (value: number) => value * 180 / Math.PI;

function partsAt(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  return Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, Number(part.value)]));
}

export function localBirthTimeToUtc(date: string, time: string, timezone: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const wanted = Date.UTC(year, month - 1, day, hour, minute, 0);
  let guess = new Date(wanted);
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const seen = partsAt(guess, timezone);
    const represented = Date.UTC(seen.year, seen.month - 1, seen.day, seen.hour, seen.minute, seen.second);
    guess = new Date(guess.getTime() + wanted - represented);
  }
  return guess;
}

function lahiriAyanamsa(utc: Date) {
  const jd = utc.getTime() / 86400000 + 2440587.5;
  const centuries = (jd - 2451545.0) / 36525;
  return 23.8530556 + 1.396042 * centuries + 0.000308 * centuries * centuries;
}

function meanRahuLongitude(utc: Date) {
  const jd = utc.getTime() / 86400000 + 2440587.5;
  const t = (jd - 2451545.0) / 36525;
  return normalize(125.0445479 - 1934.1362891 * t + 0.0020754 * t * t + (t * t * t) / 467441 - (t ** 4) / 60616000);
}

function tropicalAscendant(utc: Date, latitude: number, longitude: number) {
  const jd = utc.getTime() / 86400000 + 2440587.5;
  const t = (jd - 2451545.0) / 36525;
  const obliquity = radians(23.43929111 - 0.013004167 * t - 0.000000164 * t * t + 0.000000504 * t ** 3);
  const lst = radians(normalize(Astronomy.SiderealTime(utc) * 15 + longitude));
  const latitudeRad = radians(Math.max(-89.9, Math.min(89.9, latitude)));
  // atan2 yields the western intersection of the ecliptic; the ascendant is
  // the opposite, eastern intersection. The missing 180° rotation previously
  // produced the descendant sign (for example Capricorn instead of Cancer).
  return normalize(degrees(Math.atan2(-Math.cos(lst), Math.sin(lst) * Math.cos(obliquity) + Math.tan(latitudeRad) * Math.sin(obliquity))) + 180);
}

const SIGN_LORDS = ["mars", "venus", "mercury", "moon", "sun", "mercury", "venus", "mars", "jupiter", "saturn", "saturn", "jupiter"];
const PLANET_LABELS: Record<string, [string, string]> = {
  sun: ["Sun", "රවි"], moon: ["Moon", "චන්ද්‍ර"], mercury: ["Mercury", "බුධ"], venus: ["Venus", "සිකුරු"],
  mars: ["Mars", "කුජ"], jupiter: ["Jupiter", "ගුරු"], saturn: ["Saturn", "ශනි"], rahu: ["Rahu", "රාහු"], ketu: ["Ketu", "කේතු"],
};
const OWN_SIGNS: Record<string, number[]> = { sun: [4], moon: [3], mercury: [2, 5], venus: [1, 6], mars: [0, 7], jupiter: [8, 11], saturn: [9, 10] };
const EXALTED: Record<string, number> = { sun: 0, moon: 1, mercury: 5, venus: 11, mars: 9, jupiter: 3, saturn: 6, rahu: 1, ketu: 7 };
const DEBILITATED: Record<string, number> = { sun: 6, moon: 7, mercury: 11, venus: 5, mars: 3, jupiter: 9, saturn: 0, rahu: 7, ketu: 1 };

function dignityFor(key: string, signIndex: number): ChartPlanet["dignity"] {
  if (EXALTED[key] === signIndex) return "exalted";
  if (DEBILITATED[key] === signIndex) return "debilitated";
  if (OWN_SIGNS[key]?.includes(signIndex)) return "own";
  return "neutral";
}

function record(key: string, nameEn: string, nameSi: string, longitude: number, lagnaSign: number, retrograde = false): ChartPlanet {
  const clean = normalize(longitude);
  const signIndex = Math.floor(clean / 30);
  const nakIndex = Math.floor(clean / (360 / 27));
  const pada = Math.floor((clean % (360 / 27)) / (360 / 108)) + 1;
  const house = ((signIndex - lagnaSign + 12) % 12) + 1;
  const dignity = dignityFor(key, signIndex);
  const factors = [dignity === "neutral" ? "Neutral sign placement" : `${dignity[0].toUpperCase()}${dignity.slice(1)} sign`];
  let raw = 50 + (dignity === "exalted" ? 28 : dignity === "own" ? 18 : dignity === "debilitated" ? -22 : 0);
  if ([1, 4, 7, 10].includes(house)) { raw += 10; factors.push("Kendra house support"); }
  if ([5, 9].includes(house)) { raw += 9; factors.push("Trikona house support"); }
  if ([3, 6, 10, 11].includes(house)) { raw += 5; factors.push("Upachaya growth house"); }
  if (retrograde && !["sun", "moon", "rahu", "ketu"].includes(key)) { raw += 5; factors.push("Retrograde motion / cheshta emphasis"); }
  const strength = Math.round(Math.max(15, Math.min(96, raw)));
  const powerGrade = strength >= 80 ? "Very strong" : strength >= 65 ? "Strong" : strength >= 45 ? "Balanced" : "Challenged";
  return {
    key, nameEn, nameSi, longitude: Number(clean.toFixed(4)), degree: Number((clean % 30).toFixed(2)), signIndex,
    signEn: SIGNS_EN[signIndex], signSi: SIGNS_SI[signIndex], house,
    nakshatraEn: NAKSHATRAS_EN[nakIndex], nakshatraSi: NAKSHATRAS_SI[nakIndex], pada, retrograde, dignity, strength, combust: false, powerGrade, powerFactors: factors,
  };
}

function angularDistance(a: number, b: number) { const distance = Math.abs(normalize(a - b)); return Math.min(distance, 360 - distance); }
function addYears(date: Date, years: number) { return new Date(date.getTime() + years * 365.2425 * 86400000); }

function calculateDashas(moonLongitude: number, birth: Date) {
  const order = ["ketu", "venus", "sun", "moon", "mars", "rahu", "jupiter", "saturn", "mercury"];
  const years: Record<string, number> = { ketu: 7, venus: 20, sun: 6, moon: 10, mars: 7, rahu: 18, jupiter: 16, saturn: 19, mercury: 17 };
  const nakSize = 360 / 27;
  const nakIndex = Math.floor(normalize(moonLongitude) / nakSize);
  const firstIndex = nakIndex % 9;
  const elapsedFraction = (normalize(moonLongitude) % nakSize) / nakSize;
  let cursor = addYears(birth, -years[order[firstIndex]] * elapsedFraction);
  const timeline: DashaPeriod[] = [];
  const now = new Date();
  for (let i = 0; i < 12; i += 1) {
    const key = order[(firstIndex + i) % 9];
    const end = addYears(cursor, years[key]);
    timeline.push({ lordEn: PLANET_LABELS[key][0], lordSi: PLANET_LABELS[key][1], start: cursor.toISOString(), end: end.toISOString(), active: now >= cursor && now < end });
    cursor = end;
  }
  const currentMaha = timeline.find((period) => period.active) || null;
  let currentAntar: DashaPeriod | null = null;
  let currentPratyantar: DashaPeriod | null = null;
  const antardashas: DashaPeriod[] = [];
  if (currentMaha) {
    const mahaKey = Object.keys(PLANET_LABELS).find((key) => PLANET_LABELS[key][0] === currentMaha.lordEn)!;
    let antarCursor = new Date(currentMaha.start);
    const mahaYears = years[mahaKey];
    const mahaIndex = order.indexOf(mahaKey);
    for (let i = 0; i < 9; i += 1) {
      const key = order[(mahaIndex + i) % 9];
      const end = addYears(antarCursor, mahaYears * years[key] / 120);
      const period = { lordEn: PLANET_LABELS[key][0], lordSi: PLANET_LABELS[key][1], start: antarCursor.toISOString(), end: end.toISOString(), active: now >= antarCursor && now < end };
      antardashas.push(period);
      if (period.active) currentAntar = period;
      antarCursor = end;
    }
  }
  if (currentAntar) {
    const antarKey = Object.keys(PLANET_LABELS).find((key) => PLANET_LABELS[key][0] === currentAntar!.lordEn)!;
    const antarStart = new Date(currentAntar.start); const antarEnd = new Date(currentAntar.end);
    let cursor = antarStart; const span = antarEnd.getTime() - antarStart.getTime(); const startIndex = order.indexOf(antarKey);
    for (let i = 0; i < 9; i += 1) {
      const key = order[(startIndex + i) % 9]; const end = new Date(cursor.getTime() + span * years[key] / 120);
      if (now >= cursor && now < end) currentPratyantar = { lordEn: PLANET_LABELS[key][0], lordSi: PLANET_LABELS[key][1], start: cursor.toISOString(), end: end.toISOString(), active: true };
      cursor = end;
    }
  }
  return { currentMaha, currentAntar, currentPratyantar, timeline, antardashas };
}

function buildAspects(planets: ChartPlanet[]) {
  const aspects: ChartAspect[] = [];
  const ordinal=(value:number)=>`${value}${value===3?"rd":value===1?"st":value===2?"nd":"th"}`;
  const offsets: Record<string, number[]> = { mars: [4, 7, 8], jupiter: [5, 7, 9], saturn: [3, 7, 10], rahu: [5, 7, 9], ketu: [5, 7, 9] };
  for (const from of planets) {
    for (const offset of offsets[from.key] || [7]) {
      const targetHouse = ((from.house + offset - 2) % 12) + 1;
      for (const to of planets.filter((planet) => planet.house === targetHouse && planet.key !== from.key)) {
        const power = Math.round(Math.max(25, Math.min(95, (from.strength * .65 + to.strength * .35) - (offset === 7 ? 0 : 4))));
        aspects.push({ from: from.nameEn, fromSi: from.nameSi, to: to.nameEn, toSi: to.nameSi, aspectHouse: offset, kindEn: `${ordinal(offset)}-house Vedic aspect`, kindSi: `${offset} වන භාව දෘෂ්ටිය`, power, grade: power >= 75 ? "Strong" : power >= 55 ? "Moderate" : "Mild" });
      }
    }
  }
  return aspects;
}

function buildYogas(planets: ChartPlanet[], aspects: ChartAspect[], lagnaSign: number) {
  const by = (key: string) => planets.find((planet) => planet.key === key)!;
  const sameSign = (a: string, b: string) => by(a).signIndex === by(b).signIndex;
  const houseDistance = (a: string, b: string) => ((by(b).house - by(a).house + 12) % 12) + 1;
  const linked = (a: string, b: string) => sameSign(a, b) || aspects.some((aspect) => aspect.from === by(a).nameEn && aspect.to === by(b).nameEn);
  const yogas: ChartYoga[] = [];
  const add = (key: string, nameEn: string, nameSi: string, descriptionEn: string, descriptionSi: string, keys: string[]) => {
    const power = Math.round(keys.reduce((sum, key) => sum + by(key).strength, 0) / keys.length);
    yogas.push({ key, nameEn, nameSi, descriptionEn, descriptionSi, planets: keys.map((key) => PLANET_LABELS[key][0]), power, grade: power >= 75 ? "Strong" : power >= 55 ? "Moderate" : "Subtle" });
  };
  if ([1, 4, 7, 10].includes(houseDistance("moon", "jupiter"))) add("gaja-kesari", "Gaja Kesari Yoga", "ගජකේසරි යෝගය", "Moon and Jupiter form a kendra relationship.", "චන්ද්‍රයා සහ ගුරු කේන්ද්‍ර සම්බන්ධතාවයක සිටී.", ["moon", "jupiter"]);
  if (sameSign("sun", "mercury")) add("budha-aditya", "Budha Aditya Yoga", "බුධ ආදිත්‍ය යෝගය", "Sun and Mercury occupy one sign.", "රවි සහ බුධ එකම රාශියේ සිටී.", ["sun", "mercury"]);
  if (sameSign("moon", "mars") || houseDistance("moon", "mars") === 7) add("chandra-mangala", "Chandra Mangala Yoga", "චන්ද්‍ර මංගල යෝගය", "Moon and Mars form a strong link.", "චන්ද්‍රයා සහ කුජ ශක්තිමත් සම්බන්ධයක් සාදයි.", ["moon", "mars"]);
  if (sameSign("jupiter", "mars")) add("guru-mangala", "Guru Mangala Yoga", "ගුරු මංගල යෝගය", "Jupiter and Mars combine in one sign.", "ගුරු සහ කුජ එකම රාශියේ එක්වේ.", ["jupiter", "mars"]);
  const ninthLord = SIGN_LORDS[(lagnaSign + 8) % 12], tenthLord = SIGN_LORDS[(lagnaSign + 9) % 12];
  if (ninthLord !== tenthLord && linked(ninthLord, tenthLord)) add("dharma-karma", "Dharma–Karma Adhipati Yoga", "ධර්ම–කර්ම අධිපති යෝගය", "The ninth and tenth lords are joined or mutually aspected.", "නවවන සහ දසවන අධිපතීන් සම්බන්ධ වේ.", [ninthLord, tenthLord]);
  const maha: Array<[string,string,string]> = [["mars","Ruchaka","රුචක"],["mercury","Bhadra","භද්‍ර"],["jupiter","Hamsa","හංස"],["venus","Malavya","මාලව්‍ය"],["saturn","Sasa","ශශ"]];
  maha.forEach(([key,en,si]) => { const p=by(key); if ([1,4,7,10].includes(p.house) && ["own","exalted"].includes(p.dignity)) add(`maha-${key}`,`${en} Mahapurusha Yoga`,`${si} මහාපුරුෂ යෝගය`,`${p.nameEn} is dignified in a kendra.`,`${p.nameSi} කේන්ද්‍රයක බලවත් ලෙස සිටී.`,[key]); });
  const moonSign=by("moon").signIndex; const rel=(p:ChartPlanet)=>((p.signIndex-moonSign+12)%12)+1; const lunarPlanets=planets.filter(p=>!["sun","moon","rahu","ketu"].includes(p.key));
  const second=lunarPlanets.filter(p=>rel(p)===2), twelfth=lunarPlanets.filter(p=>rel(p)===12);
  if(second.length) add("sunapha","Sunapha Yoga","සුනාඵා යෝගය","A planet occupies the second sign from the Moon.","චන්ද්‍රයාගෙන් දෙවන රාශියේ ග්‍රහයෙකු සිටී.",second.map(p=>p.key));
  if(twelfth.length) add("anapha","Anapha Yoga","අනාඵා යෝගය","A planet occupies the twelfth sign from the Moon.","චන්ද්‍රයාගෙන් දොළොස්වන රාශියේ ග්‍රහයෙකු සිටී.",twelfth.map(p=>p.key));
  if(second.length&&twelfth.length) add("durudhara","Durudhara Yoga","දුරුධරා යෝගය","Planets flank the Moon on both sides.","ග්‍රහයන් චන්ද්‍රයා දෙපස සිටී.",[...second,...twelfth].map(p=>p.key));
  if(!second.length&&!twelfth.length) add("kemadruma","Kemadruma condition","කේමද්‍රුම තත්ත්වය","No classical planet occupies the second or twelfth sign from the Moon.","චන්ද්‍රයාගෙන් දෙවන හෝ දොළොස්වන රාශියේ සම්භාව්‍ය ග්‍රහයෙකු නැත.",["moon"]);
  const benefics=planets.filter(p=>["mercury","venus","jupiter"].includes(p.key));
  const adhi=benefics.filter(p=>[6,7,8].includes(rel(p))); if(adhi.length>=2) add("adhi","Adhi Yoga","අධි යෝගය","Benefics occupy the sixth, seventh or eighth from the Moon.","ශුභ ග්‍රහයන් චන්ද්‍රයාගෙන් 6, 7 හෝ 8 පිහිටයි.",adhi.map(p=>p.key));
  const vasumati=benefics.filter(p=>[3,6,10,11].includes(p.house)); if(vasumati.length>=2) add("vasumati","Vasumati Yoga","වසූමතී යෝගය","Benefics occupy growth houses from Lagna.","ශුභ ග්‍රහයන් ලග්නයෙන් උපචය භාවවල සිටී.",vasumati.map(p=>p.key));
  const amala=benefics.filter(p=>p.house===10||rel(p)===10); if(amala.length) add("amala","Amala Yoga","අමල යෝගය","A benefic influences the tenth from Lagna or Moon.","ශුභ ග්‍රහයෙකු ලග්නයෙන් හෝ චන්ද්‍රයාගෙන් දසවැන්න බලගන්වයි.",amala.map(p=>p.key));
  const lords=(houses:number[])=>houses.map(h=>SIGN_LORDS[(lagnaSign+h-1)%12]);
  const wealth=lords([2,5,9,11]); outer: for(let i=0;i<wealth.length;i++) for(let j=i+1;j<wealth.length;j++) if(wealth[i]!==wealth[j]&&linked(wealth[i],wealth[j])) { add("dhana","Dhana Yoga link","ධන යෝග සම්බන්ධය","Two wealth-producing house lords are connected.","ධනදායක භාව අධිපතීන් දෙදෙනෙකු සම්බන්ධ වේ.",[wealth[i],wealth[j]]); break outer; }
  const kendras=lords([1,4,7,10]), trines=lords([1,5,9]); outer2: for(const k of kendras) for(const tr of trines) if(k!==tr&&linked(k,tr)) { add("raja","Raja Yoga link","රාජ යෝග සම්බන්ධය","Kendra and trikona lords are connected.","කේන්ද්‍ර සහ ත්‍රිකෝණ අධිපතීන් සම්බන්ධ වේ.",[k,tr]); break outer2; }
  const exchanges:string[]=[]; for(const a of planets.filter(p=>!['rahu','ketu'].includes(p.key))) { const lord=SIGN_LORDS[a.signIndex]; const b=by(lord); if(b&&SIGN_LORDS[b.signIndex]===a.key&&a.key!==b.key) exchanges.push(a.key,b.key); } if(exchanges.length) add("parivartana","Parivartana Yoga","පරිවර්තන යෝගය","Two planets exchange signs.","ග්‍රහයන් දෙදෙනෙක් රාශි හුවමාරු කරයි.",[...new Set(exchanges)]);
  return yogas;
}

function buildHouses(planets: ChartPlanet[], lagnaSign: number): HouseProfile[] {
  return Array.from({ length: 12 }, (_, index) => {
    const house = index + 1;
    const signIndex = (lagnaSign + index) % 12;
    const lordKey = SIGN_LORDS[signIndex];
    const lord = planets.find((planet) => planet.key === lordKey)!;
    const occupants = planets.filter((planet) => planet.house === house);
    let score = 50 + (lord.strength - 50) * .65;
    if ([1, 5, 9, 10, 11].includes(lord.house)) score += 7;
    if ([6, 8, 12].includes(lord.house)) score -= 7;
    for (const planet of occupants) {
      const benefic = ["jupiter", "venus", "mercury", "moon"].includes(planet.key);
      const challenging = ["saturn", "mars", "rahu", "ketu"].includes(planet.key);
      score += (planet.strength - 50) * .35 + (benefic ? 6 : challenging ? -5 : 1);
      if (challenging && [3, 6, 10, 11].includes(house)) score += 5;
    }
    score = Math.max(18, Math.min(94, score));
    return { house, signEn: SIGNS_EN[signIndex], signSi: SIGNS_SI[signIndex], lordEn: lord.nameEn, lordSi: lord.nameSi, lordHouse: lord.house, occupantsEn: occupants.map((planet) => planet.nameEn), occupantsSi: occupants.map((planet) => planet.nameSi), score: Math.round(score) };
  });
}

function buildLifeAreas(houses: HouseProfile[], planets: ChartPlanet[], aspects: ChartAspect[], yogas: ChartYoga[]): LifeArea[] {
  const groups = [
    ["identity", "Identity & life direction", "පෞරුෂය සහ ජීවන දිශාව", [1, 5, 9]],
    ["career", "Career & public role", "වෘත්තිය සහ සමාජ භූමිකාව", [2, 6, 10, 11]],
    ["wealth", "Wealth & resources", "ධනය සහ සම්පත්", [2, 5, 9, 11]],
    ["relationships", "Relationships & partnership", "සබඳතා සහ හවුල්කාරිත්වය", [2, 7, 8]],
    ["home", "Home, family & property", "නිවස, පවුල සහ දේපළ", [2, 4]],
    ["health", "Health & resilience", "සෞඛ්‍යය සහ ඔරොත්තු දීම", [1, 6, 8]],
    ["learning", "Learning & creativity", "ඉගෙනීම සහ නිර්මාණශීලීත්වය", [3, 5, 9]],
    ["spiritual", "Inner growth & spirituality", "අභ්‍යන්තර වර්ධනය සහ ආධ්‍යාත්මිකත්වය", [5, 8, 9, 12]],
  ] as const;
  return groups.map(([key, titleEn, titleSi, houseNumbers]) => {
    const selected = houseNumbers.map((number) => houses[number - 1]);
    const primaryWeight = .46;
    const secondaryWeight = selected.length > 1 ? (1 - primaryWeight) / (selected.length - 1) : 0;
    let raw = selected.reduce((sum, house, index) => sum + house.score * (index === 0 ? primaryWeight : secondaryWeight), 0);
    const relevantPlanets = planets.filter(planet => houseNumbers.includes(planet.house as never));
    for (const aspect of aspects) {
      const target = planets.find(planet => planet.nameEn === aspect.to);
      if (!target || !houseNumbers.includes(target.house as never)) continue;
      raw += (["Jupiter", "Venus", "Mercury", "Moon"].includes(aspect.from) ? 1 : -1) * (aspect.power / 100) * 4;
    }
    const yogaAreas: Record<string, string[]> = {
      "gaja-kesari":["identity","career","learning"], "budha-aditya":["career","learning"], "chandra-mangala":["wealth","career"],
      "guru-mangala":["career","wealth"], "dharma-karma":["career","identity"], dhana:["wealth"], raja:["career","identity"],
      vasumati:["wealth","career"], amala:["career"], adhi:["career","health"], parivartana:["identity"], kemadruma:["relationships","home"],
    };
    for (const yoga of yogas) if (yogaAreas[yoga.key]?.includes(key)) raw += (yoga.key === "kemadruma" ? -1 : 1) * (5 + yoga.power / 20);
    raw += relevantPlanets.reduce((sum, planet) => sum + (planet.strength - 50) * .08, 0);
    const score = Math.round(Math.max(18, Math.min(94, 50 + (raw - 50) * 1.45)));
    const strongest = [...selected].sort((a, b) => b.score - a.score)[0];
    return { key, titleEn, titleSi, score, summaryEn: `${score >= 70 ? "This is a stronger" : score < 42 ? "This is a more demanding" : "This is a developing"} area of the chart. House ${strongest.house} provides the clearest support.`, summarySi: `${score >= 70 ? "මෙය ජන්ම පත්‍රයේ වඩාත් ශක්තිමත්" : score < 42 ? "මෙය වැඩි උත්සාහයක් අවශ්‍ය" : "මෙය වර්ධනය වෙමින් පවතින"} ජීවන අංශයකි. ${strongest.house} වන භාවයෙන් ප්‍රධාන සහාය ලැබේ.`, factorsEn: selected.map((house) => `House ${house.house}: ${house.score}/100 · lord ${house.lordEn} in house ${house.lordHouse}${house.occupantsEn.length ? ` · ${house.occupantsEn.join(", ")}` : ""}`), factorsSi: selected.map((house) => `${house.house} භාවය: ${house.score}/100 · අධිපති ${house.lordSi} ${house.lordHouse} භාවයේ${house.occupantsSi.length ? ` · ${house.occupantsSi.join(", ")}` : ""}`) };
  });
}

function navamsaRecord(planet: ChartPlanet, navamsaLagnaSign: number) {
  const part = Math.floor(planet.degree / (30 / 9));
  const start = [0, 3, 6, 9].includes(planet.signIndex) ? planet.signIndex : [1, 4, 7, 10].includes(planet.signIndex) ? (planet.signIndex + 8) % 12 : (planet.signIndex + 4) % 12;
  const signIndex = (start + part) % 12;
  const degree = (planet.degree * 9) % 30;
  return record(planet.key, planet.nameEn, planet.nameSi, signIndex * 30 + degree, navamsaLagnaSign, planet.retrograde);
}

function applyCombustion(planets: ChartPlanet[]): ChartPlanet[] {
  const sun=planets.find(p=>p.key==="sun")!;
  const limits:Record<string,number>={moon:12,mars:17,mercury:14,jupiter:11,venus:10,saturn:15};
  return planets.map(p=>{ const combust=limits[p.key]!==undefined&&angularDistance(p.longitude,sun.longitude)<=limits[p.key]; if(!combust)return p; const strength=Math.max(12,p.strength-15); const powerGrade: ChartPlanet["powerGrade"]=strength>=80?"Very strong":strength>=65?"Strong":strength>=45?"Balanced":"Challenged"; return {...p,combust,strength,powerGrade,powerFactors:[...p.powerFactors,"Combustion proximity to Sun"]}; });
}

function buildPanchanga(utc:Date,sun:ChartPlanet,moon:ChartPlanet):Panchanga {
  const weekdaysEn=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"], weekdaysSi=["ඉරිදා","සඳුදා","අඟහරුවාදා","බදාදා","බ්‍රහස්පතින්දා","සිකුරාදා","සෙනසුරාදා"];
  const tithis=["Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami","Shashthi","Saptami","Ashtami","Navami","Dashami","Ekadashi","Dwadashi","Trayodashi","Chaturdashi","Purnima / Amavasya"];
  const yogas=["Vishkambha","Priti","Ayushman","Saubhagya","Shobhana","Atiganda","Sukarma","Dhriti","Shula","Ganda","Vriddhi","Dhruva","Vyaghata","Harshana","Vajra","Siddhi","Vyatipata","Variyana","Parigha","Shiva","Siddha","Sadhya","Shubha","Shukla","Brahma","Indra","Vaidhriti"];
  const separation=normalize(moon.longitude-sun.longitude), tithiIndex=Math.floor(separation/12), waxing=tithiIndex<15, day=(tithiIndex%15)+1, yogaIndex=Math.floor(normalize(sun.longitude+moon.longitude)/(360/27));
  return {weekdayEn:weekdaysEn[utc.getUTCDay()],weekdaySi:weekdaysSi[utc.getUTCDay()],tithiEn:`${waxing?"Shukla":"Krishna"} ${tithis[day-1]}`,tithiSi:`${waxing?"ශුක්ල":"කෘෂ්ණ"} පක්ෂය · තිථි ${day}`,pakshaEn:waxing?"Shukla Paksha":"Krishna Paksha",pakshaSi:waxing?"ශුක්ල පක්ෂය":"කෘෂ්ණ පක්ෂය",karana:`Karana ${Math.floor(separation/6)+1}`,yogaEn:yogas[yogaIndex],yogaSi:`නිත්‍ය යෝගය ${yogaIndex+1}`};
}

function buildConditions(planets:ChartPlanet[],transits:ChartPlanet[],yogas:ChartYoga[]):ConditionFlag[]{
  const by=(key:string)=>planets.find(p=>p.key===key)!; const same=(a:string,b:string)=>angularDistance(by(a).longitude,by(b).longitude)<=8;
  const moonSign=by("moon").signIndex, saturnTransit=transits.find(p=>p.key==="saturn")!, saturnFromMoon=((saturnTransit.signIndex-moonSign+12)%12)+1;
  const arc=(x:number,start:number)=>normalize(x-start)<180; const classical=planets.filter(p=>!["rahu","ketu"].includes(p.key)); const kala=classical.every(p=>arc(p.longitude,by("rahu").longitude))||classical.every(p=>arc(p.longitude,by("ketu").longitude));
  const flag=(key:string,nameEn:string,nameSi:string,detected:boolean,detailEn:string,detailSi:string,power:number):ConditionFlag=>({key,nameEn,nameSi,detected,detailEn,detailSi,power});
  return [
    flag("manglik","Manglik / Kuja condition","කුජ දෝෂ තත්ත්වය",[1,2,4,7,8,12].includes(by("mars").house),`Mars is in house ${by("mars").house} from Lagna.`,`කුජ ලග්නයෙන් ${by("mars").house} භාවයේ සිටී.`,by("mars").strength),
    flag("sade-sati","Sade Sati transit check","ඒරාෂ්ටක ගෝචර පරීක්ෂාව",[12,1,2].includes(saturnFromMoon),`Transit Saturn is ${saturnFromMoon} from the natal Moon.`,`ගෝචර ශනි ජන්ම චන්ද්‍රයාගෙන් ${saturnFromMoon} වන ස්ථානයේය.`,saturnTransit.strength),
    flag("kala-sarpa","Kala Sarpa pattern","කාල සර්ප රටාව",kala,"All seven classical planets fall within one nodal half of the zodiac.","සම්භාව්‍ය ග්‍රහ හතම රාහු–කේතු අර්ධයක පිහිටයි.",kala?72:0),
    flag("guru-chandal","Guru Chandal conjunction","ගුරු චණ්ඩාල සම්බන්ධය",same("jupiter","rahu")||same("jupiter","ketu"),"Jupiter is within 8° of a lunar node.","ගුරු චන්ද්‍ර ගැටයකින් අංශක 8ක් ඇතුළතය.",by("jupiter").strength),
    flag("pitru","Sun–Rahu conjunction check","රවි–රාහු සම්බන්ධ පරීක්ෂාව",same("sun","rahu"),"Sun is within 8° of Rahu.","රවි රාහුගෙන් අංශක 8ක් ඇතුළතය.",by("sun").strength),
    flag("kemadruma","Kemadruma check","කේමද්‍රුම පරීක්ෂාව",yogas.some(y=>y.key==="kemadruma"),"No qualifying planet flanks the Moon in this rule set.","මෙම නියම අනුව චන්ද්‍රයා දෙපස සුදුසු ග්‍රහ නැත.",by("moon").strength)
  ];
}

function currentTransits(lagnaSign: number) {
  const now = new Date();
  const ayanamsa = lahiriAyanamsa(now);
  const bodies: Array<[string, string, string, Astronomy.Body]> = [
    ["sun", "Sun", "රවි", Astronomy.Body.Sun], ["moon", "Moon", "චන්ද්‍ර", Astronomy.Body.Moon],
    ["mercury", "Mercury", "බුධ", Astronomy.Body.Mercury], ["venus", "Venus", "සිකුරු", Astronomy.Body.Venus],
    ["mars", "Mars", "කුජ", Astronomy.Body.Mars], ["jupiter", "Jupiter", "ගුරු", Astronomy.Body.Jupiter], ["saturn", "Saturn", "ශනි", Astronomy.Body.Saturn],
  ];
  const planets = bodies.map(([key, en, si, body]) => {
    const tropical = Astronomy.Ecliptic(Astronomy.GeoVector(body, now, true)).elon;
    const next = Astronomy.Ecliptic(Astronomy.GeoVector(body, new Date(now.getTime() + 86400000), true)).elon;
    return record(key, en, si, tropical - ayanamsa, lagnaSign, (((next - tropical + 540) % 360) - 180) < 0);
  });
  const rahu = normalize(meanRahuLongitude(now) - ayanamsa);
  planets.push(record("rahu", "Rahu", "රාහු", rahu, lagnaSign));
  planets.push(record("ketu", "Ketu", "කේතු", rahu + 180, lagnaSign));
  return { calculatedAt: now.toISOString(), planets };
}

export function calculateVedicChart(input: { date: string; time: string; timezone: string; latitude: number; longitude: number }): VedicChart {
  const utc = localBirthTimeToUtc(input.date, input.time, input.timezone);
  const ayanamsa = lahiriAyanamsa(utc);
  const ascLongitude = normalize(tropicalAscendant(utc, input.latitude, input.longitude) - ayanamsa);
  const lagnaSign = Math.floor(ascLongitude / 30);
  const bodies: Array<[string, string, string, Astronomy.Body]> = [
    ["sun", "Sun", "රවි", Astronomy.Body.Sun], ["moon", "Moon", "චන්ද්‍ර", Astronomy.Body.Moon],
    ["mercury", "Mercury", "බුධ", Astronomy.Body.Mercury], ["venus", "Venus", "සිකුරු", Astronomy.Body.Venus],
    ["mars", "Mars", "කුජ", Astronomy.Body.Mars], ["jupiter", "Jupiter", "ගුරු", Astronomy.Body.Jupiter],
    ["saturn", "Saturn", "ශනි", Astronomy.Body.Saturn],
  ];
  let planets = bodies.map(([key, en, si, body]) => {
    const tropical = Astronomy.Ecliptic(Astronomy.GeoVector(body, utc, true)).elon;
    const next = Astronomy.Ecliptic(Astronomy.GeoVector(body, new Date(utc.getTime() + 86400000), true)).elon;
    const dailyMotion = ((next - tropical + 540) % 360) - 180;
    return record(key, en, si, tropical - ayanamsa, lagnaSign, dailyMotion < 0);
  });
  const rahu = normalize(meanRahuLongitude(utc) - ayanamsa);
  planets.push(record("rahu", "Rahu", "රාහු", rahu, lagnaSign));
  planets.push(record("ketu", "Ketu", "කේතු", rahu + 180, lagnaSign));
  planets = applyCombustion(planets);
  const moon = planets.find((planet) => planet.key === "moon")!;
  const sun = planets.find((planet) => planet.key === "sun")!;
  const aspects = buildAspects(planets);
  const houses = buildHouses(planets, lagnaSign);
  const conjunctions = Array.from({ length: 12 }, (_, signIndex) => planets.filter((planet) => planet.signIndex === signIndex)).filter((group) => group.length > 1).map((group) => ({ planetsEn: group.map((planet) => planet.nameEn), planetsSi: group.map((planet) => planet.nameSi), signEn: group[0].signEn, signSi: group[0].signSi }));
  const ascendant = record("ascendant", "Ascendant", "ලග්නය", ascLongitude, lagnaSign);
  const navamsaAsc = navamsaRecord(ascendant, 0);
  const navamsaLagnaSign = navamsaAsc.signIndex;
  const transits = currentTransits(lagnaSign);
  const yogas = buildYogas(planets, aspects, lagnaSign);
  return {
    utcIso: utc.toISOString(), timezone: input.timezone, ayanamsa: Number(ayanamsa.toFixed(4)),
    ascendant, planets,
    moonNakshatra: { en: moon.nakshatraEn, si: moon.nakshatraSi, pada: moon.pada }, houses, aspects, conjunctions,
    yogas, dasha: calculateDashas(moon.longitude, utc), panchanga: buildPanchanga(utc, sun, moon), conditions: buildConditions(planets, transits.planets, yogas), lifeAreas: buildLifeAreas(houses, planets, aspects, yogas),
    navamsa: { ascendant: navamsaRecord(ascendant, navamsaLagnaSign), planets: planets.map((planet) => navamsaRecord(planet, navamsaLagnaSign)) },
    transits,
  };
}
