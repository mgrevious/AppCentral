
import { Component, OnInit } from '@angular/core';


import { HttpModule } from '@angular/http';
import { SharePointSite } from './sharepoint-site';
import { ApplicationCentralService } from './application-central.service';

@Component({
    moduleId: module.id,
    //selector: 'uh-sharepoint-sites',
    templateUrl: './sharepoint-sites.component.html'
    , providers: [ApplicationCentralService]
})

export class SharePointSitesComponent implements OnInit {
    sharePointSites: SharePointSite[];
    selectedSharePointSite: SharePointSite;
    private loading: boolean = true;

    constructor(
        private applicationCentralService: ApplicationCentralService) { }
    //        ,
    //   private router: Router) { }

    getSharePointSites(): void {
        this.applicationCentralService
            .getActiveSharePointSites()
            .then(SharePointSites => {
                this.sharePointSites = SharePointSites;
                if (this.sharePointSites !== undefined && this.sharePointSites !== null) {
                    this.getSharePointSiteById(this.sharePointSites[0].Id);
                }
            });
    }

    getSharePointSiteById(id: number): void {
        this.applicationCentralService
            .getActiveSharePointSiteById(id)
            .then(SharePointSites => {
                this.selectedSharePointSite = SharePointSites;
                //console.log(this.selectediNetApplication);
            });
        this.loading = false;
    }

    ngOnInit(): void {
        this.getSharePointSites();
    }

    onSelect(spSite: SharePointSite): void {
        this.selectedSharePointSite = spSite;
        this.getSharePointSiteById(spSite.Id);
    }
}