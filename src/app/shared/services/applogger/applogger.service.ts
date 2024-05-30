import { Injectable } from '@angular/core';

@Injectable()
export class AppLoggerService {
  private loggingEnabled = false;
  constructor() {
    const me = this;
    window['enableUnityLog'] = () => {
      me.loggingEnabled = !!window.console;   // Enable if console exists

      if (me.loggingEnabled) {
        me.log('Log is enabled.');
      }
    };

    window['disableUnityLog'] = () => {
      me.loggingEnabled = false;
      console.log('Log is disabled.');
    };
  }

  log(msg: any, ...optionalParams: any[]) {
    if (this.loggingEnabled) {
      const curDateTime = (new Date()).toJSON();
      if (optionalParams) {
        console.log(msg, optionalParams, curDateTime);
      } else {
        console.log(msg, curDateTime);
      }
    }
  }

  error(msg: any, ...optionalParams: any[]) {
    if (this.loggingEnabled) {
      const curDateTime = (new Date()).toJSON();
      if (optionalParams) {
        console.error(msg, optionalParams, curDateTime);
      } else {
        console.error(msg, curDateTime);
      }
    }
  }

  warning(msg: any, ...optionalParams: any[]) {
    if (this.loggingEnabled) {
      const curDateTime = (new Date()).toJSON();
      if (optionalParams) {
        console.warn(msg, optionalParams, curDateTime);
      } else {
        console.warn(msg, curDateTime);
      }
    }
  }
}
