/*© 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.*/
import { CommonModule, registerLocaleData } from '@angular/common';

import localeDe from '@angular/common/locales/de';
import localeEs from '@angular/common/locales/es';
import localeFr from '@angular/common/locales/fr';
import localeHu from '@angular/common/locales/hu';
import localeIt from '@angular/common/locales/it';
import localeJa from '@angular/common/locales/ja';
import localeKo from '@angular/common/locales/ko';
import localePl from '@angular/common/locales/pl';
import localePt from '@angular/common/locales/pt';
import localeRu from '@angular/common/locales/ru';
import localeZh from '@angular/common/locales/zh';
import localeRuExtra from '@angular/common/locales/extra/ru';
import localeDeExtra from '@angular/common/locales/extra/de';

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Added for task: 165694
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterModule } from '@angular/router';
import { TreeModule } from 'angular-tree-component';
import { StoreModule } from '@ngrx/store';
import { NgBusyModule, BusyConfig } from 'ng-busy';
import { NgxExtendedPdfViewerService, NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { NgxPaginationModule } from 'ngx-pagination';
import {
  BrSelect, BrSummaryStatisticsTable, BrCore, MaterialModule, BrInfoTooltip, BrChangeLot,
  BrEntrySaveModule, BrAnalytePointView, BrAnalytePointEntry, BrAnalyteSummaryView
} from 'br-component-library';

import { ReleaseNotesService } from './nav-bar/setting-bar/release-note.service';
import { ReleaseNoteComponent } from './nav-bar/setting-bar/release-note/release-note.component';
import { MessageSnackBarService } from '../core/helpers/message-snack-bar/message-snack-bar.service';
import { ParsingEngineService } from './services/parsing-engine.service';
import { LabLocationService } from './lab-location.service';
import { EntityTypeService } from './services/entity-type.service';
import { TreeNodesAction } from './state/tree-nodes.action';
import { TreeNodesService } from './services/tree-nodes.service';
import { LabTestService } from './services/test-run.service';
import { AccountSummaryAction } from './account-summary.action';
import { ParsingEngineApiService } from './api/parsingEngineApi.service';
import { TruncatePipe } from './pipes/truncate.pipe';
import { UnityDateTimeModule } from './date-time/unity-date-time.module';
import { IndicatorModule } from './indicator/indicator.module';
import { LoginComponent } from './login/login.component';
import { LabBarComponent } from './nav-bar/lab-bar/lab-bar.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NotificationBarComponent } from './nav-bar/notification-bar/notification-bar.component';
import { SettingBarComponent } from './nav-bar/setting-bar/setting-bar.component';
import { UserBarComponent } from './nav-bar/user-bar/user-bar.component';
import { NavigationService } from './navigation/navigation.service';
import { TestTrackerService } from './services/test-tracker.service';
import { SideNavService } from './side-nav/side-nav.service';
import { AddressInfoComponent } from './ui/display/address-info/address-info.component';
import { LicenceInfoComponent } from './ui/display/licence-info/licence-info.component';
import { AddressFormComponent } from './ui/forms/address-form/address-form.component';
import { UserPreferenceService } from './user-preference.service';
import { SafeUrlPipe } from './pipes/safe-url/safe-url.pipe';
import { TransformValuePipe, TransformZscorePipe } from './pipes/transform-values.pipe';
import { LocaleConverter } from './locale/locale-converter.service';
import { DateTimeHelper } from './date-time/date-time-helper';
import { UserMessagesDialogComponent } from './nav-bar/setting-bar/tos-modal/user-messages-modal-dialog.component';
import { UserManagementAction } from './state/user-management.action';
import { LabDataApiService } from './api/labDataApi.service';
import { UnityBusyComponent } from './indicator/unity-busy/unity-busy.component';
import { ValidatorsService } from './services/validators/validators.service';
import { UserPreferenceAction } from './services/user-preference/user-preference.action';
import { UnityRestrictDecimalPlacesDirective } from './directives/unity-restrict-decimal-places.directive';
import { UnityDebounceClicksDirective } from './directives/unity-debounce-clicks.directive';
import { LoggingApiService } from './api/logging-api.service';
import { NodeInfoComponent } from './node-info/node-info.component';
import { NodeInfoDetailsComponent } from './node-info/node-info-details/node-info-details.component';
import { ConfirmDialogDeleteComponent } from './components/confirm-dialog-delete/confirm-dialog-delete.component';
import { ConfirmNbrControlDeleteComponent } from './components/confirm-dialog-nbr-delete/confirm-dialog-nbr-delete.component';
import { NodeInfoAction } from './state/node-info.action';
import { OverlayComponent } from './components/overlay/overlay.component';
import { LabSetupService } from './services/lab-setup.service';
import { InProgressMessageTranslationService } from './services/inprogress-message-translation.service';
import { nodeInfoStateIdentifier, labConfigDuplicateLotsIdentifier } from './state/selectors';
import { reducer } from './state/reducers/node-info.reducer';
import { dataManagementStateIdentifier } from '../master/data-management/state/selectors';
import { reducer as dataManagementReducer } from '../master/data-management/state/reducers/data-management.reducer';
import { PageSectionComponent } from './page-section/page-section.component';
import { DataManagementService } from './services/data-management.service';
import { DataManagementAction } from './services/data-management.action';
import { DataManagementSpinnerService } from './services/data-management-spinner.service';
import { PageSectionService } from './page-section/page-section.service';
import { RunsService } from './services/runs.service';
import { UIConfigService } from './services/ui-config.service';
import { RequestNewConfigComponent } from './components/request-new-config/request-new-config.component';
import { RequestNewConfigMessageComponent } from './components/request-new-config-message/request-new-config-message.component';
import { RequestNewConfigEmailService } from './components/request-new-config-email.service';
import { UploadConfigFileComponent } from './components/upload-config-file/upload-config-file.component';
import { BannerInfoComponent } from './banner-info/banner-info.component';
import { AnalyteMultiPointComponent } from '../master/data-management/shared/analyte-multi-point/analyte-multi-point.component';
import { AnalyteSummaryEntryComponent } from '../master/data-management/shared/analyte-multi-summary/analyte-summary-entry/analyte-summary-entry.component';
import { DuplicateNodeComponent } from './containers/duplicate-node/duplicate-node.component';
import { DuplicateNodeEntryComponent } from './components/duplicate-node-entry/duplicate-node-entry.component';
import { LabConfigurationApiService } from './services/lab-configuration.service';
import { reducer as labConfigDuplicateLotsReducer } from './state/reducers/lab-config-duplicate-lots.reducer';
import { LogoutWarningDialogComponent } from './components/logout-warning-dialog/logout-warning-dialog.component';
import { ImageToPdfService } from './services/image-to-pdf.service';
import { NodeInfoService } from './services/node-info.service';
import { TestSpecService } from './services/test-spec.service';
import { AcceptLoosingChangesComponent } from './components/accept-loosing-changes/accept-loosing-changes.component';
import { TimePickerMilitaryComponent } from './components/time-picker-military/time-picker-military.component';
import { CookieDisclaimerMessageComponent } from './components/cookie-disclaimer-message/cookie-disclaimer-message.component';
import { ReportTimeoutMessageComponent } from './components/report-timeout-message/report-timeout-message.component';
import { LabSettingsDialogComponent } from './components/lab-settings-dialog/lab-settings-dialog.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { BrAccessControlDirective } from '../security/directives/check-permissions.directive';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { CustomTooltipComponent } from './components/custom-tooltip/custom-tooltip.component';
import { TooltipDirective } from './directives/tooltip.directive';
import { BrNumericValueDirective } from './directives/numeric-value.directive';
import { BrAnalyteSummaryEntry } from 'projects/br-component-library/src/public_api';
import { CookiePreferencesComponent } from './components/cookie-preferences/cookie-preferences.component';
import { InformativeMessageComponent } from './components/informative-message/informative-message.component';
import { TranslateModule } from '@ngx-translate/core';
import { RemapAnalyteDialogComponent } from './components/remap-analyte-dialog/remap-analyte-dialog.component';
import { LanguageDropdownComponent } from './components/language-dropdown/language-dropdown.component';
import { MultipleButtonDialogComponent } from './components/multiple-button-dialog/multiple-button-dialog.component';
import { TempleteClickOutsideDirective } from './directives/templete-click-outside.directive';
import { AddDefineOwnControlComponent } from '../master/lab-setup/components/add-define-own-control/add-define-own-control.component';
import { LabSetupHeaderComponent } from '../master/lab-setup/components/lab-setup-header/lab-setup-header.component';
import { CardComponent } from './cards/card.component';
import { CustomLotManagementComponent } from '../master/control-management/shared/components/custom-lot-management/custom-lot-management.component';
import { MasterLotDialogComponent } from '../master/control-management/shared/components/master-lot-dialog/master-lot-dialog.component';
import { DataReviewWarningDialogComponent } from './components/data-review-warning-dialog/data-review-warning-dialog.component';
import { NavBarLangComponent } from './navigation/nav-bar/nav-bar-lang/nav-bar-lang.component';
import { NavBarLoginLangComponent } from './navigation/nav-bar/nav-bar-login-lang/nav-bar-login-lang.component';
import { LanguageDialogComponent } from './components/language-dialog/language-dialog.component';
import { LocalizationDatePickerHelper } from './localization-date-time/localization-date-time-formats';
import { AdvancedLjPanelComponent } from '../master/data-management/advanced-lj/advanced-lj-panel/advanced-lj-panel.component';
import { AdvancedLjTimeframeComponent } from '../master/data-management/advanced-lj/advanced-lj-timeframe/advanced-lj-timeframe.component';
import { AdvancedLjLevelsComponent } from '../master/data-management/advanced-lj/advanced-lj-levels/advanced-lj-levels.component';
import { AdvancedLjChartComponent } from '../master/data-management/advanced-lj/advanced-lj-chart/advanced-lj-chart.component';
import { AnalyteDescriptionComponent } from '../master/data-management/shared/analyte-description/analyte-description.component';

registerLocaleData(localeDe, 'de', localeDeExtra);
registerLocaleData(localeEs, 'es');
registerLocaleData(localeFr, 'fr');
registerLocaleData(localeHu, 'hu');
registerLocaleData(localeIt, 'it');
registerLocaleData(localeJa, 'ja');
registerLocaleData(localeKo, 'ko');
registerLocaleData(localePl, 'pl');
registerLocaleData(localePt, 'pt');
registerLocaleData(localeRu, 'ru', localeRuExtra);
registerLocaleData(localeZh, 'zh');

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

const BUSY_CONFIG = function busyConfigFactory() {
  return new BusyConfig({
    backdrop: true,
    template: UnityBusyComponent,
    delay: 200,
    minDuration: 600
  });
};

@NgModule({
  declarations: [
    NavBarComponent,
    UserBarComponent,
    LabBarComponent,
    SettingBarComponent,
    NotificationBarComponent,
    LoginComponent,
    TransformValuePipe,
    TruncatePipe,
    AddressFormComponent,
    AddressInfoComponent,
    LicenceInfoComponent,
    ReleaseNoteComponent,
    OverlayComponent,
    SafeUrlPipe,
    UserMessagesDialogComponent,
    UnityBusyComponent,
    UnityRestrictDecimalPlacesDirective,
    UnityDebounceClicksDirective,
    NodeInfoComponent,
    NodeInfoDetailsComponent,
    ConfirmDialogComponent,
    ConfirmDialogDeleteComponent,
    ConfirmNbrControlDeleteComponent,
    PageSectionComponent,
    AnalyteMultiPointComponent,
    AnalyteSummaryEntryComponent,
    BannerInfoComponent,
    ErrorMessageComponent,
    DuplicateNodeComponent,
    DuplicateNodeEntryComponent,
    LogoutWarningDialogComponent,
    RequestNewConfigComponent,
    RequestNewConfigMessageComponent,
    UploadConfigFileComponent,
    PageSectionComponent,
    ReportTimeoutMessageComponent,
    CookieDisclaimerMessageComponent,
    AcceptLoosingChangesComponent,
    TimePickerMilitaryComponent,
    LabSettingsDialogComponent,
    BrAccessControlDirective,
    CustomTooltipComponent,
    TooltipDirective,
    BrNumericValueDirective,
    CookiePreferencesComponent,
    InformativeMessageComponent,
    RemapAnalyteDialogComponent,
    LanguageDropdownComponent,
    MultipleButtonDialogComponent,
    TempleteClickOutsideDirective,
    NavBarLangComponent,
    NavBarLoginLangComponent,
    LanguageDialogComponent,
    AddDefineOwnControlComponent,
    LabSetupHeaderComponent,
    CardComponent,
    MasterLotDialogComponent,
    CustomLotManagementComponent,
    DataReviewWarningDialogComponent,
    TransformZscorePipe,
    AdvancedLjPanelComponent,
    AdvancedLjTimeframeComponent,
    AdvancedLjLevelsComponent,
    AdvancedLjChartComponent,
    AnalyteDescriptionComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PerfectScrollbarModule,
    RouterModule,
    TreeModule,
    MatCardModule,
    NgBusyModule,
    UnityDateTimeModule,
    NgxExtendedPdfViewerModule,
    IndicatorModule,
    BrSelect,
    BrSummaryStatisticsTable,
    BrCore,
    BrInfoTooltip,
    MaterialModule,
    NgxPaginationModule,
    BrAnalytePointView,
    BrEntrySaveModule,
    BrAnalytePointEntry,
    BrAnalyteSummaryView,
    BrAnalyteSummaryEntry,
    BrChangeLot,
    MatDialogModule,
    MatDatepickerModule,
    StoreModule.forFeature(nodeInfoStateIdentifier, reducer),
    StoreModule.forFeature(dataManagementStateIdentifier, dataManagementReducer),
    StoreModule.forFeature(labConfigDuplicateLotsIdentifier, labConfigDuplicateLotsReducer),
    MatExpansionModule,
    TranslateModule
  ],
  exports: [
    NavBarComponent,
    UserBarComponent,
    LabBarComponent,
    SettingBarComponent,
    NotificationBarComponent,
    LoginComponent,
    TreeModule,
    TransformValuePipe,
    TruncatePipe,
    AddressFormComponent,
    AddressInfoComponent,
    LicenceInfoComponent,
    UserMessagesDialogComponent,
    OverlayComponent,
    PageSectionComponent,
    SafeUrlPipe,
    ReactiveFormsModule,
    FormsModule,
    NgBusyModule,
    UnityDateTimeModule,
    IndicatorModule,
    MaterialModule,
    NodeInfoComponent,
    NodeInfoDetailsComponent,
    UnityRestrictDecimalPlacesDirective,
    UnityDebounceClicksDirective,
    NgxPaginationModule,
    BrAnalytePointView,
    BrEntrySaveModule,
    BrAnalytePointEntry,
    BrAnalyteSummaryView,
    BrAnalyteSummaryEntry,
    BannerInfoComponent,
    ErrorMessageComponent,
    DuplicateNodeComponent,
    DuplicateNodeEntryComponent,
    RequestNewConfigComponent,
    AcceptLoosingChangesComponent,
    TimePickerMilitaryComponent,
    BrAccessControlDirective,
    TooltipDirective,
    BrNumericValueDirective,
    LanguageDropdownComponent,
    NavBarLangComponent,
    NavBarLoginLangComponent,
    TransformZscorePipe,
    AddDefineOwnControlComponent,
    LabSetupHeaderComponent,
    CardComponent,
    MasterLotDialogComponent,
    CustomLotManagementComponent
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: BusyConfig,
      useFactory: BUSY_CONFIG
    },
    SideNavService,
    LabLocationService,
    TreeNodesAction,
    TreeNodesService,
    EntityTypeService,
    NavigationService,
    LabTestService,
    NgxExtendedPdfViewerService,
    AccountSummaryAction,
    ParsingEngineService,
    ParsingEngineApiService,
    MessageSnackBarService,
    UserPreferenceService,
    UserPreferenceAction,
    UserManagementAction,
    NodeInfoAction,
    ReleaseNotesService,
    TestTrackerService,
    LocaleConverter,
    DateTimeHelper,
    LabDataApiService,
    ValidatorsService,
    LabSetupService,
    LoggingApiService,
    InProgressMessageTranslationService,
    DataManagementService,
    DataManagementAction,
    DataManagementSpinnerService,
    PageSectionService,
    RunsService,
    UIConfigService,
    LabConfigurationApiService,
    RequestNewConfigEmailService,
    ImageToPdfService,
    NodeInfoService,
    TestSpecService,
    LocalizationDatePickerHelper,
  ],
  entryComponents: [
    ReleaseNoteComponent,
    UserMessagesDialogComponent,
    UnityBusyComponent
  ]
})
export class SharedModule { }
