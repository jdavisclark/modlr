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

var schemaTemplate = {
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
	isAwesome: {
		type: Boolean,
		required: true,
		default: true
	},
	birthday: {
		type: Date,
		required: true,
		default: new Date(5,19,1989)
	}
};

var personSchema = new modlr.Schema(schemaTemplate);

personSchema.virtual("birthdayIsoString").get(function() {
	return this.birthday.toISOString();
});

var Person = new modlr.Model(personSchema);

var template = {
	name: "Jim",
	age: 50,
	languages: ["spanish"],
	friends: {
		"Bob": {
			knownSince: 1850
		}
	},
	isAwesome: false,
	birthday: new Date(5,19,1989)
};

exports["virtual get"] = function(test) {
	var p = new Person(template);
	test.strictEqual(p.birthdayIsoString, template.birthday.toISOString());

	test.done();
};