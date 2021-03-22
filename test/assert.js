var assert = function (isTrue) {
  if (isTrue !== true) throw new Error('Expected ' + isTrue + ' to be true');
};

assert.equal = function (a, b) {
  if (a !== b) throw new Error ('Expected ' + a + ' to equal ' + b);
}

module.exports = assert;
