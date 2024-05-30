// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { CommonModule } from "@angular/common";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
      CommonModule,
      TranslateModule
  ],
  exports: [
      CommonModule,
      TranslateModule
  ]
})
export class SharedTranslateModule {

  static forRoot(): ModuleWithProviders<unknown> {
      return {
          ngModule: SharedTranslateModule
      };
  }
}
