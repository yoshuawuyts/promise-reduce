const test    = require('tape')
const reduce     = require('./')
const Promise = require('native-or-bluebird')

test('promise-reduce should assert input types', function(t) {
  t.plan(1)
  t.throws(reduce.bind(null, 123))
})

test('promise-reduce should reduce a fn', function(t) {
  t.plan(1)
  const res = Promise.resolve([1, 2, 3])
    .then(reduce(reduceFn, 0))
    .then(checkFn)
    .catch(handleErr)

  function reduceFn(prev, next) {
    return prev + next
  }

  function checkFn(val) {
    t.equal(6, val)
  }

  function handleErr() {
    t.fail('catch')
  }
})
