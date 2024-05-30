// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject, Subject, forkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { cloneDeep } from 'lodash';

import { LevelSelection } from '../../../contracts/models/portal-api/level-test-settings.model';
import { ExpectedTest, ExpectedTestsTreeNode, ReviewType, UserManageExpectedTestsSettings } from '../../../contracts/models/data-review/data-review-info.model';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ErrorLoggerService } from '../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../contracts/enums/error-type.enum';
import { Operations, componentInfo } from '../../../core/config/constants/error-logging.const';
import { EntityType } from '../../../contracts/enums/entity-type.enum';
import { PortalApiService } from '../../../shared/api/portalApi.service';
import { Department, LabInstrument, LabLocation, LabProduct, LabTest, TreePill } from '../../../contracts/models/lab-setup';
import { blankSpace, includeArchivedItems } from '../../../core/config/constants/general.const';
import { QueryParameter } from '../../../shared/models/query-parameter';
import { DateTimeHelper } from '../../../shared/date-time/date-time-helper';
import { LevelLoadRequest } from '../../../contracts/models/portal-api/labsetup-data.model';
import { RawDataType } from '../../../contracts/models/data-management/base-raw-data.model';
import { Icon } from '../../../contracts/models/shared/icon.model';
import { icons } from '../../../core/config/constants/icon.const';
import { DataReviewService } from '../../../shared/api/data-review.service';
import { BrPermissionsService } from '../../../security/services/permissions.service';
import { Permissions } from '../../../security/model/permissions.model';
import { AppNavigationTracking, AuditTrackingAction, AuditTrackingActionStatus, AuditTrail } from '../../../shared/models/audit-tracking.model';
import { AppNavigationTrackingService } from '../../../../app/shared/services/appNavigationTracking/app-navigation-tracking.service';
import { ChangeTrackerService } from '../../../shared/guards/change-tracker/change-tracker.service';

@Component({
  selector: 'unext-manage-expected-test',
  templateUrl: './manage-expected-test.component.html',
  styleUrls: ['./manage-expected-test.component.scss']
})
export class ManageExpectedTestComponent implements OnInit, OnDestroy{
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.close[24]
  ];
  readonly permissions = Permissions;

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<ExpectedTestsTreeNode, TreePill>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TreePill, ExpectedTestsTreeNode>();

  /** The selection for checklist */
  checklistSelection = new SelectionModel<ExpectedTestsTreeNode>(true /* multiple */);

  /** A selected parent node to be inserted */
  selectedParent: ExpectedTestsTreeNode | null = null;

  treeControl: FlatTreeControl<ExpectedTestsTreeNode>;
  treeFlattener: MatTreeFlattener<TreePill, ExpectedTestsTreeNode>;
  dataSource: MatTreeFlatDataSource<TreePill, ExpectedTestsTreeNode>;
  dataChange = new BehaviorSubject<TreePill[]>([]);
  parentItemCheckBox: boolean;
  isTreeLoaded = false;
  formGroup: FormGroup;
  public hasFormBeenChanged = false;
  public displayWarning = false;

  protected destroy$ = new Subject<boolean>();
  
  public initialData: TreePill[];
  private labLocation: LabLocation;
  private initialUserExpectedTests: Array<ExpectedTest> = []; 
  public reviewType: ReviewType;
  manageExpectedTestsSubHeader: string;
  missingTestsCount: number;
  constructor(
    private portalApiService: PortalApiService,
    private changeTrackerService: ChangeTrackerService,
    private dataReviewApiService: DataReviewService,
    private dateTimeHelper: DateTimeHelper,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<ManageExpectedTestComponent>,
    private translate: TranslateService,
    private errorLoggerService: ErrorLoggerService,
    private brPermissionsService: BrPermissionsService,
    private appNavigationTrackingService: AppNavigationTrackingService
    ) {
    this.treeFlattener = new MatTreeFlattener(this.transformer,this.getLevel,this.isExpandable,this.getChildren);
    this.treeControl = new FlatTreeControl<ExpectedTestsTreeNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }
 
  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({});
    this.initializeTree();
  }
  
  initializeTree() {
    // Build the tree.
    this.labLocation = cloneDeep(this.dialogData.labLocation);
    this.reviewType =  cloneDeep(this.dialogData.reviewType);
    this.manageExpectedTestsSubHeader = (this.reviewType === ReviewType.Bench) ? 'MANAGEEXPECTEDTEST.MANAGEEXPECTEDTESTSBENCHSUBHEADER' : 'MANAGEEXPECTEDTEST.MANAGEEXPECTEDTESTSSUPERVISORSUBHEADER' ;
    let labLocationChildren: Array<TreePill> = this.labLocation.children;
    let apiRequests = [];
    const queryParameters = [new QueryParameter(includeArchivedItems, 'false')];
    
    if (this.labLocation && this.labLocation.children) {
      if (this.labLocation.locationSettings.instrumentsGroupedByDept) {
        labLocationChildren
        .filter(nodeItem => nodeItem.nodeType === EntityType.LabDepartment)
        .forEach((labLocationChild) => {
          apiRequests.push(this.portalApiService.getLabSetupNode<Department>(EntityType.LabDepartment, labLocationChild.id,
            LevelLoadRequest.LoadAllDescendants, EntityType.None, queryParameters, true));
        });
      } else {
        labLocationChildren
        .filter(nodeItem => nodeItem.nodeType === EntityType.LabInstrument)
        .forEach((labLocationChild) => {
          apiRequests.push(this.portalApiService.getLabSetupNode<LabInstrument>(EntityType.LabInstrument, labLocationChild.id,
            LevelLoadRequest.LoadUpToGrandchildren, EntityType.None, queryParameters, true));
        });
      }

      apiRequests.push(this.dataReviewApiService.getExpectedTests(this.labLocation.id));

      this.labLocation.children = [];

      forkJoin(...apiRequests)
      .pipe(
        take(1)
      )
      .subscribe((apiResponses: Array<any>) => {
        let labLocationChildrenWithRunDataTests: Department[] | LabInstrument[] = [];

        if (apiResponses && apiResponses.length > 1) {
          // The last result is the userExpectedTestsSettings response
          const userExpectedTestsSettings = apiResponses.splice(apiResponses.length - 1, 1)[0] as UserManageExpectedTestsSettings;
          const userExpectedTests = this.initialUserExpectedTests = userExpectedTestsSettings.expectedTests;

          apiResponses.forEach((labLocationChild) => {
            this.filterTreeWithRunDataTests(labLocationChild);

            if (labLocationChild.children && labLocationChild.children.length > 0) {
              labLocationChildrenWithRunDataTests.push(labLocationChild);
            }
          });

          this.labLocation.children = labLocationChildrenWithRunDataTests;

          // Create lab test level checkbox form
          let allLabTests = new Array<LabTest>();
          let treeNodeStack = new Array<TreePill>();

          // Get flat list of tests
          treeNodeStack.push(this.labLocation);

          while (treeNodeStack.length > 0) {
            let treeNode = treeNodeStack.pop();
            if (treeNode.children && treeNode.children.length > 0) {
              treeNode.children.forEach(treeNodeChild => {
                if (treeNodeChild.nodeType === EntityType.LabTest) {
                  const labTest = treeNodeChild as LabTest;
                  if (labTest.levelSettings.dataType === RawDataType.RunData) {
                    allLabTests.push(labTest);
                  }
                } else if (treeNodeChild.nodeType === EntityType.LabDepartment || treeNodeChild.nodeType === EntityType.LabInstrument
                  || treeNodeChild.nodeType === EntityType.LabProduct) {
                  treeNodeStack.push(treeNodeChild);
                }
              });
            }
          }

          // Create checkbox controls from test levels
          if (allLabTests.length > 0) {
            allLabTests.forEach(labTest => {
              const levels = labTest?.levelSettings?.levels || [];
              levels.forEach((level, i) => {
                if (level.levelInUse) {
                  this.formGroup.addControl(`${labTest.id}_${i + 1}`, new FormControl());
                }
              });
            });
          }

          // Populate tree
          this.dataSource.data = [this.labLocation];
          this.treeControl.expandAll();

          // Initialize checkbox controls
          if (allLabTests.length > 0) {
            allLabTests.forEach(labTest => {
              const levels = labTest?.levelSettings?.levels || [];
              let allLevelsSelected = true;
              let hasLevelInUse = false;
              levels.forEach((level, i) => {
                if (level.levelInUse) {
                  const isSelected = userExpectedTests.findIndex(expectedTest => expectedTest.labLotTestId === labTest.id
                    && expectedTest.level === (i + 1) && expectedTest.isSelected) >= 0;
                  this.formGroup.get(`${labTest.id}_${i + 1}`).setValue(isSelected);
                  allLevelsSelected = allLevelsSelected && isSelected;
                  hasLevelInUse = true;
                }
              });

              if (hasLevelInUse && allLevelsSelected) {
                const node = this.treeControl.dataNodes.find(node => node.id === labTest.id);

                if (node) {
                  this.checklistSelection.select(node);
                  this.checkAllParentsSelection(node);
                }
              }
            });
          }

          if (this.hasPermissionToAccess([this.permissions.ManageExpectedTests])) {
            this.setupChangeTracker();
          }
        }

        this.isTreeLoaded = true;
        }, err => {
          this.errorLoggerService.logErrorToBackend(
            this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
              (componentInfo.ManageExpectedTests + blankSpace + Operations.LoadLabLocationAndExpectedTests)));
        });
    }
  }

  private filterTreeWithRunDataTests(treeNode: TreePill): void {
    if (treeNode.children && treeNode.children.length > 0) {
      if (treeNode.nodeType === EntityType.LabProduct) {
        let labTestsWithRawDataType = new Array<TreePill>();
        treeNode.children.forEach(treeNodeChild => {
          if (treeNodeChild.nodeType === EntityType.LabTest) {
            const labTest = treeNodeChild as LabTest;
            if (labTest.levelSettings.dataType === RawDataType.RunData) {
              labTestsWithRawDataType.push(treeNodeChild);
            }
          }
        });

        treeNode.children = labTestsWithRawDataType;
      } else {
        let treeNodeChildren = new Array<TreePill>();
        treeNode.children.forEach(treeNodeChild => {
          this.filterTreeWithRunDataTests(treeNodeChild);

          if (treeNodeChild.children && treeNodeChild.children.length > 0) {
            treeNodeChildren.push(treeNodeChild);
          }
        });

        treeNode.children = treeNodeChildren;
      }
    }
  }

  getLevel = (node: ExpectedTestsTreeNode) => node.level;

  isExpandable = (node: ExpectedTestsTreeNode) => node.expandable;

  getChildren = (node: TreePill): TreePill[] => node.children;

  hasChild = (_: number, _nodeData: ExpectedTestsTreeNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: ExpectedTestsTreeNode) => _nodeData.displayName === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TreePill, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.displayName === node.displayName ? existingNode : new ExpectedTestsTreeNode();
    flatNode.id = node.id;
    flatNode.nodeType = node.nodeType;
    flatNode.displayName = node.displayName;
    if (node.nodeType === EntityType.LabProduct) {
      flatNode.isLotExpired = this.dateTimeHelper.isExpired((node as LabProduct).lotInfo.expirationDate);
      if (node && node.children && node.children.length > 0) {
        node.children = node.children.map((analyte: LabTest) => {
          analyte.isLotExpired = flatNode.isLotExpired;
          return analyte;
        });
      }
      flatNode.secondaryText =
        this.getTranslation("MANAGEEXPECTEDTEST.LOT") + ' ' + (node as LabProduct)?.lotInfo?.lotNumber;
    }
    if (node.nodeType === EntityType.LabTest) {
      const labTest = node as LabTest;
      flatNode.isLotExpired = (node as LabTest).isLotExpired;
      flatNode.secondaryText =
        this.getTranslation("MANAGEEXPECTEDTEST.CALIBRATORLOT") + ' ' + ((node as LabTest)?.testSpecInfo?.calibratorLot?.lotNumber).toString() + ' '
        + this.getTranslation("MANAGEEXPECTEDTEST.REAGENTLOT") + ' ' + ((node as LabTest)?.testSpecInfo?.reagentLot?.lotNumber).toString();

      flatNode.levels = [];

      const levels = labTest?.levelSettings?.levels || [];
      levels.forEach((level, i) => {
        if (level.levelInUse) {
          let levelSelection = new LevelSelection();
          levelSelection.level = i + 1;
          levelSelection.isSelected = false;
          flatNode.levels.push(levelSelection);
        }
      });
    }
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: ExpectedTestsTreeNode): boolean {
    if (node.nodeType === EntityType.LabTest && this.getLevelSelectionState(node)) {
      return true;
    }

    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child) && (child.nodeType !== EntityType.LabTest || this.getLevelSelectionState(child));
      });
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: ExpectedTestsTreeNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child)
      || (child.nodeType === EntityType.LabTest && (this.getLevelSelectionState(child) || this.getLevelSelectionState(child) === null)));
    return result && !this.descendantsAllSelected(node);
  }

  private expandAllChildren(node: ExpectedTestsTreeNode): void {
    this.treeControl.expand(node);
    const descendants = this.treeControl.getDescendants(node);
    for (const innerNode of descendants) {
      this.treeControl.expand(innerNode);
    }
  }
  
  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  toggleNodeSelection(node: ExpectedTestsTreeNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);

    if (this.checklistSelection.isSelected(node)) {
      this.checklistSelection.select(...descendants);
    } else {
      this.checklistSelection.deselect(...descendants);
    }

    // Force update for the parent
    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkRootNodeSelection(node);
    this.checkAllParentsSelection(node);
  }

 /** Toggle the to-do item selection. Select/deselect all the descendants node */
  parentItemSelectionToggle(node: ExpectedTestsTreeNode, parentItemCheckBox: MatCheckbox) {
    this.parentItemCheckBox = true;

    this.expandAllChildren(node);
    this.toggleNodeSelection(node);

    this.updateLevelSelectionsBasedOnParentNode(node);
  }

  updateTestNodeBasedOnLevelsSelected(node: ExpectedTestsTreeNode): void {
    if (this.getLevelSelectionState(node)) {
      this.checklistSelection.select(node);
    } else {
      this.checklistSelection.deselect(node);
    }
    this.updateAncestors(node);
  }

  updateLevelSelectionsBasedOnParentNode(node: ExpectedTestsTreeNode): void {
    const descendants = this.treeControl.getDescendants(node);

    if (descendants && descendants.length > 0) {
      descendants.forEach(childNode => {
        if (childNode.levels && childNode.levels.length) {
          childNode.levels.forEach((levelSelection) => {
            this.formGroup.get(`${childNode.id}_${levelSelection.level}`).setValue(this.checklistSelection.isSelected(childNode));
          });
        }
      });
    }
  }

  toggleTestNode(node: ExpectedTestsTreeNode): void {
    this.checklistSelection.toggle(node);

    if (node.levels && node.levels.length) {
      node.levels.forEach((levelSelection) => {
        levelSelection.isSelected = this.checklistSelection.isSelected(node);
        this.formGroup.get(`${node.id}_${levelSelection.level}`).setValue(this.checklistSelection.isSelected(node));
      });
    }

    this.checkAllParentsSelection(node);
  }

  updateAncestors(node: ExpectedTestsTreeNode): void {
    let parent = this.getParentNode(node);
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length <= 0 || descendants.length > 0 &&
        descendants.every(child => {
          return this.checklistSelection.isSelected(child);
        });

    while (parent) {
      if (!nodeSelected || !descAllSelected) {
        this.checklistSelection.deselect(parent);
      } else if (nodeSelected && descAllSelected) {
        this.checklistSelection.select(parent);
      }
      parent = this.getParentNode(parent);
    }
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: ExpectedTestsTreeNode): void {
    let parent: ExpectedTestsTreeNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: ExpectedTestsTreeNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });

    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  getLevelSelectionState(childNode: ExpectedTestsTreeNode): boolean | null {
    let checkedCount = 0;
    let uncheckedCount = 0;

    if (childNode.levels && childNode.levels.length) {
      childNode.levels.forEach((levelSelection) => {
        if (!!this.formGroup.get(`${childNode.id}_${levelSelection.level}`).value) {
          checkedCount++;
        } else {
          uncheckedCount++;
        }
      });
    } else {
      return this.checklistSelection.isSelected(childNode);
    }

    return checkedCount > 0 && uncheckedCount > 0
      ? null
      : checkedCount > 0 && uncheckedCount === 0;
  }

  /* Get the parent node of a node */
  getParentNode(node: ExpectedTestsTreeNode): ExpectedTestsTreeNode | null {
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

  public saveExpectedTests() {
    const userExpectedTestsSettings = new UserManageExpectedTestsSettings();

    userExpectedTestsSettings.labLocationId = this.labLocation.id;
    userExpectedTestsSettings.expectedTests = new Array<ExpectedTest>();
    for (const formFieldName in this.formGroup.controls) {
      const formField = this.formGroup.controls[formFieldName];
      if (formField.value) {
        const labLotTestId = formFieldName.substring(0, formFieldName.indexOf('_'));
        const level = +(formFieldName.substring(formFieldName.indexOf('_') + 1));
        const expectedTest = new ExpectedTest();
        expectedTest.labLotTestId = labLotTestId;
        expectedTest.level = level;
        expectedTest.isSelected = true;
        userExpectedTestsSettings.expectedTests.push(expectedTest);
      }
    }

    const auditTrail: AuditTrail = {
      eventType: AuditTrackingAction.ManageExpectedTests,
      action: AuditTrackingAction.Update,
      actionStatus: AuditTrackingActionStatus.Success,
      priorValue: {
        expectedTests: this.initialUserExpectedTests 
      },
      currentValue: {
        expectedTests: userExpectedTestsSettings.expectedTests
      }
    };
    const appNavigationTracking: AppNavigationTracking = {
      auditTrail: auditTrail
    }
    const auditNavTracking = this.appNavigationTrackingService.prepareAuditTrailPayload(appNavigationTracking);
    userExpectedTestsSettings.auditDetails = auditNavTracking;
    this.dataReviewApiService.putExpectedTests(userExpectedTestsSettings)
    .pipe(
      take(1)
    )
    .subscribe(
      (res) => {
        this.missingTestsCount = res.missingTestsCount;
        this.dialogRef.close(this.missingTestsCount);
        this.changeTrackerService.resetDirty();
        
      }, err => {
        this.errorLoggerService.logErrorToBackend(
          this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
            (componentInfo.ManageExpectedTests + blankSpace + Operations.PutExpectedTests)));
      });
  }

  hasPermissionToAccess(permissionsConfig: Array<number>): boolean {
    return permissionsConfig ? this.brPermissionsService.hasAccess(permissionsConfig) : false;
  }

  private getTranslation(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }

  cancel() {
    if (this.changeTrackerService.unSavedChanges) {
      this.displayWarning = true;
    } else {
      this.dialogRef.close();
    }
  }

  resetTrackerService() {
    this.changeTrackerService.resetDirty();
    this.dialogRef.close();
  }

  setupChangeTracker(): void {
    const me = this;
    me.changeTrackerService.getDialogRef(async function () {
      me.dialogRef.close();
    });
    me.formGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(
      () => {
        me.changeTrackerService.setDirty();
        me.changeTrackerService.setCustomPrompt(async function () {
          me.displayWarning = true;
        });
        this.hasFormBeenChanged = true;
      }
    );
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
