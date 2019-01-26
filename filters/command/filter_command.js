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
    optional_params: ['debug', 'cmd', 'plugins'],
    default_values: {
      'debug': false,
    },
    start_hook: this.start,
  });
}

util.inherits(FilterCommand, base_filter.BaseFilter);

FilterCommand.prototype.start = function(callback) {
  if(this.plugins && this.plugins[0]) {
	exec = exec().plug(this.plugins);
  }
  logger.info('Initialized App Command');
  callback();
};

FilterCommand.prototype.process = function(data) {

  if(!this.cmd) return;
  var dataset = data.message || data;
  try {
	// command
	var command = "return exec()" + this.cmd + ".data(data)";
	var run = new Function('exec','data', command);
	var out = run(exec,dataset);
	if (debug) logger.info(command,out);
	this.emit('data',out);

   } catch(e){
	if (this.debug) logger.info(e);
	this.emit('data',dataset);
	return;
   }
};

exports.create = function() {
  return new FilterCommand();
};
