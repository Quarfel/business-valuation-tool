// src/components/Step.jsx
import React, { useState, useEffect } from 'react';
// Assuming naicsData is one level up from components folder
import { getSubSectors } from '../naicsData';

function Step({ stepIndex, questions, formData, handleChange, sectionTitle }) {

  // State for dependent dropdown options
  const [dependentOptions, setDependentOptions] = useState({});

  // Effect to update dependent dropdowns when their dependency changes
  useEffect(() => {
    questions.forEach(q => {
      if (q.type === 'select_dependent') {
        const dependencyValue = formData[q.dependsOn];
        if (dependencyValue) {
          // Call the optionsGetter, which should return an array of names
          const options = q.optionsGetter(dependencyValue);
          setDependentOptions(prev => ({ ...prev, [q.id]: options }));
        } else {
          // Clear options if dependency is cleared
          setDependentOptions(prev => ({ ...prev, [q.id]: [] }));
        }
      }
    });
  }, [formData, questions]); // Re-run when formData or the questions for this step change

  // Handle case with no questions
  if (!questions || questions.length === 0) {
    return (
        <div className="step">
            <h2>{sectionTitle || `Step ${stepIndex + 1}`}</h2>
            <p>No questions configured for this section.</p>
            {/* Add specific content for the final step if needed */}
            {stepIndex === sections.length -1 && <p>Review your answers or prepare to submit.</p>}
        </div>
    );
  }

  // Render the step with questions
  return (
    <div className="step">
      <h2>{sectionTitle}</h2>
      {questions.map((q) => (
        <div key={q.id} className="question">
          {/* Render the question text as a label */}
          <label htmlFor={q.valueKey}>{q.text}</label>

          {/* Conditional Rendering based on Question Type */}

          {/* MCQ (Multiple Choice Question) */}
          {q.type === 'mcq' && (
            <div className="options">
              {q.options.map((option, index) => (
                <div key={index} className="option">
                  <input
                    type="radio"
                    id={`${q.valueKey}-${index}`} // Use valueKey for unique ID part
                    name={q.valueKey} // Group radios by valueKey
                    value={option.text} // The value sent on change
                    checked={formData[q.valueKey] === option.text} // Check if this option is selected
                    onChange={handleChange}
                    required // Basic browser validation
                  />
                  {/* Associate label with the radio button */}
                  <label htmlFor={`${q.valueKey}-${index}`}>{option.text}</label>
                </div>
              ))}
            </div>
          )}

          {/* Number Input */}
          {q.type === 'number' && (
            <input
              type="number"
              id={q.valueKey} // Use valueKey for ID and name
              name={q.valueKey}
              value={formData[q.valueKey] || ''} // Handle null/undefined state
              onChange={handleChange}
              placeholder={q.placeholder || 'Enter a number'}
              required
              className="number-input" // Apply specific styling if needed
            />
          )}

          {/* --- NEW: Email Input Handling --- */}
          {q.type === 'email' && (
            <input
              type="email" // Use HTML email type for basic browser validation/hints
              id={q.valueKey} // Use valueKey for ID and name
              name={q.valueKey}
              value={formData[q.valueKey] || ''} // Handle null/undefined state
              onChange={handleChange}
              placeholder={q.placeholder || 'Enter email'}
              required // Make email required
              className="email-input" // Apply specific styling if needed
              autoComplete="email" // Help browser autofill
            />
          )}
          {/* --- End Email Input --- */}


          {/* Standard Select (Dropdown) */}
          {q.type === 'select' && (
            <select
                id={q.valueKey} // Use valueKey
                name={q.valueKey}
                value={formData[q.valueKey] || ''}
                onChange={handleChange}
                required
                className="select-input"
            >
                <option value="" disabled>-- Select an option --</option>
                {/* q.options here is expected to be an array of strings */}
                {q.options.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                ))}
            </select>
          )}

         {/* Dependent Select (Dropdown) */}
          {q.type === 'select_dependent' && (
             <select
                 id={q.valueKey} // Use valueKey
                 name={q.valueKey}
                 value={formData[q.valueKey] || ''}
                 onChange={handleChange}
                 required
                 className="select-input"
                 // Disable if the dependency isn't selected yet
                 disabled={!formData[q.dependsOn]}
             >
                 <option value="" disabled>
                     {/* Provide helpful placeholder text */}
                     {!formData[q.dependsOn] ? `-- Select ${q.dependsOn.replace('naics','')} first --` : '-- Select an option --'}
                 </option>
                 {/* dependentOptions[q.id] should be an array of strings (names) */}
                 {(dependentOptions[q.id] || []).map((optionName, index) => (
                     <option key={index} value={optionName}>{optionName}</option>
                 ))}
             </select>
           )}

          {/* Add other input type handlers here if needed (e.g., textarea, checkbox) */}

        </div>
      ))}
    </div>
  );
}

export default Step;