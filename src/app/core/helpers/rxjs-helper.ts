import { Subscription } from 'rxjs/index';

export function unsubscribe(subscription: Subscription) {
    if (subscription && subscription.unsubscribe) {
        subscription.unsubscribe();
    }
  }
