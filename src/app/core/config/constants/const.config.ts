import { VERSION } from '@angular/core';
import { unApi } from './un-api-methods.const';
import { AppConfig } from '../config.contract';
import { localhostName } from './general.const';

export const EXTERNAL_CONFIG = {
  isLoaded: false,
  appConfig: {} as AppConfig
};

export const CONST_CONFIG = {
  apiMethods: {
    unApi
  },

  angularVersion: VERSION
};

// Global constant used for features that are restricted to the development environments only.
// Keeping it for future refernce
// export const IS_DEV_MODE = location.href.toLocaleLowerCase().indexOf(`//${localhostName}`) > 0
//   || location.href.toLocaleLowerCase().indexOf('//unity-dev') > 0;
