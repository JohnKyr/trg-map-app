import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoogleMapsModule } from '@angular/google-maps';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './containers/home/home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    GoogleMapsModule,
    MatSidenavModule,
    MatIconModule,
  ],
})
export class HomeModule {}
