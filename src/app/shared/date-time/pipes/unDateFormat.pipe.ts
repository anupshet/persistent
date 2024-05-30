// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'unDateFormatPipe',
})

export class UnDateFormatPipe implements PipeTransform {
  constructor() { }

 transform(expirationDate: string) {
    const usersCurrentSystemDate = new Date();
    const datePipe = new DatePipe('en-US');
    const expirationDateValue = new Date(expirationDate);
    const usersCurrentSystemYear = usersCurrentSystemDate.getFullYear();
    if (usersCurrentSystemYear === expirationDateValue.getFullYear()) {
      return convertToCustomExpirationDate(expirationDate);
    } else {
      expirationDate = datePipe.transform(expirationDate, 'MMM d yyyy');
      return expirationDate;
    }
  }
}

function convertToCustomExpirationDate(getExpirationDateValue: string) {
  const expirationDateConversion = new Date(getExpirationDateValue),
  differenceInDate = (((new Date()).getTime() - expirationDateConversion.getTime()) / 1000),
  dayDifference = Math.floor(differenceInDate / 86400);
  const datePipe = new DatePipe('en-US');
  const dateWithMonthAndYear = datePipe.transform(expirationDateConversion, 'MMM d');
  if (isNaN(dayDifference)) {
    return '';
  } else {
    return dateWithMonthAndYear;
  }
}
