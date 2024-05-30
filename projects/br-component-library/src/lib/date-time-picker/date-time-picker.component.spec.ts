import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material-module';
import { FormsModule } from '@angular/forms';
import {  ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { BrDateTimePickerComponent } from './date-time-picker.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocaleConverter } from '../shared/locale/locale-converter.service';
import { BrCore } from '../shared';

describe('DateTimePickerComponent', () => {

  let fixture: ComponentFixture<BrDateTimePickerComponent>;
  let component: BrDateTimePickerComponent;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [
        BrDateTimePickerComponent
      ],
      imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        BrowserAnimationsModule,
        BrCore
      ],
      providers: [
        {
           provide: LocaleConverter,
           useClass: LocaleConverter
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BrDateTimePickerComponent);
    component = fixture.componentInstance;
    component.elementName = 'test';
    component.timeZone = 'America/New_York';
    fixture.detectChanges();
  });

  xit('should initilize the component', () => {
    expect(fixture).toBeTruthy();
    expect(component).toBeTruthy();
  });

  xit('OnInit should have dateTime & SelectedTime value', () => {
    expect(component.selectedDateTime).toBeTruthy();
    expect(component.selectedTime).toBeTruthy();
  });

  xit('Template should have default time values', () => {
    const timeNode = fixture.debugElement.queryAll(By.css('#testTime'));
    const el = timeNode[0].nativeElement;
    expect(el.value).toEqual(component.selectedTime);
  });

  xit('Template should have default date values', () => {
    const dateNode = fixture.debugElement.queryAll(By.css('#testDate'));
    const el = dateNode[0].nativeElement;
    expect(el.value).toBeTruthy();
  });

});
