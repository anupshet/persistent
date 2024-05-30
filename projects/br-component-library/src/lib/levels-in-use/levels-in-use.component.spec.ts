import { ComponentFixture, TestBed, async   } from '@angular/core/testing';

import { BrLevelsInUseComponent } from './levels-in-use.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('BrLevelsInUseComponent', () => {
  let component: BrLevelsInUseComponent;
  let fixture: ComponentFixture<BrLevelsInUseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCheckboxModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      declarations: [BrLevelsInUseComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrLevelsInUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
