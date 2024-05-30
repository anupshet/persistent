import { ComponentFixture, TestBed, async   } from '@angular/core/testing';

import { MaterialModule } from 'br-component-library';

import { NotificationBarComponent } from './notification-bar.component';

describe('NotificationBarComponent', () => {
  let component: NotificationBarComponent;
  let fixture: ComponentFixture<NotificationBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule],
      declarations: [NotificationBarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
