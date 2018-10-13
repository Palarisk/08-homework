import * as d3 from 'd3'

var margin = { top: 0, left: 0, right: 0, bottom: 0 }
var height = 600 - margin.top - margin.bottom
var width = 600 - margin.left - margin.right

var svg = d3
  .select('#chart-7')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let radius = 200

let radiusScale = d3
  .scaleLinear()
  .domain([0, 90000])
  .range([0, radius])

var angleScale = d3.scaleBand().range([0, Math.PI * 2])

var line = d3
  .radialArea()
  .innerRadius(radiusScale(40000))
  .outerRadius(d => radiusScale(d.total))
  .angle(d => angleScale(d.time))

let colorScaleAbove = d3
  .scaleSequential(d3.interpolateYlOrBr)
  .domain([20000, 90000])
//  .range(['blue', 'red'])

let colorScaleBelow = d3
  .scaleSequential(d3.interpolateYlGnBu)
  .domain([50000, 20000])

/*
var colorScale = d3
  .scaleLinear()
  .domain([10000, 90000])
  .range(['blue', 'red'])
*/

d3.csv(require('./data/time-binned.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  datapoints.push(datapoints[0])

  var hours = datapoints.map(d => d.time)
  angleScale.domain(hours)

  var holder = svg
    .append('g')
    // .attr('transform', 'translate(200,200)')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  var times = [
    '00:00',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00'
  ]

  holder
    .selectAll('.angle-text')
    .data(times)
    .enter()
    .append('text')
    // .text(d => d.replace(':00', ''))
    .text(function(d) {
      if (d === '00:00') {
        return 'Midnight'
      } else {
        return d.replace(':00', '')
      }
    })
    .attr('text-anchor', 'middle')
    .attr('font-size', '8')
    .attr('fill', 'grey')
    .attr('x', 0)
    .attr('y', -radiusScale(50000))
    .attr('transform', d => {
      return `rotate(${(angleScale(d) / Math.PI) * 180})`
    })

  holder
    .selectAll('.smallcircle')
    .data(times)
    .enter()
    .append('circle')
    .attr('r', 2.5)
    .attr('stroke', 'white')
    .attr('fill', 'grey')
    .attr('cx', 0)
    .attr('cy', -radiusScale(55000))
    .attr('transform', d => {
      return `rotate(${(angleScale(d) / Math.PI) * 180})`
    })
    .lower()

  holder
    .append('circle')
    .attr('r', radiusScale(55000))
    .attr('fill', 'none')
    .attr('stroke', 'grey')
    .lower()

  holder
    .append('mask')
    .attr('id', 'births')
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'white')
  // .attr('stroke', 'yellow')

  let bands = d3.range(0, 90000, 2000)

  holder
    .append('g')
    .attr('mask', 'url(#births)')
    .selectAll('.scale-band')
    .data(bands)
    .enter()
    .append('circle')
    .attr('r', d => radiusScale(d))
    .attr('fill', function(d) {
      if (d <= 40000) {
        return colorScaleBelow(d)
      } else {
        return colorScaleAbove(d)
      }
    })
    .attr('stroke', 'none')
    .attr('cx', 0)
    .attr('cy', 0)
    .lower()

  holder
    .append('text')
    .text('Everyone')
    .attr('text-anchor', 'middle')
    .attr('font-size', 20)
    .attr('y', -15)

  holder
    .append('text')
    .text('is born at 8am')
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)

  holder
    .append('text')
    .text('(read Macbeth for details)')
    .attr('text-anchor', 'middle')
    .attr('font-size', 9)
    .attr('y', 15)
  /*
  holder
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'black')
    .attr('stroke', 'yellow')
*/
}
