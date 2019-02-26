/*
 * aes256 File Encryption for PaStash Commands
 * (C) 2019 QXIP BV
 */

var encryptor = require('file-encryptor');
var PluginName = "aes256 File Encryption";
var conf,
  defaultConf = {
    algorithm: 'aes256',
  };

module.exports = function plugin(userConf) {
  conf = { ...defaultConf, ...userConf };
  const options = {
    algorithm: conf.algorithm,
  };

  this.main.encryptFile = function encryptFile(next) {
    let result = {
      PluginName,
      FunctionName: arguments.callee.name,
      Index: this.data[self.fieldResultList].length,
      StartTime: (new Date).getTime(),
    };

    encryptor.encryptFile(this.data[conf.inputFileField], this.data[conf.outputFileField], this.data[conf.keyField], options, function (err) {
      result.Duration = (new Date).getTime() - result.StartTime;
      result.ErrorCode = err ? err.errno : 0;

      this.data[self.fieldResultList].push(result);
      next();

    }.bind(this));
  }

  this.main.decryptFile = function decryptFile(next) {
    let result = {
      PluginName,
      FunctionName: arguments.callee.name,
      Index: this.data[self.fieldResultList].length,
      StartTime: (new Date).getTime(),
    };

    encryptor.decryptFile(this.data[conf.inputFileField], this.data[conf.outputFileField], this.data[conf.keyField], options, function (err) {
      result.Duration = (new Date).getTime() - result.StartTime;
      result.ErrorCode = err ? err.errno : 0;

      this.data[self.fieldResultList].push(result);
      next();

    }.bind(this));
  }

}
