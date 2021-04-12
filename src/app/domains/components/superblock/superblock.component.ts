import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { DomainService } from '../../services/domain.service';
import { SharedService } from '../../../core/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { translation } from '../../../../constants/toastTranslation';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-superblock',
  templateUrl: './superblock.component.html',
  styleUrls: ['./superblock.component.scss']
})
export class SuperblockComponent implements OnInit {
  modalRef!: BsModalRef;
  tempData: any;
  isLoaderShown = false;
  submitted = false;
  searchText: any;
  actionType = 'Add';
  language: any;
  isFormShown = false;
  isEditEnabled = false;
  options = { positionClass: 'toast-top-right' };
  config = {
    keyboard: false,
    class: 'domain-data-modal',
    ignoreBackdropClick: true
  };
  superblockForm!: FormGroup;
  dataList: Array<any> = [];
  superblockFormModel = {
    bron: localStorage.getItem('userName'),
    superblock_Id: '',
    superblock_name: '',
    createdOn: '',
    description: '',
    is_operational: 0,
    lastupdatedOn: '',
    status: 'A'
  };

  constructor(
    private modalService: BsModalService,
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
   * Intit method for setting translation and calling fetching superblock list
   * @param null;
   */
  ngOnInit(): void {
    this.initForms(this.superblockFormModel);
    this.language = this.activatedRoute.snapshot.params.language;
    this.translate.use(this.activatedRoute.snapshot.params.language);
    this.getSuperBlockList();
  }

  /**
   * Method for fetching superblock list
   * @param null;
   */
  getSuperBlockList(): void {
    this.isLoaderShown = true;
    this.domainServie.getSuperBlockDetails().subscribe((response: any) => {
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
   * @param superblockObject;
   */
  initForms(superblockObject: any): void {
    // this.toastr.success(translation[this.language].NoRecordsFound, '', this.options);
    this.superblockForm = this.fb.group({
      superblock_Id: [superblockObject.superblock_Id, [Validators.required, Validators.maxLength(2)]],
      superblock_name: [superblockObject.superblock_name, [Validators.required, Validators.maxLength(50)]],
      createdOn: [superblockObject.createdOn],
      description: [superblockObject.description, [Validators.maxLength(200)]],
      is_operational: [superblockObject.is_operational],
      lastupdatedOn: [superblockObject.lastupdatedOn],
      status: [superblockObject.status],
      bron: [localStorage.getItem('userName')]
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
    if (confirm(`${translation[this.language].ConfirmDelete} ${this.tempData.superblock_Id} ?`)) {
      this.isLoaderShown = true;
      this.domainServie.deletesuperblockDetails(this.tempData.superblock_Id).subscribe(response => {
        this.isFormShown = false;
        this.toastr.success(translation[this.language].RecordsDeletedSucess, '', this.options);
        this.getSuperBlockList();
        this.actionType = 'Add';
        this.isFormShown = false;
        this.isLoaderShown = false;
      }, e => {
        this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
        this.isFormShown = false;
        this.isLoaderShown = false;
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
    if (this.superblockForm.valid && this.superblockForm.touched) {
      this.isLoaderShown = true;
      this.domainServie.superblockFormAction(this.superblockForm.getRawValue(), this.actionType).subscribe(response => {

        this.isLoaderShown = false;
        this.isFormShown = false;
        this.isEditEnabled = false;
        this.toastr.success(response.message, '', this.options);
        this.getSuperBlockList();
        this.superblockForm.markAsUntouched();

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
    this.isEditEnabled = false;
    this.submitted = false;
    this.superblockForm.markAsUntouched();
    this.superblockForm.reset(this.tempData);
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
