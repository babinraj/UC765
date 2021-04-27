import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { DomainService } from '../../services/domain.service';
import { SharedService } from '../../../core/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { translation } from '../../../../constants/toastTranslation';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-erinot-bericht',
  templateUrl: './erinot-bericht.component.html',
  styleUrls: ['./erinot-bericht.component.scss']
})
export class ErinotBerichtComponent implements OnInit {

  tempData: Array<any> = [];
  isLoaderShown = false;
  searchText: any;
  actionType = 'Add';
  language: any;
  isEditEnabled = false;
  selectedId: number = 0;
  editId: any;
  options = { positionClass: 'toast-top-right' };
  partnerList: Array<any> = [];
  geoPointList: Array<any> = [];
  directionList: Array<any> = [];
  isAdd = false;
  dataList: Array<any> = [];
  isMode = '';

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
   * Intit method for setting translation and calling fetching erinotMessage list
   * @param null;
   */
  ngOnInit(): void {
    this.language = this.activatedRoute.snapshot.params.language;
    this.translate.use(this.activatedRoute.snapshot.params.language);
    this.getGeoPointList();
    this.getDirectionList();
    this.getPartnerList();
    this.getErinotMessageList();
  }

  /**
   * Method for fetching geo point list
   * @param null;
   */
  getGeoPointList(): void {
    this.isLoaderShown = true;
    this.domainServie.getGeoPointDetails().subscribe(response => {
      this.isLoaderShown = false;
      if (response.data) {
        this.geoPointList = response.data.objList;
      } else {
        this.geoPointList = [];
      }
    }, e => {
      this.isLoaderShown = false;
    })
  }

  /**
   * Method for fetching partner Id list
   * @param null;
   */
  getPartnerList(): void {
    this.isLoaderShown = true;
    this.domainServie.getPartnerDetails().subscribe(response => {
      this.isLoaderShown = false;
      if (response.data) {
        this.partnerList = response.data.objList;
      } else {
        this.partnerList = [];
      }
    }, e => {
      this.isLoaderShown = false;
    })
  }

  /**
   * Method for fetching erinotMessage list
   * @param null;
   */
  getErinotMessageList(): void {
    this.isLoaderShown = true;
    this.domainServie.getErinotMessageList().subscribe(response => {
      this.isLoaderShown = false;
      if (response.data) {
        this.dataList = response.data.objList;
        this.tempData = response.data.objList;
      } else {
        this.dataList = [];
      }
    }, e => {
      this.isLoaderShown = false;
    })
  }


  /**
* Method for fetching direction list
* @param null;
*/
  getDirectionList(): void {
    this.isLoaderShown = true;
    this.domainServie.getDirectionDetails().subscribe(response => {
      this.isLoaderShown = false;
      if (response.data) {
        this.directionList = response.data.objList;
      } else {
        this.directionList = [];
      }
    }, e => {
      this.isLoaderShown = false;
    })
  }

  /**
 * Method to reset fields
 */
  resetFields(): void {
    this.selectedId = 0;
    this.isAdd = false;
    this.isEditEnabled = false;
    this.isMode = '';
  }


  /**
   * Method to set selected Id
   * @param dataObj;
   */
  viewDetails(dataObj: any): void {
    this.selectedId = dataObj.erinotId;
    this.isEditEnabled = true;    
    this.editId = this.selectedId;
    this.isMode = 'edit';
  }


  /**
   * Method to add new item
   */
  addItem() {
    this.isAdd = true;
    this.dataList.unshift({
      erinotId: 0,
      geoPointId: this.geoPointList[0],
      directionId: this.directionList[0],
      partnerId: this.partnerList[0].partnerId,
      is_operational: 0,
      erinotStatus: 'A',
      lastEditedBy: localStorage.getItem('userName'),
      lastupdatedOn: '',
      createdOn: ''
    })
  }

  /**
   * Method to submit form
   * @param null;
   */
  onFormSubmit() {
    let index = this.dataList.findIndex(x => x.erinotId === this.selectedId);
    let method = this.dataList[index].erinotId === 0 ? 'Add' : 'Edit';
    this.isLoaderShown = true;
    this.domainServie.erinotMessageFormAction(this.dataList[index], method).subscribe(response => {
      this.isLoaderShown = false;
      this.toastr.success(response.message, '', this.options);
      this.resetFields();
      this.getErinotMessageList();
    }, (e) => {
      this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
      this.getErinotMessageList();
    })
  }

  /**
 * Method to delete record
 * @param null;
 */
  deleteRecord() {
    let index = this.dataList.findIndex(x => x.erinotId === this.selectedId);
    if (this.dataList[index].erinotId !== 0) {
      if (confirm(`${translation[this.language].ConfirmDelete} ${this.selectedId} ?`)) {
        this.isLoaderShown = true;
        this.domainServie.deleteErinotMessageDetails(this.selectedId).subscribe(response => {
          this.toastr.success(response.message, '', this.options);
          this.getErinotMessageList();
          this.isLoaderShown = false;
        }, e => {
          this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
          this.isLoaderShown = false;
        });
      }
    } else {
      this.dataList.splice(index, 1)
    }
    this.resetFields();
  }

  /**
 * Method to reset form
 * @param null;
 */
  resetForm(): void {
    this.resetFields();
    this.getErinotMessageList();
    this.isEditEnabled = false;
    this.isMode = '';
    this.isAdd = false;
  }

  /**
   * Method to enable edit
   * @param null;
   */
  enableEdit(): void {
    this.editId = '';
    this.isEditEnabled = true;
   // this.editId = this.selectedId;
  }

}

