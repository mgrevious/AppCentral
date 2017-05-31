
import { Component, OnInit } from '@angular/core';


import { HttpModule } from '@angular/http';
import { CmsSite }  from './cms-site';
import { ApplicationCentralService } from './application-central.service';

@Component({
    moduleId: module.id,
   // selector: 'uh-cms-sites',
    templateUrl: './cms-sites.component.html'
    , providers: [ApplicationCentralService]
})

export class CmsSitesComponent implements OnInit {
    cmsSites: CmsSite[];
    selectedCmsSite: CmsSite;
    private loading: boolean = true;

    constructor(
        private applicationCentralService: ApplicationCentralService) { }
    //        ,
    //   private router: Router) { }

    getCmsSites(): void {
        this.applicationCentralService
            .getActiveCmsSites()
            .then(CmsSites => {
                this.cmsSites = CmsSites;
                if (this.cmsSites !== undefined && this.cmsSites !== null) {
                    this.getCmsSiteById(this.cmsSites[0].Id);
                }
            });
    }

    getCmsSiteById(id: number): void {
        this.applicationCentralService
            .getActiveCmsSiteById(id)
            .then(CmsSites => {
                this.selectedCmsSite = CmsSites;
                //console.log(this.selectediNetApplication);
            });
        this.loading = false;
    }

    ngOnInit(): void {
        this.getCmsSites();
    }

    onSelect(cmsSite: CmsSite): void {
        this.selectedCmsSite = cmsSite;
        this.getCmsSiteById(cmsSite.Id);
    }
}