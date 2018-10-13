

import * as d3 from 'd3'

let margin = { top: 20, left: 0, right: 0, bottom: 0 }
let height = 400 - margin.top - margin.bottom
let width = 400 - margin.left - margin.right

let svg = d3
  .select('#chart-6')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let radius = 100

let radiusScale = d3
  .scaleLinear()
  .domain([0, 5])
  .range([0, radius])


let categories = ['Food', 'Service', 'Atmosphere', 'Price', 'Trendiness']

var angleScale = d3
  .scaleBand()
  .domain(categories)
  .range([0, Math.PI * 2])

var line = d3
  .radialLine()
  .radius(d => radiusScale(d.score))
  .angle(d => angleScale(d.category))

d3.csv(require('./data/ratings.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  datapoints.push(datapoints[0])

 console.log(datapoints)

  var holder = svg
    .append('g')
    // .attr('transform', 'translate(200,200)')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  holder
    .append('path')
    .datum(datapoints)
    .attr('d', line)
    .attr('fill', 'pink')
    .attr('opacity', 0.5)
    .attr('stroke', 'black')

  let bands = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]

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

  holder
    .selectAll('.sectorLine')
    .data(angleScale.domain())
    .enter()
    .append('line')
    .attr('stroke', 'lightgrey')
    .attr('x1', 0)
    .attr('y1', 0)
    .lower()
    .attr('x2', d => {
      let r = radiusScale(5)
      let a = angleScale(d)

      return Math.sin(a) * r
    })
    .attr('y2', d => {
      let r = radiusScale(5)
      let a = angleScale(d)

      return Math.cos(a) * r * -1
    })

  holder
    .selectAll('.sectortext')
    .data(angleScale.domain())
    .enter()
    .append('text')
    //.attr('stroke', 'lightgrey')
    //.attr('x1', 0)
    //.attr('y1', 0)
    //.lower()
    .text(d => d)
    .attr('text-anchor', 'middle')
    .attr('x', 0)
    .attr('y', -radiusScale(5))
    .attr('transform', d=>{
      return `rotate(${angleScale(d) /Math.PI * 180 })`
    })
    /*
    .attr('x', d => {
      let r = radiusScale(5)
      let a = angleScale(d)

      return Math.sin(a) * r
    })
    .attr('y', d => {
      let r = radiusScale(5)
      let a = angleScale(d)

      return Math.cos(a) * r * -1
    })  
    */




}
