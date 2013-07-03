var _ = require("underscore"),
	types = require("./types");

function Schema(s) {
	this.fields = [];
	this.virtuals = {};

	this.init(s);
}

Schema.prototype.init = function(s) {
	var keys = Object.keys(s);
	var self = this;

	keys.forEach(function(key) {
		self.fields.push(self.getFieldDescriptor(s[key], key));
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


Schema.prototype.getFieldDescriptor = function(f, fName) {
	var desc = {
		required: false
	};

	if(Array.isArray(f) || (typeof f !== "object" && !isValidType(f))) {
		throw "schema fields must be types or type descriptor objects"
	}

	if(typeof f === "function" && types.list.indexOf(f) !== -1) {
		desc.type = f;
	} else if(typeof f === "object") {
		desc = _.extend(desc, f);
	} else throw "could not determine field type";

	desc._path = fName;
	return desc;
}

Schema.prototype.validate = function(candidate) {
	var self = this;


	self.fields.forEach(function(descriptor) {
		// validate type
		if(!types.check(descriptor.type, candidate[descriptor._path])) {
			throw ("Validation Error: '"+descriptor._path + "' type validation failed");
		}

		// required validation
		var val = candidate[descriptor._path];
		if(val === null && val === undefined) {
			throw "Validation Error: '"+descriptor._path+"' is required";
		}
	});
};





function isValidType(candidate) {
	return types.list.indexOf(candidate) !== -1;
}


module.exports = Schema;