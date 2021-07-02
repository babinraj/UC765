import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { SharedService } from '../../../core/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { translation } from '../../../../constants/toastTranslation';
import { ToastrService } from 'ngx-toastr';
import { RoutemodelService } from '../../services/routemodel.service';
import { IHydroMeteoLocation, IHydroMeteoList, ICentraleList, ICbsLocationList, IStatusCode, EStatusCode } from '../../interfaces/routemodel.interface';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-hydro-meteo',
  templateUrl: './hydro-meteo.component.html',
  styleUrls: ['./hydro-meteo.component.scss']
})
export class HydroMeteoComponent implements OnInit {
  tempData: any;
  tempCentralData: any;
  hydroMeteoLocationId = '';
  isLoaderShown: boolean = false;
  language: any;
  hydroMeteoLocationForm!: FormGroup;
  hydroMeteoForm!: FormGroup;
  isFormShown: boolean = false;
  isCentralFormShown: boolean = false;
  isEditEnabled: boolean = false;
  isDefaultEditEnabled: boolean = false;
  submitted: boolean = false;
  actionType: string = 'Add';
  centralActionType: string = 'Add';
  searchText: string = '';
  options = { positionClass: 'toast-top-right' };

  hydroMeteoLocationList: IHydroMeteoLocation[] = [];
  hydroMeteoList: IHydroMeteoList[] = [];
  typeLists = [{
    label: "Zicht",
    value: "Zicht"
  }, {
    label: "Water Stand",
    value: "waterstand"
  }, {
    label: "Wind",
    value: "wind"
  }]

  locationLists = [{
    label: "KADU",
    value: "kadu"
  }, {
    label: "VR",
    value: "vr"
  }, {
    label: "BATH",
    value: "bath"
  }, {
    label: "HFPL",
    value: "hfpl"
  }, {
    label: "WKAP",
    value: "wkap"
  }, {
    label: "VLIS",
    value: "vlis"
  }]
  today = new Date();

  hydroMeteoLocation = {
    hydroMeteoLocationId: "",
    hydroMeteoLocationName: "",
    centre: "",
    cbsLocationCode: "",
    statusCode: "A",
    isManual: "Y",
    bron: localStorage.getItem('userName'),
    lastUpdated: '',
    createdDate: '',
    // createdDate: this.today.getFullYear() + '-' + (this.today.getMonth() + 1) + '-' + this.today.getDate() + " " + this.today.getHours() + ':' + this.today.getMinutes() + ':' + this.today.getSeconds(),
    // lastUpdated: this.today.getFullYear() + '-' + (this.today.getMonth() + 1) + '-' + this.today.getDate() + " " + this.today.getHours() + ':' + this.today.getMinutes() + ':' + this.today.getSeconds()
  }

  hydroMeteo = {
    hydrometeoId: null,
    hydroMeteoLocationId: "",
    hydrometeoCenter: "",
    locationName: "",
    ssbWaterLevel: "",
    ssbWind: "",
    ssbVisibility: "",
    ssbSensortext: "",
    ssbWeatherPrediction: "",
    statusCode: "A",
    bron: localStorage.getItem('userName'),
    type: "",
    lastUpdated: '',
    createdDate: ''
    // createdDate: this.today.getFullYear() + '-' + (this.today.getMonth() + 1) + '-' + this.today.getDate() + " " + this.today.getHours() + ':' + this.today.getMinutes() + ':' + this.today.getSeconds(),
    // lastUpdated: this.today.getFullYear() + '-' + (this.today.getMonth() + 1) + '-' + this.today.getDate() + " " + this.today.getHours() + ':' + this.today.getMinutes() + ':' + this.today.getSeconds()
  };
  hydroMeteoCentraleList: ICentraleList[] = [];
  cbsLocationCodeLists: ICbsLocationList[] = [];
  statusCodeLists: IStatusCode[] = [];
  modalRef!: BsModalRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    public translate: TranslateService,
    private routeModalProvider: RoutemodelService,
    private modalService: BsModalService
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
    this.initForms(this.hydroMeteoLocation);
    this.language = this.activatedRoute.snapshot.params.language;
    this.translate.use(this.activatedRoute.snapshot.params.language);
    this.getAllHydroMeteoLocation();
    this.getAllCentrale();
    this.getCbsLocodes();
  }

  selectHydroMeteoTab() {
    if (this.hydroMeteoLocationId) {
      this.getAllHydroMeteo();
    }
  }

  initForms(userObject: any): void {
    this.hydroMeteoLocationForm = this.fb.group({
      hydroMeteoLocationId: [userObject.hydroMeteoLocationId, [Validators.required]],
      hydroMeteoLocationName: [userObject.hydroMeteoLocationName, [Validators.required]],
      centre: [userObject.centre, [Validators.required]],
      isManual: [userObject.isManual, [Validators.required]],
      cbsLocationCode: [userObject.cbsLocationCode, [Validators.required]],
      statusCode: [userObject.statusCode, [Validators.required]],
      bron: [localStorage.getItem('userName'), [Validators.required]],
      createdDate: [userObject.createdDate, [Validators.required]],
      lastUpdated: [userObject.lastUpdated, [Validators.required]]
    });
  }



  getAllHydroMeteoLocation() {
    this.isLoaderShown = true;
    this.routeModalProvider.getAllHydroMeteoLocation().subscribe((response: any) => {
      this.isLoaderShown = false;
      if (response.data) {
        this.hydroMeteoLocationList = response.data;
      }
    }, (e: any) => {
      this.hydroMeteoLocationList = [];
      this.isLoaderShown = false;
    });
  }

  getCbsLocodes() {
    this.isLoaderShown = true;
    this.routeModalProvider.getAllCbsLocodes().subscribe((response: any) => {
      this.isLoaderShown = false;
      if (response.data) {
        this.cbsLocationCodeLists = response.data;
      }
    }, (e: any) => {
      this.cbsLocationCodeLists = [];
      this.isLoaderShown = false;
    });
  }

  getAllCentrale() {
    this.isLoaderShown = true;
    this.routeModalProvider.getAllCentrale().subscribe((response: any) => {
      this.isLoaderShown = false;
      if (response.data) {
        this.hydroMeteoCentraleList = response.data;
      }
    }, (e: any) => {
      this.hydroMeteoCentraleList = [];
      this.isLoaderShown = false;
    });
  }



  getAllHydroMeteo() {
    if (this.hydroMeteoLocationId) {
      this.isLoaderShown = true;
      this.routeModalProvider.getAllHydroMeteos(this.hydroMeteoLocationId).subscribe((response: any) => {
        this.isLoaderShown = false;
        if (response.data) {
          this.hydroMeteoList = response.data;
        }
      }, (e: any) => {
        this.hydroMeteoList = [];
        this.isLoaderShown = false;
      });
    }
  }


  onFormSubmit(): void {
    this.submitted = true;
    if (this.hydroMeteoLocationForm.valid && this.hydroMeteoLocationForm.touched) {
      if (this.actionType === 'Add') {
        this.isLoaderShown = true;
        this.routeModalProvider.saveHydroMeteoLocation(this.hydroMeteoLocationForm.getRawValue()).subscribe(response => {
          this.isLoaderShown = false;
          this.isFormShown = false;
          this.isEditEnabled = false;
          if (response && response.data) {
            this.hydroMeteoLocationList.unshift(response.data)
          }
          this.toastr.success(response.message, '', this.options);
          this.hydroMeteoLocationForm.markAsUntouched();
        }, (e: any) => {
          this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
          this.isFormShown = false;
          this.isEditEnabled = false;
        });
      } else if (this.actionType === 'Edit') {
        this.isLoaderShown = true;
        this.routeModalProvider.updateHydroMeteoLocation(this.hydroMeteoLocationForm.getRawValue()).subscribe(response => {
          this.isLoaderShown = false;
          this.isFormShown = false;
          this.isEditEnabled = false;
          if (response && response.data && response.statusCode == 200) {
            const hydroMeteoIndex = this.hydroMeteoLocationList.findIndex((hydroMeteoList) => {
              return hydroMeteoList.hydroMeteoLocationId === response.data.hydroMeteoLocationId;
            })
            if (hydroMeteoIndex !== -1) {
              this.hydroMeteoLocationList[hydroMeteoIndex].hydroMeteoLocationName = response.data.hydroMeteoLocationName;
              this.hydroMeteoLocationList[hydroMeteoIndex].bron = response.data.bron;
              this.hydroMeteoLocationList[hydroMeteoIndex].centre = response.data.centre;
              this.hydroMeteoLocationList[hydroMeteoIndex].cbsLocationCode = response.data.cbsLocationCode;
              this.hydroMeteoLocationList[hydroMeteoIndex].lastUpdated = response.data.lastUpdated;
              this.hydroMeteoLocationList[hydroMeteoIndex].createdDate = response.data.createdDate;
              this.hydroMeteoLocationList[hydroMeteoIndex].hydroMeteoLocationId = response.data.hydroMeteoLocationId;
              this.hydroMeteoLocationList[hydroMeteoIndex].isManual = response.data.isManual;
              this.hydroMeteoLocationList[hydroMeteoIndex].statusCode = response.data.statusCode;
            }
            this.toastr.success(response.message, '', this.options);
            this.hydroMeteoLocationForm.markAsUntouched();
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
    this.hydroMeteoLocationId = dataObj.hydroMeteoLocationId;
    this.submitted = false;
    this.isFormShown = true;
    this.tempData = dataObj;
    this.initForms(dataObj);
  }

  deleteRecord(template: TemplateRef<any>): void {
    this.openDeleteModal(template);

    // if (confirm(`${translation[this.language].ConfirmRecordDelete}`)) {
    //   this.isLoaderShown = true;
    //   this.routeModalProvider.deleteHydroMeteoLocation(this.tempData.hydroMeteoLocationId).subscribe(response => {
    //     this.isFormShown = false;
    //     this.toastr.success(response.message, '', this.options);
    //     this.actionType = 'Add';
    //     this.getAllHydroMeteoLocation();
    //     this.isFormShown = false;
    //     this.isLoaderShown = false;
    //   }, (e: any) => {
    //     this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
    //     this.isFormShown = false;
    //     this.isLoaderShown = false;
    //   });
    // } else {

    // }
    return;
  }
deleteCentraleRecord(template: TemplateRef<any>): void {
    this.openDeleteModalCentrale(template);
    return;
  }
  openDeleteModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }
  openDeleteModalCentrale(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirmHydroMeteo(): void {
    if (this.tempData.hydroMeteoLocationId) {
      this.isLoaderShown = true;
      this.routeModalProvider.deleteHydroMeteoLocation(this.tempData.hydroMeteoLocationId).subscribe(response => {
        this.isFormShown = false;
        this.toastr.success(response.message, '', this.options);
        this.actionType = 'Add';
        this.getAllHydroMeteoLocation();
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

  declineHydroMeteo(): void {
    this.modalRef.hide();
  }
  declineHydroMeteoCentrale(): void {
    this.modalRef.hide();
  }
  resetForm() {
    this.isEditEnabled = false;
    this.submitted = false;
    this.isFormShown = false;
    this.hydroMeteoLocationId = '';
    this.hydroMeteoLocationForm.markAsUntouched();
    this.hydroMeteoLocationForm.reset(this.tempData);
    this.tempData = {};
  }

  enableEdit(): void {
    this.isEditEnabled = true;
  }

  viewCentralDetails(dataObj: any, action: string): void {
	this.centralActionType = action;
    this.submitted = false;
    this.isCentralFormShown = true;
    this.tempCentralData = dataObj;
    this.initCentralForms(dataObj);
  }

  selectDetails(dataObj: any, action: string) {
    this.tempCentralData = dataObj;
	this.isCentralFormShown = true;
  }

  initCentralForms(userObject: any) {
    if (this.hydroMeteoLocationId) {
      userObject.hydroMeteoLocationId = this.hydroMeteoLocationId;
    }
    if (this.tempCentralData.hydrometeoId) {
      userObject.hydrometeoId = this.tempCentralData.hydrometeoId;
    }
    this.hydroMeteoForm = this.fb.group({
      hydroMeteoLocationId: [userObject.hydroMeteoLocationId, [Validators.required]],
      hydrometeoId: [userObject.hydrometeoId],
      hydrometeoCenter: [userObject.hydrometeoCenter],
      type: [userObject.type],
      locationName: [userObject.locationName],
      ssbWaterLevel: [userObject.ssbWaterLevel],
      ssbWind: [userObject.ssbWind],
      ssbVisibility: [userObject.ssbVisibility],
      ssbSensortext: [userObject.ssbSensortext],
      ssbWeatherPrediction: [userObject.ssbWeatherPrediction],
      statusCode: [userObject.statusCode, [Validators.required]],
      bron: [localStorage.getItem('userName'), [Validators.required]],
      createdDate: [userObject.createdDate, [Validators.required]],
      lastUpdated: [userObject.lastUpdated, [Validators.required]]
    });
  }

  get f() { return this.hydroMeteoForm.controls; }


  onCentralFormSubmit(): void {
    this.submitted = true;
    if (this.hydroMeteoForm.valid) {
      if (this.centralActionType === 'Add') {
        this.isLoaderShown = true;
        this.routeModalProvider.saveHydroMeteo(this.hydroMeteoForm.getRawValue()).subscribe(response => {
          this.isLoaderShown = false;
          this.isCentralFormShown = false;
          this.isDefaultEditEnabled = false;
          if (response.data) {
            this.hydroMeteoList.unshift(response.data);
          }
          this.toastr.success(response.message, '', this.options);
          this.hydroMeteoForm.markAsUntouched();

        }, (e: any) => {
          this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
          this.isCentralFormShown = false;
          this.isDefaultEditEnabled = false;
        });
      } else if (this.centralActionType === 'Edit') {
        this.isLoaderShown = true;
        this.routeModalProvider.updateHydroMeteo(this.hydroMeteoForm.getRawValue()).subscribe(response => {
          this.isLoaderShown = false;
          this.isCentralFormShown = false;
          this.isDefaultEditEnabled = false;
          this.getAllHydroMeteoLocation()

          this.toastr.success(response.message, '', this.options);
          this.hydroMeteoLocationForm.markAsUntouched();

        }, (e: any) => {
          this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
          this.isCentralFormShown = false;
          this.isDefaultEditEnabled = false;
        });
      }
    }
  }

  enableCentralEdit(): void {
    this.isDefaultEditEnabled = true;
  }

  updateHydroMeteoRow(hydroMeteo: any) {
    this.routeModalProvider.updateHydroMeteo(hydroMeteo).subscribe(response => {
      if (response && response.data) {
        const hydroMeteoIndex = this.hydroMeteoList.findIndex((hydroMeteos: any) => {
          return hydroMeteos.hydrometeoId == response.data.hydrometeoId && response.data.statusCode == 'D';
        });
        if (hydroMeteoIndex !== -1) {
          this.hydroMeteoList.splice(hydroMeteoIndex, 1);
        }
      }
      this.toastr.success(response.message, '', this.options);

    }, (e: any) => {
      this.toastr.error(translation[this.language].SomethingWrong, '', this.options);

    });
  }

/*   deleteCentraleRecord(): void {
    if (confirm(`${translation[this.language].ConfirmRecordDelete}`)) {
      this.isLoaderShown = true;
      this.routeModalProvider.deleteHydroMeteo(this.tempCentralData.hydrometeoId).subscribe(response => {
        // this.isFormShown = false;
        this.toastr.success(response.message, '', this.options);
        this.getAllHydroMeteo();
        // this.actionType = 'Add';
        // this.isFormShown = false;
        this.isLoaderShown = false;
      }, (e: any) => {
        this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
        this.isFormShown = false;
        this.isLoaderShown = false;
      });
    } else {

    }
    return;
  } */
  
  confirmHydroMeteoCentrale(): void { 
    if (this.tempData.hydroMeteoLocationId) {
      this.isLoaderShown = true;
      this.routeModalProvider.deleteHydroMeteo(this.tempCentralData.hydrometeoId).subscribe(response => {
       // this.isFormShown = false;
        this.toastr.success(response.message, '', this.options);
        //this.actionType = 'Add';
        this.getAllHydroMeteo();
        //this.isFormShown = false;
        this.isLoaderShown = false;
        this.modalRef.hide();
      }, (e: any) => {
        this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
        this.isFormShown = false;
        this.isLoaderShown = false;
      });
    }
  }


}
