import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { SharedService } from '../../../core/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { translation } from '../../../../constants/toastTranslation';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { RoutemodelService } from '../../services/routemodel.service';
import { IPositionType, IGeoElementItem } from '../../interfaces/routemodel.interface';

@Component({
  selector: 'app-geo-element',
  templateUrl: './geo-element.component.html',
  styleUrls: ['./geo-element.component.scss']
})
export class GeoElementComponent implements OnInit {
  tabs = [
    { title: 'Geo Basis', content: 'First Tab Content' },
    { title: 'Second', content: 'Second Tab Content', active: true },
    { title: 'Third', content: 'Third Tab Content', removable: true },
    { title: 'Four', content: 'Fourth Tab Content', disabled: true }
  ];
  tempData: any;
  tempPolygonData: any;
  geoPointId: string = '';
  isLoaderShown = false;
  isLoaderSpinnerShown = false;
  submitted = false;
  searchText: any;
  isGeoElementExist = '';
  actionType = 'Add';
  language: any;
  isFormShown = false;
  isEditEnabled = false;
  polygonActionType = 'Add';
  isPolygonEditEnabled = false;
  options = { positionClass: 'toast-top-right' };
  geoElementForm!: FormGroup;
  polygoonForm!: FormGroup;
  isPolygonFormShown: boolean = false;
  polyGoonSearchText: any;
  geoEementDataLists: IGeoElementItem[] = [];
  polygoonLists: any = [];
  modalRef!: BsModalRef;
  polygonFormModel = {
    serial: null,
    geoPointId: "",
    lattitude: null,
    longitude: null,
    localMessage: null,
    x: 5,
    y: 78,
    statusCode: "A",
    statusTime: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + " " + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds()
  }

  firstBlockList = [{
    label: "AW",
    value: "AW"
  },
  {
    label: "BK ",
    value: "BK "
  }, {
    label: "AN",
    value: "AN"
  }, {
    label: "BO",
    value: "BO"
  }]
  polygonSerial = 0;
  geoElementFormModel = {
    "geoPointId": "",
    "geoPointName": "",
    "geoPointType": "P",
    "positionType": "L",
    "isBorderPoint": "N",
    "areaId": "",
    "latitude1": null,
    "longitude1": null,
    "radius": null,
    "latitude2": null,
    "longitude2": null,
    "firstBlock": null,
    "firstBlockSeq": null,
    "secondBlock": null,
    "secondBlockSeq": null,
    "bron": "john",
    "statusCode": 'A',
    "atSea": false, //zee zijde
    "isPort": false,
    "isLock": false,
    "isPassagePoint": null,
    "isAnchoringPoint": false,
    "partOfLockComplex": null, //sluis lock complesx
    "subArea": null,
    "isLockComplex": false,
    "isPassageListPoint": false,
    "passageListOrder": null,
    "exitPoint": null,
    "viaPoint": null,
    "cbsEri": false,
    "cbspTA": false,
    "displayVoyage": "",
    "statusTime": new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + " " + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(),
    "createdDate": new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + " " + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(),
    "lastUpdated": new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + " " + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(),
    "isEtaPoint": null,
    "x1": 4,
    "y1": 7,
    "x2": 45,
    "y2": 62

  };
  positionType: IPositionType[] = []
  geoType: IPositionType[] = []
  statusList: IPositionType[] = [];
  areaLists: IPositionType[] = [];
  isNameSelected: boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    public translate: TranslateService,
    private routeModalProvider: RoutemodelService,
    private modalService: BsModalService) {

    this.statusList = [{
      label: 'Active',
      value: 'A'
    }, {
      label: 'DeActive',
      value: 'D'
    }]
    this.positionType = [{
      label: "Border line point",
      value: "B"
    }, {
      label: "Circular region",
      value: "C"
    }, {
      label: "Line",
      value: "L"
    }, {
      label: "Closed polygon",
      value: "P"
    }];
    this.geoType = [{
      label: "Block",
      value: "B"
    }, {
      label: "Entry/Exit Point",
      value: "E"
    }, {
      label: "Nautical Point",
      value: "N"
    }, {
      label: "Passage Point",
      value: "P"
    }, {
      label: "Silent Passage Point",
      value: "S"
    }, {
      label: "Via Point",
      value: "V"
    }];
    this.areaLists = [{
      label: "SR",
      value: "sr"
    }, {
      label: "RV",
      value: "rv"
    }, {
      label: "KS",
      value: "ks"
    }];
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
    this.initForms(this.geoElementFormModel);
    this.initPolyGonForms(this.polygonFormModel);
    this.language = this.activatedRoute.snapshot.params.language;
    this.translate.use(this.activatedRoute.snapshot.params.language);
    this.getGeoElement();
  }

  openExportLayer(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      class: 'radio-modal',
      ignoreBackdropClick: true
    });

  }

  getGeoElement(): void {
    this.isLoaderShown = true;
    this.routeModalProvider.getAllGeoElemets().subscribe((response: any) => {
      this.isLoaderShown = false;
      if (response.data) {
        this.geoEementDataLists = response.data;
      }
    }, (e: any) => {
      this.geoEementDataLists = [];
      this.isLoaderShown = false;
    });
  }

  getType(gtype: any){
    if(gtype.value === 'B') {
      this.isNameSelected = true;
      this.positionType = [{
        label: "Closed polygon",
        value: "P"
      }];
    } else {
      this.isNameSelected = false;
      this.positionType = [
        {
          label: "Border line point",
          value: "B"
        }, {
          label: "Circular region",
          value: "C"
        }, {
          label: "Line",
          value: "L"
        }, {
          label: "Closed polygon",
          value: "P"
        }
      ]
    }
  }

  initForms(userObject: any): void {
    // this.toastr.success(translation[this.language].NoRecordsFound, '', this.options);

    this.geoElementForm = this.fb.group({
      geoPointId: [userObject.geoPointId, [Validators.required, Validators.maxLength(7)]],
      geoPointName: [userObject.geoPointName, [Validators.maxLength(20)]],
      geoPointType: [userObject.geoPointType, [Validators.required, Validators.maxLength(1)]],
      positionType: [userObject.positionType, [Validators.required, Validators.maxLength(1)]],
      isBorderPoint: [userObject.isBorderPoint, [Validators.required]],
      latitude1: [userObject.latitude1, [Validators.required]],
      longitude1: [userObject.longitude1, [Validators.required]],
      latitude2: [userObject.latitude2, [Validators.required]],
      longitude2: [userObject.longitude2, [Validators.required]],
      radius: [userObject.radius, [Validators.maxLength(4)]],
      firstBlock: [userObject.firstBlock, [Validators.maxLength(3)]],
      firstBlockSeq: [userObject.firstBlockSeq],
      secondBlock: [userObject.secondBlock],
      secondBlockSeq: [userObject.secondBlockSeq],
      statusCode: [userObject.statusCode, [Validators.required]],
      areaId: [userObject.areaId, [Validators.required]],
      atSea: [userObject.atSea],
      isPort: [userObject.isPort],
      isLock: [userObject.isLock],
      isPassagePoint: [userObject.isPassagePoint],
      isAnchoringPoint: [userObject.isAnchoringPoint],
      partOfLockComplex: [userObject.partOfLockComplex],
      subArea: [userObject.subArea],
      isLockComplex: [userObject.isLockComplex],
      isPassageListPoint: [userObject.isPassageListPoint],
      passageListOrder: [userObject.passageListOrder],
      exitPoint: [userObject.exitPoint],
      viaPoint: [userObject.viaPoint],
      cbsEri: [userObject.cbsEri],
      cbspTA: [userObject.cbspTA],
      displayVoyage: [userObject.displayVoyage],
      createdDate: [userObject.createdDate, [Validators.required]],
      statusTime: [userObject.statusTime, [Validators.required]],
      lastUpdated: [userObject.lastUpdated, [Validators.required]],
      x1: [userObject.x1],
      y1: [userObject.y1],
      x2: [userObject.x2],
      y2: [userObject.y2],
      isEtaPoint: [userObject.isEtaPoint],
      bron: [userObject.bron]
    });
  }

  get f() { return this.geoElementForm.controls; }

  setCategoryValidators() {
    const geoPointLat1Control = this.geoElementForm.get('latitude1');
    const geoPointLong1Control = this.geoElementForm.get('longitude1');
    const geoPointLat2Control = this.geoElementForm.get('latitude2');
    const geoPointLong2Control = this.geoElementForm.get('longitude2');
    if(this.geoElementForm && this.geoElementForm.get('geoPointType')){
      const tempData = this.geoElementForm.get('geoPointType');
      if(tempData) {
        tempData.valueChanges.subscribe(geoPointType => {
          if(geoPointType == 'B') {
            // if(geoPointLat1Control) {
            //   geoPointLat1Control.clearValidators();
            //   geoPointLat1Control.updateValueAndValidity();
            // }
            // if(geoPointLong1Control) {
            //   geoPointLong1Control.clearValidators();
            //   geoPointLong1Control.updateValueAndValidity();
            // }
            // if(geoPointLat2Control) {
            //   geoPointLat2Control.clearValidators();
            //   geoPointLat2Control.updateValueAndValidity();
            // }
            // if(geoPointLong2Control) {
            //   geoPointLong2Control.clearValidators();
            //   geoPointLong2Control.updateValueAndValidity();
            // }
          } else {
            // if(geoPointLat1Control) {
            //   geoPointLat1Control.setValidators([Validators.required]);
            //   geoPointLat1Control.updateValueAndValidity();
            // }
            // if(geoPointLong1Control) {
            //   geoPointLong1Control.setValidators([Validators.required]);
            //   geoPointLong1Control.updateValueAndValidity();
            // }
            // if(geoPointLat2Control) {
            //   geoPointLat2Control.setValidators([Validators.required]);
            //   geoPointLat2Control.updateValueAndValidity();
            // }
            // if(geoPointLong2Control) {
            //   geoPointLong2Control.setValidators([Validators.required]);
            //   geoPointLong2Control.updateValueAndValidity();
            // }
          }

        })
      }
    }
  }

  viewDetails(dataObj: any, action: string): void {
    this.actionType = action;
    this.geoPointId = dataObj.geoPointId;
    if (dataObj) {
      if (!dataObj.bron) {
        dataObj.bron = 'john';
      }
    }
    this.tempData = dataObj;
    this.submitted = false;
    this.isFormShown = true;

    this.initForms(dataObj);
    this.setCategoryValidators();
    this.getAllPolygonBygeoPointId();
  }

  deleteRecord(): void {
    if (confirm(`${translation[this.language].ConfirmDelete} ${this.tempData.geoPointId} ?`)) {
      this.isLoaderShown = true;
      this.routeModalProvider.deleteGeoElemet(this.tempData.geoPointId).subscribe(response => {
        this.isFormShown = false;
        this.toastr.success(response.message, '', this.options);
        this.getGeoElement();
        this.actionType = 'Add';
        this.isFormShown = false;
        this.isLoaderShown = false;
      }, (e: any) => {
        this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
        this.isFormShown = false;
        this.isLoaderShown = false;
      });
    }
    return;
  }

  onFormSubmit(): void {
    this.submitted = true;
    if (this.geoElementForm.valid && this.geoElementForm.touched) {
      if (this.actionType == 'Add') {
        if (this.isGeoElementExist === 'available') {
            this.isLoaderShown = true;
            this.routeModalProvider.saveGeoElement(this.geoElementForm.getRawValue()).subscribe(response => {
              this.isLoaderShown = false;
              this.isFormShown = false;
              this.isEditEnabled = false;
              this.toastr.success(response.message, '', this.options);
              if (response.data) {
                this.geoEementDataLists.unshift(response.data);
              }
              this.geoElementForm.markAsUntouched();
              this.isNameSelected = false;
            }, (e: any) => {
              this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
              this.isFormShown = false;
              this.isEditEnabled = false;
            });
          
        } else {
          this.toastr.success("Geo point id already exists..", '', this.options);

        }
      } else if (this.actionType == 'Edit') {
        this.isLoaderShown = true;
        this.routeModalProvider.updateGeoElement(this.geoElementForm.getRawValue()).subscribe(response => {
          this.isLoaderShown = false;
          this.isFormShown = false;
          this.isEditEnabled = false;
          this.toastr.success(response.message, '', this.options);
          // this.getGeoElement();
          this.geoElementForm.markAsUntouched();
        }, (e: any) => {
          this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
          this.isFormShown = false;
          this.isEditEnabled = false;
        })
      }
    }
  }

  checkGeoPointIdExist(event: any) {
    this.isGeoElementExist = '';
    if (event.target.value) {
      this.isLoaderSpinnerShown = true;
      this.routeModalProvider.checkGeoPointExists(event.target.value).subscribe(response => {
        if (response.status === 'Error') {
          if (this.actionType === 'Edit' && event.target.value == this.tempData.geoPointId) {
            this.isGeoElementExist = 'available';
          } else {
            this.isGeoElementExist = 'notavailable';
          }
        } else {
          this.isGeoElementExist = 'available';
        }

        this.isLoaderSpinnerShown = false;
      }, (e: any) => {
        this.isGeoElementExist = 'notavailable';
        this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
        this.isLoaderSpinnerShown = false;
      });
    }
  }

  resetForm(): void {
    this.isEditEnabled = false;
    this.submitted = false;
    this.isFormShown = false;
    this.geoElementForm.markAsUntouched();
    this.tempData = {};
    this.geoElementForm.reset(this.tempData);
    this.isGeoElementExist = '';
  }

  enableEdit(): void {
    this.isEditEnabled = true;
  }

  getSerialCountByGeoPoint(dataObj: any) {
    if (this.geoPointId) {
      this.polygonSerial = 0;
      this.isLoaderSpinnerShown = true;
      this.routeModalProvider.getMaxGeoPolygonSerial(this.geoPointId).subscribe(response => {
        if (response.data >= 0) {
          this.polygonSerial = response.data + 1;
          dataObj.serial = this.polygonSerial;
          this.initPolyGonForms(dataObj);
        }
      }, (e: any) => {
        this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
        this.isLoaderSpinnerShown = false;
      });
    }
  }

  onPolygonFormSubmit() {
    if (this.polygoonForm.valid && this.polygoonForm.touched) {
      if (this.polygonActionType == 'Add') {
        this.isLoaderShown = true;
        this.submitted = true;
        this.routeModalProvider.saveGeoPointPolygon(this.polygoonForm.getRawValue()).subscribe(response => {
          this.isLoaderShown = false;
          if (response.data) {

            this.polygoonLists.push(response.data);
          }

          this.isPolygonFormShown = false;
          this.toastr.success(response.message, '', this.options);
          this.polygoonForm.markAsUntouched();
          this.polygoonForm.reset();
        }, (e: any) => {
          this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
          this.isPolygonFormShown = false;
        });
      } else if (this.polygonActionType == 'Edit') {
        this.isLoaderShown = true;

        this.routeModalProvider.updateGeoPointPolygon(this.polygoonForm.getRawValue()).subscribe(response => {
          this.isLoaderShown = false;
          if (response.data) {
            // this.polygoonLists.push(response.data);
          }
          this.isPolygonFormShown = false;
          // this.isEditEnabled = false;
          this.toastr.success(response.message, '', this.options);
          this.polygoonForm.markAsUntouched();
          this.polygoonForm.reset();
        }, (e: any) => {
          this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
          this.isPolygonFormShown = false;
        });
      }
    }
  }

  convertDateFormat(date: string) {
    const splitDate = date.split(' ');
    let splitHipenDate = splitDate[0].split("-").reverse().join("-");
    if (splitHipenDate) {
      const connectAll = splitHipenDate + ' ' + splitDate[1];
      return connectAll;
    } else {
      return "";
    }
  }

  viewPolyGonDetails(dataObj: any, action: string): void {
    this.polygonActionType = action;
    this.submitted = false;
    this.tempPolygonData = dataObj;
    if (this.geoPointId && this.polygonActionType == 'Edit') {
      dataObj.geoPointId = this.geoPointId;
      this.getSerialCountByGeoPoint(dataObj)
    } else {
      this.isPolygonFormShown = true;
      this.initPolyGonForms(dataObj);
    }
  }

  addPolygoon(dataObj: any, action: string) {
    this.polygonActionType = action;
    this.submitted = false;
    this.isPolygonFormShown = true;
    this.initPolyGonForms(dataObj);
  }

  initPolyGonForms(userObject: any): void {
    this.polygoonForm = this.fb.group({
      geoPointId: [userObject.geoPointId, [Validators.required]],
      serial: [userObject.serial, [Validators.required]],
      x: [userObject.x, [Validators.required]],
      y: [userObject.y, [Validators.required]],
      lattitude: [userObject.lattitude, [Validators.required]],
      longitude: [userObject.longitude, [Validators.required]],
      statusCode: [userObject.statusCode, [Validators.required]],
      statusTime: [userObject.statusTime, [Validators.required]],
    })
  }

  getAllPolygonBygeoPointId() {
    if (this.geoPointId) {
      this.isLoaderShown = true;
      this.routeModalProvider.getAllPolygonByGeoPoint(this.geoPointId).subscribe((response: any) => {
        this.isLoaderShown = false;
        if (response.data) {
          response.data.forEach((polygoonList: any) => {
            polygoonList.statusTime = this.convertDateFormat(polygoonList.statusTime);
          })
          this.polygoonLists = response.data;
        }
      }, (e: any) => {
        this.polygoonLists = [];
        this.isLoaderShown = false;
      });
    }
  }

  polygoonEnableEdit(): void {
    this.isPolygonEditEnabled = true;
  }

  editPolygoon(dataObj: any, action: string) {
    this.polygonActionType = action;
    this.submitted = false;
    this.tempPolygonData = dataObj;
    this.isPolygonFormShown = true;
    this.isPolygonEditEnabled = false;
    this.isPolygonFormShown = true;

    this.initPolyGonForms(dataObj);
    if (this.geoPointId && this.polygonActionType == 'Edit') {
      dataObj.geoPointId = this.geoPointId;

      let splitCreatedDate, splitUpdatedDate

      if (dataObj.createdDate) {
        splitCreatedDate = dataObj.createdDate.split(' ');
      }

      if (dataObj.lastUpdated) {
        splitUpdatedDate = dataObj.lastUpdated.split(' ');

      }
      if (splitCreatedDate && splitCreatedDate.length > 0 && splitUpdatedDate && splitUpdatedDate.length > 0) {
        let splitHipenDate = splitCreatedDate[0].split("-").reverse().join("-");
        let splitUpdateHipen = splitUpdatedDate[0].split("-").reverse().join("-");
        if (splitHipenDate && splitUpdateHipen) {
          let existingCreatedData = new Date(splitHipenDate);

          let existingUpdatedData = new Date(splitUpdateHipen);

          let newCreatedDate = existingCreatedData.getFullYear() + '-' + existingCreatedData.getMonth() + 1 + '-' + existingCreatedData.getDate() + " " + existingCreatedData.getHours() + ':' + existingCreatedData.getMinutes() + ':' + existingCreatedData.getSeconds();
          let newupdatedDate = existingUpdatedData.getFullYear() + '-' + existingUpdatedData.getMonth() + 1 + '-' + existingUpdatedData.getDate() + " " + existingUpdatedData.getHours() + ':' + existingUpdatedData.getMinutes() + ':' + existingUpdatedData.getSeconds();


          dataObj.createdDate = newCreatedDate;
          dataObj.lastUpdated = newupdatedDate;
          this.getSerialCountByGeoPoint(dataObj)
        }
      }
    } else {

    }
  }

  deletePolygoonRecord() {
    if (confirm(`${translation[this.language].ConfirmDelete} ${this.tempPolygonData.geoPointId} ?`)) {
      this.isLoaderShown = true;
      this.routeModalProvider.deleteGeoPointPolygon(this.tempPolygonData.geoPointId, this.tempPolygonData.serial).subscribe(response => {
        this.toastr.success(response.message, '', this.options);
        this.getAllPolygonBygeoPointId();
        this.polygonActionType = 'Add';
        this.isPolygonFormShown = false;
        this.isLoaderShown = false;
      }, (e: any) => {
        this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
        this.isFormShown = false;
        this.isLoaderShown = false;
      });
    } else {

    }
    return;
  }

  resetPolygoonForm(): void {
    this.polygoonForm.markAsUntouched();
    this.isEditEnabled = false;
    this.submitted = false;
    this.polygoonForm.markAsUntouched();
    this.polygoonForm.reset(this.tempPolygonData);
  }

}
