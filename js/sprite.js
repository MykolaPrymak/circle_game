
SpriteManager = {
    init: function(cb) {
        var self = this;
        var spriteNames = [];
        
        this.sprites = [];
        this.basePath = 'res/sprites/';
        
        function loadSpritesFiles() {
            console.info('Loading sprites files...');
            var count = spriteNames.length;
            _.each(spriteNames, function(name) {
                self.load(name, function(){
                    count--;
                    if (!count) {
                        if (cb) {
                            cb();
                        }
                        console.info('Sprites loading complete');
                    }
                })
            });
        };
        loadSpritesFiles();
    },
    load: function(name, cb) {
        var
            path = this.basePath + name,
            shortName = name.split('.').slice(0, -1).join('.'),
            img = document.createElement('img'),
            self = this;
        img.addEventListener('load', function() {
            console.info(name, 'is ready to draw.');
            if(cb) {
                cb();
            }
        }, false);
        img.addEventListener('error', function() {
            console.error('Error: ' + name + ' could not be loaded.');
            self.sprites[shortName] = null;
        }, false);

        img.src = path;
        this.sprites[shortName] = img;
    },
    getSprite: function(name) {
        if (!this.sprites[name]) {
            return null;
        }
        return this.sprites[name];
    }
}
