import { Component, Input } from '@angular/core';
import { SharePointSite } from './sharepoint-site';

@Component({
    selector: 'uh-sharepoint-site-detail',
    templateUrl: 'sharepoint-site-detail.component.html'
})
export class SharePointSiteDetailComponent
{
    @Input()
    private spSite: SharePointSite;
}

