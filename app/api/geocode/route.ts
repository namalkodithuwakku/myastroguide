type OpenMeteoResult = { name: string; admin1?: string; country?: string; latitude: number; longitude: number; timezone: string };

const FALLBACKS: Record<string, { name: string; latitude: number; longitude: number; timezone: string }> = {
  colombo: { name: "Colombo, Sri Lanka", latitude: 6.9271, longitude: 79.8612, timezone: "Asia/Colombo" },
  kandy: { name: "Kandy, Sri Lanka", latitude: 7.2906, longitude: 80.6337, timezone: "Asia/Colombo" },
  galle: { name: "Galle, Sri Lanka", latitude: 6.0535, longitude: 80.221, timezone: "Asia/Colombo" },
  matara: { name: "Matara, Sri Lanka", latitude: 5.9549, longitude: 80.555, timezone: "Asia/Colombo" },
  negombo: { name: "Negombo, Sri Lanka", latitude: 7.2083, longitude: 79.8358, timezone: "Asia/Colombo" },
  jaffna: { name: "Jaffna, Sri Lanka", latitude: 9.6615, longitude: 80.0255, timezone: "Asia/Colombo" },
  "nuwara eliya": { name: "Nuwara Eliya, Sri Lanka", latitude: 6.9497, longitude: 80.7891, timezone: "Asia/Colombo" },
  anuradhapura: { name: "Anuradhapura, Sri Lanka", latitude: 8.3114, longitude: 80.4037, timezone: "Asia/Colombo" },
  trincomalee: { name: "Trincomalee, Sri Lanka", latitude: 8.5874, longitude: 81.2152, timezone: "Asia/Colombo" },
  ella: { name: "Ella, Sri Lanka", latitude: 6.8667, longitude: 81.0466, timezone: "Asia/Colombo" },
  bentota: { name: "Bentota, Sri Lanka", latitude: 6.4211, longitude: 79.9989, timezone: "Asia/Colombo" },
  dambulla: { name: "Dambulla, Sri Lanka", latitude: 7.8742, longitude: 80.6511, timezone: "Asia/Colombo" },
  kurunegala: { name: "Kurunegala, Sri Lanka", latitude: 7.4863, longitude: 80.3647, timezone: "Asia/Colombo" },
  london: { name: "London, United Kingdom", latitude: 51.5072, longitude: -0.1276, timezone: "Europe/London" },
  dubai: { name: "Dubai, United Arab Emirates", latitude: 25.2048, longitude: 55.2708, timezone: "Asia/Dubai" },
  mumbai: { name: "Mumbai, India", latitude: 19.076, longitude: 72.8777, timezone: "Asia/Kolkata" },
  "new york": { name: "New York, United States", latitude: 40.7128, longitude: -74.006, timezone: "America/New_York" },
};

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const query = requestUrl.searchParams.get("q")?.trim();
  const suggest = requestUrl.searchParams.get("suggest") === "1";
  if (!query || query.length < 2) return Response.json({ error: "Enter a city and country." }, { status: 400 });
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", query.split(",")[0].trim());
  url.searchParams.set("count", suggest ? "8" : "1");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");
  const fallback = FALLBACKS[query.split(",")[0].trim().toLowerCase()];
  const localSuggestions = Object.entries(FALLBACKS).filter(([key, value]) => key.startsWith(query.toLowerCase()) || value.name.toLowerCase().includes(query.toLowerCase())).map(([, value]) => value);
  if (suggest && localSuggestions.length) return Response.json({ results: localSuggestions.slice(0, 8) });
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Location service unavailable");
    const payload = await response.json() as { results?: OpenMeteoResult[] };
    if (suggest) {
      const results = (payload.results || []).map((match) => ({
        name: [match.name, match.admin1, match.country].filter(Boolean).filter((value, index, all) => all.indexOf(value) === index).join(", "),
        latitude: match.latitude, longitude: match.longitude, timezone: match.timezone,
      }));
      const merged = [...localSuggestions, ...results].filter((item, index, all) => all.findIndex((candidate) => candidate.name === item.name) === index).slice(0, 8);
      return Response.json({ results: merged });
    }
    const match = payload.results?.[0];
    if (!match) return fallback ? Response.json(fallback) : Response.json({ error: "Location not found. Add the country and try again." }, { status: 404 });
    const name = [match.name, match.admin1, match.country].filter(Boolean).filter((value, index, all) => all.indexOf(value) === index).join(", ");
    return Response.json({ name, latitude: match.latitude, longitude: match.longitude, timezone: match.timezone });
  } catch {
    if (suggest) return Response.json({ results: localSuggestions });
    if (fallback) return Response.json(fallback);
    return Response.json({ error: "Location lookup is temporarily unavailable. Try entering the nearest major city." }, { status: 503 });
  }
}
