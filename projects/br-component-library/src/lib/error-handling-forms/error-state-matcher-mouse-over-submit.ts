import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

import { BrMouseOver } from './br-mouse-over';

export class ErrorStateMatcherMouseOver implements ErrorStateMatcher {
  mouseOver: BrMouseOver;
  formError = '';

  constructor(mouseOver: BrMouseOver, formError?: string) {
    this.mouseOver = mouseOver;
    this.formError = formError;
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && (control.invalid || form.hasError(this.formError))
    && ( this.mouseOver.value || control.touched || isSubmitted || form.hasError(this.formError)));
  }
}
