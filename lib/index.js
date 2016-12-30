var qs = require('querystring');

var mod = {};

mod.luggage = function(req, res, lug, cb) {
	var body = '';

	req.on('data', function (data) {
		body += data;
	});

	req.on('end', function () {
		var keys;
		var i;
		var item;
		var j;
		var name;
		var parts;
		var prefix = '';
		var temp;
		var value;

		lug.post = {};

		//console.log('body');
		//console.log(body);
		body = qs.unescape(body);

		// Specs recommend semicolon along with ampersand:
		// https://www.w3.org/TR/1999/REC-html401-19991224/appendix/notes.html#h-B.2.2
		temp = body.split(/[&|;]/g);
		for(i = 0; i < temp.length; i++) {
			temp[i] = temp[i].split('=');
		}

		for(i = 0; i < temp.length; i++) {
			name = temp[i][0];
			value = temp[i][1];

			parts = name.split('.');

			function dive(path, parts, value) {
				var stripped;
				if(!parts.length) {
					return path;
				}

				// Handle objects and arrays
				if(parts[0].indexOf('[]') == -1) {
					if(typeof path[parts[0]] == 'undefined') {
						if(parts.length == 1) {
							path[parts[0]] = value;
						} else {
							path[parts[0]] = {};
							dive(path[parts[0]], parts.slice(1), value);
						}
					} else {
						if(parts.length == 1) {
							path[parts[0]] = value;
						} else {
							dive(path[parts[0]], parts.slice(1), value);
						}
					}
				} else {
					stripped = parts[0].slice(0, -2);
					if(typeof path[stripped] == 'undefined') {
						if(parts.length == 1) {
							path[stripped] = [value];
						} else {
							path[stripped] = [{}];
							dive(path[stripped][0], parts.slice(1), value);
						}
					} else {
						if(parts.length == 1) {
							path[stripped].push(value);
						} else {
							function exists(base, remain) {
								if(remain.length) {
									if(typeof base[remain[0]] !== 'undefined') {
										if(remain.length == 1) {
											return true;
										} else {
											return exists(base[remain[0]], remain.slice(1));
										}
									} else {
										return false;
									}
								} else {
									return false;
								}
							}

							// Check ahead to see if object already exists
							// If so, push a new object to the array
							if(exists(path[stripped][path[stripped].length - 1], parts.slice(1))) {
								path[stripped].push({});
							}

							dive(path[stripped][path[stripped].length - 1], parts.slice(1), value);

						}
					}
				}
			}

			dive(lug.post, parts, value);
		}

		cb();
	});
}

module.exports = mod;
