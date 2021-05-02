'use strict';

// Asserts that argument is true (not truthy)
var assert = function (isTrue) {
  if (isTrue !== true) throw new Error('Expected ' + isTrue + ' to be true');
};

// Enable brackets in string renders of arrays
var arrayToString = Array.prototype.toString;
// eslint-disable-next-line no-extend-native
Array.prototype.toString = function () {
  return '[' + arrayToString.call(this) + ']';
};

// Enable better string renders of objects
// eslint-disable-next-line no-extend-native
Object.prototype.toString = function () {
  var thisObject = this;
  return '{' + Object.keys(thisObject).map(function (key) { return key + ':' + thisObject[key]; }).join(',') + '}';
};

// Asserts that both objects/arrays are deeply equal, with arrays allowed to be out of order
assert.deepEqual = function (a, b) {
  var aKeys;
  if (a !== b) {
    if (Array.isArray(a)) {
      if (Array.isArray(b) && b.length === a.length) a.forEach(function (element, i) { assert.deepEqual(element, b[i]); });
      else throw new Error('Expected ' + a + ' to deep equal ' + b);
    } else if (typeof a === 'object') {
      aKeys = Object.keys(a);
      if (a.constructor === b.constructor && aKeys.length === Object.keys(b).length) aKeys.forEach(function (aKey) { assert(aKey in b); assert.deepEqual(a[aKey], b[aKey]); });
      else throw new Error('Expected ' + a + ' to deep equal ' + b);
    } else throw new Error('Expected ' + a + ' to deep equal ' + b);
  }
};

// Asserts that arguments are equal
assert.equal = function (a, b) {
  if (a !== b) throw new Error('Expected ' + a + ' to equal ' + b);
};

// Asserts that first argument is greater than the second
assert.greaterThan = function (n, a) {
  if (n <= a) throw new Error('Expected ' + n + ' to be greater than ' + a);
};

// Asserts that the first argument is in the inclusive range between the next two arguments
assert.inRange = function (n, a, b) {
  var lower = a < b ? a : b;
  var upper = a < b ? b : a;
  if (n < lower || n > upper) throw new Error('Expected ' + n + ' to be in range ' + lower + ' to ' + upper);
};

// Asserts that argument is false (not falsey)
assert.not = function (isTrue) {
  if (isTrue !== false) throw new Error('Expected ' + isTrue + ' to be false');
};

// Asserts that the argument function throws an error
assert.throws = function (wrapperFunc) {
  var error;
  try {
    wrapperFunc();
    error = new Error('Expected error to be thrown');
    error.didNotThrow = true;
    throw error;
  } catch (e) {
    if (e.didNotThrow) {
      delete e.didNotThrow;
      throw e;
    }
  }
};

module.exports = assert;

// Testing for this file (in IFFE's so they can be folded in editor):

(function () { // assert
  assert(true); // true
  assert.throws(function () { assert(false); }); // false
  assert.throws(function () { assert(1); }); // truthy
  assert.throws(function () { assert(0); }); // falsey
}());

(function () { // Array.prototype.toString
  assert.equal([].toString(), '[]');
  assert.equal([1].toString(), '[1]');
  assert.equal([1, 2].toString(), '[1,2]');
}());

(function () {
  assert.equal({}.toString(), '{}');
  assert.equal({ a: 1 }.toString(), '{a:1}');
  assert.equal({
    a: 1, b: [2, 3], c: { c: 4, d: 5 }, e: {},
  }.toString(), '{a:1,b:[2,3],c:{c:4,d:5},e:{}}');
}());

(function () { // assert.deepEqual
  assert.deepEqual(1, 1); // Same ===-comparable value
  assert.deepEqual([], []); // Same empty array
  assert.deepEqual([1, 2, 3], [1, 2, 3]); // Same non-empty array
  assert.deepEqual([[1], 2, 3], [[1], 2, 3]); // Same nested array
  assert.deepEqual([[1], [2, 3]], [[1], [2, 3]]); // Same nested array
  assert.deepEqual({}, {}); // Same empty object
  assert.deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 }); // Same non empty object
  assert.deepEqual({ a: 1, b: [2, { c: [3, 4] }] }, { a: 1, b: [2, { c: [3, 4] }] }); // Same non empty object
  assert.throws(function () { assert.deepEqual({ a: 1, b: [2, { c: [3, 4] }] }, { a: 1, b: [2, { c: [3, 4, 5] }] }); }); // Same non empty object
  assert.throws(function () { assert.deepEqual({}, []); }); // Empty object compared to empty array
  assert.throws(function () { assert.deepEqual({ a: 1 }, { a: 2 }); }); // Objects with same keys, different values
  assert.throws(function () { assert.deepEqual({ a: 1 }, { b: 1 }); }); // Objects with different keys, same values
  assert.throws(function () { assert.deepEqual({ 0: 0, 1: 1 }, [0, 1]); }); // Object that mimics array compared with array
  assert.throws(function () { assert.deepEqual({ 0: 0, 1: 1, length: 2 }, [0, 1]); }); // Object that mimics array compared with array
  assert.throws(function () { assert.deepEqual([0, 1], { 0: 0, 1: 1, length: 2 }); }); // Object that mimics array compared with array
  assert.throws(function () { assert.deepEqual([1], 1); }); // Same value, one in an array
  assert.throws(function () { assert.deepEqual(1, [1]); }); // Same value, one in an array
  assert.throws(function () { assert.deepEqual([[]], []); }); // Empty array compared with nested empty array
  assert.throws(function () { assert.deepEqual([], [[]]); }); // Empty array compared with nested empty array
}());

(function () { // assert.equal
  var a = [];
  assert.equal(1, 1); // Same type, same value
  assert.equal('1', '1'); // Same type, same value
  assert.equal(a, a); // Same array
  assert.throws(function () { assert.equal(3, 4); }); // Different value
  assert.throws(function () { assert.equal('1', 1); }); // Check for type coercion
  assert.throws(function () { assert.equal({}, {}); }); // Deeply equal
  assert.throws(function () { assert.equal([], []); }); // Deeply equal
}());

(function () { // assert.greaterThan
  assert.greaterThan(5, 4);
  assert.throws(function () { assert.greaterThan(5, 5); });
  assert.throws(function () { assert.greaterThan(5, 6); });
}());

(function () { // assert.inRange
  assert.inRange(1, 1, 5);
  assert.inRange(3, 1, 5);
  assert.inRange(5, 1, 5);
  assert.throws(function () { assert.inRange(0, 1, 5); });
  assert.throws(function () { assert.inRange(6, 1, 5); });
}());

(function () { // assert.not
  assert.not(false); // false
  assert.throws(function () { assert.not(true); });// true
  assert.throws(function () { assert.not(0); }); // falsey
  assert.throws(function () { assert.not(1); });// truthy
}());

(function () { // assert.throws
  assert.throws(function () { throw new Error('Thrown!'); }); // Throw error (assert.throws catches it)
  try {
    assert.throws(function () { }); // Don't throw error (assert.throws should throw error)
    throw new Error('assert.throws doesn\'t throw error when the argument function doesn\'t throw an error');
  // eslint-disable-next-line no-empty
  } catch (e) { }
}());
