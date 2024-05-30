export class ConnectivityMapDropdowns {
  locationDropdown: Array<DropdownContents>;
  departmentDropdown: Array<DropdownContents>;
  instrumentDropdown: Array<DropdownContents>;
  productDropdown: Array<DropdownContents>;
}

export class DropdownContents {
  name: string;
  productId: string;
  instrumentId: string;
  departmentId: string;
  locationId: string;
}

export class FilterData {
  selectedLocationIds: Array<string>;
  selectedDepartmentIds: Array<string>;
  selectedInstrumentIds: Array<string>;
  selectedProductIds: Array<string>;
}
