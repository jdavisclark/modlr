exports.list = [
	String,
	Number,
	Boolean,
	Object,
	Array
];

exports.check = function(type, candidate) {
	if(type === Number) {
		return is("[object Number]", candidate);
	}
	else if(type === String) {
		return is("[object String]", candidate);
	}
	else if(type === Boolean) {
		return is("[object Boolean]", candidate);
	}
	else if(type === Object) {
		return is("[object Object]", candidate);
	}
	else if(type === Array) {
		return is("[object Array]", candidate);
	} else return false;
}

function is(tString, candidate) {
	return Object.prototype.toString.call(candidate) === tString;
}