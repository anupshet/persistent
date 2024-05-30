import { DisplayTextPipe } from '../shared/pipes/display-text.pipe';

export class BrSelectOptions<T> {
  placeholder = '';
  data: Array<T>;
  elementName: string;
  displayTextPipe: DisplayTextPipe<T>;
  emitValue ? = false;
  disabled ? = false;
}
