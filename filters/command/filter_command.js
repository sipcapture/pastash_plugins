/*
   Command Module for paStash-NG using plugMeIn/Aggro
   (C) 2017 QXIP BV
*/

var base_filter = require('@pastash/pastash').base_filter,
  util = require('util'),
  logger = require('@pastash/pastash').logger;

var exec = require('plugmein');

function FilterCommand() {
  base_filter.BaseFilter.call(this);
  this.mergeConfig({
    name: 'Command',
    optional_params: ['debug', 'cmd', 'plugins', 'field', 'bypass', 'strict'],
    default_values: {
      'debug': false,
      'bypass': false,
      'strict': false,
      'field': 'message',
      'plugins': [],
    },
    start_hook: this.start,
  });
}

util.inherits(FilterCommand, base_filter.BaseFilter);

FilterCommand.prototype.start = function(callback) {
  if(this.plugins) {
    try {
        var plugs = [];
        if (!Array.isArray(this.plugins)) this.plugins = [this.plugins];
        if (this.debug) logger.info('Loading Commands...',this.plugins);
        this.plugins.forEach(function(plug){ exec = exec().plug( [require(""+plug+"")] ) });
        if (this.debug) logger.debug('Initialized Plugin Commands',Object.keys(exec()));
    } catch(e) { logger.error(e) }
  }
  logger.info('Initialized Plug Command');
  callback();
};

FilterCommand.prototype.process = function(data) {

  if(!this.cmd && !this.bypass) return;
  try {
	data = JSON.parse(data[this.field]);
        if (this.debug) logger.info('COMMAND IN',data);
        // command
        var command = "return exec()" + this.cmd + ".data(data)";
        var run = new Function('exec','data', command).bind(this);
        var out = run(exec,data);
        if (this.debug) logger.info('COMMAND OUT',out);
	return out;
   } catch(e){
        if (this.debug) logger.info(e);
        if (this.bypass) return data;
   }

};

exports.create = function() {
  return new FilterCommand();
};
