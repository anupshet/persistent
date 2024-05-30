// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import * as _ from 'lodash';

import { Lab } from './models/lab.model';
import { MonthlyReport } from './models/monthly-report';
import { EntityType } from '../../../contracts/enums/entity-type.enum';
import { InstrumentReportRequestInfo } from './models/instrument-report-request-info';
import { AnalyteReportInfo } from './models/analyte-report-info';
import { ProductReportInfo } from './models/product-report-info';
import { ReportLevel } from '../../../contracts/enums/report-level';
import { ReportUser } from './models/report-user';
import { LabInstrument } from '../../../contracts/models/lab-setup/instrument.model';
import { LabProduct } from '../../../contracts/models/lab-setup/product.model';
import { LabTest } from '../../../contracts/models/lab-setup';

@Injectable()
export class ReportHelperService {
  createReport = new Subject<{
    node: any,
    selectedYear: number,
    langCode: string,
    lab: Lab,
    selectedMonth: number,
    nodeWithGrandchildren: LabInstrument
  }>();

  testSpecIdsMatrix = [];

  setTestSpecIdsMatrix(arr) {
    this.testSpecIdsMatrix = arr;
  }

  getReportRequestInfo(ancestors: any,
    node: any,
    locationId: string,
    yearMonth: number,
    langCode: string,
    lab: Lab,
    nodeWithGrandchildren: LabInstrument,
    fromNotification: boolean
  ): any {
    let reportRequest = new MonthlyReport();

    reportRequest.yearMonth = yearMonth;
    reportRequest.locationId = locationId;
    reportRequest.languageCode = langCode;
    reportRequest.deptName = '';
    reportRequest.deptSupervisorName = '';

    if (ancestors.length > 0) {
      // Cycle through ancestors to find information and populate
      for (const ancestor of ancestors) {
        if (ancestor.nodeType === EntityType.Account) {
          reportRequest.accountName = ancestor.accountNumber;
          reportRequest.deptSupervisorName = ancestor.accountContact.name;
        }
        if (ancestor.nodeType === EntityType.Lab) {
          reportRequest.labName = ancestor.displayName;
        }
        if (ancestor.nodeType === EntityType.LabLocation) {
          reportRequest.labTimeZone = ancestor.locationTimeZone;
          reportRequest.streetAddress = ancestor.labLocationAddress.streetAddress || '';
          reportRequest.streetAddress2 = ancestor.labLocationAddress.streetAddress2;
          reportRequest.city = ancestor.labLocationAddress.city;
          reportRequest.subDivision = ancestor.labLocationAddress.state;
          reportRequest.country = ancestor.labLocationAddress.country;
          reportRequest.zipcode = ancestor.labLocationAddress.zipCode;
        }
        if (ancestor.nodeType === EntityType.LabDepartment) {
          reportRequest.deptSupervisorName = ancestor.departmentManager.name;
          reportRequest.deptName = ancestor.displayName;
        }
        if (ancestor.nodeType === EntityType.LabInstrument) {
          reportRequest.entityId = ancestor.id;
          reportRequest.customInstrumentName = ancestor.displayName;
        }
      }
    }

    reportRequest.reportSignee = new ReportUser();
    reportRequest.reportSignee.comments = lab.comments || '';
    reportRequest.reportSignee.signedBy = lab.signedBy || '';
    reportRequest.reportSignee.signedOn = lab.signedOn || new Date();

    const instrumentReportRequest = Object.assign(new InstrumentReportRequestInfo(), reportRequest);
    instrumentReportRequest.entityId = nodeWithGrandchildren.id;
    instrumentReportRequest.instrumentInfo.instrumentId = nodeWithGrandchildren.instrumentId;
    instrumentReportRequest.instrumentInfo.instrumentName = nodeWithGrandchildren.displayName;
    instrumentReportRequest.instrumentInfo.productInfos =
      this.getProductInfoList(nodeWithGrandchildren.children, lab.commentsDict, fromNotification);

    reportRequest = instrumentReportRequest;
    return reportRequest;
  }

  getReportLevelFromEntityType(entityType: EntityType): ReportLevel {
    let reportLevel: ReportLevel;

    switch (entityType) {
      case EntityType.LabTest:
        reportLevel = ReportLevel.Analyte;
        break;
      case EntityType.LabProduct:
        reportLevel = ReportLevel.Product;
        break;
      case EntityType.LabInstrument:
        reportLevel = ReportLevel.Instrument;
        break;
    }

    return reportLevel;
  }

  convertMonthYearToDate(month: number, year: number): Date {
    return new Date(year, month);
  }

  private getAnalyteInfoList(productMasterLotId: number, testNodes: LabTest[]): AnalyteReportInfo[] {
    let analyteReportInfo: AnalyteReportInfo;
    const analyteReportInfoList = [];
    if (testNodes && testNodes.length) {
      testNodes.forEach(testNode => {
        analyteReportInfo = new AnalyteReportInfo();
        analyteReportInfo.labTestId = testNode.id;
        this.testSpecIdsMatrix.forEach(o => {
          if (o.productMasterLotId === productMasterLotId && o.testNodeId === testNode.id) {
            // pbi 211904 o.ids is an array
            analyteReportInfo.testSpecId = o.ids;
          }
        });
        // analyteReportInfo.testSpecId = +testNode.testSpecId;
        analyteReportInfo.labUnitId = +testNode.labUnitId;
        analyteReportInfo.productMasterLotId = productMasterLotId;
        analyteReportInfo.isArchived = testNode.isArchived;
        analyteReportInfo.sortOrder = testNode.sortOrder;
        analyteReportInfoList.push(analyteReportInfo);
      });
    }
    return analyteReportInfoList;
  }

  private getProductInfoList(productNodes: LabProduct[], commentsDict: Map<string, string>,
    isfromNotification: boolean): ProductReportInfo[] {
    let productReportInfo: ProductReportInfo;
    const productReportInfoList = [];

    if (productNodes && productNodes.length) {
      productNodes.forEach((productNode: LabProduct) => {
        productReportInfo = new ProductReportInfo();
        if (isfromNotification && commentsDict != null) {
          productReportInfo.productLotComment = commentsDict[productNode.lotInfo.lotNumber];
        } else {
          productReportInfo.productLotComment = '';
        }

        productReportInfo.analyteInfos = this.getAnalyteInfoList(+productNode.productMasterLotId, productNode.children);
        productReportInfo.productMasterLotId = +productNode.productMasterLotId;
        productReportInfo.sortOrder = productNode.sortOrder;
        productReportInfoList.push(productReportInfo);
      });
    }
    return productReportInfoList;
  }
}
