import { ComponentFixture, TestBed, async   } from '@angular/core/testing';

import { ZscoreCellComponent } from './zscore-cell.component';
import { UnityNextNumericPipe } from '../../../../../../shared/date-time/pipes/unity-numeric.pipe';

describe('ZscoreCellComponent', () => {
  let component: ZscoreCellComponent;
  let fixture: ComponentFixture<ZscoreCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ZscoreCellComponent,
        UnityNextNumericPipe
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZscoreCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
