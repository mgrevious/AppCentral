import { Component, Input } from '@angular/core';
import { CmsSite } from './cms-site';

@Component({
    selector: 'uh-cms-site-detail',
    templateUrl: 'cms-site-detail.component.html'
})
export class CmsSiteDetailComponent
{
    @Input()
    private cmsSite: CmsSite;

}

