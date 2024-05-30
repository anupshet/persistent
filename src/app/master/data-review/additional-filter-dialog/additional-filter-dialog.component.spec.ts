// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { FormBuilder } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { AdditionalFilterDialogComponent } from './additional-filter-dialog.component';
import { HttpLoaderFactory } from '../../../../app/app.module';


describe('AdditionalFilterDialogComponent', () => {
  const formBuilder: FormBuilder = new FormBuilder();

  let component: AdditionalFilterDialogComponent;
  let fixture: ComponentFixture<AdditionalFilterDialogComponent>;
  let loader: HarnessLoader;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdditionalFilterDialogComponent],
      imports: [
        MatDialogModule,
        MatMenuModule,
        NoopAnimationsModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        })
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => { } } },
        { provide: FormBuilder, useValue: formBuilder },
        TranslateService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display violations Run', async() => {
    component.filterCountResult = {
      accepted:1,
      warning: 0,
      rejected:0,
      actionAndComments:0,
      last30Days: 9,
      violations:2,
    }
    const menu = await loader.getHarness(MatMenuHarness.with({selector: '#menuselector'}));
    await menu.open();

    const violations = fixture.debugElement.query(By.css('.filter-result-icon-violation'));
    expect(violations.nativeElement.innerText).toBe(String(component.filterCountResult.violations));
  });

  it('should display last 30 days Run', async() => {
    component.filterCountResult = {
      accepted:1,
      warning: 0,
      rejected:0,
      actionAndComments:0,
      last30Days: 9,
      violations:2,
    }
    const menu = await loader.getHarness(MatMenuHarness.with({selector: '#menuselector'}));
    await menu.open();

    const last30DaysElement = fixture.debugElement.query(By.css('.filter-result-icon-last30Days'));
    expect(last30DaysElement.nativeElement.innerText).toBe(String(component.filterCountResult.last30Days));
  });

  it('should display Additional Filters', async() => {
    const menu = await loader.getHarness(MatMenuHarness.with({selector: '#menuselector'}));
    await menu.open();

    const additionalFilter = fixture.debugElement.query(By.css('.additional-filter-title'));
    expect(additionalFilter.nativeElement.innerText).toEqual('ADDITIONALFILTER.ADDITIONALFILTERS');
  });
});
