exports.list = [
	String,
	Number,
	Boolean,
	Object,
	Array,
	Date
];

exports.check = function(type, candidate) {
	return is(exports.getTypeString(type), candidate);
};

exports.getTypeString = function(type) {
	if(type === Number) {
		return "Number";
	}
	else if(type === String) {
		return "String";
	}
	else if(type === Boolean) {
		return "Boolean";
	}
	else if(type === Object) {
		return "Object";
	}
	else if(type === Array) {
		return "Array"
	} else if (type === Date) {
		return "Date";
	}
	else throw new Error("type not supported: " + type);
}

function is(tString, candidate) {
	return Object.prototype.toString.call(candidate).indexOf(tString) > 0;
}