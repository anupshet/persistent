// © 2023 Bio-Rad Laboratories, Inc.All Rights Reserved.
import { ReviewStatus } from './review-status.model';

export class LabLotTest {
  id: string;
  analyteName: string;
  manufacturerName: string;
  departmentName: string;
  instrumentName: string;
  instrumentCustomName: string;
  instrumentId: string;
  controlName: string;
  controlCustomName: string;
  controlLotNumber: string;
  reagentName: string;
  isMicroslide: boolean;
  availableReagentLotMetadata: Array<ReagentLotMetadata>;
  lastRunReagentLotId: number;
  lastRunReagentLotName: string;
  reviewStatus: ReviewStatus = ReviewStatus.Empty;
  slideGenSchedules?: Array<SlideGenSchedule>;
  controlExpirationDate: string;
}

export class ReagentLotMetadata {
  id: number;
  name: string;
}

export enum LabLotTestType {
  Microslide = 'microslide',
  All = 'all'
}

export class ConnectivitySlideGenListValidator {
  startMinValue: Date;
  startMaxValue: Date;
  endMinValue: Date;
  endMaxValue: Date;
  isRowInValid: boolean;
  isDuplicateReagentLot: boolean;
}

export class SlideGenSchedule {
  labLotTestId: string;
  reagentLotId: number;
  startDate: Date;
  endDate: Date;
}
