import { Component, OnInit, TemplateRef } from '@angular/core';
import { SharedService } from '../../../core/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  modalRef!: BsModalRef;
  language = 'en';
  role = localStorage.getItem('roleId');
  methodSelected = 'import';
  selectedModalName: any;
  isImport = false;
  constructor(
    public translate: TranslateService,
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private modalService: BsModalService
  ) {
    console.log("role", this.role)
    this.sharedService.getLanguage().subscribe(response => {
      if (Object.keys(response).length > 0) {
        const t: any = response;
        this.translate.use(t);
        this.language = t;
      }
    });
  }

  ngOnInit(): void {
    this.translate.use(this.activatedRoute.snapshot.params.language);
    this.language = this.activatedRoute.snapshot.params.language;
  }

  /** Method to open modal */
  openModal(template: TemplateRef<any>, type: string) {
    this.methodSelected = type;
    this.submitAction();
    // this.modalRef = this.modalService.show(template, {
    //   class: 'radio-modal',
    //   ignoreBackdropClick: true
    // });
  }

  openMenu(type: string) {
    localStorage.setItem("currentMenu", type);
  }

  /** Method to open import/export modal */
  submitAction() {
    this.selectedModalName = this.methodSelected === 'import' ? 'import' : 'export';
    if (this.methodSelected === 'import') {
      this.isImport = true;
    }else{
      this.isImport = true;
    }
    // this.modalRef.hide();
  }

  /** Method to switch between export/import */
  changeMethod(method: any) {
    this.methodSelected = method;
  }

  closeImportModal(event: any) {
    this.isImport = event;

  }
  closeExportModal(event: any) {
    this.isImport = event;

  }
}
