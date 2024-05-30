import { Requester } from '../../models/new-config-requester.model';

export class NewConfiguration {
  requester: Requester;
  dataType = 1; // expected by EmailSender Api
}

export class RequestConfiguration {
  templateId: string;
  files: Array<FileInfo>;
  data: NewConfiguration;
}

export class FileInfo {
  fileName: string;
  entityId: string;
  contentType: string;
}

export class PresignedUrls {
  fileName: string;
  url: string;
  entityId: string;
}
