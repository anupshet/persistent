// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { SimpleChange, SimpleChanges } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LabConfigResponse } from '../../../models/report-info';
import { LabconfigSelectionComponent } from './labconfig-selection.component';
import { ErrorLoggerService } from '../../../../../shared/services/errorLogger/error-logger.service';
import { BrError } from '../../../../../contracts/models/shared/br-error.model';
import { DynamicReportsService } from '../../services/dynamic-reports.service';
import { HttpLoaderFactory } from '../../../../../app.module';

describe('LabconfigSelectionComponent', () => {
  let component: LabconfigSelectionComponent;
  let fixture: ComponentFixture<LabconfigSelectionComponent>;
  const mockErrorLoggerService = {
    logErrorToBackend: (error: BrError) => { },
    populateErrorObject: () => {
      return new BrError(new Date(), null, '', '', '', '', '', '', '', '', '');
    }
  };
  const labConfigData = {
    restResponse: {
      id: 'd8178bff-6892-482c-a356-4fc7cef32160',
      accountName: 'Arun Lab 2',
      accountNumber: '103226',
      nodeType: 0,
      groups: [
        {
          id: 'ac5ccd0e-ff8a-4934-aac9-ac20de247fa3',
          name: 'Arun Lab 2',
          parentId: 'd8178bff-6892-482c-a356-4fc7cef32160',
          nodeType: 0,
        },
      ],
      locations: [
        {
          id: '7ab83645-e96b-4e6e-9417-8a759fed7868',
          name: 'Arun Lab 2',
          parentId: 'ac5ccd0e-ff8a-4934-aac9-ac20de247fa3',
          nodeType: 2,
          instrumentGroupByDept: true,
        },
      ],
      departments: [
        {
          id: '42aa4477-6ba6-455b-b9b8-c3daf329b343',
          name: 'Kalyani Dept0811',
          parentId: '7ab83645-e96b-4e6e-9417-8a759fed7868',
          nodeType: 3,
        },
        {
          id: '3a098cef-c72b-409b-a0c4-667fb9f2244f',
          name: 'Kalyani Dept0811 01',
          parentId: '7ab83645-e96b-4e6e-9417-8a759fed7868',
          nodeType: 3,
        },
      ],
      instruments: [
        {
          name: 'VITROS 5600',
          codelistInstrumentId: 1408,
          groups: [
            {
              id: '6a35870f-85c2-42ee-a636-2179864a54db',
              name: 'VITROS 5600',
              parentId: '42aa4477-6ba6-455b-b9b8-c3daf329b343',
              instrumentCustomName: 'ABC',
              serialNumber: '123',
              instrumentId: 1408,
              manufacturerId: 22,
              manufacturerName: 'Ortho Clinical Diagnostics',
              nodeType: 4,
            },
          ],
        },
        {
          name: 'ADJ_Div',
          codelistInstrumentId: 3438,
          groups: [
            {
              id: '3be18d42-16ef-4e50-be8f-7b56e280d7c6',
              name: 'ADJ_Div',
              parentId: '42aa4477-6ba6-455b-b9b8-c3daf329b343',
              instrumentCustomName: '',
              serialNumber: '544',
              instrumentId: 3438,
              manufacturerId: 1,
              manufacturerName: 'Abbott',
              nodeType: 4,
            },
            {
              id: '69823519-d54a-430d-b3c8-3867bbff41d5',
              name: 'ADJ_Div',
              parentId: '42aa4477-6ba6-455b-b9b8-c3daf329b343',
              instrumentCustomName: 'Testcustom',
              serialNumber: 'TestSerial',
              instrumentId: 3438,
              manufacturerId: 1,
              manufacturerName: 'Abbott',
              nodeType: 4,
            },
          ],
        },
        {
          name: 'AU2700',
          codelistInstrumentId: 2299,
          groups: [
            {
              id: '2ab016f0-8811-4220-9210-86bcf8966e29',
              name: 'AU2700',
              parentId: '42aa4477-6ba6-455b-b9b8-c3daf329b343',
              instrumentCustomName: '1',
              serialNumber: '',
              instrumentId: 2299,
              manufacturerId: 14,
              manufacturerName: 'Beckman Coulter',
              nodeType: 4,
            },
            {
              id: '13386326-6a4c-40bf-a697-7daa7e232838',
              name: 'AU2700',
              parentId: '3a098cef-c72b-409b-a0c4-667fb9f2244f',
              instrumentCustomName: '',
              serialNumber: '',
              instrumentId: 2299,
              manufacturerId: 14,
              manufacturerName: 'Beckman Coulter',
              nodeType: 4,
            },
          ],
        },
      ],
      controls: [
        {
          name: 'Unassayed Chemistry',
          masterLotProductId: 30,
          groups: [
            {
              id: '08dedd64-6ba6-455b-9d66-17e23a8b6a40',
              name: 'Unassayed Chemistry',
              parentId: '3be18d42-16ef-4e50-be8f-7b56e280d7c6',
              productCustomName: 'ABC',
              lotNumber: '56960',
              productId: 30,
              productMasterLotId: 1527,
              nodeType: 5,
              lotExpiryDate: '2023-03-31T00:00:00Z',
            },
            {
              id: '71d72b3e-f486-4943-9644-afb51249b89f',
              name: 'Unassayed Chemistry',
              parentId: '69823519-d54a-430d-b3c8-3867bbff41d5',
              productCustomName: '',
              lotNumber: '92920',
              productId: 30,
              productMasterLotId: 1516,
              nodeType: 5,
              lotExpiryDate: '2023-06-30T00:00:00Z',
            },
            {
              id: '71d72b3e-f486-4943-9644-afb51249b8967',
              name: 'Unassayed Chemistry 1',
              parentId: '69823519-d54a-430d-b3c8-3867bbff41d5',
              productCustomName: '',
              lotNumber: '92920',
              productId: 30,
              productMasterLotId: 1516,
              nodeType: 5,
              lotExpiryDate: '2023-06-30T00:00:00Z',
            },
          ],
        },
        {
          name: 'Diabetes',
          masterLotProductId: 11,
          groups: [
            {
              id: '0576181b-d31b-402b-b097-06f1e117a420',
              name: 'Diabetes',
              parentId: '3be18d42-16ef-4e50-be8f-7b56e280d7c6',
              productCustomName: '',
              lotNumber: '85820',
              productId: 11,
              productMasterLotId: 1433,
              nodeType: 5,
              lotExpiryDate: '2023-04-30T00:00:00Z',
            },
          ],
        },
        {
          name: 'Diabetes 1',
          masterLotProductId: 12,
          groups: [
            {
              id: '0576181b-d31b-402b-b097-06f1e117a428',
              name: 'Diabetes',
              parentId: '71d72b3e-f486-4943-9644-afb51249b8967',
              productCustomName: '',
              lotNumber: '85890',
              productId: 12,
              productMasterLotId: 1439,
              nodeType: 6,
              lotExpiryDate: '2023-04-30T00:00:00Z',
            },
          ],
        },
        {
          name: 'Cardiac Markers Plus',
          masterLotProductId: 166,
          groups: [
            {
              id: '0672df57-9363-4b60-a431-768f302c3f79',
              name: 'Cardiac Markers Plus',
              parentId: '3be18d42-16ef-4e50-be8f-7b56e280d7c6',
              productCustomName: '',
              lotNumber: '87840',
              productId: 166,
              productMasterLotId: 1496,
              nodeType: 5,
              lotExpiryDate: '2024-09-30T00:00:00Z',
            },
            {
              id: '75963fbd-ea8b-4b2e-9a40-fed216e97fe3',
              name: 'Cardiac Markers Plus',
              parentId: '69823519-d54a-430d-b3c8-3867bbff41d5',
              productCustomName: '',
              lotNumber: '87820',
              productId: 166,
              productMasterLotId: 1494,
              nodeType: 5,
              lotExpiryDate: '2023-07-31T00:00:00Z',
            },
            {
              id: '571887d0-a846-4adc-8df3-d82dfe0ec52b',
              name: 'Cardiac Markers Plus',
              parentId: '3be18d42-16ef-4e50-be8f-7b56e280d7c6',
              productCustomName: 'cm_test1',
              lotNumber: '87840',
              productId: 166,
              productMasterLotId: 1496,
              nodeType: 5,
              lotExpiryDate: '2024-09-30T00:00:00Z',
            },
          ],
        },
      ],
      analytes: [
        {
          id: '38cc7173-a7c2-4c3d-a9e6-3cbe237c04b7',
          name: 'Acetaminophen',
          parentId: [
            '71d72b3e-f486-4943-9644-afb51249b89f',
            '3a45400f-2e02-41c1-9fa6-05e26eda2d89',
            '30efcf48-89ae-4681-87f4-0d832d2d211e',
          ],
          nodeType: 6,
          analyteId: 4,
        },
        {
          id: '15c97f78-6fe1-40b0-9aa5-e4c1e16acf8f',
          name: 'Hemoglobin F',
          parentId: [
            '0672df57-9363-4b60-a431-768f302c3f79',
            '0576181b-d31b-402b-b097-06f1e117a420',
            '71d72b3e-f486-4943-9644-afb51249b8967',
            '71d72b3e-f486-4943-9644-afb51249b89f',
            '08dedd64-6ba6-455b-9d66-17e23a8b6a40',
          ],
          nodeType: 6,
          analyteId: 290,
        },
      ],
    },
  };
  const dialogRefStub = {
    close: () => { },
    afterClosed: () => of(false)
  };

  const dialogStub = {
    open: () => dialogRefStub,
    close: () => { }
  };
  const selectedLeafStub = {
    displayName: 'Acetaminophen',
    id: '38cc7173-a7c2-4c3d-a9e6-3cbe237c04b7',
    parentNodeId: '71d72b3e-f486-4943-9644-afb51249b89f',
    nodeType: 6,
    testSpecInfo: {
      analyteId: 4
    }

  };
  const selectedNodeStub = {
    displayName: 'Unassayed Chemistry',
    id: '71d72b3e-f486-4943-9644-afb51249b89f',
    parentNodeId: '69823519-d54a-430d-b3c8-3867bbff41d5',
    nodeType: 5,
  };

  const storeStub = {
    selectedLeaf: selectedLeafStub,
    selectedNode: selectedNodeStub,
    error: Error,
  };
  const isCreateBtnDisabled = new BehaviorSubject<boolean>(false);
  const reportingService = {
    searchReport: () => {
      return of(labConfigData.restResponse);
    },
    enableOrDisableCreateButton: (status: boolean) => {
      isCreateBtnDisabled.next(status);
    },
    getCreateButtonStatus: () => {
      return of(true);
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      declarations: [LabconfigSelectionComponent],
      providers: [{ provide: ErrorLoggerService, useValue: mockErrorLoggerService },
      { provide: MatDialog, useValue: dialogStub },
      { provide: MatDialogRef, useValue: dialogRefStub },
      { provide: Store, useValue: storeStub },
      { provide: DynamicReportsService, useValue: reportingService },
      TranslateService,
      provideMockStore({}),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabconfigSelectionComponent);
    component = fixture.componentInstance;
    component.labConfigData = <LabConfigResponse>(
      JSON.parse(JSON.stringify(labConfigData.restResponse))
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update count when labconfig data changes', () => {
    const previousValue = {};
    const currentValue = <LabConfigResponse>(
      JSON.parse(JSON.stringify(labConfigData.restResponse))
    );

    const changesObj: SimpleChanges = {
      labConfigData: new SimpleChange(previousValue, currentValue, false),
    };
    spyOn(component, 'updateCount');
    component.ngOnChanges(changesObj);
    expect(component.updateCount).toHaveBeenCalled();
  });

  it('should set all checked flags to false when clear selection is triggered', () => {
    component.clearSelection();
    expect(component.labConfigData.analytes[0].isChecked).toBeFalse();
  });

  it('should set all checked flags to false when clear selection is triggered while doing search', () => {
    component.isFilterOn = true;
    component.clearSelection();
    expect(component.labConfigData.analytes.some(x => x.isChecked)).toBeFalse();
    expect(component.labConfigData.departments.some(x => x.isChecked)).toBeFalse();
    expect(component.labConfigData.controls.some(x => x.isChecked)).toBeFalse();
    expect(component.labConfigData.instruments.some(x => x.isChecked)).toBeFalse();
  });

  it('should get analyte count on clearing selection or when update count is triggered', () => {
    const count = component.getAnalytesCount();
    expect(count.count).toBe(2);
  });

  it('should filter related child instrument when a parent department is checked', () => {
    component.directionIndex = 1;
    component.onCheckChanged('Department', true, 0, null);
    expect(component.labConfigData.instruments[0].isFiltered).toBeTrue();
  });

  it('should filter control when any related instrument checkboxes are checked', () => {
    spyOn(component, 'checkControlByInstrument');
    component.onCheckChanged('Instrument', true, 0, null);
    expect(component.checkControlByInstrument).toHaveBeenCalled();
  });

  it('should filter instrument when related child control is checked', () => {
    component.labConfigData.isFiltered = true;
    component.onCheckChanged('Control', true, 0, null);
    expect(component.labConfigData.instruments[0].isFiltered).toBeTrue();
  });

  it('should filter control when related child analyte is checked', () => {
    component.directionIndex = 4;
    component.onCheckChanged('Analyte', true, 0, null);
    expect(component.labConfigData.controls[0].isFiltered).toBeTrue();
  });

  it('should filter control when related child analyte is checked', () => {
    component.selectedNode = storeStub.selectedNode;
    component.selectedLeaf = storeStub.selectedLeaf;
    component.triggerFilterForSelectedNodes();
    expect(component.labConfigData.analytes[0].isChecked).toBeTrue();
  });
});
