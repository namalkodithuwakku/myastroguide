"use client";

import { useState } from "react";
import type { VedicChart } from "../lib/vedic-engine";

export type SavedAstroProfile = {
  id: string;
  name: string;
  birthDate: string;
  birthTime: string;
  place: string;
  savedAt: string;
  chart: VedicChart;
};

const STORAGE_KEY = "my-astro-guide-profiles-v1";

export default function ProfileLibrary({
  language,
  current,
  onLoad,
  onDownload,
}: {
  language: "en" | "si";
  current: Omit<SavedAstroProfile, "id" | "savedAt">;
  onLoad: (profile: SavedAstroProfile) => void;
  onDownload: () => void;
}) {
  const [profiles, setProfiles] = useState<SavedAstroProfile[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as SavedAstroProfile[]; }
    catch { return []; }
  });
  const [notice, setNotice] = useState("");

  function persist(next: SavedAstroProfile[]) {
    setProfiles(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function saveCurrent() {
    const same = profiles.find(item => item.name.trim().toLowerCase() === current.name.trim().toLowerCase() && item.birthDate === current.birthDate && item.birthTime === current.birthTime);
    const saved: SavedAstroProfile = { ...current, id: same?.id || crypto.randomUUID(), savedAt: new Date().toISOString() };
    persist([saved, ...profiles.filter(item => item.id !== same?.id)]);
    setNotice(language === "si" ? "පැතිකඩ සුරැකිණි." : "Profile saved on this device.");
  }

  function rename(profile: SavedAstroProfile) {
    const nextName = window.prompt(language === "si" ? "නව නම" : "Profile name", profile.name)?.trim();
    if (!nextName) return;
    persist(profiles.map(item => item.id === profile.id ? { ...item, name: nextName } : item));
  }

  function remove(profile: SavedAstroProfile) {
    if (!window.confirm(language === "si" ? `${profile.name} මකා දමන්නද?` : `Delete ${profile.name}?`)) return;
    persist(profiles.filter(item => item.id !== profile.id));
  }

  return <section className="profileLibrary">
    <div className="libraryActions">
      <div><p>{language === "si" ? "මෙම උපාංගයේ පමණක් සුරැකේ" : "SAVE PRIVATELY ON THIS DEVICE"}</p><h2>{language === "si" ? "සුරැකි පැතිකඩ" : "My profiles & reports"}</h2><small>{language === "si" ? "ගිණුමක් අවශ්‍ය නැත. තොරතුරු වෙනත් උපාංගයකට යවන්නේ නැත." : "No account or database is required."}</small></div>
      <div><button className="saveProfileButton" type="button" onClick={saveCurrent}>＋ {language === "si" ? "මෙම පැතිකඩ සුරකින්න" : "Save current profile"}</button><button className="downloadProfileButton" type="button" onClick={onDownload}>⇩ {language === "si" ? "PDF පිටපත" : "Download PDF"}</button></div>
    </div>
    {notice && <p className="saveNotice">✓ {notice}</p>}
    <div className="savedProfileGrid">
      {profiles.map(profile => <article key={profile.id}>
        <div className="savedAvatar">{profile.name.slice(0, 1).toUpperCase()}</div>
        <div><h3>{profile.name}</h3><p>{profile.birthDate} · {profile.birthTime}</p><small>{profile.place}</small></div>
        <div className="savedProfileActions"><button type="button" onClick={() => onLoad(profile)}>{language === "si" ? "බලන්න" : "Open"}</button><button type="button" onClick={() => rename(profile)} aria-label="Rename">✎</button><button className="deleteSaved" type="button" onClick={() => remove(profile)} aria-label="Delete">×</button></div>
      </article>)}
      {!profiles.length && <div className="emptyProfiles"><span>◎</span><h3>{language === "si" ? "තවම සුරැකි පැතිකඩක් නැත" : "No saved profiles yet"}</h3><p>{language === "si" ? "ඉහළ බොත්තම භාවිතයෙන් වත්මන් පැතිකඩ සුරකින්න." : "Save the current profile using the button above."}</p></div>}
    </div>
  </section>;
}
