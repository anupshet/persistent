// import { SignalRService } from './signal-r.service';
// import { ApiConfig } from 'app/core/config/config.contract';
// import { AudienceType } from '../interfaces/audience-type';
// import * as signalR from '@aspnet/signalr';

// fdescribe('SignalRService', () => {
//   let sut: SignalRService;
//   let configSpy;
//   const notificationUrl = 'http:xxx';
//   beforeEach(() => {
//     configSpy = jasmine.createSpyObj('ConfigService', ['getConfig']);
//     configSpy.getConfig.and.returnValue({ notificationUrl } as ApiConfig);
//     sut = new SignalRService(configSpy);
//   });

//   describe('Constructor', () => {
//     it('should be created', () => {
//       expect(sut).toBeTruthy();
//     });

//     it('three stream should be created for Lab, User and All', () => {
//       expect(sut.$stream(AudienceType.All)).toBeTruthy();
//       expect(sut.$stream(AudienceType.User)).toBeTruthy();
//       expect(sut.$stream(AudienceType.Lab)).toBeTruthy();
//     });
//   });

//   describe('Connect', () => {
//     // it('should be created', () => {
//     //   const uubConnection = {

//     //   } as signalR.HubConnection;
//     //   spyOn(uubConnection, 'serverTimeoutInMilliseconds').and.returnValue(1009);

//     //   const spy1 = spyOn(signalR.HubConnectionBuilder.prototype, 'withUrl')
//     //     .and.returnValue({ build: () =>  uubConnection  } as signalR.HubConnectionBuilder);

//     //   sut.connect('');
//     //   expect(sut).toBeTruthy();

//     });


//   });
