// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ConnectivitySlideGenListComponent } from './connectivity-slide-gen-list.component';
import { SlideGenSchedule } from '../../shared/models/lab-lot-test.model';
import { HttpLoaderFactory } from '../../../../app.module';

xdescribe('ConnectivitySlideGenListComponent', () => {
  let component: ConnectivitySlideGenListComponent;
  let fixture: ComponentFixture<ConnectivitySlideGenListComponent>;
  const appState = [];

  const resultSlideGenListArrayData: Array<SlideGenSchedule> = [
    {
      'labLotTestId': '32ff018a-4d5e-43a2-8e8c-95aafde53236',
      'reagentLotId': 2311,
      'startDate': new Date('2022-01-01T16:16:00.000Z'),
      'endDate': new Date('2022-01-01T21:20:00.000Z'),
    },
    {
      'labLotTestId': '32ff018a-4d5e-43a2-8e8c-95aafde53236',
      'reagentLotId': 2309,
      'startDate': new Date('2022-01-03T11:30:00.000Z'),
      'endDate': new Date('2022-01-03T15:15:00.000Z'),
    },
    {
      'labLotTestId': '32ff018a-4d5e-43a2-8e8c-95aafde53236',
      'reagentLotId': 2317,
      'startDate': new Date('2022-01-03T15:18:00.000Z'),
      'endDate': new Date('2022-01-03T17:18:00.000Z'),
    }
  ];

  const mockAvailableReagentLotMetadata = [
    {
      'id': 2299,
      'name': 'Slide Gen #06'
    },
    {
      'id': 2315,
      'name': 'Slide Gen #85'
    },
    {
      'id': 2313,
      'name': 'Slide Gen #84'
    },
    {
      'id': 2311,
      'name': 'Slide Gen #15'
    },
    {
      'id': 2309,
      'name': 'Slide Gen #13'
    },
    {
      'id': 2307,
      'name': 'Slide Gen #12'
    },
    {
      'id': 2305,
      'name': 'Slide Gen #11'
    },
    {
      'id': 2303,
      'name': 'Slide Gen #10'
    },
    {
      'id': 2317,
      'name': 'Slide Gen #86'
    },
    {
      'id': 2301,
      'name': 'Slide Gen #08'
    },
    {
      'id': 2297,
      'name': 'Slide Gen #05'
    },
    {
      'id': 601,
      'name': 'Slide Gen #35'
    },
    {
      'id': 602,
      'name': 'Slide Gen #36'
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        BrowserModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        FormsModule,
        StoreModule.forRoot(appState),
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
      providers: [
        TranslateService,
      ],
      declarations: [ConnectivitySlideGenListComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectivitySlideGenListComponent);
    component = fixture.componentInstance;
    component.initializeForm();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check form is loaded and initialize with default validation and values lastrunreagenlotId is available', async () => {
    component.lastRunReagentLotId = 2297;
    component.availableReagentLotMetadata = mockAvailableReagentLotMetadata;
    const lastRunReagentLotIdIndex = component.availableReagentLotMetadata.findIndex(slideEle =>
      slideEle.id === component.lastRunReagentLotId);
    const deafultReagentId = lastRunReagentLotIdIndex !== -1 ? component.lastRunReagentLotId : null;
    fixture.whenStable().then(() => {
      component.initializeForm();
      fixture.detectChanges();
      expect(deafultReagentId).not.toBeNull();
      expect(component.slideGenForm.valid).toBeTruthy();
    });
  });

  it('should check form is loaded and initialize with default validation and values, lastrunreagenlotId is not available', async () => {
    component.lastRunReagentLotId = 1125;
    component.availableReagentLotMetadata = mockAvailableReagentLotMetadata;
    const lastRunReagentLotIdIndex = component.availableReagentLotMetadata.findIndex(slideEle =>
      slideEle.id === component.lastRunReagentLotId);
    expect(lastRunReagentLotIdIndex).toEqual(-1);
    const deafultReagentId = lastRunReagentLotIdIndex !== -1 ? component.lastRunReagentLotId : null;
    fixture.whenStable().then(() => {
      component.initializeForm();
      fixture.detectChanges();
      expect(deafultReagentId).toBeNull();
      expect(component.slideGenForm.valid).toBeFalsy();
    });
  });

  it('should set start date to startDate property of form', () => {
    const inputDate = '01/01/2021';
    const formArr = component.slideGenForm.get('slideGenList') as FormArray;
    fixture.detectChanges();
    component.startDateChange(inputDate, 0);
    fixture.detectChanges();
    expect(formArr.value[0].startDate).toEqual(new Date(inputDate));
  });

  it('should set end date to endDate property of form', () => {
    const inputDate = '02/01/2021';
    const formArr = component.slideGenForm.get('slideGenList') as FormArray;
    fixture.detectChanges();
    component.endDateChange(inputDate, 0);
    fixture.detectChanges();
    expect(formArr.value[0].endDate).toEqual(new Date(inputDate));
  });

  it('should combine selected start date and time', () => {
    const date: Date = new Date('2021-12-2');
    const timeString = '15:46';
    const targetDate: Date = new Date(2021, 11, 2, 15, 46, 0, 0);
    const formArr = component.slideGenForm.get('slideGenList') as FormArray;
    fixture.detectChanges();
    component.combineStartDateAndTimeAndUpdate(date, timeString, 0);
    fixture.detectChanges();
    expect(formArr.value[0].startDate.toDateString()).toEqual(targetDate.toDateString());
  });

  it('should combine selected end date and time', () => {
    const endDate: Date = new Date('2021-12-2');
    const endTimeString = '15:47';
    const targetEndDate: Date = new Date(2021, 11, 2, 15, 47, 0, 0);
    const formArr = component.slideGenForm.get('slideGenList') as FormArray;
    fixture.detectChanges();
    component.combineEndDateAndTimeAndUpdate(endDate, endTimeString, 0);
    fixture.detectChanges();
    expect(formArr.value[0].endDate.toDateString()).toEqual(targetEndDate.toDateString());
  });

  xit('should set start Time to startTime property of form', () => {
    component.availableReagentLotMetadata = mockAvailableReagentLotMetadata;
    component.initializeForm();
    fixture.detectChanges();
    const startTimeElement = fixture.debugElement.nativeElement.querySelector('.spec-startTime');
    startTimeElement.value = '15:00';
    fixture.detectChanges();
    const SpyOn = spyOn(component, 'startTimeChange').and.callThrough();
    const event = new Event('change');
    startTimeElement.dispatchEvent(event);
    fixture.detectChanges();
    expect(SpyOn).toHaveBeenCalled();
  });

  xit('should set end Time to startTime property of form', () => {
    component.availableReagentLotMetadata = mockAvailableReagentLotMetadata;
    component.initializeForm();
    fixture.detectChanges();
    const endTimeElement = fixture.debugElement.nativeElement.querySelector('.spec-endTime');
    endTimeElement.value = '20:00';
    fixture.detectChanges();
    const SpyOn = spyOn(component, 'endTimeChange').and.callThrough();
    const event = new Event('change');
    endTimeElement.dispatchEvent(event);
    fixture.detectChanges();
    expect(SpyOn).toHaveBeenCalled();
  });

  xit('check if the lastrunreagenlotId is available , if not available then the form should be invalid until changes some form fields and validators should be present', async () => {
    const elementIndex = 0;
    component.lastRunReagentLotId = 1125;
    component.availableReagentLotMetadata = mockAvailableReagentLotMetadata;
    const lastRunReagentLotIdIndex = component.availableReagentLotMetadata.findIndex(slideEle =>
      slideEle.id === component.lastRunReagentLotId);
    expect(lastRunReagentLotIdIndex).toEqual(-1);
    const deafultReagentId = lastRunReagentLotIdIndex !== -1 ? component.lastRunReagentLotId : null;
    component.initializeForm();
    fixture.detectChanges();
    expect(deafultReagentId).toBeNull();
    expect(component.slideGenForm.valid).toBeFalsy();
    expect(component.slideGenForm.dirty).toBeFalsy();
    // changes the form and we check for set validators also
    const formArr = component.slideGenForm.get('slideGenList') as FormArray;
    const reagentLotId = formArr.at(elementIndex).get('reagentLotId');
    expect(reagentLotId.valid).toBeFalsy();
    expect(reagentLotId.hasError('required')).toBeTruthy();
    reagentLotId.setValue(2297);
    expect(reagentLotId.hasError('required')).toBeFalsy();
    const startDate = formArr.at(elementIndex).get('startDate');
    expect(startDate.valid).toBeFalsy();
    expect(startDate.hasError('required')).toBeTruthy();
    startDate.setValue('2022-01-01T16:16:00.000Z');
    expect(startDate.hasError('required')).toBeFalsy();
    const startTime = formArr.at(elementIndex).get('startTime');
    expect(startTime.valid).toBeFalsy();
    expect(startTime.hasError('required')).toBeTruthy();
    startTime.setValue('21:46');
    const startTimeElement = fixture.debugElement.nativeElement.querySelectorAll('.spec-startTime');
    startTimeElement[elementIndex].value = '21:46';
    expect(startTime.hasError('required')).toBeFalsy();
    const endDate = formArr.at(elementIndex).get('endDate');
    expect(endDate.valid).toBeFalsy();
    expect(endDate.hasError('required')).toBeTruthy();
    endDate.setValue('2022-01-01T21:20:00.000Z');
    expect(endDate.hasError('required')).toBeFalsy();
    const endTime = formArr.at(elementIndex).get('endTime');
    expect(endTime.valid).toBeFalsy();
    expect(endTime.hasError('required')).toBeTruthy();
    endTime.setValue('02:50');
    const endTimeElement = fixture.debugElement.nativeElement.querySelectorAll('.spec-endTime');
    endTimeElement[elementIndex].value = '02:50';
    expect(endTime.hasError('required')).toBeFalsy();
    expect(component.firstRowEdited).toBeFalsy();
    expect(component.slideGenForm.dirty).toBeFalsy();
    expect(component.slideGenForm.valid).toBeTruthy();
  });

  xit('test a form for input elements count and select element counts after form is loaded', async () => {
    component.availableReagentLotMetadata = mockAvailableReagentLotMetadata;
    component.lastRunReagentLotId = 2297;
    component.initializeForm();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.slideGenForm.valid).toBeTruthy();
      const slideGenForm = fixture.debugElement.nativeElement.querySelector('#slideGenForm');
      expect(slideGenForm).toBeTruthy();
      fixture.detectChanges();
      const inputElements = slideGenForm.querySelectorAll('input');
      const selectElements = slideGenForm.querySelectorAll('mat-select');
      expect(inputElements.length).toEqual(4);
      expect(selectElements.length).toEqual(1);
    });
  });

  xit('should check if the slidegenList form displays Available ReagentLot dropdowns', async () => {
    component.availableReagentLotMetadata = mockAvailableReagentLotMetadata;
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.slideGenForm.valid).toBeFalsy();
      const slideGenForm = fixture.debugElement.nativeElement.querySelector('#slideGenForm');
      expect(slideGenForm).toBeTruthy();
      const slidegenDropdownElement = fixture.debugElement.nativeElement.querySelector('#spec_slideGens');
      expect(slidegenDropdownElement).not.toBe(null);
      expect(slidegenDropdownElement.children.length > 0).toBeTruthy();
    });
  });

  xit('formarray check add button is disabled when form is invalid', () => {
    const elementIndex = 0;
    component.lastRunReagentLotId = 2297;
    component.availableReagentLotMetadata = mockAvailableReagentLotMetadata;
    const lastRunReagentLotIdIndex = component.availableReagentLotMetadata.findIndex(slideEle =>
      slideEle.id === component.lastRunReagentLotId);
    const deafultReagentId = lastRunReagentLotIdIndex !== -1 ? component.lastRunReagentLotId : null;
    component.initializeForm();
    fixture.detectChanges();
    const formArr = component.slideGenForm.get('slideGenList') as FormArray;
    formArr.at(elementIndex).get('reagentLotId').setValue(deafultReagentId);
    formArr.at(elementIndex).get('startDate').setValue('');
    formArr.at(elementIndex).get('startTime').setValue('');
    formArr.at(elementIndex).get('endDate').setValue('');
    formArr.at(elementIndex).get('endTime').setValue('');
    fixture.detectChanges();
    expect(component.slideGenForm.valid).toBeTruthy();
    const addButton = fixture.debugElement.nativeElement.querySelector('.spec-add');
    expect(addButton.disabled).toBeTruthy();
  });

  it('check for confirm button is disabled if form is invalid', () => {
    const elementIndex = 0;
    component.lastRunReagentLotId = 1125;
    component.availableReagentLotMetadata = mockAvailableReagentLotMetadata;
    const lastRunReagentLotIdIndex = component.availableReagentLotMetadata.findIndex(slideEle =>
      slideEle.id === component.lastRunReagentLotId);
    expect(lastRunReagentLotIdIndex).toEqual(-1);
    const deafultReagentId = lastRunReagentLotIdIndex !== -1 ? component.lastRunReagentLotId : null;
    fixture.whenStable().then(() => {
      component.initializeForm();
      fixture.detectChanges();
      const formArr = component.slideGenForm.get('slideGenList') as FormArray;
      formArr.at(elementIndex).get('reagentLotId').setValue(deafultReagentId);
      formArr.at(elementIndex).get('startDate').setValue('');
      formArr.at(elementIndex).get('startTime').setValue('');
      formArr.at(elementIndex).get('endDate').setValue('');
      formArr.at(elementIndex).get('endTime').setValue('');
      fixture.detectChanges();
      expect(component.slideGenForm.valid).toBeFalsy();
      const confirmButton = fixture.debugElement.nativeElement.querySelector('.spec-confirm');
      expect(confirmButton.disabled).toBeTruthy();
    });
  });

  it('delete button must not be rendered for first value of formarray', () => {
    const elementIndex = 0;
    component.lastRunReagentLotId = 1125;
    component.availableReagentLotMetadata = mockAvailableReagentLotMetadata;
    const lastRunReagentLotIdIndex = component.availableReagentLotMetadata.findIndex(slideEle =>
      slideEle.id === component.lastRunReagentLotId);
    expect(lastRunReagentLotIdIndex).toEqual(-1);
    const deafultReagentId = lastRunReagentLotIdIndex !== -1 ? component.lastRunReagentLotId : null;
    fixture.whenStable().then(() => {
      component.initializeForm();
      fixture.detectChanges();
      const formArr = component.slideGenForm.get('slideGenList') as FormArray;
      formArr.at(elementIndex).get('reagentLotId').setValue(deafultReagentId);
      formArr.at(elementIndex).get('startDate').setValue('');
      formArr.at(elementIndex).get('startTime').setValue('');
      formArr.at(elementIndex).get('endDate').setValue('');
      formArr.at(elementIndex).get('endTime').setValue('');
      fixture.detectChanges();
      expect(component.slideGenForm.valid).toBeFalsy();
      const deleteButton = fixture.debugElement.nativeElement.querySelector('.spec-remove');
      component.addInputControl(0);
      expect(deleteButton).not.toBeNull();
    });
  });

  it('formarray should be able to add a formcontrol with formvalues', () => {
    component.initializeForm();
    fixture.detectChanges();
    const initialLength: number = component.slideGenListArray.length;
    component.addInputControl(0);
    const len = component.slideGenListArray.length;
    fixture.detectChanges();
    expect(len).toEqual(initialLength + 1);
  });

  it('formarray should be able to delete a formcontrol with formvalues', () => {
    component.initializeForm();
    fixture.detectChanges();
    // first add the row and then delete the row
    const initialLen = component.slideGenListArray.length;
    expect(initialLen).toEqual(1);
    component.addInputControl(0); // added one row
    component.addInputControl(1); // added one row
    component.addInputControl(2); // added one row
    component.addInputControl(3); // added one row
    fixture.detectChanges();
    const len1 = component.slideGenListArray.length;
    expect(len1).toEqual(5);
    component.removeInputControl(2); // removed one row
    fixture.detectChanges();
    const len2 = component.slideGenListArray.length;
    expect(len2).toEqual(4);
  });

  xit('cancel button reset the form and closed the expanded panel', () => {
    const cancelButton = fixture.debugElement.nativeElement.querySelector('.spec-cancel');
    expect(cancelButton.textContent).toEqual('cancel');
    cancelButton.click();
    const spy = spyOn(component.closeUpdate, 'emit');
    component.resetForm();
    expect(spy).toHaveBeenCalled();
  });

  xit('check date validation function ', () => {
    const firstRow = 0;
    component.lastRunReagentLotId = 2297;
    component.availableReagentLotMetadata = mockAvailableReagentLotMetadata;
    const lastRunReagentLotIdIndex = component.availableReagentLotMetadata.findIndex(slideEle =>
      slideEle.id === component.lastRunReagentLotId);
    const deafultReagentId = lastRunReagentLotIdIndex !== -1 ? component.lastRunReagentLotId : null;

    component.initializeForm();
    fixture.detectChanges();
    expect(component.slideGenListArray.length).toEqual(1);
    expect(component.slideGenForm.dirty).toBeFalsy();
    expect(component.slideGenForm.valid).toBeTruthy();
    const formArr = component.slideGenForm.get('slideGenList') as FormArray;
    const spy = spyOn(component, 'checkDateValidation').and.callThrough();
    // add values to first row
    formArr.at(firstRow).get('reagentLotId').setValue(deafultReagentId);
    component.startDateChange('2022-01-01T16:16:00.000Z', firstRow);
    const startTimeElement = fixture.debugElement.nativeElement.querySelector('.spec-startTime');
    startTimeElement.value = '21:46';
    component.startTimeChange('21:46', firstRow);
    component.endDateChange('2022-01-01T21:20:00.000Z', firstRow);
    const endTimeElement = fixture.debugElement.nativeElement.querySelector('.spec-endTime');
    endTimeElement.value = '02:50';
    component.endTimeChange('02:50', firstRow);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith(firstRow);
    expect(component.slideGenForm.valid).toBeTruthy();
  });

  it('formarray insert a new row on click of add button & delete a row on click of delete button', () => {
    const firstRow = 0;
    const secondRow = 1;
    const thirdRow = 2;
    component.lastRunReagentLotId = 2297;
    component.availableReagentLotMetadata = mockAvailableReagentLotMetadata;
    const lastRunReagentLotIdIndex = component.availableReagentLotMetadata.findIndex(slideEle =>
      slideEle.id === component.lastRunReagentLotId);
    const deafultReagentId = lastRunReagentLotIdIndex !== -1 ? component.lastRunReagentLotId : null;

    fixture.whenStable().then(() => {
      component.initializeForm();
      fixture.detectChanges();
      expect(component.slideGenListArray.length).toEqual(1);
      expect(component.slideGenForm.dirty).toBeFalsy();
      expect(component.slideGenForm.valid).toBeTruthy();
      const formArr = component.slideGenForm.get('slideGenList') as FormArray;
      // add values to first row
      formArr.at(firstRow).get('reagentLotId').setValue(deafultReagentId);
      formArr.at(firstRow).get('startDate').setValue(new Date('2022-01-01T16:16:00.000Z'));
      formArr.at(firstRow).get('startTime').setValue('21:46');
      formArr.at(firstRow).get('endDate').setValue(new Date('2022-01-01T21:20:00.000Z'));
      formArr.at(firstRow).get('endTime').setValue('02:50');
      component.firstRowEdited = true;
      fixture.detectChanges();
      expect(component.slideGenForm.valid).toBeTruthy();
      const addButton = fixture.debugElement.nativeElement.querySelector('.spec-add');
      addButton.click();
      fixture.detectChanges();
      expect(component.addInputControl(firstRow)).toHaveBeenCalled();
      expect(component.slideGenListArray.length).toEqual(2);
      expect(component.slideGenForm.dirty).toBeTruthy();
      expect(component.slideGenForm.valid).toBeFalsy();
      const deleteButton = fixture.debugElement.nativeElement.querySelector('.spec-remove');
      expect(deleteButton).not.toBeNull();
      // add values to second row
      formArr.at(secondRow).get('reagentLotId').setValue(2297);
      formArr.at(secondRow).get('startDate').setValue(new Date('2022-01-03T11:30:00.000Z'));
      formArr.at(secondRow).get('startTime').setValue('17:00');
      formArr.at(secondRow).get('endDate').setValue(new Date('2022-01-03T15:15:00.000Z'));
      formArr.at(secondRow).get('endTime').setValue('20:45');
      fixture.detectChanges();
      expect(component.slideGenForm.valid).toBeTruthy();
      fixture.detectChanges();
      expect(component.addInputControl(secondRow)).toHaveBeenCalled();
      expect(component.slideGenListArray.length).toEqual(3);
      expect(component.slideGenForm.dirty).toBeTruthy();
      expect(component.slideGenForm.valid).toBeFalsy();
      expect(deleteButton).not.toBeNull();
      fixture.detectChanges();
      expect(component.removeInputControl(thirdRow)).toHaveBeenCalled();
      expect(component.slideGenListArray.length).toEqual(2);
    });
  });

  //AJT TODO
 xit('check for submit click we get the desired output array of slidegens list', () => {
    const firstRow = 0;
    const secondRow = 1;
    const thirdRow = 2;
    component.lastRunReagentLotId = 2311;
    component.availableReagentLotMetadata = mockAvailableReagentLotMetadata;
    const lastRunReagentLotIdIndex = component.availableReagentLotMetadata.findIndex(slideEle =>
      slideEle.id === component.lastRunReagentLotId);
    const deafultReagentId = lastRunReagentLotIdIndex !== -1 ? component.lastRunReagentLotId : null;

    component.initializeForm();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.slideGenListArray.length).toEqual(1);
      expect(component.slideGenForm.dirty).toBeFalsy();
      expect(component.slideGenForm.valid).toBeTruthy();
      const formArr = component.slideGenForm.get('slideGenList') as FormArray;
      // add values to first row
      formArr.at(firstRow).get('reagentLotId').setValue(deafultReagentId);
      formArr.at(firstRow).get('startDate').setValue(new Date('2022-01-01T16:16:00.000Z'));
      formArr.at(firstRow).get('startTime').setValue('21:46');
      formArr.at(firstRow).get('endDate').setValue(new Date('2022-01-01T21:20:00.000Z'));
      formArr.at(firstRow).get('endTime').setValue('02:50');
      component.firstRowEdited = true;
      fixture.detectChanges();
      expect(component.slideGenForm.valid).toBeTruthy();
      const addButton = fixture.debugElement.nativeElement.querySelector('.spec-add');
      addButton.click();
      fixture.detectChanges();
      expect(component.slideGenListArray.length).toEqual(2);
      expect(component.slideGenForm.dirty).toBeFalsy();
      expect(component.slideGenForm.valid).toBeFalsy();
      const deleteButton = fixture.debugElement.nativeElement.querySelector('.spec-remove');
      expect(deleteButton).not.toBeNull();
      // add values to second row
      formArr.at(secondRow).get('reagentLotId').setValue(2309);
      formArr.at(secondRow).get('startDate').setValue(new Date('2022-01-03T11:30:00.000Z'));
      formArr.at(secondRow).get('startTime').setValue('17:00');
      formArr.at(secondRow).get('endDate').setValue(new Date('2022-01-03T15:15:00.000Z'));
      formArr.at(secondRow).get('endTime').setValue('20:45');
      fixture.detectChanges();
      expect(component.slideGenForm.valid).toBeTruthy();
      const addButton1 = fixture.debugElement.nativeElement.querySelector('.spec-add');
      addButton1.click();
      fixture.detectChanges();
      expect(component.slideGenListArray.length).toEqual(3);
      expect(component.slideGenForm.dirty).toBeFalsy();
      expect(component.slideGenForm.valid).toBeFalsy();
      formArr.at(thirdRow).get('reagentLotId').setValue(2317);
      formArr.at(thirdRow).get('startDate').setValue(new Date('2022-01-03T15:18:00.000Z'));
      formArr.at(thirdRow).get('startTime').setValue('20:48');
      formArr.at(thirdRow).get('endDate').setValue(new Date('2022-01-03T17:18:00.000Z'));
      formArr.at(thirdRow).get('endTime').setValue('22:48');
      fixture.detectChanges();
      expect(component.slideGenForm.dirty).toBeFalsy();
      expect(component.slideGenForm.valid).toBeTruthy();
      const slideGenScheduleList: Array<SlideGenSchedule> = formArr.value.map(slidegens => {
        return slidegens = {
          labLotTestId: '32ff018a-4d5e-43a2-8e8c-95aafde53236',
          reagentLotId: slidegens.reagentLotId,
          startDate: slidegens.startDate,
          endDate: slidegens.endDate
        };
      });
      expect(slideGenScheduleList).toEqual(resultSlideGenListArrayData);
      // confirm button click
      const confirmButton = fixture.debugElement.nativeElement.querySelector('.spec-confirm');
      expect(confirmButton.disabled).toBeFalsy();
      expect(confirmButton.textContent).toEqual('confirm');
      const spy = spyOn(component, 'submitSlideGenList').and.callThrough();
      confirmButton.click();
      fixture.detectChanges();
      component.submitSlideGenList();
      expect(spy).toHaveBeenCalled();
      fixture.detectChanges();
      expect(component.slideGenForm.valid).toBeFalsy();
    });
  });
});
