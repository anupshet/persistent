/* © 2023 Bio-Rad Laboratories, Inc.All Rights Reserved.*/
import { AppConfig } from '../app/core/config/config.contract';

export const environment: AppConfig = {
  production: true,
  remoteBackend: true,
  appLocale: 'US-US',
  includeNgrxDevStore: [],
  featureFlag: {
    apiKey: '6418c20d9122d213fcf64516',
    contextKey: 'api-23e3bf51-7198-42da-a7f3-fc3dd727a009'
  }
};
