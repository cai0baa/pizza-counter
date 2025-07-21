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

<div className="bg-red-500 text-white p-10">
  If this is a red box with white text, Tailwind works!
</div>


export default App;
