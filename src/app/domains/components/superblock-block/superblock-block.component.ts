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
  selector: 'app-superblock-block',
  templateUrl: './superblock-block.component.html',
  styleUrls: ['./superblock-block.component.scss']
})
export class SuperblockBlockComponent implements OnInit {

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
  isMode = '';
  modalRef!: BsModalRef;
  statusList: IStatus[];

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
   * Intit method for setting translation and calling fetching superblock list
   * @param null;
   */
  ngOnInit(): void {
    this.language = this.activatedRoute.snapshot.params.language;
    this.translate.use(this.activatedRoute.snapshot.params.language);
    this.getSuperBlockList();
    this.getBlockList();
    this.getSuperBlockBlockList();
  }

  /**
   * Method for fetching super block list
   * @param null;
   */
  getSuperBlockList(): void {
    this.isLoaderShown = true;
    this.domainServie.getSuperBlockDetails().subscribe(response => {
      this.isLoaderShown = false;
      if (response.data) {
        this.superblockList = response.data.objList;
      } else {
        this.superblockList = [];
      }
    }, e => {
      this.isLoaderShown = false;
    })
  }

  /**
   * Method for fetching Area list
   * @param null;
   */
  getSuperBlockBlockList(): void {
    this.isLoaderShown = true;
    this.domainServie.getSuperBlockBlockDetails().subscribe(response => {
      this.isLoaderShown = false;
      if (response.data) {
        this.dataList = response.data.objList;
        this.tempData = response.data.objList;
      } else {
        this.dataList = [];
      }
    }, e => {
      this.isLoaderShown = false;
    })
  }


  /**
* Method for fetching block list
* @param null;
*/
  getBlockList(): void {
    this.isLoaderShown = true;
    this.domainServie.getAllBlockDetails().subscribe(response => {
      this.isLoaderShown = false;
      if (response.data) {
        this.blockList = response.data.objList;
      } else {
        this.blockList = [];
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
    //this.isEditEnabled = true;
    //this.editId = this.selectedId;
    this.isMode = 'edit';
  }


  /**
   * Method to add new item
   */
  addItem() {
    
    const isDataListsExists = this.dataList.filter((list) => {
      return list.id === 0;
    })
    if(isDataListsExists && isDataListsExists.length && isDataListsExists.length >=3 && !this.isAdd) {
      this.toastr.error(translation[this.language].SuperBlockBlokLimitExceeds, '', this.options);

    } 
	/* else if(this.isAdd){
		return 0;
	} */
	else if(!this.isAdd){
	  this.isAdd = true;
      this.dataList.unshift({
        id: 0,
        superblock_Id: '',
        block_Id: '',
        is_operational: 0,
        status: '',
        bron: localStorage.getItem('userName'),
        lastupdatedOn: '',
        createdOn: ''
      })
    }
  }

  /**
   * Method to submit form
   * @param null;
   */
  onFormSubmit() {
    let index = this.dataList.findIndex(x => x.id === this.selectedId);
    let method = this.dataList[index].id === 0 ? 'Add' : 'Edit';
    this.isLoaderShown = true;
    this.domainServie.superBlockBlockFormAction(this.dataList[index], method).subscribe(response => {
      this.isLoaderShown = false;
     /*  if (response.statusCode == 200) {
          this.toastr.success(translation[this.language].SuperblockblockCreate, '', this.options);
        } else {
          this.toastr.error(response.message, '', this.options);
	  } */
	  if (response.statusCode == 200 && response.message == "SuperBlockBlock created successfully.") {
          this.toastr.success(translation[this.language].SuperblockblockCreate, '', this.options);
        } else if (response.statusCode == 200 && response.message == "Updated successfully") {
          this.toastr.success(translation[this.language].SuperblockblockUpdate, '', this.options);
      }else {
          this.toastr.error(response.message, '', this.options);
	  }
		
	  this.resetFields();
      this.getSuperBlockBlockList();
    }, (e) => {
      this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
      this.getSuperBlockBlockList();
    })
  }

  /**
 * Method to delete record
 * @param null;
 */
  deleteRecord(superBlockTemplate: TemplateRef<any>) {
    let index = this.dataList.findIndex(x => x.id === this.selectedId);
    if (this.dataList[index].id !== 0) {
      this.openDeleteModal(superBlockTemplate);
    } else {
      this.dataList.splice(index, 1)
      this.resetFields();
    }
    
  }

  openDeleteModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirmSuperBlock(): void {
    if (this.selectedId) {
      this.isLoaderShown = true;
      this.domainServie.deleteSuperBlockBlockDetails(this.selectedId).subscribe(response => {
        this.toastr.success(translation[this.language].SuperblockblockDelete, '', this.options);
        this.getSuperBlockBlockList();
        this.isLoaderShown = false;
        this.modalRef.hide();
      }, e => {
        this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
        this.isLoaderShown = false;
      });
    }
  }

  declineSuperBlock() {
    this.modalRef.hide();
  }

  /**
 * Method to reset form
 * @param null;
 */
  resetForm(): void {
    this.resetFields();
    this.getSuperBlockBlockList();
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
    this.editId = this.selectedId;
  }

}
