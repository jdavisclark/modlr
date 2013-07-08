var modlr = require("./modlr")
	, Base = require("selfish").Base;

var PersonSchema = new modlr.Schema({
	name: {
		type: String,
		required: true
	},
	occupation: {
		type: String,
		required: false,
		default: "developer"
	},
	age: Number
});

PersonSchema.virtual("foo").get(function() {
	return "bar";
});


var Person = modlr.Model(PersonSchema);

var me = new Person({
	age: 24,
	name: "Davis"
});

me.validate();

console.log(me.name, me.foo, me.occupation);