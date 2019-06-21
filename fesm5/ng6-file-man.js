import { Injectable, Pipe, Component, ViewEncapsulation, EventEmitter, Input, Output, TemplateRef, ContentChild, ViewChild, NgModule, InjectionToken, defineInjectable, inject } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { HttpClient, HttpParams, HttpClientModule } from '@angular/common/http';
import { Store, select, StoreModule } from '@ngrx/store';
import { NgxSmartModalService, NgxSmartModalModule } from 'ngx-smart-modal';
import { TranslateService, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { __assign } from 'tslib';
import { _ } from '@biesbjerg/ngx-translate-extract/dist/utils/utils';
import { FineUploader } from 'fine-uploader';
import { CommonModule } from '@angular/common';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var TreeModel = /** @class */ (function () {
    function TreeModel(config) {
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
    Object.defineProperty(TreeModel.prototype, "currentPath", {
        get: /**
         * @return {?}
         */
        function () {
            return this._currentPath;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._currentPath = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeModel.prototype, "nodes", {
        get: /**
         * @return {?}
         */
        function () {
            return this._nodes;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._nodes = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TreeModel.prototype, "selectedNodeId", {
        get: /**
         * @return {?}
         */
        function () {
            return this._selectedNodeId;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._selectedNodeId = value;
        },
        enumerable: true,
        configurable: true
    });
    return TreeModel;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var SET_PATH = 'SET_PATH';
/** @type {?} */
var SET_LOADING_STATE = 'SET_LOADING_STATE';
/** @type {?} */
var SET_SELECTED_NODE = 'SET_SELECTED_NODE';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var NodeService = /** @class */ (function () {
    function NodeService(http, store) {
        var _this = this;
        this.http = http;
        this.store = store;
        this.getNodesFromServer = (/**
         * @param {?} path
         * @return {?}
         */
        function (path) {
            /** @type {?} */
            var folderId = _this.findNodeByPath(path).id;
            folderId = folderId === 0 ? '' : folderId;
            return _this.http.get(_this.tree.config.baseURL + _this.tree.config.api.listFile, { params: new HttpParams().set('parentPath', folderId) });
        });
    }
    // todo ask server to get parent structure
    // todo ask server to get parent structure
    /**
     * @param {?} path
     * @return {?}
     */
    NodeService.prototype.startManagerAt = 
    // todo ask server to get parent structure
    /**
     * @param {?} path
     * @return {?}
     */
    function (path) {
        this.store.dispatch({ type: SET_PATH, payload: path });
    };
    /**
     * @return {?}
     */
    NodeService.prototype.refreshCurrentPath = /**
     * @return {?}
     */
    function () {
        this.findNodeByPath(this.currentPath).children = {};
        this.getNodes(this.currentPath);
    };
    /**
     * @param {?} path
     * @return {?}
     */
    NodeService.prototype.getNodes = /**
     * @param {?} path
     * @return {?}
     */
    function (path) {
        var _this = this;
        this.parseNodes(path).subscribe((/**
         * @param {?} data
         * @return {?}
         */
        function (data) {
            for (var i = 0; i < data.length; i++) {
                /** @type {?} */
                var parentPath = _this.getParentPath(data[i].pathToNode);
                _this.findNodeByPath(parentPath).children[data[i].name] = data[i];
            }
        }));
    };
    /**
     * @private
     * @param {?} path
     * @return {?}
     */
    NodeService.prototype.getParentPath = /**
     * @private
     * @param {?} path
     * @return {?}
     */
    function (path) {
        /** @type {?} */
        var parentPath = path.split('/');
        parentPath = parentPath.slice(0, parentPath.length - 1);
        return parentPath.join('/');
    };
    /**
     * @private
     * @param {?} path
     * @return {?}
     */
    NodeService.prototype.parseNodes = /**
     * @private
     * @param {?} path
     * @return {?}
     */
    function (path) {
        var _this = this;
        return new Observable((/**
         * @param {?} observer
         * @return {?}
         */
        function (observer) {
            _this.getNodesFromServer(path).subscribe((/**
             * @param {?} data
             * @return {?}
             */
            function (data) {
                observer.next(data.map((/**
                 * @param {?} node
                 * @return {?}
                 */
                function (node) { return _this.createNode(path, node); })));
                _this.store.dispatch({ type: SET_LOADING_STATE, payload: false });
            }));
        }));
    };
    /**
     * @private
     * @param {?} path
     * @param {?} node
     * @return {?}
     */
    NodeService.prototype.createNode = /**
     * @private
     * @param {?} path
     * @param {?} node
     * @return {?}
     */
    function (path, node) {
        if (node.path[0] !== '/') {
            console.warn('[Node Service] Server should return initial path with "/"');
            node.path = '/' + node.path;
        }
        /** @type {?} */
        var ids = node.path.split('/');
        if (ids.length > 2 && ids[ids.length - 1] === '') {
            ids.splice(-1, 1);
            node.path = ids.join('/');
        }
        /** @type {?} */
        var cachedNode = this.findNodeByPath(node.path);
        return (/** @type {?} */ ({
            id: node.id,
            isFolder: node.dir,
            isExpanded: cachedNode ? cachedNode.isExpanded : false,
            pathToNode: node.path,
            pathToParent: this.getParentPath(node.path),
            name: node.name || node.id,
            children: cachedNode ? cachedNode.children : {}
        }));
    };
    /**
     * @param {?} nodePath
     * @return {?}
     */
    NodeService.prototype.findNodeByPath = /**
     * @param {?} nodePath
     * @return {?}
     */
    function (nodePath) {
        /** @type {?} */
        var ids = nodePath.split('/');
        ids.splice(0, 1);
        return ids.length === 0 ? this.tree.nodes : ids.reduce((/**
         * @param {?} value
         * @param {?} index
         * @return {?}
         */
        function (value, index) { return value['children'][index]; }), this.tree.nodes);
    };
    /**
     * @param {?} id
     * @return {?}
     */
    NodeService.prototype.findNodeById = /**
     * @param {?} id
     * @return {?}
     */
    function (id) {
        /** @type {?} */
        var result = this.findNodeByIdHelper(id);
        if (result === null) {
            console.warn('[Node Service] Cannot find node by id. Id not existing or not fetched. Returning root.');
            return this.tree.nodes;
        }
        return result;
    };
    /**
     * @param {?} id
     * @param {?=} node
     * @return {?}
     */
    NodeService.prototype.findNodeByIdHelper = /**
     * @param {?} id
     * @param {?=} node
     * @return {?}
     */
    function (id, node) {
        if (node === void 0) { node = this.tree.nodes; }
        if (node.id === id)
            return node;
        /** @type {?} */
        var keys = Object.keys(node.children);
        for (var i = 0; i < keys.length; i++) {
            if (typeof node.children[keys[i]] == 'object') {
                /** @type {?} */
                var obj = this.findNodeByIdHelper(id, node.children[keys[i]]);
                if (obj != null)
                    return obj;
            }
        }
        return null;
    };
    /**
     * @param {?} node
     * @return {?}
     */
    NodeService.prototype.foldRecursively = /**
     * @param {?} node
     * @return {?}
     */
    function (node) {
        var _this = this;
        // console.log('folding ', node);
        /** @type {?} */
        var children = node.children;
        Object.keys(children).map((/**
         * @param {?} child
         * @return {?}
         */
        function (child) {
            if (!children.hasOwnProperty(child) || !children[child].isExpanded) {
                return null;
            }
            _this.foldRecursively(children[child]);
            //todo put this getElById into one func (curr inside node.component.ts + fm.component.ts) - this won't be maintainable
            document.getElementById('tree_' + children[child].pathToNode).classList.add('deselected');
            children[child].isExpanded = false;
        }));
    };
    /**
     * @return {?}
     */
    NodeService.prototype.foldAll = /**
     * @return {?}
     */
    function () {
        this.foldRecursively(this.tree.nodes);
    };
    Object.defineProperty(NodeService.prototype, "currentPath", {
        get: /**
         * @return {?}
         */
        function () {
            return this._path;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._path = value;
        },
        enumerable: true,
        configurable: true
    });
    NodeService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] },
    ];
    NodeService.ctorParameters = function () { return [
        { type: HttpClient },
        { type: Store }
    ]; };
    /** @nocollapse */ NodeService.ngInjectableDef = defineInjectable({ factory: function NodeService_Factory() { return new NodeService(inject(HttpClient), inject(Store)); }, token: NodeService, providedIn: "root" });
    return NodeService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var NodeClickedService = /** @class */ (function () {
    function NodeClickedService(ngxSmartModalService, nodeService, store, http) {
        this.ngxSmartModalService = ngxSmartModalService;
        this.nodeService = nodeService;
        this.store = store;
        this.http = http;
    }
    /**
     * @param {?} node
     * @return {?}
     */
    NodeClickedService.prototype.startDownload = /**
     * @param {?} node
     * @return {?}
     */
    function (node) {
        /** @type {?} */
        var parameters = this.parseParams({ path: node.id });
        this.reachServer('download', this.tree.config.api.downloadFile + parameters);
    };
    /**
     * @param {?} node
     * @return {?}
     */
    NodeClickedService.prototype.initDelete = /**
     * @param {?} node
     * @return {?}
     */
    function (node) {
        var _this = this;
        this.sideEffectHelper('Delete', { path: node.id }, 'delete', this.tree.config.api.deleteFile, (/**
         * @return {?}
         */
        function () { return _this.successWithModalClose(); }));
    };
    /**
     * @param {?} input
     * @return {?}
     */
    NodeClickedService.prototype.searchForString = /**
     * @param {?} input
     * @return {?}
     */
    function (input) {
        var _this = this;
        this.sideEffectHelper('Search', { query: input }, 'get', this.tree.config.api.searchFiles, (/**
         * @param {?} res
         * @return {?}
         */
        function (res) { return _this.searchSuccess(input, res); }));
    };
    /**
     * @param {?} currentParent
     * @param {?} newDirName
     * @return {?}
     */
    NodeClickedService.prototype.createFolder = /**
     * @param {?} currentParent
     * @param {?} newDirName
     * @return {?}
     */
    function (currentParent, newDirName) {
        this.sideEffectHelper('Create Folder', { dirName: newDirName, parentPath: currentParent === 0 ? null : currentParent }, 'post', this.tree.config.api.createFolder);
    };
    /**
     * @param {?} id
     * @param {?} newName
     * @return {?}
     */
    NodeClickedService.prototype.rename = /**
     * @param {?} id
     * @param {?} newName
     * @return {?}
     */
    function (id, newName) {
        var _this = this;
        this.sideEffectHelper('Rename', { path: id, newName: newName }, 'post', this.tree.config.api.renameFile, (/**
         * @return {?}
         */
        function () { return _this.successWithModalClose(); }));
    };
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
    NodeClickedService.prototype.sideEffectHelper = /**
     * @private
     * @param {?} name
     * @param {?} parameters
     * @param {?} httpMethod
     * @param {?} apiURL
     * @param {?=} successMethod
     * @param {?=} failMethod
     * @return {?}
     */
    function (name, parameters, httpMethod, apiURL, successMethod, failMethod) {
        var _this = this;
        if (successMethod === void 0) { successMethod = (/**
         * @param {?} a
         * @return {?}
         */
        function (a) { return _this.actionSuccess(a); }); }
        if (failMethod === void 0) { failMethod = (/**
         * @param {?} a
         * @param {?} b
         * @return {?}
         */
        function (a, b) { return _this.actionFailed(a, b); }); }
        /** @type {?} */
        var params = this.parseParams(parameters);
        this.ngxSmartModalService.getModal('waitModal').open();
        this.reachServer(httpMethod, apiURL + params)
            .subscribe((/**
         * @param {?} a
         * @return {?}
         */
        function (a) { return successMethod(a); }), (/**
         * @param {?} err
         * @return {?}
         */
        function (err) { return failMethod(name, err); }));
    };
    /**
     * @private
     * @param {?} method
     * @param {?} apiUrl
     * @param {?=} data
     * @return {?}
     */
    NodeClickedService.prototype.reachServer = /**
     * @private
     * @param {?} method
     * @param {?} apiUrl
     * @param {?=} data
     * @return {?}
     */
    function (method, apiUrl, data) {
        if (data === void 0) { data = {}; }
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
    };
    /**
     * @private
     * @param {?} params
     * @return {?}
     */
    NodeClickedService.prototype.parseParams = /**
     * @private
     * @param {?} params
     * @return {?}
     */
    function (params) {
        /** @type {?} */
        var query = '?';
        Object.keys(params).filter((/**
         * @param {?} item
         * @return {?}
         */
        function (item) { return params[item] !== null; })).map((/**
         * @param {?} key
         * @return {?}
         */
        function (key) {
            query += key + '=' + params[key] + '&';
        }));
        return query.slice(0, -1);
    };
    /**
     * @private
     * @return {?}
     */
    NodeClickedService.prototype.successWithModalClose = /**
     * @private
     * @return {?}
     */
    function () {
        this.actionSuccess();
        document.getElementById('side-view').classList.remove('selected');
    };
    /**
     * @private
     * @param {?} input
     * @param {?} data
     * @return {?}
     */
    NodeClickedService.prototype.searchSuccess = /**
     * @private
     * @param {?} input
     * @param {?} data
     * @return {?}
     */
    function (input, data) {
        /** @type {?} */
        var obj = {
            searchString: input,
            response: data
        };
        this.actionSuccess();
        this.ngxSmartModalService.setModalData(obj, 'searchModal', true);
        this.ngxSmartModalService.getModal('searchModal').open();
    };
    /**
     * @private
     * @param {?=} response
     * @return {?}
     */
    NodeClickedService.prototype.actionSuccess = /**
     * @private
     * @param {?=} response
     * @return {?}
     */
    function (response) {
        if (response === void 0) { response = ''; }
        document.body.classList.remove('dialog-open');
        this.nodeService.refreshCurrentPath();
        this.ngxSmartModalService.getModal('waitModal').close();
    };
    /**
     * @private
     * @param {?} name
     * @param {?} error
     * @return {?}
     */
    NodeClickedService.prototype.actionFailed = /**
     * @private
     * @param {?} name
     * @param {?} error
     * @return {?}
     */
    function (name, error) {
        document.body.classList.remove('dialog-open');
        this.ngxSmartModalService.getModal('waitModal').close();
        this.ngxSmartModalService.getModal('errorModal').open();
        console.warn('[NodeClickedService] Action "' + name + '" failed', error);
    };
    NodeClickedService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] },
    ];
    NodeClickedService.ctorParameters = function () { return [
        { type: NgxSmartModalService },
        { type: NodeService },
        { type: Store },
        { type: HttpClient }
    ]; };
    /** @nocollapse */ NodeClickedService.ngInjectableDef = defineInjectable({ factory: function NodeClickedService_Factory() { return new NodeClickedService(inject(NgxSmartModalService), inject(NodeService), inject(Store), inject(HttpClient)); }, token: NodeClickedService, providedIn: "root" });
    return NodeClickedService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var FileManagerComponent = /** @class */ (function () {
    function FileManagerComponent(store, nodeService, nodeClickedService, ngxSmartModalService, translate) {
        this.store = store;
        this.nodeService = nodeService;
        this.nodeClickedService = nodeClickedService;
        this.ngxSmartModalService = ngxSmartModalService;
        this.translate = translate;
        this.isPopup = false;
        this.itemClicked = new EventEmitter();
        this._language = 'en';
        this.sideMenuClosed = true;
        this.fmOpen = false;
        this.newDialog = false;
        translate.setDefaultLang('en');
        translate.use('en');
    }
    Object.defineProperty(FileManagerComponent.prototype, "language", {
        get: /**
         * @return {?}
         */
        function () {
            return this._language;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._language = value;
            this.translate.use(this.language);
        },
        enumerable: true,
        configurable: true
    });
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
        function (state) { return state.fileManagerState.isLoading; })))
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
        function (state) { return state.fileManagerState.selectedNode; })))
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
        this.store.dispatch({ type: SET_SELECTED_NODE, payload: node });
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
                    template: "<ng-container *ngIf=\"isPopup; then itIsPopup else showContent\"></ng-container>\n\n<ng-template #itIsPopup>\n  <div *ngIf=\"!fmOpen\">\n    <button class=\"button big\" (click)=\"fmShowHide()\" translate=\"\">Open file manager</button>\n  </div>\n  <div class=\"file-manager-backdrop\" *ngIf=\"fmOpen\">\n    <div class=\"fmModalInside\">\n      <div *ngIf=\"fmOpen; then showContent\"></div>\n    </div>\n  </div>\n</ng-template>\n\n<ng-template #showContent>\n  <div class=\"content\">\n    <div class=\"file-manager-navbar\">\n      <div class=\"path\">\n        <app-nav-bar></app-nav-bar>\n      </div>\n\n      <div class=\"navigation\">\n        <app-navigation>\n          <div class=\"button close\" (click)=\"fmShowHide()\" *ngIf=\"isPopup\">\n            <i class=\"fas fa-2x fa-times\"></i>\n          </div>\n        </app-navigation>\n      </div>\n    </div>\n\n    <div class=\"holder\">\n      <div class=\"file-manager-left\">\n        <app-tree [treeModel]=\"tree\">\n          <ng-template let-nodes>\n            <ng-container [ngTemplateOutletContext]=\"{$implicit: nodes}\"\n                          [ngTemplateOutlet]=\"iconTemplate ? iconTemplate : defaultIconTemplate\">\n            </ng-container>\n          </ng-template>\n        </app-tree>\n      </div>\n\n      <div class=\"right\">\n        <app-folder-content\n          [treeModel]=\"tree\"\n          (openUploadDialog)=\"handleUploadDialog($event)\"\n          [folderContentTemplate]=\"folderContentTemplate ? folderContentTemplate : defaultFolderContentTemplate\"\n          [folderContentNewTemplate]=\"folderContentNewTemplate ? folderContentNewTemplate : defaultFolderContentNewTemplate\"\n          [folderContentBackTemplate]=\"folderContentBackTemplate ? folderContentBackTemplate : defaultFolderContentBackTemplate\">\n        </app-folder-content>\n      </div>\n\n      <app-side-view id=\"side-view\"\n                     [node]=\"selectedNode\"\n                     [sideViewTemplate]=\"sideViewTemplate ? sideViewTemplate : defaultSideViewTemplate\"\n                     [allowFolderDownload]=\"tree.config.options.allowFolderDownload\"\n                     (clickEvent)=\"handleFileManagerClickEvent($event)\">\n      </app-side-view>\n    </div>\n  </div>\n\n  <app-upload *ngIf=\"newDialog\"\n              [openDialog]=\"newDialog\"\n              (closeDialog)=\"handleUploadDialog(false)\"\n              (createDir)=\"handleFileManagerClickEvent({type: 'createFolder', payload: $event})\">\n  </app-upload>\n\n  <app-loading-overlay\n    *ngIf=\"loading\"\n    [loadingOverlayTemplate]=\"loadingOverlayTemplate ? loadingOverlayTemplate : defaultLoadingOverlayTemplate\">\n  </app-loading-overlay>\n</ng-template>\n\n<ng-template let-node #defaultIconTemplate>\n  <div class=\"file-manager-node\" style=\"display: inline-block; padding: 3px\">\n    <div *ngIf=\"node.isFolder; then itIsFolder else showFile\"></div>\n\n    <ng-template #itIsFolder>\n      <div *ngIf=\"node.isExpanded; then isFolderExpanded else isFolderClosed\"></div>\n    </ng-template>\n\n    <ng-template #showFile><i class=\"fas fa-file child\"></i></ng-template>\n    <ng-template #isFolderExpanded><i class=\"fas fa-folder-open child\"></i></ng-template>\n    <ng-template #isFolderClosed><i class=\"fas fa-folder child\"></i></ng-template>\n\n    <span>{{node.name}}</span>\n  </div>\n</ng-template>\n<ng-template let-node #defaultFolderContentTemplate>\n  <div class=\"file-manager-item\">\n    <div class=\"file-preview\">\n      <div *ngIf=\"node.isFolder; then itIsFolder else showFile\"></div>\n      <ng-template #itIsFolder><i class=\"fas fa-3x fa-folder child\"></i></ng-template>\n      <ng-template #showFile><i class=\"fas fa-3x fa-file child\"></i></ng-template>\n    </div>\n    <div class=\"file-name\">\n      {{node.name}}\n    </div>\n  </div>\n</ng-template>\n<ng-template #defaultFolderContentNewTemplate>\n  <div class=\"file-manager-item\">\n    <div class=\"file-preview\" style=\"width: 100%; height:100%\">\n      <i class=\"fas fa-3x fa-plus child\" style=\"line-height: 2\"></i>\n    </div>\n  </div>\n</ng-template>\n<ng-template let-node #defaultFolderContentBackTemplate>\n  <div class=\"file-manager-item\">\n    <div class=\"file-preview\" style=\"width: 100%; height:100%\">\n      <i class=\"fas fa-2x fa-ellipsis-h\" style=\"line-height: 5\"></i>\n    </div>\n  </div>\n</ng-template>\n<ng-template let-timeoutMessage #defaultLoadingOverlayTemplate>\n  <div class=\"file-manager-backdrop loading\" (click)=\"backdropClicked()\">\n    <div class=\"file-manager-error\" *ngIf=\"timeoutMessage\">{{timeoutMessage | translate}}</div>\n  </div>\n  <div class=\"spinner\">\n    <i class=\"fas fa-5x fa-spin fa-sync-alt\"></i>\n  </div>\n</ng-template>\n<ng-template let-node #defaultSideViewTemplate>\n  <div style=\"position: absolute; bottom: 0; width: 100%; margin: 5px auto\">\n    <span *ngIf=\"node.isFolder\" translate>No data available for this folder</span>\n    <span *ngIf=\"!node.isFolder\" translate>No data available for this file</span>\n  </div>\n</ng-template>\n\n<ngx-smart-modal identifier=\"renameModal\" [dismissable]=\"false\" [closable]=\"false\" *ngIf=\"selectedNode\" #renameModal>\n  <h2 class=\"modal-title\" translate>\n    Rename file\n  </h2>\n  <p class=\"rename-name\" translate>\n    Old name\n  </p>\n  <span style=\"margin: 8px\">{{selectedNode.name}}</span>\n  <p class=\"rename-name\" translate>\n    New name\n  </p>\n  <input placeholder=\"New name\" type=\"text\" class=\"rename-input\" [value]=\"selectedNode.name\" #renameInput\n         (keyup.enter)=\"handleFileManagerClickEvent({type: 'rename', value: renameInput.value})\"\n         onclick=\"this.select();\">\n  <br>\n\n  <div class=\"rename-button\">\n    <button class=\"button big\" translate\n            (click)=\"handleFileManagerClickEvent({type: 'rename', value: renameInput.value})\"\n            [disabled]=\"renameInput.value === selectedNode.name || renameInput.value.length === 0\">\n      Rename\n    </button>\n    <button class=\"button big\" (click)=\"renameModal.close()\" translate>\n      Cancel\n    </button>\n  </div>\n\n</ngx-smart-modal>\n<ngx-smart-modal *ngIf=\"selectedNode\" identifier=\"confirmDeleteModal\" #deleteModal\n                 [dismissable]=\"false\" [closable]=\"false\">\n  <h2 class=\"modal-title\">\n    <span translate>You are trying to delete following </span>\n    <span *ngIf=\"selectedNode.isFolder\" translate>folder</span>\n    <span *ngIf=\"!selectedNode.isFolder\" translate>file</span>\n  </h2>\n\n  <div style=\"width: 100%; margin: 5px auto; text-align: center\">{{selectedNode.name}}</div>\n\n  <div class=\"rename-button\">\n    <button class=\"button big\" (click)=\"handleFileManagerClickEvent({type: 'remove'})\">\n      <span translate>Yes, delete this </span>\n      <span *ngIf=\"selectedNode.isFolder\" translate>folder</span>\n      <span *ngIf=\"!selectedNode.isFolder\" translate>file</span>\n    </button>\n    <button class=\"button big\" (click)=\"deleteModal.close()\" translate>\n      Cancel\n    </button>\n  </div>\n</ngx-smart-modal>\n<ngx-smart-modal identifier=\"searchModal\" #searchModal [closable]=\"true\">\n  <h2 class=\"modal-title\" style=\"margin-bottom: 2px\" translate\n      *ngIf=\"searchModal.hasData() && searchModal.getData().response.length !== 0\">\n    Search results for\n  </h2>\n  <h2 class=\"modal-title\" style=\"margin-bottom: 2px\" translate\n      *ngIf=\"!searchModal.hasData() || searchModal.getData().response.length === 0\">\n    No results found for\n  </h2>\n  <div style=\"text-align: center\" *ngIf=\"searchModal.hasData()\">{{searchModal.getData().searchString}}</div>\n\n  <div *ngIf=\"searchModal.hasData() && searchModal.getData().response.length !== 0\">\n    <table style=\"margin: 0 auto\">\n      <tr>\n        <td class=\"table-item table-head\" translate>File name</td>\n        <td class=\"table-item-short table-head\" translate>Size</td>\n      </tr>\n      <tr *ngFor=\"let item of searchModal.getData().response\" (click)=\"searchClicked(item)\">\n        <td style=\"cursor: pointer\">\n          <ng-container *ngIf=\"item.fileCategory === 'D'; else file\">\n            <i class=\"fas fa-folder search-output-icon\"></i>\n          </ng-container>\n          <ng-template #file>\n            <i class=\"fas fa-file search-output-icon\"></i>\n          </ng-template>\n          <span style=\"text-overflow: ellipsis\">{{item.name}}</span>\n        </td>\n        <td class=\"table-item-short\">{{item.size}}</td>\n      </tr>\n    </table>\n  </div>\n</ngx-smart-modal>\n<ngx-smart-modal identifier=\"waitModal\" [closable]=\"false\" [dismissable]=\"false\" [escapable]=\"false\">\n  <h2 class=\"modal-title\" style=\"margin-top: 20px\">\n    {{'Processing request' | translate}}...\n  </h2>\n\n  <div style=\"text-align: center; height: 70px\">\n    <i class=\"fas fa-spinner fa-spin fa-4x\"></i>\n  </div>\n</ngx-smart-modal>\n<ngx-smart-modal identifier=\"errorModal\" [closable]=\"true\">\n  <h2 class=\"modal-title\" style=\"margin-top: 20px\">\n    {{'Something went wrong with your request' | translate}}...\n  </h2>\n</ngx-smart-modal>\n",
                    styles: [".content{height:100%;min-width:850px}.holder{display:-webkit-flex;display:flex;height:calc(100% - 75px)}.path{margin:auto 0;display:block}.navigation{margin:auto 0;display:-webkit-flex;display:flex}.navigation .button{margin:0 10px;padding:0;position:relative}.right{width:100%;position:relative;overflow:auto}.file-name{width:100px;height:25px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;box-sizing:border-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.file-preview{margin:auto}.file-preview i{line-height:1.5}.spinner{position:absolute;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);cursor:progress}.rename-button{margin:20px auto;display:block;text-align:center}.modal-title{margin-top:5px;text-align:center}.search-output{margin:15px 0}.search-output-icon{margin:2px 5px}.table-item{width:80%}.table-item-short{width:20%;text-align:right}"],
                    encapsulation: ViewEncapsulation.None
                },] },
    ];
    FileManagerComponent.ctorParameters = function () { return [
        { type: Store },
        { type: NodeService },
        { type: NodeClickedService },
        { type: NgxSmartModalService },
        { type: TranslateService }
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
        itemClicked: [{ type: Output }],
        language: [{ type: Input }]
    };
    return FileManagerComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var FolderContentComponent = /** @class */ (function () {
    function FolderContentComponent(nodeService, store) {
        this.nodeService = nodeService;
        this.store = store;
        this.openUploadDialog = new EventEmitter();
        this.obj = Object;
    }
    /**
     * @return {?}
     */
    FolderContentComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.store
            .pipe(select((/**
         * @param {?} state
         * @return {?}
         */
        function (state) { return state.fileManagerState.path; })))
            .subscribe((/**
         * @param {?} path
         * @return {?}
         */
        function (path) {
            _this.nodes = _this.nodeService.findNodeByPath(path);
        }));
    };
    /**
     * @return {?}
     */
    FolderContentComponent.prototype.newClickedAction = /**
     * @return {?}
     */
    function () {
        this.openUploadDialog.emit(true);
    };
    FolderContentComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-folder-content',
                    template: "<div class=\"item-holder\">\n  <ng-container *ngIf=\"nodes.id !== 0\">\n    <app-node [node]=nodes id=\"{{nodes.pathToNode}}\">\n      <ng-container [ngTemplateOutletContext]=\"{$implicit: nodes}\"\n                    [ngTemplateOutlet]=\"folderContentBackTemplate\">\n      </ng-container>\n    </app-node>\n  </ng-container>\n\n  <ng-container *ngFor=\"let node of obj.keys(nodes.children)\">\n    <app-node [node]=\"nodes.children[node]\"\n              id=\"fc_{{nodes.children[node].pathToNode}}\">\n      <ng-container [ngTemplateOutletContext]=\"{$implicit: nodes.children[node]}\"\n                    [ngTemplateOutlet]=\"folderContentTemplate\">\n      </ng-container>\n    </app-node>\n  </ng-container>\n\n  <div class=\"new\" (click)=\"newClickedAction()\">\n    <ng-container [ngTemplateOutlet]=\"folderContentNewTemplate\"></ng-container>\n  </div>\n</div>\n",
                    styles: [".item-holder{box-sizing:border-box;display:-webkit-flex;display:flex;-webkit-flex-flow:wrap;flex-flow:wrap}.item-holder .new{display:inline}"]
                },] },
    ];
    FolderContentComponent.ctorParameters = function () { return [
        { type: NodeService },
        { type: Store }
    ]; };
    FolderContentComponent.propDecorators = {
        folderContentTemplate: [{ type: Input }],
        folderContentBackTemplate: [{ type: Input }],
        folderContentNewTemplate: [{ type: Input }],
        treeModel: [{ type: Input }],
        openUploadDialog: [{ type: Output }]
    };
    return FolderContentComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var TreeComponent = /** @class */ (function () {
    function TreeComponent(nodeService, store) {
        this.nodeService = nodeService;
        this.store = store;
        this.currentTreeLevel = '';
    }
    /**
     * @return {?}
     */
    TreeComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.nodes = this.treeModel.nodes;
        //todo move this store to proper place
        this.store
            .pipe(select((/**
         * @param {?} state
         * @return {?}
         */
        function (state) { return state.fileManagerState.path; })))
            .subscribe((/**
         * @param {?} path
         * @return {?}
         */
        function (path) {
            _this.nodeService.getNodes(path);
            _this.currentTreeLevel = _this.treeModel.currentPath;
            return _this.treeModel.currentPath = path;
        }));
    };
    /**
     * @return {?}
     */
    TreeComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.store
            .pipe(select((/**
         * @param {?} state
         * @return {?}
         */
        function (state) { return state.fileManagerState.path; })))
            .pipe(first())
            .subscribe((/**
         * @param {?} path
         * @return {?}
         */
        function (path) {
            /** @type {?} */
            var nodes = _this.nodeService.findNodeByPath(path);
            _this.store.dispatch({ type: SET_SELECTED_NODE, payload: nodes });
        }));
    };
    TreeComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-tree',
                    template: "<app-node-lister [showFiles]=\"treeModel.config.options.showFilesInsideTree\"\n                 [nodes]=\"{children: nodes}\">\n  <ng-template let-nodes>\n    <ng-container [ngTemplateOutletContext]=\"{$implicit: nodes}\" [ngTemplateOutlet]=\"templateRef\"></ng-container>\n  </ng-template>\n</app-node-lister>\n",
                    styles: [""]
                },] },
    ];
    TreeComponent.ctorParameters = function () { return [
        { type: NodeService },
        { type: Store }
    ]; };
    TreeComponent.propDecorators = {
        templateRef: [{ type: ContentChild, args: [TemplateRef,] }],
        treeModel: [{ type: Input }]
    };
    return TreeComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var NodeListerComponent = /** @class */ (function () {
    function NodeListerComponent() {
        this.obj = Object;
    }
    /**
     * @return {?}
     */
    NodeListerComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
    };
    NodeListerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-node-lister',
                    template: "<ul class=\"node-lister-flist\">\n  <!--In order to avoid having to create that extra div, we can instead use ng-container directive-->\n  <ng-container *ngFor=\"let node of obj.keys(nodes)\">\n    <li class=\"node-lister-list-item\" *ngIf=\"nodes[node].isFolder || showFiles\">\n\n      <app-node class=\"node-lister-app-node\" [node]=\"nodes[node]\" id=\"tree_{{nodes[node].id === 0 ? 'root' : nodes[node].pathToNode}}\">\n        <ng-container [ngTemplateOutletContext]=\"{$implicit: (nodes[node])}\"\n                      [ngTemplateOutlet]=\"templateRef\">\n        </ng-container>\n      </app-node>\n\n      <app-node-lister class=\"node-lister\" *ngIf=\"obj.keys(nodes[node].children).length > 0\"\n                       [showFiles]=\"showFiles\" [nodes]=\"nodes[node].children\">\n        <ng-template let-nodes>\n          <ng-container [ngTemplateOutletContext]=\"{$implicit: (nodes)}\"\n                        [ngTemplateOutlet]=\"templateRef\">\n          </ng-container>\n        </ng-template>\n      </app-node-lister>\n    </li>\n  </ng-container>\n</ul>\n",
                    styles: [".node-lister-flist{margin:0 0 0 1em;padding:0;list-style:none;white-space:nowrap}.node-lister-list-item{list-style:none;line-height:1.2em;font-size:1em;display:inline}.node-lister-list-item .node-lister-app-node.deselected+.node-lister ul{display:none}"]
                },] },
    ];
    NodeListerComponent.ctorParameters = function () { return []; };
    NodeListerComponent.propDecorators = {
        templateRef: [{ type: ContentChild, args: [TemplateRef,] }],
        nodes: [{ type: Input }],
        showFiles: [{ type: Input }]
    };
    return NodeListerComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var NodeComponent = /** @class */ (function () {
    function NodeComponent(store, nodeService, nodeClickedService) {
        this.store = store;
        this.nodeService = nodeService;
        this.nodeClickedService = nodeClickedService;
        this.isSingleClick = true;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    NodeComponent.prototype.method1CallForClick = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        var _this = this;
        event.preventDefault();
        this.isSingleClick = true;
        setTimeout((/**
         * @return {?}
         */
        function () {
            if (_this.isSingleClick) {
                _this.showMenu();
            }
        }), 200);
    };
    // todo event.preventDefault for double click
    // todo event.preventDefault for double click
    /**
     * @param {?} event
     * @return {?}
     */
    NodeComponent.prototype.method2CallForDblClick = 
    // todo event.preventDefault for double click
    /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        event.preventDefault();
        this.isSingleClick = false;
        this.open();
    };
    /**
     * @return {?}
     */
    NodeComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
    };
    /**
     * @private
     * @return {?}
     */
    NodeComponent.prototype.open = /**
     * @private
     * @return {?}
     */
    function () {
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
    };
    /**
     * @private
     * @return {?}
     */
    NodeComponent.prototype.showMenu = /**
     * @private
     * @return {?}
     */
    function () {
        this.store.dispatch({ type: SET_SELECTED_NODE, payload: this.node });
    };
    /**
     * @private
     * @return {?}
     */
    NodeComponent.prototype.toggleNodeExpanded = /**
     * @private
     * @return {?}
     */
    function () {
        this.node.isExpanded = !this.node.isExpanded;
    };
    /**
     * @private
     * @return {?}
     */
    NodeComponent.prototype.setNodeSelectedState = /**
     * @private
     * @return {?}
     */
    function () {
        if (!this.node.isExpanded) {
            document.getElementById('tree_' + this.node.pathToNode).classList.add('deselected');
            this.nodeService.foldRecursively(this.node);
            this.store.dispatch({ type: SET_PATH, payload: this.node.pathToParent });
        }
        else {
            document.getElementById('tree_' + this.node.pathToNode).classList.remove('deselected');
        }
    };
    NodeComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-node',
                    template: "<div #customTemplate (dblclick)=\"method2CallForDblClick($event)\" (click)=\"method1CallForClick($event)\">\n  <ng-content></ng-content>\n</div>\n",
                    styles: [""]
                },] },
    ];
    NodeComponent.ctorParameters = function () { return [
        { type: Store },
        { type: NodeService },
        { type: NodeClickedService }
    ]; };
    NodeComponent.propDecorators = {
        node: [{ type: Input }]
    };
    return NodeComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var MapToIterablePipe = /** @class */ (function () {
    function MapToIterablePipe() {
    }
    /**
     * @param {?} dict
     * @return {?}
     */
    MapToIterablePipe.prototype.transform = /**
     * @param {?} dict
     * @return {?}
     */
    function (dict) {
        /** @type {?} */
        var a = [];
        for (var key in dict) {
            if (dict.hasOwnProperty(key)) {
                a.push({ key: key, val: dict[key] });
            }
        }
        return a;
    };
    MapToIterablePipe.decorators = [
        { type: Pipe, args: [{
                    name: 'mapToIterablePipe'
                },] },
    ];
    return MapToIterablePipe;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var NavBarComponent = /** @class */ (function () {
    function NavBarComponent(store, nodeService) {
        this.store = store;
        this.nodeService = nodeService;
    }
    /**
     * @return {?}
     */
    NavBarComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.store
            .pipe(select((/**
         * @param {?} state
         * @return {?}
         */
        function (state) { return state.fileManagerState.path; })))
            .subscribe((/**
         * @param {?} data
         * @return {?}
         */
        function (data) {
            _this.nodeService.currentPath = data;
            _this.currentPath = data.split('/');
        }));
    };
    /**
     * @param {?} path
     * @param {?} index
     * @return {?}
     */
    NavBarComponent.prototype.onClick = /**
     * @param {?} path
     * @param {?} index
     * @return {?}
     */
    function (path, index) {
        /** @type {?} */
        var newPath = path.slice(0, index + 1).join('/');
        this.store.dispatch({ type: SET_PATH, payload: newPath });
    };
    NavBarComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-nav-bar',
                    template: "<div>\n  >> <span *ngFor=\"let to of currentPath; let i = index\">\n  <a class=\"link\" (click)=\"onClick(currentPath, i)\">\n    <div *ngIf=\"to === '' || to === 'root'; then icon else name\"></div>\n    <ng-template #icon><i class=\"fas fa-home\"></i></ng-template>\n    <ng-template #name>{{to}}</ng-template>\n  </a> /\n  </span>\n</div>\n",
                    styles: [""]
                },] },
    ];
    NavBarComponent.ctorParameters = function () { return [
        { type: Store },
        { type: NodeService }
    ]; };
    return NavBarComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var initialState = {
    path: '',
    isLoading: true,
    selectedNode: null
};
/**
 * @param {?=} state
 * @param {?=} action
 * @return {?}
 */
function stateReducer(state, action) {
    // console.log('Previous state: ', state);
    // console.log('ACTION type: ', action.type);
    // console.log('ACTION payload: ', action.payload);
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case SET_PATH:
            if (state.path === action.payload) {
                return state;
            }
            return __assign({}, state, { path: action.payload, isLoading: true });
        case SET_LOADING_STATE:
            return __assign({}, state, { isLoading: action.payload });
        case SET_SELECTED_NODE:
            return __assign({}, state, { selectedNode: action.payload });
        default:
            return initialState;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var reducers = {
    fileManagerState: stateReducer
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var LoadingOverlayComponent = /** @class */ (function () {
    function LoadingOverlayComponent() {
    }
    // todo unsubscribe from 'list' event - now we are only dismissing this component
    // todo unsubscribe from 'list' event - now we are only dismissing this component
    /**
     * @return {?}
     */
    LoadingOverlayComponent.prototype.ngOnInit = 
    // todo unsubscribe from 'list' event - now we are only dismissing this component
    /**
     * @return {?}
     */
    function () {
        var _this = this;
        timer(2000).subscribe((/**
         * @return {?}
         */
        function () {
            _this.timeoutMessage = _('Troubles with loading? Click anywhere to cancel loading');
        }));
    };
    LoadingOverlayComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-loading-overlay',
                    template: "<ng-container\n  [ngTemplateOutletContext]=\"{$implicit: timeoutMessage}\"\n  [ngTemplateOutlet]=\"loadingOverlayTemplate\">\n</ng-container>\n",
                    styles: [""]
                },] },
    ];
    LoadingOverlayComponent.propDecorators = {
        loadingOverlayTemplate: [{ type: Input }]
    };
    return LoadingOverlayComponent;
}());

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
var FileSizePipe = /** @class */ (function () {
    /*
     * Convert bytes into largest possible unit.
     * Takes an precision argument that defaults to 2.
     * Usage:
     *   bytes | fileSize:precision
     * Example:
     *   {{ 1024 |  fileSize}}
     *   formats to: 1 KB
    */
    function FileSizePipe() {
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
    FileSizePipe.prototype.transform = /**
     * @param {?=} bytes
     * @param {?=} precision
     * @return {?}
     */
    function (bytes, precision) {
        if (bytes === void 0) { bytes = 0; }
        if (precision === void 0) { precision = 2; }
        if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes))
            return '?';
        /** @type {?} */
        var unit = 0;
        while (bytes >= 1024) {
            bytes /= 1024;
            unit++;
        }
        return bytes.toFixed(+precision) + ' ' + this.units[unit];
    };
    FileSizePipe.decorators = [
        { type: Pipe, args: [{ name: 'fileSize' },] },
    ];
    return FileSizePipe;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var UploadComponent = /** @class */ (function () {
    function UploadComponent(http, nodeService) {
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
    UploadComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
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
                function () { return _this.counter++; }),
                onCancel: (/**
                 * @return {?}
                 */
                function () {
                    _this.counter < 0 ? console.warn('wtf?') : _this.counter--;
                }),
                onAllComplete: (/**
                 * @param {?} succ
                 * @param {?} fail
                 * @return {?}
                 */
                function (succ, fail) {
                    if (succ.length > 0) {
                        _this.counter = 0;
                        _this.nodeService.refreshCurrentPath();
                    }
                })
            }
        });
    };
    /**
     * @return {?}
     */
    UploadComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
    };
    Object.defineProperty(UploadComponent.prototype, "getCurrentPath", {
        get: /**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var parentPath = this.nodeService.findNodeByPath(this.nodeService.currentPath).id;
            return parentPath === 0 ? '' : parentPath;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    UploadComponent.prototype.uploadFiles = /**
     * @return {?}
     */
    function () {
        this.uploader.uploadStoredFiles();
    };
    /**
     * @param {?=} input
     * @return {?}
     */
    UploadComponent.prototype.createNewFolder = /**
     * @param {?=} input
     * @return {?}
     */
    function (input) {
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
    };
    /**
     * @return {?}
     */
    UploadComponent.prototype.newClickedAction = /**
     * @return {?}
     */
    function () {
        this.uploader.cancelAll();
        this.closeDialog.emit();
    };
    UploadComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-upload',
                    template: "<div class=\"backdrop\" (click)=\"newClickedAction()\"></div>\n<div class=\"upload-background\">\n  <div class=\"buttons\">\n    <button class=\"button\" [disabled]=\"newFolder\" (click)=\"createNewFolder()\" translate>Create new folder</button>\n  </div>\n\n  <div *ngIf=\"newFolder\">\n    <div class=\"buttons\">\n      <app-new-folder (buttonClicked)=\"createNewFolder($event)\"></app-new-folder>\n    </div>\n  </div>\n\n  <div id=\"fine-uploader\">\n  </div>\n\n\n  <div class=\"buttons\">\n    <button class=\"button big\" [disabled]=\"this.counter < 1\" (click)=\"uploadFiles()\" translate>\n      Upload\n    </button>\n    <button class=\"button big\" (click)=\"newClickedAction()\" translate>\n      Close\n    </button>\n  </div>\n\n</div>\n\n<div id=\"fine-uploader-template\" style=\"display: none;\">\n  <div class=\"qq-uploader-selector qq-uploader\" qq-drop-area-text=\"Drop files here\">\n    <div class=\"qq-upload-drop-area-selector qq-upload-drop-area\" qq-hide-dropzone>\n      <span class=\"qq-upload-drop-area-text-selector\"></span>\n    </div>\n\n    <div class=\"upload-top-bar\">\n      <div class=\"qq-upload-button-selector qq-upload-button\">\n        <div translate>Upload a file</div>\n      </div>\n\n      <div class=\"qq-total-progress-bar-container-selector qq-total-progress-bar-container\">\n        <div role=\"progressbar\" aria-valuenow=\"0\" aria-valuemin=\"0\" aria-valuemax=\"100\"\n             class=\"qq-total-progress-bar-selector qq-progress-bar qq-total-progress-bar\"></div>\n      </div>\n    </div>\n\n    <span class=\"qq-drop-processing-selector qq-drop-processing\">\n            <span translate>Processing dropped files</span>...\n            <span class=\"qq-drop-processing-spinner-selector qq-drop-processing-spinner\"></span>\n    </span>\n\n    <ul class=\"qq-upload-list-selector qq-upload-list\" aria-live=\"polite\" aria-relevant=\"additions removals\">\n      <li>\n        <div class=\"qq-progress-bar-container-selector\">\n          <div role=\"progressbar\" aria-valuenow=\"0\" aria-valuemin=\"0\" aria-valuemax=\"100\"\n               class=\"qq-progress-bar-selector qq-progress-bar\"></div>\n        </div>\n        <span class=\"qq-upload-spinner-selector qq-upload-spinner\"></span>\n        <img class=\"qq-thumbnail-selector\" qq-max-size=\"100\" qq-server-scale>\n        <span class=\"qq-upload-file-selector qq-upload-file\"></span>\n        <span class=\"qq-edit-filename-icon-selector qq-edit-filename-icon\" aria-label=\"Edit filename\"></span>\n        <input class=\"qq-edit-filename-selector qq-edit-filename\" tabindex=\"0\" type=\"text\">\n        <span class=\"qq-upload-size-selector qq-upload-size\"></span>\n        <button type=\"button\" class=\"qq-btn qq-upload-cancel-selector qq-upload-cancel\" translate>Cancel</button>\n        <button type=\"button\" class=\"qq-btn qq-upload-retry-selector qq-upload-retry\" translate>Retry</button>\n        <button type=\"button\" class=\"qq-btn qq-upload-delete-selector qq-upload-delete\" translate>Delete</button>\n        <span role=\"status\" class=\"qq-upload-status-text-selector qq-upload-status-text\"></span>\n      </li>\n    </ul>\n\n    <dialog class=\"qq-alert-dialog-selector\">\n      <div class=\"qq-dialog-message-selector\"></div>\n      <div class=\"qq-dialog-buttons\">\n        <button type=\"button\" class=\"qq-cancel-button-selector\" translate>Close</button>\n      </div>\n    </dialog>\n\n    <dialog class=\"qq-confirm-dialog-selector\">\n      <div class=\"qq-dialog-message-selector\"></div>\n      <div class=\"qq-dialog-buttons\">\n        <button type=\"button\" class=\"qq-cancel-button-selector\" translate>No</button>\n        <button type=\"button\" class=\"qq-ok-button-selector\" translate>Yes</button>\n      </div>\n    </dialog>\n\n    <dialog class=\"qq-prompt-dialog-selector\">\n      <div class=\"qq-dialog-message-selector\"></div>\n      <input type=\"text\">\n      <div class=\"qq-dialog-buttons\">\n        <button type=\"button\" class=\"qq-cancel-button-selector\" translate>Cancel</button>\n        <button type=\"button\" class=\"qq-ok-button-selector\" translate>Ok</button>\n      </div>\n    </dialog>\n  </div>\n</div>\n",
                    styles: [".upload-content{text-align:center;max-height:25vh;overflow:auto;margin:10px auto}.fa-times:before{content:\"\\f00d\"}.buttons{background:#fff;padding:5px;margin:10px 0}", ".qq-upload-button div{line-height:25px}.qq-upload-button-focus{outline:0}.qq-uploader{position:relative;min-height:200px;max-height:490px;overflow-y:hidden;width:inherit;border-radius:6px;background-color:#fdfdfd;border:1px dashed #ccc;padding:20px}.qq-uploader:before{content:attr(qq-drop-area-text) \" \";position:absolute;font-size:200%;left:0;width:100%;text-align:center;top:45%;opacity:.25}.qq-upload-drop-area,.qq-upload-extra-drop-area{position:absolute;top:0;left:0;width:100%;height:100%;min-height:30px;z-index:2;background:#f9f9f9;border-radius:4px;border:1px dashed #ccc;text-align:center}.qq-upload-drop-area span{display:block;position:absolute;top:50%;width:100%;margin-top:-8px;font-size:16px}.qq-upload-extra-drop-area{position:relative;margin-top:50px;font-size:16px;padding-top:30px;height:20px;min-height:40px}.qq-upload-drop-area-active{background:#fdfdfd;border-radius:4px;border:1px dashed #ccc}.qq-upload-list{margin:0;padding:0;list-style:none;max-height:450px;overflow-y:auto;clear:both}.qq-upload-list li{margin:0;padding:9px;line-height:15px;font-size:16px;color:#424242;background-color:#f6f6f6;border-top:1px solid #fff;border-bottom:1px solid #ddd}.qq-upload-list li:first-child{border-top:none}.qq-upload-list li:last-child{border-bottom:none}.qq-upload-cancel,.qq-upload-continue,.qq-upload-delete,.qq-upload-failed-text,.qq-upload-file,.qq-upload-pause,.qq-upload-retry,.qq-upload-size,.qq-upload-spinner{margin-right:12px;display:inline}.qq-upload-file{vertical-align:middle;display:inline-block;width:300px;text-overflow:ellipsis;white-space:nowrap;overflow-x:hidden;height:18px}.qq-upload-spinner{display:inline-block;background:url(loading.gif);width:15px;height:15px;vertical-align:text-bottom}.qq-drop-processing{display:block}.qq-drop-processing-spinner{display:inline-block;background:url(processing.gif);width:24px;height:24px;vertical-align:text-bottom}.qq-upload-cancel,.qq-upload-continue,.qq-upload-delete,.qq-upload-pause,.qq-upload-retry,.qq-upload-size{font-size:12px;font-weight:400;cursor:pointer;vertical-align:middle}.qq-upload-status-text{font-size:14px;font-weight:700;display:block}.qq-upload-failed-text{display:none;font-style:italic;font-weight:700}.qq-upload-failed-icon{display:none;width:15px;height:15px;vertical-align:text-bottom}.qq-upload-fail .qq-upload-failed-text,.qq-upload-retrying .qq-upload-failed-text{display:inline}.qq-upload-list li.qq-upload-success{background-color:#ebf6e0;color:#424242;border-bottom:1px solid #d3ded1;border-top:1px solid #f7fff5}.qq-upload-list li.qq-upload-fail{background-color:#f5d7d7;color:#424242;border-bottom:1px solid #decaca;border-top:1px solid #fce6e6}.qq-total-progress-bar{height:25px;border-radius:9px}INPUT.qq-edit-filename{position:absolute;opacity:0;z-index:-1}.qq-upload-file.qq-editable{cursor:pointer;margin-right:4px}.qq-edit-filename-icon.qq-editable{display:inline-block;cursor:pointer}INPUT.qq-edit-filename.qq-editing{position:static;height:28px;padding:0 8px;margin-right:10px;margin-bottom:-5px;border:1px solid #ccc;border-radius:2px;font-size:16px;opacity:1}.qq-edit-filename-icon{display:none;background:url(edit.gif);width:15px;height:15px;vertical-align:text-bottom;margin-right:16px}.qq-hide{display:none}.qq-thumbnail-selector{vertical-align:middle;margin-right:12px}.qq-uploader DIALOG{display:none}.qq-uploader DIALOG[open]{display:block}.qq-uploader DIALOG .qq-dialog-buttons{text-align:center;padding-top:10px}.qq-uploader DIALOG .qq-dialog-buttons BUTTON{margin-left:5px;margin-right:5px}.qq-uploader DIALOG .qq-dialog-message-selector{padding-bottom:10px}.qq-uploader DIALOG::-webkit-backdrop{background-color:rgba(0,0,0,.7)}.qq-uploader DIALOG::backdrop{background-color:rgba(0,0,0,.7)}"],
                    encapsulation: ViewEncapsulation.None
                },] },
    ];
    UploadComponent.ctorParameters = function () { return [
        { type: HttpClient },
        { type: NodeService }
    ]; };
    UploadComponent.propDecorators = {
        openDialog: [{ type: Input }],
        closeDialog: [{ type: Output }],
        createDir: [{ type: Output }]
    };
    return UploadComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var NewFolderComponent = /** @class */ (function () {
    function NewFolderComponent() {
        this.buttonClicked = new EventEmitter();
        this.buttonText = _('Close').toString();
        this.inputValue = '';
    }
    /**
     * @return {?}
     */
    NewFolderComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
    };
    /**
     * @return {?}
     */
    NewFolderComponent.prototype.onClick = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var el = ((/** @type {?} */ (this.uploadFolder.nativeElement)));
        // @ts-ignore
        this.buttonClicked.emit(el.value);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    NewFolderComponent.prototype.onInputChange = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.inputValue = event.target.value;
        if (this.inputValue.length > 0) {
            this.buttonText = _('Confirm').toString();
        }
        else {
            this.buttonText = _('Close').toString();
        }
    };
    NewFolderComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-new-folder',
                    template: "<p class=\"new-folder-description\" translate>Type new folder name</p>\n<input #uploadFolder placeholder=\"{{'Folder name' | translate}}\" (keyup)=\"onInputChange($event)\"\n       (keyup.enter)=\"onClick()\" onclick=\"this.select();\" type=\"text\" class=\"new-folder-input\"/>\n<button class=\"button new-folder-send\" (click)=\"onClick()\">{{buttonText | translate}}</button>\n",
                    styles: [".new-folder-description{margin:0 auto;padding:0}"]
                },] },
    ];
    NewFolderComponent.ctorParameters = function () { return []; };
    NewFolderComponent.propDecorators = {
        uploadFolder: [{ type: ViewChild, args: ['uploadFolder',] }],
        buttonClicked: [{ type: Output }]
    };
    return NewFolderComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var SideViewComponent = /** @class */ (function () {
    function SideViewComponent() {
        this.allowFolderDownload = false;
        this.clickEvent = new EventEmitter();
    }
    /**
     * @return {?}
     */
    SideViewComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
    };
    /**
     * @param {?} event
     * @param {?} type
     * @return {?}
     */
    SideViewComponent.prototype.onClick = /**
     * @param {?} event
     * @param {?} type
     * @return {?}
     */
    function (event, type) {
        this.clickEvent.emit({ type: type, event: event, node: this.node });
    };
    SideViewComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-side-view',
                    template: "<div class=\"side-view\" *ngIf=\"node\">\n  <div class=\"side-view-preview\">\n    <i (click)=\"onClick($event, 'closeSideView')\" class=\"fas fa-times side-view-close\"></i>\n\n    <div class=\"side-view-preview-title\">{{node.name}}</div>\n\n    <div class=\"side-view-preview-content\">\n      <ng-container\n        [ngTemplateOutletContext]=\"{$implicit: node}\"\n        [ngTemplateOutlet]=\"sideViewTemplate\">\n      </ng-container>\n    </div>\n\n    <div class=\"side-view-buttons\">\n      <button (click)=\"onClick($event, 'download')\" class=\"button\"\n              [disabled]=\"!allowFolderDownload && node.isFolder\" translate>\n        Download\n      </button>\n      <button (click)=\"onClick($event, 'renameConfirm')\" class=\"button\" translate>Rename</button>\n      <button (click)=\"onClick($event, 'removeAsk')\" class=\"button\" translate>Delete</button>\n    </div>\n  </div>\n</div>\n",
                    styles: [".side-view-close{position:absolute;cursor:pointer;top:0;right:0;padding:15px}.side-view-buttons{width:100%;display:-webkit-flex;display:flex;-webkit-justify-content:center;justify-content:center;-webkit-flex-flow:column;flex-flow:column}.side-view-buttons .button{margin:5px 0}"],
                    encapsulation: ViewEncapsulation.None
                },] },
    ];
    SideViewComponent.ctorParameters = function () { return []; };
    SideViewComponent.propDecorators = {
        sideViewTemplate: [{ type: Input }],
        node: [{ type: Input }],
        allowFolderDownload: [{ type: Input }],
        clickEvent: [{ type: Output }]
    };
    return SideViewComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var NavigationComponent = /** @class */ (function () {
    function NavigationComponent(nodeClickedService) {
        this.nodeClickedService = nodeClickedService;
    }
    /**
     * @return {?}
     */
    NavigationComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
    };
    /**
     * @param {?} input
     * @return {?}
     */
    NavigationComponent.prototype.onClick = /**
     * @param {?} input
     * @return {?}
     */
    function (input) {
        this.nodeClickedService.searchForString(input);
    };
    NavigationComponent.decorators = [
        { type: Component, args: [{
                    selector: 'app-navigation',
                    template: "<div class=\"navigation-component\">\n  <input #input class=\"navigation-search\" onclick=\"this.select();\" (keyup.enter)=\"onClick(input.value)\"\n         placeholder=\"{{'Search' | translate}}\">\n\n  <button [disabled]=\"input.value.length === 0\" class=\"navigation-search-icon\" (click)=\"onClick(input.value)\">\n    <i class=\"fas fa-search\"></i>\n  </button>\n\n  <div>\n    <ng-content></ng-content>\n  </div>\n</div>\n\n\n",
                    styles: [".navigation-component{display:-webkit-flex;display:flex}"],
                    encapsulation: ViewEncapsulation.None
                },] },
    ];
    NavigationComponent.ctorParameters = function () { return [
        { type: NodeClickedService }
    ]; };
    return NavigationComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @param {?} http
 * @return {?}
 */
function createTranslateLoader(http) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
/** @type {?} */
var FEATURE_REDUCER_TOKEN = new InjectionToken('AppStore Reducers');
/**
 * @return {?}
 */
function getReducers() {
    // map of reducers
    return reducers;
}
var ɵ0 = (createTranslateLoader);
var FileManagerModule = /** @class */ (function () {
    function FileManagerModule() {
    }
    /**
     * @return {?}
     */
    FileManagerModule.forRoot = /**
     * @return {?}
     */
    function () {
        return {
            ngModule: FileManagerModule,
            providers: [TranslateService]
        };
    };
    FileManagerModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        HttpClientModule,
                        StoreModule.forRoot(FEATURE_REDUCER_TOKEN),
                        CommonModule,
                        NgxSmartModalModule.forRoot(),
                        TranslateModule.forRoot({
                            loader: {
                                provide: TranslateLoader,
                                useFactory: ɵ0,
                                deps: [HttpClient]
                            }
                        })
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
    return FileManagerModule;
}());

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

export { FileManagerComponent, createTranslateLoader, getReducers, FileManagerModule, TreeModel, NodeService, FolderContentComponent as ɵe, LoadingOverlayComponent as ɵk, NodeComponent as ɵf, NewFolderComponent as ɵn, UploadComponent as ɵm, NavBarComponent as ɵj, NavigationComponent as ɵp, SideViewComponent as ɵo, NodeListerComponent as ɵh, TreeComponent as ɵg, FileSizePipe as ɵl, MapToIterablePipe as ɵi, reducers as ɵb, stateReducer as ɵd, NodeClickedService as ɵc };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmc2LWZpbGUtbWFuLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL21vZGVscy90cmVlLm1vZGVsLnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL3JlZHVjZXJzL2FjdGlvbnMuYWN0aW9uLnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL3NlcnZpY2VzL25vZGUuc2VydmljZS50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9zZXJ2aWNlcy9ub2RlLWNsaWNrZWQuc2VydmljZS50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9maWxlLW1hbmFnZXIuY29tcG9uZW50LnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL2NvbXBvbmVudHMvZm9sZGVyLWNvbnRlbnQvZm9sZGVyLWNvbnRlbnQuY29tcG9uZW50LnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL2NvbXBvbmVudHMvdHJlZS90cmVlLmNvbXBvbmVudC50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9jb21wb25lbnRzL3RyZWUvbm9kZS1saXN0ZXIvbm9kZS1saXN0ZXIuY29tcG9uZW50LnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL2NvbXBvbmVudHMvZnVuY3Rpb25zL25vZGUvbm9kZS5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvcGlwZXMvbWFwLXRvLWl0ZXJhYmxlLnBpcGUudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy9uYXYtYmFyL25hdi1iYXIuY29tcG9uZW50LnRzIiwibmc6Ly9uZzYtZmlsZS1tYW4vZmlsZS1tYW5hZ2VyL3JlZHVjZXJzL3N0YXRlUmVkdWNlci50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnkudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy9mdW5jdGlvbnMvbG9hZGluZy1vdmVybGF5L2xvYWRpbmctb3ZlcmxheS5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvcGlwZXMvZmlsZS1zaXplLnBpcGUudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy9mdW5jdGlvbnMvdXBsb2FkL3VwbG9hZC5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy9mdW5jdGlvbnMvdXBsb2FkL25ldy1mb2xkZXIvbmV3LWZvbGRlci5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvY29tcG9uZW50cy9zaWRlLXZpZXcvc2lkZS12aWV3LmNvbXBvbmVudC50cyIsIm5nOi8vbmc2LWZpbGUtbWFuL2ZpbGUtbWFuYWdlci9jb21wb25lbnRzL25hdmlnYXRpb24vbmF2aWdhdGlvbi5jb21wb25lbnQudHMiLCJuZzovL25nNi1maWxlLW1hbi9maWxlLW1hbmFnZXIvZmlsZS1tYW5hZ2VyLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge05vZGVJbnRlcmZhY2V9IGZyb20gJy4uL2ludGVyZmFjZXMvbm9kZS5pbnRlcmZhY2UnO1xyXG5pbXBvcnQge0NvbmZpZ0ludGVyZmFjZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9jb25maWcuaW50ZXJmYWNlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBUcmVlTW9kZWwge1xyXG4gIHByaXZhdGUgX2N1cnJlbnRQYXRoOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBfbm9kZXM6IE5vZGVJbnRlcmZhY2U7XHJcbiAgcHJpdmF0ZSBfc2VsZWN0ZWROb2RlSWQ6IHN0cmluZztcclxuICBwdWJsaWMgY29uZmlnOiBDb25maWdJbnRlcmZhY2U7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogQ29uZmlnSW50ZXJmYWNlKSB7XHJcbiAgICAvLyB0aGlzLl9jdXJyZW50UGF0aCA9IGNvbmZpZy5zdGFydGluZ0ZvbGRlcjsgLy8gdG9kbyBpbXBsZW1lbnQgKGNvbmZpZy5pbnRlcmZjZS50cylcclxuICAgIHRoaXMuX2N1cnJlbnRQYXRoID0gJyc7XHJcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcclxuXHJcbiAgICB0aGlzLm5vZGVzID0gPE5vZGVJbnRlcmZhY2U+e1xyXG4gICAgICBpZDogMCxcclxuICAgICAgcGF0aFRvTm9kZTogJycsXHJcbiAgICAgIHBhdGhUb1BhcmVudDogbnVsbCxcclxuICAgICAgaXNGb2xkZXI6IHRydWUsXHJcbiAgICAgIGlzRXhwYW5kZWQ6IHRydWUsXHJcbiAgICAgIHN0YXlPcGVuOiB0cnVlLFxyXG4gICAgICBuYW1lOiAncm9vdCcsXHJcbiAgICAgIGNoaWxkcmVuOiB7fVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGdldCBjdXJyZW50UGF0aCgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRQYXRoO1xyXG4gIH1cclxuXHJcbiAgc2V0IGN1cnJlbnRQYXRoKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuX2N1cnJlbnRQYXRoID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBnZXQgbm9kZXMoKTogTm9kZUludGVyZmFjZSB7XHJcbiAgICByZXR1cm4gdGhpcy5fbm9kZXM7XHJcbiAgfVxyXG5cclxuICBzZXQgbm9kZXModmFsdWU6IE5vZGVJbnRlcmZhY2UpIHtcclxuICAgIHRoaXMuX25vZGVzID0gdmFsdWU7XHJcbiAgfVxyXG5cclxuICBnZXQgc2VsZWN0ZWROb2RlSWQoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZE5vZGVJZDtcclxuICB9XHJcblxyXG4gIHNldCBzZWxlY3RlZE5vZGVJZCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICB0aGlzLl9zZWxlY3RlZE5vZGVJZCA9IHZhbHVlO1xyXG4gIH1cclxuXHJcbiAgLy8gdG9kbyBpbXBsZW1lbnQgKGNvbmZpZy5pbnRlcmZjZS50cylcclxuICAvLyBnZXQgaXNDYWNoZSgpOiBib29sZWFuIHtcclxuICAvLyAgIHJldHVybiB0aGlzLmNvbmZpZy5vZmZsaW5lTW9kZTtcclxuICAvLyB9XHJcbiAgLy9cclxuICAvLyBzZXQgaXNDYWNoZSh2YWx1ZTogYm9vbGVhbikge1xyXG4gIC8vICAgdGhpcy5jb25maWcub2ZmbGluZU1vZGUgPSB2YWx1ZTtcclxuICAvLyB9XHJcbn1cclxuIiwiaW1wb3J0IHtBY3Rpb25JbnRlcmZhY2V9IGZyb20gJy4uL2ludGVyZmFjZXMvYWN0aW9uLmludGVyZmFjZSc7XHJcbmltcG9ydCB7Tm9kZUludGVyZmFjZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XHJcblxyXG5leHBvcnQgY29uc3QgU0VUX1BBVEggPSAnU0VUX1BBVEgnO1xyXG5leHBvcnQgY29uc3QgU0VUX0xPQURJTkdfU1RBVEUgPSAnU0VUX0xPQURJTkdfU1RBVEUnO1xyXG5leHBvcnQgY29uc3QgU0VUX1NFTEVDVEVEX05PREUgPSAnU0VUX1NFTEVDVEVEX05PREUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNldFBhdGggaW1wbGVtZW50cyBBY3Rpb25JbnRlcmZhY2Uge1xyXG4gIHJlYWRvbmx5IHR5cGUgPSBTRVRfUEFUSDtcclxuICBwYXlsb2FkOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTZXRMb2FkaW5nU3RhdGUgaW1wbGVtZW50cyBBY3Rpb25JbnRlcmZhY2Uge1xyXG4gIHJlYWRvbmx5IHR5cGUgPSBTRVRfTE9BRElOR19TVEFURTtcclxuICBwYXlsb2FkOiBib29sZWFuO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2V0U2VsZWN0ZWROb2RlIGltcGxlbWVudHMgQWN0aW9uSW50ZXJmYWNlIHtcclxuICByZWFkb25seSB0eXBlID0gU0VUX1NFTEVDVEVEX05PREU7XHJcbiAgcGF5bG9hZDogTm9kZUludGVyZmFjZTtcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgQWN0aW9ucyA9IFNldFBhdGggfCBTZXRMb2FkaW5nU3RhdGUgfCBTZXRTZWxlY3RlZE5vZGU7XHJcbiIsImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7Tm9kZUludGVyZmFjZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XHJcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7VHJlZU1vZGVsfSBmcm9tICcuLi9tb2RlbHMvdHJlZS5tb2RlbCc7XHJcbmltcG9ydCB7SHR0cENsaWVudCwgSHR0cFBhcmFtc30gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQgKiBhcyBBQ1RJT05TIGZyb20gJy4uL3JlZHVjZXJzL2FjdGlvbnMuYWN0aW9uJztcclxuaW1wb3J0IHtTdG9yZX0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5pbXBvcnQge0FwcFN0b3JlfSBmcm9tICcuLi9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnknO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgTm9kZVNlcnZpY2Uge1xyXG4gIHB1YmxpYyB0cmVlOiBUcmVlTW9kZWw7XHJcbiAgcHJpdmF0ZSBfcGF0aDogc3RyaW5nO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsIHByaXZhdGUgc3RvcmU6IFN0b3JlPEFwcFN0b3JlPikge1xyXG4gIH1cclxuXHJcbiAgLy8gdG9kbyBhc2sgc2VydmVyIHRvIGdldCBwYXJlbnQgc3RydWN0dXJlXHJcbiAgcHVibGljIHN0YXJ0TWFuYWdlckF0KHBhdGg6IHN0cmluZykge1xyXG4gICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogQUNUSU9OUy5TRVRfUEFUSCwgcGF5bG9hZDogcGF0aH0pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlZnJlc2hDdXJyZW50UGF0aCgpIHtcclxuICAgIHRoaXMuZmluZE5vZGVCeVBhdGgodGhpcy5jdXJyZW50UGF0aCkuY2hpbGRyZW4gPSB7fTtcclxuICAgIHRoaXMuZ2V0Tm9kZXModGhpcy5jdXJyZW50UGF0aCk7XHJcbiAgfVxyXG5cclxuICBnZXROb2RlcyhwYXRoOiBzdHJpbmcpIHtcclxuICAgIHRoaXMucGFyc2VOb2RlcyhwYXRoKS5zdWJzY3JpYmUoKGRhdGE6IEFycmF5PE5vZGVJbnRlcmZhY2U+KSA9PiB7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IHBhcmVudFBhdGggPSB0aGlzLmdldFBhcmVudFBhdGgoZGF0YVtpXS5wYXRoVG9Ob2RlKTtcclxuICAgICAgICB0aGlzLmZpbmROb2RlQnlQYXRoKHBhcmVudFBhdGgpLmNoaWxkcmVuW2RhdGFbaV0ubmFtZV0gPSBkYXRhW2ldO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0UGFyZW50UGF0aChwYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgbGV0IHBhcmVudFBhdGggPSBwYXRoLnNwbGl0KCcvJyk7XHJcbiAgICBwYXJlbnRQYXRoID0gcGFyZW50UGF0aC5zbGljZSgwLCBwYXJlbnRQYXRoLmxlbmd0aCAtIDEpO1xyXG4gICAgcmV0dXJuIHBhcmVudFBhdGguam9pbignLycpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwYXJzZU5vZGVzKHBhdGg6IHN0cmluZyk6IE9ic2VydmFibGU8Tm9kZUludGVyZmFjZVtdPiB7XHJcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUob2JzZXJ2ZXIgPT4ge1xyXG4gICAgICB0aGlzLmdldE5vZGVzRnJvbVNlcnZlcihwYXRoKS5zdWJzY3JpYmUoKGRhdGE6IEFycmF5PGFueT4pID0+IHtcclxuICAgICAgICBvYnNlcnZlci5uZXh0KGRhdGEubWFwKG5vZGUgPT4gdGhpcy5jcmVhdGVOb2RlKHBhdGgsIG5vZGUpKSk7XHJcbiAgICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogQUNUSU9OUy5TRVRfTE9BRElOR19TVEFURSwgcGF5bG9hZDogZmFsc2V9KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY3JlYXRlTm9kZShwYXRoLCBub2RlKTogTm9kZUludGVyZmFjZSB7XHJcbiAgICBpZiAobm9kZS5wYXRoWzBdICE9PSAnLycpIHtcclxuICAgICAgY29uc29sZS53YXJuKCdbTm9kZSBTZXJ2aWNlXSBTZXJ2ZXIgc2hvdWxkIHJldHVybiBpbml0aWFsIHBhdGggd2l0aCBcIi9cIicpO1xyXG4gICAgICBub2RlLnBhdGggPSAnLycgKyBub2RlLnBhdGg7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgaWRzID0gbm9kZS5wYXRoLnNwbGl0KCcvJyk7XHJcbiAgICBpZiAoaWRzLmxlbmd0aCA+IDIgJiYgaWRzW2lkcy5sZW5ndGggLSAxXSA9PT0gJycpIHtcclxuICAgICAgaWRzLnNwbGljZSgtMSwgMSk7XHJcbiAgICAgIG5vZGUucGF0aCA9IGlkcy5qb2luKCcvJyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY2FjaGVkTm9kZSA9IHRoaXMuZmluZE5vZGVCeVBhdGgobm9kZS5wYXRoKTtcclxuXHJcbiAgICByZXR1cm4gPE5vZGVJbnRlcmZhY2U+e1xyXG4gICAgICBpZDogbm9kZS5pZCxcclxuICAgICAgaXNGb2xkZXI6IG5vZGUuZGlyLFxyXG4gICAgICBpc0V4cGFuZGVkOiBjYWNoZWROb2RlID8gY2FjaGVkTm9kZS5pc0V4cGFuZGVkIDogZmFsc2UsXHJcbiAgICAgIHBhdGhUb05vZGU6IG5vZGUucGF0aCxcclxuICAgICAgcGF0aFRvUGFyZW50OiB0aGlzLmdldFBhcmVudFBhdGgobm9kZS5wYXRoKSxcclxuICAgICAgbmFtZTogbm9kZS5uYW1lIHx8IG5vZGUuaWQsXHJcbiAgICAgIGNoaWxkcmVuOiBjYWNoZWROb2RlID8gY2FjaGVkTm9kZS5jaGlsZHJlbiA6IHt9XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXROb2Rlc0Zyb21TZXJ2ZXIgPSAocGF0aDogc3RyaW5nKSA9PiB7XHJcbiAgICBsZXQgZm9sZGVySWQ6IGFueSA9IHRoaXMuZmluZE5vZGVCeVBhdGgocGF0aCkuaWQ7XHJcbiAgICBmb2xkZXJJZCA9IGZvbGRlcklkID09PSAwID8gJycgOiBmb2xkZXJJZDtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldChcclxuICAgICAgdGhpcy50cmVlLmNvbmZpZy5iYXNlVVJMICsgdGhpcy50cmVlLmNvbmZpZy5hcGkubGlzdEZpbGUsXHJcbiAgICAgIHtwYXJhbXM6IG5ldyBIdHRwUGFyYW1zKCkuc2V0KCdwYXJlbnRQYXRoJywgZm9sZGVySWQpfVxyXG4gICAgKTtcclxuICB9O1xyXG5cclxuICBwdWJsaWMgZmluZE5vZGVCeVBhdGgobm9kZVBhdGg6IHN0cmluZyk6IE5vZGVJbnRlcmZhY2Uge1xyXG4gICAgY29uc3QgaWRzID0gbm9kZVBhdGguc3BsaXQoJy8nKTtcclxuICAgIGlkcy5zcGxpY2UoMCwgMSk7XHJcblxyXG4gICAgcmV0dXJuIGlkcy5sZW5ndGggPT09IDAgPyB0aGlzLnRyZWUubm9kZXMgOiBpZHMucmVkdWNlKCh2YWx1ZSwgaW5kZXgpID0+IHZhbHVlWydjaGlsZHJlbiddW2luZGV4XSwgdGhpcy50cmVlLm5vZGVzKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBmaW5kTm9kZUJ5SWQoaWQ6IG51bWJlcik6IE5vZGVJbnRlcmZhY2Uge1xyXG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5maW5kTm9kZUJ5SWRIZWxwZXIoaWQpO1xyXG5cclxuICAgIGlmIChyZXN1bHQgPT09IG51bGwpIHtcclxuICAgICAgY29uc29sZS53YXJuKCdbTm9kZSBTZXJ2aWNlXSBDYW5ub3QgZmluZCBub2RlIGJ5IGlkLiBJZCBub3QgZXhpc3Rpbmcgb3Igbm90IGZldGNoZWQuIFJldHVybmluZyByb290LicpO1xyXG4gICAgICByZXR1cm4gdGhpcy50cmVlLm5vZGVzO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZmluZE5vZGVCeUlkSGVscGVyKGlkOiBudW1iZXIsIG5vZGU6IE5vZGVJbnRlcmZhY2UgPSB0aGlzLnRyZWUubm9kZXMpOiBOb2RlSW50ZXJmYWNlIHtcclxuICAgIGlmIChub2RlLmlkID09PSBpZClcclxuICAgICAgcmV0dXJuIG5vZGU7XHJcblxyXG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG5vZGUuY2hpbGRyZW4pO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAodHlwZW9mIG5vZGUuY2hpbGRyZW5ba2V5c1tpXV0gPT0gJ29iamVjdCcpIHtcclxuICAgICAgICBjb25zdCBvYmogPSB0aGlzLmZpbmROb2RlQnlJZEhlbHBlcihpZCwgbm9kZS5jaGlsZHJlbltrZXlzW2ldXSk7XHJcbiAgICAgICAgaWYgKG9iaiAhPSBudWxsKVxyXG4gICAgICAgICAgcmV0dXJuIG9iajtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGZvbGRSZWN1cnNpdmVseShub2RlOiBOb2RlSW50ZXJmYWNlKSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnZm9sZGluZyAnLCBub2RlKTtcclxuICAgIGNvbnN0IGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcclxuXHJcbiAgICBPYmplY3Qua2V5cyhjaGlsZHJlbikubWFwKChjaGlsZDogc3RyaW5nKSA9PiB7XHJcbiAgICAgIGlmICghY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoY2hpbGQpIHx8ICFjaGlsZHJlbltjaGlsZF0uaXNFeHBhbmRlZCkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmZvbGRSZWN1cnNpdmVseShjaGlsZHJlbltjaGlsZF0pO1xyXG4gICAgICAvL3RvZG8gcHV0IHRoaXMgZ2V0RWxCeUlkIGludG8gb25lIGZ1bmMgKGN1cnIgaW5zaWRlIG5vZGUuY29tcG9uZW50LnRzICsgZm0uY29tcG9uZW50LnRzKSAtIHRoaXMgd29uJ3QgYmUgbWFpbnRhaW5hYmxlXHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0cmVlXycgKyBjaGlsZHJlbltjaGlsZF0ucGF0aFRvTm9kZSkuY2xhc3NMaXN0LmFkZCgnZGVzZWxlY3RlZCcpO1xyXG4gICAgICBjaGlsZHJlbltjaGlsZF0uaXNFeHBhbmRlZCA9IGZhbHNlO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZm9sZEFsbCgpIHtcclxuICAgIHRoaXMuZm9sZFJlY3Vyc2l2ZWx5KHRoaXMudHJlZS5ub2Rlcyk7XHJcbiAgfVxyXG5cclxuICBnZXQgY3VycmVudFBhdGgoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9wYXRoO1xyXG4gIH1cclxuXHJcbiAgc2V0IGN1cnJlbnRQYXRoKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuX3BhdGggPSB2YWx1ZTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtOb2RlSW50ZXJmYWNlfSBmcm9tICcuLi9pbnRlcmZhY2VzL25vZGUuaW50ZXJmYWNlJztcclxuaW1wb3J0IHtOb2RlU2VydmljZX0gZnJvbSAnLi9ub2RlLnNlcnZpY2UnO1xyXG5pbXBvcnQge1RyZWVNb2RlbH0gZnJvbSAnLi4vbW9kZWxzL3RyZWUubW9kZWwnO1xyXG5pbXBvcnQge0h0dHBDbGllbnR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcclxuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHtOZ3hTbWFydE1vZGFsU2VydmljZX0gZnJvbSAnbmd4LXNtYXJ0LW1vZGFsJztcclxuaW1wb3J0IHtBcHBTdG9yZX0gZnJvbSAnLi4vcmVkdWNlcnMvcmVkdWNlci5mYWN0b3J5JztcclxuaW1wb3J0IHtTdG9yZX0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgTm9kZUNsaWNrZWRTZXJ2aWNlIHtcclxuICBwdWJsaWMgdHJlZTogVHJlZU1vZGVsO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHB1YmxpYyBuZ3hTbWFydE1vZGFsU2VydmljZTogTmd4U21hcnRNb2RhbFNlcnZpY2UsXHJcbiAgICBwcml2YXRlIG5vZGVTZXJ2aWNlOiBOb2RlU2VydmljZSxcclxuICAgIHByaXZhdGUgc3RvcmU6IFN0b3JlPEFwcFN0b3JlPixcclxuICAgIHByaXZhdGUgaHR0cDogSHR0cENsaWVudFxyXG4gICkge1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHN0YXJ0RG93bmxvYWQobm9kZTogTm9kZUludGVyZmFjZSk6IHZvaWQge1xyXG4gICAgY29uc3QgcGFyYW1ldGVycyA9IHRoaXMucGFyc2VQYXJhbXMoe3BhdGg6IG5vZGUuaWR9KTtcclxuICAgIHRoaXMucmVhY2hTZXJ2ZXIoJ2Rvd25sb2FkJywgdGhpcy50cmVlLmNvbmZpZy5hcGkuZG93bmxvYWRGaWxlICsgcGFyYW1ldGVycyk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgaW5pdERlbGV0ZShub2RlOiBOb2RlSW50ZXJmYWNlKTogdm9pZCB7XHJcbiAgICB0aGlzLnNpZGVFZmZlY3RIZWxwZXIoXHJcbiAgICAgICdEZWxldGUnLFxyXG4gICAgICB7cGF0aDogbm9kZS5pZH0sXHJcbiAgICAgICdkZWxldGUnLFxyXG4gICAgICB0aGlzLnRyZWUuY29uZmlnLmFwaS5kZWxldGVGaWxlLFxyXG4gICAgICAoKSA9PiB0aGlzLnN1Y2Nlc3NXaXRoTW9kYWxDbG9zZSgpXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHNlYXJjaEZvclN0cmluZyhpbnB1dDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICB0aGlzLnNpZGVFZmZlY3RIZWxwZXIoXHJcbiAgICAgICdTZWFyY2gnLFxyXG4gICAgICB7cXVlcnk6IGlucHV0fSxcclxuICAgICAgJ2dldCcsXHJcbiAgICAgIHRoaXMudHJlZS5jb25maWcuYXBpLnNlYXJjaEZpbGVzLFxyXG4gICAgICAocmVzKSA9PiB0aGlzLnNlYXJjaFN1Y2Nlc3MoaW5wdXQsIHJlcylcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY3JlYXRlRm9sZGVyKGN1cnJlbnRQYXJlbnQ6IG51bWJlciwgbmV3RGlyTmFtZTogc3RyaW5nKSB7XHJcbiAgICB0aGlzLnNpZGVFZmZlY3RIZWxwZXIoXHJcbiAgICAgICdDcmVhdGUgRm9sZGVyJyxcclxuICAgICAge2Rpck5hbWU6IG5ld0Rpck5hbWUsIHBhcmVudFBhdGg6IGN1cnJlbnRQYXJlbnQgPT09IDAgPyBudWxsIDogY3VycmVudFBhcmVudH0sXHJcbiAgICAgICdwb3N0JyxcclxuICAgICAgdGhpcy50cmVlLmNvbmZpZy5hcGkuY3JlYXRlRm9sZGVyXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlbmFtZShpZDogbnVtYmVyLCBuZXdOYW1lOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuc2lkZUVmZmVjdEhlbHBlcihcclxuICAgICAgJ1JlbmFtZScsXHJcbiAgICAgIHtwYXRoOiBpZCwgbmV3TmFtZTogbmV3TmFtZX0sXHJcbiAgICAgICdwb3N0JyxcclxuICAgICAgdGhpcy50cmVlLmNvbmZpZy5hcGkucmVuYW1lRmlsZSxcclxuICAgICAgKCkgPT4gdGhpcy5zdWNjZXNzV2l0aE1vZGFsQ2xvc2UoKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2lkZUVmZmVjdEhlbHBlcihuYW1lOiBzdHJpbmcsIHBhcmFtZXRlcnM6IHt9LCBodHRwTWV0aG9kOiBzdHJpbmcsIGFwaVVSTDogc3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzTWV0aG9kID0gKGEpID0+IHRoaXMuYWN0aW9uU3VjY2VzcyhhKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZmFpbE1ldGhvZCA9IChhLCBiKSA9PiB0aGlzLmFjdGlvbkZhaWxlZChhLCBiKVxyXG4gICkge1xyXG4gICAgY29uc3QgcGFyYW1zID0gdGhpcy5wYXJzZVBhcmFtcyhwYXJhbWV0ZXJzKTtcclxuXHJcbiAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCd3YWl0TW9kYWwnKS5vcGVuKCk7XHJcblxyXG4gICAgdGhpcy5yZWFjaFNlcnZlcihodHRwTWV0aG9kLCBhcGlVUkwgKyBwYXJhbXMpXHJcbiAgICAgIC5zdWJzY3JpYmUoXHJcbiAgICAgICAgKGEpID0+IHN1Y2Nlc3NNZXRob2QoYSksXHJcbiAgICAgICAgKGVycikgPT4gZmFpbE1ldGhvZChuYW1lLCBlcnIpXHJcbiAgICAgICk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlYWNoU2VydmVyKG1ldGhvZDogc3RyaW5nLCBhcGlVcmw6IHN0cmluZywgZGF0YTogYW55ID0ge30pOiBPYnNlcnZhYmxlPE9iamVjdD4ge1xyXG4gICAgc3dpdGNoIChtZXRob2QudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICBjYXNlICdnZXQnOlxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0KHRoaXMudHJlZS5jb25maWcuYmFzZVVSTCArIGFwaVVybCk7XHJcbiAgICAgIGNhc2UgJ3Bvc3QnOlxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdCh0aGlzLnRyZWUuY29uZmlnLmJhc2VVUkwgKyBhcGlVcmwsIGRhdGEpO1xyXG4gICAgICBjYXNlICdkZWxldGUnOlxyXG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZGVsZXRlKHRoaXMudHJlZS5jb25maWcuYmFzZVVSTCArIGFwaVVybCk7XHJcbiAgICAgIGNhc2UgJ2Rvd25sb2FkJzpcclxuICAgICAgICB3aW5kb3cub3Blbih0aGlzLnRyZWUuY29uZmlnLmJhc2VVUkwgKyBhcGlVcmwsICdfYmxhbmsnKTtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBjb25zb2xlLndhcm4oJ1tOb2RlQ2xpY2tlZFNlcnZpY2VdIEluY29ycmVjdCBwYXJhbXMgZm9yIHRoaXMgc2lkZS1lZmZlY3QnKTtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgcGFyc2VQYXJhbXMocGFyYW1zOiB7fSk6IHN0cmluZyB7XHJcbiAgICBsZXQgcXVlcnkgPSAnPyc7XHJcblxyXG4gICAgT2JqZWN0LmtleXMocGFyYW1zKS5maWx0ZXIoaXRlbSA9PiBwYXJhbXNbaXRlbV0gIT09IG51bGwpLm1hcChrZXkgPT4ge1xyXG4gICAgICBxdWVyeSArPSBrZXkgKyAnPScgKyBwYXJhbXNba2V5XSArICcmJztcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBxdWVyeS5zbGljZSgwLCAtMSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHN1Y2Nlc3NXaXRoTW9kYWxDbG9zZSgpIHtcclxuICAgIHRoaXMuYWN0aW9uU3VjY2VzcygpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpZGUtdmlldycpLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNlYXJjaFN1Y2Nlc3MoaW5wdXQ6IHN0cmluZywgZGF0YTogYW55KSB7XHJcbiAgICBjb25zdCBvYmogPSB7XHJcbiAgICAgIHNlYXJjaFN0cmluZzogaW5wdXQsXHJcbiAgICAgIHJlc3BvbnNlOiBkYXRhXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuYWN0aW9uU3VjY2VzcygpO1xyXG5cclxuICAgIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2Uuc2V0TW9kYWxEYXRhKG9iaiwgJ3NlYXJjaE1vZGFsJywgdHJ1ZSk7XHJcbiAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCdzZWFyY2hNb2RhbCcpLm9wZW4oKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWN0aW9uU3VjY2VzcyhyZXNwb25zZTogc3RyaW5nID0gJycpIHtcclxuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnZGlhbG9nLW9wZW4nKTtcclxuXHJcbiAgICB0aGlzLm5vZGVTZXJ2aWNlLnJlZnJlc2hDdXJyZW50UGF0aCgpO1xyXG4gICAgdGhpcy5uZ3hTbWFydE1vZGFsU2VydmljZS5nZXRNb2RhbCgnd2FpdE1vZGFsJykuY2xvc2UoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWN0aW9uRmFpbGVkKG5hbWU6IHN0cmluZywgZXJyb3I6IGFueSkge1xyXG4gICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdkaWFsb2ctb3BlbicpO1xyXG5cclxuICAgIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ3dhaXRNb2RhbCcpLmNsb3NlKCk7XHJcbiAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCdlcnJvck1vZGFsJykub3BlbigpO1xyXG4gICAgY29uc29sZS53YXJuKCdbTm9kZUNsaWNrZWRTZXJ2aWNlXSBBY3Rpb24gXCInICsgbmFtZSArICdcIiBmYWlsZWQnLCBlcnJvcik7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCwgVGVtcGxhdGVSZWYsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtzZWxlY3QsIFN0b3JlfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcbmltcG9ydCB7VHJlZU1vZGVsfSBmcm9tICcuL21vZGVscy90cmVlLm1vZGVsJztcclxuaW1wb3J0IHtOb2RlU2VydmljZX0gZnJvbSAnLi9zZXJ2aWNlcy9ub2RlLnNlcnZpY2UnO1xyXG5pbXBvcnQge05vZGVJbnRlcmZhY2V9IGZyb20gJy4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XHJcbmltcG9ydCB7U0VUX0xPQURJTkdfU1RBVEV9IGZyb20gJy4vcmVkdWNlcnMvYWN0aW9ucy5hY3Rpb24nO1xyXG5pbXBvcnQgKiBhcyBBQ1RJT05TIGZyb20gJy4vcmVkdWNlcnMvYWN0aW9ucy5hY3Rpb24nO1xyXG5pbXBvcnQge0FwcFN0b3JlfSBmcm9tICcuL3JlZHVjZXJzL3JlZHVjZXIuZmFjdG9yeSc7XHJcbmltcG9ydCB7Tmd4U21hcnRNb2RhbFNlcnZpY2V9IGZyb20gJ25neC1zbWFydC1tb2RhbCc7XHJcbmltcG9ydCB7Tm9kZUNsaWNrZWRTZXJ2aWNlfSBmcm9tICcuL3NlcnZpY2VzL25vZGUtY2xpY2tlZC5zZXJ2aWNlJztcclxuaW1wb3J0IHtUcmFuc2xhdGVTZXJ2aWNlfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9jb3JlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnZm0tZmlsZS1tYW5hZ2VyJyxcclxuICB0ZW1wbGF0ZTogYDxuZy1jb250YWluZXIgKm5nSWY9XCJpc1BvcHVwOyB0aGVuIGl0SXNQb3B1cCBlbHNlIHNob3dDb250ZW50XCI+PC9uZy1jb250YWluZXI+XHJcblxyXG48bmctdGVtcGxhdGUgI2l0SXNQb3B1cD5cclxuICA8ZGl2ICpuZ0lmPVwiIWZtT3BlblwiPlxyXG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ1dHRvbiBiaWdcIiAoY2xpY2spPVwiZm1TaG93SGlkZSgpXCIgdHJhbnNsYXRlPVwiXCI+T3BlbiBmaWxlIG1hbmFnZXI8L2J1dHRvbj5cclxuICA8L2Rpdj5cclxuICA8ZGl2IGNsYXNzPVwiZmlsZS1tYW5hZ2VyLWJhY2tkcm9wXCIgKm5nSWY9XCJmbU9wZW5cIj5cclxuICAgIDxkaXYgY2xhc3M9XCJmbU1vZGFsSW5zaWRlXCI+XHJcbiAgICAgIDxkaXYgKm5nSWY9XCJmbU9wZW47IHRoZW4gc2hvd0NvbnRlbnRcIj48L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG48L25nLXRlbXBsYXRlPlxyXG5cclxuPG5nLXRlbXBsYXRlICNzaG93Q29udGVudD5cclxuICA8ZGl2IGNsYXNzPVwiY29udGVudFwiPlxyXG4gICAgPGRpdiBjbGFzcz1cImZpbGUtbWFuYWdlci1uYXZiYXJcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cInBhdGhcIj5cclxuICAgICAgICA8YXBwLW5hdi1iYXI+PC9hcHAtbmF2LWJhcj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzPVwibmF2aWdhdGlvblwiPlxyXG4gICAgICAgIDxhcHAtbmF2aWdhdGlvbj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJidXR0b24gY2xvc2VcIiAoY2xpY2spPVwiZm1TaG93SGlkZSgpXCIgKm5nSWY9XCJpc1BvcHVwXCI+XHJcbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLTJ4IGZhLXRpbWVzXCI+PC9pPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9hcHAtbmF2aWdhdGlvbj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuXHJcbiAgICA8ZGl2IGNsYXNzPVwiaG9sZGVyXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJmaWxlLW1hbmFnZXItbGVmdFwiPlxyXG4gICAgICAgIDxhcHAtdHJlZSBbdHJlZU1vZGVsXT1cInRyZWVcIj5cclxuICAgICAgICAgIDxuZy10ZW1wbGF0ZSBsZXQtbm9kZXM+XHJcbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IG5vZGVzfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiaWNvblRlbXBsYXRlID8gaWNvblRlbXBsYXRlIDogZGVmYXVsdEljb25UZW1wbGF0ZVwiPlxyXG4gICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cclxuICAgICAgICAgIDwvbmctdGVtcGxhdGU+XHJcbiAgICAgICAgPC9hcHAtdHJlZT5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzPVwicmlnaHRcIj5cclxuICAgICAgICA8YXBwLWZvbGRlci1jb250ZW50XHJcbiAgICAgICAgICBbdHJlZU1vZGVsXT1cInRyZWVcIlxyXG4gICAgICAgICAgKG9wZW5VcGxvYWREaWFsb2cpPVwiaGFuZGxlVXBsb2FkRGlhbG9nKCRldmVudClcIlxyXG4gICAgICAgICAgW2ZvbGRlckNvbnRlbnRUZW1wbGF0ZV09XCJmb2xkZXJDb250ZW50VGVtcGxhdGUgPyBmb2xkZXJDb250ZW50VGVtcGxhdGUgOiBkZWZhdWx0Rm9sZGVyQ29udGVudFRlbXBsYXRlXCJcclxuICAgICAgICAgIFtmb2xkZXJDb250ZW50TmV3VGVtcGxhdGVdPVwiZm9sZGVyQ29udGVudE5ld1RlbXBsYXRlID8gZm9sZGVyQ29udGVudE5ld1RlbXBsYXRlIDogZGVmYXVsdEZvbGRlckNvbnRlbnROZXdUZW1wbGF0ZVwiXHJcbiAgICAgICAgICBbZm9sZGVyQ29udGVudEJhY2tUZW1wbGF0ZV09XCJmb2xkZXJDb250ZW50QmFja1RlbXBsYXRlID8gZm9sZGVyQ29udGVudEJhY2tUZW1wbGF0ZSA6IGRlZmF1bHRGb2xkZXJDb250ZW50QmFja1RlbXBsYXRlXCI+XHJcbiAgICAgICAgPC9hcHAtZm9sZGVyLWNvbnRlbnQ+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGFwcC1zaWRlLXZpZXcgaWQ9XCJzaWRlLXZpZXdcIlxyXG4gICAgICAgICAgICAgICAgICAgICBbbm9kZV09XCJzZWxlY3RlZE5vZGVcIlxyXG4gICAgICAgICAgICAgICAgICAgICBbc2lkZVZpZXdUZW1wbGF0ZV09XCJzaWRlVmlld1RlbXBsYXRlID8gc2lkZVZpZXdUZW1wbGF0ZSA6IGRlZmF1bHRTaWRlVmlld1RlbXBsYXRlXCJcclxuICAgICAgICAgICAgICAgICAgICAgW2FsbG93Rm9sZGVyRG93bmxvYWRdPVwidHJlZS5jb25maWcub3B0aW9ucy5hbGxvd0ZvbGRlckRvd25sb2FkXCJcclxuICAgICAgICAgICAgICAgICAgICAgKGNsaWNrRXZlbnQpPVwiaGFuZGxlRmlsZU1hbmFnZXJDbGlja0V2ZW50KCRldmVudClcIj5cclxuICAgICAgPC9hcHAtc2lkZS12aWV3PlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcblxyXG4gIDxhcHAtdXBsb2FkICpuZ0lmPVwibmV3RGlhbG9nXCJcclxuICAgICAgICAgICAgICBbb3BlbkRpYWxvZ109XCJuZXdEaWFsb2dcIlxyXG4gICAgICAgICAgICAgIChjbG9zZURpYWxvZyk9XCJoYW5kbGVVcGxvYWREaWFsb2coZmFsc2UpXCJcclxuICAgICAgICAgICAgICAoY3JlYXRlRGlyKT1cImhhbmRsZUZpbGVNYW5hZ2VyQ2xpY2tFdmVudCh7dHlwZTogJ2NyZWF0ZUZvbGRlcicsIHBheWxvYWQ6ICRldmVudH0pXCI+XHJcbiAgPC9hcHAtdXBsb2FkPlxyXG5cclxuICA8YXBwLWxvYWRpbmctb3ZlcmxheVxyXG4gICAgKm5nSWY9XCJsb2FkaW5nXCJcclxuICAgIFtsb2FkaW5nT3ZlcmxheVRlbXBsYXRlXT1cImxvYWRpbmdPdmVybGF5VGVtcGxhdGUgPyBsb2FkaW5nT3ZlcmxheVRlbXBsYXRlIDogZGVmYXVsdExvYWRpbmdPdmVybGF5VGVtcGxhdGVcIj5cclxuICA8L2FwcC1sb2FkaW5nLW92ZXJsYXk+XHJcbjwvbmctdGVtcGxhdGU+XHJcblxyXG48bmctdGVtcGxhdGUgbGV0LW5vZGUgI2RlZmF1bHRJY29uVGVtcGxhdGU+XHJcbiAgPGRpdiBjbGFzcz1cImZpbGUtbWFuYWdlci1ub2RlXCIgc3R5bGU9XCJkaXNwbGF5OiBpbmxpbmUtYmxvY2s7IHBhZGRpbmc6IDNweFwiPlxyXG4gICAgPGRpdiAqbmdJZj1cIm5vZGUuaXNGb2xkZXI7IHRoZW4gaXRJc0ZvbGRlciBlbHNlIHNob3dGaWxlXCI+PC9kaXY+XHJcblxyXG4gICAgPG5nLXRlbXBsYXRlICNpdElzRm9sZGVyPlxyXG4gICAgICA8ZGl2ICpuZ0lmPVwibm9kZS5pc0V4cGFuZGVkOyB0aGVuIGlzRm9sZGVyRXhwYW5kZWQgZWxzZSBpc0ZvbGRlckNsb3NlZFwiPjwvZGl2PlxyXG4gICAgPC9uZy10ZW1wbGF0ZT5cclxuXHJcbiAgICA8bmctdGVtcGxhdGUgI3Nob3dGaWxlPjxpIGNsYXNzPVwiZmFzIGZhLWZpbGUgY2hpbGRcIj48L2k+PC9uZy10ZW1wbGF0ZT5cclxuICAgIDxuZy10ZW1wbGF0ZSAjaXNGb2xkZXJFeHBhbmRlZD48aSBjbGFzcz1cImZhcyBmYS1mb2xkZXItb3BlbiBjaGlsZFwiPjwvaT48L25nLXRlbXBsYXRlPlxyXG4gICAgPG5nLXRlbXBsYXRlICNpc0ZvbGRlckNsb3NlZD48aSBjbGFzcz1cImZhcyBmYS1mb2xkZXIgY2hpbGRcIj48L2k+PC9uZy10ZW1wbGF0ZT5cclxuXHJcbiAgICA8c3Bhbj57e25vZGUubmFtZX19PC9zcGFuPlxyXG4gIDwvZGl2PlxyXG48L25nLXRlbXBsYXRlPlxyXG48bmctdGVtcGxhdGUgbGV0LW5vZGUgI2RlZmF1bHRGb2xkZXJDb250ZW50VGVtcGxhdGU+XHJcbiAgPGRpdiBjbGFzcz1cImZpbGUtbWFuYWdlci1pdGVtXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZmlsZS1wcmV2aWV3XCI+XHJcbiAgICAgIDxkaXYgKm5nSWY9XCJub2RlLmlzRm9sZGVyOyB0aGVuIGl0SXNGb2xkZXIgZWxzZSBzaG93RmlsZVwiPjwvZGl2PlxyXG4gICAgICA8bmctdGVtcGxhdGUgI2l0SXNGb2xkZXI+PGkgY2xhc3M9XCJmYXMgZmEtM3ggZmEtZm9sZGVyIGNoaWxkXCI+PC9pPjwvbmctdGVtcGxhdGU+XHJcbiAgICAgIDxuZy10ZW1wbGF0ZSAjc2hvd0ZpbGU+PGkgY2xhc3M9XCJmYXMgZmEtM3ggZmEtZmlsZSBjaGlsZFwiPjwvaT48L25nLXRlbXBsYXRlPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZmlsZS1uYW1lXCI+XHJcbiAgICAgIHt7bm9kZS5uYW1lfX1cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG48L25nLXRlbXBsYXRlPlxyXG48bmctdGVtcGxhdGUgI2RlZmF1bHRGb2xkZXJDb250ZW50TmV3VGVtcGxhdGU+XHJcbiAgPGRpdiBjbGFzcz1cImZpbGUtbWFuYWdlci1pdGVtXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZmlsZS1wcmV2aWV3XCIgc3R5bGU9XCJ3aWR0aDogMTAwJTsgaGVpZ2h0OjEwMCVcIj5cclxuICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtM3ggZmEtcGx1cyBjaGlsZFwiIHN0eWxlPVwibGluZS1oZWlnaHQ6IDJcIj48L2k+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuPC9uZy10ZW1wbGF0ZT5cclxuPG5nLXRlbXBsYXRlIGxldC1ub2RlICNkZWZhdWx0Rm9sZGVyQ29udGVudEJhY2tUZW1wbGF0ZT5cclxuICA8ZGl2IGNsYXNzPVwiZmlsZS1tYW5hZ2VyLWl0ZW1cIj5cclxuICAgIDxkaXYgY2xhc3M9XCJmaWxlLXByZXZpZXdcIiBzdHlsZT1cIndpZHRoOiAxMDAlOyBoZWlnaHQ6MTAwJVwiPlxyXG4gICAgICA8aSBjbGFzcz1cImZhcyBmYS0yeCBmYS1lbGxpcHNpcy1oXCIgc3R5bGU9XCJsaW5lLWhlaWdodDogNVwiPjwvaT5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG48L25nLXRlbXBsYXRlPlxyXG48bmctdGVtcGxhdGUgbGV0LXRpbWVvdXRNZXNzYWdlICNkZWZhdWx0TG9hZGluZ092ZXJsYXlUZW1wbGF0ZT5cclxuICA8ZGl2IGNsYXNzPVwiZmlsZS1tYW5hZ2VyLWJhY2tkcm9wIGxvYWRpbmdcIiAoY2xpY2spPVwiYmFja2Ryb3BDbGlja2VkKClcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJmaWxlLW1hbmFnZXItZXJyb3JcIiAqbmdJZj1cInRpbWVvdXRNZXNzYWdlXCI+e3t0aW1lb3V0TWVzc2FnZSB8IHRyYW5zbGF0ZX19PC9kaXY+XHJcbiAgPC9kaXY+XHJcbiAgPGRpdiBjbGFzcz1cInNwaW5uZXJcIj5cclxuICAgIDxpIGNsYXNzPVwiZmFzIGZhLTV4IGZhLXNwaW4gZmEtc3luYy1hbHRcIj48L2k+XHJcbiAgPC9kaXY+XHJcbjwvbmctdGVtcGxhdGU+XHJcbjxuZy10ZW1wbGF0ZSBsZXQtbm9kZSAjZGVmYXVsdFNpZGVWaWV3VGVtcGxhdGU+XHJcbiAgPGRpdiBzdHlsZT1cInBvc2l0aW9uOiBhYnNvbHV0ZTsgYm90dG9tOiAwOyB3aWR0aDogMTAwJTsgbWFyZ2luOiA1cHggYXV0b1wiPlxyXG4gICAgPHNwYW4gKm5nSWY9XCJub2RlLmlzRm9sZGVyXCIgdHJhbnNsYXRlPk5vIGRhdGEgYXZhaWxhYmxlIGZvciB0aGlzIGZvbGRlcjwvc3Bhbj5cclxuICAgIDxzcGFuICpuZ0lmPVwiIW5vZGUuaXNGb2xkZXJcIiB0cmFuc2xhdGU+Tm8gZGF0YSBhdmFpbGFibGUgZm9yIHRoaXMgZmlsZTwvc3Bhbj5cclxuICA8L2Rpdj5cclxuPC9uZy10ZW1wbGF0ZT5cclxuXHJcbjxuZ3gtc21hcnQtbW9kYWwgaWRlbnRpZmllcj1cInJlbmFtZU1vZGFsXCIgW2Rpc21pc3NhYmxlXT1cImZhbHNlXCIgW2Nsb3NhYmxlXT1cImZhbHNlXCIgKm5nSWY9XCJzZWxlY3RlZE5vZGVcIiAjcmVuYW1lTW9kYWw+XHJcbiAgPGgyIGNsYXNzPVwibW9kYWwtdGl0bGVcIiB0cmFuc2xhdGU+XHJcbiAgICBSZW5hbWUgZmlsZVxyXG4gIDwvaDI+XHJcbiAgPHAgY2xhc3M9XCJyZW5hbWUtbmFtZVwiIHRyYW5zbGF0ZT5cclxuICAgIE9sZCBuYW1lXHJcbiAgPC9wPlxyXG4gIDxzcGFuIHN0eWxlPVwibWFyZ2luOiA4cHhcIj57e3NlbGVjdGVkTm9kZS5uYW1lfX08L3NwYW4+XHJcbiAgPHAgY2xhc3M9XCJyZW5hbWUtbmFtZVwiIHRyYW5zbGF0ZT5cclxuICAgIE5ldyBuYW1lXHJcbiAgPC9wPlxyXG4gIDxpbnB1dCBwbGFjZWhvbGRlcj1cIk5ldyBuYW1lXCIgdHlwZT1cInRleHRcIiBjbGFzcz1cInJlbmFtZS1pbnB1dFwiIFt2YWx1ZV09XCJzZWxlY3RlZE5vZGUubmFtZVwiICNyZW5hbWVJbnB1dFxyXG4gICAgICAgICAoa2V5dXAuZW50ZXIpPVwiaGFuZGxlRmlsZU1hbmFnZXJDbGlja0V2ZW50KHt0eXBlOiAncmVuYW1lJywgdmFsdWU6IHJlbmFtZUlucHV0LnZhbHVlfSlcIlxyXG4gICAgICAgICBvbmNsaWNrPVwidGhpcy5zZWxlY3QoKTtcIj5cclxuICA8YnI+XHJcblxyXG4gIDxkaXYgY2xhc3M9XCJyZW5hbWUtYnV0dG9uXCI+XHJcbiAgICA8YnV0dG9uIGNsYXNzPVwiYnV0dG9uIGJpZ1wiIHRyYW5zbGF0ZVxyXG4gICAgICAgICAgICAoY2xpY2spPVwiaGFuZGxlRmlsZU1hbmFnZXJDbGlja0V2ZW50KHt0eXBlOiAncmVuYW1lJywgdmFsdWU6IHJlbmFtZUlucHV0LnZhbHVlfSlcIlxyXG4gICAgICAgICAgICBbZGlzYWJsZWRdPVwicmVuYW1lSW5wdXQudmFsdWUgPT09IHNlbGVjdGVkTm9kZS5uYW1lIHx8IHJlbmFtZUlucHV0LnZhbHVlLmxlbmd0aCA9PT0gMFwiPlxyXG4gICAgICBSZW5hbWVcclxuICAgIDwvYnV0dG9uPlxyXG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ1dHRvbiBiaWdcIiAoY2xpY2spPVwicmVuYW1lTW9kYWwuY2xvc2UoKVwiIHRyYW5zbGF0ZT5cclxuICAgICAgQ2FuY2VsXHJcbiAgICA8L2J1dHRvbj5cclxuICA8L2Rpdj5cclxuXHJcbjwvbmd4LXNtYXJ0LW1vZGFsPlxyXG48bmd4LXNtYXJ0LW1vZGFsICpuZ0lmPVwic2VsZWN0ZWROb2RlXCIgaWRlbnRpZmllcj1cImNvbmZpcm1EZWxldGVNb2RhbFwiICNkZWxldGVNb2RhbFxyXG4gICAgICAgICAgICAgICAgIFtkaXNtaXNzYWJsZV09XCJmYWxzZVwiIFtjbG9zYWJsZV09XCJmYWxzZVwiPlxyXG4gIDxoMiBjbGFzcz1cIm1vZGFsLXRpdGxlXCI+XHJcbiAgICA8c3BhbiB0cmFuc2xhdGU+WW91IGFyZSB0cnlpbmcgdG8gZGVsZXRlIGZvbGxvd2luZyA8L3NwYW4+XHJcbiAgICA8c3BhbiAqbmdJZj1cInNlbGVjdGVkTm9kZS5pc0ZvbGRlclwiIHRyYW5zbGF0ZT5mb2xkZXI8L3NwYW4+XHJcbiAgICA8c3BhbiAqbmdJZj1cIiFzZWxlY3RlZE5vZGUuaXNGb2xkZXJcIiB0cmFuc2xhdGU+ZmlsZTwvc3Bhbj5cclxuICA8L2gyPlxyXG5cclxuICA8ZGl2IHN0eWxlPVwid2lkdGg6IDEwMCU7IG1hcmdpbjogNXB4IGF1dG87IHRleHQtYWxpZ246IGNlbnRlclwiPnt7c2VsZWN0ZWROb2RlLm5hbWV9fTwvZGl2PlxyXG5cclxuICA8ZGl2IGNsYXNzPVwicmVuYW1lLWJ1dHRvblwiPlxyXG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ1dHRvbiBiaWdcIiAoY2xpY2spPVwiaGFuZGxlRmlsZU1hbmFnZXJDbGlja0V2ZW50KHt0eXBlOiAncmVtb3ZlJ30pXCI+XHJcbiAgICAgIDxzcGFuIHRyYW5zbGF0ZT5ZZXMsIGRlbGV0ZSB0aGlzIDwvc3Bhbj5cclxuICAgICAgPHNwYW4gKm5nSWY9XCJzZWxlY3RlZE5vZGUuaXNGb2xkZXJcIiB0cmFuc2xhdGU+Zm9sZGVyPC9zcGFuPlxyXG4gICAgICA8c3BhbiAqbmdJZj1cIiFzZWxlY3RlZE5vZGUuaXNGb2xkZXJcIiB0cmFuc2xhdGU+ZmlsZTwvc3Bhbj5cclxuICAgIDwvYnV0dG9uPlxyXG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ1dHRvbiBiaWdcIiAoY2xpY2spPVwiZGVsZXRlTW9kYWwuY2xvc2UoKVwiIHRyYW5zbGF0ZT5cclxuICAgICAgQ2FuY2VsXHJcbiAgICA8L2J1dHRvbj5cclxuICA8L2Rpdj5cclxuPC9uZ3gtc21hcnQtbW9kYWw+XHJcbjxuZ3gtc21hcnQtbW9kYWwgaWRlbnRpZmllcj1cInNlYXJjaE1vZGFsXCIgI3NlYXJjaE1vZGFsIFtjbG9zYWJsZV09XCJ0cnVlXCI+XHJcbiAgPGgyIGNsYXNzPVwibW9kYWwtdGl0bGVcIiBzdHlsZT1cIm1hcmdpbi1ib3R0b206IDJweFwiIHRyYW5zbGF0ZVxyXG4gICAgICAqbmdJZj1cInNlYXJjaE1vZGFsLmhhc0RhdGEoKSAmJiBzZWFyY2hNb2RhbC5nZXREYXRhKCkucmVzcG9uc2UubGVuZ3RoICE9PSAwXCI+XHJcbiAgICBTZWFyY2ggcmVzdWx0cyBmb3JcclxuICA8L2gyPlxyXG4gIDxoMiBjbGFzcz1cIm1vZGFsLXRpdGxlXCIgc3R5bGU9XCJtYXJnaW4tYm90dG9tOiAycHhcIiB0cmFuc2xhdGVcclxuICAgICAgKm5nSWY9XCIhc2VhcmNoTW9kYWwuaGFzRGF0YSgpIHx8IHNlYXJjaE1vZGFsLmdldERhdGEoKS5yZXNwb25zZS5sZW5ndGggPT09IDBcIj5cclxuICAgIE5vIHJlc3VsdHMgZm91bmQgZm9yXHJcbiAgPC9oMj5cclxuICA8ZGl2IHN0eWxlPVwidGV4dC1hbGlnbjogY2VudGVyXCIgKm5nSWY9XCJzZWFyY2hNb2RhbC5oYXNEYXRhKClcIj57e3NlYXJjaE1vZGFsLmdldERhdGEoKS5zZWFyY2hTdHJpbmd9fTwvZGl2PlxyXG5cclxuICA8ZGl2ICpuZ0lmPVwic2VhcmNoTW9kYWwuaGFzRGF0YSgpICYmIHNlYXJjaE1vZGFsLmdldERhdGEoKS5yZXNwb25zZS5sZW5ndGggIT09IDBcIj5cclxuICAgIDx0YWJsZSBzdHlsZT1cIm1hcmdpbjogMCBhdXRvXCI+XHJcbiAgICAgIDx0cj5cclxuICAgICAgICA8dGQgY2xhc3M9XCJ0YWJsZS1pdGVtIHRhYmxlLWhlYWRcIiB0cmFuc2xhdGU+RmlsZSBuYW1lPC90ZD5cclxuICAgICAgICA8dGQgY2xhc3M9XCJ0YWJsZS1pdGVtLXNob3J0IHRhYmxlLWhlYWRcIiB0cmFuc2xhdGU+U2l6ZTwvdGQ+XHJcbiAgICAgIDwvdHI+XHJcbiAgICAgIDx0ciAqbmdGb3I9XCJsZXQgaXRlbSBvZiBzZWFyY2hNb2RhbC5nZXREYXRhKCkucmVzcG9uc2VcIiAoY2xpY2spPVwic2VhcmNoQ2xpY2tlZChpdGVtKVwiPlxyXG4gICAgICAgIDx0ZCBzdHlsZT1cImN1cnNvcjogcG9pbnRlclwiPlxyXG4gICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIml0ZW0uZmlsZUNhdGVnb3J5ID09PSAnRCc7IGVsc2UgZmlsZVwiPlxyXG4gICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS1mb2xkZXIgc2VhcmNoLW91dHB1dC1pY29uXCI+PC9pPlxyXG4gICAgICAgICAgPC9uZy1jb250YWluZXI+XHJcbiAgICAgICAgICA8bmctdGVtcGxhdGUgI2ZpbGU+XHJcbiAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLWZpbGUgc2VhcmNoLW91dHB1dC1pY29uXCI+PC9pPlxyXG4gICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cclxuICAgICAgICAgIDxzcGFuIHN0eWxlPVwidGV4dC1vdmVyZmxvdzogZWxsaXBzaXNcIj57e2l0ZW0ubmFtZX19PC9zcGFuPlxyXG4gICAgICAgIDwvdGQ+XHJcbiAgICAgICAgPHRkIGNsYXNzPVwidGFibGUtaXRlbS1zaG9ydFwiPnt7aXRlbS5zaXplfX08L3RkPlxyXG4gICAgICA8L3RyPlxyXG4gICAgPC90YWJsZT5cclxuICA8L2Rpdj5cclxuPC9uZ3gtc21hcnQtbW9kYWw+XHJcbjxuZ3gtc21hcnQtbW9kYWwgaWRlbnRpZmllcj1cIndhaXRNb2RhbFwiIFtjbG9zYWJsZV09XCJmYWxzZVwiIFtkaXNtaXNzYWJsZV09XCJmYWxzZVwiIFtlc2NhcGFibGVdPVwiZmFsc2VcIj5cclxuICA8aDIgY2xhc3M9XCJtb2RhbC10aXRsZVwiIHN0eWxlPVwibWFyZ2luLXRvcDogMjBweFwiPlxyXG4gICAge3snUHJvY2Vzc2luZyByZXF1ZXN0JyB8IHRyYW5zbGF0ZX19Li4uXHJcbiAgPC9oMj5cclxuXHJcbiAgPGRpdiBzdHlsZT1cInRleHQtYWxpZ246IGNlbnRlcjsgaGVpZ2h0OiA3MHB4XCI+XHJcbiAgICA8aSBjbGFzcz1cImZhcyBmYS1zcGlubmVyIGZhLXNwaW4gZmEtNHhcIj48L2k+XHJcbiAgPC9kaXY+XHJcbjwvbmd4LXNtYXJ0LW1vZGFsPlxyXG48bmd4LXNtYXJ0LW1vZGFsIGlkZW50aWZpZXI9XCJlcnJvck1vZGFsXCIgW2Nsb3NhYmxlXT1cInRydWVcIj5cclxuICA8aDIgY2xhc3M9XCJtb2RhbC10aXRsZVwiIHN0eWxlPVwibWFyZ2luLXRvcDogMjBweFwiPlxyXG4gICAge3snU29tZXRoaW5nIHdlbnQgd3Jvbmcgd2l0aCB5b3VyIHJlcXVlc3QnIHwgdHJhbnNsYXRlfX0uLi5cclxuICA8L2gyPlxyXG48L25neC1zbWFydC1tb2RhbD5cclxuYCxcclxuICBzdHlsZXM6IFtgLmNvbnRlbnR7aGVpZ2h0OjEwMCU7bWluLXdpZHRoOjg1MHB4fS5ob2xkZXJ7ZGlzcGxheTotd2Via2l0LWZsZXg7ZGlzcGxheTpmbGV4O2hlaWdodDpjYWxjKDEwMCUgLSA3NXB4KX0ucGF0aHttYXJnaW46YXV0byAwO2Rpc3BsYXk6YmxvY2t9Lm5hdmlnYXRpb257bWFyZ2luOmF1dG8gMDtkaXNwbGF5Oi13ZWJraXQtZmxleDtkaXNwbGF5OmZsZXh9Lm5hdmlnYXRpb24gLmJ1dHRvbnttYXJnaW46MCAxMHB4O3BhZGRpbmc6MDtwb3NpdGlvbjpyZWxhdGl2ZX0ucmlnaHR7d2lkdGg6MTAwJTtwb3NpdGlvbjpyZWxhdGl2ZTtvdmVyZmxvdzphdXRvfS5maWxlLW5hbWV7d2lkdGg6MTAwcHg7aGVpZ2h0OjI1cHg7b3ZlcmZsb3c6aGlkZGVuO3doaXRlLXNwYWNlOm5vd3JhcDt0ZXh0LW92ZXJmbG93OmVsbGlwc2lzO2JveC1zaXppbmc6Ym9yZGVyLWJveDstd2Via2l0LXVzZXItc2VsZWN0Om5vbmU7LW1vei11c2VyLXNlbGVjdDpub25lOy1tcy11c2VyLXNlbGVjdDpub25lO3VzZXItc2VsZWN0Om5vbmV9LmZpbGUtcHJldmlld3ttYXJnaW46YXV0b30uZmlsZS1wcmV2aWV3IGl7bGluZS1oZWlnaHQ6MS41fS5zcGlubmVye3Bvc2l0aW9uOmFic29sdXRlO3RvcDo1MCU7bGVmdDo1MCU7LXdlYmtpdC10cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUsLTUwJSk7dHJhbnNmb3JtOnRyYW5zbGF0ZSgtNTAlLC01MCUpO2N1cnNvcjpwcm9ncmVzc30ucmVuYW1lLWJ1dHRvbnttYXJnaW46MjBweCBhdXRvO2Rpc3BsYXk6YmxvY2s7dGV4dC1hbGlnbjpjZW50ZXJ9Lm1vZGFsLXRpdGxle21hcmdpbi10b3A6NXB4O3RleHQtYWxpZ246Y2VudGVyfS5zZWFyY2gtb3V0cHV0e21hcmdpbjoxNXB4IDB9LnNlYXJjaC1vdXRwdXQtaWNvbnttYXJnaW46MnB4IDVweH0udGFibGUtaXRlbXt3aWR0aDo4MCV9LnRhYmxlLWl0ZW0tc2hvcnR7d2lkdGg6MjAlO3RleHQtYWxpZ246cmlnaHR9YF0sXHJcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRmlsZU1hbmFnZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIEBJbnB1dCgpIGljb25UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICBASW5wdXQoKSBmb2xkZXJDb250ZW50VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgQElucHV0KCkgZm9sZGVyQ29udGVudEJhY2tUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICBASW5wdXQoKSBmb2xkZXJDb250ZW50TmV3VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgQElucHV0KCkgbG9hZGluZ092ZXJsYXlUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICBASW5wdXQoKSBzaWRlVmlld1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICBASW5wdXQoKSB0cmVlOiBUcmVlTW9kZWw7XHJcbiAgQElucHV0KCkgaXNQb3B1cDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIEBPdXRwdXQoKSBpdGVtQ2xpY2tlZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgcHJpdmF0ZSBfbGFuZ3VhZ2U6IHN0cmluZyA9ICdlbic7XHJcbiAgQElucHV0KCkgc2V0IGxhbmd1YWdlKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuX2xhbmd1YWdlID0gdmFsdWU7XHJcbiAgICB0aGlzLnRyYW5zbGF0ZS51c2UodGhpcy5sYW5ndWFnZSk7XHJcbiAgfVxyXG5cclxuICBnZXQgbGFuZ3VhZ2UoKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLl9sYW5ndWFnZTtcclxuICB9XHJcblxyXG4gIHNlbGVjdGVkTm9kZTogTm9kZUludGVyZmFjZTtcclxuICBzaWRlTWVudUNsb3NlZCA9IHRydWU7XHJcblxyXG4gIGZtT3BlbiA9IGZhbHNlO1xyXG4gIGxvYWRpbmc6IGJvb2xlYW47XHJcbiAgbmV3RGlhbG9nID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU8QXBwU3RvcmU+LFxyXG4gICAgcHJpdmF0ZSBub2RlU2VydmljZTogTm9kZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIG5vZGVDbGlja2VkU2VydmljZTogTm9kZUNsaWNrZWRTZXJ2aWNlLFxyXG4gICAgcHVibGljIG5neFNtYXJ0TW9kYWxTZXJ2aWNlOiBOZ3hTbWFydE1vZGFsU2VydmljZSxcclxuICAgIHB1YmxpYyB0cmFuc2xhdGU6IFRyYW5zbGF0ZVNlcnZpY2VcclxuICApIHtcclxuICAgIHRyYW5zbGF0ZS5zZXREZWZhdWx0TGFuZygnZW4nKTtcclxuICAgIHRyYW5zbGF0ZS51c2UoJ2VuJyk7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHdpbmRvdy5jb25zb2xlID0gd2luZG93LmNvbnNvbGUgfHwge307XHJcbiAgICB3aW5kb3cuY29uc29sZS5sb2cgPSB3aW5kb3cuY29uc29sZS5sb2cgfHwgZnVuY3Rpb24gKCkge1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLm5vZGVTZXJ2aWNlLnRyZWUgPSB0aGlzLnRyZWU7XHJcbiAgICB0aGlzLm5vZGVDbGlja2VkU2VydmljZS50cmVlID0gdGhpcy50cmVlO1xyXG4gICAgdGhpcy5ub2RlU2VydmljZS5zdGFydE1hbmFnZXJBdCh0aGlzLnRyZWUuY3VycmVudFBhdGgpO1xyXG5cclxuICAgIHRoaXMuc3RvcmVcclxuICAgICAgLnBpcGUoc2VsZWN0KHN0YXRlID0+IHN0YXRlLmZpbGVNYW5hZ2VyU3RhdGUuaXNMb2FkaW5nKSlcclxuICAgICAgLnN1YnNjcmliZSgoZGF0YTogYm9vbGVhbikgPT4ge1xyXG4gICAgICAgIHRoaXMubG9hZGluZyA9IGRhdGE7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIHRoaXMuc3RvcmVcclxuICAgICAgLnBpcGUoc2VsZWN0KHN0YXRlID0+IHN0YXRlLmZpbGVNYW5hZ2VyU3RhdGUuc2VsZWN0ZWROb2RlKSlcclxuICAgICAgLnN1YnNjcmliZSgobm9kZTogTm9kZUludGVyZmFjZSkgPT4ge1xyXG4gICAgICAgIGlmICghbm9kZSkge1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZml4ZWQgaGlnaGxpZ2h0aW5nIGVycm9yIHdoZW4gY2xvc2luZyBub2RlIGJ1dCBub3QgY2hhbmdpbmcgcGF0aFxyXG4gICAgICAgIGlmICgobm9kZS5pc0V4cGFuZGVkICYmIG5vZGUucGF0aFRvTm9kZSAhPT0gdGhpcy5ub2RlU2VydmljZS5jdXJyZW50UGF0aCkgJiYgIW5vZGUuc3RheU9wZW4pIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaGFuZGxlRmlsZU1hbmFnZXJDbGlja0V2ZW50KHt0eXBlOiAnc2VsZWN0Jywgbm9kZTogbm9kZX0pO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIG9uSXRlbUNsaWNrZWQoZXZlbnQ6IGFueSk6IHZvaWQge1xyXG4gICAgdGhpcy5pdGVtQ2xpY2tlZC5lbWl0KGV2ZW50KTtcclxuICB9XHJcblxyXG4gIHNlYXJjaENsaWNrZWQoZGF0YTogYW55KSB7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhkYXRhKTtcclxuXHJcbiAgICBjb25zdCBub2RlID0gdGhpcy5ub2RlU2VydmljZS5maW5kTm9kZUJ5SWQoZGF0YS5pZCk7XHJcbiAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCdzZWFyY2hNb2RhbCcpLmNsb3NlKCk7XHJcbiAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9TRUxFQ1RFRF9OT0RFLCBwYXlsb2FkOiBub2RlfSk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVGaWxlTWFuYWdlckNsaWNrRXZlbnQoZXZlbnQ6IGFueSkge1xyXG4gICAgc3dpdGNoIChldmVudC50eXBlKSB7XHJcbiAgICAgIGNhc2UgJ2Nsb3NlU2lkZVZpZXcnIDpcclxuICAgICAgICByZXR1cm4gdGhpcy5ub2RlQ2xpY2tIYW5kbGVyKGV2ZW50Lm5vZGUsIHRydWUpO1xyXG5cclxuICAgICAgY2FzZSAnc2VsZWN0JyA6XHJcbiAgICAgICAgdGhpcy5vbkl0ZW1DbGlja2VkKGV2ZW50KTtcclxuICAgICAgICB0aGlzLmhpZ2hsaWdodFNlbGVjdGVkKGV2ZW50Lm5vZGUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5vZGVDbGlja0hhbmRsZXIoZXZlbnQubm9kZSk7XHJcblxyXG4gICAgICBjYXNlICdkb3dubG9hZCcgOlxyXG4gICAgICAgIHRoaXMubm9kZUNsaWNrZWRTZXJ2aWNlLnN0YXJ0RG93bmxvYWQoZXZlbnQubm9kZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub25JdGVtQ2xpY2tlZChldmVudCk7XHJcblxyXG4gICAgICBjYXNlICdyZW5hbWVDb25maXJtJyA6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ3JlbmFtZU1vZGFsJykub3BlbigpO1xyXG4gICAgICBjYXNlICdyZW5hbWUnIDpcclxuICAgICAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCdyZW5hbWVNb2RhbCcpLmNsb3NlKCk7XHJcblxyXG4gICAgICAgIHRoaXMubm9kZUNsaWNrZWRTZXJ2aWNlLnJlbmFtZSh0aGlzLnNlbGVjdGVkTm9kZS5pZCwgZXZlbnQudmFsdWUpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9uSXRlbUNsaWNrZWQoe1xyXG4gICAgICAgICAgdHlwZTogZXZlbnQudHlwZSxcclxuICAgICAgICAgIG5vZGU6IHRoaXMuc2VsZWN0ZWROb2RlLFxyXG4gICAgICAgICAgbmV3TmFtZTogZXZlbnQudmFsdWVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIGNhc2UgJ3JlbW92ZUFzayc6XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubmd4U21hcnRNb2RhbFNlcnZpY2UuZ2V0TW9kYWwoJ2NvbmZpcm1EZWxldGVNb2RhbCcpLm9wZW4oKTtcclxuICAgICAgY2FzZSAncmVtb3ZlJzpcclxuICAgICAgICB0aGlzLm5neFNtYXJ0TW9kYWxTZXJ2aWNlLmdldE1vZGFsKCdjb25maXJtRGVsZXRlTW9kYWwnKS5jbG9zZSgpO1xyXG5cclxuICAgICAgICB0aGlzLm5vZGVDbGlja2VkU2VydmljZS5pbml0RGVsZXRlKHRoaXMuc2VsZWN0ZWROb2RlKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5vbkl0ZW1DbGlja2VkKHtcclxuICAgICAgICAgIHR5cGU6IGV2ZW50LnR5cGUsXHJcbiAgICAgICAgICBub2RlOiB0aGlzLnNlbGVjdGVkTm9kZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgY2FzZSAnY3JlYXRlRm9sZGVyJyA6XHJcbiAgICAgICAgY29uc3QgcGFyZW50SWQgPSB0aGlzLm5vZGVTZXJ2aWNlLmZpbmROb2RlQnlQYXRoKHRoaXMubm9kZVNlcnZpY2UuY3VycmVudFBhdGgpLmlkO1xyXG5cclxuICAgICAgICB0aGlzLm5vZGVDbGlja2VkU2VydmljZS5jcmVhdGVGb2xkZXIocGFyZW50SWQsIGV2ZW50LnBheWxvYWQpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9uSXRlbUNsaWNrZWQoe1xyXG4gICAgICAgICAgdHlwZTogZXZlbnQudHlwZSxcclxuICAgICAgICAgIHBhcmVudElkOiBwYXJlbnRJZCxcclxuICAgICAgICAgIG5ld0Rpck5hbWU6IGV2ZW50LnBheWxvYWRcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5vZGVDbGlja0hhbmRsZXIobm9kZTogTm9kZUludGVyZmFjZSwgY2xvc2luZz86IGJvb2xlYW4pIHtcclxuICAgIGlmIChub2RlLm5hbWUgPT09ICdyb290Jykge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNsb3NpbmcpIHtcclxuICAgICAgY29uc3QgcGFyZW50Tm9kZSA9IHRoaXMubm9kZVNlcnZpY2UuZmluZE5vZGVCeVBhdGgodGhpcy5ub2RlU2VydmljZS5jdXJyZW50UGF0aCk7XHJcbiAgICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IEFDVElPTlMuU0VUX1NFTEVDVEVEX05PREUsIHBheWxvYWQ6IHBhcmVudE5vZGV9KTtcclxuICAgICAgdGhpcy5zaWRlTWVudUNsb3NlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgaWYgKHRoaXMuc2VsZWN0ZWROb2RlID09PSBub2RlICYmIHRoaXMuc2lkZU1lbnVDbG9zZWQpXHJcbiAgICAgICAgdGhpcy5zaWRlTWVudUNsb3NlZCA9IGZhbHNlO1xyXG4gICAgICBlbHNlIGlmICh0aGlzLnNlbGVjdGVkTm9kZSA9PT0gbm9kZSAmJiAhdGhpcy5zaWRlTWVudUNsb3NlZClcclxuICAgICAgICB0aGlzLnNpZGVNZW51Q2xvc2VkID0gdHJ1ZTtcclxuICAgICAgZWxzZSBpZiAodGhpcy5zZWxlY3RlZE5vZGUgIT09IG5vZGUgJiYgdGhpcy5zaWRlTWVudUNsb3NlZClcclxuICAgICAgICB0aGlzLnNpZGVNZW51Q2xvc2VkID0gZmFsc2U7XHJcbiAgICAgIGVsc2UgaWYgKHRoaXMuc2VsZWN0ZWROb2RlICE9PSBub2RlICYmICF0aGlzLnNpZGVNZW51Q2xvc2VkKVxyXG4gICAgICAgIHRoaXMuc2lkZU1lbnVDbG9zZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnNlbGVjdGVkTm9kZSA9IG5vZGU7XHJcblxyXG4gICAgLy8gdG9kbyBpbnZlc3RpZ2F0ZSB0aGlzIHdvcmthcm91bmQgLSB3YXJuaW5nOiBbRmlsZSBNYW5hZ2VyXSBmYWlsZWQgdG8gZmluZCByZXF1ZXN0ZWQgbm9kZSBmb3IgcGF0aDogW3BhdGhdXHJcbiAgICBpZighZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpZGUtdmlldycpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5zaWRlTWVudUNsb3NlZCkge1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2lkZS12aWV3JykuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaWRlLXZpZXcnKS5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gdG9kbyBzdGF5IERSWSFcclxuICBoaWdobGlnaHRTZWxlY3RlZChub2RlOiBOb2RlSW50ZXJmYWNlKSB7XHJcbiAgICBsZXQgcGF0aFRvTm9kZSA9IG5vZGUucGF0aFRvTm9kZTtcclxuXHJcbiAgICBpZiAocGF0aFRvTm9kZS5sZW5ndGggPT09IDApIHtcclxuICAgICAgcGF0aFRvTm9kZSA9ICdyb290JztcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB0cmVlRWxlbWVudCA9IHRoaXMuZ2V0RWxlbWVudEJ5SWQocGF0aFRvTm9kZSwgJ3RyZWVfJyk7XHJcbiAgICBjb25zdCBmY0VsZW1lbnQgPSB0aGlzLmdldEVsZW1lbnRCeUlkKHBhdGhUb05vZGUsICdmY18nKTtcclxuICAgIGlmICghdHJlZUVsZW1lbnQgJiYgIWZjRWxlbWVudCkge1xyXG4gICAgICBjb25zb2xlLndhcm4oJ1tGaWxlIE1hbmFnZXJdIGZhaWxlZCB0byBmaW5kIHJlcXVlc3RlZCBub2RlIGZvciBwYXRoOicsIHBhdGhUb05vZGUpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5yZW1vdmVDbGFzcygnaGlnaGxpZ2h0ZWQnKTtcclxuICAgIHRoaXMucmVtb3ZlQ2xhc3MoJ2xpZ2h0Jyk7XHJcblxyXG4gICAgaWYgKGZjRWxlbWVudClcclxuICAgICAgdGhpcy5oaWdoaWxnaHRDaGlsZEVsZW1lbnQoZmNFbGVtZW50KTtcclxuICAgIGlmICh0cmVlRWxlbWVudClcclxuICAgICAgdGhpcy5oaWdoaWxnaHRDaGlsZEVsZW1lbnQodHJlZUVsZW1lbnQsIHRydWUpO1xyXG5cclxuICAgIC8vIHBhcmVudCBub2RlIGhpZ2hsaWdodFxyXG4gICAgbGV0IHBhdGhUb1BhcmVudCA9IG5vZGUucGF0aFRvUGFyZW50O1xyXG4gICAgaWYgKHBhdGhUb1BhcmVudCA9PT0gbnVsbCB8fCBub2RlLnBhdGhUb05vZGUgPT09IHRoaXMubm9kZVNlcnZpY2UuY3VycmVudFBhdGgpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChwYXRoVG9QYXJlbnQubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHBhdGhUb1BhcmVudCA9ICdyb290JztcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBwYXJlbnRFbGVtZW50ID0gdGhpcy5nZXRFbGVtZW50QnlJZChwYXRoVG9QYXJlbnQsICd0cmVlXycpO1xyXG4gICAgaWYgKCFwYXJlbnRFbGVtZW50KSB7XHJcbiAgICAgIGNvbnNvbGUud2FybignW0ZpbGUgTWFuYWdlcl0gZmFpbGVkIHRvIGZpbmQgcmVxdWVzdGVkIHBhcmVudCBub2RlIGZvciBwYXRoOicsIHBhdGhUb1BhcmVudCk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmhpZ2hpbGdodENoaWxkRWxlbWVudChwYXJlbnRFbGVtZW50KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaGlnaGlsZ2h0Q2hpbGRFbGVtZW50KGVsOiBIVE1MRWxlbWVudCwgbGlnaHQ6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgZWwuY2hpbGRyZW5bMF0gLy8gYXBwbm9kZSBkaXYgd3JhcHBlclxyXG4gICAgICAuY2hpbGRyZW5bMF0gLy8gbmcgdGVtcGxhdGUgZmlyc3QgaXRlbVxyXG4gICAgICAuY2xhc3NMaXN0LmFkZCgnaGlnaGxpZ2h0ZWQnKTtcclxuXHJcbiAgICBpZiAobGlnaHQpXHJcbiAgICAgIGVsLmNoaWxkcmVuWzBdXHJcbiAgICAgICAgLmNoaWxkcmVuWzBdXHJcbiAgICAgICAgLmNsYXNzTGlzdC5hZGQoJ2xpZ2h0Jyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldEVsZW1lbnRCeUlkKGlkOiBzdHJpbmcsIHByZWZpeDogc3RyaW5nID0gJycpOiBIVE1MRWxlbWVudCB7XHJcbiAgICBjb25zdCBmdWxsSWQgPSBwcmVmaXggKyBpZDtcclxuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChmdWxsSWQpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZW1vdmVDbGFzcyhjbGFzc05hbWU6IHN0cmluZykge1xyXG4gICAgQXJyYXkuZnJvbShkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNsYXNzTmFtZSkpXHJcbiAgICAgIC5tYXAoKGVsOiBIVE1MRWxlbWVudCkgPT4gZWwuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpKTtcclxuICB9XHJcblxyXG4gIGZtU2hvd0hpZGUoKSB7XHJcbiAgICB0aGlzLmZtT3BlbiA9ICF0aGlzLmZtT3BlbjtcclxuICB9XHJcblxyXG4gIGJhY2tkcm9wQ2xpY2tlZCgpIHtcclxuICAgIC8vIHRvZG8gZ2V0IHJpZCBvZiB0aGlzIHVnbHkgd29ya2Fyb3VuZFxyXG4gICAgLy8gdG9kbyBmaXJlIHVzZXJDYW5jZWxlZExvYWRpbmcgZXZlbnRcclxuICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IFNFVF9MT0FESU5HX1NUQVRFLCBwYXlsb2FkOiBmYWxzZX0pO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlVXBsb2FkRGlhbG9nKGV2ZW50OiBhbnkpIHtcclxuICAgIHRoaXMubmV3RGlhbG9nID0gZXZlbnQ7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPbkluaXQsIE91dHB1dCwgVGVtcGxhdGVSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge3NlbGVjdCwgU3RvcmV9IGZyb20gJ0BuZ3J4L3N0b3JlJztcclxuaW1wb3J0IHtUcmVlTW9kZWx9IGZyb20gJy4uLy4uL21vZGVscy90cmVlLm1vZGVsJztcclxuaW1wb3J0IHtOb2RlU2VydmljZX0gZnJvbSAnLi4vLi4vc2VydmljZXMvbm9kZS5zZXJ2aWNlJztcclxuaW1wb3J0IHtOb2RlSW50ZXJmYWNlfSBmcm9tICcuLi8uLi9pbnRlcmZhY2VzL25vZGUuaW50ZXJmYWNlJztcclxuaW1wb3J0IHtBcHBTdG9yZX0gZnJvbSAnLi4vLi4vcmVkdWNlcnMvcmVkdWNlci5mYWN0b3J5JztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLWZvbGRlci1jb250ZW50JyxcclxuICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJpdGVtLWhvbGRlclwiPlxyXG4gIDxuZy1jb250YWluZXIgKm5nSWY9XCJub2Rlcy5pZCAhPT0gMFwiPlxyXG4gICAgPGFwcC1ub2RlIFtub2RlXT1ub2RlcyBpZD1cInt7bm9kZXMucGF0aFRvTm9kZX19XCI+XHJcbiAgICAgIDxuZy1jb250YWluZXIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IG5vZGVzfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwiZm9sZGVyQ29udGVudEJhY2tUZW1wbGF0ZVwiPlxyXG4gICAgICA8L25nLWNvbnRhaW5lcj5cclxuICAgIDwvYXBwLW5vZGU+XHJcbiAgPC9uZy1jb250YWluZXI+XHJcblxyXG4gIDxuZy1jb250YWluZXIgKm5nRm9yPVwibGV0IG5vZGUgb2Ygb2JqLmtleXMobm9kZXMuY2hpbGRyZW4pXCI+XHJcbiAgICA8YXBwLW5vZGUgW25vZGVdPVwibm9kZXMuY2hpbGRyZW5bbm9kZV1cIlxyXG4gICAgICAgICAgICAgIGlkPVwiZmNfe3tub2Rlcy5jaGlsZHJlbltub2RlXS5wYXRoVG9Ob2RlfX1cIj5cclxuICAgICAgPG5nLWNvbnRhaW5lciBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyRpbXBsaWNpdDogbm9kZXMuY2hpbGRyZW5bbm9kZV19XCJcclxuICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJmb2xkZXJDb250ZW50VGVtcGxhdGVcIj5cclxuICAgICAgPC9uZy1jb250YWluZXI+XHJcbiAgICA8L2FwcC1ub2RlPlxyXG4gIDwvbmctY29udGFpbmVyPlxyXG5cclxuICA8ZGl2IGNsYXNzPVwibmV3XCIgKGNsaWNrKT1cIm5ld0NsaWNrZWRBY3Rpb24oKVwiPlxyXG4gICAgPG5nLWNvbnRhaW5lciBbbmdUZW1wbGF0ZU91dGxldF09XCJmb2xkZXJDb250ZW50TmV3VGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cclxuICA8L2Rpdj5cclxuPC9kaXY+XHJcbmAsXHJcbiAgc3R5bGVzOiBbYC5pdGVtLWhvbGRlcntib3gtc2l6aW5nOmJvcmRlci1ib3g7ZGlzcGxheTotd2Via2l0LWZsZXg7ZGlzcGxheTpmbGV4Oy13ZWJraXQtZmxleC1mbG93OndyYXA7ZmxleC1mbG93OndyYXB9Lml0ZW0taG9sZGVyIC5uZXd7ZGlzcGxheTppbmxpbmV9YF1cclxufSlcclxuZXhwb3J0IGNsYXNzIEZvbGRlckNvbnRlbnRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIEBJbnB1dCgpIGZvbGRlckNvbnRlbnRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuICBASW5wdXQoKSBmb2xkZXJDb250ZW50QmFja1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gIEBJbnB1dCgpIGZvbGRlckNvbnRlbnROZXdUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgQElucHV0KCkgdHJlZU1vZGVsOiBUcmVlTW9kZWw7XHJcblxyXG4gIEBPdXRwdXQoKSBvcGVuVXBsb2FkRGlhbG9nID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBub2RlczogTm9kZUludGVyZmFjZTtcclxuICBvYmogPSBPYmplY3Q7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBub2RlU2VydmljZTogTm9kZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTxBcHBTdG9yZT5cclxuICApIHtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5zdG9yZVxyXG4gICAgICAucGlwZShzZWxlY3Qoc3RhdGUgPT4gc3RhdGUuZmlsZU1hbmFnZXJTdGF0ZS5wYXRoKSlcclxuICAgICAgLnN1YnNjcmliZSgocGF0aDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgdGhpcy5ub2RlcyA9IHRoaXMubm9kZVNlcnZpY2UuZmluZE5vZGVCeVBhdGgocGF0aCk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgbmV3Q2xpY2tlZEFjdGlvbigpIHtcclxuICAgIHRoaXMub3BlblVwbG9hZERpYWxvZy5lbWl0KHRydWUpO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge0FmdGVyVmlld0luaXQsIENvbXBvbmVudCwgQ29udGVudENoaWxkLCBJbnB1dCwgT25Jbml0LCBUZW1wbGF0ZVJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7Tm9kZUludGVyZmFjZX0gZnJvbSAnLi4vLi4vaW50ZXJmYWNlcy9ub2RlLmludGVyZmFjZSc7XHJcbmltcG9ydCB7VHJlZU1vZGVsfSBmcm9tICcuLi8uLi9tb2RlbHMvdHJlZS5tb2RlbCc7XHJcbmltcG9ydCB7Tm9kZVNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL25vZGUuc2VydmljZSc7XHJcbmltcG9ydCB7c2VsZWN0LCBTdG9yZX0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5pbXBvcnQge0FwcFN0b3JlfSBmcm9tICcuLi8uLi9yZWR1Y2Vycy9yZWR1Y2VyLmZhY3RvcnknO1xyXG5pbXBvcnQgKiBhcyBBQ1RJT05TIGZyb20gJy4uLy4uL3JlZHVjZXJzL2FjdGlvbnMuYWN0aW9uJztcclxuaW1wb3J0IHtmaXJzdH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtdHJlZScsXHJcbiAgdGVtcGxhdGU6IGA8YXBwLW5vZGUtbGlzdGVyIFtzaG93RmlsZXNdPVwidHJlZU1vZGVsLmNvbmZpZy5vcHRpb25zLnNob3dGaWxlc0luc2lkZVRyZWVcIlxyXG4gICAgICAgICAgICAgICAgIFtub2Rlc109XCJ7Y2hpbGRyZW46IG5vZGVzfVwiPlxyXG4gIDxuZy10ZW1wbGF0ZSBsZXQtbm9kZXM+XHJcbiAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7JGltcGxpY2l0OiBub2Rlc31cIiBbbmdUZW1wbGF0ZU91dGxldF09XCJ0ZW1wbGF0ZVJlZlwiPjwvbmctY29udGFpbmVyPlxyXG4gIDwvbmctdGVtcGxhdGU+XHJcbjwvYXBwLW5vZGUtbGlzdGVyPlxyXG5gLFxyXG4gIHN0eWxlczogW2BgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgVHJlZUNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uSW5pdCB7XHJcbiAgQENvbnRlbnRDaGlsZChUZW1wbGF0ZVJlZikgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gIEBJbnB1dCgpIHRyZWVNb2RlbDogVHJlZU1vZGVsO1xyXG5cclxuICBub2RlczogTm9kZUludGVyZmFjZTtcclxuICBjdXJyZW50VHJlZUxldmVsID0gJyc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBub2RlU2VydmljZTogTm9kZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIHN0b3JlOiBTdG9yZTxBcHBTdG9yZT5cclxuICApIHtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5ub2RlcyA9IHRoaXMudHJlZU1vZGVsLm5vZGVzO1xyXG5cclxuICAgIC8vdG9kbyBtb3ZlIHRoaXMgc3RvcmUgdG8gcHJvcGVyIHBsYWNlXHJcbiAgICB0aGlzLnN0b3JlXHJcbiAgICAgIC5waXBlKHNlbGVjdChzdGF0ZSA9PiBzdGF0ZS5maWxlTWFuYWdlclN0YXRlLnBhdGgpKVxyXG4gICAgICAuc3Vic2NyaWJlKChwYXRoOiBzdHJpbmcpID0+IHtcclxuICAgICAgICB0aGlzLm5vZGVTZXJ2aWNlLmdldE5vZGVzKHBhdGgpO1xyXG5cclxuICAgICAgICB0aGlzLmN1cnJlbnRUcmVlTGV2ZWwgPSB0aGlzLnRyZWVNb2RlbC5jdXJyZW50UGF0aDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMudHJlZU1vZGVsLmN1cnJlbnRQYXRoID0gcGF0aDtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBuZ0FmdGVyVmlld0luaXQoKSB7XHJcbiAgICB0aGlzLnN0b3JlXHJcbiAgICAgIC5waXBlKHNlbGVjdChzdGF0ZSA9PiBzdGF0ZS5maWxlTWFuYWdlclN0YXRlLnBhdGgpKVxyXG4gICAgICAucGlwZShmaXJzdCgpKVxyXG4gICAgICAuc3Vic2NyaWJlKChwYXRoOiBzdHJpbmcpID0+IHtcclxuICAgICAgICBjb25zdCBub2RlcyA9IHRoaXMubm9kZVNlcnZpY2UuZmluZE5vZGVCeVBhdGgocGF0aCk7XHJcbiAgICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogQUNUSU9OUy5TRVRfU0VMRUNURURfTk9ERSwgcGF5bG9hZDogbm9kZXN9KTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50LCBDb250ZW50Q2hpbGQsIElucHV0LCBPbkluaXQsIFRlbXBsYXRlUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtOb2RlSW50ZXJmYWNlfSBmcm9tICcuLi8uLi8uLi9pbnRlcmZhY2VzL25vZGUuaW50ZXJmYWNlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLW5vZGUtbGlzdGVyJyxcclxuICB0ZW1wbGF0ZTogYDx1bCBjbGFzcz1cIm5vZGUtbGlzdGVyLWZsaXN0XCI+XHJcbiAgPCEtLUluIG9yZGVyIHRvIGF2b2lkIGhhdmluZyB0byBjcmVhdGUgdGhhdCBleHRyYSBkaXYsIHdlIGNhbiBpbnN0ZWFkIHVzZSBuZy1jb250YWluZXIgZGlyZWN0aXZlLS0+XHJcbiAgPG5nLWNvbnRhaW5lciAqbmdGb3I9XCJsZXQgbm9kZSBvZiBvYmoua2V5cyhub2RlcylcIj5cclxuICAgIDxsaSBjbGFzcz1cIm5vZGUtbGlzdGVyLWxpc3QtaXRlbVwiICpuZ0lmPVwibm9kZXNbbm9kZV0uaXNGb2xkZXIgfHwgc2hvd0ZpbGVzXCI+XHJcblxyXG4gICAgICA8YXBwLW5vZGUgY2xhc3M9XCJub2RlLWxpc3Rlci1hcHAtbm9kZVwiIFtub2RlXT1cIm5vZGVzW25vZGVdXCIgaWQ9XCJ0cmVlX3t7bm9kZXNbbm9kZV0uaWQgPT09IDAgPyAncm9vdCcgOiBub2Rlc1tub2RlXS5wYXRoVG9Ob2RlfX1cIj5cclxuICAgICAgICA8bmctY29udGFpbmVyIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7JGltcGxpY2l0OiAobm9kZXNbbm9kZV0pfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJ0ZW1wbGF0ZVJlZlwiPlxyXG4gICAgICAgIDwvbmctY29udGFpbmVyPlxyXG4gICAgICA8L2FwcC1ub2RlPlxyXG5cclxuICAgICAgPGFwcC1ub2RlLWxpc3RlciBjbGFzcz1cIm5vZGUtbGlzdGVyXCIgKm5nSWY9XCJvYmoua2V5cyhub2Rlc1tub2RlXS5jaGlsZHJlbikubGVuZ3RoID4gMFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgW3Nob3dGaWxlc109XCJzaG93RmlsZXNcIiBbbm9kZXNdPVwibm9kZXNbbm9kZV0uY2hpbGRyZW5cIj5cclxuICAgICAgICA8bmctdGVtcGxhdGUgbGV0LW5vZGVzPlxyXG4gICAgICAgICAgPG5nLWNvbnRhaW5lciBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyRpbXBsaWNpdDogKG5vZGVzKX1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJ0ZW1wbGF0ZVJlZlwiPlxyXG4gICAgICAgICAgPC9uZy1jb250YWluZXI+XHJcbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cclxuICAgICAgPC9hcHAtbm9kZS1saXN0ZXI+XHJcbiAgICA8L2xpPlxyXG4gIDwvbmctY29udGFpbmVyPlxyXG48L3VsPlxyXG5gLFxyXG4gIHN0eWxlczogW2Aubm9kZS1saXN0ZXItZmxpc3R7bWFyZ2luOjAgMCAwIDFlbTtwYWRkaW5nOjA7bGlzdC1zdHlsZTpub25lO3doaXRlLXNwYWNlOm5vd3JhcH0ubm9kZS1saXN0ZXItbGlzdC1pdGVte2xpc3Qtc3R5bGU6bm9uZTtsaW5lLWhlaWdodDoxLjJlbTtmb250LXNpemU6MWVtO2Rpc3BsYXk6aW5saW5lfS5ub2RlLWxpc3Rlci1saXN0LWl0ZW0gLm5vZGUtbGlzdGVyLWFwcC1ub2RlLmRlc2VsZWN0ZWQrLm5vZGUtbGlzdGVyIHVse2Rpc3BsYXk6bm9uZX1gXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTm9kZUxpc3RlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgQENvbnRlbnRDaGlsZChUZW1wbGF0ZVJlZikgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT47XHJcbiAgQElucHV0KCkgbm9kZXM6IE5vZGVJbnRlcmZhY2U7XHJcbiAgQElucHV0KCkgc2hvd0ZpbGVzOiBib29sZWFuO1xyXG5cclxuICBvYmogPSBPYmplY3Q7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50LCBJbnB1dCwgT25Jbml0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtOb2RlSW50ZXJmYWNlfSBmcm9tICcuLi8uLi8uLi9pbnRlcmZhY2VzL25vZGUuaW50ZXJmYWNlJztcclxuaW1wb3J0IHtTdG9yZX0gZnJvbSAnQG5ncngvc3RvcmUnO1xyXG5cclxuaW1wb3J0ICogYXMgQUNUSU9OUyBmcm9tICcuLi8uLi8uLi9yZWR1Y2Vycy9hY3Rpb25zLmFjdGlvbic7XHJcbmltcG9ydCB7QXBwU3RvcmV9IGZyb20gJy4uLy4uLy4uL3JlZHVjZXJzL3JlZHVjZXIuZmFjdG9yeSc7XHJcbmltcG9ydCB7Tm9kZVNlcnZpY2V9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL25vZGUuc2VydmljZSc7XHJcbmltcG9ydCB7Tm9kZUNsaWNrZWRTZXJ2aWNlfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9ub2RlLWNsaWNrZWQuc2VydmljZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1ub2RlJyxcclxuICB0ZW1wbGF0ZTogYDxkaXYgI2N1c3RvbVRlbXBsYXRlIChkYmxjbGljayk9XCJtZXRob2QyQ2FsbEZvckRibENsaWNrKCRldmVudClcIiAoY2xpY2spPVwibWV0aG9kMUNhbGxGb3JDbGljaygkZXZlbnQpXCI+XHJcbiAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxyXG48L2Rpdj5cclxuYCxcclxuICBzdHlsZXM6IFtgYF1cclxufSlcclxuZXhwb3J0IGNsYXNzIE5vZGVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIEBJbnB1dCgpIG5vZGU6IE5vZGVJbnRlcmZhY2U7XHJcbiAgaXNTaW5nbGVDbGljayA9IHRydWU7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU8QXBwU3RvcmU+LFxyXG4gICAgcHJpdmF0ZSBub2RlU2VydmljZTogTm9kZVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIG5vZGVDbGlja2VkU2VydmljZTogTm9kZUNsaWNrZWRTZXJ2aWNlXHJcbiAgKSB7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgbWV0aG9kMUNhbGxGb3JDbGljayhldmVudDogTW91c2VFdmVudCkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICB0aGlzLmlzU2luZ2xlQ2xpY2sgPSB0cnVlO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIGlmICh0aGlzLmlzU2luZ2xlQ2xpY2spIHtcclxuICAgICAgICB0aGlzLnNob3dNZW51KCk7XHJcbiAgICAgIH1cclxuICAgIH0sIDIwMCk7XHJcbiAgfVxyXG5cclxuICAvLyB0b2RvIGV2ZW50LnByZXZlbnREZWZhdWx0IGZvciBkb3VibGUgY2xpY2tcclxuICBwdWJsaWMgbWV0aG9kMkNhbGxGb3JEYmxDbGljayhldmVudDogYW55KSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIHRoaXMuaXNTaW5nbGVDbGljayA9IGZhbHNlO1xyXG4gICAgdGhpcy5vcGVuKCk7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgb3BlbigpIHtcclxuICAgIGlmICghdGhpcy5ub2RlLmlzRm9sZGVyKSB7XHJcbiAgICAgIHRoaXMubm9kZUNsaWNrZWRTZXJ2aWNlLnN0YXJ0RG93bmxvYWQodGhpcy5ub2RlKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLm5vZGUuc3RheU9wZW4pIHtcclxuICAgICAgaWYgKHRoaXMubm9kZS5uYW1lID09ICdyb290Jykge1xyXG4gICAgICAgIHRoaXMubm9kZVNlcnZpY2UuZm9sZEFsbCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnN0b3JlLmRpc3BhdGNoKHt0eXBlOiBBQ1RJT05TLlNFVF9QQVRILCBwYXlsb2FkOiB0aGlzLm5vZGUucGF0aFRvTm9kZX0pO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy50b2dnbGVOb2RlRXhwYW5kZWQoKTtcclxuXHJcbiAgICBpZiAodGhpcy5ub2RlLmlzRXhwYW5kZWQpIHtcclxuICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogQUNUSU9OUy5TRVRfUEFUSCwgcGF5bG9hZDogdGhpcy5ub2RlLnBhdGhUb05vZGV9KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnNldE5vZGVTZWxlY3RlZFN0YXRlKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNob3dNZW51KCkge1xyXG4gICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogQUNUSU9OUy5TRVRfU0VMRUNURURfTk9ERSwgcGF5bG9hZDogdGhpcy5ub2RlfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHRvZ2dsZU5vZGVFeHBhbmRlZCgpIHtcclxuICAgIHRoaXMubm9kZS5pc0V4cGFuZGVkID0gIXRoaXMubm9kZS5pc0V4cGFuZGVkO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZXROb2RlU2VsZWN0ZWRTdGF0ZSgpIHtcclxuICAgIGlmICghdGhpcy5ub2RlLmlzRXhwYW5kZWQpIHtcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RyZWVfJyArIHRoaXMubm9kZS5wYXRoVG9Ob2RlKS5jbGFzc0xpc3QuYWRkKCdkZXNlbGVjdGVkJyk7XHJcblxyXG4gICAgICB0aGlzLm5vZGVTZXJ2aWNlLmZvbGRSZWN1cnNpdmVseSh0aGlzLm5vZGUpO1xyXG5cclxuICAgICAgdGhpcy5zdG9yZS5kaXNwYXRjaCh7dHlwZTogQUNUSU9OUy5TRVRfUEFUSCwgcGF5bG9hZDogdGhpcy5ub2RlLnBhdGhUb1BhcmVudH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RyZWVfJyArIHRoaXMubm9kZS5wYXRoVG9Ob2RlKS5jbGFzc0xpc3QucmVtb3ZlKCdkZXNlbGVjdGVkJyk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7UGlwZSwgUGlwZVRyYW5zZm9ybX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5AUGlwZSh7XHJcbiAgbmFtZTogJ21hcFRvSXRlcmFibGVQaXBlJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgTWFwVG9JdGVyYWJsZVBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcclxuICB0cmFuc2Zvcm0oZGljdDogT2JqZWN0KSB7XHJcbiAgICBjb25zdCBhID0gW107XHJcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBkaWN0KSB7XHJcbiAgICAgIGlmIChkaWN0Lmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICBhLnB1c2goe2tleToga2V5LCB2YWw6IGRpY3Rba2V5XX0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGE7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50LCBPbkluaXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge3NlbGVjdCwgU3RvcmV9IGZyb20gJ0BuZ3J4L3N0b3JlJztcclxuaW1wb3J0ICogYXMgQUNUSU9OUyBmcm9tICcuLi8uLi9yZWR1Y2Vycy9hY3Rpb25zLmFjdGlvbic7XHJcbmltcG9ydCB7QXBwU3RvcmV9IGZyb20gJy4uLy4uL3JlZHVjZXJzL3JlZHVjZXIuZmFjdG9yeSc7XHJcbmltcG9ydCB7Tm9kZVNlcnZpY2V9IGZyb20gJy4uLy4uL3NlcnZpY2VzL25vZGUuc2VydmljZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1uYXYtYmFyJyxcclxuICB0ZW1wbGF0ZTogYDxkaXY+XHJcbiAgPj4gPHNwYW4gKm5nRm9yPVwibGV0IHRvIG9mIGN1cnJlbnRQYXRoOyBsZXQgaSA9IGluZGV4XCI+XHJcbiAgPGEgY2xhc3M9XCJsaW5rXCIgKGNsaWNrKT1cIm9uQ2xpY2soY3VycmVudFBhdGgsIGkpXCI+XHJcbiAgICA8ZGl2ICpuZ0lmPVwidG8gPT09ICcnIHx8IHRvID09PSAncm9vdCc7IHRoZW4gaWNvbiBlbHNlIG5hbWVcIj48L2Rpdj5cclxuICAgIDxuZy10ZW1wbGF0ZSAjaWNvbj48aSBjbGFzcz1cImZhcyBmYS1ob21lXCI+PC9pPjwvbmctdGVtcGxhdGU+XHJcbiAgICA8bmctdGVtcGxhdGUgI25hbWU+e3t0b319PC9uZy10ZW1wbGF0ZT5cclxuICA8L2E+IC9cclxuICA8L3NwYW4+XHJcbjwvZGl2PlxyXG5gLFxyXG4gIHN0eWxlczogW2BgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmF2QmFyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBjdXJyZW50UGF0aDogc3RyaW5nW107XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBzdG9yZTogU3RvcmU8QXBwU3RvcmU+LFxyXG4gICAgcHJpdmF0ZSBub2RlU2VydmljZTogTm9kZVNlcnZpY2VcclxuICApIHtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5zdG9yZVxyXG4gICAgICAucGlwZShzZWxlY3Qoc3RhdGUgPT4gc3RhdGUuZmlsZU1hbmFnZXJTdGF0ZS5wYXRoKSlcclxuICAgICAgLnN1YnNjcmliZSgoZGF0YTogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgdGhpcy5ub2RlU2VydmljZS5jdXJyZW50UGF0aCA9IGRhdGE7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UGF0aCA9IGRhdGEuc3BsaXQoJy8nKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBvbkNsaWNrKHBhdGg6IHN0cmluZ1tdLCBpbmRleDogbnVtYmVyKSB7XHJcbiAgICBjb25zdCBuZXdQYXRoID0gcGF0aC5zbGljZSgwLCBpbmRleCArIDEpLmpvaW4oJy8nKTtcclxuICAgIHRoaXMuc3RvcmUuZGlzcGF0Y2goe3R5cGU6IEFDVElPTlMuU0VUX1BBVEgsIHBheWxvYWQ6IG5ld1BhdGh9KTtcclxuICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7U3RhdGVJbnRlcmZhY2V9IGZyb20gJy4uL2ludGVyZmFjZXMvc3RhdGUuaW50ZXJmYWNlJztcclxuaW1wb3J0ICogYXMgQUNUSU9OUyBmcm9tICcuL2FjdGlvbnMuYWN0aW9uJztcclxuXHJcbmNvbnN0IGluaXRpYWxTdGF0ZTogU3RhdGVJbnRlcmZhY2UgPSB7XHJcbiAgcGF0aDogJycsXHJcbiAgaXNMb2FkaW5nOiB0cnVlLFxyXG4gIHNlbGVjdGVkTm9kZTogbnVsbFxyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHN0YXRlUmVkdWNlcihzdGF0ZTogU3RhdGVJbnRlcmZhY2UgPSBpbml0aWFsU3RhdGUsIGFjdGlvbjogQUNUSU9OUy5BY3Rpb25zKTogU3RhdGVJbnRlcmZhY2Uge1xyXG4gIC8vIGNvbnNvbGUubG9nKCdQcmV2aW91cyBzdGF0ZTogJywgc3RhdGUpO1xyXG4gIC8vIGNvbnNvbGUubG9nKCdBQ1RJT04gdHlwZTogJywgYWN0aW9uLnR5cGUpO1xyXG4gIC8vIGNvbnNvbGUubG9nKCdBQ1RJT04gcGF5bG9hZDogJywgYWN0aW9uLnBheWxvYWQpO1xyXG5cclxuICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICBjYXNlIEFDVElPTlMuU0VUX1BBVEggOlxyXG4gICAgICBpZiAoc3RhdGUucGF0aCA9PT0gYWN0aW9uLnBheWxvYWQpIHtcclxuICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHsuLi5zdGF0ZSwgcGF0aDogYWN0aW9uLnBheWxvYWQsIGlzTG9hZGluZzogdHJ1ZX07XHJcbiAgICBjYXNlIEFDVElPTlMuU0VUX0xPQURJTkdfU1RBVEUgOlxyXG4gICAgICByZXR1cm4gey4uLnN0YXRlLCBpc0xvYWRpbmc6IGFjdGlvbi5wYXlsb2FkfTtcclxuICAgIGNhc2UgQUNUSU9OUy5TRVRfU0VMRUNURURfTk9ERSA6XHJcbiAgICAgIHJldHVybiB7Li4uc3RhdGUsIHNlbGVjdGVkTm9kZTogYWN0aW9uLnBheWxvYWR9O1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIGluaXRpYWxTdGF0ZTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtzdGF0ZVJlZHVjZXJ9IGZyb20gJy4vc3RhdGVSZWR1Y2VyJztcclxuaW1wb3J0IHtBY3Rpb25SZWR1Y2VyTWFwfSBmcm9tICdAbmdyeC9zdG9yZSc7XHJcbmltcG9ydCB7U3RhdGVJbnRlcmZhY2V9IGZyb20gJy4uL2ludGVyZmFjZXMvc3RhdGUuaW50ZXJmYWNlJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQXBwU3RvcmUge1xyXG4gIGZpbGVNYW5hZ2VyU3RhdGU6IFN0YXRlSW50ZXJmYWNlO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgcmVkdWNlcnM6IEFjdGlvblJlZHVjZXJNYXA8QXBwU3RvcmU+ID0ge1xyXG4gIGZpbGVNYW5hZ2VyU3RhdGU6IHN0YXRlUmVkdWNlclxyXG59O1xyXG4iLCJpbXBvcnQge0NvbXBvbmVudCwgSW5wdXQsIE9uSW5pdCwgVGVtcGxhdGVSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge199IGZyb20gJ0BiaWVzYmplcmcvbmd4LXRyYW5zbGF0ZS1leHRyYWN0L2Rpc3QvdXRpbHMvdXRpbHMnO1xyXG5pbXBvcnQge3RpbWVyfSBmcm9tICdyeGpzJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYXBwLWxvYWRpbmctb3ZlcmxheScsXHJcbiAgdGVtcGxhdGU6IGA8bmctY29udGFpbmVyXHJcbiAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IHRpbWVvdXRNZXNzYWdlfVwiXHJcbiAgW25nVGVtcGxhdGVPdXRsZXRdPVwibG9hZGluZ092ZXJsYXlUZW1wbGF0ZVwiPlxyXG48L25nLWNvbnRhaW5lcj5cclxuYCxcclxuICBzdHlsZXM6IFtgYF1cclxufSlcclxuZXhwb3J0IGNsYXNzIExvYWRpbmdPdmVybGF5Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBASW5wdXQoKSBsb2FkaW5nT3ZlcmxheVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG4gIHRpbWVvdXRNZXNzYWdlOiBhbnk7XHJcblxyXG4gIC8vIHRvZG8gdW5zdWJzY3JpYmUgZnJvbSAnbGlzdCcgZXZlbnQgLSBub3cgd2UgYXJlIG9ubHkgZGlzbWlzc2luZyB0aGlzIGNvbXBvbmVudFxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGltZXIoMjAwMCkuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgdGhpcy50aW1lb3V0TWVzc2FnZSA9IF8oJ1Ryb3VibGVzIHdpdGggbG9hZGluZz8gQ2xpY2sgYW55d2hlcmUgdG8gY2FuY2VsIGxvYWRpbmcnKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG4vKlxyXG4gKiBDb252ZXJ0IGJ5dGVzIGludG8gbGFyZ2VzdCBwb3NzaWJsZSB1bml0LlxyXG4gKiBUYWtlcyBhbiBwcmVjaXNpb24gYXJndW1lbnQgdGhhdCBkZWZhdWx0cyB0byAyLlxyXG4gKiBVc2FnZTpcclxuICogICBieXRlcyB8IGZpbGVTaXplOnByZWNpc2lvblxyXG4gKiBFeGFtcGxlOlxyXG4gKiAgIHt7IDEwMjQgfCAgZmlsZVNpemV9fVxyXG4gKiAgIGZvcm1hdHMgdG86IDEgS0JcclxuKi9cclxuQFBpcGUoe25hbWU6ICdmaWxlU2l6ZSd9KVxyXG5leHBvcnQgY2xhc3MgRmlsZVNpemVQaXBlIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XHJcblxyXG4gIHByaXZhdGUgdW5pdHMgPSBbXHJcbiAgICAnYnl0ZXMnLFxyXG4gICAgJ0tCJyxcclxuICAgICdNQicsXHJcbiAgICAnR0InLFxyXG4gICAgJ1RCJyxcclxuICAgICdQQidcclxuICBdO1xyXG5cclxuICB0cmFuc2Zvcm0oYnl0ZXM6IG51bWJlciA9IDAsIHByZWNpc2lvbjogbnVtYmVyID0gMiApIDogc3RyaW5nIHtcclxuICAgIGlmICggaXNOYU4oIHBhcnNlRmxvYXQoIFN0cmluZyhieXRlcykgKSkgfHwgISBpc0Zpbml0ZSggYnl0ZXMgKSApIHJldHVybiAnPyc7XHJcblxyXG4gICAgbGV0IHVuaXQgPSAwO1xyXG5cclxuICAgIHdoaWxlICggYnl0ZXMgPj0gMTAyNCApIHtcclxuICAgICAgYnl0ZXMgLz0gMTAyNDtcclxuICAgICAgdW5pdCArKztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYnl0ZXMudG9GaXhlZCggKyBwcmVjaXNpb24gKSArICcgJyArIHRoaXMudW5pdHNbIHVuaXQgXTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtBZnRlclZpZXdJbml0LCBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0LCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7SHR0cENsaWVudH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQge0ZpbmVVcGxvYWRlcn0gZnJvbSAnZmluZS11cGxvYWRlcic7XHJcbmltcG9ydCB7Tm9kZVNlcnZpY2V9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL25vZGUuc2VydmljZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC11cGxvYWQnLFxyXG4gIHRlbXBsYXRlOiBgPGRpdiBjbGFzcz1cImJhY2tkcm9wXCIgKGNsaWNrKT1cIm5ld0NsaWNrZWRBY3Rpb24oKVwiPjwvZGl2PlxyXG48ZGl2IGNsYXNzPVwidXBsb2FkLWJhY2tncm91bmRcIj5cclxuICA8ZGl2IGNsYXNzPVwiYnV0dG9uc1wiPlxyXG4gICAgPGJ1dHRvbiBjbGFzcz1cImJ1dHRvblwiIFtkaXNhYmxlZF09XCJuZXdGb2xkZXJcIiAoY2xpY2spPVwiY3JlYXRlTmV3Rm9sZGVyKClcIiB0cmFuc2xhdGU+Q3JlYXRlIG5ldyBmb2xkZXI8L2J1dHRvbj5cclxuICA8L2Rpdj5cclxuXHJcbiAgPGRpdiAqbmdJZj1cIm5ld0ZvbGRlclwiPlxyXG4gICAgPGRpdiBjbGFzcz1cImJ1dHRvbnNcIj5cclxuICAgICAgPGFwcC1uZXctZm9sZGVyIChidXR0b25DbGlja2VkKT1cImNyZWF0ZU5ld0ZvbGRlcigkZXZlbnQpXCI+PC9hcHAtbmV3LWZvbGRlcj5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG5cclxuICA8ZGl2IGlkPVwiZmluZS11cGxvYWRlclwiPlxyXG4gIDwvZGl2PlxyXG5cclxuXHJcbiAgPGRpdiBjbGFzcz1cImJ1dHRvbnNcIj5cclxuICAgIDxidXR0b24gY2xhc3M9XCJidXR0b24gYmlnXCIgW2Rpc2FibGVkXT1cInRoaXMuY291bnRlciA8IDFcIiAoY2xpY2spPVwidXBsb2FkRmlsZXMoKVwiIHRyYW5zbGF0ZT5cclxuICAgICAgVXBsb2FkXHJcbiAgICA8L2J1dHRvbj5cclxuICAgIDxidXR0b24gY2xhc3M9XCJidXR0b24gYmlnXCIgKGNsaWNrKT1cIm5ld0NsaWNrZWRBY3Rpb24oKVwiIHRyYW5zbGF0ZT5cclxuICAgICAgQ2xvc2VcclxuICAgIDwvYnV0dG9uPlxyXG4gIDwvZGl2PlxyXG5cclxuPC9kaXY+XHJcblxyXG48ZGl2IGlkPVwiZmluZS11cGxvYWRlci10ZW1wbGF0ZVwiIHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIj5cclxuICA8ZGl2IGNsYXNzPVwicXEtdXBsb2FkZXItc2VsZWN0b3IgcXEtdXBsb2FkZXJcIiBxcS1kcm9wLWFyZWEtdGV4dD1cIkRyb3AgZmlsZXMgaGVyZVwiPlxyXG4gICAgPGRpdiBjbGFzcz1cInFxLXVwbG9hZC1kcm9wLWFyZWEtc2VsZWN0b3IgcXEtdXBsb2FkLWRyb3AtYXJlYVwiIHFxLWhpZGUtZHJvcHpvbmU+XHJcbiAgICAgIDxzcGFuIGNsYXNzPVwicXEtdXBsb2FkLWRyb3AtYXJlYS10ZXh0LXNlbGVjdG9yXCI+PC9zcGFuPlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPGRpdiBjbGFzcz1cInVwbG9hZC10b3AtYmFyXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJxcS11cGxvYWQtYnV0dG9uLXNlbGVjdG9yIHFxLXVwbG9hZC1idXR0b25cIj5cclxuICAgICAgICA8ZGl2IHRyYW5zbGF0ZT5VcGxvYWQgYSBmaWxlPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGRpdiBjbGFzcz1cInFxLXRvdGFsLXByb2dyZXNzLWJhci1jb250YWluZXItc2VsZWN0b3IgcXEtdG90YWwtcHJvZ3Jlc3MtYmFyLWNvbnRhaW5lclwiPlxyXG4gICAgICAgIDxkaXYgcm9sZT1cInByb2dyZXNzYmFyXCIgYXJpYS12YWx1ZW5vdz1cIjBcIiBhcmlhLXZhbHVlbWluPVwiMFwiIGFyaWEtdmFsdWVtYXg9XCIxMDBcIlxyXG4gICAgICAgICAgICAgY2xhc3M9XCJxcS10b3RhbC1wcm9ncmVzcy1iYXItc2VsZWN0b3IgcXEtcHJvZ3Jlc3MtYmFyIHFxLXRvdGFsLXByb2dyZXNzLWJhclwiPjwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxzcGFuIGNsYXNzPVwicXEtZHJvcC1wcm9jZXNzaW5nLXNlbGVjdG9yIHFxLWRyb3AtcHJvY2Vzc2luZ1wiPlxyXG4gICAgICAgICAgICA8c3BhbiB0cmFuc2xhdGU+UHJvY2Vzc2luZyBkcm9wcGVkIGZpbGVzPC9zcGFuPi4uLlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInFxLWRyb3AtcHJvY2Vzc2luZy1zcGlubmVyLXNlbGVjdG9yIHFxLWRyb3AtcHJvY2Vzc2luZy1zcGlubmVyXCI+PC9zcGFuPlxyXG4gICAgPC9zcGFuPlxyXG5cclxuICAgIDx1bCBjbGFzcz1cInFxLXVwbG9hZC1saXN0LXNlbGVjdG9yIHFxLXVwbG9hZC1saXN0XCIgYXJpYS1saXZlPVwicG9saXRlXCIgYXJpYS1yZWxldmFudD1cImFkZGl0aW9ucyByZW1vdmFsc1wiPlxyXG4gICAgICA8bGk+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInFxLXByb2dyZXNzLWJhci1jb250YWluZXItc2VsZWN0b3JcIj5cclxuICAgICAgICAgIDxkaXYgcm9sZT1cInByb2dyZXNzYmFyXCIgYXJpYS12YWx1ZW5vdz1cIjBcIiBhcmlhLXZhbHVlbWluPVwiMFwiIGFyaWEtdmFsdWVtYXg9XCIxMDBcIlxyXG4gICAgICAgICAgICAgICBjbGFzcz1cInFxLXByb2dyZXNzLWJhci1zZWxlY3RvciBxcS1wcm9ncmVzcy1iYXJcIj48L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cInFxLXVwbG9hZC1zcGlubmVyLXNlbGVjdG9yIHFxLXVwbG9hZC1zcGlubmVyXCI+PC9zcGFuPlxyXG4gICAgICAgIDxpbWcgY2xhc3M9XCJxcS10aHVtYm5haWwtc2VsZWN0b3JcIiBxcS1tYXgtc2l6ZT1cIjEwMFwiIHFxLXNlcnZlci1zY2FsZT5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cInFxLXVwbG9hZC1maWxlLXNlbGVjdG9yIHFxLXVwbG9hZC1maWxlXCI+PC9zcGFuPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwicXEtZWRpdC1maWxlbmFtZS1pY29uLXNlbGVjdG9yIHFxLWVkaXQtZmlsZW5hbWUtaWNvblwiIGFyaWEtbGFiZWw9XCJFZGl0IGZpbGVuYW1lXCI+PC9zcGFuPlxyXG4gICAgICAgIDxpbnB1dCBjbGFzcz1cInFxLWVkaXQtZmlsZW5hbWUtc2VsZWN0b3IgcXEtZWRpdC1maWxlbmFtZVwiIHRhYmluZGV4PVwiMFwiIHR5cGU9XCJ0ZXh0XCI+XHJcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJxcS11cGxvYWQtc2l6ZS1zZWxlY3RvciBxcS11cGxvYWQtc2l6ZVwiPjwvc3Bhbj5cclxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInFxLWJ0biBxcS11cGxvYWQtY2FuY2VsLXNlbGVjdG9yIHFxLXVwbG9hZC1jYW5jZWxcIiB0cmFuc2xhdGU+Q2FuY2VsPC9idXR0b24+XHJcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJxcS1idG4gcXEtdXBsb2FkLXJldHJ5LXNlbGVjdG9yIHFxLXVwbG9hZC1yZXRyeVwiIHRyYW5zbGF0ZT5SZXRyeTwvYnV0dG9uPlxyXG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicXEtYnRuIHFxLXVwbG9hZC1kZWxldGUtc2VsZWN0b3IgcXEtdXBsb2FkLWRlbGV0ZVwiIHRyYW5zbGF0ZT5EZWxldGU8L2J1dHRvbj5cclxuICAgICAgICA8c3BhbiByb2xlPVwic3RhdHVzXCIgY2xhc3M9XCJxcS11cGxvYWQtc3RhdHVzLXRleHQtc2VsZWN0b3IgcXEtdXBsb2FkLXN0YXR1cy10ZXh0XCI+PC9zcGFuPlxyXG4gICAgICA8L2xpPlxyXG4gICAgPC91bD5cclxuXHJcbiAgICA8ZGlhbG9nIGNsYXNzPVwicXEtYWxlcnQtZGlhbG9nLXNlbGVjdG9yXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJxcS1kaWFsb2ctbWVzc2FnZS1zZWxlY3RvclwiPjwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicXEtZGlhbG9nLWJ1dHRvbnNcIj5cclxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInFxLWNhbmNlbC1idXR0b24tc2VsZWN0b3JcIiB0cmFuc2xhdGU+Q2xvc2U8L2J1dHRvbj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2RpYWxvZz5cclxuXHJcbiAgICA8ZGlhbG9nIGNsYXNzPVwicXEtY29uZmlybS1kaWFsb2ctc2VsZWN0b3JcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cInFxLWRpYWxvZy1tZXNzYWdlLXNlbGVjdG9yXCI+PC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJxcS1kaWFsb2ctYnV0dG9uc1wiPlxyXG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicXEtY2FuY2VsLWJ1dHRvbi1zZWxlY3RvclwiIHRyYW5zbGF0ZT5ObzwvYnV0dG9uPlxyXG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicXEtb2stYnV0dG9uLXNlbGVjdG9yXCIgdHJhbnNsYXRlPlllczwvYnV0dG9uPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGlhbG9nPlxyXG5cclxuICAgIDxkaWFsb2cgY2xhc3M9XCJxcS1wcm9tcHQtZGlhbG9nLXNlbGVjdG9yXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJxcS1kaWFsb2ctbWVzc2FnZS1zZWxlY3RvclwiPjwvZGl2PlxyXG4gICAgICA8aW5wdXQgdHlwZT1cInRleHRcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cInFxLWRpYWxvZy1idXR0b25zXCI+XHJcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJxcS1jYW5jZWwtYnV0dG9uLXNlbGVjdG9yXCIgdHJhbnNsYXRlPkNhbmNlbDwvYnV0dG9uPlxyXG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicXEtb2stYnV0dG9uLXNlbGVjdG9yXCIgdHJhbnNsYXRlPk9rPC9idXR0b24+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaWFsb2c+XHJcbiAgPC9kaXY+XHJcbjwvZGl2PlxyXG5gLFxyXG4gIHN0eWxlczogW2AudXBsb2FkLWNvbnRlbnR7dGV4dC1hbGlnbjpjZW50ZXI7bWF4LWhlaWdodDoyNXZoO292ZXJmbG93OmF1dG87bWFyZ2luOjEwcHggYXV0b30uZmEtdGltZXM6YmVmb3Jle2NvbnRlbnQ6XCJcXFxcZjAwZFwifS5idXR0b25ze2JhY2tncm91bmQ6I2ZmZjtwYWRkaW5nOjVweDttYXJnaW46MTBweCAwfWAsIGAucXEtdXBsb2FkLWJ1dHRvbiBkaXZ7bGluZS1oZWlnaHQ6MjVweH0ucXEtdXBsb2FkLWJ1dHRvbi1mb2N1c3tvdXRsaW5lOjB9LnFxLXVwbG9hZGVye3Bvc2l0aW9uOnJlbGF0aXZlO21pbi1oZWlnaHQ6MjAwcHg7bWF4LWhlaWdodDo0OTBweDtvdmVyZmxvdy15OmhpZGRlbjt3aWR0aDppbmhlcml0O2JvcmRlci1yYWRpdXM6NnB4O2JhY2tncm91bmQtY29sb3I6I2ZkZmRmZDtib3JkZXI6MXB4IGRhc2hlZCAjY2NjO3BhZGRpbmc6MjBweH0ucXEtdXBsb2FkZXI6YmVmb3Jle2NvbnRlbnQ6YXR0cihxcS1kcm9wLWFyZWEtdGV4dCkgXCIgXCI7cG9zaXRpb246YWJzb2x1dGU7Zm9udC1zaXplOjIwMCU7bGVmdDowO3dpZHRoOjEwMCU7dGV4dC1hbGlnbjpjZW50ZXI7dG9wOjQ1JTtvcGFjaXR5Oi4yNX0ucXEtdXBsb2FkLWRyb3AtYXJlYSwucXEtdXBsb2FkLWV4dHJhLWRyb3AtYXJlYXtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MDtsZWZ0OjA7d2lkdGg6MTAwJTtoZWlnaHQ6MTAwJTttaW4taGVpZ2h0OjMwcHg7ei1pbmRleDoyO2JhY2tncm91bmQ6I2Y5ZjlmOTtib3JkZXItcmFkaXVzOjRweDtib3JkZXI6MXB4IGRhc2hlZCAjY2NjO3RleHQtYWxpZ246Y2VudGVyfS5xcS11cGxvYWQtZHJvcC1hcmVhIHNwYW57ZGlzcGxheTpibG9jaztwb3NpdGlvbjphYnNvbHV0ZTt0b3A6NTAlO3dpZHRoOjEwMCU7bWFyZ2luLXRvcDotOHB4O2ZvbnQtc2l6ZToxNnB4fS5xcS11cGxvYWQtZXh0cmEtZHJvcC1hcmVhe3Bvc2l0aW9uOnJlbGF0aXZlO21hcmdpbi10b3A6NTBweDtmb250LXNpemU6MTZweDtwYWRkaW5nLXRvcDozMHB4O2hlaWdodDoyMHB4O21pbi1oZWlnaHQ6NDBweH0ucXEtdXBsb2FkLWRyb3AtYXJlYS1hY3RpdmV7YmFja2dyb3VuZDojZmRmZGZkO2JvcmRlci1yYWRpdXM6NHB4O2JvcmRlcjoxcHggZGFzaGVkICNjY2N9LnFxLXVwbG9hZC1saXN0e21hcmdpbjowO3BhZGRpbmc6MDtsaXN0LXN0eWxlOm5vbmU7bWF4LWhlaWdodDo0NTBweDtvdmVyZmxvdy15OmF1dG87Y2xlYXI6Ym90aH0ucXEtdXBsb2FkLWxpc3QgbGl7bWFyZ2luOjA7cGFkZGluZzo5cHg7bGluZS1oZWlnaHQ6MTVweDtmb250LXNpemU6MTZweDtjb2xvcjojNDI0MjQyO2JhY2tncm91bmQtY29sb3I6I2Y2ZjZmNjtib3JkZXItdG9wOjFweCBzb2xpZCAjZmZmO2JvcmRlci1ib3R0b206MXB4IHNvbGlkICNkZGR9LnFxLXVwbG9hZC1saXN0IGxpOmZpcnN0LWNoaWxke2JvcmRlci10b3A6bm9uZX0ucXEtdXBsb2FkLWxpc3QgbGk6bGFzdC1jaGlsZHtib3JkZXItYm90dG9tOm5vbmV9LnFxLXVwbG9hZC1jYW5jZWwsLnFxLXVwbG9hZC1jb250aW51ZSwucXEtdXBsb2FkLWRlbGV0ZSwucXEtdXBsb2FkLWZhaWxlZC10ZXh0LC5xcS11cGxvYWQtZmlsZSwucXEtdXBsb2FkLXBhdXNlLC5xcS11cGxvYWQtcmV0cnksLnFxLXVwbG9hZC1zaXplLC5xcS11cGxvYWQtc3Bpbm5lcnttYXJnaW4tcmlnaHQ6MTJweDtkaXNwbGF5OmlubGluZX0ucXEtdXBsb2FkLWZpbGV7dmVydGljYWwtYWxpZ246bWlkZGxlO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3dpZHRoOjMwMHB4O3RleHQtb3ZlcmZsb3c6ZWxsaXBzaXM7d2hpdGUtc3BhY2U6bm93cmFwO292ZXJmbG93LXg6aGlkZGVuO2hlaWdodDoxOHB4fS5xcS11cGxvYWQtc3Bpbm5lcntkaXNwbGF5OmlubGluZS1ibG9jaztiYWNrZ3JvdW5kOnVybChsb2FkaW5nLmdpZik7d2lkdGg6MTVweDtoZWlnaHQ6MTVweDt2ZXJ0aWNhbC1hbGlnbjp0ZXh0LWJvdHRvbX0ucXEtZHJvcC1wcm9jZXNzaW5ne2Rpc3BsYXk6YmxvY2t9LnFxLWRyb3AtcHJvY2Vzc2luZy1zcGlubmVye2Rpc3BsYXk6aW5saW5lLWJsb2NrO2JhY2tncm91bmQ6dXJsKHByb2Nlc3NpbmcuZ2lmKTt3aWR0aDoyNHB4O2hlaWdodDoyNHB4O3ZlcnRpY2FsLWFsaWduOnRleHQtYm90dG9tfS5xcS11cGxvYWQtY2FuY2VsLC5xcS11cGxvYWQtY29udGludWUsLnFxLXVwbG9hZC1kZWxldGUsLnFxLXVwbG9hZC1wYXVzZSwucXEtdXBsb2FkLXJldHJ5LC5xcS11cGxvYWQtc2l6ZXtmb250LXNpemU6MTJweDtmb250LXdlaWdodDo0MDA7Y3Vyc29yOnBvaW50ZXI7dmVydGljYWwtYWxpZ246bWlkZGxlfS5xcS11cGxvYWQtc3RhdHVzLXRleHR7Zm9udC1zaXplOjE0cHg7Zm9udC13ZWlnaHQ6NzAwO2Rpc3BsYXk6YmxvY2t9LnFxLXVwbG9hZC1mYWlsZWQtdGV4dHtkaXNwbGF5Om5vbmU7Zm9udC1zdHlsZTppdGFsaWM7Zm9udC13ZWlnaHQ6NzAwfS5xcS11cGxvYWQtZmFpbGVkLWljb257ZGlzcGxheTpub25lO3dpZHRoOjE1cHg7aGVpZ2h0OjE1cHg7dmVydGljYWwtYWxpZ246dGV4dC1ib3R0b219LnFxLXVwbG9hZC1mYWlsIC5xcS11cGxvYWQtZmFpbGVkLXRleHQsLnFxLXVwbG9hZC1yZXRyeWluZyAucXEtdXBsb2FkLWZhaWxlZC10ZXh0e2Rpc3BsYXk6aW5saW5lfS5xcS11cGxvYWQtbGlzdCBsaS5xcS11cGxvYWQtc3VjY2Vzc3tiYWNrZ3JvdW5kLWNvbG9yOiNlYmY2ZTA7Y29sb3I6IzQyNDI0Mjtib3JkZXItYm90dG9tOjFweCBzb2xpZCAjZDNkZWQxO2JvcmRlci10b3A6MXB4IHNvbGlkICNmN2ZmZjV9LnFxLXVwbG9hZC1saXN0IGxpLnFxLXVwbG9hZC1mYWlse2JhY2tncm91bmQtY29sb3I6I2Y1ZDdkNztjb2xvcjojNDI0MjQyO2JvcmRlci1ib3R0b206MXB4IHNvbGlkICNkZWNhY2E7Ym9yZGVyLXRvcDoxcHggc29saWQgI2ZjZTZlNn0ucXEtdG90YWwtcHJvZ3Jlc3MtYmFye2hlaWdodDoyNXB4O2JvcmRlci1yYWRpdXM6OXB4fUlOUFVULnFxLWVkaXQtZmlsZW5hbWV7cG9zaXRpb246YWJzb2x1dGU7b3BhY2l0eTowO3otaW5kZXg6LTF9LnFxLXVwbG9hZC1maWxlLnFxLWVkaXRhYmxle2N1cnNvcjpwb2ludGVyO21hcmdpbi1yaWdodDo0cHh9LnFxLWVkaXQtZmlsZW5hbWUtaWNvbi5xcS1lZGl0YWJsZXtkaXNwbGF5OmlubGluZS1ibG9jaztjdXJzb3I6cG9pbnRlcn1JTlBVVC5xcS1lZGl0LWZpbGVuYW1lLnFxLWVkaXRpbmd7cG9zaXRpb246c3RhdGljO2hlaWdodDoyOHB4O3BhZGRpbmc6MCA4cHg7bWFyZ2luLXJpZ2h0OjEwcHg7bWFyZ2luLWJvdHRvbTotNXB4O2JvcmRlcjoxcHggc29saWQgI2NjYztib3JkZXItcmFkaXVzOjJweDtmb250LXNpemU6MTZweDtvcGFjaXR5OjF9LnFxLWVkaXQtZmlsZW5hbWUtaWNvbntkaXNwbGF5Om5vbmU7YmFja2dyb3VuZDp1cmwoZWRpdC5naWYpO3dpZHRoOjE1cHg7aGVpZ2h0OjE1cHg7dmVydGljYWwtYWxpZ246dGV4dC1ib3R0b207bWFyZ2luLXJpZ2h0OjE2cHh9LnFxLWhpZGV7ZGlzcGxheTpub25lfS5xcS10aHVtYm5haWwtc2VsZWN0b3J7dmVydGljYWwtYWxpZ246bWlkZGxlO21hcmdpbi1yaWdodDoxMnB4fS5xcS11cGxvYWRlciBESUFMT0d7ZGlzcGxheTpub25lfS5xcS11cGxvYWRlciBESUFMT0dbb3Blbl17ZGlzcGxheTpibG9ja30ucXEtdXBsb2FkZXIgRElBTE9HIC5xcS1kaWFsb2ctYnV0dG9uc3t0ZXh0LWFsaWduOmNlbnRlcjtwYWRkaW5nLXRvcDoxMHB4fS5xcS11cGxvYWRlciBESUFMT0cgLnFxLWRpYWxvZy1idXR0b25zIEJVVFRPTnttYXJnaW4tbGVmdDo1cHg7bWFyZ2luLXJpZ2h0OjVweH0ucXEtdXBsb2FkZXIgRElBTE9HIC5xcS1kaWFsb2ctbWVzc2FnZS1zZWxlY3RvcntwYWRkaW5nLWJvdHRvbToxMHB4fS5xcS11cGxvYWRlciBESUFMT0c6Oi13ZWJraXQtYmFja2Ryb3B7YmFja2dyb3VuZC1jb2xvcjpyZ2JhKDAsMCwwLC43KX0ucXEtdXBsb2FkZXIgRElBTE9HOjpiYWNrZHJvcHtiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMCwwLDAsLjcpfWBdLFxyXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcclxufSlcclxuZXhwb3J0IGNsYXNzIFVwbG9hZENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XHJcbiAgQElucHV0KCkgb3BlbkRpYWxvZztcclxuXHJcbiAgQE91dHB1dCgpIGNsb3NlRGlhbG9nID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIEBPdXRwdXQoKSBjcmVhdGVEaXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIHVwbG9hZGVyOiBGaW5lVXBsb2FkZXI7XHJcbiAgbmV3Rm9sZGVyID0gZmFsc2U7XHJcbiAgY291bnRlciA9IDA7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCxcclxuICAgICAgICAgICAgICBwcml2YXRlIG5vZGVTZXJ2aWNlOiBOb2RlU2VydmljZSkge1xyXG4gIH1cclxuXHJcbiAgbmdBZnRlclZpZXdJbml0KCkge1xyXG4gICAgdGhpcy51cGxvYWRlciA9IG5ldyBGaW5lVXBsb2FkZXIoe1xyXG4gICAgICBkZWJ1ZzogZmFsc2UsXHJcbiAgICAgIGF1dG9VcGxvYWQ6IGZhbHNlLFxyXG4gICAgICBtYXhDb25uZWN0aW9uczogMSwgLy8gdG9kbyBjb25maWd1cmFibGVcclxuICAgICAgZWxlbWVudDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmUtdXBsb2FkZXInKSxcclxuICAgICAgdGVtcGxhdGU6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5lLXVwbG9hZGVyLXRlbXBsYXRlJyksXHJcbiAgICAgIHJlcXVlc3Q6IHtcclxuICAgICAgICBlbmRwb2ludDogdGhpcy5ub2RlU2VydmljZS50cmVlLmNvbmZpZy5iYXNlVVJMICsgdGhpcy5ub2RlU2VydmljZS50cmVlLmNvbmZpZy5hcGkudXBsb2FkRmlsZSxcclxuICAgICAgICAvLyBmb3JjZU11bHRpcGFydDogZmFsc2UsXHJcbiAgICAgICAgcGFyYW1zSW5Cb2R5OiBmYWxzZSxcclxuICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgIHBhcmVudFBhdGg6IHRoaXMuZ2V0Q3VycmVudFBhdGhcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHJldHJ5OiB7XHJcbiAgICAgICAgZW5hYmxlQXV0bzogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAgY2FsbGJhY2tzOiB7XHJcbiAgICAgICAgb25TdWJtaXR0ZWQ6ICgpID0+IHRoaXMuY291bnRlcisrLFxyXG4gICAgICAgIG9uQ2FuY2VsOiAoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmNvdW50ZXIgPCAwID8gY29uc29sZS53YXJuKCd3dGY/JykgOiB0aGlzLmNvdW50ZXItLTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uQWxsQ29tcGxldGU6IChzdWNjOiBhbnksIGZhaWw6IGFueSkgPT4ge1xyXG4gICAgICAgICAgaWYgKHN1Y2MubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvdW50ZXIgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLm5vZGVTZXJ2aWNlLnJlZnJlc2hDdXJyZW50UGF0aCgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSlcclxuICAgIDtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gIH1cclxuXHJcbiAgZ2V0IGdldEN1cnJlbnRQYXRoKCkge1xyXG4gICAgY29uc3QgcGFyZW50UGF0aCA9IHRoaXMubm9kZVNlcnZpY2UuZmluZE5vZGVCeVBhdGgodGhpcy5ub2RlU2VydmljZS5jdXJyZW50UGF0aCkuaWQ7XHJcbiAgICByZXR1cm4gcGFyZW50UGF0aCA9PT0gMCA/ICcnIDogcGFyZW50UGF0aDtcclxuICB9XHJcblxyXG4gIHVwbG9hZEZpbGVzKCkge1xyXG4gICAgdGhpcy51cGxvYWRlci51cGxvYWRTdG9yZWRGaWxlcygpO1xyXG4gIH1cclxuXHJcbiAgY3JlYXRlTmV3Rm9sZGVyKGlucHV0Pzogc3RyaW5nKSB7XHJcbiAgICBpZiAoIXRoaXMubmV3Rm9sZGVyKSB7XHJcbiAgICAgIHRoaXMubmV3Rm9sZGVyID0gdHJ1ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMubmV3Rm9sZGVyID0gZmFsc2U7XHJcbiAgICAgIGlmIChpbnB1dC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVEaXIuZW1pdChpbnB1dCk7XHJcbiAgICAgICAgdGhpcy5uZXdDbGlja2VkQWN0aW9uKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5ld0NsaWNrZWRBY3Rpb24oKSB7XHJcbiAgICB0aGlzLnVwbG9hZGVyLmNhbmNlbEFsbCgpO1xyXG4gICAgdGhpcy5jbG9zZURpYWxvZy5lbWl0KCk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7Q29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIE9uSW5pdCwgT3V0cHV0LCBWaWV3Q2hpbGR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge199IGZyb20gJ0BiaWVzYmplcmcvbmd4LXRyYW5zbGF0ZS1leHRyYWN0L2Rpc3QvdXRpbHMvdXRpbHMnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtbmV3LWZvbGRlcicsXHJcbiAgdGVtcGxhdGU6IGA8cCBjbGFzcz1cIm5ldy1mb2xkZXItZGVzY3JpcHRpb25cIiB0cmFuc2xhdGU+VHlwZSBuZXcgZm9sZGVyIG5hbWU8L3A+XHJcbjxpbnB1dCAjdXBsb2FkRm9sZGVyIHBsYWNlaG9sZGVyPVwie3snRm9sZGVyIG5hbWUnIHwgdHJhbnNsYXRlfX1cIiAoa2V5dXApPVwib25JbnB1dENoYW5nZSgkZXZlbnQpXCJcclxuICAgICAgIChrZXl1cC5lbnRlcik9XCJvbkNsaWNrKClcIiBvbmNsaWNrPVwidGhpcy5zZWxlY3QoKTtcIiB0eXBlPVwidGV4dFwiIGNsYXNzPVwibmV3LWZvbGRlci1pbnB1dFwiLz5cclxuPGJ1dHRvbiBjbGFzcz1cImJ1dHRvbiBuZXctZm9sZGVyLXNlbmRcIiAoY2xpY2spPVwib25DbGljaygpXCI+e3tidXR0b25UZXh0IHwgdHJhbnNsYXRlfX08L2J1dHRvbj5cclxuYCxcclxuICBzdHlsZXM6IFtgLm5ldy1mb2xkZXItZGVzY3JpcHRpb257bWFyZ2luOjAgYXV0bztwYWRkaW5nOjB9YF1cclxufSlcclxuZXhwb3J0IGNsYXNzIE5ld0ZvbGRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgQFZpZXdDaGlsZCgndXBsb2FkRm9sZGVyJykgdXBsb2FkRm9sZGVyOiBFbGVtZW50UmVmO1xyXG4gIEBPdXRwdXQoKSBidXR0b25DbGlja2VkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBidXR0b25UZXh0ID0gXygnQ2xvc2UnKS50b1N0cmluZygpO1xyXG4gIGlucHV0VmFsdWUgPSAnJztcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICB9XHJcblxyXG4gIG9uQ2xpY2soKSB7XHJcbiAgICBjb25zdCBlbDogSFRNTEVsZW1lbnQgPSAodGhpcy51cGxvYWRGb2xkZXIubmF0aXZlRWxlbWVudCBhcyBIVE1MRWxlbWVudCk7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICB0aGlzLmJ1dHRvbkNsaWNrZWQuZW1pdChlbC52YWx1ZSk7XHJcbiAgfVxyXG5cclxuICBvbklucHV0Q2hhbmdlKGV2ZW50OiBhbnkpIHtcclxuICAgIHRoaXMuaW5wdXRWYWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgIGlmICh0aGlzLmlucHV0VmFsdWUubGVuZ3RoID4gMCkge1xyXG4gICAgICB0aGlzLmJ1dHRvblRleHQgPSBfKCdDb25maXJtJykudG9TdHJpbmcoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuYnV0dG9uVGV4dCA9IF8oJ0Nsb3NlJykudG9TdHJpbmcoKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0LCBUZW1wbGF0ZVJlZiwgVmlld0VuY2Fwc3VsYXRpb259IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge05vZGVJbnRlcmZhY2V9IGZyb20gJy4uLy4uL2ludGVyZmFjZXMvbm9kZS5pbnRlcmZhY2UnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhcHAtc2lkZS12aWV3JyxcclxuICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJzaWRlLXZpZXdcIiAqbmdJZj1cIm5vZGVcIj5cclxuICA8ZGl2IGNsYXNzPVwic2lkZS12aWV3LXByZXZpZXdcIj5cclxuICAgIDxpIChjbGljayk9XCJvbkNsaWNrKCRldmVudCwgJ2Nsb3NlU2lkZVZpZXcnKVwiIGNsYXNzPVwiZmFzIGZhLXRpbWVzIHNpZGUtdmlldy1jbG9zZVwiPjwvaT5cclxuXHJcbiAgICA8ZGl2IGNsYXNzPVwic2lkZS12aWV3LXByZXZpZXctdGl0bGVcIj57e25vZGUubmFtZX19PC9kaXY+XHJcblxyXG4gICAgPGRpdiBjbGFzcz1cInNpZGUtdmlldy1wcmV2aWV3LWNvbnRlbnRcIj5cclxuICAgICAgPG5nLWNvbnRhaW5lclxyXG4gICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7JGltcGxpY2l0OiBub2RlfVwiXHJcbiAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRdPVwic2lkZVZpZXdUZW1wbGF0ZVwiPlxyXG4gICAgICA8L25nLWNvbnRhaW5lcj5cclxuICAgIDwvZGl2PlxyXG5cclxuICAgIDxkaXYgY2xhc3M9XCJzaWRlLXZpZXctYnV0dG9uc1wiPlxyXG4gICAgICA8YnV0dG9uIChjbGljayk9XCJvbkNsaWNrKCRldmVudCwgJ2Rvd25sb2FkJylcIiBjbGFzcz1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgW2Rpc2FibGVkXT1cIiFhbGxvd0ZvbGRlckRvd25sb2FkICYmIG5vZGUuaXNGb2xkZXJcIiB0cmFuc2xhdGU+XHJcbiAgICAgICAgRG93bmxvYWRcclxuICAgICAgPC9idXR0b24+XHJcbiAgICAgIDxidXR0b24gKGNsaWNrKT1cIm9uQ2xpY2soJGV2ZW50LCAncmVuYW1lQ29uZmlybScpXCIgY2xhc3M9XCJidXR0b25cIiB0cmFuc2xhdGU+UmVuYW1lPC9idXR0b24+XHJcbiAgICAgIDxidXR0b24gKGNsaWNrKT1cIm9uQ2xpY2soJGV2ZW50LCAncmVtb3ZlQXNrJylcIiBjbGFzcz1cImJ1dHRvblwiIHRyYW5zbGF0ZT5EZWxldGU8L2J1dHRvbj5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG48L2Rpdj5cclxuYCxcclxuICBzdHlsZXM6IFtgLnNpZGUtdmlldy1jbG9zZXtwb3NpdGlvbjphYnNvbHV0ZTtjdXJzb3I6cG9pbnRlcjt0b3A6MDtyaWdodDowO3BhZGRpbmc6MTVweH0uc2lkZS12aWV3LWJ1dHRvbnN7d2lkdGg6MTAwJTtkaXNwbGF5Oi13ZWJraXQtZmxleDtkaXNwbGF5OmZsZXg7LXdlYmtpdC1qdXN0aWZ5LWNvbnRlbnQ6Y2VudGVyO2p1c3RpZnktY29udGVudDpjZW50ZXI7LXdlYmtpdC1mbGV4LWZsb3c6Y29sdW1uO2ZsZXgtZmxvdzpjb2x1bW59LnNpZGUtdmlldy1idXR0b25zIC5idXR0b257bWFyZ2luOjVweCAwfWBdLFxyXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcclxufSlcclxuZXhwb3J0IGNsYXNzIFNpZGVWaWV3Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBASW5wdXQoKSBzaWRlVmlld1RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICBASW5wdXQoKSBub2RlOiBOb2RlSW50ZXJmYWNlO1xyXG4gIEBJbnB1dCgpIGFsbG93Rm9sZGVyRG93bmxvYWQgPSBmYWxzZTtcclxuXHJcbiAgQE91dHB1dCgpIGNsaWNrRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgfVxyXG5cclxuICBvbkNsaWNrKGV2ZW50OiBhbnksIHR5cGU6IHN0cmluZykge1xyXG4gICAgdGhpcy5jbGlja0V2ZW50LmVtaXQoe3R5cGU6IHR5cGUsIGV2ZW50OiBldmVudCwgbm9kZTogdGhpcy5ub2RlfSk7XHJcbiAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQge0NvbXBvbmVudCwgT25Jbml0LCBWaWV3RW5jYXBzdWxhdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7Tm9kZUNsaWNrZWRTZXJ2aWNlfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9ub2RlLWNsaWNrZWQuc2VydmljZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FwcC1uYXZpZ2F0aW9uJyxcclxuICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJuYXZpZ2F0aW9uLWNvbXBvbmVudFwiPlxyXG4gIDxpbnB1dCAjaW5wdXQgY2xhc3M9XCJuYXZpZ2F0aW9uLXNlYXJjaFwiIG9uY2xpY2s9XCJ0aGlzLnNlbGVjdCgpO1wiIChrZXl1cC5lbnRlcik9XCJvbkNsaWNrKGlucHV0LnZhbHVlKVwiXHJcbiAgICAgICAgIHBsYWNlaG9sZGVyPVwie3snU2VhcmNoJyB8IHRyYW5zbGF0ZX19XCI+XHJcblxyXG4gIDxidXR0b24gW2Rpc2FibGVkXT1cImlucHV0LnZhbHVlLmxlbmd0aCA9PT0gMFwiIGNsYXNzPVwibmF2aWdhdGlvbi1zZWFyY2gtaWNvblwiIChjbGljayk9XCJvbkNsaWNrKGlucHV0LnZhbHVlKVwiPlxyXG4gICAgPGkgY2xhc3M9XCJmYXMgZmEtc2VhcmNoXCI+PC9pPlxyXG4gIDwvYnV0dG9uPlxyXG5cclxuICA8ZGl2PlxyXG4gICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxyXG4gIDwvZGl2PlxyXG48L2Rpdj5cclxuXHJcblxyXG5gLFxyXG4gIHN0eWxlczogW2AubmF2aWdhdGlvbi1jb21wb25lbnR7ZGlzcGxheTotd2Via2l0LWZsZXg7ZGlzcGxheTpmbGV4fWBdLFxyXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcclxufSlcclxuZXhwb3J0IGNsYXNzIE5hdmlnYXRpb25Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgbm9kZUNsaWNrZWRTZXJ2aWNlOiBOb2RlQ2xpY2tlZFNlcnZpY2VcclxuICApIHtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gIH1cclxuXHJcbiAgb25DbGljayhpbnB1dDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLm5vZGVDbGlja2VkU2VydmljZS5zZWFyY2hGb3JTdHJpbmcoaW5wdXQpO1xyXG4gIH1cclxufVxyXG4iLCIvLyBpbXBvcnQge01vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHtOZ01vZHVsZSwgSW5qZWN0aW9uVG9rZW4sIE1vZHVsZVdpdGhQcm92aWRlcnN9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHtGaWxlTWFuYWdlckNvbXBvbmVudH0gZnJvbSAnLi9maWxlLW1hbmFnZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHtGb2xkZXJDb250ZW50Q29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvZm9sZGVyLWNvbnRlbnQvZm9sZGVyLWNvbnRlbnQuY29tcG9uZW50JztcclxuaW1wb3J0IHtUcmVlQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvdHJlZS90cmVlLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7Tm9kZUxpc3RlckNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL3RyZWUvbm9kZS1saXN0ZXIvbm9kZS1saXN0ZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHtOb2RlQ29tcG9uZW50fSBmcm9tICcuL2NvbXBvbmVudHMvZnVuY3Rpb25zL25vZGUvbm9kZS5jb21wb25lbnQnO1xyXG5pbXBvcnQge01hcFRvSXRlcmFibGVQaXBlfSBmcm9tICcuL3BpcGVzL21hcC10by1pdGVyYWJsZS5waXBlJztcclxuaW1wb3J0IHtIdHRwQ2xpZW50LCBIdHRwQ2xpZW50TW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7U3RvcmVNb2R1bGUsIEFjdGlvblJlZHVjZXJNYXB9IGZyb20gJ0BuZ3J4L3N0b3JlJztcclxuaW1wb3J0IHtOYXZCYXJDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9uYXYtYmFyL25hdi1iYXIuY29tcG9uZW50JztcclxuaW1wb3J0IHtyZWR1Y2VycywgQXBwU3RvcmV9IGZyb20gJy4vcmVkdWNlcnMvcmVkdWNlci5mYWN0b3J5JztcclxuaW1wb3J0IHtMb2FkaW5nT3ZlcmxheUNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL2Z1bmN0aW9ucy9sb2FkaW5nLW92ZXJsYXkvbG9hZGluZy1vdmVybGF5LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7RmlsZVNpemVQaXBlfSBmcm9tICcuL3BpcGVzL2ZpbGUtc2l6ZS5waXBlJztcclxuaW1wb3J0IHtVcGxvYWRDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9mdW5jdGlvbnMvdXBsb2FkL3VwbG9hZC5jb21wb25lbnQnO1xyXG5pbXBvcnQge05ld0ZvbGRlckNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL2Z1bmN0aW9ucy91cGxvYWQvbmV3LWZvbGRlci9uZXctZm9sZGVyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7U2lkZVZpZXdDb21wb25lbnR9IGZyb20gJy4vY29tcG9uZW50cy9zaWRlLXZpZXcvc2lkZS12aWV3LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7TmF2aWdhdGlvbkNvbXBvbmVudH0gZnJvbSAnLi9jb21wb25lbnRzL25hdmlnYXRpb24vbmF2aWdhdGlvbi5jb21wb25lbnQnO1xyXG5pbXBvcnQge05neFNtYXJ0TW9kYWxNb2R1bGV9IGZyb20gJ25neC1zbWFydC1tb2RhbCc7XHJcbmltcG9ydCB7VHJhbnNsYXRlTG9hZGVyLCBUcmFuc2xhdGVNb2R1bGUsIFRyYW5zbGF0ZVNlcnZpY2V9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2NvcmUnO1xyXG5pbXBvcnQge1RyYW5zbGF0ZUh0dHBMb2FkZXJ9IGZyb20gJ0BuZ3gtdHJhbnNsYXRlL2h0dHAtbG9hZGVyJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUcmFuc2xhdGVMb2FkZXIoaHR0cDogSHR0cENsaWVudCkge1xyXG4gIHJldHVybiBuZXcgVHJhbnNsYXRlSHR0cExvYWRlcihodHRwLCAnLi9hc3NldHMvaTE4bi8nLCAnLmpzb24nKTtcclxufVxyXG5cclxuY29uc3QgRkVBVFVSRV9SRURVQ0VSX1RPS0VOID0gbmV3IEluamVjdGlvblRva2VuPFxyXG4gIEFjdGlvblJlZHVjZXJNYXA8QXBwU3RvcmU+XHJcbj4oJ0FwcFN0b3JlIFJlZHVjZXJzJyk7XHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRSZWR1Y2VycygpOiBBY3Rpb25SZWR1Y2VyTWFwPEFwcFN0b3JlPiB7XHJcbiAgLy8gbWFwIG9mIHJlZHVjZXJzXHJcbiAgcmV0dXJuIHJlZHVjZXJzO1xyXG59XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtcclxuICAgIEh0dHBDbGllbnRNb2R1bGUsXHJcbiAgICBTdG9yZU1vZHVsZS5mb3JSb290KEZFQVRVUkVfUkVEVUNFUl9UT0tFTiksXHJcbiAgICBDb21tb25Nb2R1bGUsXHJcbiAgICBOZ3hTbWFydE1vZGFsTW9kdWxlLmZvclJvb3QoKSxcclxuICAgIFRyYW5zbGF0ZU1vZHVsZS5mb3JSb290KHtcclxuICAgICAgbG9hZGVyOntcclxuICAgICAgICBwcm92aWRlOiBUcmFuc2xhdGVMb2FkZXIsXHJcbiAgICAgICAgdXNlRmFjdG9yeTogKGNyZWF0ZVRyYW5zbGF0ZUxvYWRlciksXHJcbiAgICAgICAgZGVwczogW0h0dHBDbGllbnRdfVxyXG4gICAgfSlcclxuICBdLFxyXG4gIGRlY2xhcmF0aW9uczogW1xyXG4gICAgRmlsZU1hbmFnZXJDb21wb25lbnQsXHJcbiAgICBGb2xkZXJDb250ZW50Q29tcG9uZW50LFxyXG4gICAgTm9kZUNvbXBvbmVudCxcclxuICAgIFRyZWVDb21wb25lbnQsXHJcbiAgICBOb2RlTGlzdGVyQ29tcG9uZW50LFxyXG4gICAgTWFwVG9JdGVyYWJsZVBpcGUsXHJcbiAgICBOYXZCYXJDb21wb25lbnQsXHJcbiAgICBMb2FkaW5nT3ZlcmxheUNvbXBvbmVudCxcclxuICAgIEZpbGVTaXplUGlwZSxcclxuICAgIFVwbG9hZENvbXBvbmVudCxcclxuICAgIE5ld0ZvbGRlckNvbXBvbmVudCxcclxuICAgIFNpZGVWaWV3Q29tcG9uZW50LFxyXG4gICAgTmF2aWdhdGlvbkNvbXBvbmVudFxyXG4gIF0sXHJcbiAgZXhwb3J0czogW1xyXG4gICAgRmlsZU1hbmFnZXJDb21wb25lbnQsXHJcbiAgICBMb2FkaW5nT3ZlcmxheUNvbXBvbmVudCxcclxuICAgIFNpZGVWaWV3Q29tcG9uZW50XHJcbiAgXSxcclxuICBwcm92aWRlcnM6IFtcclxuICAgIHtcclxuICAgICAgcHJvdmlkZTogRkVBVFVSRV9SRURVQ0VSX1RPS0VOLFxyXG4gICAgICB1c2VGYWN0b3J5OiBnZXRSZWR1Y2VycyxcclxuICAgIH0sXHJcbiAgXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgRmlsZU1hbmFnZXJNb2R1bGUge1xyXG4gIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbmdNb2R1bGU6IEZpbGVNYW5hZ2VyTW9kdWxlLFxyXG4gICAgICBwcm92aWRlcnM6IFtUcmFuc2xhdGVTZXJ2aWNlXVxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIl0sIm5hbWVzIjpbIkFDVElPTlMuU0VUX1BBVEgiLCJBQ1RJT05TLlNFVF9MT0FESU5HX1NUQVRFIiwiQUNUSU9OUy5TRVRfU0VMRUNURURfTk9ERSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHQTtJQU1FLG1CQUFZLE1BQXVCOztRQUVqQyxJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUVyQixJQUFJLENBQUMsS0FBSyxzQkFBa0I7WUFDMUIsRUFBRSxFQUFFLENBQUM7WUFDTCxVQUFVLEVBQUUsRUFBRTtZQUNkLFlBQVksRUFBRSxJQUFJO1lBQ2xCLFFBQVEsRUFBRSxJQUFJO1lBQ2QsVUFBVSxFQUFFLElBQUk7WUFDaEIsUUFBUSxFQUFFLElBQUk7WUFDZCxJQUFJLEVBQUUsTUFBTTtZQUNaLFFBQVEsRUFBRSxFQUFFO1NBQ2IsRUFBQSxDQUFDO0tBQ0g7SUFFRCxzQkFBSSxrQ0FBVzs7OztRQUFmO1lBQ0UsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO1NBQzFCOzs7OztRQUVELFVBQWdCLEtBQWE7WUFDM0IsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7U0FDM0I7OztPQUpBO0lBTUQsc0JBQUksNEJBQUs7Ozs7UUFBVDtZQUNFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztTQUNwQjs7Ozs7UUFFRCxVQUFVLEtBQW9CO1lBQzVCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1NBQ3JCOzs7T0FKQTtJQU1ELHNCQUFJLHFDQUFjOzs7O1FBQWxCO1lBQ0UsT0FBTyxJ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