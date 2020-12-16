import React, { Component } from 'react';

import './styles.css';
import data from './data.js';

import BarChart from './BarChart';
import LayeredBarChart from './LayeredBarChart';

class App extends Component {
  render() {
    return (
      <div className="app-header">
        <div>Visualizations</div>
        <BarChart />
        <LayeredBarChart />
      </div>
    );
  }
}

export default App;
