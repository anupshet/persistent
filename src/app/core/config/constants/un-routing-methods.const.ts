// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
export const unRouting = {
  add: {
    location: 'add/location/:parentId',
    department: 'add/department/:parentId',
    instrument: 'add/instrument/:parentId',
    product: 'add/product/:parentId',
    productNewLot: 'add/productNewLot/:parentId',
    test: 'add/test/:parentId'
  },
  // nodeinfo: {
  //   childlist: 'node-info/child-list',
  //   location: 'node-info/locations/:id',
  //   department: 'node-info/departments/:id',
  //   instrument: 'node-info/instruments/:id',
  //   product: 'node-info/products/:id',
  //   test: 'node-info/tests/:id'
  // },
  entities: 'entities/:type/:id',
  deleteConfirm: 'deleteConfirm',
  home: '',


  // New Lab Management Paths
  labManagement: {
    lab: 'labmanagement',
    childlist: 'child-list',
    location: {
      id: 'locations/:id',
      add: 'locations/:parentId/add',
      delete: 'locations/:id/delete',
      children: 'locations/:id/children'
    },
    department: {
      id: 'departments/:id',
      add: 'departments/:parentId/add',
      delete: 'departments/:id/delete',
      children: 'departments/:id/children'
    },
    instrument: {
      id: 'instruments/:id',
      add: 'instruments/:parentId/add',
      delete: 'instruments/:id/delete',
      children: 'instruments/:id/children'
    },
    product: {
      id: 'products/:id',
      add: 'products/:parentId/add',
      delete: 'products/:id/delete',
      children: 'products/:id/children'
    },
    test: {
      id: 'tests/:id',
      add: 'tests/:parentId/add',
      delete: 'tests/:id/delete',
    }
  },

  connectivity: {
    connectivity: 'connectivity',
    labs: 'labs/:id',
    upload: 'upload',
    status: 'status',
    instructions: 'instructions',
    configurations: 'configurations',
    mapping: 'map',
    map: {
      instrument: 'instrument',
      product: 'product',
      test: 'test',
      childProduct: ':entityId/product',
      childTest: ':entityId/test'
    }
  },
  instructions: {
    instructions: 'instructions',
    labs: 'labs/:id',
  },

  fileUpload: {
    labs: 'labs/:id',
    upload: 'upload',
    status: 'status',
    mapping: 'mapping'
  },

  parsingInstructions: {
    instructions: 'instructions',
  },


  dataManagement: {
    data: 'data/:id/:type',
    reportPdf: 'data/:id/:type/:notificationid',
    connectivity: 'connectivity',
    spcRules: 'spcrules',
    notification: 'notifications',
    review: 'review',
    table: 'table',
    setup: 'setup',
    entities: {
      lab: 'lab-entity',
      labLocation: 'lab-location-entity',
      department: 'department-entity',
      instrument: 'instrument-entity',
      test: 'test-entity'
    }
  },

  dataReview: {
    review: 'review',
    dataReview: 'data-review',
  },

  codeListManagement: {
    codelist: 'codelist',
    matrix: 'matrix',
    manufacturer: 'manufacturer',
    analyte: 'analyte',
    method: 'method',
    unit: 'unit',
    calibrator: 'calibrator',
    instrument: 'instrument'
  },

  connectivityMap: {
    map: 'map',
    instrument: 'instrument',
    product: 'product',
    test: 'test',
    childProduct: ':entityId/product',
    childTest: ':entityId/test'
  },
  userManagement: 'usermanagement',
  bioradUserManagement: 'biorad-usermanagement',
  accountManagement: 'account-management',
  actionableDashboard: 'actionable-dashboard',
  reports: 'reporting',
  reporting: {
    newReports: 'new-report',
    pastReports: 'past-reports',
  },
  manageCustomControls: {
    define: 'define-control'
  },
  labSetup: {
    lab: 'lab-setup',
    labDefault: 'labdefault',
    locations: 'locations',
    departments: 'departments',
    analytes: 'analytes',
    controls: 'controls',
    instruments: 'instruments',
    settings: 'settings',
    labConfigDepartment: {
      id: 'departments/:id',
      add: 'departments/:id/add',
      delete: 'departments/:id/delete',
      list: 'departments/:id/list',
      children: 'departments/:id/children',
      settings: 'departments/:id/settings'
    },
    labConfigControl: {
      id: 'controls/:id',
      add: 'controls/:id/add',
      delete: 'controls/:id/delete',
      list: 'controls/:id/list',
      children: 'controls/id/children',
      settings: 'controls/:id/settings'
    },
    labConfigInstrument: {
      id: 'instruments/:id',
      add: 'instruments/:id/add',
      delete: 'instruments/:id/delete',
      list: 'instruments/:id/list',
      children: 'instruments/:id/children',
      settings: 'instruments/:id/settings'
    },
    labRequestInstrumentConfig: {
      id: 'new-instrument/:id',
      add: 'new-instrument/:id/add',
    },
    labConfigAnalyte: {
      id: 'analytes/:id',
      add: 'analytes/:id/add',
      delete: 'analytes/:id/delete',
      list: 'analytes/:id/list',
      children: 'analytes/:id/children',
      settings: 'analytes/:id/settings'
    },
    labRequestTestConfig: {
      id: 'test-config/:id',
      add: 'test-config/:id/add',
    },
    labConfigSetUpFeedback: {
      id: 'setup-feedback/:id',
      add: 'setup-feedback/:id/add',
    },
  },
  panels: {
    panel: 'panel',
    actions: {
      add: 'add',
      edit: 'edit/:id',
      view: ':id'
    }
  },
  callback: 'callback',
  login: 'login',
  navigationOrigin: 'navigationOrigin'
};
