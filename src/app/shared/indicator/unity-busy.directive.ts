import { Directive, Input } from '@angular/core';

import { Subscription } from 'rxjs';
import { isBoolean } from 'util';
import { NgBusyDirective } from 'ng-busy';

import { unsubscribe } from '../../core/helpers/rxjs-helper';

@Directive({
  selector: '[unextBusy]'
})
export class UnityBusyDirective extends NgBusyDirective {

  @Input('unextBusy')
  set unextBusy(op) {
    this.setOption(op);
  }

  get unextBusy() {
    return this.options;
  }

  private setOption(op) {
    isBoolean(op) ? this.setOptionBasedOnBoolean(op) : this.options = op;
  }

  private setOptionBasedOnBoolean(op) {
    if (!this.options) {
      this.options = {};
    }

    if (op) {
      if (!this.options.busy) {
        this.options.busy = new Subscription();
      }
    } else if (this.options.busy) {
      unsubscribe(this.options.busy as Subscription);
      this.options.busy = undefined;
    }
  }
}
