/*
 * Upload and check file for PaStash Commands
 * (C) 2019 QXIP BV
 */

const PromiseFtp = require("promise-ftp");

let conf;
const defaultConf = {
  pluginFieldName: 'FieTransfer',
  port: 21,
  user: 'anonymous',
};

module.exports = function plugin(userConf) {
  conf = { ...defaultConf, ...userConf };

  this.main.uploadFile = async function uploadFile(next) {
    const data = this.data[conf.pluginFieldName];

    var ftp = new PromiseFtp();
    ftp.connect({
      host: conf.host,
      port: conf.port,
      user: conf.usarname,
      password: conf.password
    })
      .then(async () => {
        await ftp.mkdir(data[conf.outputFileField], true);

        await ftp.put(
          data[conf.inputFileField] + data[conf.nameField],
          data[conf.outputFileField] + data[conf.nameField]);

        ftp.list(data[conf.outputFileField]).then((list) => {
          const size = list.find(it => it.name === data[conf.nameField]).size;
          if (size !== data[conf.sizeField]) {
            console.log('file size not to match');
          } else {
            ftp.end();
            next();
          }
        });

      })
  }
}
