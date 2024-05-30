/* import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { of } from 'rxjs';
import { MaterialModule } from 'br-component-library';

import { ActivatedRouteStub } from '../../../../../testing/activated-route-stub';
import { MappingService } from '../mapping.service';
import { MapHeaderComponent } from './map-header.component';

const activatedRouteStub = new ActivatedRouteStub(null, { entityId: '1' });

const mockService = {
  currentEntityType: of(''),
  currentEntityId: of(''),
  triggerDataRefresh: of(''),
  currentSelectedChipIndex: of(''),
  currentUnmappedInstChips: of(''),
  currentUnmappedProdChips: of(''),
  currentUnmappedTestChips: of(''),
  currentUnlinkedCodes: of(''),
  clearUnlinkedCodes() { }
};

describe('MapHeaderComponent', () => {
  let component: MapHeaderComponent;
  let fixture: ComponentFixture<MapHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        HttpClientModule,
        PerfectScrollbarModule],
      declarations: [MapHeaderComponent],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => { } } },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: MappingService, useValue: mockService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct text based on number of chips', () => {
    const debug = fixture.debugElement.query(By.css('.top-panel'));
    const el = debug.nativeElement;
    const content = el.textContent;
    if (component.unmappedChips.length > 0) {
      expect(content.toEqual('Select a code to map'));
    } else {
      expect(content).toEqual('No more unmapped codes');
    }
  });
});

 */
