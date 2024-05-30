import { FormControl } from '@angular/forms';

export const BrValidators = {
  ErrorNames: {
    noEmptyString: 'noEmptyString',
    passwordsMatch: 'passwordsMatch'
  },
  noEmptyString: (formControl: FormControl): { [key: string]: boolean } => {
    return formControl.dirty && formControl.value && formControl.value.length > 0 && formControl.value.trim().length === 0
      ? { noEmptyString: true } : null;
  },

  passwordsMatch: (password1: FormControl, password2: FormControl) => {
    return (): { [key: string]: any } => {
      return password1.dirty && password2.dirty && password1.value !== password2.value
        ? { passwordsMatch: true } : null;
    };
  }
};


