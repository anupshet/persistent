// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil, filter, take } from 'rxjs/operators';

import { NavigationService } from '../../../../shared/navigation/navigation.service';
import { LabSetupStates } from '../../state';
import { ratingRange } from '../../../../core/config/constants/general.const';
import { AccountSettings } from '../../../../contracts/models/lab-setup/account-settings.model';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import * as sharedStateSelector from '../../../../shared/state/selectors';
import { LabLocation } from '../../../../contracts/models/lab-setup';
import { ConnectivityTier } from '../../../../contracts/enums/lab-location.enum';

@Component({
  selector: 'unext-lab-setup-feedback',
  templateUrl: './lab-setup-feedback.component.html',
  styleUrls: ['./lab-setup-feedback.component.scss']
})

export class LabSetupFeedbackComponent implements OnInit, OnDestroy {

  @Output() goToDashboard = new EventEmitter();
  @Output() updateEaseFeedback = new EventEmitter<AccountSettings>();
  @Input() translationLabelDictionary: {};

  public isSubmitValid = false;
  public isSubmitted = false;
  public comment: string;
  public rating = 0;
  public isCommentVisible = false;
  public readonly range = ratingRange;
  public addACommentPlaceholder: string;
  public labSetupFeedbackHeaderNode = 7;
  public _rating;
  public locationSettings: AccountSettings;
  public displayRating = false;
  private destroy$ = new Subject<boolean>();
  public hasConnectivityLicense: boolean = false;
  private labLocation: LabLocation;

  public getCurrentLabLocation$ = this.store.pipe(select(sharedStateSelector.getCurrentLabLocation));

  constructor(private store: Store<LabSetupStates>,
    private navigationService: NavigationService,
    private errorLoggerService: ErrorLoggerService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    try {
      this.populateLocalLabels();
      this.getCurrentLabLocation$
        .pipe(filter(getLocationState => !!getLocationState), takeUntil(this.destroy$))
        .subscribe((labLocation) => {
          this.labLocation = labLocation;
          this.getRatingFromStore(this.labLocation);
          if (this._rating === 0) {
            this.displayRating = true;
          }
          if (this.labLocation.connectivityTier === ConnectivityTier.UNConnect ||
            this.labLocation.connectivityTier === ConnectivityTier.UNUpload) {
            this.hasConnectivityLicense = true;
          }
        });
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.LabConfigurationControlComponent + blankSpace + Operations.OnInit)));
    }
  }

  private updateFeedback(value: object): void {
    try {
      if (!!this.labLocation?.locationSettings) {
        this.locationSettings = { ...new AccountSettings(), ...this.labLocation.locationSettings, ...value };
      }
      this.updateEaseFeedback.emit(this.locationSettings);
      this.comment = '';
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.LabConfigurationControlComponent + blankSpace + Operations.UpdateFeedback)));
    }
  }

  private getRatingFromStore(labLocation) {
    if (!!labLocation?.locationSettings) {
      this._rating = this.labLocation?.locationSettings?.labSetupRating;
    }
  }

  public home(event: Event): void {
    event.stopPropagation();
    this.goToDashboard.emit();
  }

  public displayComment(): void {
    this.isCommentVisible = !this.isCommentVisible;
  }

  public mark(index: number): void {
    this.rating = index + 1;
    this.updateFeedback({ labSetupRating: this.rating });
    this.getRatingFromStore(this.labLocation);
  }

  private populateLocalLabels(): void {
    this.addACommentPlaceholder = this.getTranslation('LABSETUPFEEDBACK.COMMENT');
  }

  public addComment(): void {
    this.isSubmitValid = true;
    this.isSubmitted = true;
    if (this.comment) {
      this.updateFeedback({ labSetupComments: this.comment });
      this.comment = '';
    }
  }

  public onCommentChange(): void {
    if (this.comment) {
      this.isSubmitValid = true;
      this.isSubmitted = false;
    } else {
      this.isSubmitValid = false;
      this.isSubmitted = true;
    }
  }

  private routeToConnectivityMapping(): void {
    this.navigationService.routeToMapping(this.labLocation.parentNodeId);
  }

  getTranslation(codeToTranslate: string): string {
    let translatedContent:string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
