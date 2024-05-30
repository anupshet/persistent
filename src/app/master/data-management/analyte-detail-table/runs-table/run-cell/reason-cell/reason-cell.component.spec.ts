import { ComponentFixture, TestBed, async   } from '@angular/core/testing';

import { ReasonCellComponent } from './reason-cell.component';

describe('ReasonCellComponent', () => {
  let component: ReasonCellComponent;
  let fixture: ComponentFixture<ReasonCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReasonCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasonCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
