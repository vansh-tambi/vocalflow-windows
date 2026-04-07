// config/config.js
const config = {
  DEEPGRAM_API_KEY: "",
  GROK_API_KEY: "",
  DEEPGRAM_MODEL: "nova-2",
  DEEPGRAM_LANGUAGE: "en",
  DEEPGRAM_BASE_URL: "https://api.deepgram.com",
  GROK_MODEL: "grok-2",
  GROK_BASE_URL: "https://api.x.ai/v1",
  HOTKEY: "RIGHT ALT",
  GROK_SPELLING_CORRECTION: false,
  GROK_GRAMMAR_CORRECTION: false,
  GROK_TRANSLITERATION: false,
  GROK_TRANSLITERATION_PAIR: "Hinglish → English",
  GROK_TRANSLATION: false,
  GROK_TRANSLATION_TARGET: "",
  
  // Usage tracking budgets and pricing
  DEEPGRAM_BUDGET: 10, // USD
  GROK_BUDGET: 10, // USD
  MODEL_PRICING: {
    "grok-2": 0.002, // per 1000 tokens
  },
  DEEPGRAM_RATE: 0.0043, // USD per minute
};
module.exports = config;
