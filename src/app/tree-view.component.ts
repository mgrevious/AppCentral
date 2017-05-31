import { Component, Input } from '@angular/core';
import { HomepageSite } from './homepage-site';
import { ApplicationCentralService } from './application-central.service';
import { TreeViewService } from './tree-view.service';
import { TreeNode } from './tree-node';

@Component({
    selector: 'tree-view',
    templateUrl: './tree-view.component.html'
})
export class TreeViewComponent {
    selectedNode: TreeNode;
    treeNodes = new Array<TreeNode>();

    @Input()
    setTreeNodes: (id: string, nodes: TreeNode[]) => void;

    @Input()
    private startingNodeId: string;

    constructor(private applicationCentralService: ApplicationCentralService, private treeViewService: TreeViewService) { }

    populateNodes(): void {
        if (this.setTreeNodes !== undefined && this.setTreeNodes !== null && typeof this.setTreeNodes === 'function') {
            this.setTreeNodes(this.startingNodeId, this.treeNodes);
        }
    }      

    ngOnInit(): void {
        this.populateNodes();
    }

    onSelect(node: TreeNode): void {
        node.toggle = !node.toggle;
        this.treeViewService.siteSelectedEmitter.emit(node.id);
    }
}

