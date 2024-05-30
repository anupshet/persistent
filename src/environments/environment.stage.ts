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
    codelistUrl: 'https://unity-stage-api.qcnet.com/main/codelist',
    // codelistUrl: 'http://localhost:58150',
    notificationUrl: 'https://unity-stage-api.qcnet.com/notification',
    notificationAuthUrl: 'https://unity-stage-api.qcnet.com/main/notification/authorizationtoken',
    notificationSubscriptionTracker: 'https://unity-stage-api.qcnet.com/main/notification',
    peerGroupReportingUrl: 'https://unity-stage-api.qcnet.com/main',
    // peerGroupReportingUrl: 'http://localhost:7071/PDFReporting',
    dynamicReportingUrl: 'https://unity-stage-api.qcnet.com/report',
    dynamicReportingGraphqlUrl: 'https://unity-stage-api.qcnet.com/report/gql/query',
    sendEmailUrl: 'https://unity-stage-api.qcnet.com/main/emailsender',
    labDataUrl: 'https://unity-stage-api.qcnet.com/main',
    // labDataUrl: 'http://localhost:7077/labData',
    dataReviewUrl: 'https://unity-stage-api.qcnet.com/data-review',
    // dataReviewUrl: 'http://localhost:3000',
    portalUrl: 'https://unity-stage-api.qcnet.com/main/labsetup',
    // portalUrl: 'http://localhost:30114/portal',
    connectivityUrl: 'https://unity-stage-api.qcnet.com/main/connectivity',
    multiFileUploadUrl: 'https://unity-stage-api.qcnet.com/connectivity',
    connectivityMappingUrl: 'https://api-unity-d.qcnet.com/datamap',
    orchestratorUrl: 'https://api-unity-d.qcnet.com/orchestration',
    fileReceiveUrl: 'https://api-unity-d.qcnet.com/filereceive',
    fileUploadUrl: 'https://api-unity-d.qcnet.com/filereceive',
    parsingEngineUrl: 'https://api-unity-d.qcnet.com/parsing-engine',
    userManagementUrl: 'https://unity-stage-api.qcnet.com/main/usermanagement',
    // userManagementUrl: 'http://localhost:3628/usermanagement'
    settingsUrl: 'https://unity-stage-api.qcnet.com/settings',
    loggingUrl: 'https://unity-stage-api.qcnet.com/tracking',
    panelsUrl: 'https://unity-stage-api.qcnet.com/main/labsetup/labsetup',
    labConfigurationUrl: 'https://unity-stage-api.qcnet.com/main/labsetup/labsetup',
    lotViewerUrl : 'https://unity-stage-api.qcnet.com/main/portal'
  },
  logo: 'assets/images/unity-logo.png',
  auth: {
    clientId: '0oa6qg1rl7grmWLZO2p7',
    scopes: ['openid', 'email'],
    orgUrl: 'https://biorad-ext.okta.com',
    issuer: 'https://biorad-ext.okta.com/oauth2/aus6qgcbkeWbNkAw92p7',
    authorizeUrl:
      'https://biorad-ext.okta.com/oauth2/aus6qgcbkeWbNkAw92p7/v1/authorize',
    redirectUri: 'http://localhost:4200',
    loginUrl: 'http://localhost:4200/login',
    resetPassword: 'https://unity-stage-auth.qcnet.com/forgotpassword',
    language: 'en',
    pkce: true
  },
  sso: {
    clientId: 'aus6qgcbkeWbNkAw92p7',
    scopes: ['openid', 'email'],
    issuer: 'https://biorad-ext.okta.com/oauth2/aus6qgcbkeWbNkAw92p7',
    redirectUri: 'http://localhost:4200/callback',
    pkce: true
  },
  featureFlag: {
    apiKey: '649c6b15c0c8b413362ebdc3',
    contextKey: 'api-23e3bf51-7198-42da-a7f3-fc3dd727a009'
  },
  includeNgrxDevStore: [
    StoreDevtoolsModule.instrument({ name: 'Unity ngrx DevTools', maxAge: 25 })
  ]
};
