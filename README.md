modlr
=====
modlr is a database agnostic data modeling and specification framework for node.js (and the browser at some point). The API is heavily influenced by Mongoose.

#### why do you need this?
Javascript is dynamically typed, but there are times when you still want to be able to set up rules for required fields, type information, validation rules, etc... Lots of database client frameworks have this type of functionality built in (eg: Mongoose), but what happens if you don't want to be tied to a specific database or database framework? There aren't a whole lot of options, and thats where modlr comes in. 

#### what modlr suports:
- field types (String, Number, Array, Object, Boolean, Date)
- required fields
- default field values
- minLength field values for Strings and Arrays
- maxLength field values
- allowed values for strings and arrays
- virtual properties
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
me.validate(); // [{path: "species", type: "AllowedValue", allowedValues: ["human"], {path: "age", type: "Type", expectedType: "Number", actualType: "String"}}]
```

___

### License

Copyright (c) 2013 Davis Clark <jdc0589@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
