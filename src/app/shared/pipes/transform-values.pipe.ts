import { DecimalPipe } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'transformValue' })
export class TransformValuePipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private _locale: string, private decimalPipe: DecimalPipe) {}

  transform(value: number, digits?: string): string {
    let newValue: string;
   switch (+digits) {
     case 0:
       newValue =  this.decimalPipe.transform(value, '0.0-0', this._locale);
       break;
     case 1:
       newValue =  this.decimalPipe.transform(value, '0.1-1', this._locale);
       break;
     case 2:
       newValue =  this.decimalPipe.transform(value, '0.2-2', this._locale);
      break;
     case 3:
       newValue =  this.decimalPipe.transform(value, '0.3-3', this._locale);
       break;
      case 4:
       newValue =  this.decimalPipe.transform(value, '0.4-4', this._locale);
       break;
      default:
       newValue =  this.decimalPipe.transform(value, '0.2-2', this._locale);
       break;
     }
     return newValue;
    }

}

@Pipe({ name: 'transformZscore' })
export class TransformZscorePipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private _locale: string, private decimalPipe: DecimalPipe) {}
  transform(value: number, digits?: string): string {
   return this.decimalPipe.transform(value, '1.2-2', this._locale);
  }
}

@Pipe({ name: 'transformSummStats' })
export class TransformSummaryStatsPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private _locale: string, private decimalPipe: DecimalPipe) {}

  transform(value: number, digits?: string) {
     let newValue: string;
   switch (+digits) {
     case 0:
      newValue =  this.decimalPipe.transform(value, '0.0-0', this._locale);
      break;
     case 1:
      newValue =  this.decimalPipe.transform(value, '0.1-1', this._locale);
       break;
     case 2:
      newValue =  this.decimalPipe.transform(value, '0.2-2', this._locale);
      break;
     case 3:
       newValue = this.decimalPipe.transform(value, '0.3-3', this._locale);
       break;
      case 4:
       newValue = this.decimalPipe.transform(value, '0.4-4', this._locale);
       break;
      default:
       newValue = this.decimalPipe.transform(value, '0.2-2', this._locale);
       break;
    }
    return newValue;

  }
}
