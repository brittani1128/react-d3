import React, { Component } from 'react';
import * as d3 from 'd3';
import './styles.css';

class BarChart extends Component {
  constructor() {
    super();
    this.state = {
      country: '',
    };
  }

  componentDidMount() {
    this.drawChart();
  }

  drawChart() {
    const w = 700;
    const h = 400;
    const margin = { top: 20, right: 20, bottom: 100, left: 100 };
    const padding = 50;
    const graphWidth = w - margin.left - margin.right;
    const graphHeight = h - margin.top - margin.bottom;

    // const { data } = this.props;

    // CHART -----------------------

    const svg = d3
      .select(this.refs.chart)
      .append('svg')
      .attr('width', w)
      .attr('height', h);

    const graph = svg
      .append('g')
      .attr('width', graphWidth)
      .attr('height', graphHeight)
      .attr('class', 'graph-area')
      .attr('transform', `translate(${margin.left + padding}, ${margin.top})`);

    const gXAxis = graph
      .append('g')
      .attr('transform', `translate(0, ${graphHeight})`);

    const gYAxis = graph.append('g');

    // SCALES ----------------------

    d3.csv('./data/co2-emissions.csv').then((co2Data) => {
      const usData = co2Data[0];
      const worldData = co2Data[1];

      const dataMap = new Map(Object.entries(usData));
      const name = dataMap.get('Country Name');
      this.setState({ country: name });

      const data = [];
      dataMap.forEach((v, k) => {
        if (!isNaN(k) && !(k % 2) && !!v) {
          data.push({
            date: k,
            value: v,
          });
        }
      });

      const y = d3
        .scaleLinear()
        .domain([
          d3.min(data, (d) => d.value) - 200000,
          d3.max(data, (d) => d.value),
        ])
        .range([graphHeight, 0]);
      const x = d3
        .scaleBand()
        .domain(data.map((d) => d.date))
        .range([0, 500])
        .paddingInner(0.2)
        .paddingOuter(0.2);

      // BARS ------------------------

      const rects = graph.selectAll('rect').data(data);
      rects
        .enter()
        .append('rect')
        .attr('class', 'single-bar')
        .attr('fill', 'navy')
        .attr('x', (d, i) => x(d.date))
        .attr('y', (d, i) => y(d.value))
        .attr('width', 15)
        .attr('height', (d) => graphHeight - y(d.value))
        .append('title')
        .text((d) => d.value);

      // AXES ------------------------

      const xAxis = d3.axisBottom(x);
      const yAxis = d3.axisLeft(y).ticks(15);

      gXAxis.call(xAxis);
      gYAxis.call(yAxis);
      gXAxis
        .selectAll('text')
        .attr('transform', 'translate(17,15)rotate(60)')
        .style('font-size', 14);
      gYAxis.selectAll('text').style('font-size', 14);
    });

    svg
      .append('text')
      .attr('class', 'axis-label')
      .attr('x', w / 2 + padding)
      .attr('y', h)
      .style('text-anchor', 'middle')
      .text('Year');

    svg
      .append('text')
      .attr('class', 'axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('y', margin.right)
      .attr('x', 0 - h / 2 + padding)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Value');
  }

  render() {
    const styles = {
      container: {
        display: 'grid',
        justifyItems: 'center',
      },
    };
    return (
      <div ref="chart" style={styles.container}>
        <h1
          style={{ textAlign: 'center' }}
          className="chart-title"
        >{`CO2 Emissions for ${this.state.country}`}</h1>
      </div>
    );
  }
}

export default BarChart;
