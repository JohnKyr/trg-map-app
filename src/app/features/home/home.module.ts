import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { GoogleMapsModule } from '@angular/google-maps';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './containers/home/home.component';
import { SidenavInfoComponent } from './components/sidenav-info/sidenav-info.component';

@NgModule({
  declarations: [HomeComponent, SidenavInfoComponent],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatIconModule,
    GoogleMapsModule,
    HomeRoutingModule,
  ],
})
export class HomeModule {}
