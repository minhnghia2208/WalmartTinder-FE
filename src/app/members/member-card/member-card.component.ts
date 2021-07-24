import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { ConfirmService } from 'src/app/_services/confirm.service';
import { MembersService } from 'src/app/_services/member.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css'],
})
export class MemberCardComponent implements OnInit {
@Input() member: Member = {} as any ;
  constructor(private memberService: MembersService
    , private toastr: ToastrService
    , public presence: PresenceService) { }

  ngOnInit(): void {
  }
  addLike(member: Member){
    this.memberService.addLike(member.userName).subscribe(()=>{
      this.toastr.success('You have liked ' + member.knownAs)
    })
  }
  createImgPath = (serverPath: string) => {
    if (serverPath == null) return 'assets/img/user.png';
    serverPath = serverPath.replace(/\\/g, "/");
    return serverPath.includes('Images')? `https://localhost:5001/${serverPath}`: serverPath;
  }
}
