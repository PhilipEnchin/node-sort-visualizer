var repeat = function (times, func) {
  for (var i = 0; i < times; i++) func();
};

var lots = 1000;

module.exports = function (addTest, assert) {
  // randomUpTo...
  addTest('randomUpTo', 'all random numbers are integers', function(f) {
    repeat(lots, function () {
      var randomInt = f(1000);
      assert.equal(randomInt - Math.floor(randomInt), 0);
    });
  });

  addTest('randomUpTo', 'all random numbers are in the range 0 to n', function(f) {
    var range = 10;
    var tally = Array(range + 1);
    for (var i = 0; i <= range; i++) {
      tally[i] = 0
    }
    repeat(lots, function () {
      var randomInt = f(range);
      assert.inRange(randomInt, 0, 1000);
      tally[randomInt]++;
    });
    for (var i = 0; i <= range; i++) {
      assert.greaterThan(tally[i], 0);
    }
  });
};
