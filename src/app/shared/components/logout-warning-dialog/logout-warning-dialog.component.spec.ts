// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, discardPeriodicTasks, fakeAsync, inject, TestBed, tick, async   } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LogoutWarningDialogComponent } from './logout-warning-dialog.component';
import { oneMinuteCountdown } from '../../../core/config/constants/general.const';
import { HttpLoaderFactory } from '../../../app.module';

describe('LogoutWarningDialogComponent', () => {
  let component: LogoutWarningDialogComponent;
  let fixture: ComponentFixture<LogoutWarningDialogComponent>;
  const TRANSLATIONS_EN = require('../../../../assets/i18n/en.json');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogoutWarningDialogComponent ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: { close: () => { } } },
        TranslateService,
      ],
      imports: [
        MatDialogModule,
        HttpClientModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutWarningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display logout warning title and subtitle', () => {
    const compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    expect(compiled.querySelector('.spec-logout-warning-title').textContent).toContain('LOGOUTWARNINGDIALOG.STILLTHERE');
    fixture.detectChanges();
    expect(compiled.querySelector('.spec-logout-warning-subtitle').textContent).toContain('LOGOUTWARNINGDIALOG.SESSION');
  });

  it('should decrease remaining time for logout by one on dialog after 1 minute', <any>fakeAsync(() => {
    const compiled = fixture.debugElement.nativeElement;
    setInterval(() => {
      component.timeLeft--;
    }, oneMinuteCountdown);
    expect(component.timeLeft).toBe(5);
    tick(oneMinuteCountdown);
    expect(component.timeLeft).toBe(4);
    tick(oneMinuteCountdown);
    expect(component.timeLeft).toBe(3);
    discardPeriodicTasks();
    fixture.detectChanges();
    expect(compiled.querySelector('.spec-timeLeft').textContent).toContain(component.timeLeft);
  }));

  it('should display "minutes" if more than one minute left for logout', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.oneMinuteleft = false;
    fixture.detectChanges();
    expect(compiled.querySelector('.spec-minutes').textContent).toBeTruthy();
    expect(compiled.querySelector('.spec-minute')).toBeFalsy();
  });

  it('should display "minute" if one minute left for logout', () => {
    const compiled = fixture.debugElement.nativeElement;
    component.oneMinuteleft = true;
    fixture.detectChanges();
    expect(compiled.querySelector('.spec-minute').textContent).toBeTruthy();
    expect(compiled.querySelector('.spec-minutes')).toBeFalsy();
  });

  it('should close the dialog with emitting false on click of Continue button', inject([MatDialogRef], matDialogRef => {
    const spy = spyOn(matDialogRef, 'close');
    const continueButton = fixture.debugElement.nativeElement.querySelector('.spec-continue');
    continueButton.click();
    expect(spy).toHaveBeenCalledWith(false);
  }));

  it('should close the dialog with emitting true on click of Sign Out button', inject([MatDialogRef], matDialogRef => {
    const spy = spyOn(matDialogRef, 'close');
    const signoutButton = fixture.debugElement.nativeElement.querySelector('.spec-signout');
    signoutButton.click();
    expect(spy).toHaveBeenCalledWith(true);
  }));

});
