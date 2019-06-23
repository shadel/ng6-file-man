/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, EventEmitter, Input, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TreeModel } from './models/tree.model';
import { NodeService } from './services/node.service';
import { SET_LOADING_STATE } from './reducers/actions.action';
import * as ACTIONS from './reducers/actions.action';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { NodeClickedService } from './services/node-clicked.service';
var FileManagerComponent = /** @class */ (function () {
    function FileManagerComponent(store, nodeService, nodeClickedService, ngxSmartModalService) {
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
    FileManagerComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
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
        function (state) { return (state.fileManagerState || (/** @type {?} */ ({}))).isLoading; })))
            .subscribe((/**
         * @param {?} data
         * @return {?}
         */
        function (data) {
            _this.loading = data;
        }));
        this.store
            .pipe(select((/**
         * @param {?} state
         * @return {?}
         */
        function (state) { return (state.fileManagerState || (/** @type {?} */ ({}))).selectedNode; })))
            .subscribe((/**
         * @param {?} node
         * @return {?}
         */
        function (node) {
            if (!node) {
                return;
            }
            // fixed highlighting error when closing node but not changing path
            if ((node.isExpanded && node.pathToNode !== _this.nodeService.currentPath) && !node.stayOpen) {
                return;
            }
            _this.handleFileManagerClickEvent({ type: 'select', node: node });
        }));
    };
    /**
     * @param {?} event
     * @return {?}
     */
    FileManagerComponent.prototype.onItemClicked = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.itemClicked.emit(event);
    };
    /**
     * @param {?} data
     * @return {?}
     */
    FileManagerComponent.prototype.searchClicked = /**
     * @param {?} data
     * @return {?}
     */
    function (data) {
        // console.log(data);
        // console.log(data);
        /** @type {?} */
        var node = this.nodeService.findNodeById(data.id);
        this.ngxSmartModalService.getModal('searchModal').close();
        this.store.dispatch({ type: ACTIONS.SET_SELECTED_NODE, payload: node });
    };
    /**
     * @param {?} event
     * @return {?}
     */
    FileManagerComponent.prototype.handleFileManagerClickEvent = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
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
                var parentId = this.nodeService.findNodeByPath(this.nodeService.currentPath).id;
                this.nodeClickedService.createFolder(parentId, event.payload);
                return this.onItemClicked({
                    type: event.type,
                    parentId: parentId,
                    newDirName: event.payload
                });
        }
    };
    /**
     * @param {?} node
     * @param {?=} closing
     * @return {?}
     */
    FileManagerComponent.prototype.nodeClickHandler = /**
     * @param {?} node
     * @param {?=} closing
     * @return {?}
     */
    function (node, closing) {
        if (node.name === 'root') {
            return;
        }
        if (closing) {
            /** @type {?} */
            var parentNode = this.nodeService.findNodeByPath(this.nodeService.currentPath);
            this.store.dispatch({ type: ACTIONS.SET_SELECTED_NODE, payload: parentNode });
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
    };
    // todo stay DRY!
    // todo stay DRY!
    /**
     * @param {?} node
     * @return {?}
     */
    FileManagerComponent.prototype.highlightSelected = 
    // todo stay DRY!
    /**
     * @param {?} node
     * @return {?}
     */
    function (node) {
        /** @type {?} */
        var pathToNode = node.pathToNode;
        if (pathToNode.length === 0) {
            pathToNode = 'root';
        }
        /** @type {?} */
        var treeElement = this.getElementById(pathToNode, 'tree_');
        /** @type {?} */
        var fcElement = this.getElementById(pathToNode, 'fc_');
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
        var pathToParent = node.pathToParent;
        if (pathToParent === null || node.pathToNode === this.nodeService.currentPath) {
            return;
        }
        if (pathToParent.length === 0) {
            pathToParent = 'root';
        }
        /** @type {?} */
        var parentElement = this.getElementById(pathToParent, 'tree_');
        if (!parentElement) {
            console.warn('[File Manager] failed to find requested parent node for path:', pathToParent);
            return;
        }
        this.highilghtChildElement(parentElement);
    };
    /**
     * @private
     * @param {?} el
     * @param {?=} light
     * @return {?}
     */
    FileManagerComponent.prototype.highilghtChildElement = /**
     * @private
     * @param {?} el
     * @param {?=} light
     * @return {?}
     */
    function (el, light) {
        if (light === void 0) { light = false; }
        el.children[0] // appnode div wrapper
            .children[0] // ng template first item
            .classList.add('highlighted');
        if (light)
            el.children[0]
                .children[0]
                .classList.add('light');
    };
    /**
     * @private
     * @param {?} id
     * @param {?=} prefix
     * @return {?}
     */
    FileManagerComponent.prototype.getElementById = /**
     * @private
     * @param {?} id
     * @param {?=} prefix
     * @return {?}
     */
    function (id, prefix) {
        if (prefix === void 0) { prefix = ''; }
        /** @type {?} */
        var fullId = prefix + id;
        return document.getElementById(fullId);
    };
    /**
     * @private
     * @param {?} className
     * @return {?}
     */
    FileManagerComponent.prototype.removeClass = /**
     * @private
     * @param {?} className
     * @return {?}
     */
    function (className) {
        Array.from(document.getElementsByClassName(className))
            .map((/**
         * @param {?} el
         * @return {?}
         */
        function (el) { return el.classList.remove(className); }));
    };
    /**
     * @return {?}
     */
    FileManagerComponent.prototype.fmShowHide = /**
     * @return {?}
     */
    function () {
        this.fmOpen = !this.fmOpen;
    };
    /**
     * @return {?}
     */
    FileManagerComponent.prototype.backdropClicked = /**
     * @return {?}
     */
    function () {
        // todo get rid of this ugly workaround
        // todo fire userCanceledLoading event
        this.store.dispatch({ type: SET_LOADING_STATE, payload: false });
    };
    /**
     * @param {?} event
     * @return {?}
     */
    FileManagerComponent.prototype.handleUploadDialog = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.newDialog = event;
    };
    FileManagerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'fm-file-manager',
                    template: "<ng-container *ngIf=\"isPopup; then itIsPopup else showContent\"></ng-container>\n\n<ng-template #itIsPopup>\n  <div *ngIf=\"!fmOpen\">\n    <button class=\"button big\" (click)=\"fmShowHide()\" translate=\"\">Open file manager</button>\n  </div>\n  <div class=\"file-manager-backdrop\" *ngIf=\"fmOpen\">\n    <div class=\"fmModalInside\">\n      <div *ngIf=\"fmOpen; then showContent\"></div>\n    </div>\n  </div>\n</ng-template>\n\n<ng-template #showContent>\n  <div class=\"content\">\n    <div class=\"file-manager-navbar\">\n      <div class=\"path\">\n        <app-nav-bar></app-nav-bar>\n      </div>\n\n      <div class=\"navigation\">\n        <app-navigation>\n          <div class=\"button close\" (click)=\"fmShowHide()\" *ngIf=\"isPopup\">\n            <i class=\"fas fa-2x fa-times\"></i>\n          </div>\n        </app-navigation>\n      </div>\n    </div>\n\n    <div class=\"holder\">\n      <div class=\"file-manager-left\">\n        <app-tree [treeModel]=\"tree\">\n          <ng-template let-nodes>\n            <ng-container [ngTemplateOutletContext]=\"{$implicit: nodes}\"\n                          [ngTemplateOutlet]=\"iconTemplate ? iconTemplate : defaultIconTemplate\">\n            </ng-container>\n          </ng-template>\n        </app-tree>\n      </div>\n\n      <div class=\"right\">\n        <app-folder-content\n          [treeModel]=\"tree\"\n          (openUploadDialog)=\"handleUploadDialog($event)\"\n          [folderContentTemplate]=\"folderContentTemplate ? folderContentTemplate : defaultFolderContentTemplate\"\n          [folderContentNewTemplate]=\"folderContentNewTemplate ? folderContentNewTemplate : defaultFolderContentNewTemplate\"\n          [folderContentBackTemplate]=\"folderContentBackTemplate ? folderContentBackTemplate : defaultFolderContentBackTemplate\">\n        </app-folder-content>\n      </div>\n\n      <app-side-view id=\"side-view\"\n                     [node]=\"selectedNode\"\n                     [sideViewTemplate]=\"sideViewTemplate ? sideViewTemplate : defaultSideViewTemplate\"\n                     [allowFolderDownload]=\"tree.config.options.allowFolderDownload\"\n                     (clickEvent)=\"handleFileManagerClickEvent($event)\">\n      </app-side-view>\n    </div>\n  </div>\n\n  <app-upload *ngIf=\"newDialog\"\n              [openDialog]=\"newDialog\"\n              (closeDialog)=\"handleUploadDialog(false)\"\n              (createDir)=\"handleFileManagerClickEvent({type: 'createFolder', payload: $event})\">\n  </app-upload>\n\n  <app-loading-overlay\n    *ngIf=\"loading\"\n    [loadingOverlayTemplate]=\"loadingOverlayTemplate ? loadingOverlayTemplate : defaultLoadingOverlayTemplate\">\n  </app-loading-overlay>\n</ng-template>\n\n<ng-template let-node #defaultIconTemplate>\n  <div class=\"file-manager-node\" style=\"display: inline-block; padding: 3px\">\n    <div *ngIf=\"node.isFolder; then itIsFolder else showFile\"></div>\n\n    <ng-template #itIsFolder>\n      <div *ngIf=\"node.isExpanded; then isFolderExpanded else isFolderClosed\"></div>\n    </ng-template>\n\n    <ng-template #showFile><i class=\"fas fa-file child\"></i></ng-template>\n    <ng-template #isFolderExpanded><i class=\"fas fa-folder-open child\"></i></ng-template>\n    <ng-template #isFolderClosed><i class=\"fas fa-folder child\"></i></ng-template>\n\n    <span>{{node.name}}</span>\n  </div>\n</ng-template>\n<ng-template let-node #defaultFolderContentTemplate>\n  <div class=\"file-manager-item\">\n    <div class=\"file-preview\">\n      <div *ngIf=\"node.isFolder; then itIsFolder else showFile\"></div>\n      <ng-template #itIsFolder><i class=\"fas fa-3x fa-folder child\"></i></ng-template>\n      <ng-template #showFile><i class=\"fas fa-3x fa-file child\"></i></ng-template>\n    </div>\n    <div class=\"file-name\">\n      {{node.name}}\n    </div>\n  </div>\n</ng-template>\n<ng-template #defaultFolderContentNewTemplate>\n  <div class=\"file-manager-item\">\n    <div class=\"file-preview\" style=\"width: 100%; height:100%\">\n      <i class=\"fas fa-3x fa-plus child\" style=\"line-height: 2\"></i>\n    </div>\n  </div>\n</ng-template>\n<ng-template let-node #defaultFolderContentBackTemplate>\n  <div class=\"file-manager-item\">\n    <div class=\"file-preview\" style=\"width: 100%; height:100%\">\n      <i class=\"fas fa-2x fa-ellipsis-h\" style=\"line-height: 5\"></i>\n    </div>\n  </div>\n</ng-template>\n<ng-template let-timeoutMessage #defaultLoadingOverlayTemplate>\n  <div class=\"file-manager-backdrop loading\" (click)=\"backdropClicked()\">\n    <div class=\"file-manager-error\" *ngIf=\"timeoutMessage\">{{timeoutMessage}}</div>\n  </div>\n  <div class=\"spinner\">\n    <i class=\"fas fa-5x fa-spin fa-sync-alt\"></i>\n  </div>\n</ng-template>\n<ng-template let-node #defaultSideViewTemplate>\n  <div style=\"position: absolute; bottom: 0; width: 100%; margin: 5px auto\">\n    <span *ngIf=\"node.isFolder\" translate>No data available for this folder</span>\n    <span *ngIf=\"!node.isFolder\" translate>No data available for this file</span>\n  </div>\n</ng-template>\n\n<ngx-smart-modal identifier=\"renameModal\" [dismissable]=\"false\" [closable]=\"false\" *ngIf=\"selectedNode\" #renameModal>\n  <h2 class=\"modal-title\" translate>\n    Rename file\n  </h2>\n  <p class=\"rename-name\" translate>\n    Old name\n  </p>\n  <span style=\"margin: 8px\">{{selectedNode.name}}</span>\n  <p class=\"rename-name\" translate>\n    New name\n  </p>\n  <input placeholder=\"New name\" type=\"text\" class=\"rename-input\" [value]=\"selectedNode.name\" #renameInput\n         (keyup.enter)=\"handleFileManagerClickEvent({type: 'rename', value: renameInput.value})\"\n         onclick=\"this.select();\">\n  <br>\n\n  <div class=\"rename-button\">\n    <button class=\"button big\" translate\n            (click)=\"handleFileManagerClickEvent({type: 'rename', value: renameInput.value})\"\n            [disabled]=\"renameInput.value === selectedNode.name || renameInput.value.length === 0\">\n      Rename\n    </button>\n    <button class=\"button big\" (click)=\"renameModal.close()\" translate>\n      Cancel\n    </button>\n  </div>\n\n</ngx-smart-modal>\n<ngx-smart-modal *ngIf=\"selectedNode\" identifier=\"confirmDeleteModal\" #deleteModal\n                 [dismissable]=\"false\" [closable]=\"false\">\n  <h2 class=\"modal-title\">\n    <span translate>You are trying to delete following </span>\n    <span *ngIf=\"selectedNode.isFolder\" translate>folder</span>\n    <span *ngIf=\"!selectedNode.isFolder\" translate>file</span>\n  </h2>\n\n  <div style=\"width: 100%; margin: 5px auto; text-align: center\">{{selectedNode.name}}</div>\n\n  <div class=\"rename-button\">\n    <button class=\"button big\" (click)=\"handleFileManagerClickEvent({type: 'remove'})\">\n      <span translate>Yes, delete this </span>\n      <span *ngIf=\"selectedNode.isFolder\" translate>folder</span>\n      <span *ngIf=\"!selectedNode.isFolder\" translate>file</span>\n    </button>\n    <button class=\"button big\" (click)=\"deleteModal.close()\" translate>\n      Cancel\n    </button>\n  </div>\n</ngx-smart-modal>\n<ngx-smart-modal identifier=\"searchModal\" #searchModal [closable]=\"true\">\n  <h2 class=\"modal-title\" style=\"margin-bottom: 2px\" translate\n      *ngIf=\"searchModal.hasData() && searchModal.getData().response.length !== 0\">\n    Search results for\n  </h2>\n  <h2 class=\"modal-title\" style=\"margin-bottom: 2px\" translate\n      *ngIf=\"!searchModal.hasData() || searchModal.getData().response.length === 0\">\n    No results found for\n  </h2>\n  <div style=\"text-align: center\" *ngIf=\"searchModal.hasData()\">{{searchModal.getData().searchString}}</div>\n\n  <div *ngIf=\"searchModal.hasData() && searchModal.getData().response.length !== 0\">\n    <table style=\"margin: 0 auto\">\n      <tr>\n        <td class=\"table-item table-head\" translate>File name</td>\n        <td class=\"table-item-short table-head\" translate>Size</td>\n      </tr>\n      <tr *ngFor=\"let item of searchModal.getData().response\" (click)=\"searchClicked(item)\">\n        <td style=\"cursor: pointer\">\n          <ng-container *ngIf=\"item.fileCategory === 'D'; else file\">\n            <i class=\"fas fa-folder search-output-icon\"></i>\n          </ng-container>\n          <ng-template #file>\n            <i class=\"fas fa-file search-output-icon\"></i>\n          </ng-template>\n          <span style=\"text-overflow: ellipsis\">{{item.name}}</span>\n        </td>\n        <td class=\"table-item-short\">{{item.size}}</td>\n      </tr>\n    </table>\n  </div>\n</ngx-smart-modal>\n<ngx-smart-modal identifier=\"waitModal\" [closable]=\"false\" [dismissable]=\"false\" [escapable]=\"false\">\n  <h2 class=\"modal-title\" style=\"margin-top: 20px\">\n    {{'Processing request'}}...\n  </h2>\n\n  <div style=\"text-align: center; height: 70px\">\n    <i class=\"fas fa-spinner fa-spin fa-4x\"></i>\n  </div>\n</ngx-smart-modal>\n<ngx-smart-modal identifier=\"errorModal\" [closable]=\"true\">\n  <h2 class=\"modal-title\" style=\"margin-top: 20px\">\n    {{'Something went wrong with your request'}}...\n  </h2>\n</ngx-smart-modal>\n",
                    styles: [".content{height:100%;min-width:850px}.holder{display:-webkit-flex;display:flex;height:calc(100% - 75px)}.path{margin:auto 0;display:block}.navigation{margin:auto 0;display:-webkit-flex;display:flex}.navigation .button{margin:0 10px;padding:0;position:relative}.right{width:100%;position:relative;overflow:auto}.file-name{width:100px;height:25px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;box-sizing:border-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.file-preview{margin:auto}.file-preview i{line-height:1.5}.spinner{position:absolute;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);cursor:progress}.rename-button{margin:20px auto;display:block;text-align:center}.modal-title{margin-top:5px;text-align:center}.search-output{margin:15px 0}.search-output-icon{margin:2px 5px}.table-item{width:80%}.table-item-short{width:20%;text-align:right}"],
                    encapsulation: ViewEncapsulation.None
                },] },
    ];
    FileManagerComponent.ctorParameters = function () { return [
        { type: Store },
        { type: NodeService },
        { type: NodeClickedService },
        { type: NgxSmartModalService }
    ]; };
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
    return FileManagerComponent;
}());
export { FileManagerComponent };
if (false) {
    /** @type {?} */
    FileManagerComponent.prototype.iconTemplate;
    /** @type {?} */
    FileManagerComponent.prototype.folderContentTemplate;
    /** @type {?} */
    FileManagerComponent.prototype.folderContentBackTemplate;
    /** @type {?} */
    FileManagerComponent.prototype.folderContentNewTemplate;
    /** @type {?} */
    FileManagerComponent.prototype.loadingOverlayTemplate;
    /** @type {?} */
    FileManagerComponent.prototype.sideViewTemplate;
    /** @type {?} */
    FileManagerComponent.prototype.tree;
    /** @type {?} */
    FileManagerComponent.prototype.isPopup;
    /** @type {?} */
    FileManagerComponent.prototype.itemClicked;
    /** @type {?} */
    FileManagerComponent.prototype.selectedNode;
    /** @type {?} */
    FileManagerComponent.prototype.sideMenuClosed;
    /** @type {?} */
    FileManagerComponent.prototype.fmOpen;
    /** @type {?} */
    FileManagerComponent.prototype.loading;
    /** @type {?} */
    FileManagerComponent.prototype.newDialog;
    /**
     * @type {?}
     * @private
     */
    FileManagerComponent.prototype.store;
    /**
     * @type {?}
     * @private
     */
    FileManagerComponent.prototype.nodeService;
    /**
     * @type {?}
     * @private
     */
    FileManagerComponent.prototype.nodeClickedService;
    /** @type {?} */
    FileManagerComponent.prototype.ngxSmartModalService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZS1tYW5hZ2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25nNi1maWxlLW1hbi8iLCJzb3VyY2VzIjpbImZpbGUtbWFuYWdlci9maWxlLW1hbmFnZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM3RyxPQUFPLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUMxQyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDOUMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBRXBELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBQzVELE9BQU8sS0FBSyxPQUFPLE1BQU0sMkJBQTJCLENBQUM7QUFFckQsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDckQsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0saUNBQWlDLENBQUM7QUFFbkU7SUF1UEUsOEJBQ1UsS0FBc0IsRUFDdEIsV0FBd0IsRUFDeEIsa0JBQXNDLEVBQ3ZDLG9CQUEwQztRQUh6QyxVQUFLLEdBQUwsS0FBSyxDQUFpQjtRQUN0QixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4Qix1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBQ3ZDLHlCQUFvQixHQUFwQixvQkFBb0IsQ0FBc0I7UUFkMUMsWUFBTyxHQUFZLEtBQUssQ0FBQztRQUN4QixnQkFBVyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFHM0MsbUJBQWMsR0FBRyxJQUFJLENBQUM7UUFFdEIsV0FBTSxHQUFHLEtBQUssQ0FBQztRQUVmLGNBQVMsR0FBRyxLQUFLLENBQUM7SUFRbEIsQ0FBQzs7OztJQUVELHVDQUFROzs7SUFBUjtRQUFBLGlCQThCQztRQTdCQyxhQUFhO1FBQ2IsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUN0QyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUc7OztRQUFJO1FBQzNDLENBQUMsQ0FBQSxDQUFDO1FBRUYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNsQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDekMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUV2RCxJQUFJLENBQUMsS0FBSzthQUNQLElBQUksQ0FBQyxNQUFNOzs7O1FBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsSUFBSSxtQkFBQSxFQUFFLEVBQU8sQ0FBQyxDQUFDLFNBQVMsRUFBL0MsQ0FBK0MsRUFBQyxDQUFDO2FBQ3RFLFNBQVM7Ozs7UUFBQyxVQUFDLElBQWE7WUFDdkIsS0FBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDdEIsQ0FBQyxFQUFDLENBQUM7UUFFTCxJQUFJLENBQUMsS0FBSzthQUNQLElBQUksQ0FBQyxNQUFNOzs7O1FBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsSUFBSSxtQkFBQSxFQUFFLEVBQU8sQ0FBQyxDQUFDLFlBQVksRUFBbEQsQ0FBa0QsRUFBQyxDQUFDO2FBQ3pFLFNBQVM7Ozs7UUFBQyxVQUFDLElBQW1CO1lBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDVixNQUFNLENBQUM7WUFDVCxDQUFDO1lBRUQsbUVBQW1FO1lBQ25FLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLEtBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDNUYsTUFBTSxDQUFDO1lBQ1QsQ0FBQztZQUVELEtBQUksQ0FBQywyQkFBMkIsQ0FBQyxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7UUFDakUsQ0FBQyxFQUFDLENBQUM7SUFDUCxDQUFDOzs7OztJQUVELDRDQUFhOzs7O0lBQWIsVUFBYyxLQUFVO1FBQ3RCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9CLENBQUM7Ozs7O0lBRUQsNENBQWE7Ozs7SUFBYixVQUFjLElBQVM7UUFDckIscUJBQXFCOzs7WUFFZixJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUNuRCxJQUFJLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzFELElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztJQUN4RSxDQUFDOzs7OztJQUVELDBEQUEyQjs7OztJQUEzQixVQUE0QixLQUFVO1FBQ3BDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ25CLEtBQUssZUFBZTtnQkFDbEIsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRWpELEtBQUssUUFBUTtnQkFDWCxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMxQixJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNuQyxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUUzQyxLQUFLLFVBQVU7Z0JBQ2IsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2xELE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRW5DLEtBQUssZUFBZTtnQkFDbEIsTUFBTSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDbEUsS0FBSyxRQUFRO2dCQUNYLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBRTFELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNsRSxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztvQkFDeEIsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO29CQUNoQixJQUFJLEVBQUUsSUFBSSxDQUFDLFlBQVk7b0JBQ3ZCLE9BQU8sRUFBRSxLQUFLLENBQUMsS0FBSztpQkFDckIsQ0FBQyxDQUFDO1lBRUwsS0FBSyxXQUFXO2dCQUNkLE1BQU0sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLG9CQUFvQixDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDekUsS0FBSyxRQUFRO2dCQUNYLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFFakUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQ3RELE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDO29CQUN4QixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7b0JBQ2hCLElBQUksRUFBRSxJQUFJLENBQUMsWUFBWTtpQkFDeEIsQ0FBQyxDQUFDO1lBRUwsS0FBSyxjQUFjOztvQkFDWCxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFO2dCQUVqRixJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQzlELE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDO29CQUN4QixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7b0JBQ2hCLFFBQVEsRUFBRSxRQUFRO29CQUNsQixVQUFVLEVBQUUsS0FBSyxDQUFDLE9BQU87aUJBQzFCLENBQUMsQ0FBQztRQUNQLENBQUM7SUFDSCxDQUFDOzs7Ozs7SUFFRCwrQ0FBZ0I7Ozs7O0lBQWhCLFVBQWlCLElBQW1CLEVBQUUsT0FBaUI7UUFDckQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLE1BQU0sQ0FBQztRQUNULENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDOztnQkFDTixVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUM7WUFDaEYsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLGlCQUFpQixFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUMsQ0FBQyxDQUFDO1lBQzVFLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1FBQzdCLENBQUM7UUFDRCxJQUFJLENBQUMsQ0FBQztZQUNKLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUM7Z0JBQ3BELElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO1lBQzlCLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxLQUFLLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7Z0JBQzFELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1lBQzdCLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDO2dCQUN6RCxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztZQUM5QixJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksS0FBSyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDO2dCQUMxRCxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztRQUNoQyxDQUFDO1FBRUQsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7UUFFekIsNEdBQTRHO1FBQzVHLEVBQUUsQ0FBQSxDQUFDLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekMsTUFBTSxDQUFDO1FBQ1QsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNwRSxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDakUsQ0FBQztJQUNILENBQUM7SUFFRCxpQkFBaUI7Ozs7OztJQUNqQixnREFBaUI7Ozs7OztJQUFqQixVQUFrQixJQUFtQjs7WUFDL0IsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVO1FBRWhDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QixVQUFVLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLENBQUM7O1lBRUssV0FBVyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQzs7WUFDdEQsU0FBUyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQztRQUN4RCxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDL0IsT0FBTyxDQUFDLElBQUksQ0FBQyx3REFBd0QsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUNuRixNQUFNLENBQUM7UUFDVCxDQUFDO1FBRUQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTFCLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQztZQUNaLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN4QyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUM7WUFDZCxJQUFJLENBQUMscUJBQXFCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDOzs7WUFHNUMsWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZO1FBQ3BDLEVBQUUsQ0FBQyxDQUFDLFlBQVksS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDOUUsTUFBTSxDQUFDO1FBQ1QsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QixZQUFZLEdBQUcsTUFBTSxDQUFDO1FBQ3hCLENBQUM7O1lBRUssYUFBYSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQztRQUNoRSxFQUFFLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDbkIsT0FBTyxDQUFDLElBQUksQ0FBQywrREFBK0QsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUM1RixNQUFNLENBQUM7UUFDVCxDQUFDO1FBRUQsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzVDLENBQUM7Ozs7Ozs7SUFFTyxvREFBcUI7Ozs7OztJQUE3QixVQUE4QixFQUFlLEVBQUUsS0FBc0I7UUFBdEIsc0JBQUEsRUFBQSxhQUFzQjtRQUNuRSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLHNCQUFzQjthQUNsQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMseUJBQXlCO2FBQ3JDLFNBQVMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFaEMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQ1IsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7aUJBQ1gsUUFBUSxDQUFDLENBQUMsQ0FBQztpQkFDWCxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzlCLENBQUM7Ozs7Ozs7SUFFTyw2Q0FBYzs7Ozs7O0lBQXRCLFVBQXVCLEVBQVUsRUFBRSxNQUFtQjtRQUFuQix1QkFBQSxFQUFBLFdBQW1COztZQUM5QyxNQUFNLEdBQUcsTUFBTSxHQUFHLEVBQUU7UUFDMUIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDekMsQ0FBQzs7Ozs7O0lBRU8sMENBQVc7Ozs7O0lBQW5CLFVBQW9CLFNBQWlCO1FBQ25DLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLHNCQUFzQixDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQ25ELEdBQUc7Ozs7UUFBQyxVQUFDLEVBQWUsSUFBSyxPQUFBLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUE5QixDQUE4QixFQUFDLENBQUM7SUFDOUQsQ0FBQzs7OztJQUVELHlDQUFVOzs7SUFBVjtRQUNFLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQzdCLENBQUM7Ozs7SUFFRCw4Q0FBZTs7O0lBQWY7UUFDRSx1Q0FBdUM7UUFDdkMsc0NBQXNDO1FBQ3RDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7Ozs7O0lBRUQsaURBQWtCOzs7O0lBQWxCLFVBQW1CLEtBQVU7UUFDM0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDekIsQ0FBQzs7Z0JBMWNGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsaUJBQWlCO29CQUMzQixRQUFRLEVBQUUsMjhSQThOWDtvQkFDQyxNQUFNLEVBQUUsQ0FBQyw2NkJBQTY2QixDQUFDO29CQUN2N0IsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7aUJBQ3RDOzs7Z0JBN09lLEtBQUs7Z0JBRWIsV0FBVztnQkFNWCxrQkFBa0I7Z0JBRGxCLG9CQUFvQjs7OytCQXdPekIsS0FBSzt3Q0FDTCxLQUFLOzRDQUNMLEtBQUs7MkNBQ0wsS0FBSzt5Q0FDTCxLQUFLO21DQUNMLEtBQUs7dUJBRUwsS0FBSzswQkFDTCxLQUFLOzhCQUNMLE1BQU07O0lBNk5ULDJCQUFDO0NBQUEsQUEzY0QsSUEyY0M7U0F2T1ksb0JBQW9COzs7SUFDL0IsNENBQXdDOztJQUN4QyxxREFBaUQ7O0lBQ2pELHlEQUFxRDs7SUFDckQsd0RBQW9EOztJQUNwRCxzREFBa0Q7O0lBQ2xELGdEQUE0Qzs7SUFFNUMsb0NBQXlCOztJQUN6Qix1Q0FBa0M7O0lBQ2xDLDJDQUEyQzs7SUFFM0MsNENBQTRCOztJQUM1Qiw4Q0FBc0I7O0lBRXRCLHNDQUFlOztJQUNmLHVDQUFpQjs7SUFDakIseUNBQWtCOzs7OztJQUdoQixxQ0FBOEI7Ozs7O0lBQzlCLDJDQUFnQzs7Ozs7SUFDaEMsa0RBQThDOztJQUM5QyxvREFBaUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQsIFRlbXBsYXRlUmVmLCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7c2VsZWN0LCBTdG9yZX0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5pbXBvcnQge1RyZWVNb2RlbH0gZnJvbSAnLi9tb2RlbHMvdHJlZS5tb2RlbCc7XHJcbmltcG9ydCB7Tm9kZVNlcnZpY2V9IGZyb20gJy4vc2VydmljZXMvbm9kZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtOb2RlSW50ZXJmYWNlfSBmcm9tICcuL2ludGVyZmFjZXMvbm9kZS5pbnRlcmZhY2UnO1xyXG5pbXBvcnQge1NFVF9MT0FESU5HX1NUQVRFfSBmcm9tICcuL3JlZHVjZXJzL2FjdGlvbnMuYWN0aW9uJztcclxuaW1wb3J0ICogYXMgQUNUSU9OUyBmcm9tICcuL3JlZHVjZXJzL2FjdGlvbnMuYWN0aW9uJztcclxuaW1wb3J0IHtBcHBTdG9yZX0gZnJvbSAnLi9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnknO1xyXG5pbXBvcnQge05neFNtYXJ0TW9kYWxTZXJ2aWNlfSBmcm9tICduZ3gtc21hcnQtbW9kYWwnO1xyXG5pbXBvcnQge05vZGVDbGlja2VkU2VydmljZX0gZnJvbSAnLi9zZXJ2aWNlcy9ub2RlLWNsaWNrZWQuc2VydmljZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2ZtLWZpbGUtbWFuYWdlcicsXHJcbiAgdGVtcGxhdGU6IGA8bmctY29udGFpbmVyICpuZ0lmPVwiaXNQb3B1cDsgdGhlbiBpdElzUG9wdXAgZWxzZSBzaG93Q29udGVudFwiPjwvbmctY29udGFpbmVyPlxyXG5cclxuPG5nLXRlbXBsYXRlICNpdElzUG9wdXA+XHJcbiAgPGRpdiAqbmdJZj1cIiFmbU9wZW5cIj5cclxuICAgIDxidXR0b24gY2xhc3M9XCJidXR0b24gYmlnXCIgKGNsaWNrKT1cImZtU2hvd0hpZGUoKVwiIHRyYW5zbGF0ZT1cIlwiPk9wZW4gZmlsZSBtYW5hZ2VyPC9idXR0b24+XHJcbiAgPC9kaXY+XHJcbiAgPGRpdiBjbGFzcz1cImZpbGUtbWFuYWdlci1iYWNrZHJvcFwiICpuZ0lmPVwiZm1PcGVuXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZm1Nb2RhbEluc2lkZVwiPlxyXG4gICAgICA8ZGl2ICpuZ0lmPVwiZm1PcGVuOyB0aGVuIHNob3dDb250ZW50XCI+PC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuPC9uZy10ZW1wbGF0ZT5cclxuXHJcbjxuZy10ZW1wbGF0ZSAjc2hvd0NvbnRlbnQ+XHJcbiAgPGRpdiBjbGFzcz1cImNvbnRlbnRcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJmaWxlLW1hbmFnZXItbmF2YmFyXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJwYXRoXCI+XHJcbiAgICAgICAgPGFwcC1uYXYtYmFyPjwvYXBwLW5hdi1iYXI+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGRpdiBjbGFzcz1cIm5hdmlnYXRpb25cIj5cclxuICAgICAgICA8YXBwLW5hdmlnYXRpb24+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uIGNsb3NlXCIgKGNsaWNrKT1cImZtU2hvd0hpZGUoKVwiICpuZ0lmPVwiaXNQb3B1cFwiPlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS0yeCBmYS10aW1lc1wiPjwvaT5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvYXBwLW5hdmlnYXRpb24+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPGRpdiBjbGFzcz1cImhvbGRlclwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiZmlsZS1tYW5hZ2VyLWxlZnRcIj5cclxuICAgICAgICA8YXBwLXRyZWUgW3RyZWVNb2RlbF09XCJ0cmVlXCI+XHJcbiAgICAgICAgICA8bmctdGVtcGxhdGUgbGV0LW5vZGVzPlxyXG4gICAgICAgICAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7JGltcGxpY2l0OiBub2Rlc31cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImljb25UZW1wbGF0ZSA/IGljb25UZW1wbGF0ZSA6IGRlZmF1bHRJY29uVGVtcGxhdGVcIj5cclxuICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XHJcbiAgICAgICAgICA8L25nLXRlbXBsYXRlPlxyXG4gICAgICAgIDwvYXBwLXRyZWU+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGRpdiBjbGFzcz1cInJpZ2h0XCI+XHJcbiAgICAgICAgPGFwcC1mb2xkZXItY29udGVudFxyXG4gICAgICAgICAgW3RyZWVNb2RlbF09XCJ0cmVlXCJcclxuICAgICAgICAgIChvcGVuVXBsb2FkRGlhbG9nKT1cImhhbmRsZVVwbG9hZERpYWxvZygkZXZlbnQpXCJcclxuICAgICAgICAgIFtmb2xkZXJDb250ZW50VGVtcGxhdGVdPVwiZm9sZGVyQ29udGVudFRlbXBsYXRlID8gZm9sZGVyQ29udGVudFRlbXBsYXRlIDogZGVmYXVsdEZvbGRlckNvbnRlbnRUZW1wbGF0ZVwiXHJcbiAgICAgICAgICBbZm9sZGVyQ29udGVudE5ld1RlbXBsYXRlXT1cImZvbGRlckNvbnRlbnROZXdUZW1wbGF0ZSA/IGZvbGRlckNvbnRlbnROZXdUZW1wbGF0ZSA6IGRlZmF1bHRGb2xkZXJDb250ZW50TmV3VGVtcGxhdGVcIlxyXG4gICAgICAgICAgW2ZvbGRlckNvbnRlbnRCYWNrVGVtcGxhdGVdPVwiZm9sZGVyQ29udGVudEJhY2tUZW1wbGF0ZSA/IGZvbGRlckNvbnRlbnRCYWNrVGVtcGxhdGUgOiBkZWZhdWx0Rm9sZGVyQ29udGVudEJhY2tUZW1wbGF0ZVwiPlxyXG4gICAgICAgIDwvYXBwLWZvbGRlci1jb250ZW50PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxhcHAtc2lkZS12aWV3IGlkPVwic2lkZS12aWV3XCJcclxuICAgICAgICAgICAgICAgICAgICAgW25vZGVdPVwic2VsZWN0ZWROb2RlXCJcclxuICAgICAgICAgICAgICAgICAgICAgW3NpZGVWaWV3VGVtcGxhdGVdPVwic2lkZVZpZXdUZW1wbGF0ZSA/IHNpZGVWaWV3VGVtcGxhdGUgOiBkZWZhdWx0U2lkZVZpZXdUZW1wbGF0ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgIFthbGxvd0ZvbGRlckRvd25sb2FkXT1cInRyZWUuY29uZmlnLm9wdGlvbnMuYWxsb3dGb2xkZXJEb3dubG9hZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgIChjbGlja0V2ZW50KT1cImhhbmRsZUZpbGVNYW5hZ2VyQ2xpY2tFdmVudCgkZXZlbnQpXCI+XHJcbiAgICAgIDwvYXBwLXNpZGUtdmlldz5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG5cclxuICA8YXBwLXVwbG9hZCAqbmdJZj1cIm5ld0RpYWxvZ1wiXHJcbiAgICAgICAgICAgICAgW29wZW5EaWFsb2ddPVwibmV3RGlhbG9nXCJcclxuICAgICAgICAgICAgICAoY2xvc2VEaWFsb2cpPVwiaGFuZGxlVXBsb2FkRGlhbG9nKGZhbHNlKVwiXHJcbiAgICAgICAgICAgICAgKGNyZWF0ZURpcik9XCJoYW5kbGVGaWxlTWFuYWdlckNsaWNrRXZlbnQoe3R5cGU6ICdjcmVhdGVGb2xkZXInLCBwYXlsb2FkOiAkZXZlbnR9KVwiPlxyXG4gIDwvYXBwLXVwbG9hZD5cclxuXHJcbiAgPGFwcC1sb2FkaW5nLW92ZXJsYXlcclxuICAgICpuZ0lmPVwibG9hZGluZ1wiXHJcbiAgICBbbG9hZGluZ092ZXJsYXlUZW1wbGF0ZV09XCJsb2FkaW5nT3ZlcmxheVRlbXBsYXRlID8gbG9hZGluZ092ZXJsYXlUZW1wbGF0ZSA6IGRlZmF1bHRMb2FkaW5nT3ZlcmxheVRlbXBsYXRlXCI+XHJcbiAgPC9hcHAtbG9hZGluZy1vdmVybGF5PlxyXG48L25nLXRlbXBsYXRlPlxyXG5cclxuPG5nLXRlbXBsYXRlIGxldC1ub2RlICNkZWZhdWx0SWNvblRlbXBsYXRlPlxyXG4gIDxkaXYgY2xhc3M9XCJmaWxlLW1hbmFnZXItbm9kZVwiIHN0eWxlPVwiZGlzcGxheTogaW5saW5lLWJsb2NrOyBwYWRkaW5nOiAzcHhcIj5cclxuICAgIDxkaXYgKm5nSWY9XCJub2RlLmlzRm9sZGVyOyB0aGVuIGl0SXNGb2xkZXIgZWxzZSBzaG93RmlsZVwiPjwvZGl2PlxyXG5cclxuICAgIDxuZy10ZW1wbGF0ZSAjaXRJc0ZvbGRlcj5cclxuICAgICAgPGRpdiAqbmdJZj1cIm5vZGUuaXNFeHBhbmRlZDsgdGhlbiBpc0ZvbGRlckV4cGFuZGVkIGVsc2UgaXNGb2xkZXJDbG9zZWRcIj48L2Rpdj5cclxuICAgIDwvbmctdGVtcGxhdGU+XHJcblxyXG4gICAgPG5nLXRlbXBsYXRlICNzaG93RmlsZT48aSBjbGFzcz1cImZhcyBmYS1maWxlIGNoaWxkXCI+PC9pPjwvbmctdGVtcGxhdGU+XHJcbiAgICA8bmctdGVtcGxhdGUgI2lzRm9sZGVyRXhwYW5kZWQ+PGkgY2xhc3M9XCJmYXMgZmEtZm9sZGVyLW9wZW4gY2hpbGRcIj48L2k+PC9uZy10ZW1wbGF0ZT5cclxuICAgIDxuZy10ZW1wbGF0ZSAjaXNGb2xkZXJDbG9zZWQ+PGkgY2xhc3M9XCJmYXMgZmEtZm9sZGVyIGNoaWxkXCI+PC9pPjwvbmctdGVtcGxhdGU+XHJcblxyXG4gICAgPHNwYW4+e3tub2RlLm5hbWV9fTwvc3Bhbj5cclxuICA8L2Rpdj5cclxuPC9uZy10ZW1wbGF0ZT5cclxuPG5nLXRlbXBsYXRlIGxldC1ub2RlICNkZWZhdWx0Rm9sZGVyQ29udGVudFRlbXBsYXRlPlxyXG4gIDxkaXYgY2xhc3M9XCJmaWxlLW1hbmFnZXItaXRlbVwiPlxyXG4gICAgPGRpdiBjbGFzcz1cImZpbGUtcHJldmlld1wiPlxyXG4gICAgICA8ZGl2ICpuZ0lmPVwibm9kZS5pc0ZvbGRlcjsgdGhlbiBpdElzRm9sZGVyIGVsc2Ugc2hvd0ZpbGVcIj48L2Rpdj5cclxuICAgICAgPG5nLXRlbXBsYXRlICNpdElzRm9sZGVyPjxpIGNsYXNzPVwiZmFzIGZhLTN4IGZhLWZvbGRlciBjaGlsZFwiPjwvaT48L25nLXRlbXBsYXRlPlxyXG4gICAgICA8bmctdGVtcGxhdGUgI3Nob3dGaWxlPjxpIGNsYXNzPVwiZmFzIGZhLTN4IGZhLWZpbGUgY2hpbGRcIj48L2k+PC9uZy10ZW1wbGF0ZT5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cImZpbGUtbmFtZVwiPlxyXG4gICAgICB7e25vZGUubmFtZX19XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuPC9uZy10ZW1wbGF0ZT5cclxuPG5nLXRlbXBsYXRlICNkZWZhdWx0Rm9sZGVyQ29udGVudE5ld1RlbXBsYXRlPlxyXG4gIDxkaXYgY2xhc3M9XCJmaWxlLW1hbmFnZXItaXRlbVwiPlxyXG4gICAgPGRpdiBjbGFzcz1cImZpbGUtcHJldmlld1wiIHN0eWxlPVwid2lkdGg6IDEwMCU7IGhlaWdodDoxMDAlXCI+XHJcbiAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLTN4IGZhLXBsdXMgY2hpbGRcIiBzdHlsZT1cImxpbmUtaGVpZ2h0OiAyXCI+PC9pPlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbjwvbmctdGVtcGxhdGU+XHJcbjxuZy10ZW1wbGF0ZSBsZXQtbm9kZSAjZGVmYXVsdEZvbGRlckNvbnRlbnRCYWNrVGVtcGxhdGU+XHJcbiAgPGRpdiBjbGFzcz1cImZpbGUtbWFuYWdlci1pdGVtXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZmlsZS1wcmV2aWV3XCIgc3R5bGU9XCJ3aWR0aDogMTAwJTsgaGVpZ2h0OjEwMCVcIj5cclxuICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtMnggZmEtZWxsaXBzaXMtaFwiIHN0eWxlPVwibGluZS1oZWlnaHQ6IDVcIj48L2k+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuPC9uZy10ZW1wbGF0ZT5cclxuPG5nLXRlbXBsYXRlIGxldC10aW1lb3V0TWVzc2FnZSAjZGVmYXVsdExvYWRpbmdPdmVybGF5VGVtcGxhdGU+XHJcbiAgPGRpdiBjbGFzcz1cImZpbGUtbWFuYWdlci1iYWNrZHJvcCBsb2FkaW5nXCIgKGNsaWNrKT1cImJhY2tkcm9wQ2xpY2tlZCgpXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZmlsZS1tYW5hZ2VyLWVycm9yXCIgKm5nSWY9XCJ0aW1lb3V0TWVzc2FnZVwiPnt7dGltZW91dE1lc3NhZ2V9fTwvZGl2PlxyXG4gIDwvZGl2PlxyXG4gIDxkaXYgY2xhc3M9XCJzcGlubmVyXCI+XHJcbiAgICA8aSBjbGFzcz1cImZhcyBmYS01eCBmYS1zcGluIGZhLXN5bmMtYWx0XCI+PC9pPlxyXG4gIDwvZGl2PlxyXG48L25nLXRlbXBsYXRlPlxyXG48bmctdGVtcGxhdGUgbGV0LW5vZGUgI2RlZmF1bHRTaWRlVmlld1RlbXBsYXRlPlxyXG4gIDxkaXYgc3R5bGU9XCJwb3NpdGlvbjogYWJzb2x1dGU7IGJvdHRvbTogMDsgd2lkdGg6IDEwMCU7IG1hcmdpbjogNXB4IGF1dG9cIj5cclxuICAgIDxzcGFuICpuZ0lmPVwibm9kZS5pc0ZvbGRlclwiIHRyYW5zbGF0ZT5ObyBkYXRhIGF2YWlsYWJsZSBmb3IgdGhpcyBmb2xkZXI8L3NwYW4+XHJcbiAgICA8c3BhbiAqbmdJZj1cIiFub2RlLmlzRm9sZGVyXCIgdHJhbnNsYXRlPk5vIGRhdGEgYXZhaWxhYmxlIGZvciB0aGlzIGZpbGU8L3NwYW4+XHJcbiAgPC9kaXY+XHJcbjwvbmctdGVtcGxhdGU+XHJcblxyXG48bmd4LXNtYXJ0LW1vZGFsIGlkZW50aWZpZXI9XCJyZW5hbWVNb2RhbFwiIFtkaXNtaXNzYWJsZV09XCJmYWxzZVwiIFtjbG9zYWJsZV09XCJmYWxzZVwiICpuZ0lmPVwic2VsZWN0ZWROb2RlXCIgI3JlbmFtZU1vZGFsPlxyXG4gIDxoMiBjbGFzcz1cIm1vZGFsLXRpdGxlXCIgdHJhbnNsYXRlPlxyXG4gICAgUmVuYW1lIGZpbGVcclxuICA8L2gyPlxyXG4gIDxwIGNsYXNzPVwicmVuYW1lLW5hbWVcIiB0cmFuc2xhdGU+XHJcbiAgICBPbGQgbmFtZVxyXG4gIDwvcD5cclxuICA8c3BhbiBzdHlsZT1cIm1hcmdpbjogOHB4XCI+e3tzZWxlY3RlZE5vZGUubmFtZX19PC9zcGFuPlxyXG4gIDxwIGNsYXNzPVwicmVuYW1lLW5hbWVcIiB0cmFuc2xhdGU+XHJcbiAgICBOZXcgbmFtZVxyXG4gIDwvcD5cclxuICA8aW5wdXQgcGxhY2Vob2xkZXI9XCJOZXcgbmFtZVwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJyZW5hbWUtaW5wdXRcIiBbdmFsdWVdPVwic2VsZWN0ZWROb2RlLm5hbWVcIiAjcmVuYW1lSW5wdXRcclxuICAgICAgICAgKGtleXVwLmVudGVyKT1cImhhbmRsZUZpbGVNYW5hZ2VyQ2xpY2tFdmVudCh7dHlwZTogJ3JlbmFtZScsIHZhbHVlOiByZW5hbWVJbnB1dC52YWx1ZX0pXCJcclxuICAgICAgICAgb25jbGljaz1cInRoaXMuc2VsZWN0KCk7XCI+XHJcbiAgPGJyPlxyXG5cclxuICA8ZGl2IGNsYXNzPVwicmVuYW1lLWJ1dHRvblwiPlxyXG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ1dHRvbiBiaWdcIiB0cmFuc2xhdGVcclxuICAgICAgICAgICAgKGNsaWNrKT1cImhhbmRsZUZpbGVNYW5hZ2VyQ2xpY2tFdmVudCh7dHlwZTogJ3JlbmFtZScsIHZhbHVlOiByZW5hbWVJbnB1dC52YWx1ZX0pXCJcclxuICAgICAgICAgICAgW2Rpc2FibGVkXT1cInJlbmFtZUlucHV0LnZhbHVlID09PSBzZWxlY3RlZE5vZGUubmFtZSB8fCByZW5hbWVJbnB1dC52YWx1ZS5sZW5ndGggPT09IDBcIj5cclxuICAgICAgUmVuYW1lXHJcbiAgICA8L2J1dHRvbj5cclxuICAgIDxidXR0b24gY2xhc3M9XCJidXR0b24gYmlnXCIgKGNsaWNrKT1cInJlbmFtZU1vZGFsLmNsb3NlKClcIiB0cmFuc2xhdGU+XHJcbiAgICAgIENhbmNlbFxyXG4gICAgPC9idXR0b24+XHJcbiAgPC9kaXY+XHJcblxyXG48L25neC1zbWFydC1tb2RhbD5cclxuPG5neC1zbWFydC1tb2RhbCAqbmdJZj1cInNlbGVjdGVkTm9kZVwiIGlkZW50aWZpZXI9XCJjb25maXJtRGVsZXRlTW9kYWxcIiAjZGVsZXRlTW9kYWxcclxuICAgICAgICAgICAgICAgICBbZGlzbWlzc2FibGVdPVwiZmFsc2VcIiBbY2xvc2FibGVdPVwiZmFsc2VcIj5cclxuICA8aDIgY2xhc3M9XCJtb2RhbC10aXRsZVwiPlxyXG4gICAgPHNwYW4gdHJhbnNsYXRlPllvdSBhcmUgdHJ5aW5nIHRvIGRlbGV0ZSBmb2xsb3dpbmcgPC9zcGFuPlxyXG4gICAgPHNwYW4gKm5nSWY9XCJzZWxlY3RlZE5vZGUuaXNGb2xkZXJcIiB0cmFuc2xhdGU+Zm9sZGVyPC9zcGFuPlxyXG4gICAgPHNwYW4gKm5nSWY9XCIhc2VsZWN0ZWROb2RlLmlzRm9sZGVyXCIgdHJhbnNsYXRlPmZpbGU8L3NwYW4+XHJcbiAgPC9oMj5cclxuXHJcbiAgPGRpdiBzdHlsZT1cIndpZHRoOiAxMDAlOyBtYXJnaW46IDVweCBhdXRvOyB0ZXh0LWFsaWduOiBjZW50ZXJcIj57e3NlbGVjdGVkTm9kZS5uYW1lfX08L2Rpdj5cclxuXHJcbiAgPGRpdiBjbGFzcz1cInJlbmFtZS1idXR0b25cIj5cclxuICAgIDxidXR0b24gY2xhc3M9XCJidXR0b24gYmlnXCIgKGNsaWNrKT1cImhhbmRsZUZpbGVNYW5hZ2VyQ2xpY2tFdmVudCh7dHlwZTogJ3JlbW92ZSd9KVwiPlxyXG4gICAgICA8c3BhbiB0cmFuc2xhdGU+WWVzLCBkZWxldGUgdGhpcyA8L3NwYW4+XHJcbiAgICAgIDxzcGFuICpuZ0lmPVwic2VsZWN0ZWROb2RlLmlzRm9sZGVyXCIgdHJhbnNsYXRlPmZvbGRlcjwvc3Bhbj5cclxuICAgICAgPHNwYW4gKm5nSWY9XCIhc2VsZWN0ZWROb2RlLmlzRm9sZGVyXCIgdHJhbnNsYXRlPmZpbGU8L3NwYW4+XHJcbiAgICA8L2J1dHRvbj5cclxuICAgIDxidXR0b24gY2xhc3M9XCJidXR0b24gYmlnXCIgKGNsaWNrKT1cImRlbGV0ZU1vZGFsLmNsb3NlKClcIiB0cmFuc2xhdGU+XHJcbiAgICAgIENhbmNlbFxyXG4gICAgPC9idXR0b24+XHJcbiAgPC9kaXY+XHJcbjwvbmd4LXNtYXJ0LW1vZGFsPlxyXG48bmd4LXNtYXJ0LW1vZGFsIGlkZW50aWZpZXI9XCJzZWFyY2hNb2RhbFwiICNzZWFyY2hNb2RhbCBbY2xvc2FibGVdPVwidHJ1ZVwiPlxyXG4gIDxoMiBjbGFzcz1cIm1vZGFsLXRpdGxlXCIgc3R5bGU9XCJtYXJnaW4tYm90dG9tOiAycHhcIiB0cmFuc2xhdGVcclxuICAgICAgKm5nSWY9XCJzZWFyY2hNb2RhbC5oYXNEYXRhKCkgJiYgc2VhcmNoTW9kYWwuZ2V0RGF0YSgpLnJlc3BvbnNlLmxlbmd0aCAhPT0gMFwiPlxyXG4gICAgU2VhcmNoIHJlc3VsdHMgZm9yXHJcbiAgPC9oMj5cclxuICA8aDIgY2xhc3M9XCJtb2RhbC10aXRsZVwiIHN0eWxlPVwibWFyZ2luLWJvdHRvbTogMnB4XCIgdHJhbnNsYXRlXHJcbiAgICAgICpuZ0lmPVwiIXNlYXJjaE1vZGFsLmhhc0RhdGEoKSB8fCBzZWFyY2hNb2RhbC5nZXREYXRhKCkucmVzcG9uc2UubGVuZ3RoID09PSAwXCI+XHJcbiAgICBObyByZXN1bHRzIGZvdW5kIGZvclxyXG4gIDwvaDI+XHJcbiAgPGRpdiBzdHlsZT1cInRleHQtYWxpZ246IGNlbnRlclwiICpuZ0lmPVwic2VhcmNoTW9kYWwuaGFzRGF0YSgpXCI+e3tzZWFyY2hNb2RhbC5nZXREYXRhKCkuc2VhcmNoU3RyaW5nfX08L2Rpdj5cclxuXHJcbiAgPGRpdiAqbmdJZj1cInNlYXJjaE1vZGFsLmhhc0RhdGEoKSAmJiBzZWFyY2hNb2RhbC5nZXREYXRhKCkucmVzcG9uc2UubGVuZ3RoICE9PSAwXCI+XHJcbiAgICA8dGFibGUgc3R5bGU9XCJtYXJnaW46IDAgYXV0b1wiPlxyXG4gICAgICA8dHI+XHJcbiAgICAgICAgPHRkIGNsYXNzPVwidGFibGUtaXRlbSB0YWJsZS1oZWFkXCIgdHJhbnNsYXRlPkZpbGUgbmFtZTwvdGQ+XHJcbiAgICAgICAgPHRkIGNsYXNzPVwidGFibGUtaXRlbS1zaG9ydCB0YWJsZS1oZWFkXCIgdHJhbnNsYXRlPlNpemU8L3RkPlxyXG4gICAgICA8L3RyPlxyXG4gICAgICA8dHIgKm5nRm9yPVwibGV0IGl0ZW0gb2Ygc2VhcmNoTW9kYWwuZ2V0RGF0YSgpLnJlc3BvbnNlXCIgKGNsaWNrKT1cInNlYXJjaENsaWNrZWQoaXRlbSlcIj5cclxuICAgICAgICA8dGQgc3R5bGU9XCJjdXJzb3I6IHBvaW50ZXJcIj5cclxuICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJpdGVtLmZpbGVDYXRlZ29yeSA9PT0gJ0QnOyBlbHNlIGZpbGVcIj5cclxuICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtZm9sZGVyIHNlYXJjaC1vdXRwdXQtaWNvblwiPjwvaT5cclxuICAgICAgICAgIDwvbmctY29udGFpbmVyPlxyXG4gICAgICAgICAgPG5nLXRlbXBsYXRlICNmaWxlPlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1maWxlIHNlYXJjaC1vdXRwdXQtaWNvblwiPjwvaT5cclxuICAgICAgICAgIDwvbmctdGVtcGxhdGU+XHJcbiAgICAgICAgICA8c3BhbiBzdHlsZT1cInRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzXCI+e3tpdGVtLm5hbWV9fTwvc3Bhbj5cclxuICAgICAgICA8L3RkPlxyXG4gICAgICAgIDx0ZCBjbGFzcz1cInRhYmxlLWl0ZW0tc2hvcnRcIj57e2l0ZW0uc2l6ZX19PC90ZD5cclxuICAgICAgPC90cj5cclxuICAgIDwvdGFibGU+XHJcbiAgPC9kaXY+XHJcbjwvbmd4LXNtYXJ0LW1vZGFsPlxyXG48bmd4LXNtYXJ0LW1vZGFsIGlkZW50aWZpZXI9XCJ3YWl0TW9kYWxcIiBbY2xvc2FibGVdPVwiZmFsc2VcIiBbZGlzbWlzc2FibGVdPVwiZmFsc2VcIiBbZXNjYXBhYmxlXT1cImZhbHNlXCI+XHJcbiAgPGgyIGNsYXNzPVwibW9kYWwtdGl0bGVcIiBzdHlsZT1cIm1hcmdpbi10b3A6IDIwcHhcIj5cclxuICAgIHt7J1Byb2Nlc3NpbmcgcmVxdWVzdCd9fS4uLlxyXG4gIDwvaDI+XHJcblxyXG4gIDxkaXYgc3R5bGU9XCJ0ZXh0LWFsaWduOiBjZW50ZXI7IGhlaWdodDogNzBweFwiPlxyXG4gICAgPGkgY2xhc3M9XCJmYXMgZmEtc3Bpbm5lciBmYS1zcGluIGZhLTR4XCI+PC9pPlxyXG4gIDwvZGl2PlxyXG48L25neC1zbWFydC1tb2RhbD5cclxuPG5neC1zbWFydC1tb2RhbCBpZGVudGlmaWVyPVwiZXJyb3JNb2RhbFwiIFtjbG9zYWJsZV09XCJ0cnVlXCI+XHJcbiAgPGgyIGNsYXNzPVwibW9kYWwtdGl0bGVcIiBzdHlsZT1cIm1hcmdpbi10b3A6IDIwcHhcIj5cclxuICAgIHt7J1NvbWV0aGluZyB3ZW50IHdyb25nIHdpdGggeW91ciByZXF1ZXN0J319Li4uXHJcbiAgPC9oMj5cclxuPC9uZ3gtc21hcnQtbW9kYWw+XHJcbmAsXHJcbiAgc3R5bGVzOiBbYC5jb250ZW50e2hlaWdodDoxMDAlO21pbi13aWR0aDo4NTBweH0uaG9sZGVye2Rpc3BsYXk6LXdlYmtpdC1mbGV4O2Rpc3BsYXk6ZmxleDtoZWlnaHQ6Y2FsYygxMDAlIC0gNzVweCl9LnBhdGh7bWFyZ2luOmF1dG8gMDtkaXNwbGF5OmJsb2NrfS5uYXZpZ2F0aW9ue21hcmdpbjphdXRvIDA7ZGlzcGxheTotd2Via2l0LWZsZXg7ZGlzcGxheTpmbGV4fS5uYXZpZ2F0aW9uIC5idXR0b257bWFyZ2luOjAgMTBweDtwYWRkaW5nOjA7cG9zaXRpb246cmVsYXRpdmV9LnJpZ2h0e3dpZHRoOjEwMCU7cG9zaXRpb246cmVsYXRpdmU7b3ZlcmZsb3c6YXV0b30uZmlsZS1uYW1le3dpZHRoOjEwMHB4O2hlaWdodDoyNXB4O292ZXJmbG93OmhpZGRlbjt3aGl0ZS1zcGFjZTpub3dyYXA7dGV4dC1vdmVyZmxvdzplbGxpcHNpcztib3gtc2l6aW5nOmJvcmRlci1ib3g7LXdlYmtpdC11c2VyLXNlbGVjdDpub25lOy1tb3otdXNlci1zZWxlY3Q6bm9uZTstbXMtdXNlci1zZWxlY3Q6bm9uZTt1c2VyLXNlbGVjdDpub25lfS5maWxlLXByZXZpZXd7bWFyZ2luOmF1dG99LmZpbGUtcHJldmlldyBpe2xpbmUtaGVpZ2h0OjEuNX0uc3Bpbm5lcntwb3NpdGlvbjphYnNvbHV0ZTt0b3A6NTAlO2xlZnQ6NTAlOy13ZWJraXQtdHJhbnNmb3JtOnRyYW5zbGF0ZSgtNTAlLC01MCUpO3RyYW5zZm9ybTp0cmFuc2xhdGUoLTUwJSwtNTAlKTtjdXJzb3I6cHJvZ3Jlc3N9LnJlbmFtZS1idXR0b257bWFyZ2luOjIwcHggYXV0bztkaXNwbGF5OmJsb2NrO3RleHQtYWxpZ246Y2VudGVyfS5tb2RhbC10aXRsZXttYXJnaW4tdG9wOjVweDt0ZXh0LWFsaWduOmNlbnRlcn0uc2VhcmNoLW91dHB1dHttYXJnaW46MTVweCAwfS5zZWFyY2gtb3V0cHV0LWljb257bWFyZ2luOjJweCA1cHh9LnRhYmxlLWl0ZW17d2lkdGg6ODAlfS50YWJsZS1pdGVtLXNob3J0e3dpZHRoOjIwJTt0ZXh0LWFsaWduOnJpZ2h0fWBdLFxyXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcclxufSlcclxuZXhwb3J0IGNsYXNzIEZpbGVNYW5hZ2VyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBASW5wdXQoKSBpY29uVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgQElucHV0KCkgZm9sZGVyQ29udGVudFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gIEBJbnB1dCgpIGZvbGRlckNvbnRlbnRCYWNrVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgQElucHV0KCkgZm9sZGVyQ29udGVudE5ld1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gIEBJbnB1dCgpIGxvYWRpbmdPdmVybGF5VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgQElucHV0KCkgc2lkZVZpZXdUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgQElucHV0KCkgdHJlZTogVHJlZU1vZGVsO1xyXG4gIEBJbnB1dCgpIGlzUG9wdXA6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBAT3V0cHV0KCkgaXRlbUNsaWNrZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIHNlbGVjdGVkTm9kZTogTm9kZUludGVyZmFjZTtcclxuICBzaWRlTWVudUNsb3NlZCA9IHRydWU7XHJcblxyXG4gIGZtT3BlbiA9IGZhbHNlO1xyXG4gIGxvYWRpbmc6IGJvb2xlYW47XHJcbiAgbmV3RGlhbG9nID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU8QXBwU3RvcmU+LFxyXG4gICAgcHJpdmF0ZSBub2RlU2VydmljZTogTm9kZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIG5vZGVDbGlja2VkU2VydmljZTogTm9kZUNsaWNrZWRTZXJ2aWNlLFxyXG4gICAgcHVibGljIG5neFNtYXJ0TW9kYWxTZXJ2aWNlOiBOZ3hTbWFydE1vZGFsU2VydmljZSxcclxuICApIHtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgd2luZG93LmNvbnNvbGUgPSB3aW5kb3cuY29uc29sZSB8fCB7fTtcclxuICAgIHdpbmRvdy5jb25zb2xlLmxvZyA9IHdpbmRvdy5jb25zb2xlLmxvZyB8fCBmdW5jdGlvbiAoKSB7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMubm9kZVNlcnZpY2UudHJlZSA9IHRoaXMudHJlZTtcclxuICAgIHRoaXMubm9kZUNsaWNrZWRTZXJ2aWNlLnRyZWUgPSB0aGlzLnRyZWU7XHJcbiAgICB0aGlzLm5vZGVTZXJ2aWNlLnN0YXJ0TWFuYWdlckF0KHRoaXMudHJlZS5jdXJyZW50UGF0aCk7XHJcblxyXG4gICAgdGhpcy5zdG9yZVxyXG4gICAgICAucGlwZShzZWxlY3Qoc3RhdGUgPT4gKHN0YXRlLmZpbGVNYW5hZ2VyU3RhdGUgfHwge30gYXMgYW55KS5pc0xvYWRpbmcpKVxyXG4gICAgICAuc3Vic2NyaWJlKChkYXRhOiBib29sZWFuKSA9PiB7XHJcbiAgICAgICAgdGhpcy5sb2FkaW5nID0gZGF0YTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgdGhpcy5zdG9yZVxyXG4gICAgICAucGlwZShzZWxlY3Qoc3RhdGUgPT4gKHN0YXRlLmZpbGVNYW5hZ2VyU3RhdGUgfHwge30gYXMgYW55KS5zZWxlY3RlZE5vZGUpKVxyXG4gICAgICAuc3Vic2NyaWJlKChub2RlOiBOb2RlSW50ZXJmYWNlKSA9PiB7XHJcbiAgICAgICAgaWYgKCFub2RlKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBmaXhlZCBoaWdobGlnaHRpbmcgZXJyb3Igd2hlbiBjbG9zaW5nIG5vZGUgYnV0IG5vdCBjaGFuZ2luZyBwYXRoXHJcbiAgICAgICAgaWYgKChub2RlLmlzRXhwYW5kZWQgJiYgbm9kZS5wYXRoVG9Ob2RlICE9PSB0aGlzLm5vZGVTZXJ2aWNlLmN1cnJlbnRQYXRoKSAmJiAhbm9kZS5zdGF5T3Blbikge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5oYW5kbGVGaWxlTWFuYWdlckNsaWNrRXZlbnQoe3R5cGU6ICdzZWxlY3QnLCBub2RlOiBub2RlfSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgb25JdGVtQ2xpY2tlZChldmVudDogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLml0ZW1DbGlja2VkLmVtaXQoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgc2VhcmNoQ2xpY2tlZChkYXRhOiBhbnkpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpO1xyXG5cclxuICAgIGNvbnN0IG5vZGUgPSB0aGlzLm5vZGVTZXJ2aWNlLmZpbmROb2RlQnlJZChkYXRhLmlkKTtcclxuICAgIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ3NlYXJjaE1vZGFsJykuY2xvc2UoKTtcclxuICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IEFDVElPTlMuU0VUX1NFTEVDVEVEX05PREUsIHBheWxvYWQ6IG5vZGV9KTtcclxuICB9XHJcblxyXG4gIGhhbmRsZUZpbGVNYW5hZ2VyQ2xpY2tFdmVudChldmVudDogYW55KSB7XHJcbiAgICBzd2l0Y2ggKGV2ZW50LnR5cGUpIHtcclxuICAgICAgY2FzZSAnY2xvc2VTaWRlVmlldycgOlxyXG4gICAgICAgIHJldHVybiB0aGlzLm5vZGVDbGlja0hhbmRsZXIoZXZlbnQubm9kZSwgdHJ1ZSk7XHJcblxyXG4gICAgICBjYXNlICdzZWxlY3QnIDpcclxuICAgICAgICB0aGlzLm9uSXRlbUNsaWNrZWQoZXZlbnQpO1xyXG4gICAgICAgIHRoaXMuaGlnaGxpZ2h0U2VsZWN0ZWQoZXZlbnQubm9kZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZUNsaWNrSGFuZGxlcihldmVudC5ub2RlKTtcclxuXHJcbiAgICAgIGNhc2UgJ2Rvd25sb2FkJyA6XHJcbiAgICAgICAgdGhpcy5ub2RlQ2xpY2tlZFNlcnZpY2Uuc3RhcnREb3dubG9hZChldmVudC5ub2RlKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5vbkl0ZW1DbGlja2VkKGV2ZW50KTtcclxuXHJcbiAgICAgIGNhc2UgJ3JlbmFtZUNvbmZpcm0nIDpcclxuICAgICAgICByZXR1cm4gdGhpcy5uZ3hTbWFydE1vZGFsU2VydmljZS5nZXRNb2RhbCgncmVuYW1lTW9kYWwnKS5vcGVuKCk7XHJcbiAgICAgIGNhc2UgJ3JlbmFtZScgOlxyXG4gICAgICAgIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ3JlbmFtZU1vZGFsJykuY2xvc2UoKTtcclxuXHJcbiAgICAgICAgdGhpcy5ub2RlQ2xpY2tlZFNlcnZpY2UucmVuYW1lKHRoaXMuc2VsZWN0ZWROb2RlLmlkLCBldmVudC52YWx1ZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub25JdGVtQ2xpY2tlZCh7XHJcbiAgICAgICAgICB0eXBlOiBldmVudC50eXBlLFxyXG4gICAgICAgICAgbm9kZTogdGhpcy5zZWxlY3RlZE5vZGUsXHJcbiAgICAgICAgICBuZXdOYW1lOiBldmVudC52YWx1ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgY2FzZSAncmVtb3ZlQXNrJzpcclxuICAgICAgICByZXR1cm4gdGhpcy5uZ3hTbWFydE1vZGFsU2VydmljZS5nZXRNb2RhbCgnY29uZmlybURlbGV0ZU1vZGFsJykub3BlbigpO1xyXG4gICAgICBjYXNlICdyZW1vdmUnOlxyXG4gICAgICAgIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ2NvbmZpcm1EZWxldGVNb2RhbCcpLmNsb3NlKCk7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZUNsaWNrZWRTZXJ2aWNlLmluaXREZWxldGUodGhpcy5zZWxlY3RlZE5vZGUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9uSXRlbUNsaWNrZWQoe1xyXG4gICAgICAgICAgdHlwZTogZXZlbnQudHlwZSxcclxuICAgICAgICAgIG5vZGU6IHRoaXMuc2VsZWN0ZWROb2RlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICBjYXNlICdjcmVhdGVGb2xkZXInIDpcclxuICAgICAgICBjb25zdCBwYXJlbnRJZCA9IHRoaXMubm9kZVNlcnZpY2UuZmluZE5vZGVCeVBhdGgodGhpcy5ub2RlU2VydmljZS5jdXJyZW50UGF0aCkuaWQ7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZUNsaWNrZWRTZXJ2aWNlLmNyZWF0ZUZvbGRlcihwYXJlbnRJZCwgZXZlbnQucGF5bG9hZCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub25JdGVtQ2xpY2tlZCh7XHJcbiAgICAgICAgICB0eXBlOiBldmVudC50eXBlLFxyXG4gICAgICAgICAgcGFyZW50SWQ6IHBhcmVudElkLFxyXG4gICAgICAgICAgbmV3RGlyTmFtZTogZXZlbnQucGF5bG9hZFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbm9kZUNsaWNrSGFuZGxlcihub2RlOiBOb2RlSW50ZXJmYWNlLCBjbG9zaW5nPzogYm9vbGVhbikge1xyXG4gICAgaWYgKG5vZGUubmFtZSA9PT0gJ3Jvb3QnKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY2xvc2luZykge1xyXG4gICAgICBjb25zdCBwYXJlbnROb2RlID0gdGhpcy5ub2RlU2VydmljZS5maW5kTm9kZUJ5UGF0aCh0aGlzLm5vZGVTZXJ2aWNlLmN1cnJlbnRQYXRoKTtcclxuICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogQUNUSU9OUy5TRVRfU0VMRUNURURfTk9ERSwgcGF5bG9hZDogcGFyZW50Tm9kZX0pO1xyXG4gICAgICB0aGlzLnNpZGVNZW51Q2xvc2VkID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZE5vZGUgPT09IG5vZGUgJiYgdGhpcy5zaWRlTWVudUNsb3NlZClcclxuICAgICAgICB0aGlzLnNpZGVNZW51Q2xvc2VkID0gZmFsc2U7XHJcbiAgICAgIGVsc2UgaWYgKHRoaXMuc2VsZWN0ZWROb2RlID09PSBub2RlICYmICF0aGlzLnNpZGVNZW51Q2xvc2VkKVxyXG4gICAgICAgIHRoaXMuc2lkZU1lbnVDbG9zZWQgPSB0cnVlO1xyXG4gICAgICBlbHNlIGlmICh0aGlzLnNlbGVjdGVkTm9kZSAhPT0gbm9kZSAmJiB0aGlzLnNpZGVNZW51Q2xvc2VkKVxyXG4gICAgICAgIHRoaXMuc2lkZU1lbnVDbG9zZWQgPSBmYWxzZTtcclxuICAgICAgZWxzZSBpZiAodGhpcy5zZWxlY3RlZE5vZGUgIT09IG5vZGUgJiYgIXRoaXMuc2lkZU1lbnVDbG9zZWQpXHJcbiAgICAgICAgdGhpcy5zaWRlTWVudUNsb3NlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2VsZWN0ZWROb2RlID0gbm9kZTtcclxuXHJcbiAgICAvLyB0b2RvIGludmVzdGlnYXRlIHRoaXMgd29ya2Fyb3VuZCAtIHdhcm5pbmc6IFtGaWxlIE1hbmFnZXJdIGZhaWxlZCB0byBmaW5kIHJlcXVlc3RlZCBub2RlIGZvciBwYXRoOiBbcGF0aF1cclxuICAgIGlmKCFkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2lkZS12aWV3JykpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnNpZGVNZW51Q2xvc2VkKSB7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaWRlLXZpZXcnKS5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpZGUtdmlldycpLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyB0b2RvIHN0YXkgRFJZIVxyXG4gIGhpZ2hsaWdodFNlbGVjdGVkKG5vZGU6IE5vZGVJbnRlcmZhY2UpIHtcclxuICAgIGxldCBwYXRoVG9Ob2RlID0gbm9kZS5wYXRoVG9Ob2RlO1xyXG5cclxuICAgIGlmIChwYXRoVG9Ob2RlLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICBwYXRoVG9Ob2RlID0gJ3Jvb3QnO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHRyZWVFbGVtZW50ID0gdGhpcy5nZXRFbGVtZW50QnlJZChwYXRoVG9Ob2RlLCAndHJlZV8nKTtcclxuICAgIGNvbnN0IGZjRWxlbWVudCA9IHRoaXMuZ2V0RWxlbWVudEJ5SWQocGF0aFRvTm9kZSwgJ2ZjXycpO1xyXG4gICAgaWYgKCF0cmVlRWxlbWVudCAmJiAhZmNFbGVtZW50KSB7XHJcbiAgICAgIGNvbnNvbGUud2FybignW0ZpbGUgTWFuYWdlcl0gZmFpbGVkIHRvIGZpbmQgcmVxdWVzdGVkIG5vZGUgZm9yIHBhdGg6JywgcGF0aFRvTm9kZSk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJlbW92ZUNsYXNzKCdoaWdobGlnaHRlZCcpO1xyXG4gICAgdGhpcy5yZW1vdmVDbGFzcygnbGlnaHQnKTtcclxuXHJcbiAgICBpZiAoZmNFbGVtZW50KVxyXG4gICAgICB0aGlzLmhpZ2hpbGdodENoaWxkRWxlbWVudChmY0VsZW1lbnQpO1xyXG4gICAgaWYgKHRyZWVFbGVtZW50KVxyXG4gICAgICB0aGlzLmhpZ2hpbGdodENoaWxkRWxlbWVudCh0cmVlRWxlbWVudCwgdHJ1ZSk7XHJcblxyXG4gICAgLy8gcGFyZW50IG5vZGUgaGlnaGxpZ2h0XHJcbiAgICBsZXQgcGF0aFRvUGFyZW50ID0gbm9kZS5wYXRoVG9QYXJlbnQ7XHJcbiAgICBpZiAocGF0aFRvUGFyZW50ID09PSBudWxsIHx8IG5vZGUucGF0aFRvTm9kZSA9PT0gdGhpcy5ub2RlU2VydmljZS5jdXJyZW50UGF0aCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHBhdGhUb1BhcmVudC5sZW5ndGggPT09IDApIHtcclxuICAgICAgcGF0aFRvUGFyZW50ID0gJ3Jvb3QnO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHBhcmVudEVsZW1lbnQgPSB0aGlzLmdldEVsZW1lbnRCeUlkKHBhdGhUb1BhcmVudCwgJ3RyZWVfJyk7XHJcbiAgICBpZiAoIXBhcmVudEVsZW1lbnQpIHtcclxuICAgICAgY29uc29sZS53YXJuKCdbRmlsZSBNYW5hZ2VyXSBmYWlsZWQgdG8gZmluZCByZXF1ZXN0ZWQgcGFyZW50IG5vZGUgZm9yIHBhdGg6JywgcGF0aFRvUGFyZW50KTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaGlnaGlsZ2h0Q2hpbGRFbGVtZW50KHBhcmVudEVsZW1lbnQpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBoaWdoaWxnaHRDaGlsZEVsZW1lbnQoZWw6IEhUTUxFbGVtZW50LCBsaWdodDogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICBlbC5jaGlsZHJlblswXSAvLyBhcHBub2RlIGRpdiB3cmFwcGVyXHJcbiAgICAgIC5jaGlsZHJlblswXSAvLyBuZyB0ZW1wbGF0ZSBmaXJzdCBpdGVtXHJcbiAgICAgIC5jbGFzc0xpc3QuYWRkKCdoaWdobGlnaHRlZCcpO1xyXG5cclxuICAgIGlmIChsaWdodClcclxuICAgICAgZWwuY2hpbGRyZW5bMF1cclxuICAgICAgICAuY2hpbGRyZW5bMF1cclxuICAgICAgICAuY2xhc3NMaXN0LmFkZCgnbGlnaHQnKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0RWxlbWVudEJ5SWQoaWQ6IHN0cmluZywgcHJlZml4OiBzdHJpbmcgPSAnJyk6IEhUTUxFbGVtZW50IHtcclxuICAgIGNvbnN0IGZ1bGxJZCA9IHByZWZpeCArIGlkO1xyXG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGZ1bGxJZCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlbW92ZUNsYXNzKGNsYXNzTmFtZTogc3RyaW5nKSB7XHJcbiAgICBBcnJheS5mcm9tKGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2xhc3NOYW1lKSlcclxuICAgICAgLm1hcCgoZWw6IEhUTUxFbGVtZW50KSA9PiBlbC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSkpO1xyXG4gIH1cclxuXHJcbiAgZm1TaG93SGlkZSgpIHtcclxuICAgIHRoaXMuZm1PcGVuID0gIXRoaXMuZm1PcGVuO1xyXG4gIH1cclxuXHJcbiAgYmFja2Ryb3BDbGlja2VkKCkge1xyXG4gICAgLy8gdG9kbyBnZXQgcmlkIG9mIHRoaXMgdWdseSB3b3JrYXJvdW5kXHJcbiAgICAvLyB0b2RvIGZpcmUgdXNlckNhbmNlbGVkTG9hZGluZyBldmVudFxyXG4gICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogU0VUX0xPQURJTkdfU1RBVEUsIHBheWxvYWQ6IGZhbHNlfSk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVVcGxvYWREaWFsb2coZXZlbnQ6IGFueSkge1xyXG4gICAgdGhpcy5uZXdEaWFsb2cgPSBldmVudDtcclxuICB9XHJcbn1cclxuIl19