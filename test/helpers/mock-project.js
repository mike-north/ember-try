var assert        = require('assert');
var fs            = require('fs');
var RSVP          = require('rsvp');
var _rimraf       = require('rimraf');
var spawnSync     = require('child_process').spawnSync;

var fixtureBower  = require('../fixtures/bower.json');
var fixtureNpm    = require('../fixtures/package.json');

var rimraf        = RSVP.denodeify(_rimraf);
var mkdir         = RSVP.denodeify(fs.mkdir);
var writeFile     = RSVP.denodeify(fs.writeFile);
var readFile      = RSVP.denodeify(fs.readFile);


function MockProject(root) {
  assert.equal(!!root, true, 'Must provide a root');
  this.projectRoot = root;
}

MockProject.prototype = {
  _writeFixtureDataToProject: function (fixture, filename) {
    return writeFile(this.projectRoot + '/' + filename, JSON.stringify(fixture, null, 2));
  },

  _setupBower: function () {
    this._writeFixtureDataToProject(fixtureBower, 'bower.json').then(function () {
      return spawnSync('bower', ['install'], {
        cwd: this.projectRoot
      }.bind(this));
    });
  },
  _setupNpm: function () {
    this._writeFixtureDataToProject(fixtureNpm, 'package.json').then(function () {
      return spawnSync('npm', ['install'], {
        cwd: this.projectRoot
      }.bind(this));
    });
  },

  setup: function () {
    var mockProj = this;
    return rimraf(mockProj.projectRoot).then(function () {
      return mkdir(mockProj.projectRoot).then(function () {
        return RSVP.all([
          this._setupNpm(),
          this._setupBower()
        ]);
      }.bind(this));
    }.bind(this));
  },

  destroy: function () {
    return rimraf(this.projectRoot);
  },

  _jsonFileData: function (filename) {
    return readFile(this.projectRoot + '/' + filename).then(function(fileData) {
      return JSON.parse(fileData);
    });
  },

  bowerData: function() {
    return this._jsonFileData('bower.json');
  },

  npmData: function() {
    return this._jsonFileData('package.json');
  },

  backupBowerData: function () {
    return this._jsonFileData('bower.json.ember-try');
  },

  backupNpmData: function () {
    return this._jsonFileData('package.json.ember-try');
  },

  createBowerBackup: function (packageVersions) {
    var vers = packageVersions || {};
    var mockProj = this;
    return this.bowerData().then(function(bowerJson){
      for(var k in vers) {
        bowerJson.dependencies[k] = vers[k];
      }
      return writeFile(mockProj.projectRoot + '/bower.json.ember-try', JSON.stringify(bowerJson));
    });
  },

  createNpmBackup: function (packageVersions) {
    var vers = packageVersions || {};
    var mockProj = this;
    return this.npmData().then(function(packageJson){
      for(var k in vers) {
        packageJson.dependencies[k] = vers[k];
      }
      return writeFile(mockProj.projectRoot + '/package.json.ember-try', JSON.stringify(packageJson));
    });
  }
};

module.exports = MockProject;
