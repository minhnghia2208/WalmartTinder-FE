import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { ConfirmService } from './confirm.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private confirmService: ConfirmService) { }
  getUsersWithRoles(){
    return this.http.get<Partial<User[]>>(this.baseUrl + '/admin/users-with-roles');
  }
  updateUserRoles(username: string, roles: string[]){
    return this.http.post(this.baseUrl + '/admin/edit-roles/' + username + '?roles=' + roles, {});
  }
  upload(){
    this.http.get(this.baseUrl + '/ml/create').subscribe(response => 
      this.confirmService.confirm('Your ProjectId Code:'
          , JSON.stringify(response)
          , 'I saved it.', 'I do not care').subscribe()
    );
  }
}
