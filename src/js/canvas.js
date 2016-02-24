'use strict';

var $ = document.querySelector.bind(document);

var canvas = $('canvas');
var ctx = canvas.getContext('2d');

var video;
var matrix;
var currentPiece;
var pieceSize;

// Size from style rules
var canvasStyleWidth;
var canvasStyleHeight;
var pieceStyleSize;

var lastTouch;

function init(params) {
  matrix = params.matrix;
  video = params.video;
  setCanvasSize(params.width, params.height);
  pieceSize = params.pieceSize;
  calculateStyleSizeForPiece();

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

function selectPiece(x, y) {
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

function movePiece(x, y) {
  currentPiece.x = x;
  currentPiece.y = y;
}

function putPiece(x, y) {
  var position = getPositionFromCoordinates(x, y);

  // If the piece is set in the same spot
  if (position.row === currentPiece.position.row && position.column === currentPiece.position.column) {
    matrix.set(position.row, position.column, currentPiece.value);
    currentPiece = null;
    return;
  }
  
  // Swap pieces
  matrix.swap(position, currentPiece.position);
  matrix.set(position.row, position.column, currentPiece.value);
  currentPiece = null;

  // Check if the matrix is sort
  matrix.isSort();
}

function calculateStyleSizeForPiece() {
  canvasStyleWidth = parseInt(window.getComputedStyle($('canvas')).width, 10);
  canvasStyleHeight = parseInt(window.getComputedStyle($('canvas')).height, 10);
  pieceStyleSize = canvasStyleWidth / matrix.getRows();
}

/* Start listening mouse events*/
canvas.addEventListener('mousedown', function(e) {
  var x = e.pageX - canvas.offsetLeft;
  var y = e.pageY - canvas.offsetTop;
  x = x * canvas.width / canvasStyleWidth;
  y = y * canvas.height / canvasStyleHeight;
  selectPiece(x, y);
});

canvas.addEventListener('mousemove', function(e) {
  if (!currentPiece) {
    return;
  }

  var x = e.pageX - canvas.offsetLeft;
  var y = e.pageY - canvas.offsetTop;
  x = x * canvas.width / canvasStyleWidth;
  y = y * canvas.height / canvasStyleHeight;
  movePiece(x, y);
});

canvas.addEventListener('mouseup', function(e) {
  var x = e.pageX - canvas.offsetLeft;
  var y = e.pageY - canvas.offsetTop;
  x = x * canvas.width / canvasStyleWidth;
  y = y * canvas.height / canvasStyleHeight;
  putPiece(x, y);
});

canvas.addEventListener('touchstart', function(e) {
  e.preventDefault();
  e.stopPropagation();

  var x = e.touches[0].pageX - canvas.offsetLeft;
  var y = e.touches[0].pageY - canvas.offsetTop;

  x = x * canvas.width / canvasStyleWidth;
  y = y * canvas.height / canvasStyleHeight;
  selectPiece(x, y);
});

canvas.addEventListener('touchmove', function(e) {
  if (!currentPiece) {
    return;
  }

  e.preventDefault();
  e.stopPropagation();

  var x = e.touches[0].pageX - canvas.offsetLeft;
  var y = e.touches[0].pageY - canvas.offsetTop;
  x = x * canvas.width / canvasStyleWidth;
  y = y * canvas.height / canvasStyleHeight;
  movePiece(x, y);

  lastTouch = e.touches[0];
});

canvas.addEventListener('touchend', function(e) {
  e.preventDefault();
  e.stopPropagation();

  var x = lastTouch.pageX - canvas.offsetLeft;
  var y = lastTouch.pageY - canvas.offsetTop;
  x = x * canvas.width / canvasStyleWidth;
  y = y * canvas.height / canvasStyleHeight;
  putPiece(x, y);
});

window.addEventListener('resize', calculateStyleSizeForPiece); 

module.exports = {
  init: init,
  startPainting: startPainting,
  setPieceSize: setPieceSize
};

