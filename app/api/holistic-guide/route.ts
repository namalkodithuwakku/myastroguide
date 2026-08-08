import type { VedicChart } from "../../../lib/vedic-engine";
import { buildHolisticSignals } from "../../../lib/holistic-synthesis";

const stringList = (minItems: number, maxItems: number) => ({
  type: "array",
  minItems,
  maxItems,
  items: { type: "string" },
});

const schema = {
  type: "object",
  additionalProperties: false,
  properties: {
    centralPattern: { type: "string" },
    lifeDirection: { type: "string" },
    coreStrengths: stringList(4, 5),
    growthEdges: stringList(3, 4),
    career: {
      type: "object",
      additionalProperties: false,
      properties: {
        direction: { type: "string" },
        bestIndustries: {
          type: "array",
          minItems: 3,
          maxItems: 3,
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              name: { type: "string" },
              fit: { type: "string", enum: ["Excellent", "Strong", "Supporting"] },
              why: { type: "string" },
              roles: stringList(3, 5),
            },
            required: ["name", "fit", "why", "roles"],
          },
        },
        workStyle: { type: "string" },
        growthStrategy: { type: "string" },
        mainRisk: { type: "string" },
      },
      required: ["direction", "bestIndustries", "workStyle", "growthStrategy", "mainRisk"],
    },
    money: { type: "string" },
    relationships: { type: "string" },
    homeAndFamily: { type: "string" },
    healthAndBalance: { type: "string" },
    internationalDirection: { type: "string" },
    purposeAndContribution: { type: "string" },
    currentChapter: { type: "string" },
    decisionGuide: { type: "string" },
    polishedDetails: {
      type: "object",
      additionalProperties: false,
      properties: {
        planets: {
          type: "array", minItems: 9, maxItems: 9,
          items: { type: "object", additionalProperties: false, properties: { key: { type: "string" }, title: { type: "string" }, explanation: { type: "string" }, lifeImpact: { type: "string" }, guidance: { type: "string" } }, required: ["key", "title", "explanation", "lifeImpact", "guidance"] },
        },
        yogas: {
          type: "array", maxItems: 20,
          items: { type: "object", additionalProperties: false, properties: { key: { type: "string" }, title: { type: "string" }, explanation: { type: "string" }, lifeImpact: { type: "string" }, guidance: { type: "string" } }, required: ["key", "title", "explanation", "lifeImpact", "guidance"] },
        },
        lifeAreas: {
          type: "array", minItems: 8, maxItems: 8,
          items: { type: "object", additionalProperties: false, properties: { key: { type: "string" }, title: { type: "string" }, explanation: { type: "string" }, guidance: { type: "string" } }, required: ["key", "title", "explanation", "guidance"] },
        },
        activeConditions: {
          type: "array", maxItems: 20,
          items: { type: "object", additionalProperties: false, properties: { key: { type: "string" }, title: { type: "string" }, explanation: { type: "string" }, guidance: { type: "string" } }, required: ["key", "title", "explanation", "guidance"] },
        },
      },
      required: ["planets", "yogas", "lifeAreas", "activeConditions"],
    },
    priorities: stringList(4, 6),
    cautions: stringList(3, 5),
    ninetyDayPlan: stringList(4, 6),
    synthesisNote: { type: "string" },
  },
  required: [
    "centralPattern", "lifeDirection", "coreStrengths", "growthEdges", "career", "money",
    "relationships", "homeAndFamily", "healthAndBalance", "internationalDirection",
    "purposeAndContribution", "currentChapter", "decisionGuide", "polishedDetails", "priorities", "cautions",
    "ninetyDayPlan", "synthesisNote",
  ],
};

function profile(chart: VedicChart) {
  return {
    ascendant: chart.ascendant,
    moonNakshatra: chart.moonNakshatra,
    planets: chart.planets,
    houses: chart.houses,
    aspects: chart.aspects,
    conjunctions: chart.conjunctions,
    yogas: chart.yogas,
    conditions: chart.conditions,
    lifeAreas: chart.lifeAreas,
    navamsa: chart.navamsa,
    panchanga: chart.panchanga,
    dasha: chart.dasha,
    practicalSignals: buildHolisticSignals(chart),
  };
}

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: "AI guide is not configured. Add OPENAI_API_KEY in Vercel." }, { status: 503 });
  }

  try {
    const body = await request.json() as { chart?: VedicChart; language?: "en" | "si" };
    if (!body.chart) return Response.json({ error: "A calculated chart is required." }, { status: 400 });

    const language = body.language === "si" ? "Sinhala" : "English";
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        instructions: `You write the main full-life report for a Sri Lankan Vedic astrology application. Write in natural, simple ${language} for a general reader. When the language is Sinhala, compose directly in idiomatic Sri Lankan Sinhala; do not translate English sentence structures. Use familiar Sri Lankan astrology terms such as ජන්ම පත්‍රය, ලග්නය, භාවය, ග්‍රහ බලය, දශාව, අතුරු දශාව, නවාංශය and ගෝචරය. Prefer short natural wording, and avoid stiff translated phrases such as ජාත්‍යන්තර දිශාව, ජීවන පරිච්ඡේදය or වර්ධන උපායමාර්ගය. The COMPLETE CALCULATED PROFILE is authoritative. Consider every supplied layer together: Lagna, Moon and nakshatra, all planets and houses, dignity and strength, aspects, conjunctions, yogas, special conditions, Navamsa, Panchanga, life-area scores, complete Dasha timing, and deterministic practical signals. Never recalculate or invent placements, scores, yogas or events.

This must be one holistic life guide, not separate planet descriptions. First identify themes repeated across several independent factors. Then explain supporting power, counteracting power, neutralisation, uplift and timing. A strong statement requires several supporting factors; mixed evidence must be described as a balanced tendency. Connect identity, purpose, career, money, relationships, family, wellbeing, international direction and current timing into one coherent story.

For career, rank only the supplied industry candidates and respect their calculated scores. Name concrete industries and realistic roles, then explain why the whole chart supports them. Give practical choices and actions, not vague spiritual language. Do not use fear, certainty, guaranteed predictions, medical claims, or factual claims about remedies.

Also polish every supplied planet, yoga, life area and DETECTED active condition. Return each item once using its exact supplied key. Explain it in friendly everyday language, say how it can shape real life, and give one practical way to use or balance it. Interpret each item within the whole chart: mention balancing or reinforcing influences when relevant rather than treating it in isolation. For polishedDetails, use 1-2 short sentences per field. For all other prose fields, use 2-4 short sentences, each list item one sentence, and each role a short job title. The fit field must remain exactly Excellent, Strong, or Supporting even in Sinhala.`,
        input: [
          { role: "developer", content: `COMPLETE CALCULATED PROFILE:\n${JSON.stringify(profile(body.chart))}` },
          { role: "user", content: "Create my complete practical life-guide report from the entire profile." },
        ],
        text: { format: { type: "json_schema", name: "complete_life_guide", strict: true, schema } },
        max_output_tokens: 12000,
      }),
    });

    const data = await response.json() as {
      output_text?: string;
      output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
      error?: { message?: string };
      status?: string;
      incomplete_details?: { reason?: string };
    };
    if (!response.ok) return Response.json({ error: data.error?.message || "AI guide is temporarily unavailable." }, { status: 502 });

    const text = data.output_text || data.output?.flatMap(item => item.content || []).find(item => item.type === "output_text")?.text;
    if (!text) {
      const reason = data.incomplete_details?.reason || "output limit";
      return Response.json({ error: data.status === "incomplete" ? `AI report was incomplete (${reason}). Please retry.` : "AI report returned no content." }, { status: 502 });
    }

    try {
      return Response.json({ guide: JSON.parse(text), signals: buildHolisticSignals(body.chart) });
    } catch (error) {
      console.error("Complete life guide JSON parse failed", { status: data.status, reason: data.incomplete_details?.reason, length: text.length, error });
      return Response.json({ error: "The AI report was incomplete. Please retry." }, { status: 502 });
    }
  } catch (error) {
    console.error("Complete life guide request failed", error);
    return Response.json({ error: "AI report could not be created. Please try again." }, { status: 500 });
  }
}
