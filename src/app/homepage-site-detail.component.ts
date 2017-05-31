import { Component, Input } from '@angular/core';
import { HomepageSite } from './homepage-site';

@Component({
    selector: 'uh-homepage-site-detail',
    templateUrl: 'homepage-site-detail.component.html'
})
export class HomepageSiteDetailComponent {
    @Input()
    private homepageSite: HomepageSite;
}

