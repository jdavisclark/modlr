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
	this.methods = {};

	this.events = {
		pre: {},
		post: {}
	};

	events.forEach(function(eventType) {
		self.events.pre[eventType] = [];
		self.events.post[eventType] = [];
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

	var proxy = {};

	proxy.get = function(getter) {
		self.virtuals[name].get = getter;
		return proxy;
	};

	proxy.set = function(setter) {
		self.virtuals[name].set = setter;
		return proxy;
	};

	return proxy;
};

Schema.prototype.trigger = function(timing, event, model) {
	if (!this.events.hasOwnProperty(timing)) {
		throw new Error("timing '" + timing + "' not supported");
	}
	if (!this.events[timing].hasOwnProperty(event)) {
		throw new Error(timing + " '" + timing + "' event not supported");
	}

	var self = this;

	var promises = [];
	var subscriberQueue = this.events[timing][event].map(function(s) {
		return s;
	});

	var nextChainExecuted = false;

	function next(err) {
		if (err) {
			throw err;
		}

		var subscriber = subscriberQueue.shift() || function() {nextChainExecuted = true;};
		var subArgs = [next];
		subscriber.apply(model, subArgs);
	}

	next();

	if(!nextChainExecuted) {
		throw new Error("a middleware function failed to call 'next'. This can produce unexpected results. Fix it.");
	}
};

Schema.prototype.pre = function() {
	var args = Array.prototype.slice.call(arguments);
	var evtType = args.shift();
	var handler;
	var async = false;

	if (args.length > 1) {
		async = args.shift();
		handler = args.shift();
	} else {
		handler = args.shift();
	}

	this._registerEventhandler("pre", evtType, async, handler);
};

Schema.prototype.post = function() {
	var args = Array.prototype.slice.call(arguments);
	var evtType = args.shift();
	var handler;
	var async = false;

	if (args.length > 1) {
		async = args.shift();
		handler = args.shift();
	} else {
		handler = args.shift();
	}

	this._registerEventhandler("post", evtType, async, handler);
};

Schema.prototype._registerEventhandler = function(timing, eventType, async, handler) {
	if (!this.events[timing][eventType]) {
		throw new Error("event type not supported");
	}

	handler._isAsync = async;
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
	} else {
		throw new Error("could not determine field type");
	}

	desc._path = fName;
	return desc;
};

Schema.prototype.validate = function(candidate) {
	var self = this;
	var errors = [];

	this.trigger("pre", "validate", candidate);

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
				});
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

	this.trigger("post", "validate", candidate);

	return errors.length > 0 ? errors : undefined;
};


function isValidType(candidate) {
	return types.list.indexOf(candidate) !== -1;
}


module.exports = Schema;