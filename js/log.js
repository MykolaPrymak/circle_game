define(['underscore'], function(_) {
  /**
   * @constant
   */
  var LOG_LEVEL_SILENT = 0;
  /**
   * @constant
   */
  var LOG_LEVEL_INFO   = 1;
  /**
   * @constant
   */
  var LOG_LEVEL_WARING = 2;
  /**
   * @constant
   */
  var LOG_LEVEL_ERROR  = 3;
  /**
   * @constant
   */
  var LOG_LEVEL_DEBUG  = 4;

  var Log = function(level) {
    this.level = level;
  };

  _.each(['info', 'debug', 'error', 'warn'], function(name, level) {
    Log.prototype[name] = function() {
      if (window.console && (level < this.level)) {
        window.console[name].apply(window.console, arguments);
      }
    };
  });

  window.log = new Log(LOG_LEVEL_DEBUG);
  return window.log;
});