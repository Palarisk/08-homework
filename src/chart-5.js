import * as d3 from 'd3'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }

var height = 450 - margin.top - margin.bottom

var width = 1080 - margin.left - margin.right

var svg = d3
  .select('#chart-5')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var xPositionScale = d3
  .scalePoint()
  .range([margin.left * 2, width - margin.left - margin.right])

let radius = 65

let radiusScale = d3
  .scaleLinear()
  .domain([-60, 70])
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

var line = d3
  .radialArea()
  .innerRadius(d => radiusScale(d.low_temp))
  .outerRadius(d => radiusScale(d.high_temp))
  .angle(d => angleScale(d.month_name))
  .curve(d3.curveBasis)

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
    .attr('transform', function(d) {
      // console.log(d.data.key)
      return `translate(${xPositionScale(d.key)}, ${height / 2})`
    })

    .each(function(d) {
      // which svg are we looking at?

      d.values.push(d.values[0])

      var holder = d3.select(this)
      //console.log(d)

      //console.log(nested)
      //console.log(d.values)

      holder
        .append('path')
        .datum(d.values)
        .attr('d', line)
        // .attr('fill', 'rgba(255, 0, 0, 0.5)')
        .attr('fill', 'salmon')
        .attr('opacity', 0.5)
        .attr('stroke', 'none')

      let bands = [20, 40, 60, 80, 100]

      holder
        .selectAll('.scale-band')
        .data(bands)
        .enter()
        .append('circle')
        .attr('r', d => radiusScale(d))
        .attr('fill', 'none')
        .attr('stroke', 'lightgrey')
        .attr('cx', 0)
        .attr('cy', 0)
        .lower()

      let bandsText = [20, 60, 100]

      holder
        .selectAll('.scale-text')
        .data(bandsText)
        .enter()
        .append('text')
        .text(d => d + '°')
        .attr('text-anchor', 'middle')
        .attr('x', 0)
        .attr('y', d => -radiusScale(d))
        .attr('dy', -1)
        .attr('font-size', 8)

      holder
        .append('text')
        .text(d.key)
        .attr('text-anchor', 'middle')
        .attr('y', 6)
        .attr('font-size', 14)
        .attr('font-weight', '600')
    })
}
