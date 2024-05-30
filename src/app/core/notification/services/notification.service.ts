import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UnityNotification } from '../interfaces/unity-notification';
import { AudienceType } from '../interfaces/audience-type';
import { NotificationManagerService } from './notification-manager.service';

@Injectable()
export class NotificationService {
  public get $allStream(): Subject<UnityNotification> {
    return this.manager.$stream(AudienceType.All);
  }

  public get $labStream(): Subject<UnityNotification> {
    return this.manager.$stream(AudienceType.Lab);
  }

  public get $labTestStream(): Subject<UnityNotification> {
    return this.manager.$stream(AudienceType.LabTest);
  }

  public get $userStream(): Subject<UnityNotification> {
    return this.manager.$stream(AudienceType.User);
  }

  public subscribeLabTestToHub(labTestId: string) {
    this.manager.subscribeAndUnsubscribePrevious(AudienceType.LabTest, labTestId);
  }

  public subscribeLabTestToHubWithoutUnsubscribePrevious(labTestId: string ) {
    this.manager.subscribe(AudienceType.LabTest, labTestId);
  }

  public unSubscribeLabTestFromHub(labTestId: string) {
    this.manager.unSubscribe(AudienceType.LabTest, labTestId);
  }

  constructor(private manager: NotificationManagerService) { }
}
