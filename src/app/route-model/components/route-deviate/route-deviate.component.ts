import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { SharedService } from '../../../core/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { translation } from '../../../../constants/toastTranslation';
import { ToastrService } from 'ngx-toastr';
import { RoutemodelService } from '../../services/routemodel.service';

import { IPositionType, IStatusCode, EStatusCode } from '../../interfaces/routemodel.interface';

@Component({
  selector: 'app-route-deviate',
  templateUrl: './route-deviate.component.html',
  styleUrls: ['./route-deviate.component.scss']
})
export class RouteDeviateComponent implements OnInit {
  tempData: any;
  isFormShown = false;
  isRouteDeviateDetailsFormShown: boolean = false;
  isViewFormLists = false;
  isLoaderShown = false;
  isEditEnabled = false;
  isRouteDetailsEditEnabled: boolean = false;
  isLoaderSpinnerShown = false;
  submitted: boolean = false;
  routeDetailsSubmitted: boolean = false;

  searchText: string = '';
  language: any;
  routeDeviateForm!: FormGroup;
  routeDeviateDetailsForm!: FormGroup;

  actionType = 'Add';
  routeDeviateDetailsActionType: string = 'Add';
  routeDeviateLists: any = [];
  options = { positionClass: 'toast-top-right' };
  
  routeDeviateModal = {
    routeDeviateId: 0,
    trajectId: "",
    trajectName: "",
    statusCode: "A",
    bron: "john",
    createdDate: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + " " + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(),
    lastUpdated: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + " " + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(),
  };
  routeDeviationDetailList: any = [];
  geoPointIdList: any = [];
  pilotTrajectLists: any = [];
  statusCodeLists: IStatusCode[] = [];
  routeDeviateDetailsModal = {
    geoPointId: "",
    routeDeviateId: 0,
    routeDeviationDetailsId: 0,
    statusCode: ""
  };
  statusList: IPositionType[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    public translate: TranslateService,
    private routeModalProvider: RoutemodelService
  ) {
    this.sharedService.getLanguage().subscribe(response => {
      if (Object.keys(response).length > 0) {
        const t: any = response;
        this.translate.use(t);
        this.language = t;
      }
    });
    this.statusCodeLists = [{
      label: EStatusCode.ACTIVE,
      value: EStatusCode.ACTIVE_VALUE,
    }, {
      label: EStatusCode.INACTIVE,
      value: EStatusCode.IN_ACTIVE_VALUE,
    }];
  }

  ngOnInit(): void {
    this.initForms(this.routeDeviateModal);
    this.initRouteDetailsForms(this.routeDeviateDetailsModal);

    this.language = this.activatedRoute.snapshot.params.language;
    this.translate.use(this.activatedRoute.snapshot.params.language);
    this.getRouteDeviateLists();
    this.getAllGeoElement();
    this.getAllPilotTraject();
  }

  getAllGeoElement() {
    this.isLoaderShown = true;
    this.routeModalProvider.getAllGeoElemets().subscribe((response: any) => {
      this.isLoaderShown = false;
      if (response.data) {
        response.data.forEach((geoId: any) => {
          this.geoPointIdList.push({
            label: geoId.geoPointId,
            value: geoId.geoPointId
          })
        })
      }
    }, (e: any) => {
      this.geoPointIdList = [];
      this.isLoaderShown = false;
    });
  }

  initForms(userObject: any): void {
    // this.toastr.success(translation[this.language].NoRecordsFound, '', this.options);
    this.routeDeviateForm = this.fb.group({
      routeDeviateId: [userObject.routeDeviateId],
      trajectId: [userObject.trajectId, [Validators.required]],
      trajectName: [userObject.geoPointName],
      statusCode: [userObject.statusCode, [Validators.required]],
      bron: [userObject.bron, [Validators.required]],
      createdDate: [userObject.createdDate, [Validators.required]],
      lastUpdated: [userObject.lastUpdated, [Validators.required]],
    });
  }

  initRouteDetailsForms(routeDeviateDetailsModal: any) {
    this.routeDeviateDetailsForm = this.fb.group({
      geoPointId: [routeDeviateDetailsModal.geoPointId, [Validators.required]],
      routeDeviateId: [routeDeviateDetailsModal.routeDeviateId, [Validators.required]],
      routeDeviationDetailsId: [routeDeviateDetailsModal.routeDeviationDetailsId, [Validators.required]],
      statusCode: [routeDeviateDetailsModal.statusCode, [Validators.required]],
      // bron: [routeDeviateDetailsModal.bron, [Validators.required]],
      // createdDate: [routeDeviateDetailsModal.createdDate, [Validators.required]],
      // lastUpdated: [routeDeviateDetailsModal.lastUpdated, [Validators.required]],
    });
  }

  getRouteDeviateLists() {
    this.isLoaderShown = true;
    this.routeModalProvider.getAllRouteDeviation().subscribe((response: any) => {
      this.isLoaderShown = false;
      if (response.data) {
        const tempArr = response.data.filter((x: any, i: any, a: any) => a.indexOf(x) == i);
        this.routeDeviateLists = tempArr;
      }
    }, (e: any) => {
      this.routeDeviateLists = [];
      this.isLoaderShown = false;
    });
  }

  getAllPilotTraject() {
    this.isLoaderShown = true;
    this.routeModalProvider.getAllPilotTrajects().subscribe((response: any) => {
      this.isLoaderShown = false;
      if (response.data) {
        this.pilotTrajectLists = response.data;
      }
    }, (e: any) => {
      this.pilotTrajectLists = [];
      this.isLoaderShown = false;
    });
  }

  onFormSubmit(): void {
    this.submitted = true;
    if (this.routeDeviateForm.valid && this.routeDeviateForm.touched) {
      if (this.actionType === 'Add') {
        this.isLoaderShown = true;
        this.routeModalProvider.saveRouteDeviation(this.routeDeviateForm.getRawValue()).subscribe(response => {
          this.isLoaderShown = false;
          this.isFormShown = false;
          this.isEditEnabled = false;
          if (response && response.data && response.statusCode == 200) {
            this.routeDeviateLists.unshift(response.data);
            this.toastr.success(response.message, '', this.options);
            this.routeDeviateForm.markAsUntouched();
          } else {
            this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
          }
        }, (e: any) => {
          this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
          this.isFormShown = false;
          this.isEditEnabled = false;
        });
      } else if (this.actionType === 'Edit') {
        this.isLoaderShown = true;
        this.routeModalProvider.updateRouteDeviation(this.routeDeviateForm.getRawValue()).subscribe(response => {
          if (response && response.data && response.statusCode == 200) {

            this.isLoaderShown = false;
            this.isFormShown = false;
            this.isEditEnabled = false;
            this.toastr.success(response.message, '', this.options);
            console.log("response", response);
            this.getRouteDeviateLists();
            this.routeDeviateForm.markAsUntouched();
          } else {
            this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
          }
        }, (e: any) => {
          this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
          this.isFormShown = false;
          this.isEditEnabled = false;
        });
      }
    }
  }

  viewDetails(dataObj: any, action: string): void {
    this.actionType = action;
    this.tempData = dataObj;
    this.getSelectedRouteDeviation(dataObj.routeDeviateId)
  }

  addRouteDeviate(dataObj: any, action: string) {
    this.actionType = action;
    this.submitted = false;
    this.isFormShown = true;

    this.initForms(dataObj);
  }

  getSelectedRouteDeviation(routeDeviationId: string) {
    this.submitted = false;
    this.routeModalProvider.getSelectedRouteDeviationLists(routeDeviationId).subscribe(response => {
      this.isLoaderShown = false;
      this.isFormShown = false;
      this.isEditEnabled = false;
      if (response.data && response.data.length > 0) {
        this.isViewFormLists = true;
        this.routeDeviationDetailList = response.data;
      } else {
        this.routeDeviationDetailList = [];
        this.isViewFormLists = true;
      }
      this.routeDeviateForm.markAsUntouched();
    }, (e: any) => {
      this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
      this.isFormShown = false;
      this.isEditEnabled = false;
    });
  }


  saveRouteDeviateDetails(routeDev: any) {
    this.routeModalProvider.updateRouteDeviationDetail(routeDev).subscribe(response => {
      this.isLoaderShown = false;
      this.isFormShown = false;
      this.isEditEnabled = false;

      this.toastr.success(response.message, '', this.options);
      // this.getRouteDeviateLists();
      this.routeDeviateForm.markAsUntouched();

    }, (e: any) => {
      this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
      this.isFormShown = false;
      this.isEditEnabled = false;
    });
  }

  addRouteDeviateDetails(dataObj: any, action: string) {
    this.routeDeviateDetailsActionType = action;
    this.submitted = false;
    this.isRouteDeviateDetailsFormShown = true;

    this.initRouteDetailsForms(dataObj);
  }

  onRouteDeviateFormSubmit() {
    this.routeDetailsSubmitted = true;
    if (this.routeDeviateDetailsForm.valid && this.routeDeviateDetailsForm.touched) {
      if (this.routeDeviateDetailsActionType === 'Add') {
        this.isLoaderShown = true;
        if(this.tempData && this.tempData.routeDeviateId) {
          this.routeDeviateDetailsForm.patchValue({
            routeDeviateId: this.tempData.routeDeviateId
          })
        }
        this.routeModalProvider.saveRouteDeviationDetails(this.routeDeviateDetailsForm.getRawValue()).subscribe(response => {
          this.isLoaderShown = false;
          this.isRouteDeviateDetailsFormShown = false;
          this.isRouteDetailsEditEnabled = false;
          if (response && response.data && response.statusCode == 200) {
            this.routeDeviationDetailList.unshift(response.data);
            this.toastr.success(response.message, '', this.options);
            this.routeDeviateDetailsForm.markAsUntouched();
          } else {
            this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
          }
        }, (e: any) => {
          this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
          this.isFormShown = false;
          this.isEditEnabled = false;
        });
      }
    }
  }

  deleteRecord(): void {
    if (confirm(`${translation[this.language].ConfirmRecordDelete}`)) {
      this.isLoaderShown = true;
      this.routeModalProvider.deleterouteDeviation(this.tempData.routeDeviateId).subscribe(response => {
        this.isFormShown = false;
        this.isViewFormLists = false;

        this.toastr.success(response.message, '', this.options);
        this.getRouteDeviateLists();

        this.actionType = 'Add';
        this.isFormShown = false;
        this.isLoaderShown = false;
      }, (e: any) => {
        this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
        this.isFormShown = false;
        this.isViewFormLists = false;
        this.isLoaderShown = false;
      });
    } else {

    }
    return;


  }

  deleteRouteDeviateDetailsRecord() {
    if (confirm(`${translation[this.language].ConfirmRecordDelete}`)) {
      this.isLoaderShown = true;
      this.routeModalProvider.deleterouteDeviation(this.tempData.routeDeviateId).subscribe(response => {
        this.isFormShown = false;
        this.isViewFormLists = false;

        this.toastr.success(response.message, '', this.options);
        this.getRouteDeviateLists();

        this.actionType = 'Add';
        this.isFormShown = false;
        this.isLoaderShown = false;
      }, (e: any) => {
        this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
        this.isFormShown = false;
        this.isViewFormLists = false;
        this.isLoaderShown = false;
      });
    } else {

    }
    return;
  }

  resetForm(): void {
    this.isEditEnabled = false;
    this.submitted = false;
    this.routeDeviateForm.markAsUntouched();
    this.routeDeviateForm.reset(this.tempData);
    this.tempData = {};
  }

  resetRouteDetailsForm() {
    this.isRouteDetailsEditEnabled = false;
    this.routeDetailsSubmitted = false;
    this.routeDeviateDetailsForm.markAsUntouched();
    this.routeDeviateDetailsForm.reset(this.tempData);
    this.tempData = {};
  }

  enableEdit(): void {
    this.isEditEnabled = true;
  }

  enableRouteDeviateDetailsEdit(): void {
    this.isRouteDetailsEditEnabled = true;
  }

}
