var repeat = function (times, func) {
  for (var i = 0; i < times; i++) func();
};

var lots = 1000;

module.exports = function (addTest, assert) {
  addTest('randomUpTo', 'all random numbers are integers', function(f) {
    repeat(lots, function () {
      var randomInt = f(1000);
      assert.equal(randomInt - Math.floor(randomInt), 0);
    });
  });
};
