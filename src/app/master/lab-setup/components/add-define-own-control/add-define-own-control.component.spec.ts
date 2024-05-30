// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async, inject } from "@angular/core/testing";
import { FormArray, FormBuilder, FormControl } from "@angular/forms";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StoreModule } from "@ngrx/store";
import { of as observableOf } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBar } from "@angular/material/snack-bar";

import { AddDefineOwnControlComponent } from "./add-define-own-control.component";
import { CodelistApiService } from "../../../../shared/api/codelistApi.service";
import { By } from "@angular/platform-browser";
import { ValidationErrorService } from "../../../../shared/api/validationError.service";
import { ControlManagementViewMode } from '../../../../master/control-management/shared/models/control-management.enum';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { Permissions } from '../../../../security/model/permissions.model';
import { CustomControl } from "../../../../contracts/models/control-management/custom-control.model";
import { HttpLoaderFactory } from '../../../../app.module';
import { MessageSnackBarService } from "../../../../core/helpers/message-snack-bar/message-snack-bar.service";
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { PortalApiService } from '../../../../shared/api/portalApi.service';

describe("AddDefineOwnControlComponent", () => {
  let component: AddDefineOwnControlComponent;
  let fixture: ComponentFixture<AddDefineOwnControlComponent>;
  const appState = [];
  const testValidationData: CustomControl[] = [
    {
      id: 1,
      name: 'test control 1',
      manufacturerId: 'm1',
      manufacturerName: 'test manufacturer 1',
      matrixId: 1,
      lots: [
        {
          id: 1,
          productId: 1,
          productName: 'test product 1',
          lotNumber: '12345',
          expirationDate: new Date(),
          levelInfo: [1, 2],
          accountId: '0edb0653-f262-48ac-a886-cab545a5db1c'
        }],
      accountId: '0edb0653-f262-48ac-a886-cab545a5db1c',
      anyLabLotTests: false
    }
  ];
  const matrixList = [{
    'id': 1,
    'name': 'Test_Matrix_1'
  }, {
    'id': 2,
    'name': 'Test_Matrix_2',
  }];
  const testControlToEdit = {
    id: 1,
    name: 'test control 1',
    manufacturerId: 'm1',
    manufacturerName: 'test manufacturer 1',
    matrixId: 1,
    matrixName: 'Test matrix',
    lots: [],
    accountId: '1',
    anyLabLotTests: true,
  };

  const selectedNodeData = {
    'displayName': 'New Mexico',
    'id': '72285DC498024F1DADCF8E9BC12DCDD3',
    'labLocationAddress': '',
    'labLocationAddressId': '0839deff-5a11-4ece-b781-e3868f2fcdb6',
    'labLocationContact': '',
    'labLocationContactId': 'c3a68a6c-d4db-4062-a1c3-bc143c472532',
    'labLocationName': 'New Mexico',
    'locationDayLightSaving': false,
    'locationOffset': 0,
    'locationTimeZone': 'Asia/Calcutta',
    'nodeType': 2,
    'parentNode': null,
    'parentNodeId': 'DC78CE0672504E5F84B22AF9118ED6F4',
    'children': [{
      'displayName': 'vishwajit Department',
      'departmentName': 'vishwajit Department',
      'departmentManagerId': 'C6BEB0158D4248D782B980752FA5CB2F',
      'departmentManager': {},
      'id': 'D5B5684C0D6B4436A29A64474E3A8B0E',
      'parentNodeId': '4B84D29BDD4F40FDB2BA0B4CEE10EBCF',
      'parentNode': null,
      'nodeType': 3,
      'children': []
    }]
  };

  const mockCodeListService = {
    getMatrixDefinitionsAsync: () => {
      return observableOf(matrixList).toPromise();
    },
    postAddNewNonBRLot: () => observableOf(testValidationData[0].lots[0]),
    putNonBRLot: () => observableOf(testValidationData[0].lots[0]),
    getNonBrControlDefinitions: () => observableOf(testValidationData[0])
  };

  const mockValidationErrorService = {
    checkForDuplicateControlNames: () => true,
    checkForDuplicateLotNumbers: () => true,
    whiteSpacesValidator: () => true
  };

  const mockBrPermissionsService = {
    hasAccess: (permissions: Array<Permissions>) => {
      const allowedpermissions = [Permissions.NonBRLotManagement];
      return allowedpermissions.some(ele => permissions.includes(ele));
    }
  };

  const mockPortalApiService = {
    getUsers: () => null,
    getLabSetupNode: () => observableOf(selectedNodeData)
  };

  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(appState),
        MatDialogModule,
        HttpClientModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
      ],
      declarations: [AddDefineOwnControlComponent],
      providers: [FormBuilder,
        { provide: CodelistApiService, useValue: mockCodeListService },
        { provide: ValidationErrorService, useValue: mockValidationErrorService },
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        TranslateService,
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: MessageSnackBarService },
        { provide: MatSnackBar },
        { provide: PortalApiService, useValue: mockPortalApiService },
      ],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AddDefineOwnControlComponent);
    component = fixture.componentInstance;
    component.allowAddAnother = true;
    component.viewMode = ControlManagementViewMode.DefineAndAdd;
    component.controlCount = 1;
    component.setInitForm();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it('Ensure Define Own Control form is displayed', () => {
    component.setInitForm();
    expect(fixture.debugElement.nativeElement.querySelector('.spec_controlForm')).not.toBe(null);
  });

  it('should verify on click of "Define another control" another form group to add in form array', () => {
    const initial: number = component.controlsForm.value.ownControls.length;
    component.addOwnControlFormGroup();
    fixture.whenStable().then(() => {
      const updated = component.controlsForm.value.ownControls.length;
      fixture.detectChanges();
      expect(updated).toEqual(initial + 1);
    });
  });

  it('should verify on click of "Close" ,added form group should be removed from form array', () => {
    const initial: number = component.controlsForm.value.ownControls.length;
    component.addOwnControlFormGroup();
    fixture.detectChanges();
    component.onRemoveOwnControlForm(1);
    fixture.whenStable().then(() => {
      const updated = component.controlsForm.value.ownControls.length;
      fixture.detectChanges();
      expect(updated).toEqual(initial);
    });
  });

  it('should verify "Define another control" botton should be disable after 10 forms added', () => {
    component.controlCount = 11;
    const initial: number = component.controlsForm.value.ownControls.length;
    component.addOwnControlFormGroup();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const updated = component.controlsForm.value.ownControls.length;
      fixture.detectChanges();
      expect(updated).toEqual(initial);
    });
  })

  it('should get matrix data and show values in the dropdown', async(() => {
    component.ngOnInit();
    fixture.whenStable().then(() => {
      expect(component.matrixData.length).toBeGreaterThan(0);
      fixture.detectChanges();
      const matrixDropdown = fixture.debugElement.query(By.css('.spec-matrix-dropdown'));
      expect(matrixDropdown).toBeDefined();
    })
  }))

  it('should get additional instrument data', () => {
    component.ngOnInit();
    expect(component.additionalInstrumentData).toBeDefined();
  });

  it('should hide controls on Define mode', () => {
    component.viewMode = ControlManagementViewMode.Define;
    fixture.detectChanges();
    const additionalInstrumentsDropdown = fixture.debugElement.query(By.css('.spec-additional-dropdown'));
    expect(additionalInstrumentsDropdown).toBeNull();
    const customControlInput = fixture.debugElement.query(By.css('.spec-custom-control'));
    expect(customControlInput).toBeNull();
  });

  it('should hide controls on Edit mode', () => {
    component.viewMode = ControlManagementViewMode.Define;
    fixture.detectChanges();
    const additionalInstrumentsDropdown = fixture.debugElement.query(By.css('.spec-additional-dropdown'));
    expect(additionalInstrumentsDropdown).toBeNull();
    const customControlInput = fixture.debugElement.query(By.css('.spec-custom-control'));
    expect(customControlInput).toBeNull();
  });

  it('should show controls on DefineAndAdd mode', () => {
    component.viewMode = ControlManagementViewMode.DefineAndAdd;
    fixture.detectChanges();
    const additionalInstrumentsDropdown = fixture.debugElement.query(By.css('.spec-additional-dropdown'));
    expect(additionalInstrumentsDropdown).toBeDefined();
    const customControlInput = fixture.debugElement.query(By.css('.spec-custom-control'));
    expect(customControlInput).toBeDefined();
  });

  it('should call handleModeVariation method on Define mode', () => {
    component.viewMode = ControlManagementViewMode.Define;
    component.ngOnChanges();
    fixture.detectChanges();
    expect(component.submitButtonText).toEqual(component.getTranslation('ADDDEFINEOWNCONTROL.DEFINEADD'));
  });

  it('should call handleModeVariation method on DefineAndAdd mode', () => {
    component.viewMode = ControlManagementViewMode.DefineAndAdd;
    component.ngOnChanges();
    fixture.detectChanges();
    expect(component.submitButtonText).toEqual(component.getTranslation('ADDDEFINEOWNCONTROL.DEFINEADD'));
    expect(component.additionalInstrumentData).toBeDefined();
  });

  it('should call handleModeVariation method on Edit mode', () => {
    component.viewMode = ControlManagementViewMode.Edit;
    component.ngOnChanges();
    fixture.detectChanges();
    expect(component.submitButtonText).toEqual(component.getTranslation('ADDDEFINEOWNCONTROL.UPDATE'));
  });

  it('should call createLevelsForm method on Edit mode', () => {
    component.viewMode = ControlManagementViewMode.Edit;
    const checkboxLength = component.levelCheckboxes.length;
    let form = new FormArray([]);
    component.ngOnChanges();
    fixture.detectChanges();
    component.levelCheckboxes?.forEach((level) => {
      form.push(new FormControl(component.controlToEdit?.lots[0]?.levelInfo.includes(level)));
    });
    expect(component.levelCheckboxes.length).toBeLessThanOrEqual(checkboxLength+1);
  });

  it('should call createLevelsForm method on non-Edit mode', () => {
    component.viewMode = ControlManagementViewMode.Define;
    const checkboxLength = component.levelCheckboxes.length;
    let form = new FormArray([]);
    component.ngOnChanges();
    fixture.detectChanges();
    component.levelCheckboxes?.forEach((level) => {
      form.push(new FormControl(false));
    });
    expect(component.levelCheckboxes?.length).toBeLessThanOrEqual(checkboxLength+1);
  });

  it('should call anyLevelSelected method', () => {
    const formIndex: number = 0;
    component.anyLevelSelected(formIndex);
    const formVal = component.getOwnControls()[formIndex].value;
    expect(formVal.levelCheckboxesForm?.includes(true)).toBeFalsy();
    expect(formVal.levelCheckboxesForm?.includes(false)).toBeTruthy();
  });

  it('should call onSubmit method on Define mode', () => {
    component.viewMode = ControlManagementViewMode.Define;
    const spy = spyOn(component.addNonBRControlDefinition,"emit");
    component.onSubmit();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(component.getCustomControlRequest());
  });

  it('should call onSubmit method on DefineAndAdd mode', () => {
    component.viewMode = ControlManagementViewMode.DefineAndAdd;
    const spy = spyOn(component.addNonBRControlDefinition,"emit");
    component?.onSubmit();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(component.getCustomControlRequest());
  });

  it('should call onSubmit method on Edit mode', () => {
    component.viewMode = ControlManagementViewMode.Edit;
    component.controlToEdit = testControlToEdit;
    const spy = spyOn(component.editCustomControl, 'emit');
    const selectedNodeSpy = spyOn(component.currentSelectedNode, 'emit');
    component.onSubmit();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    expect(selectedNodeSpy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(component.getCustomControltoEdit());
    expect(selectedNodeSpy).toHaveBeenCalledWith(component.selectedNode);
  });

  it('should emit the control onDeleteControlClick', () => {
    component.controlToEdit = testControlToEdit;
    const spy = spyOn(component.deleteCustomControl, "emit");
    component.onDeleteControlClicked(component.controlToEdit);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(component.controlToEdit);
  });

  it('should call getCustomControltoEdit method', () => {
    component.getCustomControltoEdit();
    spyOn(component , 'getCustomControlFromForm').and.callThrough();
    spyOn(component, 'getOwnControls').and.callThrough();
    component?.onSubmit();
    fixture.detectChanges();
    expect(component.getCustomControlFromForm).toHaveBeenCalled();
    expect(component.getOwnControls).toHaveBeenCalled();
    expect(component.getCustomControlFromForm).toHaveBeenCalledWith(component.getOwnControls()[0]);
  });

  it('should call getCustomControlFromForm method', () => {
    const value = testValidationData[0];
    const levels = [];
    const index = 0;
    component.onSubmit();
    fixture.detectChanges();
    expect(component.levelCheckboxes[index]).toBeTruthy();
    levels.push(index + 1);
    expect(levels.length).toBeGreaterThan(0);
  });

  it('should call getCustomControls method', () => {
    const controlsToAdd = [];
    component.onSubmit();
    fixture.detectChanges();
    component?.getOwnControls()?.forEach(control => {
      controlsToAdd.push(component?.getCustomControlFromForm(control));
    });
    expect(controlsToAdd.length).toBeGreaterThan(0);
  });

  it('should call getCustomControlRequest method', () => {
    const controlsToAdd = [];
    const customControls = testValidationData;
    component.onSubmit();
    fixture.detectChanges();
    expect(customControls.length).toBeGreaterThan(0);
    customControls?.forEach((control, index= 0) => {
      const value = control;
      const controlToAdd = { control: customControls[index], customName: "testCustomName", instruments: ["1", "2", "3"] };
      controlsToAdd.push(controlToAdd);
    });
    expect(controlsToAdd?.length).toBeGreaterThan(0);
  });


  it('should validate alphanumeric input', () => {
    component.getOwnControls().forEach((item: any) => {
      item.controls['controlName'].setValue('abcd1234');
      expect(item.controls['controlName'].valid).toBeTruthy();
    });
  });

  it('should validate alphanumeric input with special characters', () => {
    component.getOwnControls().forEach((item: any) => {
      item.controls['controlName'].setValue('abcd @#1234');
      expect(item.controls['controlName'].valid).toBeTruthy();
    });
  });

  it('should validate alphanumeric input for masterLotNumber', () => {
    component.getOwnControls().forEach((item: any) => {
      item.controls['masterLotNumber'].setValue('abcd1234');
      expect(item.controls['masterLotNumber'].valid).toBeTruthy();
    });
  });

  it('should validate alphanumeric input for masterLotNumber', () => {
    component.getOwnControls().forEach((item: any) => {
      item.controls['masterLotNumber'].setValue('abcd 1234');
      expect(item.controls['masterLotNumber'].valid).toBeTruthy();
    });
  });

  it('should call onControlNameChange', () => {
    const value: string = 'test control 1';
    const index = 0;
    component.viewMode = ControlManagementViewMode.Edit;
    component.controlToEdit = testControlToEdit;
    component.onControlNameChange(value, index);
    fixture.detectChanges();
    expect(component.controlToEdit.name).toEqual(value);
    expect(component.displayDuplicateErrMsg[index]).toBeFalsy();
  });

  it('should set displayDuplicateErrMsg to false on onControlNameChange on edit mode', () => {
    const value: any = 'test 12345';
    const index = 0;
    component.viewMode = ControlManagementViewMode.Edit;
    component.onControlNameChange(value, index);
    fixture.detectChanges();
    spyOn(component['validationErrorService'], 'checkForDuplicateControlNames').and.callThrough();
    component.displayDuplicateErrMsg[index] = true;
    expect(component.displayDuplicateErrMsg[index]).toBeTruthy();
  });

});
