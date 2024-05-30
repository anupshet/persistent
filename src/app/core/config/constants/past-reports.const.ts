export const months: Array<string> = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  export const reportTypes: Array<string> = [
    'Monthly Evaluation',
    'Lab Comparison',
    'Lab Histogram'
  ];

  export const PastReportsFilterReportList: Array<any> = [
    {name: 'REPORTPANEL.ALLREPORTS', value: '0_1_2'},
    {name: 'REPORTPANEL.EVALUATION', value: '0'},
    {name: 'REPORTPANEL.LABCOMPARISON', value: '1'},
    {name: 'REPORTPANEL.HISTOGRAM', value: '2'}
  ];

  export class PastReportList {
    id: string;
    name: string;
    type: string;
    year: number;
    month: number;
    signedBy: string;
    downloadFileName: string;
    createdOn: string;
    viewPreSigned: string;
    downloadPreSigned: string;
    templateName: string;
    templateId: string;
  }

// localization date format
export const localizationDateFormat0 = 'MMMM D, YYYY';
export const localizationDateFormat1 = 'D MMMM YYYY';
export const localizationDateFormat2 = 'YYYY年MMMMD日';
