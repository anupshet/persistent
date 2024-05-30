import { ConnectivityMapCards, ConnectivityMapLabData } from '../../models/connectivity-map/connectivity-map-lab.model';
import { InstrumentCardsObject } from './instrument-cards-object';
import { ProductCardsObject } from './product-cards-object';
import { TestCardsObject } from './test-cards-object';
import { DropdownDataObject } from './dropdown-data-object';

export class ConnectivityMapLabDataObject {
  static connectivityMapCards: ConnectivityMapCards = {
    instrumentCards: InstrumentCardsObject.instrumentCards,
    productCards: ProductCardsObject.productCards,
    testCards: TestCardsObject.testCards
  };

  static connectivityMapLabData: ConnectivityMapLabData = {
    connectivityMapCards: ConnectivityMapLabDataObject.connectivityMapCards,
    connectivityMapDropdowns: DropdownDataObject.connectivityMapDropdowns
  };
}
