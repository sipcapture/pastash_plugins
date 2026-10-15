/*
 * S3 Functions for PaStash Commands
 * (C) 2019 QXIP BV
 */
const { S3Client, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const BluebirdPromise = require('bluebird');
const fs = require("fs");
const crypto = require("crypto");

let conf;
const defaultConf = {
  pluginFieldName: 'FileFetch',
  bucketName: 'fetchBucket'
};

function checksum(str, algorithm, encoding) {
  return crypto
    .createHash(algorithm || 'md5')
    .update(str, 'utf8')
    .digest(encoding || 'hex')
}

function s3Client(credentials) {
  return new S3Client({
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
    },
  });
}

function saveObjectToFile(s3, bucket, key, path) {
  return new BluebirdPromise(function (resolve, reject) {
    var params = { Bucket: bucket, Key: key };
    var writeStream = fs.createWriteStream(path);
    var res = {
      etag: null,
      length: null
    }

    s3.send(new GetObjectCommand(params)).then(function (response) {
      if (response.ETag) {
        res.etag = response.ETag;
      }
      if (response.ContentLength != null) {
        res.length = String(response.ContentLength);
      }
      response.Body.pipe(writeStream);
    }).catch(function (err) {
      reject(err);
    });

    writeStream.on('finish', function () {
      resolve(res);
    })
      .on('error', function (err) {
        reject('Writestream to ' + path + ' did not finish successfully: ' + err);
      });
  });
};

function deleteObject(s3, bucket, key) {
  return new BluebirdPromise(function (resolve, reject) {
    var params = { Bucket: bucket, Key: key };

    s3.send(new DeleteObjectCommand(params)).then(function (data) {
      resolve(data);
    }).catch(function (error) {
      reject(error);
    });
  });
};

module.exports = function plugin(userConf) {
  conf = { ...defaultConf, ...userConf };

  this.main.s3Fetch = function s3Fetch(next) {
    const data = this.data[conf.pluginFieldName];
    const bucketCreds = conf['buckets'][data[conf.bucketField]];
    const s3 = s3Client(bucketCreds);

    saveObjectToFile(s3, data[conf.bucketField], data[conf.nameField], data[conf.outputFileField] + data[conf.nameField]).then((res) => {

      const remoteMd5 = res.etag.replace(/"/g, '');

      fs.readFile(data[conf.outputFileField] + data[conf.nameField], (err, resFile) => {

        if (!remoteMd5) {
          this.data.error = conf.pluginFieldName + ' plugin error cannot get remote md5';
          self.emit('output', this.data);
          return;
        }

        this.data[self.fieldResultList].push({ md5: remoteMd5 });

        if (remoteMd5 !== checksum(resFile)) {
          this.data.error = conf.pluginFieldName + ' plugin error files checksum not match';
          self.emit('output', this.data);
          return;
        }

        next();
      })
    }).catch((err) => {
      this.data.error = conf.pluginFieldName + ' plugin error file fetch error; ' + err;
      self.emit('output', this.data);
    });
  }

  this.main.s3Delete = function s3Fetch(next) {
    const data = this.data[conf.pluginFieldName];
    const bucketCreds = conf['buckets'][data[conf.bucketField]];
    const s3 = s3Client(bucketCreds);

    deleteObject(s3, data[conf.bucketField], data[conf.nameField]).then((res) => {
      next();
    }).catch((err) => {
      this.data.error = conf.pluginFieldName + ' error deleting file; ' + err;
      self.emit('output', this.data);
    });
  }

}
