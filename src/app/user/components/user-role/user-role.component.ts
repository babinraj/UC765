import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SharedService } from '../../../core/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { translation } from '../../../../constants/toastTranslation';
import { ToastrService } from 'ngx-toastr';
import { DomainService } from '../../../domains/services/domain.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss']
})
export class UserRoleComponent implements OnInit {
  tempData: Array<any> = [];
  isLoaderShown = false;
  searchText: any;
  actionType = 'Add';
  language: any;
  isEditEnabled = false;
  selectedId: any;
  editId: any;
  options = { positionClass: 'toast-top-right' };
  blockList: Array<any> = [];
  superblockList: Array<any> = [];
  isAdd = false;
  dataList: Array<any> = [];
  centerList: Array<any> = [];
  roleList: Array<any> = [];
  userList: Array<any> = [];
  isMode = '';
  modalRef!: BsModalRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    public translate: TranslateService,
    private userService: UserService,
    private domainServie: DomainService,
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
   * Intit method for setting translation and calling fetching superblock list
   * @param null;
   */
  ngOnInit(): void {
    this.language = this.activatedRoute.snapshot.params.language;
    this.translate.use(this.activatedRoute.snapshot.params.language);
    this.getCenterList();
    this.getRoleList();
    this.getUserList();
    this.getRoleCenterList();
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
        this.centerList = response.data.centreList;

      }
    }, e => {
      this.centerList = [];
      this.isLoaderShown = false;
    });
  }

  /**
* Method for fetching User list
* @param null;
*/
  getRoleCenterList(): void {
    this.isLoaderShown = true;
    this.userService.getRoleCenterDetails().subscribe((response: any) => {
      this.isLoaderShown = false;
      if (response.data) {
        console.log("response", response)
        this.dataList = response.data;


      }
    }, e => {
      this.dataList = [];
      this.isLoaderShown = false;
    });
  }

  /**
* Method for fetching User list
* @param null;
*/
  getUserList(): void {
    this.isLoaderShown = true;
    this.userService.getUserDetails().subscribe((response: any) => {
      this.isLoaderShown = false;
      if (response.data) {
        this.userList = response.data;


      }
    }, e => {
      this.userList = [];
      this.isLoaderShown = false;
    });
  }


  /**
* Method for fetching Role list
* @param null;
*/
  getRoleList(): void {
    this.isLoaderShown = true;
    this.userService.getRoleDetails().subscribe((response: any) => {
      this.isLoaderShown = false;
      if (response.data) {
        this.roleList = response.data;
      }
    }, e => {
      this.roleList = [];
      this.isLoaderShown = false;
    });
  }

  onSetDefaultRole(roleData: any) {
    let isUserExists = this.dataList.filter((userRole) => {
      return userRole.userId == roleData.userId;
    })
    if(isUserExists && isUserExists.length > 0) {
      isUserExists.forEach((userRole) => {
        userRole.defaultStatus = false;
        if(roleData.centre_Id == roleData.centre_Id && roleData.roleId === userRole.roleId) {
          roleData.defaultStatus = true;
        }
      })
    }
  }

  /**
 * Method to reset fields
 */
  resetFields(): void {
    this.selectedId = '';
    this.isAdd = false;
    this.isEditEnabled = false;
    this.isMode = '';
  }


  /**
   * Method to set selected Id
   * @param dataObj;
   */
  viewDetails(dataObj: any): void {
    this.selectedId = dataObj.centerUserId;
    this.isEditEnabled = true;
    this.editId = this.selectedId;
    this.isMode = 'edit';
  }


  /**
   * Method to add new item
   */
  addItem() {
    if (!this.isAdd) {
      this.isAdd = true;
      this.selectedId = 0;
      this.dataList.unshift({
        centerUserId: 0,
        userId: '',
        centreId: '',
        roleId: '',
        defaultStatus: false,
        status: '',
        bron: localStorage.getItem('userName'),
        lastUpdated: '',
        createdDate: ''
      })
    }
  }

  /**
 * Method to check default role change
 * @param null;
 */
  checkDefault() {
    const uId = this.dataList.filter(data => data.centerUserId == this.selectedId);
    const role = this.roleList.filter(role => role.roleId == uId[0].roleId)[0];
    const user = this.userList.filter(user => user.userId == uId[0].userId)[0];
    const roleArray = this.dataList.filter(data => {
      return data.userId == uId[0].userId && data.defaultStatus == true
    });
    if (roleArray.length > 1) {
      if (confirm(`${translation[this.language].RoleChange} ${user.userName} ${translation[this.language].To} ${role.roleName} ?`)) {
        this.onFormSubmit();
      }
    } else {
      this.onFormSubmit();
    }
  }

  /**
   * Method to submit form
   * @param null;
   */
  onFormSubmit() {
    if (this.isAdd) {
      if (this.dataList[0] && !this.dataList[0].userId) {
        this.toastr.success("Please select user from dropdown", '', this.options);
        return;
      } else if (this.dataList[0] && !this.dataList[0].centreId) {
        this.toastr.success("Please select center from dropdown", '', this.options);
        return;

      } else if (this.dataList[0] && !this.dataList[0].roleId) {
        this.toastr.success("Please select role from dropdown", '', this.options);
        return;
      } else if (this.dataList[0] && !this.dataList[0].status) {
        this.toastr.success("Please select status from dropdown", '', this.options);
        return;
      }
    }
    let index = this.dataList.findIndex(x => x.centerUserId === this.selectedId);
    let method = index < 0 ? 'Add' : 'Edit';
    this.isLoaderShown = true;
    this.userService.roleCenterFormAction(index < 0 ? this.dataList[0] : this.dataList[index], method).subscribe(response => {
      this.isLoaderShown = false;
      this.toastr.success(response.message, '', this.options);
      this.resetFields();
      if(this.isAdd){
        this.dataList[0] = response.data;
      }
      console.log("response", response)
      // this.getRoleCenterList();
    }, (e: any) => {
      this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
      this.getRoleCenterList();
    })
  }

  /**
 * Method to delete record
 * @param null;
 */
  deleteRecord(userRoleTemplate: TemplateRef<any>) {
    let index = this.dataList.findIndex(x => x.centerUserId === this.selectedId);
    if (this.dataList[index] && !this.dataList[index].defaultStatus) {

      if (this.dataList[index].centerUserId !== 0) {
        this.openDeleteModal(userRoleTemplate);

        // if (confirm(`${translation[this.language].ConfirmDelete}?`)) {
        //   this.isLoaderShown = true;
        //   this.userService.deleteRoleCenterDetails(this.selectedId).subscribe(response => {
        //     this.toastr.success(translation[this.language].RecordsDeletedSucess, '', this.options);
        //     this.getRoleCenterList();
        //     this.isLoaderShown = false;
        //   }, (e: any) => {
        //     this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
        //     this.isLoaderShown = false;
        //   });
        // }
      } else {
        this.dataList.splice(index, 1)
      }
      // this.resetFields();
    } else {
      this.toastr.warning(translation[this.language].DefaultDeleteWarning, '', this.options);

    }
  }

  openDeleteModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirmUserRole(): void {
    if (this.selectedId) {
      this.isLoaderShown = true;
      this.userService.deleteRoleCenterDetails(this.selectedId).subscribe(response => {
        this.toastr.success(translation[this.language].RecordsDeletedSucess, '', this.options);
        this.getRoleCenterList();
        this.isLoaderShown = false;
        this.modalRef.hide();
      }, (e: any) => {
        this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
        this.isLoaderShown = false;
      });
    }
  }

  declineUserRole() {
    this.modalRef.hide();
  }

  /**
 * Method to reset form
 * @param null;
 */
  resetForm(): void {
    this.resetFields();
    this.getRoleCenterList();
    this.isEditEnabled = false;
    this.isMode = '';
    this.isAdd = false;
  }

  /**
   * Method to enable edit
   * @param null;
   */
  enableEdit(): void {
    this.editId = '';
    this.isEditEnabled = true;
    // this.editId = this.selectedId;    

  }


}
