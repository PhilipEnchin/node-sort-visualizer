'use strict';

var stubFunctions = require('../stub');
var assert = require('../assert');

var resetStubs = stubFunctions.resetStubs;
var stub = stubFunctions.stub;
var stubsCount = stubFunctions.stubsCount;
var unstub = stubFunctions.unstub;

var testObject = {
  testFunction1: function () {},
  testFunction2: function () {},
  testValue: 'original value',
};
var replacementFunction = function () { testFunctionCallCount++; };
var previousTestFunctionCallCount = 0; var testFunctionCallCount = 0; var stubbedFunction;
var checkTestFunctionCallCountIncrementBy = function (increment) {
  assert.equal(previousTestFunctionCallCount + increment, testFunctionCallCount);
  previousTestFunctionCallCount = testFunctionCallCount;
};
var callOriginalTestFunction = function () { testObject.testFunction1(); checkTestFunctionCallCountIncrementBy(0); };
var callStub = function () { testObject.testFunction1(); checkTestFunctionCallCountIncrementBy(1); };

var consoleLog = console.log;
consoleLog('stub');
console.log = function (msg) {
  consoleLog('  ' + msg);
};

(function () { // resetStubs
  console.log('resetStubs');
  callOriginalTestFunction(); // Verify original function call
  stub(testObject, 'testFunction1', replacementFunction); // Stub function 1
  stub(testObject, 'testFunction2', replacementFunction); // Stub function 2
  assert.equal(stubsCount(), 2); // Verify stub count
  callStub(); // Verify function 1 is stubbed
  resetStubs(); // Reset
  assert.equal(stubsCount(), 0); // Verify stub count
  callOriginalTestFunction(); // Verify function 1 is unstubbed
  stub(testObject, 'testFunction2', replacementFunction); // Stub functions in opposite order
  stub(testObject, 'testFunction1', replacementFunction);
  assert.equal(stubsCount(), 2);
  callStub();
  resetStubs();
  assert.equal(stubsCount(), 0); // Verify stub count
  callOriginalTestFunction(); // Verify function 1 is unstubbed

  assert.equal(testObject.testValue, 'original value');
  stub(testObject, 'testValue', 'stubbed value');
  assert.equal(testObject.testValue, 'stubbed value');
  // eslint-disable-next-line no-unused-expressions
  assert.throws(function () { 'calls' in testObject.testValue; });
  resetStubs();
  assert.equal(testObject.testValue, 'original value');

  assert.throws(function () { stub(testObject, 'testValue'); });
  assert.throws(function () { stub(testObject, 'non existent key', 42); });
  assert.equal(stubsCount(), 0);
}());

(function () { // stub
  console.log('stub');
  callOriginalTestFunction(); // Verify original function call
  stubbedFunction = stub(testObject, 'testFunction1', replacementFunction); // Replace with stub
  assert.equal(stubsCount(), 1);
  assert.equal(testObject.testFunction1, stubbedFunction);// Original function has been replaced with replacement function
  stubbedFunction = stub(testObject, 'testFunction2', replacementFunction);
  assert.equal(stubsCount(), 2);
  assert.equal(testObject.testFunction2, stubbedFunction);// stub() has returned replacement function
  callStub(); // Verify stub has replaced original
  resetStubs(); // Reset for next test
}());

(function () { // stubsCount
  console.log('stubsCount');
  callOriginalTestFunction(); // Verify original function call
  assert.equal(stubsCount(), 0);
  stub(testObject, 'testFunction1', replacementFunction);
  assert.equal(stubsCount(), 1);
  unstub(testObject, 'testFunction1');
  assert.equal(stubsCount(), 0);
  stub(testObject, 'testFunction1', replacementFunction);
  stub(testObject, 'testFunction2', replacementFunction);
  assert.equal(stubsCount(), 2);
  resetStubs();
  assert.equal(stubsCount(), 0);
}());

(function () { // unstub
  console.log('unstub');
  callOriginalTestFunction(); // Verify original function call
  stub(testObject, 'testFunction1', replacementFunction); // Replace with stub
  callStub(); // Verify stub has replaced original
  assert.equal(stubsCount(), 1);
  unstub(testObject, 'testFunction1');
  callOriginalTestFunction(); // Verify original has replaced stub
  assert.equal(stubsCount(), 0);
  resetStubs();
}());

(function () { // calls
  console.log('stubFunction.calls');
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
}());

console.log = consoleLog;
