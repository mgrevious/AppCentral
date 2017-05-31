import { Component, OnInit } from '@angular/core';
//import { Router } from '@angular/router';

import { HttpModule } from '@angular/http';
import { iNetApplication } from './inet-application';
import { searchSite } from './search-site';
import { ApplicationCentralService } from './application-central.service';
//import { SimpleTinyDirective } from './simple-tiny.directive';


@Component({
    moduleId: module.id,
    //selector: 'uh-inet-apps',
    templateUrl: './inet-apps.component.html'
    , providers: [ApplicationCentralService]

})

export class iNetApplicationsComponent implements OnInit {
    iNetApplications: iNetApplication[];
    clientiNetApplications: iNetApplication[];
    selectediNetApplication: iNetApplication;
    searchiNetModel = new searchSite;
    private loading: boolean = true;

    constructor(
        private applicationCentralService: ApplicationCentralService) { }
//        ,
     //   private router: Router) { }

    getiNetApplications(): void {
        this.applicationCentralService
            .getActiveiNetApplications()
            .then(iNetApplications => {
                this.iNetApplications = iNetApplications;
                this.clientiNetApplications = iNetApplications;
                if (this.iNetApplications !== undefined && this.iNetApplications !== null) {
                    this.getiNetApplicationById(this.iNetApplications[0].Id);
                }
            });
    }

    getiNetApplicationById(id: number): void {
        this.applicationCentralService
            .getActiveiNetApplicationById(id)
            .then(iNetApplications => {
                this.selectediNetApplication = iNetApplications;
                //console.log(this.selectediNetApplication);
            });
            this.loading = false;
    }

    ngOnInit(): void {
        this.getiNetApplications();
    }

    onSelect(iNetApp: iNetApplication): void {
        this.selectediNetApplication = iNetApp;
        this.getiNetApplicationById(iNetApp.Id);
    }

    clearSearch() {
        var that = this;
        that.searchiNetModel = new searchSite;
        that.clientiNetApplications = that.iNetApplications;
        that.getiNetApplicationById(that.clientiNetApplications[0].Id);
    }

    performSearch() {
        var that = this;
        
        if (!that.searchiNetModel) {
            return;
        }
        
        that.clientiNetApplications = that.iNetApplications;
        var data = that.searchiNetModel;
        if (!that.isEmpty(data.Name)) {
            that.clientiNetApplications = that.clientiNetApplications.filter((s) => s.Name.toLowerCase().indexOf(data.Name.toLowerCase()) !== -1);
        }
        if (!that.isEmpty(data.Description)) {
            that.clientiNetApplications = that.clientiNetApplications.filter((s) => s.Description != null);
            that.clientiNetApplications = that.clientiNetApplications.filter((s) => s.Description.toLowerCase().indexOf(data.Description.toLowerCase()) !== -1);
        }
        if (!that.isEmpty(data.Notes)) {
            that.clientiNetApplications = that.clientiNetApplications.filter((s) => s.Notes != null);
            that.clientiNetApplications = that.clientiNetApplications.filter((s) => s.Notes.toLowerCase().indexOf(data.Notes.toLowerCase()) !== -1);
        }
        if (that.clientiNetApplications.length != 0) {
            that.getiNetApplicationById(that.clientiNetApplications[0].Id);
        }
        if (that.clientiNetApplications.length == 0) {
            this.selectediNetApplication = null;
        }
        

    }

    isEmpty(value: string) {

        if (value == undefined || value == null || value.trim() == "") {
            return true;
        }
        else {
            return false
        }
    }
}
