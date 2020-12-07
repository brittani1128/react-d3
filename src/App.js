import React, { Component } from 'react';

import './styles.css';
import data from './data.js';

import BarChart from './BarChart';

class App extends Component {
  render() {
    return (
      <div className="app-header">
        <div>Visualizations</div>
        <BarChart data={data} />
      </div>
    );
  }
}

export default App;
