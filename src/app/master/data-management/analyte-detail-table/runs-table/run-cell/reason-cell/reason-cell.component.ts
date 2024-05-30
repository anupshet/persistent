import { Component, Input } from '@angular/core';

@Component({
  selector: 'unext-reason-cell',
  templateUrl: './reason-cell.component.html',
  styleUrls: ['./reason-cell.component.scss']
})
export class ReasonCellComponent {
  @Input() reasons: string[];

}
