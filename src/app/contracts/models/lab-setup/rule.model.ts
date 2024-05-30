export class Rule {
  ruleId: number;
  name: string;
  description: string;
  prefixText: string;
  suffixText: string;
  entryFormat: number;
  valueOptions: Array<ValueOption> = new Array();
  disposition: string;
  disabledDisposition?: string;
  displayOrder: number;
  isVisible: boolean;
}

export class ValueOption {
  displayText: string;
  value: number;
  isDefault: boolean;
}

