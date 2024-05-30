// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
export const enum ErrorType {
  Script = 1,
  HTTP = 2
}

export const enum Severity {
  Error = 'Error',
  Warning = 'Warning',
  Info = 'Info',
  Debug = 'Debug'
}

export const enum ConnErrorType {
 ImportError = 'Import Error',
 FileUploadError = 'File Upload Error',
 TransformerError = 'Transformer Error'
}
