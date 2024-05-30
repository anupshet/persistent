/* © 2023 Bio-Rad Laboratories, Inc.All Rights Reserved.*/

import { AppConfig } from '../app/core/config/config.contract';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// Environment configs
export const environment: AppConfig = {
  production: false,
  remoteBackend: false,
  appLocale: 'US-US',
  googleAnalyticsId: 'UA-128357998-1',
  api: {
    httpCallTimeout: 30000,
    httpCallRetry: 0,
    codelistUrl: 'https://unity-demo-api.qcnet.com/main/codelist',
    // codelistUrl: 'http://localhost:58150',
    notificationUrl: 'https://unity-demo-api.qcnet.com/notification',
    notificationAuthUrl: 'https://unity-demo-api.qcnet.com/main/notification/authorizationtoken',
    notificationSubscriptionTracker: 'https://unity-demo-api.qcnet.com/main/notification',
    peerGroupReportingUrl: 'https://unity-demo-api.qcnet.com/main/pdfreporting',
    // peerGroupReportingUrl: 'http://localhost:7071/PDFReporting',
    dynamicReportingUrl: 'https://unity-demo-api.qcnet.com/report',
    dynamicReportingGraphqlUrl: " https://unity-demo-api.qcnet.com/report/gql/query",
    sendEmailUrl: 'https://unity-demo-api.qcnet.com/main/emailsender',
    labDataUrl: 'https://unity-demo-api.qcnet.com/main',
    // labDataUrl: 'http://localhost:3004',
    dataReviewUrl: 'https://unity-demo-api.qcnet.com/data-review',
    // dataReviewUrl: 'http://localhost:3000',
    portalUrl: 'https://unity-demo-api.qcnet.com/main/labsetup',
    //portalUrl: 'http://localhost:8080/portal',
    connectivityUrl: 'https://unity-demo-api.qcnet.com/main/connectivity',
    // connectivityUrl: 'http://localhost:7071/connectivity',
    multiFileUploadUrl: 'https://unity-demo-api.qcnet.com/connectivity',
    connectivityMappingUrl: 'https://api-unity-demo.qcnet.com/datamap',
    orchestratorUrl: 'https://api-unity-demo.qcnet.com/orchestration',
    fileReceiveUrl: 'https://api-unity-demo.qcnet.com/filereceive',
    fileUploadUrl: 'https://api-unity-demo.qcnet.com/filereceive',
    parsingEngineUrl: 'https://api-unity-demo.qcnet.com/parsing-engine',
    userManagementUrl: 'https://unity-demo-api.qcnet.com/main/usermanagement',
    // userManagementUrl: 'http://localhost:3628/usermanagement'
    // settingsUrl: 'https://tdg9rz2yx7.execute-api.us-west-2.amazonaws.com/Prod'
    settingsUrl: 'https://unity-demo-api.qcnet.com/settings',
    loggingUrl: 'https://unity-demo-api.qcnet.com/tracking',
    panelsUrl: 'https://unity-demo-api.qcnet.com/main/labsetup/labsetup',
    labConfigurationUrl: 'https://unity-demo-api.qcnet.com/main/labsetup/labsetup',
    // labConfigurationUrl: 'http://localhost:8080/portal/labsetup',
    lotViewerUrl : 'https://unity-demo-api.qcnet.com/main/portal'
  },
  logo: 'assets/images/unity-logo.png',
  auth: {
    clientId: '0oamvg0ia1L5rkOx82p7',
    scopes: ['openid', 'email'],
    orgUrl: 'https://biorad-ext.okta.com',
    issuer: 'https://biorad-ext.okta.com/oauth2/ausn6ztipgVpS7NgF2p7',
    authorizeUrl:
      'https://biorad-ext.okta.com/oauth2/ausn6ztipgVpS7NgF2p7/v1/authorize',
    redirectUri: 'http://localhost:4200',
    loginUrl: 'http://localhost:4200/login',
    resetPassword: 'https://unity-demo-auth.qcnet.com/forgotpassword',
    language: 'en',
    pkce: true
  },
  sso: {
    clientId: '0oamvg0ia1L5rkOx82p7',
    scopes: ['openid', 'email'],
    issuer: 'https://biorad-ext.okta.com/oauth2/ausn6ztipgVpS7NgF2p7',
    redirectUri: 'http://localhost:4200/callback',
    pkce: true
  },
  featureFlag: {
    apiKey: '649c71ac5ae84612f319af74',
    contextKey: 'api-23e3bf51-7198-42da-a7f3-fc3dd727a009'
  },
  includeNgrxDevStore: [
    StoreDevtoolsModule.instrument({ name: 'Unity ngrx DevTools', maxAge: 25 })
  ]
};
