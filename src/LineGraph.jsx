import React, { Component } from 'react';
import * as d3 from 'd3';
import './styles.css';

class LineGraph extends Component {
  constructor() {
    super();
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

    // SCALES ----------------------

    const yScale = d3
      .scaleLinear()
      // .domain([0, 6000000]) // calculate domain
      .range([graphHeight, 0]);
    const xScale = d3
      .scaleTime()
      // .domain(data.map((d) => d.date))
      .range([0, graphWidth - 50]);

    // AXES ------------------------

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // LINES -----------------------
    var line = d3
      .line()
      .curve(d3.curveMonotoneX)
      .x((d) => xScale(d['date']))
      .y((d) => yScale(d['concentration']));

    d3.csv('./data/arctic-sea-ice-extent.csv').then((data) => {
      console.log({ data });
      // dataMap.forEach((v, k) => {
      //   if (!isNaN(k) && !(k % 2) && !!v) {
      //     data.push({
      //       date: k,
      //       value: v,
      //     });
      //   }
      // });

      // LINES ------------------------

      // AXES ------------------------

      // const gXAxis = graph
      //   .append('g')
      //   .attr('transform', `translate(0, ${graphHeight})`);
      // const gYAxis = graph.append('g');

      // gXAxis.call(xAxis);
      // gYAxis.call(yAxis);
      // gXAxis
      //   .selectAll('text')
      //   .attr('transform', 'translate(17,15)rotate(60)')
      //   .style('font-size', 14);
      // gYAxis.selectAll('text').style('font-size', 14);
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
        margin: '20px',
      },
    };
    return (
      <div ref="chart" style={styles.container} id="container">
        <h1 style={{ textAlign: 'center' }} className="chart-title">
          Arctic Sea Ice Extent
        </h1>
      </div>
    );
  }
}

export default LineGraph;
