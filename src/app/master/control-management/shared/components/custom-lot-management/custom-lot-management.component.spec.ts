// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CustomLotManagementComponent } from './custom-lot-management.component';
import { HttpLoaderFactory } from '../../../../../app.module';

describe('CustomLotManagementComponent', () => {
  let component: CustomLotManagementComponent;
  let fixture: ComponentFixture<CustomLotManagementComponent>;

  const testData = {
    "control": {
      "id": 1,
      "name": "test",
      "manufacturerId": "manufacturer-1",
      "manufacturerName": "test manufacturer",
      "matrixId": "matrix-01",
      "accountId": "acc-01",
      "lots": [
        {
          "id": "lot-01",
          "productId": "p-01",
          "productName": "test product",
          "lotNumber": "12345",
          "expirationDate": "30/09/23",
          "accountId": "acc-01",
          "levelInfo": [1, 2, 3, 4, 5]
        },
        {
          "id": "lot-02",
          "productId": "p-02",
          "productName": "test product",
          "lotNumber": "1234567",
          "expirationDate": "30/09/23",
          "accountId": "acc-01",
          "levelInfo": [1, 2, 3, 4]
        },
        {
          "id": "lot-03",
          "productId": "p-03",
          "productName": "test product 2",
          "lotNumber": "123",
          "expirationDate": "30/09/23",
          "accountId": "acc-01",
          "levelInfo": [1, 2, 3]
        },
      ],
      "anyLabLotTests": true
    },
    "instruments": ["inst-01", "inst-02", "inst-03"],
    "customName": "test custom name"
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomLotManagementComponent ],
      imports: [ReactiveFormsModule,
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
      providers: [TranslateService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomLotManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should should return error for a required lot number', () => {
    const control = component.masterLotDataForm.get('masterLotNumber');
    control.setValue('');
    control.updateValueAndValidity();
    expect(control.hasError('required')).toBeTruthy();
  });

  it('should should not return error for a non empty lot number', () => {
    const control = component.masterLotDataForm.get('masterLotNumber');
    const lotNumber = '1234';
    control.setValue(lotNumber);
    control.updateValueAndValidity();
    expect(control.hasError('required')).toBeFalsy();
  });

  it('should should return error for a required expiration date', () => {
    const control = component.masterLotDataForm.get('expirationDate');
    control.setValue('');
    control.updateValueAndValidity();
    expect(control.hasError('required')).toBeTruthy();
  });

  it('should should not return error for a non empty expiration date', () => {
    const control = component.masterLotDataForm.get('expirationDate');
    const expirationDate = '9/27/2023';
    control.setValue(expirationDate);
    control.updateValueAndValidity();
    expect(control.hasError('required')).toBeFalsy();
  });

  it('should validate alphanumeric input for masterLotNumber', () => {
    const control = component.masterLotDataForm.get('masterLotNumber');
    const lotNumber = '1234';
    control.setValue(lotNumber);
    control.updateValueAndValidity();
    expect(control.hasError('invalidInput')).toBeFalsy();
  });

  it('should validate alphanumeric input for masterLotNumber with numbers and characters', () => {
    const control = component.masterLotDataForm.get('masterLotNumber');
    let lotNumber = '1234 abc';
    control.setValue(lotNumber);
    control.updateValueAndValidity();
    expect(control.hasError('invalidInput')).toBeFalsy();

    lotNumber = 'abc 12345';
    control.setValue(lotNumber);
    control.updateValueAndValidity();
    expect(control.hasError('invalidInput')).toBeFalsy();
  });

  it('should not validate alphanumeric input for masterLotNumber with special characters', () => {
    const control = component.masterLotDataForm.get('masterLotNumber');
    let lotNumber = '1234@#$';
    control.setValue(lotNumber);
    control.updateValueAndValidity();
    expect(control.hasError('invalidInput')).toBeTruthy();

    lotNumber = '@we345';
    control.setValue(lotNumber);
    control.updateValueAndValidity();
    expect(control.hasError('invalidInput')).toBeTruthy();
  });

  it('should return maxlength error for masterLotNumber input', () => {
    const maxLength = 15;
    const control = component.masterLotDataForm.get('masterLotNumber');
    const lotNumber = '1234567890123345';
    control.setValue(lotNumber);
    control.updateValueAndValidity();
    expect(lotNumber.length).toBeGreaterThan(maxLength);
    expect(control.hasError('maxlength')).toBeTruthy();
  });

  it('should not return maxlength error for masterLotNumber input', () => {
    const maxLength = 15;
    const control = component.masterLotDataForm.get('masterLotNumber');
    const lotNumber = '1234567890';
    control.setValue(lotNumber);
    control.updateValueAndValidity();
    expect(lotNumber.length).toBeLessThan(maxLength)
    expect(control.hasError('maxlength')).toBeFalsy();
  });

  it('should return an error for existing masterLotNumber', () => {
    const existingLotNumber = '12345';
    const control = component.masterLotDataForm.get('masterLotNumber');
    control.setValue(existingLotNumber);
    const isLotNumberExists = testData.control.lots.some((item) => item?.lotNumber == existingLotNumber);
    expect(isLotNumberExists).toBeTruthy();
  });

  it('should not return an error for unique masterLotNumber', () => {
    const lotNumber = '111999';
    const control = component.masterLotDataForm.get('masterLotNumber');
    control.setValue(lotNumber);
    control.updateValueAndValidity();
    expect(control.hasError('lotNumberExists')).toBeFalsy();
  });

});
