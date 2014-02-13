define(['vendor/class'], function() {
  var LOG_LEVEL_SILENT = 0;
  var LOG_LEVEL_INFO   = 1;
  var LOG_LEVEL_WARING = 2;
  var LOG_LEVEL_ERROR  = 3;
  var LOG_LEVEL_DEBUG  = 4;

  Log = Class.extend({
    init: function(level) {
      this.level = level || LOG_LEVEL_DEBUG;
      if (!window.console) {
          var console = function(){};
          console.log = console.debug = console.error = console.warn = console.info = console;
          window.console = console;
      }
    },
    debug: function() {
      if (this.level >= LOG_LEVEL_DEBUG) {
          console.debug.apply(console, arguments);
      }
    },
    error: function() {
      if (this.level >= LOG_LEVEL_ERROR) {
          console.error.apply(console, arguments);
      }
    },
    warn: function() {
      if (this.level >= LOG_LEVEL_WARING) {
          console.warn.apply(console, arguments);
      }
    },
    info: function() {
      if (this.level >= LOG_LEVEL_INFO) {
          console.info.apply(console, arguments);
      }
    }
  });

  return Log;
});