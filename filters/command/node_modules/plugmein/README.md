# PlugMeIn

PlugMeIn is an extended and pluggable version of [Aggro](https://github.com/borgar/aggro), a very basic utility to filter and sort a collection of items for use in reports or visualizations.

### Why Forking?
This version is modified to work within [paStash](https://github.com/sipcapture/pastash). Assuming we don't drift too far off, we'll propose changes back to Aggro whenever mature.


## Plug Functions
PlugMeIn supports function injection from local or remote (npm) modules
```javascript
// Initialize
var plugmein = require('plugmein');

// Re-Initialize w/ Plugins
plugmein = plugmein().plug([ require('my-npm-module'), require('./my-local-module').myFunc ]);

plugmein().myFunc()

```



