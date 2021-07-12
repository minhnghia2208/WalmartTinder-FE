import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { User } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/member.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members: Member[] = [] as any;
  pagination: Pagination = {} as any;
  userParams: UserParams = {} as any;
  member$: Member = {} as any;
  user_token: User = {} as any;
  user: User = {} as any;
  index: number = 1;
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}]
  attractiveness = [{value: 'Average', display: 'Off'}, {value: 'Beautiful', display: 'On'}]
  constructor(private memberService: MembersService, private toastr: ToastrService) {
    this.userParams = this.memberService.getUserParams();
   }

  ngOnInit(): void { 
    this.loadMembers();

  }
  loadMembers(){
    this.memberService.setUserParams(this.userParams);
    this.memberService.getMembers(this.userParams).subscribe(response =>{
      this.members = response.result;
      this.pagination = response.pagination;
    })
  }
  pageChanged(event: any){
    this.userParams.pageNumber = event.page;
    this.memberService.setUserParams(this.userParams);
    this.loadMembers();
  }
  resetFilters(){
    this.userParams = this.memberService.resetUserParams();
    this.loadMembers();
  }
  // loadMembers(){
  //   this.members$ = this.memberService.getMembers();
  //   this.member$ = this.memberService.getFirst();
  // }
  // nextSlide(): void {
  //   try{
  //     //   this.user.waitlist.push(this.member$);
  //       this.user.temp = this.member$.id;
  //       this.memberService.updateMember(this.user).subscribe(() =>{
  //       this.toastr.success("Added");
  //     })
  //   }
  //   catch{
  //     this.toastr.error("Failed to add")
  //   }
  //   [this.index, this.member$] = this.memberService.nextSlide(this.index);
  //   this.memberService.getMember(this.user_token.userName).subscribe(user => {
  //     this.user = user;
  //   })
  // }

  // previousSlide(): void {
  //   this.toastr.error("Passed");
  //   [this.index, this.member$] = this.memberService.previousSlide(this.index);
  // }
}
