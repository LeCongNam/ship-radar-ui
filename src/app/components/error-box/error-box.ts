import {Injectable} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';

@Injectable()
export class ErrorBox {
  constructor(private modal: NzModalService) {}

  showError(err: any) {
    const errorMessage = err?.error?.message || "Login Failed!! Please try again later";

    this.modal.error({
      nzTitle: 'System Error', // Title cổ điển
      nzContent: errorMessage,
      nzClassName: 'sap-ui-classic-modal', // Class để CSS
      nzCentered: true,
      nzOkText: 'Close',
      nzOkDanger: true
    });
  }
}
