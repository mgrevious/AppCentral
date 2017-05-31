import './rxjs-extensions';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ApplicationCentralService } from './application-central.service';
import { TreeViewService } from './tree-view.service';

import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { GridModule } from '@progress/kendo-angular-grid';

import { AppComponent } from './app.component';
import { iNetApplicationsComponent } from './inet-apps.component';
import { iNetApplicationDetailComponent } from './inet-app-detail.component';

import { SharePointSitesComponent } from './sharepoint-sites.component';
import { SharePointSiteDetailComponent } from './sharepoint-site-detail.component';

import { CmsSitesComponent } from './cms-sites.component';
import { CmsSiteDetailComponent } from './cms-site-detail.component';

import { HomepageSitesComponent } from './homepage-sites.component';
import { HomepageSiteDetailComponent } from './homepage-site-detail.component';
import { TreeViewComponent } from './tree-view.component';
import { SimpleTinyDirective } from './simple-tiny.directive';

import { AppRoutingModule } from './app-routing.module';

@NgModule({

    declarations: [
        AppComponent,
        iNetApplicationsComponent,
        iNetApplicationDetailComponent,
        SharePointSitesComponent,
        SharePointSiteDetailComponent,
        CmsSitesComponent,
        CmsSiteDetailComponent,
        HomepageSitesComponent,
        HomepageSiteDetailComponent,
        TreeViewComponent,
        SimpleTinyDirective

    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpModule,
        ButtonsModule,
        LayoutModule,
        GridModule,
        AppRoutingModule
        //,
        //RouterModule.forRoot([
        //    {
        //        path: 'iNetApp',
        //        component: iNetApplicationsComponent
        //    }
        //])
    ],
    providers: [ApplicationCentralService, TreeViewService] 
    ,
    
    bootstrap: [AppComponent]
})
export class AppModule { }
