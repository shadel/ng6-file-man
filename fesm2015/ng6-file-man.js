import { Injectable, Pipe, Component, ViewEncapsulation, EventEmitter, Input, Output, TemplateRef, ContentChild, ViewChild, NgModule, InjectionToken, defineInjectable, inject } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { HttpClient, HttpParams, HttpClientModule } from '@angular/common/http';
import { Store, select, StoreModule } from '@ngrx/store';
import { NgxSmartModalService, NgxSmartModalModule } from 'ngx-smart-modal';
import { first } from 'rxjs/operators';
import { _ } from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import { FineUploader } from 'fine-uploader';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class TreeModel {
    /**
     * @param {?} config
     */
    constructor(config) {
        // this._currentPath = config.startingFolder; // todo implement (config.interfce.ts)
        this._currentPath = '';
        this.config = config;
        this.nodes = (/** @type {?} */ ({
            id: 0,
            pathToNode: '',
            pathToParent: null,
            isFolder: true,
            isExpanded: true,
            stayOpen: true,
            name: 'root',
            children: {}
        }));
    }
    /**
     * @return {?}
     */
    get currentPath() {
        return this._currentPath;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set currentPath(value) {
        this._currentPath = value;
    }
    /**
     * @return {?}
     */
    get nodes() {
        return this._nodes;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set nodes(value) {
        this._nodes = value;
    }
    /**
     * @return {?}
     */
    get selectedNodeId() {
        return this._selectedNodeId;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set selectedNodeId(value) {
        this._selectedNodeId = value;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const SET_PATH = 'SET_PATH';
/** @type {?} */
const SET_LOADING_STATE = 'SET_LOADING_STATE';
/** @type {?} */
const SET_SELECTED_NODE = 'SET_SELECTED_NODE';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NodeService {
    /**
     * @param {?} http
     * @param {?} store
     */
    constructor(http, store) {
        this.http = http;
        this.store = store;
        this.getNodesFromServer = (/**
         * @param {?} path
         * @return {?}
         */
        (path) => {
            /** @type {?} */
            let folderId = this.findNodeByPath(path).id;
            folderId = folderId === 0 ? '' : folderId;
            return this.http.get(this.tree.config.baseURL + this.tree.config.api.listFile, { params: new HttpParams().set('parentPath', folderId) });
        });
    }
    // todo ask server to get parent structure
    /**
     * @param {?} path
     * @return {?}
     */
    startManagerAt(path) {
        this.store.dispatch({ type: SET_PATH, payload: path });
    }
    /**
     * @return {?}
     */
    refreshCurrentPath() {
        this.findNodeByPath(this.currentPath).children = {};
        this.getNodes(this.currentPath);
    }
    /**
     * @param {?} path
     * @return {?}
     */
    getNodes(path) {
        this.parseNodes(path).subscribe((/**
         * @param {?} data
         * @return {?}
         */
        (data) => {
            for (let i = 0; i < data.length; i++) {
                /** @type {?} */
                const parentPath = this.getParentPath(data[i].pathToNode);
                this.findNodeByPath(parentPath).children[data[i].name] = data[i];
            }
        }));
    }
    /**
     * @private
     * @param {?} path
     * @return {?}
     */
    getParentPath(path) {
        /** @type {?} */
        let parentPath = path.split('/');
        parentPath = parentPath.slice(0, parentPath.length - 1);
        return parentPath.join('/');
    }
    /**
     * @private
     * @param {?} path
     * @return {?}
     */
    parseNodes(path) {
        return new Observable((/**
         * @param {?} observer
         * @return {?}
         */
        observer => {
            this.getNodesFromServer(path).subscribe((/**
             * @param {?} data
             * @return {?}
             */
            (data) => {
                observer.next(data.map((/**
                 * @param {?} node
                 * @return {?}
                 */
                node => this.createNode(path, node))));
                this.store.dispatch({ type: SET_LOADING_STATE, payload: false });
            }));
        }));
    }
    /**
     * @private
     * @param {?} path
     * @param {?} node
     * @return {?}
     */
    createNode(path, node) {
        if (node.path[0] !== '/') {
            console.warn('[Node Service] Server should return initial path with "/"');
            node.path = '/' + node.path;
        }
        /** @type {?} */
        const ids = node.path.split('/');
        if (ids.length > 2 && ids[ids.length - 1] === '') {
            ids.splice(-1, 1);
            node.path = ids.join('/');
        }
        /** @type {?} */
        const cachedNode = this.findNodeByPath(node.path);
        return (/** @type {?} */ ({
            id: node.id,
            isFolder: node.dir,
            isExpanded: cachedNode ? cachedNode.isExpanded : false,
            pathToNode: node.path,
            pathToParent: this.getParentPath(node.path),
            name: node.name || node.id,
            children: cachedNode ? cachedNode.children : {}
        }));
    }
    /**
     * @param {?} nodePath
     * @return {?}
     */
    findNodeByPath(nodePath) {
        /** @type {?} */
        const ids = nodePath.split('/');
        ids.splice(0, 1);
        return ids.length === 0 ? this.tree.nodes : ids.reduce((/**
         * @param {?} value
         * @param {?} index
         * @return {?}
         */
        (value, index) => value['children'][index]), this.tree.nodes);
    }
    /**
     * @param {?} id
     * @return {?}
     */
    findNodeById(id) {
        /** @type {?} */
        const result = this.findNodeByIdHelper(id);
        if (result === null) {
            console.warn('[Node Service] Cannot find node by id. Id not existing or not fetched. Returning root.');
            return this.tree.nodes;
        }
        return result;
    }
    /**
     * @param {?} id
     * @param {?=} node
     * @return {?}
     */
    findNodeByIdHelper(id, node = this.tree.nodes) {
        if (node.id === id)
            return node;
        /** @type {?} */
        const keys = Object.keys(node.children);
        for (let i = 0; i < keys.length; i++) {
            if (typeof node.children[keys[i]] == 'object') {
                /** @type {?} */
                const obj = this.findNodeByIdHelper(id, node.children[keys[i]]);
                if (obj != null)
                    return obj;
            }
        }
        return null;
    }
    /**
     * @param {?} node
     * @return {?}
     */
    foldRecursively(node) {
        // console.log('folding ', node);
        /** @type {?} */
        const children = node.children;
        Object.keys(children).map((/**
         * @param {?} child
         * @return {?}
         */
        (child) => {
            if (!children.hasOwnProperty(child) || !children[child].isExpanded) {
                return null;
            }
            this.foldRecursively(children[child]);
            //todo put this getElById into one func (curr inside node.component.ts + fm.component.ts) - this won't be maintainable
            document.getElementById('tree_' + children[child].pathToNode).classList.add('deselected');
            children[child].isExpanded = false;
        }));
    }
    /**
     * @return {?}
     */
    foldAll() {
        this.foldRecursively(this.tree.nodes);
    }
    /**
     * @return {?}
     */
    get currentPath() {
        return this._path;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set currentPath(value) {
        this._path = value;
    }
}
NodeService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] },
];
NodeService.ctorParameters = () => [
    { type: HttpClient },
    { type: Store }
];
/** @nocollapse */ NodeService.ngInjectableDef = defineInjectable({ factory: function NodeService_Factory() { return new NodeService(inject(HttpClient), inject(Store)); }, token: NodeService, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NodeClickedService {
    /**
     * @param {?} ngxSmartModalService
     * @param {?} nodeService
     * @param {?} store
     * @param {?} http
     */
    constructor(ngxSmartModalService, nodeService, store, http) {
        this.ngxSmartModalService = ngxSmartModalService;
        this.nodeService = nodeService;
        this.store = store;
        this.http = http;
    }
    /**
     * @param {?} node
     * @return {?}
     */
    startDownload(node) {
        /** @type {?} */
        const parameters = this.parseParams({ path: node.id });
        this.reachServer('download', this.tree.config.api.downloadFile + parameters);
    }
    /**
     * @param {?} node
     * @return {?}
     */
    initDelete(node) {
        this.sideEffectHelper('Delete', { path: node.id }, 'delete', this.tree.config.api.deleteFile, (/**
         * @return {?}
         */
        () => this.successWithModalClose()));
    }
    /**
     * @param {?} input
     * @return {?}
     */
    searchForString(input) {
        this.sideEffectHelper('Search', { query: input }, 'get', this.tree.config.api.searchFiles, (/**
         * @param {?} res
         * @return {?}
         */
        (res) => this.searchSuccess(input, res)));
    }
    /**
     * @param {?} currentParent
     * @param {?} newDirName
     * @return {?}
     */
    createFolder(currentParent, newDirName) {
        this.sideEffectHelper('Create Folder', { dirName: newDirName, parentPath: currentParent === 0 ? null : currentParent }, 'post', this.tree.config.api.createFolder);
    }
    /**
     * @param {?} id
     * @param {?} newName
     * @return {?}
     */
    rename(id, newName) {
        this.sideEffectHelper('Rename', { path: id, newName: newName }, 'post', this.tree.config.api.renameFile, (/**
         * @return {?}
         */
        () => this.successWithModalClose()));
    }
    /**
     * @private
     * @param {?} name
     * @param {?} parameters
     * @param {?} httpMethod
     * @param {?} apiURL
     * @param {?=} successMethod
     * @param {?=} failMethod
     * @return {?}
     */
    sideEffectHelper(name, parameters, httpMethod, apiURL, successMethod = (/**
     * @param {?} a
     * @return {?}
     */
    (a) => this.actionSuccess(a)), failMethod = (/**
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    (a, b) => this.actionFailed(a, b))) {
        /** @type {?} */
        const params = this.parseParams(parameters);
        this.ngxSmartModalService.getModal('waitModal').open();
        this.reachServer(httpMethod, apiURL + params)
            .subscribe((/**
         * @param {?} a
         * @return {?}
         */
        (a) => successMethod(a)), (/**
         * @param {?} err
         * @return {?}
         */
        (err) => failMethod(name, err)));
    }
    /**
     * @private
     * @param {?} method
     * @param {?} apiUrl
     * @param {?=} data
     * @return {?}
     */
    reachServer(method, apiUrl, data = {}) {
        switch (method.toLowerCase()) {
            case 'get':
                return this.http.get(this.tree.config.baseURL + apiUrl);
            case 'post':
                return this.http.post(this.tree.config.baseURL + apiUrl, data);
            case 'delete':
                return this.http.delete(this.tree.config.baseURL + apiUrl);
            case 'download':
                window.open(this.tree.config.baseURL + apiUrl, '_blank');
                return null;
            default:
                console.warn('[NodeClickedService] Incorrect params for this side-effect');
                return null;
        }
    }
    /**
     * @private
     * @param {?} params
     * @return {?}
     */
    parseParams(params) {
        /** @type {?} */
        let query = '?';
        Object.keys(params).filter((/**
         * @param {?} item
         * @return {?}
         */
        item => params[item] !== null)).map((/**
         * @param {?} key
         * @return {?}
         */
        key => {
            query += key + '=' + params[key] + '&';
        }));
        return query.slice(0, -1);
    }
    /**
     * @private
     * @return {?}
     */
    successWithModalClose() {
        this.actionSuccess();
        document.getElementById('side-view').classList.remove('selected');
    }
    /**
     * @private
     * @param {?} input
     * @param {?} data
     * @return {?}
     */
    searchSuccess(input, data) {
        /** @type {?} */
        const obj = {
            searchString: input,
            response: data
        };
        this.actionSuccess();
        this.ngxSmartModalService.setModalData(obj, 'searchModal', true);
        this.ngxSmartModalService.getModal('searchModal').open();
    }
    /**
     * @private
     * @param {?=} response
     * @return {?}
     */
    actionSuccess(response = '') {
        document.body.classList.remove('dialog-open');
        this.nodeService.refreshCurrentPath();
        this.ngxSmartModalService.getModal('waitModal').close();
    }
    /**
     * @private
     * @param {?} name
     * @param {?} error
     * @return {?}
     */
    actionFailed(name, error) {
        document.body.classList.remove('dialog-open');
        this.ngxSmartModalService.getModal('waitModal').close();
        this.ngxSmartModalService.getModal('errorModal').open();
        console.warn('[NodeClickedService] Action "' + name + '" failed', error);
    }
}
NodeClickedService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] },
];
NodeClickedService.ctorParameters = () => [
    { type: NgxSmartModalService },
    { type: NodeService },
    { type: Store },
    { type: HttpClient }
];
/** @nocollapse */ NodeClickedService.ngInjectableDef = defineInjectable({ factory: function NodeClickedService_Factory() { return new NodeClickedService(inject(NgxSmartModalService), inject(NodeService), inject(Store), inject(HttpClient)); }, token: NodeClickedService, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class FileManagerComponent {
    /**
     * @param {?} store
     * @param {?} nodeService
     * @param {?} nodeClickedService
     * @param {?} ngxSmartModalService
     */
    constructor(store, nodeService, nodeClickedService, ngxSmartModalService) {
        this.store = store;
        this.nodeService = nodeService;
        this.nodeClickedService = nodeClickedService;
        this.ngxSmartModalService = ngxSmartModalService;
        this.isPopup = false;
        this.itemClicked = new EventEmitter();
        this.sideMenuClosed = true;
        this.fmOpen = false;
        this.newDialog = false;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        // @ts-ignore
        window.console = window.console || {};
        window.console.log = window.console.log || (/**
         * @return {?}
         */
        function () {
        });
        this.nodeService.tree = this.tree;
        this.nodeClickedService.tree = this.tree;
        this.nodeService.startManagerAt(this.tree.currentPath);
        this.store
            .pipe(select((/**
         * @param {?} state
         * @return {?}
         */
        state => state.fileManagerState.isLoading)))
            .subscribe((/**
         * @param {?} data
         * @return {?}
         */
        (data) => {
            this.loading = data;
        }));
        this.store
            .pipe(select((/**
         * @param {?} state
         * @return {?}
         */
        state => state.fileManagerState.selectedNode)))
            .subscribe((/**
         * @param {?} node
         * @return {?}
         */
        (node) => {
            if (!node) {
                return;
            }
            // fixed highlighting error when closing node but not changing path
            if ((node.isExpanded && node.pathToNode !== this.nodeService.currentPath) && !node.stayOpen) {
                return;
            }
            this.handleFileManagerClickEvent({ type: 'select', node: node });
        }));
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onItemClicked(event) {
        this.itemClicked.emit(event);
    }
    /**
     * @param {?} data
     * @return {?}
     */
    searchClicked(data) {
        // console.log(data);
        // console.log(data);
        /** @type {?} */
        const node = this.nodeService.findNodeById(data.id);
        this.ngxSmartModalService.getModal('searchModal').close();
        this.store.dispatch({ type: SET_SELECTED_NODE, payload: node });
    }
    /**
     * @param {?} event
     * @return {?}
     */
    handleFileManagerClickEvent(event) {
        switch (event.type) {
            case 'closeSideView':
                return this.nodeClickHandler(event.node, true);
            case 'select':
                this.onItemClicked(event);
                this.highlightSelected(event.node);
                return this.nodeClickHandler(event.node);
            case 'download':
                this.nodeClickedService.startDownload(event.node);
                return this.onItemClicked(event);
            case 'renameConfirm':
                return this.ngxSmartModalService.getModal('renameModal').open();
            case 'rename':
                this.ngxSmartModalService.getModal('renameModal').close();
                this.nodeClickedService.rename(this.selectedNode.id, event.value);
                return this.onItemClicked({
                    type: event.type,
                    node: this.selectedNode,
                    newName: event.value
                });
            case 'removeAsk':
                return this.ngxSmartModalService.getModal('confirmDeleteModal').open();
            case 'remove':
                this.ngxSmartModalService.getModal('confirmDeleteModal').close();
                this.nodeClickedService.initDelete(this.selectedNode);
                return this.onItemClicked({
                    type: event.type,
                    node: this.selectedNode
                });
            case 'createFolder':
                /** @type {?} */
                const parentId = this.nodeService.findNodeByPath(this.nodeService.currentPath).id;
                this.nodeClickedService.createFolder(parentId, event.payload);
                return this.onItemClicked({
                    type: event.type,
                    parentId: parentId,
                    newDirName: event.payload
                });
        }
    }
    /**
     * @param {?} node
     * @param {?=} closing
     * @return {?}
     */
    nodeClickHandler(node, closing) {
        if (node.name === 'root') {
            return;
        }
        if (closing) {
            /** @type {?} */
            const parentNode = this.nodeService.findNodeByPath(this.nodeService.currentPath);
            this.store.dispatch({ type: SET_SELECTED_NODE, payload: parentNode });
            this.sideMenuClosed = true;
        }
        else {
            if (this.selectedNode === node && this.sideMenuClosed)
                this.sideMenuClosed = false;
            else if (this.selectedNode === node && !this.sideMenuClosed)
                this.sideMenuClosed = true;
            else if (this.selectedNode !== node && this.sideMenuClosed)
                this.sideMenuClosed = false;
            else if (this.selectedNode !== node && !this.sideMenuClosed)
                this.sideMenuClosed = false;
        }
        this.selectedNode = node;
        // todo investigate this workaround - warning: [File Manager] failed to find requested node for path: [path]
        if (!document.getElementById('side-view')) {
            return;
        }
        if (this.sideMenuClosed) {
            document.getElementById('side-view').classList.remove('selected');
        }
        else {
            document.getElementById('side-view').classList.add('selected');
        }
    }
    // todo stay DRY!
    /**
     * @param {?} node
     * @return {?}
     */
    highlightSelected(node) {
        /** @type {?} */
        let pathToNode = node.pathToNode;
        if (pathToNode.length === 0) {
            pathToNode = 'root';
        }
        /** @type {?} */
        const treeElement = this.getElementById(pathToNode, 'tree_');
        /** @type {?} */
        const fcElement = this.getElementById(pathToNode, 'fc_');
        if (!treeElement && !fcElement) {
            console.warn('[File Manager] failed to find requested node for path:', pathToNode);
            return;
        }
        this.removeClass('highlighted');
        this.removeClass('light');
        if (fcElement)
            this.highilghtChildElement(fcElement);
        if (treeElement)
            this.highilghtChildElement(treeElement, true);
        // parent node highlight
        /** @type {?} */
        let pathToParent = node.pathToParent;
        if (pathToParent === null || node.pathToNode === this.nodeService.currentPath) {
            return;
        }
        if (pathToParent.length === 0) {
            pathToParent = 'root';
        }
        /** @type {?} */
        const parentElement = this.getElementById(pathToParent, 'tree_');
        if (!parentElement) {
            console.warn('[File Manager] failed to find requested parent node for path:', pathToParent);
            return;
        }
        this.highilghtChildElement(parentElement);
    }
    /**
     * @private
     * @param {?} el
     * @param {?=} light
     * @return {?}
     */
    highilghtChildElement(el, light = false) {
        el.children[0] // appnode div wrapper
            .children[0] // ng template first item
            .classList.add('highlighted');
        if (light)
            el.children[0]
                .children[0]
                .classList.add('light');
    }
    /**
     * @private
     * @param {?} id
     * @param {?=} prefix
     * @return {?}
     */
    getElementById(id, prefix = '') {
        /** @type {?} */
        const fullId = prefix + id;
        return document.getElementById(fullId);
    }
    /**
     * @private
     * @param {?} className
     * @return {?}
     */
    removeClass(className) {
        Array.from(document.getElementsByClassName(className))
            .map((/**
         * @param {?} el
         * @return {?}
         */
        (el) => el.classList.remove(className)));
    }
    /**
     * @return {?}
     */
    fmShowHide() {
        this.fmOpen = !this.fmOpen;
    }
    /**
     * @return {?}
     */
    backdropClicked() {
        // todo get rid of this ugly workaround
        // todo fire userCanceledLoading event
        this.store.dispatch({ type: SET_LOADING_STATE, payload: false });
    }
    /**
     * @param {?} event
     * @return {?}
     */
    handleUploadDialog(event) {
        this.newDialog = event;
    }
}
FileManagerComponent.decorators = [
    { type: Component, args: [{
                selector: 'fm-file-manager',
                template: `<ng-container *ngIf="isPopup; then itIsPopup else showContent"></ng-container>

<ng-template #itIsPopup>
  <div *ngIf="!fmOpen">
    <button class="button big" (click)="fmShowHide()" translate="">Open file manager</button>
  </div>
  <div class="file-manager-backdrop" *ngIf="fmOpen">
    <div class="fmModalInside">
      <div *ngIf="fmOpen; then showContent"></div>
    </div>
  </div>
</ng-template>

<ng-template #showContent>
  <div class="content">
    <div class="file-manager-navbar">
      <div class="path">
        <app-nav-bar></app-nav-bar>
      </div>

      <div class="navigation">
        <app-navigation>
          <div class="button close" (click)="fmShowHide()" *ngIf="isPopup">
            <i class="fas fa-2x fa-times"></i>
          </div>
        </app-navigation>
      </div>
    </div>

    <div class="holder">
      <div class="file-manager-left">
        <app-tree [treeModel]="tree">
          <ng-template let-nodes>
            <ng-container [ngTemplateOutletContext]="{$implicit: nodes}"
                          [ngTemplateOutlet]="iconTemplate ? iconTemplate : defaultIconTemplate">
            </ng-container>
          </ng-template>
        </app-tree>
      </div>

      <div class="right">
        <app-folder-content
          [treeModel]="tree"
          (openUploadDialog)="handleUploadDialog($event)"
          [folderContentTemplate]="folderContentTemplate ? folderContentTemplate : defaultFolderContentTemplate"
          [folderContentNewTemplate]="folderContentNewTemplate ? folderContentNewTemplate : defaultFolderContentNewTemplate"
          [folderContentBackTemplate]="folderContentBackTemplate ? folderContentBackTemplate : defaultFolderContentBackTemplate">
        </app-folder-content>
      </div>

      <app-side-view id="side-view"
                     [node]="selectedNode"
                     [sideViewTemplate]="sideViewTemplate ? sideViewTemplate : defaultSideViewTemplate"
                     [allowFolderDownload]="tree.config.options.allowFolderDownload"
                     (clickEvent)="handleFileManagerClickEvent($event)">
      </app-side-view>
    </div>
  </div>

  <app-upload *ngIf="newDialog"
              [openDialog]="newDialog"
              (closeDialog)="handleUploadDialog(false)"
              (createDir)="handleFileManagerClickEvent({type: 'createFolder', payload: $event})">
  </app-upload>

  <app-loading-overlay
    *ngIf="loading"
    [loadingOverlayTemplate]="loadingOverlayTemplate ? loadingOverlayTemplate : defaultLoadingOverlayTemplate">
  </app-loading-overlay>
</ng-template>

<ng-template let-node #defaultIconTemplate>
  <div class="file-manager-node" style="display: inline-block; padding: 3px">
    <div *ngIf="node.isFolder; then itIsFolder else showFile"></div>

    <ng-template #itIsFolder>
      <div *ngIf="node.isExpanded; then isFolderExpanded else isFolderClosed"></div>
    </ng-template>

    <ng-template #showFile><i class="fas fa-file child"></i></ng-template>
    <ng-template #isFolderExpanded><i class="fas fa-folder-open child"></i></ng-template>
    <ng-template #isFolderClosed><i class="fas fa-folder child"></i></ng-template>

    <span>{{node.name}}</span>
  </div>
</ng-template>
<ng-template let-node #defaultFolderContentTemplate>
  <div class="file-manager-item">
    <div class="file-preview">
      <div *ngIf="node.isFolder; then itIsFolder else showFile"></div>
      <ng-template #itIsFolder><i class="fas fa-3x fa-folder child"></i></ng-template>
      <ng-template #showFile><i class="fas fa-3x fa-file child"></i></ng-template>
    </div>
    <div class="file-name">
      {{node.name}}
    </div>
  </div>
</ng-template>
<ng-template #defaultFolderContentNewTemplate>
  <div class="file-manager-item">
    <div class="file-preview" style="width: 100%; height:100%">
      <i class="fas fa-3x fa-plus child" style="line-height: 2"></i>
    </div>
  </div>
</ng-template>
<ng-template let-node #defaultFolderContentBackTemplate>
  <div class="file-manager-item">
    <div class="file-preview" style="width: 100%; height:100%">
      <i class="fas fa-2x fa-ellipsis-h" style="line-height: 5"></i>
    </div>
  </div>
</ng-template>
<ng-template let-timeoutMessage #defaultLoadingOverlayTemplate>
  <div class="file-manager-backdrop loading" (click)="backdropClicked()">
    <div class="file-manager-error" *ngIf="timeoutMessage">{{timeoutMessage}}</div>
  </div>
  <div class="spinner">
    <i class="fas fa-5x fa-spin fa-sync-alt"></i>
  </div>
</ng-template>
<ng-template let-node #defaultSideViewTemplate>
  <div style="position: absolute; bottom: 0; width: 100%; margin: 5px auto">
    <span *ngIf="node.isFolder" translate>No data available for this folder</span>
    <span *ngIf="!node.isFolder" translate>No data available for this file</span>
  </div>
</ng-template>

<ngx-smart-modal identifier="renameModal" [dismissable]="false" [closable]="false" *ngIf="selectedNode" #renameModal>
  <h2 class="modal-title" translate>
    Rename file
  </h2>
  <p class="rename-name" translate>
    Old name
  </p>
  <span style="margin: 8px">{{selectedNode.name}}</span>
  <p class="rename-name" translate>
    New name
  </p>
  <input placeholder="New name" type="text" class="rename-input" [value]="selectedNode.name" #renameInput
         (keyup.enter)="handleFileManagerClickEvent({type: 'rename', value: renameInput.value})"
         onclick="this.select();">
  <br>

  <div class="rename-button">
    <button class="button big" translate
            (click)="handleFileManagerClickEvent({type: 'rename', value: renameInput.value})"
            [disabled]="renameInput.value === selectedNode.name || renameInput.value.length === 0">
      Rename
    </button>
    <button class="button big" (click)="renameModal.close()" translate>
      Cancel
    </button>
  </div>

</ngx-smart-modal>
<ngx-smart-modal *ngIf="selectedNode" identifier="confirmDeleteModal" #deleteModal
                 [dismissable]="false" [closable]="false">
  <h2 class="modal-title">
    <span translate>You are trying to delete following </span>
    <span *ngIf="selectedNode.isFolder" translate>folder</span>
    <span *ngIf="!selectedNode.isFolder" translate>file</span>
  </h2>

  <div style="width: 100%; margin: 5px auto; text-align: center">{{selectedNode.name}}</div>

  <div class="rename-button">
    <button class="button big" (click)="handleFileManagerClickEvent({type: 'remove'})">
      <span translate>Yes, delete this </span>
      <span *ngIf="selectedNode.isFolder" translate>folder</span>
      <span *ngIf="!selectedNode.isFolder" translate>file</span>
    </button>
    <button class="button big" (click)="deleteModal.close()" translate>
      Cancel
    </button>
  </div>
</ngx-smart-modal>
<ngx-smart-modal identifier="searchModal" #searchModal [closable]="true">
  <h2 class="modal-title" style="margin-bottom: 2px" translate
      *ngIf="searchModal.hasData() && searchModal.getData().response.length !== 0">
    Search results for
  </h2>
  <h2 class="modal-title" style="margin-bottom: 2px" translate
      *ngIf="!searchModal.hasData() || searchModal.getData().response.length === 0">
    No results found for
  </h2>
  <div style="text-align: center" *ngIf="searchModal.hasData()">{{searchModal.getData().searchString}}</div>

  <div *ngIf="searchModal.hasData() && searchModal.getData().response.length !== 0">
    <table style="margin: 0 auto">
      <tr>
        <td class="table-item table-head" translate>File name</td>
        <td class="table-item-short table-head" translate>Size</td>
      </tr>
      <tr *ngFor="let item of searchModal.getData().response" (click)="searchClicked(item)">
        <td style="cursor: pointer">
          <ng-container *ngIf="item.fileCategory === 'D'; else file">
            <i class="fas fa-folder search-output-icon"></i>
          </ng-container>
          <ng-template #file>
            <i class="fas fa-file search-output-icon"></i>
          </ng-template>
          <span style="text-overflow: ellipsis">{{item.name}}</span>
        </td>
        <td class="table-item-short">{{item.size}}</td>
      </tr>
    </table>
  </div>
</ngx-smart-modal>
<ngx-smart-modal identifier="waitModal" [closable]="false" [dismissable]="false" [escapable]="false">
  <h2 class="modal-title" style="margin-top: 20px">
    {{'Processing request'}}...
  </h2>

  <div style="text-align: center; height: 70px">
    <i class="fas fa-spinner fa-spin fa-4x"></i>
  </div>
</ngx-smart-modal>
<ngx-smart-modal identifier="errorModal" [closable]="true">
  <h2 class="modal-title" style="margin-top: 20px">
    {{'Something went wrong with your request'}}...
  </h2>
</ngx-smart-modal>
`,
                styles: [`.content{height:100%;min-width:850px}.holder{display:-webkit-flex;display:flex;height:calc(100% - 75px)}.path{margin:auto 0;display:block}.navigation{margin:auto 0;display:-webkit-flex;display:flex}.navigation .button{margin:0 10px;padding:0;position:relative}.right{width:100%;position:relative;overflow:auto}.file-name{width:100px;height:25px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;box-sizing:border-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.file-preview{margin:auto}.file-preview i{line-height:1.5}.spinner{position:absolute;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);cursor:progress}.rename-button{margin:20px auto;display:block;text-align:center}.modal-title{margin-top:5px;text-align:center}.search-output{margin:15px 0}.search-output-icon{margin:2px 5px}.table-item{width:80%}.table-item-short{width:20%;text-align:right}`],
                encapsulation: ViewEncapsulation.None
            },] },
];
FileManagerComponent.ctorParameters = () => [
    { type: Store },
    { type: NodeService },
    { type: NodeClickedService },
    { type: NgxSmartModalService }
];
FileManagerComponent.propDecorators = {
    iconTemplate: [{ type: Input }],
    folderContentTemplate: [{ type: Input }],
    folderContentBackTemplate: [{ type: Input }],
    folderContentNewTemplate: [{ type: Input }],
    loadingOverlayTemplate: [{ type: Input }],
    sideViewTemplate: [{ type: Input }],
    tree: [{ type: Input }],
    isPopup: [{ type: Input }],
    itemClicked: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class FolderContentComponent {
    /**
     * @param {?} nodeService
     * @param {?} store
     */
    constructor(nodeService, store) {
        this.nodeService = nodeService;
        this.store = store;
        this.openUploadDialog = new EventEmitter();
        this.obj = Object;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.store
            .pipe(select((/**
         * @param {?} state
         * @return {?}
         */
        state => state.fileManagerState.path)))
            .subscribe((/**
         * @param {?} path
         * @return {?}
         */
        (path) => {
            this.nodes = this.nodeService.findNodeByPath(path);
        }));
    }
    /**
     * @return {?}
     */
    newClickedAction() {
        this.openUploadDialog.emit(true);
    }
}
FolderContentComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-folder-content',
                template: `<div class="item-holder" *ngIf="nodes">
  <ng-container *ngIf="nodes.id !== 0">
    <app-node [node]=nodes id="{{nodes.pathToNode}}">
      <ng-container [ngTemplateOutletContext]="{$implicit: nodes}"
                    [ngTemplateOutlet]="folderContentBackTemplate">
      </ng-container>
    </app-node>
  </ng-container>

  <ng-container *ngFor="let node of obj.keys(nodes.children)">
    <app-node [node]="nodes.children[node]"
              id="fc_{{nodes.children[node].pathToNode}}">
      <ng-container [ngTemplateOutletContext]="{$implicit: nodes.children[node]}"
                    [ngTemplateOutlet]="folderContentTemplate">
      </ng-container>
    </app-node>
  </ng-container>

  <div class="new" (click)="newClickedAction()">
    <ng-container [ngTemplateOutlet]="folderContentNewTemplate"></ng-container>
  </div>
</div>
`,
                styles: [`.item-holder{box-sizing:border-box;display:-webkit-flex;display:flex;-webkit-flex-flow:wrap;flex-flow:wrap}.item-holder .new{display:inline}`]
            },] },
];
FolderContentComponent.ctorParameters = () => [
    { type: NodeService },
    { type: Store }
];
FolderContentComponent.propDecorators = {
    folderContentTemplate: [{ type: Input }],
    folderContentBackTemplate: [{ type: Input }],
    folderContentNewTemplate: [{ type: Input }],
    treeModel: [{ type: Input }],
    openUploadDialog: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class TreeComponent {
    /**
     * @param {?} nodeService
     * @param {?} store
     */
    constructor(nodeService, store) {
        this.nodeService = nodeService;
        this.store = store;
        this.currentTreeLevel = '';
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.nodes = this.treeModel.nodes;
        //todo move this store to proper place
        this.store
            .pipe(select((/**
         * @param {?} state
         * @return {?}
         */
        state => state.fileManagerState.path)))
            .subscribe((/**
         * @param {?} path
         * @return {?}
         */
        (path) => {
            this.nodeService.getNodes(path);
            this.currentTreeLevel = this.treeModel.currentPath;
            return this.treeModel.currentPath = path;
        }));
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.store
            .pipe(select((/**
         * @param {?} state
         * @return {?}
         */
        state => state.fileManagerState.path)))
            .pipe(first())
            .subscribe((/**
         * @param {?} path
         * @return {?}
         */
        (path) => {
            /** @type {?} */
            const nodes = this.nodeService.findNodeByPath(path);
            this.store.dispatch({ type: SET_SELECTED_NODE, payload: nodes });
        }));
    }
}
TreeComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-tree',
                template: `<app-node-lister [showFiles]="treeModel.config.options.showFilesInsideTree"
                 [nodes]="{children: nodes}">
  <ng-template let-nodes>
    <ng-container [ngTemplateOutletContext]="{$implicit: nodes}" [ngTemplateOutlet]="templateRef"></ng-container>
  </ng-template>
</app-node-lister>
`,
                styles: [``]
            },] },
];
TreeComponent.ctorParameters = () => [
    { type: NodeService },
    { type: Store }
];
TreeComponent.propDecorators = {
    templateRef: [{ type: ContentChild, args: [TemplateRef,] }],
    treeModel: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NodeListerComponent {
    constructor() {
        this.obj = Object;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
}
NodeListerComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-node-lister',
                template: `<ul class="node-lister-flist">
  <!--In order to avoid having to create that extra div, we can instead use ng-container directive-->
  <ng-container *ngFor="let node of obj.keys(nodes)">
    <li class="node-lister-list-item" *ngIf="nodes[node].isFolder || showFiles">

      <app-node class="node-lister-app-node" [node]="nodes[node]" id="tree_{{nodes[node].id === 0 ? 'root' : nodes[node].pathToNode}}">
        <ng-container [ngTemplateOutletContext]="{$implicit: (nodes[node])}"
                      [ngTemplateOutlet]="templateRef">
        </ng-container>
      </app-node>

      <app-node-lister class="node-lister" *ngIf="obj.keys(nodes[node].children).length > 0"
                       [showFiles]="showFiles" [nodes]="nodes[node].children">
        <ng-template let-nodes>
          <ng-container [ngTemplateOutletContext]="{$implicit: (nodes)}"
                        [ngTemplateOutlet]="templateRef">
          </ng-container>
        </ng-template>
      </app-node-lister>
    </li>
  </ng-container>
</ul>
`,
                styles: [`.node-lister-flist{margin:0 0 0 1em;padding:0;list-style:none;white-space:nowrap}.node-lister-list-item{list-style:none;line-height:1.2em;font-size:1em;display:inline}.node-lister-list-item .node-lister-app-node.deselected+.node-lister ul{display:none}`]
            },] },
];
NodeListerComponent.ctorParameters = () => [];
NodeListerComponent.propDecorators = {
    templateRef: [{ type: ContentChild, args: [TemplateRef,] }],
    nodes: [{ type: Input }],
    showFiles: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NodeComponent {
    /**
     * @param {?} store
     * @param {?} nodeService
     * @param {?} nodeClickedService
     */
    constructor(store, nodeService, nodeClickedService) {
        this.store = store;
        this.nodeService = nodeService;
        this.nodeClickedService = nodeClickedService;
        this.isSingleClick = true;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    method1CallForClick(event) {
        event.preventDefault();
        this.isSingleClick = true;
        setTimeout((/**
         * @return {?}
         */
        () => {
            if (this.isSingleClick) {
                this.showMenu();
            }
        }), 200);
    }
    // todo event.preventDefault for double click
    /**
     * @param {?} event
     * @return {?}
     */
    method2CallForDblClick(event) {
        event.preventDefault();
        this.isSingleClick = false;
        this.open();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
    /**
     * @private
     * @return {?}
     */
    open() {
        if (!this.node.isFolder) {
            this.nodeClickedService.startDownload(this.node);
            return;
        }
        if (this.node.stayOpen) {
            if (this.node.name == 'root') {
                this.nodeService.foldAll();
            }
            this.store.dispatch({ type: SET_PATH, payload: this.node.pathToNode });
            return;
        }
        this.toggleNodeExpanded();
        if (this.node.isExpanded) {
            this.store.dispatch({ type: SET_PATH, payload: this.node.pathToNode });
        }
        this.setNodeSelectedState();
    }
    /**
     * @private
     * @return {?}
     */
    showMenu() {
        this.store.dispatch({ type: SET_SELECTED_NODE, payload: this.node });
    }
    /**
     * @private
     * @return {?}
     */
    toggleNodeExpanded() {
        this.node.isExpanded = !this.node.isExpanded;
    }
    /**
     * @private
     * @return {?}
     */
    setNodeSelectedState() {
        if (!this.node.isExpanded) {
            document.getElementById('tree_' + this.node.pathToNode).classList.add('deselected');
            this.nodeService.foldRecursively(this.node);
            this.store.dispatch({ type: SET_PATH, payload: this.node.pathToParent });
        }
        else {
            document.getElementById('tree_' + this.node.pathToNode).classList.remove('deselected');
        }
    }
}
NodeComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-node',
                template: `<div #customTemplate (dblclick)="method2CallForDblClick($event)" (click)="method1CallForClick($event)">
  <ng-content></ng-content>
</div>
`,
                styles: [``]
            },] },
];
NodeComponent.ctorParameters = () => [
    { type: Store },
    { type: NodeService },
    { type: NodeClickedService }
];
NodeComponent.propDecorators = {
    node: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class MapToIterablePipe {
    /**
     * @param {?} dict
     * @return {?}
     */
    transform(dict) {
        /** @type {?} */
        const a = [];
        for (const key in dict) {
            if (dict.hasOwnProperty(key)) {
                a.push({ key: key, val: dict[key] });
            }
        }
        return a;
    }
}
MapToIterablePipe.decorators = [
    { type: Pipe, args: [{
                name: 'mapToIterablePipe'
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NavBarComponent {
    /**
     * @param {?} store
     * @param {?} nodeService
     */
    constructor(store, nodeService) {
        this.store = store;
        this.nodeService = nodeService;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.store
            .pipe(select((/**
         * @param {?} state
         * @return {?}
         */
        state => state.fileManagerState.path)))
            .subscribe((/**
         * @param {?} data
         * @return {?}
         */
        (data) => {
            this.nodeService.currentPath = data;
            this.currentPath = data.split('/');
        }));
    }
    /**
     * @param {?} path
     * @param {?} index
     * @return {?}
     */
    onClick(path, index) {
        /** @type {?} */
        const newPath = path.slice(0, index + 1).join('/');
        this.store.dispatch({ type: SET_PATH, payload: newPath });
    }
}
NavBarComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-nav-bar',
                template: `<div>
  >> <span *ngFor="let to of currentPath; let i = index">
  <a class="link" (click)="onClick(currentPath, i)">
    <div *ngIf="to === '' || to === 'root'; then icon else name"></div>
    <ng-template #icon><i class="fas fa-home"></i></ng-template>
    <ng-template #name>{{to}}</ng-template>
  </a> /
  </span>
</div>
`,
                styles: [``]
            },] },
];
NavBarComponent.ctorParameters = () => [
    { type: Store },
    { type: NodeService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const initialState = {
    path: '',
    isLoading: true,
    selectedNode: null
};
/**
 * @param {?=} state
 * @param {?=} action
 * @return {?}
 */
function stateReducer(state = initialState, action) {
    // console.log('Previous state: ', state);
    // console.log('ACTION type: ', action.type);
    // console.log('ACTION payload: ', action.payload);
    switch (action.type) {
        case SET_PATH:
            if (state.path === action.payload) {
                return state;
            }
            return Object.assign({}, state, { path: action.payload, isLoading: true });
        case SET_LOADING_STATE:
            return Object.assign({}, state, { isLoading: action.payload });
        case SET_SELECTED_NODE:
            return Object.assign({}, state, { selectedNode: action.payload });
        default:
            return initialState;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const reducers = {
    fileManagerState: stateReducer
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class LoadingOverlayComponent {
    // todo unsubscribe from 'list' event - now we are only dismissing this component
    /**
     * @return {?}
     */
    ngOnInit() {
        timer(2000).subscribe((/**
         * @return {?}
         */
        () => {
            this.timeoutMessage = _('Troubles with loading? Click anywhere to cancel loading');
        }));
    }
}
LoadingOverlayComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-loading-overlay',
                template: `<ng-container
  [ngTemplateOutletContext]="{$implicit: timeoutMessage}"
  [ngTemplateOutlet]="loadingOverlayTemplate">
</ng-container>
`,
                styles: [``]
            },] },
];
LoadingOverlayComponent.propDecorators = {
    loadingOverlayTemplate: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/*
 * Convert bytes into largest possible unit.
 * Takes an precision argument that defaults to 2.
 * Usage:
 *   bytes | fileSize:precision
 * Example:
 *   {{ 1024 |  fileSize}}
 *   formats to: 1 KB
*/
class FileSizePipe {
    /*
     * Convert bytes into largest possible unit.
     * Takes an precision argument that defaults to 2.
     * Usage:
     *   bytes | fileSize:precision
     * Example:
     *   {{ 1024 |  fileSize}}
     *   formats to: 1 KB
    */
    constructor() {
        this.units = [
            'bytes',
            'KB',
            'MB',
            'GB',
            'TB',
            'PB'
        ];
    }
    /**
     * @param {?=} bytes
     * @param {?=} precision
     * @return {?}
     */
    transform(bytes = 0, precision = 2) {
        if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes))
            return '?';
        /** @type {?} */
        let unit = 0;
        while (bytes >= 1024) {
            bytes /= 1024;
            unit++;
        }
        return bytes.toFixed(+precision) + ' ' + this.units[unit];
    }
}
FileSizePipe.decorators = [
    { type: Pipe, args: [{ name: 'fileSize' },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class UploadComponent {
    /**
     * @param {?} http
     * @param {?} nodeService
     */
    constructor(http, nodeService) {
        this.http = http;
        this.nodeService = nodeService;
        this.closeDialog = new EventEmitter();
        this.createDir = new EventEmitter();
        this.newFolder = false;
        this.counter = 0;
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.uploader = new FineUploader({
            debug: false,
            autoUpload: false,
            maxConnections: 1,
            // todo configurable
            element: document.getElementById('fine-uploader'),
            template: document.getElementById('fine-uploader-template'),
            request: {
                endpoint: this.nodeService.tree.config.baseURL + this.nodeService.tree.config.api.uploadFile,
                // forceMultipart: false,
                paramsInBody: false,
                params: {
                    parentPath: this.getCurrentPath
                }
            },
            retry: {
                enableAuto: false
            },
            callbacks: {
                onSubmitted: (/**
                 * @return {?}
                 */
                () => this.counter++),
                onCancel: (/**
                 * @return {?}
                 */
                () => {
                    this.counter < 0 ? console.warn('wtf?') : this.counter--;
                }),
                onAllComplete: (/**
                 * @param {?} succ
                 * @param {?} fail
                 * @return {?}
                 */
                (succ, fail) => {
                    if (succ.length > 0) {
                        this.counter = 0;
                        this.nodeService.refreshCurrentPath();
                    }
                })
            }
        });
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
    /**
     * @return {?}
     */
    get getCurrentPath() {
        /** @type {?} */
        const parentPath = this.nodeService.findNodeByPath(this.nodeService.currentPath).id;
        return parentPath === 0 ? '' : parentPath;
    }
    /**
     * @return {?}
     */
    uploadFiles() {
        this.uploader.uploadStoredFiles();
    }
    /**
     * @param {?=} input
     * @return {?}
     */
    createNewFolder(input) {
        if (!this.newFolder) {
            this.newFolder = true;
        }
        else {
            this.newFolder = false;
            if (input.length > 0) {
                this.createDir.emit(input);
                this.newClickedAction();
            }
        }
    }
    /**
     * @return {?}
     */
    newClickedAction() {
        this.uploader.cancelAll();
        this.closeDialog.emit();
    }
}
UploadComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-upload',
                template: `<div class="backdrop" (click)="newClickedAction()"></div>
<div class="upload-background">
  <div class="buttons">
    <button class="button" [disabled]="newFolder" (click)="createNewFolder()" translate>Create new folder</button>
  </div>

  <div *ngIf="newFolder">
    <div class="buttons">
      <app-new-folder (buttonClicked)="createNewFolder($event)"></app-new-folder>
    </div>
  </div>

  <div id="fine-uploader">
  </div>


  <div class="buttons">
    <button class="button big" [disabled]="this.counter < 1" (click)="uploadFiles()" translate>
      Upload
    </button>
    <button class="button big" (click)="newClickedAction()" translate>
      Close
    </button>
  </div>

</div>

<div id="fine-uploader-template" style="display: none;">
  <div class="qq-uploader-selector qq-uploader" qq-drop-area-text="Drop files here">
    <div class="qq-upload-drop-area-selector qq-upload-drop-area" qq-hide-dropzone>
      <span class="qq-upload-drop-area-text-selector"></span>
    </div>

    <div class="upload-top-bar">
      <div class="qq-upload-button-selector qq-upload-button">
        <div translate>Upload a file</div>
      </div>

      <div class="qq-total-progress-bar-container-selector qq-total-progress-bar-container">
        <div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
             class="qq-total-progress-bar-selector qq-progress-bar qq-total-progress-bar"></div>
      </div>
    </div>

    <span class="qq-drop-processing-selector qq-drop-processing">
            <span translate>Processing dropped files</span>...
            <span class="qq-drop-processing-spinner-selector qq-drop-processing-spinner"></span>
    </span>

    <ul class="qq-upload-list-selector qq-upload-list" aria-live="polite" aria-relevant="additions removals">
      <li>
        <div class="qq-progress-bar-container-selector">
          <div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
               class="qq-progress-bar-selector qq-progress-bar"></div>
        </div>
        <span class="qq-upload-spinner-selector qq-upload-spinner"></span>
        <img class="qq-thumbnail-selector" qq-max-size="100" qq-server-scale>
        <span class="qq-upload-file-selector qq-upload-file"></span>
        <span class="qq-edit-filename-icon-selector qq-edit-filename-icon" aria-label="Edit filename"></span>
        <input class="qq-edit-filename-selector qq-edit-filename" tabindex="0" type="text">
        <span class="qq-upload-size-selector qq-upload-size"></span>
        <button type="button" class="qq-btn qq-upload-cancel-selector qq-upload-cancel" translate>Cancel</button>
        <button type="button" class="qq-btn qq-upload-retry-selector qq-upload-retry" translate>Retry</button>
        <button type="button" class="qq-btn qq-upload-delete-selector qq-upload-delete" translate>Delete</button>
        <span role="status" class="qq-upload-status-text-selector qq-upload-status-text"></span>
      </li>
    </ul>

    <dialog class="qq-alert-dialog-selector">
      <div class="qq-dialog-message-selector"></div>
      <div class="qq-dialog-buttons">
        <button type="button" class="qq-cancel-button-selector" translate>Close</button>
      </div>
    </dialog>

    <dialog class="qq-confirm-dialog-selector">
      <div class="qq-dialog-message-selector"></div>
      <div class="qq-dialog-buttons">
        <button type="button" class="qq-cancel-button-selector" translate>No</button>
        <button type="button" class="qq-ok-button-selector" translate>Yes</button>
      </div>
    </dialog>

    <dialog class="qq-prompt-dialog-selector">
      <div class="qq-dialog-message-selector"></div>
      <input type="text">
      <div class="qq-dialog-buttons">
        <button type="button" class="qq-cancel-button-selector" translate>Cancel</button>
        <button type="button" class="qq-ok-button-selector" translate>Ok</button>
      </div>
    </dialog>
  </div>
</div>
`,
                styles: [`.upload-content{text-align:center;max-height:25vh;overflow:auto;margin:10px auto}.fa-times:before{content:"\\f00d"}.buttons{background:#fff;padding:5px;margin:10px 0}`, `.qq-upload-button div{line-height:25px}.qq-upload-button-focus{outline:0}.qq-uploader{position:relative;min-height:200px;max-height:490px;overflow-y:hidden;width:inherit;border-radius:6px;background-color:#fdfdfd;border:1px dashed #ccc;padding:20px}.qq-uploader:before{content:attr(qq-drop-area-text) " ";position:absolute;font-size:200%;left:0;width:100%;text-align:center;top:45%;opacity:.25}.qq-upload-drop-area,.qq-upload-extra-drop-area{position:absolute;top:0;left:0;width:100%;height:100%;min-height:30px;z-index:2;background:#f9f9f9;border-radius:4px;border:1px dashed #ccc;text-align:center}.qq-upload-drop-area span{display:block;position:absolute;top:50%;width:100%;margin-top:-8px;font-size:16px}.qq-upload-extra-drop-area{position:relative;margin-top:50px;font-size:16px;padding-top:30px;height:20px;min-height:40px}.qq-upload-drop-area-active{background:#fdfdfd;border-radius:4px;border:1px dashed #ccc}.qq-upload-list{margin:0;padding:0;list-style:none;max-height:450px;overflow-y:auto;clear:both}.qq-upload-list li{margin:0;padding:9px;line-height:15px;font-size:16px;color:#424242;background-color:#f6f6f6;border-top:1px solid #fff;border-bottom:1px solid #ddd}.qq-upload-list li:first-child{border-top:none}.qq-upload-list li:last-child{border-bottom:none}.qq-upload-cancel,.qq-upload-continue,.qq-upload-delete,.qq-upload-failed-text,.qq-upload-file,.qq-upload-pause,.qq-upload-retry,.qq-upload-size,.qq-upload-spinner{margin-right:12px;display:inline}.qq-upload-file{vertical-align:middle;display:inline-block;width:300px;text-overflow:ellipsis;white-space:nowrap;overflow-x:hidden;height:18px}.qq-upload-spinner{display:inline-block;background:url(loading.gif);width:15px;height:15px;vertical-align:text-bottom}.qq-drop-processing{display:block}.qq-drop-processing-spinner{display:inline-block;background:url(processing.gif);width:24px;height:24px;vertical-align:text-bottom}.qq-upload-cancel,.qq-upload-continue,.qq-upload-delete,.qq-upload-pause,.qq-upload-retry,.qq-upload-size{font-size:12px;font-weight:400;cursor:pointer;vertical-align:middle}.qq-upload-status-text{font-size:14px;font-weight:700;display:block}.qq-upload-failed-text{display:none;font-style:italic;font-weight:700}.qq-upload-failed-icon{display:none;width:15px;height:15px;vertical-align:text-bottom}.qq-upload-fail .qq-upload-failed-text,.qq-upload-retrying .qq-upload-failed-text{display:inline}.qq-upload-list li.qq-upload-success{background-color:#ebf6e0;color:#424242;border-bottom:1px solid #d3ded1;border-top:1px solid #f7fff5}.qq-upload-list li.qq-upload-fail{background-color:#f5d7d7;color:#424242;border-bottom:1px solid #decaca;border-top:1px solid #fce6e6}.qq-total-progress-bar{height:25px;border-radius:9px}INPUT.qq-edit-filename{position:absolute;opacity:0;z-index:-1}.qq-upload-file.qq-editable{cursor:pointer;margin-right:4px}.qq-edit-filename-icon.qq-editable{display:inline-block;cursor:pointer}INPUT.qq-edit-filename.qq-editing{position:static;height:28px;padding:0 8px;margin-right:10px;margin-bottom:-5px;border:1px solid #ccc;border-radius:2px;font-size:16px;opacity:1}.qq-edit-filename-icon{display:none;background:url(edit.gif);width:15px;height:15px;vertical-align:text-bottom;margin-right:16px}.qq-hide{display:none}.qq-thumbnail-selector{vertical-align:middle;margin-right:12px}.qq-uploader DIALOG{display:none}.qq-uploader DIALOG[open]{display:block}.qq-uploader DIALOG .qq-dialog-buttons{text-align:center;padding-top:10px}.qq-uploader DIALOG .qq-dialog-buttons BUTTON{margin-left:5px;margin-right:5px}.qq-uploader DIALOG .qq-dialog-message-selector{padding-bottom:10px}.qq-uploader DIALOG::-webkit-backdrop{background-color:rgba(0,0,0,.7)}.qq-uploader DIALOG::backdrop{background-color:rgba(0,0,0,.7)}`],
                encapsulation: ViewEncapsulation.None
            },] },
];
UploadComponent.ctorParameters = () => [
    { type: HttpClient },
    { type: NodeService }
];
UploadComponent.propDecorators = {
    openDialog: [{ type: Input }],
    closeDialog: [{ type: Output }],
    createDir: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NewFolderComponent {
    constructor() {
        this.buttonClicked = new EventEmitter();
        this.buttonText = _('Close').toString();
        this.inputValue = '';
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
    /**
     * @return {?}
     */
    onClick() {
        /** @type {?} */
        const el = ((/** @type {?} */ (this.uploadFolder.nativeElement)));
        // @ts-ignore
        this.buttonClicked.emit(el.value);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onInputChange(event) {
        this.inputValue = event.target.value;
        if (this.inputValue.length > 0) {
            this.buttonText = _('Confirm').toString();
        }
        else {
            this.buttonText = _('Close').toString();
        }
    }
}
NewFolderComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-new-folder',
                template: `<p class="new-folder-description" translate>Type new folder name</p>
<input #uploadFolder placeholder="{{'Folder name'}}" (keyup)="onInputChange($event)"
       (keyup.enter)="onClick()" onclick="this.select();" type="text" class="new-folder-input"/>
<button class="button new-folder-send" (click)="onClick()">{{buttonText}}</button>
`,
                styles: [`.new-folder-description{margin:0 auto;padding:0}`]
            },] },
];
NewFolderComponent.ctorParameters = () => [];
NewFolderComponent.propDecorators = {
    uploadFolder: [{ type: ViewChild, args: ['uploadFolder',] }],
    buttonClicked: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class SideViewComponent {
    constructor() {
        this.allowFolderDownload = false;
        this.clickEvent = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
    /**
     * @param {?} event
     * @param {?} type
     * @return {?}
     */
    onClick(event, type) {
        this.clickEvent.emit({ type: type, event: event, node: this.node });
    }
}
SideViewComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-side-view',
                template: `<div class="side-view" *ngIf="node">
  <div class="side-view-preview">
    <i (click)="onClick($event, 'closeSideView')" class="fas fa-times side-view-close"></i>

    <div class="side-view-preview-title">{{node.name}}</div>

    <div class="side-view-preview-content">
      <ng-container
        [ngTemplateOutletContext]="{$implicit: node}"
        [ngTemplateOutlet]="sideViewTemplate">
      </ng-container>
    </div>

    <div class="side-view-buttons">
      <button (click)="onClick($event, 'download')" class="button"
              [disabled]="!allowFolderDownload && node.isFolder" translate>
        Download
      </button>
      <button (click)="onClick($event, 'renameConfirm')" class="button" translate>Rename</button>
      <button (click)="onClick($event, 'removeAsk')" class="button" translate>Delete</button>
    </div>
  </div>
</div>
`,
                styles: [`.side-view-close{position:absolute;cursor:pointer;top:0;right:0;padding:15px}.side-view-buttons{width:100%;display:-webkit-flex;display:flex;-webkit-justify-content:center;justify-content:center;-webkit-flex-flow:column;flex-flow:column}.side-view-buttons .button{margin:5px 0}`],
                encapsulation: ViewEncapsulation.None
            },] },
];
SideViewComponent.ctorParameters = () => [];
SideViewComponent.propDecorators = {
    sideViewTemplate: [{ type: Input }],
    node: [{ type: Input }],
    allowFolderDownload: [{ type: Input }],
    clickEvent: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NavigationComponent {
    /**
     * @param {?} nodeClickedService
     */
    constructor(nodeClickedService) {
        this.nodeClickedService = nodeClickedService;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
    }
    /**
     * @param {?} input
     * @return {?}
     */
    onClick(input) {
        this.nodeClickedService.searchForString(input);
    }
}
NavigationComponent.decorators = [
    { type: Component, args: [{
                selector: 'app-navigation',
                template: `<div class="navigation-component">
  <input #input class="navigation-search" onclick="this.select();" (keyup.enter)="onClick(input.value)"
         placeholder="{{'Search'}}">

  <button [disabled]="input.value.length === 0" class="navigation-search-icon" (click)="onClick(input.value)">
    <i class="fas fa-search"></i>
  </button>

  <div>
    <ng-content></ng-content>
  </div>
</div>


`,
                styles: [`.navigation-component{display:-webkit-flex;display:flex}`],
                encapsulation: ViewEncapsulation.None
            },] },
];
NavigationComponent.ctorParameters = () => [
    { type: NodeClickedService }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const FEATURE_REDUCER_TOKEN = new InjectionToken('AppStore Reducers');
/**
 * @return {?}
 */
function getReducers() {
    // map of reducers
    return reducers;
}
class FileManagerModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: FileManagerModule,
            providers: []
        };
    }
}
FileManagerModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    HttpClientModule,
                    StoreModule.forRoot(FEATURE_REDUCER_TOKEN),
                    CommonModule,
                    NgxSmartModalModule.forRoot(),
                ],
                declarations: [
                    FileManagerComponent,
                    FolderContentComponent,
                    NodeComponent,
                    TreeComponent,
                    NodeListerComponent,
                    MapToIterablePipe,
                    NavBarComponent,
                    LoadingOverlayComponent,
                    FileSizePipe,
                    UploadComponent,
                    NewFolderComponent,
                    SideViewComponent,
                    NavigationComponent
                ],
                exports: [
                    FileManagerComponent,
                    LoadingOverlayComponent,
                    SideViewComponent
                ],
                providers: [
                    {
                        provide: FEATURE_REDUCER_TOKEN,
                        useFactory: getReducers,
                    },
                ]
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { FileManagerComponent, getReducers, FileManagerModule, TreeModel, NodeService, FolderContentComponent as ɵe, LoadingOverlayComponent as ɵk, NodeComponent as ɵf, NewFolderComponent as ɵn, UploadComponent as ɵm, NavBarComponent as ɵj, NavigationComponent as ɵp, SideViewComponent as ɵo, NodeListerComponent as ɵh, TreeComponent as ɵg, FileSizePipe as ɵl, MapToIterablePipe as ɵi, reducers as ɵb, stateReducer as ɵd, NodeClickedService as ɵc };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmc2LWZpbGUtbWFuLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL21vZGVscy90cmVlLm1vZGVsLnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL3JlZHVjZXJzL2FjdGlvbnMuYWN0aW9uLnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL3NlcnZpY2VzL25vZGUuc2VydmljZS50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9zZXJ2aWNlcy9ub2RlLWNsaWNrZWQuc2VydmljZS50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9maWxlLW1hbmFnZXIuY29tcG9uZW50LnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL2NvbXBvbmVudHMvZm9sZGVyLWNvbnRlbnQvZm9sZGVyLWNvbnRlbnQuY29tcG9uZW50LnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL2NvbXBvbmVudHMvdHJlZS90cmVlLmNvbXBvbmVudC50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9jb21wb25lbnRzL3RyZWUvbm9kZS1saXN0ZXIvbm9kZS1saXN0ZXIuY29tcG9uZW50LnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL2NvbXBvbmVudHMvZnVuY3Rpb25zL25vZGUvbm9kZS5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvcGlwZXMvbWFwLXRvLWl0ZXJhYmxlLnBpcGUudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy9uYXYtYmFyL25hdi1iYXIuY29tcG9uZW50LnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL3JlZHVjZXJzL3N0YXRlUmVkdWNlci50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnkudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy9mdW5jdGlvbnMvbG9hZGluZy1vdmVybGF5L2xvYWRpbmctb3ZlcmxheS5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvcGlwZXMvZmlsZS1zaXplLnBpcGUudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy9mdW5jdGlvbnMvdXBsb2FkL3VwbG9hZC5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy9mdW5jdGlvbnMvdXBsb2FkL25ldy1mb2xkZXIvbmV3LWZvbGRlci5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy9zaWRlLXZpZXcvc2lkZS12aWV3LmNvbXBvbmVudC50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9jb21wb25lbnRzL25hdmlnYXRpb24vbmF2aWdhdGlvbi5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvZmlsZS1tYW5hZ2VyLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge05vZGVJbnRlcmZhY2V9IGZyb20gJy4uL2ludGVyZmFjZXMvbm9kZS5pbnRlcmZhY2UnO1xyXG5pbXBvcnQge0NvbmZpZ0ludGVyZmFjZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9jb25maWcuaW50ZXJmYWNlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBUcmVlTW9kZWwge1xyXG4gIHByaXZhdGUgX2N1cnJlbnRQYXRoOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBfbm9kZXM6IE5vZGVJbnRlcmZhY2U7XHJcbiAgcHJpdmF0ZSBfc2VsZWN0ZWROb2RlSWQ6IHN0cmluZztcclxuICBwdWJsaWMgY29uZmlnOiBDb25maWdJbnRlcmZhY2U7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQ29uZmlnSW50ZXJmYWNlKSB7XHJcbiAgICAvLyB0aGlzLl9jdXJyZW50UGF0aCA9IGNvbmZpZy5zdGFydGluZ0ZvbGRlcjsgLy8gdG9kbyBpbXBsZW1lbnQgKGNvbmZpZy5pbnRlcmZjZS50cylcclxuICAgIHRoaXMuX2N1cnJlbnRQYXRoID0gJyc7XHJcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcclxuXHJcbiAgICB0aGlzLm5vZGVzID0gPE5vZGVJbnRlcmZhY2U+e1xyXG4gICAgICBpZDogMCxcclxuICAgICAgcGF0aFRvTm9kZTogJycsXHJcbiAgICAgIHBhdGhUb1BhcmVudDogbnVsbCxcclxuICAgICAgaXNGb2xkZXI6IHRydWUsXHJcbiAgICAgIGlzRXhwYW5kZWQ6IHRydWUsXHJcbiAgICAgIHN0YXlPcGVuOiB0cnVlLFxyXG4gICAgICBuYW1lOiAncm9vdCcsXHJcbiAgICAgIGNoaWxkcmVuOiB7fVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGdldCBjdXJyZW50UGF0aCgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRQYXRoO1xyXG4gIH1cclxuXHJcbiAgc2V0IGN1cnJlbnRQYXRoKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuX2N1cnJlbnRQYXRoID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBnZXQgbm9kZXMoKTogTm9kZUludGVyZmFjZSB7XHJcbiAgICByZXR1cm4gdGhpcy5fbm9kZXM7XHJcbiAgfVxyXG5cclxuICBzZXQgbm9kZXModmFsdWU6IE5vZGVJbnRlcmZhY2UpIHtcclxuICAgIHRoaXMuX25vZGVzID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBnZXQgc2VsZWN0ZWROb2RlSWQoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZE5vZGVJZDtcclxuICB9XHJcblxyXG4gIHNldCBzZWxlY3RlZE5vZGVJZCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICB0aGlzLl9zZWxlY3RlZE5vZGVJZCA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgLy8gdG9kbyBpbXBsZW1lbnQgKGNvbmZpZy5pbnRlcmZjZS50cylcclxuICAvLyBnZXQgaXNDYWNoZSgpOiBib29sZWFuIHtcclxuICAvLyAgIHJldHVybiB0aGlzLmNvbmZpZy5vZmZsaW5lTW9kZTtcclxuICAvLyB9XHJcbiAgLy9cclxuICAvLyBzZXQgaXNDYWNoZSh2YWx1ZTogYm9vbGVhbikge1xyXG4gIC8vICAgdGhpcy5jb25maWcub2ZmbGluZU1vZGUgPSB2YWx1ZTtcclxuICAvLyB9XHJcbn1cclxuIiwiaW1wb3J0IHtBY3Rpb25JbnRlcmZhY2V9IGZyb20gJy4uL2ludGVyZmFjZXMvYWN0aW9uLmludGVyZmFjZSc7XHJcbmltcG9ydCB7Tm9kZUludGVyZmFjZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XHJcblxyXG5leHBvcnQgY29uc3QgU0VUX1BBVEggPSAnU0VUX1BBVEgnO1xyXG5leHBvcnQgY29uc3QgU0VUX0xPQURJTkdfU1RBVEUgPSAnU0VUX0xPQURJTkdfU1RBVEUnO1xyXG5leHBvcnQgY29uc3QgU0VUX1NFTEVDVEVEX05PREUgPSAnU0VUX1NFTEVDVEVEX05PREUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNldFBhdGggaW1wbGVtZW50cyBBY3Rpb25JbnRlcmZhY2Uge1xyXG4gIHJlYWRvbmx5IHR5cGUgPSBTRVRfUEFUSDtcclxuICBwYXlsb2FkOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTZXRMb2FkaW5nU3RhdGUgaW1wbGVtZW50cyBBY3Rpb25JbnRlcmZhY2Uge1xyXG4gIHJlYWRvbmx5IHR5cGUgPSBTRVRfTE9BRElOR19TVEFURTtcclxuICBwYXlsb2FkOiBib29sZWFuO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2V0U2VsZWN0ZWROb2RlIGltcGxlbWVudHMgQWN0aW9uSW50ZXJmYWNlIHtcclxuICByZWFkb25seSB0eXBlID0gU0VUX1NFTEVDVEVEX05PREU7XHJcbiAgcGF5bG9hZDogTm9kZUludGVyZmFjZTtcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgQWN0aW9ucyA9IFNldFBhdGggfCBTZXRMb2FkaW5nU3RhdGUgfCBTZXRTZWxlY3RlZE5vZGU7XHJcbiIsImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7Tm9kZUludGVyZmFjZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XHJcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7VHJlZU1vZGVsfSBmcm9tICcuLi9tb2RlbHMvdHJlZS5tb2RlbCc7XHJcbmltcG9ydCB7SHR0cENsaWVudCwgSHR0cFBhcmFtc30gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgKiBhcyBBQ1RJT05TIGZyb20gJy4uL3JlZHVjZXJzL2FjdGlvbnMuYWN0aW9uJztcclxuaW1wb3J0IHtTdG9yZX0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5pbXBvcnQge0FwcFN0b3JlfSBmcm9tICcuLi9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnknO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgTm9kZVNlcnZpY2Uge1xyXG4gIHB1YmxpYyB0cmVlOiBUcmVlTW9kZWw7XHJcbiAgcHJpdmF0ZSBfcGF0aDogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsIHByaXZhdGUgc3RvcmU6IFN0b3JlPEFwcFN0b3JlPikge1xyXG4gIH1cclxuXHJcbiAgLy8gdG9kbyBhc2sgc2VydmVyIHRvIGdldCBwYXJlbnQgc3RydWN0dXJlXHJcbiAgcHVibGljIHN0YXJ0TWFuYWdlckF0KHBhdGg6IHN0cmluZykge1xyXG4gICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogQUNUSU9OUy5TRVRfUEFUSCwgcGF5bG9hZDogcGF0aH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlZnJlc2hDdXJyZW50UGF0aCgpIHtcclxuICAgIHRoaXMuZmluZE5vZGVCeVBhdGgodGhpcy5jdXJyZW50UGF0aCkuY2hpbGRyZW4gPSB7fTtcclxuICAgIHRoaXMuZ2V0Tm9kZXModGhpcy5jdXJyZW50UGF0aCk7XHJcbiAgfVxyXG5cclxuICBnZXROb2RlcyhwYXRoOiBzdHJpbmcpIHtcclxuICAgIHRoaXMucGFyc2VOb2RlcyhwYXRoKS5zdWJzY3JpYmUoKGRhdGE6IEFycmF5PE5vZGVJbnRlcmZhY2U+KSA9PiB7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IHBhcmVudFBhdGggPSB0aGlzLmdldFBhcmVudFBhdGgoZGF0YVtpXS5wYXRoVG9Ob2RlKTtcclxuICAgICAgICB0aGlzLmZpbmROb2RlQnlQYXRoKHBhcmVudFBhdGgpLmNoaWxkcmVuW2RhdGFbaV0ubmFtZV0gPSBkYXRhW2ldO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0UGFyZW50UGF0aChwYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgbGV0IHBhcmVudFBhdGggPSBwYXRoLnNwbGl0KCcvJyk7XHJcbiAgICBwYXJlbnRQYXRoID0gcGFyZW50UGF0aC5zbGljZSgwLCBwYXJlbnRQYXRoLmxlbmd0aCAtIDEpO1xyXG4gICAgcmV0dXJuIHBhcmVudFBhdGguam9pbignLycpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwYXJzZU5vZGVzKHBhdGg6IHN0cmluZyk6IE9ic2VydmFibGU8Tm9kZUludGVyZmFjZVtdPiB7XHJcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUob2JzZXJ2ZXIgPT4ge1xyXG4gICAgICB0aGlzLmdldE5vZGVzRnJvbVNlcnZlcihwYXRoKS5zdWJzY3JpYmUoKGRhdGE6IEFycmF5PGFueT4pID0+IHtcclxuICAgICAgICBvYnNlcnZlci5uZXh0KGRhdGEubWFwKG5vZGUgPT4gdGhpcy5jcmVhdGVOb2RlKHBhdGgsIG5vZGUpKSk7XHJcbiAgICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogQUNUSU9OUy5TRVRfTE9BRElOR19TVEFURSwgcGF5bG9hZDogZmFsc2V9KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY3JlYXRlTm9kZShwYXRoLCBub2RlKTogTm9kZUludGVyZmFjZSB7XHJcbiAgICBpZiAobm9kZS5wYXRoWzBdICE9PSAnLycpIHtcclxuICAgICAgY29uc29sZS53YXJuKCdbTm9kZSBTZXJ2aWNlXSBTZXJ2ZXIgc2hvdWxkIHJldHVybiBpbml0aWFsIHBhdGggd2l0aCBcIi9cIicpO1xyXG4gICAgICBub2RlLnBhdGggPSAnLycgKyBub2RlLnBhdGg7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgaWRzID0gbm9kZS5wYXRoLnNwbGl0KCcvJyk7XHJcbiAgICBpZiAoaWRzLmxlbmd0aCA+IDIgJiYgaWRzW2lkcy5sZW5ndGggLSAxXSA9PT0gJycpIHtcclxuICAgICAgaWRzLnNwbGljZSgtMSwgMSk7XHJcbiAgICAgIG5vZGUucGF0aCA9IGlkcy5qb2luKCcvJyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY2FjaGVkTm9kZSA9IHRoaXMuZmluZE5vZGVCeVBhdGgobm9kZS5wYXRoKTtcclxuXHJcbiAgICByZXR1cm4gPE5vZGVJbnRlcmZhY2U+e1xyXG4gICAgICBpZDogbm9kZS5pZCxcclxuICAgICAgaXNGb2xkZXI6IG5vZGUuZGlyLFxyXG4gICAgICBpc0V4cGFuZGVkOiBjYWNoZWROb2RlID8gY2FjaGVkTm9kZS5pc0V4cGFuZGVkIDogZmFsc2UsXHJcbiAgICAgIHBhdGhUb05vZGU6IG5vZGUucGF0aCxcclxuICAgICAgcGF0aFRvUGFyZW50OiB0aGlzLmdldFBhcmVudFBhdGgobm9kZS5wYXRoKSxcclxuICAgICAgbmFtZTogbm9kZS5uYW1lIHx8IG5vZGUuaWQsXHJcbiAgICAgIGNoaWxkcmVuOiBjYWNoZWROb2RlID8gY2FjaGVkTm9kZS5jaGlsZHJlbiA6IHt9XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXROb2Rlc0Zyb21TZXJ2ZXIgPSAocGF0aDogc3RyaW5nKSA9PiB7XHJcbiAgICBsZXQgZm9sZGVySWQ6IGFueSA9IHRoaXMuZmluZE5vZGVCeVBhdGgocGF0aCkuaWQ7XHJcbiAgICBmb2xkZXJJZCA9IGZvbGRlcklkID09PSAwID8gJycgOiBmb2xkZXJJZDtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldChcclxuICAgICAgdGhpcy50cmVlLmNvbmZpZy5iYXNlVVJMICsgdGhpcy50cmVlLmNvbmZpZy5hcGkubGlzdEZpbGUsXHJcbiAgICAgIHtwYXJhbXM6IG5ldyBIdHRwUGFyYW1zKCkuc2V0KCdwYXJlbnRQYXRoJywgZm9sZGVySWQpfVxyXG4gICAgKTtcclxuICB9O1xyXG5cclxuICBwdWJsaWMgZmluZE5vZGVCeVBhdGgobm9kZVBhdGg6IHN0cmluZyk6IE5vZGVJbnRlcmZhY2Uge1xyXG4gICAgY29uc3QgaWRzID0gbm9kZVBhdGguc3BsaXQoJy8nKTtcclxuICAgIGlkcy5zcGxpY2UoMCwgMSk7XHJcblxyXG4gICAgcmV0dXJuIGlkcy5sZW5ndGggPT09IDAgPyB0aGlzLnRyZWUubm9kZXMgOiBpZHMucmVkdWNlKCh2YWx1ZSwgaW5kZXgpID0+IHZhbHVlWydjaGlsZHJlbiddW2luZGV4XSwgdGhpcy50cmVlLm5vZGVzKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBmaW5kTm9kZUJ5SWQoaWQ6IG51bWJlcik6IE5vZGVJbnRlcmZhY2Uge1xyXG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5maW5kTm9kZUJ5SWRIZWxwZXIoaWQpO1xyXG5cclxuICAgIGlmIChyZXN1bHQgPT09IG51bGwpIHtcclxuICAgICAgY29uc29sZS53YXJuKCdbTm9kZSBTZXJ2aWNlXSBDYW5ub3QgZmluZCBub2RlIGJ5IGlkLiBJZCBub3QgZXhpc3Rpbmcgb3Igbm90IGZldGNoZWQuIFJldHVybmluZyByb290LicpO1xyXG4gICAgICByZXR1cm4gdGhpcy50cmVlLm5vZGVzO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZmluZE5vZGVCeUlkSGVscGVyKGlkOiBudW1iZXIsIG5vZGU6IE5vZGVJbnRlcmZhY2UgPSB0aGlzLnRyZWUubm9kZXMpOiBOb2RlSW50ZXJmYWNlIHtcclxuICAgIGlmIChub2RlLmlkID09PSBpZClcclxuICAgICAgcmV0dXJuIG5vZGU7XHJcblxyXG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG5vZGUuY2hpbGRyZW4pO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAodHlwZW9mIG5vZGUuY2hpbGRyZW5ba2V5c1tpXV0gPT0gJ29iamVjdCcpIHtcclxuICAgICAgICBjb25zdCBvYmogPSB0aGlzLmZpbmROb2RlQnlJZEhlbHBlcihpZCwgbm9kZS5jaGlsZHJlbltrZXlzW2ldXSk7XHJcbiAgICAgICAgaWYgKG9iaiAhPSBudWxsKVxyXG4gICAgICAgICAgcmV0dXJuIG9iajtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGZvbGRSZWN1cnNpdmVseShub2RlOiBOb2RlSW50ZXJmYWNlKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnZm9sZGluZyAnLCBub2RlKTtcclxuICAgIGNvbnN0IGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcclxuXHJcbiAgICBPYmplY3Qua2V5cyhjaGlsZHJlbikubWFwKChjaGlsZDogc3RyaW5nKSA9PiB7XHJcbiAgICAgIGlmICghY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoY2hpbGQpIHx8ICFjaGlsZHJlbltjaGlsZF0uaXNFeHBhbmRlZCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmZvbGRSZWN1cnNpdmVseShjaGlsZHJlbltjaGlsZF0pO1xyXG4gICAgICAvL3RvZG8gcHV0IHRoaXMgZ2V0RWxCeUlkIGludG8gb25lIGZ1bmMgKGN1cnIgaW5zaWRlIG5vZGUuY29tcG9uZW50LnRzICsgZm0uY29tcG9uZW50LnRzKSAtIHRoaXMgd29uJ3QgYmUgbWFpbnRhaW5hYmxlXHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cmVlXycgKyBjaGlsZHJlbltjaGlsZF0ucGF0aFRvTm9kZSkuY2xhc3NMaXN0LmFkZCgnZGVzZWxlY3RlZCcpO1xyXG4gICAgICBjaGlsZHJlbltjaGlsZF0uaXNFeHBhbmRlZCA9IGZhbHNlO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZm9sZEFsbCgpIHtcclxuICAgIHRoaXMuZm9sZFJlY3Vyc2l2ZWx5KHRoaXMudHJlZS5ub2Rlcyk7XHJcbiAgfVxyXG5cclxuICBnZXQgY3VycmVudFBhdGgoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9wYXRoO1xyXG4gIH1cclxuXHJcbiAgc2V0IGN1cnJlbnRQYXRoKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuX3BhdGggPSB2YWx1ZTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtOb2RlSW50ZXJmYWNlfSBmcm9tICcuLi9pbnRlcmZhY2VzL25vZGUuaW50ZXJmYWNlJztcclxuaW1wb3J0IHtOb2RlU2VydmljZX0gZnJvbSAnLi9ub2RlLnNlcnZpY2UnO1xyXG5pbXBvcnQge1RyZWVNb2RlbH0gZnJvbSAnLi4vbW9kZWxzL3RyZWUubW9kZWwnO1xyXG5pbXBvcnQge0h0dHBDbGllbnR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtOZ3hTbWFydE1vZGFsU2VydmljZX0gZnJvbSAnbmd4LXNtYXJ0LW1vZGFsJztcclxuaW1wb3J0IHtBcHBTdG9yZX0gZnJvbSAnLi4vcmVkdWNlcnMvcmVkdWNlci5mYWN0b3J5JztcclxuaW1wb3J0IHtTdG9yZX0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgTm9kZUNsaWNrZWRTZXJ2aWNlIHtcclxuICBwdWJsaWMgdHJlZTogVHJlZU1vZGVsO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHB1YmxpYyBuZ3hTbWFydE1vZGFsU2VydmljZTogTmd4U21hcnRNb2RhbFNlcnZpY2UsXHJcbiAgICBwcml2YXRlIG5vZGVTZXJ2aWNlOiBOb2RlU2VydmljZSxcclxuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlPEFwcFN0b3JlPixcclxuICAgIHByaXZhdGUgaHR0cDogSHR0cENsaWVudFxyXG4gICkge1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXJ0RG93bmxvYWQobm9kZTogTm9kZUludGVyZmFjZSk6IHZvaWQge1xyXG4gICAgY29uc3QgcGFyYW1ldGVycyA9IHRoaXMucGFyc2VQYXJhbXMoe3BhdGg6IG5vZGUuaWR9KTtcclxuICAgIHRoaXMucmVhY2hTZXJ2ZXIoJ2Rvd25sb2FkJywgdGhpcy50cmVlLmNvbmZpZy5hcGkuZG93bmxvYWRGaWxlICsgcGFyYW1ldGVycyk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgaW5pdERlbGV0ZShub2RlOiBOb2RlSW50ZXJmYWNlKTogdm9pZCB7XHJcbiAgICB0aGlzLnNpZGVFZmZlY3RIZWxwZXIoXHJcbiAgICAgICdEZWxldGUnLFxyXG4gICAgICB7cGF0aDogbm9kZS5pZH0sXHJcbiAgICAgICdkZWxldGUnLFxyXG4gICAgICB0aGlzLnRyZWUuY29uZmlnLmFwaS5kZWxldGVGaWxlLFxyXG4gICAgICAoKSA9PiB0aGlzLnN1Y2Nlc3NXaXRoTW9kYWxDbG9zZSgpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHNlYXJjaEZvclN0cmluZyhpbnB1dDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICB0aGlzLnNpZGVFZmZlY3RIZWxwZXIoXHJcbiAgICAgICdTZWFyY2gnLFxyXG4gICAgICB7cXVlcnk6IGlucHV0fSxcclxuICAgICAgJ2dldCcsXHJcbiAgICAgIHRoaXMudHJlZS5jb25maWcuYXBpLnNlYXJjaEZpbGVzLFxyXG4gICAgICAocmVzKSA9PiB0aGlzLnNlYXJjaFN1Y2Nlc3MoaW5wdXQsIHJlcylcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY3JlYXRlRm9sZGVyKGN1cnJlbnRQYXJlbnQ6IG51bWJlciwgbmV3RGlyTmFtZTogc3RyaW5nKSB7XHJcbiAgICB0aGlzLnNpZGVFZmZlY3RIZWxwZXIoXHJcbiAgICAgICdDcmVhdGUgRm9sZGVyJyxcclxuICAgICAge2Rpck5hbWU6IG5ld0Rpck5hbWUsIHBhcmVudFBhdGg6IGN1cnJlbnRQYXJlbnQgPT09IDAgPyBudWxsIDogY3VycmVudFBhcmVudH0sXHJcbiAgICAgICdwb3N0JyxcclxuICAgICAgdGhpcy50cmVlLmNvbmZpZy5hcGkuY3JlYXRlRm9sZGVyXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlbmFtZShpZDogbnVtYmVyLCBuZXdOYW1lOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuc2lkZUVmZmVjdEhlbHBlcihcclxuICAgICAgJ1JlbmFtZScsXHJcbiAgICAgIHtwYXRoOiBpZCwgbmV3TmFtZTogbmV3TmFtZX0sXHJcbiAgICAgICdwb3N0JyxcclxuICAgICAgdGhpcy50cmVlLmNvbmZpZy5hcGkucmVuYW1lRmlsZSxcclxuICAgICAgKCkgPT4gdGhpcy5zdWNjZXNzV2l0aE1vZGFsQ2xvc2UoKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2lkZUVmZmVjdEhlbHBlcihuYW1lOiBzdHJpbmcsIHBhcmFtZXRlcnM6IHt9LCBodHRwTWV0aG9kOiBzdHJpbmcsIGFwaVVSTDogc3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzTWV0aG9kID0gKGEpID0+IHRoaXMuYWN0aW9uU3VjY2VzcyhhKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFpbE1ldGhvZCA9IChhLCBiKSA9PiB0aGlzLmFjdGlvbkZhaWxlZChhLCBiKVxyXG4gICkge1xyXG4gICAgY29uc3QgcGFyYW1zID0gdGhpcy5wYXJzZVBhcmFtcyhwYXJhbWV0ZXJzKTtcclxuXHJcbiAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCd3YWl0TW9kYWwnKS5vcGVuKCk7XHJcblxyXG4gICAgdGhpcy5yZWFjaFNlcnZlcihodHRwTWV0aG9kLCBhcGlVUkwgKyBwYXJhbXMpXHJcbiAgICAgIC5zdWJzY3JpYmUoXHJcbiAgICAgICAgKGEpID0+IHN1Y2Nlc3NNZXRob2QoYSksXHJcbiAgICAgICAgKGVycikgPT4gZmFpbE1ldGhvZChuYW1lLCBlcnIpXHJcbiAgICAgICk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlYWNoU2VydmVyKG1ldGhvZDogc3RyaW5nLCBhcGlVcmw6IHN0cmluZywgZGF0YTogYW55ID0ge30pOiBPYnNlcnZhYmxlPE9iamVjdD4ge1xyXG4gICAgc3dpdGNoIChtZXRob2QudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICBjYXNlICdnZXQnOlxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KHRoaXMudHJlZS5jb25maWcuYmFzZVVSTCArIGFwaVVybCk7XHJcbiAgICAgIGNhc2UgJ3Bvc3QnOlxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCh0aGlzLnRyZWUuY29uZmlnLmJhc2VVUkwgKyBhcGlVcmwsIGRhdGEpO1xyXG4gICAgICBjYXNlICdkZWxldGUnOlxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKHRoaXMudHJlZS5jb25maWcuYmFzZVVSTCArIGFwaVVybCk7XHJcbiAgICAgIGNhc2UgJ2Rvd25sb2FkJzpcclxuICAgICAgICB3aW5kb3cub3Blbih0aGlzLnRyZWUuY29uZmlnLmJhc2VVUkwgKyBhcGlVcmwsICdfYmxhbmsnKTtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBjb25zb2xlLndhcm4oJ1tOb2RlQ2xpY2tlZFNlcnZpY2VdIEluY29ycmVjdCBwYXJhbXMgZm9yIHRoaXMgc2lkZS1lZmZlY3QnKTtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgcGFyc2VQYXJhbXMocGFyYW1zOiB7fSk6IHN0cmluZyB7XHJcbiAgICBsZXQgcXVlcnkgPSAnPyc7XHJcblxyXG4gICAgT2JqZWN0LmtleXMocGFyYW1zKS5maWx0ZXIoaXRlbSA9PiBwYXJhbXNbaXRlbV0gIT09IG51bGwpLm1hcChrZXkgPT4ge1xyXG4gICAgICBxdWVyeSArPSBrZXkgKyAnPScgKyBwYXJhbXNba2V5XSArICcmJztcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBxdWVyeS5zbGljZSgwLCAtMSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHN1Y2Nlc3NXaXRoTW9kYWxDbG9zZSgpIHtcclxuICAgIHRoaXMuYWN0aW9uU3VjY2VzcygpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpZGUtdmlldycpLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNlYXJjaFN1Y2Nlc3MoaW5wdXQ6IHN0cmluZywgZGF0YTogYW55KSB7XHJcbiAgICBjb25zdCBvYmogPSB7XHJcbiAgICAgIHNlYXJjaFN0cmluZzogaW5wdXQsXHJcbiAgICAgIHJlc3BvbnNlOiBkYXRhXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuYWN0aW9uU3VjY2VzcygpO1xyXG5cclxuICAgIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2Uuc2V0TW9kYWxEYXRhKG9iaiwgJ3NlYXJjaE1vZGFsJywgdHJ1ZSk7XHJcbiAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCdzZWFyY2hNb2RhbCcpLm9wZW4oKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWN0aW9uU3VjY2VzcyhyZXNwb25zZTogc3RyaW5nID0gJycpIHtcclxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnZGlhbG9nLW9wZW4nKTtcclxuXHJcbiAgICB0aGlzLm5vZGVTZXJ2aWNlLnJlZnJlc2hDdXJyZW50UGF0aCgpO1xyXG4gICAgdGhpcy5uZ3hTbWFydE1vZGFsU2VydmljZS5nZXRNb2RhbCgnd2FpdE1vZGFsJykuY2xvc2UoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWN0aW9uRmFpbGVkKG5hbWU6IHN0cmluZywgZXJyb3I6IGFueSkge1xyXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdkaWFsb2ctb3BlbicpO1xyXG5cclxuICAgIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ3dhaXRNb2RhbCcpLmNsb3NlKCk7XHJcbiAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCdlcnJvck1vZGFsJykub3BlbigpO1xyXG4gICAgY29uc29sZS53YXJuKCdbTm9kZUNsaWNrZWRTZXJ2aWNlXSBBY3Rpb24gXCInICsgbmFtZSArICdcIiBmYWlsZWQnLCBlcnJvcik7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCwgVGVtcGxhdGVSZWYsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtzZWxlY3QsIFN0b3JlfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcbmltcG9ydCB7VHJlZU1vZGVsfSBmcm9tICcuL21vZGVscy90cmVlLm1vZGVsJztcclxuaW1wb3J0IHtOb2RlU2VydmljZX0gZnJvbSAnLi9zZXJ2aWNlcy9ub2RlLnNlcnZpY2UnO1xyXG5pbXBvcnQge05vZGVJbnRlcmZhY2V9IGZyb20gJy4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XHJcbmltcG9ydCB7U0VUX0xPQURJTkdfU1RBVEV9IGZyb20gJy4vcmVkdWNlcnMvYWN0aW9ucy5hY3Rpb24nO1xyXG5pbXBvcnQgKiBhcyBBQ1RJT05TIGZyb20gJy4vcmVkdWNlcnMvYWN0aW9ucy5hY3Rpb24nO1xyXG5pbXBvcnQge0FwcFN0b3JlfSBmcm9tICcuL3JlZHVjZXJzL3JlZHVjZXIuZmFjdG9yeSc7XHJcbmltcG9ydCB7Tmd4U21hcnRNb2RhbFNlcnZpY2V9IGZyb20gJ25neC1zbWFydC1tb2RhbCc7XHJcbmltcG9ydCB7Tm9kZUNsaWNrZWRTZXJ2aWNlfSBmcm9tICcuL3NlcnZpY2VzL25vZGUtY2xpY2tlZC5zZXJ2aWNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnZm0tZmlsZS1tYW5hZ2VyJyxcclxuICB0ZW1wbGF0ZTogYDxuZy1jb250YWluZXIgKm5nSWY9XCJpc1BvcHVwOyB0aGVuIGl0SXNQb3B1cCBlbHNlIHNob3dDb250ZW50XCI+PC9uZy1jb250YWluZXI+XHJcblxyXG48bmctdGVtcGxhdGUgI2l0SXNQb3B1cD5cclxuICA8ZGl2ICpuZ0lmPVwiIWZtT3BlblwiPlxyXG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ1dHRvbiBiaWdcIiAoY2xpY2spPVwiZm1TaG93SGlkZSgpXCIgdHJhbnNsYXRlPVwiXCI+T3BlbiBmaWxlIG1hbmFnZXI8L2J1dHRvbj5cclxuICA8L2Rpdj5cclxuICA8ZGl2IGNsYXNzPVwiZmlsZS1tYW5hZ2VyLWJhY2tkcm9wXCIgKm5nSWY9XCJmbU9wZW5cIj5cclxuICAgIDxkaXYgY2xhc3M9XCJmbU1vZGFsSW5zaWRlXCI+XHJcbiAgICAgIDxkaXYgKm5nSWY9XCJmbU9wZW47IHRoZW4gc2hvd0NvbnRlbnRcIj48L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG48L25nLXRlbXBsYXRlPlxyXG5cclxuPG5nLXRlbXBsYXRlICNzaG93Q29udGVudD5cclxuICA8ZGl2IGNsYXNzPVwiY29udGVudFwiPlxyXG4gICAgPGRpdiBjbGFzcz1cImZpbGUtbWFuYWdlci1uYXZiYXJcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cInBhdGhcIj5cclxuICAgICAgICA8YXBwLW5hdi1iYXI+PC9hcHAtbmF2LWJhcj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzPVwibmF2aWdhdGlvblwiPlxyXG4gICAgICAgIDxhcHAtbmF2aWdhdGlvbj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJidXR0b24gY2xvc2VcIiAoY2xpY2spPVwiZm1TaG93SGlkZSgpXCIgKm5nSWY9XCJpc1BvcHVwXCI+XHJcbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLTJ4IGZhLXRpbWVzXCI+PC9pPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9hcHAtbmF2aWdhdGlvbj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8ZGl2IGNsYXNzPVwiaG9sZGVyXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJmaWxlLW1hbmFnZXItbGVmdFwiPlxyXG4gICAgICAgIDxhcHAtdHJlZSBbdHJlZU1vZGVsXT1cInRyZWVcIj5cclxuICAgICAgICAgIDxuZy10ZW1wbGF0ZSBsZXQtbm9kZXM+XHJcbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IG5vZGVzfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiaWNvblRlbXBsYXRlID8gaWNvblRlbXBsYXRlIDogZGVmYXVsdEljb25UZW1wbGF0ZVwiPlxyXG4gICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cclxuICAgICAgICAgIDwvbmctdGVtcGxhdGU+XHJcbiAgICAgICAgPC9hcHAtdHJlZT5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzPVwicmlnaHRcIj5cclxuICAgICAgICA8YXBwLWZvbGRlci1jb250ZW50XHJcbiAgICAgICAgICBbdHJlZU1vZGVsXT1cInRyZWVcIlxyXG4gICAgICAgICAgKG9wZW5VcGxvYWREaWFsb2cpPVwiaGFuZGxlVXBsb2FkRGlhbG9nKCRldmVudClcIlxyXG4gICAgICAgICAgW2ZvbGRlckNvbnRlbnRUZW1wbGF0ZV09XCJmb2xkZXJDb250ZW50VGVtcGxhdGUgPyBmb2xkZXJDb250ZW50VGVtcGxhdGUgOiBkZWZhdWx0Rm9sZGVyQ29udGVudFRlbXBsYXRlXCJcclxuICAgICAgICAgIFtmb2xkZXJDb250ZW50TmV3VGVtcGxhdGVdPVwiZm9sZGVyQ29udGVudE5ld1RlbXBsYXRlID8gZm9sZGVyQ29udGVudE5ld1RlbXBsYXRlIDogZGVmYXVsdEZvbGRlckNvbnRlbnROZXdUZW1wbGF0ZVwiXHJcbiAgICAgICAgICBbZm9sZGVyQ29udGVudEJhY2tUZW1wbGF0ZV09XCJmb2xkZXJDb250ZW50QmFja1RlbXBsYXRlID8gZm9sZGVyQ29udGVudEJhY2tUZW1wbGF0ZSA6IGRlZmF1bHRGb2xkZXJDb250ZW50QmFja1RlbXBsYXRlXCI+XHJcbiAgICAgICAgPC9hcHAtZm9sZGVyLWNvbnRlbnQ+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGFwcC1zaWRlLXZpZXcgaWQ9XCJzaWRlLXZpZXdcIlxyXG4gICAgICAgICAgICAgICAgICAgICBbbm9kZV09XCJzZWxlY3RlZE5vZGVcIlxyXG4gICAgICAgICAgICAgICAgICAgICBbc2lkZVZpZXdUZW1wbGF0ZV09XCJzaWRlVmlld1RlbXBsYXRlID8gc2lkZVZpZXdUZW1wbGF0ZSA6IGRlZmF1bHRTaWRlVmlld1RlbXBsYXRlXCJcclxuICAgICAgICAgICAgICAgICAgICAgW2FsbG93Rm9sZGVyRG93bmxvYWRdPVwidHJlZS5jb25maWcub3B0aW9ucy5hbGxvd0ZvbGRlckRvd25sb2FkXCJcclxuICAgICAgICAgICAgICAgICAgICAgKGNsaWNrRXZlbnQpPVwiaGFuZGxlRmlsZU1hbmFnZXJDbGlja0V2ZW50KCRldmVudClcIj5cclxuICAgICAgPC9hcHAtc2lkZS12aWV3PlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcblxyXG4gIDxhcHAtdXBsb2FkICpuZ0lmPVwibmV3RGlhbG9nXCJcclxuICAgICAgICAgICAgICBbb3BlbkRpYWxvZ109XCJuZXdEaWFsb2dcIlxyXG4gICAgICAgICAgICAgIChjbG9zZURpYWxvZyk9XCJoYW5kbGVVcGxvYWREaWFsb2coZmFsc2UpXCJcclxuICAgICAgICAgICAgICAoY3JlYXRlRGlyKT1cImhhbmRsZUZpbGVNYW5hZ2VyQ2xpY2tFdmVudCh7dHlwZTogJ2NyZWF0ZUZvbGRlcicsIHBheWxvYWQ6ICRldmVudH0pXCI+XHJcbiAgPC9hcHAtdXBsb2FkPlxyXG5cclxuICA8YXBwLWxvYWRpbmctb3ZlcmxheVxyXG4gICAgKm5nSWY9XCJsb2FkaW5nXCJcclxuICAgIFtsb2FkaW5nT3ZlcmxheVRlbXBsYXRlXT1cImxvYWRpbmdPdmVybGF5VGVtcGxhdGUgPyBsb2FkaW5nT3ZlcmxheVRlbXBsYXRlIDogZGVmYXVsdExvYWRpbmdPdmVybGF5VGVtcGxhdGVcIj5cclxuICA8L2FwcC1sb2FkaW5nLW92ZXJsYXk+XHJcbjwvbmctdGVtcGxhdGU+XHJcblxyXG48bmctdGVtcGxhdGUgbGV0LW5vZGUgI2RlZmF1bHRJY29uVGVtcGxhdGU+XHJcbiAgPGRpdiBjbGFzcz1cImZpbGUtbWFuYWdlci1ub2RlXCIgc3R5bGU9XCJkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IHBhZGRpbmc6IDNweFwiPlxyXG4gICAgPGRpdiAqbmdJZj1cIm5vZGUuaXNGb2xkZXI7IHRoZW4gaXRJc0ZvbGRlciBlbHNlIHNob3dGaWxlXCI+PC9kaXY+XHJcblxyXG4gICAgPG5nLXRlbXBsYXRlICNpdElzRm9sZGVyPlxyXG4gICAgICA8ZGl2ICpuZ0lmPVwibm9kZS5pc0V4cGFuZGVkOyB0aGVuIGlzRm9sZGVyRXhwYW5kZWQgZWxzZSBpc0ZvbGRlckNsb3NlZFwiPjwvZGl2PlxyXG4gICAgPC9uZy10ZW1wbGF0ZT5cclxuXHJcbiAgICA8bmctdGVtcGxhdGUgI3Nob3dGaWxlPjxpIGNsYXNzPVwiZmFzIGZhLWZpbGUgY2hpbGRcIj48L2k+PC9uZy10ZW1wbGF0ZT5cclxuICAgIDxuZy10ZW1wbGF0ZSAjaXNGb2xkZXJFeHBhbmRlZD48aSBjbGFzcz1cImZhcyBmYS1mb2xkZXItb3BlbiBjaGlsZFwiPjwvaT48L25nLXRlbXBsYXRlPlxyXG4gICAgPG5nLXRlbXBsYXRlICNpc0ZvbGRlckNsb3NlZD48aSBjbGFzcz1cImZhcyBmYS1mb2xkZXIgY2hpbGRcIj48L2k+PC9uZy10ZW1wbGF0ZT5cclxuXHJcbiAgICA8c3Bhbj57e25vZGUubmFtZX19PC9zcGFuPlxyXG4gIDwvZGl2PlxyXG48L25nLXRlbXBsYXRlPlxyXG48bmctdGVtcGxhdGUgbGV0LW5vZGUgI2RlZmF1bHRGb2xkZXJDb250ZW50VGVtcGxhdGU+XHJcbiAgPGRpdiBjbGFzcz1cImZpbGUtbWFuYWdlci1pdGVtXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZmlsZS1wcmV2aWV3XCI+XHJcbiAgICAgIDxkaXYgKm5nSWY9XCJub2RlLmlzRm9sZGVyOyB0aGVuIGl0SXNGb2xkZXIgZWxzZSBzaG93RmlsZVwiPjwvZGl2PlxyXG4gICAgICA8bmctdGVtcGxhdGUgI2l0SXNGb2xkZXI+PGkgY2xhc3M9XCJmYXMgZmEtM3ggZmEtZm9sZGVyIGNoaWxkXCI+PC9pPjwvbmctdGVtcGxhdGU+XHJcbiAgICAgIDxuZy10ZW1wbGF0ZSAjc2hvd0ZpbGU+PGkgY2xhc3M9XCJmYXMgZmEtM3ggZmEtZmlsZSBjaGlsZFwiPjwvaT48L25nLXRlbXBsYXRlPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZmlsZS1uYW1lXCI+XHJcbiAgICAgIHt7bm9kZS5uYW1lfX1cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG48L25nLXRlbXBsYXRlPlxyXG48bmctdGVtcGxhdGUgI2RlZmF1bHRGb2xkZXJDb250ZW50TmV3VGVtcGxhdGU+XHJcbiAgPGRpdiBjbGFzcz1cImZpbGUtbWFuYWdlci1pdGVtXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZmlsZS1wcmV2aWV3XCIgc3R5bGU9XCJ3aWR0aDogMTAwJTsgaGVpZ2h0OjEwMCVcIj5cclxuICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtM3ggZmEtcGx1cyBjaGlsZFwiIHN0eWxlPVwibGluZS1oZWlnaHQ6IDJcIj48L2k+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuPC9uZy10ZW1wbGF0ZT5cclxuPG5nLXRlbXBsYXRlIGxldC1ub2RlICNkZWZhdWx0Rm9sZGVyQ29udGVudEJhY2tUZW1wbGF0ZT5cclxuICA8ZGl2IGNsYXNzPVwiZmlsZS1tYW5hZ2VyLWl0ZW1cIj5cclxuICAgIDxkaXYgY2xhc3M9XCJmaWxlLXByZXZpZXdcIiBzdHlsZT1cIndpZHRoOiAxMDAlOyBoZWlnaHQ6MTAwJVwiPlxyXG4gICAgICA8aSBjbGFzcz1cImZhcyBmYS0yeCBmYS1lbGxpcHNpcy1oXCIgc3R5bGU9XCJsaW5lLWhlaWdodDogNVwiPjwvaT5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG48L25nLXRlbXBsYXRlPlxyXG48bmctdGVtcGxhdGUgbGV0LXRpbWVvdXRNZXNzYWdlICNkZWZhdWx0TG9hZGluZ092ZXJsYXlUZW1wbGF0ZT5cclxuICA8ZGl2IGNsYXNzPVwiZmlsZS1tYW5hZ2VyLWJhY2tkcm9wIGxvYWRpbmdcIiAoY2xpY2spPVwiYmFja2Ryb3BDbGlja2VkKClcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJmaWxlLW1hbmFnZXItZXJyb3JcIiAqbmdJZj1cInRpbWVvdXRNZXNzYWdlXCI+e3t0aW1lb3V0TWVzc2FnZX19PC9kaXY+XHJcbiAgPC9kaXY+XHJcbiAgPGRpdiBjbGFzcz1cInNwaW5uZXJcIj5cclxuICAgIDxpIGNsYXNzPVwiZmFzIGZhLTV4IGZhLXNwaW4gZmEtc3luYy1hbHRcIj48L2k+XHJcbiAgPC9kaXY+XHJcbjwvbmctdGVtcGxhdGU+XHJcbjxuZy10ZW1wbGF0ZSBsZXQtbm9kZSAjZGVmYXVsdFNpZGVWaWV3VGVtcGxhdGU+XHJcbiAgPGRpdiBzdHlsZT1cInBvc2l0aW9uOiBhYnNvbHV0ZTsgYm90dG9tOiAwOyB3aWR0aDogMTAwJTsgbWFyZ2luOiA1cHggYXV0b1wiPlxyXG4gICAgPHNwYW4gKm5nSWY9XCJub2RlLmlzRm9sZGVyXCIgdHJhbnNsYXRlPk5vIGRhdGEgYXZhaWxhYmxlIGZvciB0aGlzIGZvbGRlcjwvc3Bhbj5cclxuICAgIDxzcGFuICpuZ0lmPVwiIW5vZGUuaXNGb2xkZXJcIiB0cmFuc2xhdGU+Tm8gZGF0YSBhdmFpbGFibGUgZm9yIHRoaXMgZmlsZTwvc3Bhbj5cclxuICA8L2Rpdj5cclxuPC9uZy10ZW1wbGF0ZT5cclxuXHJcbjxuZ3gtc21hcnQtbW9kYWwgaWRlbnRpZmllcj1cInJlbmFtZU1vZGFsXCIgW2Rpc21pc3NhYmxlXT1cImZhbHNlXCIgW2Nsb3NhYmxlXT1cImZhbHNlXCIgKm5nSWY9XCJzZWxlY3RlZE5vZGVcIiAjcmVuYW1lTW9kYWw+XHJcbiAgPGgyIGNsYXNzPVwibW9kYWwtdGl0bGVcIiB0cmFuc2xhdGU+XHJcbiAgICBSZW5hbWUgZmlsZVxyXG4gIDwvaDI+XHJcbiAgPHAgY2xhc3M9XCJyZW5hbWUtbmFtZVwiIHRyYW5zbGF0ZT5cclxuICAgIE9sZCBuYW1lXHJcbiAgPC9wPlxyXG4gIDxzcGFuIHN0eWxlPVwibWFyZ2luOiA4cHhcIj57e3NlbGVjdGVkTm9kZS5uYW1lfX08L3NwYW4+XHJcbiAgPHAgY2xhc3M9XCJyZW5hbWUtbmFtZVwiIHRyYW5zbGF0ZT5cclxuICAgIE5ldyBuYW1lXHJcbiAgPC9wPlxyXG4gIDxpbnB1dCBwbGFjZWhvbGRlcj1cIk5ldyBuYW1lXCIgdHlwZT1cInRleHRcIiBjbGFzcz1cInJlbmFtZS1pbnB1dFwiIFt2YWx1ZV09XCJzZWxlY3RlZE5vZGUubmFtZVwiICNyZW5hbWVJbnB1dFxyXG4gICAgICAgICAoa2V5dXAuZW50ZXIpPVwiaGFuZGxlRmlsZU1hbmFnZXJDbGlja0V2ZW50KHt0eXBlOiAncmVuYW1lJywgdmFsdWU6IHJlbmFtZUlucHV0LnZhbHVlfSlcIlxyXG4gICAgICAgICBvbmNsaWNrPVwidGhpcy5zZWxlY3QoKTtcIj5cclxuICA8YnI+XHJcblxyXG4gIDxkaXYgY2xhc3M9XCJyZW5hbWUtYnV0dG9uXCI+XHJcbiAgICA8YnV0dG9uIGNsYXNzPVwiYnV0dG9uIGJpZ1wiIHRyYW5zbGF0ZVxyXG4gICAgICAgICAgICAoY2xpY2spPVwiaGFuZGxlRmlsZU1hbmFnZXJDbGlja0V2ZW50KHt0eXBlOiAncmVuYW1lJywgdmFsdWU6IHJlbmFtZUlucHV0LnZhbHVlfSlcIlxyXG4gICAgICAgICAgICBbZGlzYWJsZWRdPVwicmVuYW1lSW5wdXQudmFsdWUgPT09IHNlbGVjdGVkTm9kZS5uYW1lIHx8IHJlbmFtZUlucHV0LnZhbHVlLmxlbmd0aCA9PT0gMFwiPlxyXG4gICAgICBSZW5hbWVcclxuICAgIDwvYnV0dG9uPlxyXG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ1dHRvbiBiaWdcIiAoY2xpY2spPVwicmVuYW1lTW9kYWwuY2xvc2UoKVwiIHRyYW5zbGF0ZT5cclxuICAgICAgQ2FuY2VsXHJcbiAgICA8L2J1dHRvbj5cclxuICA8L2Rpdj5cclxuXHJcbjwvbmd4LXNtYXJ0LW1vZGFsPlxyXG48bmd4LXNtYXJ0LW1vZGFsICpuZ0lmPVwic2VsZWN0ZWROb2RlXCIgaWRlbnRpZmllcj1cImNvbmZpcm1EZWxldGVNb2RhbFwiICNkZWxldGVNb2RhbFxyXG4gICAgICAgICAgICAgICAgIFtkaXNtaXNzYWJsZV09XCJmYWxzZVwiIFtjbG9zYWJsZV09XCJmYWxzZVwiPlxyXG4gIDxoMiBjbGFzcz1cIm1vZGFsLXRpdGxlXCI+XHJcbiAgICA8c3BhbiB0cmFuc2xhdGU+WW91IGFyZSB0cnlpbmcgdG8gZGVsZXRlIGZvbGxvd2luZyA8L3NwYW4+XHJcbiAgICA8c3BhbiAqbmdJZj1cInNlbGVjdGVkTm9kZS5pc0ZvbGRlclwiIHRyYW5zbGF0ZT5mb2xkZXI8L3NwYW4+XHJcbiAgICA8c3BhbiAqbmdJZj1cIiFzZWxlY3RlZE5vZGUuaXNGb2xkZXJcIiB0cmFuc2xhdGU+ZmlsZTwvc3Bhbj5cclxuICA8L2gyPlxyXG5cclxuICA8ZGl2IHN0eWxlPVwid2lkdGg6IDEwMCU7IG1hcmdpbjogNXB4IGF1dG87IHRleHQtYWxpZ246IGNlbnRlclwiPnt7c2VsZWN0ZWROb2RlLm5hbWV9fTwvZGl2PlxyXG5cclxuICA8ZGl2IGNsYXNzPVwicmVuYW1lLWJ1dHRvblwiPlxyXG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ1dHRvbiBiaWdcIiAoY2xpY2spPVwiaGFuZGxlRmlsZU1hbmFnZXJDbGlja0V2ZW50KHt0eXBlOiAncmVtb3ZlJ30pXCI+XHJcbiAgICAgIDxzcGFuIHRyYW5zbGF0ZT5ZZXMsIGRlbGV0ZSB0aGlzIDwvc3Bhbj5cclxuICAgICAgPHNwYW4gKm5nSWY9XCJzZWxlY3RlZE5vZGUuaXNGb2xkZXJcIiB0cmFuc2xhdGU+Zm9sZGVyPC9zcGFuPlxyXG4gICAgICA8c3BhbiAqbmdJZj1cIiFzZWxlY3RlZE5vZGUuaXNGb2xkZXJcIiB0cmFuc2xhdGU+ZmlsZTwvc3Bhbj5cclxuICAgIDwvYnV0dG9uPlxyXG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ1dHRvbiBiaWdcIiAoY2xpY2spPVwiZGVsZXRlTW9kYWwuY2xvc2UoKVwiIHRyYW5zbGF0ZT5cclxuICAgICAgQ2FuY2VsXHJcbiAgICA8L2J1dHRvbj5cclxuICA8L2Rpdj5cclxuPC9uZ3gtc21hcnQtbW9kYWw+XHJcbjxuZ3gtc21hcnQtbW9kYWwgaWRlbnRpZmllcj1cInNlYXJjaE1vZGFsXCIgI3NlYXJjaE1vZGFsIFtjbG9zYWJsZV09XCJ0cnVlXCI+XHJcbiAgPGgyIGNsYXNzPVwibW9kYWwtdGl0bGVcIiBzdHlsZT1cIm1hcmdpbi1ib3R0b206IDJweFwiIHRyYW5zbGF0ZVxyXG4gICAgICAqbmdJZj1cInNlYXJjaE1vZGFsLmhhc0RhdGEoKSAmJiBzZWFyY2hNb2RhbC5nZXREYXRhKCkucmVzcG9uc2UubGVuZ3RoICE9PSAwXCI+XHJcbiAgICBTZWFyY2ggcmVzdWx0cyBmb3JcclxuICA8L2gyPlxyXG4gIDxoMiBjbGFzcz1cIm1vZGFsLXRpdGxlXCIgc3R5bGU9XCJtYXJnaW4tYm90dG9tOiAycHhcIiB0cmFuc2xhdGVcclxuICAgICAgKm5nSWY9XCIhc2VhcmNoTW9kYWwuaGFzRGF0YSgpIHx8IHNlYXJjaE1vZGFsLmdldERhdGEoKS5yZXNwb25zZS5sZW5ndGggPT09IDBcIj5cclxuICAgIE5vIHJlc3VsdHMgZm91bmQgZm9yXHJcbiAgPC9oMj5cclxuICA8ZGl2IHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyXCIgKm5nSWY9XCJzZWFyY2hNb2RhbC5oYXNEYXRhKClcIj57e3NlYXJjaE1vZGFsLmdldERhdGEoKS5zZWFyY2hTdHJpbmd9fTwvZGl2PlxyXG5cclxuICA8ZGl2ICpuZ0lmPVwic2VhcmNoTW9kYWwuaGFzRGF0YSgpICYmIHNlYXJjaE1vZGFsLmdldERhdGEoKS5yZXNwb25zZS5sZW5ndGggIT09IDBcIj5cclxuICAgIDx0YWJsZSBzdHlsZT1cIm1hcmdpbjogMCBhdXRvXCI+XHJcbiAgICAgIDx0cj5cclxuICAgICAgICA8dGQgY2xhc3M9XCJ0YWJsZS1pdGVtIHRhYmxlLWhlYWRcIiB0cmFuc2xhdGU+RmlsZSBuYW1lPC90ZD5cclxuICAgICAgICA8dGQgY2xhc3M9XCJ0YWJsZS1pdGVtLXNob3J0IHRhYmxlLWhlYWRcIiB0cmFuc2xhdGU+U2l6ZTwvdGQ+XHJcbiAgICAgIDwvdHI+XHJcbiAgICAgIDx0ciAqbmdGb3I9XCJsZXQgaXRlbSBvZiBzZWFyY2hNb2RhbC5nZXREYXRhKCkucmVzcG9uc2VcIiAoY2xpY2spPVwic2VhcmNoQ2xpY2tlZChpdGVtKVwiPlxyXG4gICAgICAgIDx0ZCBzdHlsZT1cImN1cnNvcjogcG9pbnRlclwiPlxyXG4gICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIml0ZW0uZmlsZUNhdGVnb3J5ID09PSAnRCc7IGVsc2UgZmlsZVwiPlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1mb2xkZXIgc2VhcmNoLW91dHB1dC1pY29uXCI+PC9pPlxyXG4gICAgICAgICAgPC9uZy1jb250YWluZXI+XHJcbiAgICAgICAgICA8bmctdGVtcGxhdGUgI2ZpbGU+XHJcbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLWZpbGUgc2VhcmNoLW91dHB1dC1pY29uXCI+PC9pPlxyXG4gICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cclxuICAgICAgICAgIDxzcGFuIHN0eWxlPVwidGV4dC1vdmVyZmxvdzogZWxsaXBzaXNcIj57e2l0ZW0ubmFtZX19PC9zcGFuPlxyXG4gICAgICAgIDwvdGQ+XHJcbiAgICAgICAgPHRkIGNsYXNzPVwidGFibGUtaXRlbS1zaG9ydFwiPnt7aXRlbS5zaXplfX08L3RkPlxyXG4gICAgICA8L3RyPlxyXG4gICAgPC90YWJsZT5cclxuICA8L2Rpdj5cclxuPC9uZ3gtc21hcnQtbW9kYWw+XHJcbjxuZ3gtc21hcnQtbW9kYWwgaWRlbnRpZmllcj1cIndhaXRNb2RhbFwiIFtjbG9zYWJsZV09XCJmYWxzZVwiIFtkaXNtaXNzYWJsZV09XCJmYWxzZVwiIFtlc2NhcGFibGVdPVwiZmFsc2VcIj5cclxuICA8aDIgY2xhc3M9XCJtb2RhbC10aXRsZVwiIHN0eWxlPVwibWFyZ2luLXRvcDogMjBweFwiPlxyXG4gICAge3snUHJvY2Vzc2luZyByZXF1ZXN0J319Li4uXHJcbiAgPC9oMj5cclxuXHJcbiAgPGRpdiBzdHlsZT1cInRleHQtYWxpZ246IGNlbnRlcjsgaGVpZ2h0OiA3MHB4XCI+XHJcbiAgICA8aSBjbGFzcz1cImZhcyBmYS1zcGlubmVyIGZhLXNwaW4gZmEtNHhcIj48L2k+XHJcbiAgPC9kaXY+XHJcbjwvbmd4LXNtYXJ0LW1vZGFsPlxyXG48bmd4LXNtYXJ0LW1vZGFsIGlkZW50aWZpZXI9XCJlcnJvck1vZGFsXCIgW2Nsb3NhYmxlXT1cInRydWVcIj5cclxuICA8aDIgY2xhc3M9XCJtb2RhbC10aXRsZVwiIHN0eWxlPVwibWFyZ2luLXRvcDogMjBweFwiPlxyXG4gICAge3snU29tZXRoaW5nIHdlbnQgd3Jvbmcgd2l0aCB5b3VyIHJlcXVlc3QnfX0uLi5cclxuICA8L2gyPlxyXG48L25neC1zbWFydC1tb2RhbD5cclxuYCxcclxuICBzdHlsZXM6IFtgLmNvbnRlbnR7aGVpZ2h0OjEwMCU7bWluLXdpZHRoOjg1MHB4fS5ob2xkZXJ7ZGlzcGxheTotd2Via2l0LWZsZXg7ZGlzcGxheTpmbGV4O2hlaWdodDpjYWxjKDEwMCUgLSA3NXB4KX0ucGF0aHttYXJnaW46YXV0byAwO2Rpc3BsYXk6YmxvY2t9Lm5hdmlnYXRpb257bWFyZ2luOmF1dG8gMDtkaXNwbGF5Oi13ZWJraXQtZmxleDtkaXNwbGF5OmZsZXh9Lm5hdmlnYXRpb24gLmJ1dHRvbnttYXJnaW46MCAxMHB4O3BhZGRpbmc6MDtwb3NpdGlvbjpyZWxhdGl2ZX0ucmlnaHR7d2lkdGg6MTAwJTtwb3NpdGlvbjpyZWxhdGl2ZTtvdmVyZmxvdzphdXRvfS5maWxlLW5hbWV7d2lkdGg6MTAwcHg7aGVpZ2h0OjI1cHg7b3ZlcmZsb3c6aGlkZGVuO3doaXRlLXNwYWNlOm5vd3JhcDt0ZXh0LW92ZXJmbG93OmVsbGlwc2lzO2JveC1zaXppbmc6Ym9yZGVyLWJveDstd2Via2l0LXVzZXItc2VsZWN0Om5vbmU7LW1vei11c2VyLXNlbGVjdDpub25lOy1tcy11c2VyLXNlbGVjdDpub25lO3VzZXItc2VsZWN0Om5vbmV9LmZpbGUtcHJldmlld3ttYXJnaW46YXV0b30uZmlsZS1wcmV2aWV3IGl7bGluZS1oZWlnaHQ6MS41fS5zcGlubmVye3Bvc2l0aW9uOmFic29sdXRlO3RvcDo1MCU7bGVmdDo1MCU7LXdlYmtpdC10cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUsLTUwJSk7dHJhbnNmb3JtOnRyYW5zbGF0ZSgtNTAlLC01MCUpO2N1cnNvcjpwcm9ncmVzc30ucmVuYW1lLWJ1dHRvbnttYXJnaW46MjBweCBhdXRvO2Rpc3BsYXk6YmxvY2s7dGV4dC1hbGlnbjpjZW50ZXJ9Lm1vZGFsLXRpdGxle21hcmdpbi10b3A6NXB4O3RleHQtYWxpZ246Y2VudGVyfS5zZWFyY2gtb3V0cHV0e21hcmdpbjoxNXB4IDB9LnNlYXJjaC1vdXRwdXQtaWNvbnttYXJnaW46MnB4IDVweH0udGFibGUtaXRlbXt3aWR0aDo4MCV9LnRhYmxlLWl0ZW0tc2hvcnR7d2lkdGg6MjAlO3RleHQtYWxpZ246cmlnaHR9YF0sXHJcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRmlsZU1hbmFnZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIEBJbnB1dCgpIGljb25UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICBASW5wdXQoKSBmb2xkZXJDb250ZW50VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgQElucHV0KCkgZm9sZGVyQ29udGVudEJhY2tUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICBASW5wdXQoKSBmb2xkZXJDb250ZW50TmV3VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgQElucHV0KCkgbG9hZGluZ092ZXJsYXlUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICBASW5wdXQoKSBzaWRlVmlld1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICBASW5wdXQoKSB0cmVlOiBUcmVlTW9kZWw7XHJcbiAgQElucHV0KCkgaXNQb3B1cDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIEBPdXRwdXQoKSBpdGVtQ2xpY2tlZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgc2VsZWN0ZWROb2RlOiBOb2RlSW50ZXJmYWNlO1xyXG4gIHNpZGVNZW51Q2xvc2VkID0gdHJ1ZTtcclxuXHJcbiAgZm1PcGVuID0gZmFsc2U7XHJcbiAgbG9hZGluZzogYm9vbGVhbjtcclxuICBuZXdEaWFsb2cgPSBmYWxzZTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTxBcHBTdG9yZT4sXHJcbiAgICBwcml2YXRlIG5vZGVTZXJ2aWNlOiBOb2RlU2VydmljZSxcclxuICAgIHByaXZhdGUgbm9kZUNsaWNrZWRTZXJ2aWNlOiBOb2RlQ2xpY2tlZFNlcnZpY2UsXHJcbiAgICBwdWJsaWMgbmd4U21hcnRNb2RhbFNlcnZpY2U6IE5neFNtYXJ0TW9kYWxTZXJ2aWNlLFxyXG4gICkge1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICB3aW5kb3cuY29uc29sZSA9IHdpbmRvdy5jb25zb2xlIHx8IHt9O1xyXG4gICAgd2luZG93LmNvbnNvbGUubG9nID0gd2luZG93LmNvbnNvbGUubG9nIHx8IGZ1bmN0aW9uICgpIHtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5ub2RlU2VydmljZS50cmVlID0gdGhpcy50cmVlO1xyXG4gICAgdGhpcy5ub2RlQ2xpY2tlZFNlcnZpY2UudHJlZSA9IHRoaXMudHJlZTtcclxuICAgIHRoaXMubm9kZVNlcnZpY2Uuc3RhcnRNYW5hZ2VyQXQodGhpcy50cmVlLmN1cnJlbnRQYXRoKTtcclxuXHJcbiAgICB0aGlzLnN0b3JlXHJcbiAgICAgIC5waXBlKHNlbGVjdChzdGF0ZSA9PiBzdGF0ZS5maWxlTWFuYWdlclN0YXRlLmlzTG9hZGluZykpXHJcbiAgICAgIC5zdWJzY3JpYmUoKGRhdGE6IGJvb2xlYW4pID0+IHtcclxuICAgICAgICB0aGlzLmxvYWRpbmcgPSBkYXRhO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICB0aGlzLnN0b3JlXHJcbiAgICAgIC5waXBlKHNlbGVjdChzdGF0ZSA9PiBzdGF0ZS5maWxlTWFuYWdlclN0YXRlLnNlbGVjdGVkTm9kZSkpXHJcbiAgICAgIC5zdWJzY3JpYmUoKG5vZGU6IE5vZGVJbnRlcmZhY2UpID0+IHtcclxuICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGZpeGVkIGhpZ2hsaWdodGluZyBlcnJvciB3aGVuIGNsb3Npbmcgbm9kZSBidXQgbm90IGNoYW5naW5nIHBhdGhcclxuICAgICAgICBpZiAoKG5vZGUuaXNFeHBhbmRlZCAmJiBub2RlLnBhdGhUb05vZGUgIT09IHRoaXMubm9kZVNlcnZpY2UuY3VycmVudFBhdGgpICYmICFub2RlLnN0YXlPcGVuKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmhhbmRsZUZpbGVNYW5hZ2VyQ2xpY2tFdmVudCh7dHlwZTogJ3NlbGVjdCcsIG5vZGU6IG5vZGV9KTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBvbkl0ZW1DbGlja2VkKGV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgIHRoaXMuaXRlbUNsaWNrZWQuZW1pdChldmVudCk7XHJcbiAgfVxyXG5cclxuICBzZWFyY2hDbGlja2VkKGRhdGE6IGFueSkge1xyXG4gICAgLy8gY29uc29sZS5sb2coZGF0YSk7XHJcblxyXG4gICAgY29uc3Qgbm9kZSA9IHRoaXMubm9kZVNlcnZpY2UuZmluZE5vZGVCeUlkKGRhdGEuaWQpO1xyXG4gICAgdGhpcy5uZ3hTbWFydE1vZGFsU2VydmljZS5nZXRNb2RhbCgnc2VhcmNoTW9kYWwnKS5jbG9zZSgpO1xyXG4gICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogQUNUSU9OUy5TRVRfU0VMRUNURURfTk9ERSwgcGF5bG9hZDogbm9kZX0pO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlRmlsZU1hbmFnZXJDbGlja0V2ZW50KGV2ZW50OiBhbnkpIHtcclxuICAgIHN3aXRjaCAoZXZlbnQudHlwZSkge1xyXG4gICAgICBjYXNlICdjbG9zZVNpZGVWaWV3JyA6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZUNsaWNrSGFuZGxlcihldmVudC5ub2RlLCB0cnVlKTtcclxuXHJcbiAgICAgIGNhc2UgJ3NlbGVjdCcgOlxyXG4gICAgICAgIHRoaXMub25JdGVtQ2xpY2tlZChldmVudCk7XHJcbiAgICAgICAgdGhpcy5oaWdobGlnaHRTZWxlY3RlZChldmVudC5ub2RlKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5ub2RlQ2xpY2tIYW5kbGVyKGV2ZW50Lm5vZGUpO1xyXG5cclxuICAgICAgY2FzZSAnZG93bmxvYWQnIDpcclxuICAgICAgICB0aGlzLm5vZGVDbGlja2VkU2VydmljZS5zdGFydERvd25sb2FkKGV2ZW50Lm5vZGUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9uSXRlbUNsaWNrZWQoZXZlbnQpO1xyXG5cclxuICAgICAgY2FzZSAncmVuYW1lQ29uZmlybScgOlxyXG4gICAgICAgIHJldHVybiB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCdyZW5hbWVNb2RhbCcpLm9wZW4oKTtcclxuICAgICAgY2FzZSAncmVuYW1lJyA6XHJcbiAgICAgICAgdGhpcy5uZ3hTbWFydE1vZGFsU2VydmljZS5nZXRNb2RhbCgncmVuYW1lTW9kYWwnKS5jbG9zZSgpO1xyXG5cclxuICAgICAgICB0aGlzLm5vZGVDbGlja2VkU2VydmljZS5yZW5hbWUodGhpcy5zZWxlY3RlZE5vZGUuaWQsIGV2ZW50LnZhbHVlKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5vbkl0ZW1DbGlja2VkKHtcclxuICAgICAgICAgIHR5cGU6IGV2ZW50LnR5cGUsXHJcbiAgICAgICAgICBub2RlOiB0aGlzLnNlbGVjdGVkTm9kZSxcclxuICAgICAgICAgIG5ld05hbWU6IGV2ZW50LnZhbHVlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICBjYXNlICdyZW1vdmVBc2snOlxyXG4gICAgICAgIHJldHVybiB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCdjb25maXJtRGVsZXRlTW9kYWwnKS5vcGVuKCk7XHJcbiAgICAgIGNhc2UgJ3JlbW92ZSc6XHJcbiAgICAgICAgdGhpcy5uZ3hTbWFydE1vZGFsU2VydmljZS5nZXRNb2RhbCgnY29uZmlybURlbGV0ZU1vZGFsJykuY2xvc2UoKTtcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlQ2xpY2tlZFNlcnZpY2UuaW5pdERlbGV0ZSh0aGlzLnNlbGVjdGVkTm9kZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub25JdGVtQ2xpY2tlZCh7XHJcbiAgICAgICAgICB0eXBlOiBldmVudC50eXBlLFxyXG4gICAgICAgICAgbm9kZTogdGhpcy5zZWxlY3RlZE5vZGVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIGNhc2UgJ2NyZWF0ZUZvbGRlcicgOlxyXG4gICAgICAgIGNvbnN0IHBhcmVudElkID0gdGhpcy5ub2RlU2VydmljZS5maW5kTm9kZUJ5UGF0aCh0aGlzLm5vZGVTZXJ2aWNlLmN1cnJlbnRQYXRoKS5pZDtcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlQ2xpY2tlZFNlcnZpY2UuY3JlYXRlRm9sZGVyKHBhcmVudElkLCBldmVudC5wYXlsb2FkKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5vbkl0ZW1DbGlja2VkKHtcclxuICAgICAgICAgIHR5cGU6IGV2ZW50LnR5cGUsXHJcbiAgICAgICAgICBwYXJlbnRJZDogcGFyZW50SWQsXHJcbiAgICAgICAgICBuZXdEaXJOYW1lOiBldmVudC5wYXlsb2FkXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBub2RlQ2xpY2tIYW5kbGVyKG5vZGU6IE5vZGVJbnRlcmZhY2UsIGNsb3Npbmc/OiBib29sZWFuKSB7XHJcbiAgICBpZiAobm9kZS5uYW1lID09PSAncm9vdCcpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjbG9zaW5nKSB7XHJcbiAgICAgIGNvbnN0IHBhcmVudE5vZGUgPSB0aGlzLm5vZGVTZXJ2aWNlLmZpbmROb2RlQnlQYXRoKHRoaXMubm9kZVNlcnZpY2UuY3VycmVudFBhdGgpO1xyXG4gICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9TRUxFQ1RFRF9OT0RFLCBwYXlsb2FkOiBwYXJlbnROb2RlfSk7XHJcbiAgICAgIHRoaXMuc2lkZU1lbnVDbG9zZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkTm9kZSA9PT0gbm9kZSAmJiB0aGlzLnNpZGVNZW51Q2xvc2VkKVxyXG4gICAgICAgIHRoaXMuc2lkZU1lbnVDbG9zZWQgPSBmYWxzZTtcclxuICAgICAgZWxzZSBpZiAodGhpcy5zZWxlY3RlZE5vZGUgPT09IG5vZGUgJiYgIXRoaXMuc2lkZU1lbnVDbG9zZWQpXHJcbiAgICAgICAgdGhpcy5zaWRlTWVudUNsb3NlZCA9IHRydWU7XHJcbiAgICAgIGVsc2UgaWYgKHRoaXMuc2VsZWN0ZWROb2RlICE9PSBub2RlICYmIHRoaXMuc2lkZU1lbnVDbG9zZWQpXHJcbiAgICAgICAgdGhpcy5zaWRlTWVudUNsb3NlZCA9IGZhbHNlO1xyXG4gICAgICBlbHNlIGlmICh0aGlzLnNlbGVjdGVkTm9kZSAhPT0gbm9kZSAmJiAhdGhpcy5zaWRlTWVudUNsb3NlZClcclxuICAgICAgICB0aGlzLnNpZGVNZW51Q2xvc2VkID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zZWxlY3RlZE5vZGUgPSBub2RlO1xyXG5cclxuICAgIC8vIHRvZG8gaW52ZXN0aWdhdGUgdGhpcyB3b3JrYXJvdW5kIC0gd2FybmluZzogW0ZpbGUgTWFuYWdlcl0gZmFpbGVkIHRvIGZpbmQgcmVxdWVzdGVkIG5vZGUgZm9yIHBhdGg6IFtwYXRoXVxyXG4gICAgaWYoIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaWRlLXZpZXcnKSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuc2lkZU1lbnVDbG9zZWQpIHtcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpZGUtdmlldycpLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2lkZS12aWV3JykuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIHRvZG8gc3RheSBEUlkhXHJcbiAgaGlnaGxpZ2h0U2VsZWN0ZWQobm9kZTogTm9kZUludGVyZmFjZSkge1xyXG4gICAgbGV0IHBhdGhUb05vZGUgPSBub2RlLnBhdGhUb05vZGU7XHJcblxyXG4gICAgaWYgKHBhdGhUb05vZGUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHBhdGhUb05vZGUgPSAncm9vdCc7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdHJlZUVsZW1lbnQgPSB0aGlzLmdldEVsZW1lbnRCeUlkKHBhdGhUb05vZGUsICd0cmVlXycpO1xyXG4gICAgY29uc3QgZmNFbGVtZW50ID0gdGhpcy5nZXRFbGVtZW50QnlJZChwYXRoVG9Ob2RlLCAnZmNfJyk7XHJcbiAgICBpZiAoIXRyZWVFbGVtZW50ICYmICFmY0VsZW1lbnQpIHtcclxuICAgICAgY29uc29sZS53YXJuKCdbRmlsZSBNYW5hZ2VyXSBmYWlsZWQgdG8gZmluZCByZXF1ZXN0ZWQgbm9kZSBmb3IgcGF0aDonLCBwYXRoVG9Ob2RlKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucmVtb3ZlQ2xhc3MoJ2hpZ2hsaWdodGVkJyk7XHJcbiAgICB0aGlzLnJlbW92ZUNsYXNzKCdsaWdodCcpO1xyXG5cclxuICAgIGlmIChmY0VsZW1lbnQpXHJcbiAgICAgIHRoaXMuaGlnaGlsZ2h0Q2hpbGRFbGVtZW50KGZjRWxlbWVudCk7XHJcbiAgICBpZiAodHJlZUVsZW1lbnQpXHJcbiAgICAgIHRoaXMuaGlnaGlsZ2h0Q2hpbGRFbGVtZW50KHRyZWVFbGVtZW50LCB0cnVlKTtcclxuXHJcbiAgICAvLyBwYXJlbnQgbm9kZSBoaWdobGlnaHRcclxuICAgIGxldCBwYXRoVG9QYXJlbnQgPSBub2RlLnBhdGhUb1BhcmVudDtcclxuICAgIGlmIChwYXRoVG9QYXJlbnQgPT09IG51bGwgfHwgbm9kZS5wYXRoVG9Ob2RlID09PSB0aGlzLm5vZGVTZXJ2aWNlLmN1cnJlbnRQYXRoKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocGF0aFRvUGFyZW50Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICBwYXRoVG9QYXJlbnQgPSAncm9vdCc7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcGFyZW50RWxlbWVudCA9IHRoaXMuZ2V0RWxlbWVudEJ5SWQocGF0aFRvUGFyZW50LCAndHJlZV8nKTtcclxuICAgIGlmICghcGFyZW50RWxlbWVudCkge1xyXG4gICAgICBjb25zb2xlLndhcm4oJ1tGaWxlIE1hbmFnZXJdIGZhaWxlZCB0byBmaW5kIHJlcXVlc3RlZCBwYXJlbnQgbm9kZSBmb3IgcGF0aDonLCBwYXRoVG9QYXJlbnQpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5oaWdoaWxnaHRDaGlsZEVsZW1lbnQocGFyZW50RWxlbWVudCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGhpZ2hpbGdodENoaWxkRWxlbWVudChlbDogSFRNTEVsZW1lbnQsIGxpZ2h0OiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgIGVsLmNoaWxkcmVuWzBdIC8vIGFwcG5vZGUgZGl2IHdyYXBwZXJcclxuICAgICAgLmNoaWxkcmVuWzBdIC8vIG5nIHRlbXBsYXRlIGZpcnN0IGl0ZW1cclxuICAgICAgLmNsYXNzTGlzdC5hZGQoJ2hpZ2hsaWdodGVkJyk7XHJcblxyXG4gICAgaWYgKGxpZ2h0KVxyXG4gICAgICBlbC5jaGlsZHJlblswXVxyXG4gICAgICAgIC5jaGlsZHJlblswXVxyXG4gICAgICAgIC5jbGFzc0xpc3QuYWRkKCdsaWdodCcpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRFbGVtZW50QnlJZChpZDogc3RyaW5nLCBwcmVmaXg6IHN0cmluZyA9ICcnKTogSFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3QgZnVsbElkID0gcHJlZml4ICsgaWQ7XHJcbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZnVsbElkKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVtb3ZlQ2xhc3MoY2xhc3NOYW1lOiBzdHJpbmcpIHtcclxuICAgIEFycmF5LmZyb20oZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjbGFzc05hbWUpKVxyXG4gICAgICAubWFwKChlbDogSFRNTEVsZW1lbnQpID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKSk7XHJcbiAgfVxyXG5cclxuICBmbVNob3dIaWRlKCkge1xyXG4gICAgdGhpcy5mbU9wZW4gPSAhdGhpcy5mbU9wZW47XHJcbiAgfVxyXG5cclxuICBiYWNrZHJvcENsaWNrZWQoKSB7XHJcbiAgICAvLyB0b2RvIGdldCByaWQgb2YgdGhpcyB1Z2x5IHdvcmthcm91bmRcclxuICAgIC8vIHRvZG8gZmlyZSB1c2VyQ2FuY2VsZWRMb2FkaW5nIGV2ZW50XHJcbiAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBTRVRfTE9BRElOR19TVEFURSwgcGF5bG9hZDogZmFsc2V9KTtcclxuICB9XHJcblxyXG4gIGhhbmRsZVVwbG9hZERpYWxvZyhldmVudDogYW55KSB7XHJcbiAgICB0aGlzLm5ld0RpYWxvZyA9IGV2ZW50O1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQsIFRlbXBsYXRlUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtzZWxlY3QsIFN0b3JlfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcbmltcG9ydCB7VHJlZU1vZGVsfSBmcm9tICcuLi8uLi9tb2RlbHMvdHJlZS5tb2RlbCc7XHJcbmltcG9ydCB7Tm9kZVNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL25vZGUuc2VydmljZSc7XHJcbmltcG9ydCB7Tm9kZUludGVyZmFjZX0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XHJcbmltcG9ydCB7QXBwU3RvcmV9IGZyb20gJy4uLy4uL3JlZHVjZXJzL3JlZHVjZXIuZmFjdG9yeSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1mb2xkZXItY29udGVudCcsXHJcbiAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwiaXRlbS1ob2xkZXJcIiAqbmdJZj1cIm5vZGVzXCI+XHJcbiAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIm5vZGVzLmlkICE9PSAwXCI+XHJcbiAgICA8YXBwLW5vZGUgW25vZGVdPW5vZGVzIGlkPVwie3tub2Rlcy5wYXRoVG9Ob2RlfX1cIj5cclxuICAgICAgPG5nLWNvbnRhaW5lciBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyRpbXBsaWNpdDogbm9kZXN9XCJcclxuICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJmb2xkZXJDb250ZW50QmFja1RlbXBsYXRlXCI+XHJcbiAgICAgIDwvbmctY29udGFpbmVyPlxyXG4gICAgPC9hcHAtbm9kZT5cclxuICA8L25nLWNvbnRhaW5lcj5cclxuXHJcbiAgPG5nLWNvbnRhaW5lciAqbmdGb3I9XCJsZXQgbm9kZSBvZiBvYmoua2V5cyhub2Rlcy5jaGlsZHJlbilcIj5cclxuICAgIDxhcHAtbm9kZSBbbm9kZV09XCJub2Rlcy5jaGlsZHJlbltub2RlXVwiXHJcbiAgICAgICAgICAgICAgaWQ9XCJmY197e25vZGVzLmNoaWxkcmVuW25vZGVdLnBhdGhUb05vZGV9fVwiPlxyXG4gICAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7JGltcGxpY2l0OiBub2Rlcy5jaGlsZHJlbltub2RlXX1cIlxyXG4gICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImZvbGRlckNvbnRlbnRUZW1wbGF0ZVwiPlxyXG4gICAgICA8L25nLWNvbnRhaW5lcj5cclxuICAgIDwvYXBwLW5vZGU+XHJcbiAgPC9uZy1jb250YWluZXI+XHJcblxyXG4gIDxkaXYgY2xhc3M9XCJuZXdcIiAoY2xpY2spPVwibmV3Q2xpY2tlZEFjdGlvbigpXCI+XHJcbiAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImZvbGRlckNvbnRlbnROZXdUZW1wbGF0ZVwiPjwvbmctY29udGFpbmVyPlxyXG4gIDwvZGl2PlxyXG48L2Rpdj5cclxuYCxcclxuICBzdHlsZXM6IFtgLml0ZW0taG9sZGVye2JveC1zaXppbmc6Ym9yZGVyLWJveDtkaXNwbGF5Oi13ZWJraXQtZmxleDtkaXNwbGF5OmZsZXg7LXdlYmtpdC1mbGV4LWZsb3c6d3JhcDtmbGV4LWZsb3c6d3JhcH0uaXRlbS1ob2xkZXIgLm5ld3tkaXNwbGF5OmlubGluZX1gXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRm9sZGVyQ29udGVudENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgQElucHV0KCkgZm9sZGVyQ29udGVudFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gIEBJbnB1dCgpIGZvbGRlckNvbnRlbnRCYWNrVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgQElucHV0KCkgZm9sZGVyQ29udGVudE5ld1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICBASW5wdXQoKSB0cmVlTW9kZWw6IFRyZWVNb2RlbDtcclxuXHJcbiAgQE91dHB1dCgpIG9wZW5VcGxvYWREaWFsb2cgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIG5vZGVzOiBOb2RlSW50ZXJmYWNlO1xyXG4gIG9iaiA9IE9iamVjdDtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIG5vZGVTZXJ2aWNlOiBOb2RlU2VydmljZSxcclxuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlPEFwcFN0b3JlPlxyXG4gICkge1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLnN0b3JlXHJcbiAgICAgIC5waXBlKHNlbGVjdChzdGF0ZSA9PiBzdGF0ZS5maWxlTWFuYWdlclN0YXRlLnBhdGgpKVxyXG4gICAgICAuc3Vic2NyaWJlKChwYXRoOiBzdHJpbmcpID0+IHtcclxuICAgICAgICB0aGlzLm5vZGVzID0gdGhpcy5ub2RlU2VydmljZS5maW5kTm9kZUJ5UGF0aChwYXRoKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBuZXdDbGlja2VkQWN0aW9uKCkge1xyXG4gICAgdGhpcy5vcGVuVXBsb2FkRGlhbG9nLmVtaXQodHJ1ZSk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7QWZ0ZXJWaWV3SW5pdCwgQ29tcG9uZW50LCBDb250ZW50Q2hpbGQsIElucHV0LCBPbkluaXQsIFRlbXBsYXRlUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtOb2RlSW50ZXJmYWNlfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL25vZGUuaW50ZXJmYWNlJztcclxuaW1wb3J0IHtUcmVlTW9kZWx9IGZyb20gJy4uLy4uL21vZGVscy90cmVlLm1vZGVsJztcclxuaW1wb3J0IHtOb2RlU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvbm9kZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtzZWxlY3QsIFN0b3JlfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcbmltcG9ydCB7QXBwU3RvcmV9IGZyb20gJy4uLy4uL3JlZHVjZXJzL3JlZHVjZXIuZmFjdG9yeSc7XHJcbmltcG9ydCAqIGFzIEFDVElPTlMgZnJvbSAnLi4vLi4vcmVkdWNlcnMvYWN0aW9ucy5hY3Rpb24nO1xyXG5pbXBvcnQge2ZpcnN0fSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC10cmVlJyxcclxuICB0ZW1wbGF0ZTogYDxhcHAtbm9kZS1saXN0ZXIgW3Nob3dGaWxlc109XCJ0cmVlTW9kZWwuY29uZmlnLm9wdGlvbnMuc2hvd0ZpbGVzSW5zaWRlVHJlZVwiXHJcbiAgICAgICAgICAgICAgICAgW25vZGVzXT1cIntjaGlsZHJlbjogbm9kZXN9XCI+XHJcbiAgPG5nLXRlbXBsYXRlIGxldC1ub2Rlcz5cclxuICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IG5vZGVzfVwiIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInRlbXBsYXRlUmVmXCI+PC9uZy1jb250YWluZXI+XHJcbiAgPC9uZy10ZW1wbGF0ZT5cclxuPC9hcHAtbm9kZS1saXN0ZXI+XHJcbmAsXHJcbiAgc3R5bGVzOiBbYGBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBUcmVlQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25Jbml0IHtcclxuICBAQ29udGVudENoaWxkKFRlbXBsYXRlUmVmKSB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgQElucHV0KCkgdHJlZU1vZGVsOiBUcmVlTW9kZWw7XHJcblxyXG4gIG5vZGVzOiBOb2RlSW50ZXJmYWNlO1xyXG4gIGN1cnJlbnRUcmVlTGV2ZWwgPSAnJztcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIG5vZGVTZXJ2aWNlOiBOb2RlU2VydmljZSxcclxuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlPEFwcFN0b3JlPlxyXG4gICkge1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLm5vZGVzID0gdGhpcy50cmVlTW9kZWwubm9kZXM7XHJcblxyXG4gICAgLy90b2RvIG1vdmUgdGhpcyBzdG9yZSB0byBwcm9wZXIgcGxhY2VcclxuICAgIHRoaXMuc3RvcmVcclxuICAgICAgLnBpcGUoc2VsZWN0KHN0YXRlID0+IHN0YXRlLmZpbGVNYW5hZ2VyU3RhdGUucGF0aCkpXHJcbiAgICAgIC5zdWJzY3JpYmUoKHBhdGg6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIHRoaXMubm9kZVNlcnZpY2UuZ2V0Tm9kZXMocGF0aCk7XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudFRyZWVMZXZlbCA9IHRoaXMudHJlZU1vZGVsLmN1cnJlbnRQYXRoO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy50cmVlTW9kZWwuY3VycmVudFBhdGggPSBwYXRoO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuICAgIHRoaXMuc3RvcmVcclxuICAgICAgLnBpcGUoc2VsZWN0KHN0YXRlID0+IHN0YXRlLmZpbGVNYW5hZ2VyU3RhdGUucGF0aCkpXHJcbiAgICAgIC5waXBlKGZpcnN0KCkpXHJcbiAgICAgIC5zdWJzY3JpYmUoKHBhdGg6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIGNvbnN0IG5vZGVzID0gdGhpcy5ub2RlU2VydmljZS5maW5kTm9kZUJ5UGF0aChwYXRoKTtcclxuICAgICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9TRUxFQ1RFRF9OT0RFLCBwYXlsb2FkOiBub2Rlc30pO1xyXG4gICAgICB9KTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnQsIENvbnRlbnRDaGlsZCwgSW5wdXQsIE9uSW5pdCwgVGVtcGxhdGVSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge05vZGVJbnRlcmZhY2V9IGZyb20gJy4uLy4uLy4uL2ludGVyZmFjZXMvbm9kZS5pbnRlcmZhY2UnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtbm9kZS1saXN0ZXInLFxyXG4gIHRlbXBsYXRlOiBgPHVsIGNsYXNzPVwibm9kZS1saXN0ZXItZmxpc3RcIj5cclxuICA8IS0tSW4gb3JkZXIgdG8gYXZvaWQgaGF2aW5nIHRvIGNyZWF0ZSB0aGF0IGV4dHJhIGRpdiwgd2UgY2FuIGluc3RlYWQgdXNlIG5nLWNvbnRhaW5lciBkaXJlY3RpdmUtLT5cclxuICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBub2RlIG9mIG9iai5rZXlzKG5vZGVzKVwiPlxyXG4gICAgPGxpIGNsYXNzPVwibm9kZS1saXN0ZXItbGlzdC1pdGVtXCIgKm5nSWY9XCJub2Rlc1tub2RlXS5pc0ZvbGRlciB8fCBzaG93RmlsZXNcIj5cclxuXHJcbiAgICAgIDxhcHAtbm9kZSBjbGFzcz1cIm5vZGUtbGlzdGVyLWFwcC1ub2RlXCIgW25vZGVdPVwibm9kZXNbbm9kZV1cIiBpZD1cInRyZWVfe3tub2Rlc1tub2RlXS5pZCA9PT0gMCA/ICdyb290JyA6IG5vZGVzW25vZGVdLnBhdGhUb05vZGV9fVwiPlxyXG4gICAgICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IChub2Rlc1tub2RlXSl9XCJcclxuICAgICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInRlbXBsYXRlUmVmXCI+XHJcbiAgICAgICAgPC9uZy1jb250YWluZXI+XHJcbiAgICAgIDwvYXBwLW5vZGU+XHJcblxyXG4gICAgICA8YXBwLW5vZGUtbGlzdGVyIGNsYXNzPVwibm9kZS1saXN0ZXJcIiAqbmdJZj1cIm9iai5rZXlzKG5vZGVzW25vZGVdLmNoaWxkcmVuKS5sZW5ndGggPiAwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICBbc2hvd0ZpbGVzXT1cInNob3dGaWxlc1wiIFtub2Rlc109XCJub2Rlc1tub2RlXS5jaGlsZHJlblwiPlxyXG4gICAgICAgIDxuZy10ZW1wbGF0ZSBsZXQtbm9kZXM+XHJcbiAgICAgICAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7JGltcGxpY2l0OiAobm9kZXMpfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInRlbXBsYXRlUmVmXCI+XHJcbiAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cclxuICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgICA8L2FwcC1ub2RlLWxpc3Rlcj5cclxuICAgIDwvbGk+XHJcbiAgPC9uZy1jb250YWluZXI+XHJcbjwvdWw+XHJcbmAsXHJcbiAgc3R5bGVzOiBbYC5ub2RlLWxpc3Rlci1mbGlzdHttYXJnaW46MCAwIDAgMWVtO3BhZGRpbmc6MDtsaXN0LXN0eWxlOm5vbmU7d2hpdGUtc3BhY2U6bm93cmFwfS5ub2RlLWxpc3Rlci1saXN0LWl0ZW17bGlzdC1zdHlsZTpub25lO2xpbmUtaGVpZ2h0OjEuMmVtO2ZvbnQtc2l6ZToxZW07ZGlzcGxheTppbmxpbmV9Lm5vZGUtbGlzdGVyLWxpc3QtaXRlbSAubm9kZS1saXN0ZXItYXBwLW5vZGUuZGVzZWxlY3RlZCsubm9kZS1saXN0ZXIgdWx7ZGlzcGxheTpub25lfWBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOb2RlTGlzdGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBAQ29udGVudENoaWxkKFRlbXBsYXRlUmVmKSB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55PjtcclxuICBASW5wdXQoKSBub2RlczogTm9kZUludGVyZmFjZTtcclxuICBASW5wdXQoKSBzaG93RmlsZXM6IGJvb2xlYW47XHJcblxyXG4gIG9iaiA9IE9iamVjdDtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnQsIElucHV0LCBPbkluaXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge05vZGVJbnRlcmZhY2V9IGZyb20gJy4uLy4uLy4uL2ludGVyZmFjZXMvbm9kZS5pbnRlcmZhY2UnO1xyXG5pbXBvcnQge1N0b3JlfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcblxyXG5pbXBvcnQgKiBhcyBBQ1RJT05TIGZyb20gJy4uLy4uLy4uL3JlZHVjZXJzL2FjdGlvbnMuYWN0aW9uJztcclxuaW1wb3J0IHtBcHBTdG9yZX0gZnJvbSAnLi4vLi4vLi4vcmVkdWNlcnMvcmVkdWNlci5mYWN0b3J5JztcclxuaW1wb3J0IHtOb2RlU2VydmljZX0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvbm9kZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtOb2RlQ2xpY2tlZFNlcnZpY2V9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL25vZGUtY2xpY2tlZC5zZXJ2aWNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLW5vZGUnLFxyXG4gIHRlbXBsYXRlOiBgPGRpdiAjY3VzdG9tVGVtcGxhdGUgKGRibGNsaWNrKT1cIm1ldGhvZDJDYWxsRm9yRGJsQ2xpY2soJGV2ZW50KVwiIChjbGljayk9XCJtZXRob2QxQ2FsbEZvckNsaWNrKCRldmVudClcIj5cclxuICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XHJcbjwvZGl2PlxyXG5gLFxyXG4gIHN0eWxlczogW2BgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTm9kZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgQElucHV0KCkgbm9kZTogTm9kZUludGVyZmFjZTtcclxuICBpc1NpbmdsZUNsaWNrID0gdHJ1ZTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTxBcHBTdG9yZT4sXHJcbiAgICBwcml2YXRlIG5vZGVTZXJ2aWNlOiBOb2RlU2VydmljZSxcclxuICAgIHByaXZhdGUgbm9kZUNsaWNrZWRTZXJ2aWNlOiBOb2RlQ2xpY2tlZFNlcnZpY2VcclxuICApIHtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBtZXRob2QxQ2FsbEZvckNsaWNrKGV2ZW50OiBNb3VzZUV2ZW50KSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIHRoaXMuaXNTaW5nbGVDbGljayA9IHRydWU7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgaWYgKHRoaXMuaXNTaW5nbGVDbGljaykge1xyXG4gICAgICAgIHRoaXMuc2hvd01lbnUoKTtcclxuICAgICAgfVxyXG4gICAgfSwgMjAwKTtcclxuICB9XHJcblxyXG4gIC8vIHRvZG8gZXZlbnQucHJldmVudERlZmF1bHQgZm9yIGRvdWJsZSBjbGlja1xyXG4gIHB1YmxpYyBtZXRob2QyQ2FsbEZvckRibENsaWNrKGV2ZW50OiBhbnkpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgdGhpcy5pc1NpbmdsZUNsaWNrID0gZmFsc2U7XHJcbiAgICB0aGlzLm9wZW4oKTtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBvcGVuKCkge1xyXG4gICAgaWYgKCF0aGlzLm5vZGUuaXNGb2xkZXIpIHtcclxuICAgICAgdGhpcy5ub2RlQ2xpY2tlZFNlcnZpY2Uuc3RhcnREb3dubG9hZCh0aGlzLm5vZGUpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMubm9kZS5zdGF5T3Blbikge1xyXG4gICAgICBpZiAodGhpcy5ub2RlLm5hbWUgPT0gJ3Jvb3QnKSB7XHJcbiAgICAgICAgdGhpcy5ub2RlU2VydmljZS5mb2xkQWxsKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IEFDVElPTlMuU0VUX1BBVEgsIHBheWxvYWQ6IHRoaXMubm9kZS5wYXRoVG9Ob2RlfSk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnRvZ2dsZU5vZGVFeHBhbmRlZCgpO1xyXG5cclxuICAgIGlmICh0aGlzLm5vZGUuaXNFeHBhbmRlZCkge1xyXG4gICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9QQVRILCBwYXlsb2FkOiB0aGlzLm5vZGUucGF0aFRvTm9kZX0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2V0Tm9kZVNlbGVjdGVkU3RhdGUoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2hvd01lbnUoKSB7XHJcbiAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9TRUxFQ1RFRF9OT0RFLCBwYXlsb2FkOiB0aGlzLm5vZGV9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgdG9nZ2xlTm9kZUV4cGFuZGVkKCkge1xyXG4gICAgdGhpcy5ub2RlLmlzRXhwYW5kZWQgPSAhdGhpcy5ub2RlLmlzRXhwYW5kZWQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldE5vZGVTZWxlY3RlZFN0YXRlKCkge1xyXG4gICAgaWYgKCF0aGlzLm5vZGUuaXNFeHBhbmRlZCkge1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHJlZV8nICsgdGhpcy5ub2RlLnBhdGhUb05vZGUpLmNsYXNzTGlzdC5hZGQoJ2Rlc2VsZWN0ZWQnKTtcclxuXHJcbiAgICAgIHRoaXMubm9kZVNlcnZpY2UuZm9sZFJlY3Vyc2l2ZWx5KHRoaXMubm9kZSk7XHJcblxyXG4gICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9QQVRILCBwYXlsb2FkOiB0aGlzLm5vZGUucGF0aFRvUGFyZW50fSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndHJlZV8nICsgdGhpcy5ub2RlLnBhdGhUb05vZGUpLmNsYXNzTGlzdC5yZW1vdmUoJ2Rlc2VsZWN0ZWQnKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtQaXBlLCBQaXBlVHJhbnNmb3JtfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBQaXBlKHtcclxuICBuYW1lOiAnbWFwVG9JdGVyYWJsZVBpcGUnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBNYXBUb0l0ZXJhYmxlUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xyXG4gIHRyYW5zZm9ybShkaWN0OiBPYmplY3QpIHtcclxuICAgIGNvbnN0IGEgPSBbXTtcclxuICAgIGZvciAoY29uc3Qga2V5IGluIGRpY3QpIHtcclxuICAgICAgaWYgKGRpY3QuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgIGEucHVzaCh7a2V5OiBrZXksIHZhbDogZGljdFtrZXldfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnQsIE9uSW5pdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7c2VsZWN0LCBTdG9yZX0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5pbXBvcnQgKiBhcyBBQ1RJT05TIGZyb20gJy4uLy4uL3JlZHVjZXJzL2FjdGlvbnMuYWN0aW9uJztcclxuaW1wb3J0IHtBcHBTdG9yZX0gZnJvbSAnLi4vLi4vcmVkdWNlcnMvcmVkdWNlci5mYWN0b3J5JztcclxuaW1wb3J0IHtOb2RlU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvbm9kZS5zZXJ2aWNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLW5hdi1iYXInLFxyXG4gIHRlbXBsYXRlOiBgPGRpdj5cclxuICA+PiA8c3BhbiAqbmdGb3I9XCJsZXQgdG8gb2YgY3VycmVudFBhdGg7IGxldCBpID0gaW5kZXhcIj5cclxuICA8YSBjbGFzcz1cImxpbmtcIiAoY2xpY2spPVwib25DbGljayhjdXJyZW50UGF0aCwgaSlcIj5cclxuICAgIDxkaXYgKm5nSWY9XCJ0byA9PT0gJycgfHwgdG8gPT09ICdyb290JzsgdGhlbiBpY29uIGVsc2UgbmFtZVwiPjwvZGl2PlxyXG4gICAgPG5nLXRlbXBsYXRlICNpY29uPjxpIGNsYXNzPVwiZmFzIGZhLWhvbWVcIj48L2k+PC9uZy10ZW1wbGF0ZT5cclxuICAgIDxuZy10ZW1wbGF0ZSAjbmFtZT57e3RvfX08L25nLXRlbXBsYXRlPlxyXG4gIDwvYT4gL1xyXG4gIDwvc3Bhbj5cclxuPC9kaXY+XHJcbmAsXHJcbiAgc3R5bGVzOiBbYGBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOYXZCYXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIGN1cnJlbnRQYXRoOiBzdHJpbmdbXTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTxBcHBTdG9yZT4sXHJcbiAgICBwcml2YXRlIG5vZGVTZXJ2aWNlOiBOb2RlU2VydmljZVxyXG4gICkge1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLnN0b3JlXHJcbiAgICAgIC5waXBlKHNlbGVjdChzdGF0ZSA9PiBzdGF0ZS5maWxlTWFuYWdlclN0YXRlLnBhdGgpKVxyXG4gICAgICAuc3Vic2NyaWJlKChkYXRhOiBzdHJpbmcpID0+IHtcclxuICAgICAgICB0aGlzLm5vZGVTZXJ2aWNlLmN1cnJlbnRQYXRoID0gZGF0YTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQYXRoID0gZGF0YS5zcGxpdCgnLycpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIG9uQ2xpY2socGF0aDogc3RyaW5nW10sIGluZGV4OiBudW1iZXIpIHtcclxuICAgIGNvbnN0IG5ld1BhdGggPSBwYXRoLnNsaWNlKDAsIGluZGV4ICsgMSkuam9pbignLycpO1xyXG4gICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogQUNUSU9OUy5TRVRfUEFUSCwgcGF5bG9hZDogbmV3UGF0aH0pO1xyXG4gIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHtTdGF0ZUludGVyZmFjZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9zdGF0ZS5pbnRlcmZhY2UnO1xyXG5pbXBvcnQgKiBhcyBBQ1RJT05TIGZyb20gJy4vYWN0aW9ucy5hY3Rpb24nO1xyXG5cclxuY29uc3QgaW5pdGlhbFN0YXRlOiBTdGF0ZUludGVyZmFjZSA9IHtcclxuICBwYXRoOiAnJyxcclxuICBpc0xvYWRpbmc6IHRydWUsXHJcbiAgc2VsZWN0ZWROb2RlOiBudWxsXHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3RhdGVSZWR1Y2VyKHN0YXRlOiBTdGF0ZUludGVyZmFjZSA9IGluaXRpYWxTdGF0ZSwgYWN0aW9uOiBBQ1RJT05TLkFjdGlvbnMpOiBTdGF0ZUludGVyZmFjZSB7XHJcbiAgLy8gY29uc29sZS5sb2coJ1ByZXZpb3VzIHN0YXRlOiAnLCBzdGF0ZSk7XHJcbiAgLy8gY29uc29sZS5sb2coJ0FDVElPTiB0eXBlOiAnLCBhY3Rpb24udHlwZSk7XHJcbiAgLy8gY29uc29sZS5sb2coJ0FDVElPTiBwYXlsb2FkOiAnLCBhY3Rpb24ucGF5bG9hZCk7XHJcblxyXG4gIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgIGNhc2UgQUNUSU9OUy5TRVRfUEFUSCA6XHJcbiAgICAgIGlmIChzdGF0ZS5wYXRoID09PSBhY3Rpb24ucGF5bG9hZCkge1xyXG4gICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gey4uLnN0YXRlLCBwYXRoOiBhY3Rpb24ucGF5bG9hZCwgaXNMb2FkaW5nOiB0cnVlfTtcclxuICAgIGNhc2UgQUNUSU9OUy5TRVRfTE9BRElOR19TVEFURSA6XHJcbiAgICAgIHJldHVybiB7Li4uc3RhdGUsIGlzTG9hZGluZzogYWN0aW9uLnBheWxvYWR9O1xyXG4gICAgY2FzZSBBQ1RJT05TLlNFVF9TRUxFQ1RFRF9OT0RFIDpcclxuICAgICAgcmV0dXJuIHsuLi5zdGF0ZSwgc2VsZWN0ZWROb2RlOiBhY3Rpb24ucGF5bG9hZH07XHJcbiAgICBkZWZhdWx0OlxyXG4gICAgICByZXR1cm4gaW5pdGlhbFN0YXRlO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge3N0YXRlUmVkdWNlcn0gZnJvbSAnLi9zdGF0ZVJlZHVjZXInO1xyXG5pbXBvcnQge0FjdGlvblJlZHVjZXJNYXB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcclxuaW1wb3J0IHtTdGF0ZUludGVyZmFjZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9zdGF0ZS5pbnRlcmZhY2UnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBcHBTdG9yZSB7XHJcbiAgZmlsZU1hbmFnZXJTdGF0ZTogU3RhdGVJbnRlcmZhY2U7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCByZWR1Y2VyczogQWN0aW9uUmVkdWNlck1hcDxBcHBTdG9yZT4gPSB7XHJcbiAgZmlsZU1hbmFnZXJTdGF0ZTogc3RhdGVSZWR1Y2VyXHJcbn07XHJcbiIsImltcG9ydCB7Q29tcG9uZW50LCBJbnB1dCwgT25Jbml0LCBUZW1wbGF0ZVJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7X30gZnJvbSAnQGJpZXNiamVyZy9uZ3gtdHJhbnNsYXRlLWV4dHJhY3QvZGlzdC91dGlscy91dGlscyc7XHJcbmltcG9ydCB7dGltZXJ9IGZyb20gJ3J4anMnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtbG9hZGluZy1vdmVybGF5JyxcclxuICB0ZW1wbGF0ZTogYDxuZy1jb250YWluZXJcclxuICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyRpbXBsaWNpdDogdGltZW91dE1lc3NhZ2V9XCJcclxuICBbbmdUZW1wbGF0ZU91dGxldF09XCJsb2FkaW5nT3ZlcmxheVRlbXBsYXRlXCI+XHJcbjwvbmctY29udGFpbmVyPlxyXG5gLFxyXG4gIHN0eWxlczogW2BgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTG9hZGluZ092ZXJsYXlDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIEBJbnB1dCgpIGxvYWRpbmdPdmVybGF5VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgdGltZW91dE1lc3NhZ2U6IGFueTtcclxuXHJcbiAgLy8gdG9kbyB1bnN1YnNjcmliZSBmcm9tICdsaXN0JyBldmVudCAtIG5vdyB3ZSBhcmUgb25seSBkaXNtaXNzaW5nIHRoaXMgY29tcG9uZW50XHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aW1lcigyMDAwKS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICB0aGlzLnRpbWVvdXRNZXNzYWdlID0gXygnVHJvdWJsZXMgd2l0aCBsb2FkaW5nPyBDbGljayBhbnl3aGVyZSB0byBjYW5jZWwgbG9hZGluZycpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbi8qXHJcbiAqIENvbnZlcnQgYnl0ZXMgaW50byBsYXJnZXN0IHBvc3NpYmxlIHVuaXQuXHJcbiAqIFRha2VzIGFuIHByZWNpc2lvbiBhcmd1bWVudCB0aGF0IGRlZmF1bHRzIHRvIDIuXHJcbiAqIFVzYWdlOlxyXG4gKiAgIGJ5dGVzIHwgZmlsZVNpemU6cHJlY2lzaW9uXHJcbiAqIEV4YW1wbGU6XHJcbiAqICAge3sgMTAyNCB8ICBmaWxlU2l6ZX19XHJcbiAqICAgZm9ybWF0cyB0bzogMSBLQlxyXG4qL1xyXG5AUGlwZSh7bmFtZTogJ2ZpbGVTaXplJ30pXHJcbmV4cG9ydCBjbGFzcyBGaWxlU2l6ZVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcclxuXHJcbiAgcHJpdmF0ZSB1bml0cyA9IFtcclxuICAgICdieXRlcycsXHJcbiAgICAnS0InLFxyXG4gICAgJ01CJyxcclxuICAgICdHQicsXHJcbiAgICAnVEInLFxyXG4gICAgJ1BCJ1xyXG4gIF07XHJcblxyXG4gIHRyYW5zZm9ybShieXRlczogbnVtYmVyID0gMCwgcHJlY2lzaW9uOiBudW1iZXIgPSAyICkgOiBzdHJpbmcge1xyXG4gICAgaWYgKCBpc05hTiggcGFyc2VGbG9hdCggU3RyaW5nKGJ5dGVzKSApKSB8fCAhIGlzRmluaXRlKCBieXRlcyApICkgcmV0dXJuICc/JztcclxuXHJcbiAgICBsZXQgdW5pdCA9IDA7XHJcblxyXG4gICAgd2hpbGUgKCBieXRlcyA+PSAxMDI0ICkge1xyXG4gICAgICBieXRlcyAvPSAxMDI0O1xyXG4gICAgICB1bml0ICsrO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBieXRlcy50b0ZpeGVkKCArIHByZWNpc2lvbiApICsgJyAnICsgdGhpcy51bml0c1sgdW5pdCBdO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge0FmdGVyVmlld0luaXQsIENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtIdHRwQ2xpZW50fSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7RmluZVVwbG9hZGVyfSBmcm9tICdmaW5lLXVwbG9hZGVyJztcclxuaW1wb3J0IHtOb2RlU2VydmljZX0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvbm9kZS5zZXJ2aWNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLXVwbG9hZCcsXHJcbiAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwiYmFja2Ryb3BcIiAoY2xpY2spPVwibmV3Q2xpY2tlZEFjdGlvbigpXCI+PC9kaXY+XHJcbjxkaXYgY2xhc3M9XCJ1cGxvYWQtYmFja2dyb3VuZFwiPlxyXG4gIDxkaXYgY2xhc3M9XCJidXR0b25zXCI+XHJcbiAgICA8YnV0dG9uIGNsYXNzPVwiYnV0dG9uXCIgW2Rpc2FibGVkXT1cIm5ld0ZvbGRlclwiIChjbGljayk9XCJjcmVhdGVOZXdGb2xkZXIoKVwiIHRyYW5zbGF0ZT5DcmVhdGUgbmV3IGZvbGRlcjwvYnV0dG9uPlxyXG4gIDwvZGl2PlxyXG5cclxuICA8ZGl2ICpuZ0lmPVwibmV3Rm9sZGVyXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uc1wiPlxyXG4gICAgICA8YXBwLW5ldy1mb2xkZXIgKGJ1dHRvbkNsaWNrZWQpPVwiY3JlYXRlTmV3Rm9sZGVyKCRldmVudClcIj48L2FwcC1uZXctZm9sZGVyPlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcblxyXG4gIDxkaXYgaWQ9XCJmaW5lLXVwbG9hZGVyXCI+XHJcbiAgPC9kaXY+XHJcblxyXG5cclxuICA8ZGl2IGNsYXNzPVwiYnV0dG9uc1wiPlxyXG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ1dHRvbiBiaWdcIiBbZGlzYWJsZWRdPVwidGhpcy5jb3VudGVyIDwgMVwiIChjbGljayk9XCJ1cGxvYWRGaWxlcygpXCIgdHJhbnNsYXRlPlxyXG4gICAgICBVcGxvYWRcclxuICAgIDwvYnV0dG9uPlxyXG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ1dHRvbiBiaWdcIiAoY2xpY2spPVwibmV3Q2xpY2tlZEFjdGlvbigpXCIgdHJhbnNsYXRlPlxyXG4gICAgICBDbG9zZVxyXG4gICAgPC9idXR0b24+XHJcbiAgPC9kaXY+XHJcblxyXG48L2Rpdj5cclxuXHJcbjxkaXYgaWQ9XCJmaW5lLXVwbG9hZGVyLXRlbXBsYXRlXCIgc3R5bGU9XCJkaXNwbGF5OiBub25lO1wiPlxyXG4gIDxkaXYgY2xhc3M9XCJxcS11cGxvYWRlci1zZWxlY3RvciBxcS11cGxvYWRlclwiIHFxLWRyb3AtYXJlYS10ZXh0PVwiRHJvcCBmaWxlcyBoZXJlXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwicXEtdXBsb2FkLWRyb3AtYXJlYS1zZWxlY3RvciBxcS11cGxvYWQtZHJvcC1hcmVhXCIgcXEtaGlkZS1kcm9wem9uZT5cclxuICAgICAgPHNwYW4gY2xhc3M9XCJxcS11cGxvYWQtZHJvcC1hcmVhLXRleHQtc2VsZWN0b3JcIj48L3NwYW4+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8ZGl2IGNsYXNzPVwidXBsb2FkLXRvcC1iYXJcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cInFxLXVwbG9hZC1idXR0b24tc2VsZWN0b3IgcXEtdXBsb2FkLWJ1dHRvblwiPlxyXG4gICAgICAgIDxkaXYgdHJhbnNsYXRlPlVwbG9hZCBhIGZpbGU8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzPVwicXEtdG90YWwtcHJvZ3Jlc3MtYmFyLWNvbnRhaW5lci1zZWxlY3RvciBxcS10b3RhbC1wcm9ncmVzcy1iYXItY29udGFpbmVyXCI+XHJcbiAgICAgICAgPGRpdiByb2xlPVwicHJvZ3Jlc3NiYXJcIiBhcmlhLXZhbHVlbm93PVwiMFwiIGFyaWEtdmFsdWVtaW49XCIwXCIgYXJpYS12YWx1ZW1heD1cIjEwMFwiXHJcbiAgICAgICAgICAgICBjbGFzcz1cInFxLXRvdGFsLXByb2dyZXNzLWJhci1zZWxlY3RvciBxcS1wcm9ncmVzcy1iYXIgcXEtdG90YWwtcHJvZ3Jlc3MtYmFyXCI+PC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPHNwYW4gY2xhc3M9XCJxcS1kcm9wLXByb2Nlc3Npbmctc2VsZWN0b3IgcXEtZHJvcC1wcm9jZXNzaW5nXCI+XHJcbiAgICAgICAgICAgIDxzcGFuIHRyYW5zbGF0ZT5Qcm9jZXNzaW5nIGRyb3BwZWQgZmlsZXM8L3NwYW4+Li4uXHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicXEtZHJvcC1wcm9jZXNzaW5nLXNwaW5uZXItc2VsZWN0b3IgcXEtZHJvcC1wcm9jZXNzaW5nLXNwaW5uZXJcIj48L3NwYW4+XHJcbiAgICA8L3NwYW4+XHJcblxyXG4gICAgPHVsIGNsYXNzPVwicXEtdXBsb2FkLWxpc3Qtc2VsZWN0b3IgcXEtdXBsb2FkLWxpc3RcIiBhcmlhLWxpdmU9XCJwb2xpdGVcIiBhcmlhLXJlbGV2YW50PVwiYWRkaXRpb25zIHJlbW92YWxzXCI+XHJcbiAgICAgIDxsaT5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwicXEtcHJvZ3Jlc3MtYmFyLWNvbnRhaW5lci1zZWxlY3RvclwiPlxyXG4gICAgICAgICAgPGRpdiByb2xlPVwicHJvZ3Jlc3NiYXJcIiBhcmlhLXZhbHVlbm93PVwiMFwiIGFyaWEtdmFsdWVtaW49XCIwXCIgYXJpYS12YWx1ZW1heD1cIjEwMFwiXHJcbiAgICAgICAgICAgICAgIGNsYXNzPVwicXEtcHJvZ3Jlc3MtYmFyLXNlbGVjdG9yIHFxLXByb2dyZXNzLWJhclwiPjwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwicXEtdXBsb2FkLXNwaW5uZXItc2VsZWN0b3IgcXEtdXBsb2FkLXNwaW5uZXJcIj48L3NwYW4+XHJcbiAgICAgICAgPGltZyBjbGFzcz1cInFxLXRodW1ibmFpbC1zZWxlY3RvclwiIHFxLW1heC1zaXplPVwiMTAwXCIgcXEtc2VydmVyLXNjYWxlPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwicXEtdXBsb2FkLWZpbGUtc2VsZWN0b3IgcXEtdXBsb2FkLWZpbGVcIj48L3NwYW4+XHJcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJxcS1lZGl0LWZpbGVuYW1lLWljb24tc2VsZWN0b3IgcXEtZWRpdC1maWxlbmFtZS1pY29uXCIgYXJpYS1sYWJlbD1cIkVkaXQgZmlsZW5hbWVcIj48L3NwYW4+XHJcbiAgICAgICAgPGlucHV0IGNsYXNzPVwicXEtZWRpdC1maWxlbmFtZS1zZWxlY3RvciBxcS1lZGl0LWZpbGVuYW1lXCIgdGFiaW5kZXg9XCIwXCIgdHlwZT1cInRleHRcIj5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cInFxLXVwbG9hZC1zaXplLXNlbGVjdG9yIHFxLXVwbG9hZC1zaXplXCI+PC9zcGFuPlxyXG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicXEtYnRuIHFxLXVwbG9hZC1jYW5jZWwtc2VsZWN0b3IgcXEtdXBsb2FkLWNhbmNlbFwiIHRyYW5zbGF0ZT5DYW5jZWw8L2J1dHRvbj5cclxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInFxLWJ0biBxcS11cGxvYWQtcmV0cnktc2VsZWN0b3IgcXEtdXBsb2FkLXJldHJ5XCIgdHJhbnNsYXRlPlJldHJ5PC9idXR0b24+XHJcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJxcS1idG4gcXEtdXBsb2FkLWRlbGV0ZS1zZWxlY3RvciBxcS11cGxvYWQtZGVsZXRlXCIgdHJhbnNsYXRlPkRlbGV0ZTwvYnV0dG9uPlxyXG4gICAgICAgIDxzcGFuIHJvbGU9XCJzdGF0dXNcIiBjbGFzcz1cInFxLXVwbG9hZC1zdGF0dXMtdGV4dC1zZWxlY3RvciBxcS11cGxvYWQtc3RhdHVzLXRleHRcIj48L3NwYW4+XHJcbiAgICAgIDwvbGk+XHJcbiAgICA8L3VsPlxyXG5cclxuICAgIDxkaWFsb2cgY2xhc3M9XCJxcS1hbGVydC1kaWFsb2ctc2VsZWN0b3JcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cInFxLWRpYWxvZy1tZXNzYWdlLXNlbGVjdG9yXCI+PC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJxcS1kaWFsb2ctYnV0dG9uc1wiPlxyXG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicXEtY2FuY2VsLWJ1dHRvbi1zZWxlY3RvclwiIHRyYW5zbGF0ZT5DbG9zZTwvYnV0dG9uPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGlhbG9nPlxyXG5cclxuICAgIDxkaWFsb2cgY2xhc3M9XCJxcS1jb25maXJtLWRpYWxvZy1zZWxlY3RvclwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicXEtZGlhbG9nLW1lc3NhZ2Utc2VsZWN0b3JcIj48L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cInFxLWRpYWxvZy1idXR0b25zXCI+XHJcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJxcS1jYW5jZWwtYnV0dG9uLXNlbGVjdG9yXCIgdHJhbnNsYXRlPk5vPC9idXR0b24+XHJcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJxcS1vay1idXR0b24tc2VsZWN0b3JcIiB0cmFuc2xhdGU+WWVzPC9idXR0b24+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaWFsb2c+XHJcblxyXG4gICAgPGRpYWxvZyBjbGFzcz1cInFxLXByb21wdC1kaWFsb2ctc2VsZWN0b3JcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cInFxLWRpYWxvZy1tZXNzYWdlLXNlbGVjdG9yXCI+PC9kaXY+XHJcbiAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicXEtZGlhbG9nLWJ1dHRvbnNcIj5cclxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInFxLWNhbmNlbC1idXR0b24tc2VsZWN0b3JcIiB0cmFuc2xhdGU+Q2FuY2VsPC9idXR0b24+XHJcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJxcS1vay1idXR0b24tc2VsZWN0b3JcIiB0cmFuc2xhdGU+T2s8L2J1dHRvbj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2RpYWxvZz5cclxuICA8L2Rpdj5cclxuPC9kaXY+XHJcbmAsXHJcbiAgc3R5bGVzOiBbYC51cGxvYWQtY29udGVudHt0ZXh0LWFsaWduOmNlbnRlcjttYXgtaGVpZ2h0OjI1dmg7b3ZlcmZsb3c6YXV0bzttYXJnaW46MTBweCBhdXRvfS5mYS10aW1lczpiZWZvcmV7Y29udGVudDpcIlxcXFxmMDBkXCJ9LmJ1dHRvbnN7YmFja2dyb3VuZDojZmZmO3BhZGRpbmc6NXB4O21hcmdpbjoxMHB4IDB9YCwgYC5xcS11cGxvYWQtYnV0dG9uIGRpdntsaW5lLWhlaWdodDoyNXB4fS5xcS11cGxvYWQtYnV0dG9uLWZvY3Vze291dGxpbmU6MH0ucXEtdXBsb2FkZXJ7cG9zaXRpb246cmVsYXRpdmU7bWluLWhlaWdodDoyMDBweDttYXgtaGVpZ2h0OjQ5MHB4O292ZXJmbG93LXk6aGlkZGVuO3dpZHRoOmluaGVyaXQ7Ym9yZGVyLXJhZGl1czo2cHg7YmFja2dyb3VuZC1jb2xvcjojZmRmZGZkO2JvcmRlcjoxcHggZGFzaGVkICNjY2M7cGFkZGluZzoyMHB4fS5xcS11cGxvYWRlcjpiZWZvcmV7Y29udGVudDphdHRyKHFxLWRyb3AtYXJlYS10ZXh0KSBcIiBcIjtwb3NpdGlvbjphYnNvbHV0ZTtmb250LXNpemU6MjAwJTtsZWZ0OjA7d2lkdGg6MTAwJTt0ZXh0LWFsaWduOmNlbnRlcjt0b3A6NDUlO29wYWNpdHk6LjI1fS5xcS11cGxvYWQtZHJvcC1hcmVhLC5xcS11cGxvYWQtZXh0cmEtZHJvcC1hcmVhe3Bvc2l0aW9uOmFic29sdXRlO3RvcDowO2xlZnQ6MDt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO21pbi1oZWlnaHQ6MzBweDt6LWluZGV4OjI7YmFja2dyb3VuZDojZjlmOWY5O2JvcmRlci1yYWRpdXM6NHB4O2JvcmRlcjoxcHggZGFzaGVkICNjY2M7dGV4dC1hbGlnbjpjZW50ZXJ9LnFxLXVwbG9hZC1kcm9wLWFyZWEgc3BhbntkaXNwbGF5OmJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO3RvcDo1MCU7d2lkdGg6MTAwJTttYXJnaW4tdG9wOi04cHg7Zm9udC1zaXplOjE2cHh9LnFxLXVwbG9hZC1leHRyYS1kcm9wLWFyZWF7cG9zaXRpb246cmVsYXRpdmU7bWFyZ2luLXRvcDo1MHB4O2ZvbnQtc2l6ZToxNnB4O3BhZGRpbmctdG9wOjMwcHg7aGVpZ2h0OjIwcHg7bWluLWhlaWdodDo0MHB4fS5xcS11cGxvYWQtZHJvcC1hcmVhLWFjdGl2ZXtiYWNrZ3JvdW5kOiNmZGZkZmQ7Ym9yZGVyLXJhZGl1czo0cHg7Ym9yZGVyOjFweCBkYXNoZWQgI2NjY30ucXEtdXBsb2FkLWxpc3R7bWFyZ2luOjA7cGFkZGluZzowO2xpc3Qtc3R5bGU6bm9uZTttYXgtaGVpZ2h0OjQ1MHB4O292ZXJmbG93LXk6YXV0bztjbGVhcjpib3RofS5xcS11cGxvYWQtbGlzdCBsaXttYXJnaW46MDtwYWRkaW5nOjlweDtsaW5lLWhlaWdodDoxNXB4O2ZvbnQtc2l6ZToxNnB4O2NvbG9yOiM0MjQyNDI7YmFja2dyb3VuZC1jb2xvcjojZjZmNmY2O2JvcmRlci10b3A6MXB4IHNvbGlkICNmZmY7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgI2RkZH0ucXEtdXBsb2FkLWxpc3QgbGk6Zmlyc3QtY2hpbGR7Ym9yZGVyLXRvcDpub25lfS5xcS11cGxvYWQtbGlzdCBsaTpsYXN0LWNoaWxke2JvcmRlci1ib3R0b206bm9uZX0ucXEtdXBsb2FkLWNhbmNlbCwucXEtdXBsb2FkLWNvbnRpbnVlLC5xcS11cGxvYWQtZGVsZXRlLC5xcS11cGxvYWQtZmFpbGVkLXRleHQsLnFxLXVwbG9hZC1maWxlLC5xcS11cGxvYWQtcGF1c2UsLnFxLXVwbG9hZC1yZXRyeSwucXEtdXBsb2FkLXNpemUsLnFxLXVwbG9hZC1zcGlubmVye21hcmdpbi1yaWdodDoxMnB4O2Rpc3BsYXk6aW5saW5lfS5xcS11cGxvYWQtZmlsZXt2ZXJ0aWNhbC1hbGlnbjptaWRkbGU7ZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6MzAwcHg7dGV4dC1vdmVyZmxvdzplbGxpcHNpczt3aGl0ZS1zcGFjZTpub3dyYXA7b3ZlcmZsb3cteDpoaWRkZW47aGVpZ2h0OjE4cHh9LnFxLXVwbG9hZC1zcGlubmVye2Rpc3BsYXk6aW5saW5lLWJsb2NrO2JhY2tncm91bmQ6dXJsKGxvYWRpbmcuZ2lmKTt3aWR0aDoxNXB4O2hlaWdodDoxNXB4O3ZlcnRpY2FsLWFsaWduOnRleHQtYm90dG9tfS5xcS1kcm9wLXByb2Nlc3Npbmd7ZGlzcGxheTpibG9ja30ucXEtZHJvcC1wcm9jZXNzaW5nLXNwaW5uZXJ7ZGlzcGxheTppbmxpbmUtYmxvY2s7YmFja2dyb3VuZDp1cmwocHJvY2Vzc2luZy5naWYpO3dpZHRoOjI0cHg7aGVpZ2h0OjI0cHg7dmVydGljYWwtYWxpZ246dGV4dC1ib3R0b219LnFxLXVwbG9hZC1jYW5jZWwsLnFxLXVwbG9hZC1jb250aW51ZSwucXEtdXBsb2FkLWRlbGV0ZSwucXEtdXBsb2FkLXBhdXNlLC5xcS11cGxvYWQtcmV0cnksLnFxLXVwbG9hZC1zaXple2ZvbnQtc2l6ZToxMnB4O2ZvbnQtd2VpZ2h0OjQwMDtjdXJzb3I6cG9pbnRlcjt2ZXJ0aWNhbC1hbGlnbjptaWRkbGV9LnFxLXVwbG9hZC1zdGF0dXMtdGV4dHtmb250LXNpemU6MTRweDtmb250LXdlaWdodDo3MDA7ZGlzcGxheTpibG9ja30ucXEtdXBsb2FkLWZhaWxlZC10ZXh0e2Rpc3BsYXk6bm9uZTtmb250LXN0eWxlOml0YWxpYztmb250LXdlaWdodDo3MDB9LnFxLXVwbG9hZC1mYWlsZWQtaWNvbntkaXNwbGF5Om5vbmU7d2lkdGg6MTVweDtoZWlnaHQ6MTVweDt2ZXJ0aWNhbC1hbGlnbjp0ZXh0LWJvdHRvbX0ucXEtdXBsb2FkLWZhaWwgLnFxLXVwbG9hZC1mYWlsZWQtdGV4dCwucXEtdXBsb2FkLXJldHJ5aW5nIC5xcS11cGxvYWQtZmFpbGVkLXRleHR7ZGlzcGxheTppbmxpbmV9LnFxLXVwbG9hZC1saXN0IGxpLnFxLXVwbG9hZC1zdWNjZXNze2JhY2tncm91bmQtY29sb3I6I2ViZjZlMDtjb2xvcjojNDI0MjQyO2JvcmRlci1ib3R0b206MXB4IHNvbGlkICNkM2RlZDE7Ym9yZGVyLXRvcDoxcHggc29saWQgI2Y3ZmZmNX0ucXEtdXBsb2FkLWxpc3QgbGkucXEtdXBsb2FkLWZhaWx7YmFja2dyb3VuZC1jb2xvcjojZjVkN2Q3O2NvbG9yOiM0MjQyNDI7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgI2RlY2FjYTtib3JkZXItdG9wOjFweCBzb2xpZCAjZmNlNmU2fS5xcS10b3RhbC1wcm9ncmVzcy1iYXJ7aGVpZ2h0OjI1cHg7Ym9yZGVyLXJhZGl1czo5cHh9SU5QVVQucXEtZWRpdC1maWxlbmFtZXtwb3NpdGlvbjphYnNvbHV0ZTtvcGFjaXR5OjA7ei1pbmRleDotMX0ucXEtdXBsb2FkLWZpbGUucXEtZWRpdGFibGV7Y3Vyc29yOnBvaW50ZXI7bWFyZ2luLXJpZ2h0OjRweH0ucXEtZWRpdC1maWxlbmFtZS1pY29uLnFxLWVkaXRhYmxle2Rpc3BsYXk6aW5saW5lLWJsb2NrO2N1cnNvcjpwb2ludGVyfUlOUFVULnFxLWVkaXQtZmlsZW5hbWUucXEtZWRpdGluZ3twb3NpdGlvbjpzdGF0aWM7aGVpZ2h0OjI4cHg7cGFkZGluZzowIDhweDttYXJnaW4tcmlnaHQ6MTBweDttYXJnaW4tYm90dG9tOi01cHg7Ym9yZGVyOjFweCBzb2xpZCAjY2NjO2JvcmRlci1yYWRpdXM6MnB4O2ZvbnQtc2l6ZToxNnB4O29wYWNpdHk6MX0ucXEtZWRpdC1maWxlbmFtZS1pY29ue2Rpc3BsYXk6bm9uZTtiYWNrZ3JvdW5kOnVybChlZGl0LmdpZik7d2lkdGg6MTVweDtoZWlnaHQ6MTVweDt2ZXJ0aWNhbC1hbGlnbjp0ZXh0LWJvdHRvbTttYXJnaW4tcmlnaHQ6MTZweH0ucXEtaGlkZXtkaXNwbGF5Om5vbmV9LnFxLXRodW1ibmFpbC1zZWxlY3Rvcnt2ZXJ0aWNhbC1hbGlnbjptaWRkbGU7bWFyZ2luLXJpZ2h0OjEycHh9LnFxLXVwbG9hZGVyIERJQUxPR3tkaXNwbGF5Om5vbmV9LnFxLXVwbG9hZGVyIERJQUxPR1tvcGVuXXtkaXNwbGF5OmJsb2NrfS5xcS11cGxvYWRlciBESUFMT0cgLnFxLWRpYWxvZy1idXR0b25ze3RleHQtYWxpZ246Y2VudGVyO3BhZGRpbmctdG9wOjEwcHh9LnFxLXVwbG9hZGVyIERJQUxPRyAucXEtZGlhbG9nLWJ1dHRvbnMgQlVUVE9Oe21hcmdpbi1sZWZ0OjVweDttYXJnaW4tcmlnaHQ6NXB4fS5xcS11cGxvYWRlciBESUFMT0cgLnFxLWRpYWxvZy1tZXNzYWdlLXNlbGVjdG9ye3BhZGRpbmctYm90dG9tOjEwcHh9LnFxLXVwbG9hZGVyIERJQUxPRzo6LXdlYmtpdC1iYWNrZHJvcHtiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMCwwLDAsLjcpfS5xcS11cGxvYWRlciBESUFMT0c6OmJhY2tkcm9we2JhY2tncm91bmQtY29sb3I6cmdiYSgwLDAsMCwuNyl9YF0sXHJcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxyXG59KVxyXG5leHBvcnQgY2xhc3MgVXBsb2FkQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0IHtcclxuICBASW5wdXQoKSBvcGVuRGlhbG9nO1xyXG5cclxuICBAT3V0cHV0KCkgY2xvc2VEaWFsb2cgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgQE91dHB1dCgpIGNyZWF0ZURpciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgdXBsb2FkZXI6IEZpbmVVcGxvYWRlcjtcclxuICBuZXdGb2xkZXIgPSBmYWxzZTtcclxuICBjb3VudGVyID0gMDtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgbm9kZVNlcnZpY2U6IE5vZGVTZXJ2aWNlKSB7XHJcbiAgfVxyXG5cclxuICBuZ0FmdGVyVmlld0luaXQoKSB7XHJcbiAgICB0aGlzLnVwbG9hZGVyID0gbmV3IEZpbmVVcGxvYWRlcih7XHJcbiAgICAgIGRlYnVnOiBmYWxzZSxcclxuICAgICAgYXV0b1VwbG9hZDogZmFsc2UsXHJcbiAgICAgIG1heENvbm5lY3Rpb25zOiAxLCAvLyB0b2RvIGNvbmZpZ3VyYWJsZVxyXG4gICAgICBlbGVtZW50OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZS11cGxvYWRlcicpLFxyXG4gICAgICB0ZW1wbGF0ZTogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmUtdXBsb2FkZXItdGVtcGxhdGUnKSxcclxuICAgICAgcmVxdWVzdDoge1xyXG4gICAgICAgIGVuZHBvaW50OiB0aGlzLm5vZGVTZXJ2aWNlLnRyZWUuY29uZmlnLmJhc2VVUkwgKyB0aGlzLm5vZGVTZXJ2aWNlLnRyZWUuY29uZmlnLmFwaS51cGxvYWRGaWxlLFxyXG4gICAgICAgIC8vIGZvcmNlTXVsdGlwYXJ0OiBmYWxzZSxcclxuICAgICAgICBwYXJhbXNJbkJvZHk6IGZhbHNlLFxyXG4gICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgcGFyZW50UGF0aDogdGhpcy5nZXRDdXJyZW50UGF0aFxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgcmV0cnk6IHtcclxuICAgICAgICBlbmFibGVBdXRvOiBmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICBjYWxsYmFja3M6IHtcclxuICAgICAgICBvblN1Ym1pdHRlZDogKCkgPT4gdGhpcy5jb3VudGVyKyssXHJcbiAgICAgICAgb25DYW5jZWw6ICgpID0+IHtcclxuICAgICAgICAgIHRoaXMuY291bnRlciA8IDAgPyBjb25zb2xlLndhcm4oJ3d0Zj8nKSA6IHRoaXMuY291bnRlci0tO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb25BbGxDb21wbGV0ZTogKHN1Y2M6IGFueSwgZmFpbDogYW55KSA9PiB7XHJcbiAgICAgICAgICBpZiAoc3VjYy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY291bnRlciA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZVNlcnZpY2UucmVmcmVzaEN1cnJlbnRQYXRoKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gICAgO1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgfVxyXG5cclxuICBnZXQgZ2V0Q3VycmVudFBhdGgoKSB7XHJcbiAgICBjb25zdCBwYXJlbnRQYXRoID0gdGhpcy5ub2RlU2VydmljZS5maW5kTm9kZUJ5UGF0aCh0aGlzLm5vZGVTZXJ2aWNlLmN1cnJlbnRQYXRoKS5pZDtcclxuICAgIHJldHVybiBwYXJlbnRQYXRoID09PSAwID8gJycgOiBwYXJlbnRQYXRoO1xyXG4gIH1cclxuXHJcbiAgdXBsb2FkRmlsZXMoKSB7XHJcbiAgICB0aGlzLnVwbG9hZGVyLnVwbG9hZFN0b3JlZEZpbGVzKCk7XHJcbiAgfVxyXG5cclxuICBjcmVhdGVOZXdGb2xkZXIoaW5wdXQ/OiBzdHJpbmcpIHtcclxuICAgIGlmICghdGhpcy5uZXdGb2xkZXIpIHtcclxuICAgICAgdGhpcy5uZXdGb2xkZXIgPSB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5uZXdGb2xkZXIgPSBmYWxzZTtcclxuICAgICAgaWYgKGlucHV0Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICB0aGlzLmNyZWF0ZURpci5lbWl0KGlucHV0KTtcclxuICAgICAgICB0aGlzLm5ld0NsaWNrZWRBY3Rpb24oKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmV3Q2xpY2tlZEFjdGlvbigpIHtcclxuICAgIHRoaXMudXBsb2FkZXIuY2FuY2VsQWxsKCk7XHJcbiAgICB0aGlzLmNsb3NlRGlhbG9nLmVtaXQoKTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgT25Jbml0LCBPdXRwdXQsIFZpZXdDaGlsZH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7X30gZnJvbSAnQGJpZXNiamVyZy9uZ3gtdHJhbnNsYXRlLWV4dHJhY3QvZGlzdC91dGlscy91dGlscyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1uZXctZm9sZGVyJyxcclxuICB0ZW1wbGF0ZTogYDxwIGNsYXNzPVwibmV3LWZvbGRlci1kZXNjcmlwdGlvblwiIHRyYW5zbGF0ZT5UeXBlIG5ldyBmb2xkZXIgbmFtZTwvcD5cclxuPGlucHV0ICN1cGxvYWRGb2xkZXIgcGxhY2Vob2xkZXI9XCJ7eydGb2xkZXIgbmFtZSd9fVwiIChrZXl1cCk9XCJvbklucHV0Q2hhbmdlKCRldmVudClcIlxyXG4gICAgICAgKGtleXVwLmVudGVyKT1cIm9uQ2xpY2soKVwiIG9uY2xpY2s9XCJ0aGlzLnNlbGVjdCgpO1wiIHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJuZXctZm9sZGVyLWlucHV0XCIvPlxyXG48YnV0dG9uIGNsYXNzPVwiYnV0dG9uIG5ldy1mb2xkZXItc2VuZFwiIChjbGljayk9XCJvbkNsaWNrKClcIj57e2J1dHRvblRleHR9fTwvYnV0dG9uPlxyXG5gLFxyXG4gIHN0eWxlczogW2AubmV3LWZvbGRlci1kZXNjcmlwdGlvbnttYXJnaW46MCBhdXRvO3BhZGRpbmc6MH1gXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmV3Rm9sZGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBAVmlld0NoaWxkKCd1cGxvYWRGb2xkZXInKSB1cGxvYWRGb2xkZXI6IEVsZW1lbnRSZWY7XHJcbiAgQE91dHB1dCgpIGJ1dHRvbkNsaWNrZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIGJ1dHRvblRleHQgPSBfKCdDbG9zZScpLnRvU3RyaW5nKCk7XHJcbiAgaW5wdXRWYWx1ZSA9ICcnO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gIH1cclxuXHJcbiAgb25DbGljaygpIHtcclxuICAgIGNvbnN0IGVsOiBIVE1MRWxlbWVudCA9ICh0aGlzLnVwbG9hZEZvbGRlci5uYXRpdmVFbGVtZW50IGFzIEhUTUxFbGVtZW50KTtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHRoaXMuYnV0dG9uQ2xpY2tlZC5lbWl0KGVsLnZhbHVlKTtcclxuICB9XHJcblxyXG4gIG9uSW5wdXRDaGFuZ2UoZXZlbnQ6IGFueSkge1xyXG4gICAgdGhpcy5pbnB1dFZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgaWYgKHRoaXMuaW5wdXRWYWx1ZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgIHRoaXMuYnV0dG9uVGV4dCA9IF8oJ0NvbmZpcm0nKS50b1N0cmluZygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5idXR0b25UZXh0ID0gXygnQ2xvc2UnKS50b1N0cmluZygpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQsIFRlbXBsYXRlUmVmLCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7Tm9kZUludGVyZmFjZX0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1zaWRlLXZpZXcnLFxyXG4gIHRlbXBsYXRlOiBgPGRpdiBjbGFzcz1cInNpZGUtdmlld1wiICpuZ0lmPVwibm9kZVwiPlxyXG4gIDxkaXYgY2xhc3M9XCJzaWRlLXZpZXctcHJldmlld1wiPlxyXG4gICAgPGkgKGNsaWNrKT1cIm9uQ2xpY2soJGV2ZW50LCAnY2xvc2VTaWRlVmlldycpXCIgY2xhc3M9XCJmYXMgZmEtdGltZXMgc2lkZS12aWV3LWNsb3NlXCI+PC9pPlxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJzaWRlLXZpZXctcHJldmlldy10aXRsZVwiPnt7bm9kZS5uYW1lfX08L2Rpdj5cclxuXHJcbiAgICA8ZGl2IGNsYXNzPVwic2lkZS12aWV3LXByZXZpZXctY29udGVudFwiPlxyXG4gICAgICA8bmctY29udGFpbmVyXHJcbiAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IG5vZGV9XCJcclxuICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJzaWRlVmlld1RlbXBsYXRlXCI+XHJcbiAgICAgIDwvbmctY29udGFpbmVyPlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPGRpdiBjbGFzcz1cInNpZGUtdmlldy1idXR0b25zXCI+XHJcbiAgICAgIDxidXR0b24gKGNsaWNrKT1cIm9uQ2xpY2soJGV2ZW50LCAnZG93bmxvYWQnKVwiIGNsYXNzPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICBbZGlzYWJsZWRdPVwiIWFsbG93Rm9sZGVyRG93bmxvYWQgJiYgbm9kZS5pc0ZvbGRlclwiIHRyYW5zbGF0ZT5cclxuICAgICAgICBEb3dubG9hZFxyXG4gICAgICA8L2J1dHRvbj5cclxuICAgICAgPGJ1dHRvbiAoY2xpY2spPVwib25DbGljaygkZXZlbnQsICdyZW5hbWVDb25maXJtJylcIiBjbGFzcz1cImJ1dHRvblwiIHRyYW5zbGF0ZT5SZW5hbWU8L2J1dHRvbj5cclxuICAgICAgPGJ1dHRvbiAoY2xpY2spPVwib25DbGljaygkZXZlbnQsICdyZW1vdmVBc2snKVwiIGNsYXNzPVwiYnV0dG9uXCIgdHJhbnNsYXRlPkRlbGV0ZTwvYnV0dG9uPlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbjwvZGl2PlxyXG5gLFxyXG4gIHN0eWxlczogW2Auc2lkZS12aWV3LWNsb3Nle3Bvc2l0aW9uOmFic29sdXRlO2N1cnNvcjpwb2ludGVyO3RvcDowO3JpZ2h0OjA7cGFkZGluZzoxNXB4fS5zaWRlLXZpZXctYnV0dG9uc3t3aWR0aDoxMDAlO2Rpc3BsYXk6LXdlYmtpdC1mbGV4O2Rpc3BsYXk6ZmxleDstd2Via2l0LWp1c3RpZnktY29udGVudDpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjstd2Via2l0LWZsZXgtZmxvdzpjb2x1bW47ZmxleC1mbG93OmNvbHVtbn0uc2lkZS12aWV3LWJ1dHRvbnMgLmJ1dHRvbnttYXJnaW46NXB4IDB9YF0sXHJcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxyXG59KVxyXG5leHBvcnQgY2xhc3MgU2lkZVZpZXdDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIEBJbnB1dCgpIHNpZGVWaWV3VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gIEBJbnB1dCgpIG5vZGU6IE5vZGVJbnRlcmZhY2U7XHJcbiAgQElucHV0KCkgYWxsb3dGb2xkZXJEb3dubG9hZCA9IGZhbHNlO1xyXG5cclxuICBAT3V0cHV0KCkgY2xpY2tFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICB9XHJcblxyXG4gIG9uQ2xpY2soZXZlbnQ6IGFueSwgdHlwZTogc3RyaW5nKSB7XHJcbiAgICB0aGlzLmNsaWNrRXZlbnQuZW1pdCh7dHlwZTogdHlwZSwgZXZlbnQ6IGV2ZW50LCBub2RlOiB0aGlzLm5vZGV9KTtcclxuICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50LCBPbkluaXQsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtOb2RlQ2xpY2tlZFNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL25vZGUtY2xpY2tlZC5zZXJ2aWNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLW5hdmlnYXRpb24nLFxyXG4gIHRlbXBsYXRlOiBgPGRpdiBjbGFzcz1cIm5hdmlnYXRpb24tY29tcG9uZW50XCI+XHJcbiAgPGlucHV0ICNpbnB1dCBjbGFzcz1cIm5hdmlnYXRpb24tc2VhcmNoXCIgb25jbGljaz1cInRoaXMuc2VsZWN0KCk7XCIgKGtleXVwLmVudGVyKT1cIm9uQ2xpY2soaW5wdXQudmFsdWUpXCJcclxuICAgICAgICAgcGxhY2Vob2xkZXI9XCJ7eydTZWFyY2gnfX1cIj5cclxuXHJcbiAgPGJ1dHRvbiBbZGlzYWJsZWRdPVwiaW5wdXQudmFsdWUubGVuZ3RoID09PSAwXCIgY2xhc3M9XCJuYXZpZ2F0aW9uLXNlYXJjaC1pY29uXCIgKGNsaWNrKT1cIm9uQ2xpY2soaW5wdXQudmFsdWUpXCI+XHJcbiAgICA8aSBjbGFzcz1cImZhcyBmYS1zZWFyY2hcIj48L2k+XHJcbiAgPC9idXR0b24+XHJcblxyXG4gIDxkaXY+XHJcbiAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XHJcbiAgPC9kaXY+XHJcbjwvZGl2PlxyXG5cclxuXHJcbmAsXHJcbiAgc3R5bGVzOiBbYC5uYXZpZ2F0aW9uLWNvbXBvbmVudHtkaXNwbGF5Oi13ZWJraXQtZmxleDtkaXNwbGF5OmZsZXh9YF0sXHJcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmF2aWdhdGlvbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBub2RlQ2xpY2tlZFNlcnZpY2U6IE5vZGVDbGlja2VkU2VydmljZVxyXG4gICkge1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgfVxyXG5cclxuICBvbkNsaWNrKGlucHV0OiBzdHJpbmcpIHtcclxuICAgIHRoaXMubm9kZUNsaWNrZWRTZXJ2aWNlLnNlYXJjaEZvclN0cmluZyhpbnB1dCk7XHJcbiAgfVxyXG59XHJcbiIsIi8vIGltcG9ydCB7TW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge05nTW9kdWxlLCBJbmplY3Rpb25Ub2tlbiwgTW9kdWxlV2l0aFByb3ZpZGVyc30gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQge0ZpbGVNYW5hZ2VyQ29tcG9uZW50fSBmcm9tICcuL2ZpbGUtbWFuYWdlci5jb21wb25lbnQnO1xyXG5pbXBvcnQge0ZvbGRlckNvbnRlbnRDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9mb2xkZXItY29udGVudC9mb2xkZXItY29udGVudC5jb21wb25lbnQnO1xyXG5pbXBvcnQge1RyZWVDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy90cmVlL3RyZWUuY29tcG9uZW50JztcclxuaW1wb3J0IHtOb2RlTGlzdGVyQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvdHJlZS9ub2RlLWxpc3Rlci9ub2RlLWxpc3Rlci5jb21wb25lbnQnO1xyXG5pbXBvcnQge05vZGVDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9mdW5jdGlvbnMvbm9kZS9ub2RlLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7TWFwVG9JdGVyYWJsZVBpcGV9IGZyb20gJy4vcGlwZXMvbWFwLXRvLWl0ZXJhYmxlLnBpcGUnO1xyXG5pbXBvcnQge0h0dHBDbGllbnQsIEh0dHBDbGllbnRNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHtTdG9yZU1vZHVsZSwgQWN0aW9uUmVkdWNlck1hcH0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5pbXBvcnQge05hdkJhckNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL25hdi1iYXIvbmF2LWJhci5jb21wb25lbnQnO1xyXG5pbXBvcnQge3JlZHVjZXJzLCBBcHBTdG9yZX0gZnJvbSAnLi9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnknO1xyXG5pbXBvcnQge0xvYWRpbmdPdmVybGF5Q29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvZnVuY3Rpb25zL2xvYWRpbmctb3ZlcmxheS9sb2FkaW5nLW92ZXJsYXkuY29tcG9uZW50JztcclxuaW1wb3J0IHtGaWxlU2l6ZVBpcGV9IGZyb20gJy4vcGlwZXMvZmlsZS1zaXplLnBpcGUnO1xyXG5pbXBvcnQge1VwbG9hZENvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL2Z1bmN0aW9ucy91cGxvYWQvdXBsb2FkLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7TmV3Rm9sZGVyQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvZnVuY3Rpb25zL3VwbG9hZC9uZXctZm9sZGVyL25ldy1mb2xkZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHtTaWRlVmlld0NvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL3NpZGUtdmlldy9zaWRlLXZpZXcuY29tcG9uZW50JztcclxuaW1wb3J0IHtOYXZpZ2F0aW9uQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvbmF2aWdhdGlvbi9uYXZpZ2F0aW9uLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7Tmd4U21hcnRNb2RhbE1vZHVsZX0gZnJvbSAnbmd4LXNtYXJ0LW1vZGFsJztcclxuXHJcbmNvbnN0IEZFQVRVUkVfUkVEVUNFUl9UT0tFTiA9IG5ldyBJbmplY3Rpb25Ub2tlbjxcclxuICBBY3Rpb25SZWR1Y2VyTWFwPEFwcFN0b3JlPlxyXG4+KCdBcHBTdG9yZSBSZWR1Y2VycycpO1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmVkdWNlcnMoKTogQWN0aW9uUmVkdWNlck1hcDxBcHBTdG9yZT4ge1xyXG4gIC8vIG1hcCBvZiByZWR1Y2Vyc1xyXG4gIHJldHVybiByZWR1Y2VycztcclxufVxyXG5cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbXHJcbiAgICBIdHRwQ2xpZW50TW9kdWxlLFxyXG4gICAgU3RvcmVNb2R1bGUuZm9yUm9vdChGRUFUVVJFX1JFRFVDRVJfVE9LRU4pLFxyXG4gICAgQ29tbW9uTW9kdWxlLFxyXG4gICAgTmd4U21hcnRNb2RhbE1vZHVsZS5mb3JSb290KCksXHJcbiAgXSxcclxuICBkZWNsYXJhdGlvbnM6IFtcclxuICAgIEZpbGVNYW5hZ2VyQ29tcG9uZW50LFxyXG4gICAgRm9sZGVyQ29udGVudENvbXBvbmVudCxcclxuICAgIE5vZGVDb21wb25lbnQsXHJcbiAgICBUcmVlQ29tcG9uZW50LFxyXG4gICAgTm9kZUxpc3RlckNvbXBvbmVudCxcclxuICAgIE1hcFRvSXRlcmFibGVQaXBlLFxyXG4gICAgTmF2QmFyQ29tcG9uZW50LFxyXG4gICAgTG9hZGluZ092ZXJsYXlDb21wb25lbnQsXHJcbiAgICBGaWxlU2l6ZVBpcGUsXHJcbiAgICBVcGxvYWRDb21wb25lbnQsXHJcbiAgICBOZXdGb2xkZXJDb21wb25lbnQsXHJcbiAgICBTaWRlVmlld0NvbXBvbmVudCxcclxuICAgIE5hdmlnYXRpb25Db21wb25lbnRcclxuICBdLFxyXG4gIGV4cG9ydHM6IFtcclxuICAgIEZpbGVNYW5hZ2VyQ29tcG9uZW50LFxyXG4gICAgTG9hZGluZ092ZXJsYXlDb21wb25lbnQsXHJcbiAgICBTaWRlVmlld0NvbXBvbmVudFxyXG4gIF0sXHJcbiAgcHJvdmlkZXJzOiBbXHJcbiAgICB7XHJcbiAgICAgIHByb3ZpZGU6IEZFQVRVUkVfUkVEVUNFUl9UT0tFTixcclxuICAgICAgdXNlRmFjdG9yeTogZ2V0UmVkdWNlcnMsXHJcbiAgICB9LFxyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIEZpbGVNYW5hZ2VyTW9kdWxlIHtcclxuICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIG5nTW9kdWxlOiBGaWxlTWFuYWdlck1vZHVsZSxcclxuICAgICAgcHJvdmlkZXJzOiBbXVxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbIkFDVElPTlMuU0VUX1BBVEgiLCJBQ1RJT05TLlNFVF9MT0FESU5HX1NUQVRFIiwiQUNUSU9OUy5TRVRfU0VMRUNURURfTk9ERSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFHQTs7OztJQU1FLFlBQVksTUFBdUI7O1FBRWpDLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBRXJCLElBQUksQ0FBQyxLQUFLLHNCQUFrQjtZQUMxQixFQUFFLEVBQUUsQ0FBQztZQUNMLFVBQVUsRUFBRSxFQUFFO1lBQ2QsWUFBWSxFQUFFLElBQUk7WUFDbEIsUUFBUSxFQUFFLElBQUk7WUFDZCxVQUFVLEVBQUUsSUFBSTtZQUNoQixRQUFRLEVBQUUsSUFBSTtZQUNkLElBQUksRUFBRSxNQUFNO1lBQ1osUUFBUSxFQUFFLEVBQUU7U0FDYixFQUFBLENBQUM7S0FDSDs7OztJQUVELElBQUksV0FBVztRQUNiLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztLQUMxQjs7Ozs7SUFFRCxJQUFJLFdBQVcsQ0FBQyxLQUFhO1FBQzNCLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO0tBQzNCOzs7O0lBRUQsSUFBSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0tBQ3BCOzs7OztJQUVELElBQUksS0FBSyxDQUFDLEtBQW9CO1FBQzVCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0tBQ3JCOzs7O0lBRUQsSUFBSSxjQUFjO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQztLQUM3Qjs7Ozs7SUFFRCxJQUFJLGNBQWMsQ0FBQyxLQUFhO1FBQzlCLElBQUksQ0FB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