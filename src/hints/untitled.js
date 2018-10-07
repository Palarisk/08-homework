import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }
var height = 400 - margin.top - margin.bottom
var width = 780 - margin.left - margin.right

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

var radius = 100

var arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius)

var xPositionScale = d3.scalePoint().range([0, width])

var colorScale = d3.scaleOrdinal().range(['#99FFCC', '#CCCCFF', '#FFB266'])

d3.csv(require('./data/time-breakdown-all.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  var container = svg.append('g') // .attr('transform', 'translate(200,200)')

  var nested = d3
    .nest()
    .key(d => d.project)
    .entries(datapoints)
  console.log(nested)
  console.log(nested.key)
    

  var projects = nested.map(d => d.project)

  xPositionScale.domain(projects)

  container
    .selectAll('path')
    .data(pie(nested))
    .enter()
    .append('g')
    .attr('transform', function(d) {
      // console.log(d.key)
      return `translate(${xPositionScale(d.key)}, 200)`
    })

    /*
    .attr(
      'transform', 'translate'
      function(d) {
        return xPositionScale(d.key)
      },
      200
    ) */
    /*
      'translate (${xPositionScale(d.project)})

    .attr('transform','translate(' + function(d) {
          return xPositionScale(d.project)
          } 
      + , 200 +')')

      */
    // .attr('transform','translate(200,200)')
    // .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    /*
    .attr(
      'transform',
      'translate(200, ' +
        function(d) {
          return xPositionScale(d.project) + ')'
        }
    )
*/
    .each(function(d) {
      // which svg are we looking at?
      var svg = d3.select(this)

      svg
        .selectAll('path')
        .data(pie(nested))
        .enter()
        .append('path')
        .attr('d', d => arc(d))
        .attr('fill', d => colorScale(d.data.task))
        .attr('cx', function(d) {
          return xPositionScale(d.data.project)
        })
        .attr('d', d => arc(d))
        .attr('fill', d => colorScale(d.data.task))
    })
  /*
      svg
        .append('path')
        .attr('d', d => arc(d))
        .attr('fill', d => colorScale(d.data.task))
      console.log(pie(nested))
  
  */

  /*
  container
    .selectAll('.scale-text')
    .data(pie(datapoints))
    .enter()
    .append('text')
    .text(d => d.data.task)
    */
}
