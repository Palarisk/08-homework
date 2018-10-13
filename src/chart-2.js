

import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }
var height = 400 - margin.top - margin.bottom
var width = 780 - margin.left - margin.right

// At the very least you'll need scales, and
// you'll need to read in the file. And you'll need
// and svg, too, probably.

var svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var pie = d3.pie().value(function(d) {
  return d.minutes
})

var radius = 80

var arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius)

var colorScale = d3.scaleOrdinal().range(['#99FFCC', '#CCCCFF', '#FFB266'])

var xPositionScale = d3
  .scalePoint()
  .range([margin.left * 2, width - margin.left - margin.right])

d3.csv(require('./data/time-breakdown-all.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  // onks tässä oikein toi d.project?) vai pitääks olla nested

  var projects = datapoints.map(d => d.project)
  xPositionScale.domain(projects)

  var nested = d3
    .nest()
    .key(function(d) {
      return d.project
    })
    .entries(datapoints)

  var container = svg.append('g')

  container
    .selectAll('path')
    .data(pie(nested))
    .enter()
    .append('g')
    // .attr('d', d => arc(d))
    // .attr('fill', d => colorScale(d.data.task))
    .attr('transform', function(d) {
      // console.log(d.data.key)
      return `translate(${xPositionScale(d.data.key)}, ${height / 2})`
    })

    .each(function(d) {
      // which svg are we looking at?
      var svg = d3.select(this)
    // console.log(d)

      svg
        .selectAll('path')
        .data(pie(d.data.values))
        .enter()
        .append('path')
        .attr('d', d => arc(d))
        .attr('fill', d => colorScale(d.data.task))

      svg
        .append('text')
        .text(d.data.key)
        .attr('x', 0)
        .attr('y', 110)
        .attr('font-size', 12)
        .attr('text-anchor', 'middle')


    })
}
