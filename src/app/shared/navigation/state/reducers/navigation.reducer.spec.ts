// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { cloneDeep } from 'lodash';

import { LabLocation, TreePill } from '../../../../contracts/models/lab-setup';
import { LabLocationContact } from '../../../../contracts/models/lab-setup/lab-location-contact.model';
import * as fromActions from '../actions';
import { LocationActions } from '../../../state/actions';
import * as fromReducer from './navigation.reducer';
import * as fromLocationReducer from '../../../state/reducers/location.reducers';
import { UserRole } from '../../../../contracts/enums/user-role.enum';

describe('NavigationState Reducer', () => {
  const selectedNode: TreePill = {
    id: 'A914E73C1F124BEF909053B1BEB2ED19',
    children: [],
    nodeType: 4,
    parentNodeId: 'EDAB53E0CA694FDF80A7CB4D756030C7',
    displayName: 'Archi300',
  };
  const selectedLeaf = {
    displayName: ' Hemoglobin A1c',
    testSpecId: '1',
    correlatedTestSpecId: '68363DEE6C08436FA624528726B400CD',
    testId: '1',
    labUnitId: '6',
    testSpecInfo: {
      id: 1,
      testId: 1,
      analyteStorageUnitId: 666,
      analyteId: 2566,
      analyteName: ' Hemoglobin A1c',
      methodId: 22,
      methodName: 'HPLC',
      instrumentId: 2749,
      instrumentName: 'D-10',
      reagentId: 664,
      reagentManufacturerId: null,
      reagentManufacturerName: 'Bio-Rad',
      reagentName: 'D-10 Dual HbA1c/A2/F (220-0201)',
      reagentLotId: 1,
      reagentLotNumber: 'Unspecified ***',
      reagentLot: {
        id: 1,
        reagentId: 664,
        lotNumber: 'Unspecified ***',
        shelfExpirationDate: '2068-11-02T16:50:23.827'
      },
      storageUnitId: 93,
      storageUnitName: '%',
      calibratorId: 1,
      calibratorManufacturerId: null,
      calibratorManufacturerName: 'Bio-Rad',
      calibratorName: 'D-10 Dual A2/F/A1c Calibrator',
      calibratorLotId: 1,
      calibratorLotNumber: 'Unspecified ***',
      calibratorLot: {
        id: 1,
        calibratorId: 1,
        lotNumber: 'Unspecified ***',
        shelfExpirationDate: '2068-11-02T16:50:23.827'
      }
    },
    levelSettings: {
      levelEntityId: null,
      levelEntityName: null,
      parentLevelEntityId: null,
      parentLevelEntityName: null,
      minNumberOfPoints: 5,
      runLength: 4,
      dataType: 1,
      targets: [
      ],
      rules: [
        {
          id: '2',
          category: '1k',
          k: '3',
          disposition: 'D'
        },
        {
          id: '1',
          category: '1k',
          k: '2',
          disposition: 'D'
        }
      ],
      levels: [
        {
          levelInUse: true,
          decimalPlace: 2
        },
        {
          levelInUse: true,
          decimalPlace: 2
        }
      ],
      id: 'd236e176-4a40-4faa-b39b-e53565357873',
      parentNodeId: '7aa5bb04-92b5-416b-8f16-92d96d79b1c0',
      parentNode: null,
      nodeType: 8,
      displayName: 'd236e176-4a40-4faa-b39b-e53565357873',
      children: null
    },
    accountSettings: {
      displayName: '',
      dataType: 1,
      instrumentsGroupedByDept: true,
      trackReagentCalibrator: false,
      fixedMean: false,
      decimalPlaces: 2,
      siUnits: false,
      labSetupRating: 0,
      labSetupComments: '',
      isLabSetupComplete: true,
      labSetupLastEntityId: 'null',
      id: 'dc889c46-f310-4662-8c80-147fac28ecad',
      parentNodeId: 'eb692ecf-90a1-4573-8aea-cbf1a198f32e',
      parentNode: null,
      nodeType: 9,
      children: null
    },
    hasOwnAccountSettings: false,
    mappedTestSpecs: null,
    id: '7aa5bb04-92b5-416b-8f16-92d96d79b1c0',
    parentNodeId: '0499e995-e5a5-4c44-842b-4c302375e842',
    parentNode: null,
    nodeType: 6,
    children: []
  };
  const currentBranchItemList: TreePill[] = [
    {
      displayName: 'ASTest2',
      id: 'a3aea2d2-431a-4f04-9eda-f179226c44b0',
      parentNodeId: 'b5401afc-d62f-4580-a89f-5b874905b318',
      nodeType: 3,
      children: []
    },
    {
      displayName: 'Custome Name',
      id: '4c3527e4-74ec-4bee-a24a-76e68ef5e702',
      parentNodeId: 'a3aea2d2-431a-4f04-9eda-f179226c44b0',
      nodeType: 4,
      children: []
    },
    {
      displayName: 'Archi300',
      id: 'A914E73C1F124BEF909053B1BEB2ED19',
      children: [],
      nodeType: 4,
      parentNodeId: 'EDAB53E0CA694FDF80A7CB4D756030C7',
    }
  ];
  const initialState = {
    selectedNode: null,
    selectedLeaf: null,
    currentBranch: [],
    connectivityFullTree: null,
    error: null,
    isSideNavExpanded: true,
    selectedLink: null,
    hasConnectivityLicense: false,
    showSettings: false,
    selectedLeftNavItem: null,
    instrumentsGroupedByDept: true,
    settings: null,
    showArchivedItemsToggle: false,
    isArchiveItemsToggleOn: false,
    isCustomSortMode: false,
    selectedNotificationId : null,
    selectedReportNotificationId : null
  };
  const locationContact: LabLocationContact = {
    contactName: 'Stev',
    contactEmail: 'Job',
    contactNumber: '12321'
  };
  const location: LabLocation = {
    displayName: 'Dev\'s Lab',
    labLocationName: 'Dev\'s Lab',
    locationTimeZone: 'America/New_York',
    locationOffset: '-05:00:00',
    locationDayLightSaving: '00:00:00',
    labLocationContactId: '7a5e01e2-33e5-4578-bd55-a76978f06275',
    labLocationAddressId: '8cf67d50-172b-42f0-a3b1-757663b84315',
    labLocationContact: {
      entityType: 0,
      searchAttribute: 'fname_lname+dev@bio-rad.com',
      firstName: 'FName',
      middleName: '',
      lastName: 'LName',
      name: 'FName LName',
      email: 'fname_lname+dev20@bio-rad.com',
      phone: '',
      id: '7a5e01e2-33e5-4578-bd55-a76978f06275',
      featureInfo: {
        uniqueServiceName: 'Portal.Core.Models.Contact/Portal.Core.Models.Contact'
      }
    },
    contactRoles: [UserRole.LabSupervisor],
    labLocationAddress: {
      entityType: 1,
      searchAttribute: '',
      nickName: '',
      streetAddress1: '21 Technology Drive',
      streetAddress2: '',
      streetAddress3: '',
      streetAddress: '21 Technology Drive',
      suite: '',
      city: '',
      state: '',
      country: 'US',
      zipCode: '',
      id: '8cf67d50-172b-42f0-a3b1-757663b84315',
      featureInfo: {
        uniqueServiceName: 'Portal.Core.Models.Address/Portal.Core.Models.Address'
      }
    },
    hasOwnAccountSettings: false,
    id: 'b5401afc-d62f-4580-a89f-5b874905b318',
    parentNodeId: 'c2b43676-7b77-4272-8a35-01af2a5b8405',
    parentNode: null,
    nodeType: 2,
    children: [],
    previousContactUserId: null,
    labLanguagePreference: 'en-us'
  };

  it('should return default node as setLeafNodes does not exist in ', () => {
    const navigationState = cloneDeep(fromReducer.navigationState);
    expect(fromReducer.reducer(navigationState, fromActions.NavBarActions.setLeafNodes({ selectedNode }))).toEqual(
      navigationState
    );
  });

  it('should reset the initial state when resetNavigationState gets called', () => {
    const navigationState = cloneDeep(fromReducer.navigationState);
    expect(fromReducer.reducer(navigationState, fromActions.NavBarActions.resetNavigationState)).toEqual(
      {
        ...navigationState,
        selectedNode: null,
        selectedLeaf: null,
        currentBranch: [],
        connectivityFullTree: null,
        error: null,
        isSideNavExpanded: true,
        selectedLink: null,
        hasConnectivityLicense: false,
        showSettings: false,
        selectedLeftNavItem: null,
        isArchiveItemsToggleOn: navigationState.showArchivedItemsToggle ? navigationState.isArchiveItemsToggleOn : false,
        isCustomSortMode: false,
        selectedNotificationId: null,
        selectedReportNotificationId : null
      }
    );
  });

  it('should set the default node when setDefaultNode gets called', () => {
    const navigationState = cloneDeep(fromReducer.navigationState);
    navigationState.selectedNode = selectedNode;
    expect(fromReducer.reducer(fromReducer.navigationState,
      fromActions.NavBarActions.setDefaultNode({ selectedNode }))).toEqual(
        navigationState
      );
  });

  it('should get the currently selected node when getCurrentlySelectedNode gets called', () => {
    const retrievedState
      = fromReducer.reducer(fromReducer.navigationState, fromActions.NavBarActions.getCurrentlySelectedNode(null));

    expect(retrievedState).toEqual(fromReducer.navigationState);
  });

  it('should set the node value of selectedLeaf when setSelectedLeaf gets called', () => {
    const navigationState = cloneDeep(fromReducer.navigationState);
    navigationState.selectedLeaf = selectedLeaf;
    expect(fromReducer.reducer(fromReducer.navigationState,
      fromActions.NavBarActions.setSelectedLeaf({ selectedLeaf }))).toEqual(
        navigationState
      );
  });

  it('should get the side nav state when getSideNavState gets called', () => {
    const navigationState = cloneDeep(fromReducer.navigationState);

    const retrievedState = fromReducer.reducer(fromReducer.navigationState,
      fromActions.NavBarActions.getSideNavState(null));

    expect(retrievedState).toEqual(navigationState);
  });

  it('should get the isSideNavExpanded state value when toggleNavigationbar gets called', () => {
    const navigationState = fromReducer.navigationState;

    const updatedState = fromReducer.reducer(fromReducer.navigationState,
      fromActions.NavBarActions.toggleNavigationbar({ isSideNavExpanded: !navigationState.isSideNavExpanded }));

    const retrievedState = fromReducer.reducer(fromReducer.navigationState,
      fromActions.NavBarActions.getSideNavState(null));

    expect(retrievedState.isSideNavExpanded).toEqual(!updatedState.isSideNavExpanded);
  });

  it('should push selectedNode into the Current Branch when setCurrentBranchState gets called', () => {
    const navigationState = cloneDeep(fromReducer.navigationState);
    navigationState.currentBranch.push(selectedNode);
    const currentBranchItem = selectedNode;
    expect(fromReducer.reducer(fromReducer.navigationState,
      fromActions.NavBarActions.setCurrentBranchState({ currentBranchItem }))).toEqual(
        navigationState
      );
  });

  it('should get the currently update node when removeItemsFromCurrentBranch gets called', () => {
    const navigationState = cloneDeep(fromReducer.navigationState);
    navigationState.currentBranch = cloneDeep(currentBranchItemList);
    const navStateWithBranch = cloneDeep(fromReducer.navigationState);
    const currentBranchList = cloneDeep(currentBranchItemList);
    currentBranchList.splice(-1, 1);
    navStateWithBranch.currentBranch = currentBranchList;
    const item = selectedNode;
    expect(fromReducer.reducer(navigationState,
      fromActions.NavBarActions.removeItemsFromCurrentBranch({ item }))).toEqual(navStateWithBranch);
  });

  it('should set the side link value in state when navigateToContent gets called', () => {
    const selectedLink = {
      link: 'lab-setup/instruments/a3aea2d2-431a-4f04-9eda-f179226c44b0/settings',
      displayText: 'Edit Instrument'
    };
    const navigationState = cloneDeep(fromReducer.navigationState);
    navigationState.selectedLink = selectedLink;
    expect(fromReducer.reducer(fromReducer.navigationState,
      fromActions.NavBarActions.navigateToContent({ selectedLink }))).toEqual(navigationState);
  });

  it('should set hasConnectivityLicense flag when setConnectivityIconData gets called', () => {
    const navigationState = cloneDeep(fromReducer.navigationState);
    navigationState.hasConnectivityLicense = true;
    const hasConnectivityData = true;
    expect(fromReducer.reducer(fromReducer.navigationState,
      fromActions.NavBarActions.setConnectivityIconData({ hasConnectivityData }))).toEqual(
        navigationState
      );
  });

  it('should set showSettings flag when setShowSettings gets called', () => {
    const navigationState = cloneDeep(fromReducer.navigationState);
    navigationState.showSettings = true;
    const showSettings = true;
    expect(fromReducer.reducer(fromReducer.navigationState,
      fromActions.NavBarActions.setShowSettings({ showSettings }))).toEqual(
        navigationState
      );
  });

  it('should set showSettings flag when setInstrumentsGroupedByDept gets called', () => {
    const navigationState = cloneDeep(fromReducer.navigationState);
    navigationState.instrumentsGroupedByDept = true;
    const instrumentsGroupedByDept = true;
    expect(fromReducer.reducer(fromReducer.navigationState,
      fromActions.NavBarActions.setInstrumentsGroupedByDept({ instrumentsGroupedByDept }))).toEqual(
        navigationState
      );
  });

  it('should update currentBranch when updateSelectedNodeState gets called', () => {
    const navigationState = cloneDeep(fromReducer.navigationState);
    navigationState.currentBranch = cloneDeep(currentBranchItemList);
    const currentBranch = cloneDeep(currentBranchItemList);
    expect(fromReducer.reducer(fromReducer.navigationState,
      fromActions.NavBarActions.updateSelectedNodeState({ currentBranch }))).toEqual(
        navigationState
      );
  });

  it('should clear current Lab Location state when clearCurrentLabLocation gets called', () => {
    const navigationState = cloneDeep(fromLocationReducer.navigationState);
    navigationState.currentLabLocation = null;
    expect(fromLocationReducer.reducer(fromLocationReducer.navigationState,
      LocationActions.clearCurrentLabLocation)).toEqual(navigationState);
  });

  it('should clear current Lab Location Contact state when clearCurrentLabLocationContact gets called', () => {
    const navigationState = cloneDeep(fromLocationReducer.navigationState);
    navigationState.currentLabLocationContact = null;
    expect(fromLocationReducer.reducer(fromLocationReducer.navigationState,
      LocationActions.clearCurrentLabLocationContact)).toEqual(navigationState);
  });

  it('should clear current Lab Location state when setCurrentLabLocation gets called', () => {
    const navigationState = cloneDeep(fromLocationReducer.navigationState);
    navigationState.currentLabLocation = location;
    const currentLabLocation = location;
    expect(fromLocationReducer.reducer(fromLocationReducer.navigationState,
      LocationActions.setCurrentLabLocation({ currentLabLocation }))).toEqual(navigationState);
  });

  it('should clear current Lab Location state when setCurrentLabLocationContact gets called', () => {
    const navigationState = cloneDeep(fromLocationReducer.navigationState);
    navigationState.currentLabLocationContact = locationContact;
    const currentLabLocationContact = locationContact;
    expect(fromLocationReducer.reducer(fromLocationReducer.navigationState,
      LocationActions.setCurrentLabLocationContact({ currentLabLocationContact }))).toEqual(navigationState);
  });

  it('should set left naviagtion item selected when setLeftNavItemSelected gets called', () => {
    const navigationState = cloneDeep(fromReducer.navigationState);
    navigationState.selectedLeftNavItem = selectedNode;
    const selectedLeftNavItem = selectedNode;
    expect(fromReducer.reducer(fromReducer.navigationState,
      fromActions.NavBarActions.setLeftNavItemSelected({ selectedLeftNavItem }))).toEqual(navigationState);
  });

  it('should set currentBranch with passed node list when setCurrentBranchStates gets called', () => {
    const navigationState = cloneDeep(fromReducer.navigationState);
    const currentBranch = cloneDeep(currentBranchItemList);
    navigationState.currentBranch = currentBranch.reverse();
    const currentBranchItems = cloneDeep(currentBranchItemList);
    expect(fromReducer.reducer(fromReducer.navigationState,
      fromActions.NavBarActions.setCurrentBranchStates({ currentBranchItems }))).toEqual(navigationState);
  });
});
