// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

// The type of statistic we want.
export enum StatisticsTypeEnum{
  LabMeanSD = 1,  // The lab’s mean and SD values.
  PeerMeanSD = 2, // The peer group's mean and SD values.
  MethodMeanSD = 3, // The method group’s mean and SD values.
  None = -1 // reset condition
}

export enum TestSpecItemEnum {
  ReagentLot = 1,
  CalibratorLot = 2
}
