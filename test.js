const test    = require('tape')
const reduce     = require('./')

test('promise-reduce should assert input types', function (t) {
  t.plan(1)
  t.throws(reduce.bind(null, 123))
})

test('promise-reduce should accept a single val', function (t) {
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

test('should pass reducer arguments to callback', function(t) {
  const arrTest = [1, 2]

  const res = Promise.resolve(arrTest)
    .then(reduce(reduceFn, 0))
    .then(checkFn)

  function reduceFn(prev, next, index, arr) {
    t.equal(4, arguments.length)
    t.equal(arrTest, arr)

    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve(prev + next)
      }, 1)
    })
  }

  function checkFn(val) {
    t.equal(3, val)
    t.end()
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

test('should not call callback when initial value is undefined and iterable contains one item', function (t) {
  t.plan(1)
  const res = Promise.resolve([1])
    .then(reduce(function() {}, undefined))
    .then(checkFn)

  function checkFn(val) {
    t.equal(1, val, 'should return the item in iterable')
  }
})

test('should not call callback when iterable is empty', function (t) {
  t.plan(1)
  const res = Promise.resolve([])
    .then(reduce(function() {}, 10))
    .then(checkFn)

  function checkFn(val) {
    t.equal(10, val, 'should return initial value')
  }
})
