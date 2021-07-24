import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, delay, take } from 'rxjs/operators';
import { AccountService } from '../_services/account.service';
import { User } from '../_models/user';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router
    , private toastr: ToastrService
    , private accountService: AccountService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (error){
          switch (error.status){
            case 400:
              if (error.error.errors){
                const modelStateErrors = [];
                for (const key in error.error.errors){
                  if (error.error.errors){
                    modelStateErrors.push(error.error.errors[key]);
                  }
                }
                throw modelStateErrors.flat();
              } else if(typeof(error.error) ==='object') {
                this.toastr.error(error.statusText, error.status);
              } else {
                this.toastr.error(error.error, error.status);
              }
              break;
            case 401:
              let currentUser: User = {} as any;
              this.accountService.currentUser$.pipe(take(1)).subscribe(user => currentUser = user)
              // if (currentUser) {
              //   request = request.clone({
              //     setHeaders:{
              //       Authorization: `Bearer ${currentUser.refresh_Token}`
              //     }
              //   })
              // }
              var model = {
                access_token: currentUser.access_Token,
              };
              
              this.accountService.refresh(model);

              setTimeout(()=>{
                window.location.reload();
              }, 100);
              this.toastr.success("Refreshed")
              break;
              // this.toastr.error(error.statusText, error.status);
              // break;

            case 404:
              this.toastr.error(error.statusText, error.status);
              this.router.navigateByUrl('/not-found');
              break;
            case 500:
              const navigationExtras: NavigationExtras = {state: {error: error.error}};
              this.router.navigateByUrl('/server-error', navigationExtras);
              break;
            default:
              this.toastr.error('Something unexpected went wrong');
              break;
          }
        }
        return throwError(error);
      })
    );
  }
  
}

