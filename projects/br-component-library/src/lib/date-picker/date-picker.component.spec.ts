import { ComponentFixture, TestBed, async   } from '@angular/core/testing';

import { BrDatePickerComponent } from './date-picker.component';

describe('DatePickerComponent', () => {
  let component: BrDatePickerComponent;
  let fixture: ComponentFixture<BrDatePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrDatePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
