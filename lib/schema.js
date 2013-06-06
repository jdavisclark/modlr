var types = require("./types");

function Schema(s) {
	this.fields = {};
	this.virtuals = {};
	this.validations = {};

	this.init(s);
}

Schema.prototype.init = function(s) {
	var keys = Object.keys(s);
	var self = this;

	keys.forEach(function(key) {
		self.fields[key] = self.getFieldDescriptor(s[key]);
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

Schema.prototype.validate = function(path) {
	var self = this;
	self.validations[path] = self.validations[path] || {};

	if(self.fields[path]) {
		self.validations[path].type = self.fields[path].type;
	}

	return {
		required: function() {
			self.validations[path].required = true;
		}
	}
};

Schema.prototype.executeValidation = function(model) {
	var summary = {};
	var self = this;

	Object.keys(self.validations).forEach(function(key) {
		var validator = self.validations[key];

		if(validator.required && model[key] == null) {
			summary[key] = "required";
		}

		if(!types.check(validator.key, model[key])) {
			summary[key] = "must be of type " + Object.prototype.toString.call(validator.type);
		}
	});

	return Object.keys(summary).length > 0 ? summary : true;
};


Schema.prototype.getFieldDescriptor = function(f) {
	var desc = {};

	if(types.list.indexOf(f) !== -1) {
		desc.type = f;
		return desc;
	}

	throw "should never get here.";
}


module.exports = Schema;