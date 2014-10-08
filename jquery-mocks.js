/**
 * jQuery Instance Mocks
 *
 * @author Nicholas Silva (silvamerica)
 * @since September 26, 2012
 *
 * Force jQuery to always return $() mocks if they exist
 * This allows you to do things like this.mock($('.contacts'))
 * and have all future calls to $('.contacts') return the Sinon mock
 * instead of a new jQuery instance.
 *
 */

// Wrap sinon sandbox creation to instantiate a jquery_mocks object
sinon.sandbox.create = _.wrap(sinon.sandbox.create, function(original, config)
{
	sinon.jquery_mocks = {};
	return original(config);
});

// Wrap teardown (verifyAndRestore) so that the jquery_mocks object is cleaned up
sinon.sandbox.verifyAndRestore = _.wrap(sinon.sandbox.verifyAndRestore, function(original)
{
	var return_value = original.call(this);
	sinon.jquery_mocks = undefined;
	return return_value;
});

// Wrap mock creation to add mocks by selector to the jquery_mocks object
sinon.mock.create = _.wrap(sinon.mock.create, function(original, object)
{
	var mock = original(object);
	if (object instanceof jQuery)
	{
		sinon.jquery_mocks[object.selector] = mock;
	}
	return mock;
});

// Wrap the jQuery init function to check for sinon jquery_mocks
// "What are you doing?! You're going to break everything!"
$.fn.init = _.wrap(jQuery.fn.init, function(original, s, c, r)
{
	if (sinon.jquery_mocks && sinon.jquery_mocks[s])
	{
		return sinon.jquery_mocks[s].object;
	}
	else
	{
		return new original(s, c, r);
	}
});