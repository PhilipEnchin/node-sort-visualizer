'use strict';

var readline = require('readline');

var functions = require('../src/functions');
var stubFunctions = require('./stub');

var stub = stubFunctions.stub;
var resetStubs = stubFunctions.resetStubs;

var repeat = function (times, func) {
  var i;
  for (i = 0; i < times; i++) func();
};

var lots = 1000;

var BORDER_LEFT = '|| ';
var BORDER_MID = ' | ';
var BORDER_RIGHT = ' ||';
var COLUMN_BLANK = ' ';
var COLUMN_ELEMENT = '#';
// var COLUMN_SELECTED = '\x1b[36m\x1b[1m#\x1b[0m';

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

  // renderGraphRow
  addTest('renderGraphRow', 'should render top row without scaling', function (f) {
    var snapshot = [1, 3, 5, 7, 2, 4, 6, 8];
    var left = 12; var top = 34;
    var frameObject = functions.arraySnapshotToFrameObject(snapshot, 1, 2);
    var expectedRow = functions.makeBlankArray(7, COLUMN_BLANK).concat([COLUMN_ELEMENT]).join('');
    expectedRow = BORDER_LEFT + expectedRow + BORDER_MID + BORDER_RIGHT;
    stub(process.stdout, 'write');
    stub(readline, 'cursorTo');
    f(frameObject, 8, left, top, snapshot.length, 1);
    assert.calledWith(readline.cursorTo, process.stdout, left, top);
    assert.calledWith(process.stdout.write, expectedRow);
    resetStubs();
  });

  addTest('renderGraphRow', 'should render row at double height', function (f) {
    var snapshot = [1, 3, 5, 7, 2, 4, 6, 8];
    var left = 12; var top = 34;
    var frameObject = functions.arraySnapshotToFrameObject(snapshot, 1, 2);
    var expectedRow = functions.makeBlankArray(2, COLUMN_BLANK)
      .concat(functions.makeBlankArray(2, COLUMN_ELEMENT));
    expectedRow = BORDER_LEFT + expectedRow.concat(expectedRow).join('') + BORDER_MID + BORDER_RIGHT; // Repeat first half
    expectedRow = expectedRow + '\n' + expectedRow; // New line for next row
    stub(process.stdout, 'write');
    stub(readline, 'cursorTo');
    f(frameObject, 5, left, top, snapshot.length, 2);
    assert.calledWith(readline.cursorTo, process.stdout, left, top);
    assert.calledWith(process.stdout.write, expectedRow);
    resetStubs();
  });

  addTest('renderGraphRow', 'should render row at double width', function (f) {
    var snapshot = [1, 3, 5, 7, 2, 4, 6, 8];
    var left = 12; var top = 34;
    var frameObject = functions.arraySnapshotToFrameObject(snapshot, 1, 2);
    var expectedRow = functions.makeBlankArray(2, COLUMN_BLANK).concat(functions.makeBlankArray(6, COLUMN_ELEMENT)).join('');
    expectedRow += expectedRow;
    expectedRow = BORDER_LEFT + expectedRow + BORDER_MID + BORDER_RIGHT;
    stub(process.stdout, 'write');
    stub(readline, 'cursorTo');
    f(frameObject, 3, left, top, snapshot.length * 2, 1);
    assert.calledWith(readline.cursorTo, process.stdout, left, top);
    assert.calledWith(process.stdout.write, expectedRow);
    resetStubs();
  });
  addTest('renderGraphRow', 'should render row with separator and missing elements', function (f) {
    var snapshot = [8, 7, 6, 5, 5, 3, 2, 1];
    var left = 12; var top = 34;
    var frameObject = functions.arraySnapshotToFrameObject(snapshot, 1, 2);

    var expectedRow = BORDER_LEFT + functions.makeBlankArray(9, COLUMN_ELEMENT).concat(functions.makeBlankArray(15, COLUMN_BLANK)).join('');
    expectedRow += BORDER_MID + functions.makeBlankArray(3, COLUMN_BLANK).join('') + BORDER_RIGHT;
    expectedRow += '\n' + expectedRow;
    stub(process.stdout, 'write');
    stub(readline, 'cursorTo');
    f(frameObject, 6, left, top, snapshot.length * 3, 2);
    assert.calledWith(readline.cursorTo, process.stdout, left, top);
    assert.calledWith(process.stdout.write, expectedRow);

    expectedRow = BORDER_LEFT + functions.makeBlankArray(15, COLUMN_ELEMENT).concat(functions.makeBlankArray(9, COLUMN_BLANK)).join('');
    expectedRow += BORDER_MID + functions.makeBlankArray(3, COLUMN_ELEMENT).join('') + BORDER_RIGHT;
    expectedRow += '\n' + expectedRow;
    f(frameObject, 4, left, top, snapshot.length * 3, 2);
    assert.calledWith(readline.cursorTo, process.stdout, left, top);
    assert.calledWith(process.stdout.write, expectedRow);

    resetStubs();
  });
  // TODO: Selected array elements
  // TODO: Selected array elements from missing elements
};
