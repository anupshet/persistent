import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { MappingService } from '../../mapping.service';
import { DropdownFilterComponent } from './dropdown-filter.component';
import { DropdownDataObject } from '../../../../../contracts/unit-tests/connectivity-map/dropdown-data-object';
import { EntityType } from '../../../../../contracts/enums/entity-type.enum';
import {HttpLoaderFactory} from "../../../../../app.module";

describe('DropdownFilterComponent', () => {
  let component: DropdownFilterComponent;
  let fixture: ComponentFixture<DropdownFilterComponent>;

  const mockService = {
    triggerDataRefresh: of(),
    currentDropdownData: of(DropdownDataObject.connectivityMapDropdowns),
    clearSelectionStates() {},
    currentSelectedChip: of(null),
    currentMappedInstrumentIds: of(['InstrumentId1']),
    currentMappedProductIds: of(['ProductId1'])
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatSelectModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        HttpClientModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),],
      declarations: [DropdownFilterComponent],
      providers: [{ provide: MappingService, useValue: mockService }, TranslateService,]
    }).compileComponents();
  }));

/*   beforeEach(() => {
    fixture = TestBed.createComponent(DropdownFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('OnChange', () => {
    it('should setup dropdowns for Instrument page', () => {
      component.entityType = EntityType.LabInstrument;
      component.ngOnChanges();
      fixture.detectChanges();

      expect(component.initLocationDropdown).toBeTruthy();
      expect(component.initDepartmentDropdown).toBeTruthy();
      expect(component.initInstrumentDropdown).toBeTruthy();
      expect(component.initProductDropdown).toBeTruthy();
    });

    it('should setup dropdowns for Product page', () => {
      component.entityId = 'InstrumentId1';
      component.entityType = EntityType.LabProduct;
      component.isAllProductsScreen = false;
      component.ngOnChanges();
      fixture.detectChanges();

      expect(component.initLocationDropdown).toBeTruthy();
      expect(component.initDepartmentDropdown).toBeTruthy();
      expect(component.initInstrumentDropdown).toBeTruthy();
    });

    it('should setup dropdowns for All Product page', () => {
      component.entityType = EntityType.LabProduct;
      component.isAllProductsScreen = true;
      component.ngOnChanges();
      fixture.detectChanges();

      expect(component.initLocationDropdown).toBeTruthy();
      expect(component.initDepartmentDropdown).toBeTruthy();
      expect(component.initInstrumentDropdown).toBeTruthy();
    });

    it('should setup dropdowns for Test page', () => {
      component.entityId = 'ProductId1';
      component.entityType = EntityType.LabTest;
      component.isAllTestsScreen = false;
      component.ngOnChanges();
      fixture.detectChanges();

      expect(component.initLocationDropdown).toBeTruthy();
      expect(component.initDepartmentDropdown).toBeTruthy();
      expect(component.initInstrumentDropdown).toBeTruthy();
      expect(component.initProductDropdown).toBeTruthy();
    });

    it('should setup dropdowns for All Test page', () => {
      component.entityType = EntityType.LabTest;
      component.isAllTestsScreen = true;
      component.ngOnChanges();
      fixture.detectChanges();

      expect(component.initLocationDropdown).toBeTruthy();
      expect(component.initDepartmentDropdown).toBeTruthy();
      expect(component.initInstrumentDropdown).toBeTruthy();
      expect(component.initProductDropdown).toBeTruthy();
    });
  });

  describe('disableDropdowns', () => {
      it('should disable proper dropdowns at Instrument page', () => {
        component.entityType = EntityType.LabInstrument;
        component.ngOnChanges();
        fixture.detectChanges();

        expect(component.departmentForm.enabled).toBeFalsy();
        expect(component.instrumentForm.enabled).toBeFalsy();
      });

      it('should disable all dropdowns at Product page', () => {
        component.entityType = EntityType.LabProduct;
        component.entityId = 'InstrumentId1';
        component.ngOnChanges();
        fixture.detectChanges();

        expect(component.locationForm.enabled).toBeFalsy();
        expect(component.departmentForm.enabled).toBeFalsy();
        expect(component.instrumentForm.enabled).toBeFalsy();
      });

      it('should disable proper dropdowns at All Product page', () => {
        component.entityType = EntityType.LabProduct;
        component.ngOnChanges();
        fixture.detectChanges();

        expect(component.departmentForm.enabled).toBeFalsy();
        expect(component.instrumentForm.enabled).toBeFalsy();
      });

      it('should disable all dropdowns at Test page', () => {
        component.entityType = EntityType.LabTest;
        component.entityId = 'ProductId1';
        component.ngOnChanges();
        fixture.detectChanges();

        expect(component.locationForm.enabled).toBeFalsy();
        expect(component.departmentForm.enabled).toBeFalsy();
        expect(component.instrumentForm.enabled).toBeFalsy();
      });

      it('should disable proper dropdowns at Test page', () => {
        component.entityType = EntityType.LabTest;
        component.ngOnChanges();
        fixture.detectChanges();

        expect(component.departmentForm.enabled).toBeFalsy();
        expect(component.instrumentForm.enabled).toBeFalsy();
      });
  });

  describe('changeLocationDropdown', () => {
    it('should filter cards', () => {
      component.entityType = EntityType.LabInstrument;
      component.ngOnChanges();
      fixture.detectChanges();
      spyOn(component.filterCardsEvent, 'next');
      component.changeLocationDropdown([]);

      expect(component.filterCardsEvent.next).toHaveBeenCalled();
    });

    it('should initialize non-selected dropdown contents for All Product page', () => {
      component.entityType = EntityType.LabProduct;
      component.isAllProductsScreen = true;
      component.ngOnChanges();
      fixture.detectChanges();
      component.prevSelectedLocations = [];
      component.prevSelectedDepartments = [];
      component.prevSelectedInstruments = [];
      component.changeLocationDropdown([component.initLocationDropdown[0]]);

      expect(component.prevSelectedLocations).toEqual(component.initLocationDropdown);
      expect(component.prevSelectedDepartments).toEqual(component.initDepartmentDropdown);
      expect(component.prevSelectedInstruments).toEqual(component.initInstrumentDropdown);
    });

    it('should initialize non-selected dropdown contents for All Test page', () => {
      component.entityType = EntityType.LabTest;
      component.isAllTestsScreen = true;
      component.ngOnChanges();
      fixture.detectChanges();
      component.prevSelectedLocations = [];
      component.prevSelectedDepartments = [];
      component.prevSelectedInstruments = [];
      component.changeLocationDropdown([component.initLocationDropdown[0]]);

      expect(component.prevSelectedLocations).toEqual(component.initLocationDropdown);
      expect(component.prevSelectedDepartments).toEqual(component.initDepartmentDropdown);
      expect(component.prevSelectedInstruments).toEqual(component.initInstrumentDropdown);
    });
  });

  describe('changeDepartmentDropdown', () => {
    it('should filter cards', () => {
      component.entityType = EntityType.LabInstrument;
      component.ngOnChanges();
      fixture.detectChanges();
      spyOn(component.filterCardsEvent, 'next');
      component.changeDepartmentDropdown([]);

      expect(component.filterCardsEvent.next).toHaveBeenCalled();
    });
  });

  describe('changeInstrumentDropdown', () => {
    it('should filter cards', () => {
      component.entityType = EntityType.LabInstrument;
      component.ngOnChanges();
      fixture.detectChanges();
      spyOn(component.filterCardsEvent, 'next');
      component.changeInstrumentDropdown([]);

      expect(component.filterCardsEvent.next).toHaveBeenCalled();
    });
  }); */
});
