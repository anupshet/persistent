// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable } from '@angular/core';

import { Requester, Facility, LabContact } from '../models/new-config-requester.model';
import { LabLocation } from '../../contracts/models/lab-setup';

@Injectable({
  providedIn: 'root'
})
export class RequestNewConfigHelperService {
  labId: string;
  facility: Facility;
  labContact: LabContact;

  constructor() { }

  setRequesterData(location: LabLocation) {
    this.labId = location.parentNodeId.toString();
    this.setFacility(location);
    this.setLabContact(location);
  }

  private setFacility(location: LabLocation) {
    this.facility = new Facility(
      location.displayName,
      location?.labLocationAddress?.streetAddress,
      location?.labLocationAddress?.streetAddress2,
      location?.labLocationAddress?.city,
      location?.labLocationAddress?.country,
      location?.labLocationAddress?.zipCode
    );
  }

  private setLabContact(location: LabLocation) {
    this.labContact = new LabContact(location?.labLocationContact?.name, '', location?.labLocationContact?.phone);
  }

  getRequester() {
    return new Requester(this.labId, this.facility, this.labContact);
  }
}
