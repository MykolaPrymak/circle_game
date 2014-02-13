Storage = Class.extend({
  init: function() {
    if (this.isHaveLocalStorage() && localStorage.getItem('data')) {
      this.data = JSON.parse(localStorage.getItem('data'));
    } else {
      this.reset();
    }
  },
  reset: function() {
    this.data = {
      isAudioEnabled: true,
      maxScore: 0
    }
  },
  save: function() {
    if (this.isHaveLocalStorage()) {
      localStorage.setItem('data', JSON.stringify(this.data))
    }
  },
  clear: function() {
    this.reset();
    this.save();
  },
  isHaveLocalStorage: function() {
    return window.localStorage;
  },
  isHaveProperty: function(name) {
    return !!this.data.hasOwnProperty(name)
  },
  get: function(name) {
    if (this.isHaveProperty(name)) {
      return this.data[name];
    }
    return null;
  },
  setAudioState: function(state) {
    this.data.isAudioEnabled = !!state;
    this.save();
  },
  getAudioState: function() {
    return this.data.isAudioEnabled;
  },
  setMaxScore: function(score) {
    if (score > this.data.maxScore) {
      this.data.maxScore = ~~score;
      this.save();
    }
  },
  getMaxScore: function() {
    return this.data.maxScore;
  }
});