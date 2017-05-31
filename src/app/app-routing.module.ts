import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { iNetApplicationsComponent } from './inet-apps.component';
import { SharePointSitesComponent } from './sharepoint-sites.component';
import { CmsSitesComponent } from './cms-sites.component';
import { HomepageSitesComponent } from './homepage-sites.component';

const routes: Routes = [
    { path: '', redirectTo: '/inetapp', pathMatch: 'full' } ,
    { path: 'sharepoint', component: SharePointSitesComponent } ,
    { path: 'inetapp', component: iNetApplicationsComponent },
    { path: 'cms', component: CmsSitesComponent },
    { path: 'homepage', component: HomepageSitesComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }