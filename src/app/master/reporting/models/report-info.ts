// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { IFilter } from '../reporting.enum';

export class ReportInfo {
  labInstrumentNodeId: string;
  labLocationId: string;
  reportType: string;
  corrective_action: CorrectiveAction;
}

export class CorrectiveAction {
  yearMonth: string;
  languageCode: string;
  departmentName: string;
  departmentSupervisorName: string;
  entityId: string;
  customInstrumentName: string;
  labTimeZone: string;
  streetAddress: string;
  streetAddress2: string;
  city: string;
  subDivision: string;
  country: string;
  zipCode: string;
  labName: string;
  accountName: string;
  reportSignee: ReportSignee;
}

export class ReportSignee {
  comments: string;
  signedBy: string;
  signedOn: string;
}
export class Filter {
  isFiltered: boolean;
  isChecked: boolean;
  tooltipData: TooltipData;
  isDisabled: boolean;
  reloadTooltipData?: boolean;
}
export class GroupResponse {
  id: String;
  name: String;
  parentId: String;
  nodeType: number;
}
export class LocationResponse extends Filter {
  id: String;
  name: String;
  parentId: String;
  nodeType: number;
  instrumentGroupByDept: boolean;
}
export class DepartmentResponse extends Filter {
  id: String;
  name: String;
  parentId: String;
  nodeType: number;
}
export class GroupInstrumentResponse extends Filter {
  name: String;
  codelistInstrumentId: number;
  groups: Array<InstrumentResponse>;
}
export class InstrumentResponse extends Filter {
  id: String;
  name: String;
  parentId: String;
  instrumentCustomName: String;
  serialNumber: String;
  instrumentId: number;
  manufacturerId: number;
  manufacturerName: String;
  nodeType: number;
}
export class GroupControlResponse extends Filter {
  name: String;
  masterLotProductId: number;
  groups: Array<ControlResponse>;
}
export class ControlResponse extends Filter {
  id: String;
  name: String;
  parentId: String;
  productCustomName: String;
  lotNumber: String;
  productId: number;
  productMasterLotId: number;
  nodeType: number;
  lotExpiryDate: Date;
}

export class AnalyteResponse extends Filter {
  id: String;
  name: String;
  parentId: Array<String>;
  nodeType: number;
  analyteId: number;
}

export class LabConfigResponse extends Filter {
  id: String;
  accountName: String;
  accountNumber: String;
  nodeType: number;
  groups: Array<GroupResponse>;
  locations: Array<LocationResponse>;
  departments: Array<DepartmentResponse>;
  instruments: Array<GroupInstrumentResponse>;
  controls: Array<GroupControlResponse>;
  analytes: Array<AnalyteResponse>;
  directionIndex: number;
  isTemplate: boolean;
}

export interface LabConfigSelection {
  type: string;
  index: number;
  subIndex: number;
}

export class CategoryItem {
  name: String;
  id: String;
  matched?: boolean;
}
export class GroupItem extends CategoryItem {
  groups: Array<CategoryItem>;
}
export class TooltipData {
  category: string;
  data: GroupItem | GroupItem[];
  heading: string;
  subheading: string;
}

export class SearchFilterData {
  filter: string;
  keyword: string;
}

export interface SelectionParameters {
  selected?: boolean;
  lastSelectedIndex?: number;
}
export interface OutlieredLots extends SelectionParameters {
  instrumentId: string;
  instrumentName: string;
  customName?: string;
  serialNumber?: string;
  controls: ControlInfo[];
}
export interface ControlInfo extends SelectionParameters {
  controlName: string;
  lots: ProductMasterLots[];
  customNameOrSerialNumber?: string;
}

export interface ProductMasterLots extends LotData, SelectionParameters {
  lotNumber?: string;
  masterLotId: number;
  customName?: string;
}
export interface PdfResponse {
  dynReportType: string;
  isTempReport: boolean;
  metaId: string;
  outlieredLots: OutlieredLots[];
  pdfUrl: string;
  yearMonth: string;
  templateBody?: {
    filterCondition: IFilter
  };
  templateId?: string;
  templateName?: string;
}

export interface SavePdfResponse {
  labLocationId: string;
  reportType: string;
  tempReportFileName: string;
  metaId: string;
  templateId: string;
  yearMonth: string;
  languageCode: string;
  labTimeZone: string;
  streetAddress: string;
  streetAddress2: string;
  city: string;
  subDivision: string;
  country: string;
  labName: string;
  accountNumber: string;
  correctiveActions?: CorrectiveActionInfo;
  reportSignee?: {
    signedBy: string;
    signedOn: Date
  };
}

export class CorrectiveActionInfo {
  instrumentInfo: InstrumentData[];
  allLotsComment?: string;
}
export class InstrumentData {
  instrumentId: string;
  control: ProductMasterLots[];
}
export interface LotData {
  isDisabled?: boolean;
  displayName?: string;
  instrumentId?: string;
  originIndex?: number;
}

export interface CorrectiveActionsFormValue {
  isSelectAllDisabled: boolean;
  isSelected: boolean;
  lotComment: string;
  lotData: OutlieredLots[];
  lots: ProductMasterLots[];
  previousOptions: ProductMasterLots[];
  selectedOptions: ProductMasterLots[];
}


export interface SearchObject {
    reportDate: Date;
    fromQuickReports: boolean;
  }
