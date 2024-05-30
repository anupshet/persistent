export class FileProperties {
  content: string;
  rowsHeader: number;
  rowsFooter: number;
  delimiter: string | string[];
  instructionName: string;
  finalData: string;
  instrument: number;
  controlLot: number;
  level: number;
  lotLevel: number;
  analyte: number;
  result: number;
  mean: number;
  sd: number;
  numPts: number;
  calibratorLot: number;
  reagentLot: number;
  date: number;
  time: number;
  dateTime: number;
  dateTimeFormat: string;
  instrumentCode: string;

  reset(): FileProperties {
    this.content = null;
    this.rowsHeader = 0;
    this.rowsFooter = 0;
    this.delimiter = null;
    this.instructionName = '';
    this.finalData = null;
    this.instrument = null;
    this.controlLot = null;
    this.level = null;
    this.lotLevel = null;
    this.analyte = null;
    this.result = null;
    this.mean = null;
    this.sd = null;
    this.numPts = null;
    this.calibratorLot = null;
    this.reagentLot = null;
    this.date = null;
    this.time = null;
    this.dateTime = null;
    this.dateTimeFormat = null;
    this.instrumentCode = '';

    return this;
  }
}
