import { EventEmitter, Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class TreeViewService {
    siteSelectedEmitter: EventEmitter<number>;

    constructor(private http: Http) {
        this.siteSelectedEmitter = new EventEmitter<number>();
    }
}