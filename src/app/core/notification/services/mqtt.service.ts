// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { sleep } from 'br-component-library';
import { Paho } from 'ng2-mqtt/mqttws31';
import { combineLatest, Observable, Subject } from 'rxjs';

import { AuthenticationService } from '../../../security/services';
import { AppLoggerService } from '../../../shared/services/applogger/applogger.service';
import { ApiConfig, AppConfigKeys } from '../../config/config.contract';
import { ConfigService } from '../../config/config.service';
import { AudienceType } from '../interfaces/audience-type';
import { AwsToken } from '../interfaces/aws-token.model';
import { NotificationProvider, onReceivedMessageCallBack } from '../interfaces/notificationProvider.interface';
import { SubscriptionTopic } from '../interfaces/subscription-topic.model';
import { UnityNotification } from '../interfaces/unity-notification';
import { take, map, flatMap } from 'rxjs/operators';
import { mqttStatusCodes } from '../interfaces/mqtt-status-code.const';
import { unApi } from '../../config/constants/un-api-methods.const';
import { AwsTokenResponse } from '../interfaces/aws-token-response.model';

// Required for AWS
declare function getSignedURL(host: any, region: any, credentials: any): string;
// WKL Todo: Code needs to be refactored for when MQTT is ready to be used for notifications

@Injectable({
  providedIn: 'root'
})
export class MqttService implements NotificationProvider {
  private mqttClient: Paho.MQTT.Client;
  private connectionAttempts = 0;
  private maxConnectionRetries = 3;
  private _isConnected = false;
  private reConnectionTimeoutInMilliSeconds = (60 * 1000);
  private reSubscriptionTimeoutInMilliSeconds = (60 * 1000);
  private _onNotificationReceived: onReceivedMessageCallBack;
  $isConnected: Subject<boolean> = new Subject<boolean>();
  $clientId: Subject<string> = new Subject<string>();
  private _clientId = '';
  private accountNumber = '';
  private userId = '';
  private serviceName = 'Notification Service';
  private accountTopic = 'biorad-unity-next/{accountNumber}/#';
  private announcementsTopic = 'biorad-unity-next/announcements';

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
    private authentication: AuthenticationService,
    private configService: ConfigService,
    private http: HttpClient,
    private appLoggerService: AppLoggerService,
  ) {
    this.connectionAttempts = 0;
  }

  async connect(accountNumber: string, userId: string, onNotificationReceived: onReceivedMessageCallBack) {
    this._onNotificationReceived = onNotificationReceived;
    this.accountNumber = accountNumber;
    this.userId = userId;
    this.accountTopic = 'biorad-unity-next/{accountNumber}/#'; // resetting everytime as we are launch new location from CTS user
    this.accountTopic = this.accountTopic.replace('{accountNumber}', accountNumber);
    this.connectService();
  }

  async reconnect(): Promise<void> {
    this.appLoggerService.log(this.serviceName + ' attempting to reconnect');
    this.connectService();
  }

  async disconnect() {
    if (this.mqttClient && this.mqttClient.isConnected) {
      this.unsubscribeFromTopics();
      this.mqttClient.disconnect();
      // 20200917 TFS 179557: Reset this.accountTopic so that replacement logic in async connect will work
      this.accountTopic = 'biorad-unity-next/{accountNumber}/#';
    }
    this.appLoggerService.log(this.serviceName + ' - Connection closed.');
  }

  private getHostString(token: AwsToken) {
    return getSignedURL(
      token.endpoint,
      token.region,
      {
        accessKeyId: token.accessKeyId,
        secretAccessKey: token.secretAccessKey,
        sessionToken: token.sessionToken
      }
    );
  }

  private subscribeToTopics() {
    this.processTopicSubscription(this.accountTopic, 0);
    this.processTopicSubscription(this.announcementsTopic, 0);
  }

  private unsubscribeFromTopics() {
    this.processTopicUnsubscription(this.accountTopic);
    this.processTopicUnsubscription(this.announcementsTopic);
  }

  private processTopicUnsubscription(topicName: string) {
    this.deregisterSubscription(topicName).pipe(take(1)).subscribe();
    this.unsubscribeToTopicByName(topicName);
  }

  private processTopicSubscription(topicName: string, conectionAttempt: number) {
    this.registerSubscription(topicName).pipe(take(1)).subscribe(() => {
      this.subscribeToTopicByName(topicName);
    },
      (error) => {
        if (error.error = 'Topic was already subscribed!') {
          this.subscribeToTopicByName(topicName);
        } else {
          if (conectionAttempt < this.maxConnectionRetries) {
            conectionAttempt = conectionAttempt + 1;
            this.processTopicSubscription(topicName, conectionAttempt);
          } else {
            sleep(this.reSubscriptionTimeoutInMilliSeconds).then(() => {
              this.processTopicSubscription(topicName, 0);
            });
          }
        }
      });
  }

  private subscribeToTopicByName(topicName: string) {
    if (this.isConnected && this.mqttClient && this.mqttClient.isConnected) {
      this.appLoggerService.log('subscribing to topic: ', topicName);
      this.mqttClient.subscribe(topicName, {});
    }
  }

  private unsubscribeToTopicByName(topicName: string) {
    if (this.isConnected && this.mqttClient && this.mqttClient.isConnected) {
      this.appLoggerService.log('unsubscribing to topic: ', topicName);
      this.mqttClient.unsubscribe(topicName, {});
    }
  }

  private registerSubscription(topicName): Observable<any> {
    if (this.isConnected && this.mqttClient && this.mqttClient.isConnected) {
      return combineLatest([this.authentication.getAccessToken()]).pipe(flatMap(([webToken]) => {
        const subscriptionTopic = this.getSubscriptionTopic(topicName);
        const url = (<ApiConfig>this.configService.getConfig(AppConfigKeys.api)).notificationSubscriptionTracker +
          '' + unApi.notification.subscribe;
        const headers = {
          'Content-Type': 'application/json',
          token: webToken
        };
        return this.http.post(url, subscriptionTopic, { headers: headers });
      }));
    }
  }

  private deregisterSubscription(topicName): Observable<any> {
    if (this.isConnected && this.mqttClient && this.mqttClient.isConnected) {
      return combineLatest([this.authentication.getAccessToken()]).pipe(flatMap(([webToken]) => {
        const subscriptionTopic = this.getSubscriptionTopic(topicName);
        const url = (<ApiConfig>this.configService.getConfig(AppConfigKeys.api)).notificationSubscriptionTracker +
          '' + unApi.notification.unsubscribe;
        const headers = {
          'Content-Type': 'application/json',
          token: webToken
        };
        return this.http.put(url, subscriptionTopic, { headers: headers });
      }));
    }
  }

  getSubscriptionTopic(topicName: string): SubscriptionTopic {
    return { oktaUserId: this.userId, topicUrl: topicName };
  }

  subscribeToTopic(audienceType: AudienceType, audienceName: string) {
    // Only Subscribing to 2 topics no need to subscribe to topics based on audienceType and audienceName for MQTT
  }

  unsubscribeToTopic(audienceType: AudienceType, audienceName: string) {
    // Only Subscribing to 2 topics no need to subscribe to topics based on audienceType and audienceName for MQTT
  }

  connectService(): void {
    this.authentication.getAccessToken().then((userAccessToken: string) => {
      const sessionId = this.userId;
      this.getTokenDetails(userAccessToken, sessionId)
        .pipe(take(1), map(awsTokenResonse => awsTokenResonse.body))
        .subscribe((webToken: AwsToken) => {
          const host = this.getHostString(webToken);
          this.connectClient(host, this.accountNumber, this.userId);
        }, (error) => {
          this.handleConnectionFailure(error);
        });
    });
  }

  private connectClient(host: string, accountNumber: string, userId: string) {
    // Create unique client id
    const now = new Date();
    const secondsSinceEpoch = Math.round(now.getTime() / 1000);
    this.clientId = accountNumber + '-' + userId + '-' + secondsSinceEpoch;
    this.appLoggerService.log('Client Id: ', this.clientId);
    this.mqttClient = new Paho.MQTT.Client(host, this.clientId);

    this.mqttClient.onConnectionLost = (responseObject: Object) => {
      this.handleConnectionLoss(responseObject);
    };

    this.mqttClient.onMessageArrived = (message: Paho.MQTT.Message) => {
      this.handleMessageReceived(message);
    };

    this.mqttClient.connect({
      onSuccess: () => {
        this.isConnected = true;
        this.appLoggerService.log(this.serviceName + ' - Connected.');
        this.subscribeToTopics();
      },
      useSSL: true,
      timeout: 15,
      mqttVersion: 4,
      onFailure: (error) => {
        this.handleConnectionFailure(error);
      }
    });
  }

  private handleMessageReceived(message: Paho.MQTT.Message) {
    try {
      this.appLoggerService.log('message received: ', message);
      const unityMessage: UnityNotification = JSON.parse(message.payloadString);
      this._onNotificationReceived(unityMessage);
    } catch (error) {
      this.appLoggerService.error(this.serviceName + ' - Unable to Process Message: ', message, error);
    }
  }

  private handleConnectionFailure(error: any) {
    this.appLoggerService.error(this.serviceName + ' - Failed to connect to notification service', error);
    this.appLoggerService.error(this.serviceName + ' - Number of Connection Attempts so far: ', this.connectionAttempts);

    // Retry 3 times
    if (this.connectionAttempts < this.maxConnectionRetries) {
      this.connectionAttempts = this.connectionAttempts + 1;
      this.connectService();
    } else {
      this.isConnected = false;
      sleep(this.reConnectionTimeoutInMilliSeconds).then(() => {
        this.connectionAttempts = 0;
        this.connectService();
      });
    }
  }

  private handleConnectionLoss(responseObject: Object) {
    if (responseObject['errorCode'] === mqttStatusCodes.ok.errorCode) {
      this.isConnected = false;
      this.appLoggerService.log(this.serviceName + ' - Disconnected', responseObject);
      return;
    }
    this.isConnected = false;
    this.appLoggerService.error(this.serviceName + ' - Connection Loss', responseObject);
    this.connectionAttempts = 0;
    this.reconnect();
  }

  private getTokenDetails(webToken: string, sessionIdentifier: string): Observable<AwsTokenResponse> {
    const url = (<ApiConfig>this.configService.getConfig(AppConfigKeys.api)).notificationAuthUrl;
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      token: webToken,
      sessionId: sessionIdentifier,
    };
    return this.http.post<AwsTokenResponse>(url, {}, { headers: headers });
  }
}
