// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Output, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import * as pbi from 'powerbi-client';

import { Icon } from '../../../../contracts/models/shared/icon.model';
import { icons } from '../../../../core/config/constants/icon.const';
import { IconService } from '../../../../shared/icons/icons.service';
import { LotviewerReportType } from '../../../../contracts/enums/lotviewer/lotviewer-reporttype.enum';
import { AuditTrackingAction, AuditTrackingActionStatus } from '../../../../shared/models/audit-tracking.model';
import { AppNavigationTrackingService } from '../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';

export interface DialogData {
  powerBIToken: string;
  powerBIEmbedUrl: string;
  powerBIReportId: string;
  powerBIReportType: string;
}

@Component({
  selector: 'unext-lotviewer-dialog',
  templateUrl: './lotviewer-dialog.component.html',
  styleUrls: ['./lotviewer-dialog.component.scss']
})
export class LotviewerDialogComponent implements OnInit {
  @ViewChild('reportContainer', { static: true }) reportContainer: ElementRef;

  hidePowerBi = false;
  powerBIToken: string;
  powerBIEmbedUrl: string;
  powerBIReportId: string;
  powerBIReportType: string;
  dialogTitle: string;
  dialogText: string;
  @Output() submitClicked = new EventEmitter<any>();
  slicer1_id = '';
  slicer2_object = null;

  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.close[48]
  ];

  constructor(
    private appNavigationService: AppNavigationTrackingService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private iconService: IconService) {
    this.iconService.addIcons(this.iconsUsed);
  }

  ngOnInit() {
    const auditTrailPayload = this.appNavigationService.comparePriorAndCurrentValues({}, {},
    AuditTrackingAction.View, AuditTrackingAction.Dashboard, AuditTrackingActionStatus.Success);
    this.appNavigationService.logAuditTracking(auditTrailPayload, true);
    this.powerBIToken = this.data.powerBIToken;
    this.powerBIEmbedUrl = this.data.powerBIEmbedUrl;
    this.powerBIReportId = this.data.powerBIReportId;
    this.powerBIReportType = this.data.powerBIReportType;
    // if no data from API show default message
    if (this.powerBIEmbedUrl === this.powerBIReportId) {
      this.hidePowerBi = true;
    } else {
      this.hidePowerBi = false;
      if (this.powerBIReportType === LotviewerReportType.LotVisiblitySales) {
        this.showReportSales(this.powerBIToken);
      } else {
        this.showReportOther(this.powerBIToken);
      }
    }
  }

  // I could just copy the 12 lines that are different, but I suspect that soon we will need role based reporting
  // Which will require diffferent payloads and tokens and data oh my  so I split them up
  showReportSales(accessToken) {
    const embedUrl = this.powerBIEmbedUrl + '&navContentPaneEnabled=false';

    const config = {
      type: 'report',
      tokenType: pbi.models.TokenType.Embed,
      accessToken,
      embedUrl,
      filterPaneEnabled: false,
      navContentPaneEnabled: false,
      settings: {}/* ,
      commands: [
        {
          spotlight: {
            displayOption: pbi.models.CommandDisplayOption.Hidden,
          },
          seeData: {
            displayOption: pbi.models.CommandDisplayOption.Hidden,
          },
          sort: {
            displayOption: pbi.models.CommandDisplayOption.Hidden,
          },
        }
      ] */

    };
    const reportContainer = this.reportContainer.nativeElement;
    const powerbi = new pbi.service.Service(pbi.factories.hpmFactory, pbi.factories.wpmpFactory, pbi.factories.routerFactory);
    const report = powerbi.embed(reportContainer, config);

    report.on('dataSelected', function (event) {
      // @ts-ignore
      if (event.detail != null && event.detail.visual != null && event.detail.visual.name != null) {
        // @ts-ignore
        const event_slicer_name = event.detail.visual.name;
        // @ts-ignore
        // @ts-ignore
        if (event_slicer_name === this.slicer1_id) {
          // @ts-ignore
          this.slicer2_object.setSlicerState({});
        }
      }
    });

    // remove event handler for loaded event, if there is any
    report.off('loaded');
    report.on('loaded', function (event) {
      // @ts-ignore
      report.getPages().then(pages => {
        pages[0].getVisuals().then(visuals => {
          visuals.forEach(visual => {
            if (visual.type === 'slicer') {
              visual.getSlicerState().then(state => {

                if (typeof state.targets !== 'undefined' && state.targets !== null && state.targets[0] !== null) {

                  this.target = state.targets[0];
                  if (this.target.table === 'VW_LOTVISIBILITYSUMMARY' && this.target.column.includes('Ship to')) {
                    this.slicer2_object = visual;
                  } else
                    if (this.target.table === 'VW_SALES_LOTVISIBILITY' && this.target.column.includes('Sold to')) {
                      this.slicer1_id = visual.name;
                    }
                }
              });
            }
          });
        });
      });
    });
  }

  showReportOther(accessToken) {
    const embedUrl = this.powerBIEmbedUrl + '&navContentPaneEnabled=false';

    const config = {
      type: 'report',
      tokenType: pbi.models.TokenType.Embed,
      accessToken,
      embedUrl,
      filterPaneEnabled: false,
      navContentPaneEnabled: false,
      settings: {}/* ,
      commands: [
        {
          spotlight: {
            displayOption: pbi.models.CommandDisplayOption.Hidden,
          },
          seeData: {
            displayOption: pbi.models.CommandDisplayOption.Hidden,
          },
          sort: {
            displayOption: pbi.models.CommandDisplayOption.Hidden,
          },
        }
      ] */

    };
    const reportContainer = this.reportContainer.nativeElement;
    const powerbi = new pbi.service.Service(pbi.factories.hpmFactory, pbi.factories.wpmpFactory, pbi.factories.routerFactory);
    const report = powerbi.embed(reportContainer, config);

    report.on('dataSelected', function (event) {
      // @ts-ignore
      if (event.detail != null && event.detail.visual != null && event.detail.visual.name != null) {
        // @ts-ignore
        const event_slicer_name = event.detail.visual.name;
        // @ts-ignore
        // @ts-ignore
        if (event_slicer_name === this.slicer1_id) {
          // @ts-ignore
          this.slicer2_object.setSlicerState({});
        }
      }
    });

    // remove event handler for loaded event, if there is any
    report.off('loaded');
    report.on('loaded', function (event) {
      // @ts-ignore
      report.getPages().then(pages => {
        pages[0].getVisuals().then(visuals => {
          visuals.forEach(visual => {
            if (visual.type === 'slicer') {
              visual.getSlicerState().then(state => {
                if (typeof state.targets !== 'undefined' && state.targets !== null && state.targets[0] !== null) {
                  this.target = state.targets[0];
                  if (this.target.table === 'VW_LOTVISIBILITYSUMMARY' && this.target.column.includes('Sold to')) {
                    this.slicer2_object = visual;
                  } else
                    if (this.target.table === 'VW_SHIP_TO_FILTER' && this.target.column.includes('Ship to')) {
                      this.slicer1_id = visual.name;
                    }
                }
              });
            }
          });
        });
      });
    });
  }
}
