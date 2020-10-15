import { ErrorHandler, Injectable } from "@angular/core";
import { AlertService } from '../_alert';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(protected alertService: AlertService) { }

  handleError(error: Error) {
    const options = {
      autoClose: true,
      keepAfterRouteChange: false
    };

    this.alertService.error('Undefined client error', options);

  }
}
