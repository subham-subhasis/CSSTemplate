import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from './http-error-interceptor';
import { HttpTokenInterceptorService } from './http-auth-interceptor.service';
import { RedirectInterceptor } from './redirect-interceptor';
export const InterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, deps: [], useClass: HttpErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RedirectInterceptor, multi: true }
];
