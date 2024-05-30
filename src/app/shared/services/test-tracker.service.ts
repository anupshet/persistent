import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/index';

import { ApiService } from '../api/api.service';
import { unApi } from '../../core/config/constants/un-api-methods.const';
import { TestTracker } from '../models/test-tracker.model';

@Injectable()
export class TestTrackerService extends ApiService {
  public onLotChanged = new Subject<{ reagentLot: string, calibratorLot: string }>();

  save(testTracker: TestTracker): Promise<TestTracker> {
    const path = unApi.shared.testTracker.save;
    return this.post<TestTracker>(path, testTracker).toPromise();
  }

  delete(labTestId: number) {
    const path = unApi.shared.testTracker.delete
      .replace('{labTestId}', labTestId.toString());

    return this.del(path);
  }

}
