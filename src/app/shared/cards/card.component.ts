// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, Input, OnInit, TemplateRef, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { ActionLink, CardEmitter } from '../../../../dist-lib/br-component-library/lib/contracts/models/lab-setup.model';

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})

export class CardComponent implements OnInit {
  @Input() title: string;
  @Input() count: number;
  @Input() actionLink: ActionLink;
  @Input() innerComponent: TemplateRef<any>;
  @Input() selectedNodeId: string;
  @Input() disable?: boolean;
  @Input() showAddInstrumentLink: boolean;
  @Output() linkClicked = new EventEmitter<CardEmitter>();
  panelOpenState = true;

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
  ) {
    iconRegistry.addSvgIcon(
      'add',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/images/matIcons/ic_add_circle_outline_24px.svg'));
    iconRegistry.addSvgIcon(
      'visibility_off',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/images/matIcons/ic_visibility_off_24px.svg'));
    iconRegistry.addSvgIcon(
      'contentCopy',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/images/matIcons/ic_content_copy.svg'));
    iconRegistry.addSvgIcon(
      'delete',
    sanitizer.bypassSecurityTrustResourceUrl('/assets/images/matIcons/ic_delete_24px.svg'));
  }

  ngOnInit() {
  }

  redirectToRoute(url: string) {
    const data: CardEmitter = {
      url,
      selectedNodeId: this.selectedNodeId
    };
    this.linkClicked.emit(data);
  }
}
