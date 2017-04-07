/* jshint esversion: 6 */
// jshint multistr:true

// todo: move to a separate file
const assert = require('assert');
const AssertionError = require('assert').AssertionError;
const MyReporter = require('./mocha-sublime-reporter.js');

describe('getErrorSource [UNIT]', function(){


  it('Generic Error #1', function(){
    let input = 'Error: error 1\n    at timeout.then (throttle.js:26:15)';
    let expected = {
      file:'throttle.js',
      line:'26',
      col:'15'
    };

    let actual = MyReporter.getErrorSource({stack:input});

    assert.deepEqual(actual, expected);

  });


  it('Generic Error #2', function(){
    let input = 'TypeError: throttle(...).catch is not a function\n\
        at Context.<anonymous> (D:\\sandbox\\throttle.js:74:43)\n\
        at callFn (C:\\Users\\guest.user\\AppData\\Roaming\\npm\\node_modules\\mocha\\lib\\runnable.js:343:21)\n\
        at Test.Runnable.run (C:\\Users\\guest.user\\AppData\\Roaming\\npm\\node_modules\\mocha\\lib\\runnable.js:335:7)\n\
        at Runner.runTest (C:\\Users\\guest.user\\AppData\\Roaming\\npm\\node_modules\\mocha\\lib\\runner.js:444:10)\n\
        at C:\\Users\\guest.user\\AppData\\Roaming\\npm\\node_modules\\mocha\\lib\\runner.js:550:12\n\
        at next (C:\\Users\\guest.user\\AppData\\Roaming\\npm\\node_modules\\mocha\\lib\\runner.js:361:14)\n\
        at C:\\Users\\guest.user\\AppData\\Roaming\\npm\\node_modules\\mocha\\lib\\runner.js:371:7\n\
        at next (C:\\Users\\guest.user\\AppData\\Roaming\\npm\\node_modules\\mocha\\lib\\runner.js:295:14)\n\
        at C:\\Users\\guest.user\\AppData\\Roaming\\npm\\node_modules\\mocha\\lib\\runner.js:334:7\n\
        at done (C:\\Users\\guest.user\\AppData\\Roaming\\npm\\node_modules\\mocha\\lib\\runnable.js:293:5)\n\
        at callFn (C:\\Users\\guest.user\\AppData\\Roaming\\npm\\node_modules\\mocha\\lib\\runnable.js:361:7)\n\
        at Hook.Runnable.run (C:\\Users\\guest.user\\AppData\\Roaming\\npm\\node_modules\\mocha\\lib\\runnable.js:335:7)\n\
        at next (C:\\Users\\guest.user\\AppData\\Roaming\\npm\\node_modules\\mocha\\lib\\runner.js:309:10)\n\
        at Immediate.<anonymous> (C:\\Users\\guest.user\\AppData\\Roaming\\npm\\node_modules\\mocha\\lib\\runner.js:339:5)\n\
        at runCallback (timers.js:574:20)\n\
        at tryOnImmediate (timers.js:554:5)\n\
        at processImmediate [as _immediateCallback] (timers.js:533:5)';

    let expected = {
      file:'D:\\sandbox\\throttle.js',
      line:'74',
      col:'43'
    };

    let actual = MyReporter.getErrorSource({stack:input});

    assert.deepEqual(actual, expected);

  });


  it('AssertionError #1', function(){
    let input = "AssertionError: [ 'start 1',\n  'stop 5' ] deepEqual [ 'start 1',\n  'stop 5' ]\n    at throttle.js:66:14";
    let expected = {
        file:'throttle.js',
        line:'66',
        col:'14'
      };

    let actual = MyReporter.getErrorSource({stack:input});

    assert.deepEqual(actual, expected);
  });


  it('AssertionError #2', function(){
    let input = "AssertionError: [ Error: error 1\n\
        at timeout.then (D:\\sandbox\\throttle.js:26:15),\n\
    Error: error 2\n\
        at timeout.then (D:\\sandbox\\thrott deepEqual [ 'job 1', 'job 2', 'job 3', 'job 4', 'job 5' ]\n\
      at D:\\sandbox\\throttle.js:104:14";

    let expected = {
        file:'D:\\sandbox\\throttle.js',
        line:'104',
        col:'14'
      };

    let actual = MyReporter.getErrorSource({stack:input});

    assert.deepEqual(actual, expected);
  });




  it('Filename contains [ and ]', function(){
    let input = 'Error: error 1\n    at timeout.then (thr[o]ttle.js:26:15)';
    let expected = {
      file:'thr[o]ttle.js',
      line:'26',
      col:'15'
    };

    let actual = MyReporter.getErrorSource({stack:input});

    assert.deepEqual(actual, expected);

  });

});



describe('file_regex [UNIT]', function(){

  it('test 1', function(){
    let r = new RegExp("fail: \\[.*?\\] at ([\\w\\\\\\/:\\.]+):(\\d+):(\\d+)\\s*(.{0,1024})");

    let input = "fail: [Throttle [UNIT] throttle success] at D:\\sandbox\\throttle.js:66:14 [ 'start 1', 'stop 5' ] deepEqual [ 'start 1', 'stop 5' ]";
    let matchExpected = [
      input,
      'D:\\sandbox\\throttle.js',
      '66',
      '14',
      "[ 'start 1', 'stop 5' ] deepEqual [ 'start 1', 'stop 5' ]",
    ];
    matchExpected.input = input;
    matchExpected.index = 0;

    let match = r.exec(input);
    // console.log(match);

    assert.deepEqual(match, matchExpected);

  });



  it('test 2', function(){
    let input = "module.js:457\n\
    throw err;\n\
    ^\n\
\n\
Error: Cannot find module 'pouchdb'\n\
    at Function.Module._resolveFilename (module.js:455:15)\n\
    at startup (bootstrap_node.js:149:9)\n\
    at bootstrap_node.js:509:3";

    let r = new RegExp("^(.*?):(\\d+)()[\\s\\S]*Error: (.*)");

    let matchExpected = [
        input,
        'module.js',
        '457',
        '', // 4
        "Cannot find module 'pouchdb'",
      ];
      matchExpected.input = input;
      matchExpected.index = 0;

      let match = r.exec(input);
      // console.log(match);

      assert.equal(match[1], matchExpected[1]);
      assert.equal(match[2], matchExpected[2]);
      assert.equal(match[3], matchExpected[3]);
      assert.equal(match[4], matchExpected[4]);
      // assert.deepEqual(match, matchExpected);

  });

});