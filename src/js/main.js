'use strict';

var matrix = require('./matrix.js');
var canvas = require('./canvas.js');

var $ = document.querySelector.bind(document);

// Video config
var video = $('video');

// End message
var endingContainer = $('#ending-container');
var endingResult = $('#ending #result');

// Puzzle pieces config
var piecesPerRow = 5;
var numberOfRows = piecesPerRow;

function handleStream(stream) {
  video.src = URL.createObjectURL(stream);
}

function handleError(err) {
  throw new Error(err);
}

function onVideoLoaded() {

  // Make a squared canvas
  var minSize = Math.min(video.videoWidth, video.videoHeight);

  var pieceSize = minSize / piecesPerRow;
  
  var board = matrix.create(numberOfRows, piecesPerRow);

  canvas.init({
    matrix: board,
    video: video,
    width: minSize,
    height: minSize,
    pieceSize: pieceSize
  });

  // Buttons
  $('#shuffle').addEventListener('click', board.shuffle);
  $('#sort').addEventListener('click', function() {
    board.sort();
    endingResult.textContent = 'lose';
    endingContainer.classList.add('visible');
  });

  $('#restart').addEventListener('click', function() {
    endingContainer.classList.remove('visible');
  });

  canvas.on('win', function() {
    endingResult.textContent = 'win';
    endingContainer.classList.add('visible');
  });
}


video.addEventListener('loadeddata', onVideoLoaded);

navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

/* Start to receive a video stream from the webcam */
navigator.getUserMedia({video: true}, handleStream, handleError);
