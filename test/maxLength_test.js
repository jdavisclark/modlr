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
		maxLength: 5
	},
	languages: {
		type: Array,
		maxLength: 3
	},
	friends: {
		type: Object,
		maxLength: 2
	}
});

var Person = new modlr.Model(personSchema);

exports["valid lengths should not fail validation"] = function(test) {
	var p = new Person({
		name: "Jim",
		languages: ["english"],
		friends: {
			Jim: {hurr: "durr"}
		}
	});

	var errors = p.validate();
	test.equal(errors, undefined);

	test.done();
};

exports["invalid lengths should fail validation"] = function(test) {
	var p = new Person({
		name: "Davis Clark",
		languages: ["latin", "gualish", "hodor", "english"],
		friends: {
			"Jim": {},
			"John": {},
			"Jack": {}
		}
	});

	var errors = p.validate();
	test.deepEqual(errors, [
		{ path: "name", type: "MaxLength", maxLength: 5 , actualLength: p.name.length },
		{ path: "languages", type: "MaxLength", maxLength: 3, actualLength: p.languages.length },
		{ path: "friends", type: "MaxLength", maxLength: 2, actualLength: Object.keys(p.friends).length }
	]);

	test.done();
};