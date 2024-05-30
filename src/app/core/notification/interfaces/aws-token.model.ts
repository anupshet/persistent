export class AwsToken {
  region = ``;
  accessKeyId = ``;
  secretAccessKey = '';
  sessionToken = '';
  expiration = '';
  endpoint = '';

  constructor(region?: string,
              accessKeyId?: string,
              secretAccessKey?: string,
              sessionToken?: string,
              expiration?: string,
              endpoint?: string) {

      if (region !== undefined) {
          this.region = region;
      }

      if (accessKeyId !== undefined) {
          this.accessKeyId = accessKeyId;
      }

      if (secretAccessKey !== undefined) {
          this.secretAccessKey = secretAccessKey;
      }

      if (sessionToken !== undefined) {
          this.sessionToken = sessionToken;
      }

      if (expiration !== undefined) {
          this.expiration = expiration;
      }

      if (endpoint !== undefined) {
          this.endpoint = endpoint;
      }
  }
}
