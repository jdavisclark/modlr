var modlr = require("./modlr")
	, Base = require("selfish").Base;

var PersonSchema = new modlr.Schema({
	name: String,
	age: Number
});

PersonSchema.validate("name").required();

var Person = modlr.Model(PersonSchema);

var me = Person.new({
	name: "Davis",
	age: 24
});

var s = me.validate();
console.log(s);

console.log(me.age);
