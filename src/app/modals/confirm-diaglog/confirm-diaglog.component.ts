import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-diaglog',
  templateUrl: './confirm-diaglog.component.html',
  styleUrls: ['./confirm-diaglog.component.css']
})
export class ConfirmDiaglogComponent implements OnInit {
  title: string = '';
  message: string = '';
  btnOkText: string = '';
  btnCancelText: string = '';
  result: boolean = true;
  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }

  confirm(){
    this.result = true;
    this.bsModalRef.hide();
  }

  decline(){
    this.result = false;
    this.bsModalRef.hide();
  }
}
