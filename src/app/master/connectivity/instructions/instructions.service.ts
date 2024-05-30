// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { ParsingJob } from '../../../contracts/models/connectivity/parsing-engine/instruction-id-name.model';

@Injectable()
export class InstructionsService {
  private isNextBtnDisabled = new BehaviorSubject<any>(true);
  private stepSubject = new BehaviorSubject<any>(0);
  private step = 0;
  parsingJob: ParsingJob;

  constructor() {}

  public getStep(): Observable<any> {
    this.stepSubject.next(this.step);
    return this.stepSubject.asObservable();
  }

  public enableNextBtn(): void {
    this.isNextBtnDisabled.next(false);
  }

  public disableNextBtn(): void {
    this.isNextBtnDisabled.next(true);
  }

  public getNextBtnState(): Observable<any> {
    return this.isNextBtnDisabled.asObservable();
  }

}
