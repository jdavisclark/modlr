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
	friends: {
		type: Object,
		required: true
	},
	isAwesome: {
		type: Boolean,
		required: true
	}
});

var Person = new modlr.Model(personSchema);


var template = {
	name: "Davis Clark",
	age: 24,
	interests: ["programming"],
	friends: {
		Jim: {
			knownSince: 2009
		}
	},
	isAwesome: true
};

exports['template values passthrough'] = function(test) {
	var p = new Person(template);

	Object.keys(template).forEach(function(key) {
		test.deepEqual(p[key], template[key]);
	});

	test.done();
};

exports['required string'] = function(test) {
	var self = this;
	var p = new Person(template);

	delete p.name;

	var errors = p.validate();
	test.deepEqual(errors, [{
			path: "name",
			type: "Required"
		}
	]);

	p.name = "Davis";
	errors = p.validate();

	test.deepEqual(errors, undefined);

	test.done();
};

exports['required number'] = function(test) {
	var self = this;

	var p = new Person(template);
	delete p.age;

	var err = p.validate();
	test.deepEqual(err, [{
			type: "Required",
			path: "age"
		}
	]);

	p.age = 24;

	err = p.validate();
	test.deepEqual(err, undefined);

	test.done();
};

exports['required array'] = function(test) {
	var self = this;

	var p = new Person(template);
	delete p.interests;

	var err = p.validate();
	test.deepEqual(err, [{
			type: "Required",
			path: "interests"
		}
	]);

	p.interests = ["stuff"];
	err = p.validate();
	test.deepEqual(err, undefined);

	test.done();
};

exports['required object'] = function(test) {
	var self = this;

	var p = new Person(template);
	delete p.friends;

	var err = p.validate();
	test.deepEqual(err, [{
			type: "Required",
			path: "friends"
		}
	]);

	p.friends = {};
	err = p.validate();

	test.deepEqual(err, undefined);

	test.done();
};

exports['required object'] = function(test) {
	var p = new Person();
	var errors = p.validate();
	var expextedErrors = Object.keys(template).map(function(key) {
		return {
			path: key,
			type: "Required"
		};
	});

	test.deepEqual(errors, expextedErrors);
	test.done();
};