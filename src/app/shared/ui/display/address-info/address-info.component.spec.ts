// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { ComponentFixture, TestBed, async   } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AddressInfoComponent } from './address-info.component';
import { Address } from '../../../../contracts/models/account-management/address.model';
import { CoreTestHelper } from '../../../testing-helpers/core-test.helper';

describe('AddressInfoComponent', () => {
  let component: AddressInfoComponent;
  let fixture: ComponentFixture<AddressInfoComponent>;
  let helper: CoreTestHelper<AddressInfoComponent>;
  let accountAddress: Address = {
    "entityType": 0,
    "streetAddress1": "123 Main St.",
    "streetAddress2": "Ste. ABC",
    "streetAddress3": "#1",
    "streetAddress": "123 Main St. Ste. ABC #1",
    "suite": "",
    "searchAttribute": "",
    "nickName": "",
    "city": "Irvine",
    "state": "CA",
    "country": "US",
    "zipCode": "92618",
    "id": "60ae84d8-edca-4f7c-92e5-4b5bc3765f7b"
  }

  // Set up
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddressInfoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressInfoComponent);
    component = fixture.componentInstance;
    component.address = accountAddress;
    fixture.detectChanges();

    helper = new CoreTestHelper(fixture);
  });

  // Tear-down
  afterEach(() => {
    helper.tearDown(component);
  });

  // Unit tests
  describe('Unit', () => {
    it('should be created', () => {
      expect(component).toBeDefined();
    });
  });


  // Integration tests
  describe('Integration', () => {

    it('should render the correct address in the mat row', () => {
      expect(component.address).toEqual(accountAddress);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const streetAddress = fixture.debugElement.query(By.css('.spec_streetAddress'));
        expect(streetAddress.nativeElement.innerText).toEqual(accountAddress.streetAddress);
        const subAddress = fixture.debugElement.query(By.css('.spec_otherAddress'));
        expect(subAddress.nativeElement.innerText).toEqual(accountAddress.city + ', ' + accountAddress.state + ', ' +
          accountAddress.zipCode + ', ' + accountAddress.country);
      });
    });
  });
});
