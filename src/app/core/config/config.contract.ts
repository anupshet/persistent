/* © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/
export const AppConfigKeys = {
  api: 'api',
  appLocale: 'appLocale',
  appLocalization: true,
  auth: 'auth',
  googleAnalyticsId: 'googleAnalyticsId',
  includeNgrxDevStore: 'includeNgrxDevStore',
  logo: 'logo',
  production: 'production',
  remoteBackend: 'remoteBackend',
  subscriptionKey: 'subscriptionKey'
};
export interface AppConfig {
  production: boolean;
  remoteBackend: boolean;
  appLocale: string;
  api?: ApiConfig;
  auth?: AuthConfig;
  sso?: SsoConfig;
  logo?: string;
  googleAnalyticsId?: string;
  subscriptionKey?: string;
  includeNgrxDevStore: Array<any>;
  labMigrationUrl?: string;
  featureFlag?: FeatureFlag
}
export interface ApiConfig {
  httpCallTimeout: number;
  httpCallRetry: number;
  portalUrl: string;
  codelistUrl: string;
  connectivityUrl: string;
  // localConnectivityUrl: string; // TODO: remove before merging into feature branch
  multiFileUploadUrl: string;
  connectivityMappingUrl: string;
  orchestratorUrl: string;
  fileUploadUrl: string;
  fileReceiveUrl: string;
  parsingEngineUrl: string;
  notificationUrl: string;
  notificationAuthUrl: string;
  notificationSubscriptionTracker: string;
  peerGroupReportingUrl: string;
  dynamicReportingUrl: string;
  sendEmailUrl: string;
  labDataUrl: string;
  dataReviewUrl: string;
  userManagementUrl: string;
  settingsUrl: string;
  loggingUrl: string;
  panelsUrl: string;
  labConfigurationUrl: string;
  lotViewerUrl: string;
  auditTrail?:string;
  dynamicReportingGraphqlUrl?: string;
}
export interface AuthConfig {
  clientId: string;
  scopes: string[];
  orgUrl: string;
  issuer: string;
  authorizeUrl: string;
  redirectUri: string;
  loginUrl: string;
  resetPassword: string;
  language: string;
  pkce: boolean;
}
// Maintain the SSO configuration separately to allow different configurations between the sign-in widget and SSO as necessary.
export interface SsoConfig {
  clientId: string;
  scopes: string[];
  issuer: string;
  redirectUri: string;
  pkce: boolean;
}

export interface FeatureFlag {
  apiKey: string;
  contextKey: string;
}
