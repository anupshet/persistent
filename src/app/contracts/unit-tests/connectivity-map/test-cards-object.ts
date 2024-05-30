import { TestCard } from '../../models/connectivity-map/map-card.model';

export class TestCardsObject {
  static testCards: Array<TestCard> = [
    {
      locationId: 'LocationId1',
      departmentId: 'DepartmentId1',
      instrumentId: 'InstrumentId1',
      productId: 'ProductId1',
      labTestId: 'LabTestId1',
      codeListTestId: 'TestId1',
      analyteName: 'TestName1',
      calibratorLots: [
        {
          id: 1,
          calibratorId: 1,
          lotNumber: '1',
          shelfExpirationDate: new Date(),
          calibratorName: 'calibratorName'
        }
      ],
      reagentLots: [
        {
          id: 1,
          reagentId: 1,
          lotNumber: '1',
          shelfExpirationDate: new Date(),
          reagentName: 'reagentName'
        }
      ],
      linkedCalibratorLotCodes: ['1', '2'],
      linkedReagentLotCodes: ['1', '2'],
      code: 'code1',
      documentId: 'DocumentId1',
      methodName: 'MethodName1'
    },
    {
      locationId: 'LocationId2',
      departmentId: 'DepartmentId2',
      instrumentId: 'InstrumentId2',
      productId: 'ProductId2',
      labTestId: 'LabTestId2',
      codeListTestId: 'TestId2',
      analyteName: 'TestName2',
      calibratorLots: [
        {
          id: 2,
          calibratorId: 2,
          lotNumber: '2',
          shelfExpirationDate: new Date(),
          calibratorName: 'calibratorName'
        }
      ],
      reagentLots: [
        {
          id: 2,
          reagentId: 2,
          lotNumber: '2',
          shelfExpirationDate: new Date(),
          reagentName: 'reagentName'
        }
      ],
      linkedCalibratorLotCodes: ['1', '2'],
      linkedReagentLotCodes: ['1', '2'],
      code: 'code2',
      documentId: 'DocumentId2',
      methodName: 'MethodName2'
    }
  ];
}
