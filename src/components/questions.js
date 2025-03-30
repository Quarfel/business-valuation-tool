// src/questions.js

export const sections = [
  "Your Profile",
  "Your Business",
  "Your Product",
  "Your Customers",
  "Your People",
  "Your Systems",
  "Your Result",
];

export const questionsData = [
  // --- Section 1: Your Profile ---
  {
    id: "q1",
    section: sections[0], // Your Profile
    text: "What is your primary role in the business?",
    type: "mcq",
    options: ["Owner/Founder", "CEO", "Managing Partner", "Investor", "Other"],
    valueKey: "ownerRole",
  },
  {
    id: "q2",
    section: sections[0],
    text: "How long have you been involved with this business?",
    type: "mcq",
    options: ["Less than 1 year", "1-3 years", "4-7 years", "8-15 years", "Over 15 years"],
    valueKey: "yearsInvolved",
  },
  // --- Section 2: Your Business ---
  {
    id: "q3",
    section: sections[1], // Your Business
    text: "What industry best describes your business?",
    type: "mcq",
    options: ["Technology (SaaS)", "Technology (Other)", "Retail", "Manufacturing", "Services (Professional)", "Services (Other)", "Healthcare", "Finance", "Other"],
    valueKey: "industry",
  },
  {
    id: "q4",
    section: sections[1],
    text: "What is the legal structure of your business?",
    type: "mcq",
    options: ["Sole Proprietorship", "Partnership", "LLC", "S-Corp", "C-Corp", "Non-profit", "Other"],
    valueKey: "legalStructure",
  },
   {
    id: "q5",
    section: sections[1],
    text: "Approximately how old is the business?",
    type: "mcq",
    options: ["0-1 year", "2-3 years", "4-5 years", "6-10 years", "11+ years"],
    valueKey: "businessAge",
  },
  // --- Section 3: Your Product ---
   {
    id: "q6",
    section: sections[2], // Your Product
    text: "How would you describe the uniqueness of your core product/service?",
    type: "mcq",
    options: ["Highly unique, patented/proprietary", "Significantly differentiated", "Some unique features", "Similar to competitors", "Commodity product/service"],
    valueKey: "productUniqueness",
  },
  // --- Section 4: Your Customers ---
   {
    id: "q7",
    section: sections[3], // Your Customers
    text: "How concentrated is your customer base?",
    type: "mcq",
    options: ["Top customer is >50% of revenue", "Top customer is 25-50% of revenue", "Top 5 customers are >50% of revenue", "No single customer is >10% of revenue", "Highly diversified customer base"],
    valueKey: "customerConcentration",
  },
  // --- Section 5: Your People ---
   {
    id: "q8",
    section: sections[4], // Your People
    text: "How reliant is the business's day-to-day operation on the owner?",
    type: "mcq",
    options: ["Completely reliant (owner does most things)", "Heavily reliant (owner involved in key decisions daily)", "Moderately reliant (owner oversees, team manages)", "Minimally reliant (owner focuses on strategy)", "Not reliant (fully managed by team)"],
    valueKey: "ownerReliance",
  },
  // --- Section 6: Your Systems ---
   {
    id: "q9",
    section: sections[5], // Your Systems
    text: "How well documented are your core business processes?",
    type: "mcq",
    options: ["Not documented", "Some processes documented informally", "Key processes documented", "Most processes documented and followed", "All core processes documented, reviewed, and optimized"],
    valueKey: "processDocumentation",
  },
  // --- Section 7: Your Result ---
  {
    id: "q10",
    section: sections[6], // Your Result
    text: "What was your approximate revenue growth rate last year?",
    type: "mcq",
    options: ["Negative growth", "0-5%", "6-15%", "16-30%", "Over 30%"],
    valueKey: "revenueGrowth",
  },
  {
    id: "q11",
    section: sections[6],
    text: "What is your typical profit margin (e.g., EBITDA margin)?",
    type: "mcq",
    options: ["Negative / Breaking Even", "1-5%", "6-10%", "11-20%", "Over 20%"],
    valueKey: "profitMargin",
  }
  // --- Add your 50+ questions here ---
];

export const getQuestionsForStep = (stepIndex) => {
  const sectionName = sections[stepIndex];
  return questionsData.filter(q => q.section === sectionName);
};