// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { UserManagementService } from '../../../../shared/services/user-management.service';

@Injectable()
export class AccountFormValidatorService {
  constructor(private userManagementService: UserManagementService) {}

  isFormValid(formGroup: FormGroup) {
    const formGroupKeys = Object.keys(formGroup.controls);
    for (const controlName of formGroupKeys) {
      const control = formGroup.get(controlName);
      if (control instanceof FormControl) {
        formGroup.get(controlName).updateValueAndValidity({ emitEvent: true });
      }
    }

    return formGroup.valid;
  }

  emailPrecheck(inputForm: FormGroup): Observable<string> {
    if (this.isFormValid(inputForm)) {
      const email = inputForm.controls.email.value;
      return this.userManagementService.queryUserByEmail(email);
    }

    return null;
  }
}
