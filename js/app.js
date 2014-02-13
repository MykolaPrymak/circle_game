define(['game', 'log', 'eventemiter', 'storage'], function(Game, Log, EventEmiter, Storage) {
  App = EventEmiter.extend({
    init: function() {
      this._super();
      var self = this;
      
      this.game = new Game();
      this.storage = new Storage();
      this.game.setStorage(this.storage);
      
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
      
      this.score = document.getElementById('score');
      this.mute = document.getElementById('mute');
      this.fps = document.getElementById('fps');
      this.fullscreen = document.getElementById('fullscreen');
      
      if (!this.storage.getAudioState()) {
        this.mute.className = 'fa fa-volume-off';
        this.game.audio.toggle();
      }
      this.mute.addEventListener('click', function (evt) {
        // If Alt or Ctrl is press - ignore
        //console.log('keydown event:' +evt.charCode + '/' + evt.keyCode);
        if (self.game.audio.enabled) {
          self.mute.className = 'fa fa-volume-off';
        } else {
          self.mute.className = 'fa fa-volume-up';
        }
        self.game.audio.toggle();
        self.storage.setAudioState(self.game.audio.isEnabled());
      }, false);

      this.fullscreen.addEventListener('click', function (evt) {
        if (!document.fullscreenEnabled) {
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
          exitFullscreen()
        }
      }, false);

      document.getElementById('startBtn').addEventListener('click', function (evt) {
        if (!self.game.running) {
          self.game.restart();
          document.getElementById('legend').className = 'hidden';
        }
      }, false);

      window.addEventListener('resize', function (evt) {
          self.resize(window.innerWidth, window.innerHeight)
      }, false);
      setInterval(_.bind(this.update, this), 1000);
    },
    update: function() {
      //this.score.innerHTML = 'Score: <i>' + this.game.score + '</i>';
      
    },
    resize: function(width, height) {
        if ((width < 600) || (height < 400)) {
        
        } else {
          this.game.resize(width, height);
        }
      
    }
  });

  return App;
});