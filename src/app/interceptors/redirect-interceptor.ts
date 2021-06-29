import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable()
export class RedirectInterceptor implements HttpInterceptor {

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          //console.log(' HttpResponse event--->>>', event);
        }
      },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err && err.url && err.url.endsWith('/sparkLogin.jsp')) {
              window.location.assign(err.url);
            }
          }
        }

      ));

  }
}
