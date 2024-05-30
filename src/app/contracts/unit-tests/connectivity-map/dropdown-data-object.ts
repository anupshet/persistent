import {
  ConnectivityMapDropdowns,
  DropdownContents
} from '../../models/connectivity-map/connectivity-map-dropdowns.model';

export class DropdownDataObject {
  static locationDropdown: Array<DropdownContents> = [
    {
      name: 'Location1',
      productId: null,
      instrumentId: null,
      departmentId: null,
      locationId: 'LocationId1'
    }
  ];

  static departmentDropdown: Array<DropdownContents> = [
    {
      name: 'Location1',
      productId: null,
      instrumentId: null,
      departmentId: 'DepartmentId1',
      locationId: 'LocationId1'
    }
  ];

  static instrumentDropdown: Array<DropdownContents> = [
    {
      name: 'Location1',
      productId: null,
      instrumentId: 'InstrumentId1',
      departmentId: 'DepartmentId1',
      locationId: 'LocationId1'
    }
  ];

  static productDropdown: Array<DropdownContents> = [
    {
      name: 'Location1',
      productId: 'ProductId1',
      instrumentId: 'InstrumentId1',
      departmentId: 'DepartmentId1',
      locationId: 'LocationId1'
    }
  ];

  static connectivityMapDropdowns: ConnectivityMapDropdowns = {
    locationDropdown: DropdownDataObject.locationDropdown,
    departmentDropdown: DropdownDataObject.departmentDropdown,
    instrumentDropdown: DropdownDataObject.instrumentDropdown,
    productDropdown: DropdownDataObject.productDropdown
  };
}
