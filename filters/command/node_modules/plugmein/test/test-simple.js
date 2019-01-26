var plugmein = require('../src/plugmein');
plugmein = plugmein().plug([require('./pp_chain.js')]);

const population = [
  { "sex": "male", "age": 35, "eyes": "brown" },
  { "sex": "female", "age": 38, "eyes": "brown" },
  { "sex": "male", "age": 29, "eyes": "brown" },
  { "sex": "female", "age": 19, "eyes": "blue" },
  { "sex": "male", "age": 31, "eyes": "blue" },
  { "sex": "female", "age": 22, "eyes": "brown" },
  { "sex": "male", "age": 22, "eyes": "blue" },
  { "sex": "female", "age": 33, "eyes": "blue" }
];

var test = plugmein()
    .filter('eyes', 'brown')
    .groupBy('sex')
    .chain()
    .data(population)

console.log(test);
