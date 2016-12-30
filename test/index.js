var tap = require('agraddy.test.tap')(__filename);
var response = require('agraddy.test.res');
var pack = require('../package.json');
var stream = require('stream');

var util = require('util');

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


var req3 = new stream.Readable();
req3._read = function(size) {
	this.push('deep.down.obj=test&deep.down.another=second&id=1&filter_json[].from=TX&filter_json[].to=AL&filter_json[].from=&filter_json[].to=&filter_json[].from=&filter_json[].to=&filter_json[].from=&filter_json[].to=&filter_json[].from=&filter_json[].to=&arr[].with.extra.depth=one&arr[].with.extra.width=one.five&arr[].with.extra.depth=two&arr[].with.extra.width=two.five');
	this.push(null);
};
var res3 = response();
var lug3 = {};
mod.luggage(req3, res3, lug3, function() {
	console.log(util.inspect(lug3.post, false, null));
	tap.assert.deepEqual(lug3.post, {"arr": [{"with": {"extra": {"depth": "one", "width": "one.five"}}}, {"with": {"extra": {"depth": "two", "width": "two.five"}}}], "deep": {"down": {"another": "second", "obj": "test"}}, "filter_json": [{"from": "TX", "to": "AL"}, {"from": "", "to": ""}, {"from": "", "to": ""}, {"from": "", "to": ""}, {"from": "", "to": ""}], "id": "1"}, 'Should handle arrays with nested values.');
});


var req4 = new stream.Readable();
req4._read = function(size) {
	this.push('id=1&encoded%5B%5D=one');
	this.push(null);
};
var res4 = response();
var lug4 = {};
mod.luggage(req4, res4, lug4, function() {
	tap.assert.deepEqual(lug4.post, {"id": "1", "encoded": ["one"]}, 'Should handle encoded data.');
});

