// src/components/Navigation.jsx
import React from 'react';

function Navigation({ currentStep, totalSteps, onPrevious, onNext, isSubmitting }) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="navigation-buttons">
      <button
        type="button"
        onClick={onPrevious}
        disabled={isFirstStep || isSubmitting}
      >
        Previous
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : (isLastStep ? 'Submit' : 'Next')}
      </button>
    </div>
  );
}

export default Navigation;