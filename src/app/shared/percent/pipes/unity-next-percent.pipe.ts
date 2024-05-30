import { Pipe, PipeTransform } from '@angular/core';
import { PercentPipe } from '@angular/common';

@Pipe({
    name: 'uNextPercent'
  })
  export class UnityNextPercentPipe extends PercentPipe implements PipeTransform {
  // This is just mimicking the PercentPipe for now. If we need to customize anything,
  // we can easily make changes here.
   transform(value: number, digits?: string): string {
      return super.transform(value, digits);
   }
  }


