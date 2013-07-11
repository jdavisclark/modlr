'use strict';

var modlr = require('../modlr.js');

/*
======== A Handy Little Nodeunit Reference ========
https://github.com/caolan/nodeunit

	Test methods:
	test.expect(numAssertions)
	test.done()
	Test assertions:
	test.ok(value, [message])
	test.equal(actual, expected, [message])
	test.notEqual(actual, expected, [message])
	test.deepEqual(actual, expected, [message])
	test.notDeepEqual(actual, expected, [message])
	test.strictEqual(actual, expected, [message])
	test.notStrictEqual(actual, expected, [message])
	test.throws(block, [error], [message])
	test.doesNotThrow(block, [error], [message])
	test.ifError(value)
*/

exports["throws on unsupported type"] = function(test) {
	test.throws(function() {
		new modlr.Schema({
			stuff: {
				type: Object,
				allowed: ["hurr", "durr", 3]
			}
		})
	});

	test.doesNotThrow(function() {
		new modlr.Schema({
			stuff: {
				type: Array,
				allowed: ["hurr", "durr", 3]
			}
		})
	});

	test.done();
};

exports["string type allowed values"] = function(test) {
	var s = new modlr.Schema({
		gender: {
			type: String,
			allowed: ["male", "female"]
		}
	});

	var M = new modlr.Model(s);

	var model = new M({
		gender: "unicorn"
	});

	var err = model.validate();
	test.deepEqual(err, [{
			path: "gender",
			type: "AllowedValues",
			allowedValues: "male,female"
		}
	]);

	model.gender = "male";
	test.deepEqual(model.validate(), undefined);

	test.done();
};

exports["array type allowed values"] = function(test) {
	var s = new modlr.Schema({
		roles: {
			type: Array,
			allowed: ["admin", "staff", "consumer"]
		}
	});

	var M = new modlr.Model(s);
	var model = new M({
		roles: ["admin", "tactical operator"]
	});

	test.deepEqual(model.validate(), [{
			path: "roles",
			type: "AllowedValues",
			invalidValues: ["tactical operator"]
		}
	]);

	model.roles = ["admin", "staff"];
	test.deepEqual(model.validate(), undefined);

	test.done();
};