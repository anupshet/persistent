// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Language, Languages } from './languages-list';
import { FeatureFlagsService } from '../../services/feature-flags.service';
@Component({
  selector: 'unext-language-dropdown',
  templateUrl: './language-dropdown.component.html',
  styleUrls: ['./language-dropdown.component.scss']
})
export class LanguageDropdownComponent {
  @Input() label: string;
  @Input() tooltip: string;
  @Input() control: FormControl;
  @Input() errors: string[];
  languages: Array<Language > = Languages;
  languagesNames: string[];
  isFeatureFlagActive: boolean = false;

  constructor(private featureFlagsService: FeatureFlagsService) {
  }

  ngOnInit(){
    this.initializeListeners();
  }

  initializeListeners() {
    if (this.featureFlagsService.hasClientInitialized()) {
      this.isFeatureFlagActive = this.featureFlagsService.getFeatureFlag('localization-toggle', false);
      this.featureFlagHandler();
    } else {
      this.featureFlagsService.getClient().on('initialized', () => {
        const valueFlag = this.featureFlagsService.getFeatureFlag('localization-toggle');
        this.isFeatureFlagActive = valueFlag;
        this.featureFlagHandler();
      });
    }
    this.featureFlagsService.getClient().on('change:localization-toggle', (value: boolean, previous: boolean) => {
      this.isFeatureFlagActive = value;
      this.featureFlagHandler();
    });
  }

  featureFlagHandler() {
    if (!this.isFeatureFlagActive) {
      this.control.setValue('en');
    }
  }

  showErrorByType(validationType: string) {
    return this.errors.find(error => error === validationType);
  }
}
