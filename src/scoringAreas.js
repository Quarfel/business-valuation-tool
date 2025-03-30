// src/scoringAreas.js

export const ScoringAreas = {
  PROFILE: 'Your Profile',
  BUSINESS: 'Business Fundamentals',
  PRODUCT: 'Product/Service Strength',
  CUSTOMERS: 'Customer Base',
  PEOPLE: 'Team & Operations',
  SYSTEMS: 'Systems & Scalability',
  // NOTE: We removed 'RESULT' as financials aren't directly scored qualitatively anymore
  // Add it back if you have qualitative questions in the Financials section
};

// Create an initial structure for scores based on the defined areas
export const initialScores = Object.keys(ScoringAreas).reduce((acc, key) => {
  // Use the value (the display name) as the key in the initialScores object
  acc[ScoringAreas[key]] = 0;
  return acc;
}, {});

// If you want to add RESULT back because you have qualitative financial questions:
// export const ScoringAreas = {
//   PROFILE: 'Your Profile',
//   BUSINESS: 'Business Fundamentals',
//   PRODUCT: 'Product/Service Strength',
//   CUSTOMERS: 'Customer Base',
//   PEOPLE: 'Team & Operations',
//   SYSTEMS: 'Systems & Scalability',
//   RESULT: 'Financial Performance', // Added back
// };
// export const initialScores = Object.values(ScoringAreas).reduce((acc, area) => {
//    acc[area] = 0;
//    return acc;
// }, {});