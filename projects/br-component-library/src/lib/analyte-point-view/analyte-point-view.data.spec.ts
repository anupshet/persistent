import { AnalytePointView } from '../contracts/models/data-management/data-entry/analyte-entry.model';
import { InteractionType } from '../contracts/models/data-management/page-section/analyte-user-info.model';
import { PointLevelDataColumns } from '../contracts/enums/point-level-data-columns.enum';
import { PointDataResultStatus } from '../contracts';

export const POINT_VALUE = 'pointValue';
export const POINT_Z = 'pointZ';
export const POINT_REASON = 'pointReason';

export const ANALYTE_VIEW_4_LEVELS: AnalytePointView = {
  id: '',
  labTestId: '101',
  testSpecId: 1,
  correlatedTestSpecId: 'ABCD123XYZ',
  analyteDateTime: new Date(2019, 2, 2),
  analyteDateTimeOffset: undefined,
  analyteName: 'Hemoglobin',
  cumulativeLevels: [1, 2, 4, 6],
  levelDataSet: [
    {
      level: 1,
      decimalPlace: 2,
      controlLotId: 1,
      isPristine: true,
      data: {
        value: 15,
        z: 1,
        displayZScore: true,
        ruleViolated: [''],
        isAccepted: true,
        resultStatus: PointDataResultStatus.None
      }
    },
    {
      level: 2,
      decimalPlace: 2,
      controlLotId: 1,
      isPristine: true,
      data: {
        value: 2.5,
        z: 2,
        displayZScore: true,
        ruleViolated: [''],
        isAccepted: true,
        resultStatus: PointDataResultStatus.None
      }
    },
    {
      level: 4,
      decimalPlace: null,
      controlLotId: 1,
      isPristine: true,
      data: {
        value: 3.9,
        z: 3,
        displayZScore: true,
        ruleViolated: [''],
        isAccepted: true,
        resultStatus: PointDataResultStatus.None
      }
    },
    {
      level: 6,
      decimalPlace: null,
      controlLotId: 1,
      isPristine: true,
      data: {
        value: 4.5,
        z: 4,
        displayZScore: true,
        ruleViolated: [''],
        isAccepted: true,
        resultStatus: PointDataResultStatus.None
      }
    }
  ],
  userComments: [
  {
    content: 'kjlk',
    userId: '00u2b382jz0Isu7o62p7',
    userFullName: 'Francisco DeGuzman',
    enterDateTime: new Date('2019-02-27T22:17:36.5489774Z')
  },
  {
    content: 'joilkm',
    userId: '00u2b382jz0Isu7o62p7',
    userFullName: 'Francisco DeGuzman',
    enterDateTime: new Date('2019-02-27T22:40:34.7375922Z')
  }
],
  userActions: [
    {
      actionId: 6,
      actionName: 'Control repeated level 3 ',
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T22:17:36.5489774Z')
    },
    {
      actionId: 5,
      actionName: 'Control repeated level 2 ',
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T22:40:34.7375922Z')
    }
  ],
  userInteractions: [
    {
      interactionType: InteractionType.Added,
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T21:55:25.8777637Z')
    },
    {
      interactionType: InteractionType.Added,
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T21:55:25.8777637Z')
    }
  ],
  isSummary: false,
  dataSource: '1',
  isInsert: false
};

export const ANALYTE_VIEW_2_LEVELS: AnalytePointView = {
  id: '',
  labTestId: '102',
  testSpecId: 1,
  correlatedTestSpecId: 'ABCD123XYZ',
  analyteDateTime: new Date(2019, 2, 2),
  analyteDateTimeOffset: undefined,
  analyteName: 'Hemoglobin',
  cumulativeLevels: [1, 2],
  levelDataSet: [
    {
      level: 1,
      decimalPlace: null,
      controlLotId: 1,
      isPristine: true,
      data: {
        value: 15,
        z: 1,
        displayZScore: true,
        ruleViolated: [''],
        isAccepted: true,
        resultStatus: PointDataResultStatus.None
      }
    },
    {
      level: 2,
      decimalPlace: null,
      controlLotId: 1,
      isPristine: true,
      data: {
        value: 2.5,
        z: 2,
        displayZScore: true,
        ruleViolated: [''],
        isAccepted: true,
        resultStatus: PointDataResultStatus.None
      }
    }
  ],
  userComments: [
  {
    content: 'kjlk',
    userId: '00u2b382jz0Isu7o62p7',
    userFullName: 'Francisco DeGuzman',
    enterDateTime: new Date('2019-02-27T22:17:36.5489774Z')
  },
  {
    content: 'joilkm',
    userId: '00u2b382jz0Isu7o62p7',
    userFullName: 'Francisco DeGuzman',
    enterDateTime: new Date('2019-02-27T22:40:34.7375922Z')
  }
],
  userActions: [
    {
      actionId: 6,
      actionName: 'Control repeated level 3 ',
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T22:17:36.5489774Z')
    },
    {
      actionId: 5,
      actionName: 'Control repeated level 2 ',
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T22:40:34.7375922Z')
    }
  ],
  userInteractions: [
    {
      interactionType: InteractionType.Added,
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T21:55:25.8777637Z')
    },
    {
      interactionType: InteractionType.Added,
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T21:55:25.8777637Z')
    }
  ],
  isSummary: false,
  dataSource: '1',
  isInsert: false
};

export const ANALYTE_VIEW_7_LEVELS: AnalytePointView = {
  id: '',
  labTestId: '103',
  testSpecId: 1,
  correlatedTestSpecId: 'ABCD123XYZ',
  analyteDateTime: new Date(2019, 2, 2),
  analyteDateTimeOffset: undefined,
  analyteName: 'Hemoglobin',
  cumulativeLevels: [1, 2, 3, 4, 5, 6, 7],
  levelDataSet: [
    {
      level: 1,
      decimalPlace: null,
      controlLotId: 1,
      isPristine: true,
      data: {
        value: 15,
        z: 1,
        displayZScore: true,
        ruleViolated: [''],
        isAccepted: true,
        resultStatus: PointDataResultStatus.None
      }
    },
    {
      level: 2,
      decimalPlace: null,
      controlLotId: 1,
      isPristine: true,
      data: {
        value: 2.5,
        z: 2,
        displayZScore: true,
        ruleViolated: [''],
        isAccepted: true,
        resultStatus: PointDataResultStatus.None
      }
    },
    {
      level: 4,
      decimalPlace: null,
      controlLotId: 1,
      isPristine: true,
      data: {
        value: 3.9,
        z: 3,
        displayZScore: true,
        ruleViolated: [''],
        isAccepted: true,
        resultStatus: PointDataResultStatus.None
      }
    },
    {
      level: 6,
      decimalPlace: null,
      controlLotId: 1,
      isPristine: true,
      data: {
        value: 4.5,
        z: 4,
        displayZScore: true,
        ruleViolated: [''],
        isAccepted: true,
        resultStatus: PointDataResultStatus.None
      }
    }
  ],
  userComments: [
  {
    content: 'kjlk',
    userId: '00u2b382jz0Isu7o62p7',
    userFullName: 'Francisco DeGuzman',
    enterDateTime: new Date('2019-02-27T22:17:36.5489774Z')
  },
  {
    content: 'joilkm',
    userId: '00u2b382jz0Isu7o62p7',
    userFullName: 'Francisco DeGuzman',
    enterDateTime: new Date('2019-02-27T22:40:34.7375922Z')
  }
],
  userActions: [
    {
      actionId: 6,
      actionName: 'Control repeated level 3 ',
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T22:17:36.5489774Z')
    },
    {
      actionId: 5,
      actionName: 'Control repeated level 2 ',
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T22:40:34.7375922Z')
    }
  ],
  userInteractions: [
    {
      interactionType: InteractionType.Added,
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T21:55:25.8777637Z')
    },
    {
      interactionType: InteractionType.Added,
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T21:55:25.8777637Z')
    }
  ],
  isSummary: false,
  dataSource: '1',
  isInsert: false
};

export const ANALYTE_VIEW_NO_ANALYTE_NAME: AnalytePointView = {
  id: '',
  labTestId: '104',
  testSpecId: 1,
  correlatedTestSpecId: 'ABCD123XYZ',
  analyteDateTime: new Date(2019, 2, 2),
  analyteDateTimeOffset: undefined,
  analyteName: undefined,
  cumulativeLevels: [1, 2, 4, 6],
  levelDataSet: [
    {
      level: 1,
      decimalPlace: null,
      controlLotId: 1,
      isPristine: true,
      data: {
        value: 15,
        z: 1,
        displayZScore: true,
        ruleViolated: [''],
        isAccepted: true,
        resultStatus: PointDataResultStatus.None
      }
    },
    {
      level: 2,
      decimalPlace: null,
      controlLotId: 1,
      isPristine: true,
      data: {
        value: 2.5,
        z: 2,
        displayZScore: true,
        ruleViolated: [''],
        isAccepted: true,
        resultStatus: PointDataResultStatus.None
      }
    },
    {
      level: 4,
      decimalPlace: null,
      controlLotId: 1,
      isPristine: true,
      data: {
        value: 3.9,
        z: 3,
        displayZScore: true,
        ruleViolated: [''],
        isAccepted: true,
        resultStatus: PointDataResultStatus.None
      }
    },
    {
      level: 6,
      decimalPlace: null,
      controlLotId: 1,
      isPristine: true,
      data: {
        value: 4.5,
        z: 4,
        displayZScore: true,
        ruleViolated: [''],
        isAccepted: true,
        resultStatus: PointDataResultStatus.None
      }
    }
  ],
  userComments: [
  {
    content: 'kjlk',
    userId: '00u2b382jz0Isu7o62p7',
    userFullName: 'Francisco DeGuzman',
    enterDateTime: new Date('2019-02-27T22:17:36.5489774Z')
  },
  {
    content: 'joilkm',
    userId: '00u2b382jz0Isu7o62p7',
    userFullName: 'Francisco DeGuzman',
    enterDateTime: new Date('2019-02-27T22:40:34.7375922Z')
  }
],
  userActions: [
    {
      actionId: 6,
      actionName: 'Control repeated level 3 ',
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T22:17:36.5489774Z')
    },
    {
      actionId: 5,
      actionName: 'Control repeated level 2 ',
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T22:40:34.7375922Z')
    }
  ],
  userInteractions: [
    {
      interactionType: InteractionType.Added,
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T21:55:25.8777637Z')
    },
    {
      interactionType: InteractionType.Added,
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T21:55:25.8777637Z')
    }
  ],
  isSummary: false,
  dataSource: '1',
  isInsert: false
};

export const ANALYTE_VIEW_INSERTED_ROW: AnalytePointView = {
  id: '',
  labTestId: '105',
  testSpecId: 1,
  correlatedTestSpecId: 'ABCD123XYZ',
  analyteDateTime: new Date(2019, 2, 2),
  analyteDateTimeOffset: undefined,
  analyteName: 'Hemoglobin',
  cumulativeLevels: [1, 2, 4, 6],
  levelDataSet: [
    {
      level: 1,
      decimalPlace: null,
      controlLotId: 1,
      isPristine: true,
      data: {
        value: 15,
        z: 1,
        displayZScore: true,
        ruleViolated: [''],
        isAccepted: true,
        resultStatus: PointDataResultStatus.None
      }
    },
    {
      level: 2,
      decimalPlace: null,
      controlLotId: 1,
      isPristine: true,
      data: {
        value: 2.5,
        z: 2,
        displayZScore: true,
        ruleViolated: [''],
        isAccepted: true,
        resultStatus: PointDataResultStatus.None
      }
    },
    {
      level: 4,
      decimalPlace: null,
      controlLotId: 1,
      isPristine: true,
      data: {
        value: 3.9,
        z: 3,
        displayZScore: true,
        ruleViolated: [''],
        isAccepted: true,
        resultStatus: PointDataResultStatus.None
      }
    },
    {
      level: 6,
      decimalPlace: null,
      controlLotId: 1,
      isPristine: true,
      data: {
        value: 4.5,
        z: 4,
        displayZScore: true,
        ruleViolated: [''],
        isAccepted: true,
        resultStatus: PointDataResultStatus.None
      }
    }
  ],
  userComments: [
  {
    content: 'kjlk',
    userId: '00u2b382jz0Isu7o62p7',
    userFullName: 'Francisco DeGuzman',
    enterDateTime: new Date('2019-02-27T22:17:36.5489774Z')
  },
  {
    content: 'joilkm',
    userId: '00u2b382jz0Isu7o62p7',
    userFullName: 'Francisco DeGuzman',
    enterDateTime: new Date('2019-02-27T22:40:34.7375922Z')
  }
],
  userActions: [
    {
      actionId: 6,
      actionName: 'Control repeated level 3 ',
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T22:17:36.5489774Z')
    },
    {
      actionId: 5,
      actionName: 'Control repeated level 2 ',
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T22:40:34.7375922Z')
    }
  ],
  userInteractions: [
    {
      interactionType: InteractionType.Added,
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T21:55:25.8777637Z')
    },
    {
      interactionType: InteractionType.Added,
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T21:55:25.8777637Z')
    }
  ],
  isSummary: false,
  dataSource: '1',
  isInsert: true
};

export const ANALYTE_VIEW_MULTIPLE_REASONS: AnalytePointView = {
  id: '',
  labTestId: '106',
  testSpecId: 1,
  correlatedTestSpecId: 'ABCD123XYZ',
  analyteDateTime: new Date(2019, 2, 2),
  analyteDateTimeOffset: '',
  analyteName: 'Hemoglobin',
  cumulativeLevels: [1, 2, 4, 6],
  levelDataSet: [
    {
      level: 1,
      decimalPlace: null,
      controlLotId: 1,
      isPristine: true,
      data: {
        value: 15,
        z: 1,
        displayZScore: true,
        ruleViolated: ['1-2s'],
        isAccepted: false,
        resultStatus: PointDataResultStatus.Reject
      }
    },
    {
      level: 2,
      decimalPlace: null,
      controlLotId: 1,
      isPristine: true,
      data: {
        value: 2.5,
        z: 2,
        displayZScore: true,
        ruleViolated: ['2-1s', '1-3s', '1-4s'],
        isAccepted: false,
        resultStatus: PointDataResultStatus.Reject
      }
    },
    {
      level: 4,
      decimalPlace: null,
      controlLotId: 1,
      isPristine: true,
      data: {
        value: 3.9,
        z: 3,
        displayZScore: true,
        ruleViolated: ['3-1s', '2-1s', '1-3s', '1-4s', '3-2s'],
        isAccepted: false,
        resultStatus: PointDataResultStatus.Reject
      }
    },
    {
      level: 6,
      decimalPlace: null,
      controlLotId: 1,
      isPristine: true,
      data: {
        value: 4.5,
        z: 4,
        displayZScore: true,
        ruleViolated: [''],
        isAccepted: true,
        resultStatus: PointDataResultStatus.None
      }
    }
  ],
  userComments: [
  {
    content: 'kjlk',
    userId: '00u2b382jz0Isu7o62p7',
    userFullName: 'Francisco DeGuzman',
    enterDateTime: new Date('2019-02-27T22:17:36.5489774Z')
  },
  {
    content: 'joilkm',
    userId: '00u2b382jz0Isu7o62p7',
    userFullName: 'Francisco DeGuzman',
    enterDateTime: new Date('2019-02-27T22:40:34.7375922Z')
  }
],
  userActions: [
    {
      actionId: 6,
      actionName: 'Control repeated level 3 ',
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T22:17:36.5489774Z')
    },
    {
      actionId: 5,
      actionName: 'Control repeated level 2 ',
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T22:40:34.7375922Z')
    }
  ],
  userInteractions: [
    {
      interactionType: InteractionType.Added,
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T21:55:25.8777637Z')
    },
    {
      interactionType: InteractionType.Added,
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T21:55:25.8777637Z')
    }
  ],
  isSummary: false,
  dataSource: '1',
  isInsert: false
};

export const ANALYTE_VIEW_WARNING: AnalytePointView = {
  id: '',
  labTestId: '106',
  testSpecId: 1,
  correlatedTestSpecId: 'ABCD123XYZ',
  analyteDateTime: new Date(2019, 2, 2),
  analyteDateTimeOffset: undefined,
  analyteName: 'Hemoglobin',
  cumulativeLevels: [1, 2, 4, 6],
  levelDataSet: [
    {
      level: 1,
      decimalPlace: null,
      controlLotId: 1,
      isPristine: true,
      data: {
        value: 15,
        z: 1,
        displayZScore: true,
        ruleViolated: ['1-2s'],
        isAccepted: true,
        resultStatus: PointDataResultStatus.Warning
      }
    },
    {
      level: 2,
      decimalPlace: null,
      controlLotId: 1,
      isPristine: true,
      data: {
        value: 2.5,
        z: 2,
        displayZScore: true,
        ruleViolated: ['2-1s'],
        isAccepted: true,
        resultStatus: PointDataResultStatus.Warning
      }
    },
    {
      level: 4,
      decimalPlace: null,
      controlLotId: 1,
      isPristine: true,
      data: {
        value: 3.9,
        z: 3,
        displayZScore: true,
        ruleViolated: [''],
        isAccepted: true,
        resultStatus: PointDataResultStatus.None
      }
    },
    {
      level: 6,
      decimalPlace: null,
      controlLotId: 1,
      isPristine: true,
      data: {
        value: 4.5,
        z: 4,
        displayZScore: true,
        ruleViolated: [''],
        isAccepted: true,
        resultStatus: PointDataResultStatus.None
      }
    }
  ],
  userComments: [
  {
    content: 'kjlk',
    userId: '00u2b382jz0Isu7o62p7',
    userFullName: 'Francisco DeGuzman',
    enterDateTime: new Date('2019-02-27T22:17:36.5489774Z')
  },
  {
    content: 'joilkm',
    userId: '00u2b382jz0Isu7o62p7',
    userFullName: 'Francisco DeGuzman',
    enterDateTime: new Date('2019-02-27T22:40:34.7375922Z')
  }
],
  userActions: [
    {
      actionId: 6,
      actionName: 'Control repeated level 3 ',
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T22:17:36.5489774Z')
    },
    {
      actionId: 5,
      actionName: 'Control repeated level 2 ',
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T22:40:34.7375922Z')
    }
  ],
  userInteractions: [
    {
      interactionType: InteractionType.Added,
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T21:55:25.8777637Z')
    },
    {
      interactionType: InteractionType.Added,
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T21:55:25.8777637Z')
    }
  ],
  isSummary: false,
  dataSource: '1',
  isInsert: false
};

export const ANALYTE_VIEW_REJECTED_BUT_ACCEPTED: AnalytePointView = {
  id: '',
  labTestId: '106',
  testSpecId: 1,
  correlatedTestSpecId: 'ABCD123XYZ',
  analyteDateTime: new Date(2019, 2, 2),
  analyteDateTimeOffset: '+03:00',
  analyteName: 'Hemoglobin',
  cumulativeLevels: [1, 2, 4, 6],
  levelDataSet: [
    {
      level: 1,
      decimalPlace: null,
      controlLotId: 1,
      isPristine: true,
      data: {
        value: 15,
        z: 1,
        displayZScore: true,
        ruleViolated: ['1-2s'],
        isAccepted: true,
        resultStatus: PointDataResultStatus.Accept
      }
    },
    {
      level: 2,
      decimalPlace: null,
      controlLotId: 1,
      isPristine: true,
      data: {
        value: 2.5,
        z: 2,
        displayZScore: true,
        ruleViolated: ['2-1s'],
        isAccepted: true,
        resultStatus: PointDataResultStatus.Accept
      }
    },
    {
      level: 4,
      decimalPlace: null,
      controlLotId: 1,
      isPristine: true,
      data: {
        value: 3.9,
        z: 3,
        displayZScore: true,
        ruleViolated: [''],
        isAccepted: true,
        resultStatus: PointDataResultStatus.None
      }
    },
    {
      level: 6,
      decimalPlace: null,
      controlLotId: 1,
      isPristine: true,
      data: {
        value: 4.5,
        z: 4,
        displayZScore: true,
        ruleViolated: [''],
        isAccepted: true,
        resultStatus: PointDataResultStatus.None
      }
    }
  ],
  userComments: [
  {
    content: 'kjlk',
    userId: '00u2b382jz0Isu7o62p7',
    userFullName: 'Francisco DeGuzman',
    enterDateTime: new Date('2019-02-27T22:17:36.5489774Z')
  },
  {
    content: 'joilkm',
    userId: '00u2b382jz0Isu7o62p7',
    userFullName: 'Francisco DeGuzman',
    enterDateTime: new Date('2019-02-27T22:40:34.7375922Z')
  }
],
  userActions: [
    {
      actionId: 6,
      actionName: 'Control repeated level 3 ',
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T22:17:36.5489774Z')
    },
    {
      actionId: 5,
      actionName: 'Control repeated level 2 ',
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T22:40:34.7375922Z')
    }
  ],
  userInteractions: [
    {
      interactionType: InteractionType.Added,
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T21:55:25.8777637Z')
    },
    {
      interactionType: InteractionType.Added,
      userId: '00u2b382jz0Isu7o62p7',
      userFullName: 'Francisco DeGuzman',
      enterDateTime: new Date('2019-02-27T21:55:25.8777637Z')
    }
  ],
  isSummary: false,
  dataSource: '1',
  isInsert: false
};

export const LEVEL_DATA_COLUMNS_ALL: Set<PointLevelDataColumns> = new Set<PointLevelDataColumns>(
  [
    PointLevelDataColumns.Reason,
    PointLevelDataColumns.Z,
    PointLevelDataColumns.Value
  ]
);

export const LEVEL_DATA_COLUMNS_VALUE_ONLY: Set<PointLevelDataColumns> = new Set<PointLevelDataColumns>(
  [
    PointLevelDataColumns.Value
  ]
);
