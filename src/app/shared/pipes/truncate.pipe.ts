import { Pipe } from '@angular/core';

// tslint:disable-next-line: use-pipe-transform-interface
@Pipe({ name: 'truncate' })
export class TruncatePipe {
  constructor() {}

  transform(value: string, args: string[]): string {
    // added check for value and args are not undefined
    if (value && args) {
      const limit = args.length > 0 ? parseInt(args[0], 10) : 20;
      const trail = args.length > 1 ? args[1] : '...';
      return value.length > limit ? value.substring(0, limit) + trail : value;
    }
    return value;
   }
}

