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

  function get(row, column) {
    return matrix[row][column];
  }

  function set(row, column, value) {
    matrix[row][column] = value;
  }

  function getRow(row) {
    return matrix[row];
  }

  function getRows() {
    return rows;
  }

  function getColumns() {
    return columns;
  }

  return {
    get: get,
    set: set,
    getRow: getRow,
    getRows: getRows,
    getColumns: getColumns
  };
}

module.exports = {
  create: createMatrix
};
