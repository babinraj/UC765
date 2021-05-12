import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { DomainService } from '../../services/domain.service';
import { SharedService } from '../../../core/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { translation } from '../../../../constants/toastTranslation';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-object',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.scss']
})
export class ObjectComponent implements OnInit {
  tempData: any;
  isLoaderShown = false;
  submitted = false;
  searchText: any;
  actionType = 'Add';
  language: any;
  isFormShown = false;
  isEditEnabled = false;
  options = { positionClass: 'toast-top-right' };
  objectForm!: FormGroup;
  dataList: Array<any> = [];
  objTypeList: Array<any> = [];
  centraleList: Array<any> = [];
  selectedType: any;
  objectModel = {
    bron: localStorage.getItem('userName'),
    object_Id: '',
    objectName: '',
    object_type: '',
    centreID: '',
    createdOn: '',
    description: '',
    is_operational: 0,
    lastupdatedOn: '',
    status: 'A'
  };

  constructor(
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
   * Intit method for setting translation and calling fetching object list
   * @param null;
   */
  ngOnInit(): void {
    this.initForms(this.objectModel);
    this.language = this.activatedRoute.snapshot.params.language;
    this.translate.use(this.activatedRoute.snapshot.params.language);
    this.getObjTypeList();
    this.getCenterIdList();
  }

  /**
   * Method for fetching object list
   * @param null;
   */
  getObjectList(type: any): void {
    this.isLoaderShown = true;
    this.dataList = [];
    this.domainServie.getObjectDetails(type).subscribe((response: any) => {
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
   * Method for fetching object list
   * @param null;
   */
  getObjTypeList(): void {
    this.objTypeList = [];
    this.domainServie.getObjectTypeList().subscribe((response: any) => {
      if (response.data) {
        this.objTypeList = response.data.objList;
        this.selectedType = response.data.objList[0];
        this.getObjectList(response.data.objList[0]);
      }
    }, e => {
      this.objTypeList = [];
    });
  }

  /**
   * Method for fetching center ID list
   * @param null;
   */
  getCenterIdList(): void {
    this.domainServie.getCenterIdList().subscribe((response: any) => {
      if (response.data) {
        this.centraleList = response.data.objList;
        this.objectModel.centreID = response.data.objList[0];
      }
    }, e => {
      this.centraleList = [];
    });
  }

  /**
  * Method to handle object type dropdown
  * @param event 
  */
  changeObjectType(event: any): void {
    if (event.target.value) {
      this.selectedType = event.target.value;
      this.getObjectList(event.target.value);
      this.objectForm?.get('object_type')?.setValue(event.target.value);
    }
  }

  /**
   * Form initialization method
   * @param Object;
  */
  initForms(Object: any): void {
    // this.toastr.success(translation[this.language].NoRecordsFound, '', this.options);
    this.objectForm = this.fb.group({
      object_Id: [Object.object_Id, [Validators.required, Validators.min(1)]],
      objectName: [Object.objectName, [Validators.required, Validators.maxLength(100)]],
      object_type: [Object.object_type],
      centreID: [Object.centreID, [Validators.required]],
      createdOn: [Object.createdOn],
      description: [Object.description, [Validators.maxLength(200)]],
      is_operational: [Object.is_operational],
      lastupdatedOn: [Object.lastupdatedOn],
      status: [Object.status],
      bron: [localStorage.getItem('userName')]
    });
  }

  /**
   * Method to get form control
   * @param null;
   
  get partnerId(): any {
    return this.partnerForm.get('partnerId');
  }

  /**
   * Method to open edit window
   * @param dataObj;
   * @param action;
  */
  viewDetails(dataObj: any, action: string): void {
    if (action === 'Add') {
      this.objectModel.object_type = this.selectedType;
    }
    this.actionType = action;
    this.submitted = false;
    this.isFormShown = true;
    this.tempData = dataObj;
    this.initForms(dataObj);
    //this.isEditEnabled = true;
  }

  /**
   * Method to delete record
   * @param null;
  */
  deleteRecord(): void {
    if (confirm(`${translation[this.language].ConfirmDelete} ${this.tempData.partnerId} ?`)) {
      this.isLoaderShown = true;
      this.domainServie.deleteObjectDetails(this.tempData.object_Id).subscribe(response => {
        this.isFormShown = false;
        this.toastr.success(translation[this.language].RecordsDeletedSucess, '', this.options);
        this.getObjTypeList();
        this.actionType = 'Add';
        this.isFormShown = false;
        this.isLoaderShown = true;
      }, e => {
        this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
        this.isFormShown = false;
        this.isLoaderShown = true;
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
    if (this.objectForm.valid && this.objectForm.touched) {
      this.isLoaderShown = true;
      this.domainServie.objectFormAction(this.objectForm.getRawValue(), this.actionType).subscribe(response => {

        this.isLoaderShown = false;
        this.isFormShown = false;
        this.isEditEnabled = false;
        // tslint:disable-next-line: max-line-length
        this.toastr.success(response.message, '', this.options);
        this.getObjTypeList();
        this.objectForm.markAsUntouched();

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
    this.isEditEnabled = false;
    this.objectForm.markAsUntouched();
    this.submitted = false;
    this.objectForm.reset(this.tempData);    
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


