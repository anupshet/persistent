/*© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/

import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { Observable, of } from "rxjs";
import { Autofixture } from "ts-autofixture/dist/src";

import { ApiService } from "../api/api.service";
import { LocationUtilitiesService } from "./location-utilities.service";

const apiResponse = {
  "summary": {
    "query": "21 technology drive irvine ca 92618",
    "queryType": "NON_NEAR",
    "queryTime": 104,
    "numResults": 1,
    "offset": 0,
    "totalResults": 97,
    "fuzzyLevel": 3,
    "queryIntent": ['']
  },
  "results": [
    {
      "type": "Address Range",
      "id": "VL5bhj20a8mnrmUQeWYeRQ",
      "score": 11.8342285156,
      "address": {
        "streetNumber": "21",
        "streetName": "Technology Drive",
        "municipality": "Irvine",
        "countrySecondarySubdivision": "Orange",
        "countrySubdivision": "CA",
        "countrySubdivisionName": "California",
        "postalCode": "92618",
        "extendedPostalCode": "92618-2334",
        "countryCode": "US",
        "country": "United States",
        "countryCodeISO3": "USA",
        "freeformAddress": "21 Technology Drive, Irvine, CA 92618",
        "localName": "Irvine"
      },
      "position": { "lat": 33.65162, "lon": -117.7382 },
      "viewport": {
        "topLeftPoint": { "lat": 33.65164, "lon": -117.73815 },
        "btmRightPoint": { "lat": 33.65075, "lon": -117.73755 }
      },
      "addressRanges": {
        "rangeRight": "21 - 21",
        "from": { "lat": 33.65164, "lon": -117.73815 },
        "to": { "lat": 33.65075, "lon": -117.73755 }
      }
    }
  ]
};

describe('LocationUtilitiesService', () => {
  let service: LocationUtilitiesService;
  const autofixture = new Autofixture();
  const postTestData = autofixture.create(apiResponse);

  const address= {
    address: "xyz",
    country: "Mexico",
    state: "Yucatan",
    city: "Merida",
    zipCode: "55555",
  }

  //TODO: replace any
  const apiServiceSpy = {
    post: (): Observable<any> => {
      return of(postTestData);
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        LocationUtilitiesService,
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    });
    service = TestBed.inject(LocationUtilitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should validate address in api successfully', () => {
    spyOn(apiServiceSpy, 'post').and.returnValue(of(postTestData));
    service.validateAddress(address);
    expect(apiServiceSpy.post).toBeTruthy();
    expect(apiServiceSpy.post).toHaveBeenCalled();
  });
})
