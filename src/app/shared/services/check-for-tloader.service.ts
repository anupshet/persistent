//  © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class CheckForTloaderService {

  tloaderSubject = new Subject<boolean>();

  constructor() { }
}
