import { orderBy, isEqual } from 'lodash';

import { disposition } from '../../../core/config/constants/spc-rules.const';
import { ruleId, asc } from '../../../core/config/constants/general.const';
import { RuleSetting } from '../../../contracts/models/lab-setup/rule-setting.model';
import { Settings } from '../../../contracts/models/lab-setup/settings.model';
import { minimumNumberPoints } from '../../../core/config/constants/general.const';
import { EntityType } from '../../../contracts/enums/entity-type.enum';
import { TreePill } from '../../../contracts/models/lab-setup/tree-pill.model';

export function getSettings(newsettings: Settings, rules: Array<RuleSetting>, existingSettings: Settings): Settings {
  let existingRules;
  const newRules = rules.filter(el => el.disposition === disposition.disabled).length;
  if (newRules === rules.length) {
    newsettings.ruleSettings = [];
  } else {
    newsettings.ruleSettings = orderBy(rules, [ruleId], [asc]);
    existingRules = orderBy(existingSettings.ruleSettings, [ruleId], [asc]);
  }
  const removedDisabled = rules.filter(el => el.disposition !== disposition.disabled);
  const rulesToCompare = orderBy(removedDisabled, [ruleId], [asc]);
  if (isEqual(newsettings.levelSettings, existingSettings.levelSettings)) {
    newsettings.levelSettings = null;
  }
  if (isEqual(rulesToCompare, existingRules)) {
    newsettings.ruleSettings = null;
  }
  newsettings.runSettings = {
    'minimumNumberOfPoints': newsettings.runSettings.minimumNumberOfPoints ?
      newsettings.runSettings.minimumNumberOfPoints : minimumNumberPoints,
    'floatStatsStartDate': null
  };
  return newsettings;
}

export function hasAnalyteLevelNode(node: TreePill): boolean {
  let result = false;
  if (node.nodeType === EntityType.LabTest) {
    return true;
  } else {
    if (node.children && node.children.length) {
      result = node.children.some(child => hasAnalyteLevelNode(child));
    }
    if (result) {
      return result;
    }
  }
}

