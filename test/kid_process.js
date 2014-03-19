'use strict';

describe('kid_process', function() {
  var sut = require('../lib').play;
  var programs = require('../test-fixtures/programs');

  it('exports a function', function() {
    sut.should.be.type('function');
  });

  describe('terminated event', function() {
    it('is emitted when there is an error spawning the script', function(done) {
      sut('node', ['asdfasdf']).on('terminated', function(code){
        code.should.be.above(0);
        done();
      });
    });

    it('is emitted for scripts that throw errors', function(done) {
      sut('node', [programs.throwsError]).on('terminated', function(code){
        code.should.be.above(0);
        done();
      });
    });

    it('is emitted for scripts that exit abruptly', function(done) {
      sut('node', [programs.exitsAbruptly]).on('terminated', function(code){
        code.should.be.above(0);
        done();
      });
    });

    it('is emitted for scripts that exit normally', function(done) {
      sut('node', [programs.exitsNormally]).on('terminated', function(code){
        code.should.equal(0);
        done();
      });
    });
  });

  describe('stdout', function() {
    describe('data event', function() {
      it('receives data from programs', function(done) {
        sut('node', [programs.sendsFoo]).stdout.on('data', function(data){
          (''+data).should.equal('foo');
          done();
        });
      });
    });
  });

  describe('fork', function() {
    it('is used if a js file is given as the command', function(done) {
      sut(programs.sendsMessageFoo).on('message', function(msg){
        msg.should.equal('foo');
        done();
      });
    });
  });
});