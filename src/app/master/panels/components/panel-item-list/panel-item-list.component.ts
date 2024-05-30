// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import { orderBy } from 'lodash';

import { asc } from '../../../../core/config/constants/general.const';
import { LabTest } from '../../../../contracts/models/lab-setup';
import { Icon } from '../../../../contracts/models/shared/icon.model';
import { icons } from '../../../../core/config/constants/icon.const';
import { IconService } from '../../../../shared/icons/icons.service';
import { Permissions } from '../../../../security/model/permissions.model';
import { BrPermissionsService } from '../../../../security/services/permissions.service';

@Component({
  selector: 'unext-panel-item-list',
  templateUrl: './panel-item-list.component.html',
  styleUrls: ['./panel-item-list.component.scss']
})

export class PanelItemListComponent implements OnInit {

  @Input('selectedItems')
  set selectedItems(value: Array<LabTest>) {
    if (value) {
      this.listItems = [...value];
      this.archivedItems = this.listItems.filter(item => item.isArchived);
      this.listItems = this.listItems.filter(item => !item.isArchived);
      this.archivedItemList = orderBy(this.archivedItems, [(item) => item.displayName], [asc]);
    }
  }
  get selectedItems(): Array<LabTest> {
    return this.listItems;
  }

  @Output() sortedItemsEvent: EventEmitter<Array<LabTest>> = new EventEmitter<Array<LabTest>>();
  @Output() draggingEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  public listItems: Array<LabTest>;
  public archivedItems: Array<LabTest>;
  public archivedItemList: Array<LabTest>;
  public mergedListItems: Array<LabTest>;
  public lotExpiredToolTip: string;
  permissions = Permissions;
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.close[48],
    icons.verticalBars[24],
  ];

  dragging = false;

  constructor(private iconService: IconService,
    private brPermissionsService: BrPermissionsService,
    private translate: TranslateService) {
    this.iconService.addIcons(this.iconsUsed);
  }

  ngOnInit() {
    this.lotExpiredToolTip = this.getTranslations('PANELCOMPONENT.PANELITEMLISTCOMPONENT.LOTISEXPIRED');
  }

  drop(event: CdkDragDrop<{ title: string, poster: string }[]>) {
    moveItemInArray(this.listItems, event.previousIndex, event.currentIndex);
    this.mergedListItems = this.listItems.concat(this.archivedItemList);
    this.sortedItemsEvent.emit(this.mergedListItems);
  }

  started() {
    this.dragging = true;
    this.draggingEvent.emit(true);
  }

  released() {
    this.dragging = false;
    this.draggingEvent.emit(false);
  }

  onMouseDown(e) {
    let c = 0;
    for (let i = 0; i < 8; i++) {
      if (e.path[i].className === 'stop-propagation') {
        c = 1;
      }
    }
    c === 0 ? this.started() : this.released();
  }

  removeItem(item: LabTest) {
    if (this.hasPermissionToAccess([this.permissions.PanelsDelete])) {
      const itemIndex = this.listItems.findIndex(e => e.id === item.id);
      this.listItems.splice(itemIndex, 1);
      this.mergedListItems = this.listItems.concat(this.archivedItemList);
      this.sortedItemsEvent.emit(this.mergedListItems);
    }
  }

  removeArchiveItem(item: LabTest) {
    if (this.hasPermissionToAccess([this.permissions.PanelsDelete])) {
      const itemIndex = this.archivedItemList.findIndex(e => e.id === item.id);
      this.archivedItemList.splice(itemIndex, 1);
      this.mergedListItems = this.listItems.concat(this.archivedItemList);
      this.sortedItemsEvent.emit(this.mergedListItems);
    }
  }

  /* checking Permissions */
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  getTranslations(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }
}
