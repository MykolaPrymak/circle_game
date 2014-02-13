Particle = Class.extend({
    init: function (maxWidth, maxHeight) {
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;

        this.x = _.random(maxWidth);
        this.y = _.random(maxHeight);
        this.radius = _.random(PARTICLE_RADIUS_MIN, PARTICLE_RADIUS_MAX); //радиус частиц
        this.color = _.sample(['#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900', '#FF4E50', '#F9D423']); // get the particle color
        //this.opacity = random(0.2, 1);
    },
    draw: function (ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, DOUBLE_PI);
        ctx.fillStyle = this.color;
        //ctx.globalAlpha = (this.opacity);
        
        ctx.closePath();
        ctx.fill();
        //ctx.fillStyle = '#000';
        //ctx.fillText('x:' + this.x.toFixed(2), this.x, this.y);
        //ctx.fillText('y:' + this.y.toFixed(2), this.x, this.y+10);
        ctx.restore();
    },
    isCollision: function(entity) {
      if (entity instanceof Particle) {
        var distance = Math.sqrt(Math.pow((this.x - entity.x), 2) + Math.pow((this.y - entity.y), 2));
        if (distance < (this.radius + entity.radius)) {
          return true;
        }
      }
      return false;
    }
});

Dron = Particle.extend({
    init: function(maxWidth, maxHeight) {
        this._super(maxWidth, maxHeight);

        this.speedX = Math.random() * (maxWidth / 180);
        this.speedY = Math.random() * (maxHeight / 180);

        if (Math.random() > .5) {
            this.speedX *= -1;
        }
        if (Math.random() > .5) {
            this.speedY *= -1;
        }

    },
    tick: function () {
      this.y += this.speedY;
      this.x += this.speedX;

      if (this.edge) {
        if (((this.x <= this.radius) && (this.speedX < 0)) || ((this.x >= this.maxWidth - this.radius) && (this.speedX > 0))){
          this.speedX *= -1;
          this.speedY += (Math.random() * 5);
        }
        if (((this.y <= this.radius) && (this.speedY < 0)) || ((this.y >= this.maxHeight - this.radius) && (this.speedY > 0))){
          this.speedY *= -1;
          this.speedX += (Math.random() * 5);
        }
        return;
      } else {
        // Check if particle go to edge of scren
        if (
          (this.y < -this.radius) ||
          (this.x < -this.radius) ||
          (this.y > this.maxHeight + this.radius) ||
          (this.x > this.maxWidth + this.radius)
        ) {
          this.respawn();
        }
      }
    },
    respawn: function() {
      this.init(this.maxWidth, this.maxHeight);
      if (this.speedX < 0) {
        if (this.speedY < 0) {
          // bottom rigth to top left // Left corner
          this.x = _.random(-this.radius, this.maxWidth + this.radius);
          this.y = this.maxHeight + this.radius;
        } else {
          // top rigth to bottom left // Bottom corner
          this.x = this.maxWidth - this.radius;
          this.y = _.random(-this.radius, this.maxHeight + this.radius);
        }
      } else {
        if (this.speedY < 0) {
          // bottom left to top right // Right corner
          this.x = -this.radius;
          this.y = _.random(-this.radius, this.maxHeight + this.radius);
        } else {
          // top left to bottom right // Top corner
          this.x = _.random(this.radius, this.maxWidth + this.radius);
          this.y = -this.radius;
        }
      }
      /*

      if (this.speedX < 0) {
        this.x = this.maxWidth + this.radius;
      } else {
        this.x = -this.radius;
      }
      if (this.speedY < 0) {
        this.y = this.maxHeight + this.radius;
      } else {
        this.y = -this.radius;
      }
      */
    }
});

Player = Particle.extend({
    init: function(maxWidth, maxHeight) {
        this._super(maxWidth, maxHeight);
        // Set the initial position and size
        this.reset();
        this.speed = (maxWidth / 125); // Max speed
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
        this._super(ctx)
      }
    },
    tick: function() {
      if ((this.dstX !== this.x) || (this.dstY !== this.y)) {
        if ((Math.abs(this.x - this.dstX) < this.radius) || (Math.abs(this.y - this.dstY) < this.radius)) {
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
      // Check the distance to destination point
      var rangeX = Math.abs(x - this.x);
      var rangeY = Math.abs(y - this.y);

      if (rangeX > rangeY) {
        this.speedX = _.min([this.speed, rangeX]);
        this.speedY = ((rangeY / rangeX) * this.speedX) || 0;
      } else {
        this.speedY = _.min([this.speed, rangeY]);
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