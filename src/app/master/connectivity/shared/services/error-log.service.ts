// � 2022 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable,EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorLogService {
  showDetailsId: EventEmitter<any> = new EventEmitter();
   constructor() { }
}
