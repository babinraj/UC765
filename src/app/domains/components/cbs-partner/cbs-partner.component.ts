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
import { IStatus, statusList } from '../../domainHelper';

@Component({
  selector: 'app-cbs-partner',
  templateUrl: './cbs-partner.component.html',
  styleUrls: ['./cbs-partner.component.scss']
})
export class CBSPartnerComponent implements OnInit {
  tempData: any;
  isLoaderShown = false;
  submitted = false;
  searchText: any;
  actionType = 'Add';
  language: any;
  isFormShown = false;
  isEditEnabled = false;
  options = { positionClass: 'toast-top-right' };
  partnerForm!: FormGroup;
  dataList: Array<any> = [];
  partnerModel = {
    bron: localStorage.getItem('userName'),
    partnerId: '',
    partnerSystem: '',
    createdOn: '',
    partnerDescription: '',
    is_operational: 0,
    lastupdatedOn: '',
    partnerStatus: 'A'
  };
  isEnable: boolean = false;
  statusList: IStatus[];
  modalRef!: BsModalRef;
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
   * Intit method for setting translation and calling fetching partner list
   * @param null;
   */
  ngOnInit(): void {
    this.initForms(this.partnerModel);
    this.language = this.activatedRoute.snapshot.params.language;
    this.translate.use(this.activatedRoute.snapshot.params.language);
    this.getPartnerList();
  }

  /**
   * Method for fetching partner list
   * @param null;
   */
  getPartnerList(): void {
    this.isLoaderShown = true;
    this.domainServie.getPartnerDetails().subscribe((response: any) => {
      this.isLoaderShown = false;
      if (response.data) {
        this.dataList = response.data.objList;
      } else {
        this.dataList = [];
      }
    }, e => {
      this.dataList = [];
      this.isLoaderShown = false;
    });
  }

  /**
   * Form initialization method
   * @param partnerObject;
   */
  initForms(partnerObject: any): void {
    // this.toastr.success(translation[this.language].NoRecordsFound, '', this.options);
    this.partnerForm = this.fb.group({
      partnerId: [partnerObject.partnerId, [Validators.required, Validators.maxLength(50)]],
      partnerSystem: [partnerObject.partnerSystem, [Validators.required, Validators.maxLength(50)]],
      createdOn: [partnerObject.createdOn],
      partnerDescription: [partnerObject.partnerDescription, [Validators.required, Validators.maxLength(20)]],
      is_operational: [partnerObject.is_operational],
      lastupdatedOn: [partnerObject.lastupdatedOn],
      partnerStatus: [partnerObject.partnerStatus],
      bron: [localStorage.getItem('userName')]
    });
  }

  /**
   * Method to get form control
   * @param null;
   */
  get partnerId(): any {
    return this.partnerForm.get('partnerId');
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

    if (this.actionType === 'Add' && !this.isAdd) {
      this.isAdd = true;
      this.dataList.unshift(this.partnerModel)
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
    //   this.domainServie.deletePartnerDetails(this.tempData.partnerId).subscribe(response => {
    //     this.isFormShown = false;
    //     this.toastr.success(response.message, '', this.options);
    //     this.getPartnerList();
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

  confirmCbsParner(): void {
    this.isLoaderShown = true;
    this.domainServie.deletePartnerDetails(this.tempData.partnerId).subscribe(response => {
      this.isFormShown = false;
      this.toastr.success(response.message, '', this.options);
      this.getPartnerList();
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

  declineCbsParner(): void {
    this.modalRef.hide();
  }

  /**
   * Method to submit form
   * @param null;
   */
  onFormSubmit(): void {
    this.submitted = true;
    if (this.partnerForm.valid && this.partnerForm.touched) {
      this.isLoaderShown = true;
      this.domainServie.partnerFormAction(this.partnerForm.getRawValue(), this.actionType).subscribe(response => {
        this.isFormShown = false;
        this.isEditEnabled = false;
        this.isLoaderShown = false;
        // tslint:disable-next-line: max-line-length
				
		 if (response.statusCode == 200 && response.message == "Partner created successfully.") {
          this.toastr.success(translation[this.language].CbspartnerCreate, '', this.options);
        } else if (response.statusCode == 200 && response.message == "Updated successfully") {
          this.toastr.success(translation[this.language].CbspartnerUpdate, '', this.options);
        } else {
          this.toastr.error(response.message, '', this.options);
	    }
		
		this.getPartnerList();
        this.partnerForm.markAsUntouched();
        this.isAdd = false;
      }, (e) => {
        this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
        this.isFormShown = false;
        this.isEditEnabled = false;
        this.isLoaderShown = false;
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
    this.partnerForm.markAsUntouched();
    this.submitted = false;
    this.partnerForm.reset(this.tempData);
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

