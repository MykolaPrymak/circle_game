var assert = require('assert');
var expect = require('chai').expect;
var requirejs = require('requirejs');
requirejs.config({
  baseUrl: './js/',
  nodeRequire: require,
  shim: {
    'class' : {
      deps: [],
      exports: 'Class'
    },
    'underscore': {
      exports: '_'
    }
  },
  paths: {
    jquery : [
      '//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min',
      'js/vendor/jquery-1.9.1.min.js'
    ],
    underscore: 'vendor/underscore.min',
    'class': 'vendor/class'
  }
});


describe('Storage', function(){
  var Storage = requirejs('storage');
 
  describe('Creating', function(){
    var storage = new Storage();
    it('should return ok', function(){
      expect(storage).to.be.ok;
    })
    it('should return object', function(){
      expect(storage).to.be.a('object');
    })
    it('should return a not empty object', function(){
      expect(storage).to.not.empty;
    })
    it('should return a object containt the data property', function(){
      expect(storage).to.include.keys('data');
    })

    it('should return a object containt the data property as object', function(){
      expect(storage.data).to.be.a('object');
    })
    it('should return a object containt the data property as not empty object', function(){
      expect(storage.data).to.not.empty;
    })
  })

  describe('Getter/Setter', function(){
    var storage = new Storage();
    it('should return a whole object if the name is not specified', function(){
      expect(storage.get()).to.be.ok;
      expect(storage.get()).to.be.a('object');
      expect(storage.get()).to.not.empty;
      expect(storage.get()).to.include.keys('isAudioEnabled');
    })
    it('should return a true for predefined "isAudioEnabled" property', function(){
      expect(storage.get('isAudioEnabled')).to.be.ok;
      expect(storage.get('isAudioEnabled')).not.to.be.null;
      expect(storage.get('isAudioEnabled')).to.be.a.true;
    })
    it('should return a null if a not exist key', function(){
      expect(storage.get('notExistProperty')).to.be.undeffined;
      expect(storage.get('notExistProperty')).to.not.to.be.false;
      expect(storage.get('notExistProperty')).to.not.to.be.null;

      expect(storage.get('notExistProperty:notExitSubProperty')).to.be.undefined;
      expect(storage.get('notExistProperty:notExitSubProperty')).to.not.to.be.false;
      expect(storage.get('notExistProperty:notExitSubProperty')).to.not.to.be.null;
    })

    it('should return a false if try to set a empty key', function(){
      expect(storage.set()).to.be.false;
    })
    it('should return a true if set a not empty key', function(){
      expect(storage.set('test', 'test')).to.be.true;
    })
    it('should return a true if set a any value', function(){
      expect(storage.set('test')).to.be.true;
      expect(storage.set('test', '')).to.be.true;
      expect(storage.set('test', null)).to.be.true;
      expect(storage.set('test', undefined)).to.be.true;
      expect(storage.set('test', false)).to.be.true;
      expect(storage.set('test', true)).to.be.true;
    })
    it('should return a previsiously stored value', function(){
      storage.clear();

      storage.set('test', true);
      expect(storage.get('test')).to.be.true;

      storage.set('test', 'true');
      expect(storage.get('test')).to.equal('true');

      storage.set('test');
      expect(storage.get('test')).to.be.undefined;

      storage.set('testObj:aaa:bbb:ccc:ddd', 1);
      expect(storage.get('testObj:aaa:bbb:ccc:ddd')).to.be.equal(1);
    })

    it('should delete storage key if undefined value is set', function(){
      storage.clear();

      storage.set('test', true);
      expect(storage.get('test')).to.be.true;
      storage.set('test');
      expect(storage.get('test')).to.be.undefined;
    })

    it('should fail on attempt to set a property of non-object stored in storage', function(){
      storage.clear();

      storage.set('test:test', 'true');
      expect(storage.get('test:test')).to.equal('true');

      // The "true" is not a object and attempt to set a property must get fail and return false
      expect(storage.set('test:test:value', 1)).to.be.false;
    })
  });

  describe('Predefined methods', function(){
    var storage = new Storage();
    describe('Audio state', function(){
      it('should return the initial state', function(){
        storage.clear();
        expect(storage.getAudioState()).to.be.true;
      })
      it('should set/get the audio enabled state', function(){
        storage.clear();

        expect(storage.setAudioState(true)).to.be.true;
        expect(storage.getAudioState()).to.be.true;

        expect(storage.setAudioState(false)).to.be.true;
        expect(storage.getAudioState()).to.be.false;
      })
    });
    describe('Max score', function(){
      it('should return a initial value after the reset', function(){
        storage.clear();
        expect(storage.getMaxScore()).to.equal(0);
      })
      it('should store a max score of a game', function(){
        storage.setMaxScore(-1);
        expect(storage.getMaxScore()).to.equal(0);

        storage.setMaxScore(1);
        expect(storage.getMaxScore()).to.equal(1);

        storage.setMaxScore(0);
        expect(storage.getMaxScore()).to.equal(1);

        storage.setMaxScore(10);
        expect(storage.getMaxScore()).to.equal(10);

        storage.setMaxScore(0);
        expect(storage.getMaxScore()).to.equal(10);

        storage.setMaxScore(-1);
        expect(storage.getMaxScore()).to.equal(10);
      })
    });
  });
})

describe('Particle', function(){
  var Particle = requirejs('particle');
 
  describe('Creating', function(){
    var particle = new Particle(100, 100);
    it('should return ok', function(){
      expect(particle).to.be.ok;
    })
    it('should return object', function(){
      expect(particle).to.be.a('object');
    })
    it('should return a not empty object', function(){
      expect(particle).to.not.empty;
    })
    it('should return a object containt the basic (x, y, radius and color) propertys', function(){
      expect(particle).to.include.keys('x');
      expect(particle.x).to.be.a('number');
      
      expect(particle).to.include.keys('y');
      expect(particle.y).to.be.a('number');
      
      expect(particle).to.include.keys('radius');
      expect(particle.radius).to.be.a('number');
      
      expect(particle).to.include.keys('color');
      expect(particle.color).to.be.a('string');
    })

    it('should position respect the max x,y range', function(){
      expect(particle.x).to.be.at.least(0);
      expect(particle.x).to.be.at.most(particle.maxWidth);

      expect(particle.y).to.be.at.least(0);
      expect(particle.y).to.be.at.most(particle.maxHeight);
    })
    it('should radius be non zero', function(){
      expect(particle.radius).to.be.above(0);
    })
    it('should return a particle with randon position, color and radius', function(){
      var particleA = new Particle(100, 100);
      var particleB = new Particle(100, 100);
      var particleAHash = JSON.stringify({
        x: particleA.x,
        y: particleA.y,
        radius: particleA.radius,
        color: particleA.color
      });
      var particleBHash = JSON.stringify({
        x: particleB.x,
        y: particleB.y,
        radius: particleB.radius,
        color: particleB.color
      });
      expect(particleAHash).not.to.be.equal(particleBHash);
    })

    it('should throw a RangeError if both max x,y is not set or set as zero', function(){
      expect(function() {new Particle();}).to.throw(RangeError);
      expect(function() {new Particle(0, 0);}).to.throw(RangeError);
      expect(function() {new Particle('not a number', 'not a number');}).to.throw(RangeError);
      expect(function() {new Particle('0', 'not a number');}).to.throw(RangeError);

      expect(function() {new Particle(10, 0);}).to.not.throw(Error);
      expect(function() {new Particle(0, 10);}).to.not.throw(RangeError);
      expect(function() {new Particle('10', 'not a number');}).to.not.throw(RangeError);
    })

    it('should return a object containt the draw method', function(){
      expect(particle.draw).to.be.a('function');
    })
  })
  describe('Collision', function(){
    it('should return true if object is close enough for collision', function(){
      var particleA = new Particle(100, 100);
      var particleB = new Particle(100, 100);

      particleA.x = 0;
      particleA.y = 0;
      particleA.radius = 10;

      particleB.x = particleA.x;
      particleB.y = particleA.y;
      particleB.radius = 10;
      expect(particleA.isCollision(particleB)).to.be.true;

      particleB.x = particleA.x + particleA.radius;
      expect(particleA.isCollision(particleB)).to.be.true;
      
      particleB.x = particleA.x;
      particleB.y = particleA.y + particleA.radius;
      expect(particleA.isCollision(particleB)).to.be.true;

      particleB.y = particleA.y + (particleA.radius + particleB.radius) - 1;
      expect(particleA.isCollision(particleB)).to.be.true;

      particleB.x = 100;
      particleB.y = particleA.y;
      particleB.radius = 100;
      expect(particleA.isCollision(particleB)).to.be.true;

      particleB.x = particleA.x;
      particleB.y = 100;
      particleB.radius = 100;
      expect(particleA.isCollision(particleB)).to.be.true;
    })

    it('should return false if object is not close enough for collision', function(){
      var particleA = new Particle(100, 100);
      var particleB = new Particle(100, 100);

      particleA.x = 0;
      particleA.y = 0;
      particleA.radius = 10;

      particleB.x = 40;
      particleB.y = 40;
      particleB.radius = 10;
      expect(particleA.isCollision(particleB)).to.be.false;
      
      particleB.x = particleA.x;
      particleB.y = particleA.y + (particleA.radius + particleB.radius);
      expect(particleA.isCollision(particleB)).to.be.false;

      particleB.x = particleA.x + (particleA.radius + particleB.radius);
      particleB.y = particleA.y;
      expect(particleA.isCollision(particleB)).to.be.false;
    })
  })
})

describe('Dron', function(){
  var Dron = requirejs('dron');
  var Particle = requirejs('particle');
 
  describe('Creating', function(){
    var dron = new Dron(100, 100);
    it('should return ok', function(){
      expect(dron).to.be.ok;
    })
    it('should return object', function(){
      expect(dron).to.be.a('object');
    })
    it('should return a not empty object', function(){
      expect(dron).to.not.empty;
    })
    it('should return a object who inherit the Particle', function(){
      expect(dron).to.be.a.instanceof(Particle);
    })
    it('should return a object contain the speedX and speedY propertys represent the dron speed', function(){
      expect(dron).to.include.keys('speedX');
      expect(dron.speedX).to.be.a('number');

      expect(dron).to.include.keys('speedY');
      expect(dron.speedY).to.be.a('number');
    })

    it('should return a object containt the tick and respawn methods', function(){
      expect(dron.tick).to.be.a('function');
      expect(dron.respawn).to.be.a('function');
    })
  })

  describe('Move', function(){
    var dron = new Dron(100, 100);
    it('should change the dron position on each tick', function(){
      var startX = dron.x;
      var startY = dron.y;
      dron.tick();
      expect(dron.x).not.to.be.equal(startX);
      expect(dron.y).not.to.be.equal(startY);
    })

    it('should change the dron position on each tick according to he speed', function(){
      // Prevent the collision with borders
      dron.speedX = .1;
      dron.speedY = .1;
      dron.x = 50;
      dron.y = 50;
      var startX = dron.x;
      var startY = dron.y;
      dron.tick();
      expect(dron.x).not.to.be.equal(startX);
      expect(dron.y).not.to.be.equal(startY);

      expect(dron.x).to.be.equal(startX + dron.speedX);
      expect(dron.y).to.be.equal(startY + dron.speedY);
    })

    it('should respawn after the border collision', function(){
      var dron = new Dron(100, 100);
      var dronHash = JSON.stringify({
        speedX: dron.speedX,
        speedY: dron.speedY,
        color: dron.color,
        radius: dron.radius
      });
      
      // Get the ticks count to reach the border
      var xTicks = (dron.speedX > 0) ? (((dron.maxWidth + dron.radius) - dron.x) / dron.speedX) : (-(dron.x + dron.radius) / dron.speedX);
      var yTicks = (dron.speedY > 0) ? (((dron.maxHeight + dron.radius) - dron.y) / dron.speedY) : (-(dron.y + dron.radius) / dron.speedY);
      
      // Get the min tick to respawn
      var ticksToRespawn = Math.ceil(Math.min(xTicks, yTicks));
      //console.log(ticksToRespawn);
      //return;
      while (ticksToRespawn--) {
        dron.tick();
      }
      // After the respawn it must change he properties
      expect(dronHash).not.to.be.equal(JSON.stringify({
        speedX: dron.speedX,
        speedY: dron.speedY,
        color: dron.color,
        radius: dron.radius
      }));
    })
  })
})