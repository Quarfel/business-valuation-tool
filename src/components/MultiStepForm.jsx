// src/components/MultiStepForm.jsx
import React, { useState, useEffect, useCallback } from 'react';

// Import NEW scoring structures
import { ScoringAreas, initialScores } from '../scoringAreas'; // Assuming scoringAreas.js is in src folder

// Import updated functions and data from questions.js
import {
    sections, // Updated sections array
    getQuestionsForStep,
    calculateMaxPossibleScore,
    getValuationParameters,
    qualitativeQuestions // Ensure this is filtered correctly in questions.js
} from '../questions'; // Assuming questions.js is in src folder

import Step from './Step';
import ProgressIndicator from './ProgressIndicator';
import Navigation from './Navigation';


// --- Constants ---
const TOTAL_STEPS = sections.length; // Should now be 9
const LOCAL_STORAGE_KEY = 'valuationFormData';
const LOCAL_STORAGE_STEP_KEY = 'valuationFormStep';

// --- Helper Function: Calculate Qualitative Scores ---
// (Remains inside component based on original structure)
function calculateScores(formData) {
  // Use the new initialScores structure
  const scores = { ...initialScores };

  qualitativeQuestions.forEach(question => {
    const answer = formData[question.valueKey];
    const area = question.scoringArea; // Should correspond to ScoringAreas keys

    // Check if the area is one we are tracking and it's an MCQ
    if (answer && area && question.type === 'mcq' && scores.hasOwnProperty(area)) {
      const selectedOption = question.options.find(opt => opt.text === answer);
      if (selectedOption && typeof selectedOption.score === 'number') {
        scores[area] += selectedOption.score;
      } else {
        // Only log warning if an answer was expected to have a score
        if (selectedOption) {
            console.warn(`Score value missing or invalid for Question ID: ${question.id}, Answer: "${answer}"`);
        }
      }
    }
  });
  console.log("Calculated Scores:", scores); // For debugging
  return scores;
}

// --- Helper Function: Generate Improvement Feedback (Example) ---
// (Updated to use new ScoringAreas)
function generateImprovementFeedback(scores, stage) {
    let feedback = `<p>Based on your responses, you appear to be operating at the <strong>${stage}</strong> stage.</p>`;
    const advice = [];

    // Ensure scores object is valid
    if (!scores || typeof scores !== 'object') {
        return feedback + "<p>Could not generate detailed feedback due to missing score data.</p>";
    }

    // Sort the *new* scoring areas by score, lowest first
    const sortedScores = Object.entries(scores)
        // Ensure the area exists in our ScoringAreas enum/object before sorting
        .filter(([areaKey]) => Object.values(ScoringAreas).includes(areaKey))
        .sort(([, scoreA], [, scoreB]) => (scoreA || 0) - (scoreB || 0)); // Handle potential null/undefined scores

    // Get top 2-3 lowest scoring areas
    const areasToImprove = sortedScores.slice(0, 3).map(([areaKey]) => areaKey);

    // Add specific advice based on the new ScoringAreas
    if (areasToImprove.includes(ScoringAreas.SYSTEMS)) { // Execution Systems
        advice.push(`<strong>${ScoringAreas.SYSTEMS}:</strong> Focus on documenting core processes (SOPs), leveraging technology (CRM/ERP), and implementing KPI tracking to improve efficiency and scalability (Est. 6-18 months).`);
    }
    if (areasToImprove.includes(ScoringAreas.WORKFORCE)) { // Workforce & Leadership
        advice.push(`<strong>${ScoringAreas.WORKFORCE}:</strong> Reduce owner dependency by strengthening your management team, clarifying roles/accountability (KPIs), and improving employee retention/development programs (Est. 9-24 months).`);
    }
    if (areasToImprove.includes(ScoringAreas.MARKET)) { // Robust Market Position
        advice.push(`<strong>${ScoringAreas.MARKET}:</strong> Diversify your customer base to reduce concentration risk, strengthen your competitive differentiation, and assess market resilience (Est. 12-24 months).`);
    }
    if (areasToImprove.includes(ScoringAreas.PROFITABILITY)) { // Profitability Metrics
        advice.push(`<strong>${ScoringAreas.PROFITABILITY}:</strong> Analyze and improve gross margins, focus on recurring revenue streams, and implement rigorous financial planning/forecasting (Est. 6-12 months analysis & implementation).`);
    }
    if (areasToImprove.includes(ScoringAreas.MARKETING)) { // Marketing & Brand
        advice.push(`<strong>${ScoringAreas.MARKETING}:</strong> Strengthen brand recognition, optimize your digital presence, and implement a systematic, measurable lead generation process (Est. 6-18 months).`);
    }
     if (areasToImprove.includes(ScoringAreas.OFFERING)) { // Offering Excellence
        advice.push(`<strong>${ScoringAreas.OFFERING}:</strong> Systematically measure customer satisfaction (e.g., NPS), enhance product/service differentiation, and implement robust quality assurance systems (Est. ongoing).`);
    }
     if (areasToImprove.includes(ScoringAreas.EXPANSION)) { // Expansion Capability
        advice.push(`<strong>${ScoringAreas.EXPANSION}:</strong> Build scalable systems, document expansion playbooks (geo/product), and analyze partnership/acquisition opportunities to prepare for future growth (Est. 12-36 months).`);
    }


    if (advice.length > 0) {
        feedback += "<p>Key areas identified for potential value improvement include:</p><ul>";
        advice.forEach(item => { feedback += `<li>${item}</li>`; });
        feedback += "</ul><p>Addressing these could help progress your business and potentially increase its valuation multiple.</p>";
    } else if (sortedScores.length > 0) { // Check if scoring occurred
        feedback += "<p>Your scores indicate a relatively balanced business for this stage across the qualitative areas assessed.</p>";
    } else {
        feedback += "<p>Qualitative scoring could not be fully determined based on the inputs provided.</p>"; // Fallback
    }

    return feedback;
}


// --- React Component Definition ---
function MultiStepForm() {
  // State for the current step index
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem(LOCAL_STORAGE_STEP_KEY);
    const initialStep = savedStep ? parseInt(savedStep, 10) : 0;
    // Validate step index against the new TOTAL_STEPS
    return !isNaN(initialStep) && initialStep >= 0 && initialStep < TOTAL_STEPS ? initialStep : 0;
  });

  // State for the form data
  const [formData, setFormData] = useState(() => {
     const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
     const baseData = savedData ? JSON.parse(savedData) : {};
     // Initialize with defaults for key fields to avoid undefined issues
     return {
        currentRevenue: null,
        grossProfit: null,
        ebitda: null,
        ebitdaAdjustments: 0,
        userEmail: '',
        naicsSector: '',
        naicsSubSector: '',
        // Add other valueKeys used in questionsData with appropriate defaults if necessary
        ...baseData
     };
  });

  // Other state variables
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [calculationResult, setCalculationResult] = useState(null);

  // --- Effects for Saving Progress ---
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    if(currentStep >= 0 && currentStep < TOTAL_STEPS) {
        localStorage.setItem(LOCAL_STORAGE_STEP_KEY, currentStep.toString());
    }
  }, [currentStep]);

  // --- Form Input Change Handler ---
  const handleChange = useCallback((event) => {
    const { name, value, type } = event.target;

    // Special handling for NAICS dependency reset
    let resetData = {};
    if (name === 'naicsSector') {
        resetData.naicsSubSector = ''; // Reset sub-sector when sector changes
    }

    setFormData(prevData => ({
      ...prevData,
      ...resetData, // Apply reset if needed
      [name]: type === 'number' ? (value === '' ? null : parseFloat(value)) : value
    }));
  }, []); // No dependencies needed for standard setter


  // --- Form Submission Handler ---
  // NOTE: Defined *before* handleNext which might call it.
  const handleSubmit = useCallback(async () => {
     console.log("Attempting Submission with Data: ", formData);
     setIsSubmitting(true);
     setSubmissionResult(null);
     setCalculationResult(null);

    try {
        // Basic Validation (Expand with Issue #1 later)
        const requiredFinancials = ['currentRevenue', 'ebitda']; // Add others if needed
        const missingFinancials = requiredFinancials.filter(key => formData[key] == null || isNaN(formData[key]));
         if(missingFinancials.length > 0) throw new Error(`Missing or invalid required financial information: ${missingFinancials.join(', ')}.`);
         if(!formData.userEmail) throw new Error("Please enter your email address."); // Example required field
         if(!formData.naicsSector) throw new Error("Please select your primary Industry Sector.");
         if(!formData.naicsSubSector) throw new Error("Please select your specific Industry Sub-Sector.");
         // Add more required field checks here based on Issue #1

        // Simulate API call/Backend processing (if any)
        await new Promise(resolve => setTimeout(resolve, 300)); // Keep simulation

        // Calculations
        const ebitdaValue = formData.ebitda || 0;
        const adjustmentsValue = formData.ebitdaAdjustments || 0;
        if (isNaN(ebitdaValue) || isNaN(adjustmentsValue)) throw new Error("Invalid number entered for EBITDA or Adjustments.");
        const adjEbitda = ebitdaValue + adjustmentsValue;

        // Get range based on financials and industry
        const { stage, baseMultiple, maxMultiple } = getValuationParameters(adjEbitda, formData.naicsSector, formData.naicsSubSector);

        // Calculate qualitative score and position within range
        const scores = calculateScores(formData); // Uses new structure
        const userScore = Object.values(scores).reduce((sum, s) => sum + (s || 0), 0); // Sum of raw scores
        const maxPossible = calculateMaxPossibleScore(); // Should be 140 now
        const scorePercentage = maxPossible > 0 ? userScore / maxPossible : 0; // Overall % (0 to 1)
        const clampedScorePercentage = Math.max(0, Math.min(1, scorePercentage)); // Ensure 0-1 range

        // Interpolate to find the final multiple
        const finalMultiple = baseMultiple + (maxMultiple - baseMultiple) * clampedScorePercentage;
        const estimatedValuation = adjEbitda >= 0 ? Math.round(adjEbitda * finalMultiple) : 0;

        // Generate feedback based on new scores/stage
        const feedback = generateImprovementFeedback(scores, stage); // Uses new structure

        // Update state with results
        setCalculationResult({
            stage, adjEbitda, baseMultiple, maxMultiple, finalMultiple, estimatedValuation,
            scores, // Contains scores for each E.M.P.O.W.E.R area
            feedback, scorePercentage: clampedScorePercentage
        });
        setSubmissionResult({ success: true, message: "Valuation Estimate Complete!" });

        // Clear Local Storage on Success
        console.log("Clearing saved form progress from Local Storage.");
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        localStorage.removeItem(LOCAL_STORAGE_STEP_KEY);

    } catch (error) {
        console.error("Submission or Calculation Failed:", error);
        setSubmissionResult({ success: false, message: `Error: ${error.message}` });
    } finally {
        setIsSubmitting(false);
    }
  }, [formData]); // Dependency: formData is crucial here


  // --- Navigation Handlers ---
  // ********* FIX IS HERE: Removed handleSubmit from dependency array *********
  const handleNext = useCallback(() => {
    if (currentStep < TOTAL_STEPS - 1) {
      // TODO: Add validation here (Issue #1) before moving step
      setCurrentStep(prevStep => prevStep + 1);
    } else {
      // If on the last step, trigger submit
      handleSubmit(); // Call the handleSubmit function defined above
    }
  }, [currentStep, handleSubmit]); // Keep handleSubmit here as it's called inside

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prevStep => prevStep - 1);
    }
  }, [currentStep]);


    // --- Helper function for Start Over ---
    const handleStartOver = () => {
        console.log("Starting over: Clearing local storage and reloading.");
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        localStorage.removeItem(LOCAL_STORAGE_STEP_KEY);
        window.location.reload(); // Simple reset
    };


  // --- Get Questions for the Current Step ---
  const currentQuestions = getQuestionsForStep(currentStep);
  const currentSectionTitle = sections[currentStep]; // Get title for the current step

  // --- Conditional Rendering Logic ---

  // Render Success/Results View
  if (submissionResult && submissionResult.success && calculationResult) {
     const { stage, adjEbitda, baseMultiple, maxMultiple, finalMultiple, estimatedValuation, scores, feedback, scorePercentage } = calculationResult;
     // Use the ResultsDisplay component if you created it, otherwise render directly
     return (
        <div className="submission-result">
            <h2>{submissionResult.message}</h2>

            <h3>Business Snapshot</h3>
            <p><strong>Stage:</strong> {stage}</p>
            <p><strong>Adjusted EBITDA:</strong> ${adjEbitda.toLocaleString()}</p>
            <p><strong>Industry Adjusted Multiple Range:</strong> {baseMultiple.toFixed(1)}x - {maxMultiple.toFixed(1)}x</p>
            <p><strong>Overall Qualitative Score:</strong> {(scorePercentage * 100).toFixed(0)}% (Determines position within range)</p>

            <h3>Estimated Valuation</h3>
            <p className="valuation-range" style={{ fontSize: '2em', fontWeight: 'bold', color: '#27ae60', margin: '0.5em 0' }}>
                ~ ${estimatedValuation.toLocaleString()}
            </p>
            <p className="valuation-commentary">Based on an estimated multiple of <strong>{finalMultiple.toFixed(1)}x</strong> applied to your Adjusted EBITDA.</p>


            <h3>Score Summary (Qualitative Areas)</h3>
            <ul className="score-summary" style={{ listStyle: 'none', padding: 0, textAlign: 'left', maxWidth: '400px', margin: '1.5rem auto' }}>
                {/* Map through the NEW ScoringAreas and display scores */}
                {Object.entries(scores)
                    .filter(([areaKey]) => Object.values(ScoringAreas).includes(areaKey)) // Ensure it's a valid scoring area
                    .map(([areaName, score]) => (
                       <li key={areaName} style={{ marginBottom: '0.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                           <strong>{areaName}:</strong> {score || 0} / 20
                           {/* Optional: Add a simple visual bar */}
                           <div style={{ backgroundColor: '#e0e0e0', borderRadius: '3px', marginTop: '4px' }}>
                               <div style={{ width: `${((score || 0) / 20) * 100}%`, backgroundColor: '#3498db', height: '8px', borderRadius: '3px' }}></div>
                           </div>
                       </li>
                    ))
                 }
            </ul>

             <h3>Feedback & Next Steps</h3>
             <div className="feedback-section" dangerouslySetInnerHTML={{ __html: feedback }} style={{ textAlign: 'left', marginTop: '1rem' }}/>

            <p style={{ marginTop: '2rem', fontSize: '0.9em', color: '#777' }}>
                <strong>Disclaimer:</strong> This is a preliminary, automated estimate for informational purposes only. Actual valuation requires detailed due diligence, market analysis, negotiation, and professional advice from qualified professionals.
            </p>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button type="button" onClick={handleStartOver} className="start-over-button" >
                    Start Over
                </button>
                {/* Add Download PDF / Contact CTA buttons here based on Issues #8, #13 */}
            </div>
        </div>
     )
  }
   // Render Error View
  else if (submissionResult && !submissionResult.success) {
      return (
           <div className="submission-result error">
              <h2>Submission Error</h2>
              <p>{submissionResult.message}</p>
               <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                   {/* Allow user to dismiss error and potentially go back */}
                   <button type="button" onClick={() => {
                       setSubmissionResult(null);
                       // Optional: Go back to the last step instead of just dismissing
                       // if(currentStep === TOTAL_STEPS - 1) handlePrevious();
                   }}>Review Answers</button>
               </div>
          </div>
      )
  }

  // --- Render the Multi-Step Form View (Default) ---
  return (
    <div className="multi-step-form">
      <ProgressIndicator
          currentStep={currentStep + 1} // Display 1-based step number
          totalSteps={TOTAL_STEPS}
          sections={sections} // Pass section titles
      />
      <form onSubmit={(e) => e.preventDefault()}> {/* Prevent default browser submission */}
         <Step
           key={currentStep} // Use key to force re-render on step change if needed
           stepIndex={currentStep}
           questions={currentQuestions}
           formData={formData}
           handleChange={handleChange}
           sectionTitle={currentSectionTitle} // Pass the title for the current step
         />
         <Navigation
           currentStep={currentStep}
           totalSteps={TOTAL_STEPS}
           onPrevious={handlePrevious}
           onNext={handleNext} // Will trigger handleSubmit on last step
           isSubmitting={isSubmitting}
         />
      </form>
    </div>
  );
}

export default MultiStepForm;