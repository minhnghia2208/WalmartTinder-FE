import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/_services/admin.service';
import { ConfirmService } from 'src/app/_services/confirm.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ml-management',
  templateUrl: './ml-management.component.html',
  styleUrls: ['./ml-management.component.css']
})
export class MlManagementComponent implements OnInit {

  constructor(private http: HttpClient
    , public adminService: AdminService
    , private confirmService: ConfirmService) { }

  ngOnInit(): void {
  }
  
}
