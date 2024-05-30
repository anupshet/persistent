import { PipeTransform } from '@angular/core';

export interface DisplayTextPipe<T> extends PipeTransform {
  transform(Items: T);
}
