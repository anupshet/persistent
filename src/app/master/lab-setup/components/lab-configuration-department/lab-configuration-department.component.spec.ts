// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, fakeAsync, async   } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MaterialModule, BrSelect } from 'br-component-library';
import { LabConfigurationDepartmentComponent } from './lab-configuration-department.component';
import { User } from './../../../../contracts/models/user-management/user.model';
import { LabSetupHeaderComponent } from '../lab-setup-header/lab-setup-header.component';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { HttpLoaderFactory } from '../../../../app.module';
import { NavigationService } from '../../../../shared/navigation/navigation.service';

describe('LabConfigurationDepartmentComponent', () => {
  let component: LabConfigurationDepartmentComponent;
  let fixture: ComponentFixture<LabConfigurationDepartmentComponent>;
  const formBuilder: FormBuilder = new FormBuilder();
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
        HttpClientModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        BrSelect,
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
        LabConfigurationDepartmentComponent,
        LabSetupHeaderComponent
      ],
      providers: [
        [
          { provide: FormBuilder, useValue: formBuilder },
          { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
          { provide: NavigationService, useValue: mockNavigationService },
          AppLoggerService,
          TranslateService,
        ]
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabConfigurationDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should verify on click of "Select another department" link add another form control to add another department', () => {
    const initial: number = component.departmentsGetter.length;
    component.addFormControl();
    const updated = component.departmentsGetter.length;
    fixture.detectChanges();
    expect(updated).toEqual(initial + 1);
  });

  it('Verify on click of "Cancel" button reset the form values and any dynamically added departments should reset as well',
    fakeAsync(() => {
      component.departmentForm.markAsDirty();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        component.setInitForm();
        expect(component.departmentForm.pristine).toBeTruthy();
      });
    }));

  it('Verify the "Manager Name" is populated as dropdown selection', () => {
    fixture.detectChanges();
    const contactsNames: User[] | any[] = [{
      'displayName': 'Pratik T',
      'contactId': 'c3a68a6c-d4db-4062-a1c3-bc143c472532',
      'userOktaId': '00u4q0j4pbIKeDD0x2p7'
    },
    {
      'displayName': 'Kashinath Chormale',
      'contactId': '1f57e540-5e7e-46d3-ac4b-ce0f5cbbb50e',
      'userOktaId': '00u4ggezdgKUHd5zL2p7'
    },
    {
      'displayName': 'Jaideep Tomar',
      'contactId': 'cf3a83e2-8582-4f82-8b03-95078d36e2c9',
      'userOktaId': '00u4v84r45RL97SgD2p7'
    }
    ];
    component.contacts = contactsNames;
    component.getGroupAtIndex(0).patchValue({ departmentName: 'Chemistry' });
    fixture.detectChanges();
    const matOption = fixture.debugElement.query(By.css('#multipleData .mat-select'));
    const matOptionelement = matOption.nativeElement;
    matOptionelement.click();
    fixture.detectChanges();
    const matOptionElementList = fixture.debugElement.query(By.css('.ng-trigger-transformPanel .mat-option'));
    const optionSetElement = matOptionElementList.nativeElement;
    optionSetElement.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(contactsNames[0].displayName).toEqual(optionSetElement.innerText);
    });
  });

});
