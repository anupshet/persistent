// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable, OnDestroy } from '@angular/core';
import * as ngrxStore from '@ngrx/store';
import { throwError as observableThrowError, Subject, Subscription } from 'rxjs';
import { catchError, filter, take, takeUntil } from 'rxjs/operators';

import { hierarchy, tree, TreeLayout } from 'd3-hierarchy';

import { TreePill } from '../../contracts/models/lab-setup/tree-pill.model';
import { ENTITY_TYPE_TITLE } from '../../contracts/enums/connectivity-map/entity-type.enum';
import { TreeNodesService } from '../services/tree-nodes.service';
import { NavigationService } from '../navigation/navigation.service';
import { AppLoggerService } from '../services/applogger/applogger.service';
import { unsubscribe } from '../../core/helpers/rxjs-helper';
import * as fromRoot from '../../state/app.state';
import * as fromAuth from '../../shared/state/selectors';
import { AuthState } from './reducers/auth.reducer';
import * as fromNavigationSelector from '../navigation/state/selectors';
import { EntityType } from '../../contracts/enums/entity-type.enum';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class TreeNodesAction implements OnDestroy {
  private treeLayoutConstructor: TreeLayout<{}>;
  private rootNodeSubscription: Subscription;
  private current: TreePill;
  private currentLabId: string;
  private currentLocationId: string;
  private destroy$ = new Subject<boolean>();

  constructor(
    private store: ngrxStore.Store<fromRoot.State>,
    private treeNodesService: TreeNodesService,
    private navigationSvc: NavigationService,
    private appLogger: AppLoggerService,
    private translate: TranslateService
  ) {
    // Listen to current user
    this.store.pipe(ngrxStore.select(fromAuth.getAuthState))
      .pipe(filter(response => !!(response && response.currentUser)), takeUntil(this.destroy$))
      .subscribe((response: AuthState) => {
        this.currentLabId = response.currentUser.accountNumber;
        this.currentLocationId = response.currentUser.labLocationId;
      });

    this.store.pipe(ngrxStore.select(fromNavigationSelector.getCurrentSelectedNode))
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedNode: TreePill) => {
        this.current = selectedNode;
      });

    this.treeLayoutConstructor = this.getTreeLayoutConstructor();
  }

  getTreeLayoutConstructor(): TreeLayout<{}> {
    return tree()
      .nodeSize(this.treeNodesService.treePillOptions.getNodeSize())
      .separation(
        (a, b) =>
          a.parent === b.parent
            ? this.treeNodesService.treePillOptions.siblingSeparationFactor
            : this.treeNodesService.treePillOptions.cousinSeparationFactor
      );
  }

  // TODO: 01/31/2020  Refactor this in future, included for connectivity
  getFullTreeRootNode(locationId): Subscription {
    return this.treeNodesService
      .getFullTree(EntityType.LabLocation, locationId).pipe(
        catchError((err: Response) => {
          this.navigationSvc.routeToLabManagement(locationId, this.currentLabId);
          return observableThrowError('no location found ' + err.status);
        }))
      .subscribe(rootTreePill => {
        this.appLogger.log('TreeNodesAction - getRootNode - service rootTreePill', rootTreePill);

        const hierarchyNode = hierarchy(rootTreePill);
        const rootNode = this.treeLayoutConstructor(hierarchyNode);


        this.appLogger.log('TreeNodesAction - getRootNode - render finished', rootNode);
      });
  }


  getTranslation(entityTypeTitle: string) {
    // set default text in case no translation found
    let translationText = 'Name Your ' + entityTypeTitle;
    if (entityTypeTitle) {
      switch (entityTypeTitle) {
        case ENTITY_TYPE_TITLE.DEPARTMENT:
          translationText = this.getTranslations('TRANSLATION.NAMEDEPARTMENT');
          break;

        case ENTITY_TYPE_TITLE.INSTRUMENT:
          translationText = this.getTranslations('TRANSLATION.NAMEINSTRUMENT');
          break;

        case ENTITY_TYPE_TITLE.LAB:
          translationText = this.getTranslations('TRANSLATION.NAMEYOURLAB');
          break;

        case ENTITY_TYPE_TITLE.LOCATION:
          translationText = this.getTranslations('TRANSLATION.NAMELOCATION');
          break;

        case ENTITY_TYPE_TITLE.PRODUCT:
          translationText = this.getTranslations('TRANSLATION.NAMEPRODUCT');
          break;

        case ENTITY_TYPE_TITLE.TEST:
          translationText = this.getTranslations('TRANSLATION.NAMETEST');
          break;

        default:
          translationText = 'Name Your ' + entityTypeTitle;
          break;
      }
    }
    return translationText;
  }

  getTranslations(codeToTranslate: string): string {
    let translatedContent:string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }

  ngOnDestroy() {
    unsubscribe(this.rootNodeSubscription);
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
