// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ReportPreviewFooterComponent } from './report-preview-footer.component';
import { ConfigService } from '../../../../../core/config/config.service';
import { BrPermissionsService } from '../../../../../security/services/permissions.service';
import { ErrorLoggerService } from '../../../../../shared/services/errorLogger/error-logger.service';
import { DynamicReportingService } from '../../../../../shared/services/reporting.service';
import { BrError } from '../../../../../contracts/models/shared/br-error.model';
import { PdfResponse } from '../../../models/report-info';
import { LabLocation } from '../../../../../contracts/models/lab-setup';
import { DynamicReportsService } from '../../services/dynamic-reports.service';
import { IconType, StyleOfBtn, TypeOfDialog } from '../../../models/report-dialog';
import { NavigationService } from '../../../../../shared/navigation/navigation.service';
import { HttpLoaderFactory } from '../../../../../app.module';

describe('ReportPreviewFooterComponent', () => {
  let component: ReportPreviewFooterComponent;
  let fixture: ComponentFixture<ReportPreviewFooterComponent>;
  const formBuilder: FormBuilder = new FormBuilder();
  const mockErrorLoggerService = {
    logErrorToBackend: (error: BrError) => { },
    populateErrorObject: () => {
      return new BrError(new Date(), null, '', '', '', '', '', '', '', '', '');
    }
  };

  const storeStub = {
    security: null,
    userPreference: null,
    department: null,
    instrument: null,
    connectivity: null,
    router: null,
    navigation: null,
    location: null,
    dataManagement: null
  };

  const mockPdfData: PdfResponse = {
    dynReportType: '0',
    isTempReport: true,
    metaId: 'A013769447DF4EE2AE99C53B423A3D8F',
    pdfUrl: 'url',
    yearMonth: '202307',
    templateBody: {
      filterCondition: {}
    },
    templateId: '23309bff-b21d-4925-8cfc-9afb12c1d604',
    templateName: 'MyTemplateName',
    outlieredLots: []
  };

  const mocklabLocation: LabLocation = {
    'id': '669b42c2-355d-4e88-af85-e34d74d90920',
    'parentNodeId': '99415057-1026-4c22-b687-5198ec44a5ab',
    'parentNode': {
      'displayName': 'Dev2 Internal Account1',
      'id': '99415057-1026-4c22-b687-5198ec44a5ab',
      'isUnavailable': false,
      'labName': 'Dev2 Internal Account1',
      'nodeType': 1,
      'parentNodeId': 'bf1d67a6-a43a-46ac-bafc-992b8305f421'
    },
    'nodeType': 2,
    'displayName': 'Amazing Lab Center',
    'children': null,
    'labLocationName': 'test after',
    'locationTimeZone': '',
    'locationOffset': '',
    'locationDayLightSaving': '',
    'labLocationContactId': '9753dfcb-448c-4faa-b5f0-e5a40f47033a',
    'labLocationAddressId': '57c048df-7904-4d9d-aed1-77e64ab760fb',
    'labLocationContact': {
      'entityType': 0,
      'firstName': 'rock',
      'lastName': 'doe',
      'name': 'rockdoe',
      'email': 'rock@gms.com',
      'id': ''
    },
    'labLocationAddress': {
      'entityType': 0,
      'nickName': '123 Main St.',
      'streetAddress1': 'demoi',
      'streetAddress2': 'Ste. ABC',
      'streetAddress': 'demoi',
      'city': 'ee',
      'state': 'eee',
      'country': 'AX',
      'zipCode': '234234',
      'id': ''
    },
    'hasChildren': true,
    'locationCount': 3,
    'accountName': 'Amazing Lab Center',
    'accountNumber': 'U100503',
    'groupName': 'Another Group',
    'formattedAccountNumber': 'U100503',
    'transformers': null,
    'usedArchive': true,
    'previousContactUserId': null
  };

  const TRANSLATIONS_EN = require('../../../../../../assets/i18n/en.json');

  const dialogRefStub = {
    close: () => { },
    afterClosed: () => of(false),
    open: () => dialogRefStub
  };

  const dialogStub = {
    close: () => { },
    afterClosed: () => of(false),
    open: () => dialogRefStub
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
        }
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
      ],
    },
  };

  const reportingService = {
    searchReport: () => {
      return of(labConfigData.restResponse);
    },
  };

  const mockConfigService = {
    getConfig: (string): string => {
      return 'en-US';
    }
  };

  const mockBrPermissionsService = {
    hasAccess: () => true,
  };

  const selectDD: any = {
    close: () => { },
  };

  const dynamicReportingServiceSpy = jasmine.createSpyObj('DynamicReportingService', [
    'saveReportInfo'
  ]);

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
      declarations: [ReportPreviewFooterComponent],
      providers: [
        [
          TranslateService,
          { provide: ConfigService, useValue: mockConfigService },
          { provide: MatDialogRef, useValue: dialogRefStub },
          { provide: MatDialog, useValue: dialogStub },
          { provide: FormBuilder, useValue: formBuilder },
          { provide: DynamicReportingService, useValue: dynamicReportingServiceSpy },
          { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
          { provide: DynamicReportsService, useValue: reportingService },
          { provide: BrPermissionsService, useValue: mockBrPermissionsService },
          { provide: NavigationService, useValue: of('') },
          provideMockStore({ initialState: storeStub })
        ]
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPreviewFooterComponent);
    component = fixture.componentInstance;
    component.pdfData = mockPdfData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set initial form values when pdfData has templateName', () => {
    component.pdfData = mockPdfData;
    component.setInitialFormValues();
    expect(component.templateList).toContain('MyTemplateName');
    expect(component.footerForm.get('templateInfo')?.value).toEqual('MyTemplateName');
  });

  it('should set initial form values to "none" when pdfData has templateName "none" ', () => {
    component.pdfData = mockPdfData;
    component.pdfData.templateName = '';
    component.templateList = ['none'];
    component.setInitialFormValues();
    expect(component.templateList).toContain('none');
    expect(component.footerForm.get('templateInfo').value).toEqual('none');
  });

  it('should return false when isMonthlyEvalReportType is false', () => {
    component.isMonthlyEvalReportType = false;
    component.footerForm.controls['signedBy']?.setValue(null);
    component.correctiveActionsFormStatus = true;
    const result = component.getSaveDisabledStatus();
    expect(result).toBe(false);
  });

  it('should return true when isMonthlyEvalReportType is true', () => {
    component.isMonthlyEvalReportType = true;
    component.footerForm.controls['signedBy']?.setValue('');
    component.correctiveActionsFormStatus = false;
    const result = component.getSaveDisabledStatus();
    expect(result).toBe(true);
  });

  it('should close the selectDropdown and open the generic dialog with appropriate parameters', () => {
    component.selectDropdown = selectDD;
    spyOn(component, 'openGenericDialog');
    component.saveNewTemplate();
    expect(component.openGenericDialog).toHaveBeenCalled();
  });

  it('should edit template', () => {
    spyOn(component, 'getTranslation');
    spyOn(component, 'openGenericDialog');
    component.pdfData = mockPdfData;
    component.editTemplate();
    const simpleMessageList = [component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.EDITREPORT),
    component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.TEMPLATECORRECTIVEACTIONSMESSAGE),
    component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.RESETSELECTIONSDIALOGMESSAGETWO)];
    component.openGenericDialog(TypeOfDialog.SimpleBlock, null, null, simpleMessageList,
      component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.CONTINUEBUTTONTEXT),
      component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.CANCEL),
      StyleOfBtn.SolidButton, StyleOfBtn.OutlineButton, true, component.actionType.edit);
    expect(component.openGenericDialog).toHaveBeenCalled();
  });

  it('should set simpleMessageList correctly when pdfData does not include "0" in dynReportType', () => {
    component.pdfData.dynReportType = '1';
    spyOn(component, 'getTranslation');
    spyOn(component, 'openGenericDialog');
    component.editTemplate();
    const simpleMessageList = [component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.EDITREPORT),
    component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.RESETSELECTIONSDIALOGMESSAGETWO)];
    component.openGenericDialog(TypeOfDialog.SimpleBlock, null, null, simpleMessageList,
      component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.CONTINUEBUTTONTEXT),
      component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.CANCEL),
      StyleOfBtn.SolidButton, StyleOfBtn.OutlineButton, true, component.actionType.edit);
    expect(component.openGenericDialog).toHaveBeenCalled();
  });
  it('should save pdf info', () => {
    component.labLocation = mocklabLocation;
    dynamicReportingServiceSpy.saveReportInfo.and.returnValue(of({}));
    spyOn(component, 'getTranslation');
    spyOn(component, 'openGenericDialog');
    component.savePdfInfo();
    const titleMessage = component.getTranslation(TRANSLATIONS_EN.REPORTNOTIFICATIONS.SAVINGREPORT);
    const messageContent = [component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.GENERATINGREPORTMESSAGE)];
    const buttonName = component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.CLOSE);
    component.openGenericDialog(TypeOfDialog.SingleBlock, IconType.GeneratingCircle, titleMessage, messageContent,
      buttonName, null, StyleOfBtn.SolidButton, null, false, component.actionType.save);
    expect(component.openGenericDialog).toHaveBeenCalled();
  });

  it('should open generic dialog', () => {
    component.labLocation = mocklabLocation;
    dialogRefStub.afterClosed = () => of(true);
    dynamicReportingServiceSpy.saveReportInfo.and.returnValue(of(component.actionType.insert));
    spyOn(component, 'getTranslation');
    spyOn(component, 'openGenericDialog');
    const titleErrorMessage = component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.REPORTSAVEDFAILED);
    const messageErrorContent = [component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.REPORTSAVEDFAILEDMESSAGE)];
    const buttonErrorName = component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.CLOSE);
    component.openGenericDialog(TypeOfDialog.doubleBlock, IconType.CardWarning, titleErrorMessage, messageErrorContent,
      buttonErrorName, null, StyleOfBtn.SolidButton, null, true, '', IconType.RedWarning);
    expect(component.openGenericDialog).toHaveBeenCalled();
  });
});
