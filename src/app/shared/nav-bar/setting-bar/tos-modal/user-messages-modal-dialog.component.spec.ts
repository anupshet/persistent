// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UserMessagesDialogComponent } from './user-messages-modal-dialog.component';
import { HttpLoaderFactory } from '../../../../app.module';

describe('UserMessagesModalDialogComponent', () => {
  let component: UserMessagesDialogComponent;
  let fixture: ComponentFixture<UserMessagesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserMessagesDialogComponent],
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonToggleModule,
        FormsModule,
        MatCheckboxModule,
        MatInputModule,
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
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        TranslateService,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMessagesDialogComponent);
    component = fixture.componentInstance;
    component.data.userMessages = [{
                                  linkText: '',
                                  linkUrl: '',
                                  message: '',
                                  requiresUserAction: true,
                                  updatedOn: new Date(),
                                  locale: 'en-US'
                              }];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
