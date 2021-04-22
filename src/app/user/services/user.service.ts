import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { apiPath } from '../../../constants/apiPath';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }



  /**
   * Method to check username exists or not
   * @param data;
   */
  userNameCheck(data:any): Observable<any> {
    return (this.http.get(`${apiPath.user}isusernameexists/${data}`));
  }

  /**
   * Method to reset password
   * @param data;
   */
  resetPassword(data:any): Observable<any> {
    return (this.http.get(`${apiPath.user}resetpassword/${data}`));
  }

  /**
   * Method to get user details
   * @param null;
   */
  getUserDetails(): Observable<any> {
    return (this.http.get(`${apiPath.user}getallusers`));
  }

  /**
   * Method to add/edit user details
   * @param data;
   * @param method;
   */
  userFormAction(data: any, method: string): Observable<any> {  
      return (this.http.post(`${apiPath.user}saveorupdateuser`, data));  
  }

  /**
   * Method to delete user details
   * @param id;
   */
  deleteUserDetails(id: string): Observable<any> {
    return (this.http.get(`${apiPath.user}deleteuserbyuserid/${id}`));
  }

  /**
   * Method to get role details
   * @param null;
   */
  getRoleDetails(): Observable<any> {
    return (this.http.get(`${apiPath.userRole}getAllUserRoles`));
  }

  /**
   * Method to add/edit role details
   * @param data;
   * @param method;
   */
  roleFormAction(data: any, method: string): Observable<any> {  
    if (method === 'Add') {
      return (this.http.post(`${apiPath.userRole}saveUserRole`, data));    
    }else{
      return (this.http.post(`${apiPath.userRole}updateUserRole`, data));    
    }
      
  }

  /**
   * Method to delete role details
   * @param id;
   */
  deleteRoleDetails(id: string): Observable<any> {
    return (this.http.get(`${apiPath.userRole}deleteUserRole/${id}`));
  }

    /**
   * Method to get role center details
   * @param null;
   */
  getRoleCenterDetails(): Observable<any> {
    return (this.http.get(`${apiPath.usercenterrole}getallcentreuserroles`));
  }

    /**
   * Method to add/edit role center details
   * @param data;
   * @param method;
   */
  roleCenterFormAction(data: any, method: string): Observable<any> {
      return (this.http.post(`${apiPath.usercenterrole}saveorupdatecentreuserroles`, data));
  }

    /**
   * Method to delete role center details
   * @param id;
   */
  deleteRoleCenterDetails(id: string): Observable<any> {
    return (this.http.get(`${apiPath.usercenterrole}deleteCentoerUserRoleById/${id}`));
  }



  /**
   * Method to get center details
   * @param null;
   */
  getCentreDetails(): Observable<any> {
    return (this.http.get(`${apiPath.centrale}getCentreList/1`));
  }

  /**
   * Method to add/edit center details
   * @param data;
   * @param method;
   */
  centerFormAction(data: any, method: string): Observable<any> {
    if (method === 'Add') {
      return (this.http.post(`${apiPath.centrale}addCentre`, { operationModel: data }));
    } else {
      return (this.http.put(`${apiPath.centrale}updateCentreData`, { operationModel: data }));
    }
  }

  /**
   * Method to delete center details
   * @param id;
   */
  deleteCentreDetails(id: string): Observable<any> {
    return (this.http.get(`${apiPath.centrale}deleteCentre/${id}`));
  }

  /**
   * Method to get super block details
   * @param null;
   */
  getSuperBlockDetails(): Observable<any> {
    return (this.http.get(`${apiPath.blocks}getSuperBlockList/1`));
  }

    /**
   * Method to get SuperBlock Block details with center id
   * @param null;
   */

  getSuperBlockBlockDetails(): Observable<any> {
    return (this.http.get(`${apiPath.blocks}getSuperBlockBlockList/1`));
  }

    /**
   * Method to get SuperBlock Block details with center id
   * @param null;
   */

  getAllBlockDetails(): Observable<any> {
    return (this.http.get(`${apiPath.blocks}getBlockList}`));
  }
  
  /**
   * Method to add/edit SuperBlock Block details
   * @param data;
   * @param method;
   */
  superBlockBlockFormAction(data: any, method: string): Observable<any> {
    if (method === 'Add') {
      return (this.http.post(`${apiPath.blocks}addSuperBlockBlock`, { superBlock_BlockModel: data }));
    } else {
      return (this.http.put(`${apiPath.blocks}updateSuperBlockBlock`, { superBlock_BlockModel: data }));
    }
  }
  /**
   * Method to delete super block details
   * @param id;
   */
  deletesuperblockDetails(id: string): Observable<any> {
    return (this.http.get(`${apiPath.blocks}deleteSuperBlock/${id}`));
  }
  
  /**
   * Method to get submenu  details
   * @param null;
   */
  getSubmenuDetails(roleId:any,menuId:any): Observable<any> {
    return (this.http.get(`${apiPath.roleScreen}/getSubMenuList?roleId=${roleId}&menuId=${menuId}`));
  }
  
  /**
   * Method to get list  details
   * @param null;
   */
  getListDetails(roleId:any,menuId:any): Observable<any> {
    return (this.http.get(`${apiPath.roleScreen}getColumnList?roleId=${roleId}&subMenuId=${menuId}`));
  } 


    /**
   * Method to get Menu  details
   * @param null;
   */
  getMenuDetails(): Observable<any> {
    return (this.http.get(`${apiPath.roleScreen}getMenuList`));
  }

    /**
   * Method to get screen tables
   * @param null;
   */
  getScreenTables(roleId:any,menuId:any): Observable<any> {
    return (this.http.get(`${apiPath.roleScreen}getScreenList?roleId=${roleId}&subMenuId=${menuId}`));
  } 

      /**
   * Method to get screen table details
   * @param null;
   */
  getScreenTableDetails(roleId:any,screenId:any): Observable<any> {
    return (this.http.get(`${apiPath.roleScreen}getScreenFieldsList?roleId=${roleId}&screenId=${screenId}`));
  } 

    /**
   * Method to update screen details
   * @param data;
   * @param screen;
   * @param roleId;
   */
  screenUpdateAction(data: any, screen: string,roleId:any): Observable<any> {   
    if (screen === 'menu') {
      return (this.http.put(`${apiPath.roleScreen}updateSubMenus?roleId=${roleId}`, {submenuList:data}));    
    }else if (screen === 'list') {
      return (this.http.put(`${apiPath.roleScreen}updateColumns?roleId=${roleId}`, {columnModelList:data}));    
    }else{
      return (this.http.put(`${apiPath.roleScreen}updateFields?roleId=${roleId}`, {fieldList:data}));    
    }
      
  }

   /**
   * Method to get screen table details
   * @param null;
   */
  getRoleIdNameCheck(roleName: string): Observable<any> {
    return (this.http.get(`${apiPath.userRole}isRoleIdNameExists/${roleName}`));
  } 

}
