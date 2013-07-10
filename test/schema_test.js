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

exports["min length supported types"] = function(test) {
	test.throws(function() {
		new modlr.Schema({
			enabled: {
				type: Boolean,
				minLength: 5
			}
		});
	});

	test.doesNotThrow(function() {
		new modlr.Schema({
			name: {
				type: String,
				minLength: 1
			}
		});
	});
	test.done();
};

exports["max length supported types"] = function(test) {
	test.throws(function() {
		new modlr.Schema({
			enabled: {
				type: Boolean,
				maxLength: 5
			}
		});
	});

	test.doesNotThrow(function() {
		new modlr.Schema({
			name: {
				type: String,
				maxLength: 1
			}
		});
	});
	test.done();
};