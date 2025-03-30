// src/naicsData.js

// --- CRITICAL NOTE ---
// The 'adjustmentFactor' values below are EXAMPLES ONLY (mostly set to 1.0 or slight variations).
// You MUST replace these placeholders with factors derived from actual market
// data and valuation expertise relevant to your specific use case.
// Factors > 1.0 suggest a premium multiple, < 1.0 suggest a discount relative to the base.
// These values are FUNDAMENTAL to the valuation calculation's accuracy.

export const naicsSectors = [
    {
      code: "11",
      name: "Agriculture, Forestry, Fishing and Hunting",
      subSectors: [
        { name: "Crop Production", adjustmentFactor: 0.75 },
        { name: "Animal Production and Aquaculture", adjustmentFactor: 0.8 },
        { name: "Forestry and Logging", adjustmentFactor: 0.8 },
        { name: "Fishing, Hunting and Trapping", adjustmentFactor: 0.7 },
        { name: "Support Activities for Agriculture and Forestry", adjustmentFactor: 0.85 }
      ]
    },
    {
      code: "21",
      name: "Mining, Quarrying, and Oil and Gas Extraction",
      subSectors: [
        { name: "Oil and Gas Extraction", adjustmentFactor: 1.1 },
        { name: "Mining (except Oil and Gas)", adjustmentFactor: 0.9 },
        { name: "Support Activities for Mining", adjustmentFactor: 0.95 }
      ]
    },
    {
      code: "22",
      name: "Utilities",
      subSectors: [
        { name: "Electric Power Generation, Transmission and Distribution", adjustmentFactor: 1.0 },
        { name: "Natural Gas Distribution", adjustmentFactor: 1.0 },
        { name: "Water, Sewage and Other Systems", adjustmentFactor: 0.95 }
      ]
    },

    {
      code: "23",
      name: "Construction", // Contains 31 specific 6-digit sub-sectors
      subSectors: [
        // Sub-sector under 236 - Construction of Buildings
        { code: "236115", name: "New Single-Family Housing Construction (except For-Rent Builders)", adjustmentFactor: 1.0 },
        { code: "236116", name: "New Multifamily Housing Construction (except For-Rent Builders)", adjustmentFactor: 1.0 },
        { code: "236117", name: "New Housing For-Rent Builders", adjustmentFactor: 1.0 },
        { code: "236118", name: "Residential Remodelers", adjustmentFactor: 1.0 },
        { code: "236210", name: "Industrial Building Construction", adjustmentFactor: 1.0 },
        { code: "236220", name: "Commercial and Institutional Building Construction", adjustmentFactor: 1.0 },
  
        // Sub-sector under 237 - Heavy and Civil Engineering Construction
        { code: "237110", name: "Water and Sewer Line and Related Structures Construction", adjustmentFactor: 1.0 },
        { code: "237120", name: "Oil and Gas Pipeline and Related Structures Construction", adjustmentFactor: 1.0 },
        { code: "237130", name: "Power and Communication Line and Related Structures Construction", adjustmentFactor: 1.0 },
        { code: "237210", name: "Land Subdivision", adjustmentFactor: 1.0 },
        { code: "237310", name: "Highway, Street, and Bridge Construction", adjustmentFactor: 1.0 },
        { code: "237990", name: "Other Heavy and Civil Engineering Construction", adjustmentFactor: 1.0 },
  
        // Sub-sector under 238 - Specialty Trade Contractors
        { code: "238110", name: "Poured Concrete Foundation and Structure Contractors", adjustmentFactor: 1.0 },
        { code: "238120", name: "Structural Steel and Precast Concrete Contractors", adjustmentFactor: 1.0 },
        { code: "238130", name: "Framing Contractors", adjustmentFactor: 1.0 },
        { code: "238140", name: "Masonry Contractors", adjustmentFactor: 1.0 },
        { code: "238150", name: "Glass and Glazing Contractors", adjustmentFactor: 1.0 },
        { code: "238160", name: "Roofing Contractors", adjustmentFactor: 1.0 },
        { code: "238170", name: "Siding Contractors", adjustmentFactor: 1.0 },
        { code: "238190", name: "Other Foundation, Structure, and Building Exterior Contractors", adjustmentFactor: 1.0 },
        { code: "238210", name: "Electrical Contractors and Other Wiring Installation Contractors", adjustmentFactor: 1.0 },
        { code: "238220", name: "Plumbing, Heating, and Air-Conditioning Contractors", adjustmentFactor: 1.0 },
        { code: "238290", name: "Other Building Equipment Contractors", adjustmentFactor: 1.0 },
        { code: "238310", name: "Drywall and Insulation Contractors", adjustmentFactor: 1.0 },
        { code: "238320", name: "Painting and Wall Covering Contractors", adjustmentFactor: 1.0 },
        { code: "238330", name: "Flooring Contractors", adjustmentFactor: 1.0 },
        { code: "238340", name: "Tile and Terrazzo Contractors", adjustmentFactor: 1.0 },
        { code: "238350", name: "Finish Carpentry Contractors", adjustmentFactor: 1.0 },
        { code: "238390", name: "Other Building Finishing Contractors", adjustmentFactor: 1.0 },
        { code: "238910", name: "Site Preparation Contractors", adjustmentFactor: 1.0 },
        { code: "238990", name: "All Other Specialty Trade Contractors", adjustmentFactor: 1.0 }
      ]
    },
    {
      code: "31-33",
      name: "Manufacturing",
      subSectors: [
        { name: "Food Manufacturing", adjustmentFactor: 0.9 },
        { name: "Beverage and Tobacco Product Manufacturing", adjustmentFactor: 1.0 },
        { name: "Textile Mills & Product Mills", adjustmentFactor: 0.8 },
        { name: "Apparel Manufacturing", adjustmentFactor: 0.85 },
        { name: "Leather and Allied Product Manufacturing", adjustmentFactor: 0.8 },
        { name: "Wood Product Manufacturing", adjustmentFactor: 0.85 },
        { name: "Paper Manufacturing", adjustmentFactor: 0.9 },
        { name: "Printing and Related Support Activities", adjustmentFactor: 0.85 },
        { name: "Petroleum and Coal Products Manufacturing", adjustmentFactor: 1.0 },
        { name: "Chemical Manufacturing", adjustmentFactor: 1.1 },
        { name: "Plastics and Rubber Products Manufacturing", adjustmentFactor: 0.95 },
        { name: "Nonmetallic Mineral Product Manufacturing", adjustmentFactor: 0.9 },
        { name: "Primary Metal Manufacturing", adjustmentFactor: 0.9 },
        { name: "Fabricated Metal Product Manufacturing", adjustmentFactor: 0.95 },
        { name: "Machinery Manufacturing", adjustmentFactor: 1.0 },
        { name: "Computer and Electronic Product Manufacturing", adjustmentFactor: 1.2 },
        { name: "Electrical Equipment, Appliance, and Component Manufacturing", adjustmentFactor: 1.0 },
        { name: "Transportation Equipment Manufacturing", adjustmentFactor: 1.0 },
        { name: "Furniture and Related Product Manufacturing", adjustmentFactor: 0.85 },
        { name: "Miscellaneous Manufacturing", adjustmentFactor: 1.05 } // e.g., Medical Devices might be higher
      ]
    },
    {
      code: "42",
      name: "Wholesale Trade",
      subSectors: [
        { name: "Merchant Wholesalers, Durable Goods", adjustmentFactor: 0.95 },
        { name: "Merchant Wholesalers, Nondurable Goods", adjustmentFactor: 0.9 },
        { name: "Wholesale Electronic Markets and Agents and Brokers", adjustmentFactor: 1.0 }
      ]
    },
    {
      code: "44-45",
      name: "Retail Trade",
      subSectors: [
        { name: "Motor Vehicle and Parts Dealers", adjustmentFactor: 0.8 },
        { name: "Furniture and Home Furnishings Stores", adjustmentFactor: 0.85 },
        { name: "Electronics and Appliance Stores", adjustmentFactor: 0.9 },
        { name: "Building Material and Garden Equipment Stores", adjustmentFactor: 0.9 },
        { name: "Food and Beverage Stores", adjustmentFactor: 0.85 },
        { name: "Health and Personal Care Stores", adjustmentFactor: 0.95 },
        { name: "Gasoline Stations", adjustmentFactor: 0.75 },
        { name: "Clothing and Clothing Accessories Stores", adjustmentFactor: 0.9 },
        { name: "Sporting Goods, Hobby, Book, and Music Stores", adjustmentFactor: 0.9 },
        { name: "General Merchandise Stores", adjustmentFactor: 0.85 },
        { name: "Miscellaneous Store Retailers", adjustmentFactor: 0.85 },
        { name: "Nonstore Retailers", adjustmentFactor: 1.1 } // e.g., E-commerce
      ]
    },
    {
      code: "48-49",
      name: "Transportation and Warehousing",
      subSectors: [
          { name: "Air Transportation", adjustmentFactor: 0.95 },
          { name: "Rail Transportation", adjustmentFactor: 1.0 },
          { name: "Water Transportation", adjustmentFactor: 0.9 },
          { name: "Truck Transportation", adjustmentFactor: 0.9 },
          { name: "Transit and Ground Passenger Transportation", adjustmentFactor: 0.85 },
          { name: "Pipeline Transportation", adjustmentFactor: 1.05 },
          { name: "Scenic and Sightseeing Transportation", adjustmentFactor: 0.8 },
          { name: "Support Activities for Transportation", adjustmentFactor: 1.0 },
          { name: "Couriers and Messengers", adjustmentFactor: 0.95 },
          { name: "Warehousing and Storage", adjustmentFactor: 1.0 }
      ]
    },
    {
      code: "51",
      name: "Information",
      subSectors: [
        { name: "Publishing Industries (except Internet)", adjustmentFactor: 0.9 }, // Books, Newspapers lower
        // Consider adding specific entry e.g., { name: "Software Publishers", adjustmentFactor: 1.5 }
        { name: "Motion Picture and Sound Recording Industries", adjustmentFactor: 1.0 },
        { name: "Broadcasting (except Internet)", adjustmentFactor: 1.0 },
        { name: "Telecommunications", adjustmentFactor: 1.2 },
        { name: "Data Processing, Hosting, and Related Services", adjustmentFactor: 1.4 },
        { name: "Other Information Services", adjustmentFactor: 1.1 } // e.g. Web portals
      ]
    },
    {
      code: "52",
      name: "Finance and Insurance",
      subSectors: [
        { name: "Monetary Authorities - Central Bank", adjustmentFactor: 1.0 }, // N/A mostly
        { name: "Credit Intermediation and Related Activities", adjustmentFactor: 1.0 }, // Varies widely (banks vs brokers)
        { name: "Securities, Commodity Contracts, Intermediation and Brokerage", adjustmentFactor: 1.1 },
        { name: "Insurance Carriers and Related Activities", adjustmentFactor: 1.1 },
        { name: "Funds, Trusts, and Other Financial Vehicles", adjustmentFactor: 1.05 }
      ]
    },
    {
      code: "53",
      name: "Real Estate and Rental and Leasing",
      subSectors: [
        { name: "Lessors of Real Estate", adjustmentFactor: 1.0 }, // Varies widely
        { name: "Offices of Real Estate Agents and Brokers", adjustmentFactor: 0.8 },
        { name: "Activities Related to Real Estate", adjustmentFactor: 0.9 }, // e.g., Property Mgmt
        { name: "Automotive Equipment Rental and Leasing", adjustmentFactor: 0.9 },
        { name: "Consumer Goods Rental", adjustmentFactor: 0.85 },
        { name: "General Rental Centers", adjustmentFactor: 0.85 },
        { name: "Commercial and Industrial Machinery and Equipment Rental and Leasing", adjustmentFactor: 0.95 }
      ]
    },
    {
      code: "54",
      name: "Professional, Scientific, and Technical Services",
      subSectors: [
        { name: "Legal Services", adjustmentFactor: 1.1 },
        { name: "Accounting, Tax Preparation, Bookkeeping, and Payroll Services", adjustmentFactor: 1.1 },
        { name: "Architectural, Engineering, and Related Services", adjustmentFactor: 1.0 },
        { name: "Specialized Design Services", adjustmentFactor: 1.0 },
        { name: "Computer Systems Design and Related Services", adjustmentFactor: 1.3 },
        { name: "Management, Scientific, and Technical Consulting Services", adjustmentFactor: 1.2 },
        { name: "Scientific Research and Development Services", adjustmentFactor: 1.25 },
        { name: "Advertising, Public Relations, and Related Services", adjustmentFactor: 1.0 },
        { name: "Other Professional, Scientific, and Technical Services", adjustmentFactor: 1.0 }
      ]
    },
    {
      code: "55",
      name: "Management of Companies and Enterprises",
      subSectors: [
        // Typically holding companies - valuation is often based on underlying assets/companies
        { name: "Offices of Bank Holding Companies", adjustmentFactor: 1.0 },
        { name: "Offices of Other Holding Companies", adjustmentFactor: 1.0 },
        { name: "Corporate, Subsidiary, and Regional Managing Offices", adjustmentFactor: 1.0 }
      ]
    },
    {
      code: "56",
      name: "Administrative and Support and Waste Management and Remediation Services",
      subSectors: [
        { name: "Office Administrative Services", adjustmentFactor: 0.9 },
        { name: "Facilities Support Services", adjustmentFactor: 0.95 },
        { name: "Employment Services", adjustmentFactor: 0.95 },
        { name: "Business Support Services", adjustmentFactor: 0.9 },
        { name: "Travel Arrangement and Reservation Services", adjustmentFactor: 0.85 },
        { name: "Investigation and Security Services", adjustmentFactor: 0.9 },
        { name: "Services to Buildings and Dwellings", adjustmentFactor: 0.85 }, // Janitorial, Landscaping
        { name: "Other Support Services", adjustmentFactor: 0.85 },
        { name: "Waste Management and Remediation Services", adjustmentFactor: 0.9 }
      ]
    },
    {
      code: "61",
      name: "Educational Services",
      subSectors: [
          // Many non-profits, but for-profit exists
        { name: "Elementary and Secondary Schools", adjustmentFactor: 0.85 },
        { name: "Junior Colleges", adjustmentFactor: 0.9 },
        { name: "Colleges, Universities, and Professional Schools", adjustmentFactor: 0.9 },
        { name: "Business Schools and Computer and Management Training", adjustmentFactor: 1.0 },
        { name: "Technical and Trade Schools", adjustmentFactor: 0.95 },
        { name: "Other Schools and Instruction", adjustmentFactor: 0.9 },
        { name: "Educational Support Services", adjustmentFactor: 0.95 }
      ]
    },
    {
      code: "62",
      name: "Health Care and Social Assistance",
      subSectors: [
        { name: "Ambulatory Health Care Services", adjustmentFactor: 1.1 }, // Doctors, Dentists, Labs
        { name: "Hospitals", adjustmentFactor: 1.0 }, // Varies widely
        { name: "Nursing and Residential Care Facilities", adjustmentFactor: 0.85 },
        { name: "Social Assistance", adjustmentFactor: 0.8 } // Often non-profit/lower margin
      ]
    },
    {
      code: "71",
      name: "Arts, Entertainment, and Recreation",
      subSectors: [
        { name: "Performing Arts Companies", adjustmentFactor: 0.8 },
        { name: "Spectator Sports", adjustmentFactor: 0.9 },
        { name: "Promoters of Performing Arts, Sports, and Similar Events", adjustmentFactor: 0.85 },
        { name: "Agents and Managers for Artists, Athletes, Entertainers", adjustmentFactor: 0.9 },
        { name: "Independent Artists, Writers, and Performers", adjustmentFactor: 0.8 },
        { name: "Museums, Historical Sites, and Similar Institutions", adjustmentFactor: 0.75 }, // Often non-profit
        { name: "Amusement Parks and Arcades", adjustmentFactor: 0.9 },
        { name: "Gambling Industries", adjustmentFactor: 0.95 },
        { name: "Other Amusement and Recreation Industries", adjustmentFactor: 0.85 } // Gyms, Golf
      ]
    },
    {
      code: "72",
      name: "Accommodation and Food Services",
      subSectors: [
        { name: "Traveler Accommodation", adjustmentFactor: 0.9 }, // Hotels, Motels
        { name: "RV Parks and Recreational Camps", adjustmentFactor: 0.8 },
        { name: "Rooming and Boarding Houses, Dormitories", adjustmentFactor: 0.75 },
        { name: "Food Services and Drinking Places", adjustmentFactor: 0.8 } // Restaurants/Bars
      ]
    },
    {
      code: "81",
      name: "Other Services (except Public Administration)",
      subSectors: [
        { name: "Automotive Repair and Maintenance", adjustmentFactor: 0.85 },
        { name: "Electronic and Precision Equipment Repair and Maintenance", adjustmentFactor: 0.95 },
        { name: "Commercial and Industrial Machinery Repair and Maintenance", adjustmentFactor: 0.9 },
        { name: "Personal and Household Goods Repair and Maintenance", adjustmentFactor: 0.8 },
        { name: "Personal Care Services", adjustmentFactor: 0.9 }, // Salons, Spas
        { name: "Death Care Services", adjustmentFactor: 0.85 },
        { name: "Drycleaning and Laundry Services", adjustmentFactor: 0.8 },
        { name: "Other Personal Services", adjustmentFactor: 0.85 }, // Pet Care, Photofinishing
        { name: "Religious Organizations", adjustmentFactor: 0.7 }, // N/A mostly
        { name: "Grantmaking and Giving Services", adjustmentFactor: 0.7 }, // N/A mostly
        { name: "Social Advocacy Organizations", adjustmentFactor: 0.75 }, // N/A mostly
        { name: "Civic and Social Organizations", adjustmentFactor: 0.8 },
        { name: "Business, Professional, Labor, Political Organizations", adjustmentFactor: 0.85 },
        { name: "Private Households", adjustmentFactor: 0.7 } // N/A mostly
      ]
    },
    {
      code: "92",
      name: "Public Administration",
      subSectors: [
          // Generally not applicable for private valuation
        { name: "Executive, Legislative, and Other General Government Support", adjustmentFactor: 1.0 },
        { name: "Justice, Public Order, and Safety Activities", adjustmentFactor: 1.0 },
        { name: "Administration of Human Resource Programs", adjustmentFactor: 1.0 },
        { name: "Administration of Environmental Quality Programs", adjustmentFactor: 1.0 },
        { name: "Administration of Housing Programs, Urban Planning", adjustmentFactor: 1.0 },
        { name: "Administration of Economic Programs", adjustmentFactor: 1.0 },
        { name: "Space Research and Technology", adjustmentFactor: 1.0 },
        { name: "National Security and International Affairs", adjustmentFactor: 1.0 }
      ]
    }
  ];
  
  /**
   * Helper function to get sub-sector objects for a given sector name.
   * @param {string} sectorName - The name of the top-level NAICS sector.
   * @returns {array} - An array of sub-sector objects [{ name: string, adjustmentFactor: number }, ...], or empty array if not found.
   */
  export const getSubSectors = (sectorName) => {
    const sector = naicsSectors.find(s => s.name === sectorName);
    // Return the array of sub-sector objects directly
    return sector && sector.subSectors ? sector.subSectors : [];
  };
  
  
  /**
   * Gets the adjustment factor for a given sub-sector name by finding it within the nested structure.
   * @param {string} sectorName - The name of the selected top-level sector.
   * @param {string} subSectorName - The specific name of the sub-sector.
   * @returns {number} - The adjustment factor (e.g., 1.1 or 0.9). Returns 1.0 as default if not found.
   */
  export const getIndustryAdjustmentFactor = (sectorName, subSectorName) => {
      const sector = naicsSectors.find(s => s.name === sectorName);
      if (sector && sector.subSectors) {
          const subSector = sector.subSectors.find(sub => sub.name === subSectorName);
          if (subSector && typeof subSector.adjustmentFactor === 'number') {
              return subSector.adjustmentFactor;
          }
      }
      console.warn(`Adjustment factor not found for Sector: "${sectorName}", SubSector: "${subSectorName}". Using default 1.0.`);
      return 1.0; // Default factor if sector, sub-sector, or factor is not found/valid
  };