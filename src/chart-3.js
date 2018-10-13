// COLORS & TITLE & KESKIPISTE

import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }
var height = 400 - margin.top - margin.bottom
var width = 780 - margin.left - margin.right

var svg = d3
  .select('#chart-3')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let radius = 100

let radiusScale = d3
  .scaleLinear()
  .domain([0, 85])
  .range([0, radius])

let months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec'
]

var angleScale = d3
  .scaleBand()
  .domain(months)
  .range([0, Math.PI * 2])

var arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(d => radiusScale(d.high_temp))
  .startAngle(d => angleScale(d.month_name))
  .endAngle(d => angleScale(d.month_name) + angleScale.bandwidth())

var colorScale = d3
  .scaleLinear()
  .domain([30, 100])
  .range(['lightblue', 'pink'])


d3.csv(require('./data/ny-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  datapoints.push(datapoints[0])

  // console.log(datapoints)

  var holder = svg
    .append('g')
    // .attr('transform', 'translate(200,200)')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  holder
    .selectAll('path')
    .data(datapoints)
    .enter()
    .append('path')
    .attr('d', d => arc(d))
    .attr('fill', d => colorScale(d.high_temp))
  //  console.log(datapoints)

   holder
    .append('text')
    .text('NYC high temperatures, by month')
    .attr('text-anchor', 'middle')
    .attr('y', -80)
    .attr('font-size', 22)
    .attr("font-weight", "600")

holder
    .append('circle')
    .attr('r', 2)
}
