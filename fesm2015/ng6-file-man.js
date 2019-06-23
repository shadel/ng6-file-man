import { Injectable, Pipe, Component, EventEmitter, Input, Output, TemplateRef, ViewEncapsulation, ContentChild, ViewChild, NgModule, InjectionToken, defineInjectable, inject } from '@angular/core';
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
                template: `<div class="item-holder">
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmc2LWZpbGUtbWFuLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL21vZGVscy90cmVlLm1vZGVsLnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL3JlZHVjZXJzL2FjdGlvbnMuYWN0aW9uLnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL3NlcnZpY2VzL25vZGUuc2VydmljZS50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9zZXJ2aWNlcy9ub2RlLWNsaWNrZWQuc2VydmljZS50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9maWxlLW1hbmFnZXIuY29tcG9uZW50LnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL2NvbXBvbmVudHMvZm9sZGVyLWNvbnRlbnQvZm9sZGVyLWNvbnRlbnQuY29tcG9uZW50LnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL2NvbXBvbmVudHMvdHJlZS90cmVlLmNvbXBvbmVudC50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9jb21wb25lbnRzL3RyZWUvbm9kZS1saXN0ZXIvbm9kZS1saXN0ZXIuY29tcG9uZW50LnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL2NvbXBvbmVudHMvZnVuY3Rpb25zL25vZGUvbm9kZS5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvcGlwZXMvbWFwLXRvLWl0ZXJhYmxlLnBpcGUudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy9uYXYtYmFyL25hdi1iYXIuY29tcG9uZW50LnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL3JlZHVjZXJzL3N0YXRlUmVkdWNlci50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnkudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy9mdW5jdGlvbnMvbG9hZGluZy1vdmVybGF5L2xvYWRpbmctb3ZlcmxheS5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvcGlwZXMvZmlsZS1zaXplLnBpcGUudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy9mdW5jdGlvbnMvdXBsb2FkL3VwbG9hZC5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy9mdW5jdGlvbnMvdXBsb2FkL25ldy1mb2xkZXIvbmV3LWZvbGRlci5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy9zaWRlLXZpZXcvc2lkZS12aWV3LmNvbXBvbmVudC50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9jb21wb25lbnRzL25hdmlnYXRpb24vbmF2aWdhdGlvbi5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvZmlsZS1tYW5hZ2VyLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge05vZGVJbnRlcmZhY2V9IGZyb20gJy4uL2ludGVyZmFjZXMvbm9kZS5pbnRlcmZhY2UnO1xyXG5pbXBvcnQge0NvbmZpZ0ludGVyZmFjZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9jb25maWcuaW50ZXJmYWNlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBUcmVlTW9kZWwge1xyXG4gIHByaXZhdGUgX2N1cnJlbnRQYXRoOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBfbm9kZXM6IE5vZGVJbnRlcmZhY2U7XHJcbiAgcHJpdmF0ZSBfc2VsZWN0ZWROb2RlSWQ6IHN0cmluZztcclxuICBwdWJsaWMgY29uZmlnOiBDb25maWdJbnRlcmZhY2U7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQ29uZmlnSW50ZXJmYWNlKSB7XHJcbiAgICAvLyB0aGlzLl9jdXJyZW50UGF0aCA9IGNvbmZpZy5zdGFydGluZ0ZvbGRlcjsgLy8gdG9kbyBpbXBsZW1lbnQgKGNvbmZpZy5pbnRlcmZjZS50cylcclxuICAgIHRoaXMuX2N1cnJlbnRQYXRoID0gJyc7XHJcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcclxuXHJcbiAgICB0aGlzLm5vZGVzID0gPE5vZGVJbnRlcmZhY2U+e1xyXG4gICAgICBpZDogMCxcclxuICAgICAgcGF0aFRvTm9kZTogJycsXHJcbiAgICAgIHBhdGhUb1BhcmVudDogbnVsbCxcclxuICAgICAgaXNGb2xkZXI6IHRydWUsXHJcbiAgICAgIGlzRXhwYW5kZWQ6IHRydWUsXHJcbiAgICAgIHN0YXlPcGVuOiB0cnVlLFxyXG4gICAgICBuYW1lOiAncm9vdCcsXHJcbiAgICAgIGNoaWxkcmVuOiB7fVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGdldCBjdXJyZW50UGF0aCgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRQYXRoO1xyXG4gIH1cclxuXHJcbiAgc2V0IGN1cnJlbnRQYXRoKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuX2N1cnJlbnRQYXRoID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBnZXQgbm9kZXMoKTogTm9kZUludGVyZmFjZSB7XHJcbiAgICByZXR1cm4gdGhpcy5fbm9kZXM7XHJcbiAgfVxyXG5cclxuICBzZXQgbm9kZXModmFsdWU6IE5vZGVJbnRlcmZhY2UpIHtcclxuICAgIHRoaXMuX25vZGVzID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBnZXQgc2VsZWN0ZWROb2RlSWQoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZE5vZGVJZDtcclxuICB9XHJcblxyXG4gIHNldCBzZWxlY3RlZE5vZGVJZCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICB0aGlzLl9zZWxlY3RlZE5vZGVJZCA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgLy8gdG9kbyBpbXBsZW1lbnQgKGNvbmZpZy5pbnRlcmZjZS50cylcclxuICAvLyBnZXQgaXNDYWNoZSgpOiBib29sZWFuIHtcclxuICAvLyAgIHJldHVybiB0aGlzLmNvbmZpZy5vZmZsaW5lTW9kZTtcclxuICAvLyB9XHJcbiAgLy9cclxuICAvLyBzZXQgaXNDYWNoZSh2YWx1ZTogYm9vbGVhbikge1xyXG4gIC8vICAgdGhpcy5jb25maWcub2ZmbGluZU1vZGUgPSB2YWx1ZTtcclxuICAvLyB9XHJcbn1cclxuIiwiaW1wb3J0IHtBY3Rpb25JbnRlcmZhY2V9IGZyb20gJy4uL2ludGVyZmFjZXMvYWN0aW9uLmludGVyZmFjZSc7XHJcbmltcG9ydCB7Tm9kZUludGVyZmFjZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XHJcblxyXG5leHBvcnQgY29uc3QgU0VUX1BBVEggPSAnU0VUX1BBVEgnO1xyXG5leHBvcnQgY29uc3QgU0VUX0xPQURJTkdfU1RBVEUgPSAnU0VUX0xPQURJTkdfU1RBVEUnO1xyXG5leHBvcnQgY29uc3QgU0VUX1NFTEVDVEVEX05PREUgPSAnU0VUX1NFTEVDVEVEX05PREUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNldFBhdGggaW1wbGVtZW50cyBBY3Rpb25JbnRlcmZhY2Uge1xyXG4gIHJlYWRvbmx5IHR5cGUgPSBTRVRfUEFUSDtcclxuICBwYXlsb2FkOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTZXRMb2FkaW5nU3RhdGUgaW1wbGVtZW50cyBBY3Rpb25JbnRlcmZhY2Uge1xyXG4gIHJlYWRvbmx5IHR5cGUgPSBTRVRfTE9BRElOR19TVEFURTtcclxuICBwYXlsb2FkOiBib29sZWFuO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2V0U2VsZWN0ZWROb2RlIGltcGxlbWVudHMgQWN0aW9uSW50ZXJmYWNlIHtcclxuICByZWFkb25seSB0eXBlID0gU0VUX1NFTEVDVEVEX05PREU7XHJcbiAgcGF5bG9hZDogTm9kZUludGVyZmFjZTtcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgQWN0aW9ucyA9IFNldFBhdGggfCBTZXRMb2FkaW5nU3RhdGUgfCBTZXRTZWxlY3RlZE5vZGU7XHJcbiIsImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7Tm9kZUludGVyZmFjZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XHJcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7VHJlZU1vZGVsfSBmcm9tICcuLi9tb2RlbHMvdHJlZS5tb2RlbCc7XHJcbmltcG9ydCB7SHR0cENsaWVudCwgSHR0cFBhcmFtc30gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgKiBhcyBBQ1RJT05TIGZyb20gJy4uL3JlZHVjZXJzL2FjdGlvbnMuYWN0aW9uJztcclxuaW1wb3J0IHtTdG9yZX0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5pbXBvcnQge0FwcFN0b3JlfSBmcm9tICcuLi9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnknO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgTm9kZVNlcnZpY2Uge1xyXG4gIHB1YmxpYyB0cmVlOiBUcmVlTW9kZWw7XHJcbiAgcHJpdmF0ZSBfcGF0aDogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsIHByaXZhdGUgc3RvcmU6IFN0b3JlPEFwcFN0b3JlPikge1xyXG4gIH1cclxuXHJcbiAgLy8gdG9kbyBhc2sgc2VydmVyIHRvIGdldCBwYXJlbnQgc3RydWN0dXJlXHJcbiAgcHVibGljIHN0YXJ0TWFuYWdlckF0KHBhdGg6IHN0cmluZykge1xyXG4gICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogQUNUSU9OUy5TRVRfUEFUSCwgcGF5bG9hZDogcGF0aH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlZnJlc2hDdXJyZW50UGF0aCgpIHtcclxuICAgIHRoaXMuZmluZE5vZGVCeVBhdGgodGhpcy5jdXJyZW50UGF0aCkuY2hpbGRyZW4gPSB7fTtcclxuICAgIHRoaXMuZ2V0Tm9kZXModGhpcy5jdXJyZW50UGF0aCk7XHJcbiAgfVxyXG5cclxuICBnZXROb2RlcyhwYXRoOiBzdHJpbmcpIHtcclxuICAgIHRoaXMucGFyc2VOb2RlcyhwYXRoKS5zdWJzY3JpYmUoKGRhdGE6IEFycmF5PE5vZGVJbnRlcmZhY2U+KSA9PiB7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IHBhcmVudFBhdGggPSB0aGlzLmdldFBhcmVudFBhdGgoZGF0YVtpXS5wYXRoVG9Ob2RlKTtcclxuICAgICAgICB0aGlzLmZpbmROb2RlQnlQYXRoKHBhcmVudFBhdGgpLmNoaWxkcmVuW2RhdGFbaV0ubmFtZV0gPSBkYXRhW2ldO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0UGFyZW50UGF0aChwYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgbGV0IHBhcmVudFBhdGggPSBwYXRoLnNwbGl0KCcvJyk7XHJcbiAgICBwYXJlbnRQYXRoID0gcGFyZW50UGF0aC5zbGljZSgwLCBwYXJlbnRQYXRoLmxlbmd0aCAtIDEpO1xyXG4gICAgcmV0dXJuIHBhcmVudFBhdGguam9pbignLycpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwYXJzZU5vZGVzKHBhdGg6IHN0cmluZyk6IE9ic2VydmFibGU8Tm9kZUludGVyZmFjZVtdPiB7XHJcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUob2JzZXJ2ZXIgPT4ge1xyXG4gICAgICB0aGlzLmdldE5vZGVzRnJvbVNlcnZlcihwYXRoKS5zdWJzY3JpYmUoKGRhdGE6IEFycmF5PGFueT4pID0+IHtcclxuICAgICAgICBvYnNlcnZlci5uZXh0KGRhdGEubWFwKG5vZGUgPT4gdGhpcy5jcmVhdGVOb2RlKHBhdGgsIG5vZGUpKSk7XHJcbiAgICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogQUNUSU9OUy5TRVRfTE9BRElOR19TVEFURSwgcGF5bG9hZDogZmFsc2V9KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY3JlYXRlTm9kZShwYXRoLCBub2RlKTogTm9kZUludGVyZmFjZSB7XHJcbiAgICBpZiAobm9kZS5wYXRoWzBdICE9PSAnLycpIHtcclxuICAgICAgY29uc29sZS53YXJuKCdbTm9kZSBTZXJ2aWNlXSBTZXJ2ZXIgc2hvdWxkIHJldHVybiBpbml0aWFsIHBhdGggd2l0aCBcIi9cIicpO1xyXG4gICAgICBub2RlLnBhdGggPSAnLycgKyBub2RlLnBhdGg7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgaWRzID0gbm9kZS5wYXRoLnNwbGl0KCcvJyk7XHJcbiAgICBpZiAoaWRzLmxlbmd0aCA+IDIgJiYgaWRzW2lkcy5sZW5ndGggLSAxXSA9PT0gJycpIHtcclxuICAgICAgaWRzLnNwbGljZSgtMSwgMSk7XHJcbiAgICAgIG5vZGUucGF0aCA9IGlkcy5qb2luKCcvJyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY2FjaGVkTm9kZSA9IHRoaXMuZmluZE5vZGVCeVBhdGgobm9kZS5wYXRoKTtcclxuXHJcbiAgICByZXR1cm4gPE5vZGVJbnRlcmZhY2U+e1xyXG4gICAgICBpZDogbm9kZS5pZCxcclxuICAgICAgaXNGb2xkZXI6IG5vZGUuZGlyLFxyXG4gICAgICBpc0V4cGFuZGVkOiBjYWNoZWROb2RlID8gY2FjaGVkTm9kZS5pc0V4cGFuZGVkIDogZmFsc2UsXHJcbiAgICAgIHBhdGhUb05vZGU6IG5vZGUucGF0aCxcclxuICAgICAgcGF0aFRvUGFyZW50OiB0aGlzLmdldFBhcmVudFBhdGgobm9kZS5wYXRoKSxcclxuICAgICAgbmFtZTogbm9kZS5uYW1lIHx8IG5vZGUuaWQsXHJcbiAgICAgIGNoaWxkcmVuOiBjYWNoZWROb2RlID8gY2FjaGVkTm9kZS5jaGlsZHJlbiA6IHt9XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXROb2Rlc0Zyb21TZXJ2ZXIgPSAocGF0aDogc3RyaW5nKSA9PiB7XHJcbiAgICBsZXQgZm9sZGVySWQ6IGFueSA9IHRoaXMuZmluZE5vZGVCeVBhdGgocGF0aCkuaWQ7XHJcbiAgICBmb2xkZXJJZCA9IGZvbGRlcklkID09PSAwID8gJycgOiBmb2xkZXJJZDtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldChcclxuICAgICAgdGhpcy50cmVlLmNvbmZpZy5iYXNlVVJMICsgdGhpcy50cmVlLmNvbmZpZy5hcGkubGlzdEZpbGUsXHJcbiAgICAgIHtwYXJhbXM6IG5ldyBIdHRwUGFyYW1zKCkuc2V0KCdwYXJlbnRQYXRoJywgZm9sZGVySWQpfVxyXG4gICAgKTtcclxuICB9O1xyXG5cclxuICBwdWJsaWMgZmluZE5vZGVCeVBhdGgobm9kZVBhdGg6IHN0cmluZyk6IE5vZGVJbnRlcmZhY2Uge1xyXG4gICAgY29uc3QgaWRzID0gbm9kZVBhdGguc3BsaXQoJy8nKTtcclxuICAgIGlkcy5zcGxpY2UoMCwgMSk7XHJcblxyXG4gICAgcmV0dXJuIGlkcy5sZW5ndGggPT09IDAgPyB0aGlzLnRyZWUubm9kZXMgOiBpZHMucmVkdWNlKCh2YWx1ZSwgaW5kZXgpID0+IHZhbHVlWydjaGlsZHJlbiddW2luZGV4XSwgdGhpcy50cmVlLm5vZGVzKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBmaW5kTm9kZUJ5SWQoaWQ6IG51bWJlcik6IE5vZGVJbnRlcmZhY2Uge1xyXG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5maW5kTm9kZUJ5SWRIZWxwZXIoaWQpO1xyXG5cclxuICAgIGlmIChyZXN1bHQgPT09IG51bGwpIHtcclxuICAgICAgY29uc29sZS53YXJuKCdbTm9kZSBTZXJ2aWNlXSBDYW5ub3QgZmluZCBub2RlIGJ5IGlkLiBJZCBub3QgZXhpc3Rpbmcgb3Igbm90IGZldGNoZWQuIFJldHVybmluZyByb290LicpO1xyXG4gICAgICByZXR1cm4gdGhpcy50cmVlLm5vZGVzO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZmluZE5vZGVCeUlkSGVscGVyKGlkOiBudW1iZXIsIG5vZGU6IE5vZGVJbnRlcmZhY2UgPSB0aGlzLnRyZWUubm9kZXMpOiBOb2RlSW50ZXJmYWNlIHtcclxuICAgIGlmIChub2RlLmlkID09PSBpZClcclxuICAgICAgcmV0dXJuIG5vZGU7XHJcblxyXG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG5vZGUuY2hpbGRyZW4pO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAodHlwZW9mIG5vZGUuY2hpbGRyZW5ba2V5c1tpXV0gPT0gJ29iamVjdCcpIHtcclxuICAgICAgICBjb25zdCBvYmogPSB0aGlzLmZpbmROb2RlQnlJZEhlbHBlcihpZCwgbm9kZS5jaGlsZHJlbltrZXlzW2ldXSk7XHJcbiAgICAgICAgaWYgKG9iaiAhPSBudWxsKVxyXG4gICAgICAgICAgcmV0dXJuIG9iajtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGZvbGRSZWN1cnNpdmVseShub2RlOiBOb2RlSW50ZXJmYWNlKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnZm9sZGluZyAnLCBub2RlKTtcclxuICAgIGNvbnN0IGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcclxuXHJcbiAgICBPYmplY3Qua2V5cyhjaGlsZHJlbikubWFwKChjaGlsZDogc3RyaW5nKSA9PiB7XHJcbiAgICAgIGlmICghY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoY2hpbGQpIHx8ICFjaGlsZHJlbltjaGlsZF0uaXNFeHBhbmRlZCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmZvbGRSZWN1cnNpdmVseShjaGlsZHJlbltjaGlsZF0pO1xyXG4gICAgICAvL3RvZG8gcHV0IHRoaXMgZ2V0RWxCeUlkIGludG8gb25lIGZ1bmMgKGN1cnIgaW5zaWRlIG5vZGUuY29tcG9uZW50LnRzICsgZm0uY29tcG9uZW50LnRzKSAtIHRoaXMgd29uJ3QgYmUgbWFpbnRhaW5hYmxlXHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cmVlXycgKyBjaGlsZHJlbltjaGlsZF0ucGF0aFRvTm9kZSkuY2xhc3NMaXN0LmFkZCgnZGVzZWxlY3RlZCcpO1xyXG4gICAgICBjaGlsZHJlbltjaGlsZF0uaXNFeHBhbmRlZCA9IGZhbHNlO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZm9sZEFsbCgpIHtcclxuICAgIHRoaXMuZm9sZFJlY3Vyc2l2ZWx5KHRoaXMudHJlZS5ub2Rlcyk7XHJcbiAgfVxyXG5cclxuICBnZXQgY3VycmVudFBhdGgoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9wYXRoO1xyXG4gIH1cclxuXHJcbiAgc2V0IGN1cnJlbnRQYXRoKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuX3BhdGggPSB2YWx1ZTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtOb2RlSW50ZXJmYWNlfSBmcm9tICcuLi9pbnRlcmZhY2VzL25vZGUuaW50ZXJmYWNlJztcclxuaW1wb3J0IHtOb2RlU2VydmljZX0gZnJvbSAnLi9ub2RlLnNlcnZpY2UnO1xyXG5pbXBvcnQge1RyZWVNb2RlbH0gZnJvbSAnLi4vbW9kZWxzL3RyZWUubW9kZWwnO1xyXG5pbXBvcnQge0h0dHBDbGllbnR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtOZ3hTbWFydE1vZGFsU2VydmljZX0gZnJvbSAnbmd4LXNtYXJ0LW1vZGFsJztcclxuaW1wb3J0IHtBcHBTdG9yZX0gZnJvbSAnLi4vcmVkdWNlcnMvcmVkdWNlci5mYWN0b3J5JztcclxuaW1wb3J0IHtTdG9yZX0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgTm9kZUNsaWNrZWRTZXJ2aWNlIHtcclxuICBwdWJsaWMgdHJlZTogVHJlZU1vZGVsO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHB1YmxpYyBuZ3hTbWFydE1vZGFsU2VydmljZTogTmd4U21hcnRNb2RhbFNlcnZpY2UsXHJcbiAgICBwcml2YXRlIG5vZGVTZXJ2aWNlOiBOb2RlU2VydmljZSxcclxuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlPEFwcFN0b3JlPixcclxuICAgIHByaXZhdGUgaHR0cDogSHR0cENsaWVudFxyXG4gICkge1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXJ0RG93bmxvYWQobm9kZTogTm9kZUludGVyZmFjZSk6IHZvaWQge1xyXG4gICAgY29uc3QgcGFyYW1ldGVycyA9IHRoaXMucGFyc2VQYXJhbXMoe3BhdGg6IG5vZGUuaWR9KTtcclxuICAgIHRoaXMucmVhY2hTZXJ2ZXIoJ2Rvd25sb2FkJywgdGhpcy50cmVlLmNvbmZpZy5hcGkuZG93bmxvYWRGaWxlICsgcGFyYW1ldGVycyk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgaW5pdERlbGV0ZShub2RlOiBOb2RlSW50ZXJmYWNlKTogdm9pZCB7XHJcbiAgICB0aGlzLnNpZGVFZmZlY3RIZWxwZXIoXHJcbiAgICAgICdEZWxldGUnLFxyXG4gICAgICB7cGF0aDogbm9kZS5pZH0sXHJcbiAgICAgICdkZWxldGUnLFxyXG4gICAgICB0aGlzLnRyZWUuY29uZmlnLmFwaS5kZWxldGVGaWxlLFxyXG4gICAgICAoKSA9PiB0aGlzLnN1Y2Nlc3NXaXRoTW9kYWxDbG9zZSgpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHNlYXJjaEZvclN0cmluZyhpbnB1dDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICB0aGlzLnNpZGVFZmZlY3RIZWxwZXIoXHJcbiAgICAgICdTZWFyY2gnLFxyXG4gICAgICB7cXVlcnk6IGlucHV0fSxcclxuICAgICAgJ2dldCcsXHJcbiAgICAgIHRoaXMudHJlZS5jb25maWcuYXBpLnNlYXJjaEZpbGVzLFxyXG4gICAgICAocmVzKSA9PiB0aGlzLnNlYXJjaFN1Y2Nlc3MoaW5wdXQsIHJlcylcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY3JlYXRlRm9sZGVyKGN1cnJlbnRQYXJlbnQ6IG51bWJlciwgbmV3RGlyTmFtZTogc3RyaW5nKSB7XHJcbiAgICB0aGlzLnNpZGVFZmZlY3RIZWxwZXIoXHJcbiAgICAgICdDcmVhdGUgRm9sZGVyJyxcclxuICAgICAge2Rpck5hbWU6IG5ld0Rpck5hbWUsIHBhcmVudFBhdGg6IGN1cnJlbnRQYXJlbnQgPT09IDAgPyBudWxsIDogY3VycmVudFBhcmVudH0sXHJcbiAgICAgICdwb3N0JyxcclxuICAgICAgdGhpcy50cmVlLmNvbmZpZy5hcGkuY3JlYXRlRm9sZGVyXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlbmFtZShpZDogbnVtYmVyLCBuZXdOYW1lOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuc2lkZUVmZmVjdEhlbHBlcihcclxuICAgICAgJ1JlbmFtZScsXHJcbiAgICAgIHtwYXRoOiBpZCwgbmV3TmFtZTogbmV3TmFtZX0sXHJcbiAgICAgICdwb3N0JyxcclxuICAgICAgdGhpcy50cmVlLmNvbmZpZy5hcGkucmVuYW1lRmlsZSxcclxuICAgICAgKCkgPT4gdGhpcy5zdWNjZXNzV2l0aE1vZGFsQ2xvc2UoKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2lkZUVmZmVjdEhlbHBlcihuYW1lOiBzdHJpbmcsIHBhcmFtZXRlcnM6IHt9LCBodHRwTWV0aG9kOiBzdHJpbmcsIGFwaVVSTDogc3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzTWV0aG9kID0gKGEpID0+IHRoaXMuYWN0aW9uU3VjY2VzcyhhKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFpbE1ldGhvZCA9IChhLCBiKSA9PiB0aGlzLmFjdGlvbkZhaWxlZChhLCBiKVxyXG4gICkge1xyXG4gICAgY29uc3QgcGFyYW1zID0gdGhpcy5wYXJzZVBhcmFtcyhwYXJhbWV0ZXJzKTtcclxuXHJcbiAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCd3YWl0TW9kYWwnKS5vcGVuKCk7XHJcblxyXG4gICAgdGhpcy5yZWFjaFNlcnZlcihodHRwTWV0aG9kLCBhcGlVUkwgKyBwYXJhbXMpXHJcbiAgICAgIC5zdWJzY3JpYmUoXHJcbiAgICAgICAgKGEpID0+IHN1Y2Nlc3NNZXRob2QoYSksXHJcbiAgICAgICAgKGVycikgPT4gZmFpbE1ldGhvZChuYW1lLCBlcnIpXHJcbiAgICAgICk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlYWNoU2VydmVyKG1ldGhvZDogc3RyaW5nLCBhcGlVcmw6IHN0cmluZywgZGF0YTogYW55ID0ge30pOiBPYnNlcnZhYmxlPE9iamVjdD4ge1xyXG4gICAgc3dpdGNoIChtZXRob2QudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICBjYXNlICdnZXQnOlxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KHRoaXMudHJlZS5jb25maWcuYmFzZVVSTCArIGFwaVVybCk7XHJcbiAgICAgIGNhc2UgJ3Bvc3QnOlxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCh0aGlzLnRyZWUuY29uZmlnLmJhc2VVUkwgKyBhcGlVcmwsIGRhdGEpO1xyXG4gICAgICBjYXNlICdkZWxldGUnOlxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKHRoaXMudHJlZS5jb25maWcuYmFzZVVSTCArIGFwaVVybCk7XHJcbiAgICAgIGNhc2UgJ2Rvd25sb2FkJzpcclxuICAgICAgICB3aW5kb3cub3Blbih0aGlzLnRyZWUuY29uZmlnLmJhc2VVUkwgKyBhcGlVcmwsICdfYmxhbmsnKTtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBjb25zb2xlLndhcm4oJ1tOb2RlQ2xpY2tlZFNlcnZpY2VdIEluY29ycmVjdCBwYXJhbXMgZm9yIHRoaXMgc2lkZS1lZmZlY3QnKTtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgcGFyc2VQYXJhbXMocGFyYW1zOiB7fSk6IHN0cmluZyB7XHJcbiAgICBsZXQgcXVlcnkgPSAnPyc7XHJcblxyXG4gICAgT2JqZWN0LmtleXMocGFyYW1zKS5maWx0ZXIoaXRlbSA9PiBwYXJhbXNbaXRlbV0gIT09IG51bGwpLm1hcChrZXkgPT4ge1xyXG4gICAgICBxdWVyeSArPSBrZXkgKyAnPScgKyBwYXJhbXNba2V5XSArICcmJztcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBxdWVyeS5zbGljZSgwLCAtMSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHN1Y2Nlc3NXaXRoTW9kYWxDbG9zZSgpIHtcclxuICAgIHRoaXMuYWN0aW9uU3VjY2VzcygpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpZGUtdmlldycpLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNlYXJjaFN1Y2Nlc3MoaW5wdXQ6IHN0cmluZywgZGF0YTogYW55KSB7XHJcbiAgICBjb25zdCBvYmogPSB7XHJcbiAgICAgIHNlYXJjaFN0cmluZzogaW5wdXQsXHJcbiAgICAgIHJlc3BvbnNlOiBkYXRhXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuYWN0aW9uU3VjY2VzcygpO1xyXG5cclxuICAgIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2Uuc2V0TW9kYWxEYXRhKG9iaiwgJ3NlYXJjaE1vZGFsJywgdHJ1ZSk7XHJcbiAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCdzZWFyY2hNb2RhbCcpLm9wZW4oKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWN0aW9uU3VjY2VzcyhyZXNwb25zZTogc3RyaW5nID0gJycpIHtcclxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnZGlhbG9nLW9wZW4nKTtcclxuXHJcbiAgICB0aGlzLm5vZGVTZXJ2aWNlLnJlZnJlc2hDdXJyZW50UGF0aCgpO1xyXG4gICAgdGhpcy5uZ3hTbWFydE1vZGFsU2VydmljZS5nZXRNb2RhbCgnd2FpdE1vZGFsJykuY2xvc2UoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWN0aW9uRmFpbGVkKG5hbWU6IHN0cmluZywgZXJyb3I6IGFueSkge1xyXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdkaWFsb2ctb3BlbicpO1xyXG5cclxuICAgIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ3dhaXRNb2RhbCcpLmNsb3NlKCk7XHJcbiAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCdlcnJvck1vZGFsJykub3BlbigpO1xyXG4gICAgY29uc29sZS53YXJuKCdbTm9kZUNsaWNrZWRTZXJ2aWNlXSBBY3Rpb24gXCInICsgbmFtZSArICdcIiBmYWlsZWQnLCBlcnJvcik7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCwgVGVtcGxhdGVSZWYsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtzZWxlY3QsIFN0b3JlfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcbmltcG9ydCB7VHJlZU1vZGVsfSBmcm9tICcuL21vZGVscy90cmVlLm1vZGVsJztcclxuaW1wb3J0IHtOb2RlU2VydmljZX0gZnJvbSAnLi9zZXJ2aWNlcy9ub2RlLnNlcnZpY2UnO1xyXG5pbXBvcnQge05vZGVJbnRlcmZhY2V9IGZyb20gJy4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XHJcbmltcG9ydCB7U0VUX0xPQURJTkdfU1RBVEV9IGZyb20gJy4vcmVkdWNlcnMvYWN0aW9ucy5hY3Rpb24nO1xyXG5pbXBvcnQgKiBhcyBBQ1RJT05TIGZyb20gJy4vcmVkdWNlcnMvYWN0aW9ucy5hY3Rpb24nO1xyXG5pbXBvcnQge0FwcFN0b3JlfSBmcm9tICcuL3JlZHVjZXJzL3JlZHVjZXIuZmFjdG9yeSc7XHJcbmltcG9ydCB7Tmd4U21hcnRNb2RhbFNlcnZpY2V9IGZyb20gJ25neC1zbWFydC1tb2RhbCc7XHJcbmltcG9ydCB7Tm9kZUNsaWNrZWRTZXJ2aWNlfSBmcm9tICcuL3NlcnZpY2VzL25vZGUtY2xpY2tlZC5zZXJ2aWNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnZm0tZmlsZS1tYW5hZ2VyJyxcclxuICB0ZW1wbGF0ZTogYDxuZy1jb250YWluZXIgKm5nSWY9XCJpc1BvcHVwOyB0aGVuIGl0SXNQb3B1cCBlbHNlIHNob3dDb250ZW50XCI+PC9uZy1jb250YWluZXI+XHJcblxyXG48bmctdGVtcGxhdGUgI2l0SXNQb3B1cD5cclxuICA8ZGl2ICpuZ0lmPVwiIWZtT3BlblwiPlxyXG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ1dHRvbiBiaWdcIiAoY2xpY2spPVwiZm1TaG93SGlkZSgpXCIgdHJhbnNsYXRlPVwiXCI+T3BlbiBmaWxlIG1hbmFnZXI8L2J1dHRvbj5cclxuICA8L2Rpdj5cclxuICA8ZGl2IGNsYXNzPVwiZmlsZS1tYW5hZ2VyLWJhY2tkcm9wXCIgKm5nSWY9XCJmbU9wZW5cIj5cclxuICAgIDxkaXYgY2xhc3M9XCJmbU1vZGFsSW5zaWRlXCI+XHJcbiAgICAgIDxkaXYgKm5nSWY9XCJmbU9wZW47IHRoZW4gc2hvd0NvbnRlbnRcIj48L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG48L25nLXRlbXBsYXRlPlxyXG5cclxuPG5nLXRlbXBsYXRlICNzaG93Q29udGVudD5cclxuICA8ZGl2IGNsYXNzPVwiY29udGVudFwiPlxyXG4gICAgPGRpdiBjbGFzcz1cImZpbGUtbWFuYWdlci1uYXZiYXJcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cInBhdGhcIj5cclxuICAgICAgICA8YXBwLW5hdi1iYXI+PC9hcHAtbmF2LWJhcj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzPVwibmF2aWdhdGlvblwiPlxyXG4gICAgICAgIDxhcHAtbmF2aWdhdGlvbj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJidXR0b24gY2xvc2VcIiAoY2xpY2spPVwiZm1TaG93SGlkZSgpXCIgKm5nSWY9XCJpc1BvcHVwXCI+XHJcbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLTJ4IGZhLXRpbWVzXCI+PC9pPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9hcHAtbmF2aWdhdGlvbj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8ZGl2IGNsYXNzPVwiaG9sZGVyXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJmaWxlLW1hbmFnZXItbGVmdFwiPlxyXG4gICAgICAgIDxhcHAtdHJlZSBbdHJlZU1vZGVsXT1cInRyZWVcIj5cclxuICAgICAgICAgIDxuZy10ZW1wbGF0ZSBsZXQtbm9kZXM+XHJcbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IG5vZGVzfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiaWNvblRlbXBsYXRlID8gaWNvblRlbXBsYXRlIDogZGVmYXVsdEljb25UZW1wbGF0ZVwiPlxyXG4gICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cclxuICAgICAgICAgIDwvbmctdGVtcGxhdGU+XHJcbiAgICAgICAgPC9hcHAtdHJlZT5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzPVwicmlnaHRcIj5cclxuICAgICAgICA8YXBwLWZvbGRlci1jb250ZW50XHJcbiAgICAgICAgICBbdHJlZU1vZGVsXT1cInRyZWVcIlxyXG4gICAgICAgICAgKG9wZW5VcGxvYWREaWFsb2cpPVwiaGFuZGxlVXBsb2FkRGlhbG9nKCRldmVudClcIlxyXG4gICAgICAgICAgW2ZvbGRlckNvbnRlbnRUZW1wbGF0ZV09XCJmb2xkZXJDb250ZW50VGVtcGxhdGUgPyBmb2xkZXJDb250ZW50VGVtcGxhdGUgOiBkZWZhdWx0Rm9sZGVyQ29udGVudFRlbXBsYXRlXCJcclxuICAgICAgICAgIFtmb2xkZXJDb250ZW50TmV3VGVtcGxhdGVdPVwiZm9sZGVyQ29udGVudE5ld1RlbXBsYXRlID8gZm9sZGVyQ29udGVudE5ld1RlbXBsYXRlIDogZGVmYXVsdEZvbGRlckNvbnRlbnROZXdUZW1wbGF0ZVwiXHJcbiAgICAgICAgICBbZm9sZGVyQ29udGVudEJhY2tUZW1wbGF0ZV09XCJmb2xkZXJDb250ZW50QmFja1RlbXBsYXRlID8gZm9sZGVyQ29udGVudEJhY2tUZW1wbGF0ZSA6IGRlZmF1bHRGb2xkZXJDb250ZW50QmFja1RlbXBsYXRlXCI+XHJcbiAgICAgICAgPC9hcHAtZm9sZGVyLWNvbnRlbnQ+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGFwcC1zaWRlLXZpZXcgaWQ9XCJzaWRlLXZpZXdcIlxyXG4gICAgICAgICAgICAgICAgICAgICBbbm9kZV09XCJzZWxlY3RlZE5vZGVcIlxyXG4gICAgICAgICAgICAgICAgICAgICBbc2lkZVZpZXdUZW1wbGF0ZV09XCJzaWRlVmlld1RlbXBsYXRlID8gc2lkZVZpZXdUZW1wbGF0ZSA6IGRlZmF1bHRTaWRlVmlld1RlbXBsYXRlXCJcclxuICAgICAgICAgICAgICAgICAgICAgW2FsbG93Rm9sZGVyRG93bmxvYWRdPVwidHJlZS5jb25maWcub3B0aW9ucy5hbGxvd0ZvbGRlckRvd25sb2FkXCJcclxuICAgICAgICAgICAgICAgICAgICAgKGNsaWNrRXZlbnQpPVwiaGFuZGxlRmlsZU1hbmFnZXJDbGlja0V2ZW50KCRldmVudClcIj5cclxuICAgICAgPC9hcHAtc2lkZS12aWV3PlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcblxyXG4gIDxhcHAtdXBsb2FkICpuZ0lmPVwibmV3RGlhbG9nXCJcclxuICAgICAgICAgICAgICBbb3BlbkRpYWxvZ109XCJuZXdEaWFsb2dcIlxyXG4gICAgICAgICAgICAgIChjbG9zZURpYWxvZyk9XCJoYW5kbGVVcGxvYWREaWFsb2coZmFsc2UpXCJcclxuICAgICAgICAgICAgICAoY3JlYXRlRGlyKT1cImhhbmRsZUZpbGVNYW5hZ2VyQ2xpY2tFdmVudCh7dHlwZTogJ2NyZWF0ZUZvbGRlcicsIHBheWxvYWQ6ICRldmVudH0pXCI+XHJcbiAgPC9hcHAtdXBsb2FkPlxyXG5cclxuICA8YXBwLWxvYWRpbmctb3ZlcmxheVxyXG4gICAgKm5nSWY9XCJsb2FkaW5nXCJcclxuICAgIFtsb2FkaW5nT3ZlcmxheVRlbXBsYXRlXT1cImxvYWRpbmdPdmVybGF5VGVtcGxhdGUgPyBsb2FkaW5nT3ZlcmxheVRlbXBsYXRlIDogZGVmYXVsdExvYWRpbmdPdmVybGF5VGVtcGxhdGVcIj5cclxuICA8L2FwcC1sb2FkaW5nLW92ZXJsYXk+XHJcbjwvbmctdGVtcGxhdGU+XHJcblxyXG48bmctdGVtcGxhdGUgbGV0LW5vZGUgI2RlZmF1bHRJY29uVGVtcGxhdGU+XHJcbiAgPGRpdiBjbGFzcz1cImZpbGUtbWFuYWdlci1ub2RlXCIgc3R5bGU9XCJkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IHBhZGRpbmc6IDNweFwiPlxyXG4gICAgPGRpdiAqbmdJZj1cIm5vZGUuaXNGb2xkZXI7IHRoZW4gaXRJc0ZvbGRlciBlbHNlIHNob3dGaWxlXCI+PC9kaXY+XHJcblxyXG4gICAgPG5nLXRlbXBsYXRlICNpdElzRm9sZGVyPlxyXG4gICAgICA8ZGl2ICpuZ0lmPVwibm9kZS5pc0V4cGFuZGVkOyB0aGVuIGlzRm9sZGVyRXhwYW5kZWQgZWxzZSBpc0ZvbGRlckNsb3NlZFwiPjwvZGl2PlxyXG4gICAgPC9uZy10ZW1wbGF0ZT5cclxuXHJcbiAgICA8bmctdGVtcGxhdGUgI3Nob3dGaWxlPjxpIGNsYXNzPVwiZmFzIGZhLWZpbGUgY2hpbGRcIj48L2k+PC9uZy10ZW1wbGF0ZT5cclxuICAgIDxuZy10ZW1wbGF0ZSAjaXNGb2xkZXJFeHBhbmRlZD48aSBjbGFzcz1cImZhcyBmYS1mb2xkZXItb3BlbiBjaGlsZFwiPjwvaT48L25nLXRlbXBsYXRlPlxyXG4gICAgPG5nLXRlbXBsYXRlICNpc0ZvbGRlckNsb3NlZD48aSBjbGFzcz1cImZhcyBmYS1mb2xkZXIgY2hpbGRcIj48L2k+PC9uZy10ZW1wbGF0ZT5cclxuXHJcbiAgICA8c3Bhbj57e25vZGUubmFtZX19PC9zcGFuPlxyXG4gIDwvZGl2PlxyXG48L25nLXRlbXBsYXRlPlxyXG48bmctdGVtcGxhdGUgbGV0LW5vZGUgI2RlZmF1bHRGb2xkZXJDb250ZW50VGVtcGxhdGU+XHJcbiAgPGRpdiBjbGFzcz1cImZpbGUtbWFuYWdlci1pdGVtXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZmlsZS1wcmV2aWV3XCI+XHJcbiAgICAgIDxkaXYgKm5nSWY9XCJub2RlLmlzRm9sZGVyOyB0aGVuIGl0SXNGb2xkZXIgZWxzZSBzaG93RmlsZVwiPjwvZGl2PlxyXG4gICAgICA8bmctdGVtcGxhdGUgI2l0SXNGb2xkZXI+PGkgY2xhc3M9XCJmYXMgZmEtM3ggZmEtZm9sZGVyIGNoaWxkXCI+PC9pPjwvbmctdGVtcGxhdGU+XHJcbiAgICAgIDxuZy10ZW1wbGF0ZSAjc2hvd0ZpbGU+PGkgY2xhc3M9XCJmYXMgZmEtM3ggZmEtZmlsZSBjaGlsZFwiPjwvaT48L25nLXRlbXBsYXRlPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZmlsZS1uYW1lXCI+XHJcbiAgICAgIHt7bm9kZS5uYW1lfX1cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG48L25nLXRlbXBsYXRlPlxyXG48bmctdGVtcGxhdGUgI2RlZmF1bHRGb2xkZXJDb250ZW50TmV3VGVtcGxhdGU+XHJcbiAgPGRpdiBjbGFzcz1cImZpbGUtbWFuYWdlci1pdGVtXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZmlsZS1wcmV2aWV3XCIgc3R5bGU9XCJ3aWR0aDogMTAwJTsgaGVpZ2h0OjEwMCVcIj5cclxuICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtM3ggZmEtcGx1cyBjaGlsZFwiIHN0eWxlPVwibGluZS1oZWlnaHQ6IDJcIj48L2k+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuPC9uZy10ZW1wbGF0ZT5cclxuPG5nLXRlbXBsYXRlIGxldC1ub2RlICNkZWZhdWx0Rm9sZGVyQ29udGVudEJhY2tUZW1wbGF0ZT5cclxuICA8ZGl2IGNsYXNzPVwiZmlsZS1tYW5hZ2VyLWl0ZW1cIj5cclxuICAgIDxkaXYgY2xhc3M9XCJmaWxlLXByZXZpZXdcIiBzdHlsZT1cIndpZHRoOiAxMDAlOyBoZWlnaHQ6MTAwJVwiPlxyXG4gICAgICA8aSBjbGFzcz1cImZhcyBmYS0yeCBmYS1lbGxpcHNpcy1oXCIgc3R5bGU9XCJsaW5lLWhlaWdodDogNVwiPjwvaT5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG48L25nLXRlbXBsYXRlPlxyXG48bmctdGVtcGxhdGUgbGV0LXRpbWVvdXRNZXNzYWdlICNkZWZhdWx0TG9hZGluZ092ZXJsYXlUZW1wbGF0ZT5cclxuICA8ZGl2IGNsYXNzPVwiZmlsZS1tYW5hZ2VyLWJhY2tkcm9wIGxvYWRpbmdcIiAoY2xpY2spPVwiYmFja2Ryb3BDbGlja2VkKClcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJmaWxlLW1hbmFnZXItZXJyb3JcIiAqbmdJZj1cInRpbWVvdXRNZXNzYWdlXCI+e3t0aW1lb3V0TWVzc2FnZX19PC9kaXY+XHJcbiAgPC9kaXY+XHJcbiAgPGRpdiBjbGFzcz1cInNwaW5uZXJcIj5cclxuICAgIDxpIGNsYXNzPVwiZmFzIGZhLTV4IGZhLXNwaW4gZmEtc3luYy1hbHRcIj48L2k+XHJcbiAgPC9kaXY+XHJcbjwvbmctdGVtcGxhdGU+XHJcbjxuZy10ZW1wbGF0ZSBsZXQtbm9kZSAjZGVmYXVsdFNpZGVWaWV3VGVtcGxhdGU+XHJcbiAgPGRpdiBzdHlsZT1cInBvc2l0aW9uOiBhYnNvbHV0ZTsgYm90dG9tOiAwOyB3aWR0aDogMTAwJTsgbWFyZ2luOiA1cHggYXV0b1wiPlxyXG4gICAgPHNwYW4gKm5nSWY9XCJub2RlLmlzRm9sZGVyXCIgdHJhbnNsYXRlPk5vIGRhdGEgYXZhaWxhYmxlIGZvciB0aGlzIGZvbGRlcjwvc3Bhbj5cclxuICAgIDxzcGFuICpuZ0lmPVwiIW5vZGUuaXNGb2xkZXJcIiB0cmFuc2xhdGU+Tm8gZGF0YSBhdmFpbGFibGUgZm9yIHRoaXMgZmlsZTwvc3Bhbj5cclxuICA8L2Rpdj5cclxuPC9uZy10ZW1wbGF0ZT5cclxuXHJcbjxuZ3gtc21hcnQtbW9kYWwgaWRlbnRpZmllcj1cInJlbmFtZU1vZGFsXCIgW2Rpc21pc3NhYmxlXT1cImZhbHNlXCIgW2Nsb3NhYmxlXT1cImZhbHNlXCIgKm5nSWY9XCJzZWxlY3RlZE5vZGVcIiAjcmVuYW1lTW9kYWw+XHJcbiAgPGgyIGNsYXNzPVwibW9kYWwtdGl0bGVcIiB0cmFuc2xhdGU+XHJcbiAgICBSZW5hbWUgZmlsZVxyXG4gIDwvaDI+XHJcbiAgPHAgY2xhc3M9XCJyZW5hbWUtbmFtZVwiIHRyYW5zbGF0ZT5cclxuICAgIE9sZCBuYW1lXHJcbiAgPC9wPlxyXG4gIDxzcGFuIHN0eWxlPVwibWFyZ2luOiA4cHhcIj57e3NlbGVjdGVkTm9kZS5uYW1lfX08L3NwYW4+XHJcbiAgPHAgY2xhc3M9XCJyZW5hbWUtbmFtZVwiIHRyYW5zbGF0ZT5cclxuICAgIE5ldyBuYW1lXHJcbiAgPC9wPlxyXG4gIDxpbnB1dCBwbGFjZWhvbGRlcj1cIk5ldyBuYW1lXCIgdHlwZT1cInRleHRcIiBjbGFzcz1cInJlbmFtZS1pbnB1dFwiIFt2YWx1ZV09XCJzZWxlY3RlZE5vZGUubmFtZVwiICNyZW5hbWVJbnB1dFxyXG4gICAgICAgICAoa2V5dXAuZW50ZXIpPVwiaGFuZGxlRmlsZU1hbmFnZXJDbGlja0V2ZW50KHt0eXBlOiAncmVuYW1lJywgdmFsdWU6IHJlbmFtZUlucHV0LnZhbHVlfSlcIlxyXG4gICAgICAgICBvbmNsaWNrPVwidGhpcy5zZWxlY3QoKTtcIj5cclxuICA8YnI+XHJcblxyXG4gIDxkaXYgY2xhc3M9XCJyZW5hbWUtYnV0dG9uXCI+XHJcbiAgICA8YnV0dG9uIGNsYXNzPVwiYnV0dG9uIGJpZ1wiIHRyYW5zbGF0ZVxyXG4gICAgICAgICAgICAoY2xpY2spPVwiaGFuZGxlRmlsZU1hbmFnZXJDbGlja0V2ZW50KHt0eXBlOiAncmVuYW1lJywgdmFsdWU6IHJlbmFtZUlucHV0LnZhbHVlfSlcIlxyXG4gICAgICAgICAgICBbZGlzYWJsZWRdPVwicmVuYW1lSW5wdXQudmFsdWUgPT09IHNlbGVjdGVkTm9kZS5uYW1lIHx8IHJlbmFtZUlucHV0LnZhbHVlLmxlbmd0aCA9PT0gMFwiPlxyXG4gICAgICBSZW5hbWVcclxuICAgIDwvYnV0dG9uPlxyXG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ1dHRvbiBiaWdcIiAoY2xpY2spPVwicmVuYW1lTW9kYWwuY2xvc2UoKVwiIHRyYW5zbGF0ZT5cclxuICAgICAgQ2FuY2VsXHJcbiAgICA8L2J1dHRvbj5cclxuICA8L2Rpdj5cclxuXHJcbjwvbmd4LXNtYXJ0LW1vZGFsPlxyXG48bmd4LXNtYXJ0LW1vZGFsICpuZ0lmPVwic2VsZWN0ZWROb2RlXCIgaWRlbnRpZmllcj1cImNvbmZpcm1EZWxldGVNb2RhbFwiICNkZWxldGVNb2RhbFxyXG4gICAgICAgICAgICAgICAgIFtkaXNtaXNzYWJsZV09XCJmYWxzZVwiIFtjbG9zYWJsZV09XCJmYWxzZVwiPlxyXG4gIDxoMiBjbGFzcz1cIm1vZGFsLXRpdGxlXCI+XHJcbiAgICA8c3BhbiB0cmFuc2xhdGU+WW91IGFyZSB0cnlpbmcgdG8gZGVsZXRlIGZvbGxvd2luZyA8L3NwYW4+XHJcbiAgICA8c3BhbiAqbmdJZj1cInNlbGVjdGVkTm9kZS5pc0ZvbGRlclwiIHRyYW5zbGF0ZT5mb2xkZXI8L3NwYW4+XHJcbiAgICA8c3BhbiAqbmdJZj1cIiFzZWxlY3RlZE5vZGUuaXNGb2xkZXJcIiB0cmFuc2xhdGU+ZmlsZTwvc3Bhbj5cclxuICA8L2gyPlxyXG5cclxuICA8ZGl2IHN0eWxlPVwid2lkdGg6IDEwMCU7IG1hcmdpbjogNXB4IGF1dG87IHRleHQtYWxpZ246IGNlbnRlclwiPnt7c2VsZWN0ZWROb2RlLm5hbWV9fTwvZGl2PlxyXG5cclxuICA8ZGl2IGNsYXNzPVwicmVuYW1lLWJ1dHRvblwiPlxyXG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ1dHRvbiBiaWdcIiAoY2xpY2spPVwiaGFuZGxlRmlsZU1hbmFnZXJDbGlja0V2ZW50KHt0eXBlOiAncmVtb3ZlJ30pXCI+XHJcbiAgICAgIDxzcGFuIHRyYW5zbGF0ZT5ZZXMsIGRlbGV0ZSB0aGlzIDwvc3Bhbj5cclxuICAgICAgPHNwYW4gKm5nSWY9XCJzZWxlY3RlZE5vZGUuaXNGb2xkZXJcIiB0cmFuc2xhdGU+Zm9sZGVyPC9zcGFuPlxyXG4gICAgICA8c3BhbiAqbmdJZj1cIiFzZWxlY3RlZE5vZGUuaXNGb2xkZXJcIiB0cmFuc2xhdGU+ZmlsZTwvc3Bhbj5cclxuICAgIDwvYnV0dG9uPlxyXG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ1dHRvbiBiaWdcIiAoY2xpY2spPVwiZGVsZXRlTW9kYWwuY2xvc2UoKVwiIHRyYW5zbGF0ZT5cclxuICAgICAgQ2FuY2VsXHJcbiAgICA8L2J1dHRvbj5cclxuICA8L2Rpdj5cclxuPC9uZ3gtc21hcnQtbW9kYWw+XHJcbjxuZ3gtc21hcnQtbW9kYWwgaWRlbnRpZmllcj1cInNlYXJjaE1vZGFsXCIgI3NlYXJjaE1vZGFsIFtjbG9zYWJsZV09XCJ0cnVlXCI+XHJcbiAgPGgyIGNsYXNzPVwibW9kYWwtdGl0bGVcIiBzdHlsZT1cIm1hcmdpbi1ib3R0b206IDJweFwiIHRyYW5zbGF0ZVxyXG4gICAgICAqbmdJZj1cInNlYXJjaE1vZGFsLmhhc0RhdGEoKSAmJiBzZWFyY2hNb2RhbC5nZXREYXRhKCkucmVzcG9uc2UubGVuZ3RoICE9PSAwXCI+XHJcbiAgICBTZWFyY2ggcmVzdWx0cyBmb3JcclxuICA8L2gyPlxyXG4gIDxoMiBjbGFzcz1cIm1vZGFsLXRpdGxlXCIgc3R5bGU9XCJtYXJnaW4tYm90dG9tOiAycHhcIiB0cmFuc2xhdGVcclxuICAgICAgKm5nSWY9XCIhc2VhcmNoTW9kYWwuaGFzRGF0YSgpIHx8IHNlYXJjaE1vZGFsLmdldERhdGEoKS5yZXNwb25zZS5sZW5ndGggPT09IDBcIj5cclxuICAgIE5vIHJlc3VsdHMgZm91bmQgZm9yXHJcbiAgPC9oMj5cclxuICA8ZGl2IHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyXCIgKm5nSWY9XCJzZWFyY2hNb2RhbC5oYXNEYXRhKClcIj57e3NlYXJjaE1vZGFsLmdldERhdGEoKS5zZWFyY2hTdHJpbmd9fTwvZGl2PlxyXG5cclxuICA8ZGl2ICpuZ0lmPVwic2VhcmNoTW9kYWwuaGFzRGF0YSgpICYmIHNlYXJjaE1vZGFsLmdldERhdGEoKS5yZXNwb25zZS5sZW5ndGggIT09IDBcIj5cclxuICAgIDx0YWJsZSBzdHlsZT1cIm1hcmdpbjogMCBhdXRvXCI+XHJcbiAgICAgIDx0cj5cclxuICAgICAgICA8dGQgY2xhc3M9XCJ0YWJsZS1pdGVtIHRhYmxlLWhlYWRcIiB0cmFuc2xhdGU+RmlsZSBuYW1lPC90ZD5cclxuICAgICAgICA8dGQgY2xhc3M9XCJ0YWJsZS1pdGVtLXNob3J0IHRhYmxlLWhlYWRcIiB0cmFuc2xhdGU+U2l6ZTwvdGQ+XHJcbiAgICAgIDwvdHI+XHJcbiAgICAgIDx0ciAqbmdGb3I9XCJsZXQgaXRlbSBvZiBzZWFyY2hNb2RhbC5nZXREYXRhKCkucmVzcG9uc2VcIiAoY2xpY2spPVwic2VhcmNoQ2xpY2tlZChpdGVtKVwiPlxyXG4gICAgICAgIDx0ZCBzdHlsZT1cImN1cnNvcjogcG9pbnRlclwiPlxyXG4gICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIml0ZW0uZmlsZUNhdGVnb3J5ID09PSAnRCc7IGVsc2UgZmlsZVwiPlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1mb2xkZXIgc2VhcmNoLW91dHB1dC1pY29uXCI+PC9pPlxyXG4gICAgICAgICAgPC9uZy1jb250YWluZXI+XHJcbiAgICAgICAgICA8bmctdGVtcGxhdGUgI2ZpbGU+XHJcbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLWZpbGUgc2VhcmNoLW91dHB1dC1pY29uXCI+PC9pPlxyXG4gICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cclxuICAgICAgICAgIDxzcGFuIHN0eWxlPVwidGV4dC1vdmVyZmxvdzogZWxsaXBzaXNcIj57e2l0ZW0ubmFtZX19PC9zcGFuPlxyXG4gICAgICAgIDwvdGQ+XHJcbiAgICAgICAgPHRkIGNsYXNzPVwidGFibGUtaXRlbS1zaG9ydFwiPnt7aXRlbS5zaXplfX08L3RkPlxyXG4gICAgICA8L3RyPlxyXG4gICAgPC90YWJsZT5cclxuICA8L2Rpdj5cclxuPC9uZ3gtc21hcnQtbW9kYWw+XHJcbjxuZ3gtc21hcnQtbW9kYWwgaWRlbnRpZmllcj1cIndhaXRNb2RhbFwiIFtjbG9zYWJsZV09XCJmYWxzZVwiIFtkaXNtaXNzYWJsZV09XCJmYWxzZVwiIFtlc2NhcGFibGVdPVwiZmFsc2VcIj5cclxuICA8aDIgY2xhc3M9XCJtb2RhbC10aXRsZVwiIHN0eWxlPVwibWFyZ2luLXRvcDogMjBweFwiPlxyXG4gICAge3snUHJvY2Vzc2luZyByZXF1ZXN0J319Li4uXHJcbiAgPC9oMj5cclxuXHJcbiAgPGRpdiBzdHlsZT1cInRleHQtYWxpZ246IGNlbnRlcjsgaGVpZ2h0OiA3MHB4XCI+XHJcbiAgICA8aSBjbGFzcz1cImZhcyBmYS1zcGlubmVyIGZhLXNwaW4gZmEtNHhcIj48L2k+XHJcbiAgPC9kaXY+XHJcbjwvbmd4LXNtYXJ0LW1vZGFsPlxyXG48bmd4LXNtYXJ0LW1vZGFsIGlkZW50aWZpZXI9XCJlcnJvck1vZGFsXCIgW2Nsb3NhYmxlXT1cInRydWVcIj5cclxuICA8aDIgY2xhc3M9XCJtb2RhbC10aXRsZVwiIHN0eWxlPVwibWFyZ2luLXRvcDogMjBweFwiPlxyXG4gICAge3snU29tZXRoaW5nIHdlbnQgd3Jvbmcgd2l0aCB5b3VyIHJlcXVlc3QnfX0uLi5cclxuICA8L2gyPlxyXG48L25neC1zbWFydC1tb2RhbD5cclxuYCxcclxuICBzdHlsZXM6IFtgLmNvbnRlbnR7aGVpZ2h0OjEwMCU7bWluLXdpZHRoOjg1MHB4fS5ob2xkZXJ7ZGlzcGxheTotd2Via2l0LWZsZXg7ZGlzcGxheTpmbGV4O2hlaWdodDpjYWxjKDEwMCUgLSA3NXB4KX0ucGF0aHttYXJnaW46YXV0byAwO2Rpc3BsYXk6YmxvY2t9Lm5hdmlnYXRpb257bWFyZ2luOmF1dG8gMDtkaXNwbGF5Oi13ZWJraXQtZmxleDtkaXNwbGF5OmZsZXh9Lm5hdmlnYXRpb24gLmJ1dHRvbnttYXJnaW46MCAxMHB4O3BhZGRpbmc6MDtwb3NpdGlvbjpyZWxhdGl2ZX0ucmlnaHR7d2lkdGg6MTAwJTtwb3NpdGlvbjpyZWxhdGl2ZTtvdmVyZmxvdzphdXRvfS5maWxlLW5hbWV7d2lkdGg6MTAwcHg7aGVpZ2h0OjI1cHg7b3ZlcmZsb3c6aGlkZGVuO3doaXRlLXNwYWNlOm5vd3JhcDt0ZXh0LW92ZXJmbG93OmVsbGlwc2lzO2JveC1zaXppbmc6Ym9yZGVyLWJveDstd2Via2l0LXVzZXItc2VsZWN0Om5vbmU7LW1vei11c2VyLXNlbGVjdDpub25lOy1tcy11c2VyLXNlbGVjdDpub25lO3VzZXItc2VsZWN0Om5vbmV9LmZpbGUtcHJldmlld3ttYXJnaW46YXV0b30uZmlsZS1wcmV2aWV3IGl7bGluZS1oZWlnaHQ6MS41fS5zcGlubmVye3Bvc2l0aW9uOmFic29sdXRlO3RvcDo1MCU7bGVmdDo1MCU7LXdlYmtpdC10cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUsLTUwJSk7dHJhbnNmb3JtOnRyYW5zbGF0ZSgtNTAlLC01MCUpO2N1cnNvcjpwcm9ncmVzc30ucmVuYW1lLWJ1dHRvbnttYXJnaW46MjBweCBhdXRvO2Rpc3BsYXk6YmxvY2s7dGV4dC1hbGlnbjpjZW50ZXJ9Lm1vZGFsLXRpdGxle21hcmdpbi10b3A6NXB4O3RleHQtYWxpZ246Y2VudGVyfS5zZWFyY2gtb3V0cHV0e21hcmdpbjoxNXB4IDB9LnNlYXJjaC1vdXRwdXQtaWNvbnttYXJnaW46MnB4IDVweH0udGFibGUtaXRlbXt3aWR0aDo4MCV9LnRhYmxlLWl0ZW0tc2hvcnR7d2lkdGg6MjAlO3RleHQtYWxpZ246cmlnaHR9YF0sXHJcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRmlsZU1hbmFnZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIEBJbnB1dCgpIGljb25UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICBASW5wdXQoKSBmb2xkZXJDb250ZW50VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgQElucHV0KCkgZm9sZGVyQ29udGVudEJhY2tUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICBASW5wdXQoKSBmb2xkZXJDb250ZW50TmV3VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgQElucHV0KCkgbG9hZGluZ092ZXJsYXlUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICBASW5wdXQoKSBzaWRlVmlld1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICBASW5wdXQoKSB0cmVlOiBUcmVlTW9kZWw7XHJcbiAgQElucHV0KCkgaXNQb3B1cDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIEBPdXRwdXQoKSBpdGVtQ2xpY2tlZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgc2VsZWN0ZWROb2RlOiBOb2RlSW50ZXJmYWNlO1xyXG4gIHNpZGVNZW51Q2xvc2VkID0gdHJ1ZTtcclxuXHJcbiAgZm1PcGVuID0gZmFsc2U7XHJcbiAgbG9hZGluZzogYm9vbGVhbjtcclxuICBuZXdEaWFsb2cgPSBmYWxzZTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTxBcHBTdG9yZT4sXHJcbiAgICBwcml2YXRlIG5vZGVTZXJ2aWNlOiBOb2RlU2VydmljZSxcclxuICAgIHByaXZhdGUgbm9kZUNsaWNrZWRTZXJ2aWNlOiBOb2RlQ2xpY2tlZFNlcnZpY2UsXHJcbiAgICBwdWJsaWMgbmd4U21hcnRNb2RhbFNlcnZpY2U6IE5neFNtYXJ0TW9kYWxTZXJ2aWNlLFxyXG4gICkge1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICB3aW5kb3cuY29uc29sZSA9IHdpbmRvdy5jb25zb2xlIHx8IHt9O1xyXG4gICAgd2luZG93LmNvbnNvbGUubG9nID0gd2luZG93LmNvbnNvbGUubG9nIHx8IGZ1bmN0aW9uICgpIHtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5ub2RlU2VydmljZS50cmVlID0gdGhpcy50cmVlO1xyXG4gICAgdGhpcy5ub2RlQ2xpY2tlZFNlcnZpY2UudHJlZSA9IHRoaXMudHJlZTtcclxuICAgIHRoaXMubm9kZVNlcnZpY2Uuc3RhcnRNYW5hZ2VyQXQodGhpcy50cmVlLmN1cnJlbnRQYXRoKTtcclxuXHJcbiAgICB0aGlzLnN0b3JlXHJcbiAgICAgIC5waXBlKHNlbGVjdChzdGF0ZSA9PiBzdGF0ZS5maWxlTWFuYWdlclN0YXRlLmlzTG9hZGluZykpXHJcbiAgICAgIC5zdWJzY3JpYmUoKGRhdGE6IGJvb2xlYW4pID0+IHtcclxuICAgICAgICB0aGlzLmxvYWRpbmcgPSBkYXRhO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICB0aGlzLnN0b3JlXHJcbiAgICAgIC5waXBlKHNlbGVjdChzdGF0ZSA9PiBzdGF0ZS5maWxlTWFuYWdlclN0YXRlLnNlbGVjdGVkTm9kZSkpXHJcbiAgICAgIC5zdWJzY3JpYmUoKG5vZGU6IE5vZGVJbnRlcmZhY2UpID0+IHtcclxuICAgICAgICBpZiAoIW5vZGUpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGZpeGVkIGhpZ2hsaWdodGluZyBlcnJvciB3aGVuIGNsb3Npbmcgbm9kZSBidXQgbm90IGNoYW5naW5nIHBhdGhcclxuICAgICAgICBpZiAoKG5vZGUuaXNFeHBhbmRlZCAmJiBub2RlLnBhdGhUb05vZGUgIT09IHRoaXMubm9kZVNlcnZpY2UuY3VycmVudFBhdGgpICYmICFub2RlLnN0YXlPcGVuKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmhhbmRsZUZpbGVNYW5hZ2VyQ2xpY2tFdmVudCh7dHlwZTogJ3NlbGVjdCcsIG5vZGU6IG5vZGV9KTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBvbkl0ZW1DbGlja2VkKGV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgIHRoaXMuaXRlbUNsaWNrZWQuZW1pdChldmVudCk7XHJcbiAgfVxyXG5cclxuICBzZWFyY2hDbGlja2VkKGRhdGE6IGFueSkge1xyXG4gICAgLy8gY29uc29sZS5sb2coZGF0YSk7XHJcblxyXG4gICAgY29uc3Qgbm9kZSA9IHRoaXMubm9kZVNlcnZpY2UuZmluZE5vZGVCeUlkKGRhdGEuaWQpO1xyXG4gICAgdGhpcy5uZ3hTbWFydE1vZGFsU2VydmljZS5nZXRNb2RhbCgnc2VhcmNoTW9kYWwnKS5jbG9zZSgpO1xyXG4gICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogQUNUSU9OUy5TRVRfU0VMRUNURURfTk9ERSwgcGF5bG9hZDogbm9kZX0pO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlRmlsZU1hbmFnZXJDbGlja0V2ZW50KGV2ZW50OiBhbnkpIHtcclxuICAgIHN3aXRjaCAoZXZlbnQudHlwZSkge1xyXG4gICAgICBjYXNlICdjbG9zZVNpZGVWaWV3JyA6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZUNsaWNrSGFuZGxlcihldmVudC5ub2RlLCB0cnVlKTtcclxuXHJcbiAgICAgIGNhc2UgJ3NlbGVjdCcgOlxyXG4gICAgICAgIHRoaXMub25JdGVtQ2xpY2tlZChldmVudCk7XHJcbiAgICAgICAgdGhpcy5oaWdobGlnaHRTZWxlY3RlZChldmVudC5ub2RlKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5ub2RlQ2xpY2tIYW5kbGVyKGV2ZW50Lm5vZGUpO1xyXG5cclxuICAgICAgY2FzZSAnZG93bmxvYWQnIDpcclxuICAgICAgICB0aGlzLm5vZGVDbGlja2VkU2VydmljZS5zdGFydERvd25sb2FkKGV2ZW50Lm5vZGUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9uSXRlbUNsaWNrZWQoZXZlbnQpO1xyXG5cclxuICAgICAgY2FzZSAncmVuYW1lQ29uZmlybScgOlxyXG4gICAgICAgIHJldHVybiB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCdyZW5hbWVNb2RhbCcpLm9wZW4oKTtcclxuICAgICAgY2FzZSAncmVuYW1lJyA6XHJcbiAgICAgICAgdGhpcy5uZ3hTbWFydE1vZGFsU2VydmljZS5nZXRNb2RhbCgncmVuYW1lTW9kYWwnKS5jbG9zZSgpO1xyXG5cclxuICAgICAgICB0aGlzLm5vZGVDbGlja2VkU2VydmljZS5yZW5hbWUodGhpcy5zZWxlY3RlZE5vZGUuaWQsIGV2ZW50LnZhbHVlKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5vbkl0ZW1DbGlja2VkKHtcclxuICAgICAgICAgIHR5cGU6IGV2ZW50LnR5cGUsXHJcbiAgICAgICAgICBub2RlOiB0aGlzLnNlbGVjdGVkTm9kZSxcclxuICAgICAgICAgIG5ld05hbWU6IGV2ZW50LnZhbHVlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICBjYXNlICdyZW1vdmVBc2snOlxyXG4gICAgICAgIHJldHVybiB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCdjb25maXJtRGVsZXRlTW9kYWwnKS5vcGVuKCk7XHJcbiAgICAgIGNhc2UgJ3JlbW92ZSc6XHJcbiAgICAgICAgdGhpcy5uZ3hTbWFydE1vZGFsU2VydmljZS5nZXRNb2RhbCgnY29uZmlybURlbGV0ZU1vZGFsJykuY2xvc2UoKTtcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlQ2xpY2tlZFNlcnZpY2UuaW5pdERlbGV0ZSh0aGlzLnNlbGVjdGVkTm9kZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub25JdGVtQ2xpY2tlZCh7XHJcbiAgICAgICAgICB0eXBlOiBldmVudC50eXBlLFxyXG4gICAgICAgICAgbm9kZTogdGhpcy5zZWxlY3RlZE5vZGVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIGNhc2UgJ2NyZWF0ZUZvbGRlcicgOlxyXG4gICAgICAgIGNvbnN0IHBhcmVudElkID0gdGhpcy5ub2RlU2VydmljZS5maW5kTm9kZUJ5UGF0aCh0aGlzLm5vZGVTZXJ2aWNlLmN1cnJlbnRQYXRoKS5pZDtcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlQ2xpY2tlZFNlcnZpY2UuY3JlYXRlRm9sZGVyKHBhcmVudElkLCBldmVudC5wYXlsb2FkKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5vbkl0ZW1DbGlja2VkKHtcclxuICAgICAgICAgIHR5cGU6IGV2ZW50LnR5cGUsXHJcbiAgICAgICAgICBwYXJlbnRJZDogcGFyZW50SWQsXHJcbiAgICAgICAgICBuZXdEaXJOYW1lOiBldmVudC5wYXlsb2FkXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBub2RlQ2xpY2tIYW5kbGVyKG5vZGU6IE5vZGVJbnRlcmZhY2UsIGNsb3Npbmc/OiBib29sZWFuKSB7XHJcbiAgICBpZiAobm9kZS5uYW1lID09PSAncm9vdCcpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjbG9zaW5nKSB7XHJcbiAgICAgIGNvbnN0IHBhcmVudE5vZGUgPSB0aGlzLm5vZGVTZXJ2aWNlLmZpbmROb2RlQnlQYXRoKHRoaXMubm9kZVNlcnZpY2UuY3VycmVudFBhdGgpO1xyXG4gICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9TRUxFQ1RFRF9OT0RFLCBwYXlsb2FkOiBwYXJlbnROb2RlfSk7XHJcbiAgICAgIHRoaXMuc2lkZU1lbnVDbG9zZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGlmICh0aGlzLnNlbGVjdGVkTm9kZSA9PT0gbm9kZSAmJiB0aGlzLnNpZGVNZW51Q2xvc2VkKVxyXG4gICAgICAgIHRoaXMuc2lkZU1lbnVDbG9zZWQgPSBmYWxzZTtcclxuICAgICAgZWxzZSBpZiAodGhpcy5zZWxlY3RlZE5vZGUgPT09IG5vZGUgJiYgIXRoaXMuc2lkZU1lbnVDbG9zZWQpXHJcbiAgICAgICAgdGhpcy5zaWRlTWVudUNsb3NlZCA9IHRydWU7XHJcbiAgICAgIGVsc2UgaWYgKHRoaXMuc2VsZWN0ZWROb2RlICE9PSBub2RlICYmIHRoaXMuc2lkZU1lbnVDbG9zZWQpXHJcbiAgICAgICAgdGhpcy5zaWRlTWVudUNsb3NlZCA9IGZhbHNlO1xyXG4gICAgICBlbHNlIGlmICh0aGlzLnNlbGVjdGVkTm9kZSAhPT0gbm9kZSAmJiAhdGhpcy5zaWRlTWVudUNsb3NlZClcclxuICAgICAgICB0aGlzLnNpZGVNZW51Q2xvc2VkID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zZWxlY3RlZE5vZGUgPSBub2RlO1xyXG5cclxuICAgIC8vIHRvZG8gaW52ZXN0aWdhdGUgdGhpcyB3b3JrYXJvdW5kIC0gd2FybmluZzogW0ZpbGUgTWFuYWdlcl0gZmFpbGVkIHRvIGZpbmQgcmVxdWVzdGVkIG5vZGUgZm9yIHBhdGg6IFtwYXRoXVxyXG4gICAgaWYoIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaWRlLXZpZXcnKSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuc2lkZU1lbnVDbG9zZWQpIHtcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpZGUtdmlldycpLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2lkZS12aWV3JykuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIHRvZG8gc3RheSBEUlkhXHJcbiAgaGlnaGxpZ2h0U2VsZWN0ZWQobm9kZTogTm9kZUludGVyZmFjZSkge1xyXG4gICAgbGV0IHBhdGhUb05vZGUgPSBub2RlLnBhdGhUb05vZGU7XHJcblxyXG4gICAgaWYgKHBhdGhUb05vZGUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHBhdGhUb05vZGUgPSAncm9vdCc7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdHJlZUVsZW1lbnQgPSB0aGlzLmdldEVsZW1lbnRCeUlkKHBhdGhUb05vZGUsICd0cmVlXycpO1xyXG4gICAgY29uc3QgZmNFbGVtZW50ID0gdGhpcy5nZXRFbGVtZW50QnlJZChwYXRoVG9Ob2RlLCAnZmNfJyk7XHJcbiAgICBpZiAoIXRyZWVFbGVtZW50ICYmICFmY0VsZW1lbnQpIHtcclxuICAgICAgY29uc29sZS53YXJuKCdbRmlsZSBNYW5hZ2VyXSBmYWlsZWQgdG8gZmluZCByZXF1ZXN0ZWQgbm9kZSBmb3IgcGF0aDonLCBwYXRoVG9Ob2RlKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucmVtb3ZlQ2xhc3MoJ2hpZ2hsaWdodGVkJyk7XHJcbiAgICB0aGlzLnJlbW92ZUNsYXNzKCdsaWdodCcpO1xyXG5cclxuICAgIGlmIChmY0VsZW1lbnQpXHJcbiAgICAgIHRoaXMuaGlnaGlsZ2h0Q2hpbGRFbGVtZW50KGZjRWxlbWVudCk7XHJcbiAgICBpZiAodHJlZUVsZW1lbnQpXHJcbiAgICAgIHRoaXMuaGlnaGlsZ2h0Q2hpbGRFbGVtZW50KHRyZWVFbGVtZW50LCB0cnVlKTtcclxuXHJcbiAgICAvLyBwYXJlbnQgbm9kZSBoaWdobGlnaHRcclxuICAgIGxldCBwYXRoVG9QYXJlbnQgPSBub2RlLnBhdGhUb1BhcmVudDtcclxuICAgIGlmIChwYXRoVG9QYXJlbnQgPT09IG51bGwgfHwgbm9kZS5wYXRoVG9Ob2RlID09PSB0aGlzLm5vZGVTZXJ2aWNlLmN1cnJlbnRQYXRoKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAocGF0aFRvUGFyZW50Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICBwYXRoVG9QYXJlbnQgPSAncm9vdCc7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcGFyZW50RWxlbWVudCA9IHRoaXMuZ2V0RWxlbWVudEJ5SWQocGF0aFRvUGFyZW50LCAndHJlZV8nKTtcclxuICAgIGlmICghcGFyZW50RWxlbWVudCkge1xyXG4gICAgICBjb25zb2xlLndhcm4oJ1tGaWxlIE1hbmFnZXJdIGZhaWxlZCB0byBmaW5kIHJlcXVlc3RlZCBwYXJlbnQgbm9kZSBmb3IgcGF0aDonLCBwYXRoVG9QYXJlbnQpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5oaWdoaWxnaHRDaGlsZEVsZW1lbnQocGFyZW50RWxlbWVudCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGhpZ2hpbGdodENoaWxkRWxlbWVudChlbDogSFRNTEVsZW1lbnQsIGxpZ2h0OiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgIGVsLmNoaWxkcmVuWzBdIC8vIGFwcG5vZGUgZGl2IHdyYXBwZXJcclxuICAgICAgLmNoaWxkcmVuWzBdIC8vIG5nIHRlbXBsYXRlIGZpcnN0IGl0ZW1cclxuICAgICAgLmNsYXNzTGlzdC5hZGQoJ2hpZ2hsaWdodGVkJyk7XHJcblxyXG4gICAgaWYgKGxpZ2h0KVxyXG4gICAgICBlbC5jaGlsZHJlblswXVxyXG4gICAgICAgIC5jaGlsZHJlblswXVxyXG4gICAgICAgIC5jbGFzc0xpc3QuYWRkKCdsaWdodCcpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRFbGVtZW50QnlJZChpZDogc3RyaW5nLCBwcmVmaXg6IHN0cmluZyA9ICcnKTogSFRNTEVsZW1lbnQge1xyXG4gICAgY29uc3QgZnVsbElkID0gcHJlZml4ICsgaWQ7XHJcbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZnVsbElkKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVtb3ZlQ2xhc3MoY2xhc3NOYW1lOiBzdHJpbmcpIHtcclxuICAgIEFycmF5LmZyb20oZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjbGFzc05hbWUpKVxyXG4gICAgICAubWFwKChlbDogSFRNTEVsZW1lbnQpID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKSk7XHJcbiAgfVxyXG5cclxuICBmbVNob3dIaWRlKCkge1xyXG4gICAgdGhpcy5mbU9wZW4gPSAhdGhpcy5mbU9wZW47XHJcbiAgfVxyXG5cclxuICBiYWNrZHJvcENsaWNrZWQoKSB7XHJcbiAgICAvLyB0b2RvIGdldCByaWQgb2YgdGhpcyB1Z2x5IHdvcmthcm91bmRcclxuICAgIC8vIHRvZG8gZmlyZSB1c2VyQ2FuY2VsZWRMb2FkaW5nIGV2ZW50XHJcbiAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBTRVRfTE9BRElOR19TVEFURSwgcGF5bG9hZDogZmFsc2V9KTtcclxuICB9XHJcblxyXG4gIGhhbmRsZVVwbG9hZERpYWxvZyhldmVudDogYW55KSB7XHJcbiAgICB0aGlzLm5ld0RpYWxvZyA9IGV2ZW50O1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQsIFRlbXBsYXRlUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtzZWxlY3QsIFN0b3JlfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcbmltcG9ydCB7VHJlZU1vZGVsfSBmcm9tICcuLi8uLi9tb2RlbHMvdHJlZS5tb2RlbCc7XHJcbmltcG9ydCB7Tm9kZVNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL25vZGUuc2VydmljZSc7XHJcbmltcG9ydCB7Tm9kZUludGVyZmFjZX0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XHJcbmltcG9ydCB7QXBwU3RvcmV9IGZyb20gJy4uLy4uL3JlZHVjZXJzL3JlZHVjZXIuZmFjdG9yeSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1mb2xkZXItY29udGVudCcsXHJcbiAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwiaXRlbS1ob2xkZXJcIj5cclxuICA8bmctY29udGFpbmVyICpuZ0lmPVwibm9kZXMuaWQgIT09IDBcIj5cclxuICAgIDxhcHAtbm9kZSBbbm9kZV09bm9kZXMgaWQ9XCJ7e25vZGVzLnBhdGhUb05vZGV9fVwiPlxyXG4gICAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7JGltcGxpY2l0OiBub2Rlc31cIlxyXG4gICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImZvbGRlckNvbnRlbnRCYWNrVGVtcGxhdGVcIj5cclxuICAgICAgPC9uZy1jb250YWluZXI+XHJcbiAgICA8L2FwcC1ub2RlPlxyXG4gIDwvbmctY29udGFpbmVyPlxyXG5cclxuICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBub2RlIG9mIG9iai5rZXlzKG5vZGVzLmNoaWxkcmVuKVwiPlxyXG4gICAgPGFwcC1ub2RlIFtub2RlXT1cIm5vZGVzLmNoaWxkcmVuW25vZGVdXCJcclxuICAgICAgICAgICAgICBpZD1cImZjX3t7bm9kZXMuY2hpbGRyZW5bbm9kZV0ucGF0aFRvTm9kZX19XCI+XHJcbiAgICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IG5vZGVzLmNoaWxkcmVuW25vZGVdfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiZm9sZGVyQ29udGVudFRlbXBsYXRlXCI+XHJcbiAgICAgIDwvbmctY29udGFpbmVyPlxyXG4gICAgPC9hcHAtbm9kZT5cclxuICA8L25nLWNvbnRhaW5lcj5cclxuXHJcbiAgPGRpdiBjbGFzcz1cIm5ld1wiIChjbGljayk9XCJuZXdDbGlja2VkQWN0aW9uKClcIj5cclxuICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRdPVwiZm9sZGVyQ29udGVudE5ld1RlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XHJcbiAgPC9kaXY+XHJcbjwvZGl2PlxyXG5gLFxyXG4gIHN0eWxlczogW2AuaXRlbS1ob2xkZXJ7Ym94LXNpemluZzpib3JkZXItYm94O2Rpc3BsYXk6LXdlYmtpdC1mbGV4O2Rpc3BsYXk6ZmxleDstd2Via2l0LWZsZXgtZmxvdzp3cmFwO2ZsZXgtZmxvdzp3cmFwfS5pdGVtLWhvbGRlciAubmV3e2Rpc3BsYXk6aW5saW5lfWBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBGb2xkZXJDb250ZW50Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBASW5wdXQoKSBmb2xkZXJDb250ZW50VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgQElucHV0KCkgZm9sZGVyQ29udGVudEJhY2tUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICBASW5wdXQoKSBmb2xkZXJDb250ZW50TmV3VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gIEBJbnB1dCgpIHRyZWVNb2RlbDogVHJlZU1vZGVsO1xyXG5cclxuICBAT3V0cHV0KCkgb3BlblVwbG9hZERpYWxvZyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgbm9kZXM6IE5vZGVJbnRlcmZhY2U7XHJcbiAgb2JqID0gT2JqZWN0O1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgbm9kZVNlcnZpY2U6IE5vZGVTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU8QXBwU3RvcmU+XHJcbiAgKSB7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMuc3RvcmVcclxuICAgICAgLnBpcGUoc2VsZWN0KHN0YXRlID0+IHN0YXRlLmZpbGVNYW5hZ2VyU3RhdGUucGF0aCkpXHJcbiAgICAgIC5zdWJzY3JpYmUoKHBhdGg6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIHRoaXMubm9kZXMgPSB0aGlzLm5vZGVTZXJ2aWNlLmZpbmROb2RlQnlQYXRoKHBhdGgpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIG5ld0NsaWNrZWRBY3Rpb24oKSB7XHJcbiAgICB0aGlzLm9wZW5VcGxvYWREaWFsb2cuZW1pdCh0cnVlKTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtBZnRlclZpZXdJbml0LCBDb21wb25lbnQsIENvbnRlbnRDaGlsZCwgSW5wdXQsIE9uSW5pdCwgVGVtcGxhdGVSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge05vZGVJbnRlcmZhY2V9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvbm9kZS5pbnRlcmZhY2UnO1xyXG5pbXBvcnQge1RyZWVNb2RlbH0gZnJvbSAnLi4vLi4vbW9kZWxzL3RyZWUubW9kZWwnO1xyXG5pbXBvcnQge05vZGVTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9ub2RlLnNlcnZpY2UnO1xyXG5pbXBvcnQge3NlbGVjdCwgU3RvcmV9IGZyb20gJ0BuZ3J4L3N0b3JlJztcclxuaW1wb3J0IHtBcHBTdG9yZX0gZnJvbSAnLi4vLi4vcmVkdWNlcnMvcmVkdWNlci5mYWN0b3J5JztcclxuaW1wb3J0ICogYXMgQUNUSU9OUyBmcm9tICcuLi8uLi9yZWR1Y2Vycy9hY3Rpb25zLmFjdGlvbic7XHJcbmltcG9ydCB7Zmlyc3R9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLXRyZWUnLFxyXG4gIHRlbXBsYXRlOiBgPGFwcC1ub2RlLWxpc3RlciBbc2hvd0ZpbGVzXT1cInRyZWVNb2RlbC5jb25maWcub3B0aW9ucy5zaG93RmlsZXNJbnNpZGVUcmVlXCJcclxuICAgICAgICAgICAgICAgICBbbm9kZXNdPVwie2NoaWxkcmVuOiBub2Rlc31cIj5cclxuICA8bmctdGVtcGxhdGUgbGV0LW5vZGVzPlxyXG4gICAgPG5nLWNvbnRhaW5lciBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyRpbXBsaWNpdDogbm9kZXN9XCIgW25nVGVtcGxhdGVPdXRsZXRdPVwidGVtcGxhdGVSZWZcIj48L25nLWNvbnRhaW5lcj5cclxuICA8L25nLXRlbXBsYXRlPlxyXG48L2FwcC1ub2RlLWxpc3Rlcj5cclxuYCxcclxuICBzdHlsZXM6IFtgYF1cclxufSlcclxuZXhwb3J0IGNsYXNzIFRyZWVDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkluaXQge1xyXG4gIEBDb250ZW50Q2hpbGQoVGVtcGxhdGVSZWYpIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICBASW5wdXQoKSB0cmVlTW9kZWw6IFRyZWVNb2RlbDtcclxuXHJcbiAgbm9kZXM6IE5vZGVJbnRlcmZhY2U7XHJcbiAgY3VycmVudFRyZWVMZXZlbCA9ICcnO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgbm9kZVNlcnZpY2U6IE5vZGVTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU8QXBwU3RvcmU+XHJcbiAgKSB7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMubm9kZXMgPSB0aGlzLnRyZWVNb2RlbC5ub2RlcztcclxuXHJcbiAgICAvL3RvZG8gbW92ZSB0aGlzIHN0b3JlIHRvIHByb3BlciBwbGFjZVxyXG4gICAgdGhpcy5zdG9yZVxyXG4gICAgICAucGlwZShzZWxlY3Qoc3RhdGUgPT4gc3RhdGUuZmlsZU1hbmFnZXJTdGF0ZS5wYXRoKSlcclxuICAgICAgLnN1YnNjcmliZSgocGF0aDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgdGhpcy5ub2RlU2VydmljZS5nZXROb2RlcyhwYXRoKTtcclxuXHJcbiAgICAgICAgdGhpcy5jdXJyZW50VHJlZUxldmVsID0gdGhpcy50cmVlTW9kZWwuY3VycmVudFBhdGg7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLnRyZWVNb2RlbC5jdXJyZW50UGF0aCA9IHBhdGg7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgbmdBZnRlclZpZXdJbml0KCkge1xyXG4gICAgdGhpcy5zdG9yZVxyXG4gICAgICAucGlwZShzZWxlY3Qoc3RhdGUgPT4gc3RhdGUuZmlsZU1hbmFnZXJTdGF0ZS5wYXRoKSlcclxuICAgICAgLnBpcGUoZmlyc3QoKSlcclxuICAgICAgLnN1YnNjcmliZSgocGF0aDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgbm9kZXMgPSB0aGlzLm5vZGVTZXJ2aWNlLmZpbmROb2RlQnlQYXRoKHBhdGgpO1xyXG4gICAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IEFDVElPTlMuU0VUX1NFTEVDVEVEX05PREUsIHBheWxvYWQ6IG5vZGVzfSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudCwgQ29udGVudENoaWxkLCBJbnB1dCwgT25Jbml0LCBUZW1wbGF0ZVJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7Tm9kZUludGVyZmFjZX0gZnJvbSAnLi4vLi4vLi4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1ub2RlLWxpc3RlcicsXHJcbiAgdGVtcGxhdGU6IGA8dWwgY2xhc3M9XCJub2RlLWxpc3Rlci1mbGlzdFwiPlxyXG4gIDwhLS1JbiBvcmRlciB0byBhdm9pZCBoYXZpbmcgdG8gY3JlYXRlIHRoYXQgZXh0cmEgZGl2LCB3ZSBjYW4gaW5zdGVhZCB1c2UgbmctY29udGFpbmVyIGRpcmVjdGl2ZS0tPlxyXG4gIDxuZy1jb250YWluZXIgKm5nRm9yPVwibGV0IG5vZGUgb2Ygb2JqLmtleXMobm9kZXMpXCI+XHJcbiAgICA8bGkgY2xhc3M9XCJub2RlLWxpc3Rlci1saXN0LWl0ZW1cIiAqbmdJZj1cIm5vZGVzW25vZGVdLmlzRm9sZGVyIHx8IHNob3dGaWxlc1wiPlxyXG5cclxuICAgICAgPGFwcC1ub2RlIGNsYXNzPVwibm9kZS1saXN0ZXItYXBwLW5vZGVcIiBbbm9kZV09XCJub2Rlc1tub2RlXVwiIGlkPVwidHJlZV97e25vZGVzW25vZGVdLmlkID09PSAwID8gJ3Jvb3QnIDogbm9kZXNbbm9kZV0ucGF0aFRvTm9kZX19XCI+XHJcbiAgICAgICAgPG5nLWNvbnRhaW5lciBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyRpbXBsaWNpdDogKG5vZGVzW25vZGVdKX1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwidGVtcGxhdGVSZWZcIj5cclxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cclxuICAgICAgPC9hcHAtbm9kZT5cclxuXHJcbiAgICAgIDxhcHAtbm9kZS1saXN0ZXIgY2xhc3M9XCJub2RlLWxpc3RlclwiICpuZ0lmPVwib2JqLmtleXMobm9kZXNbbm9kZV0uY2hpbGRyZW4pLmxlbmd0aCA+IDBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgIFtzaG93RmlsZXNdPVwic2hvd0ZpbGVzXCIgW25vZGVzXT1cIm5vZGVzW25vZGVdLmNoaWxkcmVuXCI+XHJcbiAgICAgICAgPG5nLXRlbXBsYXRlIGxldC1ub2Rlcz5cclxuICAgICAgICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IChub2Rlcyl9XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwidGVtcGxhdGVSZWZcIj5cclxuICAgICAgICAgIDwvbmctY29udGFpbmVyPlxyXG4gICAgICAgIDwvbmctdGVtcGxhdGU+XHJcbiAgICAgIDwvYXBwLW5vZGUtbGlzdGVyPlxyXG4gICAgPC9saT5cclxuICA8L25nLWNvbnRhaW5lcj5cclxuPC91bD5cclxuYCxcclxuICBzdHlsZXM6IFtgLm5vZGUtbGlzdGVyLWZsaXN0e21hcmdpbjowIDAgMCAxZW07cGFkZGluZzowO2xpc3Qtc3R5bGU6bm9uZTt3aGl0ZS1zcGFjZTpub3dyYXB9Lm5vZGUtbGlzdGVyLWxpc3QtaXRlbXtsaXN0LXN0eWxlOm5vbmU7bGluZS1oZWlnaHQ6MS4yZW07Zm9udC1zaXplOjFlbTtkaXNwbGF5OmlubGluZX0ubm9kZS1saXN0ZXItbGlzdC1pdGVtIC5ub2RlLWxpc3Rlci1hcHAtbm9kZS5kZXNlbGVjdGVkKy5ub2RlLWxpc3RlciB1bHtkaXNwbGF5Om5vbmV9YF1cclxufSlcclxuZXhwb3J0IGNsYXNzIE5vZGVMaXN0ZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIEBDb250ZW50Q2hpbGQoVGVtcGxhdGVSZWYpIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gIEBJbnB1dCgpIG5vZGVzOiBOb2RlSW50ZXJmYWNlO1xyXG4gIEBJbnB1dCgpIHNob3dGaWxlczogYm9vbGVhbjtcclxuXHJcbiAgb2JqID0gT2JqZWN0O1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudCwgSW5wdXQsIE9uSW5pdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7Tm9kZUludGVyZmFjZX0gZnJvbSAnLi4vLi4vLi4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XHJcbmltcG9ydCB7U3RvcmV9IGZyb20gJ0BuZ3J4L3N0b3JlJztcclxuXHJcbmltcG9ydCAqIGFzIEFDVElPTlMgZnJvbSAnLi4vLi4vLi4vcmVkdWNlcnMvYWN0aW9ucy5hY3Rpb24nO1xyXG5pbXBvcnQge0FwcFN0b3JlfSBmcm9tICcuLi8uLi8uLi9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnknO1xyXG5pbXBvcnQge05vZGVTZXJ2aWNlfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9ub2RlLnNlcnZpY2UnO1xyXG5pbXBvcnQge05vZGVDbGlja2VkU2VydmljZX0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvbm9kZS1jbGlja2VkLnNlcnZpY2UnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtbm9kZScsXHJcbiAgdGVtcGxhdGU6IGA8ZGl2ICNjdXN0b21UZW1wbGF0ZSAoZGJsY2xpY2spPVwibWV0aG9kMkNhbGxGb3JEYmxDbGljaygkZXZlbnQpXCIgKGNsaWNrKT1cIm1ldGhvZDFDYWxsRm9yQ2xpY2soJGV2ZW50KVwiPlxyXG4gIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cclxuPC9kaXY+XHJcbmAsXHJcbiAgc3R5bGVzOiBbYGBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOb2RlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBASW5wdXQoKSBub2RlOiBOb2RlSW50ZXJmYWNlO1xyXG4gIGlzU2luZ2xlQ2xpY2sgPSB0cnVlO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlPEFwcFN0b3JlPixcclxuICAgIHByaXZhdGUgbm9kZVNlcnZpY2U6IE5vZGVTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBub2RlQ2xpY2tlZFNlcnZpY2U6IE5vZGVDbGlja2VkU2VydmljZVxyXG4gICkge1xyXG4gIH1cclxuXHJcbiAgcHVibGljIG1ldGhvZDFDYWxsRm9yQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgdGhpcy5pc1NpbmdsZUNsaWNrID0gdHJ1ZTtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBpZiAodGhpcy5pc1NpbmdsZUNsaWNrKSB7XHJcbiAgICAgICAgdGhpcy5zaG93TWVudSgpO1xyXG4gICAgICB9XHJcbiAgICB9LCAyMDApO1xyXG4gIH1cclxuXHJcbiAgLy8gdG9kbyBldmVudC5wcmV2ZW50RGVmYXVsdCBmb3IgZG91YmxlIGNsaWNrXHJcbiAgcHVibGljIG1ldGhvZDJDYWxsRm9yRGJsQ2xpY2soZXZlbnQ6IGFueSkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICB0aGlzLmlzU2luZ2xlQ2xpY2sgPSBmYWxzZTtcclxuICAgIHRoaXMub3BlbigpO1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG9wZW4oKSB7XHJcbiAgICBpZiAoIXRoaXMubm9kZS5pc0ZvbGRlcikge1xyXG4gICAgICB0aGlzLm5vZGVDbGlja2VkU2VydmljZS5zdGFydERvd25sb2FkKHRoaXMubm9kZSk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5ub2RlLnN0YXlPcGVuKSB7XHJcbiAgICAgIGlmICh0aGlzLm5vZGUubmFtZSA9PSAncm9vdCcpIHtcclxuICAgICAgICB0aGlzLm5vZGVTZXJ2aWNlLmZvbGRBbGwoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogQUNUSU9OUy5TRVRfUEFUSCwgcGF5bG9hZDogdGhpcy5ub2RlLnBhdGhUb05vZGV9KTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudG9nZ2xlTm9kZUV4cGFuZGVkKCk7XHJcblxyXG4gICAgaWYgKHRoaXMubm9kZS5pc0V4cGFuZGVkKSB7XHJcbiAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IEFDVElPTlMuU0VUX1BBVEgsIHBheWxvYWQ6IHRoaXMubm9kZS5wYXRoVG9Ob2RlfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zZXROb2RlU2VsZWN0ZWRTdGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzaG93TWVudSgpIHtcclxuICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IEFDVElPTlMuU0VUX1NFTEVDVEVEX05PREUsIHBheWxvYWQ6IHRoaXMubm9kZX0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB0b2dnbGVOb2RlRXhwYW5kZWQoKSB7XHJcbiAgICB0aGlzLm5vZGUuaXNFeHBhbmRlZCA9ICF0aGlzLm5vZGUuaXNFeHBhbmRlZDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0Tm9kZVNlbGVjdGVkU3RhdGUoKSB7XHJcbiAgICBpZiAoIXRoaXMubm9kZS5pc0V4cGFuZGVkKSB7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cmVlXycgKyB0aGlzLm5vZGUucGF0aFRvTm9kZSkuY2xhc3NMaXN0LmFkZCgnZGVzZWxlY3RlZCcpO1xyXG5cclxuICAgICAgdGhpcy5ub2RlU2VydmljZS5mb2xkUmVjdXJzaXZlbHkodGhpcy5ub2RlKTtcclxuXHJcbiAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IEFDVElPTlMuU0VUX1BBVEgsIHBheWxvYWQ6IHRoaXMubm9kZS5wYXRoVG9QYXJlbnR9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cmVlXycgKyB0aGlzLm5vZGUucGF0aFRvTm9kZSkuY2xhc3NMaXN0LnJlbW92ZSgnZGVzZWxlY3RlZCcpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge1BpcGUsIFBpcGVUcmFuc2Zvcm19IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuQFBpcGUoe1xyXG4gIG5hbWU6ICdtYXBUb0l0ZXJhYmxlUGlwZSdcclxufSlcclxuZXhwb3J0IGNsYXNzIE1hcFRvSXRlcmFibGVQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XHJcbiAgdHJhbnNmb3JtKGRpY3Q6IE9iamVjdCkge1xyXG4gICAgY29uc3QgYSA9IFtdO1xyXG4gICAgZm9yIChjb25zdCBrZXkgaW4gZGljdCkge1xyXG4gICAgICBpZiAoZGljdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgYS5wdXNoKHtrZXk6IGtleSwgdmFsOiBkaWN0W2tleV19KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudCwgT25Jbml0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtzZWxlY3QsIFN0b3JlfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcbmltcG9ydCAqIGFzIEFDVElPTlMgZnJvbSAnLi4vLi4vcmVkdWNlcnMvYWN0aW9ucy5hY3Rpb24nO1xyXG5pbXBvcnQge0FwcFN0b3JlfSBmcm9tICcuLi8uLi9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnknO1xyXG5pbXBvcnQge05vZGVTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9ub2RlLnNlcnZpY2UnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtbmF2LWJhcicsXHJcbiAgdGVtcGxhdGU6IGA8ZGl2PlxyXG4gID4+IDxzcGFuICpuZ0Zvcj1cImxldCB0byBvZiBjdXJyZW50UGF0aDsgbGV0IGkgPSBpbmRleFwiPlxyXG4gIDxhIGNsYXNzPVwibGlua1wiIChjbGljayk9XCJvbkNsaWNrKGN1cnJlbnRQYXRoLCBpKVwiPlxyXG4gICAgPGRpdiAqbmdJZj1cInRvID09PSAnJyB8fCB0byA9PT0gJ3Jvb3QnOyB0aGVuIGljb24gZWxzZSBuYW1lXCI+PC9kaXY+XHJcbiAgICA8bmctdGVtcGxhdGUgI2ljb24+PGkgY2xhc3M9XCJmYXMgZmEtaG9tZVwiPjwvaT48L25nLXRlbXBsYXRlPlxyXG4gICAgPG5nLXRlbXBsYXRlICNuYW1lPnt7dG99fTwvbmctdGVtcGxhdGU+XHJcbiAgPC9hPiAvXHJcbiAgPC9zcGFuPlxyXG48L2Rpdj5cclxuYCxcclxuICBzdHlsZXM6IFtgYF1cclxufSlcclxuZXhwb3J0IGNsYXNzIE5hdkJhckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgY3VycmVudFBhdGg6IHN0cmluZ1tdO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlPEFwcFN0b3JlPixcclxuICAgIHByaXZhdGUgbm9kZVNlcnZpY2U6IE5vZGVTZXJ2aWNlXHJcbiAgKSB7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMuc3RvcmVcclxuICAgICAgLnBpcGUoc2VsZWN0KHN0YXRlID0+IHN0YXRlLmZpbGVNYW5hZ2VyU3RhdGUucGF0aCkpXHJcbiAgICAgIC5zdWJzY3JpYmUoKGRhdGE6IHN0cmluZykgPT4ge1xyXG4gICAgICAgIHRoaXMubm9kZVNlcnZpY2UuY3VycmVudFBhdGggPSBkYXRhO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBhdGggPSBkYXRhLnNwbGl0KCcvJyk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgb25DbGljayhwYXRoOiBzdHJpbmdbXSwgaW5kZXg6IG51bWJlcikge1xyXG4gICAgY29uc3QgbmV3UGF0aCA9IHBhdGguc2xpY2UoMCwgaW5kZXggKyAxKS5qb2luKCcvJyk7XHJcbiAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9QQVRILCBwYXlsb2FkOiBuZXdQYXRofSk7XHJcbiAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQge1N0YXRlSW50ZXJmYWNlfSBmcm9tICcuLi9pbnRlcmZhY2VzL3N0YXRlLmludGVyZmFjZSc7XHJcbmltcG9ydCAqIGFzIEFDVElPTlMgZnJvbSAnLi9hY3Rpb25zLmFjdGlvbic7XHJcblxyXG5jb25zdCBpbml0aWFsU3RhdGU6IFN0YXRlSW50ZXJmYWNlID0ge1xyXG4gIHBhdGg6ICcnLFxyXG4gIGlzTG9hZGluZzogdHJ1ZSxcclxuICBzZWxlY3RlZE5vZGU6IG51bGxcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBzdGF0ZVJlZHVjZXIoc3RhdGU6IFN0YXRlSW50ZXJmYWNlID0gaW5pdGlhbFN0YXRlLCBhY3Rpb246IEFDVElPTlMuQWN0aW9ucyk6IFN0YXRlSW50ZXJmYWNlIHtcclxuICAvLyBjb25zb2xlLmxvZygnUHJldmlvdXMgc3RhdGU6ICcsIHN0YXRlKTtcclxuICAvLyBjb25zb2xlLmxvZygnQUNUSU9OIHR5cGU6ICcsIGFjdGlvbi50eXBlKTtcclxuICAvLyBjb25zb2xlLmxvZygnQUNUSU9OIHBheWxvYWQ6ICcsIGFjdGlvbi5wYXlsb2FkKTtcclxuXHJcbiAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgY2FzZSBBQ1RJT05TLlNFVF9QQVRIIDpcclxuICAgICAgaWYgKHN0YXRlLnBhdGggPT09IGFjdGlvbi5wYXlsb2FkKSB7XHJcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB7Li4uc3RhdGUsIHBhdGg6IGFjdGlvbi5wYXlsb2FkLCBpc0xvYWRpbmc6IHRydWV9O1xyXG4gICAgY2FzZSBBQ1RJT05TLlNFVF9MT0FESU5HX1NUQVRFIDpcclxuICAgICAgcmV0dXJuIHsuLi5zdGF0ZSwgaXNMb2FkaW5nOiBhY3Rpb24ucGF5bG9hZH07XHJcbiAgICBjYXNlIEFDVElPTlMuU0VUX1NFTEVDVEVEX05PREUgOlxyXG4gICAgICByZXR1cm4gey4uLnN0YXRlLCBzZWxlY3RlZE5vZGU6IGFjdGlvbi5wYXlsb2FkfTtcclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBpbml0aWFsU3RhdGU7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7c3RhdGVSZWR1Y2VyfSBmcm9tICcuL3N0YXRlUmVkdWNlcic7XHJcbmltcG9ydCB7QWN0aW9uUmVkdWNlck1hcH0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5pbXBvcnQge1N0YXRlSW50ZXJmYWNlfSBmcm9tICcuLi9pbnRlcmZhY2VzL3N0YXRlLmludGVyZmFjZSc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEFwcFN0b3JlIHtcclxuICBmaWxlTWFuYWdlclN0YXRlOiBTdGF0ZUludGVyZmFjZTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHJlZHVjZXJzOiBBY3Rpb25SZWR1Y2VyTWFwPEFwcFN0b3JlPiA9IHtcclxuICBmaWxlTWFuYWdlclN0YXRlOiBzdGF0ZVJlZHVjZXJcclxufTtcclxuIiwiaW1wb3J0IHtDb21wb25lbnQsIElucHV0LCBPbkluaXQsIFRlbXBsYXRlUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtffSBmcm9tICdAYmllc2JqZXJnL25neC10cmFuc2xhdGUtZXh0cmFjdC9kaXN0L3V0aWxzL3V0aWxzJztcclxuaW1wb3J0IHt0aW1lcn0gZnJvbSAncnhqcyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1sb2FkaW5nLW92ZXJsYXknLFxyXG4gIHRlbXBsYXRlOiBgPG5nLWNvbnRhaW5lclxyXG4gIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7JGltcGxpY2l0OiB0aW1lb3V0TWVzc2FnZX1cIlxyXG4gIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImxvYWRpbmdPdmVybGF5VGVtcGxhdGVcIj5cclxuPC9uZy1jb250YWluZXI+XHJcbmAsXHJcbiAgc3R5bGVzOiBbYGBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBMb2FkaW5nT3ZlcmxheUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgQElucHV0KCkgbG9hZGluZ092ZXJsYXlUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICB0aW1lb3V0TWVzc2FnZTogYW55O1xyXG5cclxuICAvLyB0b2RvIHVuc3Vic2NyaWJlIGZyb20gJ2xpc3QnIGV2ZW50IC0gbm93IHdlIGFyZSBvbmx5IGRpc21pc3NpbmcgdGhpcyBjb21wb25lbnRcclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRpbWVyKDIwMDApLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgIHRoaXMudGltZW91dE1lc3NhZ2UgPSBfKCdUcm91YmxlcyB3aXRoIGxvYWRpbmc/IENsaWNrIGFueXdoZXJlIHRvIGNhbmNlbCBsb2FkaW5nJyk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgUGlwZSwgUGlwZVRyYW5zZm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuLypcclxuICogQ29udmVydCBieXRlcyBpbnRvIGxhcmdlc3QgcG9zc2libGUgdW5pdC5cclxuICogVGFrZXMgYW4gcHJlY2lzaW9uIGFyZ3VtZW50IHRoYXQgZGVmYXVsdHMgdG8gMi5cclxuICogVXNhZ2U6XHJcbiAqICAgYnl0ZXMgfCBmaWxlU2l6ZTpwcmVjaXNpb25cclxuICogRXhhbXBsZTpcclxuICogICB7eyAxMDI0IHwgIGZpbGVTaXplfX1cclxuICogICBmb3JtYXRzIHRvOiAxIEtCXHJcbiovXHJcbkBQaXBlKHtuYW1lOiAnZmlsZVNpemUnfSlcclxuZXhwb3J0IGNsYXNzIEZpbGVTaXplUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xyXG5cclxuICBwcml2YXRlIHVuaXRzID0gW1xyXG4gICAgJ2J5dGVzJyxcclxuICAgICdLQicsXHJcbiAgICAnTUInLFxyXG4gICAgJ0dCJyxcclxuICAgICdUQicsXHJcbiAgICAnUEInXHJcbiAgXTtcclxuXHJcbiAgdHJhbnNmb3JtKGJ5dGVzOiBudW1iZXIgPSAwLCBwcmVjaXNpb246IG51bWJlciA9IDIgKSA6IHN0cmluZyB7XHJcbiAgICBpZiAoIGlzTmFOKCBwYXJzZUZsb2F0KCBTdHJpbmcoYnl0ZXMpICkpIHx8ICEgaXNGaW5pdGUoIGJ5dGVzICkgKSByZXR1cm4gJz8nO1xyXG5cclxuICAgIGxldCB1bml0ID0gMDtcclxuXHJcbiAgICB3aGlsZSAoIGJ5dGVzID49IDEwMjQgKSB7XHJcbiAgICAgIGJ5dGVzIC89IDEwMjQ7XHJcbiAgICAgIHVuaXQgKys7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGJ5dGVzLnRvRml4ZWQoICsgcHJlY2lzaW9uICkgKyAnICcgKyB0aGlzLnVuaXRzWyB1bml0IF07XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7QWZ0ZXJWaWV3SW5pdCwgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge0h0dHBDbGllbnR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHtGaW5lVXBsb2FkZXJ9IGZyb20gJ2ZpbmUtdXBsb2FkZXInO1xyXG5pbXBvcnQge05vZGVTZXJ2aWNlfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9ub2RlLnNlcnZpY2UnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtdXBsb2FkJyxcclxuICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJiYWNrZHJvcFwiIChjbGljayk9XCJuZXdDbGlja2VkQWN0aW9uKClcIj48L2Rpdj5cclxuPGRpdiBjbGFzcz1cInVwbG9hZC1iYWNrZ3JvdW5kXCI+XHJcbiAgPGRpdiBjbGFzcz1cImJ1dHRvbnNcIj5cclxuICAgIDxidXR0b24gY2xhc3M9XCJidXR0b25cIiBbZGlzYWJsZWRdPVwibmV3Rm9sZGVyXCIgKGNsaWNrKT1cImNyZWF0ZU5ld0ZvbGRlcigpXCIgdHJhbnNsYXRlPkNyZWF0ZSBuZXcgZm9sZGVyPC9idXR0b24+XHJcbiAgPC9kaXY+XHJcblxyXG4gIDxkaXYgKm5nSWY9XCJuZXdGb2xkZXJcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJidXR0b25zXCI+XHJcbiAgICAgIDxhcHAtbmV3LWZvbGRlciAoYnV0dG9uQ2xpY2tlZCk9XCJjcmVhdGVOZXdGb2xkZXIoJGV2ZW50KVwiPjwvYXBwLW5ldy1mb2xkZXI+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuXHJcbiAgPGRpdiBpZD1cImZpbmUtdXBsb2FkZXJcIj5cclxuICA8L2Rpdj5cclxuXHJcblxyXG4gIDxkaXYgY2xhc3M9XCJidXR0b25zXCI+XHJcbiAgICA8YnV0dG9uIGNsYXNzPVwiYnV0dG9uIGJpZ1wiIFtkaXNhYmxlZF09XCJ0aGlzLmNvdW50ZXIgPCAxXCIgKGNsaWNrKT1cInVwbG9hZEZpbGVzKClcIiB0cmFuc2xhdGU+XHJcbiAgICAgIFVwbG9hZFxyXG4gICAgPC9idXR0b24+XHJcbiAgICA8YnV0dG9uIGNsYXNzPVwiYnV0dG9uIGJpZ1wiIChjbGljayk9XCJuZXdDbGlja2VkQWN0aW9uKClcIiB0cmFuc2xhdGU+XHJcbiAgICAgIENsb3NlXHJcbiAgICA8L2J1dHRvbj5cclxuICA8L2Rpdj5cclxuXHJcbjwvZGl2PlxyXG5cclxuPGRpdiBpZD1cImZpbmUtdXBsb2FkZXItdGVtcGxhdGVcIiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCI+XHJcbiAgPGRpdiBjbGFzcz1cInFxLXVwbG9hZGVyLXNlbGVjdG9yIHFxLXVwbG9hZGVyXCIgcXEtZHJvcC1hcmVhLXRleHQ9XCJEcm9wIGZpbGVzIGhlcmVcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJxcS11cGxvYWQtZHJvcC1hcmVhLXNlbGVjdG9yIHFxLXVwbG9hZC1kcm9wLWFyZWFcIiBxcS1oaWRlLWRyb3B6b25lPlxyXG4gICAgICA8c3BhbiBjbGFzcz1cInFxLXVwbG9hZC1kcm9wLWFyZWEtdGV4dC1zZWxlY3RvclwiPjwvc3Bhbj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJ1cGxvYWQtdG9wLWJhclwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicXEtdXBsb2FkLWJ1dHRvbi1zZWxlY3RvciBxcS11cGxvYWQtYnV0dG9uXCI+XHJcbiAgICAgICAgPGRpdiB0cmFuc2xhdGU+VXBsb2FkIGEgZmlsZTwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3M9XCJxcS10b3RhbC1wcm9ncmVzcy1iYXItY29udGFpbmVyLXNlbGVjdG9yIHFxLXRvdGFsLXByb2dyZXNzLWJhci1jb250YWluZXJcIj5cclxuICAgICAgICA8ZGl2IHJvbGU9XCJwcm9ncmVzc2JhclwiIGFyaWEtdmFsdWVub3c9XCIwXCIgYXJpYS12YWx1ZW1pbj1cIjBcIiBhcmlhLXZhbHVlbWF4PVwiMTAwXCJcclxuICAgICAgICAgICAgIGNsYXNzPVwicXEtdG90YWwtcHJvZ3Jlc3MtYmFyLXNlbGVjdG9yIHFxLXByb2dyZXNzLWJhciBxcS10b3RhbC1wcm9ncmVzcy1iYXJcIj48L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8c3BhbiBjbGFzcz1cInFxLWRyb3AtcHJvY2Vzc2luZy1zZWxlY3RvciBxcS1kcm9wLXByb2Nlc3NpbmdcIj5cclxuICAgICAgICAgICAgPHNwYW4gdHJhbnNsYXRlPlByb2Nlc3NpbmcgZHJvcHBlZCBmaWxlczwvc3Bhbj4uLi5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJxcS1kcm9wLXByb2Nlc3Npbmctc3Bpbm5lci1zZWxlY3RvciBxcS1kcm9wLXByb2Nlc3Npbmctc3Bpbm5lclwiPjwvc3Bhbj5cclxuICAgIDwvc3Bhbj5cclxuXHJcbiAgICA8dWwgY2xhc3M9XCJxcS11cGxvYWQtbGlzdC1zZWxlY3RvciBxcS11cGxvYWQtbGlzdFwiIGFyaWEtbGl2ZT1cInBvbGl0ZVwiIGFyaWEtcmVsZXZhbnQ9XCJhZGRpdGlvbnMgcmVtb3ZhbHNcIj5cclxuICAgICAgPGxpPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJxcS1wcm9ncmVzcy1iYXItY29udGFpbmVyLXNlbGVjdG9yXCI+XHJcbiAgICAgICAgICA8ZGl2IHJvbGU9XCJwcm9ncmVzc2JhclwiIGFyaWEtdmFsdWVub3c9XCIwXCIgYXJpYS12YWx1ZW1pbj1cIjBcIiBhcmlhLXZhbHVlbWF4PVwiMTAwXCJcclxuICAgICAgICAgICAgICAgY2xhc3M9XCJxcS1wcm9ncmVzcy1iYXItc2VsZWN0b3IgcXEtcHJvZ3Jlc3MtYmFyXCI+PC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJxcS11cGxvYWQtc3Bpbm5lci1zZWxlY3RvciBxcS11cGxvYWQtc3Bpbm5lclwiPjwvc3Bhbj5cclxuICAgICAgICA8aW1nIGNsYXNzPVwicXEtdGh1bWJuYWlsLXNlbGVjdG9yXCIgcXEtbWF4LXNpemU9XCIxMDBcIiBxcS1zZXJ2ZXItc2NhbGU+XHJcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJxcS11cGxvYWQtZmlsZS1zZWxlY3RvciBxcS11cGxvYWQtZmlsZVwiPjwvc3Bhbj5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cInFxLWVkaXQtZmlsZW5hbWUtaWNvbi1zZWxlY3RvciBxcS1lZGl0LWZpbGVuYW1lLWljb25cIiBhcmlhLWxhYmVsPVwiRWRpdCBmaWxlbmFtZVwiPjwvc3Bhbj5cclxuICAgICAgICA8aW5wdXQgY2xhc3M9XCJxcS1lZGl0LWZpbGVuYW1lLXNlbGVjdG9yIHFxLWVkaXQtZmlsZW5hbWVcIiB0YWJpbmRleD1cIjBcIiB0eXBlPVwidGV4dFwiPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwicXEtdXBsb2FkLXNpemUtc2VsZWN0b3IgcXEtdXBsb2FkLXNpemVcIj48L3NwYW4+XHJcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJxcS1idG4gcXEtdXBsb2FkLWNhbmNlbC1zZWxlY3RvciBxcS11cGxvYWQtY2FuY2VsXCIgdHJhbnNsYXRlPkNhbmNlbDwvYnV0dG9uPlxyXG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicXEtYnRuIHFxLXVwbG9hZC1yZXRyeS1zZWxlY3RvciBxcS11cGxvYWQtcmV0cnlcIiB0cmFuc2xhdGU+UmV0cnk8L2J1dHRvbj5cclxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInFxLWJ0biBxcS11cGxvYWQtZGVsZXRlLXNlbGVjdG9yIHFxLXVwbG9hZC1kZWxldGVcIiB0cmFuc2xhdGU+RGVsZXRlPC9idXR0b24+XHJcbiAgICAgICAgPHNwYW4gcm9sZT1cInN0YXR1c1wiIGNsYXNzPVwicXEtdXBsb2FkLXN0YXR1cy10ZXh0LXNlbGVjdG9yIHFxLXVwbG9hZC1zdGF0dXMtdGV4dFwiPjwvc3Bhbj5cclxuICAgICAgPC9saT5cclxuICAgIDwvdWw+XHJcblxyXG4gICAgPGRpYWxvZyBjbGFzcz1cInFxLWFsZXJ0LWRpYWxvZy1zZWxlY3RvclwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicXEtZGlhbG9nLW1lc3NhZ2Utc2VsZWN0b3JcIj48L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cInFxLWRpYWxvZy1idXR0b25zXCI+XHJcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJxcS1jYW5jZWwtYnV0dG9uLXNlbGVjdG9yXCIgdHJhbnNsYXRlPkNsb3NlPC9idXR0b24+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaWFsb2c+XHJcblxyXG4gICAgPGRpYWxvZyBjbGFzcz1cInFxLWNvbmZpcm0tZGlhbG9nLXNlbGVjdG9yXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJxcS1kaWFsb2ctbWVzc2FnZS1zZWxlY3RvclwiPjwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicXEtZGlhbG9nLWJ1dHRvbnNcIj5cclxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInFxLWNhbmNlbC1idXR0b24tc2VsZWN0b3JcIiB0cmFuc2xhdGU+Tm88L2J1dHRvbj5cclxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInFxLW9rLWJ1dHRvbi1zZWxlY3RvclwiIHRyYW5zbGF0ZT5ZZXM8L2J1dHRvbj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2RpYWxvZz5cclxuXHJcbiAgICA8ZGlhbG9nIGNsYXNzPVwicXEtcHJvbXB0LWRpYWxvZy1zZWxlY3RvclwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicXEtZGlhbG9nLW1lc3NhZ2Utc2VsZWN0b3JcIj48L2Rpdj5cclxuICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJxcS1kaWFsb2ctYnV0dG9uc1wiPlxyXG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicXEtY2FuY2VsLWJ1dHRvbi1zZWxlY3RvclwiIHRyYW5zbGF0ZT5DYW5jZWw8L2J1dHRvbj5cclxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInFxLW9rLWJ1dHRvbi1zZWxlY3RvclwiIHRyYW5zbGF0ZT5PazwvYnV0dG9uPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGlhbG9nPlxyXG4gIDwvZGl2PlxyXG48L2Rpdj5cclxuYCxcclxuICBzdHlsZXM6IFtgLnVwbG9hZC1jb250ZW50e3RleHQtYWxpZ246Y2VudGVyO21heC1oZWlnaHQ6MjV2aDtvdmVyZmxvdzphdXRvO21hcmdpbjoxMHB4IGF1dG99LmZhLXRpbWVzOmJlZm9yZXtjb250ZW50OlwiXFxcXGYwMGRcIn0uYnV0dG9uc3tiYWNrZ3JvdW5kOiNmZmY7cGFkZGluZzo1cHg7bWFyZ2luOjEwcHggMH1gLCBgLnFxLXVwbG9hZC1idXR0b24gZGl2e2xpbmUtaGVpZ2h0OjI1cHh9LnFxLXVwbG9hZC1idXR0b24tZm9jdXN7b3V0bGluZTowfS5xcS11cGxvYWRlcntwb3NpdGlvbjpyZWxhdGl2ZTttaW4taGVpZ2h0OjIwMHB4O21heC1oZWlnaHQ6NDkwcHg7b3ZlcmZsb3cteTpoaWRkZW47d2lkdGg6aW5oZXJpdDtib3JkZXItcmFkaXVzOjZweDtiYWNrZ3JvdW5kLWNvbG9yOiNmZGZkZmQ7Ym9yZGVyOjFweCBkYXNoZWQgI2NjYztwYWRkaW5nOjIwcHh9LnFxLXVwbG9hZGVyOmJlZm9yZXtjb250ZW50OmF0dHIocXEtZHJvcC1hcmVhLXRleHQpIFwiIFwiO3Bvc2l0aW9uOmFic29sdXRlO2ZvbnQtc2l6ZToyMDAlO2xlZnQ6MDt3aWR0aDoxMDAlO3RleHQtYWxpZ246Y2VudGVyO3RvcDo0NSU7b3BhY2l0eTouMjV9LnFxLXVwbG9hZC1kcm9wLWFyZWEsLnFxLXVwbG9hZC1leHRyYS1kcm9wLWFyZWF7cG9zaXRpb246YWJzb2x1dGU7dG9wOjA7bGVmdDowO3dpZHRoOjEwMCU7aGVpZ2h0OjEwMCU7bWluLWhlaWdodDozMHB4O3otaW5kZXg6MjtiYWNrZ3JvdW5kOiNmOWY5Zjk7Ym9yZGVyLXJhZGl1czo0cHg7Ym9yZGVyOjFweCBkYXNoZWQgI2NjYzt0ZXh0LWFsaWduOmNlbnRlcn0ucXEtdXBsb2FkLWRyb3AtYXJlYSBzcGFue2Rpc3BsYXk6YmxvY2s7cG9zaXRpb246YWJzb2x1dGU7dG9wOjUwJTt3aWR0aDoxMDAlO21hcmdpbi10b3A6LThweDtmb250LXNpemU6MTZweH0ucXEtdXBsb2FkLWV4dHJhLWRyb3AtYXJlYXtwb3NpdGlvbjpyZWxhdGl2ZTttYXJnaW4tdG9wOjUwcHg7Zm9udC1zaXplOjE2cHg7cGFkZGluZy10b3A6MzBweDtoZWlnaHQ6MjBweDttaW4taGVpZ2h0OjQwcHh9LnFxLXVwbG9hZC1kcm9wLWFyZWEtYWN0aXZle2JhY2tncm91bmQ6I2ZkZmRmZDtib3JkZXItcmFkaXVzOjRweDtib3JkZXI6MXB4IGRhc2hlZCAjY2NjfS5xcS11cGxvYWQtbGlzdHttYXJnaW46MDtwYWRkaW5nOjA7bGlzdC1zdHlsZTpub25lO21heC1oZWlnaHQ6NDUwcHg7b3ZlcmZsb3cteTphdXRvO2NsZWFyOmJvdGh9LnFxLXVwbG9hZC1saXN0IGxpe21hcmdpbjowO3BhZGRpbmc6OXB4O2xpbmUtaGVpZ2h0OjE1cHg7Zm9udC1zaXplOjE2cHg7Y29sb3I6IzQyNDI0MjtiYWNrZ3JvdW5kLWNvbG9yOiNmNmY2ZjY7Ym9yZGVyLXRvcDoxcHggc29saWQgI2ZmZjtib3JkZXItYm90dG9tOjFweCBzb2xpZCAjZGRkfS5xcS11cGxvYWQtbGlzdCBsaTpmaXJzdC1jaGlsZHtib3JkZXItdG9wOm5vbmV9LnFxLXVwbG9hZC1saXN0IGxpOmxhc3QtY2hpbGR7Ym9yZGVyLWJvdHRvbTpub25lfS5xcS11cGxvYWQtY2FuY2VsLC5xcS11cGxvYWQtY29udGludWUsLnFxLXVwbG9hZC1kZWxldGUsLnFxLXVwbG9hZC1mYWlsZWQtdGV4dCwucXEtdXBsb2FkLWZpbGUsLnFxLXVwbG9hZC1wYXVzZSwucXEtdXBsb2FkLXJldHJ5LC5xcS11cGxvYWQtc2l6ZSwucXEtdXBsb2FkLXNwaW5uZXJ7bWFyZ2luLXJpZ2h0OjEycHg7ZGlzcGxheTppbmxpbmV9LnFxLXVwbG9hZC1maWxle3ZlcnRpY2FsLWFsaWduOm1pZGRsZTtkaXNwbGF5OmlubGluZS1ibG9jazt3aWR0aDozMDBweDt0ZXh0LW92ZXJmbG93OmVsbGlwc2lzO3doaXRlLXNwYWNlOm5vd3JhcDtvdmVyZmxvdy14OmhpZGRlbjtoZWlnaHQ6MThweH0ucXEtdXBsb2FkLXNwaW5uZXJ7ZGlzcGxheTppbmxpbmUtYmxvY2s7YmFja2dyb3VuZDp1cmwobG9hZGluZy5naWYpO3dpZHRoOjE1cHg7aGVpZ2h0OjE1cHg7dmVydGljYWwtYWxpZ246dGV4dC1ib3R0b219LnFxLWRyb3AtcHJvY2Vzc2luZ3tkaXNwbGF5OmJsb2NrfS5xcS1kcm9wLXByb2Nlc3Npbmctc3Bpbm5lcntkaXNwbGF5OmlubGluZS1ibG9jaztiYWNrZ3JvdW5kOnVybChwcm9jZXNzaW5nLmdpZik7d2lkdGg6MjRweDtoZWlnaHQ6MjRweDt2ZXJ0aWNhbC1hbGlnbjp0ZXh0LWJvdHRvbX0ucXEtdXBsb2FkLWNhbmNlbCwucXEtdXBsb2FkLWNvbnRpbnVlLC5xcS11cGxvYWQtZGVsZXRlLC5xcS11cGxvYWQtcGF1c2UsLnFxLXVwbG9hZC1yZXRyeSwucXEtdXBsb2FkLXNpemV7Zm9udC1zaXplOjEycHg7Zm9udC13ZWlnaHQ6NDAwO2N1cnNvcjpwb2ludGVyO3ZlcnRpY2FsLWFsaWduOm1pZGRsZX0ucXEtdXBsb2FkLXN0YXR1cy10ZXh0e2ZvbnQtc2l6ZToxNHB4O2ZvbnQtd2VpZ2h0OjcwMDtkaXNwbGF5OmJsb2NrfS5xcS11cGxvYWQtZmFpbGVkLXRleHR7ZGlzcGxheTpub25lO2ZvbnQtc3R5bGU6aXRhbGljO2ZvbnQtd2VpZ2h0OjcwMH0ucXEtdXBsb2FkLWZhaWxlZC1pY29ue2Rpc3BsYXk6bm9uZTt3aWR0aDoxNXB4O2hlaWdodDoxNXB4O3ZlcnRpY2FsLWFsaWduOnRleHQtYm90dG9tfS5xcS11cGxvYWQtZmFpbCAucXEtdXBsb2FkLWZhaWxlZC10ZXh0LC5xcS11cGxvYWQtcmV0cnlpbmcgLnFxLXVwbG9hZC1mYWlsZWQtdGV4dHtkaXNwbGF5OmlubGluZX0ucXEtdXBsb2FkLWxpc3QgbGkucXEtdXBsb2FkLXN1Y2Nlc3N7YmFja2dyb3VuZC1jb2xvcjojZWJmNmUwO2NvbG9yOiM0MjQyNDI7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgI2QzZGVkMTtib3JkZXItdG9wOjFweCBzb2xpZCAjZjdmZmY1fS5xcS11cGxvYWQtbGlzdCBsaS5xcS11cGxvYWQtZmFpbHtiYWNrZ3JvdW5kLWNvbG9yOiNmNWQ3ZDc7Y29sb3I6IzQyNDI0Mjtib3JkZXItYm90dG9tOjFweCBzb2xpZCAjZGVjYWNhO2JvcmRlci10b3A6MXB4IHNvbGlkICNmY2U2ZTZ9LnFxLXRvdGFsLXByb2dyZXNzLWJhcntoZWlnaHQ6MjVweDtib3JkZXItcmFkaXVzOjlweH1JTlBVVC5xcS1lZGl0LWZpbGVuYW1le3Bvc2l0aW9uOmFic29sdXRlO29wYWNpdHk6MDt6LWluZGV4Oi0xfS5xcS11cGxvYWQtZmlsZS5xcS1lZGl0YWJsZXtjdXJzb3I6cG9pbnRlcjttYXJnaW4tcmlnaHQ6NHB4fS5xcS1lZGl0LWZpbGVuYW1lLWljb24ucXEtZWRpdGFibGV7ZGlzcGxheTppbmxpbmUtYmxvY2s7Y3Vyc29yOnBvaW50ZXJ9SU5QVVQucXEtZWRpdC1maWxlbmFtZS5xcS1lZGl0aW5ne3Bvc2l0aW9uOnN0YXRpYztoZWlnaHQ6MjhweDtwYWRkaW5nOjAgOHB4O21hcmdpbi1yaWdodDoxMHB4O21hcmdpbi1ib3R0b206LTVweDtib3JkZXI6MXB4IHNvbGlkICNjY2M7Ym9yZGVyLXJhZGl1czoycHg7Zm9udC1zaXplOjE2cHg7b3BhY2l0eToxfS5xcS1lZGl0LWZpbGVuYW1lLWljb257ZGlzcGxheTpub25lO2JhY2tncm91bmQ6dXJsKGVkaXQuZ2lmKTt3aWR0aDoxNXB4O2hlaWdodDoxNXB4O3ZlcnRpY2FsLWFsaWduOnRleHQtYm90dG9tO21hcmdpbi1yaWdodDoxNnB4fS5xcS1oaWRle2Rpc3BsYXk6bm9uZX0ucXEtdGh1bWJuYWlsLXNlbGVjdG9ye3ZlcnRpY2FsLWFsaWduOm1pZGRsZTttYXJnaW4tcmlnaHQ6MTJweH0ucXEtdXBsb2FkZXIgRElBTE9He2Rpc3BsYXk6bm9uZX0ucXEtdXBsb2FkZXIgRElBTE9HW29wZW5de2Rpc3BsYXk6YmxvY2t9LnFxLXVwbG9hZGVyIERJQUxPRyAucXEtZGlhbG9nLWJ1dHRvbnN7dGV4dC1hbGlnbjpjZW50ZXI7cGFkZGluZy10b3A6MTBweH0ucXEtdXBsb2FkZXIgRElBTE9HIC5xcS1kaWFsb2ctYnV0dG9ucyBCVVRUT057bWFyZ2luLWxlZnQ6NXB4O21hcmdpbi1yaWdodDo1cHh9LnFxLXVwbG9hZGVyIERJQUxPRyAucXEtZGlhbG9nLW1lc3NhZ2Utc2VsZWN0b3J7cGFkZGluZy1ib3R0b206MTBweH0ucXEtdXBsb2FkZXIgRElBTE9HOjotd2Via2l0LWJhY2tkcm9we2JhY2tncm91bmQtY29sb3I6cmdiYSgwLDAsMCwuNyl9LnFxLXVwbG9hZGVyIERJQUxPRzo6YmFja2Ryb3B7YmFja2dyb3VuZC1jb2xvcjpyZ2JhKDAsMCwwLC43KX1gXSxcclxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBVcGxvYWRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQge1xyXG4gIEBJbnB1dCgpIG9wZW5EaWFsb2c7XHJcblxyXG4gIEBPdXRwdXQoKSBjbG9zZURpYWxvZyA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBAT3V0cHV0KCkgY3JlYXRlRGlyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICB1cGxvYWRlcjogRmluZVVwbG9hZGVyO1xyXG4gIG5ld0ZvbGRlciA9IGZhbHNlO1xyXG4gIGNvdW50ZXIgPSAwO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSBub2RlU2VydmljZTogTm9kZVNlcnZpY2UpIHtcclxuICB9XHJcblxyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuICAgIHRoaXMudXBsb2FkZXIgPSBuZXcgRmluZVVwbG9hZGVyKHtcclxuICAgICAgZGVidWc6IGZhbHNlLFxyXG4gICAgICBhdXRvVXBsb2FkOiBmYWxzZSxcclxuICAgICAgbWF4Q29ubmVjdGlvbnM6IDEsIC8vIHRvZG8gY29uZmlndXJhYmxlXHJcbiAgICAgIGVsZW1lbnQ6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5lLXVwbG9hZGVyJyksXHJcbiAgICAgIHRlbXBsYXRlOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZS11cGxvYWRlci10ZW1wbGF0ZScpLFxyXG4gICAgICByZXF1ZXN0OiB7XHJcbiAgICAgICAgZW5kcG9pbnQ6IHRoaXMubm9kZVNlcnZpY2UudHJlZS5jb25maWcuYmFzZVVSTCArIHRoaXMubm9kZVNlcnZpY2UudHJlZS5jb25maWcuYXBpLnVwbG9hZEZpbGUsXHJcbiAgICAgICAgLy8gZm9yY2VNdWx0aXBhcnQ6IGZhbHNlLFxyXG4gICAgICAgIHBhcmFtc0luQm9keTogZmFsc2UsXHJcbiAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICBwYXJlbnRQYXRoOiB0aGlzLmdldEN1cnJlbnRQYXRoXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICByZXRyeToge1xyXG4gICAgICAgIGVuYWJsZUF1dG86IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIGNhbGxiYWNrczoge1xyXG4gICAgICAgIG9uU3VibWl0dGVkOiAoKSA9PiB0aGlzLmNvdW50ZXIrKyxcclxuICAgICAgICBvbkNhbmNlbDogKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5jb3VudGVyIDwgMCA/IGNvbnNvbGUud2Fybignd3RmPycpIDogdGhpcy5jb3VudGVyLS07XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbkFsbENvbXBsZXRlOiAoc3VjYzogYW55LCBmYWlsOiBhbnkpID0+IHtcclxuICAgICAgICAgIGlmIChzdWNjLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb3VudGVyID0gMDtcclxuICAgICAgICAgICAgdGhpcy5ub2RlU2VydmljZS5yZWZyZXNoQ3VycmVudFBhdGgoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICA7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICB9XHJcblxyXG4gIGdldCBnZXRDdXJyZW50UGF0aCgpIHtcclxuICAgIGNvbnN0IHBhcmVudFBhdGggPSB0aGlzLm5vZGVTZXJ2aWNlLmZpbmROb2RlQnlQYXRoKHRoaXMubm9kZVNlcnZpY2UuY3VycmVudFBhdGgpLmlkO1xyXG4gICAgcmV0dXJuIHBhcmVudFBhdGggPT09IDAgPyAnJyA6IHBhcmVudFBhdGg7XHJcbiAgfVxyXG5cclxuICB1cGxvYWRGaWxlcygpIHtcclxuICAgIHRoaXMudXBsb2FkZXIudXBsb2FkU3RvcmVkRmlsZXMoKTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZU5ld0ZvbGRlcihpbnB1dD86IHN0cmluZykge1xyXG4gICAgaWYgKCF0aGlzLm5ld0ZvbGRlcikge1xyXG4gICAgICB0aGlzLm5ld0ZvbGRlciA9IHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLm5ld0ZvbGRlciA9IGZhbHNlO1xyXG4gICAgICBpZiAoaW5wdXQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlRGlyLmVtaXQoaW5wdXQpO1xyXG4gICAgICAgIHRoaXMubmV3Q2xpY2tlZEFjdGlvbigpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZXdDbGlja2VkQWN0aW9uKCkge1xyXG4gICAgdGhpcy51cGxvYWRlci5jYW5jZWxBbGwoKTtcclxuICAgIHRoaXMuY2xvc2VEaWFsb2cuZW1pdCgpO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBPbkluaXQsIE91dHB1dCwgVmlld0NoaWxkfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtffSBmcm9tICdAYmllc2JqZXJnL25neC10cmFuc2xhdGUtZXh0cmFjdC9kaXN0L3V0aWxzL3V0aWxzJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLW5ldy1mb2xkZXInLFxyXG4gIHRlbXBsYXRlOiBgPHAgY2xhc3M9XCJuZXctZm9sZGVyLWRlc2NyaXB0aW9uXCIgdHJhbnNsYXRlPlR5cGUgbmV3IGZvbGRlciBuYW1lPC9wPlxyXG48aW5wdXQgI3VwbG9hZEZvbGRlciBwbGFjZWhvbGRlcj1cInt7J0ZvbGRlciBuYW1lJ319XCIgKGtleXVwKT1cIm9uSW5wdXRDaGFuZ2UoJGV2ZW50KVwiXHJcbiAgICAgICAoa2V5dXAuZW50ZXIpPVwib25DbGljaygpXCIgb25jbGljaz1cInRoaXMuc2VsZWN0KCk7XCIgdHlwZT1cInRleHRcIiBjbGFzcz1cIm5ldy1mb2xkZXItaW5wdXRcIi8+XHJcbjxidXR0b24gY2xhc3M9XCJidXR0b24gbmV3LWZvbGRlci1zZW5kXCIgKGNsaWNrKT1cIm9uQ2xpY2soKVwiPnt7YnV0dG9uVGV4dH19PC9idXR0b24+XHJcbmAsXHJcbiAgc3R5bGVzOiBbYC5uZXctZm9sZGVyLWRlc2NyaXB0aW9ue21hcmdpbjowIGF1dG87cGFkZGluZzowfWBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZXdGb2xkZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIEBWaWV3Q2hpbGQoJ3VwbG9hZEZvbGRlcicpIHVwbG9hZEZvbGRlcjogRWxlbWVudFJlZjtcclxuICBAT3V0cHV0KCkgYnV0dG9uQ2xpY2tlZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgYnV0dG9uVGV4dCA9IF8oJ0Nsb3NlJykudG9TdHJpbmcoKTtcclxuICBpbnB1dFZhbHVlID0gJyc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgfVxyXG5cclxuICBvbkNsaWNrKCkge1xyXG4gICAgY29uc3QgZWw6IEhUTUxFbGVtZW50ID0gKHRoaXMudXBsb2FkRm9sZGVyLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpO1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgdGhpcy5idXR0b25DbGlja2VkLmVtaXQoZWwudmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgb25JbnB1dENoYW5nZShldmVudDogYW55KSB7XHJcbiAgICB0aGlzLmlucHV0VmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICBpZiAodGhpcy5pbnB1dFZhbHVlLmxlbmd0aCA+IDApIHtcclxuICAgICAgdGhpcy5idXR0b25UZXh0ID0gXygnQ29uZmlybScpLnRvU3RyaW5nKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmJ1dHRvblRleHQgPSBfKCdDbG9zZScpLnRvU3RyaW5nKCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCwgVGVtcGxhdGVSZWYsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtOb2RlSW50ZXJmYWNlfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL25vZGUuaW50ZXJmYWNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLXNpZGUtdmlldycsXHJcbiAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwic2lkZS12aWV3XCIgKm5nSWY9XCJub2RlXCI+XHJcbiAgPGRpdiBjbGFzcz1cInNpZGUtdmlldy1wcmV2aWV3XCI+XHJcbiAgICA8aSAoY2xpY2spPVwib25DbGljaygkZXZlbnQsICdjbG9zZVNpZGVWaWV3JylcIiBjbGFzcz1cImZhcyBmYS10aW1lcyBzaWRlLXZpZXctY2xvc2VcIj48L2k+XHJcblxyXG4gICAgPGRpdiBjbGFzcz1cInNpZGUtdmlldy1wcmV2aWV3LXRpdGxlXCI+e3tub2RlLm5hbWV9fTwvZGl2PlxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJzaWRlLXZpZXctcHJldmlldy1jb250ZW50XCI+XHJcbiAgICAgIDxuZy1jb250YWluZXJcclxuICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyRpbXBsaWNpdDogbm9kZX1cIlxyXG4gICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInNpZGVWaWV3VGVtcGxhdGVcIj5cclxuICAgICAgPC9uZy1jb250YWluZXI+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8ZGl2IGNsYXNzPVwic2lkZS12aWV3LWJ1dHRvbnNcIj5cclxuICAgICAgPGJ1dHRvbiAoY2xpY2spPVwib25DbGljaygkZXZlbnQsICdkb3dubG9hZCcpXCIgY2xhc3M9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAgIFtkaXNhYmxlZF09XCIhYWxsb3dGb2xkZXJEb3dubG9hZCAmJiBub2RlLmlzRm9sZGVyXCIgdHJhbnNsYXRlPlxyXG4gICAgICAgIERvd25sb2FkXHJcbiAgICAgIDwvYnV0dG9uPlxyXG4gICAgICA8YnV0dG9uIChjbGljayk9XCJvbkNsaWNrKCRldmVudCwgJ3JlbmFtZUNvbmZpcm0nKVwiIGNsYXNzPVwiYnV0dG9uXCIgdHJhbnNsYXRlPlJlbmFtZTwvYnV0dG9uPlxyXG4gICAgICA8YnV0dG9uIChjbGljayk9XCJvbkNsaWNrKCRldmVudCwgJ3JlbW92ZUFzaycpXCIgY2xhc3M9XCJidXR0b25cIiB0cmFuc2xhdGU+RGVsZXRlPC9idXR0b24+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuPC9kaXY+XHJcbmAsXHJcbiAgc3R5bGVzOiBbYC5zaWRlLXZpZXctY2xvc2V7cG9zaXRpb246YWJzb2x1dGU7Y3Vyc29yOnBvaW50ZXI7dG9wOjA7cmlnaHQ6MDtwYWRkaW5nOjE1cHh9LnNpZGUtdmlldy1idXR0b25ze3dpZHRoOjEwMCU7ZGlzcGxheTotd2Via2l0LWZsZXg7ZGlzcGxheTpmbGV4Oy13ZWJraXQtanVzdGlmeS1jb250ZW50OmNlbnRlcjtqdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyOy13ZWJraXQtZmxleC1mbG93OmNvbHVtbjtmbGV4LWZsb3c6Y29sdW1ufS5zaWRlLXZpZXctYnV0dG9ucyAuYnV0dG9ue21hcmdpbjo1cHggMH1gXSxcclxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBTaWRlVmlld0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgQElucHV0KCkgc2lkZVZpZXdUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgQElucHV0KCkgbm9kZTogTm9kZUludGVyZmFjZTtcclxuICBASW5wdXQoKSBhbGxvd0ZvbGRlckRvd25sb2FkID0gZmFsc2U7XHJcblxyXG4gIEBPdXRwdXQoKSBjbGlja0V2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gIH1cclxuXHJcbiAgb25DbGljayhldmVudDogYW55LCB0eXBlOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuY2xpY2tFdmVudC5lbWl0KHt0eXBlOiB0eXBlLCBldmVudDogZXZlbnQsIG5vZGU6IHRoaXMubm9kZX0pO1xyXG4gIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnQsIE9uSW5pdCwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge05vZGVDbGlja2VkU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvbm9kZS1jbGlja2VkLnNlcnZpY2UnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtbmF2aWdhdGlvbicsXHJcbiAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwibmF2aWdhdGlvbi1jb21wb25lbnRcIj5cclxuICA8aW5wdXQgI2lucHV0IGNsYXNzPVwibmF2aWdhdGlvbi1zZWFyY2hcIiBvbmNsaWNrPVwidGhpcy5zZWxlY3QoKTtcIiAoa2V5dXAuZW50ZXIpPVwib25DbGljayhpbnB1dC52YWx1ZSlcIlxyXG4gICAgICAgICBwbGFjZWhvbGRlcj1cInt7J1NlYXJjaCd9fVwiPlxyXG5cclxuICA8YnV0dG9uIFtkaXNhYmxlZF09XCJpbnB1dC52YWx1ZS5sZW5ndGggPT09IDBcIiBjbGFzcz1cIm5hdmlnYXRpb24tc2VhcmNoLWljb25cIiAoY2xpY2spPVwib25DbGljayhpbnB1dC52YWx1ZSlcIj5cclxuICAgIDxpIGNsYXNzPVwiZmFzIGZhLXNlYXJjaFwiPjwvaT5cclxuICA8L2J1dHRvbj5cclxuXHJcbiAgPGRpdj5cclxuICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cclxuICA8L2Rpdj5cclxuPC9kaXY+XHJcblxyXG5cclxuYCxcclxuICBzdHlsZXM6IFtgLm5hdmlnYXRpb24tY29tcG9uZW50e2Rpc3BsYXk6LXdlYmtpdC1mbGV4O2Rpc3BsYXk6ZmxleH1gXSxcclxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOYXZpZ2F0aW9uQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIG5vZGVDbGlja2VkU2VydmljZTogTm9kZUNsaWNrZWRTZXJ2aWNlXHJcbiAgKSB7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICB9XHJcblxyXG4gIG9uQ2xpY2soaW5wdXQ6IHN0cmluZykge1xyXG4gICAgdGhpcy5ub2RlQ2xpY2tlZFNlcnZpY2Uuc2VhcmNoRm9yU3RyaW5nKGlucHV0KTtcclxuICB9XHJcbn1cclxuIiwiLy8gaW1wb3J0IHtNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7TmdNb2R1bGUsIEluamVjdGlvblRva2VuLCBNb2R1bGVXaXRoUHJvdmlkZXJzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7RmlsZU1hbmFnZXJDb21wb25lbnR9IGZyb20gJy4vZmlsZS1tYW5hZ2VyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7Rm9sZGVyQ29udGVudENvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL2ZvbGRlci1jb250ZW50L2ZvbGRlci1jb250ZW50LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7VHJlZUNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL3RyZWUvdHJlZS5jb21wb25lbnQnO1xyXG5pbXBvcnQge05vZGVMaXN0ZXJDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy90cmVlL25vZGUtbGlzdGVyL25vZGUtbGlzdGVyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7Tm9kZUNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL2Z1bmN0aW9ucy9ub2RlL25vZGUuY29tcG9uZW50JztcclxuaW1wb3J0IHtNYXBUb0l0ZXJhYmxlUGlwZX0gZnJvbSAnLi9waXBlcy9tYXAtdG8taXRlcmFibGUucGlwZSc7XHJcbmltcG9ydCB7SHR0cENsaWVudCwgSHR0cENsaWVudE1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQge1N0b3JlTW9kdWxlLCBBY3Rpb25SZWR1Y2VyTWFwfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcbmltcG9ydCB7TmF2QmFyQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvbmF2LWJhci9uYXYtYmFyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7cmVkdWNlcnMsIEFwcFN0b3JlfSBmcm9tICcuL3JlZHVjZXJzL3JlZHVjZXIuZmFjdG9yeSc7XHJcbmltcG9ydCB7TG9hZGluZ092ZXJsYXlDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9mdW5jdGlvbnMvbG9hZGluZy1vdmVybGF5L2xvYWRpbmctb3ZlcmxheS5jb21wb25lbnQnO1xyXG5pbXBvcnQge0ZpbGVTaXplUGlwZX0gZnJvbSAnLi9waXBlcy9maWxlLXNpemUucGlwZSc7XHJcbmltcG9ydCB7VXBsb2FkQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvZnVuY3Rpb25zL3VwbG9hZC91cGxvYWQuY29tcG9uZW50JztcclxuaW1wb3J0IHtOZXdGb2xkZXJDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9mdW5jdGlvbnMvdXBsb2FkL25ldy1mb2xkZXIvbmV3LWZvbGRlci5jb21wb25lbnQnO1xyXG5pbXBvcnQge1NpZGVWaWV3Q29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvc2lkZS12aWV3L3NpZGUtdmlldy5jb21wb25lbnQnO1xyXG5pbXBvcnQge05hdmlnYXRpb25Db21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9uYXZpZ2F0aW9uL25hdmlnYXRpb24uY29tcG9uZW50JztcclxuaW1wb3J0IHtOZ3hTbWFydE1vZGFsTW9kdWxlfSBmcm9tICduZ3gtc21hcnQtbW9kYWwnO1xyXG5cclxuY29uc3QgRkVBVFVSRV9SRURVQ0VSX1RPS0VOID0gbmV3IEluamVjdGlvblRva2VuPFxyXG4gIEFjdGlvblJlZHVjZXJNYXA8QXBwU3RvcmU+XHJcbj4oJ0FwcFN0b3JlIFJlZHVjZXJzJyk7XHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRSZWR1Y2VycygpOiBBY3Rpb25SZWR1Y2VyTWFwPEFwcFN0b3JlPiB7XHJcbiAgLy8gbWFwIG9mIHJlZHVjZXJzXHJcbiAgcmV0dXJuIHJlZHVjZXJzO1xyXG59XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtcclxuICAgIEh0dHBDbGllbnRNb2R1bGUsXHJcbiAgICBTdG9yZU1vZHVsZS5mb3JSb290KEZFQVRVUkVfUkVEVUNFUl9UT0tFTiksXHJcbiAgICBDb21tb25Nb2R1bGUsXHJcbiAgICBOZ3hTbWFydE1vZGFsTW9kdWxlLmZvclJvb3QoKSxcclxuICBdLFxyXG4gIGRlY2xhcmF0aW9uczogW1xyXG4gICAgRmlsZU1hbmFnZXJDb21wb25lbnQsXHJcbiAgICBGb2xkZXJDb250ZW50Q29tcG9uZW50LFxyXG4gICAgTm9kZUNvbXBvbmVudCxcclxuICAgIFRyZWVDb21wb25lbnQsXHJcbiAgICBOb2RlTGlzdGVyQ29tcG9uZW50LFxyXG4gICAgTWFwVG9JdGVyYWJsZVBpcGUsXHJcbiAgICBOYXZCYXJDb21wb25lbnQsXHJcbiAgICBMb2FkaW5nT3ZlcmxheUNvbXBvbmVudCxcclxuICAgIEZpbGVTaXplUGlwZSxcclxuICAgIFVwbG9hZENvbXBvbmVudCxcclxuICAgIE5ld0ZvbGRlckNvbXBvbmVudCxcclxuICAgIFNpZGVWaWV3Q29tcG9uZW50LFxyXG4gICAgTmF2aWdhdGlvbkNvbXBvbmVudFxyXG4gIF0sXHJcbiAgZXhwb3J0czogW1xyXG4gICAgRmlsZU1hbmFnZXJDb21wb25lbnQsXHJcbiAgICBMb2FkaW5nT3ZlcmxheUNvbXBvbmVudCxcclxuICAgIFNpZGVWaWV3Q29tcG9uZW50XHJcbiAgXSxcclxuICBwcm92aWRlcnM6IFtcclxuICAgIHtcclxuICAgICAgcHJvdmlkZTogRkVBVFVSRV9SRURVQ0VSX1RPS0VOLFxyXG4gICAgICB1c2VGYWN0b3J5OiBnZXRSZWR1Y2VycyxcclxuICAgIH0sXHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRmlsZU1hbmFnZXJNb2R1bGUge1xyXG4gIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbmdNb2R1bGU6IEZpbGVNYW5hZ2VyTW9kdWxlLFxyXG4gICAgICBwcm92aWRlcnM6IFtdXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iXSwibmFtZXMiOlsiQUNUSU9OUy5TRVRfUEFUSCIsIkFDVElPTlMuU0VUX0xPQURJTkdfU1RBVEUiLCJBQ1RJT05TLlNFVF9TRUxFQ1RFRF9OT0RFIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUdBOzs7O0lBTUUsWUFBWSxNQUF1Qjs7UUFFakMsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFFckIsSUFBSSxDQUFDLEtBQUssc0JBQWtCO1lBQzFCLEVBQUUsRUFBRSxDQUFDO1lBQ0wsVUFBVSxFQUFFLEVBQUU7WUFDZCxZQUFZLEVBQUUsSUFBSTtZQUNsQixRQUFRLEVBQUUsSUFBSTtZQUNkLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLFFBQVEsRUFBRSxJQUFJO1lBQ2QsSUFBSSxFQUFFLE1BQU07WUFDWixRQUFRLEVBQUUsRUFBRTtTQUNiLEVBQUEsQ0FBQztLQUNIOzs7O0lBRUQsSUFBSSxXQUFXO1FBQ2IsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO0tBQzFCOzs7OztJQUVELElBQUksV0FBVyxDQUFDLEtBQWE7UUFDM0IsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7S0FDM0I7Ozs7SUFFRCxJQUFJLEtBQUs7UUFDUCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7S0FDcEI7Ozs7O0lBRUQsSUFBSSxLQUFLLENBQUMsS0FBb0I7UUFDNUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7S0FDckI7Ozs7SUFFRCxJQUFJLGNBQWM7UUFDaEIsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDO0tBQzdCOzs7OztJQUVELElBQUksY0FBYyxDQUFDLEtBQWE7UUFDOUIsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFL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