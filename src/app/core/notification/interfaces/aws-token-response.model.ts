import { AwsToken } from './aws-token.model';

export class AwsTokenResponse {
  statusCode: string;
  headers: any;
  body: AwsToken;
}
