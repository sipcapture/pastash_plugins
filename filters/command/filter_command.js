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
    optional_params: ['debug', 'cmd', 'plugins', 'field', 'bypass'],
    default_values: {
      'debug': false,
      'bypass': false,
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
  logger.info('Initialized App Command');
  callback();
};

FilterCommand.prototype.process = function(data) {

  if(!this.cmd) return;
  try {
	var dataset = JSON.parse(data[this.field]);
        if (!dataset.filter) { logger.error('No Data Array - Bypass'); return; }
        if (this.debug) logger.info('GOT DATA',dataset);
        // command
        var command = "return exec()" + this.cmd + ".data(dataset)";
        var run = new Function('exec','dataset', command).bind(this);
        var out = run(exec,dataset);
        if (this.debug) logger.info('OUTPUT',out);
        this.emit('data',out);
   } catch(e){
        if (this.debug) logger.info(e);
        if (this.bypass) this.emit('data',data);
        return;
   }

};

exports.create = function() {
  return new FilterCommand();
};
