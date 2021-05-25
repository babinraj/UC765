import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { SharedService } from '../../../core/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { translation } from '../../../../constants/toastTranslation';
import { ToastrService } from 'ngx-toastr';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-role-screen',
  templateUrl: './role-screen.component.html',
  styleUrls: ['./role-screen.component.scss']
})
export class RoleScreenComponent implements OnInit {

  tempData: any;
  isLoaderShown = false;
  submitted = false;
  searchText: any;
  actionType = 'Add';
  language: any;
  isFormShown = false;
  isEditEnabled = false;
  options = { positionClass: 'toast-top-right' };
  dataList: Array<any> = [];
  lijstenList: Array<any> = [];
  algemeenList: Array<any> = [];
  incidentList: Array<any> = [];
  menuList: Array<any> = [];
  submenuList: Array<any> = []; 
  listDetails: Array<any> = []; 
  screenTableDetails: Array<any> = []; 
  tableArray: Array<any> = []; 
  tabSelected = 'menu';
  menuArray: Array<any> = []; 

  constructor(
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    public translate: TranslateService,
    private userService: UserService) {
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
  
    this.language = this.activatedRoute.snapshot.params.language;
    this.translate.use(this.activatedRoute.snapshot.params.language);
    this.getRoleDetails();    
    // this.getMenuDetails();
  }

  /**
 * Method to move array position up
 * @param index 
 * @param item 
 */
  shiftUp(index:any,item:any){
    this.listDetails.splice(index, 1);
    this.listDetails.splice(index-1, 0, item);
     return this.listDetails;
  }

/**
 * Method to move array position down
 * @param index 
 * @param item 
 */
  shiftDown(index:number,item:any){
    this.listDetails.splice(index, 1);
    this.listDetails.splice(index+1, 0, item);
     return this.listDetails;
  }

  /**
   * Method for fetching menu list
   * @param null;
   */
  getMenuDetails(): void {
    this.isLoaderShown = true;
    this.userService.getMenuDetails().subscribe((response: any) => {
      this.isLoaderShown = false;
      if (response.data) {
        this.menuList = response.data.objList;
        // this.getSubMenuDetails(response.data.objList[0].mainMenuId,'component');
        // this.getScreenSubMenuDetails(response.data.objList[0].mainMenuId,'component');        
    this.onTabSelect('menu');
    this.isFormShown = true;
      }
    }, (e:any) => {
      this.menuList = [];
      this.isLoaderShown = false;
    });
  }

/**
 * Method for fetching submenu menu list
 * @param e 
 * @param from 
 */
  getSubMenuDetails(e:any,from:any): void {
    const menu = from === 'view' ? e.target.value : e;
    this.isLoaderShown = true;
    this.userService.getSubmenuDetails(this.tempData.roleId,menu).subscribe(response=>{
      this.submenuList = response.data.objList;
      this.isLoaderShown = false;
      this.getColoumnListDetails(response.data.objList[0].subMenuId,'component');
    })
  }

 /**
  * Method for fetching  coloumn list
  * @param e 
  * @param from 
  */
  getColoumnListDetails(e:any,from:any): void {
    const menu = from === 'view' ? e.target.value : e;
    this.isLoaderShown = true;
    this.userService.getListDetails(this.tempData.roleId,menu).subscribe(response=>{
      this.listDetails = response.data.objList;
      this.isLoaderShown = false;
    })
  }

/**
 * Method for fetching submenu list for screen tab
 * @param e 
 * @param from 
 */
  getScreenSubMenuDetails(e:any,from:any): void {
    const menu = from === 'view' ? e.target.value : e;
    this.isLoaderShown = true;
    this.userService.getSubmenuDetails(this.tempData.roleId,menu).subscribe(response=>{
      this.submenuList = response.data.objList;
      this.isLoaderShown = false;
      this.getScreenTableDetails(response.data.objList[0].subMenuId,'component');
    })
  }

/**
 * Method for fetching screen table details list
 * @param e 
 * @param from 
 */
  getScreenTableDetails(e:any,from:any): void {
    const menu = from === 'view' ? e.target.value : e;
    let t;
    this.isLoaderShown = true;
    this.userService.getScreenTables(this.tempData.roleId,menu).subscribe(response=>{
      
      this.isLoaderShown = false;
      this.screenTableDetails = response.data.objList;
      if(response.data.objList){
        response.data.objList.forEach( (menu:any) => {     
          this.userService.getScreenTableDetails(this.tempData.roleId,menu.screenId).subscribe(resp=>{
            this.tableArray[menu.screenname] = resp.data.objList;
        })
      });
      }

    })    
  
  }


  /**
   * Method for fetching role list
   * @param null;
   */
  getRoleDetails(): void {
    this.isLoaderShown = true;
    this.userService.getRoleDetails().subscribe((response: any) => {
      this.isLoaderShown = false;
      if (response.data) {
        this.dataList = response.data;
      }
    }, (e:any) => {
      this.dataList = [];
      this.isLoaderShown = false;
    });
  }

  /**
   * Method to open edit window
   * @param dataObj;
   * @param action;
   */
  viewDetails(dataObj: any, action: string): void {
    this.actionType = action;
    this.submitted = false;    
    this.tempData = dataObj;    
    this.getMenuDetails();
     this.isFormShown = false;
    // this.initForms(dataObj);
  }

  getLijstenList(role:any){
    this.userService.getSubmenuDetails(role,1).subscribe(response=>{
      this.lijstenList = response.data.objList;
    })
  }
  getAlgemeenList(role:any){
    this.userService.getSubmenuDetails(role,2).subscribe(response=>{
      this.algemeenList = response.data.objList;
    })
  }
  getIncidentList(role:any){
    this.userService.getSubmenuDetails(role,3).subscribe(response=>{
      this.incidentList = response.data.objList;
    })
  }

  /**
   * Method to delete record
   * @param null;
   */
  deleteRecord(): void {
    if (confirm(`${translation[this.language].ConfirmDelete} ?`)) {
      this.isLoaderShown = true;
      this.userService.deleteRoleDetails(this.tempData.roleDetailsId).subscribe(response => {
        this.isFormShown = false;
        this.toastr.success(response.message, '', this.options);
        this.getRoleDetails();
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

  /**
   * Method to submit form
   * @param null;
   */
  onFormSubmit(): void {
    let t:any = {};
    let submenu:any = [];
    // this.submitted = true;
    if(this.tabSelected === 'menu'){ 
      this.menuList.forEach( (menu:any) => { 
      // t[menu.menuname]! = this.menuArray[menu.menuname][0];
      this.menuArray[menu.menuname][0].subMenuList.forEach( (item:any) => {
        submenu.push(item);
       });     
      })      
    }
    else if(this.tabSelected === 'list'){ 
      this.listDetails.forEach( (item:any) => {
        submenu.push(item);
       });  
    }
    else if(this.tabSelected === 'screen'){ 
      this.screenTableDetails.forEach( (item:any) => {
        if(this.tableArray[item.screenname]){
          this.tableArray[item.screenname].forEach( (data:any) => {
            submenu.push(data);
          });
        }
       });  
    }
    

      this.isLoaderShown = true;
      this.userService.screenUpdateAction(submenu, this.tabSelected,this.tempData.roleId).subscribe(response => {
        this.isLoaderShown = false;
        this.isFormShown = false;
        this.isEditEnabled = false;
        this.toastr.success(response.message, '', this.options);

      }, (e:any) => {
        this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
        this.isFormShown = false;
        this.isEditEnabled = false;
        this.isLoaderShown = true;
      });



  }

  /**
   * Method to reset form
   * @param null;
   */
  resetForm(): void {
    this.isFormShown = false;
    this.submitted = false;
    this.tempData = {};
  }

  /**
   * Method to enable edit
   * @param null;
   */
  enableEdit(): void {
    this.isEditEnabled = true;
  }

  /**
   * Method for swtiching tab
   * @param tab 
   */
  onTabSelect(tab:any){
    this.tabSelected = tab;
    if(tab === 'menu'){  
      this.isLoaderShown = true;
    this.menuList.forEach( (menu:any) => { 
      this.userService.getSubmenuDetails(this.tempData.roleId,menu.mainMenuId).subscribe(resp=>{
        //this.menuArray[menu.menuname] = resp.data.objList;
        const t = [];
        t.push({
          mainMenuId:menu.mainMenuId,
          subMenuList:resp.data.objList
        }) 
        this.menuArray[menu.menuname] = t;  
        this.isLoaderShown = false;
    })
  });
    }
    else if(tab === 'list'){ 
      this.getSubMenuDetails(this.menuList[0].mainMenuId,'component');
    }
    else if(tab === 'screen'){      
      this.getScreenSubMenuDetails(this.menuList[0].mainMenuId,'component');
    }
  }

  /**
   * Method to change colomun sequence
   * @param data 
   * @param i 
   */
  setColumnSequenceData(data:any,i:any){
    data.columnSequence = i;
  }

  /**
   * Method to change view only in screen
   * @param e 
   * @param data 
   * @param bol 
   */
  onElementChange(e:any,data:any,bol:any){
    data = data.map( (o:any)=> o.editable = bol );
    return data;
  }


}
