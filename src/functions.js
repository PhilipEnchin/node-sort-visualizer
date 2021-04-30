'use strict';

var makeCountingArray = function (len) {
  var arr = Array(len);
  var i;
  for (i = 0; i < len; i++) {
    arr[i] = i + 1;
  }

  return arr;
};

var makeShuffledArray = function (len) {
  var arr = module.exports.makeCountingArray(len);
  var i; var j; var temp;
  for (i = 1; i < len; i++) {
    j = module.exports.randomUpTo(i);
    temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
};

var randomUpTo = function (upper) {
  return Math.floor(Math.random() * (upper + 1));
};

module.exports = {
  makeCountingArray: makeCountingArray,
  makeShuffledArray: makeShuffledArray,
  randomUpTo: randomUpTo,
};
