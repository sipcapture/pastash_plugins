Table of Contents
=================

* [Zephyr](#zephyr)
  * [Install](#install)
  * [Usage](#usage)
  * [Options](#options)
  * [Plugins](#plugins)
    * [Loading Plugins](#loading-plugins)
    * [Creating Plugins](#creating-plugins)
      * [Instance Plugins](#instance-plugins)
      * [Static Plugins](#static-plugins)
      * [Composite Plugins](#composite-plugins)
      * [Named Plugin](#named-plugin)
      * [Configuration](#configuration)
      * [Hooks](#hooks)
      * [Systems](#systems)
        * [Extend](#extend)
  * [Source](#source)
  * [Developer](#developer)
    * [Test](#test)
    * [Start](#start)
    * [Cover](#cover)
    * [Lint](#lint)
    * [Clean](#clean)
    * [Spec](#spec)
    * [Instrument](#instrument)
    * [Readme](#readme)
  * [License](#license)

Zephyr
======

[<img src="https://travis-ci.org/socialally/zephyr.svg" alt="Build Status">](https://travis-ci.org/socialally/zephyr)
[<img src="http://img.shields.io/npm/v/zephyr.svg" alt="npm version">](https://npmjs.org/package/zephyr)
[<img src="https://coveralls.io/repos/socialally/zephyr/badge.svg?branch=master&service=github&v=3" alt="Coverage Status">](https://coveralls.io/github/socialally/zephyr?branch=master).

Plugin functionality for modular libraries.

For an implementation using this module see [air](https://github.com/socialally/air).

## Install

```
npm i zephyr --save
```

## Usage

```javascript
var plug = require('zephyr')
  // create the plugin system
  , sys = plug({});
// load plugins
sys.plugin([require('plugin-file')]);
// create a component
var component = sys();
// do something with the plugin functionality
```

## Options

* `proto`: A reference to the prototype object.
* `type`: A reference to the class to instantiate.
* `main`: An alternative main function (factory).
* `plugin`: Override the default plugin function.
* `hooks`: Array of functions invoked as constructor hooks.
* `field`: String name of field for plugin function.

## Plugins

Plugins are functions invoked in the scope of a class prototype that typically decorate the prototype object (using `this`) but may also add static methods or load other plugins.

### Loading Plugins

To load plugin(s) call the `plugin` function passing an array of plugin functions:

```javascript
var plug = require('zephyr')
  , sys = plug();
sys.plugin([require('plugin-file')]);
```

It is possible to pass a configuration object at runtime to a plugin by using an object with a `plugin` function and a `conf` object:

```javascript
var plug = require('zephyr')
  , sys = plug();
var plugins = [
  {
    plugin: function(conf) {
      // do something with the runtime configuration
      // initialize the plugin
    },
    conf: {foo: 'bar'}
  }
];
sys.plugin(plugins);
```

### Creating Plugins

The most common use case for plugins is to decorate the class prototype with functions that are available on instances returned by the main function, these are referred to as *instance plugins*. Plugins may also decorate the main function these are referred to as *static plugins*.

Plugin implementations may mix functionality, for clarity the examples show the distinct styles.

#### Instance Plugins

To create an instance plugin just assign a function to `this` within the plugin function:

```javascript
module.exports = function plugin() {
  // decorate class prototype
  this.chain = function() {
    // return this to allow chaining on this function
    return this;
  }
}
```

Now load the plugin and invoke the instance method:

```javascript
var comp
  , plug = require('zephyr')
  // create the plugin system
  , sys = plug();
// load the plugin
sys.plugin([require('instance-plugin')]);
// get the instance from the main function
comp = sys();
// invoke the plugin method
comp.chain();
```

#### Static Plugins

To decorate the main function with static functions assign to `this.main`.

```javascript
module.exports = function plugin() {
  this.main.method = function() {
    // implement method functionality
  }
}
```

You can then invoke the function on the plugin system:

```javascript
var plug = require('zephyr')
  , sys = plug();
sys.plugin([require('static-plugin')]);
sys.method();
```

#### Composite Plugins

You can depend upon other plugins by calling `this.plugin` within the plugin function. This allows plugins to composite other plugins in order to resolve plugin dependencies or provide plugin groups (related plugins).

```javascript
module.exports = function plugin() {
  this.plugin([require('plugin-dependency')]);
}
```

By convention plugins are singular and plugin groups are plural.

#### Named Plugin

Typically a plugin will be a single module (file) and the plugin function is exported, however sometimes you may prefer to export a class or other function; in this case the plugin initialization function may be assigned to the exported object and referenced using the `field` option.

Consider a module that exports a class but also wishes to expose a plugin function:

```javascript
function Component(){}

Component.init = function() {
  // implement plugin functionality
}

module.exports = Component;
```

We can then configure the plugin system by specifying the `field` option with the name of the function, in this case `init`:

```javascript
var zephyr = require('zephyr')
  , main = zephyr({field: 'init'});
module.exports = main;
```

Then we can require the file when loading the plugin and the `init` function will be invoked for plugin initialization:

```javascript
main.plugin([require('./component-module')]);
```

#### Configuration

Plugins accept a single argument which is a configuration object optionally passed when loading the plugin. Useful when a plugin wishes to add functionality conditionally. For example:

```javascript
module.exports = function plugin(conf) {
  conf = conf || {};
  // implement default logic
  if(conf.ext) {
    // implement extended logic
  }
}
```

Then a consumer of the plugin system could enable the extended logic:

```javascript
sys.plugin({plugin: require('conf-plugin-file'), conf: {ext: true}})
```

#### Hooks

For some plugin systems it is useful to be able to add functionality in the scope of the component instance rather than the prototype. For example to add a default listener for an event, set properties on the instance or start running logic on component creation (or based on the plugin configuration).

Pass an array as the `hooks` option:

```javascript
var plug = require('zephyr')
  , sys = plug({hooks: []});
```

And an additional `register` method is available on `plugin`:

```javascript
function hook() {
  // do something on component instantiation
}
module.exports = function plugin() {
  // register the constructor hook
  this.plugin.register(hook);
}
```

Note that hooks are only applied when the component is created with the main function:

```javascript
var plug = require('zephyr')
  , sys = plug({hooks: []});
sys.plugin([require('plugin-with-hook')]);
// constructor hooks are applied
var comp = sys();
// bypass constructor hooks, probably not desirable
comp = new sys.Type();
```

#### Systems

A plugin system is the result of invoking the `zephyr` function:

```javascript
var plug = require('zephyr')
  , sys = plug();
module.exports = sys;
```

Which allows the ability to mix multiple components using plugins in the same code base. Typically you would export the main function returned as the plugin system.

##### Extend

Pass the `proto` and `type` options to extend the plugin system:

```javascript
var plug = require('zephyr');

// custom constructor
function PluginSystem() {}

var proto = PluginSystem.prototype
// extend the prototype with base functionality
// available to all plugins
var sys = plug({proto: proto, type: PluginSystem});
module.exports = sys;
```

For an example implementation see [air.js](https://github.com/socialally/air/blob/master/lib/air.js).

## Source

```javascript
;(function() {
  'use strict'

  function plug(opts) {
    opts = opts || {};

    /**
     *  Default plugin class.
     */
    function Component(){}

    var main
      , hooks = opts.hooks
      , proto = opts.proto || Component.prototype;

    /**
     *  Plugin method.
     *
     *  @param plugins Array of plugin functions.
     */
    function plugin(plugins) {
      var z, method, conf;
      for(z in plugins) {
        if(typeof plugins[z] === 'function') {
          method = plugins[z];
        }else{
          method = plugins[z].plugin;
          conf = plugins[z].conf;
        }
        if(opts.field && typeof method[opts.field] === 'function') {
          method = method[opts.field];
        }
        method.call(proto, conf);
      }
      return main;
    }

    /**
     *  Create an instance of the class represented by *Type* and proxy
     *  all arguments to the constructor.
     */
    function construct() {
      var args = Array.prototype.slice.call(arguments);
      function Fn() {
        return main.Type.apply(this, args);
      }
      Fn.prototype = main.Type.prototype;
      return new Fn();
    }

    /**
     *  Invoke constructor hooks by proxying to the main construct
     *  function and invoking registered hook functions in the scope
     *  of the created component.
     */
    function hook() {
      var comp = hook.proxy.apply(null, arguments);
      for(var i = 0;i < hooks.length;i++) {
        hooks[i].apply(comp, arguments);
      }
      return comp;
    }

    /**
     *  Register a constructor hook function.
     *
     *  @param fn The constructor hook.
     */
    function register(fn) {
      if(typeof fn === 'function' && !~hooks.indexOf(fn)) {
        hooks.push(fn);
      }
    }

    main = opts.main || construct;

    // hooks enabled, wrap main function aop style
    if(Array.isArray(hooks)) {
      hook.proxy = main;
      main = hook;
    }

    // class to construct
    main.Type = opts.type || Component;

    // static and instance plugin method
    main.plugin = proto.plugin = opts.plugin || plugin;

    // hooks enabled, decorate with register function
    if(Array.isArray(hooks)) {
      main.plugin.register = register;
    }

    // reference to the main function for static assignment
    proto.main = main;

    return main;
  }

  module.exports = plug;
})();
```

## Developer

Developer workflow is via [gulp](http://gulpjs.com) but should be executed as `npm` scripts to enable shell execution where necessary.

### Test

Run the headless test suite using [phantomjs](http://phantomjs.org):

```
npm test
```

To run the tests in a browser context open [test/index.html](https://github.com/socialally/zephyr/blob/master/test/index.html) or use the server `npm start`.

### Start

Serve the test files from a web server with:

```
npm start
```

### Cover

Run the test suite and generate code coverage:

```
npm run cover
```

### Lint

Run the source tree through [eslint](http://eslint.org):

```
npm run lint
```

### Clean

Remove generated files:

```
npm run clean
```

### Spec

Compile the test specifications:

```
npm run spec
```

### Instrument

Generate instrumented code from `lib` in `instrument`:

```
npm run instrument
```

### Readme

Generate the project readme file (requires [mdp](https://github.com/tmpfs/mdp)):

```
npm run readme
```

## License

Everything is [MIT](http://en.wikipedia.org/wiki/MIT_License). Read the [license](https://github.com/socialally/zephyr/blob/master/LICENSE) if you feel inclined.

Generated by [mdp(1)](https://github.com/tmpfs/mdp).

[node]: http://nodejs.org
[npm]: http://www.npmjs.org
[gulp]: http://gulpjs.com
[phantomjs]: http://phantomjs.org
[eslint]: http://eslint.org
[mdp]: https://github.com/tmpfs/mdp
[air]: https://github.com/socialally/air
[air.js]: https://github.com/socialally/air/blob/master/lib/air.js
