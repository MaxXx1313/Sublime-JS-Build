#!/bin/env node
/**
 This tool allows to run nodejs app and capture file/line/col/message if error
 */
const spawnSync = require('child_process').spawnSync;


if(process.argv[2] == process.argv[1]) {
  // call self
  console.log('please, do not call self');
  return;
}

let args = process.argv;
args.splice(1,1);
let cmd = args.shift();
let file = args[0];

console.log('run:', cmd, args);
let child = spawnSync(cmd, args);

console.log(child.stdout.toString() );

if(child.status != 0){
  let err = child.stderr.toString();

  console.error(errToLine(err));
}



/**
 * Cut the file from stack trace and grab the line, which cause an error
 */
function errToLine(err){
  let message = (err.match(/(Error: [\s\S]*)/) || [])[1] || "Error";
  let lines = err.split('\n');

  let line = 0;
  let col = 0;
  for (var i = 0; i < lines.length; i++) {
    let pos = lines[i].indexOf(file);
    if( pos >=0){
      let lineRest = lines[i].substr(pos + file.length); // ':12:34)'
      let m = lineRest.match(/:(\d+):(\d+)/) || [];
      line = m[1];
      col  = m[2];
      break;
    }
  }

  return formatError(file, line, col, message);
}

function formatError(file, line, col, message){
  return file+':'+line /*+':'+col*/ +'\n\n'+message;
}


