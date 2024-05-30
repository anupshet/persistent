import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';

import { Address } from '../../../../contracts/models/account-management/address.model';
/* import { TRANSLATION, TRANSLATION_CONFIG } from '../../../../core/config/constants/translation.const'; */
import { unCountryCodes } from '../../../../core/config/constants/un-country-codes.const';
/* import { TranslationService } from '../../../translation/translation.service'; */
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

@Component({
  selector: 'unext-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddressFormComponent),
      multi: true
    }
  ]
})

export class AddressFormComponent implements ControlValueAccessor, Validators, OnInit {
  countriesList: any[];
  @Input() addressType: string;

  private _address: Address;
  @Input() set address(value: Address) {
    this._address = value;
  }
  get address(): Address {
    return this._address;
  }

  constructor(private translate: TranslateService) { }

  ngOnInit() {
    this.countriesList = [];
    unCountryCodes.forEach(countryCode => {
      this.countriesList.push({
        countryCode: countryCode,
        countryName: this.getCountry(countryCode)
      });
    });
  }

  // BEGIN implement ControlValueAccessor

  // This is the initial value set to the component
  public writeValue(obj: any) {
    this.address = obj as Address;
  }

  // Registers a callback method
  public registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  // not used, used for touch input
  public registerOnTouched(fn: any) { }

  private propagateChange = (_: any) => { };

  // END implement ControlValueAccessor

  // BEGIN implement Validators

  public validate(formControl: FormControl) {
    const address = this.address;

    for (const field in address) {
      if (address.hasOwnProperty(field)) {
        if (this.isRequired(field) && !address[field]) {
          return {
            invalidValues: {
              valid: false
            }
          };
        }
      }
    }

    return null;
  }

  // END implement Validators

  // Input event handlers

  getCountry(countryCode: string): string {
    return this.getTranslation('COUNTRY_' + countryCode.toUpperCase());
  }

  isRequired(id: string): boolean {
    const operationRequested = 'createAccount';
    switch (id) {
      case 'country':
        if (this.addressType === operationRequested) {return true; }
        return false;
      case 'streetAddress1':
        if (this.addressType === operationRequested) {return true; }
        return false;
      case 'city':
        if (this.addressType === operationRequested) {return true; }
        return false;
      case 'zipCode':
        if (this.addressType === operationRequested) {return true; }
        return false;
      case 'state':
        if (this.addressType === operationRequested) {return true; }
        return false;
      default:
        return false;
    }
  }

  getTranslation(codeToTranslate: string): string {
    let translatedContent:string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }
}
