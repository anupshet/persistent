// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable, OnDestroy } from "@angular/core";
import { ApiService } from "../api/api.service";
import { unApi } from "src/app/core/config/constants/un-api-methods.const";
import { map, take } from "rxjs/operators";
import { Observable, Subject } from "rxjs";

export interface AddressParams {
  country?:string
  address?:string
  state?:string
  city?:string
  zipCode?: string
}

export interface AddressResponse {
  country?: string,
  countrySecondarySubdivision?: string,
  countrySubdivision?: string,
  countrySubdivisionName?: string,
  countryTertiarySubdivision?: string,
  localName?: string,
  extendedPostalCode?: string,
  freeformAddress?: string,
  municipality?: string,
  municipalitySubdivision?: string,
  postalCode?: string,
  streetName?: string,
  streetNumber?: string,
  countryCode?: string
}

export interface LocationLookupResponse {
  summary?: {
    numResults?: number | string
  },
  results?: Array<{ type?: string; entityType?: string; address?: AddressResponse }>
}

export interface ValidatedAddressResult {
  hasError: boolean,
  hasCorrection: boolean,
  message: string,
  result?: AddressResponse | Object
}

@Injectable()
export class LocationUtilitiesService implements OnDestroy {

  private destroy$ = new Subject<boolean>();

  constructor(
    private apiService: ApiService
  ) { }

  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }

  validateAddress( addressParams: AddressParams ): Observable<ValidatedAddressResult> {
    addressParams = this.trimPostData(addressParams)
    let { address, country, state, city, zipCode } = addressParams
    let returnValue = {
      hasError: false,
      hasCorrection: false,
      message: '',
      result: {}
    }
    const composedAddress = `${address}, ${ (city) ?  city + ',' : '' } ${ state } ${ (zipCode) ? zipCode : '' }`
    const url = unApi.portal.labSetupLocationLookup
    const data = this.trimPostData({address: composedAddress, country})

    return this.apiService.post(url + '/address', data, true)
      .pipe(
          take(1),
          map((result: string) => {
            const locationLookupResponse: LocationLookupResponse = JSON.parse(result);
            if (locationLookupResponse.results.length == 0 ||
                locationLookupResponse.summary.numResults == 0 ||
                locationLookupResponse.results[0].address.countryCode != country) {
              returnValue.hasError = true;
              returnValue.message = 'No results found'
              return returnValue;
            }
            const resultAddress: AddressResponse = locationLookupResponse.results.map(({address}) => ({address}))[0].address
            returnValue.result = resultAddress
            if ( composedAddress.toLowerCase() == resultAddress.freeformAddress.toLocaleLowerCase() ) {
              return returnValue
            }
            returnValue.hasCorrection = this.hasAddressCorrections(addressParams, resultAddress)
            return returnValue
        })
      )
  }

  hasAddressCorrections(addressParams: AddressParams, resultAddress: AddressResponse): boolean {
    const allVarsPresent = Object.keys(addressParams).every(key => resultAddress.freeformAddress.toLowerCase().includes(addressParams[key].toLowerCase()));
    return !allVarsPresent
  }

  formatAddress(unformattedAddress: AddressResponse): AddressParams {
    let state = '', city = '', zipCode = '', address = ''
    let administrativeLevels = [
      {administrativeDivision: unformattedAddress?.localName, divisionLevel: 1},
      {administrativeDivision: unformattedAddress?.municipalitySubdivision, divisionLevel: 2},
      {administrativeDivision: unformattedAddress?.municipality, divisionLevel: 3},
      {administrativeDivision: unformattedAddress?.countryTertiarySubdivision, divisionLevel: 4},
      {administrativeDivision: unformattedAddress?.countrySecondarySubdivision, divisionLevel: 5},
      {administrativeDivision: unformattedAddress?.countrySubdivision, divisionLevel: 6}
    ]
    let cityDivisionLevel = 0
    let stateDivisionLevel = 0

    if ( unformattedAddress?.extendedPostalCode && unformattedAddress?.freeformAddress.includes(unformattedAddress?.extendedPostalCode.split(',')[0]) ) {
      zipCode = unformattedAddress.extendedPostalCode.split(',')[0]
    } else if ( unformattedAddress?.postalCode ) {
      zipCode = unformattedAddress.postalCode
    }
    for ( let division of administrativeLevels  ) {
      if (division.administrativeDivision && unformattedAddress?.freeformAddress.includes(division.administrativeDivision)) {
        city = division.administrativeDivision
        cityDivisionLevel = division.divisionLevel
        break
      }
    }
    if ( unformattedAddress?.countrySubdivision && unformattedAddress?.freeformAddress.includes(unformattedAddress?.countrySubdivision)) {
      state = unformattedAddress.countrySubdivision
    } else {
      for ( let division of administrativeLevels ) {
        if ( division.administrativeDivision &&
            division.divisionLevel > cityDivisionLevel &&
            division.divisionLevel >= 2 &&
            unformattedAddress?.freeformAddress.includes(division.administrativeDivision)) {
          state = division.administrativeDivision
          stateDivisionLevel = division.divisionLevel
          break
        }
      }
      if(state == city) {
        for ( let division of administrativeLevels ) {
          if ( division.administrativeDivision &&
              division.divisionLevel > stateDivisionLevel &&
              division.divisionLevel > cityDivisionLevel &&
              division.divisionLevel > 2 ) {
            state = division.administrativeDivision
            break
          }
        }
      }
    }
    if ( unformattedAddress.freeformAddress.includes(city) ) {
      address = unformattedAddress.freeformAddress.split(', ' + city)[0]
    } else if ( unformattedAddress.freeformAddress.includes(state) ) {
      address = unformattedAddress.freeformAddress.split(', ' + state)[0]
    }
    if (address.length == unformattedAddress.freeformAddress.length) {
      if ( unformattedAddress?.streetName ) {
        address = unformattedAddress.streetName
      }
      if ( address.length > 0 && unformattedAddress?.streetNumber ) {
        address = ` ${unformattedAddress.streetNumber}, ${address}`
      }
      if ( address.length == 0 ) {
        address = unformattedAddress.freeformAddress.split(',')[0]
      }
    }
    if(address.includes(city)) {
      address = address.split(', ' + city)[0]
    }
    if(address.includes(state)){
      address = address.split(', ' + state)[0]
    }
    if(address.includes(zipCode)){
      address = address.split(', ' + zipCode)[0]
    }

    return { state, city, zipCode, address }
  }

  trimPostData(data: AddressParams): AddressParams {
    Object.keys(data).map(k => data[k] = typeof data[k] == 'string' ? data[k].trim() : data[k]);
    return data
  }

}
