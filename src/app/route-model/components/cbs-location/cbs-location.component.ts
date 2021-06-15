import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { SharedService } from '../../../core/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { translation } from '../../../../constants/toastTranslation';
import { ToastrService } from 'ngx-toastr';
import { RoutemodelService } from '../../services/routemodel.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-cbs-location',
  templateUrl: './cbs-location.component.html',
  styleUrls: ['./cbs-location.component.scss']
})
export class CbsLocationComponent implements OnInit {
  tempData: any;
  isLoaderShown = false;
  cbsLocationForm!: FormGroup;
  isLoaderSpinnerShown = false;
  isFormShown: boolean = false;
  isEditEnabled = false;
  submitted = false;
  searchText: any;
  language: any;
  actionType = 'Add';
  options = { positionClass: 'toast-top-right' };
  cbsLocationCodeLists = [{
    cbsId: 0,
    cbsLocationCode: "HEXA",
    geoPointId: "Klm001",
    defaultGeoPointId: "ja",
    defaultCbsCode: "ja",
    cbsLocationName: "Technopark",
    isrsLocationCode: "HEXA001010",
    statusCode: "A",
    bron: "john",
    createdDate: new Date().getFullYear() + '-' + new Date().getMonth() + 1 + '-' + new Date().getDate() + " " + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(),
    lastUpdated: new Date().getFullYear() + '-' + new Date().getMonth() + 1 + '-' + new Date().getDate() + " " + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(),
 }]
  cbsLocationCodeModel = {
    cbsId: 0,
    cbsLocationCode: "",
    geoPointId: "",
    defaultGeoPointId: "ja",
    defaultCbsCode: "ja",
    cbsLocationName: "",
    isrsLocationCode: "",
    statusCode: "A",
    bron: "john",
    /* createdDate: new Date().getFullYear() + '-' + new Date().getMonth() + 1 + '-' + new Date().getDate() + " " + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(),
    lastUpdated: new Date().getFullYear() + '-' + new Date().getMonth() + 1 + '-' + new Date().getDate() + " " + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(),
 */ 
	lastUpdated: '',
    createdDate: '',
 }
  defaultCbsCode = [{
    label: "ja",
    value: 'ja'
  }]
  geoPointIdList: any = [];
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
  }

  ngOnInit(): void {

    this.initForms(this.cbsLocationCodeModel);
    this.language = this.activatedRoute.snapshot.params.language;
    this.translate.use(this.activatedRoute.snapshot.params.language);
    this.getCbsLocodes();
    this.getAllGeoElement();
  }

  initForms(userObject: any): void {
    // this.toastr.success(translation[this.language].NoRecordsFound, '', this.options);
    this.cbsLocationForm = this.fb.group({
      cbsId: [userObject.cbsId],
      cbsLocationCode: [userObject.cbsLocationCode, [Validators.required, Validators.maxLength(15)]],
      geoPointId: [userObject.geoPointId, [Validators.required]],
      defaultGeoPointId: [userObject.defaultGeoPointId, [Validators.required]],
      defaultCbsCode: [userObject.defaultCbsCode, [Validators.required]],
      cbsLocationName: [userObject.cbsLocationName, [Validators.required]],
      isrsLocationCode: [userObject.isrsLocationCode, [Validators.required]],
      bron: [userObject.bron],
      statusCode: [userObject.statusCode, [Validators.required]],
      createdDate: [userObject.createdDate, [Validators.required]],
      lastUpdated: [userObject.lastUpdated, [Validators.required]]
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

  viewDetails(dataObj: any, action: string): void {
    this.actionType = action;
    this.submitted = false;
    this.isFormShown = true;
    this.tempData = dataObj;
    this.initForms(dataObj);
  }

  onFormSubmit(): void {
    this.submitted = true;
    if (this.cbsLocationForm.valid && this.cbsLocationForm.touched) {
      if (this.actionType == 'Add') {
        this.isLoaderShown = true;
        this.routeModalProvider.saveCbsLocodes(this.cbsLocationForm.getRawValue()).subscribe(response => {
          this.isLoaderShown = false;
          this.isFormShown = false;
          this.isEditEnabled = false;
          if (response.data) {
            this.cbsLocationCodeLists.unshift(response.data);
          }
          this.toastr.success(response.message, '', this.options);
          this.cbsLocationForm.markAsUntouched();
        }, (e: any) => {
          this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
          this.isFormShown = false;
          this.isEditEnabled = false;
        });
      } else if (this.actionType == 'Edit') {
        this.isLoaderShown = true;
        this.routeModalProvider.updateCbsLocodes(this.cbsLocationForm.getRawValue()).subscribe(response => {
          this.isLoaderShown = false;
          this.isFormShown = false;
          this.isEditEnabled = false;
          if (response.data) {
            let cbsLocationIndex = this.cbsLocationCodeLists.findIndex((cbs) => {
              return cbs.cbsId === response.data.cbsId
            })
            if (cbsLocationIndex !== -1) {
              this.cbsLocationCodeLists[cbsLocationIndex].cbsLocationCode = response.data.cbsLocationCode;
              this.cbsLocationCodeLists[cbsLocationIndex].cbsLocationName = response.data.cbsLocationName;
              this.cbsLocationCodeLists[cbsLocationIndex].defaultCbsCode = response.data.defaultCbsCode;
              this.cbsLocationCodeLists[cbsLocationIndex].defaultGeoPointId = response.data.defaultGeoPointId;
              this.cbsLocationCodeLists[cbsLocationIndex].geoPointId = response.data.geoPointId;
              this.cbsLocationCodeLists[cbsLocationIndex].isrsLocationCode = response.data.isrsLocationCode;
              this.cbsLocationCodeLists[cbsLocationIndex].statusCode = response.data.statusCode;
              this.cbsLocationCodeLists[cbsLocationIndex].createdDate = response.data.createdDate;
              this.cbsLocationCodeLists[cbsLocationIndex].lastUpdated = response.data.lastUpdated;
            }
          }

          this.toastr.success(response.message, '', this.options);
          this.cbsLocationForm.markAsUntouched();

        }, (e: any) => {
          this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
          this.isFormShown = false;
          this.isEditEnabled = false;
        });
      }
    }
  }

  deleteRecord(cbsLocTemplate: TemplateRef<any>): void {
    this.openDeleteModal(cbsLocTemplate);

    // if (confirm(`${translation[this.language].ConfirmRecordDelete}`)) {
    //   this.isLoaderShown = true;
    //   this.routeModalProvider.deleteCbsLocodes(this.tempData.cbsId).subscribe(response => {
    //     if (response && response.statusCode === 200) {
    //       this.isFormShown = false;
    //       const cbsLocationIndex = this.cbsLocationCodeLists.findIndex((cbsLocationCode) => {
    //         return cbsLocationCode.cbsId === this.tempData.cbsId;
    //       })
    //       if (cbsLocationIndex !== -1) {
    //         this.cbsLocationCodeLists.splice(cbsLocationIndex, 1)
    //       }
    //       this.toastr.success(response.message, '', this.options);
    //       this.actionType = 'Add';
    //       this.isFormShown = false;
    //       this.isLoaderShown = false;
    //     } else {
    //       this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
    //     }
    //   }, (e: any) => {
    //     this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
    //     this.isFormShown = false;
    //     this.isLoaderShown = false;
    //   });
    // } else {

    // }
    return;
  }

  openDeleteModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  confirmCbsLoc(): void {
    if (this.tempData.cbsId) {
      this.isLoaderShown = true;
      this.routeModalProvider.deleteCbsLocodes(this.tempData.cbsId).subscribe(response => {
        if (response && response.statusCode === 200) {
          this.isFormShown = false;
          const cbsLocationIndex = this.cbsLocationCodeLists.findIndex((cbsLocationCode) => {
            return cbsLocationCode.cbsId === this.tempData.cbsId;
          })
          if (cbsLocationIndex !== -1) {
            this.cbsLocationCodeLists.splice(cbsLocationIndex, 1)
          }
          this.toastr.success(response.message, '', this.options);
          this.actionType = 'Add';
          this.isFormShown = false;
          this.isLoaderShown = false;
        } else {
          this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
        }
        this.modalRef.hide();
      }, (e: any) => {
        this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
        this.isFormShown = false;
        this.isLoaderShown = false;
      });
    }
  }

  declineCbsLoc(): void {
    this.modalRef.hide();
  }

  resetForm(): void {
    this.isEditEnabled = false;
    this.submitted = false;
    this.cbsLocationForm.markAsUntouched();
    this.cbsLocationForm.reset(this.tempData);
    this.tempData = {};
  }

  enableEdit(): void {
    this.isEditEnabled = true;
  }

}
