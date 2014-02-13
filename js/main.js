

var PARTICLE_COUNT = 30;
var PARTICLE_RADIUS_MIN = 5;
var PARTICLE_RADIUS_MAX = 40;
var DOUBLE_PI = Math.PI * 2;
var REFRESH_INNTERVAL = 20;



var exp = Math.exp;
var floor = Math.floor;
var min = Math.min;
//var random = Math.random;


define(['vendor/underscore.min', 'app'], function(_, App) {
//  window.addEventListener('load', function() {
      app = new App();
      document.getElementById('score').innerHTML = 'Loaded!!!';
//  }, false);

});