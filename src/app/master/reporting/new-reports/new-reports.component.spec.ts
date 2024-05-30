// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import {
  async,
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';

import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import { DynamicReportsService } from './services/dynamic-reports.service';
import { NewReportsComponent } from './new-reports.component';
import { LabConfigResponse, SearchFilterData } from '../models/report-info';
import { DynamicReportingService } from '../../../shared/services/reporting.service';
import { NavigationService } from '../../../shared/navigation/navigation.service';
import { BrPermissionsService } from '../../../security/services/permissions.service';
import { NavigationEnd } from '@angular/router';

describe('NewReportsComponent', () => {
  let component: NewReportsComponent;
  let fixture: ComponentFixture<NewReportsComponent>;
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
  const storeStub = {
    error: Error,
  };

  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject',
  ]);

  const reportingService = {
    searchReport: () => {
      return of(labConfigData.restResponse);
    },
  };

  const dynamicReportingService = {
    viewPdfReport: () => of([]).toPromise()
  };
  const mockBrPermissionsService = {
    hasAccess: () => { },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewReportsComponent],
      providers: [
        { provide: Store, useValue: storeStub },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: DynamicReportsService, useValue: reportingService },
        { provide: DynamicReportingService, useValue: dynamicReportingService },
        { provide: NavigationService, useValue: of('') },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        provideMockStore({}),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewReportsComponent);
    component = fixture.componentInstance;
    component.labConfigData = <LabConfigResponse>(
      JSON.parse(JSON.stringify(labConfigData.restResponse))
    );

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clear the temporary selection holder matrix when we clear search and patch existing checks', () => {
    component.patchExistingChecks();
    expect(component.tempSelectionHolder.controls).toEqual([]);
  });

  it('should set isFiltered flag to true when we search with a filter and keyword', () => {
    const filterData: SearchFilterData = {
      filter: 'Instrument',
      keyword: 'VITROS',
    };
    component.onSearchFilter(filterData);
    expect(component.labConfigData.isFiltered).toBeTrue();
  });

  it('should update checked/filtered status for checkboxes', () => {
    component.labConfigData.analytes[0].isChecked = true;
    component.instrumentGroupByDept = true;
    component.setTempId('');
    expect(component.labConfigData.departments[0].isChecked).toBeUndefined();
  });
});
