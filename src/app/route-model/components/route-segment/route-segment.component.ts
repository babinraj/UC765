import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { SharedService } from '../../../core/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { translation } from '../../../../constants/toastTranslation';
import { ToastrService } from 'ngx-toastr';
import { RoutemodelService } from '../../services/routemodel.service';

@Component({
  selector: 'app-route-segment',
  templateUrl: './route-segment.component.html',
  styleUrls: ['./route-segment.component.scss']
})
export class RouteSegmentComponent implements OnInit {
  tempData: any;
  isLoaderShown = false;
  routeSegmentForm!: FormGroup;
  isLoaderSpinnerShown = false;
  isFormShown: boolean = false;
  isEditEnabled = false;
  submitted = false;
  searchText: any;
  language: any;
  actionType = 'Add';
  options = { positionClass: 'toast-top-right' };

  routeSegmentLists: any = [];

  routeSegmentFormModel = {
    segmentId: 0,
    startPoint: "",
    endPoint: "",
    direction: "",
    distance: null,
    speedRedctionFactor: null,
    trajectId: "",
    defaultRoute: "",
    statusCode: "",
    statusTime: new Date().getFullYear() + '-'+ (new Date().getMonth()+1) + '-' + new Date().getDate() + " " + new Date().getHours() + ':'+ new Date().getMinutes() + ':' + new Date().getSeconds() ,
    bron: "john",
    createdDate: new Date().getFullYear() + '-'+ (new Date().getMonth()+1) + '-' + new Date().getDate() + " " + new Date().getHours() + ':'+ new Date().getMinutes() + ':' + new Date().getSeconds() ,
    lastUpdated: new Date().getFullYear() + '-'+ (new Date().getMonth()+1) + '-' + new Date().getDate() + " " + new Date().getHours() + ':'+ new Date().getMinutes() + ':' + new Date().getSeconds(),
  };
  pilotTrajectLists = [];
  // pilotTrajectLists = [{
  //   label: 'AO-OO',
  //   value: 'AO-OO'
  // }, {
  //   label: 'NE-ZH',
  //   value: 'NE-ZH'
  // }, {
  //   label: 'OO-NP',
  //   value: 'OO-NP'
  // }];
  geoPointIdList: any = [];
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
  }

  ngOnInit(): void {
    this.initForms(this.routeSegmentFormModel);
    this.language = this.activatedRoute.snapshot.params.language;
    this.translate.use(this.activatedRoute.snapshot.params.language);
    this.getAllRouteSegment();
    this.getAllGeoElement();
    this.getAllPilotTraject();
  }

  initForms(userObject: any): void {
    // this.toastr.success(translation[this.language].NoRecordsFound, '', this.options);
    this.routeSegmentForm = this.fb.group({   
      segmentId: [userObject.segmentId],
      startPoint: [userObject.startPoint, [Validators.required]],
      endPoint: [userObject.endPoint, [Validators.required]],
      direction: [userObject.direction, [Validators.required]],
      distance: [userObject.distance, [Validators.required]],
      speedRedctionFactor: [userObject.speedRedctionFactor, [Validators.required]],
      trajectId: [userObject.trajectId, [Validators.required]],
      defaultRoute: [userObject.defaultRoute, [Validators.required]],
      statusCode: [userObject.statusCode, [Validators.required]],
      bron: [userObject.bron, [Validators.required]],
      createdDate: [userObject.createdDate, [Validators.required]],
      lastUpdated: [userObject.lastUpdated, [Validators.required]]
    });
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

  getAllRouteSegment() {
    this.isLoaderShown = true;
    this.routeModalProvider.getAllRouteSegment().subscribe((response: any) => {
      this.isLoaderShown = false;
      if (response.data) {
          // response.data.forEach((routeSegment: any) => {
          //   let splitCreatedDate, splitUpdatedDate
          //   if (routeSegment.createdDate) {
          //     splitCreatedDate = routeSegment.createdDate.split(' ');
          //   }
  
          //   if (routeSegment.lastUpdated) {
          //     splitUpdatedDate = routeSegment.lastUpdated.split(' ');
  
          //   }
          //   if (splitCreatedDate && splitCreatedDate.length > 0 && splitUpdatedDate && splitUpdatedDate.length > 0) {
          //     let splitHipenDate = splitCreatedDate[0].split("-").reverse().join("-");
          //     let splitUpdateHipen = splitUpdatedDate[0].split("-").reverse().join("-");
          //     if (splitHipenDate && splitUpdateHipen) {
          //       let existingCreatedData = new Date(splitHipenDate);
  
          //       let existingUpdatedData = new Date(splitUpdateHipen);
  
          //       let newCreatedDate = existingCreatedData.getFullYear() + '-' + existingCreatedData.getMonth() + 1 + '-' + existingCreatedData.getDate() + " " + existingCreatedData.getHours() + ':' + existingCreatedData.getMinutes() + ':' + existingCreatedData.getSeconds();
          //       let newupdatedDate = existingUpdatedData.getFullYear() + '-' + existingUpdatedData.getMonth() + 1 + '-' + existingUpdatedData.getDate() + " " + existingUpdatedData.getHours() + ':' + existingUpdatedData.getMinutes() + ':' + existingUpdatedData.getSeconds();
  
  
          //       routeSegment.createdDate = newCreatedDate;
          //       routeSegment.lastUpdated = newupdatedDate;
          //     }
          //   }
          // });
          this.routeSegmentLists = response.data;
        
        
      }
    }, (e: any) => {
      this.routeSegmentLists = [];
      this.isLoaderShown = false;
    });
  }

  getAllPilotTraject() {
    this.isLoaderShown = true;
    this.routeModalProvider.getAllPilotTrajects().subscribe((response: any) => {
      this.isLoaderShown = false;
      if (response.data) {
        // response.data.forEach((pilotTraject: IPilotTrajectItem) => {
        //   let splitCreatedDate, splitUpdatedDate
        //   if (pilotTraject.createdDate) {
        //     splitCreatedDate = pilotTraject.createdDate.split(' ');
        //   }

        //   if (pilotTraject.lastUpdated) {
        //     splitUpdatedDate = pilotTraject.lastUpdated.split(' ');

        //   }
        //   if (splitCreatedDate && splitCreatedDate.length > 0 && splitUpdatedDate && splitUpdatedDate.length > 0) {
        //     let splitHipenDate = splitCreatedDate[0].split("-").reverse().join("-");
        //     let splitUpdateHipen = splitUpdatedDate[0].split("-").reverse().join("-");
        //     if (splitHipenDate && splitUpdateHipen) {
        //       let existingCreatedData = new Date(splitHipenDate);

        //       let existingUpdatedData = new Date(splitUpdateHipen);

        //       let newCreatedDate = existingCreatedData.getFullYear() + '-' + existingCreatedData.getMonth() + 1 + '-' + existingCreatedData.getDate() + " " + existingCreatedData.getHours() + ':' + existingCreatedData.getMinutes() + ':' + existingCreatedData.getSeconds();
        //       let newupdatedDate = existingUpdatedData.getFullYear() + '-' + existingUpdatedData.getMonth() + 1 + '-' + existingUpdatedData.getDate() + " " + existingUpdatedData.getHours() + ':' + existingUpdatedData.getMinutes() + ':' + existingUpdatedData.getSeconds();


        //       pilotTraject.createdDate = newCreatedDate;
        //       pilotTraject.lastUpdated = newupdatedDate;
        //     }
        //   }
        // })
        this.pilotTrajectLists = response.data;
      }
    }, (e: any) => {
      this.pilotTrajectLists = [];
      this.isLoaderShown = false;
    });
  }

  viewDetails(dataObj: any, action: string): void {
    this.actionType = action;
    this.submitted = false;
    this.isFormShown = true;
    this.tempData = dataObj;
    this.initForms(dataObj);
  }

  onFormSubmit(): void {

    this.submitted = true;
    if (this.routeSegmentForm.valid && this.routeSegmentForm.touched) {
      if(this.actionType == 'Add') {
        this.isLoaderShown = true;
        this.routeModalProvider.saveRouteSegment(this.routeSegmentForm.getRawValue()).subscribe(response => {
          this.isLoaderShown = false;
          this.isFormShown = false;
          this.isEditEnabled = false;
          if(response.data) {
            if(this.routeSegmentLists.length >0){
              this.routeSegmentLists.push(response.data);
            } else {
              this.routeSegmentLists = response.data;
            }
          }
          this.toastr.success(response.message, '', this.options);
          this.routeSegmentForm.markAsUntouched();
        }, (e: any) => {
          this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
          this.isFormShown = false;
          this.isEditEnabled = false;
        });
      } else if(this.actionType == 'Edit') {
        this.isLoaderShown = true;
        this.routeModalProvider.updateRouteSegment(this.routeSegmentForm.getRawValue()).subscribe(response => {
          this.isLoaderShown = false;
          this.isFormShown = false;
          this.isEditEnabled = false;
          this.getAllRouteSegment();
          this.toastr.success(response.message, '', this.options);
          this.routeSegmentForm.markAsUntouched();
        }, (e: any) => {
          this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
          this.isFormShown = false;
          this.isEditEnabled = false;
        });
      }
    }
  }

  deleteRecord(): void {
    if (confirm(`${translation[this.language].ConfirmDelete} ${this.tempData.segmentId} ?`)) {
      this.isLoaderShown = true;
      this.routeModalProvider.deleterouteSegment(this.tempData.segmentId).subscribe(response => {
        this.isFormShown = false;
        this.toastr.success(response.message, '', this.options);
        this.getAllRouteSegment();

        this.actionType = 'Add';
        this.isFormShown = false;
        this.isLoaderShown = false;
      }, (e:any) => {
        this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
        this.isFormShown = false;
        this.isLoaderShown = false;
      });
    } else {

    }
    return;
  }

  enableEdit(): void {
    this.isEditEnabled = true;
  }

  resetForm(): void {
    this.isEditEnabled = false;
    this.isFormShown = false;
    this.submitted = false;
    this.routeSegmentForm.markAsUntouched();
    this.routeSegmentForm.reset(this.tempData);
    this.tempData = {};

  }

}
