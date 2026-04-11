import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly router   = inject(Router);

  success(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      panelClass: ['app-snackbar-success'],
    });
  }

  successWithLink(message: string, linkLabel: string, route: string[]): void {
  const ref = this.snackBar.open(message, linkLabel, {
    panelClass: ['app-snackbar-success'],
  });
  ref.onAction().subscribe(() => this.router.navigate(route));
}

  error(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      panelClass: ['app-snackbar-error'],
    });
  }
}