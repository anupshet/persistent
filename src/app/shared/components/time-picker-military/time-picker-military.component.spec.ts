// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { TimePickerMilitaryComponent } from './time-picker-military.component';

describe('TimePickerComponent', () => {
  let component: TimePickerMilitaryComponent;
  let fixture: ComponentFixture<TimePickerMilitaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimePickerMilitaryComponent ],
      imports: [
        StoreModule.forRoot([])
      ],
      providers: [
        { provide: Store, useValue: [] },
        provideMockStore({})
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimePickerMilitaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
