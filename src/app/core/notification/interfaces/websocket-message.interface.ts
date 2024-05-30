export interface WebsocketMessage {
  service: string;
  action: string;
  topic: string;
  payload: any;
  message: string;
}
