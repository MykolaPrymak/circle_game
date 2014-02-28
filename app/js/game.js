/* global requestAnimationFrame:true */

define(['underscore', 'eventemiter', 'audio', 'storage', 'particle', 'dron', 'player'], function(_, EventEmiter, AudioManager, Storage, Particle, Dron, Player) {
  var PARTICLE_COUNT = 30;
  var REFRESH_INNTERVAL = 20;

  var Game = EventEmiter.extend({
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

      this.audio.on('music:ready', function(evt, name) {
        // Play first loaded music
        if (!self.audio.isMusicPlay()) {
          self.audio.playMusic(name);
        }
      });

      this.createParticles();
      
      //SpriteManager.init();

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
      this.trigger('score:update', [this.score]);
    },
    stop: function() {
      this.running = false;
      this.canvas.className = '';
      this.storage.setMaxScore(this.score);

      this.trigger('end', {
        score: this.score,
        win: this.player.isDead(),
        maxScore: this.storage.getMaxScore()
      });
    },
    renderQueue: function(callback) {
      callback = _.bind(callback, this);
      if (!!window.requestAnimationFrame) {
        //setTimeout(function() {requestAnimationFrame(callback);}, REFRESH_INNTERVAL);
        requestAnimationFrame(callback);
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
      this.canvas = canvas;
      this.canvasWidth = window.innerWidth;
      this.canvasHeight = window.innerHeight;
    },
    createParticles: function() {
      var
        self = this,
        particle = null;

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
      document.addEventListener('touchmove', function(evt) {
        evt.preventDefault();
        if (evt.touches.length == 1) {
          var
          touch = evt.touches[0],
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
  });

  return Game;
});