import { Component, EventEmitter, Input, OnInit, Output, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HomeComponent } from '../home/home.component';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  registerForm: FormGroup = {} as FormGroup;
  maxDate: Date = {} as Date;
  validationErrors: string[] = [];
  constructor(private accountService: AccountService, private toastr: ToastrService,
    private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {  
    this.initializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear()-18);
  }
  initializeForm(){
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword:['', [Validators.required, this.matchValues('password')]] 
    })
    this.registerForm.controls.password.valueChanges.subscribe(() => {
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    })
  }
  matchValues(matchTo: string): ValidatorFn{
    return (control: any) => 
    control?.value === control?.parent?.controls[matchTo].value ? null : { isMatching: true }
  }
  register(){
    this.accountService.register(this.registerForm.value).subscribe(response =>{
      this.router.navigateByUrl('/members');
      this.toastr.success('Success!')
      this.cancel();
    }, error => {
      this.validationErrors = error;
    })
  }
  cancel(){
    this.cancelRegister.emit(false);
  }
  getControl(type: string){
    return this.registerForm.controls[type] as FormControl;
  }
}
