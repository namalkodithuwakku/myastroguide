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

  if (status === "loading") return <section className="holisticGuide loadingGuide"><span className="guidePulse">✦</span><div><p>{language === "si" ? "මුළු ජන්ම පත්‍රයම සලකා බලමින්" : "BUILDING YOUR COMPLETE LIFE GUIDE"}</p><h2>{language === "si" ? "ජීවන විග්‍රහය සකස් වෙමින්…" : "Creating your full life-guide report…"}</h2><small>{language === "si" ? "ග්‍රහ පිහිටීම්, භාව, යෝග, නවාංශය සහ දශා කාලය එකට විමසා බලයි." : "Considering every planet, house, yoga, strength, Navamsa and Dasha as one life pattern."}</small></div></section>;

  if (status === "error") return <section className="holisticGuide guideFailure"><h2>{language === "si" ? "ජීවන විග්‍රහය" : "Complete AI life report"}</h2><p>{error}</p><button type="button" onClick={() => { setError(""); setStatus("loading"); setRetry(value => value + 1); }}>{language === "si" ? "යළි සකසන්න" : "Try again"}</button></section>;
  if (!guide) return null;

  const fitLabel = (fit: string) => language !== "si" ? fit : fit === "Excellent" ? "ඉතා ගැළපේ" : fit === "Strong" ? "හොඳින් ගැළපේ" : "ගැළපෙන ක්ෂේත්‍රයකි";

  const sections = [
    { key: "money", icon: "◈", en: "Money & long-term security", si: "මුදල් හා ආර්ථික ස්ථාවරත්වය", text: guide.money },
    { key: "relationships", icon: "♡", en: "Relationships & partnership", si: "විවාහය හා සබඳතා", text: guide.relationships },
    { key: "family", icon: "⌂", en: "Home & family pattern", si: "ගෙදර දොර හා පවුල් ජීවිතය", text: guide.homeAndFamily },
    { key: "health", icon: "◎", en: "Wellbeing, energy & balance", si: "සෞඛ්‍යය හා ජීව ශක්තිය", text: guide.healthAndBalance },
    { key: "international", icon: "↗", en: "International direction", si: "විදේශ ගමන් හා පදිංචිය", text: guide.internationalDirection },
    { key: "purpose", icon: "✦", en: "Purpose & contribution", si: "ජීවිතයේ අරමුණ", text: guide.purposeAndContribution },
    { key: "timing", icon: "◷", en: "Your current life chapter", si: "දැනට ගතවන දශා කාලය", text: guide.currentChapter },
    { key: "decisions", icon: "◇", en: "How to make your best decisions", si: "තීරණ ගැනීමේදී ඔබට ගැළපෙන ක්‍රමය", text: guide.decisionGuide },
  ];

  return <section className="holisticGuide fullLifeGuide">
    <div className="holisticHero">
      <p>{language === "si" ? "මුළු ජන්ම පත්‍රය ඇසුරින්" : "COMPLETE LIFE GUIDE · FROM YOUR WHOLE CHART"}</p>
      <h2>{language === "si" ? "ඔබේ සමස්ත ජීවන විග්‍රහය" : "Your complete life pattern"}</h2>
      <span>{guide.centralPattern}</span>
    </div>

    <section className="lifeCompass">
      <div className="holisticTitle"><span>01</span><div><p>{language === "si" ? "ජීවිතයේ මූලික ගමන් මඟ" : "YOUR LIFE DIRECTION"}</p><h3>{language === "si" ? "ඔබට ගැළපෙන වර්ධන මාර්ගය" : "How your life develops best"}</h3></div></div>
      <p className="lifeDirectionText">{guide.lifeDirection}</p>
      <div className="strengthBalance">
        <article><h4>✦ {language === "si" ? "ඔබට උපතින් ලැබුණු ශක්ති" : "Your natural strengths"}</h4><ul>{guide.coreStrengths.map(item => <li key={item}>{item}</li>)}</ul></article>
        <article><h4>↗ {language === "si" ? "දියුණු කරගත යුතු පැති" : "Patterns to develop"}</h4><ul>{guide.growthEdges.map(item => <li key={item}>{item}</li>)}</ul></article>
      </div>
    </section>

    <section className="careerDirection">
      <div className="holisticTitle"><span>02</span><div><p>{language === "si" ? "රැකියාව හා ව්‍යාපාර" : "PRACTICAL CAREER DIRECTION"}</p><h3>{language === "si" ? "ඔබට ගැළපෙන වෘත්තීය ක්ෂේත්‍ර" : "The work fields that fit you best"}</h3></div></div>
      <p className="careerLead">{guide.career.direction}</p>
      <div className="industryCards">{guide.career.bestIndustries.map((industry, index) => <article key={industry.name}><div><span>0{index + 1}</span><b>{fitLabel(industry.fit)}</b></div><h4>{industry.name}</h4><p>{industry.why}</p><ul>{industry.roles.map(role => <li key={role}>{role}</li>)}</ul></article>)}</div>
      <div className="careerAnswers"><article><b>{language === "si" ? "ඔබට ගැළපෙන වැඩ රටාව" : "Best working style"}</b><p>{guide.career.workStyle}</p></article><article><b>{language === "si" ? "ඉදිරියට යා හැකි මඟ" : "Growth strategy"}</b><p>{guide.career.growthStrategy}</p></article><article className="risk"><b>{language === "si" ? "සැලකිලිමත් විය යුතු වෘත්තීය පැත්ත" : "Main career risk"}</b><p>{guide.career.mainRisk}</p></article></div>
    </section>

    <div className="reportSectionTitle"><span>03</span><div><p>{language === "si" ? "ජීවිතයේ ප්‍රධාන පැති" : "YOUR WHOLE-LIFE MAP"}</p><h3>{language === "si" ? "එක් එක් පැත්තේ තත්ත්වය" : "The main areas of your life"}</h3></div></div>
    <div className="wholeLifeGrid">{sections.map(section => <article key={section.key}><span>{section.icon}</span><h3>{language === "si" ? section.si : section.en}</h3><p>{section.text}</p></article>)}</div>

    <div className="reportSectionTitle"><span>04</span><div><p>{language === "si" ? "සරල පැහැදිලි කිරීම" : "AI-POLISHED EXPLANATIONS"}</p><h3>{language === "si" ? "ග්‍රහ පිහිටීම් ජීවිතයට බලපාන අයුරු" : "What every calculation means for your life"}</h3></div></div>
    <section className="polishedEvidence">
      <div className="polishedGroup"><h3>{language === "si" ? "එක් එක් ග්‍රහයාගේ බලපෑම" : "Planet influences"}</h3><div>{guide.polishedDetails.planets.map(item => <article key={item.key}><span>{item.title.slice(0, 2).toUpperCase()}</span><div><h4>{item.title}</h4><p>{item.explanation}</p><p><b>{language === "si" ? "ජීවිතයේ පෙනෙන අයුරු:" : "Life impact:"}</b> {item.lifeImpact}</p><small><b>✓ {language === "si" ? "කළ යුතු දේ:" : "Guidance:"}</b> {item.guidance}</small></div></article>)}</div></div>
      {!!guide.polishedDetails.yogas.length && <div className="polishedGroup"><h3>{language === "si" ? "යෝග සහ විශේෂ හැකියාවන්" : "Yogas and special patterns"}</h3><div>{guide.polishedDetails.yogas.map(item => <article key={item.key}><span>✦</span><div><h4>{item.title}</h4><p>{item.explanation}</p><p><b>{language === "si" ? "ජීවිතයට බලපෑම:" : "Life impact:"}</b> {item.lifeImpact}</p><small><b>✓ {language === "si" ? "මඟපෙන්වීම:" : "Guidance:"}</b> {item.guidance}</small></div></article>)}</div></div>}
      <div className="polishedGroup"><h3>{language === "si" ? "ජීවන ක්ෂේත්‍ර" : "Life areas"}</h3><div>{guide.polishedDetails.lifeAreas.map(item => <article key={item.key}><span>◇</span><div><h4>{item.title}</h4><p>{item.explanation}</p><small><b>✓ {language === "si" ? "මඟපෙන්වීම:" : "Guidance:"}</b> {item.guidance}</small></div></article>)}</div></div>
      {!!guide.polishedDetails.activeConditions.length && <div className="polishedGroup"><h3>{language === "si" ? "සක්‍රිය විශේෂ තත්ත්ව" : "Active special conditions"}</h3><div>{guide.polishedDetails.activeConditions.map(item => <article key={item.key}><span>!</span><div><h4>{item.title}</h4><p>{item.explanation}</p><small><b>✓ {language === "si" ? "සමබර කිරීම:" : "How to balance:"}</b> {item.guidance}</small></div></article>)}</div></div>}
    </section>

    <div className="reportSectionTitle"><span>05</span><div><p>{language === "si" ? "ඉදිරි පියවර" : "YOUR PRACTICAL ROADMAP"}</p><h3>{language === "si" ? "දැන් ඔබ කළ යුතු දේ" : "Turn understanding into action"}</h3></div></div>
    <div className="priorityGrid"><article><h3>✓ {language === "si" ? "මුලින් අවධානය දෙන්න" : "Priorities now"}</h3><ol>{guide.priorities.map(item => <li key={item}>{item}</li>)}</ol></article><article className="cautionList"><h3>! {language === "si" ? "මතක තබාගන්න" : "Watch carefully"}</h3><ul>{guide.cautions.map(item => <li key={item}>{item}</li>)}</ul></article></div>
    <section className="ninetyDayPlan"><h3>{language === "si" ? "ඉදිරි මාස තුනේ කළ යුතු දේ" : "Your next 90-day action plan"}</h3><div>{guide.ninetyDayPlan.map((item, index) => <article key={item}><span>{index + 1}</span><p>{item}</p></article>)}</div></section>
    <p className="synthesisNote">{guide.synthesisNote}</p>
  </section>;
}
