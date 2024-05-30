import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { DecimalPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { ValueCellComponent } from './value-cell.component';
import { UnityNextNumericPipe } from '../../../../../../shared/date-time/pipes/unity-numeric.pipe';

describe('ValueCellComponent', () => {
  let component: ValueCellComponent;
  let fixture: ComponentFixture<ValueCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ValueCellComponent,
        UnityNextNumericPipe
      ],
      providers: [DecimalPipe,
        { provide: Store, useValue: {}},
        provideMockStore({ initialState: {}}),

      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
