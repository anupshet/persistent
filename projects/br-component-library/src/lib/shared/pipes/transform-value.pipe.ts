import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'transformValue' })
export class TransformValuePipe implements PipeTransform {
  constructor(private decimalPipe: DecimalPipe) {}

  transform(value: number, digits?: number): string {
    let newValue: string;
    switch (digits) {
      case 0:
        newValue = this.decimalPipe.transform(value, '0.0-0');
        break;
      case 1:
        newValue = this.decimalPipe.transform(value, '0.1-1');
        break;
      case 2:
        newValue = this.decimalPipe.transform(value, '0.2-2');
        break;
      case 3:
        newValue = this.decimalPipe.transform(value, '0.3-3');
        break;
      case 4:
        newValue = this.decimalPipe.transform(value, '0.4-4');
        break;
      default:
        newValue = this.decimalPipe.transform(value, '0.2-2');
        break;
    }

    return newValue;
  }
}
