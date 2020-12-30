import React, { Component } from 'react';

import './styles.css';
import data from './data.js';

import BarChart from './BarChart';
import LayeredBarChart from './LayeredBarChart';
import LineGraph from './LineGraph';

class App extends Component {
  render() {
    return (
      <div className="app-header">
        <div>Visualizations</div>
        <BarChart />
        <LayeredBarChart />
        <LineGraph />
      </div>
    );
  }
}

export default App;
