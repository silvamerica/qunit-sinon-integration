/**
 * Reflection
 *
 * @author Nicholas Silva (silvamerica)
 * @since October 2, 2012
 *
 * Iterates over all properties of an object and outputs the types as classes.
 * Useful for creating a fake class definition.
 *
 */
sinon.reflect = function reflect(object)
{
	var output = '\n';
	for (var prop in object) {
		if ($.inArray(prop, ["base", "extend", "constructor", "ancestor", "forEach", "implement", "toString", "valueOf", "get"]) == -1)
		{
			output += prop + ': ' + (typeof object[prop]).toLowerCase().replace(/\b[a-z]/g, function(letter)
			{
				return letter.toUpperCase();
			});

			output += '(),\n';
		}
	}

	// Remove last ','
	output = output.substring(0, output.length - 2);
	output += '\n';

	// Function() -> function() {}
	output = output.replace(/Function\(\)/g, 'function() {}');

	// Object() -> {}
	output = output.replace(/Object\(\)/g, '{}');

	return output;
};