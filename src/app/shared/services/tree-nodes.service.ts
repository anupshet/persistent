// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import * as ngrxStore from '@ngrx/store';
import { Injectable, OnDestroy } from '@angular/core';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { HierarchyPointNode } from 'd3-hierarchy';
import * as orderBy from 'lodash/orderBy';

import { ApiService } from '../api/api.service';
import { EntityType } from '../../contracts/enums/entity-type.enum';
import { TreePill } from '../../contracts/models/lab-setup/tree-pill.model';
import { unApi } from '../../core/config/constants/un-api-methods.const';
import { TreePillOptions } from '../tree-nodes/tree-pill-options';
import { AppLoggerService } from './applogger/applogger.service';
import { urlPlaceholders } from '../../core/config/constants/un-url-placeholder.const';
import { TestSpec } from '../../contracts/models/portal-api/labsetup-data.model';
import * as fromRoot from '../../state/app.state';
import * as fromAuth from '../state/selectors';
import { AuthState } from '../state/reducers/auth.reducer';
import { nodeTypeNames } from '../../core/config/constants/general.const';


@Injectable()
export class TreeNodesService implements OnDestroy {
  protected labId: string;
  private viewBoxWidth = 1200;
  private selectedNodeSource = new BehaviorSubject<TreePill>(null);
  selectedNodeSource$ = this.selectedNodeSource.asObservable();
  private rootTree: HierarchyPointNode<TreePill>;
  private destroy$ = new Subject<boolean>();
  treePillOptions = new TreePillOptions(this.viewBoxWidth);

  constructor(
    private api: ApiService,
    private store: ngrxStore.Store<fromRoot.State>,
    private appLogger: AppLoggerService
  ) {
    this.store.pipe(ngrxStore.select(fromAuth.getAuthState))
      .pipe(filter(authState => !!(authState && authState.isLoggedIn && authState.currentUser)), takeUntil(this.destroy$))
      .subscribe((authState: AuthState) => {
        this.labId = authState.currentUser.accountNumber;
      });
  }

  // TODO: 01/31/2020  Refactor this in future, included for connectivity
  getFullTree(nodeType: EntityType, locationId: string): Observable<TreePill> {
    const data = {
      locationId
    };
    const url = unApi.treeNode.loadFullTree.replace(urlPlaceholders.nodeTypeName, nodeTypeNames[nodeType]);
    return this.api.post(`${url}`, data);
  }

  getSubTreeByIdAndType(
    id: string,
    type: EntityType,
    originalTree = this.rootTree.data
  ): TreePill {
    if (!id || !type || !originalTree) {
      return null;
    }
    if (originalTree.nodeType === type && originalTree.id === id) {
      return originalTree;
    } else if (originalTree.children && originalTree.children.length > 0) {
      let children = 0;
      while (originalTree.children[children]) {
        const result = this.getSubTreeByIdAndType(
          id,
          type,
          originalTree.children[children]
        );
        if (result) {
          return result;
        }
        children++;
      }
    } else {
      return null;
    }
  }

  getParentNode(id: string): HierarchyPointNode<TreePill> {
    let parent = null;

    this.rootTree.each((node: HierarchyPointNode<TreePill>) => {
      if (node.data.id === id) {
        const ancestorsList = node.ancestors();

        if (ancestorsList.length > 1) {
          parent = ancestorsList[0];
        }
      }
    });
    return parent;
  }

  /**
 * Takes a array i.e TreePill[] and returns new sorted ascending array, if no sorting keys and
 * sorting order passed in arguments that are optional.
 * Default key to order from: [ displayName, label], if no array with sorting keys provided.
 * Sorting order will be ascending by default.
 * Otherwise, specify an order of "desc" for descending or
 * "asc" for ascending sort order of corresponding values.
 * @example
 *  sortByOrder(data, ['displayName', 'label'], ['asc', 'desc']);
 *
 * @example
 *  We are using lodash orderBy to sort the given array
 *  var users = [
 * { 'user': 'fred',   'age': 48 },
 * { 'user': 'barney', 'age': 34 },
 * { 'user': 'fred bas',   'age': 40 },
 * { 'user': 'barney', 'age': 36 }
 * ];
 * //Sort by `user` in ascending order and by `age` in descending order.
 * _.orderBy(users, ['user', 'age'], ['asc', 'desc']);
 * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
 *
 * @example
 * Sorting keys data to lowercase before comparison
 * [(node: TreePill) => node.displayName.replace(/\s/g, '').toLocaleLowerCase(),
  (node: TreePill) => node.label ? node.label.replace(/\s/g, '').toLocaleLowerCase() : node.label]
 *
 * @param data: TreePill[ ]
 * @param sortingKeys: ['property-name']
 * @example ['user', 'age']
 * @param sortingOrder: ['asc, desc]
 * @type TreePill[]
 * @returns TreePill[]
 */
  sortByOrder(data: TreePill[], sortingKeys?: any[], sortingOrder?: any[]): TreePill[] {
    // if no data i.e. array then return a blank array.
    if (!data) { return []; }

    // check if order in which sorting needed or take default ordering i.e order by [displayName, label]
    const defaultKeys = [(node: TreePill) => node.displayName.replace(/\s/g, '').toLocaleLowerCase()];

    const sortKeys = sortingKeys || defaultKeys;
    // check if sort order that asc or desc is passed or pass blank array
    const sortOrder = sortingOrder || [];

    try {
      return orderBy(data, sortKeys, sortOrder);
    } catch (e) {
      this.appLogger.warning('Sorting cards', e);
      return [];
    }
  }

  // Get insersection of testspecs
  public getMatchingTestSpecs(testSpecsListA: TestSpec[], testSpecsListB: TestSpec[]): TestSpec[] {
    testSpecsListA = testSpecsListA || [];
    testSpecsListB = testSpecsListB || [];

    return testSpecsListA.filter((spec) => {
      let foundMatch = false;
      testSpecsListB.forEach(otherTestSpecListItem => {
        if (spec.analyteId === otherTestSpecListItem.analyteId
          && spec.calibratorId === otherTestSpecListItem.calibratorId
          && spec.calibratorLotId === otherTestSpecListItem.calibratorLotId
          && spec.instrumentId === otherTestSpecListItem.instrumentId
          && spec.methodId === otherTestSpecListItem.methodId
          && spec.reagentId === otherTestSpecListItem.reagentId
          && spec.reagentLotId === otherTestSpecListItem.reagentLotId) {
          foundMatch = true;
        }
      });

      return foundMatch;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
