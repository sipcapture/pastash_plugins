/*
 * S3 Functions for PaStash Commands
 * (C) 2019 QXIP BV
 */

let conf;
const defaultConf = {
  pluginFieldName: 'FileFetch',
  bucketName: 'fetchBucket'
};

module.exports = function plugin(userConf) {
  conf = { ...defaultConf, ...userConf };

  this.main.s3Fetch = function s3Fetch(next) {
    const data = this.data[conf.pluginFieldName];

    const aws = require('aws-s3-promisified')({
      accessKeyId: conf['buckets'][data[conf.bucketField]].accessKeyId,
      secretAccessKey: conf['buckets'][data[conf.bucketField]].secretAccessKey
    });
    aws.saveObjectToFile(data[conf.bucketField], data[conf.nameField], data[conf.outputFileField] + data[conf.nameField]).then(() => {
      next();
    }).catch((err) => {
      console.log(err, 'file fetch error');
    });
  }

}

// const process = async function (set) {
//   if (!set.accessKeyId | !set.secretAccessKey | !set.remoteFilename) {
//     set.error = true;
//     return set;
//   } else {

//     if (!set.localFilename) {
//       set.localFilename = set.remoteFilename;
//     }

//     if (!set.downloadedFilePath) {
//       set.downloadedFilePath = downloadedFilePath;
//     }

//     var aws = require('aws-s3-promisified')({
//       accessKeyId: set.accessKeyId,
//       secretAccessKey: set.secretAccessKey
//     });

//     let bucketName = set.id || 'fetchBucket'
//     var res = await aws.saveObjectToFile(bucketName, set.localFilename, set.downloadedFilePath);
//     if (!res) { set.error = true; } else { set.error = false; set.localFilename = set.downloadedFilePath + "/" + set.localFilename }
//     return set;
//   }
// }

// module.exports = function plugin() {

//   this.s3Fetch = function (data) {
//     var test = Promise.all(data.map(item => item = process(item)));
//     this.data(data);
//     return this;
//   }


//   this.awsFetch = function (data) {
//     let downloadedFilePath = '/tmp'
//     if (!Array.isArray(data)) { data = [data]; }

//     const start = async () => {
//       await asyncForEach(data, async (set) => {

//         if (!set.provider | !set.accessKeyId | !set.secretAccessKey | !set.region | !set.remoteFilename) {
//           set.error = true;
//         } else {

//           if (!set.localFilename) {
//             set.localFilename = set.remoteFilename;
//           }

//           if (!set.downloadedFilePath) {
//             set.downloadedFilePath = downloadedFilePath;
//           }

//           var aws = require('aws-s3-promisified')({
//             accessKeyId: set.accessKeyId,
//             secretAccessKey: set.secretAccessKey
//           });

//           let bucketName = set.id || 'fetchBucket'
//           var res = await aws.saveObjectToFile(bucketName, set.localFilename, set.downloadedFilePath);
//           if (!res) { set.error = true; } else { set.error = false; set.localFilename = set.downloadedFilePath + "/" + set.localFilename }
//         }
//       });
//       return data;
//     }
//     start().then(function () {
//       // Apply Data
//       this.data(data);
//       // Return Chain
//       return this;
//     }.bind(this));

//   }


// }
