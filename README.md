modlr
=====
modlr is a database agnostic data modeling and specification framework for node.js (and the browser at some point). The API is heavily influenced by Mongoose; at some point modlr may even completely support mongoose schemas.

#### why do you need this?
Javascript is dynamically typed, but there are times when you still want to be able to set up rules for required fields, type information, validation rules, etc... Lots of database client frameworks have this type of functionality built in (Mongoose Schemas). But what happens if you want this kind of functionality without being tied to a specific database or database framework? There aren't a whole lot of options, and thats where modlr comes in. 

#### what modlr suports:
- field types (String, Number, Array, Object, Boolean, Date)
- required fields
- default field values
- minLength field values for Strings, Arrays, and Objects (number of root object keys)
- maxLength field values
- allowed values for strings and arrays
- virtual properties (get and set)
- model instance methods
- model middleware



### getting started
```javascript
var modlr = require("modlr");

var personSchema = new modlr.Schema({
	name: String,
	age: Number,	
	species: {
		type: String,
		allowed: ["human"]
	}
});

var Person = new modlr.Model(personSchema);
var me = new Person({
	name: "jdc0589",
	age: 24,	
	species: "human"
});

me.validate() === undefined; // true. Yay! everything is valid

me.age = "yes";
me.validate(); // [{path: "age", type: "Type", expectedType: "Number", actualType: "String"}]

me.species = "asgard";
me.validate(); // [{path: "species", type: "AllowedValue", allowedValues: ["human"]}]
```

