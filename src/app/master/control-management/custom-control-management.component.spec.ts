// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.

import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";
import { StoreModule } from "@ngrx/store";

import { CustomControlManagementComponent } from "./custom-control-management.component";
import { DefineCustomControls } from "./define-custom-controls/define-custom-controls.component";
import { AddDefineOwnControlComponent } from "../lab-setup/components/add-define-own-control/add-define-own-control.component";
import { ErrorLoggerService } from "../../shared/services/errorLogger/error-logger.service";


describe("CustomControlManagementComponent", () => {
    let component: CustomControlManagementComponent;
    let fixture: ComponentFixture<CustomControlManagementComponent>;
    const appState = [];

    const mockErrorLoggerService = jasmine.createSpyObj([
        'logErrorToBackend',
        'populateErrorObject'
      ]);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [StoreModule.forRoot(appState)],
            declarations: [DefineCustomControls, AddDefineOwnControlComponent],
            providers: [FormBuilder,
                { provide: ErrorLoggerService, useValue: mockErrorLoggerService },],
        }).compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(CustomControlManagementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});