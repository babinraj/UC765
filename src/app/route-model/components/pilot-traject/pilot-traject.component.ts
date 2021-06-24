import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { SharedService } from '../../../core/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { translation } from '../../../../constants/toastTranslation';
import { ToastrService } from 'ngx-toastr';
import { RoutemodelService } from '../../services/routemodel.service';
import { IPilotTrajectItem } from '../../interfaces/routemodel.interface';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

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
    cbsLocationStart: "",
    cbsLocationEnd: "",
    statusCode: "A",
    bron: localStorage.getItem('userName'),
    lastUpdated: '',
    createdDate: '',
  }
  isTrajectExist = "";
  geoPointIdList: any = [];
  modalRef!: BsModalRef;
  isAdd: boolean = false;

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
      trajectName: [userObject.trajectName],
      cbsLocationStart: [userObject.cbsLocationStart, [Validators.required]],
      cbsLocationEnd: [userObject.cbsLocationEnd, [Validators.required]],
      statusCode: [userObject.statusCode, [Validators.required]],
      bron: [userObject.bron, [Validators.required]],
      createdDate: [userObject.createdDate],
      lastUpdated: [userObject.lastUpdated],
    });
  }

  get f() { return this.pilotTrajectForm.controls; }


  viewDetails(dataObj: any, action: string): void {
    this.actionType = action;
    this.submitted = false;
    this.isFormShown = true;
    this.tempData = dataObj;
    this.initForms(dataObj);

    if (this.actionType === 'Add' && !this.isAdd) {
      this.isAdd = true;
      this.pilotTrajectLists.unshift(this.pilotTrajectModel)
    }
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
    if (this.pilotTrajectForm.valid && this.pilotTrajectForm.touched) {
      if (this.actionType == 'Add') {
        this.isLoaderShown = true;
        this.routeModalProvider.savePilotTrajects(this.pilotTrajectForm.getRawValue()).subscribe(response => {
          this.isLoaderShown = false;
          this.isFormShown = false;
          this.isEditEnabled = false;
          if (response.data) {
            this.pilotTrajectLists[0] = response.data;
          }

          this.toastr.success(translation[this.language].PilotTrajectcreate, '', this.options);
		  this.pilotTrajectForm.markAsUntouched();
          this.isAdd = false;

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
            if (findpilotTrajectIndex !== -1) {
              this.pilotTrajectLists[findpilotTrajectIndex].trajectName = response.data.trajectName;
              this.pilotTrajectLists[findpilotTrajectIndex].cbsLocationStart = response.data.cbsLocationStart;
              this.pilotTrajectLists[findpilotTrajectIndex].cbsLocationEnd = response.data.cbsLocationEnd;
              this.pilotTrajectLists[findpilotTrajectIndex].bron = response.data.bron;
              this.pilotTrajectLists[findpilotTrajectIndex].statusCode = response.data.statusCode;
              this.pilotTrajectLists[findpilotTrajectIndex].createdDate = response.data.createdDate;
              this.pilotTrajectLists[findpilotTrajectIndex].lastUpdated = response.data.lastUpdated;
              this.pilotTrajectLists[findpilotTrajectIndex].statusTime = response.data.statusTime;
            }
            this.toastr.success(translation[this.language].PilotTrajectUpdate, '', this.options);
			this.pilotTrajectForm.markAsUntouched();
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
    if (event.target.value && this.actionType == 'Add') {
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

  deleteRecord(template: TemplateRef<any>): void {
    this.openDeleteModal(template);

    return;
  }

  openDeleteModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirmPilotTraject(): void {
    if (this.tempData.trajectId) {
      this.isLoaderShown = true;
      this.routeModalProvider.deletePilotTrajects(this.tempData.trajectId).subscribe(response => {
        this.isFormShown = false;
        this.toastr.success(translation[this.language].PilotTrajectDelete, '', this.options);
		let findTrajectIndex = this.pilotTrajectLists.findIndex((trajectData) => {
          return trajectData.trajectId === this.tempData.trajectId;
        })
        if (findTrajectIndex !== -1) {
          this.pilotTrajectLists.splice(findTrajectIndex, 1)
        }

        this.actionType = 'Add';
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

  declinePilotTraject(): void {
    this.modalRef.hide();
  }


  resetForm(): void {
    this.isEditEnabled = false;
    this.submitted = false;
    this.isFormShown = false;
    this.pilotTrajectForm.markAsUntouched();
    this.pilotTrajectForm.reset(this.tempData);
    this.tempData = {};
    if (this.isAdd) {
      this.isAdd = false;
      this.pilotTrajectLists.splice(0, 1);

    }
  }

  enableEdit(): void {
    this.isEditEnabled = true;
  }

}
