var path   = require('path');
var fs     = require('fs-extra');
var RSVP   = require('rsvp');
var run    = require('./run');
var rimraf = RSVP.denodeify(require('rimraf'));
// var resolve = RSVP.denodeify(require('resolve'));
// var findEmberPath = require('./find-ember-path');

module.exports = {

  install: function(root){
    return run('npm', ['install'], {cwd: root});
  },
  resetNpmFile: function(root){
    var copy = RSVP.denodeify(fs.copy);
    return copy(path.join(root, 'package.json.ember-try'),
                path.join(root, 'package.json'));
  },
  backupNpmFile: function(root){
    var copy = RSVP.denodeify(fs.copy);
    return copy(path.join(root, 'package.json'),
                path.join(root, 'package.json.ember-try'));
  },
  cleanup: function(root){
    return this.resetNpmFile(root).then(function(){
      console.log("Removing temporary package.json", path.join(root, 'package.json.ember-try'))
      return rimraf(path.join(root, 'package.json.ember-try'));
    })
    .catch(function(e){
      console.log("ERROR REMOVING temporary package.json", arguments);
    })
    .then(function(){
      return this.install(root);
    }.bind(this));
  },
//   findVersion: function(packageName, root){
//     var filename = path.join(root, 'bower_components', packageName, 'bower.json');
//     if (fs.existsSync(filename)) {
//       return JSON.parse(fs.readFileSync(filename)).version;
//     } else {
//       throw 'File ' + filename + ' does not exist';
//     }
//   }
};
