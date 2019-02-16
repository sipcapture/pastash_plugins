/*
 * S3 Functions for PaStash Commands
 * (C) 2019 QXIP BV
 */

const process = async function(set){
        if(!set.provider|!set.accessKeyId|!set.secretAccessKey|!set.region|!set.remoteFilename) {
              set.error = true;
              return set;
        } else {

          if(!set.localFilename){
            set.localFilename = set.remoteFilename;
          }

          if(!set.downloadedFilePath){
            set.downloadedFilePath = downloadedFilePath;
          }

          var aws = require('aws-s3-promisified')({
            accessKeyId: set.accessKeyId,
            secretAccessKey: set.secretAccessKey
          });

          let bucketName = set.id || 'fetchBucket'
          var res = await aws.saveObjectToFile(bucketName, set.localFilename, set.downloadedFilePath);
          if (!res) { set.error = true; } else 
	  { set.error = false; set.localFilename = set.downloadedFilePath+"/"+set.localFilename }
          return set;
        }
}

module.exports = function plugin() {

  this.s3Fetch =  function(data) {
     var test = Promise.all( data.map( item => item = process(item) ));
     this.data(data);
     return this;
  }


 this.awsFetch = function(data) {
   let downloadedFilePath = '/tmp'
    if(!Array.isArray(data)) { data = [data]; }

   const start = async () => {
      await asyncForEach(data, async (set) => {

	if(!set.provider|!set.accessKeyId|!set.secretAccessKey|!set.region|!set.remoteFilename) {
	      set.error = true;
      	} else {

       	  if(!set.localFilename){
      	    set.localFilename = set.remoteFilename;
      	  }

	  if(!set.downloadedFilePath){
      	    set.downloadedFilePath = downloadedFilePath;
      	  }

	  var aws = require('aws-s3-promisified')({
	    accessKeyId: set.accessKeyId,
	    secretAccessKey: set.secretAccessKey
	  });

      	  let bucketName = set.id || 'fetchBucket'
	  var res = await aws.saveObjectToFile(bucketName, set.localFilename, set.downloadedFilePath);
	  if (!res) { set.error = true; } else { set.error = false; set.localFilename = set.downloadedFilePath+"/"+set.localFilename}
        }
     });
     return data;
   }
   start().then(function() {
     // Apply Data
     this.data(data);
     // Return Chain
     return this;
   }.bind(this));

 }


}
