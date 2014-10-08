/**
 * Instance Stubs Convenience Methods
 *
 * @author Nicholas Silva (boxnes)
 * @since November 9, 2012
 *
 * Simple wrappers for sinon functions for Base.js instance methods
 */
sinon.sandbox.stubConstructor = function stubConstructor(object, value)
{
	return this.stub(object.prototype, 'constructor', value);
};

sinon.sandbox.stubInstanceMethod = function stubInstanceMethod(object, property, value)
{
	return this.stub(object.prototype, property, value);
};

sinon.sandbox.mockInstance = function mockInstance(object)
{
	return this.mock(object.prototype);
};

/**
 * Global Property Stubs
 *
 * @author Nicholas Silva (boxnes)
 * @since December 17, 2012
 *
 * A simple convenience method for setting and restoring global properties
 */
sinon.sandbox.stubProperty = function stubProperty(object, property, value)
{
	if (typeof(object[property]) == "function")
	{
		throw new TypeError("Attempted to wrap function " + property + " as property.");
	}
	if (!sinon.property_stubs) sinon.property_stubs = [];

	// check to see if this property is already stubbed
	for (var i = 0, len = sinon.property_stubs.length; i< len; i++)
	{
		var stub = sinon.property_stubs[i];

		if (stub.object == object && stub.property == property)
		{
			throw new Error('Attempted to stub property ' + property + ' when it is already stubbed.');
		}
	}

	sinon.property_stubs.push({
		object: object
		,property: property
		,value: object[property]
	});
	object[property] = value;
};


sinon.sandbox.verifyAndRestore = _.wrap(sinon.sandbox.verifyAndRestore, function(original)
{
	if (sinon.property_stubs)
	{
		for (var i = 0, len = sinon.property_stubs.length; i< len; i++)
		{
			var stub = sinon.property_stubs.pop();
			stub.object[stub.property] = stub.value;
			if (stub.object == window && stub.value == undefined)
			{
				window[stub.property] = undefined;
				try {
					delete window[stub.property];
				} catch (e) {
					// Deleting window properties throws an error in IE8
				}
			}
		}
	}
	sinon.global_property_stubs = undefined;
	return original.call(this);
});