import { DisplayTextPipe } from './display-text.pipe';
import { Pipe, PipeTransform } from '@angular/core';

// tslint:disable-next-line:use-pipe-transform-interface
@Pipe({
  name: 'stringDisplayTextPipe'
})
export class StringDisplayTextPipe implements DisplayTextPipe<string>, PipeTransform {
  transform(item: string) {
    if (!item) {
      return '';
    }
    return item;
  }
}
