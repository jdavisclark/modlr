var _ = require("underscore");

function Model(schema, o) {
	var self = this;
	self._schema = schema;

	Object.keys(o).forEach(function(key) {
		self[key] = o[key];
	});

	var fields = self._schema.fields;

	// defaults
	fields.forEach(function(field) {
		if (field["default"] != null && o[field._path] == null) {
			self[field._path] = getDefault(field, o);
		}
	});
}

Model.prototype.validate = function() {
	return this._schema.validate.call(this._schema, this);
};

Model.prototype.toObject = function() {
	var fields = this._schema.fields,
		self = this;

	var errors = this.validate();
	if(errors) {
		throw new Error("validation failed");
	}

	var obj = {};

	fields.forEach(function(field) {
		obj[field._path] = self[field._path];
	});

	return obj;
};

function getDefault(field, o) {
	var d = field["default"];

	if (typeof(d) === "function") {
		return d.call(o);
	} else return d;
}


module.exports = function(schema) {
	var f = function(template) {
		Model.call(this, schema, template || {});
	};

	f.prototype = Object.create(Model.prototype);

	// virtuals
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