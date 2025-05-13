// src/components/results/ResultsDisplay.jsx
import React, { useState, useRef } from 'react';
import { pdf } from '@react-pdf/renderer'; // Necesario para generar el PDF
//import { toPng } from 'html-to-image';     // Necesario para capturar el gráfico
import { toJpeg } from 'html-to-image'; 
import ValuationSnapshot from './ValuationSnapshot';

import ScoreDetails from './ScoreDetails';
import RoadmapSection from './RoadmapSection';
import ResultsCTA from './ResultsCTA';
import DiscussTabContent from './DiscussTabContent';
import ValuationReportPDF from './ValuationReportPDF'; // Componente que define el PDF
import ScoreRadarChart from './ScoreRadarChart';   // Componente del gráfico (para el div oculto)
import { ScoringAreas } from '../../scoringAreas.js';

// Definición de las pestañas
const FULL_MODE_TABS = [
  { id: 'snapshot', label: 'Valuation Summary' },
  { id: 'scores', label: 'Score Detail' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'discuss', label: 'Discuss Your Results' },
];

// El componente principal de resultados
function ResultsDisplay({ 
    calculationResult, 
    onStartOver, 
    onBackToEdit, // Solo para modo 'full'
    formData, // Para mostrar el email del seller en el resumen si es necesario
    consultantCalendlyLink,
    userEmail // Este es el email del usuario logueado o el del formData
}) {
  
 const [activeTab, setActiveTab] = useState(FULL_MODE_TABS[0].id); // Usa FULL_MODE_TABS
  const hiddenChartRef = useRef(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // --- Manejo de Carga ---
  if (!calculationResult) {
    return <div className="submission-result">Loading results...</div>;
  }

  const {
    mode, // 'jr_vc_summary', 'jr_vc_summary_error', o 'full_valuation'
    errorMessage, // Solo para 'jr_vc_summary_error'
    // Los siguientes son principalmente para 'full_valuation', pero algunos pueden estar en 'jr_vc_summary'
    stage = 'N/A',
    adjEbitda = 0,
    baseMultiple = 0,
    maxMultiple = 0,
    finalMultiple = 0,
    estimatedValuation = 0,
    scores = {}, // Para 'full_valuation' son los detallados, para 'jr_vc_summary' es un placeholder
    roadmap = [], // Para 'full_valuation' es el detallado, para 'jr_vc_summary' es el resumen VC
    scorePercentage = 0 // Para 'full_valuation' es el real, para 'jr_vc_summary' es el asumido
  } = calculationResult;

 if (mode === 'jr_vc_summary') {
        return (
            <div className="submission-result jr-vc-summary" style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9', maxWidth: '700px', margin: '20px auto' }}>
                <h2 style={{ textAlign: 'center', color: '#333', borderBottom: '2px solid #3498db', paddingBottom: '10px', marginBottom: '20px' }}>
                    Jr. VC - Preliminary Assessment Summary
                </h2>
                
                {roadmap && roadmap.map((item, index) => (
                    <div key={index} className="roadmap-item-summary" style={{ marginBottom: '25px', paddingBottom: '15px', borderBottom: index < roadmap.length - 1 ? '1px dotted #ccc' : 'none' }}>
                        <h3 style={{ color: '#2c3e50', marginBottom: '8px' }}>{item.title}</h3>
                        {item.rationale && <p style={{ fontStyle: 'italic', color: '#555', marginBottom: '10px', lineHeight: '1.6' }}>{item.rationale}</p>}
                        {item.actionSteps && Array.isArray(item.actionSteps) && (
                            <ul style={{ listStylePosition: 'inside', paddingLeft: '5px', margin: '0' }}>
                                {item.actionSteps.map((step, stepIdx) => <li key={stepIdx} style={{ marginBottom: '6px', lineHeight: '1.6' }}>{step}</li>)}
                            </ul>
                        )}
                    </div>
                ))}
                
                <hr style={{ margin: '25px 0' }}/>

                <div className="jr-vc-actions" style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button 
                        type="button" 
                        onClick={onStartOver} 
                        style={{ ...styles.actionButton, backgroundColor: '#5bc0de', color: 'white', padding: '12px 25px', fontSize: '1.1em' }} // Estilo de ejemplo
                    >
                        Start New VC Assessment
                    </button>
                </div>
            </div>
        );
    }

  if (mode === 'jr_vc_summary_error') {
    return (
        <div className="submission-result error" style={{ padding: '20px', border: '1px solid #e74c3c', borderRadius: '8px', backgroundColor: '#fceded', maxWidth: '700px', margin: '20px auto' }}>
            <h2 style={{color: '#c0392b'}}>Preliminary Analysis Error</h2>
            <p style={{color: '#c0392b'}}>{errorMessage || "An unknown error occurred."}</p>
            <button type="button" onClick={onStartOver} style={{ ...styles.actionButton, backgroundColor: '#7f8c8d', color: 'white', marginTop: '15px', padding: '10px 20px', fontSize: '1em' }}>
                Start New VC Assessment
            </button>
        </div>
    );
  }

  // --- FUNCIÓN FINAL PARA DESCARGAR PDF CON GRÁFICO ---
  const handleDownloadPdfWithChart = async () => {
    if (!hiddenChartRef.current || !calculationResult || !formData) {
        console.error("Missing data or hidden chart ref for PDF generation.");
        if (!hiddenChartRef.current) {
           console.error("Hidden chart container not rendered yet or ref not assigned.");
           alert("Could not generate PDF. Chart container not ready. Please wait a moment and try again.");
           return;
        }
        alert("Could not generate PDF. Required data is missing.");
        return;
    }
    if (isGeneratingPdf) return; // Evitar doble clic

    setIsGeneratingPdf(true);
    console.log("Starting PDF generation...");

    // Opcional: Pequeño retraso para asegurar renderizado
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
        console.log("Attempting to capture hidden chart container:", hiddenChartRef.current);
        // Capturar el gráfico oculto como imagen Data URL
        //const chartImageDataUrl = await toPng(hiddenChartRef.current, {
          const chartImageDataUrl = await toJpeg(hiddenChartRef.current, {
            quality: 0.95,
            pixelRatio: 2, // Mayor resolución
            backgroundColor: 'white', // Fondo blanco explícito
        });
        console.log("Captured Image Data URL (snippet):", chartImageDataUrl ? chartImageDataUrl.substring(0, 100) + '...' : 'Capture Failed!');
        console.log("Hidden chart image captured.");
        console.log("Captured Image Data URL:", chartImageDataUrl);
        // Generar el Blob del PDF usando la imagen
        const pdfBlob = await pdf(
            <ValuationReportPDF
                calculationResult={calculationResult}
                formData={formData}
                chartImage={chartImageDataUrl} // Pasar la imagen al PDF
            />
        ).toBlob();
        console.log("PDF Blob generated.");

        // Crear enlace y simular clic para descargar
        const link = document.createElement('a');
        link.href = URL.createObjectURL(pdfBlob);
        const fileName = `Valuation-Report-${formData?.userEmail || 'summary'}.pdf`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        console.log("PDF Download triggered.");

    } catch (error) {
        console.error("Error generating PDF with chart:", error);
         if (error.message && error.message.includes('foreignObject')) {
             console.error("Potential SVG rendering issue in html-to-image.");
             alert("Error capturing chart image (SVG issue). Please try again or contact support.");
         } else {
            alert(`An error occurred while generating the PDF: ${error.message}`);
         }
    } finally {
        setIsGeneratingPdf(false); // Resetear estado
        console.log("PDF generation process finished.");
    }
  };
  // --- FIN FUNCIÓN DE DESCARGA ---

  // --- FUNCIÓN CORRECTA PARA RENDERIZAR CONTENIDO DE PESTAÑA ---
  const renderTabContent = () => {
      switch (activeTab) {
        case 'snapshot': return <ValuationSnapshot stage={stage} adjEbitda={adjEbitda} baseMultiple={baseMultiple} maxMultiple={maxMultiple} finalMultiple={finalMultiple} estimatedValuation={estimatedValuation} scorePercentage={scorePercentage} />;
        case 'scores': return <ScoreDetails scores={scores} />; // scores aquí son los detallados del modo full
        case 'roadmap': return <RoadmapSection roadmap={roadmap} stage={stage} />; // roadmap aquí es el detallado del modo full
        case 'discuss': return <DiscussTabContent calendlyLink={consultantCalendlyLink} userEmail={userEmail} />;
        default: return <div>Select a tab</div>;
      }
  };M
  // --- FIN renderTabContent ---


   return (
    <div className="submission-result results-display">
      {/* Navegación de Pestañas (SOLO PARA MODO FULL) */}
      <div className="results-tabs-nav" style={styles.tabNav}>
        {FULL_MODE_TABS.map((tab) => ( // <--- CORRECCIÓN AQUÍ
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={activeTab === tab.id ? styles.tabButtonActive : styles.tabButton}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''} ${tab.id === 'discuss' ? 'discuss-tab-button' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="results-tab-content" style={styles.tabContent}>
        {renderTabContent()}
      </div>
      <div ref={hiddenChartRef} style={{ position: 'absolute', left: '-9999px', /*...*/ }} aria-hidden="true">
           {scores && Object.keys(scores).length > 0 && Object.values(scores).some(s => s > 0) && (mode === 'full_valuation' || !mode) ? ( // Asumir !mode es full por defecto
              <ScoreRadarChart scores={scores} />
           ) : null}
      </div>
      <p style={styles.disclaimer}>Disclaimer: This valuation is an estimate...</p>
      <div className="results-actions-footer" style={styles.actionsFooter}>
           {(mode === 'full_valuation' || !mode) && ( // Asumir !mode es full por defecto
             <ResultsCTA onDownloadClick={handleDownloadPdfWithChart} isLoading={isGeneratingPdf} />
           )}
           <button type="button" onClick={onStartOver} className="start-over-button" style={styles.actionButton}>Start Over</button>
           {(mode === 'full_valuation' || !mode) && onBackToEdit && ( // Asumir !mode es full por defecto
             <button type="button" onClick={onBackToEdit} className="back-to-edit-button" style={styles.actionButton}>Back to Edit</button>
           )}
      </div>
    </div>
  );
}

// Estilos (como los tenías, asegúrate que son correctos)
const styles = {
  tabNav: { borderBottom: '1px solid #ccc', marginBottom: '0px', paddingLeft: '10px', display: 'flex', gap: '2px' },
  tabButton: { padding: '10px 15px', cursor: 'pointer', border: '1px solid #ccc', borderBottom: '1px solid #ccc', background: '#eee', borderTopLeftRadius: '5px', borderTopRightRadius: '5px', opacity: 0.7, marginBottom: '-1px', position: 'relative', zIndex: 1, color: '#333', transition: 'background-color 0.2s, color 0.2s' },
  tabButtonActive: { padding: '10px 15px', cursor: 'pointer', border: '1px solid #ccc', borderBottom: '1px solid white', background: 'white', borderTopLeftRadius: '5px', borderTopRightRadius: '5px', fontWeight: 'bold', marginBottom: '-1px', position: 'relative', zIndex: 2, color: '#000000', transition: 'background-color 0.2s, color 0.2s' },
  tabContent: { padding: '20px', border: '1px solid #ccc', borderTop: 'none', borderRadius: '0 0 5px 5px', background: 'white', marginBottom: '20px', minHeight: '200px' },
  disclaimer: { marginTop: '2rem', fontSize: '0.9em', color: '#777', textAlign: 'center' },
  actionsFooter: { textAlign: 'center', marginTop: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' },
  actionButton: { padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1em' }
};

export default ResultsDisplay;