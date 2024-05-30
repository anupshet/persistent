// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { BehaviorSubject, of } from 'rxjs';

import { DynamicReportingService } from '../../../../../shared/services/reporting.service';
import { ErrorLoggerService } from '../../../../../shared/services/errorLogger/error-logger.service';
import { ReportTemplatesComponent } from './report-templates.component';
import { BrPermissionsService } from '../../../../../security/services/permissions.service';
import { IconType, StyleOfBtn, TemplateValidation, TypeOfDialog, TypeOfMessage } from '../../../models/report-dialog';
import { ITemplate } from '../../../reporting.enum';
import { CommonService } from '../../services/common.service';
import { DynamicReportsService } from '../../services/dynamic-reports.service';
import { HttpLoaderFactory } from '../../../../../app.module';

describe('ReportTemplatesComponent', () => {
  let component: ReportTemplatesComponent;
  let fixture: ComponentFixture<ReportTemplatesComponent>;

  const TRANSLATIONS_EN = require('../../../../../../assets/i18n/en.json');


  const dynamicReportingServiceSpy = jasmine.createSpyObj('DynamicReportingService', [
    'getTemplateList', 'getResetStatus', 'deleteTemplate', 'saveTemplate', 'getLoadedStatus'
  ]);

  const commonServiceSpy = jasmine.createSpyObj('CommonService', ['filterLabConfigData', 'openSelectionsDialog']);

  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject',
  ]);
  const mockMatDialog = jasmine.createSpyObj(['open', 'close', 'closeAll', 'afterClosed']);
  const mockBrPermissionsService = {
    hasAccess: () => { },
  };


  const dialogRefStub = {
    close: () => { },
    afterClosed: () => of(0)
  };

  const dialogStub = {
    open: () => dialogRefStub,
    close: () => { }
  };

  const isTemplateUpdated = new BehaviorSubject<boolean>(false);

  const reportingService = {
    getCreateButtonStatus: (status: boolean) => {},
    setTemplateUpdated: (status: boolean) => {
      isTemplateUpdated.next(status);
    },
  };

  beforeEach(async(() => {
    const filterLabConfigDataReturnValue: any = {
      departmentList: {id: '4ebf2f52-3936-4203-bf93-3f8be'},
      instrumentList: {id: '4ebf2f52-3936-4203-bf93-3f8be'},
      controlList: {id: 1102 },
      analyteList: {id: 26 },
      isSelectionValid: true,
      canProceed: true
    };
    commonServiceSpy.filterLabConfigData.and.returnValue(filterLabConfigDataReturnValue);
    TestBed.configureTestingModule({
      imports: [MatMenuModule, MatSelectModule, BrowserAnimationsModule,
        HttpClientModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })],
      declarations: [ReportTemplatesComponent],
      providers: [{ provide: Store, useValue: [] },
        provideMockStore({}),
        TranslateService,
        { provide: DynamicReportingService, useValue: dynamicReportingServiceSpy },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: MatDialog, useValue: dialogStub },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: MatDialogRef, useValue: dialogRefStub },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: DynamicReportsService, useValue: reportingService },
        { provide: CommonService, useValue: commonServiceSpy }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTemplatesComponent);
    component = fixture.componentInstance;
    const selectDD: any = {
      close: () => {},
    };
    component.selectDropdown = selectDD;
    spyOn(component.selectDropdown, 'close');

    const templateList: any = [{
      'labLocationId': '4ebf2f52-3936-4203-bf93-3f8befab64eb',
      'templateName': 'template test23',
      'templateBody': {
        'filterCondition': {
          'lotFilter': [
          ],
          'instrumentFilter': [
            'f016cb15-a9f0-4728-ac0a-adedaca161e5'
          ]
        }
      }
    }];

    const sendTemplateDetails: ITemplate = {
      id : '3b5f4153-d3c9-4e3f-bc68-1d5344d900be',
      isEditReport: true,
      labLocationId: '4ebf2f52-3936-4203-bf93-3f8befab64eb',
      templateBody: {
        filterCondition: {
          'departmentFilter': [
            '30c103f8-e219-48d0-894e-2bb690649547'
          ]
      }},
      templateName: '12July23',
      yearMonth: '202307'
    };

    component.locationId = '4ebf2f52-3936-4203-bf93-3f8befab64eb';
    dynamicReportingServiceSpy.getTemplateList.and.returnValue(of(templateList));
    dynamicReportingServiceSpy.getResetStatus.and.returnValue(of('false'));
    dynamicReportingServiceSpy.getLoadedStatus.and.returnValue(of(sendTemplateDetails));
    const labConfig: any = {
      accountName: 'Testing_FeatureEdge',
      accountNumber: '203295',
      locations: [
        {
            'id': '4ebf2f52-3936-4203-bf93-3f8befab64eb',
            'name': 'Testing_FeatureEdge',
            'parentId': 'e67e8741-2e94-4073-b550-9698f961b155',
            'nodeType': 2,
            'instrumentGroupByDept': true
        }
    ],
      departments: [
        {
          id: '30c103f8-e219-48d0-894e-2bb690649547',
          isChecked: true,
          name: 'UN-10519',
          nodeType: 3,
          parentId: '4ebf2f52-3936-4203-bf93-3f8befab64eb',
          tooltipData: {
            category: 'Department',
            data: [
              {
                name: 'Alinity c',
                id: '3115',
                groups: [{name: 'Alinity c - as', id: 'f016cb15-a9f0-4728-ac0a-adedaca161e5'}],
                matched: true
              }
            ],
            heading: 'Department Details',
            subheading: 'Instrument'
          }
        }
      ],
      instruments: [
        {
          codelistInstrumentId: 3115,
          isChecked: true,
          name: 'Alinity c',
          groups: [{
            id: 'f016cb15-a9f0-4728-ac0a-adedaca161e5', name: 'Alinity c', parentId: '30c103f8-e219-48d0-894e-2bb690649547',
            isChecked: true, isFiltered: false
          },
          {
            id: 'f016cb15-a9f0-4728-ac0a-adedaca161e5', name: 'Alinity c', parentId: '30c103f8-e219-48d0-894e-2bb690649547',
            isChecked: false, isFiltered: false}]
        }
      ],
      controls: [
        {
          isChecked: true,
          masterLotProductId: 63,
          name: 'Multiqual 1,2,3',
          groups: [
            { id: '45e4b61a-d100-40c5-87b6-fdcdb71d18a5', productMasterLotId: 1108, isChecked: true, isFiltered: false, parentId: 'f016cb15-a9f0-4728-ac0a-adedaca161e5' },
            { id: '45e4b61a-d100-40c5-87b6-fdcdb71d18a5', productMasterLotId: 1108, isChecked: false, isFiltered: false }]
        }
      ],
      analytes: [
        {
          analyteId: 46,
          isChecked: true,
          name: 'CO2 (Carbon Dioxide)'
        }
      ]
    };
    component.labConfigData = labConfig;
    component.selectedOption = {
      accountId: 'ea750fa2-c89b-4ed5-805b-648ab9be5fce',
      id: 'd8e4f2e9-edc9-40d8-9671-decb2dfd17bc',
      templateName: 'template test23',
      labLocationId: '4ebf2f52-3936-4203-bf93-3f8befab64eb',
      templateBody: {
        filterCondition: {
          instrumentFilter: ['f016cb15-a9f0-4728-ac0a-adedaca161e5'],
          lotFilter: ['5d7d3fc3-cf5e-4b3c-a582-75a98aa7ce9c'],
          analyteFilter: [25],
          departmentFilter: ['f016cb15-a9f0-4728-ac0a-adedaca161e5'],
          filterBaseColumn: 1
        }
      }
    };
    component.actionPermissions = {
      update: true,
      rename: true,
      delete: true
    };
    dynamicReportingServiceSpy.deleteTemplate.and.returnValue(of([]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call service method- getTemplateList to populate template list', () => {
    component.templateList = [];
    component.locationId = '4ebf2f52-3936-4203-bf93-3f8befab64eb';
    const response: any = [{
      labLocationId: '4ebf2f52-3936-4203-bf93-3f8befab64eb',
      templateName: 'template test23',
      templateBody: {
        filterCondition: {
          lotFilter: [],
          instrumentFilter: ['f016cb15-a9f0-4728-ac0a-adedaca161e5']
        }
      }
    }];
    component.getTemplateList();
    fixture.detectChanges();
    expect(component.templateList).toEqual(response);
  });

  it('should call checkForSelectedItems method for items selected', () => {
    const allCheck = component.checkForSelectedItems();
    expect(allCheck).toBeTruthy();
  });

  it('should call templateOnSelection method when any template is selected and any item is selected', () => {
    const event: any = {};
    spyOn(component, 'callGenericDialog');
    component.templateOnSelection(event);
    expect(component.callGenericDialog).toHaveBeenCalledTimes(1);
    expect(component.showClearTempButton).toBeTruthy();
  });

  it('should call checkForTempValidity method when any template is selected and some template items are missing', () => {
    spyOn(component, 'validateTemplate').and.returnValue(TemplateValidation.Missing);
    spyOn(component, 'openGenericDialog');
    spyOn(component, 'getTranslation');
    component.checkForTempValidity();
    expect(component.getTranslation).toHaveBeenCalled();
  });

  it('should call checkForTempValidity method when any template is selected and all template items are found', () => {
    spyOn(component, 'loadItems');
    spyOn(component, 'validateTemplate').and.returnValue(TemplateValidation.AllFound);
    component.checkForTempValidity();
    expect(component.loadItems).toHaveBeenCalledTimes(1);
  });

  it('should call checkForTempValidity method when any template is selected and all template items are missing i.e expired lots', () => {
    spyOn(component, 'validateTemplate').and.returnValue(TemplateValidation.AllMissing);
    spyOn(component, 'openGenericDialog');
    spyOn(component, 'getTranslation');
    component.checkForTempValidity();
    expect(component.getTranslation).toHaveBeenCalled();
  });

  it('should call loadItems method to select template items', fakeAsync(() => {
    spyOn(component, 'clearTemplate').withArgs(false);
    spyOn(component, 'selectItems');
    fixture.detectChanges();

    component.loadItems();
    tick(10);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.clearTemplate).toHaveBeenCalledOnceWith(false);
      expect(component.selectItems).toHaveBeenCalledTimes(1);
      expect(component.showClearTempButton).toBeTruthy();
      expect(component.selectDropdown.close).toHaveBeenCalled();
    });
  }));

  it('should call callGenericDialog method', () => {
    spyOn(component, 'getTranslation');
    spyOn(component, 'openGenericDialog');
    component.callGenericDialog();
    const titleMessage = component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.LOADINGTEMPLATE);
    const messageContent = [component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.LOADINGTEMPLATECONFIRMATION),
      component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.LOADINGTEMPLATECONFIRMATIONSELECTIONCHANGE)];
    component.openGenericDialog(TypeOfDialog.doubleBlock, IconType.Reload, titleMessage, messageContent,
      component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.LOADINGTEMPLATE),
      component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.CANCEL),
      StyleOfBtn.SolidButton, StyleOfBtn.OutlineButton, false, null, component.actionType.loadTemplate,
      true, IconType.YellowWarning, TypeOfMessage.Warning);
    expect(component.openGenericDialog).toHaveBeenCalled();
  });

  it('should call menuClosed method', () => {
    spyOn(component.selectDropdown, 'close');
    component.menuClosed();
    expect(component.selectDropdown.close).toHaveBeenCalled();
  });

  it('should call clearTemplate method to clear the selections and reset the button visibolity when isClear flag is false i.e clear template button is not clicked but want to perform clear selection indirectly', () => {
    spyOn(component, 'clearSelectionsAndDisableButtons');
    component.clearTemplate(false);
    expect(component.clearSelectionsAndDisableButtons).toHaveBeenCalled();
  });

  it('should call clearTemplate method to clear the selections and reset the button visibolity when isClear flag is true i.e clear template button is being clicked', () => {
    spyOn(component, 'clearSelectionsAndDisableButtons');
    component.clearTemplate(true);
    // dialogRefStub.afterClosed.returnValue(of(0));
    expect(component.selectDropdown.value).toEqual([]);
    expect(component.clearSelectionsAndDisableButtons).toHaveBeenCalled();
  });

  it('should call clearSelectionsAndDisableButtons method to reset button visibility and trigger clear selection output', () => {
    spyOn(component.isClearSelection, 'emit');
    component.clearSelectionsAndDisableButtons();
    // spyOn(component, 'clearSelectionsAndDisableButtons');
    expect(component.showClearTempButton).toBeFalsy();
    expect(component.showSaveNewTempButton).toBeFalsy();
    expect(component.isClearSelection.emit).toHaveBeenCalledWith(component.isClear);
  });

  it('should call clearTemplateFromParent method', () => {
    spyOn(component.isClearSelection, 'emit');
    component.clearTemplateFromParent();
    expect(component.selectDropdown.value).toEqual([]);
    expect(component.showClearTempButton).toBeFalsy();
    expect(component.showSaveNewTempButton).toBeFalsy();
    expect(component.isClearSelection.emit).toHaveBeenCalledWith(component.isClear);
  });


  it('should call performAction method with update action', fakeAsync(() => {
    const filterLabConfigDataReturnValue: any = {
      departmentList: {id: '4ebf2f52-3936-4203-bf93-3f8be'},
      instrumentList: {id: '4ebf2f52-3936-4203-bf93-3f8be'},
      controlList: {id: '4ebf2f52-3936-4203-bf93-3f8be'},
      analyteList: {id: '4ebf2f52-3936-4203-bf93-3f8be'},
      isSelectionValid: true,
      canProceed: true
    };
    commonServiceSpy.openSelectionsDialog.and.returnValue(of(true));
    spyOn(component, 'getTranslation');
    spyOn(component, 'openGenericDialog');
    component.performAction(component.actionType.update).then(() => {
      expect(component.openGenericDialog).toHaveBeenCalled();
      expect(component.getTranslation).toHaveBeenCalled();
    });

    filterLabConfigDataReturnValue.isSelectionValid = false;
    component.performAction(component.actionType.update).then(() => {
      expect(component.openGenericDialog).toHaveBeenCalled();
      expect(component.getTranslation).toHaveBeenCalled();
    });
  }));

  it('should call performAction method with delete action', () => {
    spyOn(component, 'getTranslation');
    spyOn(component, 'openGenericDialog');
    component.performAction(component.actionType.delete);
    expect(component.getTranslation).toHaveBeenCalled();
    expect(component.openGenericDialog).toHaveBeenCalled();
  });

  it('should call deleteTemplate method', () => {
    spyOn(component, 'getTranslation');
    spyOn(component, 'openActionSuccessDialog');
    component.deleteTemplate();
    expect(component.getTranslation).toHaveBeenCalled();
    expect(component.openActionSuccessDialog).toHaveBeenCalled();
  });

  it('should call openActionSuccessDialog method', () => {
    spyOn(component, 'getTemplateList');
    spyOn(component, 'clearSelectionsAndDisableButtons');
    const titleMessage = component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.DELETETEMPLATE);
    const messageContent = [component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.DELETETEMPLATESUCCESSDIALOG)];
    component.openActionSuccessDialog(TypeOfDialog.SingleBlock, IconType.ContentDelete, titleMessage, messageContent);
    expect(component.getTemplateList).toHaveBeenCalled();
    expect(component.clearSelectionsAndDisableButtons).toHaveBeenCalled();
  });

  it('should call selectItems method', () => {
    spyOn(component.emitlabConfigData, 'emit');
    component.selectedOption = {
      accountId: 'ea750fa2-c89b-4ed5-805b-648ab9be5fce',
      id: 'd8e4f2e9-edc9-40d8-9671-decb2dfd17bc',
      templateName: 'template test23',
      labLocationId: '4ebf2f52-3936-4203-bf93-3f8befab64eb',
      templateBody: {
        filterCondition: {
          instrumentFilter: ['f016cb15-a9f0-4728-ac0a-adedaca161e5'],
          lotFilter: ['45e4b61a-d100-40c5-87b6-fdcdb71d18a5'],
          analyteFilter: [46],
          departmentFilter: ['30c103f8-e219-48d0-894e-2bb690649547'],
          filterBaseColumn: 1
        }
      }
    };
    component.selectItems();
    expect(component.emitlabConfigData.emit).toHaveBeenCalledWith(component.labConfigData);
  });

  it('should call validateTemplate method', () => {
    component.selectedOption = {
      accountId: 'ea750fa2-c89b-4ed5-805b-648ab9be5fce',
      id: 'd8e4f2e9-edc9-40d8-9671-decb2dfd17bc',
      templateName: 'template test23',
      labLocationId: '4ebf2f52-3936-4203-bf93-3f8befab64eb',
      templateBody: {
        filterCondition: {
          instrumentFilter: ['f016cb15-a9f0-4728-ac0a-adedaca161e5'],
          lotFilter: ['45e4b61a-d100-40c5-87b6-fdcdb71d18a5'],
          analyteFilter: [46],
          departmentFilter: ['30c103f8-e219-48d0-894e-2bb690649547'],
          filterBaseColumn: 1
        }
      }
    };
    const returnValue = component.validateTemplate();
    expect(returnValue).toEqual(TemplateValidation.AllMissing);
  });

  it('should call openGenericDialog method', () => {
    spyOn(component, 'checkForTempValidity');
    spyOn(component, 'deleteTemplate');
    spyOn(component, 'updateTemplateValue');
    spyOn(component, 'openActionSuccessDialog');
    spyOn(component, 'clearTemplateFromParent');
    spyOn(component, 'loadItems');
    spyOn(component, 'getTranslation');
    let titleMessage = component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.TEMPLATEMISSING);
      let messageContent = [component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.TEMPLATEMISSINGMESSAGE)];
      component.openGenericDialog(TypeOfDialog.SingleBlock, IconType.ContentUpdate, titleMessage,
        messageContent, component.getTranslation(TRANSLATIONS_EN.REPORTTEMPLATES.UPDATE),
        component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.CANCEL),
        StyleOfBtn.SolidButton, StyleOfBtn.OutlineButton, false, null, component.actionType.update, false);

    expect(component.updateTemplateValue).toHaveBeenCalled();

    titleMessage = component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.DELETETEMPLATE);
    messageContent = [component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.DELETETEMPLATECONFIRMATIONDIALOG)];
    component.openGenericDialog(TypeOfDialog.doubleBlock, IconType.ContentDelete, titleMessage,
      messageContent, component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.DELETETEMPLATE),
      component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.CANCEL),
      StyleOfBtn.ErrorSolidButton, StyleOfBtn.OutlineButton, false, component.templateRowSelected,
      component.actionType.delete, false, IconType.RedWarning, TypeOfMessage.Error);
    expect(component.deleteTemplate).toHaveBeenCalled();

    titleMessage = component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.RENAMETEMPLATE);
    messageContent = [component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.RENAMETEMPLATESUCCESSDIALOG)];
    component.openGenericDialog(TypeOfDialog.FormBlock, IconType.ContentCopy, titleMessage,
      messageContent, component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.TEMPLATESAVE),
      component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.CANCEL),
      StyleOfBtn.SolidButton, StyleOfBtn.OutlineButton, false, component.templateRowSelected, component.actionType.rename, false);
    expect(component.openActionSuccessDialog).toHaveBeenCalledWith(TypeOfDialog.SingleBlock,
      IconType.ContentEdit, titleMessage, messageContent, component.actionType.rename, null);

      const reportData: ITemplate = {
        labLocationId: component.locationId,
        templateName: ''
      };
      reportData.templateBody = {
        filterCondition: {
          instrumentFilter: [],
          lotFilter: [],
          analyteFilter: [],
          departmentFilter: [],
          filterBaseColumn: 0
        }
      };
      titleMessage = component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.TEMPLATESAVETITLEFOOTER);
      component.openGenericDialog(TypeOfDialog.FormBlock, IconType.ContentCopy, titleMessage, [],
        component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.TEMPLATESAVE),
        component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.CANCEL),
        StyleOfBtn.SolidButton, StyleOfBtn.OutlineButton, false, reportData, component.actionType.insert,
        false, IconType.YellowWarning, TypeOfMessage.Warning);

    expect(component.openActionSuccessDialog).toHaveBeenCalledWith(TypeOfDialog.SingleBlock,
      IconType.ContentCopy, titleMessage, messageContent, component.actionType.insert, undefined);

      titleMessage = component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.TEMPLATEUNABLE);
      messageContent = [component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.TEMPLATEUNABLEMESSAGEFIRST),
        component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.TEMPLATEUNABLEMESSAGESECOND)];
        component.openGenericDialog(TypeOfDialog.doubleBlock, IconType.Reload, titleMessage, messageContent,
          component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.CLOSE),
          component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.DELETETEMPLATE),
        StyleOfBtn.SolidButton, StyleOfBtn.OutlineButton, false, null, component.actionType.templateUnableToLoad, false,
          IconType.RedWarning, TypeOfMessage.Error);
    expect(component.clearTemplateFromParent).toHaveBeenCalled();

    titleMessage = component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.LOADINGTEMPLATE);
    messageContent = [component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.LOADINGTEMPLATECONFIRMATION),
      component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.LOADINGTEMPLATECONFIRMATIONSELECTIONCHANGE)];
      component.openGenericDialog(TypeOfDialog.doubleBlock, IconType.Reload, titleMessage, messageContent,
        component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.LOADINGTEMPLATE),
        component.getTranslation(TRANSLATIONS_EN.LABCONFIGSELECTION.CANCEL),
      StyleOfBtn.SolidButton, StyleOfBtn.OutlineButton, false, null, component.actionType.loadTemplate,
        false, IconType.YellowWarning, TypeOfMessage.Warning);

    expect(component.loadItems).toHaveBeenCalled();
  });

  it('should call saveNewTemplate method', async(() => {
    spyOn(component, 'openGenericDialog');
    spyOn(component.selectDropdown, 'close');
    spyOn(component, 'reportTypeCalculate');
    const filterLabConfigDataReturnValue: any = {
      departmentList: {id: '4ebf2f52-3936-4203-bf93-3f8be'},
      instrumentList: {id: '4ebf2f52-3936-4203-bf93-3f8be'},
      controlList: {id: 1102 },
      analyteList: {id: 26 },
      isSelectionValid: true,
      canProceed: true,
      directionIndex: 1
    };
    component.labConfigData.directionIndex = 1;
    commonServiceSpy.filterLabConfigData.and.returnValue(filterLabConfigDataReturnValue);
    const titleMessage = component.getTranslation('Save template as');
    const reportData: any = {
      labLocationId: component.locationId,
      templateName: '',
      templateBody: {
        filterCondition: {
          instrumentFilter: [],
          lotFilter: [],
          analyteFilter: [],
          departmentFilter: [],
          reportType: component.reportTypeCalculate(),
          filterBaseColumn: 1
        }
      }
    };
    fixture.detectChanges();

    component.saveNewTemplate().then(() => {
      expect(component.openGenericDialog).toHaveBeenCalled();
      expect(component.selectDropdown.close).toHaveBeenCalled();
    });
  }));

  it('should call menuOpened method', () => {
    const reportData: ITemplate = {
      labLocationId: component.locationId,
      templateName: ''
    };
    reportData.templateBody = {
      filterCondition: {
        instrumentFilter: [],
        lotFilter: [],
        analyteFilter: [],
        departmentFilter: [],
        filterBaseColumn: 0
      }
    };
    component.menuOpened(reportData);
    expect(component.templateRowSelected).toEqual(reportData);
  });

  it('should call templateOnSelection method when any template is selected and no item is selected', () => {
    const templateSelected: any = {};
    spyOn(component, 'checkForSelectedItems').and.returnValue(false);
    fixture.detectChanges();
    spyOn(component, 'checkForTempValidity');
    component.templateOnSelection(templateSelected);
    expect(component.checkForTempValidity).toHaveBeenCalledTimes(1);
    expect(component.showClearTempButton).toBeTruthy();
  });

  it('should call ngOnChanges method', () => {
    spyOn(component, 'checkForSelectedItems');
    spyOn(component, 'compareData');
    const changes: any = {
      labConfigData: { currentValue: {id: 1} }
    };
    component.ngOnChanges(changes);
    expect(component.checkForSelectedItems).toHaveBeenCalled();
    expect(component.compareData).toHaveBeenCalled();
  });
});
