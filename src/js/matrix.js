'use strict';

function createMatrix(rows, columns) {
  var matrix = [];

  for (var i = 0; i < rows; i++) {
    var row = [];
    for (var j = 0; j < columns; j++) {
      row.push({
        row: i,
        column: j,
      });
    }

    matrix.push(row);
  }

  return matrix;
}

module.exports = {
  create: createMatrix
};
