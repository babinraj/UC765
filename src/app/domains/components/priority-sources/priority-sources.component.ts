import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { DomainService } from '../../services/domain.service';
import { SharedService } from '../../../core/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { translation } from '../../../../constants/toastTranslation';
import { ToastrService } from 'ngx-toastr';
import { IStatus, statusList } from '../../domainHelper';

@Component({
  selector: 'app-priority-sources',
  templateUrl: './priority-sources.component.html',
  styleUrls: ['./priority-sources.component.scss']
})
export class PrioritySourcesComponent implements OnInit {

  tempData: any;
  isLoaderShown = false;
  submitted = false;
  searchText: any;
  actionType = 'Add';
  language: any;
  isFormShown = false;
  isEditEnabled = false;
  options = { positionClass: 'toast-top-right' };
  priorityForm!: FormGroup;
  dataList: Array<any> = [];
  priorityFormModel = {
    sourceId: 0,
    sourceName: '',
    createdOn: '',
    is_operational: 0,
    lastupdatedOn: '',
    status: 'A',
    bron: localStorage.getItem('userName')
  };
  statusList: IStatus[];

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

    this.statusList = statusList;

  }

  /**
   * Intit method for setting translation and calling fetching central list
   * @param null;
   */
  ngOnInit(): void {
    this.initForms(this.priorityFormModel);
    this.language = this.activatedRoute.snapshot.params.language;
    this.translate.use(this.activatedRoute.snapshot.params.language);
    this.getPriorityList();
  }

  /**
   * Method for fetching centre list
   * @param null;
   */
  getPriorityList(): void {
    this.isLoaderShown = true;
    this.domainServie.getPrioritySourcesDetails().subscribe((response: any) => {
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
   * @param priorityObject;
   */
  initForms(priorityObject: any): void {
    // this.toastr.success(translation[this.language].NoRecordsFound, '', this.options);
    this.priorityForm = this.fb.group({
      sourceId: [priorityObject.sourceId],
      sourceName: [priorityObject.sourceName, [Validators.required, Validators.maxLength(50)]],
      is_operational: [priorityObject.is_operational],
      createdOn: [priorityObject.createdOn],
      lastupdatedOn: [priorityObject.lastupdatedOn],
      status: [priorityObject.status],
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
    //this.isEditEnabled = true;
  }

  /**
   * Method to delete record
   * @param null;
   */
  deleteRecord(): void {
    if (confirm(`${translation[this.language].ConfirmDelete} ${this.tempData.sourceId} ?`)) {
      this.isLoaderShown = true;
      this.domainServie.deletePrioritySourcesDetails(this.tempData.sourceId).subscribe(response => {
        this.toastr.success(response.message, '', this.options);
        this.getPriorityList();
        this.actionType = 'Add';
        this.isFormShown = false;
        this.isEditEnabled = false;
        this.isLoaderShown = false;
      }, e => {
        this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
        this.isFormShown = false;
        this.isEditEnabled = false;
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
    if (this.priorityForm.valid && this.priorityForm.touched) {
      this.isLoaderShown = true;

      this.domainServie.prioritySourcesFormAction(this.priorityForm.getRawValue(), this.actionType).subscribe(response => {

        this.isLoaderShown = false;
        // tslint:disable-next-line: max-line-length
        this.toastr.success(response.message, '', this.options);
        this.getPriorityList();
        this.priorityForm.markAsUntouched();
        this.isFormShown = false;

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
    this.submitted = false;
    this.priorityForm.markAsUntouched();
    this.priorityForm.reset(this.tempData);
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
