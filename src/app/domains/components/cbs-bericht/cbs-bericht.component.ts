import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { DomainService } from '../../services/domain.service';
import { SharedService } from '../../../core/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { translation } from '../../../../constants/toastTranslation';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cbs-bericht',
  templateUrl: './cbs-bericht.component.html',
  styleUrls: ['./cbs-bericht.component.scss']
})
export class CbsBerichtComponent implements OnInit {

  tempData: Array<any> = [];
  isLoaderShown = false;
  searchText: any;
  actionType = 'Add';
  language: any;
  isEditEnabled = false;
  selectedId: any;
  editId: any;
  options = { positionClass: 'toast-top-right' };
  partnerList: Array<any> = [];
  areaList: Array<any> = [];
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
   * Intit method for setting translation and calling fetching superblock list
   * @param null;
   */
  ngOnInit(): void {
    this.language = this.activatedRoute.snapshot.params.language;
    this.translate.use(this.activatedRoute.snapshot.params.language);
    this.getAreaList();
    this.getPartnerList();
    this.getCBSMessageList();
  }

  /**
   * Method for fetching Area list
   * @param null;
   */
  getAreaList(): void {
    this.isLoaderShown = true;
    this.domainServie.getAllAreaDetails().subscribe(response => {
      this.isLoaderShown = false;
      if (response.data) {
        this.areaList = response.data.objList;
      } else {
        this.areaList = [];
      }
    }, e => {
      this.isLoaderShown = false;
    })
  }

  /**
   * Method for fetching Area list
   * @param null;
   */
  getCBSMessageList(): void {
    this.isLoaderShown = true;
    this.domainServie.getCBSMessageDetails().subscribe(response => {
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
* Method for fetching Partner list
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
 * Method to reset fields
 */
  resetFields(): void {
    this.selectedId = '';
    this.isAdd = false;
    this.isEditEnabled = false;
    this.isMode = '';

  }


  /**
   * Method to set selected Id
   * @param dataObj;
   */
  viewDetails(dataObj: any): void {
    this.selectedId = dataObj.id;
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
      id: 0,
      area_id: this.areaList[0].area_Id,
      partner_id: this.partnerList[0].partnerId,
      is_operational: 0,
      status: 'A',
      bron: localStorage.getItem('userName'),
      lastupdatedOn: '',
      createdOn: ''
    })
  }

  /**
   * Method to submit form
   * @param null;
   */
  onFormSubmit() {
    let index = this.dataList.findIndex(x => x.id === this.selectedId);
    let method = this.dataList[index].id === 0 ? 'Add' : 'Edit';
    this.isLoaderShown = true;
    this.domainServie.cbsMessageFormAction(this.dataList[index], method).subscribe(response => {
      this.isLoaderShown = false;
      this.toastr.success(response.message, '', this.options);
      this.resetFields();
      this.getCBSMessageList();
    }, (e) => {
      this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
      this.getCBSMessageList();
    })
  }

  /**
 * Method to delete record
 * @param null;
 */
  deleteRecord() {
    let index = this.dataList.findIndex(x => x.id === this.selectedId);
    if (this.dataList[index].id !== 0) {
      if (confirm(`${translation[this.language].ConfirmDelete} ?`)) {
        this.isLoaderShown = true;
        this.domainServie.deleteCBSMessageDetails(this.selectedId).subscribe(response => {
          this.toastr.success(translation[this.language].RecordsDeletedSucess, '', this.options);
          this.getCBSMessageList();
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
    this.getCBSMessageList();
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
