"use client";

import { useEffect, useState } from "react";
import type { VedicChart } from "../lib/vedic-engine";

type Guide = {
  centralPattern: string;
  lifeDirection: string;
  coreStrengths: string[];
  growthEdges: string[];
  career: {
    direction: string;
    bestIndustries: Array<{ name: string; fit: string; why: string; roles: string[] }>;
    workStyle: string;
    growthStrategy: string;
    mainRisk: string;
  };
  money: string;
  relationships: string;
  homeAndFamily: string;
  healthAndBalance: string;
  internationalDirection: string;
  purposeAndContribution: string;
  currentChapter: string;
  decisionGuide: string;
  polishedDetails: {
    planets: Array<{ key: string; title: string; explanation: string; lifeImpact: string; guidance: string }>;
    yogas: Array<{ key: string; title: string; explanation: string; lifeImpact: string; guidance: string }>;
    lifeAreas: Array<{ key: string; title: string; explanation: string; guidance: string }>;
    activeConditions: Array<{ key: string; title: string; explanation: string; guidance: string }>;
  };
  priorities: string[];
  cautions: string[];
  ninetyDayPlan: string[];
  synthesisNote: string;
};

export default function HolisticGuide({ chart, language }: { chart: VedicChart; language: "en" | "si" }) {
  const [guide, setGuide] = useState<Guide | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/holistic-guide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chart, language }),
      signal: controller.signal,
    }).then(async response => {
      const data = await response.json() as { guide?: Guide; error?: string };
      if (!response.ok || !data.guide) throw new Error(data.error || "Unable to create report");
      setGuide(data.guide);
      setStatus("ready");
    }).catch(reason => {
      if (reason instanceof DOMException && reason.name === "AbortError") return;
      setError(reason instanceof Error ? reason.message : "Unable to create report");
      setStatus("error");
    });
    return () => controller.abort();
  }, [chart, language, retry]);

  if (status === "loading") return <section className="holisticGuide loadingGuide"><span className="guidePulse">✦</span><div><p>{language === "si" ? "ඔබේ සම්පූර්ණ ජන්ම පත්‍රය සංශ්ලේෂණය කරමින්" : "BUILDING YOUR COMPLETE LIFE GUIDE"}</p><h2>{language === "si" ? "ඔබේ සම්පූර්ණ ජීවන මාර්ගෝපදේශය සකසමින්…" : "Creating your full life-guide report…"}</h2><small>{language === "si" ? "සියලු ග්‍රහ, භාව, යෝග, බල, නවාංශ සහ දශා එකම ජීවන රටාවක් ලෙස සලකා බලයි." : "Considering every planet, house, yoga, strength, Navamsa and Dasha as one life pattern."}</small></div></section>;

  if (status === "error") return <section className="holisticGuide guideFailure"><h2>{language === "si" ? "සම්පූර්ණ AI ජීවන වාර්තාව" : "Complete AI life report"}</h2><p>{error}</p><button type="button" onClick={() => { setError(""); setStatus("loading"); setRetry(value => value + 1); }}>{language === "si" ? "නැවත උත්සාහ කරන්න" : "Try again"}</button></section>;
  if (!guide) return null;

  const sections = [
    { key: "money", icon: "◈", en: "Money & long-term security", si: "මුදල් සහ දිගුකාලීන ආරක්ෂාව", text: guide.money },
    { key: "relationships", icon: "♡", en: "Relationships & partnership", si: "සබඳතා සහ හවුල්කාරිත්වය", text: guide.relationships },
    { key: "family", icon: "⌂", en: "Home & family pattern", si: "නිවස සහ පවුල් රටාව", text: guide.homeAndFamily },
    { key: "health", icon: "◎", en: "Wellbeing, energy & balance", si: "යහපැවැත්ම, ශක්තිය සහ සමබරතාව", text: guide.healthAndBalance },
    { key: "international", icon: "↗", en: "International direction", si: "ජාත්‍යන්තර දිශාව", text: guide.internationalDirection },
    { key: "purpose", icon: "✦", en: "Purpose & contribution", si: "අරමුණ සහ දායකත්වය", text: guide.purposeAndContribution },
    { key: "timing", icon: "◷", en: "Your current life chapter", si: "ඔබේ වර්තමාන ජීවන පරිච්ඡේදය", text: guide.currentChapter },
    { key: "decisions", icon: "◇", en: "How to make your best decisions", si: "හොඳම තීරණ ගැනීමේ ක්‍රමය", text: guide.decisionGuide },
  ];

  return <section className="holisticGuide fullLifeGuide">
    <div className="holisticHero">
      <p>{language === "si" ? "සම්පූර්ණ ජීවන මාර්ගෝපදේශය · මුළු ජන්ම පත්‍රයෙන්" : "COMPLETE LIFE GUIDE · FROM YOUR WHOLE CHART"}</p>
      <h2>{language === "si" ? "ඔබේ මුළු ජීවිත රටාව" : "Your complete life pattern"}</h2>
      <span>{guide.centralPattern}</span>
    </div>

    <section className="lifeCompass">
      <div className="holisticTitle"><span>01</span><div><p>{language === "si" ? "ඔබේ ජීවන දිශාව" : "YOUR LIFE DIRECTION"}</p><h3>{language === "si" ? "ඔබ වර්ධනය වන්නේ කෙසේද" : "How your life develops best"}</h3></div></div>
      <p className="lifeDirectionText">{guide.lifeDirection}</p>
      <div className="strengthBalance">
        <article><h4>✦ {language === "si" ? "ඔබේ ස්වාභාවික ශක්ති" : "Your natural strengths"}</h4><ul>{guide.coreStrengths.map(item => <li key={item}>{item}</li>)}</ul></article>
        <article><h4>↗ {language === "si" ? "වර්ධනය කළ යුතු රටා" : "Patterns to develop"}</h4><ul>{guide.growthEdges.map(item => <li key={item}>{item}</li>)}</ul></article>
      </div>
    </section>

    <section className="careerDirection">
      <div className="holisticTitle"><span>02</span><div><p>{language === "si" ? "ප්‍රායෝගික වෘත්තීය දිශාව" : "PRACTICAL CAREER DIRECTION"}</p><h3>{language === "si" ? "ඔබට වඩාත් ගැළපෙන කාර්ය ක්ෂේත්‍ර" : "The work fields that fit you best"}</h3></div></div>
      <p className="careerLead">{guide.career.direction}</p>
      <div className="industryCards">{guide.career.bestIndustries.map((industry, index) => <article key={industry.name}><div><span>0{index + 1}</span><b>{industry.fit}</b></div><h4>{industry.name}</h4><p>{industry.why}</p><ul>{industry.roles.map(role => <li key={role}>{role}</li>)}</ul></article>)}</div>
      <div className="careerAnswers"><article><b>{language === "si" ? "හොඳම වැඩ කරන ආකාරය" : "Best working style"}</b><p>{guide.career.workStyle}</p></article><article><b>{language === "si" ? "වර්ධන උපායමාර්ගය" : "Growth strategy"}</b><p>{guide.career.growthStrategy}</p></article><article className="risk"><b>{language === "si" ? "ප්‍රධාන වෘත්තීය අවදානම" : "Main career risk"}</b><p>{guide.career.mainRisk}</p></article></div>
    </section>

    <div className="reportSectionTitle"><span>03</span><div><p>{language === "si" ? "සම්පූර්ණ ජීවන පැතිකඩ" : "YOUR WHOLE-LIFE MAP"}</p><h3>{language === "si" ? "ජීවිතයේ ප්‍රධාන ක්ෂේත්‍ර" : "The main areas of your life"}</h3></div></div>
    <div className="wholeLifeGrid">{sections.map(section => <article key={section.key}><span>{section.icon}</span><h3>{language === "si" ? section.si : section.en}</h3><p>{section.text}</p></article>)}</div>

    <div className="reportSectionTitle"><span>04</span><div><p>{language === "si" ? "AI සරල විස්තර" : "AI-POLISHED EXPLANATIONS"}</p><h3>{language === "si" ? "සෑම ගණනයක්ම ජීවිතයට අදහස් කරන්නේ කුමක්ද" : "What every calculation means for your life"}</h3></div></div>
    <section className="polishedEvidence">
      <div className="polishedGroup"><h3>{language === "si" ? "ග්‍රහ බලපෑම්" : "Planet influences"}</h3><div>{guide.polishedDetails.planets.map(item => <article key={item.key}><span>{item.title.slice(0, 2).toUpperCase()}</span><div><h4>{item.title}</h4><p>{item.explanation}</p><p><b>{language === "si" ? "ජීවිතයට බලපෑම:" : "Life impact:"}</b> {item.lifeImpact}</p><small><b>✓ {language === "si" ? "මඟපෙන්වීම:" : "Guidance:"}</b> {item.guidance}</small></div></article>)}</div></div>
      {!!guide.polishedDetails.yogas.length && <div className="polishedGroup"><h3>{language === "si" ? "යෝග සහ විශේෂ හැකියාවන්" : "Yogas and special patterns"}</h3><div>{guide.polishedDetails.yogas.map(item => <article key={item.key}><span>✦</span><div><h4>{item.title}</h4><p>{item.explanation}</p><p><b>{language === "si" ? "ජීවිතයට බලපෑම:" : "Life impact:"}</b> {item.lifeImpact}</p><small><b>✓ {language === "si" ? "මඟපෙන්වීම:" : "Guidance:"}</b> {item.guidance}</small></div></article>)}</div></div>}
      <div className="polishedGroup"><h3>{language === "si" ? "ජීවන ක්ෂේත්‍ර" : "Life areas"}</h3><div>{guide.polishedDetails.lifeAreas.map(item => <article key={item.key}><span>◇</span><div><h4>{item.title}</h4><p>{item.explanation}</p><small><b>✓ {language === "si" ? "මඟපෙන්වීම:" : "Guidance:"}</b> {item.guidance}</small></div></article>)}</div></div>
      {!!guide.polishedDetails.activeConditions.length && <div className="polishedGroup"><h3>{language === "si" ? "සක්‍රිය විශේෂ තත්ත්ව" : "Active special conditions"}</h3><div>{guide.polishedDetails.activeConditions.map(item => <article key={item.key}><span>!</span><div><h4>{item.title}</h4><p>{item.explanation}</p><small><b>✓ {language === "si" ? "සමබර කිරීම:" : "How to balance:"}</b> {item.guidance}</small></div></article>)}</div></div>}
    </section>

    <div className="reportSectionTitle"><span>05</span><div><p>{language === "si" ? "ප්‍රායෝගික මාර්ග සිතියම" : "YOUR PRACTICAL ROADMAP"}</p><h3>{language === "si" ? "දැනගැනීමෙන් ක්‍රියාවට" : "Turn understanding into action"}</h3></div></div>
    <div className="priorityGrid"><article><h3>✓ {language === "si" ? "දැන් ප්‍රමුඛත්වය දෙන්න" : "Priorities now"}</h3><ol>{guide.priorities.map(item => <li key={item}>{item}</li>)}</ol></article><article className="cautionList"><h3>! {language === "si" ? "සැලකිලිමත් විය යුතු දේ" : "Watch carefully"}</h3><ul>{guide.cautions.map(item => <li key={item}>{item}</li>)}</ul></article></div>
    <section className="ninetyDayPlan"><h3>{language === "si" ? "ඉදිරි දින 90 සඳහා ක්‍රියාමාර්ග" : "Your next 90-day action plan"}</h3><div>{guide.ninetyDayPlan.map((item, index) => <article key={item}><span>{index + 1}</span><p>{item}</p></article>)}</div></section>
    <p className="synthesisNote">{guide.synthesisNote}</p>
  </section>;
}
