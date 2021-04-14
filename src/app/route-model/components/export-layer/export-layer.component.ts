import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { SharedService } from '../../../core/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { translation } from '../../../../constants/toastTranslation';
import { ToastrService } from 'ngx-toastr';
import { RoutemodelService } from '../../services/routemodel.service';
import { map, take, tap } from 'rxjs/operators';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-export-layer',
  templateUrl: './export-layer.component.html',
  styleUrls: ['./export-layer.component.scss']
})
export class ExportLayerComponent implements OnInit {
  submitted: boolean = false;
  fileSubmitted: boolean = false;
  modalRef!: BsModalRef;
  isLoaderShown = false;
  options = { positionClass: 'toast-top-right' };
  language: any;

  exportLayerForm!: FormGroup;
  exportSaveFileForm!: FormGroup;

  exportLayerLists = [{
    label: "GeoPoint DL Export",
    value: "dllive"
  }, {
    label: "GeoPoint GL Export",
    value: "gllive"
  }, {
    label: "Route Segment Export",
    value: "rslive"
  }, {
    label: "GE Block",
    value: "geblock"
  }];
  exportLayerModal = {
    layerId: ""
  };
  selectedLayer = '';
  fileContent: any;
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
    this.initForms(this.exportLayerModal);
  }

  initForms(userObject: any): void {
    this.exportLayerForm = this.fb.group({
      layerId: [userObject.layerId, [Validators.required]]
    });
  }

  onFormSubmit(template: TemplateRef<any>): void {
    const localeString = Date.now();
    this.fileContent = '';
    this.submitted = true;
    if (this.exportLayerForm.valid && this.exportLayerForm.touched) {
      if (this.exportLayerForm.getRawValue().layerId === 'dllive') {
        this.isLoaderShown = true;
        this.routeModalProvider.exportDLLive().pipe().subscribe((response) => {
          this.isLoaderShown = false;
          response.body.name = "GEOPOINT_Line_"+ localeString;
          this.fileContent = response;
          this.openModal(template);
          
          // this.downloadFile(response)
          // this.toastr.success("File exported successfully", '', this.options);

        }, (e: any) => {
          this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
          this.isLoaderShown = false;
        })
      } else if (this.exportLayerForm.getRawValue().layerId === 'gllive') {
        this.isLoaderShown = true;
        this.routeModalProvider.exportGLLive().subscribe(response => {
          this.isLoaderShown = false;
          response.body.name = "GEOPOINT_PLg_"+ localeString + ".csv";
          this.fileContent = response;
          this.openModal(template);
          // this.downloadFile(response)
          // this.toastr.success("File exported successfully", '', this.options);

        }, (e: any) => {
          this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
          this.isLoaderShown = false;
        });
      } else if (this.exportLayerForm.getRawValue().layerId === 'rslive') {
        this.isLoaderShown = true;
        this.routeModalProvider.exportRouteSegment().subscribe(response => {
          this.isLoaderShown = false;
          response.body.name = "ROUTESEGMENT_"+ localeString + ".csv";
          this.fileContent = response;
          this.openModal(template)
          // this.downloadFile(response)
          // this.toastr.success("File exported successfully", '', this.options);

        }, (e: any) => {
          this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
          this.isLoaderShown = false;
        });
      } else if (this.exportLayerForm.getRawValue().layerId === 'geblock') {
        this.isLoaderShown = true;
        this.routeModalProvider.exportBlock().subscribe(response => {
          this.isLoaderShown = false;
          response.body.name = "GEBLOCK_"+ localeString + ".csv";
          this.fileContent = response;
          this.openModal(template);
          // this.downloadFile(response)
          // this.toastr.success("File exported successfully", '', this.options);

        }, (e: any) => {
          this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
          this.isLoaderShown = false;
        });
      }
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      class: 'radio-modal',
      ignoreBackdropClick: true
    });
    
    this.exportSaveFileForm = this.fb.group({
      fileSave: [this.fileContent.body.name, [Validators.required]]
    });
  }

  onSaveFile() {
    const localeString = Date.now();
    this.fileSubmitted = true;
    if (this.exportSaveFileForm.valid && this.exportSaveFileForm.touched) {
      this.fileContent.body.name = this.exportSaveFileForm.getRawValue().fileSave + '.csv';
      this.downloadFile(this.fileContent)
      this.modalRef.hide()
      this.toastr.success("File exported successfully", '', this.options);
    }
  }

  get f() { return this.exportSaveFileForm.controls; }


  downloadFile(data: any) {
    const url = window.URL.createObjectURL(data.body);
    var anchor = document.createElement("a");
    anchor.download = data.body.name;
    anchor.href = url;
    anchor.click();
    this.fileContent = '';
  }

  resetForm(): void {
    this.fileSubmitted = false;
    this.submitted = false;
    this.exportSaveFileForm.markAsUntouched();
    this.fileContent = ''
  }

}
