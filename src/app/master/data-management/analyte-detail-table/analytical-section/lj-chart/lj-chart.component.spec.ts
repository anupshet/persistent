// import { MockNgRedux, NgReduxTestingModule } from '@angular-redux/store/testing';
// import { DecimalPipe } from '@angular/common';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { of } from 'rxjs/observable/of';
// import { Subject } from 'rxjs/Rx';

// import { AppState } from '../../../app-states/store/appState';
// import { TransformSummaryStatsPipe, TransformZscorePipe } from '../../../shared/custom-pipe/transform-values.pipe';
// import { ToggleButtonsService } from '../analyte-detail-table/toggle-buttons/toggle-buttons.service';
// import { LjChartPopupComponent } from './lj-chart-popup/lj-chart-popup.component';
// import { LjChartPopupService } from './lj-chart-popup/lj-chart-popup.service';
// import { LjChartComponent } from './lj-chart.component';
// import { LJChartService } from './lj-chart.service';
// import { AppNavigationTrackingService } from '../../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';

// describe('LJ Chart Component', () => {
//   let component: LjChartComponent;
//   let fixture: ComponentFixture<LjChartComponent>;
//   let compiled;
//   const data: any = require('../../../contracts/unit-tests/mock-runs-data.json');
// const mockAppNavigationTrackingService = {   
//     auditTrailViewData: () => { }
//   };

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         LjChartComponent,
//         LjChartPopupComponent,
//         TransformZscorePipe,
//         TransformSummaryStatsPipe
//       ],
//       imports: [NgReduxTestingModule],
//       providers: [
//         {
//           provide: LjChartPopupService,
//           useValue: { getCoordinates: () => of({}) }
//         },
//         {
//           provide: ToggleButtonsService,
//           useValue: { levelHidden: of({}), levelVisible: of({}), runsChanged:{ next: () => {}} }
//         },
//         {
//           provide: LJChartService,
//           useValue: { renderChart: of({ width: 870, take: 25 }) }
//         },
//         { provide: AppNavigationTrackingService, useValue: mockAppNavigationTrackingService },

//         DecimalPipe
//       ]
//     }).compileComponents();

//     MockNgRedux.reset();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(LjChartComponent);
//     component = fixture.componentInstance;
//     compiled = fixture.debugElement.nativeElement;
//     fixture.detectChanges();
//   });

//   beforeEach(() => {
//     const runsResultStateStub: Subject<any> = MockNgRedux.getSelectorStub<AppState, any>('runsResultState');
//     runsResultStateStub.next({ runsResult: data });
//   });

//   it('should have three levels', () => {
//     expect(compiled.querySelector('#line0')).toBeDefined();
//     expect(compiled.querySelector('#line1')).toBeDefined();
//     expect(compiled.querySelector('#line2')).toBeDefined();
//     expect(compiled.querySelector('#line3')).toBeDefined();
//     expect(compiled.querySelector('#line4')).toBeDefined();
//   });

//   it('all levels should compile', () => {
//      expect(component.chart.xDates.length).toBe(25);
//   });

// //   it('all runs should load and parse', () => {
// //     expect(component.chart.runs.length).toBe(3);
// //  });

//   it('all datapoints should load and parse', () => {
//     expect(component.chart.levels.length).toBe(68);
//  });

//   it('should follow yAxis cordinates', () => {
//     const yAxisCoord = ["-3.0", "-2.0", "-1.0", "0.0", "1.0", "2.0", "3.0"];
//     // Convert NodeList to Array
//     const yAxis = Array.prototype.slice.call(compiled.querySelectorAll('.y.axis text'));
//     const values = yAxis.map(value => value.textContent);
//     yAxis.forEach(value => {
//       expect(yAxisCoord.indexOf(value.textContent) > -1).toBeTruthy();
//     });
//   });

//   it('should contains all levels xAxis dates', () => {
// tslint:disable-next-line: max-line-length
//     const xAxisCoord = ['Mar 13', 'Mar 14', 'Mar 15', 'Mar 16', 'Mar 17', 'Mar 18', 'Mar 19', 'Mar 20', 'Mar 21', 'Mar 22', 'Mar 23', 'Mar 24', 'Mar 25', 'Mar 26', 'Mar 27', 'Mar 28', 'Mar 29', 'Jan 29', 'Mar 02', 'Mar 02', 'Mar 03', 'Mar 08', 'Mar 08', 'Mar 08'];
//     // Convert NodeList to Array
//     const xAxis = Array.prototype.slice.call(compiled.querySelectorAll('.x.axis text'));
//     const values = xAxis.map(value => value.textContent);
//     xAxis.forEach(value => {
//       expect(xAxisCoord.indexOf(value.textContent) > -1).toBeTruthy();
//     });
//   });

// });
