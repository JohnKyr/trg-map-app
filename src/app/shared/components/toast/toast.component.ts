import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  NgZone,
} from '@angular/core';
import {
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';

export interface ToastData {
  message: string;
}

@Component({
  selector: 'taskme-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  message: string;

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) data: ToastData,
    private snackBarRef: MatSnackBarRef<ToastComponent>,
    private zone: NgZone
  ) {
    this.message = data.message;
  }

  dismiss(): void {
    this.zone.run(() => this.snackBarRef.dismiss());
  }
}
