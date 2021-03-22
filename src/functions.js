var sort = function (arr, frameMaker) {

};

var makeFrame = function (arr) {

};

module.exports = {
  // makeArray: function (len) {
  //   var arr = Array(len).fill(0).map(function (_, i) { return i + 1; });

  //   for (var i = 0; i < len; i++) {
  //     var randomIndex = randomUpTo(i);
  //   }

  //   return arr;
  // },
  randomUpTo: function (upper) {
    return Math.floor(Math.random() * (upper + 1));
  }
}
