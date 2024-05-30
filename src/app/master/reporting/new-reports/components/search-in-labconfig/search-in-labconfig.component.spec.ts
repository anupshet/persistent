// © 2023 Bio - Rad Laboratories, Inc.All Rights Reserved.
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SearchInLabconfigComponent } from './search-in-labconfig.component';
import { LabConfig } from '../../../reporting.enum';
import { DynamicReportingService } from '../../../../../shared/services/reporting.service';
import { HttpLoaderFactory } from '../../../../../app.module';

describe('SearchInLabconfigComponent', () => {
  let component: SearchInLabconfigComponent;
  let fixture: ComponentFixture<SearchInLabconfigComponent>;
  const mockTestSpecDynamicReportingService = {
    getResetStatus: () => of(true)
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchInLabconfigComponent],
      imports: [
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
        { provide: DynamicReportingService, useValue: mockTestSpecDynamicReportingService },
        TranslateService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchInLabconfigComponent);
    component = fixture.componentInstance;
    component.searchCategoryList = [
      LabConfig.locationAndDepartment,
      LabConfig.instrument,
      LabConfig.controlAndLot,
      LabConfig.analyte,
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable the search button by default', () => {
    fixture.detectChanges();
    const searchBtn = fixture.debugElement.query(
      By.css('.spec-search-btn')
    ).nativeElement;
    expect(searchBtn).toBeDefined();
    expect(searchBtn.disabled).toBeTruthy();
  });

  it('check for search button is disabled only keyword is entered in search box', () => {
    component.searchInput = 'Anemia';
    fixture.detectChanges();
    const searchBtn = fixture.debugElement.query(
      By.css('.spec-search-btn')
    ).nativeElement;
    expect(searchBtn).toBeDefined();
    expect(searchBtn.disabled).toBeTruthy();
  });

  it('check for search button is disabled only search filter is selected from dropdown', () => {
    component.selectedCategory = LabConfig.instrument;
    fixture.detectChanges();
    const searchBtn = fixture.debugElement.query(
      By.css('.spec-search-btn')
    ).nativeElement;
    expect(searchBtn).toBeDefined();
    expect(searchBtn.disabled).toBeTruthy();
  });

  it('check the length of drop down', async () => {
    component.instrumentGroupByDept = true;
    const matSelect = fixture.debugElement.query(
      By.css('.select-category')
    ).nativeElement;
    matSelect.click();
    fixture.detectChanges();
    const matOption = fixture.debugElement.queryAll(
      By.css('.select-category mat-option')
    );
    await fixture.whenStable().then(() => {
      expect(matOption.length).toEqual(4);
    });
  });

  it('should enable the search button if search input is entered and search category is selected', () => {
    component.selectedCategory = LabConfig.instrument;
    component.searchInput = 'Anemia';
    fixture.detectChanges();
    const searchBtn = fixture.debugElement.query(
      By.css('.spec-search-btn')
    ).nativeElement;
    expect(searchBtn).toBeDefined();
    expect(searchBtn.disabled).toBeFalsy();
  });

  it('should display clear search button on click of search button', () => {
    component.selectedCategory = LabConfig.instrument;
    component.searchInput = 'Anemia';
    fixture.detectChanges();
    const searchBtn = fixture.debugElement.query(
      By.css('.spec-search-btn')
    ).nativeElement;
    expect(searchBtn).toBeDefined();
    expect(searchBtn.disabled).toBeFalsy();
    searchBtn.click();
    fixture.detectChanges();
    expect(component.isSearched).toBeTruthy();
    const clearSearchBtn = fixture.debugElement.query(
      By.css('.spec-search-clear-btn')
    ).nativeElement;
    expect(clearSearchBtn).toBeDefined();
    expect(clearSearchBtn.disabled).toBeFalsy();
  });

  it('on click of clear search should reset the serach result and filters', () => {
    component.selectedCategory = LabConfig.instrument;
    component.searchInput = 'Anemia';
    fixture.detectChanges();
    const searchBtn = fixture.debugElement.query(
      By.css('.spec-search-btn')
    ).nativeElement;
    searchBtn.click();
    fixture.detectChanges();
    expect(component.isSearched).toBeTruthy();
    const clearSearchBtn = fixture.debugElement.query(
      By.css('.spec-search-clear-btn')
    ).nativeElement;
    clearSearchBtn.click();
    fixture.detectChanges();
    expect(component.isSearched).toBeFalsy();
    expect(component.selectedCategory).toEqual('');
    expect(component.searchInput).toBeNull();
  });

  it('should set searched value to false', () => {
    component.updateSearchBtn();
    expect(component.isSearched).toBeFalsy();
  });
});
