import { AccountSettings } from './account-settings.model';

export class LabTree {
  id: number;
  name: string;
  locations: Location[];
  children: any[]; // TODO: remove any type
  primaryUnityLabNumbers?: string; // Needed for migration feature
  accountSettings?: AccountSettings;
}

class Location {
  id: number;
  labId: number;
  name: string;
  departments: Department[];
}

class Department {
  id: number;
  locationId: number;
  name: string;
  instruments: Instrument[];
}

class Instrument {
  id: number;
  DepartmentId: number;
  name: string;
  products: Product[];
}

class Product {
  id: number;
  instrumentId: number;
  name: string;
  labTests: LabTest[];
}

export class LabTest {
  id: number;
  labInstrumentProductLotId: number;
  locationId: number;
  testId: number;
  tests: Test[];
  type: number;
  unitId: number;
}

class Test {
  id: number;
  analyteName: string;
  labTestId: number;
  locationId: number;
  name: string;
  testSpeId: number;
  type: number;
}
