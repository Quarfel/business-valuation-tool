// src/questions.js
import { ScoringAreas } from './scoringAreas';
import { naicsSectors, getSubSectors, getIndustryAdjustmentFactor } from './naicsData'; // Assuming naicsData.js is in the same src folder

// --- Define Section Titles (9 Steps Total) ---
export const sections = [
    "Your Profile",             // Step 1 (Index 0)
    "Expansion Capability",     // Step 2 (Index 1) - E
    "Marketing & Brand Equity", // Step 3 (Index 2) - M
    "Profitability Metrics",    // Step 4 (Index 3) - P (Qualitative)
    "Offering Excellence",      // Step 5 (Index 4) - O
    "Workforce & Leadership",   // Step 6 (Index 5) - W
    "Execution Systems",        // Step 7 (Index 6) - E (Execution)
    "Robust Market Position",   // Step 8 (Index 7) - R
    "Your Financials & Industry" // Step 9 (Index 8) - Inputs
];

// --- Define the Main Array of All Questions ---
export const questionsData = [

    // === Section 0: Your Profile ===
    {
        id: "profile1", section: sections[0],
        text: "What is your primary role in the business?",
        type: "mcq", valueKey: "ownerRole", // No scoringArea
        options: [
            { text: "Owner/Founder", score: 0 }, { text: "CEO", score: 0 },
            { text: "Managing Partner", score: 0 }, { text: "Investor", score: 0 },
            { text: "Other", score: 0 }
        ]
    },
    {
        id: "profile2", section: sections[0],
        text: "How long have you been involved with this business?",
        type: "mcq", valueKey: "yearsInvolved", // No scoringArea
        options: [
            { text: "Less than 1 year", score: 0 }, { text: "1-3 years", score: 0 },
            { text: "4-7 years", score: 0 }, { text: "8-15 years", score: 0 },
            { text: "Over 15 years", score: 0 }
        ]
    },
    {
        id: "profile3", section: sections[0],
        text: "Enter your email address. This is crucial for saving your progress and receiving results.",
        type: "email", valueKey: "userEmail", // No scoringArea
        placeholder: "your.email@example.com"
    },

    // === Section 1: Expansion Capability (E - Max Raw Score: 20) ===
    {
        id: "exp1", section: sections[1], scoringArea: ScoringAreas.EXPANSION,
        text: "How prepared are your current systems and processes to handle 3x your current business volume?",
        type: "mcq", valueKey: "expansionVolumePrep",
        options: [
            { text: "Very prepared, systems designed for scale", score: 5 },
            { text: "Moderately prepared, would require significant adjustments", score: 3 },
            { text: "Somewhat prepared, major overhaul needed", score: 1 },
            { text: "Not prepared / Unsure", score: 0 }
        ]
    },
    {
        id: "exp2", section: sections[1], scoringArea: ScoringAreas.EXPANSION,
        text: "Do you have a documented process or 'playbook' for expanding into new geographic markets or locations?",
        type: "mcq", valueKey: "expansionPlaybook",
        options: [
            { text: "Yes, detailed and tested playbook exists", score: 5 },
            { text: "Yes, a basic process is documented", score: 3 },
            { text: "Considered informally, but not documented", score: 1 },
            { text: "No specific plans or documentation", score: 0 }
        ]
    },
    {
        id: "exp3", section: sections[1], scoringArea: ScoringAreas.EXPANSION,
        text: "How systematic is your approach to developing and launching new service or product line extensions?",
        type: "mcq", valueKey: "expansionNewServices",
        options: [
            { text: "Formal process with market validation and ROI analysis", score: 5 },
            { text: "Semi-formal process, some analysis done", score: 3 },
            { text: "Ad-hoc, based on opportunity or requests", score: 1 },
            { text: "Rarely/Never introduce new lines", score: 0 }
        ]
    },
     {
        id: "exp4", section: sections[1], scoringArea: ScoringAreas.EXPANSION,
        text: "How significant are strategic partnerships (suppliers, referrals, channels) to your business growth and operations?",
        type: "mcq", valueKey: "expansionPartnerships",
        options: [
            { text: "Critical, with well-managed agreements/programs providing clear advantages", score: 5 },
            { text: "Important, contribute significantly to growth or efficiency", score: 3 },
            { text: "Minor role / Some ad-hoc relationships exist", score: 1 },
            { text: "Not a significant factor / No real strategic partnerships", score: 0 }
        ]
    },

    // === Section 2: Marketing & Brand Equity (M - Max Raw Score: 20) ===
     {
        id: "mkt1", section: sections[2], scoringArea: ScoringAreas.MARKETING,
        text: "How well-known and regarded is your brand within your primary target market?",
        type: "mcq", valueKey: "marketingBrandRec",
        options: [
            { text: "Recognized leader with strong positive reputation, often sought out", score: 5 },
            { text: "Well-known by target customers, generally positive perception", score: 4 },
            { text: "Some recognition among target customers, neutral perception", score: 2 },
            { text: "Largely unknown or weak/negative reputation", score: 0 }
        ]
    },
    {
        id: "mkt2", section: sections[2], scoringArea: ScoringAreas.MARKETING,
        text: "How effective is your website and overall digital presence in generating qualified leads or business?",
        type: "mcq", valueKey: "marketingDigitalPresence",
        options: [
            { text: "Very effective: Optimized, major source of qualified leads/sales, strong analytics", score: 5 },
            { text: "Moderately effective: Generates some leads/business, basic analytics", score: 3 },
            { text: "Basic online presence exists, but generates minimal leads/business", score: 1 },
            { text: "Ineffective or minimal/outdated digital presence", score: 0 }
        ]
    },
     {
        id: "mkt3", section: sections[2], scoringArea: ScoringAreas.MARKETING,
        text: "How systematic and measurable is your process for generating new leads?",
        type: "mcq", valueKey: "marketingLeadGen",
        options: [
            { text: "Multiple consistent channels tracked with clear ROI and Cost Per Lead (CPL) metrics", score: 5 },
            { text: "A single consistent channel tracked with clear ROI and CPL metrics", score: 3 },
            { text: "A few channels used consistently, some tracking of effectiveness in place", score: 1 },
            { text: "Ad-hoc marketing/sales efforts, little measurement or inconsistent channels", score: 0 }
        ]
    },
    {
        id: "mkt4", section: sections[2], scoringArea: ScoringAreas.MARKETING,
        text: "How clearly and consistently is your unique value proposition communicated across your marketing materials and sales efforts?",
        type: "mcq", valueKey: "marketingComms",
        options: [
            { text: "Very clear, consistent, and differentiated messaging across all touchpoints", score: 5 },
            { text: "Mostly clear and consistent, but could be improved", score: 3 },
            { text: "Somewhat inconsistent or unclear messaging depending on channel/person", score: 1 },
            { text: "Value proposition is not well-defined or poorly communicated", score: 0 }
        ]
    },

    // === Section 3: Profitability Metrics (P - Max Raw Score: 20) === (Qualitative Focus)
     {
        id: "prof1", section: sections[3], scoringArea: ScoringAreas.PROFITABILITY,
        text: "Over the past 3 years, what has been the general trend of your business's profitability (e.g., EBITDA, Net Profit margin)?",
        type: "mcq", valueKey: "profitTrend",
        options: [
            { text: "Strong, consistent growth (Profit % increasing or growing faster than revenue)", score: 5 },
            { text: "Moderate or steady growth (Profit % stable or growing with revenue)", score: 3 },
            { text: "Flat or inconsistent profitability (Ups and downs, or profit % shrinking)", score: 1 },
            { text: "Declining profitability", score: 0 }
        ]
    },
    {
        id: "prof2", section: sections[3], scoringArea: ScoringAreas.PROFITABILITY,
        text: "How do you believe your Gross Profit Margins compare to direct competitors in your specific industry? (Best guess)",
        type: "mcq", valueKey: "profitMargins",
        options: [
            { text: "Likely Top Tier (Significantly higher, indicating strong pricing power or efficiency)", score: 5 },
            { text: "Likely Above Average", score: 4 },
            { text: "Likely Average", score: 2 },
            { text: "Likely Below Average", score: 1 },
            { text: "Unsure / Don't track this", score: 0 }
        ]
    },
    {
        id: "prof3", section: sections[3], scoringArea: ScoringAreas.PROFITABILITY,
        text: "Approximately what percentage of your total revenue is recurring or comes from long-term contracts (predictable income)?",
        type: "mcq", valueKey: "profitRecurringRev",
        options: [
             { text: "High (> 50%)", score: 5 },
             { text: "Significant (25-50%)", score: 4 },
             { text: "Moderate (10-24%)", score: 2 },
             { text: "Low (< 10%) or None (Primarily project/transactional based)", score: 1 }
        ]
    },
     {
        id: "prof4", section: sections[3], scoringArea: ScoringAreas.PROFITABILITY,
        text: "How rigorous and proactive is your company's financial planning, including budgeting, cash flow forecasting, and regular financial performance reviews?",
        type: "mcq", valueKey: "profitFinancialMgmt",
        options: [
             { text: "Very rigorous: Formal budgets, rolling cash flow forecasts, frequent detailed reviews (MBRs) with variance analysis", score: 5 },
             { text: "Moderately rigorous: Annual budget, some basic forecasting, periodic high-level reviews", score: 3 },
             { text: "Basic: Limited budgeting/forecasting, infrequent or informal reviews", score: 1 },
             { text: "Largely reactive / Poor financial visibility / Managed by gut feel", score: 0 }
        ]
    },

    // === Section 4: Offering Excellence (O - Max Raw Score: 20) ===
    {
        id: "off1", section: sections[4], scoringArea: ScoringAreas.OFFERING,
        text: "Do you systematically measure customer satisfaction (e.g., NPS, CSAT scores, detailed surveys) and actively use the feedback for improvement?",
        type: "mcq", valueKey: "offeringSatisfaction",
        options: [
            { text: "Yes, systematically measured (e.g., NPS > 50 or industry leader), tracked, analyzed, and demonstrably used for improvements", score: 5 },
            { text: "Yes, measured occasionally or less formally (e.g., NPS 20-50), some feedback used", score: 3 },
            { text: "Rarely measure satisfaction, feedback collection is passive (e.g., only if customers complain)", score: 1 },
            { text: "No structured measurement process", score: 0 }
        ]
    },
    {
        id: "off2", section: sections[4], scoringArea: ScoringAreas.OFFERING,
        text: "How strongly differentiated is your core product/service offering compared to your main competitors?",
        type: "mcq", valueKey: "offeringDifferentiation",
        options: [
            { text: "Highly differentiated: Clear unique selling propositions (USPs), potentially proprietary elements, hard for competitors to replicate", score: 5 },
            { text: "Significantly differentiated: Noticeable advantages in key features, service, or branding", score: 4 },
            { text: "Some differentiation: Minor differences, but largely similar offerings exist", score: 2 },
            { text: "Commodity offering: Little differentiation, competes mainly on price or availability", score: 1 }
        ]
    },
    {
        id: "off3", section: sections[4], scoringArea: ScoringAreas.OFFERING,
        text: "How well-documented and consistently followed are your quality assurance (QA) processes for services or products?",
        type: "mcq", valueKey: "offeringQualitySystems",
        options: [
            { text: "Well-documented QA processes/SOPs exist, are consistently followed by team, and results (low error/rework rates) are tracked", score: 5 },
            { text: "Partial documentation or QA process exists but is inconsistently followed or not tracked well", score: 3 },
            { text: "Informal quality checks based on individual experience or spot-checking", score: 1 },
            { text: "No formal quality assurance process", score: 0 }
        ]
    },
    {
        id: "off4", section: sections[4], scoringArea: ScoringAreas.OFFERING,
        text: "How active is your business in improving existing offerings and developing new ones based on market needs and feedback?",
        type: "mcq", valueKey: "offeringInnovation",
        options: [
            { text: "Very active: Structured continuous improvement process AND regular introduction of relevant new offerings/features", score: 5 },
            { text: "Moderately active: Occasional improvements or new offerings introduced based on feedback or opportunity", score: 3 },
            { text: "Reactive: Changes primarily driven only by direct complaints or major competitor moves", score: 1 },
            { text: "Static: Little change or innovation in offerings over the last few years", score: 0 }
        ]
    },

    // === Section 5: Workforce & Leadership (W - Max Raw Score: 20) ===
    {
        id: "work1", section: sections[5], scoringArea: ScoringAreas.WORKFORCE,
        text: "How reliant is the business's day-to-day operation and key strategic decision-making on the primary owner(s)?",
        type: "mcq", valueKey: "workforceOwnerReliance",
        options: [
            { text: "Low reliance: Strong management team empowered to run operations; owner focuses on high-level strategy/vision", score: 5 },
            { text: "Moderate reliance: Owner involved in key decisions/approvals, but team manages daily tasks effectively", score: 3 },
            { text: "Heavily reliant: Owner frequently involved in operational details and most key decisions", score: 1 },
            { text: "Completely reliant: Business cannot function effectively for more than a short period without owner's daily input", score: 0 }
        ]
    },
     {
        id: "work2", section: sections[5], scoringArea: ScoringAreas.WORKFORCE,
        text: "To what extent are employees held accountable with clear roles, responsibilities, and measurable performance indicators (KPIs)?",
        type: "mcq", valueKey: "workforceAccountability",
        options: [
             { text: "High accountability: Most roles have clearly defined responsibilities and measurable KPIs that are regularly reviewed", score: 5 },
             { text: "Moderate accountability: Key roles have defined responsibilities/KPIs, others less so; reviews may be inconsistent", score: 3 },
             { text: "Some accountability: Performance often measured informally or subjectively; roles may overlap or be unclear", score: 1 },
             { text: "Low accountability: Lack of clear roles, responsibilities, or performance metrics", score: 0 }
        ]
    },
    {
        id: "work3", section: sections[5], scoringArea: ScoringAreas.WORKFORCE,
        text: "How would you rate your employee retention and ability to attract needed talent compared to your industry peers?",
        type: "mcq", valueKey: "workforceRetention",
        options: [
            { text: "Excellent: High retention in key roles (low turnover), known as a desirable place to work, strong talent pipeline", score: 5 },
            { text: "Good: Retention is generally stable, able to attract needed talent with reasonable effort", score: 3 },
            { text: "Average: Turnover and recruitment challenges are typical for the industry", score: 2 },
            { text: "Challenging: Higher than average turnover or significant difficulty attracting/retaining key talent", score: 1 }
        ]
    },
    {
        id: "work4", section: sections[5], scoringArea: ScoringAreas.WORKFORCE,
        text: "How well is the company's long-term vision and strategic plan communicated and understood by employees?",
        type: "mcq", valueKey: "workforceAlignment",
        options: [
            { text: "Very well: Vision/plan clearly communicated, regularly reinforced, understood by most, influences work", score: 5 },
            { text: "Moderately well: Vision/plan shared, generally understood by managers and key staff", score: 3 },
            { text: "Somewhat understood: Communication is inconsistent or unclear; employees may not see how their work connects", score: 1 },
            { text: "Poorly understood / Not clearly defined or communicated", score: 0 }
        ]
    },

    // === Section 6: Execution Systems (E - Max Raw Score: 20) ===
    {
        id: "sys1", section: sections[6], scoringArea: ScoringAreas.SYSTEMS,
        text: "How comprehensive and consistently utilized are Standard Operating Procedures (SOPs) for your core business processes (e.g., sales, fulfillment, operations)?",
        type: "mcq", valueKey: "systemsSOPs",
        options: [
            { text: "Comprehensive SOPs exist for most core processes, are easily accessible, regularly used, and updated", score: 5 },
            { text: "SOPs exist for key processes, but usage or accessibility could be improved; updates may lag", score: 3 },
            { text: "Some informal documentation or reliance on 'tribal knowledge'; processes vary by person", score: 1 },
            { text: "Few documented processes; high degree of variability and inconsistency", score: 0 }
        ]
    },
    {
        id: "sys2", section: sections[6], scoringArea: ScoringAreas.SYSTEMS,
        text: "How effectively are key technology systems (e.g., CRM, ERP, Project Management, Financial Software) utilized and integrated to support efficient operations and provide useful data?",
        type: "mcq", valueKey: "systemsTech",
        options: [
            { text: "Highly effective: Key systems are well-integrated, widely adopted, data is accurate and used for decision-making, supports efficiency", score: 5 },
            { text: "Moderately effective: Key systems are used for core functions, but some data silos, manual workarounds, or underutilization exist", score: 3 },
            { text: "Basic utilization: Systems used minimally, significant manual processes still required, data may be unreliable or hard to access", score: 1 },
            { text: "Ineffective / Lacking key systems / Heavily reliant on spreadsheets and manual processes", score: 0 }
        ]
    },
    {
        id: "sys3", section: sections[6], scoringArea: ScoringAreas.SYSTEMS,
        text: "To what extent does the business use dashboards or regular reporting to track Key Performance Indicators (KPIs) and operational metrics?",
        type: "mcq", valueKey: "systemsKPIs",
        options: [
            { text: "Extensive use of real-time or frequently updated dashboards/reports with actionable KPIs tracked across departments, reviewed regularly", score: 5 },
            { text: "Regular (e.g., weekly/monthly) reporting on key metrics, some dashboard usage for management", score: 3 },
            { text: "Basic or infrequent reporting (e.g., only standard financial statements), limited operational KPI tracking", score: 1 },
            { text: "Little or no formal KPI tracking or operational reporting", score: 0 }
        ]
    },
    {
        id: "sys4", section: sections[6], scoringArea: ScoringAreas.SYSTEMS,
        text: "Are your financial statements prepared according to standard accounting principles (e.g., GAAP or equivalent) and suitable for external review (like an audit or due diligence)?",
        type: "mcq", valueKey: "systemsFinancials",
        options: [
            { text: "Yes, fully compliant, regularly reviewed by qualified personnel, clear audit trail, audit-ready with minimal effort", score: 5 },
            { text: "Largely compliant, reviewed internally, likely require some cleanup/adjustments for a formal audit or diligence", score: 3 },
            { text: "Basic bookkeeping exists, but may not be fully compliant or easily auditable; significant cleanup likely needed", score: 1 },
            { text: "Financial records are poor, unreliable, or not based on standard accounting principles", score: 0 }
        ]
    },

    // === Section 7: Robust Market Position (R - Max Raw Score: 20) ===
    {
        id: "mktpos1", section: sections[7], scoringArea: ScoringAreas.MARKET,
        text: "What is the perceived long-term growth potential of your primary target market(s)?",
        type: "mcq", valueKey: "marketGrowthPotential",
        options: [
            { text: "High Growth Market (e.g., >10% annual growth expected)", score: 5 },
            { text: "Moderate Growth Market (e.g., 3-10% annual growth expected)", score: 3 },
            { text: "Stable / Mature Market (e.g., 0-3% growth, low overall growth)", score: 1 },
            { text: "Declining Market", score: 0 }
        ]
    },
    {
        id: "mktpos2", section: sections[7], scoringArea: ScoringAreas.MARKET,
        text: "How diversified is your customer base? Consider the approximate percentage of total revenue coming from your single largest customer.",
        type: "mcq", valueKey: "marketCustConcentration",
        options: [
            { text: "Highly diversified (Largest customer consistently < 5-10% of revenue)", score: 5 },
            { text: "Well diversified (Largest customer consistently < 15-20% of revenue)", score: 4 },
            { text: "Moderately concentrated (Largest customer sometimes or consistently 20-35% of revenue)", score: 2 },
            { text: "Highly concentrated (Largest customer consistently > 35% of revenue)", score: 1 }
        ]
    },
    // ******** ADDED TAM SIZE QUESTION (Replaces Competitive Position) ********
    {
        id: "mktpos_tam_size", section: sections[7], scoringArea: ScoringAreas.MARKET,
        text: "Estimate the size of the Total Addressable Market (TAM) for your core offerings in your primary geographic area(s):",
        type: "mcq", valueKey: "marketTamSize",
        options: [
            { text: "Very Large (e.g., > $500 Million / National / Global)", score: 5 },
            { text: "Large (e.g., $50M - $500 Million / Large Regional)", score: 4 },
            { text: "Medium (e.g., $5M - $50 Million / City or Metro Area)", score: 3 },
            { text: "Small / Niche (e.g., < $5 Million / Localized)", score: 1 },
            { text: "Unsure / Not Defined", score: 0 }
        ]
    },
    // ******** ADDED MARKET SHARE QUESTION (Replaces Competitive Position) ********
     {
        id: "mktpos_market_share", section: sections[7], scoringArea: ScoringAreas.MARKET,
        text: "Estimate your company's current market share within that Total Addressable Market:",
        type: "mcq", valueKey: "marketShare",
        options: [
            { text: "Dominant Leader (> 30%)", score: 5 },
            { text: "Significant Player (10% - 30%)", score: 4 },
            { text: "Moderate Player (3% - 10%)", score: 2 },
            { text: "Small Player (< 3%)", score: 1 },
            { text: "Unsure", score: 0 }
        ]
    },
    // REMOVED: Original mktpos3 (Competitive Position) was replaced by the two above
    // REMOVED: Original mktpos4 (Resilience) - Decided to keep Resilience in thought process, adding it back below
    {
        id: "mktpos4", section: sections[7], scoringArea: ScoringAreas.MARKET, // Keep resilience, section now has 5 Qs
        text: "How resilient has your business model proven to be during past economic downturns or significant market shifts?",
        type: "mcq", valueKey: "marketResilience",
        options: [
            { text: "Very resilient: Maintained or even grew profitability during downturns; potentially counter-cyclical elements", score: 5 },
            { text: "Moderately resilient: Experienced some negative impact but recovered relatively quickly and strongly", score: 3 },
            { text: "Somewhat vulnerable: Significantly impacted, recovery was slow or difficult", score: 1 },
            { text: "Highly vulnerable / Untested: Business model seems highly susceptible to downturns or did not exist during the last major one", score: 0 }
        ]
    },
    // NOTE: The "Robust Market Position" section now has 5 questions. See note below.


    // === Section 8: Your Financials & Industry (Inputs) ===
    {
        id: "finRev", section: sections[8], text: "What is your approximate Last Full Year Revenue?",
        type: "number", valueKey: "currentRevenue", placeholder: "e.g., 1500000",
    },
    {
        id: "finGP", section: sections[8], text: "What is your approximate Last Full Year Gross Profit?",
        type: "number", valueKey: "grossProfit", placeholder: "e.g., 900000",
    },
    {
        id: "finEBITDA", section: sections[8], text: "What is your approximate Last Full Year EBITDA?",
        type: "number", valueKey: "ebitda", placeholder: "e.g., 300000",
    },
    {
        id: "finAdj", section: sections[8], text: "What are your typical annual EBITDA Add-backs / Adjustments?",
        type: "number", valueKey: "ebitdaAdjustments", placeholder: "e.g., 50000 (can be 0)",
    },
    {
        id: "industrySector", section: sections[8], text: "Select your primary Industry Sector:",
        type: "select", options: naicsSectors.map(s => s.name), valueKey: "naicsSector",
    },
    {
        id: "industrySubSector", section: sections[8], text: "Select your specific Industry Sub-Sector:",
        type: "select_dependent", dependsOn: "naicsSector",
        optionsGetter: (sectorName) => getSubSectors(sectorName).map(sub => sub.name),
        valueKey: "naicsSubSector",
    },

]; // --- End of questionsData array ---


// --- Helper Functions and Derived Data ---

/**
 * Helper function to identify qualitative questions (those that contribute to the score percentage).
 */
const isQualitativeQuestion = (q) => {
  // Check if it has a scoringArea AND is not one of the explicitly quantitative/setup fields
  return q.scoringArea && Object.values(ScoringAreas).includes(q.scoringArea);
};

/**
 * An array containing only the qualitative questions used for scoring.
 */
export const qualitativeQuestions = questionsData.filter(isQualitativeQuestion);

/**
 * Function to get all questions belonging to a specific step (section index).
 */
export const getQuestionsForStep = (stepIndex) => {
  if (stepIndex < 0 || stepIndex >= sections.length) {
      console.error(`Invalid stepIndex requested: ${stepIndex}`);
      return []; // Return empty array for invalid index
  }
  const sectionName = sections[stepIndex];
  return questionsData.filter(q => q.section === sectionName);
};

/**
 * Calculates the maximum possible score achievable from all qualitative questions.
 * IMPORTANT: Since section 7 now has 5 questions (max 25 points) and others have 4 (max 20 points),
 * the total max score changes, and sections are no longer *perfectly* equally weighted based on question count.
 * Max Score = (6 sections * 20 points) + (1 section * 25 points) = 120 + 25 = 145 points
 */
export const calculateMaxPossibleScore = () => {
  return qualitativeQuestions.reduce((total, q) => {
    if (q.type === 'mcq' && q.options && q.options.length > 0) {
      const maxOptionScore = Math.max(0, ...q.options.map(opt => opt.score || 0));
      return total + maxOptionScore;
    }
    return total;
  }, 0);
};


// --- Valuation Tiers and Logic ---

/**
 * Defines the Adjusted EBITDA tiers and their base/max multiples.
 * Order is important: Higher thresholds must come first.
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
 */
export const getValuationParameters = (adjEbitda, sectorName, subSectorName) => {
    // Ensure adjEbitda is a number
    const validAdjEbitda = typeof adjEbitda === 'number' && !isNaN(adjEbitda) ? adjEbitda : -1;

    // Find the appropriate EBITDA tier
    const tier = ebitdaTiers.find(t => validAdjEbitda >= t.threshold);

    if (!tier) {
        // Handle cases below the lowest threshold (e.g., negative EBITDA)
        return { stage: "Pre-Revenue / Negative EBITDA", baseMultiple: 0, maxMultiple: 0, industryAdjustment: 1 };
    }

    // Get the industry adjustment factor
    const industryAdjustment = getIndustryAdjustmentFactor(sectorName, subSectorName); // Assumes this function returns 1.0 if not found

    // Apply the industry adjustment to the tier's base and max multiples
    const adjustedBaseMultiple = tier.baseMultiple * industryAdjustment;
    const adjustedMaxMultiple = tier.maxMultiple * industryAdjustment;

    return {
        stage: tier.stage,
        baseMultiple: adjustedBaseMultiple,
        maxMultiple: adjustedMaxMultiple,
        industryAdjustment: industryAdjustment
    };
};