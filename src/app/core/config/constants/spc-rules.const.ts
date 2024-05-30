import { Rule } from '../../../contracts/models/lab-setup/rule.model';
import { RuleDisposition } from '../../../contracts/enums/lab-setup/spc-rule-enums/spc-rule-disposition.enum';
import { RuleEntryFormat } from '../../../contracts/enums/lab-setup/spc-rule-enums/spc-rule-entry-format.enum';
import { RuleName } from '../../../contracts/enums/lab-setup/spc-rule-enums/rule-name.enum';

export const defaultSpcRulesArray: Array<Rule> = [{
  name: RuleName._1_ksWarning,
  disposition: RuleDisposition.disable,
  displayOrder: 1,
  prefixText: '1-',
  suffixText: 'SPCRULESCOMPONENT.RULESUFFIXS',
  description: '',
  ruleId: 1,
  valueOptions: [{
    displayText: null,
    value: 2.00,
    isDefault: true
  }],
  entryFormat: RuleEntryFormat.FreeForm,
  isVisible: true,
  disabledDisposition: RuleDisposition.reject
},
{
  name: RuleName._1_ksReject,
  disposition: RuleDisposition.disable,
  displayOrder: 2,
  prefixText: '1-',
  suffixText: 'SPCRULESCOMPONENT.RULESUFFIXS',
  description: '',
  ruleId: 2,
  valueOptions: [{
    displayText: null,
    value: 3.00,
    isDefault: true
  }],
  entryFormat: RuleEntryFormat.FreeForm,
  isVisible: true,
  disabledDisposition: RuleDisposition.warning
},
{
  name: RuleName._2of2s,
  disposition: RuleDisposition.disable,
  displayOrder: 3,
  prefixText: '2 of 2',
  suffixText: 'SPCRULESCOMPONENT.RULESUFFIXS',
  description: '',
  ruleId: 3,
  valueOptions: null,
  entryFormat: RuleEntryFormat.Static,
  isVisible: true
},
{
  name: RuleName._2of32s,
  disposition: RuleDisposition.disable,
  displayOrder: 4, prefixText: '2 of 3/2',
  suffixText: 'SPCRULESCOMPONENT.RULESUFFIXS',
  description: '',
  ruleId: 4,
  valueOptions: null,
  entryFormat: RuleEntryFormat.Static,
  isVisible: true
},
{
  name: RuleName._kx,
  disposition: RuleDisposition.disable,
  displayOrder: 5,
  prefixText: null,
  suffixText: 'x',
  description: '',
  ruleId: 9,
  valueOptions: [
    { displayText: '7', value: 7, isDefault: false },
    { displayText: '8', value: 8, isDefault: false },
    { displayText: '9', value: 9, isDefault: false },
    { displayText: '10', value: 10, isDefault: true },
    { displayText: '12', value: 12, isDefault: false }
  ],
  entryFormat: RuleEntryFormat.MultiOption,
  isVisible: true
},
{
  name: RuleName._7T,
  disposition: RuleDisposition.disable,
  displayOrder: 7,
  prefixText: '7-',
  suffixText: 'T',
  description: '',
  ruleId: 8,
  valueOptions: null,
  entryFormat: RuleEntryFormat.Static,
  isVisible: true
},
{
  name: RuleName.R4s,
  disposition: RuleDisposition.disable,
  displayOrder: 8,
  prefixText: 'R-4',
  suffixText: 'SPCRULESCOMPONENT.RULESUFFIXS',
  description: '',
  ruleId: 7,
  valueOptions: null,
  entryFormat: RuleEntryFormat.Static,
  isVisible: true
},
{
  name: RuleName.k_1s,
  disposition: RuleDisposition.disable,
  displayOrder: 9,
  prefixText: null,
  suffixText: 'SPCRULESCOMPONENT.RULESUFFIXS',
  description: '',
  ruleId: 5,
  valueOptions: [
    { displayText: '3-1', value: 3, isDefault: true },
    { displayText: '4-1', value: 4, isDefault: false }
  ],
  entryFormat: RuleEntryFormat.MultiOption,
  isVisible: true
}];
export const disposition = {
  'reject': 'R',
  'warning': 'W',
  'disabled': 'D'
};



