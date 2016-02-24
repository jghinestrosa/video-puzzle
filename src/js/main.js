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

var board;
var started = false;

function handleStream(stream) {
  video.src = URL.createObjectURL(stream);
}

function handleError(err) {
  throw new Error(err);
}

function newGame() {
  started = true;
  board.shuffle();
  canvas.setInteractive(true);
  $('#sort').classList.remove('disabled');
}

function surrender() {
  if (!started) {
    return;
  }

  board.sort();
  endingResult.textContent = 'lose';
  canvas.setInteractive(false);
  endingContainer.classList.add('visible');
}

function win() {
  endingResult.textContent = 'win';
  endingContainer.classList.add('visible');
}

function restart() {
  endingContainer.classList.remove('visible');
  newGame();
}

function onVideoLoaded() {

  // Make a squared canvas
  var minSize = Math.min(video.videoWidth, video.videoHeight);

  var pieceSize = minSize / piecesPerRow;
  
  board = matrix.create(numberOfRows, piecesPerRow);

  canvas.init({
    matrix: board,
    video: video,
    width: minSize,
    height: minSize,
    pieceSize: pieceSize
  });

  // Buttons
  $('#shuffle').addEventListener('click', newGame);
  $('#sort').addEventListener('click', surrender);
  $('#restart').addEventListener('click', restart);

  canvas.on('win', win);
}


video.addEventListener('loadeddata', onVideoLoaded);

navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

/* Start to receive a video stream from the webcam */
navigator.getUserMedia({video: true}, handleStream, handleError);
