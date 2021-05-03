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

// Asserts that arguments are not equal
assert.notEqual = function (a, b) {
  if (a === b) throw new Error('Expected ' + a + ' to not equal ' + b);
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

// Assert typeof argument equals second argument (string)
assert.type = function (data, type) {
  var caseInsensitiveType = type.toLowerCase();
  if (caseInsensitiveType === 'array') assert(Array.isArray(data));
  else assert.equal(typeof data, caseInsensitiveType);
};

module.exports = assert;
