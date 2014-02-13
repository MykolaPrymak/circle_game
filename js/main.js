
//var AUDIO_FILE = 'res/pink_-_try.mp3';
var AUDIO_FILE = 'res/alex_hepburn_-_under.mp3';
//var AUDIO_FILE = 'res/Ukra_nska_narodna_p_snya-Slonika_zamuchili_klyat_moskal.mp3';
var PARTICLE_COUNT = 30;
var PARTICLE_RADIUS_MIN = 5;
var PARTICLE_RADIUS_MAX = 40;
var DOUBLE_PI = Math.PI * 2;
var REFRESH_INNTERVAL = 20;

var LOG_LEVEL_DEBUG = 0;
var LOG_LEVEL_ERROR = 1;
var LOG_LEVEL_WARING = 2;
var LOG_LEVEL_INFO = 3;

var exp = Math.exp;
var floor = Math.floor;
var min = Math.min;
//var random = Math.random;

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

Game = EventEmiter.extend({
    init: function(app) {
        this._super();
        var self = this;

        this.createCanvas();
        this.initFpsCounter();

        this.app = app;
        this.score = 0;
        this.particles = [];

        this.audio = new AudioManager();
        this.enabled = false;
        this.running = false;
        this.player = new Player(this.canvasWidth, this.canvasHeight);

        this.audio.onLoadMusic(function(name){
          // Play first loaded music
          if (!self.audio.isMusicPlay()) {
            self.audio.playMusic(name)
          }
        });
        this.createParticles();
        
        SpriteManager.init();

        this.tick();
    },
    setStorage: function(storage) {
      this.storage = storage;
    },
    initFpsCounter: function() {
      var self = this;
      this.fpsCounter = 0;
      this.fps = 0;
      setInterval(function(){
          self.fps = self.fpsCounter;
          self.fpsCounter = 0;
          self.trigger('fps:update', [self.fps]);
      }, 1000);
    },
    restart: function() {
      this.canvas.className = 'running';
      this.score = 0;
      this.running = true;
      _.invoke(this.particles, 'respawn');
      this.player.play();
      this.audio.playMusic('Lee_Rosevere_-_03_-_Plateau');
      document.getElementById('score').innerHTML = 'Score: <i>' + this.score + '</i>';
    },
    stop: function() {
      var legend = document.getElementById('legend');
      var result = document.getElementById('result');
      legend.className = 'legend';
      this.running = false;
      this.canvas.className = '';
      if (this.player.isDead()) {
        legend.className = 'legend dead';
      } else {
        legend.className = 'legend win';
      }
      this.storage.setMaxScore(this.score);
      result.innerHTML = 'You score is ' + this.score + '. Max score is ' + this.storage.getMaxScore();
    },
    renderQueue: function(callback) {
        callback = _.bind(callback, this);
        if (!!window.requestAnimationFrame) {
            setTimeout(function() {requestAnimationFrame(callback);}, REFRESH_INNTERVAL);
            //requestAnimationFrame(callback);
        } else {
            setTimeout(callback, REFRESH_INNTERVAL);
        }
    },
    createCanvas: function() {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        // Canvas width/height to full page width/height
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Append
        document.body.appendChild(canvas);
        this.ctx = ctx;
        this.canvas = canvas
        this.canvasWidth = window.innerWidth;
        this.canvasHeight = window.innerHeight;
    },
    createParticles: function() {
        var
            self = this,
            particle = null,
            audio = null,
            i;
        _.times(PARTICLE_COUNT, function() {
            particle = new Dron(self.canvas.width, self.canvas.height);
            self.particles.push(particle);
        });

        this.canvas.addEventListener('mousemove', function(evt) {
            var
              x = evt.clientX,
              y = evt.clientY;
            
            if (self.running) {
              self.player.moveTo(x, y);
            }
        });
        this.canvas.addEventListener('touchmove', function(evt) {
          if (evt.touches.length == 1) {
          var touch = evt.touches[0];
            var
              x = touch.pageX,
              y = touch.pageY;
            if (self.running) {
              self.player.moveTo(x, y);
            }
          }
        });
        /*
        this.canvas.addEventListener('click', function(evt) {
            //console.dir(evt);
            var
                x = evt.clientX,
                y = evt.clientY,
                i, particle,
                len = self.particles.length;
            for (i = 0 ; i < len; i++) {
                particle = self.particles[i];
                if (
                    (
                        ((x - particle.x) * (x - particle.x)) + 
                        ((y - particle.y) * (y - particle.y))
                    ) <= Math.pow((particle.radius  * exp(particle.pulse)), 2 )
                ) {
                    // Kill
                    particle.y = -200;
                    if (particle.moskal) {
                        AudioManager.playSound('wet_smash');
                        AudioManager.playSound('damm_moskals');
                        self.score += 100;
                    } else {
                        AudioManager.playSound('combo_hit');
                        self.score++;
                    }
                    var score = document.getElementById('score');
                    score.className = 'splah';
                    score.innerHTML = 'Score: <i>' + self.score + '</i>';
                    break;
                }
            }
        });
        */
    },
    tick: function() {
        _.invoke(this.particles, 'tick');
        if (this.running) {
          this.player.tick();
          this.checkCollision();
        }
      
        this.render();
        // Add the draw to queue
        this.renderQueue(this.tick);
    },
    render: function() {
        // clear the canvas
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        _.invoke(this.particles, 'draw', this.ctx);
        if (this.running) {
          this.player.draw(this.ctx);
        }
        this.fpsCounter++;
    },
    checkCollision: function() {
      var
        self = this,
        player = self.player;
      _.each(this.particles, function(particle) {
        if (player.isCollision(particle)) {
          if (particle.radius > player.radius) {
            self.audio.playSound('big_bomb');
            player.die();
            self.stop();
          } else {
            self.audio.playSound('achievement');
            player.radius += (particle.radius / 10);
            
            self.score += Math.ceil(particle.radius / 10);
            
            self.trigger('score:update', [self.score]);

            particle.respawn();
            if (player.radius > 100) {
              player.stop();
              self.stop();
            }
          }
        }
      });
    },
    resize: function(width, height) {
      this.canvasWidth = width;
      this.canvasHeight = height;
      this.canvas.width = width;
      this.canvas.height = height;
      _.each(this.particles, function(particle) {
        particle.maxWidth = width;
        particle.maxHeight = height;
      });
      this.player.maxWidth = width;
      this.player.maxHeight = height;
    }
  }
);

window.addEventListener('load', function() {
    //console.log(Notification.permission)
    app = new App();
}, false);