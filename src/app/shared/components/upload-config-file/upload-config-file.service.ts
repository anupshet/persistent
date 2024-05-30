import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

import { FileName } from './upload-config-file.model';

@Injectable({
  providedIn: 'root'
})
export class UploadConfigFileService {

  isValid = new Subject<boolean>();
  showErrorMessage = new Subject<boolean>();
  numberOfFiles: number;
  files = new Array<any>();
  fileNames = new Array<FileName>();

  constructor() { }
}
