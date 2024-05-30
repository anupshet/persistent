import { ConnectivityMapTree, Product, Test, LevelCode } from '../../models/connectivity-map/connectivity-map-tree.model';

export class ConnectivityMapTreeObject {
  static tests: Array<Test> = [{
    id: '',
    codes: [''],
    reagentLot: null,
    calibratorLot: null,
  }];

  static levelCodes: Array<LevelCode> = [{
    id: '',
    codes: [''],
    test: null
  }];

  static products: Array<Product> = [{
    id: '',
    levelCodes: ConnectivityMapTreeObject.levelCodes
  }];

  static connectivityMapTrees: Array<ConnectivityMapTree> = [{
    id: '',
    labId: '',
    locationId: '',
    departmentId: '',
    instrumentId: '',
    codes: [''],
    product: ConnectivityMapTreeObject.products
  }];
}
