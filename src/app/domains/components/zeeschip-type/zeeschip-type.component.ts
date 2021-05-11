import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { DomainService } from '../../services/domain.service';
import { SharedService } from '../../../core/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { translation } from '../../../../constants/toastTranslation';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-zeeschip-type',
  templateUrl: './zeeschip-type.component.html',
  styleUrls: ['./zeeschip-type.component.scss']
})
export class ZeeschipTypeComponent implements OnInit {
  modalRef!: BsModalRef;
  tempData: any;
  isLoaderShown = false;
  submitted = false;
  searchText: any;
  actionType = 'Add';
  language: any;
  isFormShown = false;
  isEditEnabled = false;
  options = { positionClass: 'toast-top-right' };
  config = {
    keyboard: false,
    class: 'domain-data-modal',
    ignoreBackdropClick: true
  };
  zeeschipForm!: FormGroup;
  dataList: Array<any> = [];
  zeeschipFormModel = {
    bron: localStorage.getItem('userName'),
    seashiptype_Id: '',
    max_speed: 0,
    createdOn: '',
    maintype: '',
    description: '',
    is_operational: 0,
    lastupdatedOn: '',
    status: 'A'
  };
  isEnable: boolean = false;

  constructor(
    private modalService: BsModalService,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    public translate: TranslateService,
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
    this.initForms(this.zeeschipFormModel);
    this.language = this.activatedRoute.snapshot.params.language;
    this.translate.use(this.activatedRoute.snapshot.params.language);
    this.getzeeschipList();
  }

  /**
   * Method for fetching data list
   * @param null;
   */
  getzeeschipList(): void {
    this.isLoaderShown = true;
    this.domainServie.getZeeshipTypeDetails().subscribe((response: any) => {
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
   * @param zeeschipObject;
   */
  initForms(zeeschipObject: any): void {
    this.zeeschipForm = this.fb.group({
      seashiptype_Id: [zeeschipObject.seashiptype_Id, [Validators.required, Validators.maxLength(10)]],
      maintype: [zeeschipObject.maintype, [Validators.required, Validators.maxLength(5)]],
      max_speed: [zeeschipObject.max_speed, [Validators.min(0), Validators.max(99)]],
      createdOn: [zeeschipObject.createdOn],
      description: [zeeschipObject.description, [Validators.maxLength(80)]],
      is_operational: [zeeschipObject.is_operational],
      lastupdatedOn: [zeeschipObject.lastupdatedOn],
      status: [zeeschipObject.status],
      bron: [localStorage.getItem('userName')]
    });
  }

  /**
   * Method to get form control
   * @param null;
   */
  get seashiptypeId(): any {
    return this.zeeschipForm.get('seashiptype_Id');
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

  validateMaxSpeed(evt: any) {
    if(evt.target.value >99) {
      evt.target.value = 99
    }
  }

  /**
   * Method to delete record
   * @param null;
   */
  deleteRecord(): void {
    if (confirm(`${translation[this.language].ConfirmDelete} ${this.tempData.seashiptype_Id} ?`)) {
      this.isLoaderShown = true;
      this.domainServie.deleteZeeshipTypeDetails(this.tempData.seashiptype_Id).subscribe(response => {
        this.isFormShown = false;
        this.toastr.success(response.message, '', this.options);
        this.getzeeschipList();
        this.actionType = 'Add';
        this.isFormShown = false;
        this.isLoaderShown = false;
      }, e => {
        this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
        this.isFormShown = false;
        this.isLoaderShown = false;
      });
    } else {

    }
    return;


  }

  /**
   * Method to submit form
   * @param null;
   */
  onFormSubmit(): void {
    this.submitted = true;
    if (this.zeeschipForm.valid && this.zeeschipForm.touched) {
      this.isLoaderShown = true;
      this.domainServie.zeeshipTypeFormAction(this.zeeschipForm.getRawValue(), this.actionType).subscribe(response => {

        this.isLoaderShown = false;
        // tslint:disable-next-line: max-line-length
        this.toastr.success(response.message, '', this.options);
        this.getzeeschipList();
        this.zeeschipForm.markAsUntouched();
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
    this.zeeschipForm.markAsUntouched();
    this.zeeschipForm.reset(this.tempData);
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
