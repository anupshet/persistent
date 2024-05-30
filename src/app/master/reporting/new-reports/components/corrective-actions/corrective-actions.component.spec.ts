// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { SimpleChanges } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CorrectiveActionsComponent } from './corrective-actions.component';
import { HttpLoaderFactory } from '../../../../../app.module';


describe('CorrectiveActionsComponent', () => {
  let component: CorrectiveActionsComponent;
  let fixture: ComponentFixture<CorrectiveActionsComponent>;
  const formBuilder: FormBuilder = new FormBuilder();
  const outLieredLots = [
    {
      'instrumentId': 'c2b0e593-fe5b-4115-ae24-5de7195ff23e',
      'instrumentName': 'D-10',
      'customName': 'test',
      'serialNumber': '',
      'controls': [
        {
          'controlName': 'Diabetes',
          'lots': [
            {
              'masterLotId': 2111,
              'lotNumber': '88785',
              'customName': ''
            }
          ]
        }
      ]
    },
    {
      'instrumentId': '4d90aa40-5df2-46b7-b266-07be960b62b6',
      'instrumentName': 'fgfdddfsdgdfg',
      'customName': '',
      'serialNumber': '',
      'controls': [
        {
          'controlName': 'Immunoassay Plus',
          'lots': [
            {
              'masterLotId': 1385,
              'lotNumber': '85280',
              'customName': ''
            },
            {
              'masterLotId': 1749,
              'lotNumber': '85310',
              'customName': ''
            }
          ]
        }
      ]
    },
    {
      'instrumentId': '419c1412-6314-46ed-8d99-2b443967a71d',
      'instrumentName': 'test instrument jd28',
      'customName': 'architect c900',
      'serialNumber': 'ss',
      'controls': [
        {
          'controlName': 'Immunoassay Plus',
          'lots': [
            {
              'masterLotId': 1385,
              'lotNumber': '85280',
              'customName': ''
            },
            {
              'masterLotId': 1749,
              'lotNumber': '85310',
              'customName': ''
            }
          ]
        }
      ]
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CorrectiveActionsComponent],
      providers: [
        TranslateService,
        { provide: FormBuilder, useValue: formBuilder }
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        HttpClientModule,
        HttpClientTestingModule,
        MatSelectModule, MatFormFieldModule, MatInputModule, BrowserAnimationsModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrectiveActionsComponent);
    component = fixture.componentInstance;
    component.outlieredLots = outLieredLots;
    component.setOutLieredLots();
    const formArray = [];
    const formGroup1 = component.createFormGroup();
    let selectedLots = [
      {
        'lotName': 'LOT 85820',
        'masterLotId': 1385,
        'isDisabled': false,
        'instrumentId': '419c1412-6314-46ed-8d99-2b443967a71d',
        'selected': true,
        'originIndex': 1
      }
    ];
    formGroup1.get('selectedOptions').setValue(selectedLots);
    formGroup1.get('lots').setValue(selectedLots);
    formArray.push(formGroup1);
    const formGroup2 = component.createFormGroup();
    selectedLots = [
      {
        'lotName': 'LOT 85310',
        'masterLotId': 1749,
        'isDisabled': false,
        'instrumentId': '419c1412-6314-46ed-8d99-2b443967a71d',
        'selected': true,
        'originIndex': 2
      }
    ];
    formGroup2.get('lotComment').setValue('All comments');
    component.selectAllCheckedIndex = 2;
    formGroup2.get('lots').setValue(selectedLots);
    formArray.push(formGroup2);
    component.correctiveActionForm = new FormGroup({
      correctiveFormsArray: formBuilder.array(formArray)
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clear form array when new notification data is loaded', () => {
    spyOn(component, 'setOutLieredLots');
    const simpleChanges: SimpleChanges = {
      outlieredLots: {
        previousValue: null,
        currentValue: outLieredLots,
        firstChange: null,
        isFirstChange: null
      }
    };
    component.ngOnChanges(simpleChanges);
    expect(component.correctiveFormsArray.length).toBe(0);
  });

  it('should get total number of lots', () => {
    expect(component.optionsLength).toBe(5);
  });

  it('should validate select all option when new form is added', fakeAsync(() => {
    spyOn(component, 'handleSelectAll');
    component.addForm();
    tick();
    expect(component.handleSelectAll).toHaveBeenCalled();
  }));

  it('should remove form from array', fakeAsync(() => {
    component.removeForm(0);
    tick();
    expect(component.correctiveFormsArray.length).toBe(1);
  }));

  it('should set selections to previous option when action is not apply', () => {
    const formArray = component.correctiveActionForm.controls['correctiveFormsArray'] as FormArray;
    component.handleCheckboxSelection(formArray.controls[0] as FormGroup);
    expect(component.correctiveFormsArray.at(0).value.selectedOptions.length).toBe(0);
  });

  it('should set selection parameters which is used to format display text', () => {
    const formArray = component.correctiveActionForm.controls['correctiveFormsArray'] as FormArray;
    const formGroup = formArray.controls[0] as FormGroup;
    const lotsData = formGroup.get('lotData').value;
    component.changeSelectedStatus(lotsData[1].controls[0].lots[0], lotsData[1].controls[0], lotsData[1], formGroup, true);
    expect(lotsData[1].selected).toBeTrue();
    expect(lotsData[1].controls[0].lastSelectedIndex).toBe(0);
  });

  it('should apply selections and validate select all option', () => {
    const formArray = component.correctiveActionForm.controls['correctiveFormsArray'] as FormArray;
    const formGroup = formArray.controls[1] as FormGroup;
    spyOn(component, 'handleSelectAll');
    component.onApply(1, formGroup);
    expect(component.handleSelectAll).toHaveBeenCalled();
  });

  it('should deselect select all option when other options are not selected', () => {
    const formArray = component.correctiveActionForm.controls['correctiveFormsArray'] as FormArray;
    const formGroup = formArray.controls[0] as FormGroup;
    const dropdown = component.getMatSelectReference(1);
    dropdown.options.map((option, index) => {
      if (index === 0) {
        option.select();
      }
    });
    const lotsData = formGroup.get('lotData').value;
    component.handleSelectAllCheckbox(1, formGroup, lotsData[1].controls[0].lots[0]);
    expect(dropdown.options.first.selected).toBe(false);
  });

  it('should select select all option when other options are selected', () => {
    const formArray = component.correctiveActionForm.controls['correctiveFormsArray'] as FormArray;
    const formGroup = formArray.controls[1] as FormGroup;
    const dropdown = component.getMatSelectReference(1);
    dropdown.options.map((option, index) => {
      if (index > 1) {
        option.select();
      }
    });
    const lotsData = formGroup.get('lotData').value;
    lotsData.forEach(instrument => {
      instrument.controls.forEach(control => {
        control.lots.forEach(lot => {
          formGroup.get('selectedOptions').value.push(lot);
        });
      });
    });
    component.handleSelectAllCheckbox(1, formGroup, lotsData[0].controls[0].lots[0]);
    expect(dropdown.options.first.selected).toBe(true);
  });

  it('should deselect all options when select all is not true', () => {
    const formArray = component.correctiveActionForm.controls['correctiveFormsArray'] as FormArray;
    const formGroup = formArray.controls[1] as FormGroup;
    const dropdown = component.getMatSelectReference(1);
    component.toggleAllSelection(1, formGroup);
    expect(dropdown.options.last.selected).toBeFalse();
  });

  it('should select all options when select all is true', () => {
    const formArray = component.correctiveActionForm.controls['correctiveFormsArray'] as FormArray;
    const formGroup = formArray.controls[1] as FormGroup;
    const dropdown = component.getMatSelectReference(1);
    dropdown.options.map((option, index) => {
      if (index === 0) {
        option.select();
      }
    });
    component.toggleAllSelection(1, formGroup);
    expect(dropdown.options.last.selected).toBeTrue();
  });
});
