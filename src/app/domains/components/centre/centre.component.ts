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
import { IStatus, statusList, ICentralData } from '../../domainHelper';

@Component({
  selector: 'app-centre',
  templateUrl: './centre.component.html',
  styleUrls: ['./centre.component.scss']
})
export class CentreComponent implements OnInit {
  tempData: any;
  isLoaderShown = false;
  submitted = false;
  searchText: any;
  actionType = 'Add';
  language: any;
  isFormShown = false;
  isEditEnabled = false;
  options = { positionClass: 'toast-top-right' };
  centerForm!: FormGroup;
  dataList: Array<any> = [];
  centerFormModel: ICentralData = {
    bron: localStorage.getItem('userName'),
    centre_Id: '',
    centre_name: '',
    createdOn: '',
    default_AREA: '',
    description: '',
    is_operational: 0,
    lastupdatedOn: '',
    lattitude: '',
    longitude: '',
    status: 'A'
  };
  modalRef!: BsModalRef;
  isEnable: boolean = false;
  statusList: IStatus[];
  isAdd: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    public translate: TranslateService,
    private domainServie: DomainService,
    private modalService: BsModalService) {

    this.sharedService.getLanguage().subscribe(response => {
      if (Object.keys(response).length > 0) {
        const t: any = response;
        this.translate.use(t);
        this.language = t;
      }
    });

    this.statusList = statusList;

  }

  /**
   * Intit method for setting translation and calling fetching central list
   * @param null;
   */
  ngOnInit(): void {
    this.initForms(this.centerFormModel);
    this.language = this.activatedRoute.snapshot.params.language;
    this.translate.use(this.activatedRoute.snapshot.params.language);
    this.getCenterList();
  }

  /**
   * Form initialization method
   * @param centerObject;
   */
  initForms(centerObject: any): void {
    // this.toastr.success(translation[this.language].NoRecordsFound, '', this.options);
    this.centerForm = this.fb.group({
      centre_Id: [centerObject.centre_Id, [Validators.required, Validators.maxLength(3)]],
      centre_name: [centerObject.centre_name, [Validators.required, Validators.maxLength(50)]],
      createdOn: [centerObject.createdOn],
      default_AREA: [centerObject.default_AREA],
      description: [centerObject.description, [Validators.maxLength(200)]],
      is_operational: [centerObject.is_operational],
      lattitude: [centerObject.lattitude],
      longitude: [centerObject.longitude],
      lastupdatedOn: [centerObject.lastupdatedOn],
      status: [centerObject.status],
      bron: [localStorage.getItem('userName')]
    });
  }

  /**
   * Method for fetching centre list
   * @param null;
   */
  getCenterList(): void {
    this.isLoaderShown = true;
    this.domainServie.getCentreDetails().subscribe((response: any) => {
      this.isLoaderShown = false;
      if (response.data) {
        this.dataList = response.data.centreList;
      }
    }, e => {
      this.dataList = [];
      this.isLoaderShown = false;
    });
  }

  /**
   * Method to get form control
   * @param null;
   */
  get centerId(): any {
    return this.centerForm.get('centre_Id');
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
    // this.isEditEnabled = true;

    if (this.actionType === 'Edit') {
      this.isEnable = true;
    } else {
      this.isEnable = false;

    }

    if (this.actionType === 'Add' && !this.isAdd) {
      this.isAdd = true;
      this.dataList.unshift(this.centerFormModel)
    }
  }

  /**
   * Method to delete record
   * @param null;
   */
  deleteRecord(template: TemplateRef<any>): void {
    this.openModal(template);
    // if (confirm(`${translation[this.language].ConfirmDelete} ?`)) {
    //   this.isLoaderShown = true;
    //   this.domainServie.deleteCentreDetails(this.tempData.centre_Id).subscribe(response => {
    //     this.isFormShown = false;
    //     this.toastr.success(response.message, '', this.options);
    //     this.getCenterList();
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

  confirm(): void {
    this.isLoaderShown = true;
    this.domainServie.deleteCentreDetails(this.tempData.centre_Id).subscribe(response => {
      this.isFormShown = false;
      this.toastr.success(response.message, '', this.options);
      this.getCenterList();
      this.modalRef.hide();
      this.actionType = 'Add';
      this.isFormShown = false;
      this.isLoaderShown = false;
    }, e => {
      this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
      this.isFormShown = false;
      this.isLoaderShown = false;
    });
  }

  decline(): void {
    // this.message = 'Declined!';
    this.modalRef.hide();
  }

  /**
   * Method to submit form
   * @param null;
   */
  onFormSubmit(): void {
    this.submitted = true;
    if (this.centerForm.valid && this.centerForm.touched) {
      this.isLoaderShown = true;
      this.domainServie.centerFormAction(this.centerForm.getRawValue(), this.actionType).subscribe(response => {

        this.isLoaderShown = false;
        this.isFormShown = false;
        this.isEditEnabled = false;
        if (response.data) {
          this.toastr.success(response.message, '', this.options);
        } else {
          this.toastr.error(response.message, '', this.options);

        }
        this.getCenterList();
        this.centerForm.markAsUntouched();
        this.isAdd = false;
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
    this.isAdd = false;
    this.isEditEnabled = false;
    this.centerForm.markAsUntouched();
    this.submitted = false;
    this.centerForm.reset(this.tempData);
    this.tempData = {};
    this.isFormShown = false;
    this.actionType = 'Add';
    this.isEditEnabled = false;
    if (this.dataList[0].is_operational === 0) {
      this.dataList.splice(0, 1);
    }
  }

  /**
   * Method to enable edit
   * @param null;
   */
  enableEdit(): void {
    this.isEditEnabled = true;
  }

}
