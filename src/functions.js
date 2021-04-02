var sort = function (arr, frameMaker) {

};

var makeFrame = function (arr) {

};

module.exports = {
  makeCountingArray: function (len) {
    var arr = Array(len);
    for (var i = 0; i < len; i++) {
      arr[i] = i + 1;
    }

    return arr;
  },
  randomUpTo: function (upper) {
    return Math.floor(Math.random() * (upper + 1));
  }
}
