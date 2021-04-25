import { Component, OnInit, Input, OnChanges } from '@angular/core';

export interface IMenuItems {
  menuName: string;
  routePath: string;
  isActive?: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnChanges {
  @Input() lang!: string; // decorate the property with @Input()
  role = localStorage.getItem('role');
  isUserOpen = true;
  isDomainOpen = true;
  isrouteModalOpen = true;
  selectedItem: string = '';
  routeModelMenuLists: IMenuItems[] = []
  constructor() { 
    this.routeModelMenuLists = [{
      menuName: 'Geoelement',
      routePath: 'routemodel/geoelement',
      isActive: true
    }, {
      menuName: 'RouteSegment',
      routePath: 'routemodel/routesegment',
      isActive: true
    }, {
      menuName: 'RouteDeviation',
      routePath: 'routemodel/routedeviate',
      isActive: true
    }, {
      menuName: 'PilotTraject',
      routePath: 'routemodel/pilottraject',
      isActive: true
    }, {
      menuName: 'HydroMeteo',
      routePath: 'routemodel/hydrometeo',
      isActive: true
    }, {
      menuName: 'CBSLocations',
      routePath: 'routemodel/cbslocation',
      isActive: true
    }, {
      menuName: 'ExportLayer',
      routePath: 'routemodel/export-layer',
      isActive: true
    }];
  }

  ngOnInit(): void {

    this.isUserOpen = window.location.href.indexOf("app") > -1?false:false;
    this.isDomainOpen = window.location.href.indexOf("domains") > -1?true:false;
    this.isrouteModalOpen = window.location.href.indexOf("routemodel") > -1?true:false;
    console.log("this.isrouteModalOpen", this.isrouteModalOpen)
    console.log("this.isDomainOpen", this.isDomainOpen)

    this.selectedItem = '';
    const selectedItem = localStorage.getItem("currentMenu");
    if(selectedItem) {
      this.selectedItem = selectedItem;
    }
  }

  menuChange(menu:any){
    this.isUserOpen = (menu ==='user' ?true:false);
    this.isDomainOpen = menu ==='domain' ?true:false;
    this.isrouteModalOpen = menu ==='routeModel' ?true:false;
  }

  // tslint:disable-next-line:typedef
  ngOnChanges() {
    console.log(window.location.href.indexOf("app") > -1)
    this.isUserOpen = window.location.href.indexOf("app") > -1?false:false;
    this.isDomainOpen = window.location.href.indexOf("domains") > -1?true:false;
    this.isrouteModalOpen = window.location.href.indexOf("routemodel") > -1?true:false;
  }
  
}
