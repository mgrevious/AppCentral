import { Component, OnInit } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HomepageSite } from './homepage-site';
import { ApplicationCentralService } from './application-central.service';
import { TreeViewService } from './tree-view.service';
import { TreeNode } from './tree-node';

@Component({
    moduleId: module.id,
    selector: 'uh-homepage-sites',
    templateUrl: './homepage-sites.component.html'
})

export class HomepageSitesComponent implements OnInit {
    homepageSites: HomepageSite[];
    selectedHomepageSite: HomepageSite;
    startingNodeId: string;
    private loading: boolean = true;

    constructor(private applicationCentralService: ApplicationCentralService, private treeViewService: TreeViewService) {
        treeViewService.siteSelectedEmitter.subscribe((id:number) => this.onSelect(id));
    }
   
    getHomepageSites(): void {
        this.applicationCentralService
            .getActiveHomepageSites()
            .then(homepageSites => {
                this.homepageSites = homepageSites;
                if (this.homepageSites !== undefined && this.homepageSites !== null) {
                    this.getHomepageSiteById(this.homepageSites[0].Id);
                }
            });
    }
    
    getHomepageSiteById(id: number): void {
        this.applicationCentralService
            .getActiveHomepageSiteById(id)
            .then(homepageSites => {
                this.selectedHomepageSite = homepageSites;
            });
        this.loading = false;
    }

    getHomePageChildSites(startingNodeId: string, nodes: TreeNode[]): void {
        this.applicationCentralService
            .getActiveHomepageChildSites(startingNodeId)
            .then((homepageSites: HomepageSite[]) => {
                if (homepageSites !== undefined && homepageSites !== null && nodes !== undefined && nodes !== null) {
                    for (let homepageSite of homepageSites) {
                        const treeNode = new TreeNode();
                        //const treeNode = new TreeNode(homepageSite.HasChildren, homepageSite.Name, homepageSite.Id);
                        treeNode.hasChildNodes = homepageSite.HasChildren;
                        treeNode.id = homepageSite.Id;
                        treeNode.name = homepageSite.Name;
                        nodes.push(treeNode);
                    }
                }
            });
    }

    ngOnInit(): void {
        this.getHomepageSites();
    }

    onSelect(id: number): void {
        this.getHomepageSiteById(id);
    }
}