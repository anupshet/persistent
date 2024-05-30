
export class DataTimeFormat {
  public static ShortDate = 'MM DD, YYYY'; // 4/18/2019
  public static ShortDateWithMonthName = 'MMM DD, YYYY'; // Aug 14, 2018

  public static MilitaryShortTimeWithTimeZone = 'hh:mm A Z'; // 03:03 PM -04:00
  public static MilitaryShortTime = 'hh:mm A'; // 03:03 PM

  public static StandardShortTimeWithTimeZone = 'HH:mm Z'; // 03:03 PM -04:00
  public static StandardShortTime = 'HH:mm'; // 20:00

  public static ShortDateWithFullMonthName = 'MMMM DD, YYYY'; // August 14, 2018
  public static ShortDateWithMonthAndYear = 'MMMM YYYY'; // August 2018
}

export class DefaultDateTimeFormat {
  public static DisplayDateFormat = DataTimeFormat.ShortDateWithMonthName; // Aug 14, 2018
  public static DisplayTimeFormat = DataTimeFormat.MilitaryShortTime; // 03:03 PM

  public static InputDateFormat = DataTimeFormat.ShortDate;
  public static InputTimeFormat = DataTimeFormat.StandardShortTime;

  public static DisplayDateFullMonthFormat = DataTimeFormat.ShortDateWithFullMonthName; // August 14, 2018
  public static DisplayDateMonthAndYearFormat = DataTimeFormat.ShortDateWithMonthAndYear; // August 2018
}
