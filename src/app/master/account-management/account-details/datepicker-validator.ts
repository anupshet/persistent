// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ValidatorFn, AbstractControl, Validators, FormControl } from '@angular/forms';

export function datePickerValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let forbidden = true;
    if (control.value) {
      const controlDate = new Date(control.value);
      const day = controlDate.getDay();
      if (day !== 0 && day !== 6) {
        forbidden = false;
      }
    }
    return forbidden ? { 'weekendNotAllowed': true } : null;
  };
}
