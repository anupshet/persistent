import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';

import { PanelsComponent } from './panels.component';

describe('PanelsComponent', () => {
  let component: PanelsComponent;
  let fixture: ComponentFixture<PanelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PanelsComponent],
      imports: [
        StoreModule.forRoot([])
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
