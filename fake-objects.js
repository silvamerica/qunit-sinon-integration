/**
 * Sinon Fake Objects
 *
 * @author Nicholas Silva (silvamerica)
 * @since September 28, 2012
 */

sinon.fake = function fake(class_name, parent)
{
	// Check for an function call with no arguments
	if (arguments.length === 0)
	{
		throw new TypeError("Attempted to create an empty fake object");
	}
	parent = parent || window;
	if (parent[class_name])
	{
		throw new Error("Attempted to create a fake object " + class_name + " when an object by that name already exists on " + parent);
	}

	// Use a fake
	parent[class_name] = sinon.getFake(class_name, parent);

	return parent[class_name];
};

sinon.collection.fake = function fake()
{
	return this.add(sinon.fake.apply(sinon, arguments));
};

sinon.addFake = function addFake(base, class_name, instance_methods, class_methods, is_singleton)
{
	sinon.fakes = sinon.fakes || {};

	if (sinon.fakes[class_name])
	{
		throw new Error("Attempted to create a fake " + class_name + " when one already exists.");
	}
	sinon.fakes[class_name] =
	{
		base: base
		,instance_methods: instance_methods
		,class_methods: class_methods
		,is_singleton: is_singleton
	};
};

sinon.addSingletonFake = function addSingletonFake(base, class_name, instance_methods, class_methods)
{
	sinon.addFake(base, class_name, instance_methods, class_methods, true);
};

sinon.getFake = function getFake(class_name, parent)
{
	sinon.fakes = sinon.fakes || {};
	if (!sinon.fakes[class_name])
	{
		throw new Error("There is no fake definition for " + class_name);
	}

	var fake = sinon.fakes[class_name];
	var return_class = fake.base.extend(fake.instance_methods, fake.class_methods);

	if (fake.is_singleton)
	{
		return_class.get = function get() {
			if (!this.__instance)
			{
				this.__instance = new this();
			}
			return this.__instance;
		};
	}
	return_class.__fakeName = class_name;
	return_class.restore = function restore()
	{
		parent[this.__fakeName] = undefined;
		try {
			delete parent[this.__fakeName];
		} catch (e) {
			// Deleting window properties throws an error in IE8
		}
	};
	return return_class;
};