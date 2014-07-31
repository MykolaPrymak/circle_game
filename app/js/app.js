define(['underscore', 'game', 'eventemiter', 'storage', 'log'], function(_, Game, EventEmiter, Storage, log) {
  var App = EventEmiter.extend({
    init: function() {
      this._super();
      var self = this;
      
      this.game = new Game(this);
      this.storage = new Storage();
      this.game.setStorage(this.storage);

      this.legend = document.getElementById('legend');
      this.result = document.getElementById('result');
      this.score = document.getElementById('score');
      this.mute = document.getElementById('mute');
      this.fps = document.getElementById('fps');
      this.fullscreen = document.getElementById('fullscreen');

      var scoreUpdateTimer;
      this.game.on('score:update', function(evt, score) {
        self.score.className = 'splah';
        self.score.innerHTML = 'Score: <i>' + score + '</i>';
        clearTimeout(scoreUpdateTimer);
        scoreUpdateTimer = setTimeout(function(){
          self.score.className = '';
        }, 1000);
      });
      this.game.on('fps:update', function(evt, fps) {
        self.fps.innerHTML = fps + 'fps';
      });

      this.game.on('end', function(evt) {
        log.debug('End');
        self.legend.className = 'legend';
        if (evt.win) {
          self.legend.className = 'legend dead';
        } else {
          self.legend.className = 'legend win';
        }
        self.result.innerHTML = 'You score is ' + evt.score + '. Max score is ' + evt.maxScore;
      });
      
      if (!this.storage.getAudioState()) {
        this.mute.className = 'fa fa-volume-off';
        this.game.audio.toggle();
      }
      this.mute.addEventListener('click', function() {
        if (self.game.audio.enabled) {
          self.mute.className = 'fa fa-volume-off';
        } else {
          self.mute.className = 'fa fa-volume-up';
        }
        self.game.audio.toggle();
        self.storage.setAudioState(self.game.audio.isEnabled());
      }, false);

      this.fullscreen.addEventListener('click', function() {
        if (
          !document.fullscreenElement &&    // alternative standard method
          !document.mozFullScreenElement &&  // current working methods
          !document.webkitFullscreenElement &&
          !document.msFullscreenElement
        ) {
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
          } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
          } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
          } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          }
        }
      }, false);

      document.getElementById('startBtn').addEventListener('click', function () {
        if (!self.game.running) {
          log.debug('Start');
          self.game.restart();
          self.legend.className = 'hidden';
        }
      }, false);

      window.addEventListener('resize', function () {
        self.resize(window.innerWidth, window.innerHeight);
      }, false);

      setInterval(_.bind(this.update, this), 1000);
    },
    update: function() {
      // Some update code
    },
    resize: function(width, height) {
      this.game.resize(width, height);
      /*
      if ((width < 600) || (height < 400)) {
        this.game.resize(width, height);
      } else {
        this.game.resize(width, height);
      }
      */
    }
  });

  return App;
});