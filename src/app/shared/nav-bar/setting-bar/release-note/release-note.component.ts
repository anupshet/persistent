import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Subscription } from 'rxjs';

import { ReleaseNotesService } from '../release-note.service';
import { unsubscribe } from '../../../../../app/core/helpers/rxjs-helper';

@Component({
  selector: 'unext-release-note',
  templateUrl: './release-note.component.html',
  styleUrls: ['./release-note.component.scss']
})
export class ReleaseNoteComponent implements OnInit, OnDestroy {
  pdfData: any;
  filename: string;
  file: any;
  private releaseNotesSubsciption: Subscription;

  constructor(public sanitizer: DomSanitizer, private releaseNotesService: ReleaseNotesService) {
    this.sanitizer = sanitizer;
  }

  ngOnInit() {
    // this.getTrustedUrl('https://unitydsharedsgbuw.blob.core.windows.net/unityreleasenotes/Unity Alert 1.0.0.3 Release Notes.pdf');
    this.filename = 'UnityNext_ReleaseNotes.pdf';
    this.releaseNotesSubsciption = this.releaseNotesService.getAll(this.filename).subscribe((data: any) => {
      this.pdfData = new Uint8Array(data);
    });
  }

  ngOnDestroy() {
    unsubscribe(this.releaseNotesSubsciption);
  }

}
