import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ImportService } from '../../services/import.service';
import { ToastrService } from 'ngx-toastr';
import { translation } from '../../../../constants/toastTranslation';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {

  modalRef!: BsModalRef;
  modalRef2!: BsModalRef;
  modalOption!: BsModalRef;
  isLoaderShown = false;
  responseData: any;
  backupName: any;
  @ViewChild('template') template!: TemplateRef<any>;
  @Input('lang') lang: any;
  options = { positionClass: 'toast-top-right' };
  userName = localStorage.getItem('userName');
  exportObj = {
    dbName: "prod",
    action: "",
    backUpName: "",
    isFileSelectPage: false,
    envSelected: '',
    folderPath: '',
    folderName: '',
    serverFolderPath: ''
  }
  files: Array<any> = [];
  actionList: string = '';
  dbDataList: any = [];
  isExportImportLoaderShown: boolean = false;
  @Output() exportEmit = new EventEmitter();
  constructor(
    private modalService: BsModalService,
    private importService: ImportService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getDbDataList();
    setTimeout(() => {

      this.modalRef = this.modalService.show(this.template, {
        class: 'export-modal',
        ignoreBackdropClick: true
      });
    }, 0);



  }

  getDbDataList() {
    this.importService.listDBData().subscribe(response => {
      console.log("export", response);
      if (response.data && response.data.objList) {
        this.dbDataList = response.data.objList;
      }
    }, e => {
      this.toastr.error(translation[this.lang].SomethingWrong, '', this.options);
      this.isLoaderShown = false;
      this.close();
    })
  }


  /** Method to close modal */
  close() {
    this.exportEmit.emit(false);
    this.modalRef.hide();
  }

  /**
   * Method to change Database
   * @param event 
   */
  switchDB(event: any) {
    this.exportObj.backUpName = '';
    this.exportObj.dbName = event.target.value;
    this.backupName = '';
  }



  /** Method to reset form */
  reset() {
  }

  /** Method to save CSV file after uploading */
  save() {
    this.isLoaderShown = true;
    this.importService.saveCSVFile(this.exportObj).subscribe(response => {
      this.toastr.success(response.message, '', this.options);
      this.isLoaderShown = false;
      this.responseData = response.data;
    }, e => {
      this.toastr.error(translation[this.lang].SomethingWrong, '', this.options);
      this.isLoaderShown = false;
      this.close();
    })
  }

  importDb() {
    this.isLoaderShown = true;
    this.importService.restoreBackUp().subscribe(response => {
      this.toastr.success(response.message, '', this.options);
      this.isLoaderShown = false;
      this.responseData = response.data;
    }, e => {
      this.toastr.error(translation[this.lang].SomethingWrong, '', this.options);
      this.isLoaderShown = false;
      this.close();
    })
  }

  exportDb() {
    this.isLoaderShown = true;
    this.importService.takeBackUp().subscribe(response => {
      this.toastr.success(response.message, '', this.options);
      this.isLoaderShown = false;
      this.responseData = response.data;
    }, e => {
      this.toastr.error(translation[this.lang].SomethingWrong, '', this.options);
      this.isLoaderShown = false;
      this.close();
    })
  }

  /** Method to open name modal */
  openNameModel(template: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(template, {
      id: 2, class: 'name-modal',
      ignoreBackdropClick: true
    });
  }

  /** Method to close name  model*/
  closeNameModal() {
    this.modalService.hide(2);
  }

  /** Method to save name for backup */
  saveName() {
    this.exportObj.backUpName = this.backupName;
    this.modalService.hide(2);
  }

  /**
   * Method to select DB Action
   * @param action 
   */
  dbAction(action: any) {
    this.exportObj.action = action;
    this.exportObj.isFileSelectPage = true;
  }

  /**
   * Method to select DB environment 
   * @param environment
   */
  selectEnvironment(environment: any) {
    this.exportObj.envSelected = environment;
    this.isLoaderShown = true;

    this.importService.listBackupFiles(environment).subscribe(response => {
      this.isLoaderShown = false;
      this.files = response.data.files;
      this.exportObj.serverFolderPath = response.data.folderPath;
      this.exportObj.folderPath = response.data.folderPath;
    });


  }

  selectFile(fileName: any, folderPath: any) {
    this.exportObj.folderPath = '';
    this.exportObj.backUpName = fileName;
    this.exportObj.folderPath = `${folderPath}${fileName}`;
  }

  /**
 * Method to handle export 
 */
  exportMethod() {
    this.actionList = "Export";
    this.isExportImportLoaderShown = true;
    this.importService.exportBackup(this.exportObj).subscribe(response => {
      this.toastr.success(response.message, '', this.options);
      this.closeFiles();
      this.exportObj.backUpName = '';
      this.backupName = '';
      this.isExportImportLoaderShown = false;
      this.actionList = "";
    }, error => {
      this.isExportImportLoaderShown = false;
      this.toastr.error(translation[this.lang].SomethingWrong, '', this.options);
      this.closeFiles();
    })
  }

  /**
   * Method to handle import 
   */
  importMethod(template: TemplateRef<any>) {
    this.openModal(template);

    // if (confirm(translation[this.lang].OverwriteMessage)) {
    //   this.isLoaderShown = true;
    //   this.importService.exportImportBackupToMaintenenceDB(this.exportObj).subscribe(response => {
    //     this.isLoaderShown = false;
    //     this.toastr.success(response.message, '', this.options);
    //     this.closeFiles();
    //     this.exportObj.backUpName = '';
    //     this.backupName = '';
    //   }, error => {
    //     this.isLoaderShown = false;
    //     this.toastr.error(translation[this.lang].SomethingWrong, '', this.options);
    //     this.closeFiles();
    //   })
    // }
  }

  openModal(template: TemplateRef<any>) {
    this.modalOption = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirmAccess(): void {
    this.isExportImportLoaderShown = true;
    this.actionList = "Import";
    this.importService.exportImportBackupToMaintenenceDB(this.exportObj).subscribe(response => {
      this.isExportImportLoaderShown = false;
      this.toastr.success(response.message, '', this.options);
      this.closeFiles();
      this.exportObj.backUpName = '';
      this.backupName = '';
      this.actionList = "";

      this.modalOption.hide();
    }, error => {
      this.isExportImportLoaderShown = false;
      this.toastr.error(translation[this.lang].SomethingWrong, '', this.options);
      this.closeFiles();
    })
  }

  declineAccess(): void {
    this.modalOption.hide();
  }

  /**
   * Method to handle synchronize 
   */
  synchronizeMethod() {
    this.isExportImportLoaderShown = true;
    this.actionList = "Synchronize";

    this.importService.syncEnvWithBackup(this.exportObj).subscribe(response => {
      this.isExportImportLoaderShown = false;
      this.toastr.success(response.message, '', this.options);
      this.closeFiles();
      this.exportObj.backUpName = '';
      this.backupName = '';
      this.actionList = "";

    }, error => {
      this.isExportImportLoaderShown = false;
      this.toastr.error(translation[this.lang].SomethingWrong, '', this.options);
      this.closeFiles();
    })
  }

  closeFiles() {
    this.exportObj.action = '';
    this.exportObj.isFileSelectPage = false;
    this.exportObj.envSelected = '';
  }

}
