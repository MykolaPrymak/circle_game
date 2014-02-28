define(['underscore', 'particle'], function(_, Particle) {
  var DRON_MAX_SPEED = (60 * 7); // MAX FPS * maximum time to cross the display
  var Dron = Particle.extend({
    init: function(maxWidth, maxHeight) {
      this._super(maxWidth, maxHeight);

      this.speedX = Math.random() * (maxWidth / DRON_MAX_SPEED);
      this.speedY = Math.random() * (maxHeight / DRON_MAX_SPEED);

      if (Math.random() > 0.5) {
        this.speedX *= -1;
      }
      if (Math.random() > 0.5) {
        this.speedY *= -1;
      }
    },
    tick: function () {
      this.y += this.speedY;
      this.x += this.speedX;

      if (this.edge) {
        // Check the collisions with borders
        if (
          ((this.x <= this.radius) && (this.speedX < 0)) ||
          ((this.x >= this.maxWidth - this.radius) && (this.speedX > 0))
        ){
          this.speedX *= -1;
          this.speedY += (Math.random() * 5);
        }

        if (
          ((this.y <= this.radius) && (this.speedY < 0)) ||
          ((this.y >= this.maxHeight - this.radius) && (this.speedY > 0))
        ){
          this.speedY *= -1;
          this.speedX += (Math.random() * 5);
        }
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
  
  return Dron;
});