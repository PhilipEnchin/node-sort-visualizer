'use strict';

var readline = require('readline');

var BORDER_LEFT = '|| ';
var BORDER_MID = ' | ';
var BORDER_RIGHT = ' ||';
var COLUMN_BLANK = ' ';
var COLUMN_ELEMENT = '#';
var COLUMN_SELECTED = '\x1b[36m\x1b[1m#\x1b[0m';

var functions = {};

// Process array to make an object that can be used to render a frame
functions.arraySnapshotToFrameObject = function (array, a, b) {
  var attendance = functions.makeBlankArray(array.length, false);
  var missingValues = [];
  var comparingIndices = [];
  var extraComparingIndices = [];
  array.forEach(function (value, i) {
    attendance[value - 1] = true;
    if (value === a || value === b) {
      comparingIndices.push(i);
    }
  });
  attendance.forEach(function (present, i) {
    var value;
    if (!present) {
      value = i + 1;
      if (value === a || value === b) extraComparingIndices.push(missingValues.length);
      missingValues.push(value);
    }
  });
  return {
    array: array,
    comparingIndices: comparingIndices,
    extraData: {
      array: missingValues,
      comparingIndices: extraComparingIndices,
    },
  };
};

functions.makeBlankArray = function (len, defaultValue) {
  var arr = Array(len);
  var i;
  var value = arguments.length < 2 ? null : defaultValue;
  for (i = 0; i < len; i++) arr[i] = value;
  return arr;
};

// Make array of length n like this: [1, 2, ..., n - 1, n]
functions.makeCountingArray = function (len) {
  return functions.makeBlankArray(len).map(function (_, i) { return i + 1; });
};

// Make and shuffle a counting array
functions.makeShuffledArray = function (len) {
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

// Return a random integer from 0 to upper
functions.randomUpTo = function (upper) {
  return Math.floor(Math.random() * (upper + 1));
};

// Generate an entire graph string
functions.stringifyGraph = function (frameObject, rowWidth, rowHeight) {
  var i;

  var result = [];
  for (i = frameObject.array.length; 0 < i; i--) {
    result.push(functions.stringifyGraphRow(frameObject, i, rowWidth, rowHeight));
  }
  return result.join('\n');
};

// Render string to terminal, given string and top-left position
functions.renderToTerminal = function (string, left, top) {
  string.split('\n').forEach(function (row, rowIndex) {
    readline.cursorTo(process.stdout, left, top + rowIndex);
    process.stdout.write(row);
  });
};

// Generate a single graph row string
functions.stringifyGraphRow = function (frameObject, renderMinValue, width, rowHeight) {
  var rowLayerColumns = function (array, selected) {
    return array.map(function (value, index) {
      var columnWidth = Math.round(widthMultiplier * (index + 1)) - Math.round(widthMultiplier * index);
      return functions.makeBlankArray(columnWidth, renderMinValue <= value ? (~selected.indexOf(index) ? COLUMN_SELECTED : COLUMN_ELEMENT) : COLUMN_BLANK).join('');
    }).join('');
  };
  var widthMultiplier = width / frameObject.array.length;
  var i; var row;
  var rowLayer = BORDER_LEFT + rowLayerColumns(frameObject.array, frameObject.comparingIndices) + BORDER_MID + rowLayerColumns(frameObject.extraData.array, frameObject.extraData.comparingIndices) + BORDER_RIGHT;

  row = rowLayer;
  for (i = 1; i < rowHeight; i++) row += '\n' + rowLayer;

  return row;
};

module.exports = functions;
