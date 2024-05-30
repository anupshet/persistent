export class NewInstrumentConfig {
  manufacturer: string;
  model: string;
  comment: string;
  // requester: Requester;
  dataType = 1; // expected by EmailSender Api
}
