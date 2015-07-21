const test    = require('tape')
const reduce     = require('./')
const Promise = require('any-promise')

test('promise-reduce should assert input types', function (t) {
  t.plan(1)
  t.throws(reduce.bind(null, 123))
})

test('promise-reuduce should accept a single val', function (t) {
  t.plan(1)

  const res = Promise.resolve(2)
    .then(reduce(reduceFn, 3))
    .then(checkFn)

  function reduceFn(prev, next) {
    return prev + next
  }

  function checkFn(val) {
    t.equal(5, val)
  }
})

test('promise-reduce should reduce a fn', function (t) {
  t.plan(1)
  const res = Promise.resolve([1, 2, 3])
    .then(reduce(reduceFn, 0))
    .then(checkFn)

  function reduceFn(prev, next) {
    return prev + next
  }

  function checkFn(val) {
    t.equal(6, val)
  }
})

test('should not continue until last iteration has been resolved', function (t) {
  t.plan(1)
  const res = Promise.resolve([1, 2, 3])
    .then(reduce(reduceFn, 0))
    .then(checkFn)

  function reduceFn(prev, next) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve(prev + next)
      }, 1)
    })
  }

  function checkFn(val) {
    t.equal(6, val)
  }
})
