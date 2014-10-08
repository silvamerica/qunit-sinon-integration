/**
 * Inject sandbox methods into QUnit module creation, binding the thisObject
 * to the Sinon sandbox object, providing lots of additional functionality in
 * setup and teardown functions, and a more consistent feel overall.
 */
(function (global) {
    var qModule = QUnit.module;
    var setup = function () {
        $.extend(this, sinon.sandbox.create(sinon.config));
    };
    var teardown = function () { this.verifyAndRestore(); };
    QUnit.module = global.module = function (name, lifecycle) {
        lifecycle = lifecycle || {};
        var newlc = {};
        newlc.setup = function(){
            setup.bind(this)();
            lifecycle.setup && lifecycle.setup.bind(this)();
        };
        newlc.teardown = function(){
            teardown.bind(this)();
            lifecycle.teardown && lifecycle.teardown.bind(this)();
        };
        qModule(name, newlc);
    };
}(this));
