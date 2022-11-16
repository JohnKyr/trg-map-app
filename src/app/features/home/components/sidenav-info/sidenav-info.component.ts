import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-sidenav-info',
  templateUrl: './sidenav-info.component.html',
  styleUrls: ['./sidenav-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavInfoComponent {
  @Input() infoContent!: string;
  @Output() closeSidenav = new EventEmitter<void>();

  constructor() {}

  handleCloseSidenav() {
    this.closeSidenav.emit();
  }
}
