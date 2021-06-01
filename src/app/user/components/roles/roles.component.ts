import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../../core/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { translation } from '../../../../constants/toastTranslation';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { UserService } from '../../services/user.service';
import { IRoleList, IDataList, IUserRoleResponse } from '../../user-interface';


@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  tempData: any;
  isLoaderShown: boolean = false;
  isRoleCreateLoaderShown: boolean = false;
  submitted = false;
  searchText: string = '';
  actionType: string = 'Add';
  language: string = '';
  isFormShown: boolean = false;
  isEditEnabled: boolean = false;
  options = { positionClass: 'toast-top-right' };
  roleForm!: FormGroup;
  dataList: IDataList[] = [];
  roleFormModel: IDataList = {
    bron: localStorage.getItem('userName'),
    roleId: 0,
    roleIdName: '',
    roleName: '',
    createdDate: '',
    typeOfRecord: 'R',
    lastUpdated: '',
    status: 'A',
    basedOnRole: 0,
    is_operational: 0
  };
  isRoleIdNameExists: string = '';
  isLoaderSpinnerShown: boolean = false;
  roleList: IRoleList[] = [];
  isEnable: boolean = false;
  modalRef!: BsModalRef;
  roleDeleteConfirmation: string = 'roleDeleteConfirmation';
  isAdd: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    public translate: TranslateService,
    private userService: UserService,
    private modalService: BsModalService
  ) {
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
    this.userService.getRoleDetails().subscribe((response: IUserRoleResponse) => {
      this.isLoaderShown = false;
      if (response.data) {
        this.roleList = [];
        response.data.forEach((roleData: IDataList) => {
          this.roleList.push({
            roleName: roleData.roleName + ((roleData.typeOfRecord == 'T') ? ' (' + roleData.typeOfRecord + ')' : ''),
            roleId: roleData.roleId
          });
        })
        this.dataList = response.data;
      }
    }, (e: any) => {
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
      roleId: [roleObject.roleId, Validators.required],
      roleIdName: [roleObject.roleIdName, [Validators.maxLength(20)]],
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
    if (dataObj.roleId === 0 && action === 'Edit') {
      return;
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

    if (this.actionType === 'Add' && !this.isAdd) {
      this.isAdd = true
      this.dataList.unshift({
        bron: localStorage.getItem('userName'),
        roleId: 0,
        roleIdName: '',
        roleName: '',
        createdDate: '',
        typeOfRecord: 'R',
        lastUpdated: '',
        status: 'A',
        basedOnRole: 0,
        is_operational: 0
      })
    }
  }


  /**
  * Method to check username exists or not
  * @param null;
  */
  checkRoleIdNameExist(event: any) {
    this.isRoleIdNameExists = '';
    if (event.target.value) {
      this.isLoaderSpinnerShown = true;
      this.userService.getRoleIdNameCheck(event.target.value).subscribe(response => {
        if (response.status === 'Error') {
          this.isRoleIdNameExists = 'notavailable';
        } else {
          this.isRoleIdNameExists = 'available';
        }

        this.isLoaderSpinnerShown = false;
      }, (e: any) => {
        this.isRoleIdNameExists = 'notavailable';
        this.isLoaderSpinnerShown = false;
      });
    }
  }

  /**
   * Method to delete record
   * @param null;
   */
  deleteRecord(template: TemplateRef<any>): void {
    this.userService.isRoleConnected(this.tempData.roleId).subscribe(response => {
      if (response) {
        if (response.data === true) {
          this.roleDeleteConfirmation = "roleMappedUserDeleteConfirmation";
        } else if (response.data === false) {
          this.roleDeleteConfirmation = "roleDeleteConfirmation"
        }
        this.openModal(template);
      }
    }, (e: any) => {

    });
    return;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirmRole(): void {
    if (this.tempData.roleId) {
      this.isLoaderShown = true;
      this.userService.deleteRoleDetails(this.tempData.roleId).subscribe(response => {
        this.isFormShown = false;
        this.toastr.success(response.message, '', this.options);
        this.getRoleDetails();

        this.actionType = 'Add';
        this.isFormShown = false;
        this.isLoaderShown = false;
        this.modalRef.hide();

      }, (e: any) => {
        this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
        this.isFormShown = false;
        this.isLoaderShown = false;
      });
    }
  }

  declineRole(): void {
    this.modalRef.hide();
  }

  /**
   * Method to check form before submit
   * @param null;
   */
  onFormSubmit(template: TemplateRef<any>): void {
    this.submitted = true;
    if (this.roleForm.valid && this.roleForm.touched) {
      if (this.actionType === 'Edit' && this.roleForm.getRawValue()['status'] === 'D') {
        this.openModal(template);
      } else {
        this.formSubmitAfterConfirm();
      }
    }
  }

  confirmDeactiveRole(): void {
    this.formSubmitAfterConfirm();
  }

  declineDeactiveRole(): void {
    this.modalRef.hide();
  }

  /**
   * Method to submit form
   * @param null;
   */
  formSubmitAfterConfirm() {
    if (this.roleForm.valid && this.roleForm.touched && (this.isRoleIdNameExists === 'available' || this.actionType === 'Edit')) {
      this.isRoleCreateLoaderShown = true;
      this.userService.roleFormAction(this.roleForm.getRawValue(), this.actionType).subscribe(response => {
        this.isRoleCreateLoaderShown = false;
        this.isAdd = false;
        this.isFormShown = false;
        this.isEditEnabled = false;
        if (this.actionType === 'Add') {
          if (response.data) {
            this.dataList[0] = response.data;
          }
        }

        if (this.actionType === 'Edit') {
          if (response.data) {
            const dataListIndex = this.dataList.findIndex((dataIndex) => {
              return dataIndex.roleId === response.data.roleId;
            });
            if (dataListIndex !== -1) {
              this.dataList[dataListIndex] = response.data;
            }
          }
        }
        this.toastr.success(response.message, '', this.options);

        this.roleForm.markAsUntouched();
        if (this.modalRef) {
          this.modalRef.hide();
        }
      }, (e: any) => {
        this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
        this.isFormShown = false;
        this.isEditEnabled = false;
        this.isRoleCreateLoaderShown = false;
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
    this.roleForm.markAsUntouched();
    this.submitted = false;
    this.roleForm.reset(this.tempData);
    this.tempData = {};
    this.isFormShown = false;
    this.actionType = 'Add';
    this.isEditEnabled = false;
    if (this.dataList[0].roleId === 0) {
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
