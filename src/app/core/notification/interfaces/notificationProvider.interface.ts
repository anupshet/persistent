import { Subject } from 'rxjs';
import { AudienceType } from './audience-type';
import { UnityNotification } from './unity-notification';
export type onReceivedMessageCallBack = (notification: UnityNotification) => void;

export interface NotificationProvider {
  $isConnected: Subject<boolean>;
  $clientId: Subject<string>;

  connect(accountNumber: string, userId: string, onNotificationReceived: onReceivedMessageCallBack): Promise<void>;
  disconnect(): Promise<void>;
  reconnect(): Promise<void>;
  subscribeToTopic(audienceType: AudienceType, audienceName: string);
  unsubscribeToTopic(audienceType: AudienceType, audienceName: string);
}
