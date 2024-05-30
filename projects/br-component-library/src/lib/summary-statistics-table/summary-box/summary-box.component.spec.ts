import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MaterialModule } from '../../material-module';
import { Autofixture } from 'ts-autofixture/dist/src';

import { BrSummaryBoxComponent } from './summary-box.component';
import { TransformValuePipe } from '../../shared/pipes/transform-value.pipe';
import { MatCell } from '@angular/material/table';

describe('SummaryBoxComponent', () => {
  let component: BrSummaryBoxComponent;
  let fixture: ComponentFixture<BrSummaryBoxComponent>;
  const autofixture = new Autofixture();
  const labMonthLevelDefault = {
    controlLevel: 0,
    month: {
      cv: 0,
      mean: 0,
      numPoints: 0,
      sd: 0
    },
    cumul: {
      cv: 0,
      mean: 0,
      numPoints: 0,
      sd: 0
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TransformValuePipe,
        BrSummaryBoxComponent
      ],
      imports: [
        CommonModule,
        MaterialModule
       ],
       providers: [
           { provide: DecimalPipe, useClass: DecimalPipe }
       ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrSummaryBoxComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
    document.body.removeChild(fixture.debugElement.nativeElement);
    fixture = null;
    component = null;
  });

  it('should create a summary box with populated values', () => {
    const labMonthLevel = autofixture.create(labMonthLevelDefault);
    labMonthLevel.controlLevel = 2;

    component.labMonthLevel = labMonthLevel;
    component.decimalFormat = 2;

    fixture.detectChanges();
    expect(component).toBeTruthy();

    // Heading
    let debug = fixture.debugElement.query(By.css('#spc_summarybox_heading'));
    let el = debug.nativeElement;
    expect(el.innerText).toEqual('LEVEL ' + labMonthLevel.controlLevel);

    // Column Titles
    debug = fixture.debugElement.query(By.css('#spcSummaryboxTitle1'));
    el = debug.nativeElement;
    expect(el.innerText).toEqual('MON');

    debug = fixture.debugElement.query(By.css('#spcSummaryboxTitle2'));
    el = debug.nativeElement;
    expect(el.innerText).toEqual('CUM');
  });
});
