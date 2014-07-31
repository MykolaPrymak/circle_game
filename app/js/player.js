define(['particle', 'log'], function(Particle, log) {
  // MAX FPS * maximum time to cross the display
  var PLAYER_MAX_SPEED = (60 * 5);
  var DOUBLE_PI = Math.PI * 2;
  var DRAW_PATH_DISTANCE = 300;

  var Player = Particle.extend({
    init: function(maxWidth, maxHeight) {
      this._super(maxWidth, maxHeight);
      // Set the initial position and size
      this.reset();
      // Max speed
      this.speed = (Math.max(maxWidth, maxHeight) / PLAYER_MAX_SPEED);
      this.enabled = false;
    },
    play: function() {
      this.enabled = true;
      this.reset();
    },
    stop: function() {
      this.enabled = false;
    },
    reset: function() {
      this.x = (this.maxWidth / 2);
      this.y = (this.maxHeight / 2);
      this.radius = 7;

      this.dstX = this.x; // Destination position
      this.dstY = this.y;

      this.speedX = 0; // Speed by x axis
      this.speedY = 0; // Speed by y axis

      this.dead = false;
    },
    draw: function(ctx) {
      if (this.enabled) {
        this._super(ctx);
        if (this.getDistanceTo(this.dstX, this.dstY) > DRAW_PATH_DISTANCE) {
          this.drawTarget(ctx);
        }
      }
    },
    drawTarget: function(ctx) {
      if (ctx && ctx.beginPath) {
        ctx.save();

        ctx.globalCompositeOperation = 'xor';
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = .5;
        ctx.strokeStyle = '#ff0000';

        ctx.beginPath();

        ctx.arc(this.dstX, this.dstY, 15, 0, DOUBLE_PI);

        ctx.moveTo(this.dstX -20, this.dstY);
        ctx.lineTo(this.dstX + 20, this.dstY);
        ctx.moveTo(this.dstX, this.dstY - 20);
        ctx.lineTo(this.dstX, this.dstY + 20);

        ctx.closePath();
        ctx.stroke();

        ctx.restore();
      }
    },
    tick: function() {
      if ((this.dstX !== this.x) || (this.dstY !== this.y)) {
        if (
          (Math.abs(this.x - this.dstX) < this.radius) ||
          (Math.abs(this.y - this.dstY) < this.radius)
        ) {
          this.moveTo(this.dstX, this.dstY);
        }

        if (Math.abs(this.x - this.dstX) < this.speedX) {
          this.speedX = 0;
          this.x = this.dstX;
        } else {
          
        }
        if (Math.abs(this.y - this.dstY) < this.speedY) {
          this.speedY = 0;
          this.y = this.dstY;
        } else {
          
        }
        this.x += this.speedX;
        this.y += this.speedY;
      }
      return this;
    },
    moveTo: function(x, y) {
      // To int
      x = ~~x;
      y = ~~y;

      // Check borders
      if (x < this.radius) {
        x = this.radius;
      } else if (x > (this.maxWidth - this.radius)) {
        x = this.maxWidth - this.radius;
      }
      if (y < this.radius) {
        y = this.radius;
      } else if (y > (this.maxHeight - this.radius)) {
        y = this.maxHeight - this.radius;
      }
      
      this.dstX = x;
      this.dstY = y;
      // Check the distance to destination point by X and Y axis
      var rangeX = Math.abs(x - this.x);
      var rangeY = Math.abs(y - this.y);

      if (rangeX > rangeY) {
        this.speedX = Math.min(this.speed, rangeX);
        this.speedY = ((rangeY / rangeX) * this.speedX) || 0;
      } else {
        this.speedY = Math.min(this.speed, rangeY);
        this.speedX = ((rangeX / rangeY) * this.speedY) || 0;
      }
      if (x < this.x) {
        this.speedX *= -1;
      }
      if (y < this.y) {
        this.speedY *= -1;
      }
    },
    die: function() {
      this.dead = true;
      this.stop();
    },
    isDead: function() {
      return this.dead;
    }
  });
  
  return Player;
});