import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpEventType } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private toasterService: ToastrService) { }
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(evt => {
        if (
          evt != null &&
          evt.type == HttpEventType.Response &&
          evt.status == 200
        ) {
          if (evt.body != null) {
            var value = evt.body;
            if (value.status != null) {
              if (value.status === "ERROR") {
                if (value.message != null) {
                  this.toasterService.error(value.message);
                  window.close();
                } else if (
                  value.status !== "SUCCESS" &&
                  value.message != null &&
                  value.message.length > 0
                ) {
                  let severity: string = "warn";
                  if (value.status == "INFO") {
                    severity = "info";
                  }
                  this.toasterService.error(value.message);
                }
              }
            }
          }
        }
      }),
      catchError((error: any) => {
        let errMsg = "";
        // Client Side Error
        if (error.error instanceof ErrorEvent) {
          errMsg = `Error: ${error.error.message}`;
        } else {
          // Server Side Error
          if (error.error != null && error.error.apierror != null)
            errMsg = `Error Code: ${error.status},  Message: ${error.error.apierror.message}`;
          else if (error.error != null)
            errMsg = `Error Code: ${error.status},  Message: ${error.error.message}`;
          else
            errMsg = `Error Code: ${error.status},  Message: ${error.message}`;
        }
        this.showError(errMsg);
        if (error.url.match(sessionStorage.getItem("updateSessionUrl")) || error.url.match(sessionStorage.getItem("awakeServerUrl"))) {
          this.onParentApplicationConnectionError();
        }
        return throwError(errMsg);
      })
    );
  }

  showError(errMsg: string) {
    if (errMsg.match("clearCache") != null && errMsg.match("clearCache").length > 0) {
      return;
    }
    if (errMsg.match("sparkLogin.jsp")) {
      window.parent.alert("Session Expired. Closing the window");
      window.parent.close();
    }
  }

  onParentApplicationConnectionError() {
    window.parent.alert("Lost Connection with PLM, closing the window.");
    window.parent.close();
  }
}
