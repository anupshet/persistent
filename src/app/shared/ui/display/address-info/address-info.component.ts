// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { Component, Input } from '@angular/core';
import { Address } from '../../../../contracts/models/account-management/address.model';

@Component({
  selector: 'unext-address-info',
  templateUrl: './address-info.component.html',
  styleUrls: ['./address-info.component.scss']
})
export class AddressInfoComponent {
  @Input() address: Address;

  constructor() { }
}
