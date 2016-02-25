'use strict';

var matrix = require('./matrix.js');
var canvas = require('./canvas.js');

var $ = document.querySelector.bind(document);

// Video config
var video = $('video');

// Buttons
var bShuffle = $('#shuffle');
var bSort = $('#sort');
var bRestart = $('#restart');

// End message
var endingContainer = $('#ending-container');
var endingResult = $('#ending #result');

// Puzzle pieces config
var piecesPerRow = 5;
var numberOfRows = piecesPerRow;

var board;
var started = false;
var finished = false;

function handleStream(stream) {
  video.src = URL.createObjectURL(stream);
}

function handleError(err) {
  throw new Error(err);
}

function newGame() {
  if (finished) {
    return;
  }

  board.shuffle();
  canvas.setInteractive(true);
  $('#sort').classList.remove('disabled');
  started = true;
  finished = false;
}

function surrender() {
  if (!started || finished) {
    return;
  }

  board.sort();
  endingResult.textContent = 'lose';
  canvas.setInteractive(false);
  endingContainer.classList.add('visible');
  finished = true;
  started = false;
}

function win() {
  endingResult.textContent = 'win';
  endingContainer.classList.add('visible');
  finished = true;
  started = false;
}

function restart() {
  endingContainer.classList.remove('visible');
  finished = false;
  started = true;
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

  // Listen clicks on buttons
  bShuffle.addEventListener('click', newGame);
  bSort.addEventListener('click', surrender);
  bRestart.addEventListener('click', restart);

  canvas.on('win', win);
}

video.addEventListener('loadeddata', onVideoLoaded);

navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

/* Start to receive a video stream from the webcam */
navigator.getUserMedia({video: true}, handleStream, handleError);
