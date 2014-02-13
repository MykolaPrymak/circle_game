EventEmiter = Class.extend({
  init: function() {
    this.eventListeners = {};
  },
  /**
   * Handle the event to the listeners
   * 
   * @param  String  Event name, to listen. Use space to separate multiply events
   * @param  Object  Event handle function
   * @return self
   */
  on: function(eventType, callback) {
    if (this.eventListeners) {
      //this.init();
    }
    if (typeof(callback) == 'function') {
      var
        eventTypes = eventType.toLowerCase().replace(/\s+/, ' ').split(' '),
        eventListeners = this.eventListeners;
      _.each(eventTypes, function(type) {
        // Initialise the event listeners section on firs use
        if (!_.isArray(eventListeners[type])) {
          eventListeners[type] = [];
        }
        eventListeners[type].push(callback);
      });
    }
    return this;
  },
  /**
   * Handle the event to the listeners
   * 
   * @param  String  Event aname
   * @param  Object  Event data to send in the event handlers
   * @return self
   */
  trigger: function(eventType, extraParameters) {
    var
      event,
      callbacks,
      self = this
      ;
    if (_.isObject(eventType)) {
      event = eventType;
    } else {
      event = {type: eventType};
    }
    event.type = (event.type || '').toLowerCase();
    if (_.isObject(extraParameters)) {
      _.extend(event, extraParameters)
    }
    callbacks = this.eventListeners[event.type] || [];
    _.each(callbacks, function(callback) {
        try {
          // Make the copy of event data and call the callback with all additional parameters
          var kjkj = [_.extend(event)].concat(extraParameters);
          callback.apply(self, [_.extend(event)].concat(extraParameters));
        } catch (e) {
          //log(e);
        }
    });
    return this;
  }
});