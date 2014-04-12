define(['class', 'log'], function(Class, log) {
  /**
   * Get the object key by path.
   * path can contain the ":" as delimiter
   * Retrun the array with the coresponding object and the key or false if key can be found
   *
   * Example:
   * getObjKeyByPath({name: 'aaa'}, 'name')
   *  return [{name: 'aaa'}, 'name']
   *
   * var people = {name: 'Stiv', age: 40, address: {city: 'LA', street: 'Sanset bl. 30'}};
   * getObjKeyByPath(people, 'name')
   *  return [people, 'name']
   *
   * getObjKeyByPath(people, 'address')
   *  return [people, 'address']
   *
   * getObjKeyByPath(people, 'address:city')
   *  return [people.address, 'city']
   *
   * getObjKeyByPath(people, 'isHuman')
   *  return false
   *
   */
  function getObjKeyByPath(obj, path) {
    // Or use (!~path.indexOf(':'))
    if (path.indexOf(':') === -1) {
      if (path in obj) {
        return [obj, path];
      } else {
        return false;
      }
    } else {
      path = path.split(':');
      var key;

      while (path.length && ((key = path.shift()) in obj)) {
        if (path.length !== 0) {
          obj = obj[key];
        }
      }

      if (!!path.length) {
        return false;
      }
      return [obj, key];
    }
  }

  function makeObjRecursive(obj, path) {
    // Or use (!~path.indexOf(':'))
    if (path.indexOf(':') === -1) {
      return [obj, path];
    } else {
      path = path.split(':');
      var key;

      while (path.length) {
        if (!(obj instanceof Object)){
          log.warn('Cannot set the property of non-object %j', obj);
          break;
        }
      // && ((key = path.shift()) in obj)
        key = path.shift();
        if (path.length !== 0) {
          if (!(key in obj)) {
            obj[key] = {};
          }
          obj = obj[key];
        }
      }
      if (!!path.length) {
        return false;
      }
      return [obj, key];
    }
  }

  var global = global || this; // window in broser and global in Node.js

  var Storage = Class.extend({
    init: function() {
      if (this.isHaveLocalStorage() && localStorage.getItem('data')) {
        this.data = JSON.parse(localStorage.getItem('data'));
      } else {
        this.reset();
      }
    },
    reset: function() {
      this.data = {
        isAudioEnabled: true,
        maxScore: 0
      };
    },
    save: function() {
      if (this.isHaveLocalStorage()) {
        localStorage.setItem('data', JSON.stringify(this.data));
      }
    },
    clear: function() {
      this.reset();
      this.save();
    },
    isHaveLocalStorage: function() {
      return !!global && global.localStorage;
    },
    isHaveProperty: function(name) {
      return !!this.data.hasOwnProperty(name);
    },
    get: function(key) {
      var result;
      if (key && (result = getObjKeyByPath(this.data, key))) {
        return result[0][result[1]];
      } else if (key === undefined) {
        return this.data;
      }
      return undefined;
    },
    set: function(key, value) {
      var result;
      if (key && (result = makeObjRecursive(this.data, key))) {
        if (value === undefined) {
          delete result[0][result[1]];
        } else {
          result[0][result[1]] = value;
        }
        this.save();
        return true;
      }
      //console.dir(result);
      return false;
    },
    setAudioState: function(state) {
      return this.set('isAudioEnabled', !!state);
    },
    getAudioState: function() {
      return this.get('isAudioEnabled');
    },
    setMaxScore: function(score) {
      if (score > this.get('maxScore')) {
        return this.set('maxScore', ~~score);
      }
      return true;
    },
    getMaxScore: function() {
      return this.get('maxScore');
    }
  });

  return Storage;
});