// src/components/ProgressIndicator.jsx
import React from 'react';

function ProgressIndicator({ currentStep, totalSteps, sections }) {
  const progressPercentage = ((currentStep) / totalSteps) * 100;

  return (
    <div className="progress-indicator">
       <p>Step {currentStep} of {totalSteps}: <strong>{sections[currentStep-1]}</strong></p>
      <div className="progress-bar-container">
        <div
          className="progress-bar"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
}

export default ProgressIndicator;