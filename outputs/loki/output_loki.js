var abstract_http = require('./abstract_http'),
  util = require('util'),
  logger = require('@pastash/pastash').logger;

var recordCache = require('record-cache');

/* Bulk Helper */
var template = {"streams": [{"labels": "", "entries": [] }]}
var onStale = function(data){
 	for (let [key, value] of data.records.entries()) {
	     var line = JSON.parse(JSON.stringify(template));
	     line.streams[0].labels = key;
 	     value.list.forEach(function(row){
		// add to array
		line.streams[0].entries.push({ "ts": row['@timestamp']||new Date().toISOString(), "line": row  });
             });

 	     var path = this.replaceByFields(data, this.path);
 	 	if (path) {
 	 	  var http_options = {
 	 	    port: this.port,
 	 	    path: path,
 	 	    method: 'POST',
 	 	    headers: {
 	 	      'Content-Type': 'application/json'
 	 	    }
 	 	  };
 	 	  var line = this.serialize_data(data) || JSON.stringify(data);
 	 	  if (line) {
 	 	    http_options.headers['Content-Length'] = Buffer.byteLength(line, 'utf-8');
 	 	    if ( typeof this.host !== 'string' ) {
 	 	      for (var i = 0, len = this.host.length; i < len; i++){
 	 	         http_options.host = this.host[i];
 	 	         this.sendHttpRequest(http_options, line);
 	 	      }
 	 	    } else {
 	 	         http_options.host = this.host;
 	 	         this.sendHttpRequest(http_options, line);
 	 	    }
 	 	  }
 	 	}
        }
}

var cache;

function LokiPost() {
  abstract_http.AbstractHttp.call(this);
  this.mergeConfig(this.serializer_config('raw'));
  this.mergeConfig({
    name: 'Loki',
    optional_params: ['path', 'maxSize', 'maxAge'],
    default_values: {
      'path': '/',
      'maxSize': 5000,
      'maxAge': 1000,
    },
  });
  this.cache = recordCache({
	  maxSize: this.maxSize,
	  maxAge: this.maxAge,
	  onStale: onStale
  })
  cache = this.cache;
}

util.inherits(LokiPost, abstract_http.AbstractHttp);

LokiPost.prototype.process = function(data) {
	cache.add(data);
};

LokiPost.prototype.to = function() {
  return ' http ' + this.host + ':' + this.port;
};

exports.create = function() {
  return new LokiPost();
};
