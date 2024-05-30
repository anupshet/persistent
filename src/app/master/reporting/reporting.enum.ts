// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
export enum LabConfig {
  lot = 'LOT',
  departmentDetails = 'Department Details',
  instrumentDetails = 'Instrument Details',
  locationDetails = 'Location Details',
  controlDetails = 'Control Details',
  analyteDetails = 'Analyte Details',
  locationAndDepartment = 'Location and Department',
  instrumentGroup = 'InstrumentGroup',
  controlGroup = 'ControlGroup',
  instrument = 'Instrument',
  controlAndLot = 'Control And Lot',
  control = 'Control',
  department = 'Department',
  location = 'Location',
  analyte = 'Analyte'
}

export enum SelectionDirection {
  clear = 0,
  department = 1,
  instrument = 2,
  control = 3,
  analyte = 4
}

export enum LabConfigKeys {
  departments = 'departments',
  analytes = 'analytes',
  instruments = 'instruments',
  controls = 'controls'
}

export interface ITemplate {
  labLocationId: string;
  templateName: string;
  templateBody?: ITemplateBody;
  id?: string;
  accountId?: string;
  oktaId?: string;
  isOwner?: boolean;
  isTemp?: boolean;
  isRename?: boolean;
  yearMonth?: string;
  isEditReport?: boolean;
}

export interface ITemplateBody {
  filterCondition: IFilter;
}

export interface IFilter {
  lotFilter?: String[];
  instrumentFilter?: String[];
  departmentFilter?: String[];
  analyteFilter?: number[];
  reportType?: string;
  filterBaseColumn?: number;
}
