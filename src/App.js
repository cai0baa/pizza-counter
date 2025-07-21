import React from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import PizzaCounter from './PizzaCounter';

function App() {
  return (
    <ErrorBoundary>
      <PizzaCounter />
    </ErrorBoundary>
  );
}

export default App;
