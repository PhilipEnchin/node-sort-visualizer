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

  // makeCountingArray
  addTest('makeCountingArray', 'length of array matches argument', function(f) {
    var len = 42;
    var arr = f(len);
    assert.equal(arr.length, len);
  });

  addTest('makeCountingArray', 'contains number 1 to n in order', function(f) {
    var len = 42;
    var arr = f(len);
    for (var i = 0; i < len; i++) {
      assert.equal(arr[i], i + 1);
    }
  });

  // makeShuffledArray
  addTest('makeShuffledArray', 'length of array matches argument', function(f) {
    var len = 42
    var arr = f(len);
    assert.equal(arr.length, len);
  });

  addTest('makeShuffledArray', 'contains numbers 1 to n, out of order', function(f) {
    var len = 42;
    var arr = f(len);
    var tally = Array(len);
    for (var i = 0; i < len; i++) {
      tally[arr[i] - 1] = true;
    }
    for (var i = 0; i < len; i++) {
      assert(tally[i]);
    }
  });

  addTest('makeShuffledArray', 'Array is not sorted', function(f) {
    var len = 42;
    var arr = f(len);
    var isSorted = true;
    for (var i = 0; i < len; i++) {
      if (arr[i] !== i + 1) isSorted = false;
    }
    assert.not(isSorted);
  });

  addTest('makeShuffledArray', 'Shuffle is unbiased', function(f) {
    var len = 10;
    var tallies = [];
    for (var i = 0; i < len; i++) {
      tallies.push([]);
      for (var j = 0; j < len; j++) {
        tallies[i].push(0);
      }
    }
    repeat(Math.pow(len, 3), function() {
      var arr = f(len);
      for (var i = 0; i < len; i++) {
        tallies[i][arr[i] - 1]++;
      }
    });
    for (var i = 0; i < len; i++) {
      for (var j = 0; j < len; j++) {
        assert.greaterThan(tallies[i][j], 0);
      }
    }
  });
};
