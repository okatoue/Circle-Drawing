import React from 'react';
import './App.css';
import CircleDrawer from './circledrawer/components/CircleDrawer';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Circle Drawer</h1>
        <p>Draw circles with adjustable diameters</p>
      </header>
      <CircleDrawer />
    </div>
  );
}

export default App;
