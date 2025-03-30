// src/questions.js
import { ScoringAreas } from './scoringAreas';
// Import necessary functions and data from naicsData.js
// Ensure the path './naicsData' is correct relative to questions.js
import { naicsSectors, getSubSectors, getIndustryAdjustmentFactor } from './naicsData';

// --- Define Section Titles ---
export const sections = [
  "Your Profile",           // Section 0
  "Your Business",          // Section 1
  "Your Product",           // Section 2
  "Your Customers",         // Section 3
  "Your People",            // Section 4
  "Your Systems",           // Section 5
  "Your Financials",        // Section 6
];

// --- Define the Main Array of All Questions ---
// This MUST be defined before it's used by filters or helper functions below.
export const questionsData = [

  // === Section 0: Your Profile ===
  {
    id: "q1",
    section: sections[0],
    text: "What is your primary role in the business?",
    type: "mcq",
    options: [
      { text: "Owner/Founder", score: 5 },
      { text: "CEO", score: 4 },
      { text: "Managing Partner", score: 4 },
      { text: "Investor", score: 2 },
      { text: "Other", score: 1 }
    ],
    valueKey: "ownerRole",
    scoringArea: ScoringAreas.PROFILE
  },
  {
    id: "q2",
    section: sections[0],
    text: "How long have you been involved with this business?",
    type: "mcq",
    options: [
        { text: "Less than 1 year", score: 1 },
        { text: "1-3 years", score: 3 },
        { text: "4-7 years", score: 5 },
        { text: "8-15 years", score: 4 },
        { text: "Over 15 years", score: 3 }
    ],
    valueKey: "yearsInvolved",
    scoringArea: ScoringAreas.PROFILE
  },
  { // NEW Email Field
    id: "emailCapture",
    section: sections[0],
    text: "Enter your email address. This is crucial for saving your progress and receiving results.",
    // Using 'email' type hints browser validation, but 'text' works too.
    // Add pattern validation in MultiStepForm if stricter checking is needed.
    type: "email",
    valueKey: "userEmail",
    placeholder: "your.email@example.com",
    // This field does not contribute to scoring.
  },

  // === Section 1: Your Business ===
  {
    id: "industrySector",
    section: sections[1],
    text: "Select your primary Industry Sector:",
    type: "select",
    options: naicsSectors.map(s => s.name), // Get names from naicsData
    valueKey: "naicsSector",
    // No direct score - influences sub-sector list and industry adjustment factor
  },
  {
    id: "industrySubSector",
    section: sections[1],
    text: "Select your specific 6-Digit NAICS Sub-Sector:", // Clarified title
    type: "select_dependent",
    dependsOn: "naicsSector",
    // optionsGetter needs to return just the names for the dropdown
    optionsGetter: (sectorName) => getSubSectors(sectorName).map(sub => sub.name),
    valueKey: "naicsSubSector",
    // Assign area for context, but score comes from the adjustment factor lookup later
    scoringArea: ScoringAreas.BUSINESS
  },
  // REMOVED Legal Structure Question (Previously q4)
  {
    id: "q5", // Note: ID remains q5 for consistency if needed elsewhere, even though it's the 3rd question shown in this section now.
    section: sections[1],
    text: "Approximately how old is the business?",
    type: "mcq",
    options: [
        { text: "0-1 year", score: 1 },
        { text: "2-3 years", score: 3 },
        { text: "4-5 years", score: 4 },
        { text: "6-10 years", score: 5 },
        { text: "11+ years", score: 5 }
    ],
    valueKey: "businessAge",
    scoringArea: ScoringAreas.BUSINESS
  },

  // === Section 2: Your Product ===
   {
    id: "q6", // Original Product question
    section: sections[2],
    text: "How would you describe the uniqueness of your core product/service?",
    type: "mcq",
    options: [
        { text: "Highly unique, patented/proprietary", score: 5 },
        { text: "Significantly differentiated", score: 4 },
        { text: "Some unique features", score: 3 },
        { text: "Similar to competitors", score: 2 },
        { text: "Commodity product/service", score: 1 }
    ],
    valueKey: "productUniqueness",
    scoringArea: ScoringAreas.PRODUCT
  },
  { // NEW - Ideal Client Profile
    id: "q12", // Assigning a new unique ID
    section: sections[2],
    text: "Have you identified your Ideal Client Profile?",
    type: "mcq",
    options: [
        { text: "Yes and we strategically decline customers that don't match it.", score: 5 },
        { text: "Yes but we accept other customers as well.", score: 3 },
        { text: "No.", score: 1 }
    ],
    valueKey: "idealClientProfileFocus",
    // Although about clients, placing under Product as requested, but scoring affects Customers
    scoringArea: ScoringAreas.CUSTOMERS
  },
  { // NEW - Customer Satisfaction
    id: "q13",
    section: sections[2],
    text: "Please estimate the percentage of your customers that are very satisfied with your main service/product:",
    type: "mcq",
    options: [
        { text: "More than 75% are very satisfied", score: 5 }, // Highest satisfaction = highest score
        { text: "51-75% are very satisfied", score: 4 },
        { text: "25-50% are very satisfied", score: 2 },
        { text: "Less than 25% are very satisfied", score: 1 },
        { text: "I'm not sure, we don't measure this.", score: 0 } // Not measuring is a significant negative
    ],
    valueKey: "customerSatisfactionLevel",
    // Placing under Product, scoring affects Customers
    scoringArea: ScoringAreas.CUSTOMERS
  },
  { // NEW - Recurring Revenue %
    id: "q14",
    section: sections[2],
    text: "What % of your total revenue is recurring? (Subscriptions, maintenance contracts, etc.)",
    type: "mcq",
    options: [
        // Higher recurring revenue is more valuable
        { text: "51%-75% or higher", score: 5 }, // Grouped top tiers
        { text: "26-50%", score: 3 },
        { text: "1-25%", score: 2 },
        { text: "None", score: 1 }
    ],
    valueKey: "recurringRevenuePercent",
    // Relates to product/business model strength
    scoringArea: ScoringAreas.PRODUCT
  },
  { // NEW - Upsell Process
    id: "q15",
    section: sections[2],
    text: "What best describes your upsell process (revenue after first purchase in 12 months)?",
    type: "mcq",
    options: [
        // Higher LTV / lower initial % = better score
        { text: "The first purchase represents <50% of revenue received from that customer in the first 12 months", score: 5 },
        { text: "The first purchase represents >50% but <75% of revenue received from that customer in the first 12 months", score: 3 }, // Clarified midpoint
        { text: "The first purchase represents >75% of revenue received from that customer in the first 12 months", score: 2 },
        { text: "Usually there is no other purchase from that customer in the first 12 months", score: 1 }
    ],
    valueKey: "upsellRevenueContribution",
    // Relates to customer lifetime value
    scoringArea: ScoringAreas.CUSTOMERS
  },
   { // NEW - Question 19 from screenshot (Scalability - Volume)
    id: "q19",
    section: sections[2],
    text: "If customers were lined up at your door to buy, would you find delivering FIVE times the current volume of what you sell:",
    type: "mcq",
    options: [
        { text: "Very easy", score: 5 },
        { text: "Fairly easy", score: 4 },
        { text: "Fairly difficult", score: 2 },
        { text: "Very difficult", score: 1 },
        { text: "Impossible", score: 0 },
        { text: "Unsure", score: 1 } // Unsure suggests lack of systems/planning
    ],
    valueKey: "scalabilityVolume",
    // Directly relates to operational systems & scalability
    scoringArea: ScoringAreas.SYSTEMS
  },
   { // NEW - Question 20 from screenshot (Scalability - Geography)
    id: "q20",
    section: sections[2],
    text: "Would replicating your business to serve a new geographical area be:",
    type: "mcq",
    options: [
        { text: "Very easy", score: 5 },
        { text: "Fairly easy", score: 4 },
        { text: "Fairly difficult", score: 2 },
        { text: "Very difficult", score: 1 },
        { text: "Impossible", score: 0 },
        { text: "Unsure", score: 1 } // Unsure suggests lack of replicable systems
    ],
    valueKey: "scalabilityGeography",
    // Relates to systems and business model design
    scoringArea: ScoringAreas.SYSTEMS
  },

  // === Section 3: Your Customers ===
   {
    id: "q7", // Original Customer question
    section: sections[3],
    text: "How concentrated is your customer base?",
    type: "mcq",
    options: [
        { text: "Top customer is >50% of revenue", score: 1 },
        { text: "Top customer is 25-50% of revenue", score: 2 },
        { text: "Top 5 customers are >50% of revenue", score: 3 },
        { text: "No single customer is >10% of revenue", score: 4 },
        { text: "Highly diversified customer base", score: 5 }
    ],
    valueKey: "customerConcentration",
    scoringArea: ScoringAreas.CUSTOMERS
  },
  // Add more customer-related qualitative questions here if needed...

  // === Section 4: Your People ===
   {
    id: "q8", // Original People question
    section: sections[4],
    text: "How reliant is the business's day-to-day operation on the owner?",
    type: "mcq",
    options: [
        { text: "Completely reliant (owner does most things)", score: 1 },
        { text: "Heavily reliant (owner involved in key decisions daily)", score: 2 },
        { text: "Moderately reliant (owner oversees, team manages)", score: 3 },
        { text: "Minimally reliant (owner focuses on strategy)", score: 4 },
        { text: "Not reliant (fully managed by team)", score: 5 }
    ],
    valueKey: "ownerReliance",
    scoringArea: ScoringAreas.PEOPLE
  },
    // Add more people-related qualitative questions here if needed...

  // === Section 5: Your Systems ===
   {
    id: "q9", // Original Systems question
    section: sections[5],
    text: "How well documented are your core business processes?",
    type: "mcq",
    options: [
        { text: "Not documented", score: 1 },
        { text: "Some processes documented informally", score: 2 },
        { text: "Key processes documented", score: 3 },
        { text: "Most processes documented and followed", score: 4 },
        { text: "All core processes documented, reviewed, and optimized", score: 5 }
    ],
    valueKey: "processDocumentation",
    scoringArea: ScoringAreas.SYSTEMS
  },
   // Add more systems-related qualitative questions here if needed...

  // === Section 6: Your Financials ===
  // These are quantitative and don't have direct scores; they feed calculations.
  {
    id: "finRev",
    section: sections[6],
    text: "What is your approximate Last Full Year Revenue?",
    type: "number",
    valueKey: "currentRevenue",
    placeholder: "e.g., 1500000",
  },
  {
    id: "finGP",
    section: sections[6],
    text: "What is your approximate Last Full Year Gross Profit?",
    type: "number",
    valueKey: "grossProfit",
     placeholder: "e.g., 900000",
  },
   {
    id: "finEBITDA",
    section: sections[6],
    text: "What is your approximate Last Full Year EBITDA (Earnings Before Interest, Taxes, Depreciation, Amortization)?",
    type: "number",
    valueKey: "ebitda",
     placeholder: "e.g., 300000",
  },
   {
    id: "finAdj",
    section: sections[6],
    text: "What are your typical annual EBITDA Add-backs / Adjustments? (e.g., owner's excess salary, non-recurring expenses)",
    type: "number",
    valueKey: "ebitdaAdjustments",
    placeholder: "e.g., 50000 (can be 0)",
  },

]; // --- End of questionsData array ---


// --- Helper Functions and Derived Data (Defined AFTER questionsData) ---

/**
 * Helper function to identify qualitative questions (those that contribute to the score percentage).
 * @param {object} q - A question object from questionsData.
 * @returns {boolean} - True if the question is considered qualitative for scoring.
 */
const isQualitativeQuestion = (q) => {
  // Check if it has a scoringArea AND is not one of the explicitly quantitative/setup fields
  return q.scoringArea && ![
    'naicsSector',          // Setup field
    'naicsSubSector',       // Setup field
    'userEmail',            // Email capture field
    'currentRevenue',       // Quantitative financial field
    'grossProfit',          // Quantitative financial field
    'ebitda',               // Quantitative financial field
    'ebitdaAdjustments'     // Quantitative financial field
  ].includes(q.valueKey);
};

/**
 * An array containing only the qualitative questions used for scoring.
 * Defined AFTER questionsData.
 */
export const qualitativeQuestions = questionsData.filter(isQualitativeQuestion);

/**
 * Function to get all questions belonging to a specific step (section index).
 * @param {number} stepIndex - The index of the current step/section.
 * @returns {array} - An array of question objects for that step.
 */
export const getQuestionsForStep = (stepIndex) => {
  const sectionName = sections[stepIndex];
  // Filter the main questionsData which is already defined above
  return questionsData.filter(q => q.section === sectionName);
};

/**
 * Calculates the maximum possible score achievable from all qualitative questions.
 * Defined AFTER qualitativeQuestions.
 * @returns {number} - The total maximum possible score.
 */
export const calculateMaxPossibleScore = () => {
  return qualitativeQuestions.reduce((total, q) => {
    if (q.type === 'mcq' && q.options && q.options.length > 0) {
      // Find the highest score among the options for this MCQ
      const maxOptionScore = Math.max(0, ...q.options.map(opt => opt.score || 0));
      return total + maxOptionScore;
    }
    // Add logic here if other qualitative question types (e.g., sliders) contribute score
    return total;
  }, 0);
};


// --- Valuation Tiers and Logic ---

/**
 * Defines the Adjusted EBITDA tiers and their base/max multiples.
 * Order is important: Higher thresholds must come first for the .find() method to work correctly.
 */
export const ebitdaTiers = [
    { threshold: 5000000, stage: "Mature Scaleup", baseMultiple: 5, maxMultiple: 7 },
    { threshold: 3000000, stage: "Scale Up", baseMultiple: 4, maxMultiple: 6 },
    { threshold: 2000000, stage: "Mature Grow-up", baseMultiple: 3.5, maxMultiple: 5 },
    { threshold: 1500000, stage: "Grow-up", baseMultiple: 3, maxMultiple: 4.5 },
    { threshold: 1000000, stage: "Mature Start-up", baseMultiple: 2.5, maxMultiple: 3.5 },
    { threshold: 0, stage: "Startup", baseMultiple: 2, maxMultiple: 3 } // Base case for >= 0 EBITDA
];

/**
 * Determines the business stage and industry-adjusted multiple range based on Adj. EBITDA and industry selection.
 * @param {number} adjEbitda - Calculated Adjusted EBITDA.
 * @param {string} sectorName - Selected top-level NAICS sector name.
 * @param {string} subSectorName - Selected specific NAICS sub-sector name.
 * @returns {object} - { stage: string, baseMultiple: number, maxMultiple: number, industryAdjustment: number }
 */
export const getValuationParameters = (adjEbitda, sectorName, subSectorName) => {
    // Find the appropriate EBITDA tier
    const tier = ebitdaTiers.find(t => adjEbitda >= t.threshold);

    if (!tier) {
        // Handle cases below the lowest threshold (e.g., negative EBITDA)
        return { stage: "Pre-Startup / Negative EBITDA", baseMultiple: 0, maxMultiple: 0, industryAdjustment: 1 };
    }

    // Get the industry adjustment factor using the function that searches the nested structure in naicsData.js
    const industryAdjustment = getIndustryAdjustmentFactor(sectorName, subSectorName);

    // Apply the industry adjustment to the tier's base and max multiples
    const adjustedBaseMultiple = tier.baseMultiple * industryAdjustment;
    const adjustedMaxMultiple = tier.maxMultiple * industryAdjustment;

    // Return the calculated parameters
    return {
        stage: tier.stage,
        baseMultiple: adjustedBaseMultiple, // Return the *adjusted* multiple
        maxMultiple: adjustedMaxMultiple, // Return the *adjusted* multiple
        industryAdjustment: industryAdjustment // Also return the factor itself for transparency if needed
    };
};