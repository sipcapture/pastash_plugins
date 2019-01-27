const SolidBucket = require('solid-bucket')

module.exports = function plugin() {

  /*
   * fetch(u,k,data)
   *
   */

  this.awsFetch = function(data) {
    if(!Array.isArray(data)) { data = [data]; }
    for (var set of data) {
	if(!set.provider|!set.accessKeyId|!set.secretAccessKey|!set.region) return;
	let provider = new SolidBucket(set.provider|'aws', {
	    accessKeyId: set.accessKeyId,
	    secretAccessKey: set.secretAccessKey,
	    region: set.region|"us-east-1"
	})

	if (!provider|!set.remoteFilename) return;
	let bucketName = set.id || 'fetchBucket'
	let remoteFilename = set.remoteFilename;
	let downloadedFilePath = '/tmp'
	provider.downloadFile(bucketName, remoteFilename, downloadedFilePath).then((resp) => {
	    if (resp.status === 200) {
	        //console.log(resp.message)
		set.executed = true;
		set.localFilename = downloadedFilepath+"/"+remoteFilename;
	    }
	}).catch((resp) => {
	    if (resp.status === 400){
	        console.log('ERR',resp.message)
		set.executed = false;
		set.response = resp.status;
	    }
	})
    }
    // Apply Data
    this.data(data);
    // Return Chain
    return this;
  }

  /*
   * store(data)
   *
   */

  this.awsStore = function(data) {
    if(!Array.isArray(data)) { data = [data]; }
    for (var set of data) {
	if(!set.provider|!set.accessKeyId|!set.secretAccessKey|!set.region) return;
	let provider = new SolidBucket(set.provider|'aws', {
	    accessKeyId: set.accessKeyId,
	    secretAccessKey: set.secretAccessKey,
	    region: set.region|"us-east-1"
	})

	if (!provider|!set.localFilename) return;

	let bucketName = set.id || 'storeBucket'
	provider.uploadFile(bucketName, set.localFilename).then((resp) => {
	    if (resp.status === 200) {
	        //console.log(resp.message)
		set.executed = true;
	    }
	}).catch((resp) => {
	    if (resp.status === 400){
	        console.log('ERR',resp.message)
		set.executed = false;
		set.response = resp.status;
	    }
	})


    }
    // Apply Data
    this.data(data);
    // Return Chain
    return this;
  }

}


