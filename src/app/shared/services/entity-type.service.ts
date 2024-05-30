// © 2023 Bio-Rad Laboratories, Inc. All Rights Reserved.
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

import { ENTITY_TYPE_TITLE } from '../../contracts/enums/connectivity-map/entity-type.enum';
import { EntityType } from '../../contracts/enums/entity-type.enum';
import { unRouting } from '../../core/config/constants/un-routing-methods.const';
import { LabLocation, TreePill } from '../../contracts/models/lab-setup';
import * as fromRoot from '../../state/app.state';
import { NavBarActions } from '../navigation/state/actions';
import { UnityNextTier } from '../../contracts/enums/lab-location.enum';
import { BrPermissionsService } from '../../security/services/permissions.service';
import { Permissions } from '../../security/model/permissions.model';

@Injectable()
export class EntityTypeService {

  constructor(
    private store: Store<fromRoot.State>,
    private brPermissionsService: BrPermissionsService,
    private translate: TranslateService) { }

  private getNodeTypeMetaData(nodeType: EntityType): any {
    switch (nodeType) {
      case EntityType.Lab:
        return {
          urlName: 'locations',
          src: 'assets/images/bds/brIconsCircle/icn_location_circle.svg',
          nodeColor: '#38497A',
          iconId: '#treePillLocation'
        };
      case EntityType.LabLocation:
        return {
          title: ENTITY_TYPE_TITLE.LOCATION,
          urlName: 'locations',
          src: 'assets/images/bds/brIconsCircle/icn_location_circle.svg',
          nodeColor: '#38497A',
          iconId: '#treePillLocation'
        };
      case EntityType.LabDepartment:
        return {
          title: ENTITY_TYPE_TITLE.DEPARTMENT,
          urlName: 'departments',
          src: 'assets/images/bds/new_set/large/departments.svg',
          nodeColor: '#456191',
          iconId: '#treePillDepartment'
        };
      case EntityType.LabInstrument:
        return {
          title: ENTITY_TYPE_TITLE.INSTRUMENT,
          urlName: 'instruments',
          src: 'assets/images/bds/new_set/large/instruments.svg',
          nodeColor: '#457790',
          iconId: '#treePillInstrument'
        };
      case EntityType.LabProduct:
        return {
          title: ENTITY_TYPE_TITLE.PRODUCT,
          urlName: 'products',
          src: 'assets/images/bds/new_set/large/qc_products.svg',
          nodeColor: '#448F8B',
          iconId: '#treePillProduct'
        };
      case EntityType.LabTest:
        return {
          title: ENTITY_TYPE_TITLE.TEST,
          urlName: 'tests',
          src: 'assets/images/bds/new_set/large/tests.svg',
          nodeColor: '',
          iconId: '#treePillTest'
        };
      default:
        return {
          title: '',
          urlName: '',
          src: '',
          nodeColor: '',
          iconId: ''
        };
    }
  }

  getLoadingAnimationString(): string {
    return 'assets/images/loading.gif';
  }

  getNodeTypeString(nodeType: EntityType): string {
    return nodeType ? this.getNodeTypeMetaData(nodeType).title : '';
  }

  getUrlString(nodeType: EntityType): string {
    return nodeType ? this.getNodeTypeMetaData(nodeType).urlName : '';
  }

  getNodeTypeSrcString(nodeType: EntityType): string {
    return nodeType ? this.getNodeTypeMetaData(nodeType).src : '';
  }

  getNodeColor(nodeType: EntityType): string {
    return nodeType ? this.getNodeTypeMetaData(nodeType).nodeColor : '';
  }

  getIconId(nodeType: EntityType): string {
    return nodeType ? this.getNodeTypeMetaData(nodeType).iconId : '';
  }

  getNodeTypeUrl(nodeType: EntityType): string {
    return nodeType ? this.getNodeTypeMetaData(nodeType).urlName : '';
  }

  getNodeChildType(nodeType: EntityType): EntityType {
    switch (nodeType) {
      case EntityType.Lab:
        return EntityType.LabLocation;
      case EntityType.LabLocation:
        return EntityType.LabDepartment;
      case EntityType.LabDepartment:
        return EntityType.LabInstrument;
      case EntityType.LabInstrument:
        return EntityType.LabProduct;
      case EntityType.LabProduct:
        return EntityType.LabTest;
      case EntityType.LabTest:
        return EntityType.LabTest;
      default:
        return EntityType.LabTest;
    }
  }

  // New one until we have lab location component set since the one above is used in many diff. places
  getNodeChildTypeForLabSetupNavigation(nodeType: EntityType): EntityType {
    switch (nodeType) {
      case EntityType.Account:
        return EntityType.None;
      // considering department as child of both the lab location and lab setup default
      case EntityType.LabLocation || EntityType.Lab:
        return EntityType.LabDepartment;
      case EntityType.LabDepartment:
        return EntityType.LabInstrument;
      case EntityType.LabInstrument:
        return EntityType.LabProduct;
      case EntityType.LabProduct:
        return EntityType.LabTest;
      case EntityType.LabTest:
        return EntityType.LabTest;
      default:
        return EntityType.LabTest;
    }
  }

  getNodeParentType(nodeType: EntityType): EntityType {
    switch (nodeType) {
      case EntityType.Lab:
        return EntityType.Lab;
      case EntityType.LabLocation:
        return EntityType.Lab;
      case EntityType.LabDepartment:
        return EntityType.LabLocation;
      case EntityType.LabInstrument:
        return EntityType.LabDepartment;
      case EntityType.LabProduct:
        return EntityType.LabInstrument;
      case EntityType.LabTest:
        return EntityType.LabProduct;
      default:
        return EntityType.Lab;
    }
  }

  public getLabSetupUrl(selectedNode: TreePill, hasDescendants: boolean, location: LabLocation, instGroupedByDept: boolean): string {
    const labSetUpBaseUrl = unRouting.labSetup.lab;

    // set Show Settings to true if dept., control and instrument has children
    this.store.dispatch(NavBarActions.setShowSettings({ showSettings: hasDescendants ? true : false }));

    if ((selectedNode.nodeType === EntityType.LabLocation ||
      // if department addition has been skipped during first lab setup
      selectedNode.nodeType === EntityType.Lab) && !instGroupedByDept) {
      // if this obj is null, redirect to add departments to location node
      if (selectedNode && selectedNode.children?.length > 0) {
        return `${unRouting.actionableDashboard}`;
      } else {
        return `/${labSetUpBaseUrl}/${unRouting.labSetup.instruments}/${selectedNode.id}/${unRouting.labSetup.settings}`;
      }
    } else {
      switch (selectedNode.nodeType) {
        case EntityType.Lab:
          return hasDescendants ? `${unRouting.actionableDashboard}` : `/${labSetUpBaseUrl}/${unRouting.labSetup.labDefault}`;
        case EntityType.LabLocation:
          // lotViewerLicense will be set to 1 from locations form for QC lotviewer
          if (location && location.unityNextTier === UnityNextTier.None) {
            return `${unRouting.actionableDashboard}`;
          } else {
            /* if islabsettingcompleted is false, then redirect to labDefault page to update locationSettings
            if true, check if the selectedNode has children : if true,
            redirect to actionableDashboard else redirect to addDepartment page */
            return (location && location.islabsettingcompleted) ?
              hasDescendants ? `${unRouting.actionableDashboard}` :
                `/${labSetUpBaseUrl}/${unRouting.labSetup.departments}/${selectedNode.id}/${unRouting.labSetup.settings}` :
              (this.brPermissionsService.hasAccess([Permissions.DepartmentAdd]) ? `/${labSetUpBaseUrl}/${unRouting.labSetup.labDefault}` : `${unRouting.actionableDashboard}`);
          }
        case EntityType.LabDepartment:
          return `/${labSetUpBaseUrl}/${unRouting.labSetup.instruments}/${selectedNode.id}/${unRouting.labSetup.settings}`;
        case EntityType.LabInstrument:
          return hasDescendants ? `/${labSetUpBaseUrl}/${unRouting.labSetup.instruments}/${selectedNode.id}/${unRouting.labSetup.settings}`
            : `/${labSetUpBaseUrl}/${unRouting.labSetup.controls}/${selectedNode.id}/${unRouting.labSetup.settings}`;
        case EntityType.LabProduct:
          return hasDescendants ? `/${labSetUpBaseUrl}/${unRouting.labSetup.controls}/${selectedNode.id}/${unRouting.labSetup.settings}`
            : `/${labSetUpBaseUrl}/${unRouting.labSetup.analytes}/${selectedNode.id}/${unRouting.labSetup.settings}`;
      }
    }
  }

  public getLevelName(nodeType: EntityType): string {
    switch (nodeType) {
      case EntityType.LabDepartment: return this.getTranslations('TRANSLATION.DEPARTMENT');
      case EntityType.LabInstrument: return this.getTranslations('TRANSLATION.INSTRUMENT1');
      case EntityType.LabProduct: return this.getTranslations('TRANSLATION.CONTROLS');
      case EntityType.LabTest: return this.getTranslations('TRANSLATION.ANALYTES');
      default:
        return '';
    }
  }
  
  getTranslations(codeToTranslate: string): string {
    let translatedContent:string;
    this.translate.get(codeToTranslate).pipe(take(1)).subscribe((translatedString: string) => {
      translatedContent = translatedString;
      });
    return translatedContent;
  }
}

