import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { SharedService } from '../../../core/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { translation } from '../../../../constants/toastTranslation';
import { ToastrService } from 'ngx-toastr';

import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  tempData: any;
  isLoaderShown = false;
  isRoleCreateLoaderShown = false;
  submitted = false;
  searchText: any;
  actionType = 'Add';
  language: any;
  isFormShown = false;
  isEditEnabled = false;
  options = { positionClass: 'toast-top-right' };
  roleForm!: FormGroup;
  dataList: Array<any> = [];
  roleFormModel = {
    bron: localStorage.getItem('userName'),
    // roleId:'',
    roleName: '',
    createdDate: '',
    typeOfRecord: 'R',
    lastUpdated: '',
    status: 'A',
    basedOnRole:'default',
    is_operational:0
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    public translate: TranslateService,
    private userService: UserService) {
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
    this.initForms(this.roleFormModel);
    this.language = this.activatedRoute.snapshot.params.language;
    this.translate.use(this.activatedRoute.snapshot.params.language);
    this.getRoleDetails();
  }

  /**
   * Method for fetching user list
   * @param null;
   */
  getRoleDetails(): void {
    this.isLoaderShown = true;
    this.userService.getRoleDetails().subscribe((response: any) => {
      this.isLoaderShown = false;
      if (response.data) {
        this.dataList = response.data;
        //this.roleFormModel.basedOnRole = this.dataList[0].roleId;


      }
    }, (e:any) => {
      this.dataList = [];
      this.isLoaderShown = false;
    });
  }

  /**
   * Form initialization method
   * @param roleObject;
   */
  initForms(roleObject: any): void {    

    this.roleForm = this.fb.group({
      // roleId: [roleObject.roleId, [Validators.required, Validators.maxLength(20)]],
      roleName: [roleObject.roleName, [Validators.required, Validators.maxLength(100)]],
      typeOfRecord: [roleObject.typeOfRecord],
      createdDate: [roleObject.createdDate],
      lastUpdated: [roleObject.lastUpdated],
      status: [roleObject.status],      
      basedOnRole: [roleObject.basedOnRole],
      bron: [localStorage.getItem('userName')],
      is_operational: [roleObject.is_operational],
      
    });
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
    this.isEditEnabled = true;
  }

  /**
   * Method to delete record
   * @param null;
   */
  deleteRecord(): void {
    if (confirm(`${translation[this.language].ConfirmDelete} ${this.tempData.roleId} ?`)) {
      this.isLoaderShown = true;
      this.userService.deleteRoleDetails(this.tempData.roleId).subscribe(response => {
        this.isFormShown = false;
        this.toastr.success(response.message, '', this.options);
        this.getRoleDetails();
        this.actionType = 'Add';
        this.isFormShown = false;
        this.isLoaderShown = false;
      }, (e:any) => {
        this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
        this.isFormShown = false;
        this.isLoaderShown = false;
      });
    } else {

    }
    return;


  }

  /**
   * Method to check form before submit
   * @param null;
   */
  onFormSubmit(): void {
    this.submitted = true;
    if (this.roleForm.valid && this.roleForm.touched) {   
      if(this.actionType === 'Edit' && this.roleForm.getRawValue()['status'] === 'D'){
        if(confirm(`${translation[this.language].ConfirmStatusChange} ${this.tempData.roleId} ?`)){
          this.formSubmitAfterConfirm();
      }
      }else{
        this.formSubmitAfterConfirm();
      }

    }


  }

  /**
   * Method to submit form
   * @param null;
   */
  formSubmitAfterConfirm(){
    this.isRoleCreateLoaderShown = true;
    this.userService.roleFormAction(this.roleForm.getRawValue(), this.actionType).subscribe(response => {

      this.isRoleCreateLoaderShown = false;
      this.isFormShown = false;
      this.isEditEnabled = false;
      this.toastr.success(response.message, '', this.options);
      this.getRoleDetails();
      this.roleForm.markAsUntouched();

    }, (e:any) => {
      this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
      this.isFormShown = false;
      this.isEditEnabled = false;
      this.isRoleCreateLoaderShown = false;
    });
  }

  /**
   * Method to reset form
   * @param null;
   */
  resetForm(): void {
    this.isEditEnabled = false;
    this.roleForm.markAsUntouched();
    this.submitted = false;
    this.roleForm.reset(this.tempData);
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
