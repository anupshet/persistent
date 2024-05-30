/*© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/
import { Component, OnInit, Input, HostListener, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { EntityType } from '../../contracts/enums/entity-type.enum';
import { Header } from '../../contracts/models/data-management/header.model';
import { NodeInfoService } from '../services/node-info.service';

@Component({
  selector: 'unext-node-info',
  templateUrl: './node-info.component.html',
  styleUrls: ['./node-info.component.scss']
})
export class NodeInfoComponent implements OnInit, OnDestroy {

  @Input() analyteId: string;
  entityType = EntityType.LabTest;
  public headerData: Header;
  private destroy$ = new Subject<boolean>();

  constructor(
    private nodeInfoService: NodeInfoService
  ) { }

  ngOnInit(): void {
    this.nodeInfoService.currentHeaderData.pipe(filter(_headerData => !!_headerData), takeUntil(this.destroy$))
      .subscribe(data => this.headerData = data);
  }

  fetchDetails(getDetails) {
    if (getDetails) {
      this.headerData = null;
      this.nodeInfoService.fetchHeaderDetails(this.analyteId);
    }
  }

  @HostListener('click', ['$event'])
  public onClick(event: any): void {
    event.stopPropagation();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
