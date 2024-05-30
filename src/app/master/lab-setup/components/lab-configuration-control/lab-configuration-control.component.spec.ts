// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { of as observableOf } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BrSelectComponent, MaterialModule } from 'br-component-library';
import { CodelistApiService } from '../../../../shared/api/codelistApi.service';
import { DateTimeHelper } from '../../../../shared/date-time/date-time-helper';
import * as fromRoot from '../../state';
import { LabSetupHeaderComponent } from '../lab-setup-header/lab-setup-header.component';
import { LabConfigurationControlComponent } from './lab-configuration-control.component';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { HttpLoaderFactory } from '../../../../app.module';
import { NavigationService } from '../../../../shared/navigation/navigation.service';


describe('LabConfigurationControlComponent', () => {
  let component: LabConfigurationControlComponent;
  let fixture: ComponentFixture<LabConfigurationControlComponent>;
  const formBuilder: FormBuilder = new FormBuilder();

  const mockCodeListService = {
    getProductsByInstrumentId: () => {
      const manufacturerProduct = {
        'id': 11,
        'name': 'Diabetes',
        'manufacturerId': 2,
        'manufacturerName': 'Bio-Rad',
        'matrixId': 6,
        'matrixName': 'Whole Blood'
      };
      return observableOf([manufacturerProduct]);
    },
    getProductMasterLotsByProductId: () => {
      const Masterlots = [
        {
          'id': 203,
          'productId': 11,
          'productName': 'Diabetes',
          'lotNumber': '33950',
          'expirationDate': '2019-06-30T00:00:00'
        },
        {
          'id': 204,
          'productId': 11,
          'productName': 'Diabetes',
          'lotNumber': '33960',
          'expirationDate': '2019-11-30T00:00:00'
        },
        {
          'id': 205,
          'productId': 11,
          'productName': 'Diabetes',
          'lotNumber': '33970',
          'expirationDate': '2020-06-30T00:00:00'
        },
        {
          'id': 206,
          'productId': 11,
          'productName': 'Diabetes',
          'lotNumber': '33980',
          'expirationDate': '2021-03-31T00:00:00'
        },
        {
          'id': 207,
          'productId': 11,
          'productName': 'Diabetes',
          'lotNumber': '33990',
          'expirationDate': '2021-06-30T00:00:00'
        },
        {
          'id': 208,
          'productId': 11,
          'productName': 'Diabetes',
          'lotNumber': '34000',
          'expirationDate': '2021-10-31T00:00:00'
        }
      ];

      return observableOf(Masterlots);
    }
  };

  const mockDataTimeHelper = jasmine.createSpyObj(['isExpired']);
  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  const mockNavigationService = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        HttpClientModule,
        StoreModule.forRoot(fromRoot.reducers),
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
      ],
      declarations: [
        LabConfigurationControlComponent,
        LabSetupHeaderComponent,
        BrSelectComponent
      ],
      providers: [
        [
          { provide: CodelistApiService, useValue: mockCodeListService },
          { provide: FormBuilder, useValue: formBuilder },
          { provide: DateTimeHelper, useValue: mockDataTimeHelper },
          { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
          { provide: NavigationService, useValue: mockNavigationService },
          AppLoggerService,
          TranslateService,
          HttpClient
        ]
      ]
    })
      .compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(LabConfigurationControlComponent);
    component = fixture.componentInstance;
    component.labSetupControlsHeaderNode = 5;
    component.title = 'ADVIA Centaur XP';
    component.labConfigurationControls = [];
    const array: FormGroup[] = [];
    array.push(formBuilder.group({
      controlName: new FormControl(),
      lotNumber: new FormControl(),
      customName: new FormControl()
    })
    );

    component.controlsForm = array['controls'];
    component.ngOnInit();
    spyOn(mockCodeListService, 'getProductsByInstrumentId').and.returnValue(observableOf(null));
    const manufacturerProduct = {
      id: 1,
      name: 'Bio-Rad',
      manufacturerId: 1,
      manufacturerName: 'Bio-Rad',
    };
    return observableOf([manufacturerProduct]);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should verify on click of "Select another control" link adds another form control to add another control', () => {
    const initial: number = component.controlsGetter.length;
    component.addFormGroups(1);
    const updated = component.controlsGetter.length;
    fixture.detectChanges();
    expect(updated).toEqual(initial + 1);
  });

  it('Verify on click of "Cancel" button reset the form values and any dynamically added controls should reset as well', () => {
    component.controlsForm.markAsDirty();
    component.resetForm();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.controlsForm.pristine).toBeTruthy();
    });
  });

  it('Verify on selecting "Control name" from dropdown adds field "Lot Number" and "Custom Name"', () => {
    fixture.detectChanges();
    expect(<HTMLElement>fixture.debugElement.nativeElement.querySelector('.controlInfo')).toBeFalsy();
    const LotElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_controlName');
    const elementIndex = 0;
    const event = new Event('change');
    component.getGroupAtIndex(elementIndex).patchValue({ controlName: true });
    LotElement.dispatchEvent(event);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(<HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_controlName')).toBeTruthy();
    });
  });

});
