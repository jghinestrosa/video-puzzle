'use strict';

var $ = document.querySelector.bind(document);

var canvas = $('canvas');
var ctx = canvas.getContext('2d');

var video;
var matrix;
var currentPiece;
var pieceSize;

function init(params) {
  matrix = params.matrix;
  video = params.video;
  setCanvasSize(params.width, params.height);
  pieceSize = params.pieceSize;

  startPainting();
}

function setCanvasSize(width, height) {
  canvas.width = width;
  canvas.height = height;
}

function setPieceSize(size) {
  pieceSize = size;
}

function drawMatrix(matrix, video) {
  var sx;
  var sy;
  var dx;
  var dy;
  var column;

  for (var i = 0; i < matrix.getRows(); i++) {
    dy = i * pieceSize;

    for (var j = 0; j < matrix.getColumns(); j++) {
      dx = j * pieceSize;

      if (matrix.get(i, j) === null) {
        ctx.fillRect(dx, dy, pieceSize, pieceSize);
        continue;
      }

      sx = matrix.get(i, j).column * pieceSize;
      sy = matrix.get(i, j).row * pieceSize;

      ctx.drawImage(video, sx, sy, pieceSize, pieceSize, dx, dy, pieceSize, pieceSize);
      ctx.strokeStyle = '#FFFF00';
      ctx.strokeRect(dx, dy, pieceSize, pieceSize);
    }
  }
}

function drawCurrentPiece(currentPiece, video) {
  if (!currentPiece) {
    return;
  }

  var sx = currentPiece.value.column * pieceSize;
  var sy = currentPiece.value.row * pieceSize;

  ctx.drawImage(video, sx, sy, pieceSize, pieceSize, currentPiece.x - currentPiece.offset.x, currentPiece.y - currentPiece.offset.y, pieceSize, pieceSize);
}

function startPainting() {
  requestAnimationFrame(startPainting);
  drawMatrix(matrix, video);
  drawCurrentPiece(currentPiece, video);
}

function getPositionFromCoordinates(x, y) {
  return {
    column: Math.floor(x / pieceSize),
    row: Math.floor(y / pieceSize)
  };
}

/* Event listeners */

function handleMouseDown(evt) {
  var x = evt.pageX - canvas.offsetLeft;
  var y = evt.pageY - canvas.offsetTop;

  var position = getPositionFromCoordinates(x, y);

  var column = position.column;
  var row = position.row;

  var edgeX = column * pieceSize;
  var edgeY = row * pieceSize;

  currentPiece = {
    x: x,
    y: y,
    value: matrix.get(row, column),
    position: {
      row: row,
      column: column
    },
    offset: {
      x: x - edgeX,
      y: y - edgeY
    }
  };

  matrix.set(row, column, null);
}

function handleMouseMove(evt) {
  var x = evt.pageX - canvas.offsetLeft;
  var y = evt.pageY - canvas.offsetTop;

  currentPiece.x = x;
  currentPiece.y = y;
}

function handleMouseUp(evt, mouseMoveHandler) {
  canvas.removeEventListener('mousemove', mouseMoveHandler);

  var x = evt.pageX - canvas.offsetLeft;
  var y = evt.pageY - canvas.offsetTop;

  var position = getPositionFromCoordinates(x, y);

  // If the piece is set in the same spot
  if (position.row === currentPiece.position.row && position.column === currentPiece.position.column) {
    matrix.set(position.row, position.column, currentPiece.value);
    currentPiece = null;
    return;
  }
  
  // Swap pieces
  var pieceToSwap = matrix.get(position.row, position.column);
  matrix.set(position.row, position.column, currentPiece.value);
  matrix.set(currentPiece.position.row, currentPiece.position.column, pieceToSwap);
  currentPiece = null;
}

/* Start listening mouse events*/

canvas.addEventListener('mousedown', function(evt) {
  handleMouseDown(evt);
  canvas.addEventListener('mousemove', handleMouseMove);
});

canvas.addEventListener('mouseup', function(evt) {
  handleMouseUp(evt, handleMouseMove);
});

module.exports = {
  init: init,
  startPainting: startPainting
};

