var path   = require('path');
var fs     = require('fs-extra');
var RSVP   = require('rsvp');
// var run    = require('./run');
// var rimraf = RSVP.denodeify(require('rimraf'));
// var resolve = RSVP.denodeify(require('resolve'));
// var findEmberPath = require('./find-ember-path');

module.exports = {

//   install: function(root){
//     var helpers = this;

//     return rimraf(path.join(root, 'bower_components'))
//       .then(function() {
//         return helpers.findBowerPath(root)
//       })
//       .then(function(bowerPath) {
//         return run('node', [bowerPath, 'install', '--config.interactive=false'], {cwd: root});
//       });
//   },
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
//   cleanup: function(root){
//     var helpers = this;
//     return helpers.resetBowerFile(root).then(function(){
//       return rimraf(path.join(root, 'bower.json.ember-try'));
//     })
//     .catch(function(){})
//     .then(function(){
//       return helpers.install(root);
//     });
//   },
//   findVersion: function(packageName, root){
//     var filename = path.join(root, 'bower_components', packageName, 'bower.json');
//     if (fs.existsSync(filename)) {
//       return JSON.parse(fs.readFileSync(filename)).version;
//     } else {
//       throw 'File ' + filename + ' does not exist';
//     }
//   }
};
