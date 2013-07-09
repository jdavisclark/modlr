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
	firstName: {
		type: String
	},
	lastName: String,
	age: {
		type: Number
	},
	languages: {
		type: Array
	},
	friends: {
		type: Object
	},
	isAwesome: {
		type: Boolean
	},
	birthday: {
		type: Date
	}
};

var personSchema = new modlr.Schema(schemaTemplate);

personSchema.virtual("birthdayIsoString")
	.get(function() {
		return this.birthday.toISOString();
	});

personSchema.virtual("fullName")
	.get(function() {
		return this.firstName + " " + this.lastName;
	})
	.set(function(val) {
		var parts = val.split(" ");
		this.firstName = parts[0];
		this.lastName = parts[1];
	});


var Person = new modlr.Model(personSchema);

var template = {
	firstName: "Jim",
	lastName: "White",
	age: 50,
	languages: ["spanish"],
	friends: {
		"Bob": {
			knownSince: 1850
		}
	},
	isAwesome: false,
	birthday: new Date(5, 19, 1989)
};

exports["virtual get"] = function(test) {
	var p = new Person(template);
	test.strictEqual(p.birthdayIsoString, template.birthday.toISOString());
	test.strictEqual(p.fullName, template.firstName + " " + template.lastName);

	test.done();
};

exports["virtual set"] = function(test) {
	var p = new Person(template);

	p.fullName = "Davis Clark";
	test.strictEqual(p.firstName, "Davis");
	test.strictEqual(p.lastName, "Clark");

	test.done();
};