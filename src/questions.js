// src/questions.js
import { ScoringAreas } from './scoringAreas'; // Asegúrate que la ruta es correcta
import { getIndustryAdjustmentFactor } from './naicsData'; // Asegúrate que la ruta es correcta y la función es necesaria

// --- Estructura ORIGINAL de Secciones (9 secciones, índice 0-8) ---
export const sections = [
    "Your Profile",                     // 0
    "Expansion Capability",             // 1
    "Marketing & Brand Equity",         // 2
    "Profitability Metrics",            // 3
    "Offering & Sales Effectiveness",   // 4
    "Workforce & Leadership",           // 5
    "Execution Systems",                // 6
    "Robust Market Position",           // 7
    "Your Financials & Industry"        // 8
];

// --- questionsData envuelto en una función ---
export const getQuestionsDataArray = () => {
    if (!sections || !ScoringAreas || !ScoringAreas.OFFERING_SALES) {
        return [];
    }

    // *** INICIO: Definición COMPLETA del array de preguntas ***
    const theQuestionsArray = [

        // === Section 0: Your Profile===
        {
            id: "industrySector",
            section: sections[0],
            text: "Select your primary Industry Sector:",
            type: "select", valueKey: "naicsSector",
            required: true, isEssentialForShortMode: true
        },
        {
            id: "industrySubSector",
            section: sections[0],
            text: "Select your specific Industry Sub-Sector:",
            type: "select_dependent", dependsOn: "naicsSector", valueKey: "naicsSubSector",
            required: true, isEssentialForShortMode: true
        },
        {
            id: "finRev",
            section: sections[0],
            text: "What is your approximate Last Full Year Revenue?",
            type: "number", valueKey: "currentRevenue", placeholder: "e.g., $ 1,500,000",
            required: true, helpText: "...", isEssentialForShortMode: true
        },
        {
            id: "profileEmployees",
            section: sections[0],
            text: "Approximately how many full-time equivalent (FTE) employees does the business currently have?",
            type: "mcq", valueKey: "employeeCountRange",
            options: [
                { text: "1-5 FTEs", score: 0 }, { text: "6-15 FTEs", score: 0 },
                { text: "16-30 FTEs", score: 0 }, { text: "31-50 FTEs", score: 0 },
                { text: "51-100 FTEs", score: 0 }, { text: "100+ FTEs", score: 0 }
            ],
            required: true, isEssentialForShortMode: true
        },
        {
            id: "profileLocationState",
            section: sections[0],
            text: "In which State is the business primarily located/headquartered?",
            type: "text", valueKey: "locationState", placeholder: "e.g., Texas or CA",
            required: true, isEssentialForShortMode: true
        },
        {
            id: "profileLocationZip",
            section: sections[0],
            text: "What is the primary Zip Code?",
            type: "text", valueKey: "locationZip", placeholder: "e.g., 78701",
            required: true, isEssentialForShortMode: true
        },
        {
            id: "profile_directVsIntermediary",
            section: sections[0],
            text: "Considering your revenue sources, which best describes the balance between selling directly to the end-user/asset owner versus selling through intermediary businesses (e.g., prime contractors, agencies)?",
            type: "mcq", valueKey: "revenueSourceBalance",
            required: true,
            options: [
                { text: "Mostly/All Direct (>80% Direct Revenue)", score: 0 },
                { text: "Primarily Direct (approx. 60-80% Direct Revenue)", score: 0 },
                { text: "Roughly Balanced Mix (approx. 40-60% Direct Revenue)", score: 0 },
                { text: "Primarily Intermediary (approx. 20-40% Direct Revenue)", score: 0 },
                { text: "Mostly/All Intermediary (<20% Direct Revenue)", score: 0 }
            ],
            isEssentialForShortMode: true
        },
        {
            id: "profile_b2bVsB2c",
            section: sections[0],
            text: "Estimate the percentage of your revenue coming from Business customers (B2B) versus Individual Consumers (B2C):",
            type: "mcq", valueKey: "customerTypeBalance",
            required: true,
            options: [
                { text: "Mostly/All Businesses (>80% B2B Revenue)", score: 0 },
                { text: "Primarily Businesses (approx. 60-80% B2B Revenue)", score: 0 },
                { text: "Roughly Balanced Mix (approx. 40-60% B2B Revenue)", score: 0 },
                { text: "Primarily Consumers (approx. 20-40% B2B Revenue)", score: 0 },
                { text: "Mostly/All Consumers (<20% B2B Revenue)", score: 0 }
            ],
            isEssentialForShortMode: true
        },
         {
            id: "profile1",
            section: sections[0],
            text: "What is your primary role in the business?",
            type: "mcq", valueKey: "ownerRole",
            options: [ { text: "Owner/Founder", score: 0 }, { text: "CEO", score: 0 }, { text: "Managing Partner", score: 0 }, { text: "Investor", score: 0 }, { text: "Other", score: 0 } ],
            required: true, isEssentialForShortMode: true
        },
        {
            id: "profile2",
            section: sections[0],
            text: "How long have you been involved with this business?",
            type: "mcq", valueKey: "yearsInvolved",
            options: [ { text: "Less than 1 year", score: 0 }, { text: "1-3 years", score: 0 }, { text: "4-7 years", score: 0 }, { text: "8-15 years", score: 0 }, { text: "Over 15 years", score: 0 } ],
            required: true, isEssentialForShortMode: true
        },
        {
            id: "profile3",
            section: sections[0],
            text: "Enter your email address. This is crucial for saving your progress and receiving results.",
            type: "email", valueKey: "userEmail", placeholder: "your.email@example.com",
            required: true, isEssentialForShortMode: true
        },

        // === Section 1: Expansion Capability (SIN CAMBIOS) ===
                { id: "exp1", section: sections[1], scoringArea: ScoringAreas.EXPANSION, text: "How prepared are your current systems and processes to handle 3x your current business volume?", type: "mcq", valueKey: "expansionVolumePrep", 
            isEssentialForShortMode: true, 
            options: [ 
                { text: "Very prepared, systems designed for scale", score: 5, vc_score: 10 }, 
                { text: "Moderately prepared, would require significant adjustments", score: 3, vc_score: 6 }, 
                { text: "Somewhat prepared, major overhaul needed", score: 1, vc_score: 2 }, 
                { text: "Not prepared / Unsure", score: 0, vc_score: 0 } 
            ], 
            required: true, 
            max_vc_score: 10
        },
        { id: "exp2", section: sections[1], scoringArea: ScoringAreas.EXPANSION, text: "Do you have a documented process or 'playbook' for expanding into new geographic markets or locations?", type: "mcq", valueKey: "expansionPlaybook", options: [ { text: "Yes, detailed and tested playbook exists", score: 3 }, { text: "Yes, a basic process is documented", score: 2 }, { text: "Considered informally, but not documented", score: 1 }, { text: "No specific plans or documentation", score: 0 } ], required: true, helpText: "'Playbook': A detailed guide or manual that documents the steps and strategies to carry out a complex task, such as expanding into new markets." },
        { id: "exp3", section: sections[1], scoringArea: ScoringAreas.EXPANSION, text: "How systematic is your approach to developing and launching new service or product line extensions?", type: "mcq", valueKey: "expansionNewServices", options: [ { text: "Formal process with market validation and ROI analysis", score: 3 }, { text: "Semi-formal process, some analysis done", score: 2 }, { text: "Ad-hoc, based on opportunity or requests", score: 1 }, { text: "Rarely/Never introduce new lines", score: 0 } ], required: true, helpText: "'ROI Analysis': A metric used to evaluate the profitability of an investment." },
        { id: "exp5", section: sections[1], scoringArea: ScoringAreas.EXPANSION, text: "Regarding customer refunds and significant complaints, which statement best describes your current situation?", type: "mcq", valueKey: "expansionProblemRate", options: [ { text: "Refunds/significant complaints are rare (<1-2%), and we have clear processes to resolve them effectively when they occur.", score: 5 }, { text: "They occur occasionally (e.g., 3-5% range), and we generally manage them adequately as they arise.", score: 3 }, { text: "They happen somewhat frequently (>5% range), or our process for handling them is inconsistent and sometimes problematic.", score: 1 }, { text: "Refunds/complaints are a common or significant issue, often time-consuming, or we don't track this data reliably.", score: 0 } ], required: true, helpText: "Significant complaints refer to issues requiring notable effort or escalation to resolve, beyond routine inquiries." },

        // === Section 2: Marketing & Brand Equity (SIN CAMBIOS) ===
        { id: "mkt1", section: sections[2], scoringArea: ScoringAreas.MARKETING, text: "How well-known and regarded is your brand within your primary target market?", type: "mcq", valueKey: "marketingBrandRec", options: [ { text: "Recognized leader with strong positive reputation, often sought out", score: 3 }, { text: "Well-known by target customers, generally positive perception", score: 2 }, { text: "Some recognition among target customers, neutral perception", score: 1 }, { text: "Largely unknown or weak/negative reputation", score: 0 } ], required: true },
        { id: "mkt2", section: sections[2], scoringArea: ScoringAreas.MARKETING, text: "How effective is your website and overall digital presence in generating qualified leads or business?", type: "mcq", valueKey: "marketingDigitalPresence", options: [ { text: "Very effective: Optimized, major source of qualified leads/sales, strong analytics", score: 3 }, { text: "Moderately effective: Generates some leads/business, basic analytics", score: 2 }, { text: "Basic online presence exists, but generates minimal leads/business", score: 1 }, { text: "Ineffective or minimal/outdated digital presence", score: 0 } ], required: true },
        { id: "mkt3", section: sections[2], scoringArea: ScoringAreas.MARKETING, text: "How systematic and measurable is your process for generating new leads?", type: "mcq", valueKey: "marketingLeadGen", 
            isEssentialForShortMode: true,
            options: [ 
                { text: "Multiple consistent channels tracked with clear ROI and Cost Per Lead (CPL) metrics", score: 5, vc_score: 10 }, 
                { text: "A single consistent channel tracked with clear ROI and CPL metrics", score: 3, vc_score: 7 }, 
                { text: "A few channels used consistently, some tracking of effectiveness in place", score: 1, vc_score: 3 }, 
                { text: "Ad-hoc marketing/sales efforts, little measurement or inconsistent channels", score: 0, vc_score: 0 } 
            ], 
            required: true, helpText: "'CPL': Cost Per Lead...",
            max_vc_score: 10
        },
        { id: "mkt4", section: sections[2], scoringArea: ScoringAreas.MARKETING, text: "How clearly and consistently is your unique value proposition communicated across your marketing materials and sales efforts?", type: "mcq", valueKey: "marketingComms", options: [ { text: "Very clear, consistent, and differentiated messaging across all touchpoints", score: 3 }, { text: "Mostly clear and consistent, but could be improved", score: 2 }, { text: "Somewhat inconsistent or unclear messaging depending on channel/person", score: 1 }, { text: "Value proposition is not well-defined or poorly communicated", score: 0 } ], required: true, helpText: "'Unique Value Proposition': A clear statement that describes the benefit you offer, how you address the customer's needs, and what sets you apart from the competition." },
        { id: "mkt5", section: sections[2], scoringArea: ScoringAreas.MARKETING, text: "How clearly defined is your Ideal Customer Profile (ICP), and how strongly do your marketing and sales efforts focus only on attracting this profile?", type: "mcq", valueKey: "marketingICPFocus", options: [ { text: "Very clearly defined ICP; marketing/sales strictly focuses only on this profile.", score: 3 }, { text: "ICP is defined; we primarily target them but occasionally pursue other opportunistic leads.", score: 2 }, { text: "We have a general idea of our customers, but it's not formally defined or strictly targeted.", score: 1 }, { text: "We try to serve almost anyone who expresses interest; no clear ICP definition or targeting focus.", score: 0 } ], required: true, helpText: "'ICP': Ideal Customer Profile. A detailed description of the type of customer that gets the most value from your offering and provides the most value to your company." },

        // === Section 3: Profitability Metrics (SIN CAMBIOS) ===
               { id: "prof1", section: sections[3], scoringArea: ScoringAreas.PROFITABILITY, text: "Over the past 3 years, what has been the general trend of your business's profitability (e.g., EBITDA, Net Profit margin)?", type: "mcq", valueKey: "profitTrend", 
            isEssentialForShortMode: true,
            options: [ 
                { text: "Strong, consistent growth (Profit % increasing or growing faster than revenue)", score: 7, vc_score: 10 }, 
                { text: "Moderate or steady growth (Profit % stable or growing with revenue)", score: 4, vc_score: 7 }, 
                { text: "Flat or inconsistent profitability (Ups and downs, or profit % shrinking)", score: 1, vc_score: 2 }, 
                { text: "Declining profitability", score: 0, vc_score: 0 } 
            ], 
            required: true, helpText: "'EBITDA': ...",
            max_vc_score: 10
        },
        { id: "prof2", section: sections[3], scoringArea: ScoringAreas.PROFITABILITY, text: "How do you believe your Gross Profit Margins compare to direct competitors in your specific industry? (Best guess)", type: "mcq", valueKey: "profitMargins", options: [ { text: "Likely Top Tier (Significantly higher, indicating strong pricing power or efficiency)", score: 5 }, { text: "Likely Above Average", score: 4 }, { text: "Likely Average", score: 2 }, { text: "Likely Below Average", score: 1 }, { text: "Unsure / Don't track this", score: 0 } ], required: true, helpText: "'Gross Profit Margin' = Revenue - Cost of Goods Sold. Indicates profitability before overhead expenses (such as rent, administrative salaries, etc)." },
        { id: "prof3", section: sections[3], scoringArea: ScoringAreas.PROFITABILITY, text: "Approximately what percentage of your total revenue is recurring or comes from long-term contracts (predictable income)?", type: "mcq", valueKey: "profitRecurringRev", options: [ { text: "High (> 50%)", score: 7 }, { text: "Significant (25-50%)", score: 6 }, { text: "Moderate (10-24%)", score: 3 }, { text: "Low (< 10%) or None (Primarily project/transactional based)", score: 1 } ], required: true, helpText: "'Recurring Revenue': Predictable income received on a regular basis (e.g., subscriptions, contracts) with a high degree of certainty." },
        { id: "prof4", section: sections[3], scoringArea: ScoringAreas.PROFITABILITY, text: "How rigorous and proactive is your company's financial planning, including budgeting, cash flow forecasting, and regular financial performance reviews?", type: "mcq", valueKey: "profitFinancialMgmt", options: [ { text: "Very rigorous: Formal budgets, rolling cash flow forecasts, frequent detailed reviews (MBRs) with variance analysis", score: 3 }, { text: "Moderately rigorous: Annual budget, some basic forecasting, periodic high-level reviews", score: 2 }, { text: "Basic: Limited budgeting/forecasting, infrequent or informal reviews", score: 1 }, { text: "Largely reactive / Poor financial visibility / Managed by gut feel", score: 0 } ], required: true, helpText:"'MBRs' (Monthly Business Reviews): Monthly business reviews. 'Variance Analysis': The analysis of differences between actual results and budgeted or forecasted figures." },
        { id: "prof5", section: sections[3], scoringArea: ScoringAreas.PROFITABILITY, text: "How would you characterize your company's overall employee compensation (salary + benefits) relative to the market rate for similar roles in your industry and location?", type: "mcq", valueKey: "profitCompensationLevel", options: [ { text: "Consistently competitive or slightly above market rate, benchmarked regularly.", score: 3 }, { text: "Generally at market rate, with occasional benchmarking.", score: 2 }, { text: "Often below market rate, or compensation hasn't been formally benchmarked recently.", score: 1 }, { text: "Significantly below market rate (causing retention issues) OR Significantly above market rate (without clear justification).", score: 0 } ], required: true, helpText: "'Benchmarking': Comparing your compensation practices against other companies in your industry/location to ensure competitiveness." },

        // === Section 4: Offering & Sales Effectiveness (SIN CAMBIOS) ===
        { id: "off1", section: sections[4], scoringArea: ScoringAreas.OFFERING_SALES, text: "Do you systematically measure customer satisfaction (e.g., NPS, CSAT scores, detailed surveys) and actively use the feedback for improvement?", type: "mcq", valueKey: "offeringSatisfaction", options: [ { text: "Yes, systematic measurement (e.g., NPS) with formal process for review and action.", score: 5 }, { text: "Yes, we collect feedback (e.g., surveys) but usage is less formal or consistent.", score: 3 }, { text: "We collect feedback informally (e.g., occasional conversations) or rarely.", score: 1 }, { text: "No systematic measurement of customer satisfaction.", score: 0 } ], required: true, helpText: "'NPS' (Net Promoter Score): Measures loyalty (from -100 to +100). 'CSAT' (Customer Satisfaction Score): Measures satisfaction with specific interactions (e.g., 1 to 5 scale)." },
        { id: "sales1", section: sections[4], scoringArea: ScoringAreas.OFFERING_SALES, text: "How effective and repeatable is your sales process from lead to close?", type: "mcq", valueKey: "salesProcessEffectiveness", options: [ { text: "Very effective: Clearly defined, documented, consistently followed process with strong conversion rates.", score: 5 }, { text: "Moderately effective: Process exists and is generally followed, but some inconsistencies or areas for improvement.", score: 3 }, { text: "Somewhat effective: Process is informal or varies significantly; results are inconsistent.", score: 1 }, { text: "Ineffective: Ad-hoc sales efforts, lack of clear process, poor results.", score: 0 } ], required: true },
        { id: "sales2", section: sections[4], scoringArea: ScoringAreas.OFFERING_SALES, text: "How would you describe your typical sales cycle length and closing predictability?", type: "mcq", valueKey: "salesCyclePredictability", options: [ { text: "Short and predictable: Consistent sales cycle length, high confidence in forecasting.", score: 3 }, { text: "Moderately predictable: Some variation in cycle length, reasonable forecasting accuracy.", score: 2 }, { text: "Variable: Sales cycle length varies significantly, forecasting is challenging.", score: 1 }, { text: "Long and unpredictable: Very inconsistent cycle, low confidence in forecasting.", score: 0 } ], required: true },
        { id: "sales3", section: sections[4], scoringArea: ScoringAreas.OFFERING_SALES, text: "How effectively does your business convert leads into qualified opportunities and closed sales?", type: "mcq", valueKey: "salesConversionRates", options: [ { text: "High conversion rates: Strong performance at each stage of the funnel, well above industry average.", score: 3 }, { text: "Good conversion rates: Solid performance, generally meeting or slightly exceeding industry average.", score: 2 }, { text: "Average or below average conversion rates: Room for improvement in funnel efficiency.", score: 1 }, { text: "Poor conversion rates: Significant leakage in the sales funnel, low close rates.", score: 0 } ], required: true },
                { id: "off5", section: sections[4], scoringArea: ScoringAreas.OFFERING_SALES, text: "Considering a typical new customer, what best describes the revenue generated after their very first purchase within the first 12 months?", type: "mcq", valueKey: "offeringFollowOnRevenue", 
            isEssentialForShortMode: true,
            options: [ 
                { text: "Significant additional revenue: The first purchase often represents less than 50% of the total revenue from that customer in the first year.", score: 5, vc_score: 10 }, 
                { text: "Moderate additional revenue: Subsequent purchases occur, making the first purchase typically 50-75% of the first year's total revenue.", score: 3, vc_score: 6 }, 
                { text: "Minimal additional revenue: The first purchase represents more than 75% of the first year's total revenue; follow-on purchases are infrequent or small.", score: 1, vc_score: 2 }, 
                { text: "Little to no additional revenue: Usually, there are no significant purchases after the initial one within the first 12 months.", score: 0, vc_score: 0 } 
            ], 
            required: true, helpText: "This assesses repeat business...",
            max_vc_score: 10
        },

        // === Section 5: Workforce & Leadership (SIN CAMBIOS) ===
               { id: "work1", section: sections[5], scoringArea: ScoringAreas.WORKFORCE, text: "How reliant is the business's day-to-day operation and key strategic decision-making on the primary owner(s)?", type: "mcq", valueKey: "workforceOwnerReliance", 
            isEssentialForShortMode: true,
            options: [ 
                { text: "Low reliance: Strong management team empowered to run operations; owner focuses on high-level strategy/vision", score: 7, vc_score: 10 }, 
                { text: "Moderate reliance: Owner involved in key decisions/approvals, but team manages daily tasks effectively", score: 4, vc_score: 6 }, 
                { text: "Heavily reliant: Owner frequently involved in operational details and most key decisions", score: 1, vc_score: 2 }, 
                { text: "Completely reliant: Business cannot function effectively for more than a short period without owner's daily input", score: 0, vc_score: 0 } 
            ], 
            required: true, helpText: "'Owner Reliance' ...",
            max_vc_score: 10
        },
        { id: "work2", section: sections[5], scoringArea: ScoringAreas.WORKFORCE, text: "To what extent are employees held accountable with clear roles, responsibilities, and measurable performance indicators (KPIs)?", type: "mcq", valueKey: "workforceAccountability", options: [ { text: "High accountability: Most roles have clearly defined responsibilities and measurable KPIs that are regularly reviewed", score: 3 }, { text: "Moderate accountability: Key roles have defined responsibilities/KPIs, others less so; reviews may be inconsistent", score: 2 }, { text: "Some accountability: Performance often measured informally or subjectively; roles may overlap or be unclear", score: 1 }, { text: "Low accountability: Lack of clear roles, responsibilities, or performance metrics", score: 0 } ], required: true, helpText: "'KPIs' (Key Performance Indicators): Measurable metrics that demonstrate the effectiveness in achieving key objectives." },
        { id: "work3", section: sections[5], scoringArea: ScoringAreas.WORKFORCE, text: "How would you rate your employee retention and ability to attract needed talent compared to your industry peers?", type: "mcq", valueKey: "workforceRetention", options: [ { text: "Excellent: High retention in key roles (low turnover), known as a desirable place to work, strong talent pipeline", score: 5 }, { text: "Good: Retention is generally stable, able to attract needed talent with reasonable effort", score: 3 }, { text: "Average: Turnover and recruitment challenges are typical for the industry", score: 2 }, { text: "Challenging: Higher than average turnover or significant difficulty attracting/retaining key talent", score: 1 } ], required: true },
        { id: "work4", section: sections[5], scoringArea: ScoringAreas.WORKFORCE, text: "How well is the company's long-term vision and strategic plan communicated and understood by employees?", type: "mcq", valueKey: "workforceAlignment", options: [ { text: "Very well: Vision/plan clearly communicated, regularly reinforced, understood by most, influences work", score: 3 }, { text: "Moderately well: Vision/plan shared, generally understood by managers and key staff", score: 2 }, { text: "Somewhat understood: Communication is inconsistent or unclear; employees may not see how their work connects", score: 1 }, { text: "Poorly understood / Not clearly defined or communicated", score: 0 } ], required: true },

        // === Section 6: Execution Systems (SIN CAMBIOS) ===
        { id: "sys1", section: sections[6], scoringArea: ScoringAreas.SYSTEMS, text: "How well-documented are your core business processes (e.g., sales, client onboarding, service delivery, billing)?", type: "mcq", valueKey: "systemsSOPs", options: [ { text: "Extensively documented: Clear, up-to-date Standard Operating Procedures (SOPs) exist for most core processes and are consistently followed", score: 7 }, { text: "Partially documented: Some SOPs exist for key processes, but may be outdated or inconsistently followed", score: 4 }, { text: "Minimally documented: Processes are mostly tribal knowledge, little formal documentation", score: 1 }, { text: "Few documented processes; high degree of variability and inconsistency", score: 0 } ], required: true, helpText: "'SOPs' (Standard Operating Procedures): Detailed written instructions on how to perform routine tasks." },
        { id: "sys2", section: sections[6], scoringArea: ScoringAreas.SYSTEMS, text: "How effectively are key technology systems (e.g., CRM, ERP, Project Management, Financial Software) utilized and integrated to support efficient operations and provide useful data?", type: "mcq", valueKey: "systemsTech", options: [ { text: "Highly effective: Key systems are well-integrated, widely adopted, data is accurate and used for decision-making, supports efficiency", score: 7 }, { text: "Moderately effective: Key systems are used for core functions, but some data silos, manual workarounds, or underutilization exist", score: 4 }, { text: "Basic utilization: Systems used minimally, significant manual processes still required, data may be unreliable or hard to access", score: 1 }, { text: "Ineffective / Lacking key systems / Heavily reliant on spreadsheets and manual processes", score: 0 } ], required: true, helpText: "'CRM': Customer Relationship Management). 'ERP': Enterprise Resource Planning." },
        { id: "sys3", section: sections[6], scoringArea: ScoringAreas.SYSTEMS, text: "To what extent does the business use dashboards or regular reporting to track Key Performance Indicators (KPIs) and operational metrics?", type: "mcq", valueKey: "systemsKPIs", 
            isEssentialForShortMode: true,
            options: [ 
                { text: "Extensive use of real-time or frequently updated dashboards/reports with actionable KPIs tracked across departments, reviewed regularly", score: 7, vc_score: 10 }, 
                { text: "Regular (e.g., weekly/monthly) reporting on key metrics, some dashboard usage for management", score: 4, vc_score: 7 }, 
                { text: "Basic or infrequent reporting (e.g., only standard financial statements), limited operational KPI tracking", score: 1, vc_score: 2 }, 
                { text: "Little or no formal KPI tracking or operational reporting", score: 0, vc_score: 0 } 
            ], 
            required: true, helpText: "'KPIs' (Key Performance Indicators)...",
            max_vc_score: 10
        },
        { id: "sys4", section: sections[6], scoringArea: ScoringAreas.SYSTEMS, text: "Are your financial statements prepared according to standard accounting principles (e.g., GAAP or equivalent) and suitable for external review (like an audit or due diligence)?", type: "mcq", valueKey: "systemsFinancials", options: [ { text: "Yes, fully compliant, regularly reviewed by qualified personnel, clear audit trail, audit-ready with minimal effort", score: 7 }, { text: "Largely compliant, reviewed internally, likely require some cleanup/adjustments for a formal audit or diligence", score: 4 }, { text: "Basic bookkeeping exists, but may not be fully compliant or easily auditable; significant cleanup likely needed", score: 1 }, { text: "Financial records are poor, unreliable, or not based on standard accounting principles", score: 0 } ], required: true, helpText: "'GAAP' (Generally Accepted Accounting Principles): A set of standard accounting rules in the U.S.'Due Diligence': The investigation or audit of a business before a transaction." },

        // === Section 7: Robust Market Position (SIN CAMBIOS) ===
        { id: "mktpos1", section: sections[7], scoringArea: ScoringAreas.MARKET, text: "What is the perceived long-term growth potential of your primary target market(s)?", type: "mcq", valueKey: "marketGrowthPotential", options: [ { text: "High Growth Market (e.g., >10% annual growth expected)", score: 5 }, { text: "Moderate Growth Market (e.g., 3-10% annual growth expected)", score: 3 }, { text: "Stable / Mature Market (e.g., 0-3% growth, low overall growth)", score: 1 }, { text: "Declining Market", score: 0 } ], required: true },
                { id: "mktpos2", section: sections[7], scoringArea: ScoringAreas.MARKET, text: "How diversified is your customer base? Consider the approximate percentage of total revenue coming from your single largest customer.", type: "mcq", valueKey: "marketCustConcentration", 
            isEssentialForShortMode: true,
            options: [ 
                { text: "Highly diversified (Largest customer consistently < 5-10% of revenue)", score: 7, vc_score: 10 }, 
                { text: "Well diversified (Largest customer consistently < 15-20% of revenue)", score: 6, vc_score: 8 }, 
                { text: "Moderately concentrated (Largest customer sometimes or consistently 20-35% of revenue)", score: 3, vc_score: 4 }, 
                { text: "Highly concentrated (Largest customer consistently > 35% of revenue)", score: 1, vc_score: 1 } 
            ], 
            required: true, helpText: "'Customer Concentration': ...",
            max_vc_score: 10
        },
        { id: "mktpos_tam_size", section: sections[7], scoringArea: ScoringAreas.MARKET, text: "Estimate the size of the Total Addressable Market (TAM) for your core offerings in your primary geographic area(s):", type: "mcq", valueKey: "marketTamSize", options: [ { text: "Very Large (e.g., > $500 Million / National / Global)", score: 5 }, { text: "Large (e.g., $50M - $500 Million / Large Regional)", score: 4 }, { text: "Medium (e.g., $5M - $50 Million / City or Metro Area)", score: 3 }, { text: "Small / Niche (e.g., < $5 Million / Localized)", score: 1 }, { text: "Unsure / Not Defined", score: 0 } ], required: true, helpText: "'TAM' (Total Addressable Market): The total potential revenue if you captured 100% of the relevant market for your products/services." },
        { id: "mktpos_market_share", section: sections[7], scoringArea: ScoringAreas.MARKET, text: "Estimate your company's current market share within that Total Addressable Market:", type: "mcq", valueKey: "marketShare", options: [ { text: "Dominant Leader (> 30%)", score: 3 }, { text: "Significant Player (10% - 30%)", score: 2 }, { text: "Moderate Player (3% - 10%)", score: 1 }, { text: "Small Player (< 3%)", score: 1 }, { text: "Unsure", score: 0 } ], required: true, helpText: "'Market Share': Percentage of the Total Addressable Market (TAM) that your company currently controls." },
        { id: "mktpos4", section: sections[7], scoringArea: ScoringAreas.MARKET, text: "How resilient has your business model proven to be during past economic downturns or significant market shifts?", type: "mcq", valueKey: "marketResilience", options: [ { text: "Very resilient: Maintained or even grew profitability during downturns; potentially counter-cyclical elements", score: 5 }, { text: "Moderately resilient: Experienced some negative impact but recovered relatively quickly and strongly", score: 3 }, { text: "Somewhat vulnerable: Significantly impacted, recovery was slow or difficult", score: 1 }, { text: "Highly vulnerable / Untested: Business model seems highly susceptible to downturns or did not exist during the last major one", score: 0 } ], required: true },

        // === Section 8: Your Financials & Industry (CONTENIDO RESTAURADO/CORREGIDO) ===
        {
            id: "finGP",
            section: sections[8], // Permanece en sections[8]
            text: "What is your approximate Last Full Year Gross Profit?",
            type: "number", valueKey: "grossProfit", placeholder: "e.g., $ 900,000",
            required: true, helpText: "...", isEssentialForShortMode: true
        },
        {
            id: "finEBITDA",
            section: sections[8], // Permanece en sections[8]
            text: "What is your approximate Last Full Year EBITDA?",
            type: "number", valueKey: "ebitda", placeholder: "e.g., $ 300,000",
            required: true, helpText: "...", isEssentialForShortMode: true
        },
        {
            id: "finAdj",
            section: sections[8], // Permanece en sections[8]
            text: "What are your typical annual EBITDA Add-backs / Adjustments?",
            type: "number", valueKey: "ebitdaAdjustments", placeholder: "e.g., $ 50,000 (can be 0)",
            required: false, helpText: "..."
        },
    ];

    // Validación adicional (opcional pero útil)
    theQuestionsArray.forEach(q => { /* ... (sin cambios) ... */ });

    return theQuestionsArray;
};

// isQualitativeQuestion (definición interna)
const isQualitativeQuestion = (q) => {
    return q && q.scoringArea && typeof ScoringAreas === 'object' && Object.values(ScoringAreas).includes(q.scoringArea);
};

// getQuestionsForStep (Usa getQuestionsDataArray y el NUEVO 'sections')
export const getQuestionsForStep = (stepIndex) => {
    if (!Array.isArray(sections) || stepIndex < 0 || stepIndex >= sections.length) {
        return [];
    }
    const sectionName = sections[stepIndex];
    const allQuestions = getQuestionsDataArray();
    if (!Array.isArray(allQuestions)) {
         return [];
    }
    // Filtra por el nombre de la sección correspondiente al índice del NUEVO array 'sections'
    return allQuestions.filter(q => q.section === sectionName);
};

// calculateMaxPossibleScore (Usa getQuestionsDataArray - SIN CAMBIOS)
export const calculateMaxPossibleScore = () => {
    const allQuestions = getQuestionsDataArray();
    if (!Array.isArray(allQuestions)) { console.error("calculateMaxPossibleScore: questionsData array not ready"); return 0; }
    const qualitativeQuestionsNow = allQuestions.filter(isQualitativeQuestion);
    let totalMaxScore = 0;
    qualitativeQuestionsNow.forEach(q => {
        if (q.type === 'mcq' && Array.isArray(q.options) && q.options.length > 0) {
            const maxOptionScore = Math.max(0, ...q.options.map(opt => opt.score || 0));
            totalMaxScore += maxOptionScore;
        }
    });
    return totalMaxScore;
};

// calculateMaxScoreForArea (Usa getQuestionsDataArray - SIN CAMBIOS)
export const calculateMaxScoreForArea = (areaName) => {
    if (!areaName) return 0;
    const allQuestions = getQuestionsDataArray();
    if (!Array.isArray(allQuestions)) { console.error("calculateMaxScoreForArea: questionsData array not ready"); return 0; }
    const qualitativeQuestionsNow = allQuestions.filter(isQualitativeQuestion);
    return qualitativeQuestionsNow
        .filter(q => q.scoringArea === areaName)
        .reduce((total, q) => {
            if (q.type === 'mcq' && Array.isArray(q.options) && q.options.length > 0) {
                const maxOptionScore = Math.max(0, ...q.options.map(opt => opt.score || 0));
                return total + maxOptionScore;
            }
            return total;
        }, 0);
};

// --- Estructura ebitdaTiers ---
export const ebitdaTiers = [
    { threshold: 4000000, stageName: "Mature Scaleup", baseMultiple: 5.0, maxMultiple: 6.5 },
    { threshold: 3000000, stageName: "Mature Scaleup", baseMultiple: 4.5, maxMultiple: 6.0 },
    { threshold: 2000000, stageName: "Scale Up", baseMultiple: 4.0, maxMultiple: 5.5 },
    { threshold: 1500000, stageName: "Mature Grow-up", baseMultiple: 3.5, maxMultiple: 5.0 },
    { threshold: 1000000, stageName: "Grow-up", baseMultiple: 3.0, maxMultiple: 4.5 },
    { threshold: 500000,  stageName: "Mature Start-up", baseMultiple: 2.5, maxMultiple: 3.5 },
    { threshold: 0,       stageName: "Startup", baseMultiple: 2.0, maxMultiple: 3.0 },
];

// --- getValuationParameters (SIN CAMBIOS) ---
export const getValuationParameters = (adjEbitda, sectorName, subSectorName) => {
    const validAdjEbitda = typeof adjEbitda === 'number' && !isNaN(adjEbitda) ? adjEbitda : -1;

    if (!Array.isArray(ebitdaTiers) || ebitdaTiers.length === 0) {
        console.error("[getValuationParameters] ERROR: ebitdaTiers not available or empty.");
        return { stage: "Error: Tiers not configured", baseMultiple: 0, maxMultiple: 0, industryAdjustment: 1 };
   }

    const tier = ebitdaTiers.find(t => validAdjEbitda >= t.threshold);
    if (!tier) {
         return { stage: "Pre-Revenue / Negative EBITDA", baseMultiple: 0, maxMultiple: 0, industryAdjustment: 1 };
    }
    let industryAdjustment = 1;
    try {
         if (typeof getIndustryAdjustmentFactor !== 'function') {
         } else {
             industryAdjustment = getIndustryAdjustmentFactor(sectorName, subSectorName);
             if (typeof industryAdjustment !== 'number' || isNaN(industryAdjustment)) {
                 
                 industryAdjustment = 1;
             }
         }
        
     } catch (error) {
         industryAdjustment = 1; // Usar valor por defecto en caso de error
     }

    const baseMultiplier = typeof tier.baseMultiple === 'number' ? tier.baseMultiple : 0;
    const maxMultiplier = typeof tier.maxMultiple === 'number' ? tier.maxMultiple : 0;
     if (typeof tier.baseMultiple !== 'number' || typeof tier.maxMultiple !== 'number') {
     }

    const adjustedBaseMultiple = baseMultiplier * industryAdjustment;
    const adjustedMaxMultiple = maxMultiplier * industryAdjustment;

    const stageName = tier.stageName || "Unknown Stage";
    if (!tier.stageName) {
    }

    const result = {
        stage: stageName,
        baseMultiple: adjustedBaseMultiple,
        maxMultiple: adjustedMaxMultiple,
        industryAdjustment: industryAdjustment // Puedes incluirlo si quieres mostrarlo/usarlo después
     };
    return result;
};