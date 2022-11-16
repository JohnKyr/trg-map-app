import { LocationsDialogFormComponent } from './../../../locations/components/locations-dialog-form/locations-dialog-form.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LocationFormData } from './../../../locations/models/location.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MatDrawer } from '@angular/material/sidenav';
import { EMPTY, map, Observable, Subject, switchMap, tap } from 'rxjs';
import { TrgLocation } from 'src/app/features/locations/models/location.model';
import { LocationsService } from 'src/app/features/locations/services/locations.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('myGoogleMap', { static: false }) map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) info!: MapInfoWindow;
  @ViewChild('drawer') drawer!: MatDrawer;

  private destroy$ = new Subject();
  locations$!: Observable<TrgLocation[]>;
  markers$!: Observable<any[]>;
  markers = [] as any;
  infoContent = '';

  showInfoColumn = false;
  zoom = 15;
  center!: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: false,
    disableDoubleClickZoom: true,
  };

  constructor(
    private locationService: LocationsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });

    this.markers$ = this.getAll();
  }

  onCreateLocation(event: any) {
    if (event.latLng) {
      console.log('addMarker...');
      console.log(event);
      console.log(event.placeId);
      console.log(event.latLng?.toJSON());

      const { lat, lng } = event.latLng?.toJSON();
      const location: TrgLocation = {
        id: undefined,
        latitude: lat,
        longitude: lng,
        name: '',
      };
      const locationFormData: LocationFormData = { location, action: 'create' };
      this.openDialogForm(locationFormData);
    }
  }

  openInfo(marker: MapMarker, content: string) {
    this.infoContent = content;
    this.info.open(marker);
    if (!this.drawer.opened) {
      this.drawer.toggle();
    }
    this.showInfoColumn = true;
  }

  onCloseMapInfoWindow() {
    this.drawer.toggle();
  }

  onCloseDrawer() {
    this.drawer.toggle();
    this.info.close();
  }

  private openDialogForm(locationData: LocationFormData) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    dialogConfig.data = {
      location: locationData.location,
      action: locationData.action,
    };

    const dialogRef = this.dialog.open(
      LocationsDialogFormComponent,
      dialogConfig
    );

    return dialogRef
      .afterClosed()
      .pipe(
        tap((data) => {
          console.log('FORM DATA => ', data);
        }),
        switchMap((data: TrgLocation) => {
          if (!data) {
            return EMPTY;
          }
          const trgLocationResponse =
            this.locationService.toTrgLocationResponse(data);
          return locationData.action === 'edit'
            ? this.locationService.update(trgLocationResponse)
            : this.locationService.create(trgLocationResponse);
        })
      )
      .subscribe((response) => {
        this.markers$ = this.getAll();
      });
  }

  private getAll() {
    return this.locationService.getAllLocations().pipe(
      tap((locations) => console.log('Markers => ', locations)),
      map((locations: TrgLocation[]) => {
        return locations.map((location: TrgLocation) => {
          return {
            position: { lat: location.latitude, lng: location.longitude },
            name: location.name,
          };
        });
      })
    );
  }
}
