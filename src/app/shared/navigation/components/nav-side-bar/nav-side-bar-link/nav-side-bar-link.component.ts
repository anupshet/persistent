// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AuditTrackingAction, AuditTrackingActionStatus } from 'src/app/shared/models/audit-tracking.model';
import { AppNavigationTrackingService } from '../../../../../shared/services/appNavigationTracking/app-navigation-tracking.service';

import { EntityType } from '../../../../../contracts/enums/entity-type.enum';
import { NavigationService } from '../../../navigation.service';

@Component({
  selector: 'unext-nav-side-bar-link',
  templateUrl: './nav-side-bar-link.component.html',
  styleUrls: ['../nav-side-bar.component.scss']
})

export class NavSideBarLinkComponent implements OnInit {
  @Input() primaryDisplayText: string;
  @Input() secondaryDisplayText: string;
  @Input() additionalDisplayText: string;
  @Input() isNodeSelected: boolean;
  @Input() showTooltip: boolean;
  @Input() nodeId: string;
  @Input() itemNodeType: EntityType;
  public entityType = EntityType;
  @Output() selectedNode = new EventEmitter<null>();
  @Input() isArchived: boolean;

  constructor( private navigationService: NavigationService, private appNavigationService: AppNavigationTrackingService) { }
  ngOnInit() { }

  onNodeItemSelected(event) {
    if (this.itemNodeType === EntityType.LabDepartment) {
      const auditTrailPayload = this.appNavigationService.comparePriorAndCurrentValues({}, {}, AuditTrackingAction.View,
      AuditTrackingAction.Dashboard, AuditTrackingActionStatus.Success);
      this.appNavigationService.logAuditTracking(auditTrailPayload, true);
    }
    event.preventDefault();
    this.navigationService.setSelectedNotificationId('');
    this.selectedNode.emit();
  }
}
