// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule, ErrorHandler } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterStateSerializer, StoreRouterConnectingModule, DefaultRouterStateSerializer } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { EffectSources, Actions, EffectsModule } from '@ngrx/effects';
import {
  OKTA_CONFIG,
  OktaAuthModule,
} from '@okta/okta-angular';
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// polyfill TextEncoder for Edge
import { TextEncoder } from 'text-encoding';
if (typeof (window as any).TextEncoder === 'undefined') {
  (window as any).TextEncoder = TextEncoder;
}
import { BrDialog } from 'br-component-library';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigService } from './core/config/config.service';
import { CoreModule } from './core/core.module';
import { AuthInterceptor } from './security/interceptors/auth-interceptor.service';
import { LocaleInterceptor } from './security/interceptors/locale-interceptor.service';
import { SecurityModule } from './security/security.module';
import { CodelistApiService } from './shared/api/codelistApi.service';
import { PortalApiService } from './shared/api/portalApi.service';
import { IconService } from './shared/icons/icons.service';
import { NavBarEffects } from './shared/navigation/state/effects/nav-bar-effects';
import { SharedModule } from './shared/shared.module';
import { NavigationModule } from './shared/navigation/navigation.module';
import { UserPreferenceService } from './shared/user-preference.service';
import { AppEffects } from './state/effects/app.effects';
import { clearState } from './state/reducers/app.reducer';
import { reducers } from './state/app.state';
import { CustomSerializer } from './state/custom-serializer';
import { provideBootstrapEffects } from './shared/state/bootstrap.utility';
import { AwsApiService } from './shared/api/aws.service';
import { UIErrorHandler } from './security/interceptors/ui-error-handler.service';
import { ErrorLoggerService } from './shared/services/errorLogger/error-logger.service';
import { VersionCheckService } from './shared/version-check.service';
import { NotificationEffects } from './shared/navigation/state/effects/notification-effects';
import { AccountEffects } from './shared/state/effects/account.effects';
import { NodeInfoEffects } from './shared/state/effects/node-info.effects';
import { ApiService } from './shared/api/api.service';
import { LabConfigDuplicateLotsEffects } from './shared/state/effects/lab-config-duplicate-lots.effects';
import { LotViewerService } from './shared/api/lotViewer.service';
import { LabSetupDefaultEffects } from './master/lab-setup/state/effects/lab-setup.defaults.effects';
import { HttpErrorInterceptor } from './security/interceptors/http-error-interceptor.service';
import { HttpErrorService } from './security/services/http-errors.service';
import { DataReviewService } from './shared/api/data-review.service';


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // Angular Modules
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    // Okta Modules
    OktaAuthModule,

    // Core Functionality Modules
    CoreModule,

    // Routed Feature Modules
    SecurityModule,

    // App Routing Module (always put after Routed Feature Modules)
    AppRoutingModule,
    NavigationModule,
    SharedModule,
    PerfectScrollbarModule,
    BrDialog,
    StoreModule.forRoot(reducers, {
      metaReducers: [clearState],
      runtimeChecks: { strictStateImmutability: true, strictActionImmutability: true }
    }),
    environment.includeNgrxDevStore,
    StoreRouterConnectingModule.forRoot({ serializer: DefaultRouterStateSerializer }),
    EffectsModule.forRoot([]),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    ApiService,
    CodelistApiService,
    UserPreferenceService,
    PortalApiService,
    AwsApiService,
    ConfigService,
    ErrorLoggerService,
    VersionCheckService,
    LotViewerService,
    DataReviewService,
    DatePipe,
    HttpErrorService,
    {
      provide: APP_INITIALIZER,
      useFactory: (config: ConfigService) => () => config.load(),
      deps: [ConfigService],
      multi: true
    },
    {
      provide: OKTA_CONFIG,
      useFactory: (config: ConfigService) => config.getConfig('sso'),
      deps: [ConfigService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LocaleInterceptor,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: UIErrorHandler
    },
    IconService,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: RouterStateSerializer,
      useClass: CustomSerializer // providing the RouterStateSerializer to be our CustomSerializer
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    provideBootstrapEffects([AppEffects,
      NavBarEffects,
      AccountEffects,
      NotificationEffects,
      Actions,
      EffectSources,
      NodeInfoEffects,
      LabConfigDuplicateLotsEffects,
      LabSetupDefaultEffects])
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
