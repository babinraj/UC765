import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ImportService } from '../../services/import.service';
import { ToastrService } from 'ngx-toastr';
import { translation } from '../../../../constants/toastTranslation';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {
  modalRef!: BsModalRef;
  isLoaderShown = false;
  responseData: any;
  isFileUpload = false;
  @ViewChild('template') template!: TemplateRef<any>;
  @Input('lang') lang: any;
  options = { positionClass: 'toast-top-right' };
  importObj = {
    table: "UNLOC",
    importFile: "",
    listSeperator: ";",
    processingMethod: "Add",
    backUpFile: "",
    fileName: ""
  }

  @Output() importEmit = new EventEmitter();
  constructor(
    private modalService: BsModalService,
    private importService: ImportService,
    private toastr: ToastrService) { }

  ngOnInit(): void {

    setTimeout(() => {

      this.isFileUpload = false;
      this.modalRef = this.modalService.show(this.template, {
        class: 'import-modal',
        ignoreBackdropClick: true
      });
    }, 0);

  }

  /**
   * Method for select dropdown change
   * @param method 
   * @param event 
   */
  tabChange(method: string, event: any) {
    if (method === 'table') {
      this.importObj.table = event.target.value;
    } else if (method === 'list') {
      this.importObj.listSeperator = event.target.value;
    } else {
      this.importObj.processingMethod = event.target.value;
    }

  }

  /** Method to close modal */
  close() {
    this.importEmit.emit(false);
    this.modalRef.hide();
  }

  /**
   * Method to upload file
   * @param event;
   */
  onFileChanged(event: any) {
    console.log(event.target.files)
    this.isFileUpload = false;
    if (event.target.files) {
      this.isLoaderShown = true;
      const file = event.target.files[0];
      this.importObj.fileName = file.name;
      const fileName = file.name.split('.');
      this.importService.uploadCSVFile(event.target.files[0], fileName[0]).subscribe(response => {
        this.importObj.importFile = response.data;
        this.importObj.backUpFile = response.data.substring(0, response.data.lastIndexOf("/") + 1);
        if(response.data) {
          this.importObj.fileName = response.data;
        }
        this.toastr.success(response.message, '', this.options);
        this.isLoaderShown = false;
      }, e => {
        this.toastr.error(translation[this.lang].SomethingWrong, '', this.options);
        this.isLoaderShown = false;
      })
    }
  }

  /** Method to reset form */
  reset() {

    this.isFileUpload = false;
    this.importObj = {
      table: "UNLOC",
      importFile: "",
      listSeperator: ";",
      processingMethod: "Add",
      backUpFile: "",
      fileName: ""
    }
  }

  /** Method to save CSV file after uploading */
  save() {
    this.isLoaderShown = true;
    this.importService.saveCSVFile(this.importObj).subscribe(response => {
      this.toastr.success(response.message, '', this.options);
      this.isLoaderShown = false;
      this.isFileUpload = true;
      this.responseData = response.data;
    }, e => {
      this.toastr.error(translation[this.lang].SomethingWrong, '', this.options);
      this.isLoaderShown = false;
      this.isFileUpload = false;
      this.close();
    })
  }

}
