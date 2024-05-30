import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
    name: 'uNextCurrency'
  })
  export class UnityNextCurrencyPipe extends CurrencyPipe implements PipeTransform {
  // This is just mimicking the CurrencyPipe for now. If we need to customize anything,
  // we can easily make changes here.

  }
