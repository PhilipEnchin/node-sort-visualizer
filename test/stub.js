var stubs = [];

module.exports.stub = function (obj, funcName, replacement) {
  stubs.push({
    obj: obj,
    funcName: funcName,
    func: obj[funcName],
  });
  obj[funcName] = replacement;
};

module.exports.unstub = function (obj, funcName) {
  for (var i = 0; i < stubs.length; i++) {
    if (stubs[i].obj === obj && stubs[i].funcName === funcName) {
      obj[funcName] = stubs[i].func;
      stubs = stubs.slice(0, i).concat(stubs.slice(i + 1));
      return;
    }
  }
  throw new Error('Did not find ' + funcName + ' in stubs for ' + obj);
};

module.exports.resetStubs = function () {
  while (stubs.length) module.exports.unstub(stubs[0].obj, stubs[0].funcName)
};
