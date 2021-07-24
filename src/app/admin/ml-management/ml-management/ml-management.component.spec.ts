import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MlManagementComponent } from './ml-management.component';

describe('MlManagementComponent', () => {
  let component: MlManagementComponent;
  let fixture: ComponentFixture<MlManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MlManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MlManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
