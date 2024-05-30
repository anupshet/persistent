import { Injectable } from '@angular/core';

import { ConnectivityFileError } from '../models/connectivity-file-error.model';
import { minFileSize, maxFileSize, maxNumberOfFiles } from '../../../../core/config/constants/general.const';

@Injectable()
export class FileVerificationService {

  readonly allowed_extensions = [
    '.txt',
    '.csv',
    '.log',
    '.dat',
    '.sav',
    '.zip'
    // SR 04272020: Temporarily excluding file formats from File upload option until connectivity backend supports these file extensions.
    // '.xls',
    // '.xlsx',
    // '.rtf',
  ];

  readonly errMap: Array<ConnectivityFileError> = [
    {
      code: '1',
      messages: 'NO_FILE',
      isFileOptionsError: false
    },
    {
      code: '2',
      messages:
        'Maximum 10 files reached',
      isFileOptionsError: false
    },
    {
      code: '3',
      messages: 'File extension not approved',
      isFileOptionsError: false
    },
    {
      code: '4',
      messages: 'ONLY_ONE_DATE_FIELD',
      isFileOptionsError: true
    },
    {
      code: '5',
      messages: 'A instruction must be selected.',
      isFileOptionsError: true
    },
    {
      code: '6',
      messages:
        'Your file is too large. Please re-submit in smaller increments.',
      isFileOptionsError: false
    },
    {
      code: '7',
      messages: 'START_DATE_GREATER_THAN_END_DATE',
      isFileOptionsError: true
    },
    {
      code: '8',
      messages:
        'The To date field can\'t be more than 24 hours past the current date/time.',
      isFileOptionsError: true
    },
    {
      code: '9',
      messages: 'NO_FORM_DATA',
      isFileOptionsError: false
    },
    {
      code: '10',
      messages: 'Large file size detected. Are you sure you want to continue?',
      isFileOptionsError: false
    },
    {
      code: '11',
      messages: 'A .zip file is missing.',
      isFileOptionsError: false
    },
    {
      code: '12',
      messages: 'A .txt file is missing.',
      isFileOptionsError: false
    }
  ];

  handlesSlideGen: boolean;
  numberOfTxtFiles = 0;
  numberOfZipFiles = 0;

  constructor() { }

  verifyFile(files): ConnectivityFileError {
    let errorObj = null;
    if (files.length <= maxNumberOfFiles) {
      for (const file of files) {
        // Check file extension
        const ext: string = file.name.substr(file.name.lastIndexOf('.') + 1);
        // Bug 232391: SR579: Customer is unable to upload summary data with Meditech QC Summary Report Transformer
        // const isAllowed = this.allowed_extensions.find(item => {
        //   return item.toUpperCase() === '.' + ext.toUpperCase(); // case insensitive check
        // });

        // if (!isAllowed) {
        //   errorObj = this.getErrorObj('3');
        // }

        // Check file size
        const sizeMB = Math.floor(file.size / 1000000); // In megaBytes
        if (sizeMB >= minFileSize && sizeMB < maxFileSize) {
          errorObj = this.getErrorObj('10');
        } else if (sizeMB >= maxFileSize) {
          errorObj = this.getErrorObj('6');
        }

        // Check if parsing instruction has Vitros transformer
        if (this.handlesSlideGen) {
          // track count of files based on file extension type
          if (ext == 'txt') {
            this.numberOfTxtFiles = ++this.numberOfTxtFiles;
          }
          if (ext == 'zip') {
            this.numberOfZipFiles = ++this.numberOfZipFiles;
          }
        }
      }
      if (this.handlesSlideGen) {
        // Check for equal number of zip and txt files
        if (this.numberOfTxtFiles > this.numberOfZipFiles) {
          errorObj = this.getErrorObj('11');
        } else if (this.numberOfZipFiles > this.numberOfTxtFiles) {
            errorObj = this.getErrorObj('12');
        }
      }
    } else if (files.length > maxNumberOfFiles) {
      errorObj = this.getErrorObj('2');
    }

    // reset count of files uploaded
    this.numberOfZipFiles = 0;
    this.numberOfTxtFiles = 0;
    return errorObj;
  }

  getErrorObj(errorCode: string): ConnectivityFileError {
    return this.errMap.find(item => item.code === errorCode);
  }

  getEmptyErrorObj(): ConnectivityFileError {
    return {
      code: '',
      messages: '',
      isFileOptionsError: undefined
    };
  }
}
