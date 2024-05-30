// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ActivatedRoute } from '@angular/router';
// import { of } from 'rxjs';
// import { Store } from '@ngrx/store';
// import { MockStore, provideMockStore } from '@ngrx/store/testing';
// import { MatDialog } from '@angular/material/dialog';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { PortalApiService } from '../../../../shared/api/portalApi.service';
// import { PanelComponent } from './panel.component';
// import { MockPanels } from '../../mock-data/panels-mock-data';
// import { LabTest, TreePill } from '../../../../contracts/models/lab-setup';
// import { ConfirmDialogDeleteComponent } from '../../../../shared/components/confirm-dialog-delete/confirm-dialog-delete.component';
// import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
// import { ChangeTrackerService } from '../../../../shared/guards/change-tracker/change-tracker.service';
// import { PanelViewComponent } from '../panel-view/panel-view.component';

// describe('PanelComponent', () => {
//   let component: PanelComponent;
//   let fixture: ComponentFixture<PanelComponent>;
//   const activatedRouteStub = { paramMap: of({ get: () => 1 }) };
//   let store: MockStore;
//   const ApiServiceStub = {
//     getLabSetupNode: () => of(MockPanels[0])
//   };

//   const branchData: Array<TreePill> = [
//     {
//       displayName: 'Vishwajit\'s Lab',
//       accountSettings: {
//         displayName: '',
//         dataType: 1,
//         instrumentsGroupedByDept: true,
//         trackReagentCalibrator: true,
//         fixedMean: true,
//         decimalPlaces: 0,
//         siUnits: true,
//         labSetupRating: 0,
//         labSetupComments: '',
//         isLabSetupComplete: false,
//         labSetupLastEntityId: 'null',
//         id: '7c88e834-d0b4-42e4-9bbb-269980d16b24',
//         parentNodeId: 'bca5aa2e-23b6-4596-9812-1d8de8d7a8f4',
//         parentNode: null,
//         nodeType: 9,
//         children: null
//       },
//       hasOwnAccountSettings: false,
//       id: '0d66767b-612c-4254-9eed-3a7ab393029f',
//       parentNodeId: '5340ad39-3d2f-473e-a940-d27e8dbac1af',
//       nodeType: 2,
//       children: [
//         {
//           displayName: 'Vishwajit Dept',
//           levelSettings: {
//             levelEntityId: null,
//             levelEntityName: null,
//             parentLevelEntityId: null,
//             parentLevelEntityName: null,
//             minNumberOfPoints: 5,
//             runLength: 4,
//             dataType: 1,
//             targets: null,
//             rules: [
//               {
//                 id: '2',
//                 category: '1k',
//                 k: '3',
//                 disposition: 'D'
//               },
//               {
//                 id: '1',
//                 category: '1k',
//                 k: '2',
//                 disposition: 'D'
//               }
//             ],
//             levels: [
//               {
//                 levelInUse: true,
//                 decimalPlace: 2
//               }
//             ],
//             id: '631d3481-6b11-4311-9752-55f5a50f32a5',
//             parentNodeId: 'e5593914-c140-418a-a6f7-716037d3df40',
//             parentNode: null,
//             nodeType: 8,
//             displayName: '631d3481-6b11-4311-9752-55f5a50f32a5',
//             children: null
//           },
//           accountSettings: {
//             displayName: '',
//             dataType: 1,
//             instrumentsGroupedByDept: true,
//             trackReagentCalibrator: true,
//             fixedMean: true,
//             decimalPlaces: 0,
//             siUnits: true,
//             labSetupRating: 0,
//             labSetupComments: '',
//             isLabSetupComplete: false,
//             labSetupLastEntityId: 'null',
//             id: '7c88e834-d0b4-42e4-9bbb-269980d16b24',
//             parentNodeId: 'bca5aa2e-23b6-4596-9812-1d8de8d7a8f4',
//             parentNode: null,
//             nodeType: 9,
//             children: null
//           },
//           hasOwnAccountSettings: false,
//           id: 'e5593914-c140-418a-a6f7-716037d3df40',
//           parentNodeId: '0d66767b-612c-4254-9eed-3a7ab393029f',
//           nodeType: 3,
//           children: null
//         }
//       ]
//     }
//   ];

//   const storeStub = {
//     navigation: {
//       currentBranch: branchData,
//     }
//   };

//   const dialogRefStub = {
//     afterClosed() {
//       return of(true);
//     }
//   };

//   const dialogStub = { open: () => dialogRefStub };

//   const mockErrorLoggerService = jasmine.createSpyObj([
//     'logErrorToBackend',
//     'populateErrorObject'
//   ]);

//   const mockChangeTrackerService = jasmine.createSpyObj([
//     'canDeactivate',
//     'setDirty',
//     'resetDirty',
//     'setOkAction'
//   ]);

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         FormsModule,
//         ReactiveFormsModule
//       ],
//       declarations: [PanelComponent, ConfirmDialogDeleteComponent, PanelViewComponent],
//       providers: [
//         { provide: MatDialog, useValue: dialogStub },
//         { provide: PortalApiService, useValue: ApiServiceStub },
//         { provide: ActivatedRoute, useValue: activatedRouteStub },
//         { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
//         { provide: ChangeTrackerService, useValue: mockChangeTrackerService },
//         { provide: Store, useValue: storeStub },
//         provideMockStore({})
//       ]
//     })
//       .compileComponents();
//     store = TestBed.inject(MockStore);
//   }));

//   beforeEach(() => {
//     store.setState(storeStub);
//     fixture = TestBed.createComponent(PanelComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('Should display populated Panel Name', () => {
//     component.selectedPanel = MockPanels[0];
//     fixture.detectChanges();
//     component.ngOnInit();
//     const panelTitle = fixture.debugElement.nativeElement.querySelector('.spec_panelName');
//     fixture.whenStable().then(() => {
//       fixture.detectChanges();
//       expect(MockPanels[0].displayName).toEqual(panelTitle.value);
//     });
//   });

//   it('Should display save button', () => {
//     const btn = fixture.debugElement.nativeElement.querySelector('.spec_saveButton');
//     expect(btn.disabled).toBeTruthy();
//     component.selectedItems = Object.assign([], MockPanels[0].children);
//     const input = fixture.debugElement.nativeElement.querySelector('input');
//     input.value = 'Daily';
//     input.dispatchEvent(new Event('input'));
//     fixture.detectChanges();
//     fixture.whenStable().then(() => {
//       fixture.detectChanges();
//       expect(btn.disabled).toBeFalsy();
//     });
//   });

//   it('Check form submitted', async(() => {
//     const sypOn = spyOn(component, 'onSubmit').and.callThrough();
//     component.selectedItems = <Array<LabTest>>branchData[0].children;
//     const input = fixture.debugElement.nativeElement.querySelector('input');
//     input.value = 'Daily';
//     input.dispatchEvent(new Event('input'));
//     fixture.detectChanges();
//     const button = fixture.debugElement.nativeElement.querySelector('.spec_saveButton');
//     expect(button.disabled).toBeFalsy();
//     button.click();
//     fixture.whenStable().then(() => {
//       fixture.detectChanges();
//       expect(sypOn).toHaveBeenCalled();
//     });
//   }));

//   it('Should display delete button to delete panel', () => {
//     const button = fixture.debugElement.nativeElement.querySelector('.spec_deleteButton');
//     expect(button).toBeTruthy();
//   });
// });
