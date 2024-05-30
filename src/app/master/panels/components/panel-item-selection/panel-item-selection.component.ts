// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { flatMap, take, takeUntil } from 'rxjs/operators';
import { MatCheckbox } from '@angular/material/checkbox';

import { cloneDeep, differenceBy, uniq, orderBy } from 'lodash';

import { NavigationState } from '../../../../shared/navigation/state/reducers/navigation.reducer';
import * as fromNavigationSelector from '../../../../shared/navigation/state/selectors';
import { LabProduct, LabTest, TreePill } from '../../../../contracts/models/lab-setup';
import { LevelLoadRequest } from '../../../../contracts/models/portal-api/labsetup-data.model';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import { TreeItemFlatNode } from '../../models/tree-item-flat-node.model';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { QueryParameter } from '../../../../shared/models/query-parameter';
import {
  asc, id, includeArchivedItems, panelItemCalibratorId, panelItemProductMasterLotId, panelItemReagentLotId, sortOrder
} from '../../../../core/config/constants/general.const';
import { MessageSnackBarService } from '../../../../core/helpers/message-snack-bar/message-snack-bar.service';
import { DateTimeHelper } from '../../../../shared/date-time/date-time-helper';
import { Permissions } from '../../../../security/model/permissions.model';
import { BrPermissionsService } from '../../../../security/services/permissions.service';
import { PanelsApiService } from '../../services/panelsApi.service';



@Component({
  selector: 'unext-panel-item-selection',
  templateUrl: './panel-item-selection.component.html',
  styleUrls: ['./panel-item-selection.component.scss']
})

export class PanelItemSelectionComponent implements OnInit, OnDestroy {

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TreeItemFlatNode, TreePill>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TreePill, TreeItemFlatNode>();

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TreeItemFlatNode>(true /* multiple */);

  treeControl: FlatTreeControl<TreeItemFlatNode>;
  treeFlattener: MatTreeFlattener<TreePill, TreeItemFlatNode>;
  dataSource: MatTreeFlatDataSource<TreePill, TreeItemFlatNode>;
  permissions = Permissions;
  dataChange = new BehaviorSubject<TreePill[]>([]);
  parentItemCheckBox: boolean;

  get data(): TreePill[] { return this.dataChange.value; }

  private analyteLevel = 3;
  private readonly numberOfItemsAllowedTobeSelected = 75;
  protected destroy$ = new Subject<boolean>();
  public initialData: TreePill[];
  public lotExpiredToolTip: string;
  private _selectedItems: Array<LabTest> = [];
  get selectedItems(): Array<LabTest> {
    return this._selectedItems;
  }
  @Input('selectedItems')
  set selectedItems(value: Array<LabTest>) {
    if (this._selectedItems?.length < value?.length) {
      if (this._selectedItems?.length === 0) {
        // first load all the braches consists list of input analytes.
        this.loadBrachesAndPopulateAnalyteSelection(value);
      }
      this.populateAnalyteSelection(value);
    } else if (this._selectedItems?.length > value?.length) {
      const analytesTobeDeselected = differenceBy(this._selectedItems, value, id);
      this.removeAnalyteSelection(analytesTobeDeselected);
    }
    this._selectedItems = value;
  }
  @Output() selectedItemsEvent = new EventEmitter<Array<LabTest>>();

  constructor(
    private portalApiService: PortalApiService,
    private store: Store<NavigationState>,
    public messageSnackBar: MessageSnackBarService,
    private dateTimeHelper: DateTimeHelper,
    private panelsApiService: PanelsApiService,
    private brPermissionsService: BrPermissionsService,
    public translate: TranslateService) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TreeItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    this.initialize();
    this.dataChange.subscribe(data => {
      this.dataSource.data = data;
      this.panelsApiService.panelItemList = data;
    });
  }

  ngOnInit(): void {
    this.initializeAnalyteLevel();
    this.lotExpiredToolTip = this.getTranslations('PANELCOMPONENT.PANELITEMSELECTIONCOMPONENT.LOTISEXPIRED');
  }

  initialize() {
    return new Promise(resolve => {
      this.store.pipe(select(fromNavigationSelector.getCurrentBranchState))
        .pipe(takeUntil(this.destroy$)).subscribe((currentBranch: TreePill[]) => {

          if (currentBranch && currentBranch[0]?.children?.length) {
            let tempData = currentBranch[0].children.filter(child => child.nodeType !== EntityType.Panel);
            tempData = orderBy(tempData, [sortOrder, (node: TreePill) => node.displayName.replace(/\s/g, '').toLocaleLowerCase()], [asc, asc]);
            const data = cloneDeep(tempData);
            this.initialData = [];
            const archivedItems = [];

            for (const node of data) {
              if (node.isArchived) {
                archivedItems.push(node);
              } else {
                this.initialData.push(node);
              }
            }
            for (const node of archivedItems) {
              this.initialData.push(node);
            }
            this.dataChange.next(this.initialData);
            if (this.selectedItems && this.selectedItems.length > 0) {
              this.loadBrachesAndPopulateAnalyteSelection(this.selectedItems, true);
            }
            resolve(this.initialData);
          } else if (currentBranch?.length && currentBranch[0]?.id) {
            this.portalApiService.getLabSetupNode(currentBranch[0].nodeType, currentBranch[0].id, LevelLoadRequest.LoadChildren, EntityType.LabDepartment)
              .pipe(take(1)).subscribe((node: TreePill) => {
                const tempData = orderBy(node.children,
                  [sortOrder, (_node: TreePill) => _node.displayName.replace(/\s/g, '').toLocaleLowerCase()], [asc, asc]);
                const data = cloneDeep(tempData);
                this.initialData = [];
                const archivedItems = [];
                for (const _node of data) {
                  if (_node.isArchived) {
                    archivedItems.push(_node);
                  } else {
                    this.initialData.push(_node);
                  }
                }
                for (const _node of archivedItems) {
                  this.initialData.push(_node);
                }
                this.dataChange.next(this.initialData);
                if (this.selectedItems && this.selectedItems.length > 0) {
                  this.loadBrachesAndPopulateAnalyteSelection(this.selectedItems, true);
                }
                resolve(this.initialData);
              });
          }
        });
    });
  }

  initializeAnalyteLevel(): void {
    this.store.pipe(select(fromNavigationSelector.getInstrumentsGroupedByDeptVal))
      .pipe(take(1)).subscribe((hasDepartments: boolean) => {
        this.analyteLevel = hasDepartments ? 3 : 2;
      });
  }

  getLevel = (node: TreeItemFlatNode) => node.level;

  isExpandable = (node: TreeItemFlatNode) => node.expandable;

  getChildren = (node: TreePill): TreePill[] => node.children;

  hasChild = (_: number, _nodeData: TreeItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TreeItemFlatNode) => _nodeData.displayName === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TreePill, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.displayName === node.displayName
      ? existingNode
      : new TreeItemFlatNode();
    flatNode.displayName = node.displayName;
    if (node.nodeType === EntityType.LabProduct) {
      flatNode.isLotExpired = this.dateTimeHelper.isExpired((node as LabProduct).lotInfo.expirationDate);
      if (node && node.children && node.children.length > 0) {
        node.children = node.children.map((analyte: LabTest) => {
          analyte.isLotExpired = flatNode.isLotExpired;
          return analyte;
        });
      }
      flatNode.secondaryText = this.getTranslations('PANELCOMPONENT.PANELITEMSELECTIONCOMPONENT.LOT') + ' ' + (node as LabProduct)?.lotInfo?.lotNumber;
    }
    if (node.nodeType === EntityType.LabTest) {
      flatNode.isLotExpired = (node as LabTest).isLotExpired;
      flatNode.secondaryText = this.getTranslations('PANELCOMPONENT.PANELITEMSELECTIONCOMPONENT.CALIBRATOR') + ' ' + (((node as LabTest)?.testSpecInfo?.calibratorLot?.lotNumber).toString() ? this.getTranslations('PANELCOMPONENT.PANELITEMSELECTIONCOMPONENT.UNSPECIFIED') + '  ***' : '') + ' ' + this.getTranslations('PANELCOMPONENT.PANELITEMSELECTIONCOMPONENT.REAGENT') + ' ' + (((node as LabTest)?.testSpecInfo?.reagentLot?.lotNumber).toString() ? this.getTranslations('PANELCOMPONENT.PANELITEMSELECTIONCOMPONENT.UNSPECIFIED') + '  ***' : '');
    }
    flatNode.level = level;
    flatNode.expandable = !!node?.children?.length || node.nodeType !== EntityType.LabTest;
    flatNode.isArchived = node.isArchived;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TreeItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    if (descendants.length === 0) {
      return this.checklistSelection.isSelected(node);
    }
    return descendants.every(child => this.checklistSelection.isSelected(child));
  }

  /** Load all the braches and prepopulate existing analytes under the panel */
  async loadBrachesAndPopulateAnalyteSelection(selectedItems: LabTest[], alreadyInitialized?: boolean) {
    // As this function only gets called at the initialization of component, we need to get initial data for tree first.
    if (!alreadyInitialized) {
      await this.initialize();
    }

    let ids = selectedItems.map(selectedItem => selectedItem.id);
    ids = uniq(ids);
    const ancestors: Array<Array<TreePill>> = await this.portalApiService.getLabSetupAncestorsMultiple(EntityType.LabTest, ids).pipe(take(1)).toPromise();
    let parentsTobeExpanded: Array<TreePill> = [];
    let parentsTobeLoaded: Array<TreePill> = [];
    for (const ancestor of ancestors) {
      const filteredInstruments = ancestor.filter(node => node.nodeType === EntityType.LabInstrument);
      const filteredDepartments = ancestor.filter(node => node.nodeType === EntityType.LabDepartment);
      if (filteredDepartments?.length > 0) {
        parentsTobeExpanded.push(filteredDepartments[0]);
      }
      if (filteredInstruments?.length > 0) {
        parentsTobeLoaded.push(filteredInstruments[0]);
      }
    }

    parentsTobeLoaded = this.treeControl.dataNodes
      .map((dataNode: TreeItemFlatNode) => this.flatNodeMap.get(dataNode))
      .filter((treePillNode: TreePill) => parentsTobeLoaded.some((parent: TreePill) => parent.parentNodeId === treePillNode.id));
    for (const parent of parentsTobeLoaded) {
      await this.insertChildren(parent, LevelLoadRequest.LoadAllDescendants, true);
    }

    parentsTobeExpanded = this.treeControl.dataNodes
      .map((dataNode: TreeItemFlatNode) => this.flatNodeMap.get(dataNode))
      .filter((treePillNode: TreePill) => parentsTobeExpanded.some((parent: TreePill) => parent.id === treePillNode.id));
    for (const parent of parentsTobeExpanded) {
      this.expandAllChildren(this.nestedNodeMap.get(parent));
    }
    this.populateAnalyteSelection(selectedItems);
  }

  /** prepopulate all the existing analytes under the panel */
  populateAnalyteSelection(selectedItems: Array<LabTest>): void {
    const analytesOnTree: Array<TreePill> = this.treeControl.dataNodes.filter(child => {
      return child.level === this.analyteLevel;
    }).map(child => this.flatNodeMap.get(child));
    const analytesTobeSelected: Array<TreeItemFlatNode> = analytesOnTree
      .filter((analyte: TreePill) => selectedItems.some((selectedItem: LabTest) => analyte.id === selectedItem.id))
      .map((element) => this.nestedNodeMap.get(element));
    this.checklistSelection.select(...analytesTobeSelected);
    // Force update for the parent
    analytesTobeSelected.forEach(child => {
      this.checkAllParentsSelection(child);
      this.checklistSelection.isSelected(child);
    });
  }

  /** prepopulate (remove selection) all the existing analytes under the panel */
  removeAnalyteSelection(analytesTobeDeselected: Array<LabTest>): void {
    const analytesOnTree: Array<TreePill> = this.treeControl.dataNodes.filter(child => {
      return child.level === this.analyteLevel;
    }).map(child => this.flatNodeMap.get(child));
    const flatNodeAnalytesTobeDeselected: Array<TreeItemFlatNode> = analytesOnTree
      .filter((analyte: TreePill) => analytesTobeDeselected.some((selectedItem: LabTest) => analyte.id === selectedItem.id))
      .map((element) => this.nestedNodeMap.get(element));
    this.checklistSelection.deselect(...flatNodeAnalytesTobeDeselected);
    // Force update for the parent
    flatNodeAnalytesTobeDeselected.forEach(child => {
      this.checkAllParentsSelection(child);
      this.checklistSelection.isSelected(child);
    });
  }


  /** output selected analytes. */
  emitSelectedDescendants(): void {
    this._selectedItems = this.getSelectedDescendants();
    this.selectedItemsEvent.emit(this._selectedItems);
  }

  /** get selected descendants of the tree. */
  getSelectedDescendants(): LabTest[] {
    if (this.treeControl.dataNodes.length) {
      return this.treeControl.dataNodes.filter(child => {
        return this.checklistSelection.isSelected(child) && child.level === this.analyteLevel;
      }).map(child => this.flatNodeMap.get(child) as LabTest);
    } else {
      return [];
    }
  }

  async expandWithGettingNewChildren(node: TreeItemFlatNode) {
    if (this.treeControl.isExpanded(node)) {
      node.isLoading = true;
      const parentNode = this.flatNodeMap.get(node);
      await this.insertChildren(parentNode, LevelLoadRequest.LoadChildren);
      node.isLoading = false;
    }
  }

  /** Add an item to to-do list */
  insertChildren(parent: TreePill, levelLoadOption: LevelLoadRequest, insertAnyway?: boolean, expand?: boolean): Promise<TreePill> {
    return new Promise(resolve => {
      if (!(parent?.children?.length) || parent.nodeType === EntityType.LabDepartment || insertAnyway) {
        this.store.pipe(select(fromNavigationSelector.getIsArchiveItemsToggleOn))
          .pipe(flatMap((isArchiveItemsToggleOn: boolean) => {
            const queryParameter = new QueryParameter(includeArchivedItems, (isArchiveItemsToggleOn).toString());
            return this.portalApiService.getLabSetupNode(parent.nodeType, parent.id, levelLoadOption, EntityType.None, [queryParameter]);
          })).pipe(take(1)).subscribe((node: TreePill) => {
            parent.children = this.sortNestedChildren(node.children);
            if (expand) {
              this.treeControl.expand(this.nestedNodeMap.get(parent));
            }
            if (!this.parentItemCheckBox) {
              const priorPanelList = this.panelsApiService.priorPanelItemListData(this.data);
              this.panelsApiService.priorPanelList = priorPanelList;
            } else {
              if (parent.nodeType === EntityType.LabDepartment) {
                this.panelsApiService.changedPanelList.push(node);
              }
            }
            this.dataChange.next(this.data);
            resolve(parent);
          });
      } else {
        resolve(parent);
      }
    });
  }

  /** Sort the nested nodes i.e. children under children in case of LoadUpToGrandchildren */
  sortNestedChildren(array: Array<TreePill>): Array<TreePill> {
    if (array && array.length > 0) {
      if (array[0].nodeType === EntityType.LabProduct) {
        array = orderBy(array,
          [sortOrder, (child: LabProduct) => child.displayName.replace(/\s/g, '').toLocaleLowerCase(), (child: LabProduct) => child.lotInfo.lotNumber.replace(/\s/g, '').toLocaleLowerCase()], [asc, asc, asc]);
      } else {
        array = orderBy(array, [sortOrder, (child: TreePill) => child.displayName.replace(/\s/g, '').toLocaleLowerCase()], [asc, asc]);
      }
      for (const child of array) {
        child.children = this.sortNestedChildren(child.children);
      }
    }
    return array;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TreeItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  async parentItemSelectionToggle(node: TreeItemFlatNode, parentItemCheckBox: MatCheckbox) {
    this.parentItemCheckBox = true;
    let descendants = this.treeControl.getDescendants(node);
    if (!this.checklistSelection.isSelected(node)) {
      if (this.canSelectMoreItem(node)) {
        this.checklistSelection.toggle(node);
        const treePillNode = this.flatNodeMap.get(node);
        await this.insertChildren(treePillNode, LevelLoadRequest.LoadUpToGrandchildren);
        this.expandAllChildren(node);
        if (node.level === 0) {
          descendants = this.treeControl.getDescendants(node);
          const controls = descendants.filter((descendant: TreeItemFlatNode) => descendant.level === this.analyteLevel - 1);
          for (const control of controls) {
            const child = this.flatNodeMap.get(control);
            const controlWithChildren = await this.insertChildren(child, LevelLoadRequest.LoadChildren);
            this.expandAllChildren(control);
            descendants = this.treeControl.getDescendants(node);
            let limitReached = false;
            if (controlWithChildren.children) {
              for (const analyte of controlWithChildren.children) {
                // If the decscendant is archived then do not select it
                if (!analyte.isArchived && !(analyte as LabTest).isLotExpired) {
                  const flatAnalyte = this.nestedNodeMap.get(analyte);
                  if (this.canSelectMoreItem(flatAnalyte)) {
                    this.checklistSelection.select(flatAnalyte);
                    this.checkAllParentsSelection(flatAnalyte);
                  } else {
                    this.alertUserAboutLimit();
                    limitReached = true;
                    break;
                  }
                }
              }
            }
            if (limitReached) {
              break;
            }
          }
        } else {
          descendants = this.treeControl.getDescendants(node);
          for (let index = 0; index < descendants.length; index++) {
            // If the decscendant is archived then do not select it
            if (descendants[index] && !descendants[index].isArchived && !descendants[index].isLotExpired) {
              if (this.canSelectMoreItem(descendants[index])) {
                this.checklistSelection.select(descendants[index]);
                this.checkAllParentsSelection(descendants[index]);
              } else {
                this.alertUserAboutLimit();
                break;
              }
            }
          }
        }
      } else {
        parentItemCheckBox.checked = false;
        this.alertUserAboutLimit();
      }
    } else {
      this.checklistSelection.toggle(node);
      this.checklistSelection.deselect(...descendants);
    }
    // Force update for the parent
    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
    this.emitSelectedDescendants();
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  leafItemSelectionToggle(node: TreeItemFlatNode, leafItemCheckBox): void {

    if (this.canSelectMoreItem(node)) {
      this.checklistSelection.toggle(node);
      this.checkAllParentsSelection(node);
      this.emitSelectedDescendants();
    } else {
      if (leafItemCheckBox) {
        leafItemCheckBox._checked = false;
      }
      this.alertUserAboutLimit();
    }
  }

  private alertUserAboutLimit() {
    this.messageSnackBar.showMessageSnackBar(
      this.getTranslations('PANELCOMPONENT.PANELITEMSELECTIONCOMPONENT.MAXNUMBER')
    );
  }

  private canSelectMoreItem(node: TreeItemFlatNode): boolean {
    return this.checklistSelection.isSelected(node) || this.getSelectedDescendants().length < this.numberOfItemsAllowedTobeSelected;
  }

  private expandAllChildren(node: TreeItemFlatNode): void {
    this.treeControl.expand(node);
    const descendants = this.treeControl.getDescendants(node);
    for (const innerNode of descendants) {
      this.treeControl.expand(innerNode);
    }
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TreeItemFlatNode): void {
    let parent: TreeItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TreeItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.length > 0 && descendants.every(child => {
      return this.checklistSelection.isSelected(child);
    });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: TreeItemFlatNode): TreeItemFlatNode | null {
    const currentLevel = this.getLevel(node);
    if (currentLevel < 1) {
      return null;
    }
    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  /* checking Permissions */
  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getTranslations(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }
}
