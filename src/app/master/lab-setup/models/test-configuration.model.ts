export class TestConfiguration {
  analyte: string;
  reagentName: string;
  reagentCatalogNumber: string;
  reagentLotNumber: string;
  calibratorCatalogNumber: string;
  calibratorLotNumber: string;
  reagentLot: string;
  calibratorName: string;
  calibratorLot: string;
  method: string;
  unit: string;
  comment: string;
  // requester: Requester;
  dataType = 0; // expected by EmailSender api
}
