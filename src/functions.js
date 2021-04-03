module.exports.makeCountingArray = function (len) {
  var arr = Array(len);
  for (var i = 0; i < len; i++) {
    arr[i] = i + 1;
  }

  return arr;
};

module.exports.makeShuffledArray = function (len) {
  var arr = module.exports.makeCountingArray(len);
  for (var i = 1; i < len; i++) {
    var j = module.exports.randomUpTo(i);
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
};

module.exports.randomUpTo = function (upper) {
  return Math.floor(Math.random() * (upper + 1));
};
