import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseURL = environment.apiUrl;
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();
  
  constructor(private http: HttpClient, private presence: PresenceService,
    private toastr: ToastrService) { }

  login(model: any) {
    console.log(typeof(model));
    return this.http.post<User>(this.baseURL + '/account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
          this.presence.createHubConnection(user);
        }
      })
    )
  }

  refresh(model: any){
    this.http.post<User>(this.baseURL + '/account/refresh', model).pipe(
      map((response: User) => {
        localStorage.removeItem('user');
        console.log("TESTING");

        const user = response;
        if (user) {         
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
          this.presence.createHubConnection(user);
        }
      })
    ).subscribe(response =>{
      
    })
    
  }
  
  getCurrentUser(){
    var user = JSON.parse(localStorage.getItem('user') || '');
    return user.userName[0].toUpperCase() + user.userName.substring(1,);
  }

  patch(LikeRead: boolean){
    this.http.patch(this.baseURL + '/users', !LikeRead).subscribe();
    var user = JSON.parse(localStorage.getItem('user') || '');
    user.likeRead = !user.likeRead;

    localStorage.removeItem('user');
    this.presence.stopHubConnection();

    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
    this.presence.createHubConnection(user);
  }
  
  getLikeRead(){
    var user = JSON.parse(localStorage.getItem('user') || '');
    return user.likeRead;
  }

  register(model: any){
    return this.http.post(this.baseURL + '/account/register', model).pipe(
      map((user: any) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
          this.presence.createHubConnection(user);
        }
        return user;
      }
    ))
  }

  setCurrentUser(user: User){
    user.roles = [];
    const roles = this.getDecodedToken(user.access_Token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    localStorage.setItem('user',JSON.stringify(user));
    this.currentUserSource.next(user);
  }
  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(undefined); // can't set to null
    this.presence.stopHubConnection();
  }
  getDecodedToken(token: string){
    return JSON.parse(atob(token.split('.')[1]));
  }
}
