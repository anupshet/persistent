// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { ComponentFixture, fakeAsync, TestBed, async   } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MaterialModule } from 'br-component-library';
import { AdvancedLjLevelsComponent } from './advanced-lj-levels.component';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { HttpLoaderFactory } from '../../../../app.module';

describe('AdvancedLjLevelsComponent', () => {
  let component: AdvancedLjLevelsComponent;
  let fixture: ComponentFixture<AdvancedLjLevelsComponent>;
  let destroy$: Subject<boolean>;

  const mockAppLoggerService = jasmine.createSpyObj(['log']);

  function checkLevelCheckbox(fixture: ComponentFixture<AdvancedLjLevelsComponent>, levelNumber: number): void {
    const checkboxClassPrefix = '.level-checkbox-';
    const levelCheckbox = fixture.debugElement.query(By.css(checkboxClassPrefix + levelNumber));

    expect(levelCheckbox).not.toBeNull();
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AdvancedLjLevelsComponent
      ],
      imports: [
        FormsModule,
        MaterialModule,
        HttpClientModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
      ],
      providers: [
        {
          provide: AppLoggerService, useValue: mockAppLoggerService,
          TranslateService,
        }
      ]
    })
    .compileComponents();

    destroy$ = new Subject<boolean>();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedLjLevelsComponent);
    component = fixture.componentInstance;
    component.levelsInUse = [2];
    fixture.detectChanges();
  });

  afterEach(() => {
    destroy$.next(true);
    destroy$.unsubscribe();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display one level', () => {
    const levelsInUse = [2];    // Set level as 2
    component.levelsInUse = levelsInUse;
    fixture.detectChanges();

    for (let i = 0; i < levelsInUse.length; i++) {
      checkLevelCheckbox(fixture, levelsInUse[i]);
    }
  });

  it('should display 2 levels', () => {
    const levelsInUse = [1, 2];
    component.levelsInUse = levelsInUse;
    fixture.detectChanges();

    for (let i = 0; i < levelsInUse.length; i++) {
      checkLevelCheckbox(fixture, levelsInUse[i]);
    }
  });

  it('should display 6 levels', () => {
    const levelsInUse = [1, 2, 3, 4, 5, 6];
    component.levelsInUse = levelsInUse;
    fixture.detectChanges();

    for (let i = 0; i < levelsInUse.length; i++) {
      checkLevelCheckbox(fixture, levelsInUse[i]);
    }
  });

  it('unchecking a level should remove it from output', fakeAsync(() => {
    const levelsInUse = [1, 2, 3, 4, 5, 6];
    component.levelsInUse = levelsInUse;
    fixture.detectChanges();

    const selectedLevelsSpy = spyOn(component.selectedLevels, 'emit').and.callThrough();

    component.onLevelChange();
    expect(selectedLevelsSpy).toHaveBeenCalledWith(levelsInUse);

    component.levels[3].isSelected = false;
    component.onLevelChange();
    expect(selectedLevelsSpy).toHaveBeenCalledWith([1, 2, 3, 5, 6]);
  }));

  it('unchecking multiple levels should remove them from output', fakeAsync(() => {
    const levelsInUse = [1, 2, 3, 4, 5, 6];
    component.levelsInUse = levelsInUse;
    fixture.detectChanges();

    const selectedLevelsSpy = spyOn(component.selectedLevels, 'emit').and.callThrough();

    component.onLevelChange();
    expect(selectedLevelsSpy).toHaveBeenCalledWith(levelsInUse);

    component.levels[3].isSelected = false;
    component.levels[0].isSelected = false;
    component.onLevelChange();
    expect(selectedLevelsSpy).toHaveBeenCalledWith([2, 3, 5, 6]);
  }));

  it('checking one level should add it to output', fakeAsync(() => {
    const levelsInUse = [1, 2, 3, 4, 5, 6];
    component.levelsInUse = levelsInUse;
    fixture.detectChanges();

    const selectedLevelsSpy = spyOn(component.selectedLevels, 'emit').and.callThrough();

    component.onLevelChange();
    expect(selectedLevelsSpy).toHaveBeenCalledWith(levelsInUse);

    component.levels[5].isSelected = false;
    component.levels[0].isSelected = false;
    component.onLevelChange();
    expect(selectedLevelsSpy).toHaveBeenCalledWith([2, 3, 4, 5]);

    component.levels[0].isSelected = true;
    component.onLevelChange();
    expect(selectedLevelsSpy).toHaveBeenCalledWith([1, 2, 3, 4, 5]);
  }));

  it('checking multiple levels should add them to output', fakeAsync(() => {
    const levelsInUse = [1, 2, 3, 4, 5, 6];
    component.levelsInUse = levelsInUse;
    fixture.detectChanges();

    const selectedLevelsSpy = spyOn(component.selectedLevels, 'emit').and.callThrough();

    component.onLevelChange();
    expect(selectedLevelsSpy).toHaveBeenCalledWith(levelsInUse);

    component.levels[5].isSelected = false;
    component.levels[0].isSelected = false;
    component.onLevelChange();
    expect(selectedLevelsSpy).toHaveBeenCalledWith([2, 3, 4, 5]);

    component.levels[3].isSelected = true;
    component.levels[0].isSelected = true;
    component.onLevelChange();
    expect(selectedLevelsSpy).toHaveBeenCalledWith(levelsInUse);
  }));

  it('emits IsOverlay as true/false when toggled on/off', async() => {
    const isOverlaySpy = spyOn(component.isOverlayChange, 'emit').and.callThrough();

    expect(component.isOverlayChecked).toBeFalse();
    let overlayControl = fixture.debugElement.nativeElement.querySelector('#spec_isoverlay-input');
    expect(overlayControl).toBeDefined();

    // Toggle on
    overlayControl.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();
    expect(component.isOverlayChecked).toBeTrue();
    expect(isOverlaySpy).toHaveBeenCalledWith(true);

    // Toggle off
    overlayControl.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();
    expect(component.isOverlayChecked).toBeFalse();
    expect(isOverlaySpy).toHaveBeenCalledWith(false);
  });
});
