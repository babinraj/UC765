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
import { IPositionType, IGeoElementItem, IBlockList } from '../../interfaces/routemodel.interface';

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
    "lattitude1": null,
    "longitude1": null,
    "radius": null,
    "lattitude2": null,
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
    "x1": 0,
    "y1": 0,
    "x2": 0,
    "y2": 0

  };
  positionType: IPositionType[] = []
  geoType: IPositionType[] = []
  statusList: IPositionType[] = [];
  areaLists: IPositionType[] = [];
  blockLists: IBlockList[] = [];

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
    }];
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
    this.getAllBlock();
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

  getAllBlock(): void {
    this.isLoaderShown = true;
    this.routeModalProvider.getAllBlock().subscribe((response: any) => {
      this.isLoaderShown = false;
      if (response.data) {
        this.blockLists = response.data;
      }
    }, (e: any) => {
      this.geoEementDataLists = [];
      this.isLoaderShown = false;
    });
  }

  getType(gtype: any) {
    if (gtype.value === 'B') {
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
      lattitude1: [userObject.lattitude1],
      longitude1: [userObject.longitude1],
      lattitude2: [userObject.lattitude2],
      longitude2: [userObject.longitude2],
      radius: [userObject.radius],
      firstBlock: [userObject.firstBlock, [Validators.maxLength(3)]],
      firstBlockSeq: [userObject.firstBlockSeq],
      secondBlock: [userObject.secondBlock],
      secondBlockSeq: [userObject.secondBlockSeq],
      statusCode: [userObject.statusCode, [Validators.required]],
      areaId: [userObject.areaId],
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
    const displayVoyage = this.geoElementForm.get('displayVoyage');

    if (displayVoyage) {
      displayVoyage.disable();
      displayVoyage.clearValidators();
      displayVoyage.updateValueAndValidity();
    }

    if (this.geoElementForm.controls['geoPointType'].value == 'B') {

      const geoPointLat1Control = this.geoElementForm.get('lattitude1');
      const geoPointLong1Control = this.geoElementForm.get('longitude1');
      const geoPointLat2Control = this.geoElementForm.get('lattitude2');
      const geoPointLong2Control = this.geoElementForm.get('longitude2');

      const firstBlockControl = this.geoElementForm.get('firstBlock');
      const firstBlockSeqControl = this.geoElementForm.get('firstBlockSeq');
      const secondBlockControl = this.geoElementForm.get('secondBlock');
      const secondBlockSeqControl = this.geoElementForm.get('secondBlockSeq');
      const cbspTA = this.geoElementForm.get('cbspTA');
      const radiusControl = this.geoElementForm.get('radius');
      if (radiusControl) {
        radiusControl.disable();
        radiusControl.clearValidators();
        radiusControl.updateValueAndValidity();
      }
      if (cbspTA) {
        cbspTA.disable();
        cbspTA.clearValidators();
        cbspTA.updateValueAndValidity();
      }

      if (displayVoyage) {
        displayVoyage.enable();
        displayVoyage.clearValidators();
        displayVoyage.updateValueAndValidity();
      }

      if (firstBlockControl) {
        firstBlockControl.disable();
        firstBlockControl.clearValidators();
        firstBlockControl.updateValueAndValidity();
      }

      if (geoPointLat1Control) {
        geoPointLat1Control.disable();
        geoPointLat1Control.clearValidators();
        geoPointLat1Control.updateValueAndValidity();
      }

      if (geoPointLong1Control) {
        geoPointLong1Control.disable();
        geoPointLong1Control.clearValidators();
        geoPointLong1Control.updateValueAndValidity();
      }

      if (geoPointLat2Control) {
        geoPointLat2Control.disable();
        geoPointLat2Control.clearValidators();
        geoPointLat2Control.updateValueAndValidity();
      }

      if (geoPointLong2Control) {
        geoPointLong2Control.disable();
        geoPointLong2Control.clearValidators();
        geoPointLong2Control.updateValueAndValidity();
      }

      if (secondBlockControl) {
        secondBlockControl.disable();
        secondBlockControl.clearValidators();
        secondBlockControl.updateValueAndValidity();
      }

      if (firstBlockSeqControl) {
        firstBlockSeqControl.disable();
        firstBlockSeqControl.clearValidators();
        firstBlockSeqControl.updateValueAndValidity();
      }

      if (secondBlockSeqControl) {
        secondBlockSeqControl.disable();
        secondBlockSeqControl.clearValidators();
        secondBlockSeqControl.updateValueAndValidity();
      }

    }

    if (this.geoElementForm.controls['geoPointType'].value == 'P' && this.geoElementForm.controls['positionType'].value == 'L') {
      const atSea = this.geoElementForm.get('atSea');
      const isPort = this.geoElementForm.get('isPort');
      const isAnchoringPoint = this.geoElementForm.get('isAnchoringPoint');
      const isLock = this.geoElementForm.get('isLock');
      const partOfLockComplex = this.geoElementForm.get('partOfLockComplex');
      const subArea = this.geoElementForm.get('subArea');
      const exitPoint = this.geoElementForm.get('exitPoint');


      if (atSea) {
        atSea.disable();
        atSea.clearValidators();
        atSea.updateValueAndValidity();
      }
      if (isPort) {
        isPort.enable();
        isPort.clearValidators();
        isPort.updateValueAndValidity();
      }

      if (isAnchoringPoint) {
        isAnchoringPoint.disable();
        isAnchoringPoint.clearValidators();
        isAnchoringPoint.updateValueAndValidity();
      }

      if (isLock) {
        isLock.enable();
        isLock.clearValidators();
        isLock.updateValueAndValidity();
      }

      if (partOfLockComplex) {
        partOfLockComplex.enable();
        partOfLockComplex.clearValidators();
        partOfLockComplex.updateValueAndValidity();
      }
      if (subArea) {
        subArea.enable();
        subArea.clearValidators();
        subArea.updateValueAndValidity();
      }

      if (exitPoint) {
        exitPoint.disable();
        exitPoint.clearValidators();
        exitPoint.updateValueAndValidity();
      }
    }
  }

  get f() { return this.geoElementForm.controls; }

  setCategoryValidators() {

    const geoPointLat1Control = this.geoElementForm.get('lattitude1');
    const geoPointLong1Control = this.geoElementForm.get('longitude1');
    const geoPointLat2Control = this.geoElementForm.get('lattitude2');
    const geoPointLong2Control = this.geoElementForm.get('longitude2');

    const firstBlockControl = this.geoElementForm.get('firstBlock');
    const firstBlockSeqControl = this.geoElementForm.get('firstBlockSeq');
    const secondBlockControl = this.geoElementForm.get('secondBlock');
    const secondBlockSeqControl = this.geoElementForm.get('secondBlockSeq');
    const areaId = this.geoElementForm.get('areaId');
    const displayVoyage = this.geoElementForm.get('displayVoyage');
    const cbspTA = this.geoElementForm.get('cbspTA');
    const exitPoint = this.geoElementForm.get('exitPoint');
    const passageListOrder = this.geoElementForm.get('passageListOrder');
    const isPassageListPoint = this.geoElementForm.get('isPassageListPoint');
    const isLockComplex = this.geoElementForm.get('isLockComplex');
    const subArea = this.geoElementForm.get('subArea');
    const partOfLockComplex = this.geoElementForm.get('partOfLockComplex');
    const isLock = this.geoElementForm.get('isLock');
    const isPort = this.geoElementForm.get('isPort');
    const atSea = this.geoElementForm.get('atSea');
    const isAnchoringPoint = this.geoElementForm.get('isAnchoringPoint');

    const areaIdControl = this.geoElementForm.get('areaId');

    const radiusControl = this.geoElementForm.get('radius');

    if (this.geoElementForm && this.geoElementForm.get('geoPointType')) {
      const tempData = this.geoElementForm.get('geoPointType');
      const positionType = this.geoElementForm.get('positionType');

      if (positionType) {
        positionType.valueChanges.subscribe(posType => {
          if (areaIdControl) {
            areaIdControl.disable();
            areaIdControl?.clearValidators();
            areaIdControl?.updateValueAndValidity();
          }
          if (posType === 'C') {
            if (areaIdControl) {
              areaIdControl.enable();
              areaIdControl?.setValidators([Validators.required])
              areaIdControl?.updateValueAndValidity();
            }
          }

          if (posType === 'B') {
            if (areaIdControl) {
              areaIdControl.enable();
              areaIdControl?.setValidators(null)
              areaIdControl?.updateValueAndValidity();
            }
          }
        })
      }

      if (tempData) {
        tempData.valueChanges.subscribe(geoPointType => {

          if (partOfLockComplex) {
            partOfLockComplex.enable();
            partOfLockComplex.clearValidators();
            partOfLockComplex.updateValueAndValidity();
          }

          if (isLock) {
            isLock.enable();
            isLock.clearValidators();
            isLock.updateValueAndValidity();
          }

          if (isLockComplex) {
            isLockComplex.enable();
            isLockComplex.clearValidators();
            isLockComplex.updateValueAndValidity();
          }

          if (atSea) {
            atSea.disable();
            atSea.clearValidators();
            atSea.updateValueAndValidity();
          }


          if (geoPointType == 'B') {
            if (firstBlockControl) {
              firstBlockControl.disable();
              firstBlockControl.clearValidators();
              firstBlockControl.updateValueAndValidity();
            }

            if (isLockComplex) {
              isLockComplex.disable();
              isLockComplex.clearValidators();
              isLockComplex.updateValueAndValidity();
            }

            if (geoPointLat1Control) {
              geoPointLat1Control.disable();
              geoPointLat1Control.clearValidators();
              geoPointLat1Control.updateValueAndValidity();
            }

            if (geoPointLong1Control) {
              geoPointLong1Control.disable();
              geoPointLong1Control.clearValidators();
              geoPointLong1Control.updateValueAndValidity();
            }

            if (geoPointLat2Control) {
              geoPointLat2Control.disable();
              geoPointLat2Control.clearValidators();
              geoPointLat2Control.updateValueAndValidity();
            }

            if (geoPointLong2Control) {
              geoPointLong2Control.disable();
              geoPointLong2Control.clearValidators();
              geoPointLong2Control.updateValueAndValidity();
            }

            if (isPort) {
              isPort.disable();
              isPort.clearValidators();
              isPort.updateValueAndValidity();
            }



            if (isLock) {
              isLock.disable();
              isLock.clearValidators();
              isLock.updateValueAndValidity();
            }

            if (subArea) {
              subArea.disable();
              subArea.clearValidators();
              subArea.updateValueAndValidity();
            }

            if (partOfLockComplex) {
              partOfLockComplex.disable();
              partOfLockComplex.clearValidators();
              partOfLockComplex.updateValueAndValidity();
            }

            if (isPassageListPoint) {
              isPassageListPoint.disable();
              isPassageListPoint.clearValidators();
              isPassageListPoint.updateValueAndValidity()
            }

            if (passageListOrder) {
              passageListOrder.disable();
              passageListOrder.clearValidators();
              passageListOrder.updateValueAndValidity();
            }
            if (cbspTA) {
              cbspTA.disable();
              cbspTA.clearValidators();
              cbspTA.updateValueAndValidity();
            }

            if (displayVoyage) {
              displayVoyage.enable();
              displayVoyage.clearValidators();
              displayVoyage.updateValueAndValidity();
            }

            if (firstBlockSeqControl) {
              firstBlockSeqControl.disable();
              firstBlockSeqControl.clearValidators();
              firstBlockSeqControl.updateValueAndValidity();
            }

            if (secondBlockSeqControl) {
              secondBlockSeqControl.disable();
              secondBlockSeqControl.clearValidators();
              secondBlockSeqControl.updateValueAndValidity();
            }

            if (secondBlockControl) {
              secondBlockControl.disable();
              secondBlockControl.clearValidators();
              secondBlockControl.updateValueAndValidity();
            }

            if (areaIdControl) {
              areaIdControl.enable();
              areaIdControl.setValidators(null);
              areaIdControl.updateValueAndValidity();
            }

            if (radiusControl) {
              radiusControl.disable();
              radiusControl.updateValueAndValidity();
            }

          } else {

            if (geoPointLat1Control) {
              geoPointLat1Control.enable();
              geoPointLat1Control.clearValidators();
              geoPointLat1Control.updateValueAndValidity();
            }

            if (geoPointLong1Control) {
              geoPointLong1Control.enable();
              geoPointLong1Control.clearValidators();
              geoPointLong1Control.updateValueAndValidity();
            }

            if (geoPointLat2Control) {
              geoPointLat2Control.enable();
              geoPointLat2Control.clearValidators();
              geoPointLat2Control.updateValueAndValidity();
            }

            if (geoPointLong2Control) {
              geoPointLong2Control.enable();
              geoPointLong2Control.clearValidators();
              geoPointLong2Control.updateValueAndValidity();
            }

            if (displayVoyage) {
              displayVoyage.disable();
              displayVoyage.updateValueAndValidity();
            }

            if (isPort) {
              isPort.enable();
              isPort.clearValidators();
              isPort.updateValueAndValidity();
            }

            if (cbspTA) {
              cbspTA.enable();
              cbspTA.clearValidators();
              cbspTA.updateValueAndValidity();
            }

            if (firstBlockControl) {
              firstBlockControl.enable();
              firstBlockControl.updateValueAndValidity();
            }

            if (secondBlockControl) {
              secondBlockControl.enable();
              secondBlockControl.updateValueAndValidity();
            }

            if (areaIdControl) {
              areaIdControl.disable();
              areaIdControl.updateValueAndValidity();
            }

            if (radiusControl) {
              radiusControl.enable();
              radiusControl.updateValueAndValidity();

            }
            if (subArea) {
              subArea.enable();
              subArea.clearValidators();
              subArea.updateValueAndValidity();
            }
          }

          if (geoPointType == 'V') {
            if (exitPoint) {
              exitPoint.enable();
              exitPoint.clearValidators();
              exitPoint.updateValueAndValidity();
            }

            if (isAnchoringPoint) {
              isAnchoringPoint.enable();
              isAnchoringPoint.clearValidators();
              isAnchoringPoint.updateValueAndValidity();
            }

            if (isLock) {
              isLock.disable();
              isLock.clearValidators();
              isLock.updateValueAndValidity();
            }

            if (partOfLockComplex) {
              partOfLockComplex.disable();
              partOfLockComplex.clearValidators();
              partOfLockComplex.updateValueAndValidity();
            }

            if (isLockComplex) {
              isLockComplex.disable();
              isLockComplex.clearValidators();
              isLockComplex.updateValueAndValidity();
            }
          } else {
            if (exitPoint) {
              exitPoint.disable();
              exitPoint.clearValidators();
              exitPoint.updateValueAndValidity();
            }

            if (isAnchoringPoint) {
              isAnchoringPoint.disable();
              isAnchoringPoint.clearValidators();
              isAnchoringPoint.updateValueAndValidity();
            }

          }

          if (geoPointType === 'E') {
            if (atSea) {
              atSea.enable();
              atSea.clearValidators();
              atSea.updateValueAndValidity();
            }
          }

          if (geoPointType == 'E' || geoPointType == 'N') {
            if (passageListOrder) {
              passageListOrder.enable();
              passageListOrder.clearValidators();
              passageListOrder.updateValueAndValidity();
            }



            if (isPassageListPoint) {
              isPassageListPoint.enable();
              isPassageListPoint.clearValidators();
              isPassageListPoint.updateValueAndValidity();
            }
          } else {
            if (passageListOrder) {
              passageListOrder.disable();
              passageListOrder.clearValidators();
              passageListOrder.updateValueAndValidity();
            }



            if (isPassageListPoint) {
              isPassageListPoint.disable();
              isPassageListPoint.clearValidators();
              isPassageListPoint.updateValueAndValidity();
            }
          }
        })
      }
    }

    if (this.geoElementForm && this.geoElementForm.get('positionType')) {
      const pType = this.geoElementForm.get('positionType');
      if (pType) {
        pType.valueChanges.subscribe(pT => {
          if (pT == 'C') {
            if (radiusControl) {
              radiusControl.enable();
              radiusControl.setValidators(Validators.required);
              radiusControl.updateValueAndValidity();
            }
          } else {
            if (radiusControl) {
              radiusControl.disable();
              radiusControl.clearValidators();
              radiusControl.updateValueAndValidity();

            }
          }
          if (pT == 'L') {
            if (atSea) {
              atSea.disable();
              atSea.clearValidators();
              atSea.updateValueAndValidity();
            }
          }
        })
      }
    }
  }

  viewDetails(dataObj: any, action: string): void {
    
    this.getType(dataObj);
    this.actionType = action;
    this.geoPointId = dataObj.geoPointId;
    if (dataObj) {
      if (!dataObj.bron) {
        dataObj.bron = 'john';
      }
    }
    if (dataObj.geoPointType == 'B') {
      dataObj.lattitude1 = null;
      dataObj.lattitude2 = null;
      dataObj.longitude1 = null;
      dataObj.longitude2 = null;
      dataObj.firstBlockSeq = null;
      dataObj.secondBlockSeq = null;
      dataObj.radius = null;

      

    }
    this.tempData = dataObj;
    this.submitted = false;
    this.isFormShown = true;

    this.initForms(dataObj);
    this.setCategoryValidators();
    this.getAllPolygonBygeoPointId(dataObj);
  }


  deleteRecord(): void {
    if (confirm(`${translation[this.language].ConfirmRecordDelete}`)) {
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
        // if (this.isGeoElementExist === 'available') {
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

        // } else {
        //   this.toastr.success("Geo point id already exists..", '', this.options);

        // }
      } else if (this.actionType == 'Edit') {
        this.isLoaderShown = true;
        this.routeModalProvider.updateGeoElement(this.geoElementForm.getRawValue()).subscribe(response => {
          this.isLoaderShown = false;
          this.isFormShown = false;
          this.isEditEnabled = false;
          this.toastr.success(response.message, '', this.options);
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
        if (this.tempData && this.tempData.geoPointType === 'B') {
          const polygonData = {
            blockId: this.polygoonForm.getRawValue().geoPointId,
            lattitude: this.polygoonForm.getRawValue().lattitude,
            longitude: this.polygoonForm.getRawValue().longitude,
            // serial: this.polygoonForm.getRawValue().serial,
            statusCode: this.polygoonForm.getRawValue().statusCode,
            statusTime: this.polygoonForm.getRawValue().statusTime,
            x: this.polygoonForm.getRawValue().x,
            y: this.polygoonForm.getRawValue().y
          }
          this.routeModalProvider.saveBlockPolygon(polygonData).subscribe(response => {
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
        } else {
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
        }
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
      this.initPolyGonForms(dataObj);
      // this.getSerialCountByGeoPoint(dataObj)
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
      // serial: [userObject.serial, [Validators.required]],
      x: [userObject.x, [Validators.required]],
      y: [userObject.y, [Validators.required]],
      lattitude: [userObject.lattitude, [Validators.required]],
      longitude: [userObject.longitude, [Validators.required]],
      statusCode: [userObject.statusCode, [Validators.required]],
      statusTime: [userObject.statusTime, [Validators.required]],
    })
  }

  getAllPolygonBygeoPointId(dataObj: any) {
    if (this.geoPointId) {
      if (this.tempData.geoPointType === 'B') {
        this.isLoaderShown = true;
        this.routeModalProvider.getAllBlockPolygonByGeoPoint(this.geoPointId).subscribe((response: any) => {
          this.isLoaderShown = false;
          if (response.data) {
            if (dataObj) {
              if (dataObj.lattitude1) {
                response.data.unshift({
                  // serial: response.data.length,
                  geoPointId: dataObj.geoPointId,
                  x: dataObj.x1,
                  y: dataObj.y1,
                  lattitude: dataObj.lattitude1,
                  localMessage: null,
                  statusCode: dataObj.statusCode,
                  statusTime: dataObj.statusTime,
                  longitude: dataObj.longitude1
                });
              }
              if (dataObj.lattitude2) {
                response.data.unshift({
                  // serial: response.data.length,
                  geoPointId: dataObj.geoPointId,
                  x: dataObj.x1,
                  y: dataObj.y1,
                  lattitude: dataObj.lattitude2,
                  localMessage: null,
                  statusCode: dataObj.statusCode,
                  statusTime: dataObj.statusTime,
                  longitude: dataObj.longitude2
                });
              }

            }
            response.data.forEach((polygoonList: any) => {
              polygoonList.statusTime = this.convertDateFormat(polygoonList.statusTime);
            });
            this.polygoonLists = response.data;
          }
        }, (e: any) => {
          this.polygoonLists = [];
          this.isLoaderShown = false;
        });
      } else {
        this.isLoaderShown = true;
        this.routeModalProvider.getAllPolygonByGeoPoint(this.geoPointId).subscribe((response: any) => {
          this.isLoaderShown = false;
          if (response.data) {
            if (dataObj) {
              if (dataObj.lattitude1 || dataObj.longitude1) {
                response.data.unshift({
                  // serial: response.data.length,
                  geoPointId: dataObj.geoPointId,
                  x: dataObj.x1,
                  y: dataObj.y1,
                  lattitude: dataObj.lattitude1,
                  localMessage: null,
                  statusCode: dataObj.statusCode,
                  statusTime: dataObj.statusTime,
                  longitude: dataObj.longitude1
                });
              }
              if (dataObj.lattitude2 || dataObj.longitude2) {
                response.data.unshift({
                  // serial: response.data.length,
                  geoPointId: dataObj.geoPointId,
                  x: dataObj.x1,
                  y: dataObj.y1,
                  lattitude: dataObj.lattitude2,
                  localMessage: null,
                  statusCode: dataObj.statusCode,
                  statusTime: dataObj.statusTime,
                  longitude: dataObj.longitude2
                });
              }

            }
            response.data.forEach((polygoonList: any) => {
              polygoonList.statusTime = this.convertDateFormat(polygoonList.statusTime);
            });
            this.polygoonLists = response.data;
          }
        }, (e: any) => {
          this.polygoonLists = [];
          this.isLoaderShown = false;
        });
      }
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
        this.initPolyGonForms(dataObj);
      }
    } else {

    }
  }

  deletePolygoonRecord() {
    if (confirm(`${translation[this.language].ConfirmRecordDelete}`)) {
      this.isLoaderShown = true;
      this.routeModalProvider.deleteGeoPointPolygon(this.tempPolygonData.geoPointId, this.tempPolygonData.serial).subscribe(response => {
        this.toastr.success(response.message, '', this.options);
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
