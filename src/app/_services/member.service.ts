import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, pipe } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { User } from '../_models/user';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';
// const httpOptions = {
//   headers: new HttpHeaders({
//     Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user') || "")?.access_Token
//   })
// }
@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  member: Member = {} as any;
  memberCache = new Map();
  user: User = {} as any;
  userParams: UserParams = {} as any;

  constructor(private http: HttpClient, private accountService: AccountService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userParams = new UserParams(user);
    });
  }
  getUserParams(){
    return this.userParams;
  }
  setUserParams(params: UserParams){
    this.userParams = params;
  }
  resetUserParams(){
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }
  shuffleArray(array: Member[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  getMembers(userParams: UserParams){
    var response = this.memberCache.get(Object.values(userParams).join('-'))
    if (response){
      return of(response);
    }
    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize);
    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return getPaginatedResult<Member[]>(this.baseUrl + '/users', params, this.http)
    .pipe(map(response=>{
      this.memberCache.set(Object.values(userParams).join('-'), response);
      return response;
    }))
  }

  getFirst(){

    return this.member;
  }
  getMember(username: string){
    const member = [...this.memberCache.values()]
    .reduce((arr, elem)=>arr.concat(elem.result), [])
    .find((member: Member)=> member.userName === username);
    if (member){
      return of(member);
    }
    return this.http.get<Member>(this.baseUrl + '/users/' + username);
  }
  getMemberbyId(Id: number){
    const member = this.members.find(x => x.id === Id);
    if (member !== undefined) return of (member);
    return this.http.get<Member>(this.baseUrl + '/users/id' + Id)
  }
  updateMember(member: Member){
    return this.http.put(this.baseUrl + '/users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }
  
  nextSlide(index: number): [number, Member] {
    this.member = this.members[index];
    if (index == this.members.length-1)
      index = 1;
    else index ++;
    return [index, this.member];
  }

  previousSlide(index: number): [number, Member] {
    this.member = this.members[index];
    if (index == this.members.length-1)
      index = 1;
    else index ++;
    return [index, this.member];
  }
  setMainPhoto(photoId: number){
    return this.http.put(this.baseUrl + '/users/set-main-photo/' + photoId, {})
  }
  deletePhoto(photoId: number){
    return this.http.delete(this.baseUrl + '/users/delete-photo/' + photoId);
  }
  addLike(username: string){
    return this.http.post(this.baseUrl + '/likes/' + username, {})
  }
  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('predicate', predicate);
    return getPaginatedResult<Partial<Member[]>>(this.baseUrl + '/likes', params, this.http);
  }
  
}
