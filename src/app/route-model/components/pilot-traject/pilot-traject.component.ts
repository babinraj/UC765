import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { SharedService } from '../../../core/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { translation } from '../../../../constants/toastTranslation';
import { ToastrService } from 'ngx-toastr';
import { RoutemodelService } from '../../services/routemodel.service';
import { IPilotTrajectItem } from '../../interfaces/routemodel.interface';

@Component({
  selector: 'app-pilot-traject',
  templateUrl: './pilot-traject.component.html',
  styleUrls: ['./pilot-traject.component.scss']
})
export class PilotTrajectComponent implements OnInit {
  tempData: any;
  isLoaderShown = false;
  pilotTrajectForm!: FormGroup;
  isLoaderSpinnerShown = false;
  isFormShown: boolean = false;
  isEditEnabled = false;
  submitted = false;
  searchText: any;
  language: any;
  actionType = 'Add';
  options = { positionClass: 'toast-top-right' };
  pilotTrajectLists: IPilotTrajectItem[] = []
  pilotTrajectModel = {
    trajectId: "",
    trajectName: "",
    cbsLocationStart: "BESEAOWES",
    cbsLocationEnd: "BEEZEE",
    statusCode: "A",
    bron: "john",
    createdDate: new Date().getFullYear() + '-' + new Date().getMonth() + 1 + '-' + new Date().getDate() + " " + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(),
    lastUpdated: new Date().getFullYear() + '-' + new Date().getMonth() + 1 + '-' + new Date().getDate() + " " + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(),
  }

  cbsStart = [{
    label: 'BESEAOWES',
    value: 'BESEAOWES'
  }]
  cbsEnd = [{
    label: 'BEEZEE',
    value: 'BEEZEE'
  }]
  isTrajectExist = "";
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
    this.initForms(this.pilotTrajectModel);
    this.language = this.activatedRoute.snapshot.params.language;
    this.translate.use(this.activatedRoute.snapshot.params.language);
    this.getAllPilotTraject();
    this.getAllGeoElement();
  }

  initForms(userObject: any): void {
    // this.toastr.success(translation[this.language].NoRecordsFound, '', this.options);
    this.pilotTrajectForm = this.fb.group({
      trajectId: [userObject.trajectId, [Validators.required, Validators.maxLength(5)]],
      trajectName: [userObject.trajectName, [Validators.required]],
      cbsLocationStart: [userObject.cbsLocationStart, [Validators.required]],
      cbsLocationEnd: [userObject.cbsLocationEnd, [Validators.required]],
      statusCode: [userObject.statusCode, [Validators.required]],
      bron: ["john", [Validators.required]],
      createdDate: [userObject.createdDate, [Validators.required]],
      lastUpdated: [userObject.lastUpdated, [Validators.required]],
    });
  }

  viewDetails(dataObj: any, action: string): void {
    this.actionType = action;
    this.submitted = false;
    this.isFormShown = true;
    this.tempData = dataObj;
    this.initForms(dataObj);
  }

  getAllPilotTraject() {
    this.isLoaderShown = true;
    this.routeModalProvider.getAllPilotTrajects().subscribe((response: any) => {
      this.isLoaderShown = false;
      if (response.data) {
        response.data.forEach((pilotTraject: IPilotTrajectItem) => {
          let splitCreatedDate, splitUpdatedDate
          if (pilotTraject.createdDate) {
            splitCreatedDate = pilotTraject.createdDate.split(' ');
          }

          if (pilotTraject.lastUpdated) {
            splitUpdatedDate = pilotTraject.lastUpdated.split(' ');

          }
          if (splitCreatedDate && splitCreatedDate.length > 0 && splitUpdatedDate && splitUpdatedDate.length > 0) {
            let splitHipenDate = splitCreatedDate[0].split("-").reverse().join("-");
            let splitUpdateHipen = splitUpdatedDate[0].split("-").reverse().join("-");
            if (splitHipenDate && splitUpdateHipen) {
              let existingCreatedData = new Date(splitHipenDate);

              let existingUpdatedData = new Date(splitUpdateHipen);

              let newCreatedDate = existingCreatedData.getFullYear() + '-' + existingCreatedData.getMonth() + 1 + '-' + existingCreatedData.getDate() + " " + existingCreatedData.getHours() + ':' + existingCreatedData.getMinutes() + ':' + existingCreatedData.getSeconds();
              let newupdatedDate = existingUpdatedData.getFullYear() + '-' + existingUpdatedData.getMonth() + 1 + '-' + existingUpdatedData.getDate() + " " + existingUpdatedData.getHours() + ':' + existingUpdatedData.getMinutes() + ':' + existingUpdatedData.getSeconds();


              pilotTraject.createdDate = newCreatedDate;
              pilotTraject.lastUpdated = newupdatedDate;
            }
          }
        })
        this.pilotTrajectLists = response.data;
      }
    }, (e: any) => {
      this.pilotTrajectLists = [];
      this.isLoaderShown = false;
    });
  }

  onFormSubmit(): void {
    this.submitted = true;
    if (this.pilotTrajectForm.valid && this.pilotTrajectForm.touched) {
      if (this.actionType == 'Add') {
        this.isLoaderShown = true;
        this.routeModalProvider.savePilotTrajects(this.pilotTrajectForm.getRawValue()).subscribe(response => {
          this.isLoaderShown = false;
          this.isFormShown = false;
          this.isEditEnabled = false;
          if (response.data) {
            this.pilotTrajectLists.unshift(response.data);
          }

          this.toastr.success(response.message, '', this.options);
          this.pilotTrajectForm.markAsUntouched();

        }, (e: any) => {
          this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
          this.isFormShown = false;
          this.isEditEnabled = false;
        });
      } else if (this.actionType == 'Edit') {
        this.isLoaderShown = true;
        this.routeModalProvider.updatePilotTrajects(this.pilotTrajectForm.getRawValue()).subscribe(response => {
          this.isLoaderShown = false;
          this.isFormShown = false;
          this.isEditEnabled = false;
          if (response && response.data && response.statusCode == 200) {

            const findpilotTrajectIndex = this.pilotTrajectLists.findIndex((pilotTraject) => {
              return pilotTraject.trajectId === response.data.trajectId;
            })
            if(findpilotTrajectIndex !== -1) {
              this.pilotTrajectLists[findpilotTrajectIndex].trajectName = response.data.trajectName;
              this.pilotTrajectLists[findpilotTrajectIndex].cbsLocationStart = response.data.cbsLocationStart;
              this.pilotTrajectLists[findpilotTrajectIndex].cbsLocationEnd = response.data.cbsLocationEnd;
              this.pilotTrajectLists[findpilotTrajectIndex].bron = response.data.bron;
              this.pilotTrajectLists[findpilotTrajectIndex].statusCode = response.data.statusCode;
              this.pilotTrajectLists[findpilotTrajectIndex].createdDate = response.data.createdDate;
              this.pilotTrajectLists[findpilotTrajectIndex].lastUpdated = response.data.lastUpdated;
              this.pilotTrajectLists[findpilotTrajectIndex].statusTime = response.data.statusTime;
            }
            this.toastr.success(response.message, '', this.options);
            this.pilotTrajectForm.markAsUntouched();
          } else {
            this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
          }
          // this.getAllPilotTraject();

          

        }, (e: any) => {
          this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
          this.isFormShown = false;
          this.isEditEnabled = false;
        });
      }
    }
  }

  getAllGeoElement() {
    this.isLoaderShown = true;
    this.routeModalProvider.getAllCbsLocodes().subscribe((response: any) => {
      this.isLoaderShown = false;
      if (response.data) {
        response.data.forEach((cbs: any) => {
          this.geoPointIdList.push({
            label: cbs.cbsLocationCode,
            value: cbs.cbsLocationName
          })
        })
      }
    }, (e: any) => {
      this.geoPointIdList = [];
      this.isLoaderShown = false;
    });
  }

  checkPilotTrajectExist(event: any) {
    this.isTrajectExist = '';
    if (event.target.value) {
      this.isLoaderSpinnerShown = true;
      this.routeModalProvider.getPilotTrajectExists(event.target.value).subscribe(response => {
        if (response.status === 'Error') {
          this.isTrajectExist = 'notavailable';
        } else {
          //this.toastr.success(response.message, '', this.options);
          this.isTrajectExist = 'available';
        }

        this.isLoaderSpinnerShown = false;
      }, (e: any) => {
        this.isTrajectExist = 'notavailable';
        this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
        this.isLoaderSpinnerShown = false;
      });
    }
  }

  deleteRecord(): void {
    if (confirm(`${translation[this.language].ConfirmDelete} ${this.tempData.trajectId} ?`)) {
      this.isLoaderShown = true;
      this.routeModalProvider.deletePilotTrajects(this.tempData.trajectId).subscribe(response => {
        this.isFormShown = false;
        this.toastr.success(response.message, '', this.options);
        let findTrajectIndex = this.pilotTrajectLists.findIndex((trajectData) => {
          return trajectData.trajectId === this.tempData.trajectId;
        })
        if (findTrajectIndex !== -1) {
          this.pilotTrajectLists.splice(findTrajectIndex, 1)
        }
        this.actionType = 'Add';
        this.isFormShown = false;
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

  resetForm(): void {
    this.isEditEnabled = false;
    this.submitted = false;
    this.isFormShown = false;
    this.pilotTrajectForm.markAsUntouched();
    this.pilotTrajectForm.reset(this.tempData);
    this.tempData = {};
  }

  enableEdit(): void {
    this.isEditEnabled = true;
  }

}
