define(['underscore', 'eventemiter', 'log'], function(_, EventEmiter, log) {
  var AudioManager = EventEmiter.extend({
    init: function() {
      var self = this;
      var soundNames = ['big_bomb', 'achievement'];
      var musicNames = ['Lee_Rosevere_-_03_-_Plateau'];

      this._super();

      this.sounds = [];
      this.music = [];
      this.basePath = 'res/';
      this.soundsDir = 'sounds/';
      this.musicDir = 'music/';
      this.extension = this.canPlayMP3() ? 'mp3' : 'ogg';
      this.enabled = true;
      
      function loadSoundFiles() {
        log.info('Loading sound files...');
        var count = soundNames.length;
        _.each(soundNames, function(name) {
          self.loadSound(name, function(){
            count--;
            self.trigger('sound:ready', [name]);
            if (!count) {
              loadMusicFiles();
              log.info('Sound loading complete');
            }
          });
        });
      }

      function loadMusicFiles() {
        log.info('Loading music files...');
        var count = musicNames.length;
        _.each(musicNames, function(name) {
          self.loadMusic(name, function(){
            count--;
            self.trigger('music:ready', [name]);
            if (!count) {
              // All loaded - we are ready
              self.trigger('ready');
              log.info('Music loading complete');
            }
          });
        });
      }

      loadSoundFiles();
    },
    canPlayMP3: function() {
      return !!document.createElement('audio').canPlayType('audio/mpeg;');
    },
    toggle: function() {
      this.enabled = !this.enabled;
      log.debug('Toogle audio: ', this.enabled);
      if (this.enabled && this.currentMusic) {
        this.playMusic(this.currentMusic.name);
      } else {
        this.resetMusic(this.currentMusic);
      }
    },
    isEnabled: function() {
      return this.enabled;
    },
    load: function(basePath, name, cb, chanels) {
      var
        path = basePath + name + '.' + this.extension,
        sound = document.createElement('audio'),
        self = this;

      sound.addEventListener('canplaythrough', function() {
        log.info(name, 'is ready to play.');
        this.removeEventListener('canplaythrough', arguments.callee, false);
        _((chanels || 0) - 1).times(function(){
          self.sounds[name].push(sound.cloneNode(true));
        });
        if(cb) {
          cb(name);
        }
      }, false);
      sound.addEventListener('error', function() {
        log.error('Error: ' + name + ' could not be loaded.');
        self.sounds[name] = null;
      }, false);
      
      sound.preload = 'auto';
      sound.autobuffer = true;
      sound.src = path;
      sound.load();
      
      this.sounds[name] = [sound];
    },
    loadSound: function(name, cb) {
      if (!(name instanceof Array)) {
        name = [name, 4];
      }
      this.load(this.basePath + this.soundsDir, name[0], cb, name[1]);
    },
    loadMusic: function(name, cb) {
      this.load(this.basePath + this.musicDir, name, cb, 1);
      var music = this.sounds[name][0];
      // Loop the music play
      music.loop = true;
      music.addEventListener('ended', function(){music.play();}, false);
    },
    getSound: function(name) {
      if (!this.sounds[name]) {
        return null;
      }
      // Find free sound chanel
      var sound = _.find(this.sounds[name], function(sound) {
        return sound.ended || sound.paused;
      });

      // Reset the ended sound or get first
      if (sound && sound.ended) {
        sound.currentTime = 0;
      } else if (!sound) {
        sound = this.sounds[name][0];
      }
      return sound;
    },
    playSound: function(name) {
      var sound = this.getSound(name);
      if (this.enabled && sound) {
        sound.play();
      }
    },
    playMusic: function(name) {
      var sound = this.getSound(name);
      if (this.enabled && sound) {
        sound.play();
        this.currentMusic = {sound: sound, name: name};
      }
    },
    resetMusic: function(music) {
      if (music && music.sound) {
        music.sound.pause();
        music.sound.currentTime = 0;
      }
    },
    isMusicPlay: function() {
      if (
        this.currentMusic &&
        this.currentMusic.sound &&
        !this.currentMusic.sound.paused
      ) {
        return true;
      }
      return false;
    }
  });

  return AudioManager;
});