import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  constructor(private http: HttpClient, private presence: PresenceService) { }
  login(model: any) {
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
  
  getCurrentUser(){
    var user = JSON.parse(localStorage.getItem('user') || '');
    return user.userName[0].toUpperCase() + user.userName.substring(1,);
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
