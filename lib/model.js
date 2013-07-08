var _ = require("underscore");

module.exports = function(schema) {
	var f = function(o) {
		var self = this;
		self._schema = schema;

		Object.keys(o).forEach(function(key) {
			self[key] = o[key];
		});

		var fields = self._schema.fields;

		// defaults
		fields.forEach(function(field) {
			if(field["default"] != null && o[field._path] == null) {
				self[field._path] = getDefault(field, o);
			}
		});
	};

	f.prototype.validate = function() {
		return schema.validate.call(this._schema, this);
	};

	var virtualKeys = Object.keys(schema.virtuals);
	virtualKeys.forEach(function(key) {
		var virtual = schema.virtuals[key];

		Object.defineProperty(f.prototype, key, {
			get: virtual.get,
			set: virtual.set
		});
	});



	return f;
}

function getDefault(field, o) {
	var d = field["default"];

	if(typeof(d) === "function") {
		return d.call(o);
	} else return d;
}