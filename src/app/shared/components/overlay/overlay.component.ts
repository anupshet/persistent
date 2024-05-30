import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'unext-overlay-component',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss']
})
export class OverlayComponent implements OnInit {
  @Input() height: string;
  @Input() width: string;
  @Input() top: string;
  @Input() left: string;
  @Input() position?: string;
  ngOnInit() { }

}
