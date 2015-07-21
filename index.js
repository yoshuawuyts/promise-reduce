const assert  = require('assert')
const Promise = require('any-promise')

module.exports = reduce

// Apply a function to all values.
// @param {Mixed|Mixed[]} val
// @param {Mixed} ctx
// @return {Function}
function reduce(fn, start) {
  assert.equal(typeof fn, 'function')
  return function(val) {
    val = Array.isArray(val) ? val : [val]
    return val.reduce(function (promise, curr) {
      return promise.then(function (prev) {
        return fn(prev, curr)
      })
    }, Promise.resolve(start))
  }
}
