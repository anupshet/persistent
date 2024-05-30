// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
export class ReportFilters {
    filterCondition: {
        lotFilter: Array<number>;
        instrumentFilter: Array<String>;
        departmentFilter?: Array<String>;
        analyteFilter?: Array<String>
    };
}
export class GenerateReport {
    labLocationId: string;
    templateId: string;
    reportType: string;
    yearMonth: string;
    accountNumber: string;
    labTimeZone: string;
}
