import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { LocationsRoutingModule } from './locations-routing.module';
import { LocationsComponent } from './containers/locations/locations.component';
import { LocationListComponent } from './components/location-list/location-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LocationsDialogFormComponent } from './components/locations-dialog-form/locations-dialog-form.component';

@NgModule({
  declarations: [
    LocationsComponent,
    LocationListComponent,
    LocationsDialogFormComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    LocationsRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class LocationsModule {}
