import { LocationActions } from '../actions';
import { LabLocation } from '../../../contracts/models/lab-setup';
import { LabLocationContact } from '../../../contracts/models/lab-setup/lab-location-contact.model';
import { createReducer, on } from '@ngrx/store';

export interface LocationState {
  currentLabLocation: LabLocation;
  currentLabLocationContact: LabLocationContact;
}

export const navigationState: LocationState = {
  currentLabLocation: null,
  currentLabLocationContact: null
};

export const reducer = createReducer(
  navigationState,
    on(LocationActions.setCurrentLabLocation, (state, { currentLabLocation }) => ({
      ...state,
      currentLabLocation: currentLabLocation,
    })),

    on(LocationActions.clearCurrentLabLocation, state => ({
      ...state,
      currentLabLocation: null,
    })),

    on(LocationActions.clearCurrentLabLocationContact, state => ({
        ...state,
        currentLabLocationContact: null,
      })),

    on(LocationActions.setCurrentLabLocationContact, (state, { currentLabLocationContact }) => ({
      ...state,
      currentLabLocationContact: currentLabLocationContact
    }))
);
