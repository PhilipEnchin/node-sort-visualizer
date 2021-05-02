'use strict';

var repeat = function (times, func) {
  var i;
  for (i = 0; i < times; i++) func();
};

var lots = 1000;

module.exports = function (addTest, assert) {
  // arraySnapshotToFrameObject
  addTest('arraySnapshotToFrameObject', 'converts an array with no missing items successfully', function (f) {
    var input = [5, 2, 3, 1, 4, 6];
    var result = f(input, 1, 2);
    var expected = {
      array: input,
      comparingIndices: [1, 3],
      extraData: {
        array: [],
        comparingIndices: [],
      },
    };
    assert.deepEqual(result, expected);
  });

  addTest('arraySnapshotToFrameObject', 'converts an array with missing items but none compared successfully', function (f) {
    var input = [5, 2, 2, 1, 1, 1];
    var result = f(input, 1, 2);
    var expected = {
      array: input,
      comparingIndices: [1, 2, 3, 4, 5],
      extraData: {
        array: [3, 4, 6],
        comparingIndices: [],
      },
    };
    assert.deepEqual(result, expected);
  });

  addTest('arraySnapshotToFrameObject', 'converts and array with missing items with one being compared', function (f) {
    var input = [5, 2, 2, 1, 1, 1];
    var result = f(input, 1, 3);
    var expected = {
      array: input,
      comparingIndices: [3, 4, 5],
      extraData: {
        array: [3, 4, 6],
        comparingIndices: [0],
      },
    };
    assert.deepEqual(result, expected);
  });

  addTest('arraySnapshotToFrameObject', 'converts and array with missing items with two being compared', function (f) {
    var input = [5, 2, 2, 1, 1, 1];
    var result = f(input, 6, 3);
    var expected = {
      array: input,
      comparingIndices: [],
      extraData: {
        array: [3, 4, 6],
        comparingIndices: [0, 2],
      },
    };
    assert.deepEqual(result, expected);
  });

  // makeBlankArray
  addTest('makeBlankArray', 'length of array matches argument', function (f) {
    var len = 42;
    var arr = f(len);
    assert.equal(arr.length, len);
  });

  addTest('makeBlankArray', 'array is filled with null by default', function (f) {
    var len = 42;
    var arr = f(len);
    assert(arr.every(function (element) { return element === null; }));
  });

  addTest('makeBlankArray', 'array is filled with custom value if included as second argument', function (f) {
    var len = 42;
    var arr = f(len, 42);
    assert(arr.every(function (element) { return element === 42; }));
  });

  // makeCountingArray
  addTest('makeCountingArray', 'length of array matches argument', function (f) {
    var len = 42;
    var arr = f(len);
    assert.equal(arr.length, len);
  });

  addTest('makeCountingArray', 'contains number 1 to n in order', function (f) {
    var len = 42;
    var arr = f(len);
    assert(arr.every(function (n, i) { return n === i + 1; }));
  });

  // makeShuffledArray
  addTest('makeShuffledArray', 'length of array matches argument', function (f) {
    var len = 42;
    var arr = f(len);
    assert.equal(arr.length, len);
  });

  addTest('makeShuffledArray', 'contains numbers 1 to n, out of order', function (f) {
    var len = 42;
    var arr = f(len);
    var tally = Array(len);
    var i;
    for (i = 0; i < len; i++) {
      tally[arr[i] - 1] = true;
    }
    for (i = 0; i < len; i++) {
      assert(tally[i]);
    }
  });

  addTest('makeShuffledArray', 'Array is not sorted', function (f) {
    var len = 42;
    var arr = f(len);
    var isSorted = true;
    var i;
    for (i = 0; i < len; i++) {
      if (arr[i] !== i + 1) isSorted = false;
    }
    assert.not(isSorted);
  });

  addTest('makeShuffledArray', 'Shuffle is unbiased', function (f) {
    var len = 10;
    var tallies = [];
    var i; var j;
    for (i = 0; i < len; i++) {
      tallies.push([]);
      for (j = 0; j < len; j++) {
        tallies[i].push(0);
      }
    }
    repeat(Math.pow(len, 3), function () {
      var arr = f(len);
      for (i = 0; i < len; i++) {
        tallies[i][arr[i] - 1]++;
      }
    });
    for (i = 0; i < len; i++) {
      for (j = 0; j < len; j++) {
        assert.greaterThan(tallies[i][j], 0);
      }
    }
  });

  // randomUpTo
  addTest('randomUpTo', 'all random numbers are integers', function (f) {
    repeat(lots, function () {
      var randomInt = f(1000);
      assert.equal(randomInt - Math.floor(randomInt), 0);
    });
  });

  addTest('randomUpTo', 'all random numbers are in the range 0 to n', function (f) {
    var range = 10;
    var tally = Array(range + 1);
    var i;
    for (i = 0; i <= range; i++) {
      tally[i] = 0;
    }
    repeat(lots, function () {
      var randomInt = f(range);
      assert.inRange(randomInt, 0, 1000);
      tally[randomInt]++;
    });
    for (i = 0; i <= range; i++) {
      assert.greaterThan(tally[i], 0);
    }
  });

  // Show frame
  // addTest('printFrame', 'Calls console.log exactly once per frame', function (f) {
  //   var consoleCount = 0;
  //   stub(console, 'log', function (t) { consoleCount++; });
  //   f(arr, rows, cols);
  //   assert.equal(consoleCount, 1);
  //   unstub(console, 'log');
  // });
};
