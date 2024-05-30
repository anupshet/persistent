// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, Input, OnInit, Output, EventEmitter, Inject, OnChanges } from '@angular/core';
import { PdfResponse } from '../../../models/report-info';
import { icons } from '../../../../../core/config/constants/icon.const';
import { IconService } from '../../../../../shared/icons/icons.service';
import { Icon } from '../../../../../contracts/models/shared/icon.model';

@Component({
  selector: 'unext-report-preview',
  templateUrl: './report-preview.component.html',
  styleUrls: ['./report-preview.component.scss']
})
export class ReportPreviewComponent implements OnInit, OnChanges {
  public _pdfUrl = '';
  @Input() pdfData: PdfResponse;
  @Input() set pdfUrl(url: string) {
    this._pdfUrl = url;
  }

  get pdfUrl() {
    this.updatePdfView();
    return this._pdfUrl;
  }

  @Output() isReportFullScreen = new EventEmitter<boolean>();
  isFullScreenMode = false;
  scrollbar: any = undefined;
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.expandPreviewIcon[24],
  ];
  container: Element;
  page: number;
  pageIndex: number;
  pageCount: number;
  constructor(
    private iconService: IconService,
  ) {
    this.iconService.addIcons(this.iconsUsed);
  }

  ngOnInit(): void {
  }

  showExpandIcon() {
    if (this.pdfData) {
      return this.pdfData.dynReportType.includes('0') ? true : false;
    }
    return false;
  }

  ngOnChanges(): void {
    this.page = 1;
    this.pageIndex = 1;
  }

  showFullScreen(): void {
    this.isFullScreenMode = !this.isFullScreenMode;
    this.isReportFullScreen.emit(this.isFullScreenMode);
    if (!this.isFullScreenMode) {
      if (this.pageCount > 1) {
        if (this.pageCount === this.pageIndex) {
          this.page = this.pageIndex;
          setTimeout(() => {
            this.page = this.pageIndex - 1;
          }, 10);
        }
      } else {
        if (this.container) {
        this.container.scrollTop = 0;
        }
      }
    }
  }

  updatePdfView(): void {
    if (this._pdfUrl && this._pdfUrl !== '') {
      const toolbarElem = document.querySelector('.toolbar');
      if (!toolbarElem.classList.contains('invisible')) {
        toolbarElem.classList.add('invisible');
      }
    }
  }

  pageChange = (index: number) => this.pageIndex = index;

  pdfLoaded = (count: number) => this.pageCount = count;

}
