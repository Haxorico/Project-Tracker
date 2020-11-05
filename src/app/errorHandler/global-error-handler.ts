import { ErrorHandler, Injectable } from "@angular/core";
import { AlertService } from '../_alert';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(protected alertService: AlertService) { }

  handleError(err) {
    const options = {
      autoClose: true,
      keepAfterRouteChange: false
    };
    if (err.status == 401) {
      this.alertService.error(err.statusText, options);
    }
    
    //#TODO 

    else {
      console.log("global error handler =>");
      console.log(err);
      this.alertService.error('Undefined client error', options);
    }
  }
}
