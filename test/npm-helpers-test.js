var npmHelpers = require('../lib/utils/npm-helpers');
var should = require("should");

var MockProject = require('./helpers/mock-project');

describe('npmHelpers', function(){

  describe('#resetNpmFile()', function() {
    // actual npm install could take a while
    this.timeout(10000);

    var proj = new MockProject('.scratch');
    beforeEach(function () {
      return proj.setup();
    });

    afterEach(function() {
      return proj.destroy();
    });

    it('should replace a package.json with the package.json.ember-try', function(done) {
      var proj = new MockProject('.scratch');

      proj.createNpmBackup({
        'jquery': '2.1.3'
      }).then(function() {
        npmHelpers.resetNpmFile(process.cwd() + '/.scratch').then(function () {
          proj.npmData().then(function(data) {
            data.dependencies.jquery.should.equal('2.1.3');
            done();
          });
        });
      });
    });
  });

  describe('#backupNpmFile()', function() {
    // actual npm install could take a while
    this.timeout(10000);

    var proj = new MockProject('.scratch');
    beforeEach(function () {
      return proj.setup();
    });

    afterEach(function() {
      return proj.destroy();
    });

    it('should copy package.json to package.json.ember-try', function(done) {
      proj.createNpmBackup({
        'jquery': '2.1.3'
      }).then(function() {
        npmHelpers.backupNpmFile(process.cwd() + '/.scratch').then(function () {
          proj.backupNpmData().then(function(npmData) {
            npmData.dependencies.jquery.should.equal('^1.11.1');
            done();
          });
        });
      });
    });
  });

})
