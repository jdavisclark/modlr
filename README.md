modlr
=====
modlr is a database agnostic modeling framework for node.js (and the browser at some point). modlr lets you define model schemas very much like Mongoose.

What modlr suports:
- field types (String, Number, Array, Object, Boolean, Date)
- required fields
- default field values
- minLength field values for Strings, Arrays, and Objects (number of root object keys)
- maxLength field values
- virtual properties (get and set)
- model instance methods
- model middleware

### Why?
Javascript is dynamically typed, but there are times when you still want to be able to set up rules for required fields, type information, validation rules, etc... Lots of database client frameworks have this type of functionality built in (Mongoose Schemas). But what happens if you want this functionality without being tied to a specific database or database framework? There aren't a whole lot of options, and thats where modlr comes in.

### Get Started
```javascript
var modlr = require("modlr");

var personSchema = new modlr.Schema({
	name: {
		type: String,
		required: true
	},
	isAwesome: {
		type: Boolean,
		required: true,
		default: false
	}
});

var Person = new modlr.Model(personSchema);
var me = new Person({
	name: "jdc0589"
});

me.validate(); // undefined, everything is valid

delete me.name;
me.validate(); // [{ path: "name", type: "Required" }]

me.name = true;
me.validate(); //[{ path: "name", type: "Type", expectedType: "String",  }]
```

