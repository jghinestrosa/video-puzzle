(function(document, navigator) {
  'use strict';
  
  var $ = document.querySelector.bind(document);

  var video = document.createElement('video');
  //var video = $('video');
  var canvas = $('canvas');
  var ctx = canvas.getContext('2d');

  var canvasSize = {};

  var piecesPerRow = 5;
  var numberOfRows = piecesPerRow;

  var pieceSize;

  var videoWidth;
  var videoHeight;

  var matrix;

  var currentPiece;

  function handleStream(stream) {
    console.log('handling...');
    console.log(stream);
    video.src = URL.createObjectURL(stream);
  }

  function handleError(err) {
    throw new Error(err);
  }

  function onVideoLoaded() {
    videoWidth = video.videoWidth;
    videoHeight = video.videoHeight;

    var minSize = Math.min(videoWidth, videoHeight);
    console.log(minSize);
    setCanvasSize(minSize, minSize);

    setPieceSize(minSize / piecesPerRow);

    matrix = createMatrix(numberOfRows, piecesPerRow);
    console.log(matrix);

    startPainting();
  }

  function startPainting() {
    requestAnimationFrame(startPainting);
    drawMatrix(matrix, video);
    drawCurrentPiece(currentPiece, video);
  }

  function setCanvasSize(width, height) {
    canvas.width = width;
    canvas.height = height;

    canvasSize.width = width;
    canvasSize.height = height;
  }

  function setPieceSize(size) {
    pieceSize = size;
  }

  function createMatrix(rows, columns) {
    var matrix = [];
    //var counter = 0;

    for (var i = 0; i < rows; i++) {
      var row = [];
      for (var j = 0; j < columns; j++) {
        row.push({
          row: i,
          column: j,
        });

        //counter++;
      }
      matrix.push(row);
    }

    return matrix;
  }

  function swapPieces(matrix, from, to) {
    var pieceFrom = matrix[from.row][from.column];
    var pieceTo = matrix[to.row][to.column];

    matrix[from.row][from.column] = pieceTo;
    matrix[to.row][to.column] = pieceFrom;
  }

  function getPiece(matrix, number) {
    return matrix[number];
  }

  function drawVideo(video) {
    var x;
    var y;

    for (var i = 0; i < numberOfRows; i++) {
      y = i * pieceSize;

      for (var j = 0; j < piecesPerRow; j++) {
        x = j * pieceSize;

        ctx.drawImage(video, x, y, pieceSize, pieceSize, x, y, pieceSize, pieceSize);
      }
    }
    //ctx.drawImage(video, 0, 0);
  }

  function drawMatrix(matrix, video) {
    var sx;
    var sy;
    var dx;
    var dy;
    var row;
    var column;

    for (var i = 0; i < matrix.length; i++) {
      row = matrix[i];
      dy = i * pieceSize;

      for (var j = 0; j < row.length; j++) {
        dx = j * pieceSize;

        if (row[j] === null) {
          ctx.fillRect(dx, dy, pieceSize, pieceSize);
          continue;
        }

        sx = row[j].column * pieceSize;
        sy = row[j].row * pieceSize;

        ctx.drawImage(video, sx, sy, pieceSize, pieceSize, dx, dy, pieceSize, pieceSize);
        ctx.strokeStyle = '#FFFF00';
        ctx.strokeRect(dx, dy, pieceSize, pieceSize);
      }
    }

    //for (var i = 0; i < piecesIndexes.length; i++) {
      //column = i % piecesPerRow;
      //row = Math.floor(i / numberOfRows);
      //sx = column * pieceSize;
      //sy = row * pieceSize;

      //piece = matrix[i];
      //dx = piece.column * pieceSize;
      //dy = piece.row * pieceSize;

      //ctx.drawImage(video, sx, sy, pieceSize, pieceSize, dx, dy, pieceSize, pieceSize);
    //}

    //for (var i = 0; i < matrix.length; i++) {
      //var row = matrix[i];
      //y = i * pieceSize;

      //for (var j = 0; j < row.length; j++) {
        //x = j * pieceSize;
        //ctx.drawImage(video, x, y, pieceSize, pieceSize, x, y, pieceSize, pieceSize);
      //}
    //}
  }

  function drawCurrentPiece(currentPiece, video) {
    if (!currentPiece) {
      return;
    }

    var sx = currentPiece.value.column * pieceSize;
    var sy = currentPiece.value.row * pieceSize;

    ctx.drawImage(video, sx, sy, pieceSize, pieceSize, currentPiece.x - currentPiece.offset.x, currentPiece.y - currentPiece.offset.y, pieceSize, pieceSize);
  }

  function getPositionFromCoordinates(x, y) {
    return {
      column: Math.floor(x / pieceSize),
      row: Math.floor(y / pieceSize)
    };
  }

  function handleMouseDown(evt) {
    console.log(evt);
    var x = evt.pageX - canvas.offsetLeft;
    var y = evt.pageY - canvas.offsetTop;

    var position = getPositionFromCoordinates(x, y);

    var column = position.column;
    var row = position.row;

    var edgeX = column * pieceSize;
    var edgeY = row * pieceSize;

    console.log(row, column);

    currentPiece = {
      x: x,
      y: y,
      value: matrix[row][column],
      position: {
        row: row,
        column: column
      },
      offset: {
        x: x - edgeX,
        y: y - edgeY
      }
    };

    matrix[row][column] = null;
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

    if (position.row === currentPiece.position.row && position.column === currentPiece.position.column) {
      matrix[position.row][position.column] = currentPiece.value;
      currentPiece = null;
      return;
    }

    var pieceToSwap = matrix[position.row][position.column];
    matrix[position.row][position.column] = currentPiece.value;
    matrix[currentPiece.position.row][currentPiece.position.column] = pieceToSwap;
    currentPiece = null;
  }

  video.addEventListener('loadeddata', onVideoLoaded);

  canvas.addEventListener('mousedown', function(evt) {
    handleMouseDown(evt);
    canvas.addEventListener('mousemove', handleMouseMove);
  });

  canvas.addEventListener('mouseup', function(evt) {
    handleMouseUp(evt, handleMouseMove);
  });


  navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

  navigator.getUserMedia({video: true}, handleStream, handleError);


}(document, navigator));
