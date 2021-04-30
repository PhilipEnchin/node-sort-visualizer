'use strict';

var f = require('../src/functions');
var resetStubs = require('./stub').resetStubs;

var testSuite = {};

var makeUnitTest = function (funcName) {
  if (!(funcName in f)) {
    throw new Error('Function name "' + funcName + '" does not exist');
  }
  return [];
};

var addTest = function (funcName, description, testFunc) {
  var unitTest = testSuite[funcName] = testSuite[funcName] || makeUnitTest(funcName);
  unitTest.push({
    description: description,
    assertion: testFunc,
  });
};

var runTests = function () {
  var funcIndex; var funcName;
  var unitTestIndex; var unitTest;
  var funcNames = Object.keys(testSuite);
  if (funcNames.length !== Object.keys(f).length) {
    throw new Error('Not all functions are being tested...');
  }
  for (funcIndex = 0; funcIndex < funcNames.length; funcIndex++) {
    funcName = funcNames[funcIndex];
    console.log('\nTesting function "' + funcName + '":');
    unitTest = testSuite[funcName];
    for (unitTestIndex = 0; unitTestIndex < unitTest.length; unitTestIndex++) {
      console.log('  - ' + unitTest[unitTestIndex].description);
      try {
        unitTest[unitTestIndex].assertion(f[funcName]);
      } catch (e) {
        resetStubs();
        console.log(e + '\n\n');
        process.exit(1);
      }
    }
  }
  console.log();
};

require('./tests')(addTest, require('./assert'));

runTests();
