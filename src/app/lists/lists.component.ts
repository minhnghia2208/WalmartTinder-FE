import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Member } from '../_models/member';
import { Pagination } from '../_models/pagination';
import { User } from '../_models/user';
import { AccountService } from '../_services/account.service';
import { MembersService } from '../_services/member.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  members: Partial<Member[]> = [];
  predicate = 'liked';
  pageNumber = 1;
  pageSize = 6;
  pagination: Pagination = {} as any;
  // member: Member = {} as any;
  // waitlist: Member = {} as any;
  // user: User = {} as any;
  constructor(private accountService: AccountService, private memberService: MembersService) {
    // this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
   }

  ngOnInit(): void {
    this.loadLikes();
  }
  loadLikes(){
    this.memberService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe(response =>{
      this.members = response.result;
      this.pagination = response.pagination;
    })
  }
  pageChanged(event: any){
    this.pageNumber = event.page;
    this.loadLikes();
  }
  // loadMember() {
  //   this.memberService.getMember(this.user.userName).subscribe(member => {
  //     this.member = member;
  //     this.findWaitlist();
  //     console.log(this.waitlist);
  //   })
  // }
  // findWaitlist(){
  //   this.memberService.getMemberbyId(this.member.temp).subscribe(waitlist => {
  //     this.waitlist = waitlist;
  //   })    
  // }

}
