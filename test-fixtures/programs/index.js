'use strict';

var exports = module.exports = {};

var glob = require('glob');
var path = require('path');
var programs = glob
  .sync('./*.js', {cwd:__dirname})
  .filter(index);

programs
  .map(toBaseNameInCamelCase)
  .forEach(addToExports);

function getAbsolutePathOf(program){
  return path.resolve(__dirname, program + '.js');
}

function index(file){
  return file !== './index.js';
}

function toBaseNameInCamelCase(file){
  return path.basename(file, '.js').replace(/-([a-z])/g, function(match, one){
    return one.toUpperCase();
  });
}

function addToExports(camelCase, index){
  exports[camelCase] = path.resolve(__dirname, programs[index]);
}