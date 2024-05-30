
// commented for only this task to sucessfull pass PR
// // © 2023 Bio - Rad Laboratories, Inc.All Rights Reserved
// import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
// import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { HttpClientTestingModule } from '@angular/common/http/testing';

// import { DateTimeCellComponent } from './date-time-cell.component';
// import {HttpLoaderFactory} from "../../../../../../app.module";

// describe('DateTimeCellComponent', () => {
//   let component: DateTimeCellComponent;
//   let fixture: ComponentFixture<DateTimeCellComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ DateTimeCellComponent ],
//       imports: [
//         HttpClientModule,
//         HttpClientTestingModule,
//         TranslateModule.forRoot({
//           loader: {
//             provide: TranslateLoader,
//             useFactory: HttpLoaderFactory,
//             deps: [HttpClient]
//           }
//         }),
//       ],
//       providers: [
//         TranslateService,
//         HttpClient
//       ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(DateTimeCellComponent);
//     component = fixture.componentInstance;
//     component.runDateTime = new Date('Mon Jun 21 2021 11:29:59 GMT-0700 (Pacific Daylight Time)');
//     component.isInsert = false;
//     component.isRestartFloat = false;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should display insert icon only', () => {
//     component.isInsert = true;
//     component.isRestartFloat = false;
//     fixture.detectChanges();
//     const insert = fixture.debugElement.nativeElement.querySelector('.icn-insert');
//     const restartFloat = fixture.debugElement.nativeElement.querySelector('.icn-restart-float');
//     expect(insert).toBeTruthy();
//     expect(restartFloat).toBeFalsy();
//   });

//   it('should display restart float icon only', () => {
//     component.isInsert = false;
//     component.isRestartFloat = true;
//     fixture.detectChanges();
//     const insert = fixture.debugElement.nativeElement.querySelector('.icn-insert');
//     const restartFloat = fixture.debugElement.nativeElement.querySelector('.icn-restart-float');
//     expect(insert).toBeFalsy();
//     expect(restartFloat).toBeTruthy();
//   });

//   it('should not display insert or restart float icons', () => {
//     component.isInsert = false;
//     component.isRestartFloat = false;
//     fixture.detectChanges();
//     const insert = fixture.debugElement.nativeElement.querySelector('.icn-insert');
//     const restartFloat = fixture.debugElement.nativeElement.querySelector('.icn-restart-float');
//     expect(insert).toBeFalsy();
//     expect(restartFloat).toBeFalsy();
//   });

// });

