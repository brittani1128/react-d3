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
        .domain([+data[0].Year, +data[data.length - 1].Year])
        .range([50, 650]);

      const colorScale = d3
        .scaleOrdinal()
        .domain([carbonDioxide, methane, nitrousOxide, other])
        .range(['#23999d', '#00bfc6', '#8bd7da', '#c2e8eb']);

      const makeYLines = () => d3.axisLeft().scale(yScale);
      graph
        .append('g')
        .attr('class', 'grid')
        .call(
          makeYLines()
            .tickSize(-(graphWidth - 40), 0, 0)
            .tickFormat('')
        );

      // AXES ------------------------

      const gYAxis = graph.append('g');
      const gXAxis = graph
        .append('g')
        .attr('transform', `translate(0, ${graphHeight})`);

      const xAxis = d3.axisBottom(xScale).ticks(6).tickFormat(d3.format('d'));
      const yAxis = d3.axisLeft(yScale).ticks(5);

      gXAxis.call(xAxis);
      gYAxis.call(yAxis);

      gXAxis
        .selectAll('text')
        .attr('transform', 'translate(0,5)')
        .style('font-size', 14);
      gYAxis.selectAll('text').style('font-size', 14);

      // BARS ------------------------

      const bars = graph
        .select('g')
        .selectAll('g.series')
        .data(stackedSeries)
        .join('g')
        .attr('class', 'series')
        .style('fill', (d) => colorScale(d.key));

      bars
        .selectAll('rect')
        .data((d) => d)
        .join('rect')
        .attr('width', 80)
        .attr('y', (d) => yScale(d[1]))
        .attr('x', (d) => xScale(d.data.Year) - 35)
        .attr('height', (d) => yScale(d[0]) - yScale(d[1]))
        .on('mouseover', () => tooltip.style('display', null))
        .on('mouseout', () => tooltip.style('display', 'none'))
        .on('mousemove', (event) => {
          const xPosition = d3.pointer(event)[0] + 130;
          const yPosition = d3.pointer(event)[1] - 10;
          tooltip.attr(
            'transform',
            'translate(' + xPosition + ',' + yPosition + ')'
          );
          tooltip.select('text').text(event.y);
        });
    });

    // AXIS LABELS ------------------------
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
      .text('Emissions (million metric tons)');

    // TOOLTIP ------------------------

    const tooltip = svg
      .append('g')
      .attr('class', 'tooltip')
      .style('display', 'none');

    tooltip
      .append('rect')
      .attr('width', 30)
      .attr('height', 20)
      .attr('fill', 'white')
      .style('opacity', 0.5);

    tooltip
      .append('text')
      .attr('x', 15)
      .attr('dy', '1.2em')
      .style('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold');
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
        <h1 style={{ textAlign: 'center' }} className="chart-title">
          Global Greenhouse Gas Emissions by Gas
        </h1>
      </div>
    );
  }
}

export default LayeredBarChart;
