'use strict';

var EventEmitter = require('events').EventEmitter;
var once = require('once');
var child_process = require('child_process');
var spawn = child_process.spawn;
var fork = child_process.fork;

module.exports = {
  play: play
};


function play(command, args, options){
  var normalized = new EventEmitter();
  var terminatedHandler = once(function(){
    var args = ['terminated'].concat([].slice.call(arguments));
    normalized.kill = ignore;
    normalized.emit.apply(normalized, args);
  });
  var isModule = /\.js$/i.test(command);
  var strategy = isModule ? fork : spawn;
  var kid = strategy(command, args, options)
    .on('disconnect', normalized.emit.bind(normalized, 'disconnect'))
    .on('error', terminatedHandler)
    .on('close', terminatedHandler)
    .on('exit', terminatedHandler);

  if(isModule){
    kid.on('message', normalized.emit.bind(normalized, 'message'));
  }

  Object.defineProperty(normalized, 'stdout', {
    get: function(){return kid.stdout;}
  });

  Object.defineProperty(normalized, 'stderr', {
    get: function(){return kid.stderr;}
  });

  Object.defineProperty(normalized, 'stdin', {
    get: function(){return kid.stdin;}
  });

  Object.defineProperty(normalized, 'pid', {
    get: function(){return kid.pid;}
  });

  Object.defineProperty(normalized, 'connected', {
    get: function(){return kid.connected;}
  });

  if(isModule){
    if(kid.disconnect)normalized.disconnect = kid.disconnect.bind(kid);
    if(kid.send)normalized.send = kid.send.bind(kid);
  }

  normalized.kill = kid.kill.bind(kid);

  return normalized;
}

function ignore(){}