/*
 * aes256 Upload and check file for PaStash Commands
 * (C) 2019 QXIP BV
 */

var PluginName = "Upload and check file";
var conf,
  defaultConf = {
  };

module.exports = function plugin(userConf) {
  conf = { ...defaultConf, ...userConf };

  this.main.uploadFile = function uploadFile(next) {
    next();
  }

}
