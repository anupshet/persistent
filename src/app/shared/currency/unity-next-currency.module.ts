import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnityNextCurrencyPipe } from './pipes/unity-next-currency.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    UnityNextCurrencyPipe
  ],
  declarations: [
    UnityNextCurrencyPipe
  ]
})
export class UnityNextCurrencyModule { }
