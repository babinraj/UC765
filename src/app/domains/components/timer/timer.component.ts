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
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {
  tempData: any;
  isLoaderShown = false;
  submitted = false;
  searchText: any;
  actionType = 'Add';
  language: any;
  isFormShown = false;
  isEditEnabled = false;
  options = { positionClass: 'toast-top-right' };
  timerForm!: FormGroup;
  dataList: Array<any> = [];
  timerFormModel = {
    timer_Id: 0,
    timerName: '',
    unit: 'Minuut',
    value: '',
    createdOn: '',
    description: '',
    is_operational: 0,
    lastupdatedOn: '',
    status: 'A',
    bron: localStorage.getItem('userName')
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
   * Intit method for setting translation and calling fetching central list
   * @param null;
   */
  ngOnInit(): void {
    this.initForms(this.timerFormModel);
    this.language = this.activatedRoute.snapshot.params.language;
    this.translate.use(this.activatedRoute.snapshot.params.language);
    this.getTimerList();
  }

  /**
   * Method for fetching centre list
   * @param null;
   */
  getTimerList(): void {
    this.isLoaderShown = true;
    this.domainServie.getTimerDetails().subscribe((response: any) => {
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
   * @param timerObject;
   */
  initForms(timerObject: any): void {
    // this.toastr.success(translation[this.language].NoRecordsFound, '', this.options);
    this.timerForm = this.fb.group({
      timer_Id: [timerObject.timer_Id],
      timerName: [timerObject.timerName, [Validators.required, Validators.maxLength(50)]],
      unit: [timerObject.unit, [Validators.required, Validators.maxLength(20)]],
      value: [timerObject.value, [Validators.required, Validators.min(0), Validators.max(99)]],
      description: [timerObject.description, [Validators.maxLength(200)]],
      is_operational: [timerObject.is_operational],
      createdOn: [timerObject.createdOn],
      lastupdatedOn: [timerObject.lastupdatedOn],
      status: [timerObject.status],
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
    if (confirm(`${translation[this.language].ConfirmDelete} ${this.tempData.timer_Id} ?`)) {
      this.isLoaderShown = true;
      this.domainServie.deleteTimerDetails(this.tempData.timer_Id).subscribe(response => {
        this.toastr.success(response.message, '', this.options);
        this.getTimerList();
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
    if (this.timerForm.valid && this.timerForm.touched) {
      this.isLoaderShown = true;

      this.domainServie.timerFormAction(this.timerForm.getRawValue(), this.actionType).subscribe(response => {

        this.isLoaderShown = false;
        // tslint:disable-next-line: max-line-length
        this.toastr.success(response.message, '', this.options);
        this.getTimerList();
        this.timerForm.markAsUntouched();
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
    this.timerForm.markAsUntouched();
    this.timerForm.reset(this.tempData);
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
