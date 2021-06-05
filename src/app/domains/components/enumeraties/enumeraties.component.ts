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
  selector: 'app-enumeraties',
  templateUrl: './enumeraties.component.html',
  styleUrls: ['./enumeraties.component.scss']
})
export class EnumeratiesComponent implements OnInit {
  tempData: any;
  isLoaderShown = false;
  submitted = false;
  searchText: any;
  selectedNameModel: any;
  actionType = 'Add';
  language: any;
  isFormShown = false;
  isEditEnabled = false;
  options = { positionClass: 'toast-top-right' };
  enumerationForm!: FormGroup;
  dataList: Array<any> = [];
  enumList: Array<any> = [];
  selectedName: any;
  enumerationFormModel = {
    bron: localStorage.getItem('userName'),
    enum_Id: 0,
    enum_name: '',
    enum_value: '',
    createdOn: '',
    default_value: 'Yes',
    description: '',
    is_operational: 0,
    lastupdatedOn: '',
    status: 'A'
  };
  statusList: IStatus[];
  isAdd: boolean = false;
  modalRef!: BsModalRef;
  isEnable: boolean = false;

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
    this.initForms(this.enumerationFormModel);
    this.language = this.activatedRoute.snapshot.params.language;
    this.translate.use(this.activatedRoute.snapshot.params.language);
    this.getEnumNamesList();
  }

  /**
   * Method for fetching enumerationForm list
   * @param null;
   */
  getEnumerationList(name: any): void {
    this.isLoaderShown = true;
    this.domainServie.getEnumerationDetails(name).subscribe((response: any) => {
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
   * @param enumerationObject;
   */
  initForms(enumerationObject: any): void {
    // this.toastr.success(translation[this.language].NoRecordsFound, '', this.options);
    this.enumerationForm = this.fb.group({
      enum_Id: [enumerationObject.enum_Id],
      enum_name: [enumerationObject.enum_name, [Validators.required, Validators.maxLength(50)]],
      enum_value: [enumerationObject.enum_value, [Validators.required, Validators.maxLength(50)]],
      createdOn: [enumerationObject.createdOn],
      default_value: [enumerationObject.default_value],
      description: [enumerationObject.description, [Validators.maxLength(200)]],
      is_operational: [enumerationObject.is_operational],
      lastupdatedOn: [enumerationObject.lastupdatedOn],
      status: [enumerationObject.status],
      bron: [localStorage.getItem('userName')]
    });
  }

  /**
   * Method to get enumeration names list
   * @param null;
   */
  getEnumNamesList(): void {
    this.domainServie.getEnumNamesList().subscribe(response => {
      if (response.data) {
        this.selectedName = response.data.objList[0];
        this.enumList = response.data.objList;
        this.getEnumerationList(response.data.objList[0]);
      } else {
        this.selectedName = '';
        this.enumList = [];
      }
    })
  }

  /**
   * Method to handle enumeration name dropdeon change
   * @param event 
   */
  changeEnumName(event: any): void {
    if (event.target.value) {
      this.selectedName = event.target.value;
      this.getEnumerationList(event.target.value);
      this.enumerationForm?.get('enum_name')?.setValue(event.target.value);
    }

  }

  /**
   * Method to open edit window
   * @param dataObj;
   * @param action;
   */
  viewDetails(dataObj: any, action: string): void {
    if (action === 'Add') {

      this.enumerationFormModel.enum_name = this.selectedName;
    }
    this.actionType = action;
    this.submitted = false;
    this.isFormShown = true;
    this.tempData = dataObj;
    this.initForms(dataObj);

    if (this.actionType === 'Edit') {
      this.isEnable = true;
    } else {
      this.isEnable = false;
    }

    //this.isEditEnabled = true;
    if (this.actionType === 'Add' && !this.isAdd) {
      this.isAdd = true;
      this.dataList.unshift(this.enumerationFormModel)
    }
  }

  /**
   * Method to delete record
   * @param null;
   */
  deleteRecord(template: TemplateRef<any>): void {
    this.openModal(template);

  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirmEnumeraties(): void {
    this.isLoaderShown = true;
    this.domainServie.deleteEnumerationDetails(this.tempData.enum_Id).subscribe(response => {
      this.isFormShown = false;
      this.toastr.success(response.message, '', this.options);
      this.getEnumNamesList();
      this.actionType = 'Add';
      this.isFormShown = false;
      this.isEditEnabled = false;
      this.isLoaderShown = false;
      this.modalRef.hide();
    }, e => {
      this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
      this.isFormShown = false;
      this.isEditEnabled = false;
      this.isLoaderShown = false;
    });
  }

  declineEnumeraties(): void {
    this.modalRef.hide();
  }

  /**
   * Method to submit form
   * @param null;
   */
  onFormSubmit(): void {
    this.submitted = true;
    if (this.enumerationForm.valid && this.enumerationForm.touched) {
      this.isLoaderShown = true;
      this.domainServie.enumerationFormAction(this.enumerationForm.getRawValue(), this.actionType).subscribe(response => {

        this.isLoaderShown = false;
        // tslint:disable-next-line: max-line-length
        this.toastr.success(response.message, '', this.options);
        if (this.actionType === 'Add') {
          if (response.data) {
            this.dataList[0] = response.data;
            this.tempData = response.data;
          }
        }
        if (this.actionType === 'Edit') {
          if (response.data) {
            const dataListIndex = this.dataList.findIndex((dataIndex) => {
              return dataIndex.enum_Id === response.data.enum_Id;
            });
            if (dataListIndex !== -1) {
              this.dataList[dataListIndex] = response.data;
            }
          }
        }
        this.enumerationForm.markAsUntouched();
        this.isFormShown = false;
        this.isAdd = false;
      }, (e) => {
        this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
        this.isFormShown = false;
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
    this.submitted = false;
    this.enumerationForm.markAsUntouched();
    this.enumerationForm.reset(this.tempData);
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
