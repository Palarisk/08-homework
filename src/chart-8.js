// UNDER CONSTRUCTION

import * as d3 from 'd3'

let margin = { top: 20, left: 0, right: 0, bottom: 0 }
let height = 450 - margin.top - margin.bottom
let width = 400 - margin.left - margin.right

let svg = d3
  .select('#chart-8')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

d3.csv(require('./data/nba.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))



function ready(datapoints) {
let player = datapoints[0]

console.log(datapoints)



let customDatapoints = [
  { name: 'name', value: d.values.Name },
  { name: 'team', value: d.Team },
  { name: 'height', value: d.height },
  { name: 'age', value: d.age },
  { name: 'weight', value: d.weight },
  { name: 'height', value: d.height },
  { name: 'age', value: d.age },
  { name: 'weight', value: d.weight },
  { name: 'height', value: d.height },
  { name: 'age', value: d.age },
  { name: 'weight', value: d.weight },
  { name: 'height', value: d.height },
]

}
