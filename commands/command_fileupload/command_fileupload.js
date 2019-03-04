/*
 * Upload and check file for PaStash Commands
 * (C) 2019 QXIP BV
 */

const Client = require("ssh2-sftp-client");

let conf;
const defaultConf = {
  pluginFieldName: 'FieTransfer',
  port: 21,
  usarname: 'anonymous',
};

module.exports = function plugin(userConf) {
  conf = { ...defaultConf, ...userConf };

  this.main.uploadFile = function uploadFile(next) {
    const data = this.data[conf.pluginFieldName];

    const sftp = new Client();
    sftp.connect({
      host: conf.host,
      port: conf.port,
      username: conf.usarname,
      password: conf.password
    }).then(() => {
      sftp.fastPut(
        data[conf.inputFileField] + data[conf.nameField],
        data[conf.outputFileField] + data[conf.nameField],
        [])
        .then(() => {
          sftp.list(data[conf.outputFileField]).then((res) => {
            const size = res.find(it => it.name === data[conf.nameField]).size;
            if (size !== data[conf.sizeField]) {
              console.log('file size not to match');
            } else {
              sftp.end();
              next();
            }
          }).catch((err) => {
            console.log(err, 'get path info error');
          });
        }).catch((err) => {
          console.log(err, 'file upload error');
        });
    }).catch((err) => {
      console.log(err, 'catch error');
    });
  }
}
