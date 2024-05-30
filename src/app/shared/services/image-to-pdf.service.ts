/*© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/
import { Injectable } from '@angular/core';

import { jsPDF } from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class ImageToPdfService {

  constructor() { }

  // TODO: modify left, right, width or height of image if required
  generatePdfFromImage(imageSrc: string, fileName: string, width: number, height: number, pdfHeaderArray:  Array<string>, padHeader: boolean) {
    const doc = new jsPDF({
      unit: "px",
      format: [1680, width]
    });
    const left = 0;
    // move where the top of the chart displays based on overlay or regular to not conflict with the header info
    const top = padHeader? 120:50;
    doc.addImage(imageSrc, 'PNG', left, top, width, height);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(30);
    doc.text(pdfHeaderArray[0], 50, 30);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(15);
    doc.text(pdfHeaderArray[1], 55, 45);
    doc.text(pdfHeaderArray[2] + ': ' + pdfHeaderArray[3], 55, 60);
    doc.text(pdfHeaderArray[4] + ': ' + pdfHeaderArray[5], 55, 75);
    doc.text(pdfHeaderArray[6] + ': ' + pdfHeaderArray[7], 55, 90);
    doc.text(pdfHeaderArray[8] + ': ' + pdfHeaderArray[9], 55, 105);
    // doc.setLanguage(pdfHeaderArray[10]); // future use
    doc.save(fileName);
  }

}
