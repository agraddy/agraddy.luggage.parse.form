var qs = require('querystring');

var mod = {};

mod.luggage = function(req, res, lug, cb) {
	var body = '';

	req.on('data', function (data) {
		body += data;
	});

	req.on('end', function () {
		lug.post = qs.parse(body);

		// Strip off [] from end of array names
		Object.keys(lug.post).forEach(function(item) {
			if(item.indexOf('[]') !== -1) {
				lug.post[item.slice(0, -2)] = lug.post[item];
				delete lug.post[item];
			}
		});
		cb();
	});
}

module.exports = mod;
