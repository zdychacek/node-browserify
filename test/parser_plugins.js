var test = require('tap').test;
var browserify = require('../');
var through = require('through2');

var code = 'const obj = {...{ a: 1 } };';

test('should throw a ParseError', function (t) {
    var stream = through();
    stream.push(code);
    stream.push(null);

    var b = browserify({ bundleExternal: false });
    b.add(stream);

    b.bundle(function (err, src) {
      t.ok(err);
      t.equal(err.line, 1);
      t.equal(err.column, 14);
      t.equal(err.message, 'Unexpected token');
      t.end();
    });
});

test('should not throw a ParseError', function (t) {
    var stream = through();
    stream.push(code);
    stream.push(null);

    var b = browserify({
      bundleExternal: false,
      parserPlugins: [ 'objectRestSpread' ]
    });
    b.add(stream);
    b.bundle(function (err, src) {
      t.notOk(err);
      t.end();
    });
});
