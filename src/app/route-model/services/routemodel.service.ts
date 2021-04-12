import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiPath } from '../../../constants/apiPath';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RoutemodelService {

  constructor(private http: HttpClient) { }

  //geo element starts
  saveGeoElement(data:any): Observable<any> {
    if(data) {
      data.atSea = JSON.stringify(data.atSea);
      data.isPort = JSON.stringify(data.isPort);
      data.isLock = JSON.stringify(data.isLock);
      data.isLockComplex = JSON.stringify(data.isLockComplex);
      data.isPassageListPoint = JSON.stringify(data.isPassageListPoint);
      data.cbsEri = JSON.stringify(data.cbsEri);
      data.cbspTA = JSON.stringify(data.cbspTA);
      data.isAnchoringPoint = JSON.stringify(data.isAnchoringPoint);


    }
    return (this.http.post(`${apiPath.geoElement}savegeopoint`, data));
  }

  saveBlock(data:any): Observable<any> {
    
    return (this.http.post(`${apiPath.geoElement}saveblock`, data));
  }

  saveGeoPointPolygon(data:any): Observable<any> {
    return (this.http.post(`${apiPath.geoElement}savegeopointpolygon`, data));
  }

  updateGeoElement(data:any): Observable<any> {
    return (this.http.post(`${apiPath.geoElement}updategeopoint`, data));
  }

  updateGeoPointPolygon(data:any): Observable<any> {
    return (this.http.post(`${apiPath.geoElement}updategeopointpolygon`, data));
  }

  checkGeoPointExists(geoPointId:string): Observable<any> {
    return (this.http.get(`${apiPath.geoElement}isgeopointexists/${geoPointId}`));
  }

  getAllGeoElemets(): Observable<any> {
    return (this.http.get(`${apiPath.geoElement}getallgeopoint`));
  }

  getAllPolygonByGeoPoint(geoPointId:string): Observable<any> {
    return (this.http.get(`${apiPath.geoElement}getallgeopointpolygon/${geoPointId}`));
  }

  getMaxGeoPolygonSerial(geoPointId:string): Observable<any> {
    return (this.http.get(`${apiPath.geoElement}getmaxgeoploygonserial/${geoPointId}`));
  }

  deleteGeoElemet(geoPointId: string): Observable<any> {
    return (this.http.get(`${apiPath.geoElement}deletegeopoint/${geoPointId}`));
  }

  deleteGeoPointPolygon(geoPointId: string, serialId: string): Observable<any> {
    return (this.http.get(`${apiPath.geoElement}deletegeopointpolygon/${geoPointId}/${serialId}`));
  }

  //geo element ends

  //cbs locodes starts
  saveCbsLocodes(data:any): Observable<any> {
    return (this.http.post(`${apiPath.cbsLocodes}savecbslocation`, data));
  }

  updateCbsLocodes(data:any): Observable<any> {
    return (this.http.post(`${apiPath.cbsLocodes}updatecbslocation`, data));
  }

  getAllCbsLocodes(): Observable<any> {
    return (this.http.get(`${apiPath.cbsLocodes}getallcbslocation`));
  }

  deleteCbsLocodes(cbsId: string): Observable<any> {
    return (this.http.get(`${apiPath.cbsLocodes}deletecbslocation/${cbsId}`));
  }
  //cbs locodes ends

  //route deviation starts
  saveRouteDeviation(data:any): Observable<any> {
    return (this.http.post(`${apiPath.routeDeviation}saveroutedeviate`, data));
  }

  saveRouteDeviationDetails(data:any): Observable<any> {
    return (this.http.post(`${apiPath.routeDeviation}saveroutedeviationdetails`, data));
  }

  updateRouteDeviation(data:any): Observable<any> {
    return (this.http.post(`${apiPath.routeDeviation}updateroutedeviate`, data));
  }

  getSelectedRouteDeviationLists(routeDeviateId: string): Observable<any> {
    return (this.http.get(`${apiPath.routeDeviation}getallroutedeviationdetails/${routeDeviateId}`));
  }

  getAllRouteDeviation(): Observable<any> {
    return (this.http.get(`${apiPath.routeDeviation}getallroutedeviate`));
  }

  deleterouteDeviation(routeDeviationId: string): Observable<any> {
    return (this.http.get(`${apiPath.routeDeviation}deleteroutedeviate/${routeDeviationId}`));
  }

  //Route deviation detail model
  saveRouteDeviationDetail(data:any): Observable<any> {
    return (this.http.post(`${apiPath.routeDeviation}saveroutedeviationdetails`, data));
  }

  updateRouteDeviationDetail(data:any): Observable<any> {
    return (this.http.post(`${apiPath.routeDeviation}updateroutedeviationdetails`, data));
  }

  getAllRouteDeviationDetail(routeDeviateId:string): Observable<any> {
    return (this.http.get(`${apiPath.routeDeviation}getallroutedeviationdetails/${routeDeviateId}`));
  }

  deleterouteDeviationDetail(routeDeviationDetailsId: string): Observable<any> {
    return (this.http.get(`${apiPath.routeDeviation}deleteroutedeviationdetails/${routeDeviationDetailsId}`));
  }

  //route deviation ends

  //route segment starts
  saveRouteSegment(data:any): Observable<any> {
    return (this.http.post(`${apiPath.routeSegment}saveroutesegment`, data));
  }

  updateRouteSegment(data:any): Observable<any> {
    return (this.http.post(`${apiPath.routeSegment}updateroutesegment`, data));
  }

  getAllRouteSegment(): Observable<any> {
    return (this.http.get(`${apiPath.routeSegment}getallroutesegment`));
  }

  deleterouteSegment(segmentId: string): Observable<any> {
    return (this.http.get(`${apiPath.routeSegment}deleteroutesegment/${segmentId}`));
  }
  //route segment ends

  //pilot traject starts
  savePilotTrajects(data:any): Observable<any> {
    return (this.http.post(`${apiPath.pilotTraject}savetraject`, data));
  }

  updatePilotTrajects(data:any): Observable<any> {
    return (this.http.post(`${apiPath.pilotTraject}updatetraject`, data));
  }

  getAllPilotTrajects(): Observable<any> {
    return (this.http.get(`${apiPath.pilotTraject}getalltraject`));
  }

  getPilotTrajectExists(trajectId: string): Observable<any> {
    return (this.http.get(`${apiPath.pilotTraject}istrajectidexists/${trajectId}`));
  }

  deletePilotTrajects(trajectId: string): Observable<any> {
    return (this.http.get(`${apiPath.pilotTraject}deletetraject/${trajectId}`));
  }

  //pilot traject ends


  //hydro meteo starts
  saveHydroMeteoLocation(data:any): Observable<any> {
    return (this.http.post(`${apiPath.hydroMeteo}savehydrometeolocation`, data));
  }

  saveHydroMeteo(data:any): Observable<any> {
    return (this.http.post(`${apiPath.hydroMeteo}savehydrometeos`, data));
  }

  updateHydroMeteoLocation(data:any): Observable<any> {
    return (this.http.post(`${apiPath.hydroMeteo}updatehydrometeolocation`, data));
  }

  updateHydroMeteo(data:any): Observable<any> {
    return (this.http.post(`${apiPath.hydroMeteo}updatehydrometeos`, data));
  }

  getAllHydroMeteoLocation(): Observable<any> {
    return (this.http.get(`${apiPath.hydroMeteo}getallhydrometeolocation`));
  }

  getAllHydroMeteos(hydroMeteoLocationId: string): Observable<any> {
    return (this.http.get(`${apiPath.hydroMeteo}getallhydrometeos/${hydroMeteoLocationId}`));
  }

  deleteHydroMeteoLocation(hydroMeteoLocationId: string): Observable<any> {
    return (this.http.get(`${apiPath.hydroMeteo}deletehydrometeolocation/${hydroMeteoLocationId}`));
  }

  deleteHydroMeteo(hydrometeoId: string): Observable<any> {
    return (this.http.get(`${apiPath.hydroMeteo}deleteydrometeos/${hydrometeoId}`));
  }

  //pilot traject ends
  
  exportDLLive(): Observable<any> {
    return (this.http.get(`${apiPath.exportLayer}geopointdl`, { responseType: 'blob', observe: 'response' }));
  }

  exportGLLive(): Observable<any> {
    return (this.http.get(`${apiPath.exportLayer}geopointgl`, { responseType: 'blob', observe: 'response' }));
  }

  exportRouteSegment(): Observable<any> {
    return (this.http.get(`${apiPath.exportLayer}routesegmentexport`, { responseType: 'blob', observe: 'response' }));
  }



}
