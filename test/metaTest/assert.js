'use strict';

var assert = require('../assert');
var stubFunctions = require('../stub');

var stub = stubFunctions.stub;
var resetStubs = stubFunctions.resetStubs;

(function () { // assert
  console.log('assert');
  assert(true); // true
  assert.throws(function () { assert(false); }); // false
  assert.throws(function () { assert(1); }); // truthy
  assert.throws(function () { assert(0); }); // falsey
}());

(function () { // Array.prototype.toString
  console.log('Array.prototype.toString');
  assert.equal([].toString(), '[]');
  assert.equal([1].toString(), '[1]');
  assert.equal([1, 2].toString(), '[1,2]');
}());

(function () { // Object.prototype.toString
  console.log('Object.prototype.toString');
  assert.equal({}.toString(), '{}');
  assert.equal({ a: 1 }.toString(), '{a:1}');
  assert.equal({
    a: 1, b: [2, 3], c: { c: 4, d: 5 }, e: {},
  }.toString(), '{a:1,b:[2,3],c:{c:4,d:5},e:{}}');
}());

(function () { // assert.calledNTimes
  var testObject; var stubbed1; var stubbed2;
  console.log('assert.calledNTimes');
  testObject = { testFunction1: function () {}, testFunction2: function () {} };
  stubbed1 = stub(testObject, 'testFunction1', function () {});
  stubbed2 = stub(testObject, 'testFunction2', function () {});

  assert.calledNTimes(testObject.testFunction1, 0);
  assert.calledNTimes(testObject.testFunction2, 0);

  testObject.testFunction1();
  stubbed1(); stubbed1();
  assert.calledNTimes(testObject.testFunction1, 3);
  assert.calledNTimes(stubbed1, 3);
  assert.calledNTimes(testObject.testFunction2, 0);

  testObject.testFunction2(); testObject.testFunction2(); testObject.testFunction2();
  stubbed2(); stubbed2(); stubbed2(); stubbed2(); stubbed2(); stubbed2(); stubbed2();
  assert.calledNTimes(testObject.testFunction2, 10);
  assert.calledNTimes(stubbed2, 10);

  assert.calledNTimes(stubbed1, 3);

  assert.throws(function () { assert.calledNTimes(testObject.testFunction1, 10); });
  assert.throws(function () { assert.calledNTimes(stubbed1, 10); });
  assert.throws(function () { assert.calledNTimes(testObject.testFunction2, 3); });
  assert.throws(function () { assert.calledNTimes(stubbed2, 3); });
}());

(function () { // assert.calledWith
  var testObject; var stubbed1; var stubbed2;
  console.log('assert.calledWith');
  testObject = { testFunction1: function () {}, testFunction2: function () {} };
  stubbed1 = stub(testObject, 'testFunction1', function () {});
  stubbed2 = stub(testObject, 'testFunction2', function () {});

  testObject.testFunction1(1, 2, 3); // call function 1
  testObject.testFunction2(4, 5, 6); // call function 2

  assert.calledWith(testObject.testFunction1, 1, 2, 3); // Assert on function 1
  assert.calledWith(stubbed1, 1, 2, 3); // Assert on function 1, returned from stub
  assert.calledWith(stubbed2, 4, 5, 6); // ...function 2

  stubbed1(); // Call function 1 to override the first call
  assert.calledWith(stubbed1); // Assert on function 1, with no arguments (second call)
  assert.calledWith(stubbed2, 4, 5, 6); // Assert on function 2, function 1 didn't override

  assert.throws(function () { assert.calledWith(stubbed1, 1, 2, 3); }); // Original args assertion throws error
  assert.throws(function () { assert.calledWith(stubbed2, 4, 5, 6, 7); }); // Throws error with extra argument
  assert.throws(function () { assert.calledWith(stubbed2, 4, 5); }); // Throws error with missing argument

  resetStubs();
}());

(function () { // assert.deepEqual
  console.log('assert.deepEqual');
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
  console.log('assert.equal');
  assert.equal(1, 1); // Same type, same value
  assert.equal('1', '1'); // Same type, same value
  assert.equal(a, a); // Same array
  assert.throws(function () { assert.equal(3, 4); }); // Different value
  assert.throws(function () { assert.equal('1', 1); }); // Check for type coercion
  assert.throws(function () { assert.equal({}, {}); }); // Deeply equal
  assert.throws(function () { assert.equal([], []); }); // Deeply equal
}());

(function () { // assert.greaterThan
  console.log('assert.greaterThan');
  assert.greaterThan(5, 4);
  assert.throws(function () { assert.greaterThan(5, 5); });
  assert.throws(function () { assert.greaterThan(5, 6); });
}());

(function () { // assert.inRange
  console.log('assert.inRange');
  assert.inRange(1, 1, 5);
  assert.inRange(3, 1, 5);
  assert.inRange(5, 1, 5);
  assert.throws(function () { assert.inRange(0, 1, 5); });
  assert.throws(function () { assert.inRange(6, 1, 5); });
}());

(function () { // assert.not
  console.log('assert.not');
  assert.not(false); // false
  assert.throws(function () { assert.not(true); });// true
  assert.throws(function () { assert.not(0); }); // falsey
  assert.throws(function () { assert.not(1); });// truthy
}());

(function () { // assert.notEqual
  var a = [];
  console.log('assert.notEqual');
  assert.throws(function () { assert.notEqual(1, 1); }); // Same type, same value
  assert.throws(function () { assert.notEqual('1', '1'); }); // Same type, same value
  assert.throws(function () { assert.notEqual(a, a); }); // Same array
  assert.notEqual(3, 4); // Different value
  assert.notEqual('1', 1); // Check for type coercion
  assert.notEqual({}, {}); // Deeply equal
  assert.notEqual([], []); // Deeply equal
}());

(function () { // assert.throws
  console.log('assert.throws');
  assert.throws(function () { throw new Error('Thrown!'); }); // Throw error (assert.throws catches it)
  try {
    assert.throws(function () { }); // Don't throw error (assert.throws should throw error)
    throw new Error('assert.throws doesn\'t throw error when the argument function doesn\'t throw an error');
  // eslint-disable-next-line no-empty
  } catch (e) { }
}());

(function () { // assert.type
  console.log('assert.type');
  assert.type(42, 'number');
  assert.type([], 'array');
  assert.type({}, 'object');
  assert.type('42', 'string');
  assert.type('42', 'String');
  assert.throws(function () { assert.type(42, 'string'); });
}());
