import { Injectable } from '@angular/core';

@Injectable()
export class ParsingEngineAdapterService {
  private parsingEngine: any;
  private engineSettings: any;
  private rawDataSettings: any;
  private recordDataSettings: any;
  private fieldDataSettings: any;
  private rawDataSteps: any;
  private recordDataSteps: any;
  private fieldDataSteps: any;
  public steps: Array<string>;
  private data: string;
  private supportedFields: any;

  // Using hard-coded strings for "cleanliness" given this functionality
  // is expected to be thrown away
  private readonly MEAN_FIELD = 'mean';
  private readonly SD_FIELD = 'sd';
  private readonly NUMPTS_FIELD = 'numPts';
  // (end)

  constructor() {
    this.parsingEngine = require('./ngParsingEngine').ParsingEngine;
    const engine = new this.parsingEngine.WebParsingEngine('', []);
    engine.run().then(engineData => {
      this.supportedFields = engineData.formatter.supportedFieldTypes;
    });
    this.engineSettings = engine.defaultEngineSetup();
    this.rawDataSettings = this.engineSettings;
    this.recordDataSettings = this.engineSettings.transitionToData;
    this.fieldDataSettings = this.engineSettings.transitionToData.transitionToData;
    this.rawDataSteps = this.rawDataSettings.steps;
    this.recordDataSteps = this.recordDataSettings.supportedSteps;
    this.fieldDataSteps = this.fieldDataSettings.supportedSteps;
    this.steps = [];
  }

  public runEngine() {
    const engine = new this.parsingEngine.WebParsingEngine(
      this.data,
      this.steps
    );

    return engine.run();
  }

  public getSteps() {
    return this.steps;
  }

  public resetSteps() {
    this.steps = [];
    return this.steps;
  }

  public addStep(step) {
    this.steps.push(step);
    return this.steps;
  }

  public setSteps(steps) {
    this.steps = Object.assign([], steps);
    return this.steps;
  }

  public getRawDataSteps() {
    return this.rawDataSteps;
  }

  public getRecordDataSteps() {
    return this.recordDataSteps;
  }

  public getFieldDataSteps() {
    return this.fieldDataSteps;
  }

  public setData(data) {
    this.data = data;
  }

  public getData() {
    return this.data;
  }

  public getSupportedFields() {
    return this.supportedFields;
  }

  // Commands
  public getNormalizeLineEndingCommand() {
    return this.rawDataSteps.normalizeLineEnding.getCommandString([]);
  }

  public getSplitByRecordDelimiterCommand(delimiter = '\n') {
    return this.rawDataSteps.splitByRecordDelimiter.getCommandString([
      delimiter
    ]);
  }

  public getRemoveHeaderRowsCommand(rowsToRemove: number) {
    return this.recordDataSteps.removeHeaderRows.getCommandString([
      rowsToRemove
    ]);
  }

  public getRemoveFooterRowsCommand(rowsToRemove: number) {
    return this.recordDataSteps.removeFooterRows.getCommandString([
      rowsToRemove
    ]);
  }

  public getSplitByFieldDelimiterCommand(delimiter: string) {
    return this.recordDataSteps.splitByFieldDelimiter.getCommandString([
      delimiter
    ]);
  }

  public getSplitByFieldRegexDelimiterCommand(delimiter: Array<string>) {
    return this.recordDataSteps.splitByFieldRegexDelimiter.getCommandString(
      delimiter
    );
  }

  public getConcatenateFieldsCommand(commaSeparatedFields: string) {
    return this.fieldDataSteps.concatenateFields.getCommandString([
      commaSeparatedFields
    ]);
  }

  public getFormatDateTimeCommand(fieldIndex: number, dateTimeFormat: string) {
    return this.fieldDataSteps.formatDateTime.getCommandString([
      fieldIndex.toString(),
      dateTimeFormat
    ]);
  }

  public getSaveFieldCommand(fieldName: string, fieldIndex: number) {
    return this.fieldDataSteps.saveField.getCommandString([
      fieldName,
      fieldIndex.toString()
    ]);
  }

  public getSaveInstrumentFieldCommand(fieldIndex: number) {
    return this.fieldDataSteps.saveField.getCommandString([
      this.supportedFields.INSTRUMENT,
      fieldIndex.toString()
    ]);
  }

  public getSaveControlLotFieldCommand(fieldIndex: number) {
    return this.fieldDataSteps.saveField.getCommandString([
      this.supportedFields.CONTROL_LOT,
      fieldIndex.toString()
    ]);
  }

  public getSaveAnalyteFieldCommand(fieldIndex: number) {
    return this.fieldDataSteps.saveField.getCommandString([
      this.supportedFields.ANALYTE,
      fieldIndex.toString()
    ]);
  }

  public getSaveDateTimeFieldCommand(fieldIndex: number) {
    return this.fieldDataSteps.saveField.getCommandString([
      this.supportedFields.DATETIME,
      fieldIndex.toString()
    ]);
  }

  public getSaveResultFieldCommand(fieldIndex: number) {
    return this.fieldDataSteps.saveField.getCommandString([
      this.supportedFields.RESULT,
      fieldIndex.toString()
    ]);
  }

  public getSaveCalibratorLotFieldCommand(fieldIndex: number) {
    return this.fieldDataSteps.saveField.getCommandString([
      this.supportedFields.CALIBRATOR_LOT,
      fieldIndex.toString()
    ]);
  }

  public getSaveReagentLotFieldCommand(fieldIndex: number) {
    return this.fieldDataSteps.saveField.getCommandString([
      this.supportedFields.REAGENT_LOT,
      fieldIndex.toString()
    ]);
  }

   public getSaveMeanFieldCommand(fieldIndex: number) {
    return this.fieldDataSteps.saveField.getCommandString([
      this.MEAN_FIELD,
      fieldIndex.toString()
    ]);
  }

  public getSaveSdFieldCommand(fieldIndex: number) {
    return this.fieldDataSteps.saveField.getCommandString([
      this.SD_FIELD,
      fieldIndex.toString()
    ]);
  }

  public getSaveNumPtsFieldCommand(fieldIndex: number) {
    return this.fieldDataSteps.saveField.getCommandString([
      this.NUMPTS_FIELD,
      fieldIndex.toString()
    ]);
  }

 public getAssignStaticCodeCommand(fieldName: string, staticCode: string) {
    return this.fieldDataSteps.assignStaticCode.getCommandString([
      fieldName,
      staticCode
    ]);
  }

  public getAssignStaticInstrumentCodeCommand(staticCode: string) {
    return this.fieldDataSteps.assignStaticCode.getCommandString([
      this.supportedFields.INSTRUMENT,
      staticCode
    ]);
  }

  public getCleanDataByRegexSubCommand(regex: string) {
    return this.fieldDataSteps.cleanData.getCommandString(['trimByRegex', regex]);
  }

  public getUseSummaryDataCommand() {
    return this.rawDataSteps.useSummaryFormatter.getCommandString();
  }

  public getConvertToBioRadJsonCommand() {
    return this.fieldDataSteps.convertToBioRadJson.getCommandString([]);
  }
}
