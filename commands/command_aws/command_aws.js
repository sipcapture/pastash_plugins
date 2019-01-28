/*
 * S3 Functions for PaStash Commands
 * (C) 2019 QXIP BV
 */

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

module.exports = function plugin() {

 this.awsFetch = function(data) {
   let downloadedFilePath = '/tmp'
    if(!Array.isArray(data)) { data = [data]; }


   const start = async () => {
      await asyncForEach(data, async (set) => {

	if(!set.provider|!set.accessKeyId|!set.secretAccessKey|!set.region|!set.remoteFilename) {
	      set.error = true;
	      return;
      	}
      	if(!set.localFilename){
      	    set.localFilename = set.remoteFilename;
      	}

	var aws = require('aws-s3-promisified')({
	    accessKeyId: set.accessKeyId,
	    secretAccessKey: set.secretAccessKey
	});

      	let bucketName = set.id || 'fetchBucket'
	var res = aws.saveObjectToFile(bucket, set.localFilename, set.downloadedFilePath);
        console.log(res);
	if (!res) { set.error = true; }
	else { set.localFilename = set.downloadedFilePath+"/"+set.localFilename}

     });
       console.log('Done');
   } start();
   // Apply Data
   this.data(data);
   // Return Chain
   return this;

 }

}

