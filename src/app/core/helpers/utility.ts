/*© 2024 Bio-Rad Laboratories, Inc. All Rights Reserved.*/

import { CustomRegex as reg } from 'br-component-library';
import { EntityType } from '../../contracts/enums/entity-type.enum';
import { TreePill } from '../../contracts/models/lab-setup/tree-pill.model';

export class Utility {
  static readonly percentageVariation = 100;
  static readonly defaultCvValue = 0;

  static isEmpty(value) {
    if (!value) {
      return true;

    }

    return value == null || this.trim(value) === '' || value.length === 0;
  }

  static isNotEmpty(value) {
    return !this.isEmpty(value);
  }

  static isInteger(value) {
    return this.isNotEmpty(value) && reg.ONLY_DIGITS.test(this.trim(value));
  }

  static isIntegerGreaterThan(value, base) {
    return this.isInteger(value) && value > base;
  }

  static isIntegerGreaterThanEqual(value, base) {
    return this.isInteger(value) && value >= base;
  }

  static isValidPositiveInteger(value) {
    return this.isEmpty(value) || this.isIntegerGreaterThanEqual(value, 1);
  }
  static isFloat(value) {
    return this.isNotEmpty(value) && reg.SIMPLE_NUMBER.test(this.trim(value));
  }

  static isFloatGreaterThan(value, base) {
    return this.isFloat(value) && value > base;
  }

  static isFloatGreaterThanEqual(value, base) {
    return this.isFloat(value) && value >= base;
  }

  static isFloatGreatThanAndLessThanEqual(value, base1, base2) {
    return this.isFloat(value) && (value > base1) && (value <= base2);
  }

  static isFloatGreatThanAndLessThan(value, base1, base2) {
    return this.isFloat(value) && (value > base1) && (value < base2);
  }

  static toNumber(value) {
    if (!value || this.isEmpty(value)) {
      return;
    }

    const result = +this.trim(value);
    if (isNaN(result)) {
      return;
    }

    return result;
  }

  static trim(value) {
    if (value && value.trim) {
      return value.trim();
    }
    return value;
  }

  static promiseFactory<T>(): { promise: Promise<T>, resolve: any, reject: any } {
    let resolve;
    let reject;
    const promise = new Promise<T>((_resolve, _reject) => { resolve = _resolve; reject = _reject; });
    return { promise, resolve, reject };
  }

  static isDateExpired(date): boolean {
    const earlyToday = new Date();
    earlyToday.setHours(0, 0, 0, 0);

    const lateTargetDate = new Date(date);
    lateTargetDate.setHours(23, 59, 59, 999);

    return (lateTargetDate < earlyToday);
  }

  static getProperty(propertyName, object) {
    const parts = propertyName.split('.'),
      length = parts.length;
    let property = object || this;

    for (let i = 0; i < length; i++) {
      property = property[parts[i]];
    }

    return property;
  }

  static sanitizePath(path: string) {
    if (path.endsWith('/') || path.endsWith('\\')) {
      return path;
    }

    return `${path}/`;
  }

  static createImmutableObject<T>(current: T, source: T): T {
    return Object.assign({}, current, source) as T;
  }

  static ieVersion() {
    const match = /\b(MSIE |Trident.*?rv:|Edge\/)(\d+)/.exec(navigator.userAgent);
    if (match) {
      return parseInt(match[2], 10);
    }
  }

  // Set value of drop-down list if only one item.
  static setFirstDropDownSelection(obj: any, propertyToSet: string, selectionList: any[], listValueProperty: any): void {
    if (selectionList && selectionList.length === 1) {
      const firstValue = listValueProperty ? selectionList[0][listValueProperty] : selectionList[0];

      if (!!obj && !!propertyToSet) {
        obj[propertyToSet] = firstValue;
      }
    }
  }

  static shallowCompare = (obj1: any, obj2: any) =>
    Object.keys(obj1).length === Object.keys(obj2).length &&
    Object.keys(obj1).every(key =>
      obj2.hasOwnProperty(key) && obj1[key] === obj2[key]
    )

  static convertDateToYearMonth(date: Date): string {
    date = new Date(date);
    const stringYear = date.getFullYear().toString();
    const month = date.getMonth() + 1;

    const stringMonth = month < 10 ? ('0' + month).toString() : month.toString();

    return stringYear + stringMonth;
  }

  static calculateCV(sd: number, mean: number) {
    if (sd !== 0 && mean !== 0) {
      return (sd / mean) * this.percentageVariation;
    } else {
      return this.defaultCvValue;
    }
  }

  static equalsCaseInsensitive(a: string, b: string): boolean {
    if (!a) {
      return false;
    }
    return a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0;
  }

  static alphaSort = (string1: string, string2: string) => {
    const s1 = string1.toLocaleLowerCase();
    const s2 = string2.toLocaleLowerCase();
    return s1.localeCompare(s2, undefined, { sensitivity: 'accent' });
  }

  static findTreeNodeByType(array, nodeType) {
    if (!array || !array.length) { return false; }
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      if (element.nodeType === nodeType) {
        return element;
      } else {
        if (element.children) {
          const found = this.findTreeNodeByType(element.children, nodeType);
          if (found) {
            return found;
          }
        }
      }
    }
  }

  //  This method can be used generically to sort any type of array.

  static sortArray(array: Array<any>, sortingKey: string) {
    if (array && array.length) {
      array.slice().sort((r1, r2) => +r1[sortingKey] - +r2[sortingKey]);
    }
    return array;
  }

  static base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }


  static getParentNodeType(nodeType: EntityType, instrumentsGroupedByDept: boolean): EntityType {
    let parentNodeType: EntityType;
    switch (nodeType) {
      case EntityType.None:
        parentNodeType = null;
        break;
      case EntityType.Lab:
        parentNodeType = EntityType.Account;
        break;
      case EntityType.LabLocation:
        parentNodeType = EntityType.Lab;
        break;
      case EntityType.LabDepartment:
        parentNodeType = EntityType.LabLocation;
        break;
      case EntityType.LabInstrument:
        if (nodeType === EntityType.LabInstrument && instrumentsGroupedByDept) {
          parentNodeType = EntityType.LabDepartment;
        } else {
          parentNodeType = EntityType.LabLocation;
        }
        break;
      case EntityType.LabProduct:
        parentNodeType = EntityType.LabInstrument;
        break;
      case EntityType.LabTest:
        parentNodeType = EntityType.LabProduct;
        break;
      case EntityType.Panel:
        parentNodeType = EntityType.LabLocation;
        break;
      case EntityType.AccountSettings:
        parentNodeType = EntityType.Account;
        break;
      case EntityType.User:
        parentNodeType = EntityType.Account;
        break;
    }
    return parentNodeType;
  }

  static normalizeToRationalNumber(no) {
  
    if (no === '0') {
      return no;
    } else if (!!no) {
      no = no.toString();
      const spaceCount = (no.split(/\s+/gi).length - 1);
      const periodCount = (no.split(/\,+/gi).length - 1);
      let reshapedNumber = no;

      if (spaceCount === 1) {
        reshapedNumber = no.replace(/\s/g, '.');
      }
      if (periodCount === 1) {
        reshapedNumber = no.replace(/,/g, '.');
      }
      return parseFloat(reshapedNumber);
    }
  }

  static hasAnalyteLevelNode(node: TreePill): boolean {
    let result = false;
    if (node.nodeType === EntityType.LabTest) {
      return true;
    } else {
      if (node.children && node.children.length) {
        result = node.children.some(child => this.hasAnalyteLevelNode(child));
      }
      if (result) {
        return result;
      }
    }
  }

}
