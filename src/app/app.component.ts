import { Component, OnInit } from '@angular/core';
import { LocationsService } from './features/locations/services/locations.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'trg-map-app';

  ngOnInit(): void {}
}
