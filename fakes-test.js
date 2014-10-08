/*
 *                        ,-,-
 *                       / / |
 *     ,-'             _/ / /
 *    (-_          _,-' `Z_/
 *     "#:      ,-'_,-.    \  _
 *      #'    _(_-'_()\     \" |
 *    ,--_,--'                 |
 *   / ""                      L-'\
 *   \,--^---v--v-._        /   \ |
 *     \_________________,-'      |
 *                      \
 *                       \
 *                        \
 *         HERE BE DRAGONS
 *
 * Autogenerate Fake Tests
 *
 * @author Nicholas Silva (silvamerica)
 * @since  October 2, 2012
 *
 * This file autogenerates test modules and tests
 * to make sure that the interfaces for defined fake
 * objects match their real counterparts.  You most likely
 * don't need to touch it--if you do, you're asking for
 * dragons.
 *
 * All you have to do to add a fake is:
 * 1. Add a file to test/qunit/js/qunit/fakes_test.tmpl
 * 2. Resolve JS dependencies
 * 3. Use sinon.reflect() to get the interface.
 * 4. Add a definition in test/qunit/framework/sinon-fakes.js
 *
 */
$(function()
{
	$.each(sinon.fakes, function(class_name, fake_config)
	{
		if (class_name == 'Default')
		{
			return true;
		}
		var fake_object = sinon.getFake(class_name);
		module(class_name,
		{
			setup: function()
			{
				this.fake_object = fake_object;
			}
		});

		test("fake " + class_name + " matches " + fake_object.__fakeName, function()
		{
			for (var method in window[this.fake_object.__fakeName])
			{
				if (method == 'restore' || method == '__fakeName')
				{
					continue;
				}
				equal(typeof(this.fake_object[method]), typeof window[this.fake_object.__fakeName][method], method + " is a static property of " + this.fake_object.__fakeName);
			}
			// Stomp on the constructor of the real fake object as it has to be skipped
			for (var method in window[this.fake_object.__fakeName].prototype)
			{
				var obj = fake_config.is_singleton ? this.fake_object.get() : new this.fake_object();

				equal(typeof(obj[method]), typeof window[this.fake_object.__fakeName].prototype[method], method + " is a dynamic property of " + this.fake_object.__fakeName + " instances");
			}
		});

	});

});