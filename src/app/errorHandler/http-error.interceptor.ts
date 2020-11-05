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
  constructor(protected alertService: AlertService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const options = {
      autoClose: true,
      keepAfterRouteChange: false
    };
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status == 401) {
          return throwError(error);
        }
        //#DEBUG This part is only to ctach un handled errors. Will be delete by production stage
        console.log("http-error-interceptor.ts", error);
        this.alertService.error('Error from error interceptor', options);
        return throwError(error);
      }),
      finalize(() => {
      })
    ) as Observable<HttpEvent<any>>;
  }
}
