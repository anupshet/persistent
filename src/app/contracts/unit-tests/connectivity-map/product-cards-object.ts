import { ProductCard } from '../../models/connectivity-map/map-card.model';

export class ProductCardsObject {
  static productCards: Array<ProductCard> = [
    {
      documentId: 'DocumentId1',
      locationId: 'LocationId1',
      departmentId: 'DepartmentId1',
      instrumentId: 'InstrumentId1',
      productId: 'ProductId1',
      productName: 'ProductName1',
      productMasterLotNumber: '1234',
      controlLotLevelIds: ['1', '2', '3'],
      levels: [1, 2, 3],
      badgeCount: 3,
      productLevels: [
        {
          code: 'code1',
          controlLotLevelId: 'lotId1',
          level: 1
        }
      ]
    },
    {
      locationId: 'LocationId2',
      documentId: 'DocumentId2',
      departmentId: 'DepartmentId2',
      instrumentId: 'InstrumentId2',
      productId: 'ProductId2',
      productName: 'ProductName2',
      productMasterLotNumber: '1234',
      controlLotLevelIds: ['1', '2', '3'],
      levels: [1, 2, 3],
      badgeCount: 3,
      productLevels: [
        {
          code: 'code1',
          controlLotLevelId: 'lotId1',
          level: 1
        }
      ]
    }
  ];
}
