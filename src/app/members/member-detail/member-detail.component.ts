import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { take } from 'rxjs/operators';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/member.service';
import { MessageService } from 'src/app/_services/message.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs', {static: true}) memberTabs: TabsetComponent = {} as any;
  galleryOptions: NgxGalleryOptions[] = {} as any;
  galleryImages: NgxGalleryImage[] = {} as any;
  member: Member = {} as any;
  activeTab: TabDirective = {} as any;
  messages: Message[] = [];
  user: User = {} as any;
  constructor(private memberService: MembersService
    , private route: ActivatedRoute
    , private messageService: MessageService
    , public presence: PresenceService
    , private accountService: AccountService) { 
      this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.member = data.member;
    });
    this.route.queryParams.subscribe(params =>{
      params.tab ? this.selectTab(params.tab) : this.selectTab(0);
    })
    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false,
      }
    ]
    this.galleryImages = this.getImages();
  }
  getImages(): NgxGalleryImage[]{
    const imageUrls = [];
    for (const photo of this.member.photos || []){
      imageUrls.push({
        small: photo?.url, 
        medium: photo?.url,
        big: photo?.url,
      })
    }
    return imageUrls;
  }
  
  loadMessages(){
    this.messageService.getMessageThread(this.member.userName)
      .subscribe(messages => {
        this.messages = messages;
      })
  }
  selectTab(tabId: number){
    this.memberTabs.tabs[tabId].active = true;
  }
  onTabActivated(data: TabDirective){
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages' && this.messages.length === 0){
      this.messageService.createHubConnection(this.user, this.member.userName);
    } else {
      this.messageService.stopHubConncetion();
    }
  }
  ngOnDestroy(): void {
    this.messageService.stopHubConncetion();
  }
  public createImgPath = (serverPath: string) => {
    if(serverPath == null) return './assets/img/user.png';
    serverPath = serverPath.replace(/\\/g, "/");
    return serverPath.includes('Images') ? `https://localhost:5001/${serverPath}` : serverPath;
  }
}
