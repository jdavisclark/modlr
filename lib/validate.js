var types = require("./types"),
	paths = require("./paths");

module.exports = function(model) {
	var errors = [],
		schema = model._schema;

	function addError(err) {
		if (err) {
			errors.push(err);
		}
	};

	schema.fields.forEach(function(descriptor) {
		var path = descriptor._path
		var val = paths.resolveValue(descriptor._path, model);
		var type = descriptor.type;

		// handle no value cases && required validation
		if (!hasValue(val) && !descriptor.required) {
			// cant validate a non-required field with no value
			return;
		} else if (!hasValue(val) && descriptor.required) {
			addError({
				type: "Required",
				path: path
			});

			// required fields have to have a value for additional validations
			return;
		}

		// type validation
		addError(validateType(descriptor, model, val));

		// minLength validation
		if (hasValue(descriptor.minLength)) {
			addError(validateMinLength(descriptor, model, val));
		}

		//maxLength validation
		if (hasValue(descriptor.maxLength)) {
			addError(validateMaxLength(descriptor, model, val));
		}
	});

	return errors.length > 0 ? errors : undefined;
};

function validateType(descriptor, candidate, val) {
	if (!types.check(descriptor.type, val)) {
		return {
			path: descriptor._path,
			type: "Type",
			expectedType: types.getTypeString(descriptor.type)
		};
	}
};

function validateMinLength(descriptor, candidate, val) {
	var min = descriptor.minLength;
	var type = descriptor.type;
	var path = descriptor._path;

	if ((type === String || type === Array) && val.length < min) {
		return {
			path: path,
			type: "MinLength",
			minLength: min,
			actualLength: val.length
		};
	} else if (type === Object) {
		var len = Object.keys(val).length;
		if (len < min) {
			return {
				path: path,
				type: "MinLength",
				minLength: min,
				actualLength: len
			};
		}
	}
};

function validateMaxLength(descriptor, candidate, val) {
	var max = descriptor.maxLength;
	var type = descriptor.type;
	var path = descriptor._path;

	if ((type === String || type === Array) && val.length > max) {
		return {
			path: path,
			type: "MaxLength",
			maxLength: max,
			actualLength: val.length
		};
	} else if (type === Object) {
		var len = Object.keys(val).length;
		if (len > max) {
			return {
				path: path,
				type: "MaxLength",
				maxLength: max,
				actualLength: len
			};
		}
	}
}


/* helpers */

function hasValue(val) {
	return val != null;
}