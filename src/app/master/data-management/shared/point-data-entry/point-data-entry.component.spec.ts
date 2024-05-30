// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { BrNumericValueDirective, MaterialModule } from 'br-component-library';
import { Autofixture } from 'ts-autofixture/dist/src';

import { PointDataEntryComponent } from './point-data-entry.component';
import { LevelValue } from '../../../../contracts/models/data-management/level-value.model';

describe('PointEntryComponent', () => {
  let component: PointDataEntryComponent;
  let fixture: ComponentFixture<PointDataEntryComponent>;
  const autoFixture = new Autofixture();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PointDataEntryComponent,
        BrNumericValueDirective
      ],
      imports: [
        StoreModule.forRoot([]),
        BrowserAnimationsModule,
        FormsModule,
        MaterialModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: Store, useValue: [] },
        provideMockStore({})
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PointDataEntryComponent);
    component = fixture.componentInstance;
    component.levelValues = new Array<LevelValue>();
    component.isProductMasterLotExpired = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create expected number of inputs', () => {
    // Two levels
    let levelValues: LevelValue[] = [
      { level: 2, value: 78.9 },
      { level: 5, value: 190.7 }
    ];

    component.levelValues = levelValues;

    fixture.detectChanges();

    let debugNodes = fixture.debugElement.queryAll(By.css('input'));
    expect(debugNodes.length).toEqual(levelValues.length);

    // 10 levels
    levelValues = autoFixture.createMany({ level: 0, value: 0 }, 10);
    component.levelValues = levelValues;

    fixture.detectChanges();

    debugNodes = fixture.debugElement.queryAll(By.css('input'));
    expect(debugNodes.length).toEqual(levelValues.length);

    // Empty levelValues
    component.levelValues = [];
    fixture.detectChanges();
    debugNodes = fixture.debugElement.queryAll(By.css('.value-input'));
    expect(debugNodes.length).toEqual(0);

    expect(component).toBeTruthy();
  });

  it('should apply correct values to the input fields', () => {
    const levelValues: LevelValue[] = autoFixture.createMany({ level: 0, value: 0 }, 3);
    component.levelValues = levelValues;

    fixture.detectChanges();

    const debugNodes = fixture.debugElement.queryAll(By.css('input'));
    expect(debugNodes.length).toEqual(levelValues.length);

    for (let i = 0, len = debugNodes.length; i < len; i++) {
      debugNodes[i].nativeElement.dispatchEvent(new Event('input'));
    }

    fixture.detectChanges();

    for (let i = 0, len = debugNodes.length; i < len; i++) {
      expect(debugNodes[i].nativeElement.value).toEqual(levelValues[i].value);
    }
  });

  it('should obtain the correct values from the input fields', () => {
    // Three levels
    let levelValues: LevelValue[] = autoFixture.createMany({ level: 0, value: 0 }, 3);
    component.levelValues = levelValues;

    fixture.detectChanges();

    let debugNodes = fixture.debugElement.queryAll(By.css('input'));
    expect(debugNodes.length).toEqual(levelValues.length);

    // Apply values to inputs
    for (let i = 0, len = debugNodes.length; i < len; i++) {
      debugNodes[i].nativeElement.value = levelValues[i].value;
    }

    fixture.detectChanges();

    for (let i = 0, len = debugNodes.length; i < len; i++) {
      expect(component.levelValues[i].value).toEqual(levelValues[i].value);
    }

    // One level
    levelValues = autoFixture.createMany({ level: 0, value: 0 }, 1);
    component.levelValues = levelValues;

    fixture.detectChanges();

    debugNodes = fixture.debugElement.queryAll(By.css('input'));
    expect(debugNodes.length).toEqual(levelValues.length);

    // Apply values to inputs
    debugNodes[0].nativeElement.value = levelValues[0].value;

    fixture.detectChanges();

    expect(component.levelValues[0].value).toEqual(levelValues[0].value);
  });

  it('should display the correct placeholder for each input', () => {
    // Three levels
    const levelValues = autoFixture.createMany({ level: 0, value: 0 }, 3);
    component.levelValues = levelValues;

    fixture.detectChanges();

    const debugNodes = fixture.debugElement.queryAll(By.css('input'));
    expect(debugNodes.length).toEqual(levelValues.length);

    // Check placeholders
    for (let i = 0, len = debugNodes.length; i < len; i++) {
      expect(debugNodes[i].nativeElement.placeholder).toEqual('');
    }
  });
});
