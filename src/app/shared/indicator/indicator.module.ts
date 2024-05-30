import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgBusyModule } from 'ng-busy';

import { UnityBusyDirective } from './unity-busy.directive';

@NgModule({
  imports: [
    CommonModule,
    NgBusyModule
  ],
  exports: [
    UnityBusyDirective
  ],
  declarations: [UnityBusyDirective],
})
export class IndicatorModule { }
