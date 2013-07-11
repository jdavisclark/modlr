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
		minLength: 1
	},
	languages: {
		type: Array,
		minLength: 1
	},
	friends: {
		type: Object,
		minLength: 1
	}
});

var Person = new modlr.Model(personSchema);

exports["valid lengths should not fail validation"] = function(test) {
	var p = new Person({
		name: "Davis",
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
		name: "",
		languages: [],
		friends: {}
	});

	var errors = p.validate();
	test.deepEqual(errors, [
		{ path: "name", type: "MinLength", minLength: 1 , actualLength: p.name.length },
		{ path: "languages", type: "MinLength", minLength: 1, actualLength: p.languages.length },
		{ path: "friends", type: "MinLength", minLength: 1, actualLength: Object.keys(p.friends).length }
	]);

	test.done();
};