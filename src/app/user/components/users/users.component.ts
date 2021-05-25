import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { SharedService } from '../../../core/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { translation } from '../../../../constants/toastTranslation';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  tempData: any;
  isLoaderShown = false;
  isLoaderSpinnerShown = false;
  submitted = false;
  searchText: any;
  isUserNameExist = '';
  actionType = 'Add';
  language: any;
  isFormShown = false;
  isEditEnabled = false;
  options = { positionClass: 'toast-top-right' };
  userForm!: FormGroup;
  dataList: Array<any> = [];
  userFormModel = {
    bron: localStorage.getItem('userName'),
    userId: 0,
    userName: '',
    firstName: '',
    lastName: '',
    desc: '',
    eMail: '',
    lastUpdated: '',
    createdDate: '',
    lastLoginTime: '',
    passwordDate: '',
    status: "A",
    accountStatus: 0,
    defaultCentre: "",
    invalidAttempts: 0,
    password: ""
  };
  modalRef!: BsModalRef;
  isAdd: boolean = false;
  isEnable: boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    public translate: TranslateService,
    private userService: UserService, private modalService: BsModalService) {
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
    this.initForms(this.userFormModel);
    this.language = this.activatedRoute.snapshot.params.language;
    this.translate.use(this.activatedRoute.snapshot.params.language);
    this.getUserList();
  }

  /**
   * Method for fetching user list
   * @param null;
   */
  getUserList(): void {
    this.isLoaderShown = true;
    this.userService.getUserDetails().subscribe((response: any) => {
      this.isLoaderShown = false;
      if (response.data) {
        this.dataList = response.data;
      }
    }, (e: any) => {
      this.dataList = [];
      this.isLoaderShown = false;
    });
  }

  /**
   * Method to reset password
   * @param null;
   */
  resetpassword(id: any) {
    this.isLoaderShown = true;
    this.userService.resetPassword(id).subscribe(response => {

      this.toastr.success(translation[this.language].PasswordResetMessage, '', this.options);
      this.isLoaderShown = false;
      if (response.data) {
        let isUserExists = this.dataList.findIndex((userList) => {
          return userList.userId === response.data.userId;
        });
        if (isUserExists !== -1) {
          this.dataList[isUserExists] = response.data;
          this.userForm.get('passwordDate')?.setValue(response.data.passwordDate);
          this.userForm.get('lastUpdated')?.setValue(response.data.lastUpdated);
        }
      }
    }, (e: any) => {
      this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
      this.isLoaderShown = false;
    });
  }

  /**
 * Method to check username exists or not
 * @param null;
 */
  checkUserNameExist(event: any) {
    this.isUserNameExist = '';
    if (event.target.value) {
      this.isLoaderSpinnerShown = true;
      this.userService.userNameCheck(event.target.value).subscribe(response => {
        if (response.status === 'Error') {
          this.isUserNameExist = 'notavailable';
        } else {
          //this.toastr.success(response.message, '', this.options);
          this.isUserNameExist = 'available';
        }

        this.isLoaderSpinnerShown = false;
      }, (e: any) => {
        this.isUserNameExist = 'notavailable';
        //this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
        this.isLoaderSpinnerShown = false;
      });
    }
  }

  /**
   * Form initialization method
   * @param userObject;
   */
  initForms(userObject: any): void {
    const emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
    // this.toastr.success(translation[this.language].NoRecordsFound, '', this.options);
    this.userForm = this.fb.group({

      userId: [userObject.userId],
      userName: [userObject.userName, [Validators.required, Validators.maxLength(20)]],
      firstName: [userObject.firstName, [Validators.required, Validators.maxLength(30)]],
      lastName: [userObject.lastName, [Validators.required, Validators.maxLength(30)]],
      eMail: [userObject.eMail, [Validators.required, Validators.email, Validators.pattern(emailPattern), Validators.maxLength(60)]],
      desc: [userObject.desc, [Validators.maxLength(200)]],
      lastUpdated: [userObject.lastUpdated],
      passwordDate: [userObject.passwordDate],
      createdDate: [userObject.createdDate],
      lastLoginTime: [userObject.lastLoginTime],
      status: [userObject.status],
      bron: [localStorage.getItem('userName')],
      accountStatus: [userObject.accountStatus],
      defaultCentre: [userObject.defaultCentre],
      invalidAttempts: [userObject.invalidAttempts],
      password: [userObject.password],

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
    // this.isEditEnabled = true;
	if (this.actionType === 'Edit') {
      this.isEnable = true;
	  if(dataObj.firstName===""){
	  this.actionType='Add';
	  this.isEnable = false;
	  }
	 
    } else {
      this.isEnable = false;
    }

    if (this.actionType === 'Add' && !this.isAdd) {
      this.isAdd = true;
      this.dataList.unshift({
        bron: localStorage.getItem('userName'),
        userId: 0,
        userName: '',
        firstName: '',
        lastName: '',
        desc: '',
        eMail: '',
        lastUpdated: '',
        createdDate: '',
        lastLoginTime: '',
        passwordDate: '',
        status: "A",
        accountStatus: 0,
        defaultCentre: "",
        invalidAttempts: 0,
        password: ""
      })
    }
  }

  /**
   * Method to delete record
   * @param null;
   */
  deleteRecord(template: TemplateRef<any>): void {
    this.openModal(template);
    // if (confirm(`${translation[this.language].ConfirmDelete} ${this.tempData.userId} ?`)) {
    //   this.isLoaderShown = true;
    //   this.userService.deleteUserDetails(this.tempData.userId).subscribe(response => {
    //     this.isFormShown = false;
    //     this.toastr.success(response.message, '', this.options);
    //     this.getUserList();
    //     this.actionType = 'Add';
    //     this.isFormShown = false;
    //     this.isLoaderShown = false;
    //   }, (e:any) => {
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
    this.userService.deleteUserDetails(this.tempData.userId).subscribe(response => {
      this.isFormShown = false;
      this.toastr.success(translation[this.language].UserDelete, '', this.options);
      this.getUserList();
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

  decline(): void {
    this.modalRef.hide();
  }

  /**
   * Method to submit form
   * @param null;
   */
  onFormSubmit(): void {
    this.submitted = true;
    if (this.userForm.valid && this.userForm.touched && (this.isUserNameExist === 'available' || this.actionType === 'Edit')) {
      this.isLoaderShown = true;
      this.userService.userFormAction(this.userForm.getRawValue(), this.actionType).subscribe(response => {

        this.isLoaderShown = false;
        this.isFormShown = false;
        this.isEditEnabled = false;

        if (this.actionType === 'Add') {
          if (response.data) {
            this.dataList[0] = response.data;
            this.tempData = response.data;
          }
          this.toastr.success(translation[this.language].UserCreate, '', this.options);
        }
        if (this.actionType === 'Edit') {
          if (response.data) {
            const dataListIndex = this.dataList.findIndex((dataIndex) => {
              return dataIndex.userId === response.data.userId;
            });
            if (dataListIndex !== -1) {
              this.dataList[dataListIndex] = response.data;
            }
          }
          this.toastr.success(translation[this.language].UserUpdate, '', this.options);
        }
        this.userForm.markAsUntouched();

      }, (e: any) => {
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
    this.userForm.markAsUntouched();
    this.submitted = false;
    this.userForm.reset(this.tempData);
    this.tempData = {};
    this.isFormShown = false;
    this.actionType = 'Add';
    this.isEditEnabled = false;
    this.isUserNameExist = '';
    if (this.dataList[0].userId === 0) {
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
