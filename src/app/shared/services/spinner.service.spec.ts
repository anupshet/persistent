import { TestBed } from '@angular/core/testing';
import { toArray } from 'rxjs/operators';
import { Subject, of } from 'rxjs';

import { SpinnerService } from './spinner.service';
import { TranslateService } from '@ngx-translate/core';

describe('SpinnerService', () => {
  let service: SpinnerService;
  let destroy$: Subject<boolean>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SpinnerService,
        { provide: TranslateService, useValue: { get: tag => of(tag) } },
      ]
    });

    service = TestBed.get(SpinnerService);
    destroy$ = new Subject<boolean>();
  });

  afterEach(() => {
    destroy$.next(true);
    destroy$.unsubscribe();
    service = null;
  });

  it('creates service', () => {
    expect(service).not.toBeUndefined();
  });

  it('initiates and hides spinner', () => {
    const displaySpinnerCallArguments = [true, true, true, false, true, false, false, false];
    const spinnerStatusExpected = [true, true, true, true, true, true, true, false];
    service.spinnerStatus
      .pipe(toArray())
      .subscribe((spinnerStatus: boolean[]) => {
        expect(spinnerStatus).toEqual(spinnerStatusExpected);
      });

    displaySpinnerCallArguments.forEach(callArgument => {
      service.displaySpinner(callArgument);
    });
  });
});
