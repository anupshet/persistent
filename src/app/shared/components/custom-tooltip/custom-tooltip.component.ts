// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { LabConfig } from '../../../master/reporting/reporting.enum';
import { TooltipData } from '../../../master/reporting/models/report-info';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

@Component({
  selector: 'unext-custom-tooltip',
  templateUrl: './custom-tooltip.component.html',
  styleUrls: ['./custom-tooltip.component.scss']
})
export class CustomTooltipComponent implements OnInit, AfterViewInit {
  @ViewChild('listContainer') listContainer: ElementRef;
  position = 'right';
  tooltip: TooltipData;
  left = 0;
  top = 0;
  visible = false;
  hasEllipsis = false;
  maxHeight = 0;
  checkboxTopValue = 0;
  subheading: string;
  heading: string;
  labConfig = LabConfig;

  constructor(private translate: TranslateService) {
   }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.translateHeadings();
      if (this.tooltip?.data) {
        // If tooltip length exceeds 33% of window height it will add an ellipsis
        const selectedItemsPanelTopValue = document.getElementsByClassName('selectedItemsPanel')[0].getBoundingClientRect().top;
        this.maxHeight = selectedItemsPanelTopValue - this.checkboxTopValue;
        const contentHeight = this.listContainer.nativeElement.offsetHeight;
        if (contentHeight > this.maxHeight) {
          this.hasEllipsis = true;
          this.listContainer.nativeElement.parentElement.classList.add('vertical-ellipsis');
        } else {
          this.hasEllipsis = false;
        }
      }
    }, 0);
  }

  translateHeadings() {
    switch (this.tooltip?.heading) {
      case this.labConfig.departmentDetails :
        this.heading = this.getTranslation('CUSTOMTOOLTIP.DEPARTMENTDETAILS');
        break;
      case this.labConfig.locationDetails :
        this.heading = this.getTranslation('CUSTOMTOOLTIP.LOCATIONDETAILS');
        break;
      case this.labConfig.instrumentDetails :
        this.heading = this.getTranslation('CUSTOMTOOLTIP.INSTRUMENTDETAILS');
        break;
      case this.labConfig.controlDetails :
        this.heading = this.getTranslation('CUSTOMTOOLTIP.CONTROLDETAILS');
        break;
      case this.labConfig.analyteDetails :
        this.heading = this.getTranslation('CUSTOMTOOLTIP.ANALYTEDETAILS');
        break;
      default:
        this.heading = '';
        break;
    }
    switch (this.tooltip?.subheading) {
      case this.labConfig.instrument :
        this.subheading =  this.getTranslation('CUSTOMTOOLTIP.INSTRUMENT');
        break;
      case this.labConfig.control :
        this.subheading =  this.getTranslation('CUSTOMTOOLTIP.CONTROL');
        break;
      default:
        this.subheading = '';
        break;
    }
  }

  getTranslation(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }
}
