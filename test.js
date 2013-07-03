var modlr = require("./modlr")
	, Base = require("selfish").Base;

var PersonSchema = new modlr.Schema({
	name: {
		type: String,
		required: true
	},
	age: Number
});

PersonSchema.virtual("foo").get(function() {
	return "bar";
});


var Person = modlr.Model(PersonSchema);

var me = Person.new({
	age: 24
});

me.validate();

console.log(me.name)