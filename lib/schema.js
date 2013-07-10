var _ = require("underscore"),
	types = require("./types"),
	events = require("./events"),
	validate = require("./validate");

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

		var subscriber = subscriberQueue.shift() || function() {
				nextChainExecuted = true;
			};
		var subArgs = [next];
		subscriber.apply(model, subArgs);
	}

	next();

	if (!nextChainExecuted) {
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

Schema.prototype._getFieldDescriptor = function(spec, fName) {
	var desc = {
		required: false
	};

	if (Array.isArray(spec) || (typeof spec !== "object" && !isValidType(spec))) {
		throw new Error("schema fields must be types or type descriptor objects");
	}

	if (typeof spec === "function" && types.list.indexOf(spec) !== -1) {
		desc.type = spec;
	} else if (typeof spec === "object") {
		checkDescriptor(spec);
		desc = _.extend(desc, spec);
	} else {
		throw new Error("could not determine field type");
	}

	desc._path = fName;
	return desc;
};

function checkDescriptor(descriptor) {
	if ((descriptor.hasOwnProperty("minLength") || descriptor.hasOwnProperty("maxLength")) && supportsMaxMinLength.indexOf(descriptor.type) === -1) {
		throw new Error("Type '" + types.getTypeString(descriptor.type) + "' does not supoprt min/max length!");
	}
}

Schema.prototype.validate = function(candidate) {
	this.trigger("pre", "validate", candidate);

	var errors = validate(candidate);

	this.trigger("post", "validate", candidate);
	return errors;
};


function isValidType(candidate) {
	return types.list.indexOf(candidate) !== -1;
}


module.exports = Schema;