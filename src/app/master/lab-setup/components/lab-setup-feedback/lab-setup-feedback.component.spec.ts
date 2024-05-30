// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { LabSetupHeaderComponent } from '../lab-setup-header/lab-setup-header.component';
import { LabSetupFeedbackComponent } from './lab-setup-feedback.component';
import { AppLoggerService } from '../../../../shared/services/applogger/applogger.service';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { HttpLoaderFactory } from '../../../../app.module';

describe('LabSetupFeedbackComponent', () => {
  let component: LabSetupFeedbackComponent;
  let fixture: ComponentFixture<LabSetupFeedbackComponent>;

  const mockErrorLoggerService = jasmine.createSpyObj([
    'logErrorToBackend',
    'populateErrorObject'
  ]);

  const mockMatDialog = {
    open: () => {},
    close: () => {}
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatFormFieldModule,
        FormsModule,
        PerfectScrollbarModule,
        MatInputModule,
        MatIconModule,
        BrowserAnimationsModule,
        StoreModule.forRoot({}),
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
      declarations: [
        LabSetupFeedbackComponent,
        LabSetupHeaderComponent
      ],
      providers: [
        { provide: NavigationService, useValue: of('') },
        { provide: ErrorLoggerService, useValue: mockErrorLoggerService },
        { provide: MatDialog, useValue: mockMatDialog },
        AppLoggerService,
        TranslateService,
        HttpClient
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabSetupFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a form control when "Add a comment" button is clicked', () => {
    const showCommentForm = fixture.debugElement.query(By.css('.show-comment-form')).nativeElement;
    const dataEntryForm = fixture.debugElement.query(By.css('.data-entry-form'));
    expect(dataEntryForm).toBe(null);

    const click = new MouseEvent('click');
    showCommentForm.dispatchEvent(click);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const dataEntry = fixture.debugElement.query(By.css('#spc_labsetupfeedback_comment')).nativeElement;
      expect(dataEntry).toBeTruthy();
    });
  });

  it('should verify "Submit Comment" button is disabled at the begining', () => {
    const showCommentForm = fixture.debugElement.query(By.css('.show-comment-form')).nativeElement;
    const compiled = fixture.debugElement.nativeElement;
    const click = new MouseEvent('click');
    showCommentForm.dispatchEvent(click);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(compiled.querySelector('#spc_labsetupfeedback_comment_submit').disabled).toBeTruthy();
    });
  });

  it('should verify "Submit Comment" button gets enabled on entering a comment', () => {
    const showCommentForm = fixture.debugElement.query(By.css('.show-comment-form')).nativeElement;
    const compiled = fixture.debugElement.nativeElement;
    const click = new MouseEvent('click');
    showCommentForm.dispatchEvent(click);
    fixture.detectChanges();

    component.comment = 'your comment goes here';
    component.onCommentChange();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(compiled.querySelector('#spc_labsetupfeedback_comment_submit').disabled).toBeFalsy();
    });
  });

});
