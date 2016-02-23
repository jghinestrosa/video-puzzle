'use strict';

function createMatrix(rows, columns) {
  var matrix = [];

  for (var i = 0; i < rows; i++) {
    var row = [];
    for (var j = 0; j < columns; j++) {
      row.push({
        row: i,
        column: j
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

    return list;
  }

  function concat() {
    return matrix.reduce(function(prev, next) {
      return prev.concat(next);
    });
  }

  function split(list) {
    var splitted = [];
    for (var i = 0; i < rows; i++) {
      splitted.push(list.splice(0, columns));
    }
    
    return splitted;
  }

  function shuffleMatrix() {

    // Reduce the matrix to an array with concatenated rows,
    // shuffle the array, and split it in multiple rows again
    matrix = split(shuffle(concat()));
  }

  function sort(list) {
    for (var i = 0; i < list.length; i++) {
      for (var j = 0; j < list.length - 1 - i; j++) {
        if (list[j].row > list[j+1].row || (list[j].row === list[j+1].row && list[j].column > list[j+1].column)) {
          var elem = list[j];
          list[j] = list[j + 1];
          list[j + 1] = elem;
        }
      }
    }

    return list;
  }

  function sortMatrix() {

    // Reduce the matrix to an array with concatenated rows,
    // sort the array, and split it in multiple rows again
    matrix = split(sort(concat()));
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

    trigger('sort');
    return true;
  }

  // Events

  var listeners = {};

  function on(event, callback) {
    if (!listeners[event]) {
      listeners[event] = [];
    }

    listeners[event].push(callback);
  }

  function trigger(event) {
    var handlers = listeners[event];

    if (handlers) {
      handlers.forEach(function(callback) {
        callback();
      });
    }
  }

  return {
    get: get,
    set: set,
    getRow: getRow,
    getRows: getRows,
    getColumns: getColumns,
    swap: swap,
    isSort: isSort,
    shuffle: shuffleMatrix,
    sort: sortMatrix,
    on: on
  };
}

module.exports = {
  create: createMatrix
};
