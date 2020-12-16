import React, { Component } from 'react';
import * as d3 from 'd3';
import './styles.css';

class LayeredBarChart extends Component {
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
    const w = 900;
    const h = 600;
    const margin = { top: 20, right: 20, bottom: 100, left: 100 };
    const padding = 50;
    const graphWidth = w - margin.left - margin.right;
    const graphHeight = h - margin.top - margin.bottom;

    // CHART -----------------------

    const svg = d3
      .select(this.refs.chart)
      .append('svg')
      .attr('width', w)
      .attr('height', h);

    const svgContainer = d3.select('#container');

    const graph = svg
      .append('g')
      .attr('width', graphWidth)
      .attr('height', graphHeight)
      .attr('class', 'graph-area')
      .attr('transform', `translate(${margin.left + padding}, ${margin.top})`);

    // d3.csv('./data/co2-emissions.csv').then((co2Data) => {
    //   const usData = co2Data[0];
    //   const worldData = co2Data[1];

    //   const dataMap = new Map(Object.entries(usData));
    //   const name = dataMap.get('Country Name');
    //   this.setState({ country: name });

    //   const data = [];
    //   dataMap.forEach((v, k) => {
    //     if (!isNaN(k) && !(k % 2) && !!v) {
    //       data.push({
    //         date: k,
    //         value: v,
    //       });
    //     }
    //   });
    d3.csv('./data/global-greenhouse-gas-emissions.csv').then((data) => {
      const [carbonDioxide, methane, nitrousOxide, other] = [
        'Carbon dioxide',
        'Methane',
        'Nitrous oxide',
        'HFCs, PFCs, and SF6',
      ];

      const stack = d3
        .stack()
        .keys([carbonDioxide, methane, nitrousOxide, other])
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);
      const stackedSeries = stack(data);

      // SCALES ----------------------

      const yScale = d3
        .scaleLinear()
        .domain([0, 50000])
        .range([graphHeight, 0]);
      const xScale = d3
        .scaleTime()
        .domain([data[0].Year, data[data.length - 1].Year])
        .range([50, 550]);
      const colorScale = d3
        .scaleOrdinal()
        .domain([carbonDioxide, methane, nitrousOxide, other])
        .range(['#03989e', '#00bfc6', '#7adad2', '#83cbcf']);

      const makeYLines = () => d3.axisLeft().scale(yScale);
      graph
        .append('g')
        .attr('class', 'grid')
        .call(makeYLines().tickSize(-w, 0, 0).tickFormat(''));

      // BARS ------------------------

      var sel = graph
        .select('g')
        .selectAll('g.series')
        .data(stackedSeries)
        .join('g')
        .attr('class', 'series')
        .style('fill', (d) => colorScale(d.key));

      sel
        .selectAll('rect')
        .data((d) => d)
        .join('rect')
        .attr('width', 70)
        .attr('y', (d) => yScale(d[1]))
        .attr('x', (d) => xScale(d.data.Year) - 20)
        .attr('height', (d) => yScale(d[0]) - yScale(d[1]));

      // AXES ------------------------

      const gXAxis = graph
        .append('g')
        .attr('transform', `translate(0, ${graphHeight})`);
      const gYAxis = graph.append('g');

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale).ticks(10);

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
      .attr('y', h - margin.top)
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
      .text('CO2 Emissions (kt)');
  }

  render() {
    const styles = {
      container: {
        display: 'grid',
        justifyItems: 'center',
      },
    };
    return (
      <div ref="chart" style={styles.container} id="container">
        <h1
          style={{ textAlign: 'center' }}
          className="chart-title"
        >{`CO2 Emissions for ${this.state.country}`}</h1>
      </div>
    );
  }
}

export default LayeredBarChart;
