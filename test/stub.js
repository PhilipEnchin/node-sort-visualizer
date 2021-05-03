'use strict';

var stubs = [];

var resetStubs = function () {
  while (stubs.length) unstub(stubs[0].obj, stubs[0].funcName);
};

var stub = function (obj, funcName, replacementFunc) {
  var replacement = replacementFunc || function () {};
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

var stubsCount = function () { return stubs.length; };

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
  stubsCount: stubsCount,
  resetStubs: resetStubs,
  unstub: unstub,
};
