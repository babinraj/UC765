import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { apiPath } from '../../../constants/apiPath';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DomainService {

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Method to get center details
   * @param null;
   */
  getCentreDetails(): Observable<any> {
    return (this.http.get(`${apiPath.centrale}getCentreList/1`));
  }

  /**
   * Method to get user details
   * @param null;
   */
  getActiveCenter(): Observable<any> {
    return (this.http.get(`${apiPath.centrale}allActiveCenter`));
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
   * Method to add/edit super block details
   * @param data;
   * @param method;
   */
  superblockFormAction(data: any, method: string): Observable<any> {
    if (method === 'Add') {
      return (this.http.post(`${apiPath.blocks}addSuperBlock`, { superBlockModel: data }));
    } else {
      return (this.http.put(`${apiPath.blocks}updateSuperBlock`, { superBlockModel: data }));
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
   * Method to get Zeeship Type details
   * @param null;
   */
  getZeeshipTypeDetails(): Observable<any> {
    return (this.http.get(`${apiPath.zeeshiptype}getSeaShipTypeList/1`));
  }

  /**
   * Method to add/edit Zeeship Type details
   * @param data;
   * @param method;
   */
  zeeshipTypeFormAction(data: any, method: string): Observable<any> {
    if (method === 'Add') {
      return (this.http.post(`${apiPath.zeeshiptype}addType`, { seashipTypeModel: data }));
    } else {
      return (this.http.put(`${apiPath.zeeshiptype}updateTypeData`, { seashipTypeModel: data }));
    }
  }

  /**
   * Method to delete Zeeship Type details
   * @param id;
   */
  deleteZeeshipTypeDetails(id: string): Observable<any> {
    return (this.http.get(`${apiPath.zeeshiptype}deleteType/${id}`));
  }

  /**
   * Method to get Enumeration Names details
   * @param null;
   */
  getEnumNamesList(): Observable<any> {
    return (this.http.get(`${apiPath.enumeration}getEnumNamesList`));
  }

  /**
   * Method to get Enumeration details
   * @param null;
   */
  getEnumerationDetails(name: any): Observable<any> {
    return (this.http.get(`${apiPath.enumeration}getListForEnumNames/${name}`));
  }

  /**
   * Method to add/edit Enumeration details
   * @param data;
   * @param method;
   */
  enumerationFormAction(data: any, method: string): Observable<any> {
    if (method === 'Add') {
      return (this.http.post(`${apiPath.enumeration}add`, { enumerationsModel: data }));
    } else {
      return (this.http.put(`${apiPath.enumeration}update`, { enumerationsModel: data }));
    }
  }

  /**
   * Method to delete Enumeration details
   * @param id;
   */
  deleteEnumerationDetails(id: string): Observable<any> {
    return (this.http.get(`${apiPath.enumeration}delete/${id}`));
  }

  /**
   * Method to get Priority Sources details
   * @param null;
   */
  getPrioritySourcesDetails(): Observable<any> {
    return (this.http.get(`${apiPath.prioriteitBron}getList/1`));
  }

  /**
   * Method to add/edit Priority Sources details
   * @param data;
   * @param method;
   */
  prioritySourcesFormAction(data: any, method: string): Observable<any> {
    if (method === 'Add') {
      return (this.http.post(`${apiPath.prioriteitBron}add`, { prioritySourcesModel: data }));
    } else {
      return (this.http.put(`${apiPath.prioriteitBron}update`, { prioritySourcesModel: data }));
    }
  }

  /**
   * Method to delete Priority Sources details
   * @param id;
   */
  deletePrioritySourcesDetails(id: string): Observable<any> {
    return (this.http.get(`${apiPath.prioriteitBron}delete/${id}`));
  }

  /**
   * Method to get Timer details
   * @param null;
   */
  getTimerDetails(): Observable<any> {
    return (this.http.get(`${apiPath.timer}getList/1`));
  }

  /**
   * Method to add/edit Timer details
   * @param data;
   * @param method;
   */
  timerFormAction(data: any, method: string): Observable<any> {
    if (method === 'Add') {
      return (this.http.post(`${apiPath.timer}add`, { timerModel: data }));
    } else {
      return (this.http.put(`${apiPath.timer}update`, { timerModel: data }));
    }
  }

  /**
   * Method to delete Timer details
   * @param id;
   */
  deleteTimerDetails(id: string): Observable<any> {
    return (this.http.get(`${apiPath.timer}delete/${id}`));
  }

  /**
     * Method to get Base Type details
     * @param null;
     */
  getBaseTypeDetails(): Observable<any> {
    return (this.http.get(`${apiPath.basetype}getList/1`));
  }

  /**
   * Method to add/edit Base Type details
   * @param data;
   * @param method;
   */
  baseTypeFormAction(data: any, method: string): Observable<any> {
    if (method === 'Add') {
      return (this.http.post(`${apiPath.basetype}add`, { baseTypeModel: data }));
    } else {
      return (this.http.put(`${apiPath.basetype}update`, { baseTypeModel: data }));
    }
  }

  /**
   * Method to delete Base Type details
   * @param id;
   */
  deleteBaseTypeDetails(id: string): Observable<any> {
    return (this.http.get(`${apiPath.basetype}delete/${id}`));
  }

  /**
   * Method to get CBS partner details
   * @param null;
   */
  getPartnerDetails(): Observable<any> {
    return (this.http.get(`${apiPath.partner}list/1`));
  }

  /**
   * Method to add/edit CBS partner  details
   * @param data;
   * @param method;
   */
  partnerFormAction(data: any, method: string): Observable<any> {
    if (method === 'Add') {
      return (this.http.post(`${apiPath.partner}add`, { partnerModel: data }));
    } else {
      return (this.http.put(`${apiPath.partner}update`, { partnerModel: data }));
    }
  }

  /**
   * Method to delete CBS partner  details
   * @param id;
   */
  deletePartnerDetails(id: string): Observable<any> {
    return (this.http.get(`${apiPath.partner}delete/${id}`));
  }

  /**
   * Method to get area details
   * @param null;
   */
  getAllAreaDetails(): Observable<any> {
    return (this.http.get(`${apiPath.gebied}getList/1`));
  }

  /**
   * Method to get area details with center id
   * @param null;
   */

  getAreaDetails(data: any): Observable<any> {
    return (this.http.get(`${apiPath.gebied}getListForCentreId/${data}`));
  }

  /**
   * Method to add/edit area details
   * @param data;
   * @param method;
   */
  areaFormAction(data: any, method: string): Observable<any> {
    if (method === 'Add') {
      return (this.http.post(`${apiPath.gebied}add`, { areaModel: data }));
    } else {
      return (this.http.put(`${apiPath.gebied}update`, { areaModel: data }));
    }
  }

  /**
   * Method to delete area  details
   * @param id;
   */
  deleteAreaDetails(id: string): Observable<any> {
    return (this.http.get(`${apiPath.gebied}delete/${id}`));
  }

  /**
   * Method to get CBS Message details with center id
   * @param null;
   */
  getCBSMessageDetails(): Observable<any> {
    return (this.http.get(`${apiPath.areaoperator}getList/1`));
  }

  /**
   * Method to add/edit CBSM essage details
   * @param data;
   * @param method;
   */
  cbsMessageFormAction(data: any, method: string): Observable<any> {
    if (method === 'Add') {
      return (this.http.post(`${apiPath.areaoperator}add`, { areaPartnerModel: data }));
    } else {
      return (this.http.put(`${apiPath.areaoperator}update`, { areaPartnerModel: data }));
    }
  }

  /**
   * Method to delete CBS Message details
   * @param id;
   */
  deleteCBSMessageDetails(id: string): Observable<any> {
    return (this.http.get(`${apiPath.areaoperator}delete/${id}`));
  }
  /** Method to get object details
   * @param null;
   */
  getObjectDetails(type: string): Observable<any> {
    return (this.http.get(`${apiPath.object}getObjectListForType/${type}`));
  }

  /**
   * Method to add/edit center details
   * @param data;
   * @param method;
   */
  objectFormAction(data: any, method: string): Observable<any> {
    if (method === 'Add') {
      return (this.http.post(`${apiPath.object}add`, { objectModel: data }));
    } else {
      return (this.http.put(`${apiPath.object}update`, { objectModel: data }));
    }
  }

  /** Method to delete center details
   * @param id;
   */
  deleteObjectDetails(id: string): Observable<any> {
    return (this.http.get(`${apiPath.object}delete/${id}`));
  }

  /**
   * Method to get object type list
   */
  getObjectTypeList(): Observable<any> {
    return (this.http.get(`${apiPath.object}getObjTypeList`));
  }

  /**
   * Method to get centre Id list
   */
  getCenterIdList(): Observable<any> {
    return (this.http.get(`${apiPath.object}getcentraleIdList`));
  }


  /**
   * Method to get SuperBlock Block details with center id
   * @param null;
   */

  getAllBlockDetails(): Observable<any> {
    return (this.http.get(`${apiPath.blocks}getBlockList}`));
  }

  /**
   * Method to get SuperBlock Block details with center id
   * @param null;
   */

  getSuperBlockBlockDetails(): Observable<any> {
    return (this.http.get(`${apiPath.blocks}getSuperBlockBlockList/1`));
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
   * Method to delete SuperBlock Block  details
   * @param id;
   */
  deleteSuperBlockBlockDetails(id: string): Observable<any> {
    return (this.http.get(`${apiPath.blocks}deleteSuperBlockBlock/${id}`));
  }

  /**
   * Method to get geo point details
   * @param null;
   */
  getGeoPointDetails(): Observable<any> {
    return (this.http.get(`${apiPath.reference}getGeoPointIdList`));
  }

  /**
 * Method to get direction list
 * @param null;
 */

  getDirectionDetails(): Observable<any> {
    return (this.http.get(`${apiPath.erinot}getDirectionList`));
  }

  /**
   * Method to get erinot Message list
   * @param null;
   */

  getErinotMessageList(): Observable<any> {
    return (this.http.get(`${apiPath.erinot}list/1`));
  }

  /**
   * Method to add/edit erinot Message details
   * @param data;
   * @param method;
   */
  erinotMessageFormAction(data: any, method: string): Observable<any> {
    if (method === 'Add') {
      return (this.http.post(`${apiPath.erinot}add`, { erinotModel: data }));
    } else {
      return (this.http.put(`${apiPath.erinot}update`, { erinotModel: data }));
    }
  }

  /**
   * Method to delete erinot Message  details
   * @param id;
   */
  deleteErinotMessageDetails(id: number): Observable<any> {
    return (this.http.delete(`${apiPath.erinot}delete/` + id));
  }

  /**
   * Method to get get Priority List details
   * @param null;
   */
  getPriorityDetails(): Observable<any> {
    return (this.http.get(`${apiPath.reference}getPriorityDetailsList`));
  }

  /**
   * Method to get data Element list
   * @param null;
   */

  getDataElementList(): Observable<any> {
    return (this.http.get(`${apiPath.prioritydetailschannel}getList/1`));
  }

  /**
   * Method to add/edit data Element details
   * @param data;
   * @param method;
   */
  dataElementFormAction(data: any, method: string): Observable<any> {
    if (method === 'Add') {
      return (this.http.post(`${apiPath.prioritydetailschannel}add`, data));
    } else {
      return (this.http.put(`${apiPath.prioritydetailschannel}update`, data));
    }
  }

  /**
   * Method to delete data Element  details
   * @param id;
   */
  deleteDataElementDetails(id: string): Observable<any> {
    return (this.http.get(`${apiPath.prioritydetailschannel}delete/${id}`));
  }


}