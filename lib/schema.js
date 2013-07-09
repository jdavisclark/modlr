var _ = require("underscore"),
	types = require("./types"),
	events = require("./events");

var supportsMaxMinLength = [
	String,
	Array,
	Object
];

function Schema(s) {
	var self = this;

	this.fields = [];
	this.virtuals = {};

	this.events = {
		before: {},
		after: {}
	};

	events.forEach(function(eventType) {
		self.events.before[eventType] = [];
		self.events.after[eventType] = [];
	});

	this.init(s);
}

Schema.prototype.init = function(s) {
	var keys = Object.keys(s);
	var self = this;

	keys.forEach(function(key) {
		self.fields.push(self._getFieldDescriptor(s[key], key));
	});
};

Schema.prototype.virtual = function(name) {
	var self = this;
	self.virtuals[name] = self.virtuals[name] || {};

	return {
		get: function(getter) {
			self.virtuals[name].get = getter;
		},
		set: function(setter) {
			self.virtuals[name].set = setter;
		}
	}
};

Schema.prototype.before = function(eventType, handler) {
	this._registerEventhandler("before", eventType, handler)
};

Schema.prototype.after = function(eventType, handler) {
	this._registerEventhandler("after", eventType, handler);
};

Schema.prototype._registerEventhandler = function(timing, eventType, handler) {
	if (!this.events[timing][eventType]) {
		throw new Error("event type not supported");
	}

	this.events[timing][eventType].push(handler);
};

Schema.prototype._getFieldDescriptor = function(f, fName) {
	var desc = {
		required: false
	};

	if (Array.isArray(f) || (typeof f !== "object" && !isValidType(f))) {
		throw new Error("schema fields must be types or type descriptor objects");
	}

	if (typeof f === "function" && types.list.indexOf(f) !== -1) {
		desc.type = f;
	} else if (typeof f === "object") {
		desc = _.extend(desc, f);
	} else throw new Error("could not determine field type");

	desc._path = fName;
	return desc;
}

Schema.prototype.validate = function(candidate) {
	var self = this;
	var errors = [];

	self.fields.forEach(function(descriptor) {
		var path = descriptor._path;

		// required validation
		var val = candidate[path];

		// if not required and not present, continue;
		if (!descriptor.required && val == null) {
			return;
		}

		if (descriptor.required && val == null) {
			errors.push({
				type: "Required",
				path: path
			});
		} else if (!types.check(descriptor.type, candidate[descriptor._path])) {
			errors.push({
				path: path,
				type: "Type",
				expectedType: types.getTypeString(descriptor.type)
			});
		} else if (descriptor.maxLength && supportsMaxMinLength.indexOf(descriptor.type) !== -1) {
			var max = descriptor.maxLength;
			var type = descriptor.type;
			var path = descriptor._path;
			var val = candidate[path];

			if ((type === String || type === Array) && val.length > max) {
				errors.push({
					path: path,
					type: "MaxLength",
					maxLength: max,
					actualLength: val.length
				});
			} else if (type === Object) {
				var len = Object.keys(val).length;
				if (len > max) {
					errors.push({
						path: path,
						type: "MaxLength",
						maxLength: max,
						actualLength: len
					});
				}
			}
		} else if (descriptor.minLength && supportsMaxMinLength.indexOf(descriptor.type) !== -1) {
			var min = descriptor.minLength;
			var type = descriptor.type;
			var path = descriptor._path;
			var val = candidate[path];

			if ((type === String || type === Array) && val.length < min) {
				errors.push({
					path: path,
					type: "MinLength",
					minLength: min,
					actualLength: val.length
				})
			} else if (type === Object) {
				var len = Object.keys(val).length;
				if (len < min) {
					errors.push({
						path: path,
						type: "MinLength",
						minLength: min,
						actualLength: len
					});
				}
			}
		}
	});

	return errors.length > 0 ? errors : undefined;
};


function isValidType(candidate) {
	return types.list.indexOf(candidate) !== -1;
}


module.exports = Schema;