import { ComponentFixture, TestBed, async   } from '@angular/core/testing';

import { CookiePreferencesComponent } from './cookie-preferences.component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../../app.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NavBarLangComponent } from '../../navigation/nav-bar/nav-bar-lang/nav-bar-lang.component';
import { MatMenuModule } from '@angular/material/menu';

describe('CookiePreferencesComponent', () => {
  let component: CookiePreferencesComponent;
  let fixture: ComponentFixture<CookiePreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CookiePreferencesComponent],
      providers: [TranslateService],
      imports: [
        MatMenuModule,
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
    fixture = TestBed.createComponent(CookiePreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the nav bar lang component', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('unext-nav-bar-lang')).not.toBe(null);
  }));
});
