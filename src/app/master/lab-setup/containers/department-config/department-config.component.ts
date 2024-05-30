// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { merge, Observable, of, Subject } from 'rxjs';
import { filter, takeUntil, take } from 'rxjs/operators';

import { Department, LabLocation } from '../../../../contracts/models/lab-setup';
import { Error } from '../../../../contracts/models/shared/error.model';
import { User } from '../../../../contracts/models/user-management/user.model';
import * as fromSecurity from '../../../../security/state/selectors';
import { PortalApiService } from '../../../../shared/api/portalApi.service';
import * as fromNavigationSelector from '../../../../shared/navigation/state/selectors';
import * as fromRoot from '../../../../state/app.state';
import * as fromSubRoot from '../../state';
import * as actions from '../../state/actions';
import * as fromSelector from '../../state/selectors';
import { ErrorLoggerService } from '../../../../shared/services/errorLogger/error-logger.service';
import { ErrorType } from '../../../../contracts/enums/error-type.enum';
import { componentInfo, blankSpace, Operations } from '../../../../core/config/constants/error-logging.const';
import { LabDepartmentValues } from '../../../../contracts/models/lab-setup/department.model';
import { ArchiveState } from '../../../../contracts/enums/lab-setup/archive-state.enum';
import { EntityType } from '../../../../contracts/enums/entity-type.enum';
import { SpcRulesService } from '../../components/spc-rules/spc-rules.service';
import { LevelLoadRequest } from '../../../../contracts/models/portal-api/labsetup-data.model';
import { hasAnalyteLevelNode } from '../../shared/lab-setup-helper';
import { QueryParameter } from '../../../../shared/models/query-parameter';
import { includeArchivedItems } from '../../../../core/config/constants/general.const';

@Component({
  selector: 'unext-department-config-component',
  templateUrl: './department-config.component.html',
  styleUrls: ['./department-config.component.scss']
})
export class DepartmentConfigComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  public errorMessage: string = null;
  labConfigDepartmentErrorMessage$: Observable<Error>;
  public contacts: User[];
  public labSetupDepartmentHeaderTitle = `${this.getTranslation('DEPARTMENTCONFIG.WHATDEPARTMENTS')} {title}?`;
  public showArchivedFilterToggle = false;
  selectedDepartment: Array<Department> = [];
  @Input() showSettings: boolean;
  @Input() departments: Department[] = new Array<Department>();
  @Input() location: LabLocation;

  public getDirectoryState$ = this.store.pipe(select(fromSecurity.getDirectory));
  isToggledToNotArchived: boolean;
  constructor(
    private store: Store<fromRoot.State>,
    private subStore: Store<fromSubRoot.LabSetupStates>,
    private portalApiService: PortalApiService,
    private errorLoggerService: ErrorLoggerService,
    private spcRulesService: SpcRulesService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    try {
      this.loadContacts();
      this.loadHeaderTitleData();
      if (this.showSettings) {
        this.spcRulesService.getSettings(EntityType.LabDepartment, this.departments[0].id, this.departments[0].parentNodeId)
          .pipe(take(1)).subscribe(settings => {
            if (settings && settings.archiveState !== ArchiveState.NotArchived) {
              this.isToggledToNotArchived = false;
            }
          });
      }
      this.getShowArchivedToggleState();
      this.subStore.pipe(select(fromSelector.getLabConfigDepartmentError),
        filter(errorMessages => !!errorMessages),
        takeUntil(this.destroy$)).subscribe(data => { this.setErrorMessage(data); });
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.DepartmentConfigComponent + blankSpace + Operations.OnInit)));
    }
  }

  saveLabConfigurationDepartment(labDepartments: LabDepartmentValues) {
    try {
      const labDepartmentInfo = labDepartments.labConfigFormValues;
      const archivedSettings = labDepartments.archivedSettings;
      const typeOfOperation = labDepartments.typeOfOperation;
      const departmentConfigEmitter: LabDepartmentValues = {
        labConfigFormValues: labDepartmentInfo,
        archivedSettings: archivedSettings, typeOfOperation: typeOfOperation
      };
      if (labDepartmentInfo.length > 0) {
        this.store.dispatch(
          actions.LabConfigDepartmentActions.saveDepartments({ labDepartments: departmentConfigEmitter })
        );
      } else {
        this.store.dispatch(actions.LabConfigSettingsActions.setSettings({ settings: archivedSettings }));
      }
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.DepartmentConfigComponent + blankSpace + Operations.SaveLabConfigurationDepartment)));
    }
  }

  onDeleteDepartment(departmentId: Department) {
    try {
      this.store.dispatch(
        actions.LabConfigDepartmentActions.deleteDepartment({ department: departmentId })
      );
    } catch (err) {
      this.errorLoggerService.logErrorToBackend(
        this.errorLoggerService.populateErrorObject(ErrorType.Script, err.stack, err.message,
          (componentInfo.DepartmentConfigComponent + blankSpace + Operations.OnDelete)));
    }
  }

  loadContacts() {
    this.store.pipe(select(fromSecurity.getDirectory),
      filter(directory => !!directory), takeUntil(this.destroy$))
      .subscribe(() => {
        this.portalApiService.getUsers(EntityType.Account, this.location?.id)
          .pipe(filter(users => !!users.children), takeUntil(this.destroy$))
          .subscribe(users => {
            this.contacts = users.children;
          });
      });
  }

  loadHeaderTitleData() {
    merge(
      this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedNode)),
      this.store.pipe(select(fromNavigationSelector.getCurrentlySelectedLeaf)),
      of(this.location)
    ).pipe(filter(currentNodeItem => !!currentNodeItem),
      takeUntil(this.destroy$)).subscribe((currentNodeItem: any) => {
        this.labSetupDepartmentHeaderTitle = this.labSetupDepartmentHeaderTitle.replace('{title}', currentNodeItem.displayName);
      });
  }

  getShowArchivedToggleState(): void {
    if (this.departments && this.departments.length === 1) {
      this.store.pipe(select(fromNavigationSelector.getIsArchiveItemsToggleOn), take(1))
        .subscribe((isArchiveItemsToggleOn: boolean) => {
          const queryParameter = new QueryParameter(includeArchivedItems, (isArchiveItemsToggleOn).toString());
          this.portalApiService.getLabSetupNode(
            this.departments[0].nodeType, this.departments[0].id, LevelLoadRequest.LoadAllDescendants, EntityType.None, [queryParameter])
            .pipe(take(1)).subscribe((department: Department) => {
              // this is to add the departmentManager Object to existing object of department
              const selectedDepartment = this.departments.find(singleEle => singleEle.id === department.id);
              if (selectedDepartment) {
                this.selectedDepartment[0] = department;
              }
              this.showArchivedFilterToggle = hasAnalyteLevelNode(department);
            });
        });
    } else {
      this.showArchivedFilterToggle = false;
    }
  }

  setErrorMessage(data: Error) {
    data = null;
    this.errorMessage = data ? data.error : null;
  }

  private getTranslation(codeToTranslate: string): string {
    let translatedContent: string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
    });
    return translatedContent;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
