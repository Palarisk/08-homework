// COLORS & LABELS

import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }
var height = 400 - margin.top - margin.bottom
var width = 1080 - margin.left - margin.right

var svg = d3
  .select('#chart-3c')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var xPositionScale = d3
  .scalePoint()
  .range([margin.left * 2, width - margin.left - margin.right])

let radius = 80

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
  .innerRadius(d => radiusScale(d.low_temp))
  .outerRadius(d => radiusScale(d.high_temp))
  .startAngle(d => angleScale(d.month_name))
  .endAngle(d => angleScale(d.month_name) + angleScale.bandwidth())

var colorScale = d3
  .scaleLinear()
  .domain([0, 100])
  .range(['pink', 'purple'])

d3.csv(require('./data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  var nested = d3
    .nest()
    .key(function(d) {
      return d.city
    })
    .entries(datapoints)

  var cities = nested.map(d => d.key)
  xPositionScale.domain(cities)

  var container = svg.append('g')

  container
    .selectAll('path')
    .data(nested)
    .enter()
    .append('g')
    // .attr('d', d => arc(d))
    // .attr('fill', d => colorScale(d.data.task))
    .attr('transform', function(d) {
      // console.log(d.data.key)
      return `translate(${xPositionScale(d.key)}, ${height / 2})`
    })

console.log("outside selectthis:",nested)

    .each(function(d) {
      // which svg are we looking at?
      var svg = d3.select(this)
      // console.log(d)

      svg
        .selectAll('.temp_bars')
        .data(d.values)
        .enter()
        .append('path')
        .attr('d', d => arc(d))
        .attr('fill', colorScale(datapoints.high_temp))

        console.log("different cities & temp data:",nested)

      svg
        .datum(datapoints)
        .enter()
        .append('text')
    })
}
