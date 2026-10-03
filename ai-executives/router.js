const CONFIG = require("./executives.json");

const normalize = (value = "") =>
  value.toLowerCase().replace(/[^a-z0-9+.#&\\s-]/g, " ").replace(/\\s+/g, " ").trim();

const scoreExecutive = (text, executive) => {
  const haystack = normalize(text);
  let score = 0;
  for (const focus of executive.focus || []) {
    const term = normalize(focus);
    if (term && haystack.includes(term)) score += term.length >= 8 ? 3 : 2;
  }
  return score;
};

function route(message, options = {}) {
  const limit = Math.max(1, Math.min(options.limit || 3, 5));
  const ranked = CONFIG.executives
    .map(executive => ({...executive, score: scoreExecutive(message, executive)}))
    .filter(executive => executive.score > 0)
    .sort((a, b) => b.score - a.score);

  return {
    router: CONFIG.router.name,
    request: message,
    selected: ranked.slice(0, limit).map(({id,name,focus,score}) => ({id,name,focus,score})),
    needs_llm_classification: ranked.length === 0 || ranked[0].score < 2
  };
}

module.exports = { route };
