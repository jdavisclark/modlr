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
		type: String
	},
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
	birthday: new Date(5, 19, 1989)
};

var typeVals = [{
		type: String,
		val: "string value"
	}, {
		type: Number,
		val: 333
	}, {
		type: Array,
		val: ["hurr", "durr"]
	}, {
		type: Object,
		val: {
			hurr: "durr"
		}
	}, {
		type: Boolean,
		val: true
	}, {
		type: Date,
		val: new Date(5, 5, 1980)
	}
];

var typesToTest = [{
		type: String,
		path: "name",
		expected: modlr.types.getTypeString(String)
	}, {
		type: Number,
		path: "age",
		expected: modlr.types.getTypeString(Number)
	}, {
		type: Array,
		path: "languages",
		expected: modlr.types.getTypeString(Array)
	}, {
		type: Object,
		path: "friends",
		expected: modlr.types.getTypeString(Object)
	}, {
		type: Boolean,
		path: "isAwesome",
		expected: modlr.types.getTypeString(Boolean)
	}, {
		type: Date,
		path: "birthday",
		expected: modlr.types.getTypeString(Date)
	}
];

// for each type-to-test defined, validate that every type (aside from the one defined in the schema) causes validation to fail
exports["type validation"] = function(test) {
	typesToTest.forEach(function(toTest) {
		typeVals.forEach(function(type) {
			var p = new Person();
			p[toTest.path] = type.val;

			var errors = p.validate();

			if (type.type === toTest.type) {
				test.deepEqual(errors, undefined);
			} else {
				test.deepEqual(errors, [{
						path: toTest.path,
						type: "Type",
						expectedType: toTest.expected
					}
				]);
			}
		});
	});

	test.done();
};