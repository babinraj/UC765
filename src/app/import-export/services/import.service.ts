import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { apiPath } from '../../../constants/apiPath';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImportService {

  constructor(private http: HttpClient) { }

  /**
 * Method to save  CSV file
 * @param data;
 */
  saveCSVFile(data: any): Observable<any> {
    // let limiter;
    // if(data.listSeperator === 'tab'){
    //   limiter = '\t';
    // }else if(data.listSeperator === 'semicolon'){
    //   limiter = ';';
    // }else{
    //   limiter = ',';
    // }
    const dataObj = {
      backUpFilePath: data.backUpFile,
      delimiter: data.listSeperator,
      importFilePath: data.importFile,
      processingMethod: data.processingMethod,
      tableToImport: data.table
    }
    return (this.http.post(`${apiPath.import}domaintables`, dataObj));
  }

  /**
  * Method to upload CSV file
  * @param file;
  * @param fileName;
  */
  uploadCSVFile(file: any, fileName: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.file);
    const headers = new HttpHeaders();
    return this.http.post(`${apiPath.import}uploadFile/tabename=${fileName}`, formData, { headers: headers });
  }

  /**
  * Method to take back up
  */
  takeBackUp(): Observable<any> {
    return (this.http.get(`${apiPath.import}takebackup`));
  }

  /**
  * Method to take restore back up
  */
  restoreBackUp(): Observable<any> {
    return (this.http.get(`${apiPath.import}restoreBackup`));
  }

  /**
  * Method to export back up 
  * @param fileObj;
  */
 exportBackup(fileObj:any): Observable<any> {
   if(fileObj.action === 'Export' && fileObj.dbName === 'prod'){
    return (this.http.get(`${apiPath.dboperations}exportBackupFromProdDb?filename=${fileObj.backUpName}&foldername=${fileObj.envSelected}`));
   }else{
    return (this.http.get(`${apiPath.dboperations}exportDumpFromMaintenence?filename=${fileObj.backUpName}&foldername=${fileObj.envSelected}`));
   }
 
}

  /**
  * Method to take restore back to Maintanance
  * @param fileObj;
  */
 exportImportBackupToMaintenenceDB(fileObj:any): Observable<any> {
  return (this.http.get(`${apiPath.dboperations}importBackupToMaintenenceDB?filename=${fileObj.backUpName}&foldername=${fileObj.envSelected}`));
}


  /**
  * Method to sync Prod Env With Backup
  * @param fileObj;
  */
syncEnvWithBackup(fileObj:any): Observable<any> {
  if(fileObj.action === 'Synchronize' && fileObj.dbName === 'prod'){

    return (this.http.get(`${apiPath.dboperations}syncProdEnvWithBackup?filename=${fileObj.backUpName}&foldername=${fileObj.envSelected}`));
  }else{
    return (this.http.get(`${apiPath.dboperations}syncTestEnvWithBackup?filename=${fileObj.backUpName}&foldername=${fileObj.envSelected}`));
  }

  }
  



/**
* Method to list Backup Files
* @param filename;
*/
listBackupFiles(filename:any): Observable<any> {
  return (this.http.get(`${apiPath.dboperations}listBackupFiles/${filename}`));
  }

}
