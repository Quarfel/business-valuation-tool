// src/components/MultiStepForm.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { ScoringAreas, initialScores } from '../scoringAreas';
import { 
    sections, 
    getQuestionsForStep, 
    calculateMaxPossibleScore,
    getValuationParameters, 
    calculateMaxScoreForArea,
    getQuestionsDataArray 
} from '../questions';
import Step from './Step';
import ProgressIndicator from './ProgressIndicator';
import Navigation from './Navigation';
import ResultsDisplay from './results/ResultsDisplay';
import { getFunctionsBaseUrl } from '../utils/urlHelpers';

const LOCAL_STORAGE_KEY = 'valuationFormData';
const LOCAL_STORAGE_STEP_KEY = 'valuationFormStep';
const TOTAL_STEPS_FULL_MODE = sections.length; 
const TOTAL_STEPS_SHORT_MODE = sections.length;

function MultiStepForm({ initialFormData = null, operatingMode = 'full' }) {

    const [formData, setFormData] = useState(() => {
        const defaultStructure = {
            currentRevenue: null, grossProfit: null, ebitda: null, ebitdaAdjustments: 0,
            userEmail: '', ownerRole: '', yearsInvolved: '', naicsSector: '', naicsSubSector: '',
            employeeCountRange: '', locationState: '', locationZip: '',
            revenueSourceBalance: '', customerTypeBalance: '', assessmentId: null
        };
        if (initialFormData) {
            localStorage.removeItem(LOCAL_STORAGE_KEY); localStorage.removeItem(LOCAL_STORAGE_STEP_KEY);
            return { ...defaultStructure, ...initialFormData };
        }
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        let dataFromStorage = {};
        if (savedData) { try { dataFromStorage = JSON.parse(savedData); if (typeof dataFromStorage !== 'object' || dataFromStorage === null) dataFromStorage = {}; } catch (e) { console.error("Error parsing localStorage data", e); dataFromStorage = {}; } }
        let emailFromUrl = null;
        if (typeof window !== 'undefined') { try { const params = new URLSearchParams(window.location.search); emailFromUrl = params.get('email'); } catch (e) { console.error("Error reading URL params", e); emailFromUrl = null; } }
        let validatedEmailFromUrl = null;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailFromUrl && emailRegex.test(emailFromUrl)) validatedEmailFromUrl = emailFromUrl;
        let finalInitialState = { ...defaultStructure, ...dataFromStorage };
        if (validatedEmailFromUrl) finalInitialState.userEmail = validatedEmailFromUrl;
        return finalInitialState;
    });
    const totalStepsForCurrentMode = operatingMode === 'short' ? TOTAL_STEPS_SHORT_MODE : TOTAL_STEPS_FULL_MODE;
    const [currentStep, setCurrentStep] = useState(() => {
        const maxStepsForMode = totalStepsForCurrentMode;
        let stepToRestore = 0;
        if (initialFormData) {
            if (typeof initialFormData.currentStepForContinuation === 'number') {
                stepToRestore = initialFormData.currentStepForContinuation;
            }
            localStorage.removeItem(LOCAL_STORAGE_STEP_KEY);
        } else {
            const savedStep = localStorage.getItem(LOCAL_STORAGE_STEP_KEY);
            if (savedStep !== null) stepToRestore = parseInt(savedStep, 10);
        }
        if (isNaN(stepToRestore) || stepToRestore < 0 || stepToRestore >= maxStepsForMode) {
            stepToRestore = 0;
        }
        return stepToRestore;
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionResult, setSubmissionResult] = useState(null);
    const [calculationResult, setCalculationResult] = useState(null);
    const [errors, setErrors] = useState({});
    const [sectors, setSectors] = useState([]);
    const [subSectors, setSubSectors] = useState([]);
    const [isSubSectorsLoading, setIsSubSectorsLoading] = useState(false);
    const [isSendingLink, setIsSendingLink] = useState(false);
    const [sendLinkResult, setSendLinkResult] = useState({ status: 'idle', message: '' });
    const [isContinuationLinkSent, setIsContinuationLinkSent] = useState(false);

    useEffect(() => { localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData)); }, [formData]);
    useEffect(() => {
        if (currentStep < totalStepsForCurrentMode && !calculationResult && (!submissionResult || !submissionResult.success) ) {
            localStorage.setItem(LOCAL_STORAGE_STEP_KEY, currentStep.toString());
        }
    }, [currentStep, totalStepsForCurrentMode, calculationResult, submissionResult]);
    useEffect(() => { // NAICS fetch
        const fetchNaicsData = async () => {
            setIsSubSectorsLoading(true); setSectors([]); setSubSectors([]);
            try {
                const response = await fetch('/naics-data/all_naics_data.json');
                if (!response.ok) throw new Error(`HTTP error ${response.status}`);
                const allData = await response.json();
                if (Array.isArray(allData)) {
                    setSectors(allData);
                    if (formData.naicsSector) {
                        const selectedSectorData = allData.find(s => s.name === formData.naicsSector);
                        if (selectedSectorData?.subSectors) setSubSectors(selectedSectorData.subSectors);
                        else setSubSectors([]);
                    }
                } else { console.error("NAICS data not an array"); setSectors([]); }
            } catch (error) { console.error("Error fetching NAICS", error); setSectors([]); setSubSectors([]); }
            finally { setIsSubSectorsLoading(false); }
        };
        fetchNaicsData();
    }, []);
    useEffect(() => { // NAICS subsector update
        if (!formData.naicsSector || sectors.length === 0) { setSubSectors([]); return; }
        const selectedSectorData = sectors.find(s => s.name === formData.naicsSector);
        if (selectedSectorData?.subSectors) setSubSectors(selectedSectorData.subSectors);
        else setSubSectors([]);
    }, [formData.naicsSector, sectors]);
    useEffect(() => { window.scrollTo(0, 0); }, [currentStep]); 

    const allQuestionsForCurrentStep = getQuestionsForStep(currentStep);
    const currentSectionTitle = sections[currentStep];
    const currentQuestions = operatingMode === 'short'
        ? allQuestionsForCurrentStep.filter(q => q.isEssentialForShortMode === true) // Usando tu flag
        : allQuestionsForCurrentStep;

// --- HANDLERS Y FUNCIONES CALLBACK ---
    const handleChange = useCallback((event) => {
        const { name, value, type } = event.target;
        let resetData = {};
        if (name === 'naicsSector') { resetData.naicsSubSector = ''; setSubSectors([]); }
        setFormData(prevData => ({ ...prevData, ...resetData, [name]: type === 'number' ? (value === '' ? null : parseFloat(value)) : value }));
        if (errors[name]) { setErrors(prevErrors => { const newErrors = { ...prevErrors }; delete newErrors[name]; return newErrors; }); }
    }, [errors, setFormData, setSubSectors]);

    const calculateScores = useCallback((formDataToScore) => {
        const scores = initialScores ? { ...initialScores } : {};
        const allQuestions = [];
        sections.forEach((_, index) => { allQuestions.push(...getQuestionsForStep(index)); });
        const isQualitative = (q) => q && q.scoringArea && typeof ScoringAreas === 'object' && Object.values(ScoringAreas).includes(q.scoringArea);
        const qualitativeQuestionsNow = allQuestions.filter(isQualitative);
        if (!Array.isArray(qualitativeQuestionsNow)) { console.error("calculateScores: Could not get qualitative questions."); return scores; }
        qualitativeQuestionsNow.forEach(question => {
            const answer = formDataToScore[question.valueKey];
            const area = question.scoringArea;
            if (answer && area && question.type === 'mcq' && scores.hasOwnProperty(area) && Array.isArray(question.options)) {
                const selectedOption = question.options.find(opt => opt.text === answer);
                if (selectedOption && typeof selectedOption.score === 'number') { scores[area] += selectedOption.score; }
                else if (selectedOption) { console.warn(`Score missing/invalid: QID ${question.id}, Ans "${answer}"`); }
            }
        });
        return scores; // Devuelve los scores calculados, no initialScores directamente
    }, [sections, getQuestionsForStep, initialScores, ScoringAreas]); 

     const generateImprovementRoadmap = useCallback((scores, stage, currentFormData) => {
        const roadmapItems = [];
        const numberOfAreasToShow = 3;
        const stageToUrlMap = {
             "Pre-Revenue / Negative EBITDA": 'https://www.acquisition.com/training/improvise', "Startup": 'https://www.acquisition.com/training/monetize',
             "Mature Start-up": 'https://www.acquisition.com/training/stabilize', "Grow-up": 'https://www.acquisition.com/training/prioritize',
             "Mature Grow-up": 'https://www.acquisition.com/training/productize', "Scale Up": 'https://www.acquisition.com/training/optimize',
             "Mature Scaleup": 'https://www.acquisition.com/training/specialize',
        };
        const fallbackUrl = 'https://www.acquisition.com/training/stabilize';
        const targetUrl = stageToUrlMap[stage] || fallbackUrl;
        const roadmapContent = {
            [ScoringAreas.SYSTEMS]: { title: "Strengthen Execution Systems", rationale: "Robust systems reduce errors, increase efficiency, and make the business less dependent on key individuals, directly increasing its operational stability and attractiveness to buyers.", actionSteps: ["Document your most critical client delivery or operational process using a Standard Operating Procedure (SOP) template.","Implement a simple checklist for a key quality control point in your workflow.","Identify one repetitive manual task and research software (e.g., CRM, project management tool) that could potentially automate it."], maxScore: 20 },
            [ScoringAreas.WORKFORCE]: { title: "Develop Workforce & Leadership", rationale: "A strong, autonomous management team and clear accountability structures reduce owner dependency, a key risk factor that lowers business value. Engaged, well-managed teams are also more productive.", actionSteps: ["Define the Top 3 Key Performance Indicators (KPIs) for one key role (besides your own).","Hold a dedicated meeting with your key team member(s) to discuss their roles, responsibilities, and how their performance links to business goals.","Identify one key task currently only you perform and create a plan to delegate it within the next quarter."], maxScore: 20 },
            [ScoringAreas.MARKET]: { title: "Solidify Robust Market Position", rationale: "Operating in a growing market with a diversified customer base and a strong competitive position reduces risk and signals significant future potential, boosting valuation multiples.", actionSteps: ["Calculate the percentage of revenue coming from your top 3 customers over the last 12 months.","Clearly write down your Unique Selling Proposition (USP): What makes you different and better than your top 2 competitors?","Research and document the estimated size (TAM) and growth rate of your primary market niche."], maxScore: 25 },
            [ScoringAreas.PROFITABILITY]: { title: "Enhance Profitability Metrics", rationale: "Consistent, predictable, and healthy profit margins are fundamental to business valuation. Higher, more reliable profits directly translate to a higher business value.", actionSteps: ["Review your pricing structure for your main product/service – when was it last updated compared to competitors and costs?","Identify your top 2-3 sources of recurring revenue (or brainstorm ways to create some).","Implement a simple monthly review of your Profit & Loss statement, focusing on Gross Profit Margin trends."], maxScore: 20 },
            [ScoringAreas.MARKETING]: { title: "Build Marketing & Brand Equity", rationale: "A strong offering combined with an effective sales process ensures customer value is delivered and captured efficiently, maximizing growth and profitability.",actionSteps: ["Map your current sales process stages from lead generation to closed deal.","Identify key conversion metrics for each stage (e.g., lead-to-opportunity rate, opportunity-to-close rate).","Review customer feedback (from off1/NPS) to identify areas for offering improvement."], maxScore: 20 },
            [ScoringAreas.OFFERING_SALES]: { title: "Improve Offering & Sales Effectiveness", rationale: "High customer satisfaction, strong differentiation, and consistent quality build reputation and recurring revenue, reducing churn and supporting premium pricing – all positive valuation factors.", actionSteps: ["Implement a simple customer feedback mechanism (e.g., a 1-question post-service email survey or using Net Promoter Score - NPS).","Map out your core service/product delivery process and identify one key step where quality could be improved or standardized.","Analyze your top competitor's main offering – list 2 things they do well and 1 thing your offering does better."], maxScore: 20 },
            [ScoringAreas.EXPANSION]: { title: "Develop Expansion Capability", rationale: "Demonstrating the ability to scale operations into new markets, services, or partnerships significantly increases perceived future value and strategic options for potential acquirers.", actionSteps: ["Outline the basic steps required to launch your service/product in a new neighboring city or region.","Identify one potential strategic partner (e.g., a complementary business) and brainstorm 2 ways you could collaborate.","Assess your current team/systems: What would be the biggest bottleneck if demand doubled next month?"], maxScore: 20 }
};
  // --- Validación básica de entradas ---
if (!scores || typeof scores !== 'object' || Object.keys(scores).length === 0) { return []; }
        if (!currentFormData || typeof currentFormData !== 'object' || Object.keys(currentFormData).length === 0) { return []; }

// ***** INICIO: BLOQUE DE LÓGICA CONDICIONAL FALTANTE REINSERTADO *****
    let executeConditionalLogic = false;
        const marketingAreaKey = ScoringAreas.MARKETING;
        const marketingScore = scores[marketingAreaKey] || 0;
        const maxMarketingScore = calculateMaxScoreForArea(marketingAreaKey); 
        const marketingScorePercent = maxMarketingScore > 0 ? marketingScore / maxMarketingScore : 0;
        const revenueBalance = currentFormData.revenueSourceBalance;  // Usando el parámetro formData
    const directSalesRevenueBalances = [
        "Mostly/All Direct (>80% Direct Revenue)",
        "Primarily Direct (approx. 60-80% Direct Revenue)",
        "Roughly Balanced Mix (approx. 40-60% Direct Revenue)"
    ];
  if (marketingScorePercent < 0.80 && directSalesRevenueBalances.includes(revenueBalance)) {
        console.log("generateImprovementRoadmap: CONDICIÓN PRIORIZAR MARKETING CUMPLIDA.");
        executeConditionalLogic = true;
    } else {
        console.log("generateImprovementRoadmap: Condición marketing no cumplida, usando lógica estándar.");
    }
        // --- Construcción del Roadmap ---
    if (executeConditionalLogic) {
        // 1. Añadir Marketing primero
        const marketingContent = roadmapContent[marketingAreaKey];
        if (marketingContent) {
            const linkText = `-> Watch the "${stage}" section on Acquisition.com for guidance on ${marketingContent.title}`;
            roadmapItems.push({
                areaName: marketingAreaKey, title: marketingContent.title, areaScore: marketingScore,
                maxScore: maxMarketingScore, rationale: marketingContent.rationale,
                actionSteps: marketingContent.actionSteps, linkText: linkText, linkUrl: targetUrl
            });
        } else {
             console.warn("generateImprovementRoadmap: Contenido del roadmap para Marketing no encontrado.");
        }
            // 2. Encontrar las siguientes 2 áreas más bajas (excluyendo Marketing)
        const otherScores = Object.entries(scores)
            .filter(([areaKey]) => areaKey !== marketingAreaKey && Object.values(ScoringAreas).includes(areaKey) && roadmapContent[areaKey])
            .sort(([, scoreA], [, scoreB]) => (scoreA || 0) - (scoreB || 0));
        const nextLowestAreas = otherScores.slice(0, numberOfAreasToShow - 1);

            // 3. Añadir las siguientes 2 áreas al roadmap
        nextLowestAreas.forEach(([areaKey, areaScoreVal]) => { // Renombrado areaScore a areaScoreVal para evitar conflicto
            const content = roadmapContent[areaKey];
            if (content) {
                const maxScoreForAreaVal = calculateMaxScoreForArea(areaKey); // Renombrado
                const linkText = `-> Watch the "${stage}" section on Acquisition.com for guidance on ${content.title}`;
                roadmapItems.push({
                    areaName: areaKey, title: content.title, areaScore: areaScoreVal || 0,
                    maxScore: maxScoreForAreaVal, rationale: content.rationale,
                    actionSteps: content.actionSteps, linkText: linkText, linkUrl: targetUrl
                });
            }
        });

    } else {
        // --- Lógica Original: Tomar las 3 áreas con menor puntuación general ---
        const sortedScores = Object.entries(scores)
            .filter(([areaKey]) => Object.values(ScoringAreas).includes(areaKey) && roadmapContent[areaKey])
            .sort(([, scoreA], [, scoreB]) => (scoreA || 0) - (scoreB || 0));
        const areasToImprove = sortedScores.slice(0, numberOfAreasToShow);
        areasToImprove.forEach(([areaKey, areaScoreVal]) => { // Renombrado
            const content = roadmapContent[areaKey];
            if (content) {
                const maxScoreForAreaVal = calculateMaxScoreForArea(areaKey); // Renombrado
                const linkText = `-> Watch the "${stage}" section on Acquisition.com for guidance on ${content.title}`;
                roadmapItems.push({
                    areaName: areaKey, title: content.title, areaScore: areaScoreVal || 0,
                    maxScore: maxScoreForAreaVal, rationale: content.rationale,
                    actionSteps: content.actionSteps, linkText: linkText, linkUrl: targetUrl
                });
            }
        });
    }
    console.log("Generated roadmap items:", roadmapItems);
    return roadmapItems;
 
    }, [calculateMaxScoreForArea, ScoringAreas]);

const handleSubmit = useCallback(async () => { // Para MODO FULL
        console.log("handleSubmit (FULL MODE): Iniciando...");
        setIsSubmitting(true); setSubmissionResult(null); setCalculationResult(null); setErrors({});
        let localCalcResult = null;
        try {
            // VALIDACIONES
            if (!formData || !formData.userEmail) throw new Error("User email is missing.");
            const requiredFinancials = ['currentRevenue', 'ebitda'];
            const missingFinancials = requiredFinancials.filter(key => formData[key] == null || isNaN(formData[key]));
            if (missingFinancials.length > 0) throw new Error(`Missing/invalid financials: ${missingFinancials.join(', ')}.`);
            if (!formData.naicsSector || !formData.naicsSubSector) throw new Error("Industry sector/sub-sector is required.");

            // CÁLCULOS
            const adjEbitda = (parseFloat(formData.ebitda) || 0) + (parseFloat(formData.ebitdaAdjustments) || 0);
            const valuationParams = getValuationParameters(adjEbitda, formData.naicsSector, formData.naicsSubSector);
            if (!valuationParams || typeof valuationParams.stage === 'undefined') throw new Error("Could not get valuation parameters.");
            const { stage, baseMultiple, maxMultiple } = valuationParams;
            const scores = calculateScores(formData);
            if (!scores || typeof scores !== 'object') throw new Error("Could not calculate scores.");
            const maxPossible = calculateMaxPossibleScore();
            const scorePercentage = maxPossible > 0 ? (Object.values(scores).reduce((sum, s) => sum + (s || 0), 0) / maxPossible) : 0;
            const clampedScorePercentage = Math.max(0, Math.min(1, scorePercentage));
            const finalMultiple = baseMultiple + (maxMultiple - baseMultiple) * clampedScorePercentage;
            const estimatedValuation = adjEbitda >= 0 ? Math.round(adjEbitda * finalMultiple) : 0;
            const roadmapData = generateImprovementRoadmap(scores, stage, formData);

            localCalcResult = { stage, adjEbitda, baseMultiple, maxMultiple, finalMultiple, estimatedValuation, scores, scorePercentage: clampedScorePercentage, roadmap: roadmapData, mode: 'full_valuation' }; // Añadido mode
            
            const payloadToSend = { formData: formData, results: localCalcResult };
            const functionsBase = getFunctionsBaseUrl();
            const functionPath = '/.netlify/functions/submit-valuation';
            let functionUrl = import.meta.env.DEV ? `${functionsBase}${functionPath}` : functionPath;
            if(!functionUrl) throw new Error("Function URL could not be determined.");
            if (!functionUrl.startsWith('http') && !functionUrl.startsWith('/')) functionUrl = `/${functionUrl}`;


            const response = await fetch(functionUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payloadToSend) });
            const result = await response.json(); // Asumir que siempre devuelve JSON
            if (!response.ok || !result.success) {
                 throw new Error(result.error || 'Backend processing for full submission failed.');
            }
            setCalculationResult(localCalcResult);
            setSubmissionResult({ success: true, message: result.message || "Valuation submitted successfully!" });
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            localStorage.removeItem(LOCAL_STORAGE_STEP_KEY);
        } catch (error) { 
           console.error("handleSubmit (FULL MODE) ERROR:", error);
           setSubmissionResult({ success: false, message: `Submission Failed: ${error.message}` });
           setCalculationResult(null);
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, calculateScores, generateImprovementRoadmap, getValuationParameters, calculateMaxPossibleScore, getFunctionsBaseUrl, initialScores]);
    
     const performSaveAndSendLinkActions = useCallback(async (currentFormData, currentFormStep, currentOperatingMode, existingAssessmentId) => {
        setIsSendingLink(true);
        setSendLinkResult({ status: 'idle', message: '' }); // Resetear feedback previo

        if (!currentFormData.userEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentFormData.userEmail)) {
            setIsSendingLink(false);
            return { success: false, message: 'Valid seller email required to save and send link.' };
        }

        const functionsBase = getFunctionsBaseUrl();
        let assessmentIdToUse = existingAssessmentId || currentFormData.assessmentId;

        try {
            const savePayload = {
                assessment_id: assessmentIdToUse || null,
                userEmail: currentFormData.userEmail,
                formData: { ...currentFormData, currentStepForSave: currentFormStep },
                saved_by: currentOperatingMode,
            };
            const saveResponse = await fetch(`${functionsBase}/.netlify/functions/save-partial-assessment`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(savePayload)
            });
            if (!saveResponse.ok) { const txt = await saveResponse.text(); throw new Error(`Save failed: ${txt.substring(0,100)}`); }
            const saveResult = await saveResponse.json();
            if (!saveResult.success || !saveResult.assessment_id) throw new Error(saveResult.error || 'Save failed or no ID.');
            
            assessmentIdToUse = saveResult.assessment_id;
            if (!currentFormData.assessmentId) { // Actualiza el estado principal de formData si se creó un nuevo ID
                setFormData(prev => ({ ...prev, assessmentId: assessmentIdToUse }));
            }

            const sendLinkPayload = { assessment_id: assessmentIdToUse, userEmail: currentFormData.userEmail };
            const sendLinkResponse = await fetch(`${functionsBase}/.netlify/functions/send-continuation-link`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sendLinkPayload)
            });
            if (!sendLinkResponse.ok) { const txt = await sendLinkResponse.text(); throw new Error(`Send link failed: ${txt.substring(0,100)}`);}
            const sendLinkFnResult = await sendLinkResponse.json();
            if (!sendLinkFnResult.success) throw new Error(sendLinkFnResult.error || 'Send link server error.');

            setIsContinuationLinkSent(true);
            return { success: true, message: `Continuation link sent to ${currentFormData.userEmail}.`, assessmentId: assessmentIdToUse };
        } catch (error) {
            console.error("performSaveAndSendLinkActions ERROR:", error);
            return { success: false, message: error.message };
        } finally {
            setIsSendingLink(false);
        }
        return { success: true, message: "Placeholder" };
    }, [getFunctionsBaseUrl, setFormData]);

    const handleSaveAndSendLink = useCallback(async () => {
        if (isContinuationLinkSent && (operatingMode === 'short' || operatingMode === 'vc_mode')) {
            setSendLinkResult({ status: 'info', message: 'Continuation link has already been sent for this session.' });
            return; 
        }
        console.log("handleSaveAndSendLink: User initiated save and send link.");
        setIsSendingLink(true);
        setSendLinkResult({ status: 'idle', message: '' });

        if (!formData.userEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail)) {
            setSendLinkResult({ status: 'error', message: 'Valid seller email required to send link.' });
            setIsSendingLink(false);
            return;
        }

        const functionsBase = getFunctionsBaseUrl();
        let assessmentIdForLink = formData.assessmentId;

        try {
            console.log("handleSaveAndSendLink: Saving partial assessment...");
            const savePayload = {
                assessment_id: assessmentIdForLink || null,
                userEmail: formData.userEmail,
                formData: { ...formData, currentStepForSave: currentStep },
                saved_by: operatingMode,
            };
            const saveUrl = `${functionsBase}/.netlify/functions/save-partial-assessment`;
            const saveResponse = await fetch(saveUrl, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(savePayload)
            });
            if (!saveResponse.ok) {
                const errorText = await saveResponse.text();
                throw new Error(`Save progress failed (Status ${saveResponse.status}): ${errorText.substring(0,150)}`);
            }
            const saveResult = await saveResponse.json();
            if (!saveResult.success || !saveResult.assessment_id) {
                throw new Error(saveResult.error || 'Failed to save progress or get assessment ID.');
            }
            
            assessmentIdForLink = saveResult.assessment_id;
            if (assessmentIdForLink && assessmentIdForLink !== formData.assessmentId) {
                setFormData(prev => ({ ...prev, assessmentId: assessmentIdForLink }));
            }
            console.log(`handleSaveAndSendLink: Progress saved. Assessment ID: ${assessmentIdForLink}`);

            console.log("handleSaveAndSendLink: Sending continuation link...");
            const sendLinkPayload = { assessment_id: assessmentIdForLink, userEmail: formData.userEmail };
            const sendLinkUrl = `${functionsBase}/.netlify/functions/send-continuation-link`;
            const sendLinkResponse = await fetch(sendLinkUrl, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sendLinkPayload)
            });
            if (!sendLinkResponse.ok) {
                const errorText = await sendLinkResponse.text();
                throw new Error(`Send link failed (Status ${sendLinkResponse.status}): ${errorText.substring(0,150)}`);
            }
            const sendLinkFnResult = await sendLinkResponse.json();
            if (!sendLinkFnResult.success) {
                throw new Error(sendLinkFnResult.error || 'Failed to send continuation link from server.');
            }

            setIsContinuationLinkSent(true);
            setSendLinkResult({ status: 'success', message: `Continuation link sent to ${formData.userEmail}.` });
            console.log("handleSaveAndSendLink: Link sent successfully.");

        } catch (error) {
            console.error("handleSaveAndSendLink: ERROR:", error);
            setSendLinkResult({ status: 'error', message: error.message || 'An unexpected error occurred.' });
        } finally {
            setIsSendingLink(false);
        }
    }, [formData, currentStep, operatingMode, isContinuationLinkSent, getFunctionsBaseUrl, setFormData, setIsSendingLink, setSendLinkResult, setIsContinuationLinkSent]);

    const handleJrVCShowPreliminaryResults = useCallback(async () => {
        console.log("handleJrVCShowPreliminaryResults: Processing for Jr. VC...");
        setIsSubmitting(true); 
        setCalculationResult(null); 
        setErrors({});
        // No se limpia submissionResult aquí para poder ver el estado de un envío de link previo.

        try {
            const requiredVCFields = [
                'userEmail', 'ownerRole', 'yearsInvolved', 'employeeCountRange', 'locationState', 'locationZip',
                'revenueSourceBalance', 'customerTypeBalance', 'naicsSector', 'naicsSubSector', 
                'currentRevenue', 'ebitda', 'grossProfit',
                'expansionVolumePrep', 'marketingLeadGen', 'profitTrend', 
                'offeringFollowOnRevenue', 'workforceOwnerReliance', 'systemsKPIs', 'marketCustConcentration'
            ];
            const currentVCErrors = {}; let isValidForVCProcess = true;
            requiredVCFields.forEach(key => {
                if (!formData[key] || formData[key].toString().trim() === '') {
                    currentVCErrors[key] = true; isValidForVCProcess = false;
                }
            });
            if (formData.userEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userEmail)) { currentVCErrors.userEmail = true; isValidForVCProcess = false;}
            if (isNaN(parseFloat(formData.currentRevenue))) { currentVCErrors.currentRevenue = true; isValidForVCProcess = false; }
            if (isNaN(parseFloat(formData.ebitda))) { currentVCErrors.ebitda = true; isValidForVCProcess = false; }
            if (isNaN(parseFloat(formData.grossProfit))) { currentVCErrors.grossProfit = true; isValidForVCProcess = false; }

            setErrors(currentVCErrors);
            if (!isValidForVCProcess) {
                const missingFieldNames = Object.keys(currentVCErrors).map(key => getQuestionsDataArray().find(q => q.valueKey === key)?.text.replace(/\?$/, '') || key).join(', ');
                throw new Error(`Jr. VC Analysis: Please fill required fields: ${missingFieldNames}.`);
            }

let qualitativePotentialScore = 0; let maxQualitativePotentialScore = 0;
            const allQuestions = getQuestionsDataArray();
            // Asegúrate de que el flag aquí sea el que usas en questions.js (isEssentialForShortMode o isEssentialForVC)
            const vcQuestions = allQuestions.filter(q => q.isEssentialForShortMode === true); 

            vcQuestions.forEach(q => {
                const answer = formData[q.valueKey];
                if (q.vc_score_map && answer && q.vc_score_map.hasOwnProperty(answer)) {
                    qualitativePotentialScore += q.vc_score_map[answer];
                    maxQualitativePotentialScore += q.max_vc_score || 0; 
                } else if (q.options && q.options.find(opt => typeof opt.vc_score === 'number')) {
                    const selectedOption = q.options.find(opt => opt.text === answer);
                    if (selectedOption && typeof selectedOption.vc_score === 'number') {
                        qualitativePotentialScore += selectedOption.vc_score;
                    }
                    if (q.max_vc_score !== undefined) {
                        maxQualitativePotentialScore += q.max_vc_score;
                    } else if (q.options.every(opt => typeof opt.vc_score === 'number')) {
                         maxQualitativePotentialScore += Math.max(0, ...q.options.map(opt => opt.vc_score));
                    } else {
                        console.warn(`VC Score: Pregunta MCQ ${q.id} (key: ${q.valueKey}) no tiene max_vc_score definido ni todas las opciones con vc_score. El máximo potencial podría ser incorrecto.`);
                    }
                }
            });
            const qualitativePotentialPercentage = maxQualitativePotentialScore > 0 ? Math.min(1, Math.max(0, qualitativePotentialScore / maxQualitativePotentialScore)) : 0;

const adjEbitda = parseFloat(formData.ebitda) || 0;
            const valuationParams = getValuationParameters(adjEbitda, formData.naicsSector, formData.naicsSubSector);
            if (!valuationParams || valuationParams.baseMultiple == null || valuationParams.maxMultiple == null) {
                 throw new Error("Could not determine valuation parameters for Jr. VC calculation.");
            }
            const { stage, baseMultiple, maxMultiple } = valuationParams;
            const scoreFactorForValuation = qualitativePotentialPercentage > 0 ? qualitativePotentialPercentage : 0.35; // Default
            const finalMultiple = baseMultiple + (maxMultiple - baseMultiple) * scoreFactorForValuation;
            let estimatedValuation = (adjEbitda < 0 && finalMultiple > 0) ? 0 : Math.round(adjEbitda * finalMultiple);
            let sellerSegment = 'standard_follow_up';
            if (formData.employeeCountRange === "1-5 FTEs" && parseFloat(formData.currentRevenue) > 3000000) {
                sellerSegment = 'high_potential_marketing';
            }
            
            // INTENTAR GUARDAR Y ENVIAR LINK SI NO SE HA HECHO ANTES
            let currentSendLinkResult = sendLinkResult; // Usar el estado actual como fallback
            if (!isContinuationLinkSent) {
                console.log("handleJrVCShowPreliminaryResults: Link not yet sent, calling handleSaveAndSendLink()...");
                await handleSaveAndSendLink(); // Llamamos a la función. Esperamos a que termine.
                                             // Los estados isContinuationLinkSent y sendLinkResult serán actualizados por ella.
            } else {
                console.log("handleJrVCShowPreliminaryResults: Link was already sent earlier in this session.");
            }
const jrVcRoadmap = [
                { 
                    areaName: "SellerPotentialSnapshot",
                    title: `Segment Suggestion: ${sellerSegment.replace(/_/g, ' ').toUpperCase()}`,
                    rationale: `Qualitative Potential: ${(qualitativePotentialPercentage * 100).toFixed(0)}% (${qualitativePotentialScore} / ${maxQualitativePotentialScore}). Based on key initial indicators.`,
                    actionSteps: [
                        `Preliminary Estimated Valuation: $${estimatedValuation.toLocaleString()}`,
                        `Business Stage (based on EBITDA & Industry): ${stage}`,
                        `Applied Multiple for this estimate: ${finalMultiple.toFixed(1)}x (Industry Range: ${baseMultiple.toFixed(1)}x - ${maxMultiple.toFixed(1)}x)`
                    ] 
                },

            ];
            
            setCalculationResult({ 
                mode: 'jr_vc_summary', 
                estimatedValuation, 
                roadmap: jrVcRoadmap 
            });

// El submissionResult se habrá actualizado si se intentó enviar el link dentro de esta función.
// O se puede setear un mensaje genérico de "Análisis preliminar listo".
     if (isContinuationLinkSent && sendLinkResult.status === 'success') {
                 setSubmissionResult({ success: true, message: "Preliminary analysis generated. Link to seller has been sent." });
            } else if (sendLinkResult.status === 'error') {
                 setSubmissionResult({ success: false, message: `Preliminary analysis generated, but an issue occurred with the seller link: ${sendLinkResult.message}` });
            } else if (isContinuationLinkSent && sendLinkResult.status === 'info') { // Link ya se había enviado
                 setSubmissionResult({ success: true, message: "Preliminary analysis generated. Link was already sent to seller." });
            } else { // Link no enviado aún (y no se intentó aquí porque ya se había enviado, o no se intentó porque no se cumplió la condición)
                setSubmissionResult({ success: true, message: "Preliminary analysis generated. Seller link not sent via this action." });
            }

        } catch (error) { // Errores de validación o cálculo ANTES del intento de envío de link
            console.error("handleJrVCShowPreliminaryResults: ERROR (validation/calculation):", error);
            setCalculationResult({ mode: 'jr_vc_summary_error', errorMessage: error.message });
            setSubmissionResult({ success: false, message: error.message }); // También reflejar en submissionResult
        } finally {
            setIsSubmitting(false);
        }
    // Dependencias: handleSaveAndSendLink es crucial aquí.
    // sendLinkResult también es importante para construir el roadmap y el submissionResult final.
    }, [formData, isContinuationLinkSent, sendLinkResult, sections, getQuestionsForStep, getValuationParameters, getQuestionsDataArray, setIsSubmitting, setCalculationResult, setErrors, handleSaveAndSendLink, setSubmissionResult]);

     const handleNext = useCallback(() => {
        const questionsToValidate = currentQuestions;
        const stepErrors = {}; let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        questionsToValidate.forEach(q => {
            const value = formData[q.valueKey];
            let isEmpty = value == null || value === '' || (typeof value === 'number' && isNaN(value));
            if (q.valueKey === 'ebitdaAdjustments' && value === 0 && operatingMode === 'full') isEmpty = false;
            let isActuallyRequired = q.required; 
            if (operatingMode === 'short' && q.hasOwnProperty('isEssentialForShortMode') && q.isEssentialForShortMode === true) {
                // Si una pregunta es esencial para el modo corto, la consideramos requerida
                // a menos que explícitamente tenga requiredForShortMode: false
                isActuallyRequired = q.requiredForShortMode !== undefined ? q.requiredForShortMode : q.required;
            }
            if (isActuallyRequired && isEmpty) { stepErrors[q.valueKey] = true; isValid = false; }
            else if (q.type === 'email' && value && !emailRegex.test(value)) { stepErrors[q.valueKey] = true; isValid = false; }
        });
        setErrors(stepErrors);

        if (isValid) {
            if (currentStep < totalStepsForCurrentMode - 1) {
                setCurrentStep(prevStep => prevStep + 1);
            } else { 
                if (operatingMode === 'full') {
                    handleSubmit(); 
                } else if (operatingMode === 'short') {
                    handleJrVCShowPreliminaryResults(); 
                }
            }
        }
    }, [currentStep, formData, handleSubmit, handleJrVCShowPreliminaryResults, currentQuestions, operatingMode, totalStepsForCurrentMode, setCurrentStep, setErrors]);

       const handlePrevious = useCallback(() => {
      if (currentStep > 0) {
          setCurrentStep(prevStep => prevStep - 1);
          setErrors({});
      }
  }, [currentStep]);

 const handleStartOver = useCallback(() => {
        setSubmissionResult(null); setCalculationResult(null); setCurrentStep(0);
        const defaultStructure = { 
            currentRevenue: null, grossProfit: null, ebitda: null, ebitdaAdjustments: 0, userEmail: '', 
            ownerRole: '', yearsInvolved: '', naicsSector: '', naicsSubSector: '', employeeCountRange: '', 
            locationState: '', locationZip: '', revenueSourceBalance: '', customerTypeBalance: '', assessmentId: null
        };
        setFormData(defaultStructure); 
        setErrors({}); setIsContinuationLinkSent(false); 
        setSendLinkResult({ status: 'idle', message: '' }); 
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        localStorage.removeItem(LOCAL_STORAGE_STEP_KEY);
    }, [setFormData, setCurrentStep, setSubmissionResult, setCalculationResult, setErrors, setIsContinuationLinkSent, setSendLinkResult]);

    const handleBackToEdit = useCallback(() => {
      setSubmissionResult(null); setCalculationResult(null); 
    }, [setSubmissionResult, setCalculationResult]);

    // --- CONDITIONAL RENDERING LOGIC ---
    if (calculationResult && (calculationResult.mode === 'jr_vc_summary' || calculationResult.mode === 'jr_vc_summary_error')) {
        return (
            <ResultsDisplay
                calculationResult={calculationResult}
                onStartOver={handleStartOver}
                operatingMode={operatingMode}
                isContinuationLinkAlreadySent={isContinuationLinkSent}
                onTriggerSaveAndSendLink={handleSaveAndSendLink}
                isSendingLinkState={isSendingLink}
                sendLinkResultFeedback={sendLinkResult} // Pasar el feedback del estado principal
            />
        );
    } else if (submissionResult && submissionResult.success && calculationResult && calculationResult.mode === 'full_valuation') {
        return ( <ResultsDisplay calculationResult={calculationResult} onStartOver={handleStartOver} onBackToEdit={handleBackToEdit} operatingMode={operatingMode} /* ... */ /> );
    } else if (submissionResult && !submissionResult.success) {
         return ( <div className="submission-result error"><h2>Submission Error</h2><p>{submissionResult.message}</p><button type="button" onClick={() => { setSubmissionResult(null); setCalculationResult(null); }}>Back to Form</button></div> );
    }

    // --- Renderizado principal del formulario ---
 return (
        <div className="multi-step-form">
            <ProgressIndicator 
                currentStep={currentStep + 1} 
                totalSteps={totalStepsForCurrentMode} 
                sections={sections} 
            />
            <form onSubmit={(e) => e.preventDefault()}>
                <Step
                    key={`${currentStep}-${operatingMode}`}
                    stepIndex={currentStep}
                    questions={currentQuestions}
                    formData={formData}
                    handleChange={handleChange}
                    sectionTitle={currentSectionTitle}
                    errors={errors}
                    dynamicOptions={{ sectors, subSectors }}
                    isSubSectorsLoading={isSubSectorsLoading}
                />
                <Navigation
                    currentStep={currentStep}
                    totalSteps={totalStepsForCurrentMode}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    isSubmitting={isSubmitting}
                    onSaveAndSendLink={handleSaveAndSendLink} 
                    isSendingLink={isSendingLink}
                    sendLinkResult={sendLinkResult}
                    isLinkAlreadySent={isContinuationLinkSent}
                    submitButtonText={
                        (operatingMode === 'short') 
                        ? (currentStep === totalStepsForCurrentMode - 1 ? "View Preliminary Analysis" : "Next")
                        : (currentStep === totalStepsForCurrentMode - 1 ? "Submit Full Valuation" : "Next")
                    }
                />
            </form>
        </div>
    );
}

export default MultiStepForm;