// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { DecimalPipe } from '@angular/common';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { MaterialModule, BrCore } from 'br-component-library';

import { LevelEvaluationMeanSdComponent } from './level-evaluation-mean-sd.component';
import { EvaluationType } from '../../../../contracts/enums/lab-setup/evaluation-type.enum';
import { UnityRestrictDecimalPlacesDirective } from '../../../../shared/directives/unity-restrict-decimal-places.directive';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { Permissions } from '../../../../security/model/permissions.model';
import { HttpLoaderFactory } from '../../../../app.module';



describe('LevelEvaluationMeanSdComponent', () => {
  let component: LevelEvaluationMeanSdComponent;
  let fixture: ComponentFixture<LevelEvaluationMeanSdComponent>;

  const mockLevelEvaluationMeanSd = {
    'entityId': '11111111-1111-1111-1111-111111111111',
    'level': 1,
    'meanEvaluationType': 2,
    'mean': 2.4,
    'sdEvaluationType': 2,
    'sd': 4.32,
    'sdIsCalculated': false,
    'cvEvaluationType': 2,
    'cv': 180,
    'cvIsCalculated': true
  };

  const mockFloatingStatistics = {
    'entityId': '11111111-1111-1111-1111-111111111111',
    'level': 1,
    'mean': 6,
    'sd': 18,
    'cv': 300
  };

  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  const mockBrPermissionsService = {
    hasAccess: (permissions: Array<Permissions>) => {
      const allowedpermissions = [Permissions.EvalMeanSDCV];
      return allowedpermissions.some(ele => permissions.includes(ele));
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LevelEvaluationMeanSdComponent, UnityRestrictDecimalPlacesDirective, DecimalPipe],
      imports: [
        StoreModule.forRoot([]),
        PerfectScrollbarModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        BrCore,
        BrowserAnimationsModule,
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
        { provide: BrPermissionsService, useValue: mockBrPermissionsService },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        TranslateService,
        HttpClient,
        { provide: Store, useValue: [] },
        provideMockStore({})
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelEvaluationMeanSdComponent);
    component = fixture.componentInstance;
    component.levelEvaluationMeanSd = mockLevelEvaluationMeanSd;
    component.initialValues = mockLevelEvaluationMeanSd;
    component.meanPlaceholder = 'Mean';
    component.sdPlaceholder = 'SD';
    component.cvPlaceholder = 'CV';
    component.patternToDecimal = '1.0-2';
    component.decimalPlaces = 2;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('verify it displays the level, mean, SD, and CV', () => {
    const levelElement = fixture.debugElement.query(By.css('.spec_level')).nativeElement;
    const meanElement = fixture.debugElement.query(By.css('.spec_mean')).nativeElement;
    const sdElement = fixture.debugElement.query(By.css('.spec_sd')).nativeElement;
    const cvElement = fixture.debugElement.query(By.css('.spec_cv')).nativeElement;
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(levelElement).toBeTruthy();
      expect(meanElement).toBeTruthy();
      expect(sdElement).toBeTruthy();
      expect(cvElement).toBeTruthy();
      expect(meanElement.value).toEqual(component.getDecimalPlaceConvertedValue(component.levelEvaluationMeanSd.mean));
      expect(sdElement.value).toEqual(component.getDecimalPlaceConvertedValue(component.levelEvaluationMeanSd.sd));
      expect(cvElement.value).toEqual(component.getDecimalPlaceConvertedValue(component.levelEvaluationMeanSd.cv));
    });
  });

  it('verify it displays the SD and CV fields as disabled if the sdIsCalculated/cvIsCalculated values are true.', () => {
    const sdIsCalculated = component.levelEvaluationMeanSd.sdIsCalculated;
    const cvIsCalculated = component.levelEvaluationMeanSd.cvIsCalculated;
    const sdElement = fixture.debugElement.query(By.css('.spec_sd')).nativeElement;
    const cvElement = fixture.debugElement.query(By.css('.spec_cv')).nativeElement;
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      (sdIsCalculated) ? expect(sdElement.disabled).toBeTruthy() : expect(sdElement.disabled).toBeFalsy();
      // (cvIsCalculated) ? expect(cvElement.disabled).toBeTruthy() : expect(cvElement.disabled).toBeFalsy();
    });
  });

  it('verify it displays the mean, SD, and CV floating statistics.', () => {
    component.levelFloatingStatistics = mockFloatingStatistics;
    component.floatingStatisticsFlag = true;
    const formvalues = component.getFormCurrentValues();
    const meanElement = fixture.debugElement.query(By.css('.spec_mean')).nativeElement;
    const sdElement = fixture.debugElement.query(By.css('.spec_sd')).nativeElement;
    const cvElement = fixture.debugElement.query(By.css('.spec_cv')).nativeElement;
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(meanElement).toBeTruthy();
      expect(sdElement).toBeTruthy();
      expect(cvElement).toBeTruthy();
      expect(formvalues.mean).toEqual(component.levelFloatingStatistics.mean);
      expect(formvalues.sd).toEqual(component.levelFloatingStatistics.sd);
      expect(formvalues.cv).toEqual(component.levelFloatingStatistics.cv);
    });
  });

  it('verify it correctly checks the mean and SD/CV Fixed/Float radio buttons.', () => {
    const meanEvaluationType = component.levelEvaluationMeanSd.meanEvaluationType;
    const sdEvaluationType = component.levelEvaluationMeanSd.sdEvaluationType;
    const meanEvalFixedClasses = fixture.debugElement.query(By.css('.spec_meanEvaluationFixed')).classes;
    const meanEvalFloatClasses = fixture.debugElement.query(By.css('.spec_meanEvaluationFloat')).classes;
    const sdcvEvalFixedClasses = fixture.debugElement.query(By.css('.spec_sdcvEvaluationFixed')).classes;
    const sdcvEvalFloatClasses = fixture.debugElement.query(By.css('.spec_sdcvEvaluationFloat')).classes;
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      (meanEvaluationType === EvaluationType.Floating) ? expect(meanEvalFloatClasses['mat-radio-checked']).toBeTruthy() :
        expect(meanEvalFixedClasses['mat-radio-checked']).toBeTruthy();
      (sdEvaluationType === EvaluationType.Floating) ? expect(sdcvEvalFloatClasses['mat-radio-checked']).toBeTruthy() :
        expect(sdcvEvalFixedClasses['mat-radio-checked']).toBeTruthy();
    });
  });

  it('verify change mean and SD and see if CV is properly calculated (when cvIsCalculated = true)', () => {
    const mean = 2;
    const sd = 2;
    const cvIsCalculated = true;
    const sdIsCalculated = false;
    component.levelEvaluationMSForm.patchValue({
      mean: mean,
      sd: sd,
      cvIsCalculated: cvIsCalculated,
      sdIsCalculated: sdIsCalculated
    });
    component.inputsChanged();
    const cvRes = (sd / mean) * 100;
    const cvElement = fixture.debugElement.query(By.css('.spec_cv')).nativeElement;
    const meanElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_mean');
    const sdlement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_sd');
    const event = new Event('change');
    meanElement.dispatchEvent(event);
    sdlement.dispatchEvent(event);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(cvElement.value).toEqual(component.getDecimalPlaceConvertedValue(cvRes));
    });
  });

  it('verify change mean and CV and see if SD is properly calculated (when sdIsCalculated = true)', () => {
    const mean = 2;
    const cv = 2;
    const sdIsCalculated = true;
    const cvIsCalculated = false;
    component.levelEvaluationMSForm.patchValue({
      mean: mean,
      cv: cv,
      cvIsCalculated: cvIsCalculated,
      sdIsCalculated: sdIsCalculated
    });
    component.inputsChanged();
    const sdRes = (cv * mean) / 100;
    const cvElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_cv');
    const meanElement = <HTMLElement>fixture.debugElement.nativeElement.querySelector('.spec_mean');
    const sdlement = fixture.debugElement.query(By.css('.spec_sd')).nativeElement;
    const event = new Event('change');
    meanElement.dispatchEvent(event);
    cvElement.dispatchEvent(event);
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(sdlement.value).toEqual(sdRes.toString());
    });
  });

  it('verify if SD not edited, user able to edit CV', () => {
    component.floatingStatisticsFlag = false;
    component.isFloatingStatistics = false;
    component.isSdEdited = false;
    spyOn(component, 'enableDisableInput').and.callThrough();
    component.enableDisableInput('CV');
    expect(component.enableDisableInput).toHaveBeenCalled();
  });

  it('verify if SD is edited, user not able to edit CV', () => {
    component.isSdEdited = true;
    spyOn(component, 'enableDisableInput').and.callThrough();
    component.enableDisableInput('CV');
    expect(component.enableDisableInput).toHaveBeenCalled();
  });

  it('verify CV gets the focus when SD not changed', () => {
    component.isSdEdited = false;
    spyOn(component, 'inputsGetsFocus').and.callThrough();
    component.inputsGetsFocus('1.88', 'CV');
    expect(component.inputsGetsFocus).toHaveBeenCalled();
  });

  it('verify SD gets the focus when CV not changed', () => {
    component.isCvEdited = false;
    spyOn(component, 'inputsGetsFocus').and.callThrough();
    component.inputsGetsFocus('1.88', 'SD');
    expect(component.inputsGetsFocus).toHaveBeenCalled();
  });

  it('verify if CV gets the focus when SD not changed and loses focus', () => {
    component.isSdEdited = false;
    spyOn(component, 'inputsLoseFocus').and.callThrough();
    component.inputsLoseFocus('1.88', 'CV');
    expect(component.inputsLoseFocus).toHaveBeenCalled();
  });

  it('verify if SD gets the focus when CV not changed and loses focus', () => {
    component.isCvEdited = false;
    spyOn(component, 'inputsLoseFocus').and.callThrough();
    component.inputsLoseFocus('1.88', 'SD');
    expect(component.inputsLoseFocus).toHaveBeenCalled();
  });

  it('verify if Mean changed', () => {
    component.isCvEdited = false;
    component.levelEvaluationMSForm.patchValue({
      mean: '1.78'
    });
    fixture.detectChanges();
    spyOn(component, 'onMeanChange').and.callThrough();
    component.onMeanChange();
    expect(component.onMeanChange).toHaveBeenCalled();
  });

  it('verify if SD CV radio button option is changed', () => {
    const sdCvRadioElement = fixture.debugElement.query(By.css('.spec_sdCvRadio')).nativeElement;
    sdCvRadioElement.click();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      spyOn(component, 'onSdCvFixedFloatChange').and.callThrough();
      component.onSdCvFixedFloatChange(sdCvRadioElement.value);
      expect(component.onSdCvFixedFloatChange).toHaveBeenCalled();
    });
  });

  it('verify if Mean radio button option is changed', () => {
    const meanRadioElement = fixture.debugElement.query(By.css('.spec_meanRadio')).nativeElement;
    meanRadioElement.click();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      spyOn(component, 'onMeanFixedFloatChange').and.callThrough();
      component.onMeanFixedFloatChange(meanRadioElement.value);
      expect(component.onMeanFixedFloatChange).toHaveBeenCalled();
    });
  });

  it('verify if getFloatingValues called', () => {
    spyOn(component, 'getFloatingValues').and.callThrough();
    component.getFloatingValues();
    expect(component.getFloatingValues).toHaveBeenCalled();
  });

});
