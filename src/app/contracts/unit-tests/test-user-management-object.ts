// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { ShipTo, User } from '../models/user-management/user.model';
import { UserRole } from '../enums/user-role.enum';
import { EntityType } from '../enums/entity-type.enum';

// tslint:disable-next-line: class-name
export class testContactInfo {

  email: string;
  entityType: number;
  firstName: string;
  id: string;
  lastName: string;
  middleName: string;
  name: string;
  phone: string;

  constructor() {
    this.email = 'test@bio-rad.com',
      this.entityType = 7,
      this.firstName = 'firstName',
      this.lastName = 'lastName',
      this.id = '1',
      this.middleName = 'middleName',
      this.name = this.firstName + ' ' + this.lastName,
      this.phone = '867 555 5349';
  }
}

export class TestUserManagementObject {
  static newUser: User = {
    id: '100',
    firstName: 'new',
    lastName: 'user',
    email: 'newuser@user.com',
    userRoles: [UserRole.LabSupervisor],
    contactInfo: new testContactInfo,
    nodeType: EntityType.User,
    children: [],
    parentNodeId: '',
    displayName: '',
    userOktaId: '',
    parentAccounts: [],
    allowedShipTo: ShipTo.single
  };

  static users: Array<User> = [
    {
      id: '4',
      firstName: 'Frank',
      lastName: 'Bailey',
      email: 'test4@bio-rad.com',
      userRoles: [UserRole.LabSupervisor],
      contactInfo: new testContactInfo,
      nodeType: EntityType.User,
      children: [],
      parentNodeId: '',
      displayName: '',
      userOktaId: '',
      parentAccounts: [],
      allowedShipTo: ShipTo.single
    },
    {
      id: '5',
      firstName: 'Sebastian',
      lastName: 'Payne',
      email: 'test5@bio-rad.com',
      userRoles: [UserRole.LabSupervisor],
      contactInfo: new testContactInfo,
      nodeType: EntityType.User,
      children: [],
      parentNodeId: '',
      displayName: '',
      userOktaId: '',
      parentAccounts: [],
      allowedShipTo: ShipTo.all
    },
    {
      id: '6',
      firstName: 'Alan',
      lastName: 'Mitchell',
      email: 'test6@bio-rad.com',
      userRoles: [UserRole.LabSupervisor],
      contactInfo: new testContactInfo,
      nodeType: EntityType.User,
      children: [],
      parentNodeId: '',
      displayName: '',
      userOktaId: '',
      parentAccounts: [],
      allowedShipTo: ShipTo.single
    }
  ];

  static adminCards: Array<User> = [
    {
      id: '1',
      firstName: 'Julia',
      lastName: 'Henderson',
      email: 'test1@bio-rad.com',
      userRoles: [UserRole.LabSupervisor],
      contactInfo: new testContactInfo,
      nodeType: EntityType.User,
      children: [],
      parentNodeId: '',
      displayName: '',
      userOktaId: '',
      parentAccounts: [],
      allowedShipTo: ShipTo.single
    },
    {
      id: '2',
      firstName: 'Gabrielle',
      lastName: 'Skinner',
      email: 'test2@bio-rad.com',
      userRoles: [UserRole.LabSupervisor],
      contactInfo: new testContactInfo,
      nodeType: EntityType.User,
      children: [],
      parentNodeId: '',
      displayName: '',
      userOktaId: '',
      parentAccounts: [],
      allowedShipTo: ShipTo.single
    }
  ];

  static userCards: Array<User> = [
    {
      id: '7',
      firstName: 'Penelope',
      lastName: 'Wallace',
      email: 'test7@bio-rad.com',
      userRoles: [UserRole.LabSupervisor],
      contactInfo: new testContactInfo,
      nodeType: EntityType.User,
      children: [],
      parentNodeId: '',
      displayName: '',
      userOktaId: '',
      parentAccounts: [],
      allowedShipTo: ShipTo.single
    },
    {
      id: '8',
      firstName: 'Sarah',
      lastName: 'Rees',
      email: 'test8@bio-rad.com',
      userRoles: [UserRole.LabSupervisor],
      contactInfo: new testContactInfo,
      nodeType: EntityType.User,
      children: [],
      parentNodeId: '',
      displayName: '',
      userOktaId: '',
      parentAccounts: [],
      allowedShipTo: ShipTo.single
    }
  ];
}
