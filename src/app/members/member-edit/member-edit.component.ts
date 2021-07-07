import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/member.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm = {} as any;
  member: Member = {} as any;
  user: User = {} as any;
  @HostListener('window: beforeunload', ['$event']) unloadNotification($event: any){
    if (this.editForm.dirty){
      $event.returnValue = true; 
    }
  }
  constructor(private accountService: AccountService, private memberService: MembersService, 
    private toastr: ToastrService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.loadMember();
  }
  loadMember() {
    this.memberService.getMember(this.user.userName).subscribe(member => {
      this.member = member;
    })
    
  }
  updateMember(){
    this.memberService.updateMember(this.member).subscribe(() =>{
      this.toastr.success('Profile updated successfully');
      this.editForm.reset(this.member);
    })
  }
  public createImgPath = (serverPath: string) => {
    if(serverPath == null) return './assets/img/user.png';
    serverPath = serverPath.replace(/\\/g, "/");
    return serverPath.includes('Images') ? `https://localhost:5001/${serverPath}` : serverPath;
  }
}
