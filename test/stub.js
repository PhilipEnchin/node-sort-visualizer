'use strict';

var stubs = [];

var resetStubs = function () {
  while (stubs.length) unstub(stubs[0].obj, stubs[0].funcName);
};

var stub = function (obj, funcName, replacement) {
  var stubbed = function () {
    stubbed.calls.push(Array.prototype.slice.call(arguments));
    return replacement.apply(obj, arguments);
  };
  stubbed.calls = [];
  stubs.push({
    obj: obj,
    funcName: funcName,
    originalFunc: obj[funcName],
  });
  return obj[funcName] = stubbed;
};

var unstub = function (obj, funcName) {
  var i;
  for (i = 0; i < stubs.length; i++) {
    if (stubs[i].obj === obj && stubs[i].funcName === funcName) {
      obj[funcName] = stubs[i].originalFunc;
      stubs = stubs.slice(0, i).concat(stubs.slice(i + 1));
      return;
    }
  }
  throw new Error('Did not find ' + funcName + ' in stubs for ' + obj);
};

module.exports = {
  stub: stub,
  resetStubs: resetStubs,
  unstub: unstub,
};

// Testing
// eslint-disable-next-line vars-on-top
var assert = require('./assert');
// eslint-disable-next-line vars-on-top
var testObject = { testFunction1: function () {}, testFunction2: function () {} }; var replacementFunction = function () { testFunctionCallCount++; };
// eslint-disable-next-line vars-on-top
var previousTestFunctionCallCount = 0; var testFunctionCallCount = 0; var stubbedFunction;
// eslint-disable-next-line vars-on-top
var checkTestFunctionCallCountIncrementBy = function (increment) {
  assert.equal(previousTestFunctionCallCount + increment, testFunctionCallCount);
  previousTestFunctionCallCount = testFunctionCallCount;
};
// eslint-disable-next-line vars-on-top
var callOriginalTestFunction = function () { testObject.testFunction1(); checkTestFunctionCallCountIncrementBy(0); };
// eslint-disable-next-line vars-on-top
var callStub = function () { testObject.testFunction1(); checkTestFunctionCallCountIncrementBy(1); };

// resetStubs
callOriginalTestFunction(); // Verify original function call
stub(testObject, 'testFunction1', replacementFunction); // Stub function 1
stub(testObject, 'testFunction2', replacementFunction); // Stub function 2
assert.equal(stubs.length, 2); // Verify stub count
callStub(); // Verify function 1 is stubbed
resetStubs(); // Reset
assert.equal(stubs.length, 0); // Verify stub count
callOriginalTestFunction(); // Verify function 1 is unstubbed
stub(testObject, 'testFunction2', replacementFunction); // Stub functions in opposite order
stub(testObject, 'testFunction1', replacementFunction);
assert.equal(stubs.length, 2);
callStub();
resetStubs();
assert.equal(stubs.length, 0); // Verify stub count
callOriginalTestFunction(); // Verify function 1 is unstubbed

// stub
callOriginalTestFunction(); // Verify original function call
stubbedFunction = stub(testObject, 'testFunction1', replacementFunction); // Replace with stub
assert.equal(stubs.length, 1);
assert.equal(testObject.testFunction1, stubbedFunction);// Original function has been replaced with replacement function
stubbedFunction = stub(testObject, 'testFunction2', replacementFunction);
assert.equal(stubs.length, 2);
assert.equal(testObject.testFunction2, stubbedFunction);// stub() has returned replacement function
callStub(); // Verify stub has replaced original
resetStubs(); // Reset for next test

// unstub
callOriginalTestFunction(); // Verify original function call
stub(testObject, 'testFunction1', replacementFunction); // Replace with stub
callStub(); // Verify stub has replaced original
assert.equal(stubs.length, 1);
unstub(testObject, 'testFunction1');
callOriginalTestFunction(); // Verify original has replaced stub
assert.equal(stubs.length, 0);
resetStubs();

// calls
callOriginalTestFunction(); // Verify original function call
stubbedFunction = stub(testObject, 'testFunction1', replacementFunction); // Stub
assert.type(stubbedFunction.calls, 'array'); // Verify calls array exists
assert.equal(stubbedFunction.calls.length, 0); // Verify calls array is empty
assert.equal(stubbedFunction.calls, testObject.testFunction1.calls); // Verify it's the same as on testFunction1
stubbedFunction(1, 2, 3);
testObject.testFunction1(4, 5, 6);
stubbedFunction();
stubbedFunction([]);
assert.equal(stubbedFunction.calls.length, 4);
assert.deepEqual(stubbedFunction.calls, [[1, 2, 3], [4, 5, 6], [], [[]]]);
resetStubs();
