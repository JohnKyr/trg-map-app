import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Observable, Subject, takeUntil } from 'rxjs';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';

import { TrgLocation } from 'src/app/features/locations/models/location.model';
import { LocationsService } from 'src/app/features/locations/services/locations.service';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();
  locations$!: Observable<TrgLocation[]>;
  showInfoColumn = false;
  center!: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    mapTypeId: 'hybrid',
    // maxZoom: this.maxZoom,
    // minZoom: this.minZoom,
  };
  markers = [] as any;
  infoContent = '';

  @ViewChild('myGoogleMap', { static: false }) map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) info!: MapInfoWindow;
  @ViewChild('drawer') drawer!: MatDrawer;

  constructor(private locationService: LocationsService) {}

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
    this.locationService.locations$
      .pipe(takeUntil(this.destroy$))
      .subscribe((locations) => {
        this.markers = locations.map((location: any) => {
          return {
            position: { lat: location.latitude, lng: location.longitude },
            name: location.name,
          };
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  dropMarker(event: any) {
    this.markers.push({
      position: {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      },
      label: {
        color: 'blue',
        text: 'Marker label ' + (this.markers.length + 1),
      },
      title: 'Marker title ' + (this.markers.length + 1),
      info: 'Marker info ' + (this.markers.length + 1),
      options: {
        animation: google.maps.Animation.DROP,
      },
    });
  }

  openInfo(marker: MapMarker, content: string) {
    this.infoContent = content;
    this.info.open(marker);
    if (!this.drawer.opened) {
      this.drawer.toggle();
    }
    this.showInfoColumn = true;
  }

  eventHandler(event: any, name: string) {
    console.log(event, name);

    // Add marker on double click event
    if (name === 'mapDblclick') {
      this.dropMarker(event);
    }
  }

  onCloseMapInfoWindow() {
    this.drawer.toggle();
  }

  onCloseDrawer() {
    this.drawer.toggle();
    this.info.close();
  }
}
