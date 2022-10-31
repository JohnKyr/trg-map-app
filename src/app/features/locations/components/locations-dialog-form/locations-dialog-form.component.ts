import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocationFormData, TrgLocation } from '../../models/location.model';

@Component({
  selector: 'app-locations-dialog-form',
  templateUrl: './locations-dialog-form.component.html',
  styleUrls: ['./locations-dialog-form.component.scss'],
})
export class LocationsDialogFormComponent implements OnInit {
  form!: FormGroup;
  location!: TrgLocation;
  action!: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<LocationsDialogFormComponent>,
    @Inject(MAT_DIALOG_DATA) data: LocationFormData
  ) {
    this.location = data.location;
    this.action = data.action;
  }

  ngOnInit(): void {
    console.log('ACTION => ', this.action);
    this.form = this.fb.group({
      latitude: [this.location?.latitude || '', [Validators.required]],
      longitude: [this.location?.longitude || '', [Validators.required]],
      name: [this.location?.name || '', [Validators.required]],
    });
  }

  save() {
    if (this.form.valid) {
      const data = !!this.action
        ? { id: this.location.id, ...this.form.value }
        : this.form.value;
      console.log('DATA => ', data);
      this.dialogRef.close(data);
    }
  }

  close() {
    this.dialogRef.close();
  }

  get latitudeCtrl(): FormControl {
    return this.form.get('latitude') as FormControl;
  }
  get longitudeCtrl(): FormControl {
    return this.form.get('longitude') as FormControl;
  }
  get nameCtrl(): FormControl {
    return this.form.get('name') as FormControl;
  }
}
