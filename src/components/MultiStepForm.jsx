// src/components/MultiStepForm.jsx
import React, { useState, useEffect, useCallback } from 'react';

// Import necessary functions and data from related files
import {
    sections,
    getQuestionsForStep,
    questionsData,
    calculateMaxPossibleScore,
    getValuationParameters,
    qualitativeQuestions
} from '../questions';
import Step from './Step';
import ProgressIndicator from './ProgressIndicator';
import Navigation from './Navigation';
import { ScoringAreas, initialScores } from '../scoringAreas';

// --- Constants ---
const TOTAL_STEPS = sections.length;
const LOCAL_STORAGE_KEY = 'valuationFormData';
const LOCAL_STORAGE_STEP_KEY = 'valuationFormStep';

// --- Helper Function: Calculate Qualitative Scores ---
function calculateScores(formData) {
  const scores = { ...initialScores };
  qualitativeQuestions.forEach(question => {
    const answer = formData[question.valueKey];
    const area = question.scoringArea;
    if (answer && area && question.type === 'mcq' && scores.hasOwnProperty(area)) {
      const selectedOption = question.options.find(opt => opt.text === answer);
      if (selectedOption && typeof selectedOption.score === 'number') {
        scores[area] += selectedOption.score;
      } else {
        console.warn(`Score not found for Question ID: ${question.id}, Answer: "${answer}"`);
      }
    }
  });
  return scores;
}

// --- Helper Function: Generate Improvement Feedback (Example) ---
function generateImprovementFeedback(scores, stage) {
    let feedback = `<p>You are currently operating at the <strong>${stage}</strong> stage.</p>`;
    const advice = [];
    const sortedScores = Object.entries(scores)
        .filter(([area]) => scores.hasOwnProperty(area))
        .sort(([, scoreA], [, scoreB]) => scoreA - scoreB);
    const areasToImprove = sortedScores.slice(0, 2).map(([area]) => area);

    if (areasToImprove.includes(ScoringAreas.SYSTEMS)) {
        advice.push("Focus on documenting and optimizing your core business processes. This improves efficiency, reduces errors, and makes the business more scalable and transferable (Est. 6-12 months).");
    }
    if (areasToImprove.includes(ScoringAreas.PEOPLE)) {
         advice.push("Work towards reducing owner dependency by empowering your team, defining clear roles & responsibilities, and potentially building out a management layer (Est. 9-18 months).");
    }
     if (areasToImprove.includes(ScoringAreas.CUSTOMERS)) {
        advice.push("Develop strategies to diversify your customer base to reduce revenue concentration risk. Explore new markets or customer segments (Est. 12-24 months).");
    }
     if (areasToImprove.includes(ScoringAreas.PRODUCT)) {
        advice.push("Explore ways to further differentiate your product/service, enhance customer value, or protect your intellectual property to strengthen your competitive advantage (Est. ongoing).");
    }
     if (areasToImprove.includes(ScoringAreas.BUSINESS)) {
         advice.push("Review your market positioning and business model fundamentals. Ensure you have a clear target market and value proposition (Est. 3-6 months analysis).");
     }
     if (areasToImprove.includes(ScoringAreas.PROFILE)) {
          advice.push("Strengthen leadership clarity and strategic vision. Ensure long-term goals are well-defined and communicated (Est. ongoing).");
     }

    if (advice.length > 0) {
        feedback += "<p>Key areas for potential improvement include:</p><ul>";
        advice.forEach(item => { feedback += `<li>${item}</li>`; });
        feedback += "</ul><p>Addressing these could help you graduate to the next stage and potentially increase your valuation multiple.</p>";
    } else {
        feedback += "<p>Your scores indicate a relatively balanced business for this stage across the qualitative areas assessed.</p>";
    }
    return feedback;
}


// --- React Component Definition ---
function MultiStepForm() {
  // State for the current step index
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem(LOCAL_STORAGE_STEP_KEY);
    // Ensure savedStep is valid before parsing, default to 0
    const initialStep = savedStep ? parseInt(savedStep, 10) : 0;
    return !isNaN(initialStep) && initialStep >= 0 && initialStep < TOTAL_STEPS ? initialStep : 0;
  });

  // State for the form data
  const [formData, setFormData] = useState(() => {
     const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
     const baseData = savedData ? JSON.parse(savedData) : {};
     return {
        currentRevenue: null, grossProfit: null, ebitda: null, ebitdaAdjustments: 0,
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
    // Only save valid step numbers
    if(currentStep >= 0 && currentStep < TOTAL_STEPS) {
        localStorage.setItem(LOCAL_STORAGE_STEP_KEY, currentStep.toString());
    }
  }, [currentStep]);

  // --- Navigation Handlers ---
  const handleNext = useCallback(() => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(prevStep => prevStep + 1);
    } else {
      handleSubmit();
    }
  }, [currentStep]); // Added handleSubmit to dependency array

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prevStep => prevStep - 1);
    }
  }, [currentStep]);

  // --- Form Input Change Handler ---
  const handleChange = useCallback((event) => {
    const { name, value, type } = event.target;
    let updatedData = { ...formData };
    if (name === 'naicsSector') {
        updatedData.naicsSubSector = '';
    }
    setFormData(prevData => ({
        ...prevData,
        ...updatedData,
        [name]: type === 'number' ? (value === '' ? null : parseFloat(value)) : value
     }));
  }, [formData]);


  // --- Form Submission Handler ---
  const handleSubmit = useCallback(async () => { // Added async keyword
     console.log("Attempting Submission with Data: ", formData);
     setIsSubmitting(true);
     setSubmissionResult(null);
     setCalculationResult(null);

    try {
        // Validation
        const requiredFinancials = ['currentRevenue', 'ebitda'];
        const missingFinancials = requiredFinancials.filter(key => formData[key] == null || isNaN(formData[key]));
         if(missingFinancials.length > 0) throw new Error(`Missing or invalid required financial information: ${missingFinancials.join(', ')}.`);
         if(!formData.naicsSector) throw new Error("Please select your primary Industry Sector.");
         if(!formData.naicsSubSector) throw new Error("Please select your specific Industry Sub-Sector.");

        // Simulate API call/Backend processing
        await new Promise(resolve => setTimeout(resolve, 300));

        // Calculations
        const ebitdaValue = formData.ebitda || 0;
        const adjustmentsValue = formData.ebitdaAdjustments || 0;
        if (isNaN(ebitdaValue) || isNaN(adjustmentsValue)) throw new Error("Invalid number entered for EBITDA or Adjustments.");
        const adjEbitda = ebitdaValue + adjustmentsValue;

        const { stage, baseMultiple, maxMultiple } = getValuationParameters(adjEbitda, formData.naicsSector, formData.naicsSubSector);
        const scores = calculateScores(formData);
        const userScore = Object.values(scores).reduce((sum, s) => sum + (s || 0), 0);
        const maxPossible = calculateMaxPossibleScore();
        const scorePercentage = maxPossible > 0 ? userScore / maxPossible : 0;
        const clampedScorePercentage = Math.max(0, Math.min(1, scorePercentage));
        const finalMultiple = baseMultiple + (maxMultiple - baseMultiple) * clampedScorePercentage;
        const estimatedValuation = adjEbitda >= 0 ? Math.round(adjEbitda * finalMultiple) : 0;
        const feedback = generateImprovementFeedback(scores, stage);

        // Update state with results
        setCalculationResult({ stage, adjEbitda, baseMultiple, maxMultiple, finalMultiple, estimatedValuation, scores, feedback, scorePercentage: clampedScorePercentage });
        setSubmissionResult({ success: true, message: "Valuation Estimate Complete!" });

        // *** OPTION B: Clear Local Storage on Success ***
        console.log("Clearing saved form progress from Local Storage.");
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        localStorage.removeItem(LOCAL_STORAGE_STEP_KEY);
        // Note: State (currentStep, formData) is NOT reset here automatically,
        // the user stays on the results page until they manually start over or refresh.

    } catch (error) {
        console.error("Submission or Calculation Failed:", error);
        setSubmissionResult({ success: false, message: `Error: ${error.message}` });
    } finally {
        setIsSubmitting(false);
    }
  }, [formData]); // Dependencies: formData (used in calculations/validation)


    // --- Helper function for Option C ---
    const handleStartOver = () => {
        console.log("Starting over: Clearing local storage and reloading.");
        // Clear the saved state
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        localStorage.removeItem(LOCAL_STORAGE_STEP_KEY);
        // Force a reload to reset the component state from scratch (simplest way)
        window.location.reload();
        // Alternatively, reset state manually if preferred:
        // setFormData({ /* initial empty/default state */ });
        // setCurrentStep(0);
        // setSubmissionResult(null);
        // setCalculationResult(null);
    };


  // --- Get Questions for the Current Step ---
  const currentQuestions = getQuestionsForStep(currentStep);

  // --- Conditional Rendering Logic ---

  // Render Success/Results View
  if (submissionResult && submissionResult.success && calculationResult) {
     const { stage, adjEbitda, baseMultiple, maxMultiple, finalMultiple, estimatedValuation, scores, feedback, scorePercentage } = calculationResult;
     return (
        <div className="submission-result">
            <h2>{submissionResult.message}</h2>
            {/* ... (Snapshot, Valuation, Scores, Feedback sections as before) ... */}
             <h3>Business Snapshot</h3>
            <p><strong>Stage:</strong> {stage}</p>
            <p><strong>Adjusted EBITDA:</strong> ${adjEbitda.toLocaleString()}</p>
             <p><strong>Industry Adjusted Multiple Range:</strong> {baseMultiple.toFixed(1)}x - {maxMultiple.toFixed(1)}x</p>
             <p><strong>Qualitative Score:</strong> {(scorePercentage * 100).toFixed(0)}% (Determines position within range)</p>

            <h3>Estimated Valuation</h3>
             <p className="valuation-range">~ ${estimatedValuation.toLocaleString()}</p>
            <p className="valuation-commentary">Based on an estimated multiple of <strong>{finalMultiple.toFixed(1)}x</strong> applied to your Adjusted EBITDA.</p>


            <h3>Score Summary (Qualitative Areas)</h3>
            <ul className="score-summary">
                {Object.entries(scores).map(([area, score]) => (
                    ScoringAreas && Object.values(ScoringAreas).includes(area) && (
                       <li key={area}><strong>{area}:</strong> {score || 0}</li>
                    )
                ))}
            </ul>

             <h3>Feedback & Next Steps</h3>
             <div className="feedback-section" dangerouslySetInnerHTML={{ __html: feedback }} />

            <p><strong>Disclaimer:</strong> This is a preliminary, automated estimate for informational purposes only. Actual valuation requires detailed due diligence, market analysis, negotiation, and professional advice.</p>

            {/* *** OPTION C: Start Over Button *** */}
            <div style={{ textAlign: 'center', marginTop: '2rem' }}> {/* Basic centering */}
                <button
                    type="button"
                    onClick={handleStartOver}
                    className="start-over-button" // Add class for styling if needed
                >
                    Start Over
                </button>
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
               {/* Maybe add a "Try Again" or "Go Back" button here */}
               <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                   <button type="button" onClick={() => setCurrentStep(TOTAL_STEPS - 1)}>Go Back to Edit</button>
               </div>
          </div>
      )
  }

  // --- Render the Multi-Step Form View (Default) ---
  return (
    <div className="multi-step-form">
      <ProgressIndicator
          currentStep={currentStep + 1}
          totalSteps={TOTAL_STEPS}
          sections={sections}
      />
      <form onSubmit={(e) => e.preventDefault()}>
         <Step
           key={currentStep}
           stepIndex={currentStep}
           questions={currentQuestions}
           formData={formData}
           handleChange={handleChange}
           sectionTitle={sections[currentStep]}
         />
         <Navigation
           currentStep={currentStep}
           totalSteps={TOTAL_STEPS}
           onPrevious={handlePrevious}
           onNext={handleNext}
           isSubmitting={isSubmitting}
         />
      </form>
    </div>
  );
}

export default MultiStepForm;