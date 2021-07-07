import { Photo } from './../../_models/photo';
import { filter, take } from 'rxjs/operators';
import { AccountService } from './../../_services/account.service';
import { environment } from 'src/environments/environment';
import { Member } from './../../_models/member';
import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { User } from 'src/app/_models/user';
import { MembersService } from 'src/app/_services/member.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() member: Member = {} as any;
  uploader: FileUploader = {} as any;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  user: User = {} as any;

  constructor(private accountService: AccountService, private memberService: MembersService,
    private toastr: ToastrService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.initializeUploader();
  }
  setMainPhoto(photo: Photo){
    this.memberService.setMainPhoto(photo.id).subscribe(() => {
      this.user.photoUrl = photo.url;
      this.accountService.setCurrentUser(this.user);
      this.member.photoUrl = photo.url;
      this.member.photos.forEach(p => {
        if(p.isMain) p.isMain = false;
        if(p.id === photo.id) p.isMain = true;
      })
    })
  }

  deletePhoto(photo: Photo){
    this.memberService.deletePhoto(photo.id).subscribe(() => {
      this.member.photos = this.member.photos.filter(p => p.id !== photo.id);
    })
  }

  fileOverBase(e : any){
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader(){
    this.uploader = new FileUploader({
      url: this.baseUrl + '/users/add-photo',
      authToken: 'Bearer ' + this.user.access_Token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if(response){
        const photo = JSON.parse(response);
        this.toastr.success("Image Uploaded");
        this.member.photos.push(photo);
      }
    }
  }

  public createImgPath = (serverPath: string) => {
    return serverPath.includes('Images') ? `https://localhost:5001/${serverPath}` : serverPath;
  }
}