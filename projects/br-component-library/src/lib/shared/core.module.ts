// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { NgModule } from '@angular/core';

import { TransformValuePipe, StringDisplayTextPipe, UnityNextDatePipe, UnityNextNumericPipe } from './pipes/index';
import { BrNumericValueDirective } from './directives/numeric-value.directive';
import { BrClickOutsideDirective } from './directives/click-outside.directive';
import { BrTabOutsideDirective } from './directives/tab-outside.directive';
import { BrTimeInputDirective } from './directives/time-input.directive';

@NgModule({
  declarations: [
    StringDisplayTextPipe,
    TransformValuePipe,
    UnityNextDatePipe,
    UnityNextNumericPipe,
    BrNumericValueDirective,
    BrClickOutsideDirective,
    BrTimeInputDirective,
    BrTabOutsideDirective,
  ],
  imports: [],
  exports: [
    StringDisplayTextPipe,
    TransformValuePipe,
    UnityNextDatePipe,
    UnityNextNumericPipe,
    BrNumericValueDirective,
    BrClickOutsideDirective,
    BrTimeInputDirective,
    BrTabOutsideDirective
  ]
})
export class BrCore { }
