import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LotviewerPanelComponent } from './lotviewer-panel.component';
import { HttpLoaderFactory } from '../../../../app.module';

describe('LotVisibilityPanelComponent', () => {
  let component: LotviewerPanelComponent;
  let fixture: ComponentFixture<LotviewerPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LotviewerPanelComponent
      ],
      imports: [
        MatCardModule,
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
        TranslateService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LotviewerPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
