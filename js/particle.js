define(['vendor/class'], function() {
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
  return Particle;
});