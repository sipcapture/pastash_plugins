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

    encryptor.encryptFile(this.data[conf.inputFileField], this.data[conf.outputFileField], this.data[conf.keyField], options, function (err) {
      this.data[self.fieldResultList].push({ PluginName: PluginName });
      next();

    }.bind(this));
  }

  this.main.decryptFile = function decryptFile(next) {

    encryptor.decryptFile(this.data[conf.inputFileField], this.data[conf.outputFileField], this.data[conf.keyField], options, function (err) {

      this.data[self.fieldResultList].push({ PluginName: PluginName });
      next();

    }.bind(this));
  }

}
