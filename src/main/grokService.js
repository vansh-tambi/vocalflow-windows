const https = require('https');
const usageService = require('./usageService');

const TRANSLITERATION_PAIRS = [
  "Hinglish → English",
  "Tanglish → English",
  "Spanglish → English",
  "Franglais → English",
  "Denglish → English",
  "Chinglish → English",
  "Konglish → English",
  "Janglish → English",
  "Portuñol → English",
  "Arabizi → English",
  "Taglish → English",
  "Russlish → English",
  "Itangliano → English",
  "Greeklish → English",
  "Benglish → English",
  "Telunglish → English"
];

async function processTranscript(transcript, settings = {}) {
  const {
    GROK_SPELLING_CORRECTION,
    GROK_GRAMMAR_CORRECTION,
    GROK_TRANSLITERATION,
    GROK_TRANSLATION,
    GROK_API_KEY
  } = settings;

  let tasks = [];
  if (GROK_SPELLING_CORRECTION) tasks.push("Correct spelling errors.");
  if (GROK_GRAMMAR_CORRECTION) tasks.push("Fix grammatical mistakes.");
  if (GROK_TRANSLITERATION) tasks.push("Transliterate phonetic text to English.");
  if (GROK_TRANSLATION) tasks.push("Translate the text to English.");

  // If no flags are true, return transcript unchanged
  if (tasks.length === 0) {
    return transcript;
  }

  const systemPrompt = `You are a text processing assistant. Apply the following operations to the user's transcript:
- ${tasks.join('\n- ')}

Return ONLY the final processed text. Do not add any conversational filler, quotes, explanations, or introductory text. If no changes are needed based on the operations, return the original text.`;

  // Fallback to process.env if not provided in settings
  const apiKey = GROK_API_KEY || process.env.GROK_API_KEY;

  if (!apiKey) {
    console.warn("[GrokService] Grok API key is missing. Returning original transcript.");
    return transcript;
  }

  const requestBody = JSON.stringify({
    model: "grok-2", // default Grok model, adjust if needed
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: transcript }
    ],
    temperature: 0.1
  });

  const options = {
    hostname: 'api.x.ai',
    path: '/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Content-Length': Buffer.byteLength(requestBody)
    }
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const json = JSON.parse(data);
            
            // Log Usage
            if (json.usage && json.usage.total_tokens) {
              const tokens = json.usage.total_tokens;
              const model = settings.GROK_MODEL || "grok-2";
              // Apply fallback config or load directly
              const pricingMap = settings.MODEL_PRICING || { "grok-2": 0.002 };
              const rate = pricingMap[model] || 0.002;
              const cost = (tokens / 1000) * rate;
              usageService.logGrokUsage(tokens, cost);
            }

            if (json.choices && json.choices.length > 0 && json.choices[0].message) {
              resolve(json.choices[0].message.content.trim());
              return;
            }
          }
          console.error(`[GrokService] API error (${res.statusCode}):`, data);
          resolve(transcript);
        } catch (error) {
          console.error("[GrokService] Error parsing API response:", error);
          resolve(transcript);
        }
      });
    });

    req.on('error', (error) => {
      console.error("[GrokService] Request failed:", error);
      resolve(transcript); // Return original transcript on any error
    });

    req.write(requestBody);
    req.end();
  });
}

module.exports = {
  TRANSLITERATION_PAIRS,
  processTranscript
};
