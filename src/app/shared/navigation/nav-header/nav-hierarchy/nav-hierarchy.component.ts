// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterEvent } from '@angular/router';
import { select, Store } from '@ngrx/store';

import { iif, Subject } from 'rxjs';
import {
  filter,
  map,
  switchMap,
  takeUntil,
  withLatestFrom,
  take,
  pairwise,
} from 'rxjs/operators';
import { cloneDeep } from 'lodash';
import { TranslateService } from '@ngx-translate/core';

import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { MigrationStates } from '../../../../contracts/enums/migration-state.enum';
import { RouterNavigationType } from '../../../../contracts/enums/router-navigation-type.enum';
import { RouterStateKeyWords } from '../../../../contracts/enums/router-state-keywords.enum';
import { LabLocation, TreePill } from '../../../../contracts/models/lab-setup';

import { AppUser } from '../../../../security/model/app-user.model';
import * as fromRoot from '../../../../state/app.state';
import { NavigationService } from '../../navigation.service';
import * as actions from '../../state/actions';
import * as selectors from '../../state/selectors';
import * as sharedStateSelector from '../../../state/selectors';
import * as fromSecuritySelector from '../../../../security/state/selectors';

import { ErrorLoggerService } from '../../../services/errorLogger/error-logger.service';
import {
  componentInfo,
  blankSpace,
  Operations,
} from '../../../../core/config/constants/error-logging.const';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { unRouting } from '../../../../core/config/constants/un-routing-methods.const';
import { instruments } from '../../../../core/config/constants/general.const';
import { ConfirmNavigateGuard } from '../../../../master/reporting/shared/guard/confirm-navigate.guard';


@Component({
  selector: 'unext-nav-hierarchy',
  templateUrl: './nav-hierarchy.component.html',
  styleUrls: ['./nav-hierarchy.component.scss'],
})
export class NavHierarchyComponent implements OnInit, OnDestroy {
  @Input() instrumentsGroupedByDept: boolean;

  migrationState: string;
  isDefaultNodeSet = false;
  protected destroy$ = new Subject<boolean>();
  public selectedNode: TreePill;
  selectedLeaf: TreePill;
  private currentBranch: TreePill[];
  public breadcrumbList: TreePill[];
  public currentLocationType = EntityType.LabLocation;
  isFromAnalytePage = false;
  isFromControlPage = false;
  isFromInstrumentPage = false;
  isFromDepartmentPage = false;
  labLocation: LabLocation;
  public getAccountState$ = this.store.pipe(
    select(sharedStateSelector.getCurrentAccount)
  );

  constructor(
    private confirmNavigate: ConfirmNavigateGuard,
    private store: Store<fromRoot.State>,
    public router: Router,
    private navigationService: NavigationService,
    private errorLoggerService: ErrorLoggerService,
    private translate: TranslateService
  ) {
    // This conditions checks for reporting page adds the analyte breadcumb if we come from analyte page
    // Also remove the breadcumb when we are moving out from this page if analyte breadcumb is present
    this.router?.events
      .pipe(filter((route: RouterEvent) => route instanceof NavigationEnd),
        pairwise(), takeUntil(this.destroy$)
      ).subscribe((route: any[]) => {
        if (route[0]?.urlAfterRedirects) {
          // these are added to get from were the user has navigated to new reports page
          this.isFromAnalytePage = Number(route[0]?.urlAfterRedirects?.split('/')[3]) === EntityType.LabTest ? true : false;
          this.isFromControlPage = Number(route[0]?.urlAfterRedirects?.split('/')[3]) === EntityType.LabProduct ? true : false;
          this.isFromInstrumentPage = Number(route[0]?.urlAfterRedirects?.split('/')[3]) === EntityType.LabInstrument ? true : false;
          this.isFromDepartmentPage = route[0]?.urlAfterRedirects?.split('/')[2] === instruments ? true : false;
          if (this.router.url.includes(unRouting.reporting.newReports) ||
            this.router.url.includes(unRouting.reporting.pastReports)) {
            setTimeout(() => {
              // partially setting the selected node and selected leaf on the new reports page
              if (this.selectedNode && this.selectedNode?.children && this.selectedNode?.children?.length > 0 &&
                this.selectedLeaf && (this.router.url.includes(unRouting.reporting.newReports) ||
                  this.router.url.includes(unRouting.reporting.pastReports)) && this.isFromAnalytePage) {
                this.breadcrumbList.push(this.selectedNode);
                this.breadcrumbList.push(this.selectedLeaf);
              } else if ((this.isFromControlPage || this.isFromInstrumentPage || this.isFromDepartmentPage) &&
                (this.selectedNode.nodeType === EntityType.LabProduct || this.selectedNode.nodeType === EntityType.LabInstrument
                  || this.selectedNode.nodeType === EntityType.LabDepartment)) {
                this.breadcrumbList.push(this.selectedNode);
              } else if ((route[0]?.urlAfterRedirects?.split('/')[1] === unRouting.actionableDashboard)) {
                this.breadcrumbList.push(this.labLocation);
              } else if (this.selectedNode.nodeType === EntityType.LabLocation) {
                this.breadcrumbList = this.currentBranch;
              }
            }, 500);
          }
        }
      });
  }

  ngOnInit() {
    this.getNavigationItems();

    if (!this.isDefaultNodeSet) {
      this.getAccountState$
        .pipe(
          filter((account) => !!account),
          take(1),
          switchMap((accountState) => {
            return iif(
              () => accountState.migrationStatus !== MigrationStates.Initiated,
              this.store.pipe(select(selectors.getCurrentlySelectedNode))
            );
          }),
          switchMap(() => {
            return iif(
              () => true,
              this.store.pipe(select(selectors.getCurrentlySelectedNode))
            );
          }),
          switchMap((selectedNode: TreePill) => {
            return iif(
              () => !selectedNode,
              this.store.pipe(select(fromSecuritySelector.getCurrentUser))
            );
          })
        )
        .pipe(
          filter((currentUser) => !!currentUser),
          map((currentUser: AppUser) => currentUser.labLocationId),
          take(1)
        )
        .subscribe((labLocationId: string) => {
          labLocationId
            ? this.setLabLocation(labLocationId)
            : this.store.dispatch(actions.NavBarActions.navigateToDashboard());
        });
    }

    this.store
      .pipe(select(selectors.getCurrentlySelectedNode))
      .pipe(
        filter((selectedNode) => !!selectedNode),
        takeUntil(this.destroy$)
      )
      .subscribe((selectedNode) => {
        this.selectedNode = selectedNode;
        this.updateBreadcrumbList();
      });


    this.store
      .pipe(select(selectors.getCurrentlySelectedLeaf))
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedLeaf) => {
        this.selectedLeaf = selectedLeaf;
      });

    this.store
      .pipe(select(selectors.getCurrentBranchState))
      .pipe(
        filter((currentBranch) => !!currentBranch),
        takeUntil(this.destroy$)
      )
      .subscribe((currentBranch) => {
        this.currentBranch = cloneDeep(currentBranch);
      });

    this.getLabLocationData();
  }

  getLabLocationData() {
    this.store.pipe(select(sharedStateSelector.getCurrentLabLocation))
      .pipe(filter(labLocation => !!labLocation), takeUntil(this.destroy$)).subscribe(labLocation => {
        this.labLocation = labLocation;
      });
    if (this.labLocation && !this.selectedNode &&
      (this.router.url.includes(unRouting.reporting.newReports) ||
        this.router.url.includes(unRouting.reporting.pastReports))) {
      const locationCrumb: TreePill[] = [];
      locationCrumb.push(this.labLocation);
      this.breadcrumbList = locationCrumb;
    }
  }

  // update breadcrumb on subscriptions
  private updateBreadcrumbList(): void {
    if (
      this.selectedNode &&
      this.currentBranch &&
      this.currentBranch.length > 0 &&
      this.currentBranch[this.currentBranch.length - 1].nodeType ===
      this.selectedNode.nodeType && !this.checkForReporting()
    ) {
      this.store.dispatch(
        actions.NavBarActions.removeItemsFromCurrentBranch({
          item: this.currentBranch[this.currentBranch.length - 1],
        })
      );
      this.currentBranch.splice(this.currentBranch.length - 1, 1);
    }
    this.breadcrumbList = this.checkForReporting() ? this.breadcrumbList : this.currentBranch;
  }

  checkForReporting() {
    if (this.router.routerState.snapshot.url.toString().includes(unRouting.reporting.newReports)
      || this.router.routerState.snapshot.url.toString().includes(unRouting.reporting.pastReports)) {
      return true;
    } else {
      return false;
    }
  }

  // Hydrates app state when app is loaded or reloaded.
  private getNavigationItems(): void {
    this.store
      .pipe(
        select(selectors.getStateRouterState),
        filter((route) => !!route && !!route.state),
        withLatestFrom(
          this.store.pipe(select(selectors.getCurrentlySelectedNode)),
          this.store.pipe(select(selectors.getCurrentlySelectedLeaf))
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(([route, selectedNode, selectedLeaf]) => {
        if (!selectedLeaf && !selectedNode) {
          const routeUrl = route.state.url,
            routeUrlPathParts = routeUrl.split('/');
          let nodeTypeValue: EntityType, nodeId: string;
          if (
            route.navigationId === RouterNavigationType.Initial &&
            !routeUrl.includes(RouterStateKeyWords.Dashboard) &&
            !routeUrl.includes(
              `${unRouting.panels.panel}/${unRouting.panels.actions.add}`
            )
          ) {
            if (
              routeUrl.includes(RouterStateKeyWords.Data) &&
              routeUrl.includes(RouterStateKeyWords.Table)
            ) {
              nodeTypeValue = +routeUrlPathParts[3];
              nodeId = routeUrlPathParts[2];
              this.store.dispatch(
                actions.NavBarActions.setAllNavItemsWithNodeId({
                  nodeType: nodeTypeValue,
                  nodeId: nodeId,
                })
              );
              // TODO : remove this after fixing ngRedux state mess-up issue
              // We manually rekindle the lost navigation setting after routing to data-table
              this.store.dispatch(
                actions.NavBarActions.setShowSettings({ showSettings: false })
              );
            } else if (
              routeUrl.includes(unRouting.panels.panel) &&
              route.state.params.id
            ) {
              this.store.dispatch(
                actions.NavBarActions.setPanelsAsCurrentSelectedNode({
                  id: route.state.params.id,
                })
              );
            } else if (route.state.params.id) {
              if (routeUrl.includes(RouterStateKeyWords.Departments)) {
                nodeTypeValue = EntityType.LabLocation;
              } else if (routeUrl.includes(RouterStateKeyWords.Instruments)) {
                nodeTypeValue = EntityType.LabDepartment;
              }
              nodeId = route.state.params.id;
              if (!!nodeTypeValue && !!nodeId) {
                this.store.dispatch(
                  actions.NavBarActions.setAllNavItemsWithNodeId({
                    nodeType: nodeTypeValue,
                    nodeId: nodeId,
                  })
                );
              }
            }
            // Below condition is used to set the selected node when url has 'login'(for which the node is not set initially)
            this.isDefaultNodeSet = !routeUrl.includes(unRouting.login);
          }
        }
      });
  }

  private setLabLocation(parentNodeId: string) {
    try {
      this.store.dispatch(
        actions.NavBarActions.setNodeItems({
          nodeType: EntityType.LabLocation,
          id: parentNodeId,
        })
      );
      this.isDefaultNodeSet = true;
    } catch (error) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(
          ErrorType.Script,
          error.stack,
          error.message,
          componentInfo.NavHierarchyComponent +
          blankSpace +
          Operations.SetLabLocation
        )
      );
    }
  }

  async onChooseNode(selectedNode: TreePill, index?: number) {
    if (this.router.url.includes(unRouting.reports)) {
      const result = await this.confirmNavigate.confirmationModal();
      if (!result) {
        return;
      } else {
        if (selectedNode.nodeType === EntityType.LabProduct && this.selectedLeaf) {
          this.selectedLeaf = null;
          this.onNodeItemSelected(selectedNode, index);
        } else {
          this.onNodeItemSelected(selectedNode, index);
        }
      }
    } else {
      this.onNodeItemSelected(selectedNode, index);
    }
  }

  onNodeItemSelected(selectedNode: TreePill, index?: number) {
    try {
      this.store.dispatch(
        actions.NavBarActions.removeItemsFromCurrentBranch({
          item: selectedNode,
        })
      );
      this.navigateToNodeContents(selectedNode);
    } catch (error) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(
          ErrorType.Script,
          error.stack,
          error.message,
          componentInfo.NavHierarchyComponent +
          blankSpace +
          Operations.NodeItemSelected
        )
      );
    }
  }

  navigateToNodeContents(selectedNode: TreePill) {
    try {
      // when there is only one item remaining , we just navigate to the dashboard
      selectedNode.nodeType === EntityType.LabLocation
        ? this.navigationService.navigateToDashboard(selectedNode.id, false)
        : this.checkForSelectedLeaf(selectedNode);
    } catch (error) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(
          ErrorType.Script,
          error.stack,
          error.message,
          componentInfo.NavHierarchyComponent +
          blankSpace +
          Operations.NavigatetoNodeContent
        )
      );
    }
  }

  // This conditions checks  if we come for analyte page and when we click on back arrow of header, we land to analyte page only
  checkForSelectedLeaf(selectedNode: TreePill) {
    if ((this.router.url.includes(unRouting.reporting.newReports) ||
      this.router.url.includes(unRouting.reporting.pastReports))
      && this.selectedLeaf &&
      selectedNode.nodeType === EntityType.LabProduct) {
      this.store.dispatch(actions.NavBarActions.setSelectedLeaf({
        selectedLeaf: this.selectedLeaf
      }));
      this.router.navigateByUrl(`/data/${this.selectedLeaf.id}/${this.selectedLeaf.nodeType}/table`);
      if (this.currentBranch[this.currentBranch.length - 1].nodeType === EntityType.LabTest
        && this.currentBranch[this.currentBranch.length - 2].nodeType === EntityType.LabProduct) {
        this.currentBranch.splice(this.currentBranch.length - 2, 2);
      } else {
        this.currentBranch.splice(this.currentBranch.length - 1, 1);
      }
      this.breadcrumbList = this.currentBranch;
    } else {
      if ((this.router.url.includes(unRouting.reporting.newReports) ||
        this.router.url.includes(unRouting.reporting.pastReports))) {
        if (this.currentBranch[this.currentBranch.length - 1].nodeType === this.selectedNode.nodeType) {
          this.breadcrumbList.splice(this.currentBranch.length - 1, 1);
        } else {
          this.breadcrumbList = this.currentBranch;
        }
      }
      this.store.dispatch(
        actions.NavBarActions.setNodeItems({
          nodeType: selectedNode?.nodeType,
          id: selectedNode.id,
        }));
    }
  }

  toolTipLabels(nodeType: EntityType) {
    switch (nodeType) {
      case EntityType.LabLocation:
        return this.instrumentsGroupedByDept
          ? this.getTranslations('TRANSLATION.GODEPARTMENTS')
          : this.getTranslations('TRANSLATION.INSTRUMENTS');
      case EntityType.LabDepartment:
        return this.getTranslations('TRANSLATION.INSTRUMENTS');
      case EntityType.LabInstrument:
        return this.getTranslations('TRANSLATION.LISTCONTROLS');
      case EntityType.LabProduct:
        return this.getTranslations('TRANSLATION.LISTANALYTES');
      default:
        return '';
    }
  }

  getTranslations(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
