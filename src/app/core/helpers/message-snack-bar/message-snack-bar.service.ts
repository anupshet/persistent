import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable()
export class MessageSnackBarService {

  constructor(private snackBar: MatSnackBar) {}

  public showMessageSnackBar(
    message: string,
    duration: number = 5000,
    verticalPosition: MatSnackBarVerticalPosition = 'top',
    horizontalPosition: MatSnackBarHorizontalPosition = 'right',
    panelClass: string = 'message-snack-bar'
    ): void {
    const config: MatSnackBarConfig = {
      verticalPosition: verticalPosition,
      horizontalPosition: horizontalPosition,
      duration: duration,
      panelClass: panelClass
    };

    this.snackBar.open(message, null, config);
  }

  public openFromComponent(
    component: any,
    duration: number = 5000,
    verticalPosition: MatSnackBarVerticalPosition = 'top',
    horizontalPosition: MatSnackBarHorizontalPosition = 'right',
    panelClass: string = 'message-snack-bar',
    data: any
  ): void {
    const config: MatSnackBarConfig = {
      verticalPosition: verticalPosition,
      horizontalPosition: horizontalPosition,
      duration: duration,
      panelClass: panelClass,
      data: data
    };

    this.snackBar.openFromComponent(
      component, config
    );
  }
}
