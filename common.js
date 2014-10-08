/**
 * Common Convenience Methods
 * 
 * @author Nicholas Silva (silvamerica)
 * @since September 26, 2012
 *
 */
_ = {};
_.wrap = function(func, wrapper)
{
	return function()
	{
		var args = [func].concat(Array.prototype.slice.call(arguments, 0));
		return wrapper.apply(this, args);
	};
};