"use strict";

var Dynamics = require('./dynamics.js');

var smallBeat = function(el, count) {
  var duration = [300, 150];
  var scales = [1.05, 1.0];
  var friction = [200, 100];
  var anticipationSize = [100, 67];
  var frequency = [1000, 1];

  Dynamics.animate(el, {
    scale: scales[count]
  }, {
    type: Dynamics.spring,
    duration: 757,
    frequency: frequency[count],
    friction: 1000,
    anticipationSize: anticipationSize[count],
    anticipationStrength: 1000
  })

  if (count < 3) {
    count++;
    setTimeout(function() { smallBeat(el, count) }, duration[count] * 1.10);
  }

}

var el = document.getElementById("logo");
setInterval (function() { smallBeat(el, 0) }, 3500);
