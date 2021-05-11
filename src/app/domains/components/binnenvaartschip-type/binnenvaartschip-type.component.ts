import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { DomainService } from '../../services/domain.service';
import { SharedService } from '../../../core/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { translation } from '../../../../constants/toastTranslation';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-binnenvaartschip-type',
  templateUrl: './binnenvaartschip-type.component.html',
  styleUrls: ['./binnenvaartschip-type.component.scss']
})
export class BinnenvaartschipTypeComponent implements OnInit {
  tempData: any;
  isLoaderShown = false;
  submitted = false;
  searchText: any;
  actionType = 'Add';
  language: any;
  isFormShown = false;
  isEditEnabled = false;
  options = { positionClass: 'toast-top-right' };
  baseTypeForm!: FormGroup;
  dataList: Array<any> = [];
  baseTypeFormModel = {
    basetype_Id: '',
    max_speed: '',
    maintype: '',
    createdOn: '',
    description: '',
    is_operational: 0,
    lastupdatedOn: '',
    status: 'A',
    bron: localStorage.getItem('userName')
  };
  isEnable: boolean = false;
  modalRef!: BsModalRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    public translate: TranslateService,
    private modalService: BsModalService,
    private domainServie: DomainService) {
    this.sharedService.getLanguage().subscribe(response => {
      if (Object.keys(response).length > 0) {
        const t: any = response;
        this.translate.use(t);
        this.language = t;
      }
    });
  }

  /**
   * Intit method for setting translation and calling fetching central list
   * @param null;
   */
  ngOnInit(): void {
    this.initForms(this.baseTypeFormModel);
    this.language = this.activatedRoute.snapshot.params.language;
    this.translate.use(this.activatedRoute.snapshot.params.language);
    this.getBaseTypeList();
  }

  /**
   * Method for fetching centre list
   * @param null;
   */
  getBaseTypeList(): void {
    this.isLoaderShown = true;
    this.domainServie.getBaseTypeDetails().subscribe((response: any) => {
      this.isLoaderShown = false;
      if (response.data) {
        this.dataList = response.data.objList;


      }
    }, e => {
      this.dataList = [];
      this.isLoaderShown = false;
    });
  }

  /**
   * Form initialization method
   * @param baseTypeObject;
   */
  initForms(baseTypeObject: any): void {
    // this.toastr.success(translation[this.language].NoRecordsFound, '', this.options);
    this.baseTypeForm = this.fb.group({
      basetype_Id: [baseTypeObject.basetype_Id, [Validators.required, Validators.maxLength(10)]],
      maintype: [baseTypeObject.maintype, [Validators.required, Validators.maxLength(5)]],
      max_speed: [baseTypeObject.max_speed, [Validators.min(0), Validators.max(99)]],
      description: [baseTypeObject.description, [Validators.maxLength(80)]],
      is_operational: [baseTypeObject.is_operational],
      createdOn: [baseTypeObject.createdOn],
      lastupdatedOn: [baseTypeObject.lastupdatedOn],
      status: [baseTypeObject.status],
      bron: [localStorage.getItem('userName')]
    });
  }

  validateMaxSpeed(evt: any) {
    if (evt.target.value > 99) {
      evt.target.value = 99
    }
  }

  /**
   * Method to open edit window
   * @param dataObj;
   * @param action;
   */
  viewDetails(dataObj: any, action: string): void {
    this.actionType = action;
    this.submitted = false;
    this.isFormShown = true;
    this.tempData = dataObj;
    this.initForms(dataObj);
    //this.isEditEnabled = true;
    if (this.actionType === 'Edit') {
      this.isEnable = true;
    } else {
      this.isEnable = false;
    }
  }

  /**
   * Method to delete record
   * @param null;
   */
  deleteRecord(template: TemplateRef<any>): void {
    this.openModal(template);

    // if (confirm(`${translation[this.language].ConfirmDelete} ${this.tempData.basetype_Id} ?`)) {
    //   this.isLoaderShown = true;
    //   this.domainServie.deleteBaseTypeDetails(this.tempData.basetype_Id).subscribe(response => {
    //     this.isFormShown = false;
    //     this.toastr.success(response.message, '', this.options);
    //     this.getBaseTypeList();
    //     this.actionType = 'Add';
    //     this.isFormShown = false;
    //     this.isLoaderShown = false;
    //   }, e => {
    //     this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
    //     this.isFormShown = false;
    //     this.isLoaderShown = false;
    //   });
    // } else {

    // }
    // return;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirmBinnenVar(): void {
    if (this.tempData.basetype_Id) {
      this.isLoaderShown = true;
      this.domainServie.deleteBaseTypeDetails(this.tempData.basetype_Id).subscribe(response => {
        this.isFormShown = false;
        this.toastr.success(response.message, '', this.options);
        this.getBaseTypeList();
        this.actionType = 'Add';
        this.isFormShown = false;
        this.isLoaderShown = false;
        this.modalRef.hide();

      }, e => {
        this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
        this.isFormShown = false;
        this.isLoaderShown = false;
      });
    }
  }

  declineBinnenVar(): void {
    this.modalRef.hide();

  }

  /**
   * Method to submit form
   * @param null;
   */
  onFormSubmit(): void {
    this.submitted = true;
    if (this.baseTypeForm.valid && this.baseTypeForm.touched) {
      this.isLoaderShown = true;

      this.domainServie.baseTypeFormAction(this.baseTypeForm.getRawValue(), this.actionType).subscribe(response => {

        this.isLoaderShown = false;
        // tslint:disable-next-line: max-line-length
        this.toastr.success(response.message, '', this.options);
        this.getBaseTypeList();
        this.baseTypeForm.markAsUntouched();
        this.isFormShown = false;
        this.isEditEnabled = false;
      }, (e) => {
        this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
        this.isFormShown = false;
        this.isEditEnabled = false;
      });
    }


  }

  /**
   * Method to reset form
   * @param null;
   */
  resetForm(): void {
    this.isEditEnabled = false;
    this.submitted = false;
    this.baseTypeForm.markAsUntouched();
    this.baseTypeForm.reset(this.tempData);
    this.tempData = {};
    this.isFormShown = false;
    this.actionType = 'Add';
    this.isEditEnabled = false;
  }

  /**
   * Method to enable edit
   * @param null;
   */
  enableEdit(): void {
    this.isEditEnabled = true;
  }



}
