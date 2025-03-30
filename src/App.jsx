// src/App.jsx
import React from 'react';
import MultiStepForm from './components/MultiStepForm'; // Ensure this path is correct
import './App.css'; // Keep or adjust default styling import

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Business Valuation Questionnaire</h1>
      </header>
      <main>
        <MultiStepForm />
      </main>
      <footer>
        {/* Add footer content if needed */}
      </footer>
    </div>
  );
}

export default App;
