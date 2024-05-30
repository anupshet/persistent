// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';

import { PermissionRequired } from '../model/permissions.model';
import { BrPermissionsService } from '../services/permissions.service';

@Directive({
  selector: '[checkForPermission]',
})
export class BrAccessControlDirective implements AfterViewInit {
  @Input() checkForPermission: PermissionRequired;

  constructor(
    private brPermissionsService: BrPermissionsService,
    private eleRef: ElementRef,
    private renderer: Renderer2
  ) { }

  ngAfterViewInit() {
    this.checkForPermissions(this.eleRef, this.checkForPermission);
  }

  private checkForPermissions(
    element: ElementRef,
    permissionConfig: PermissionRequired
  ) {
    const permitted = this.brPermissionsService.hasAccess(
      permissionConfig?.permissionsAllowed
    );
    this.hideOrDisableElements(
      element.nativeElement,
      permitted,
      permissionConfig
    );
  }

  private hideOrDisableElements(
    element: any,
    permitted: boolean,
    permissionConfig: PermissionRequired
  ) {
    if (element) {
      if (permissionConfig.hideIfNotPermitted && !permitted) {
        this.renderer.removeChild(element.parent, element);
      }

      if (permissionConfig.disableIfNotPermitted && !permitted) {
        if (element.disabled === false) {
          this.renderer.setProperty(element, 'disabled', true);
        } else {
          this.renderer.setStyle(element, 'pointer-events', 'none');
          this.renderer.setStyle(element, 'opacity', '0.6');
          this.renderer.setStyle(element, 'cursor', 'not-allowed');
        }

        //below cloning mechanism is known to cause a duplication issue.

        // This will clone the current element with all classes and attributes, but will not copy the Events of Original node
        const cloneOriginalNode = element.cloneNode(true);
        // Replacing original node with Clone Node
        element.replaceWith(cloneOriginalNode);
      }
    }
  }
}
