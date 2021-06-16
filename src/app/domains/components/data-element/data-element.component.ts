import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { DomainService } from '../../services/domain.service';
import { SharedService } from '../../../core/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { translation } from '../../../../constants/toastTranslation';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { IStatus, statusList } from '../../domainHelper';

@Component({
  selector: 'app-data-element',
  templateUrl: './data-element.component.html',
  styleUrls: ['./data-element.component.scss']
})
export class DataElementComponent implements OnInit {

  tempData: Array<any> = [];
  isLoaderShown = false;
  searchText: any;
  actionType = 'Add';
  language: any;
  isEditEnabled = false;
  selectedId: any;
  selectedPriorityLabel: any;
  editId: any;
  options = { positionClass: 'toast-top-right' };
  priorityList: Array<any> = [];
  prioritySourceList: Array<any> = [];
  isAdd = false;
  dataList: Array<any> = [];
  isChangePriorityList = false;
  isMode = '';
  statusList: IStatus[];
  modalRef!: BsModalRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    public translate: TranslateService,
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

    this.statusList = statusList;

  }

  /**
   * Intit method for setting translation and calling fetching erinotMessage list
   * @param null;
   */
  ngOnInit(): void {
    this.language = this.activatedRoute.snapshot.params.language;
    this.translate.use(this.activatedRoute.snapshot.params.language);
    this.getpriorityList();
    this.getprioritySourceList();
  }

  /**
   * Method for fetching geo point list
   * @param null;
   */
  getpriorityList(): void {
    this.isLoaderShown = true;
    this.domainServie.getPriorityDetails().subscribe(response => {
      this.isLoaderShown = false;
      if (response.data) {
        this.priorityList = response.data.objList;
        this.selectedPriorityLabel = response.data.objList[0].id;
        this.getDataElementList();
      } else {
        this.priorityList = [];
      }
    }, e => {
      this.isLoaderShown = false;
    })
  }

  /**
   * Method for fetching erinotMessage list
   * @param null;
   */
  getDataElementList(): void {
    this.isLoaderShown = true;
    this.domainServie.getDataElementList().subscribe(response => {
      this.isLoaderShown = false;
      if (response.data) {
        this.dataList = response.data.objList;
        this.tempData = response.data.objList;
        this.dataList = this.tempData.filter(f => f.priority_details_id == this.selectedPriorityLabel);

      } else {
        this.dataList = [];
      }
    }, e => {
      this.isLoaderShown = false;
    })
  }

  /**
    * Method to handle priority label dropdown
    * @param event 
    */
  changePriorityList(event: any): void {
    if (event.target.value) {
      this.dataList = [];
      this.selectedPriorityLabel = event.target.value;
      this.dataList = this.tempData.filter(f => f.priority_details_id == event.target.value);
      //this.getDataElementList();
      //this.objectForm?.get('object_type')?.setValue(event.target.value);
    }
  }

  /**
* Method for fetching direction list
* @param null;
*/
  getprioritySourceList(): void {
    this.isLoaderShown = true;
    this.domainServie.getPrioritySourcesDetails().subscribe(response => {
      this.isLoaderShown = false;
      if (response.data) {
        this.prioritySourceList = response.data.objList;
      } else {
        this.prioritySourceList = [];
      }
    }, e => {
      this.isLoaderShown = false;
    })
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
    this.selectedId = dataObj.id;
    // this.isEditEnabled = true;    
    // this.editId = this.selectedId;
    this.isMode = 'edit';
  }


  /**
   * Method to add new item
   */
  addItem() {
    this.isAdd = true;
    this.dataList.unshift({
      id: 0,
      geo_point_id: '',
      priority_details_id: '',
      priority_source_id: '',
      priority: '',
      is_operational: 0,
      status: false,
      bron: localStorage.getItem('userName'),
      lastupdatedOn: '',
      createdOn: ''
    })
  }

  /**
   * Method to submit form
   * @param null;
   */
  onFormSubmit() {
    let index = this.dataList.findIndex(x => x.id === this.selectedId);
    let method = this.dataList[index].id === 0 ? 'Add' : 'Edit';
    this.isLoaderShown = true;
    this.domainServie.dataElementFormAction(this.dataList[index], method).subscribe(response => {
      this.isLoaderShown = false;
      this.toastr.success(response.message, '', this.options);
      this.resetFields();
      this.getDataElementList();
    }, (e) => {
      this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
      this.getDataElementList();
    })
  }

  /**
 * Method to delete record
 * @param null;
 */
  deleteRecord(userRoleTemplate: TemplateRef<any>) {
    let index = this.dataList.findIndex(x => x.id === this.selectedId);
    if (this.dataList[index].id !== 0) {
      this.openDeleteModal(userRoleTemplate);

      // if (confirm(`${translation[this.language].ConfirmDelete} ${this.selectedId} ?`)) {
      //   this.isLoaderShown = true;
      //   this.domainServie.deleteDataElementDetails(this.selectedId).subscribe(response => {
      //     this.toastr.success(response.message, '', this.options);
      //     this.getDataElementList();
      //     this.isLoaderShown = false;
      //   }, e => {
      //     this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
      //     this.isLoaderShown = false;
      //   });
      // }
    } else {
      this.dataList.splice(index, 1)
    }
    this.resetFields();
  }

  openDeleteModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirmDataElement(): void {
    this.isLoaderShown = true;
    this.domainServie.deleteDataElementDetails(this.selectedId).subscribe(response => {
      this.toastr.success(response.message, '', this.options);
      this.getDataElementList();
      this.isLoaderShown = false;
      this.modalRef.hide();
    }, e => {
      this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
      this.isLoaderShown = false;
    });
  }

  declineDataElement() {
    this.modalRef.hide();
  }

  /**
 * Method to reset form
 * @param null;
 */
  resetForm(): void {
    this.resetFields();
    this.getDataElementList();
    this.isEditEnabled = false;
    this.isMode = '';
    this.isAdd = false;
    this.editId = '';
  }

  /**
   * Method to enable edit
   * @param null;
   */
  enableEdit(): void {
    this.editId = '';
    this.isEditEnabled = true;
    this.editId = this.selectedId;
  }

}


