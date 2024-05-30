// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

import { ReportPreviewComponent } from './report-preview.component';
import { PdfResponse } from '../../../models/report-info';



describe('ReportPreviewComponent', () => {
  let component: ReportPreviewComponent;
  let fixture: ComponentFixture<ReportPreviewComponent>;
  const mockPdfData: PdfResponse = {
    dynReportType: '0',
    isTempReport: true,
    metaId: 'A013769447DF4EE2AE99C53B423A3D8F',
    pdfUrl: 'url',
    yearMonth: '202307',
    templateBody: {
      filterCondition: {}
    },
    templateId: '23309bff-b21d-4925-8cfc-9afb12c1d604',
    templateName: 'MyTemplateName',
    outlieredLots: []
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportPreviewComponent],
      imports: [
        NgxExtendedPdfViewerModule
      ],
      providers: []
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return false if pdfData exists but dynReportType does not include "0"', () => {
    mockPdfData.dynReportType = '1';
    component.pdfData = mockPdfData;
    const result = component.showExpandIcon();
    expect(result).toBe(false);
  });

  it('should return true if pdfData exists but dynReportType does not include "0"', () => {
    mockPdfData.dynReportType = '0';
    component.pdfData = mockPdfData;
    const result = component.showExpandIcon();
    expect(result).toBe(true);
  });

  it('should toggle full screen mode and emit event', () => {
    spyOn(component.isReportFullScreen, 'emit');
    expect(component.isFullScreenMode).toBe(false);
    component.showFullScreen();
    expect(component.isFullScreenMode).toBe(true);
    expect(component.isReportFullScreen.emit).toHaveBeenCalledWith(true);
    component.showFullScreen();
    expect(component.isFullScreenMode).toBe(false);
    expect(component.isReportFullScreen.emit).toHaveBeenCalledWith(false);
  });

  it('should update PDF view and apply CSS overrides', () => {
    const mockToolbarElement = document.createElement('div');
    mockToolbarElement.classList.add('toolbar');
    component._pdfUrl = 'sample.pdf';
    spyOn(document, 'querySelector').and.returnValue(<HTMLElement>mockToolbarElement);
    component.updatePdfView();
    expect(mockToolbarElement.classList.contains('invisible')).toBeTrue();
  });

});
