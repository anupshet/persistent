import { InstrumentCard, ProductCard, TestCard } from './map-card.model';
import { ConnectivityMapDropdowns } from './connectivity-map-dropdowns.model';

export class ConnectivityMapLabData {
  connectivityMapCards: ConnectivityMapCards;
  connectivityMapDropdowns: ConnectivityMapDropdowns;
}

export class ConnectivityMapCards {
  instrumentCards: Array<InstrumentCard>;
  productCards: Array<ProductCard>;
  testCards: Array<TestCard>;
}
