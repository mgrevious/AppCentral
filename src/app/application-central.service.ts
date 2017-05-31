// Imports
import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptionsArgs } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { iNetApplication } from './inet-application';
import { SharePointSite } from './sharepoint-site';
import { CmsSite } from './cms-site';
import { HomepageSite } from './homepage-site';

@Injectable()
export class ApplicationCentralService {

    //public siteSelectedEmitter: EventEmitter<number>;

    private headers = new Headers({ 'Content-Type': 'application/json' });
    private getActiveiNetAppsUrl = 'http://localhost/ApplicationCentral/Service/api/INetApplication/GetActive'; 
    private getActiveiNetAppByIdUrl = 'http://localhost/ApplicationCentral/Service/api/INetApplication/Get/';


    private getActiveSharePointSitesUrl = 'http://localhost/ApplicationCentral/Service/api/SharePointSite/GetActive';
    private getActiveSharePointSiteByIdUrl = 'http://localhost/ApplicationCentral/Service/api/SharePointSite/Get/';

    private getActiveCmsSitesUrl = 'http://localhost/ApplicationCentral/Service/api/CMSSite/GetActive';
    private getActiveCmsSiteByIdUrl = 'http://localhost/ApplicationCentral/Service/api/CMSSite/Get/';

    private getActiveHomepageSitesUrl = 'http://localhost/ApplicationCentral/Service/api/HomePageSite/GetActive/';
    private getActiveHomepageSiteByIdUrl = 'http://localhost/ApplicationCentral/Service/api/HomePageSite/Get/';

    constructor(private http: Http) {
        //this.siteSelectedEmitter = new EventEmitter();
    }

    getActiveiNetApplications(): Promise<iNetApplication[]> {
        return this.http.get(this.getActiveiNetAppsUrl)
            .toPromise()
            .then(response => response.json().Data as iNetApplication[])
            .catch(this.handleError);
    }

    getActiveiNetApplicationById(id: number): Promise<iNetApplication> {
        return this.http.get(this.getActiveiNetAppByIdUrl + id)
            .toPromise()
            .then(response => response.json().Data as iNetApplication)
            .catch(this.handleError);
    }

    getActiveSharePointSites(): Promise<SharePointSite[]> {
        return this.http.get(this.getActiveSharePointSitesUrl)
            .toPromise()
            .then(response => response.json().Data as SharePointSite[])
            .catch(this.handleError);
    }

    getActiveSharePointSiteById(id: number): Promise<SharePointSite> {
        return this.http.get(this.getActiveSharePointSiteByIdUrl + id)
            .toPromise()
            .then(response => response.json().Data as SharePointSite)
            .catch(this.handleError);
    }

    getActiveCmsSites(): Promise<CmsSite[]> {
        return this.http.get(this.getActiveCmsSitesUrl)
            .toPromise()
            .then(response => response.json().Data as CmsSite[])
            .catch(this.handleError);
    }

    getActiveCmsSiteById(id: number): Promise<CmsSite> {
        return this.http.get(this.getActiveCmsSiteByIdUrl + id)
            .toPromise()
            .then(response => response.json().Data as CmsSite)
            .catch(this.handleError);
    }

    getActiveHomepageSites(): Promise<HomepageSite[]> {
        return this.http.get(this.getActiveHomepageSitesUrl)
            .toPromise()
            .then(response => response.json().Data as HomepageSite[])
            .catch(this.handleError);
    }

    getActiveHomepageChildSites(id: string): Promise<HomepageSite[]> {
        let url = this.getActiveHomepageSitesUrl;

        if (id != null)            
            url = this.getActiveHomepageSitesUrl + id;

        console.log('getActiveHomepageChildSites Url' + url);

        return this.http.get(url)
            .toPromise()
            .then(response => response.json().Data as HomepageSite[])
            .catch(this.handleError);
    }

    getActiveHomepageSiteById(id: number): Promise<HomepageSite> {
        return this.http.get(this.getActiveHomepageSiteByIdUrl + id)
            .toPromise()
            .then(response => response.json().Data as HomepageSite)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }


    //// Resolve HTTP using the constructor
    //constructor(private http: Http) { }
    //// private instance variable to hold base url
    //private commentsUrl = 'http://localhost:3000/api/comments';

    //// Fetch all existing comments
    //getActiveiNetApplications(): Observable<Comment[]> {

    //    // ...using get request
    //    return this.http.get(this.commentsUrl)
    //        // ...and calling .json() on the response to return data
    //        .map((res: Response) => res.json())
    //        //...errors if any
    //        .catch((error: any) => Observable.throw(error.json().error || 'Server error'));

    //}

}

