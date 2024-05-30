export enum LicenseConnectivity {
  'None' = 0,
  'Delimited' = 1
}

export namespace LicenseConnectivity {
  export function getList(): Array<any> {
    const list = new Array<any>();
     // Populate the licenseType
    for (const opt in LicenseConnectivity) {
      if (parseInt(opt, 10) >= 0) {
        list.push({ name: LicenseConnectivity[opt], value: opt });
      }
    }
    return list;
  }
}
