/*© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/
import { Injectable } from '@angular/core';

import * as moment from 'moment';
import 'moment-timezone';

import { DefaultDateTimeFormat } from './data-time-formats';
import { UnityDateTime, UnityDateTimeFormatted } from './unity-date-time';
import { LocaleConverter } from '../locale/locale-converter.service';


@Injectable()
export class DateTimeHelper {
  constructor(private localeConverter: LocaleConverter) { }

  getToday(timeZone = '', dateFormat = '', timeFormat = ''): UnityDateTimeFormatted {
    const today = moment().endOf('day');
    return this.getFormattedDateTime(today.toDate(), timeZone, dateFormat, timeFormat);
  }

  getTomorrow(timeZone = '', dateFormat = '', timeFormat = ''): UnityDateTimeFormatted {
    const tomorrow = moment().add(1, 'day').endOf('day');
    return this.getFormattedDateTime(tomorrow.toDate(), timeZone, dateFormat, timeFormat);
  }

  getYesterday(timeZone = '', dateFormat = '', timeFormat = ''): UnityDateTimeFormatted {
    const tomorrow = moment().add(-1, 'day').endOf('day');
    return this.getFormattedDateTime(tomorrow.toDate(), timeZone, dateFormat, timeFormat);
  }

  getLastDayOfPreviousMonth(timeZone = ''): Date {
    const today = moment.tz(timeZone).endOf('day').subtract(1, 'months').endOf('month');
    return today.toDate();
  }

  getNow(timeZone = '', dateFormat = '', timeFormat = ''): UnityDateTimeFormatted {
    return this.getFormattedDateTime(new Date(), timeZone, dateFormat, timeFormat);
  }

  getNowWithInputFormat(timeZone = ''): UnityDateTimeFormatted {
    const dateFormat = DefaultDateTimeFormat.InputDateFormat;
    const timeFormat = DefaultDateTimeFormat.InputTimeFormat;
    return this.getFormattedDateTime(new Date(), timeZone, dateFormat, timeFormat);
  }

  getFormattedDateTime(date: Date, timeZone = '', dateFormat = '', timeFormat = ''): UnityDateTimeFormatted {
    dateFormat = this.GetOrDefaultDateFormat(dateFormat);
    timeFormat = this.GetOrDefaultTimeFormat(timeFormat);
    timeZone = this.GetOrGuessTimeZone(timeZone);

    const tzDate = this.getMomentInTimeZone(date, timeZone);

    return {
      tz: tzDate.tz(),
      tzDateTime: UnityDateTime.Build(tzDate, dateFormat, timeFormat),
      utcDateTime: UnityDateTime.Build(tzDate.utc(), dateFormat, timeFormat),
    };
  }

  formatDateTime(date: Date, timeZone = '', fullFormat = ''): string {
    timeZone = this.GetOrGuessTimeZone(timeZone);
    const tzDate = this.getMomentInTimeZone(date, timeZone);
    return tzDate.format(fullFormat);
  }

  // Convert any date time string to a date time object based on the input time zone.
  // If you pass "2013-11-18" as date and "11:55" as string in "Asia/Taipei" timeZone,
  // it will return a date object with utc value of 2013-11-18T03:55Z
  ConvertToDateFromString(date: string, time: string, timeZone = '', dateFormat = '', timeFormat = ''): Date {
    dateFormat = (dateFormat) ? dateFormat : DefaultDateTimeFormat.InputDateFormat;
    timeFormat = (timeFormat) ? timeFormat : DefaultDateTimeFormat.InputTimeFormat;
    timeZone = this.GetOrGuessTimeZone(timeZone);

    const fullFormat = `${dateFormat} ${timeFormat}`;
    const fullDateTime = `${date} ${time}`;

    const dateTime = moment.tz(fullDateTime, fullFormat, timeZone);
    return dateTime.toDate();
  }

  // It creates a date object based on the input time zone
  ConvertToDateFromDate(dateTime: Date, timeZone = ''): Date {
    timeZone = this.GetOrGuessTimeZone(timeZone);
    // convert the dateTime to string and ignore the time zone
    const dtStr = moment(dateTime).format('YYYY-MM-DD HH:mm:ss.SSS');
    const convertedDateTime = moment.tz(dtStr, timeZone);
    return convertedDateTime.toDate();
  }

  GetOrDefaultDateFormat(dateFormat = ''): string {
    return (dateFormat) ? dateFormat : DefaultDateTimeFormat.DisplayDateFormat;
  }

  GetOrDefaultTimeFormat(timeFormat = ''): string {
    return (timeFormat) ? timeFormat : DefaultDateTimeFormat.DisplayTimeFormat;
  }

  GetOrGuessTimeZone(timeZone = ''): string {
    return (timeZone) ? timeZone : moment.tz.guess();
  }

  getTimeZoneOffset(date: string | Date, timeZone: string): string {
    if (!timeZone) {
      throw new Error('TimeZone must be provided to get offset.');
    }
    return moment(date).tz(timeZone).format('Z');
  }

  isExpired(expirationDate: Date): boolean {
    return this.isExpiredOnSpecificDate(expirationDate, new Date());
  }

  isExpiredOnSpecificDate(
    expirationDate: Date,
    dateTime: Date
  ): boolean {
    const dateObj = new Date(dateTime);
    return new Date(expirationDate) < new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 0, 0, 0, 0);
  }

  private getMomentInTimeZone(date: Date, timeZone = ''): moment.Moment {
    const tzDate = moment(date, null, this.localeConverter.getLocaleWithMomentConversions()).tz(timeZone);
    if (!tzDate.isValid()) {
      throw new Error('Invalid Date Format');
    }
    return tzDate;
  }

  getSomeDaysAheadDate(days: number): string {
    const startDate = new Date();
    const newDate = moment(startDate, 'MM-DD-YYYY').add(days, 'days');
    return moment(newDate).format('MM-DD-YYYY');
  }

  getDifferenceInDays(fromDate: Date, toDate: Date): number {
    // Ensure these are date objects
    fromDate = new Date(fromDate);
    toDate = new Date(toDate);

    return Math.ceil(Math.abs(toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24));
  }

  getTimezoneFormattedDateTime(date: Date, timeZone: string, format: string) {
    const momentDate = moment.tz(date, timeZone).format(format);
    return momentDate;
  }

  sortByDateAsc(array: any, dateKey: string) {
    return array.sort((a, b) => (new Date(a[dateKey]).getTime() - new Date(b[dateKey]).getTime()));
  }

  sortByDateDesc(array: any, dateKey: string) {
    return array.sort((a, b) => (new Date(b[dateKey]).getTime() - new Date(a[dateKey]).getTime()));
  }

  getDateBeforeDifferenceInDays(fromDate: Date, days: number) {
    // get date number of days before the fromDate
    return moment(fromDate).subtract(days, 'days').toDate();
  }

  getDateAfterDifferenceInDays(fromDate: Date, days: number) {
    // get date number of days after the fromDate
    return moment(fromDate).add(days, 'days').toDate();
  }

  getDateOneYearBefore(fromDate: Date) {
    // get date 1 year before fromDate
    return moment(fromDate).subtract(1, 'years').add(1, 'days').startOf('day').toDate();
  }

  getStartDate(date: Date) {
    // get date with start of day (eg. 00:00:00)
    return moment(date).startOf('day').toDate();
  }
  getEndDate(date: Date) {
    // get date with end of day (eg. 23:59:59)
    return moment(date).endOf('day').toDate();
  }

  convertDateToUTCWithoutTime(date: Date): Date {
    if (date) {
      const getYear = date.getFullYear();
      const getMonth = date.getMonth();
      const getDate = date.getDate();
      return new Date(Date.UTC(getYear, getMonth, getDate, 0, 0, 0));
    }
  }

  /**
   * Converts date '202306' to June 2023 string
   * @param dateString date string in 'YYYYMM' format
   * @param format format of the date - 'MMMM YYYY'
   * @returns date string
   */
  getYearAndMonth(dateString: string, format: string) {
    const date = moment(dateString, 'YYYYMM').format(format);
    return date;
  }
}
