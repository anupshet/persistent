// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, inject, async   } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CookieDisclaimerMessageComponent } from './cookie-disclaimer-message.component';
import { HttpLoaderFactory } from '../../../app.module';

describe('CookieDisclaimerMessageComponent', () => {
  let component: CookieDisclaimerMessageComponent;
  let fixture: ComponentFixture<CookieDisclaimerMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CookieDisclaimerMessageComponent ],
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
    fixture = TestBed.createComponent(CookieDisclaimerMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Your privacy matters" title', () => {
    const compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
    expect(compiled.querySelector('.spec-your-privacy-matters').textContent).toContain('COOKIEDISCLAIMER.PRIVACY');
  });

  it('should close the dialog with emitting false on click of Continue button', inject([MatDialogRef], matDialogRef => {
    const spy = spyOn(matDialogRef, 'close');
    const declineCookies = fixture.debugElement.nativeElement.querySelector('.spec-decline-cookies');
    declineCookies.click();
    expect(spy).toHaveBeenCalledWith(false);
  }));

  it('should close the dialog with emitting true on click of Sign Out button', inject([MatDialogRef], matDialogRef => {
    const spy = spyOn(matDialogRef, 'close');
    const acceptAndContinue = fixture.debugElement.nativeElement.querySelector('.spec-accept-and-continue');
    acceptAndContinue.click();
    expect(spy).toHaveBeenCalledWith(true);
  }));

  it('should have the nav bar lang component', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('unext-nav-bar-lang')).not.toBe(null);
  }));
});
