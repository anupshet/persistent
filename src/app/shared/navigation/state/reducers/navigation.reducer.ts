/*© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/
import { createReducer, on } from '@ngrx/store';

import { HierarchyNode } from 'd3-hierarchy';

import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { TreePill } from '../../../../contracts/models/lab-setup/tree-pill.model';
import { Error } from '../../../../contracts/models/shared/error.model';
import { MenuLink } from '../../../models/menu-link.model';
import { NavBarActions } from '../actions';
import { Settings } from '../../../../contracts/models/lab-setup/settings.model';

export interface NavigationState {
  selectedNode: TreePill;
  selectedLeaf: TreePill;
  currentBranch: TreePill[];
  connectivityFullTree: HierarchyNode<Response>;
  error: Error;
  isSideNavExpanded: boolean;
  selectedLink: MenuLink;
  hasConnectivityLicense: boolean;
  hasNonBrLicense: boolean;
  showSettings: boolean;
  selectedLeftNavItem: TreePill;
  instrumentsGroupedByDept: boolean;
  settings: Settings;
  showArchivedItemsToggle: boolean;
  showAccountUserSelectorToggle: boolean;
  isArchiveItemsToggleOn: boolean;
  isAccountUserSelectorOn: boolean;
  isCustomSortMode?: boolean;
  selectedNotificationId?: string;
  previousUrl?: string;
  selectedReportNotificationId?: string;
  locale?: object;
}

export const navigationState: NavigationState = {
  selectedNode: null,
  selectedLeaf: null,
  currentBranch: [],
  connectivityFullTree: null,
  error: null,
  isSideNavExpanded: true,
  selectedLink: null,
  hasConnectivityLicense: false,
  hasNonBrLicense: false,
  showSettings: false,
  selectedLeftNavItem: null,
  instrumentsGroupedByDept: true,
  settings: null,
  showArchivedItemsToggle: false,
  isArchiveItemsToggleOn: false,
  isAccountUserSelectorOn: false,
  showAccountUserSelectorToggle: false,
  isCustomSortMode: false,
  selectedNotificationId: null,
  previousUrl: null,
  selectedReportNotificationId : null,
  locale: null
};

export const reducer = createReducer(
  navigationState,
  on(NavBarActions.getCurrentlySelectedNode, state => ({
    ...state,
    error: null
  })),

  on(NavBarActions.setDefaultNode, (state, { selectedNode }) => ({
    ...state,
    error: null,
    selectedNode: selectedNode
  })),

  on(NavBarActions.setSelectedLeaf, (state, { selectedLeaf }) => ({
    ...state,
    error: null,
    selectedLeaf: selectedLeaf,
  })),

  on(NavBarActions.getSideNavState, state => ({
    ...state,
    error: null
  })),

  on(NavBarActions.toggleNavigationbar, (state, { isSideNavExpanded }) => ({
    ...state,
    error: null,
    isSideNavExpanded: isSideNavExpanded
  })),

  on(NavBarActions.setCustomSortMode, (state, { isCustomSortMode }) => ({
    ...state,
    error: null,
    isCustomSortMode: isCustomSortMode
  })),

  on(NavBarActions.setSelectedNotificationId, (state, { selectedNotificationId }) => ({
    ...state,
    error: null,
    selectedNotificationId: selectedNotificationId
  })),

  on(NavBarActions.setSelectedReportNotificationId, (state, { selectedReportNotificationId }) => ({
    ...state,
    error: null,
    selectedReportNotificationId: selectedReportNotificationId
  })),

  on(NavBarActions.setCurrentBranchState, (state, { currentBranchItem }) => {
    // avoid pushing duplicate item as well as selected Leaf to breadcrumb
    const branchItemIndex = state.currentBranch.length > 0 ?
    state.currentBranch.findIndex(element => element.id === currentBranchItem.id) : -1;
    if (branchItemIndex >= 0 && (state.currentBranch[branchItemIndex].isArchived !== currentBranchItem.isArchived ||
      // If LabLocation then update the current branch as all children should get updated with Archived/Unarchived items in branch
      currentBranchItem.nodeType === EntityType.LabLocation ||
      // If selected item is panel then current branch need to be updated as item selection tree is dependent on current branch's items.
      currentBranchItem.nodeType === EntityType.Panel)) {
      // update current branch isArchive state for fetching parent isArchive status in child
      const currentBranchList = [...state.currentBranch];
      currentBranchList[branchItemIndex] = currentBranchItem;
      return {
        ...state,
        error: null,
        currentBranch: [...currentBranchList]
      };
    } else if (branchItemIndex >= 0 || state.selectedLeaf === currentBranchItem
      || currentBranchItem.nodeType === EntityType.LabTest) {
      return {
        ...state,
        error: null
      };
    }
    return {
      ...state,
      error: null,
      // if dispatched action does not have selected leaf as payload or is not in current branch of state
      currentBranch: [...state.currentBranch, currentBranchItem]
    };

  }),

  on(NavBarActions.removeLastItemFromCurrentBranch, state => {
    const currentBranchList = [...state.currentBranch];
    currentBranchList.splice(currentBranchList.length - 1, 1);
    return {
      ...state,
      error: null,
      currentBranch: [...currentBranchList]
    };
  }),

  on(NavBarActions.removeItemsFromCurrentBranch, (state, { item }) => {
    const currentBranchList = [...state.currentBranch];
    const index = currentBranchList.findIndex(element => element.id === item.id);
    const itemsNeedToRemove = currentBranchList.length - index;
    currentBranchList.splice(index, itemsNeedToRemove);
    return {
      ...state,
      error: null,
      currentBranch: [...currentBranchList]
    };
  }),

  on(NavBarActions.navigateToContent, (state, { selectedLink }) => ({
    ...state,
    error: null,
    selectedLink: selectedLink
  })),

  on(NavBarActions.setConnectivityIconData, (state, { hasConnectivityData }) => ({
    ...state,
    error: null,
    hasConnectivityLicense: hasConnectivityData
  })),

  on(NavBarActions.setCurrentBranchStates, (state, { currentBranchItems }) => {
    if (state.selectedNode) {
      currentBranchItems = currentBranchItems.filter(node => node.id !== state.selectedNode.id);
    }
    return {
      ...state,
      error: null,
      // assigning all ancestors array items revered
      currentBranch: [...state.currentBranch, ...currentBranchItems.slice().reverse()]
    };
  }),

  on(NavBarActions.setShowSettings, (state, { showSettings }) => ({
    ...state,
    showSettings: showSettings
  })),

  on(NavBarActions.setHasNonBrLicense, (state, { hasNonBrLicense }) => ({
    ...state,
    hasNonBrLicense: hasNonBrLicense
  })),

  on(NavBarActions.setInstrumentsGroupedByDept, (state, { instrumentsGroupedByDept }) => ({
    ...state,
    instrumentsGroupedByDept: instrumentsGroupedByDept
  })),

  on(NavBarActions.updateSelectedNodeState, (state, { currentBranch }) => ({
    ...state,
    error: null,
    currentBranch: currentBranch
  })),

  on(NavBarActions.setLeftNavItemSelected, (state, { selectedLeftNavItem }) => ({
    ...state,
    error: null,
    selectedLeftNavItem: selectedLeftNavItem
  })),

  on(NavBarActions.resetNavigationState, state => ({
    ...state,
    selectedNode: null,
    selectedLeaf: null,
    currentBranch: [],
    connectivityFullTree: null,
    error: null,
    isSideNavExpanded: true,
    selectedLink: null,
    hasConnectivityLicense: false,
    hasNonBrLicense: false,
    showSettings: false,
    selectedLeftNavItem: null,
    isArchiveItemsToggleOn: state.showArchivedItemsToggle ? state.isArchiveItemsToggleOn : false,
    isCustomSortMode: false,
    selectedNotificationId: null,
  })),

  on(NavBarActions.updateConnectivityTreeState, (state, { connectivityFullTree }) => ({
    ...state,
    error: null,
    connectivityFullTree: connectivityFullTree
  })),

  on(NavBarActions.setArchiveItemsToggle, (state, { showArchivedItemsToggle }) => ({
    ...state,
    showArchivedItemsToggle: showArchivedItemsToggle
  })),

  on(NavBarActions.toggleArchiveItems, (state, { isArchiveItemsToggleOn }) => ({
    ...state,
    isArchiveItemsToggleOn: isArchiveItemsToggleOn
  })),

  on(NavBarActions.toggleAccountUserSelector, (state, { isAccountUserSelectorOn }) => ({
    ...state,
    isAccountUserSelectorOn: isAccountUserSelectorOn
  })),

  on(NavBarActions.updateSortOrderSuccess, (state, { selectedNodeId }) => {
    return {
      ...state,
      error: null
    };
  }),

  on(NavBarActions.updateSortOrderFailure, (state, { error }) => ({
    ...state,
    error: error
  })),

  on(NavBarActions.setPreviousUrl, (state, { url }) => ({
    ...state,
    previousUrl: url
  })),

  on(NavBarActions.setLocale, (state, { locale }) => ({
    ...state,
    error: null,
    locale: locale
  })),
);
