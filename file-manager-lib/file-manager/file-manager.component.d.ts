import { EventEmitter, OnInit, TemplateRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { TreeModel } from './models/tree.model';
import { NodeService } from './services/node.service';
import { NodeInterface } from './interfaces/node.interface';
import { AppStore } from './reducers/reducer.factory';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { NodeClickedService } from './services/node-clicked.service';
import { TranslateService } from '@ngx-translate/core';
export declare class FileManagerComponent implements OnInit {
    private store;
    private nodeService;
    private nodeClickedService;
    ngxSmartModalService: NgxSmartModalService;
    translate: TranslateService;
    iconTemplate: TemplateRef<any>;
    folderContentTemplate: TemplateRef<any>;
    folderContentBackTemplate: TemplateRef<any>;
    folderContentNewTemplate: TemplateRef<any>;
    loadingOverlayTemplate: TemplateRef<any>;
    sideViewTemplate: TemplateRef<any>;
    tree: TreeModel;
    isPopup: boolean;
    itemClicked: EventEmitter<{}>;
    private _language;
    language: string;
    selectedNode: NodeInterface;
    sideMenuClosed: boolean;
    fmOpen: boolean;
    loading: boolean;
    newDialog: boolean;
    constructor(store: Store<AppStore>, nodeService: NodeService, nodeClickedService: NodeClickedService, ngxSmartModalService: NgxSmartModalService, translate: TranslateService);
    ngOnInit(): void;
    onItemClicked(event: any): void;
    searchClicked(data: any): void;
    handleFileManagerClickEvent(event: any): void;
    nodeClickHandler(node: NodeInterface, closing?: boolean): void;
    highlightSelected(node: NodeInterface): void;
    private highilghtChildElement(el, light?);
    private getElementById(id, prefix?);
    private removeClass(className);
    fmShowHide(): void;
    backdropClicked(): void;
    handleUploadDialog(event: any): void;
}
