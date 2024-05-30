// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable } from '@angular/core';
import { of, BehaviorSubject, Observable } from 'rxjs';

import { TreeNodesService } from '../services/tree-nodes.service';

@Injectable()
export class SideNavService {
  private sideNavOpenState = new BehaviorSubject<any>(false);
  private defaultEntity: any;

  constructor(private treeNodesService: TreeNodesService) {
    this.sideNavOpenState.next(false);
  }

  public closeSideNav(): void {
    this.sideNavOpenState.next(false);
  }

  public openSideNav(): void {
    this.sideNavOpenState.next(true);
  }

  public getNavOpenState(): Observable<any> {
    return this.sideNavOpenState.asObservable();
  }

  getDefaultEntity(rootNode) {
    if (rootNode) {
      const nodes = [rootNode];
      this.defaultEntity = null;
      this.setDefaultEntity(nodes[0]);

      return of(this.defaultEntity);
    } else {
      return of(null);
    }
  }

  // Left nav component is expecting a unique Id that is not
  // supported by the structure.
  setDefaultEntity(node) {
    if (node.children && node.children.length > 0) {
      this.setDefaultEntity(node.children[0]);
    }

    if (!this.defaultEntity) {
      this.setDefaultEnitityProperty(node);
    }

    return;
  }

  setDefaultEnitityProperty(node) {
    const id = node.id;

    this.defaultEntity = {};
    this.defaultEntity.id = id;
    this.defaultEntity.type = node.nodeType;
  }
}
