import {
    HttpHandler,
    HttpRequest,
    HttpEvent,
    HttpErrorResponse,
    HttpInterceptor
  } from "@angular/common/http";
  import { Observable, throwError } from "rxjs";
  import { catchError, finalize } from "rxjs/operators";
  import { Injectable } from "@angular/core";
  import { AlertService } from '../_alert';
  
  @Injectable()
  export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(protected alertService: AlertService) {}
  
    intercept(
      request: HttpRequest<any>,
      next: HttpHandler
    ): Observable<HttpEvent<any>> {
      const options = {
        autoClose: true,
      keepAfterRouteChange: false
    };
      //this.loadingDialogService.openDialog();
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          this.alertService.error('Error from error interceptor',options);
          /* console.error("Error from error interceptor", error); */
          //this.errorDialogService.openDialog(error.message ?? JSON.stringify(error), error.status);
          return throwError(error);
        }),
        finalize(() => {
          //this.loadingDialogService.hideDialog();
        })
      ) as Observable<HttpEvent<any>>;
    }
  }
  