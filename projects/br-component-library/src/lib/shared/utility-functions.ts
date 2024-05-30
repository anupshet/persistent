import * as moment_ from 'moment';
import { Renderer2 } from '@angular/core';
const timePartHours = 0;
const timePartMinutes = 1;

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function isEmpty(value) {
  if (!value) {
    return true;
  }
  return value == null || trim(value) === '' || value.length === 0;
}

export function isNotEmpty(value) {
  return !this.isEmpty(value);
}

export function trim(value) {
  if (value && value.trim) {
    return value.trim();
  }
  return value;
}

export function isNumeric(value): boolean {
  // parseFloat NaNs numeric-cast false positives (null|true|false|"")
  // ...but misinterprets leading-number strings, particularly hex literals ("0x...")
  // subtraction forces infinities to NaN
  // adding 1 corrects loss of precision from parseFloat (#15100)
  return !Array.isArray(value) && (value - parseFloat(value) + 1) >= 0;
}

export function calculateRunEntryTabIndex(colIndex: number, rowIndex: number, analyteIndex: number,
  numberOfLabels: number, numberOfLevels: number): number {
  const colIndexOffset = colIndex + 1;
  const rowIndexOffset = rowIndex + 1;
  const analyteIndexOffset = analyteIndex + 1;

  const maxNumberInRun = numberOfLevels * numberOfLabels;
  const analyteColNumber = ( numberOfLabels * (colIndexOffset - 1)) + rowIndexOffset;
  const paddedAnalyteColNumber = analyteColNumber.toLocaleString('en-US', {
    style: 'decimal',
    minimumIntegerDigits: maxNumberInRun.toString().length,
    useGrouping: false
  });
  const runIndexString = analyteIndexOffset + paddedAnalyteColNumber;
  return Number(runIndexString);
}

export function calculateLevelEntryTabIndex(colIndex: number, rowIndex: number, analyteIndex: number,
  numberOfLabels: number, totalAnalytes: number): number {
  const colIndexOffset = colIndex + 1;
  const rowIndexOffset = rowIndex + 1;
  const analyteIndexOffset = analyteIndex + 1;

  const maxRows = totalAnalytes * numberOfLabels;
  const analyteRowNumber = ( numberOfLabels * (analyteIndexOffset - 1)) + rowIndexOffset;
  const paddedAnalyteRowNumber = analyteRowNumber.toLocaleString('en-US', {
    style: 'decimal',
    minimumIntegerDigits: maxRows.toString().length,
    useGrouping: false
  });
  const levelIndexString =  colIndexOffset + paddedAnalyteRowNumber;
  return Number(levelIndexString);
}

export function getTimeZoneAdjustedDateTime(browserDateTime: Date, timeZoneOffset: string): Date {
  const moment = moment_;
  const newDate = new Date(browserDateTime);

  const currentTimeOffset = moment(newDate).format('Z');
  const currentOffsetHour = getTimePart(currentTimeOffset, timePartHours);
  const currentOffsetMinute = getTimePart(currentTimeOffset, timePartMinutes);
  const timeZoneOffsetHour = getTimePart(timeZoneOffset, timePartHours);
  const timeZoneOffsetMinute = getTimePart(timeZoneOffset, timePartMinutes);

  const offsetHourDiff = timeZoneOffsetHour - currentOffsetHour;
  const offsetMinuteDiff = timeZoneOffsetMinute - currentOffsetMinute;

  newDate.setHours(newDate.getHours() + offsetHourDiff);
  newDate.setMinutes(newDate.getMinutes() + offsetMinuteDiff);

  return newDate;
}

export function getBrowserAdjustedDateTime(labDateTime: Date, timeZoneOffset: string): Date {
  const moment = moment_;
  const newDate = new Date(labDateTime);
  const currentTimeOffset = moment(newDate).format('Z');
  const currentOffsetHour = getTimePart(currentTimeOffset, timePartHours);
  const currentOffsetMinute = getTimePart(currentTimeOffset, timePartMinutes);
  const timeZoneOffsetHour = getTimePart(timeZoneOffset, timePartHours);
  const timeZoneOffsetMinute = getTimePart(timeZoneOffset, timePartMinutes);

  const offsetHourDiff = timeZoneOffsetHour - currentOffsetHour;
  const offsetMinuteDiff = timeZoneOffsetMinute - currentOffsetMinute;

  newDate.setHours(newDate.getHours() - offsetHourDiff);
  newDate.setMinutes(newDate.getMinutes() - offsetMinuteDiff);

  return newDate;
}

export function getTime(dateTime: Date): string {
  const hour = dateTime.getHours();
  const min = dateTime.getMinutes();
  const time = (hour < 10 ? '0' : '') + hour
                  + ':' +
                  (min < 10 ? '0' : '') + min;
  return time;
}

export function setTime(date: Date, time: string): Date {
  const newDate = new Date(date);
  newDate.setHours(getTimePart(time, timePartHours));
  newDate.setMinutes(getTimePart(time, timePartMinutes));
  return newDate;
}

export function getTimePart(time: string, timePart: number): number {
  if (time) {
    return Number(time.split(':')[timePart]);
  }
  return undefined;
}

export function hasTimeParts(time: string): boolean {
  const hour = getTimePart(time, timePartHours);
  const minutes = getTimePart(time, timePartMinutes);
  if ( (0 <= hour && hour < 24) && (0 <= minutes && minutes < 60) ) {
    return true;
  }
  return false;
}

export function isTimeInputSupported(renderer: Renderer2): boolean {
    // test whether a new date input falls back to a text input or not
    const test = renderer.createElement('input');
    test.setAttribute('type', 'time');
    // If type is text time is not supported
    if (test.type === 'text') {
      return false;
    }
    return true;
}

export function isPreviousYear(yearToTest: Date, yearToTestAgainst: Date) {
  return (yearToTest.getFullYear() < yearToTestAgainst.getFullYear());
}

export function compareString(a: string, b: string, isAscending: boolean) {
  return (a < b ? -1 : 1) * (isAscending ? 1 : -1);
}
export function compareDate(a: Date, b: Date, isAscending: boolean) {
  return isAscending ? new Date(a).getTime() - new Date(b).getTime() : new Date(b).getTime() - new Date(a).getTime();
}

export function isValidRegex(stringToValidate: string, regularExpressionToMatch: RegExp) {
  return regularExpressionToMatch.test(stringToValidate);
}

export function getOffset(date: Date, timeZone?: string): string {
  const moment = moment_;
  return timeZone
    ? moment(date).tz(timeZone).format('Z')
    : moment(date).format('Z');
}

export function hasValue(value) {
  return value !== null && value !== undefined;
}

export function getCalculatedCV(mean: number, sd: number) {
  return (sd / Math.abs(mean)) * 100;
}

export function getCalculatedSD(mean: number, cv: number) {
  return (cv * Math.abs(mean)) / 100;
}
