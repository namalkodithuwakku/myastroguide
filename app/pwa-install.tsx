"use client";

import { useEffect, useState } from "react";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

export default function PwaInstall() {
  const [installEvent, setInstallEvent] = useState<InstallEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    const standalone = window.matchMedia("(display-mode: standalone)").matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
    if (standalone) return;
    const onPrompt = (event: Event) => { event.preventDefault(); setInstallEvent(event as InstallEvent); setVisible(true); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    const timer = window.setTimeout(() => setVisible(true), 6500);
    return () => { window.removeEventListener("beforeinstallprompt", onPrompt); window.clearTimeout(timer); };
  }, []);

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === "accepted") setVisible(false);
    setInstallEvent(null);
  }

  if (!visible) return null;
  return <aside className="installPrompt" aria-label="Install My Astro Guide">
    <span className="installIcon">✦</span>
    <div><b>Keep your guide with you</b><small>{installEvent ? "Install My Astro Guide as an app." : "On mobile, use your browser menu and choose Add to Home Screen."}</small></div>
    {installEvent && <button type="button" onClick={install}>Install</button>}
    <button type="button" className="installClose" onClick={() => setVisible(false)} aria-label="Close install prompt">×</button>
  </aside>;
}
