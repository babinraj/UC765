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
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {
  tempData: any;
  isLoaderShown = false;
  submitted = false;
  searchText: any;
  actionType = 'Add';
  language: any;
  isFormShown = false;
  isEditEnabled = false;
  options = { positionClass: 'toast-top-right' };
  areaForm!: FormGroup;
  dataList: Array<any> = [];
  centerList: Array<any> = [];
  selectedCenter: any;
  areaFormModel = {
    area_Id: '',
    area_name: '',
    centreID: '',
    createdOn: '',
    isDefaultAreaForCentre: 'Yes',
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
   * Intit method for setting translation and calling fetching area list
   * @param null;
   */
  ngOnInit(): void {
    this.initForms(this.areaFormModel);
    this.language = this.activatedRoute.snapshot.params.language;
    this.translate.use(this.activatedRoute.snapshot.params.language);
    this.getCenterList();
    //this.getAreaList();
  }

  /**
* Method to update center 
* @param null;
*/
  changeCenterName(event: any) {
    this.selectedCenter = event.target.value;
    this.areaForm?.get('centreID')?.setValue(event.target.value);
    this.getAreaList(event.target.value);
  }

  /**
* Method to update center in form area
* @param null;
*/
  changeFormControlCenterName(event: any) {
    this.selectedCenter = event.target.value;
  }

  /**
 * Method for fetching center list
 * @param null;
 */
  getCenterList(): void {
    this.isLoaderShown = true;
    this.domainServie.getCentreDetails().subscribe((response: any) => {
      this.isLoaderShown = false;
      if (response.data) {
        this.centerList = response.data.centreList;
        this.selectedCenter = response.data.centreList[0].centre_Id;
        this.getAreaList(response.data.centreList[0].centre_Id);
        this.areaFormModel.centreID = response.data.centreList[0].centre_Id;
      } else {
        this.centerList = [];
      }
    }, e => {
      this.dataList = [];
      this.isLoaderShown = false;
    });
  }
  /**
   * Method for fetching area list
   * @param null;
   */
  getAreaList(id: any): void {
    this.isLoaderShown = true;
    this.domainServie.getAreaDetails(id).subscribe((response: any) => {
      this.isLoaderShown = false;
      if (response.data) {
        this.dataList = response.data.objList;
      } else {
        this.dataList = [];
      }
    }, e => {
      this.dataList = [];
      this.isLoaderShown = false;
    });
  }

  /**
   * Form initialization method
   * @param areaObject;
   */
  initForms(areaObject: any): void {
    // this.toastr.success(translation[this.language].NoRecordsFound, '', this.options);
    this.areaForm = this.fb.group({
      area_Id: [areaObject.area_Id, [Validators.required, Validators.maxLength(2)]],
      area_name: [areaObject.area_name, [Validators.required, Validators.maxLength(50)]],
      centreID: [areaObject.centreID, [Validators.required, Validators.maxLength(20)]],
      isDefaultAreaForCentre: [areaObject.isDefaultAreaForCentre, [Validators.required]],
      is_operational: [areaObject.is_operational],
      createdOn: [areaObject.createdOn],
      lastupdatedOn: [areaObject.lastupdatedOn],
      status: [areaObject.status],
      bron: [localStorage.getItem('userName')]
    });
  }

  /**
   * Method to open edit window
   * @param dataObj;
   * @param action;
   */
  viewDetails(dataObj: any, action: string): void {
    // if (action === 'Add') {
    //   this.areaFormModel.centreID = this.selectedCenter;
    // }
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
    if (confirm(`${translation[this.language].ConfirmDelete} ${this.tempData.area_Id} ?`)) {
      this.isLoaderShown = true;
      this.domainServie.deleteAreaDetails(this.tempData.area_Id).subscribe(response => {
        this.isFormShown = false;
        this.toastr.success(response.message, '', this.options);
        this.getAreaList(this.selectedCenter);
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
    if (this.areaForm.valid && this.areaForm.touched) {
      this.isLoaderShown = true;

      this.domainServie.areaFormAction(this.areaForm.getRawValue(), this.actionType).subscribe(response => {

        this.isLoaderShown = false;
        // tslint:disable-next-line: max-line-length
        this.toastr.success(response.message, '', this.options);
        this.getAreaList(this.selectedCenter);
        this.areaForm.markAsUntouched();
        this.isFormShown = false;
        this.isEditEnabled = false;

      }, (e) => {
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
    this.isEditEnabled = false;
    this.submitted = false;
    this.areaForm.markAsUntouched();
    this.areaForm.reset(this.tempData);
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
