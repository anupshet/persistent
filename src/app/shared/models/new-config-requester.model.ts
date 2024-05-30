export class Requester {
  constructor(
    public unityNumber: string, // lab ID
    public facility: Facility,
    public labContact: LabContact
  ) { }
}

export class Facility {
  constructor(
    public name: string,
    public address: string,
    public address2: string,
    public city: string,
    public state: string,
    public zip: string
  ) { }
}

export class LabContact {
  constructor(
    public name: string,
    public email: string,
    public phone: string
  ) { }
}