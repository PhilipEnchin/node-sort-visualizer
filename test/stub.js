'use strict';

var stubs = [];

var resetStubs = function () {
  while (stubs.length) unstub(stubs[0].obj, stubs[0].key);
};

var stub = function (obj, key, replacementValue) {
  var stubbed;
  if (!(key in obj)) { throw new Error('Key "' + key + '" not found on object'); }
  if (typeof obj[key] === 'function') {
    if (arguments.length >= 3 && typeof replacementValue !== 'function') { throw new Error('A stubbed function must be relpaced with another function'); }
    stubbed = function () {
      stubbed.calls.push(Array.prototype.slice.call(arguments));
      return (replacementValue || function () {}).apply(obj, arguments);
    };
    stubbed.calls = [];
  } else if (arguments.length < 3) {
    throw new Error('A replacement value is required when stubbing a non-function');
  } else {
    stubbed = replacementValue;
  }
  stubs.push({
    obj: obj,
    key: key,
    originalValue: obj[key],
  });
  return obj[key] = stubbed;
};

var stubsCount = function () { return stubs.length; };

var unstub = function (obj, key) {
  var i;
  for (i = 0; i < stubs.length; i++) {
    if (stubs[i].obj === obj && stubs[i].key === key) {
      obj[key] = stubs[i].originalValue;
      stubs = stubs.slice(0, i).concat(stubs.slice(i + 1));
      return;
    }
  }
  throw new Error('Did not find ' + key + ' in stubs for ' + obj);
};

module.exports = {
  stub: stub,
  stubsCount: stubsCount,
  resetStubs: resetStubs,
  unstub: unstub,
};
