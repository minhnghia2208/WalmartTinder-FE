import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination } from '../_models/pagination';
import { ConfirmService } from '../_services/confirm.service';
import { MembersService } from '../_services/member.service';
import { MessageService } from '../_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[] = [];
  pagination: Pagination = {} as any;
  container = 'Unread';
  pageNumber = 1;
  pageSize = 5;
  loading = false;

  constructor(private messageService: MessageService, private confirmService: ConfirmService) { }

  ngOnInit(): void {
    this.loadMessages();
  }
  loadMessages(){
    this.loading = true;
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container)
      .subscribe(response => {
        this.messages = response.result;
        this.pagination = response.pagination;
        this.loading = false;
      })
  }
  deleteMessage(id: number){
    this.confirmService.confirm('Confirm delete message', 'This cannot be undone').subscribe(result => {
      if (result) {
        this.messageService.deleteMessage(id).subscribe(() =>{
          this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
        })
      }
    })
    
  }
  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.loadMessages();
  }
  public createImgPath = (serverPath: string) => {
    if(serverPath == null) return './assets/user.png';
    serverPath = serverPath.replace(/\\/g, "/");
    return serverPath.includes('Images') ? `https://localhost:5001/${serverPath}` : serverPath;
  }
}
