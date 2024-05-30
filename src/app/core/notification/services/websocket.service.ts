// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable, OnDestroy } from '@angular/core';
import { sleep } from 'br-component-library';
import { interval, Subject } from 'rxjs';
import { takeUntil, timeInterval } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { AuthenticationService } from '../../../security/services';
import { AppLoggerService } from '../../../shared/services/applogger/applogger.service';
import { ApiConfig, AppConfigKeys } from '../../config/config.contract';
import { ConfigService } from '../../config/config.service';
import { AudienceType } from '../interfaces/audience-type';
import { NotificationProvider, onReceivedMessageCallBack } from '../interfaces/notificationProvider.interface';
import { UnityNotification } from '../interfaces/unity-notification';
import { WebsocketMessage } from '../interfaces/websocket-message.interface';
import { TopicTrackerService } from './topic-tracker.service';
import { MessageQueueService } from './message-queue.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements NotificationProvider, OnDestroy {

  private topicActions = {
    heartbeat: 'heartbeat',
    subscribe: 'subscribe',
    unsubscribe: 'unsubscribe'
  };

  private messagesToIgnore = {
    subcriptionConfirmation: 'Subscription Completed',
    unsuibscriptionConfirmation: 'Unsubscribe Completed',
    hearthbeartResponse: '1'
  };

  private serviceName = 'Notification Service';

  private connectionAttempts = 0;
  private maxConnectionRetries = 5;
  private maxTopicSubscriptionRetries = 3;
  private successfullDisconnectCode = 1005;
  private reConnectionTimeoutInMilliSeconds = (2 * 60 * 1000);
  private heartbeatInterval = interval(9 * 60 * 1000);
  private _isConnected = false;
  private _onNotificationReceived: onReceivedMessageCallBack;

  $isConnected: Subject<boolean> = new Subject<boolean>();
  $clientId: Subject<string> = new Subject<string>();

  protected cleanUp$ = new Subject<boolean>();
  private _clientId = '';
  private accountNumber = '';
  private userId = '';
  private socketChannel: WebSocketSubject<unknown>;

  private get isConnected() { return this._isConnected; }
  private set isConnected(connected) {
    this._isConnected = connected;
    this.$isConnected.next(connected);
  }

  private get clientId() { return this._clientId; }
  private set clientId(id) {
    this._clientId = id;
    this.$clientId.next(id);
  }

  constructor(
    private appLoggerService: AppLoggerService,
    private configService: ConfigService,
    private authentication: AuthenticationService,
    private topicTrackerService: TopicTrackerService,
    private messageQueueService: MessageQueueService
  ) { }



  async connect(accountNumber: string, userId: string, onNotificationReceived: onReceivedMessageCallBack): Promise<void> {
    this.appLoggerService.log(this.serviceName + ' - Connecting');
    this.accountNumber = accountNumber;
    this.userId = userId;
    this.clientId = userId + + Date.now().valueOf();
    this._onNotificationReceived = onNotificationReceived;
    this.connectService();
  }

  async disconnect(): Promise<void> {
    if (this.socketChannel) {
      this.unscribeFromTopics();
      this.socketChannel.complete();
      this.isConnected = false;
      this.cleanUp$.next(true);
    }
  }

  async reconnect(): Promise<void> {
    this.appLoggerService.log(this.serviceName + ' - Attempting reconnect');
    this.connectService();
  }

  private unscribeFromTopics() {
    this.topicTrackerService.trackedTopics.forEach(topic => {
      this.sendMessage(topic, this.topicActions.unsubscribe);
    });
    this.topicTrackerService.clearTopics();
  }

  private sendMessage(topicName: string, action: string) {
    const message: WebsocketMessage = {
      service: 'UnityNotification',
      action: action,
      topic: topicName,
      payload: null,
      message: ''
    };
    this.appLoggerService.log('Sending Message: ', message);
    this.socketChannel.next(message);
  }

  public subscribeToTopic(audienceType: AudienceType, audienceName: string) {
    const topicName = this.convertToTopicName(audienceType, audienceName);
    this.appLoggerService.log(this.serviceName + ' - Subscribe to topic: ', topicName);
    this.sendMessage(topicName, this.topicActions.subscribe);
    this.checkSubscriptionSucceeded(topicName, 1);
  }

  public unsubscribeToTopic(audienceType: AudienceType, audienceName: string) {
    const topicName = this.convertToTopicName(audienceType, audienceName);
    this.appLoggerService.log(this.serviceName + ' - Unsubscribe to topic: ', topicName);
    this.sendMessage(topicName, this.topicActions.unsubscribe);
    this.topicTrackerService.removeTopic(topicName);
  }

  private connectService() {
    this.authentication.getAccessToken().then((token: string) => {
      if (token) {
        const url = (<ApiConfig>this.configService.getConfig(AppConfigKeys.api)).notificationUrl;
        this.connectToNotificationChannel(url, token.toString());
      }
    });
  }

  private async resubscribe(topicName: string, count: number) {
    this.sendMessage(topicName, this.topicActions.unsubscribe);
    await sleep(500);
    this.sendMessage(topicName, this.topicActions.subscribe);
    this.checkSubscriptionSucceeded(topicName, count);
  }

  private async checkSubscriptionSucceeded(topicName: string, count: number): Promise<void> {
    if (count > this.maxTopicSubscriptionRetries) {
      this.appLoggerService.error(this.serviceName + ' - Failed to subscribe to Topic: ', topicName);
      return;
    }
    await sleep(5000);
    if (this.topicTrackerService.isTopicTracked(topicName)) {
      this.appLoggerService.log(this.serviceName + ' - Topic was successfully subscribed: ', topicName);
    } else {
      this.appLoggerService.warning(this.serviceName + ' - Topic was not subscribed - Retrying: ' + count, topicName);
      await this.resubscribe(topicName, count);

    }
  }

  private connectToNotificationChannel(url: string, accessToken: string) {
    this.socketChannel = webSocket({
      url: url + '?Auth=' + accessToken,
      openObserver: {
        next: () => {
          this.appLoggerService.log(this.serviceName + ' - Connected.');
          this.resubscribeTopics();
          this.registerHeartbeat();
          this.isConnected = true;
        }
      },
      closeObserver: {
        next: (closeEvent) => {
          this.appLoggerService.log(this.serviceName + ' - Close Event.');
          this.onDisconnect(closeEvent);
        }
      }
    });
    this.socketChannel
      .pipe(takeUntil(this.cleanUp$))
      .subscribe(
        (message: WebsocketMessage) => this.onMessage(message)
      );
  }

  private resubscribeTopics(): void {
    this.appLoggerService.log('resubscribeTopics: ', this.topicTrackerService.trackedTopics.length);
    if (this.topicTrackerService && this.topicTrackerService.trackedTopics.length > 0) {
      this.topicTrackerService.trackedTopics.forEach(topicName => {
        this.sendMessage(topicName, this.topicActions.subscribe);
      });
    }
  }

  private registerHeartbeat(): void {
    this.heartbeatInterval
      .pipe(timeInterval(), takeUntil(this.cleanUp$))
      .subscribe(
        () => this.sendHeartbeat()
      );
  }

  private sendHeartbeat(): void {
    this.sendMessage('', this.topicActions.heartbeat);
  }

  private convertToTopicName(audienceType: AudienceType, audienceName: string): string {
    switch (audienceType) {
      case AudienceType.Lab:
        return 'g_' + AudienceType[audienceType] + '_' + audienceName;

      case AudienceType.LabTest:
        return AudienceType[audienceType] + '/' + audienceName;

      default:
        return 'g_' + AudienceType[audienceType] + '_' + audienceName;
    }
  }

  private async processSuccessfulSubscription(topicName: string) {
    this.topicTrackerService.addTopic(topicName);
    const messages = this.messageQueueService.getMessages(topicName);
    this.messageQueueService.dequeueMessage(topicName);
    // potential to refactor to reprocess distinct correlation id messages
    messages.forEach(message => {
      this.onMessage(message);
    });

  }

  private onMessage(message: WebsocketMessage) {
    this.appLoggerService.log(this.serviceName + ' - Message Received', message);
    try {
      if (
        message && message.message && (
          message.message === this.messagesToIgnore.unsuibscriptionConfirmation ||
          message.message === this.messagesToIgnore.hearthbeartResponse)
      ) {
        return;
      }
      if (message && message.message && message.message === this.messagesToIgnore.subcriptionConfirmation) {
        this.processSuccessfulSubscription(message.topic);
        return;
      }
      const unityMessage: UnityNotification = message.payload;
      if (message.topic && this.topicTrackerService.isTopicTracked(message.topic)) {
        this._onNotificationReceived(unityMessage);
      } else {
        this.messageQueueService.enqueueMessage(message);
      }
    } catch (error) {
      this.appLoggerService.error(this.serviceName + ' - Unable to Process Message: ', message);
    }
  }

  public onDisconnect(closeEvent: any) {
    this.appLoggerService.error(this.serviceName + ' - Disconnected');
    this.isConnected = false;
    if (closeEvent && closeEvent.code && closeEvent.code === this.successfullDisconnectCode && closeEvent.wasClean) {

    } else {
      if (this.connectionAttempts < this.maxConnectionRetries) {
        this.connectionAttempts++;
        this.reconnect();
      } else {
        sleep(this.reConnectionTimeoutInMilliSeconds).then(() => {
          this.connectionAttempts = 0;
          this.reconnect();
        });
      }
    }
  }

  ngOnDestroy() {
    if (this.socketChannel) {
      if (!this.socketChannel.closed) {
        this.socketChannel.complete();
      }
    }
    this.cleanUp$.next(true);
    this.cleanUp$.unsubscribe();
  }
}
