export class TreeNode {
    hasChildNodes: boolean;
    name: string;
    toggle: boolean = false;
    id: number;

    constructor(theNodes?: boolean, name?: string, id?: number) {
        this.hasChildNodes = theNodes;
        this.name = name;
        this.id = id;
    }
}