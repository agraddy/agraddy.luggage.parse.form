var tap = require('agraddy.test.tap')(__filename);
var response = require('agraddy.test.res');
var pack = require('../package.json');
var stream = require('stream');

var mod = require('../');

var req = new stream.Readable();
req._read = function(size) {
	this.push('one=1&two=2&three=3');
	this.push(null);
};
var res = response();
var lug = {};
mod.luggage(req, res, lug, function() {
	tap.assert.deepEqual(lug.post, {"one": "1", "two": "2", "three": "3"}, 'Should set post.');
});

tap.assert.equal(pack.luggage, true, 'The luggage item needs to be set in the package.json file.');

var req2 = new stream.Readable();
req2._read = function(size) {
	this.push('id=1&from[]=TX&to[]=AL&from[]=&to[]=&from[]=&to[]=&from[]=&to[]=&from[]=&to[]=');
	this.push(null);
};
var res2 = response();
var lug2 = {};
mod.luggage(req2, res2, lug2, function() {
	tap.assert.deepEqual(lug2.post, {"from": ["TX", "", "", "", ""], "id": "1", "to": ["AL", "", "", "", ""]}, 'Should set post with arrays.');
});

