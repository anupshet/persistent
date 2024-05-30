export class log4jsconfig {
  static log(): any {
    const log4js = require('log4js');
    log4js.configure('./LOG4JSCONFIG/log4js.json');
    const log = log4js.getLogger('file');
    return log;
  }
}
