import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationsDialogFormComponent } from './locations-dialog-form.component';

describe('LocationsDialogFormComponent', () => {
  let component: LocationsDialogFormComponent;
  let fixture: ComponentFixture<LocationsDialogFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationsDialogFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationsDialogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
