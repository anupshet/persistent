// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MaterialModule } from 'br-component-library';
import { AuthenticationService } from '../../security/services';
import { NavBarComponent } from './nav-bar.component';
import { HttpLoaderFactory } from '../../app.module';

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;

  @Component({ selector: 'unext-setting-bar', template: '' })
  class SettingBarComponent { }

  @Component({ selector: 'unext-lab-bar', template: '' })
  class LabBarComponent { }

  @Component({ selector: 'unext-user-bar', template: '' })
  class UserBarComponent { }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        RouterTestingModule,
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
        NavBarComponent,
        SettingBarComponent,
        LabBarComponent,
        UserBarComponent
      ],
      providers: [
        AuthenticationService,
        TranslateService,
        HttpClient
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    component.title = 'title';
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
