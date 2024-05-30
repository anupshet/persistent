// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { createAction, props, union } from '@ngrx/store';
import { HierarchyNode } from 'd3-hierarchy';

import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { TreePill } from '../../../../contracts/models/lab-setup/tree-pill.model';
import { Error } from '../../../../contracts/models/shared/error.model';
import { MenuLink } from '../../../models/menu-link.model';
import { SortOrder } from '../../models/sort-entity.model';

export const toggleNavigationbar = createAction(
  '[Navigation] Expand Navigation bar ',
  props<{ isSideNavExpanded: boolean }>()
);

export const toggleNavigationbarSuccess = createAction(
  '[Navigation] Toggle Expansion and Collapse of  Navigation bar Success ',
  props<{ isSideNavExpanded: boolean }>()
);

export const toggleNavigationbarFailure = createAction(
  '[Navigation] Expand Navigation bar Failure ',
  props<{ error: Error }>()
);

export const getCurrentlySelectedNode = createAction(
  '[Navigation] Retrieve the currently selected Node',
  props<{ selectedNode: TreePill }>()
);

export const setNavigationNodeItems = createAction(
  '[Navigation] Set  Node and main content ',
  props<{ selectedNode: TreePill }>()
);

export const setCurrentlySelectedNodeChildren = createAction(
  '[Navigation] Set the currently selected Node Children'
);

export const setAllNavItemsWithNodeId = createAction(
  '[Navigation] Set all Nav Items with Node Id',
  props<{ nodeType: EntityType, nodeId: string }>()
);

export const setCurrentlySelectedNodeFailure = createAction(
  '[Navigation] Set the currently selected Node Failure',
  props<{ error: Error }>()
);

export const setDefaultNode = createAction(
  '[Navigation] Set the default node selected Node',
  props<{ selectedNode: TreePill }>()
);

export const setSelectedLeaf = createAction(
  '[Navigation] Set the currently selected Leaf',
  props<{ selectedLeaf: TreePill }>()
);

export const getSideNavState = createAction(
  '[Navigation] Get the Side Nav State',
  props<{ isSideNavExpanded: boolean }>()
);

export const setCurrentBranchState = createAction(
  '[Navigation] Set Node into the Current Branch State',
  props<{ currentBranchItem: TreePill }>()
);
export const setCurrentBranchStates = createAction(
  '[Navigation] Set Node Arrays into the Current Branch State',
  props<{ currentBranchItems: Array<TreePill> }>()
);

export const setNodeItems = createAction(
  '[Navigation] Set Node Items to the Current Branch and Selected Node',
  props<{ nodeType: EntityType, id: string, isManageControl?: boolean }>()
);

export const updateNavigation = createAction(
  '[Navigation] Update Navigation with the Selected Node',
  props<{ nodeType: EntityType, id: string }>()
);
export const loadAllChildrenForNode = createAction(
  '[Navigation] Load All children for a Selected Node',
  props<{ ancestors: Array<TreePill> }>()
);

export const setItemToCurrentBranch = createAction(
  '[Navigation] Add Node to the Current Branch State',
  props<{ currentBranchItem: TreePill }>()
);

export const removeLastItemFromCurrentBranch = createAction(
  '[Navigation] Remove Last Node from the Current Branch State'
);

export const removeItemsFromCurrentBranch = createAction(
  '[Navigation] Remove Node from the Current Branch State',
  props<{ item: TreePill }>()
);

export const loadContentPane = createAction(
  '[Navigation] Load the main content in content-Pane',
  props<{ selectedNode: TreePill, isManageControl?: boolean }>()
);

export const navigateToContent = createAction(
  '[Navigation] Navigate To Content',
  props<{ selectedLink: MenuLink }>()
);

export const navigateToLabSetupDefault = createAction(
  '[Navigation] Navigate To Lab Setup Default Page'
);

export const navigateToDashboard = createAction(
  '[Navigation] Navigate ToDashboard Page'
);

export const setConnectivityIconData = createAction(
  '[Navigation] Set connectivity data',
  props<{ hasConnectivityData: boolean }>()
);

export const setShowSettings = createAction(
  '[Navigation] Set Show Settings data',
  props<{ showSettings: boolean }>()
);

export const setHasNonBrLicense = createAction(
  '[Navigation] Set Has NonBr License data',
  props<{ hasNonBrLicense: boolean }>()
);

export const setInstrumentsGroupedByDept = createAction(
  '[Navigation] Set Instruments Grouped By type',
  props<{ instrumentsGroupedByDept: boolean }>()
);

export const resetNavigationState = createAction(
  '[Navigation] Reset the current Navigation State'
);

export const updateSelectedNodeState = createAction(
  '[Navigation] Update Selected Node State',
  props<{ currentBranch: Array<TreePill> }>()
);

export const updateConnectivityTreeState = createAction(
  '[Navigation] Update Selected Connectivity State',
  props<{ connectivityFullTree: HierarchyNode<Response> }>()
);

export const getSetSelectedNodeState = createAction(
  '[Navigation] Get Set Selected Node State',
  props<{ selectedNode: TreePill }>()
);

export const setLeafNodes = createAction(
  '[Navigation] Set SelectedLeaf And Nodes',
  props<{ selectedNode: TreePill }>()
);

export const deleteNodeFromSelectedNodeState = createAction(
  '[Navigation] Delete node from Currently Selected Node State',
  props<{ selectedNodeId: string }>()
);
export const setLeftNavItemSelected = createAction(
  '[Navigation] Set the currently selected Left Nav Item',
  props<{ selectedLeftNavItem: TreePill }>()
);

export const setNodeFirstLeftNavItemSelected = createAction(
  '[Navigation] Set the Node item and set currently selected Left Nav Item',
  props<{ nodeType: EntityType, id: string, isManageControl?: boolean }>()
);

export const setArchiveItemsToggle = createAction(
  '[Navigation] Set archive items toggle',
  props<{ showArchivedItemsToggle: boolean }>()
);

export const toggleArchiveItems = createAction(
  '[Navigation] Toggle archive items',
  props<{ isArchiveItemsToggleOn: boolean }>()
);

export const toggleAccountUserSelector = createAction(
  '[Navigation] Toggle Account User Selector',
  props<{ isAccountUserSelectorOn: boolean }>()
);

export const setPanelsAsCurrentSelectedNode = createAction(
  '[Navigation] Set Panel as Current Selected Node and Update currentBranch',
  props<{ id: string }>()
);

export const updateSortOrder = createAction(
  '[Navigation] Set updated sort order',
  props<{ updatedSortOrder: SortOrder, childrenNodeType: EntityType }>()
);

export const updateSortOrderSuccess = createAction(
  '[Navigation] Sort Order update Success ',
  props<{ selectedNodeType: EntityType, selectedNodeId: string }>()
);

export const updateSortOrderFailure = createAction(
  '[Navigation] Sort order update Failure ',
  props<{ error: Error }>()
);

export const setCustomSortMode = createAction(
  '[Navigation] Set custom sort mode',
  props<{ isCustomSortMode: boolean }>()
);

export const setSelectedNotificationId = createAction(
  '[Navigation] Set Selected Notification Id',
  props<{ selectedNotificationId: string }>()
);

export const setPreviousUrl = createAction(
  '[Connectivity] Set Previous URL',
  props<{ url: string }>()
  );

export const setSelectedReportNotificationId = createAction(
  '[Navigation] Set Selected Report Notification Id',
  props<{ selectedReportNotificationId: string }>()
);

export const setLocale = createAction(
  '[Navigation] Set Locale',
  props<{ locale: object }>()
);

const navBarActions = union({
  setNodeItems,
  updateNavigation,
  toggleNavigationbar,
  toggleNavigationbarSuccess,
  toggleNavigationbarFailure,
  setCurrentlySelectedNodeFailure,
  getCurrentlySelectedNode,
  setDefaultNode,
  setSelectedLeaf,
  getSideNavState,
  setCurrentBranchState,
  setItemToCurrentBranch,
  removeLastItemFromCurrentBranch,
  removeItemsFromCurrentBranch,
  loadContentPane,
  navigateToContent,
  setConnectivityIconData,
  setAllNavItemsWithNodeId,
  loadAllChildrenForNode,
  setCurrentBranchStates,
  navigateToLabSetupDefault,
  setShowSettings,
  resetNavigationState,
  setNavigationNodeItems,
  updateSelectedNodeState,
  getSetSelectedNodeState,
  deleteNodeFromSelectedNodeState,
  setLeftNavItemSelected,
  setNodeFirstLeftNavItemSelected,
  setLeafNodes,
  setInstrumentsGroupedByDept,
  updateConnectivityTreeState,
  setArchiveItemsToggle,
  toggleArchiveItems,
  toggleAccountUserSelector,
  setPanelsAsCurrentSelectedNode,
  updateSortOrder,
  updateSortOrderSuccess,
  updateSortOrderFailure,
  setCustomSortMode,
  setSelectedNotificationId,
  setPreviousUrl,
  setSelectedReportNotificationId,
  setLocale,
  setHasNonBrLicense
});

export type NavBarActionsUnion = typeof navBarActions;

