// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as ngrxStore from '@ngrx/store';

import * as fromRoot from '../../../state/app.state';
import * as actions from '../../../state/actions';
import * as navigationStateSelector from '../../../shared/navigation/state/selectors';
import { Icon } from '../../../contracts/models/shared/icon.model';
import { icons } from '../../../core/config/constants/icon.const';
import { LocalizationService } from '../../navigation/services/localizaton.service';
import { LocalePreferences } from '../../models/locale-preferences.model';
import { Language, LanguagesMapping, Numeric, Time, numericFormat, timeFormat } from './language-list-mapping';

@Component({
  selector: 'unext-language-dialog',
  templateUrl: './language-dialog.component.html',
  styleUrls: ['./language-dialog.component.scss'],
})

export class LanguageDialogComponent implements OnInit, OnDestroy {
  icons = icons;
  iconsUsed: Array<Icon> = [
    icons.close[48]
  ];
  public languageData: Language[] = LanguagesMapping;
  public numericFormat: Numeric[] = numericFormat;
  public timeFormat: Time[] = timeFormat;
  close = false;
  languageMappedValues: Language;
  selectedLanguage = '';
  selectedDate = '';
  selectedTime = '';
  form: FormGroup = new FormGroup({});
  selectedNumber: string;
  updatedLangauge: Array<any>;
  private destroy$ = new Subject<boolean>();
  dateFormats: Array<any>;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<LanguageDialogComponent>,
    private fb: FormBuilder,
    private store: ngrxStore.Store<fromRoot.State>,
    private localizationService: LocalizationService,
  ) {
    this.form = fb.group({
      numeric: [this.selectedNumber, [Validators.required]],
      language: [this.selectedLanguage, [Validators.required]],
      date: [this.selectedDate, [Validators.required]],
      time: [this.selectedTime, [Validators.required]],
    });
  }

  navigationGetLocale$ = this.store.pipe(ngrxStore.select(navigationStateSelector.getLocale));
  ngOnInit(): void {
    let language;
    this.updatedLangauge = [];
    this.navigationGetLocale$.pipe(takeUntil(this.destroy$))
      .subscribe(
        (lang) => {
          language = lang;
          this.updatedLangauge.push(lang);
        }
      );
    let languageValue;
    if (language.locale) {
      languageValue = language.locale;
    } else {
      languageValue = language.lcid;
    }
    const languageName = { 'value': languageValue };
    this.languageChange(languageName);
    this.form.patchValue({ language: languageValue });
  }

  submit() {
    if (!this.close) {
      this.localizationService.transaltionChange = true;
      const payload: LocalePreferences = {
        id: this.localizationService.currentUserId,
        locale: this.languageMappedValues.locale,
        language: this.languageMappedValues.language,
        numberFormat: this.form.get('numeric').value,
        dateFormat: this.form.get('date').value,
        timeFormat: this.form.get('time').value
      };
      this.localizationService.saveLanguage(payload);
      this.localizationService.langSettingOpen = true;
      this.localizationService.setStoreTranslation();
      this.store.dispatch(actions.NavBarActions.setLocale({ locale: payload }));
      this.closeDialog();
    }
  }

  languageChange(language: any): void {
    this.localizationService.getLanguageValue = language.value;
    this.languageMappedValues = this.localizationService.getLanguageMapping(language.value);
    this.dateFormats = [...this.languageMappedValues.dateFormatValues];
    if (this.updatedLangauge[0].locale === this.languageMappedValues.locale) {
      // Load Updated values
      this.loadUpdatedValues();
    } else {
      // Load Default values
      this.form.patchValue({ numeric: this.languageMappedValues.numberFormat });
      this.form.patchValue({ date: this.languageMappedValues.dateFormat });
      this.form.patchValue({ time: this.languageMappedValues.timeFormat });
    }
  }
  loadUpdatedValues() {
    this.form.patchValue({ numeric: this.updatedLangauge[0].numberFormat });
    this.form.patchValue({ date: this.updatedLangauge[0].dateFormat });
    this.form.patchValue({ time: this.updatedLangauge[0].timeFormat });
  }
  public closeDialog() {
    this.close = true;
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.destroy$.unsubscribe();
    this.localizationService.transaltionChange = false;
    this.localizationService.langSettingOpen = false;
  }
}
