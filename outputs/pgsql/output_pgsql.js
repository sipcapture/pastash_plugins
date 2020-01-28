var base_output = require('@pastash/pastash').base_output,
    logger = require('@pastash/pastash').logger,
    util = require('util');
var THIS ;
var pg = require('pg');

const { uuid } = require('uuidv4');

function OutputPostgres() {
    base_output.BaseOutput.call(this);
    this.mergeConfig({
        name: 'postgres',
        optional_params: ['db', 'table', 'query', 'host', 'user', 'password', 'port', 'create_table', 'id'],
        default_values: {
            'db' : 'test',
            'table' : 'pastash',
            'host': '127.0.0.1',
            'port': 5432,
            'user': 'root',
            'password': 'admin',
            'id': 'id',
	    'create_table': false
        },
        start_hook: this.start,
    });
}
OutputPostgres.prototype.start =function(callback) {
    THIS =  this;
    if (this.db) {
        try {
	    var pgConnectionString = 'postgres://' + this.username + ':' + this.password + '@' + this.host + ":" + this.port + '/' + this.db;
            logger.info('Initializing Output Filter Postgres:',this.db);
		pg.connect(pgConnectionString, function(err, client, done) {
        	  if(err) {
       		     return console.error('Error Fetching Client from Pool!', err);
       		  }
		  this.client = client;
		  this.done = done;
		  if (this.create_table){
			this.client.query('CREATE TABLE IF NOT EXISTS ' + this.table + '(id TEXT NOT NULL PRIMARY KEY, data JSONB NOT NULL);',
		                function(err,result) {
		                    done();
		                    if (err) {
		                        logger.error("Error Creating Table!", err);
		                    }
				    if (this.debug) logger.info(result);
				}
		        );
		  }
	        });
        } catch(e){ logger.error('Failed to Initialize Output Filter Postgres!',e); }
    }
    logger.info('Initialized Output Filter Postgres');
    callback();
}

util.inherits(OutputPostgres, base_output.BaseOutput);

OutputPostgres.prototype.process = function(data) {
	var id = uuid();
	if (data[this.id]) id = data[this.id];
	this.client.query('insert into ' + this.table + '(id, data) values($1, $2)',
                [id, data],
                function(err,result) {
                    if (err) {
                        logger.error("error inserting!", this.table, err);
                    }
		    if (this.debug) logger.info(result);
		}
        );
};

OutputPostgres.prototype.close = function(callback) {
    logger.info('Closing Output Filter Postgres');
    this.done();
    callback();
};

exports.create = function() {
    return new OutputPostgres();
};
