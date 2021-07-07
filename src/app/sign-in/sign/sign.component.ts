import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/_models/user';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css']
})
export class SignComponent implements OnInit {
  @Input() usersFromHomeComponent: any;
  model: {username: string, password: string} = {} as any;
  constructor(public accountService: AccountService, 
    private toastr: ToastrService, private router: Router) { }

  ngOnInit(): void {
  }
  login() {
    this.accountService.login(this.model).subscribe(response =>{
      this.toastr.success("Login Successfully");
      this.router.navigateByUrl('/members');
    }, error => {
      console.log(error);
      this.toastr.error(error.error)
    });
  }
}