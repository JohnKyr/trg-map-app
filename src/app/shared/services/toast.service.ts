import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastComponent } from '../components/toast/toast.component';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string): void {
    this.snackBar.openFromComponent(ToastComponent, {
      data: { message },
      panelClass: 'mat-snackbar-container-success',
      duration: 2000,
    });
  }

  showWarning(message: string): void {
    this.snackBar.openFromComponent(ToastComponent, {
      data: { message },
      panelClass: 'mat-snackbar-container-warning',
      duration: 4000,
    });
  }

  showError(message: string): void {
    this.snackBar.openFromComponent(ToastComponent, {
      data: { message },
      panelClass: 'mat-snackbar-container-error',
    });
  }
}
