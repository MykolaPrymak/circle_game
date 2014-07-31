define(['underscore', 'class'], function(_, Class) {

  var DOUBLE_PI = Math.PI * 2;
  var PARTICLE_RADIUS_MIN = 5;
  var PARTICLE_RADIUS_MAX = 40;

  function square(x) {
    return x * x;
  }
  var sqrt = Math.sqrt;

  var Particle = Class.extend({
    init: function (maxWidth, maxHeight) {
      this.maxWidth = ~~maxWidth;
      this.maxHeight = ~~maxHeight;
      
      if (!((this.maxWidth > 0) || (this.maxHeight > 0))) {
        throw new RangeError('The particle max positions is set to zero');
      }

      this.x = _.random(maxWidth);
      this.y = _.random(maxHeight);
      this.radius = _.random(PARTICLE_RADIUS_MIN, PARTICLE_RADIUS_MAX);
      this.color = _.sample([
          '#69D2E7',
          '#A7DBD8',
          '#E0E4CC',
          '#F38630',
          '#FA6900',
          '#FF4E50',
          '#F9D423'
        ]);
      //this.opacity = random(0.2, 1);
    },
    draw: function (ctx) {
      if (ctx && ctx.beginPath) {
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
      }
    },
    isCollision: function(entity) {
      if (entity instanceof Particle) {
        var distance = this.getDistanceTo(entity.x, entity.y);
        if (distance < (this.radius + entity.radius)) {
          return true;
        }
      }
      return false;
    },

    getDistanceTo: function(x, y) {
      return sqrt(square(this.x - x) + square(this.y - y));
    }
  });

  return Particle;
});