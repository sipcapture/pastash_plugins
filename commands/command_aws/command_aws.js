const s3 = require('s3')

module.exports = function plugin() {

this.awsFetch = function(data) {
   let downloadedFilePath = '/tmp'
    if(!Array.isArray(data)) { data = [data]; }
    for (var set of data) {
      if(!set.provider|!set.accessKeyId|!set.secretAccessKey|!set.region|!set.remoteFilename) {
	      set.error = true;
	      return;
      }
      if(set.localFilename){
          set.localFilename = downloadedFilePath+"/"+set.localFilename;
      } else {
          set.localFilename = downloadedFilePath+"/"+set.remoteFilename;
      }

      let bucketName = set.id || 'fetchBucket'
      let remoteFilename = set.remoteFilename;
      var client = s3.createClient({
      	maxAsyncS3: 20,     // this is the default
      	s3RetryCount: 3,    // this is the default
      	s3RetryDelay: 1000, // this is the default
      	multipartUploadThreshold: 20971520, // this is the default (20 MB)
      	multipartUploadSize: 15728640, // this is the default (15 MB)
      	s3Options: {
      	   accessKeyId: set.accessKeyId,
      	   secretAccessKey:  set.secretAccessKey,
      	   // any other options are passed to new AWS.S3()
      	   // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
      	},
      });
      var params = {
          localFile: set.localFilename ,
          s3Params: {
            Bucket:bucketName,
            Key: remoteFilename,
            // other options supported by getObject
            // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getObject-property
          },
        };
        var downloader = client.downloadFile(params);
        downloader.on('error', function(err) {
            console.error("unable to download:", err.stack);
	    set.error = true;
        });
        downloader.on('end', function() {
            //console.log("done downloading");
        }.bind(this));

    }
    // Apply Data
    this.data(data);
    // Return Chain
    return this;
  }


}

