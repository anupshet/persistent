// WKL: Code is being left to assist with rewrite of signal-r using the notification provider service if it should be needed again

// import { Injectable } from '@angular/core';
// import * as signalR from '@aspnet/signalr';
// import { Subject } from 'rxjs/Subject';
// import { UnityNotification } from '../interfaces/unity-notification';
// import { ConfigService } from '../../config/config.service';
// import { ApiConfig } from '../../config/config.contract';
// import { AuthenticationService } from '../../../security/services';
// const MaxReconnectAttempt = 5;
// const ReconnectInterval = 3000;

// type onReceivedMessageCallBack = (notification: UnityNotification) => void;

// @Injectable()
// export class SignalRService {
//   private reconnectAttempt = 0;

//   private _onNotificationReceived: onReceivedMessageCallBack;

//   $isConnected: Subject<boolean> = new Subject<boolean>();
//   private connection: signalR.HubConnection;
//   private _isConnected = false;
//   private get isConnected() { return this._isConnected; }
//   private set isConnected(connected) {
//     this._isConnected = connected;
//     if (this._isConnected) {
//       this.$isConnected.next(connected);
//     }
//   }
//   constructor(private config: ConfigService, private authentication: AuthenticationService) { }

//   connect(hubName: string, onNotificationReceived: onReceivedMessageCallBack): Promise<void> {
//     this._onNotificationReceived = onNotificationReceived;
//     this.createConnection(hubName);
//     this.whenNotificationReceived();
//     this.whenConnectionClosed();
//     return this.startConnecting();
//   }

//   disconnect(): Promise<void> {
//     if (this.isConnected) {
//       return this.stopConnecting();
//     }
//   }

//   invoke(methodName, ...args) {
//     if (this.connection && this.isConnected) {
//       this.connection.invoke(methodName, ...args);
//     } else {
//       console.warn(`Method ${methodName} was not invoked because connection is closed.`);
//     }
//   }

//   private startConnecting(): Promise<void> {
//     return this.connection
//       .start()
//       .then(() => {
//         this.isConnected = true;
//         this.reconnectAttempt = 0;
//         this.log('Notification Service Connected.');
//       })
//       .catch(err => {
//         this.isConnected = false;
//         this.log('Notification Service Connection failed.');
//         this.reconnect();
//       });
//   }

//   private stopConnecting(): Promise<void> {
//     return this.connection.stop().then(() => {
//       this.isConnected = false;
//       this.reconnectAttempt = MaxReconnectAttempt;
//     });
//   }

//   private createConnection(hubName: string) {
//     const notificationUrl = (<ApiConfig>this.config.getConfig('api')).notificationUrl;
//     this.connection = new signalR.HubConnectionBuilder()
//       .withUrl(`${notificationUrl}\\${hubName}`, {
//         accessTokenFactory: () => this.authentication.getAccessToken() })
//       .build();
//   }

//   private whenNotificationReceived = () => {
//     this.connection.on('NotificationReceive', (notification: UnityNotification) => {
//       if (this._onNotificationReceived) {
//         this._onNotificationReceived(notification);
//       }
//       // this.log('Notification Received: ', notification);
//     });
//   }

//   private whenConnectionClosed = () => {
//     this.connection.onclose((e) => {
//       this.isConnected = false;
//       this.log('Notification Service Connection closed.');
//       this.reconnect();
//     });
//   }

//   private reconnect() {
//     if (this.reconnectAttempt < MaxReconnectAttempt) {
//       this.reconnectAttempt++;
//       this.log(`Reconnecting notification service... (Attempt ${this.reconnectAttempt})`);
//       setTimeout(() => this.startConnecting(), ReconnectInterval);
//     }
//   }

//   private log(message, object = null) {
//     if (object) {
//       console.log(message, object);
//     } else {
//       console.log(message);
//     }
//   }
// }
