var Base = require("selfish").Base;

module.exports = function(schema) {
	var blueprint = {
		initialize: function(o) {
			var self = this;
			self._schema = schema;

			Object.keys(o).forEach(function(key) {
				self[key] = o[key];
			});
		},
		validate: function() {
			return schema.validate.call(this._schema, this);
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