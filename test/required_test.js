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
	}
});

var Person = new modlr.Model(personSchema);


exports['template values passthrough'] = function(test) {
	test.expect(4);

	var p = new Person({
		name: "Davis Clark",
		age: 24,
		interests: ["programming"],
		friends: {
			"Brendan": {
				age: 24,
				knownSince: 2009
			}
		}
	});

	// tests here
	test.equal(p.name, "Davis Clark");
	test.equal(p.age, 24);
	test.deepEqual(p.interests, ["programming"]);
	test.deepEqual(p.friends, {
		"Brendan": {
			age: 24,
			knownSince: 2009
		}
	});

	test.done();
};

exports['required string'] = function(test) {
	var self = this;
	debugger;
	var p = new Person({
		age: 24,
		interests: ["programming"],
		friends: {}
	});

	var errors = p.validate();
	test.deepEqual(errors, [{
		path: "name",
		type: "Required"
	}]);

	p.name = "Davis";
	errors = p.validate();

	test.deepEqual(errors, []);

	test.done();
};

exports['required number'] = function(test) {
	var self = this;

	var p = new Person({
		name: "davis",
		interests: ["programming"],
		friends: {}
	});

	var err = p.validate();
	test.deepEqual(err, [{
		type: "Required",
		path: "age"
	}]);

	p.age = 24;

	err = p.validate();
	test.deepEqual(err, []);

	test.done();
};

exports['required array'] = function(test) {
	var self = this;

	var p = new Person({
		name: "davis",
		age: 24,
		friends: {}
	});

	var err = p.validate();
	test.deepEqual(err, [{
		type: "Required",
		path: "interests"
	}]);

	p.interests = ["stuff"];
	err = p.validate();
	test.deepEqual(err, []);

	test.done();
};

exports['required object'] = function(test) {
	var self = this;

	var p = new Person({
		name: "davis",
		age: 24,
		interests: []
	});

	var err = p.validate();
	test.deepEqual(err, [{
		type: "Required",
		path: "friends"
	}]);

	p.friends = {};
	err = p.validate();

	test.deepEqual(err, []);

	test.done();
};