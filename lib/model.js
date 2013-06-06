var Base = require("selfish").Base;

module.exports = function(schema) {
	var blueprint = {
		initialize: function(o) {
			var self = this;
			Object.keys(o).forEach(function(key) {
				self[key] = o[key];
			});
		},
		validate: function() {
			return schema.executeValidation(this);
		}
	};

	var virtualKeys = Object.keys(schema.virtuals);
	virtualKeys.forEach(function(key) {
		var virtual = schema.virtuals[key];
		if(virtual.get) {
			blueprint.__defineGetter__(key, virtual.get);
		}
		if(virtual.set) {
			blueprint.__defineSetter__(key, virtual.set);
		}
	});

	return Base.extend(blueprint);
}