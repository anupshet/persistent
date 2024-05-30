import { inject, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { UserManagementService } from '../../../../shared/services/user-management.service';
import { AccountFormValidatorService } from './account-form-validator.service';

const UserManagementServiceStub = {
  queryUserByEmail: (email: string): Observable<string> => {
    return of('');
  }
};

describe('AccountFormValidatorService', () => {
  let sut: AccountFormValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        AccountFormValidatorService,
        { provide: UserManagementService, useValue: UserManagementServiceStub }
      ]
    });
  });

  beforeEach(inject(
    [AccountFormValidatorService],
    (service: AccountFormValidatorService) => {
      sut = service;
    }
  ));

  it('should be created', () => {
    const service: AccountFormValidatorService = TestBed.get(
      AccountFormValidatorService
    );
    expect(service).toBeTruthy();
  });

  describe('emailPrecheck', () => {
    let formGroup: FormGroup;
    beforeEach(() => {
      formGroup = new FormGroup({
        email: new FormControl(null, [Validators.required, Validators.email])
      });
    });

    it('should return null if form is not valid', () => {
      formGroup.controls.email.setValue(null);

      const actual = sut.emailPrecheck(formGroup);
      expect(actual).toBeNull();
    });

    it('should not return null if form is valid', () => {
      formGroup.controls.email.setValue('unit-test@test.test');

      const actual = sut.emailPrecheck(formGroup);
      expect(actual).not.toBeNull();
    });
  });
});
