var f = require('../src/functions');

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
    assertion: testFunc
  })
};

var runTests = function () {
  if (Object.keys(testSuite).length !== Object.keys(f).length) {
    throw new Error('Not all functions are being tested...');
  }
  for (var funcName in testSuite) {
    console.log('\nTesting function "' + funcName + '":');
    var unitTest = testSuite[funcName];
    for (i in unitTest) {
      console.log('  - ' + unitTest[i].description);
      try {
        unitTest[i].assertion(f[funcName]);
      } catch (e) {
        console.log(e + '\n');
        process.exit(1);
      }
    }
  }
  console.log();
};

require('./tests')(addTest, require('./assert'));

runTests();
