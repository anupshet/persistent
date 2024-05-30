// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import * as ngrxSelector from '@ngrx/store';
import { select } from '@ngrx/store';
import { takeUntil, filter, take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { createFeatureSelector, createSelector } from '@ngrx/store';

interface NavigationState {
    locale?: object,
}
interface State {
    navigation: NavigationState;
}

interface LocationState {
    currentLabLocation?: {
        locationSettings?: object
    };
}

@Pipe({
    name: 'uNextNumeric',
    pure: false
})
export class UnityNextNumericPipe implements PipeTransform, OnDestroy {

    getNavigationState = createFeatureSelector<NavigationState>('navigation');
    getLocale = createSelector(this.getNavigationState, (state) => state && state.locale ? state.locale : { country: 'US', lcid: 'en-US', value: 'en', name: 'English' });
    navigationGetLocale$ = this.store.pipe(select(this.getLocale));

    getLocationState = createFeatureSelector<LocationState>('location');
    getCurrentLabLocation = createSelector(this.getLocationState, (state) => state ? state : null);
    getCurrentLabLocation$ = this.store.select(this.getCurrentLabLocation);

    private destroy$ = new Subject<boolean>();
    storedLocale;
    decimalPlaces: number;

    constructor(
        private store: ngrxSelector.Store<State>,
        private decimalPipe: DecimalPipe,
    ) {
        this.navigationGetLocale$
            .pipe(filter(loc => !!loc), takeUntil(this.destroy$))
            .subscribe(loc => {
                this.storedLocale = loc;
            });

        this.getCurrentLabLocation$
            .pipe(filter(location => !!location), takeUntil(this.destroy$))
            .subscribe(location => {
                if (location && location.currentLabLocation && location.currentLabLocation.locationSettings) {
                    this.decimalPlaces = location.currentLabLocation.locationSettings['decimalPlaces'];
                }
            });
    }

    transform(value: any, isZscore: boolean = false, decimalPoints?: number): any {
        if (!!value || typeof value === 'number') {
            let newValue: string;

            if (this.storedLocale !== undefined) {

                const zScoreDigitsInfo = '1.2-2';
                const decimalPlaces = decimalPoints ? decimalPoints : this.decimalPlaces;
                let digitsInfo: string;
                switch (decimalPlaces) {
                    case 0:
                        digitsInfo = '0.0-0';
                        break;
                    case 1:
                        digitsInfo = '0.1-1';
                        break;
                    case 2:
                        digitsInfo =  '0.2-2';
                        break;
                    case 3:
                        digitsInfo = '0.3-3';
                        break;
                    case 4:
                        digitsInfo = '0.4-4';
                        break;
                    default:
                        digitsInfo = '0.2-2';
                        break;
                }
                newValue = this.decimalPipe.transform(value, isZscore ? zScoreDigitsInfo : digitsInfo);
            }
     
            if (this.storedLocale.numberFormat === 2) {
                newValue = newValue.replace(/[.]/g, ',');
                let periodCount = (newValue.split(/\,+/gi).length - 1);
                if (this.storedLocale.numberFormat === 2 && periodCount >=2) {
                    newValue = newValue.replace(',', '.');
                }
            }

            if (this.storedLocale.numberFormat === 1) {
                newValue = newValue.replace(/[.]/g, ',');
                let periodCount = (newValue.split(/\,+/gi).length - 1);
                if (periodCount >=2) {
                    newValue = newValue.replace(/,/, ' ');
                }
            }
            return newValue;
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }
}