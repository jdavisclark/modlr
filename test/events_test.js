'use strict';

var modlr = require('../modlr.js'),
	Q = require("q");

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
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	fullName: {
		type: String,
		required: true
	},
	random: {
		type: Number,
		required: true
	},
	afterValidate: {
		type: Boolean,
		default: false
	}
};

var personSchema = new modlr.Schema(schemaTemplate);

var template = {
	firstName: "Davis",
	lastName: "Clark"
};

personSchema.pre("validate", function(next) {
	this.fullName = this.firstName + " " + this.lastName;
	next();
});

personSchema.pre("validate", function(next) {
	this.random = 1234;
	next();
});

personSchema.post("validate", function(next) {
	this.afterValidate = true;
	next();
});

var Person = new modlr.Model(personSchema);

exports["serial pre validate"] = function(test) {
	var p = new Person(template);

	test.strictEqual(p.fullName, undefined);
	test.strictEqual(p.random, undefined)

	var errors = p.validate();

	test.deepEqual(errors, undefined);
	test.equal(p.fullName, "Davis Clark");
	test.equal(p.random, 1234);

	test.done();
};

exports["serial after validate"] = function(test) {
	var p = new Person();
	p.validate();

	test.strictEqual(p.afterValidate, true);
	test.done();
};

exports["failing to call next should throw"] = function(test) {
	var s = new modlr.Schema({
		after: {
			type: Boolean,
			default: false
		}
	});

	s.pre("validate", function(next) {
		this.after = true;
	});

	var S = new modlr.Model(s);
	var tmp = new S();

	test.throws(function() {
		tmp.validate()
	});

	test.done();
};

exports["async pre validate"] = function(test) {
	test.expect(4);
	debugger;

	var s = new modlr.Schema({
		afterAsync: { type: Boolean, default: false },
		afterSync: { type: Boolean, default: false }
	});

	// async middleware
	s.pre("validate", true, function(next, done) {
		var self = this;

		setTimeout(function(){
			self.afterAsync = true;
			done();
		}, 500);

		next();
	});

	// sync middleware
	s.pre("validate", function(next) {
		this.afterSync = true;
		next();
	});

	var S = new modlr.Model(s);
	var tmp = new S();

	tmp._schema.trigger("pre", "validate", tmp, function(err) {
		test.strictEqual(err, undefined);
		test.strictEqual(tmp.afterAsync, true);
		test.done();
	});

	test.strictEqual(tmp.afterAsync, false);
	test.strictEqual(tmp.afterSync, true);
};
