export enum MigrationStates {
  Empty = '',
  Initiated = 'initiated',
  ConfigRequested = 'configrequested',
  ConfigReceived = 'configreceived',
  ResultsRequested = 'resultsrequested',
  ResultsReceived = 'resultsreceived',
  Completed = 'completed',
  Error = 'error'
}
