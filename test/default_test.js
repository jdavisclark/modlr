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

var personSchema = new modlr.Schema({
	name: {
		type: String,
		required: true
	},
	age: {
		type: Number,
		required: true
	},
	interests: {
		type: Array,
		required: true
	},
	languages: {
		type: Array,
		required: true,
		default: ["english"]
	}
});

var Person = new modlr.Model(personSchema);

exports['array default'] = function(test) {
	test.expect(1);

	var p = new Person({});

	// tests here
	test.deepEqual(p.languages, ["english"]);

	test.done();
};

exports['array default override'] = function(test) {
	test.expect(1);

	var p = new Person({
		languages: [
			"english",
			"gaulish",
			"latin"
		]
	});

	test.deepEqual(p.languages, ["english", "gaulish", "latin"]);
	test.done();
};
