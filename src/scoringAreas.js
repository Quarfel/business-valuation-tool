// src/scoringAreas.js

// Define the keys for the 7 qualitative scoring categories
export const ScoringAreas = {
  EXPANSION: "Expansion Capability",        // E
  MARKETING: "Marketing & Brand Equity",    // M
  PROFITABILITY: "Profitability Metrics",     // P (Qualitative aspects)
  OFFERING: "Offering Excellence",          // O
  WORKFORCE: "Workforce & Leadership",      // W
  SYSTEMS: "Execution Systems",           // E (Execution)
  MARKET: "Robust Market Position"       // R
};

// Define the weights for each scoring area (as per your breakdown: 15% x 6 + 10% x 1 = 100%)
// Note: While we define weights here for clarity/potential future use, the current valuation logic
// uses the overall score percentage, effectively giving equal weight to each *raw point* scored.
// The feedback can emphasize areas regardless of weight.
export const scoringWeights = {
  [ScoringAreas.EXPANSION]: 0.15,
  [ScoringAreas.MARKETING]: 0.15,
  [ScoringAreas.PROFITABILITY]: 0.15,
  [ScoringAreas.OFFERING]: 0.15,
  [ScoringAreas.WORKFORCE]: 0.10,
  [ScoringAreas.SYSTEMS]: 0.15,
  [ScoringAreas.MARKET]: 0.15,
}; // Total = 1.0

// Initial scores object, starting all areas at 0
export const initialScores = {
  [ScoringAreas.EXPANSION]: 0,
  [ScoringAreas.MARKETING]: 0,
  [ScoringAreas.PROFITABILITY]: 0,
  [ScoringAreas.OFFERING]: 0,
  [ScoringAreas.WORKFORCE]: 0,
  [ScoringAreas.SYSTEMS]: 0,
  [ScoringAreas.MARKET]: 0,
};

// Helper function to get the list of scoring area names
export const getScoringAreaNames = () => Object.values(ScoringAreas);