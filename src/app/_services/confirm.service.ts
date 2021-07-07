import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';
import { ConfirmDiaglogComponent } from '../modals/confirm-diaglog/confirm-diaglog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  bsModelRef: BsModalRef = {} as any;
  constructor(private modalService: BsModalService) { }

  confirm(title = 'Confirmation'
    , message = 'Are you sure you want to do this?'
    , btnOkText = 'Ok'
    , btnCancelText = 'Cancel'): Observable<boolean>{
      const config = {
        initialState: {
          title,
          message,
          btnOkText,
          btnCancelText
        }
      }
      this.bsModelRef = this.modalService.show(ConfirmDiaglogComponent, config);
      
      return new Observable<boolean>(this.getResult());
    }
    private getResult(){
      return (observer: any) => {
        const subscription = this.bsModelRef.onHidden.subscribe(() =>{
          observer.next(this.bsModelRef.content.result);
        });
        return {
          unsubscribe(){
            subscription.unsubscribe();
          }
        }
      }
    }
}
