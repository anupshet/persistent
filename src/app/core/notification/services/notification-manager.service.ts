import { Injectable } from '@angular/core';
import { AudienceNotificationStream } from '../helpers/audience-notification-stream';
import { AudienceType } from '../interfaces/audience-type';
import { UnityNotification } from '../interfaces/unity-notification';
import { MqttService } from './mqtt.service';

@Injectable()
export class NotificationManagerService {
  get $isConnected() { return this.notificationProviderService.$isConnected; }
  get $clientId() { return this.notificationProviderService.$clientId; }

  $stream(audienceType: AudienceType = AudienceType.All) { return this._stream.GetNotificationSubject(audienceType).subject; }

  private _stream: AudienceNotificationStream = new AudienceNotificationStream();

  constructor(private notificationProviderService: MqttService) {
    this._stream.AddOrUpdateAudience(AudienceType.All);
    this._stream.AddOrUpdateAudience(AudienceType.Lab);
    this._stream.AddOrUpdateAudience(AudienceType.User);
    this._stream.AddOrUpdateAudience(AudienceType.LabTest);
  }

  connect(accountNumber: string, userId: string): Promise<void> {
    return this.notificationProviderService.connect(accountNumber, userId, this.whenNotificationReceived);
  }

  disconnect(): Promise<void> {
    return this.notificationProviderService.disconnect();
  }

  subscribeAndUnsubscribePrevious(audienceType: AudienceType, audienceName: any) {
    this.unSubscribePervious(audienceType);
    this.subscribe(audienceType, audienceName);
  }

  subscribe(audienceType: AudienceType, audienceName: string) {
    this.notificationProviderService.subscribeToTopic(audienceType, audienceName);
    this._stream.AddOrUpdateAudience(audienceType, audienceName);
  }

  unSubscribe(audienceType: AudienceType, audienceName: string) {
    this.notificationProviderService.unsubscribeToTopic(audienceType, audienceName);
  }

  private unSubscribePervious(audienceType: AudienceType) {
    const previous = this._stream.GetNotificationSubject(audienceType);
    if (previous && previous.audienceName) {
      this.unSubscribe(previous.audienceType, previous.audienceName);
    }
  }

  private whenNotificationReceived = (notification: UnityNotification) => {
    this._stream.Next(notification);
  }
}
