export enum LicenseType {
  'Base' = 0
  // 'Premium' = 1,
  // 'Enterprise' = 2
}

export namespace LicenseType {
  export function getList(): Array<string> {
    const list = new Array<any>();
     // Populate the licenseType
     for (const opt in LicenseType) {
      if (parseInt(opt, 10) >= 0) {
        list.push({ name: LicenseType[opt], value: opt });
      }
    }
    return list;
  }
}
