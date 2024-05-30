import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { Header } from '../../../contracts/models/data-management/header.model';

@Component({
  selector: 'unext-node-info-details',
  templateUrl: './node-info-details.component.html',
  styleUrls: ['./node-info-details.component.scss']
})
export class NodeInfoDetailsComponent implements OnInit {

  @Input() headerData: Header;
  @Output() getNodeDetails = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  showNodeDetails() {
    this.getNodeDetails.emit(true);
  }

}
