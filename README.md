kid_process
========================
[![Build Status](https://travis-ci.org/jsdevel/node-kid_process.png)](https://travis-ci.org/jsdevel/node-kid_process)

Deal with child_process like you would a kid.

##Highlights
1. Forget about `disconnect`, `error`, `close`, and `exit`.  Listen for `terminated` instead.
2. `error` events are ignored rather than exiting your parent process.
3. Same interface as spawn and fork.  If your command ends in `.js`, then fork is used.
4. The kill method does nothing once an event from item 1 is emitted.  This is 
a good idea because kill can kill another process with the same pid when called
after a child_process has ended!


##Example
````javascript
var kid = require('kid_process').play('myScript.js');
kid.on('terminated', function(code){
  console.log('woops.  Something happened and myScript is no longer running :(');
  kid.kill();//does nothing
});
kid.send({hello:'world'});
````

##Idiosyncracies
* If the command ends in ".js", then fork is used instead of spawn.  In
this case, the `message` event is listened for and emitted.  Additionally, `disconnect`
and `send` are available as methods.
