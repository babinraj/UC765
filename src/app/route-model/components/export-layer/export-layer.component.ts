import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { SharedService } from '../../../core/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { translation } from '../../../../constants/toastTranslation';
import { ToastrService } from 'ngx-toastr';
import { RoutemodelService } from '../../services/routemodel.service';
import { map, take, tap } from 'rxjs/operators';
@Component({
  selector: 'app-export-layer',
  templateUrl: './export-layer.component.html',
  styleUrls: ['./export-layer.component.scss']
})
export class ExportLayerComponent implements OnInit {
  submitted: boolean = false;
  isLoaderShown = false;
  options = { positionClass: 'toast-top-right' };
  language: any;

  exportLayerForm!: FormGroup;
  exportLayerLists = [{
    label: "GeoPoint DL Export",
    value: "dllive"
  }, {
    label: "GeoPoint GL Export",
    value: "gllive"
  }, {
    label: "Route Segment Export",
    value: "rslive"
  }];
  exportLayerModal = {
    layerId: ""
  };
  selectedLayer = '';
  constructor(
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    public translate: TranslateService,
    private routeModalProvider: RoutemodelService
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

  onFormSubmit(): void {
    const localeString = Date.now();
    this.submitted = true;
    if (this.exportLayerForm.valid && this.exportLayerForm.touched) {
      if (this.exportLayerForm.getRawValue().layerId === 'dllive') {
        this.isLoaderShown = true;
        this.routeModalProvider.exportDLLive().pipe().subscribe((response) => {
          this.isLoaderShown = false;
          response.body.name = "GEOPOINT_Line_"+ localeString + ".csv";
          this.downloadFile(response)
          this.toastr.success("File exported successfully", '', this.options);

        }, (e: any) => {
          console.log(e);
          // this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
          this.isLoaderShown = false;
        })
      } else if (this.exportLayerForm.getRawValue().layerId === 'gllive') {
        this.isLoaderShown = true;
        this.routeModalProvider.exportGLLive().subscribe(response => {
          this.isLoaderShown = false;
          response.body.name = "GEOPOINT_PLg_"+ localeString + ".csv";

          this.downloadFile(response)
          this.toastr.success("File exported successfully", '', this.options);

        }, (e: any) => {
          this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
          this.isLoaderShown = false;
        });
      } else if (this.exportLayerForm.getRawValue().layerId === 'rslive') {
        this.isLoaderShown = true;
        this.routeModalProvider.exportRouteSegment().subscribe(response => {
          this.isLoaderShown = false;
          response.body.name = "ROUTESEGMENT_"+ localeString + ".csv";
          this.downloadFile(response)
          this.toastr.success("File exported successfully", '', this.options);

        }, (e: any) => {
          this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
          this.isLoaderShown = false;
        });
      }
    }
  }

  downloadFile(data: any) {
    const url = window.URL.createObjectURL(data.body);
    var anchor = document.createElement("a");
    anchor.download = data.body.name;
    anchor.href = url;
    anchor.click();
  }

}
