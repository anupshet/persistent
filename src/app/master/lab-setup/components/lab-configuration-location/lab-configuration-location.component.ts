// June 4 2020
// AJ thinks this is no longer applicable and can be deleted
// it is referenced only in lab-setup.component.html
// where it is commented out


import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

import { BrMouseOver, BrValidators, ErrorStateMatcherMouseOver } from '../../../../../../dist-lib/br-component-library';

import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { LabLocation } from '../../../../contracts/models/lab-setup/lab-location.model';
import { EntityTypeService } from '../../../../shared/services/entity-type.service';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';

@Component({
  selector: 'unext-lab-configuration-location',
  templateUrl: './lab-configuration-location.component.html',
  styleUrls: ['./lab-configuration-location.component.scss']
})

export class LabConfigurationLocationComponent implements OnInit, OnChanges {

  public countryPlaceholder = 'Country ';
  public statePlaceHolder = 'State/Province/Region';
  public contactPlaceholder = 'Contact Name';

  constructor(private fb: FormBuilder,
    private entityTypeService: EntityTypeService,
    private errorLoggerService: ErrorLoggerService,
    private translate: TranslateService) {
  }

  @Input() translationLabelDictionary: {};
  @Input() labConfigLocationErrorMessage: string;
  @Input() labConfigurationLocation: LabLocation;

  // TODO : Replace with actual datatype after receiving it from backend
  @Input() countries: any[];
  @Input() states: any[];
  @Input() contacts: any = [];

  @Output() saveLabConfigurationLocation = new EventEmitter<LabLocation>();

  labconfigurationLocationForm: FormGroup;
  mouseOverSubmit = new BrMouseOver();
  errorStateMatcherMouseOver: ErrorStateMatcherMouseOver;
  errorStateMatchesForPassword: ErrorStateMatcherMouseOver;
  errorNames = BrValidators.ErrorNames;
  urlId: string;

  ngOnInit() {
    try {
      this.errorStateMatcherMouseOver = new ErrorStateMatcherMouseOver(this.mouseOverSubmit);
      this.setDefaultForm();
      if (this.labConfigurationLocation) {
        this.loadForm(this.labConfigurationLocation);
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.LabConfigurationControlComponent + blankSpace + Operations.OnInit)));
    }
  }

  setDefaultForm() {
    this.labconfigurationLocationForm = this.fb.group({
      labLocationName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
      labLocationContact: ['', [Validators.required]],
      labLocationAddress: this.fb.group({
        streetAddress1: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
        streetAddress2: [''],
        city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
        state: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(3)]],
        zipCode: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
        country: ['', [Validators.required]],
      }),
    });

    // TODO:Remove after being able to retrieve values passed from container component
    this.contacts = [
      { firstName: 'Ram', lastName: 'Bow', email: '', id: '1' },
      { firstName: 'John', lastName: 'Sow', email: '', id: '2' },
      { firstName: 'Kam', lastName: 'Moe', email: '', id: '3' }
    ];
  }

  changeState(e) {
    try {
      this.labconfigurationLocationForm.get('state').setValue(e.target.value, {
        onlySelf: true
      });
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.LabConfigurationControlComponent + blankSpace + Operations.ChangeState)));
    }
  }

  getSource(): string {
    return this.entityTypeService.getNodeTypeSrcString(EntityType.LabLocation);
  }

  getTitle(): string {
    const translatedMessage = this.getTranslation('LABCONFIGURATIONLOCATION.SETUP')
    return translatedMessage;
  }

  // TODO: Specify the correct Datatype of the model
  onSubmit(formvalues: any) {
    try {
      const labConfigFormValues = { ...new LabLocation(), ...formvalues };
      this.saveLabConfigurationLocation.emit(labConfigFormValues);
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.LabConfigurationControlComponent + blankSpace + Operations.OnSubmit)));
    }
  }

  ngOnChanges() {
    try {
      this.populateLocalLabels();
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, null,
          (componentInfo.LabConfigurationControlComponent + blankSpace + Operations.PopulateLocalLabels)));
    }
  }

  private populateLocalLabels(): void {
    if (this.translationLabelDictionary) {
      this.statePlaceHolder = this.translationLabelDictionary['state'];
      this.countryPlaceholder = this.translationLabelDictionary['country'];
      this.contactPlaceholder = this.translationLabelDictionary['contact'];
    }
  }

  // load the form for edit after retrieving from server
  loadForm(labConfigurationLocation: LabLocation) {
    this.labconfigurationLocationForm.setValue({
      labLocationName: labConfigurationLocation.labLocationName,
      labLocationContact: this.contacts,
      labLocationAddress: this.fb.group({
        streetAddress1: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
        streetAddress2: [''],
        city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
        state: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(3)]],
        zipCode: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
        country: ['', [Validators.required]],
      }),
    });
  }

  getTranslation(codeToTranslate: string): string {
    let translatedContent:string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }
}
