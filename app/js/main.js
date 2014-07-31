/*
var exp = Math.exp;
var floor = Math.floor;
var min = Math.min;
var random = Math.random;
*/
requirejs.config({
  shim: {
    'class' : {
      deps: [],
      exports: 'Class'
    },
    'underscore': {
      exports: '_'
    }
  },
  paths: {
    jquery : [
      '//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min',
      'vendor/jquery/jquery.min'
    ],
    underscore: '../vendor/underscore/underscore-min',
    'class': 'vendor/class'
  }
});

define(['app'], function(App) {
  window.app = new App();
});