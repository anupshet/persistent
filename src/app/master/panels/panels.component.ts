// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import * as fromRoot from '../../state/app.state';
import * as fromNavigationSelector from '../../shared/navigation/state/selectors';
import { TreePill } from '../../contracts/models/lab-setup/tree-pill.model';
import { NodeInfoActions } from '../../shared/state/actions';
import { EntityType } from '../../contracts/enums/entity-type.enum';

@Component({
  selector: 'unext-panels',
  templateUrl: './panels.component.html',
  styleUrls: ['./panels.component.scss']
})
export class PanelsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  public getCurrentSelectedNode$ = this.store.pipe(select(fromNavigationSelector.getCurrentSelectedNode));

  constructor(
    private store: Store<fromRoot.State>
  ) { }

  ngOnInit(): void {
    this.getCurrentSelectedNode$.pipe(filter((_selectedNode) => !!_selectedNode),
      takeUntil(this.destroy$))
      .subscribe(async (selectedNode: TreePill) => {
        if (selectedNode.children && selectedNode.children.length > 0) {
          const analyteIds = selectedNode.children.map(ele => ele.id);
          const nodeType = selectedNode.children[0].nodeType;
          this.store.dispatch(NodeInfoActions.getAncestors({ nodeType: nodeType, analyteIds: analyteIds }));
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
