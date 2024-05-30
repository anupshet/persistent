import { ComponentFixture, TestBed, async   } from '@angular/core/testing';

import { BrTimePickerComponent } from './time-picker.component';

describe('TimePickerComponent', () => {
  let component: BrTimePickerComponent;
  let fixture: ComponentFixture<BrTimePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrTimePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
