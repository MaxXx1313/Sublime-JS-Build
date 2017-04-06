/* jshint esversion: 6 */
// var mocha = require('mocha');
module.exports = MyReporter;

function MyReporter(runner) {
  // mocha.reporters.Base.call(this, runner);
  var passes = 0;
  var failures = 0;

  // var MAX_MESSAGE_LENGTH = 2048;

  runner.on('pass', function(test){
    passes++;
    // TODO: map source
    console.log('pass: [%s]', test.fullTitle());
  });
  //  "file_regex":"\\s*at\\s*(.*?):(\\d+):(\\d+)()"
  runner.on('fail', function(test, err){
    failures++;

    var errMessage = err.message.replace(/\n/g, ' ');
    // if(errMessage.length > MAX_MESSAGE_LENGTH){
    //   errMessage = errMessage.substr(0, MAX_MESSAGE_LENGTH)+'...';
    // }

    ({file, line, col} = getErrorSource(err));
    console.log('fail: [%s] at %s:%s:%s', test.fullTitle(), file, line, col,  errMessage);
  });

  runner.on('end', function(){
    console.log('Pass %d of %d', passes, passes + failures);
    if(failures > 0){
      console.log('FAILED');
    } else {
      console.log('SUCCEED');
    }
    process.exit(failures);
  });
}

MyReporter.getErrorSource = getErrorSource;


/**
 * TODO: SyntaxError?
 */
function getErrorSource(err){
  // console.log('getErrorSource', err.stack);
  var errString = err.stack.toString();

  let fileInfo;
  // TODO: compare by type?
  if(errString.indexOf('AssertionError:') >= 0 ){
    // AssertionError
    errString = errString.replace(/\n/g, ' ').trim();
    fileInfo = errString.match(/.*\s*at (.*?):(\d+):(\d+)$/) || [];
    // console.log(fileInfo);
  } else {
    // common error
    errString = errString.split('\n', 2).join(' ').trim();
    // console.log('errString', errString)
    fileInfo = errString.match(/\s*at\s*.*?\((.*?):(\d+):(\d+)\)$/) || [];
  }
  // console.log(stack);
  var file = fileInfo[1];
  var line = fileInfo[2];
  var col  = fileInfo[3];

  return {
    file:file,
    line:line,
    col:col
  };
}
