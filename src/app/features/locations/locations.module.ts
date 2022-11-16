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
import { LocationsDialogFormComponent } from './components/locations-dialog-form/locations-dialog-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LocationListComponent } from './components/location-list/location-list.component';

@NgModule({
  declarations: [
    LocationsComponent,
    LocationsDialogFormComponent,
    LocationListComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    LocationsRoutingModule,
  ],
})
export class LocationsModule {}
