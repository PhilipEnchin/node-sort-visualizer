var assert = function (isTrue) {
  if (isTrue !== true) throw new Error('Expected ' + isTrue + ' to be true');
};

assert.equal = function (a, b) {
  if (a !== b) throw new Error ('Expected ' + a + ' to equal ' + b);
};

assert.greaterThan = function (n, a) {
  if (n <= a) throw new Error('Expected ' + n + ' to be greater than ' + a);
}

assert.inRange = function (n, a, b) {
  if (n < a || n > b) throw new Error('Expected ' + n + ' to be in range ' + a + ' to ' + b);
};

assert.not = function (isTrue) {
  if (isTrue !== false) throw new Error ('Expected ' + isTrue + ' to be false');
}

module.exports = assert;
