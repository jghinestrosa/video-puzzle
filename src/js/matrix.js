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

  function swap(from, to) {
    var valueFrom = get(from.row, from.column);
    set(from.row, from.column, get(to.row, to.column));
    set(to.row, to.column, valueFrom);
  }

  function shuffle(list) {
    var elem;
    var index;

    for (var i = list.length - 1; i >= 1; i--) {
      index = Math.floor(Math.random() * i);
      elem = list[index];
      list[index] = list[i];
      list[i] = elem;
    }
  }

  function shuffleMatrix() {
    for (var i = 0; i < matrix.length; i++) {
      shuffle(matrix[i]);
    }

    shuffle(matrix);
  }

  function isSort() {
    var elem;
    
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < columns; j++) {
        elem = matrix[i][j];
        if (i !== elem.row || j !== elem.column) {
          return false;
        }
      }
    }

    return true;
  }

  return {
    get: get,
    set: set,
    getRow: getRow,
    getRows: getRows,
    getColumns: getColumns,
    swap: swap,
    isSort: isSort,
    shuffle: shuffleMatrix
  };
}

module.exports = {
  create: createMatrix
};
