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
		required: true,
		default: "Davis"
	},
	age: {
		type: Number,
		required: true,
		default: 24
	},
	languages: {
		type: Array,
		required: true,
		default: ["english"]
	},
	friends: {
		type: Object,
		required: true,
		default: {
			"Jimmy": {
				knownSince: 2009
			}
		}
	},
	birthday: {
		type: Date,
		required: true,
		default: new Date(5,19,1989)
	}
});

var Person = new modlr.Model(personSchema);

var template = {
	name: "Davis",
	age: 24,
	languages: ["english"],
	friends: {
		"Jimmy": {
			knownSince: 2009
		}
	},
	birthday: new Date(5,19,1989)
};

exports["toObject"] = function(test) {
	var p = new Person();
	test.deepEqual(p.toObject(), template);

	var p2 = new Person(template);
	test.deepEqual(p2.toObject(), template);

	test.done();
};