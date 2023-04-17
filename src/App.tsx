import React from 'react';
import './App.css';
import { Todos } from './features/todos/components/Todos';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Todos />
      </header>
    </div>
  );
}

export default App;