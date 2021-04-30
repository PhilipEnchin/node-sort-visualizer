'use strict';

var stubs = [];

var stubFunctions = {};

stubFunctions.stub = function (obj, funcName, replacement) {
  stubs.push({
    obj: obj,
    funcName: funcName,
    func: obj[funcName],
  });
  obj[funcName] = replacement;
};

stubFunctions.unstub = function (obj, funcName) {
  var i;
  for (i = 0; i < stubs.length; i++) {
    if (stubs[i].obj === obj && stubs[i].funcName === funcName) {
      obj[funcName] = stubs[i].func;
      stubs = stubs.slice(0, i).concat(stubs.slice(i + 1));
      return;
    }
  }
  throw new Error('Did not find ' + funcName + ' in stubs for ' + obj);
};

stubFunctions.resetStubs = function () {
  while (stubs.length) stubFunctions.unstub(stubs[0].obj, stubs[0].funcName);
};

module.exports = stubFunctions;
